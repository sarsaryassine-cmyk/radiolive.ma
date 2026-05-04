#!/usr/bin/env node
/**
 * apply-stations.mjs
 *
 * Propage `data/stations-source.json` → `public/radios.json` (catalogue runtime).
 *  - Nettoie : strip MA:-/MRC:- prefixes, normalise casse, vire scories arabe-only sans alias
 *  - Renomme : 6 stations arabe-only via REWRITE_MAP (slugs latins)
 *  - Supprime : doublons confirmés (REMOVE_SLUGS)
 *  - Trie : par popularity_rank (ascendant), puis alpha pour le reste
 *  - Ajoute : `popularity_rank` dans le format de sortie
 *  - Replace les icônes par celles téléchargées dans /public/logos/<slug>.<ext>
 *
 * Idempotent : peut être relancé après `npm run sync:stations` sans casse.
 *
 * Bump aussi `SCHEMA_VERSION` dans `src/services/radioService.js` pour
 * invalider le cache localStorage des utilisateurs déjà visiteurs.
 *
 * Usage : npm run apply:stations
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE = resolve(ROOT, 'data/stations-source.json');
const RADIOS_JSON = resolve(ROOT, 'public/radios.json');
const LOGOS_DIR = resolve(ROOT, 'public/logos');
const ICONS_DIR = resolve(ROOT, 'public/icons');
const RADIO_SERVICE = resolve(ROOT, 'src/services/radioService.js');

/* ─── Cleanup configuration ────────────────────────────────────────── */

/**
 * Slugs (avant cleanup MA:-/MRC:- + recompute) à supprimer (doublons Q1).
 * Match contre `s.slug` source brut, pas contre le slug post-cleanup.
 */
const REMOVE_SOURCE_SLUGS = new Set([
  'ma-hit-radio-maroc',          // doublon de hit-radio
  'ma-radio-sawt-alamal',        // doublon de mrc-sawt-al-amal
  'r-e300baf5',                  // Salaf Way FM (Libye, hors scope MA)
  'mrc-sawt-al-amal',            // doublon de Radio Sawt Alamal (manual)
  'bldi',                        // station "Bldi" — supprimée à la demande
]);

/**
 * Slugs (après cleanup) qu'on supprime aussi en double-check au cas où
 * Radio Browser changerait ses préfixes ou ajouterait des variantes.
 */
const REMOVE_FINAL_SLUGS = new Set([
  'hit-radio-maroc',             // si l'entrée arrive avec un nom déjà nettoyé
  'radio-sawt-alamal',
  'salaf-way-fm',                // Salaf Way FM — supprimée
  'sawt-al-amal',                // doublon de Radio Sawt Alamal
  'bldi',                        // supprimée à la demande
]);

/**
 * Renaming des stations arabe-only (Q2.b) — clé = stream URL, valeur = nouveau nom latin.
 * Le slug sera recalculé depuis le name proprement.
 */
const REWRITE_BY_STREAM = {
  'https://backup.qurango.net/radio/maher':                  { name: 'Maher Al Muaiqly' },
  'http://stream.radiojar.com/0tpy1h0kxtzuv':                { name: 'Quran Karim Radio' },
  'https://qurango.net/radio/mohammed_ayyub':                { name: 'Mohammed Ayyub' },
  'https://qurango.net/radio/tafseer':                       { name: 'Tafseer Ibn Othaymeen' },
  'https://qurango.net/radio/mukhtasartafsir':               { name: 'Mukhtasar Tafseer' },
};

/**
 * Strip les préfixes "MA:-" et "MRC:-" sur les noms importés depuis
 * Radio Browser (artefacts de leur API).
 */
const stripApiPrefix = (name) =>
  String(name || '').replace(/^(MA|MRC):-\s*/i, '').trim();

/**
 * Renommage manuel pour les marques avec orthographe spécifique
 * que la simple normalisation de casse ne peut pas produire.
 * Appliqué APRÈS strip prefix + AVANT title-case auto.
 */
const BRAND_RENAME = {
  // forme nettoyée minuscule → forme finale exacte
  'medradio':       'Med Radio',
  'medinafm':       'Medina FM',
  'mfm':            'MFM',
  'medi 1 dj':      'Medi 1 DJ',
  'medi 1 tarab':   'Medi 1 Tarab',
  'medi 1 classique': 'Medi 1 Classique',
  'medi 1 radio andalouse': 'Medi 1 Radio Andalouse',
  'qoran radio':    'Qoran Radio',
  'al quran radio': 'Al Quran Radio',
};

const ACRONYMS = new Set(['fm', 'am', 'hd', 'tv', 'dj', 'mc', 'mfm', 'rfi', 'bbc', 'snrt', 'rtm']);

/**
 * Normalisation de casse : tout en MAJUSCULES → Title Case fluide.
 * "HIT RADIO" → "Hit Radio", "achkid fm" → "Achkid FM", "al quran radio" → "Al Quran Radio"
 *
 * Applique title case mot par mot SAUF acronymes (FM, AM, HD…). Ne respecte
 * PAS la casse mixte existante car beaucoup d'entrées ont une casse hasardeuse
 * (ex. "Al quran radio") qu'on veut normaliser.
 */
const normalizeCase = (name) => {
  const s = String(name || '').trim();
  if (!s) return s;

  // Match prioritaire : marque connue → forme officielle
  const lower = s.toLowerCase();
  if (BRAND_RENAME[lower]) return BRAND_RENAME[lower];

  // Title case mot par mot, en préservant les acronymes
  return s
    .split(/\s+/)
    .map((w) => {
      const wl = w.toLowerCase();
      if (ACRONYMS.has(wl)) return w.toUpperCase();
      // Numérique pur (ex. "1", "2M") on garde tel quel
      if (/^\d/.test(w)) return w;
      if (/^[a-z][a-z'-]*$/i.test(w)) return wl[0].toUpperCase() + wl.slice(1);
      return w;
    })
    .join(' ');
};

/**
 * Classement de popularité au Maroc (Médiamétrie / Radioscope 2024-2025).
 * Clé = slug normalisé, valeur = rang (1-25). Les autres → 999 (alpha fallback).
 */
const POPULARITY_RANK = {
  'radio-mars':             1, // override demandé : Radio Mars en tête
  'hit-radio':              2,
  'medi-1-radio':           3,
  'mfm':                    4,
  'aswat-fm':               5,
  'med-radio':              6, // ex-MEDRADIO renommé via BRAND_RENAME
  'chada-fm':               7,
  'atlantic-radio':         8,
  'radio-2m':               9,
  'cap-radio':             10,
  // 11 Hit Radio Mgharba — pas une station distincte, ignorer
  'mfm-saghir':            12, // placeholder, pas encore de stream
  'luxe-radio':            13, // placeholder
  'radio-plus-agadir':     14,
  'marrakech-plus':        15,
  'qoran-radio':           16, // = Radio Coran (Mohammed VI)
  'radio-idaa-al-watania': 17, // placeholder
  'al-amazighia':          18, // placeholder
  'adwaa-fm':              19,
  'radio-assadisa-fm':     20, // placeholder
  'medina-fm':             21, // ex-MEDINAFM renommé via BRAND_RENAME
  'radio-sawa-maroc':      22, // placeholder
  'radio-tanger':          23, // placeholder
  // 24 Radio Plus — déjà couvert par radio-plus-agadir
  'radio-yabiladi':        25,
};

/**
 * Stations du classement spec absentes de Radio Browser API (Q7).
 * Ajoutées avec stream_url null → seront filtrées par apply-stations
 * (qui skip les entrées sans stream) MAIS leur popularity_rank sera
 * réservé pour quand l'utilisateur fournira les URLs.
 *
 * Status: PENDING — ces entrées attendent leur stream URL.
 */
const MISSING_FROM_API = [
  { slug: 'mfm-saghir',            name: 'MFM Saghir',                _pending: true, popularity_rank: 12 },
  { slug: 'luxe-radio',            name: 'Luxe Radio',                _pending: true, popularity_rank: 13 },
  { slug: 'radio-idaa-al-watania', name: 'Radio Idaa Al Watania',     _pending: true, popularity_rank: 17 },
  { slug: 'al-amazighia',          name: 'Al Amazighia',              _pending: true, popularity_rank: 18 },
  { slug: 'radio-assadisa-fm',     name: 'Radio Assadisa FM',         _pending: true, popularity_rank: 20 },
  { slug: 'radio-sawa-maroc',      name: 'Radio Sawa Maroc',          _pending: true, popularity_rank: 22 },
  { slug: 'radio-tanger',          name: 'Radio Tanger',              _pending: true, popularity_rank: 23 },
];

/* ─── Helpers ──────────────────────────────────────────────────────── */

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normForMatch = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

const trimPunctuation = (s) =>
  String(s || '')
    .replace(/^[\s.\-_]+/, '')
    .replace(/[\s.\-_]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

const isValidIcon = (u) => {
  if (!u || typeof u !== 'string') return false;
  const v = u.trim();
  if (!v || v === 'null' || v === 'undefined') return false;
  if (v.startsWith('/')) return true;
  if (!/^https?:\/\//i.test(v)) return false;
  if (/facebook\.com|fbid=|fbsbx\.com/i.test(v)) return false;
  return true;
};

const normalizeStream = (u) =>
  String(u || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\?.*$/, '')
    .replace(/\/$/, '')
    .toLowerCase();

async function findIconPath(slug, currentName, logosFiles, iconsFiles) {
  const logoMatch = logosFiles.find((f) =>
    f.toLowerCase().startsWith(slug.toLowerCase() + '.')
  );
  if (logoMatch) return '/logos/' + encodeURIComponent(logoMatch);

  const targetNorm = normForMatch(currentName || '');
  if (targetNorm) {
    for (const f of iconsFiles) {
      const fnameNoExt = f.replace(/\.[^.]+$/, '');
      if (normForMatch(fnameNoExt) === targetNorm) {
        return '/icons/' + encodeURIComponent(f);
      }
    }
  }
  return null;
}

async function bumpSchemaVersion() {
  if (!existsSync(RADIO_SERVICE)) return;
  let src = await readFile(RADIO_SERVICE, 'utf8');
  const m = src.match(/const SCHEMA_VERSION = (\d+);/);
  if (!m) return;
  const cur = parseInt(m[1], 10);
  const next = cur + 1;
  src = src.replace(/const SCHEMA_VERSION = \d+;/, `const SCHEMA_VERSION = ${next};`);
  await writeFile(RADIO_SERVICE, src);
  console.log(`[apply-stations] bumped SCHEMA_VERSION ${cur} → ${next}`);
}

/* ─── Main ─────────────────────────────────────────────────────────── */

async function main() {
  if (!existsSync(SOURCE)) {
    console.error('[apply-stations] data/stations-source.json missing — run `npm run sync:stations` first');
    process.exit(1);
  }

  const source = JSON.parse(await readFile(SOURCE, 'utf8'));
  const stations = source.stations || [];

  let existing = [];
  if (existsSync(RADIOS_JSON)) {
    existing = JSON.parse(await readFile(RADIOS_JSON, 'utf8'));
  }
  const existingBySlug = new Map(existing.map((r) => [slugify(r.name), r]));

  const logosFiles = existsSync(LOGOS_DIR) ? await readdir(LOGOS_DIR) : [];
  const iconsFiles = existsSync(ICONS_DIR) ? await readdir(ICONS_DIR) : [];

  const out = [];
  const seenStreams = new Set();
  let added = 0, updatedIcon = 0, preservedIcon = 0, removed = 0, renamed = 0, skipped = 0;

  for (const s of stations) {
    if (!s.stream_url) { skipped++; continue; }

    // Étape 0 (early skip) : doublon confirmé sur le slug source ?
    if (s.slug && REMOVE_SOURCE_SLUGS.has(s.slug)) { removed++; continue; }

    // Étape 1 : appliquer le rewrite arabe-only (Q2.b) si stream URL match
    let rawName = s.names?.fr || s.names?.ar || '';
    const rewrite = REWRITE_BY_STREAM[s.stream_url];
    if (rewrite) {
      rawName = rewrite.name;
      renamed++;
    }

    // Étape 2 : strip préfixes MA:-/MRC:- (Q5.a)
    rawName = stripApiPrefix(rawName);

    // Étape 3 : trim ponctuation parasites + normalise casse (Q6)
    rawName = normalizeCase(trimPunctuation(rawName));

    if (!rawName || rawName.length < 2) { skipped++; continue; }

    // Étape 4 : recalculer le slug depuis le nom propre
    const slug = slugify(rawName);
    if (!slug) { skipped++; continue; }

    // Étape 5 : double-check sur le slug post-cleanup
    if (REMOVE_FINAL_SLUGS.has(slug)) { removed++; continue; }

    // Étape 6 : on utilise TOUJOURS le nom fraîchement nettoyé (Q6 = normalise
    // toutes les casses incohérentes). Si tu veux préserver un override manuel
    // spécifique, ajoute-le dans REWRITE_BY_STREAM ci-dessus.
    const existingEntry = existingBySlug.get(slug);
    const name = rawName;

    // Étape 7 : dedup par stream URL normalisée (Abdul Basit / Abdulbasit etc.)
    const streamKey = normalizeStream(s.stream_url);
    if (seenStreams.has(streamKey)) { skipped++; continue; }
    seenStreams.add(streamKey);

    // Étape 8 : résolution icône
    let icon = await findIconPath(slug, name, logosFiles, iconsFiles);
    if (!icon && existingEntry?.icon && isValidIcon(existingEntry.icon)) {
      icon = existingEntry.icon;
    }
    if (!icon && isValidIcon(s.logo_external)) {
      icon = s.logo_external;
    }
    if (!isValidIcon(icon)) icon = null;

    if (existingEntry) {
      if (existingEntry.icon && icon && icon !== existingEntry.icon) updatedIcon++;
      else if (icon === existingEntry.icon) preservedIcon++;
    } else {
      added++;
    }

    out.push({
      name,
      stream: s.stream_url,
      icon,
      popularity_rank: POPULARITY_RANK[slug] ?? 999,
    });
  }

  // Étape 9 : ajouter les stations manquantes du classement spec (Q7)
  // Note : pas de stream → elles sont ajoutées dans stations-source.json mais
  // skippées dans radios.json (le runtime n'affichera pas une station sans flux).
  // L'utilisateur fournira les URLs plus tard pour les activer.

  // Tri : popularity_rank ascendant, puis alpha
  out.sort((a, b) => {
    const r = (a.popularity_rank ?? 999) - (b.popularity_rank ?? 999);
    if (r !== 0) return r;
    return a.name.localeCompare(b.name, 'fr');
  });

  await writeFile(RADIOS_JSON, JSON.stringify(out, null, 2) + '\n');
  console.log(`[apply-stations] ✓ wrote ${out.length} stations to public/radios.json`);
  console.log(`[apply-stations]   added=${added}, renamed=${renamed}, removed=${removed}, updatedIcon=${updatedIcon}, preservedIcon=${preservedIcon}, skipped=${skipped}`);
  console.log(`[apply-stations]   pending=${MISSING_FROM_API.length} (in MISSING_FROM_API, awaiting stream URLs)`);

  await bumpSchemaVersion();
  console.log('[apply-stations] done — restart `npm run dev` and hard-refresh (Ctrl+Shift+R) to invalidate cache.');
}

main().catch((err) => {
  console.error('[apply-stations] fatal:', err);
  process.exit(1);
});
