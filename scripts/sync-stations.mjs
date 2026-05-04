#!/usr/bin/env node
/**
 * sync-stations.mjs
 *
 * Sync depuis l'API publique Radio Browser (https://www.radio-browser.info/)
 * vers `data/stations-source.json`. Enrichit les entrées existantes sans
 * écraser les overrides manuels (logos custom, descriptions, slugs, names).
 *
 * Usage :
 *   npm run sync:stations
 *
 * Idempotent : peut être relancé X fois sans dupliquer ni casser.
 *
 * Source de vérité :
 *   - public/radios.json     → catalogue runtime (minimal : name, stream, icon)
 *   - data/stations-source.json → catalogue enrichi (tous les champs API + métadonnées)
 *
 * Le script ne touche PAS public/radios.json (le runtime). Il maintient la
 * version enrichie en parallèle, que d'autres outils (Worker now-playing,
 * pages /now/) peuvent consommer.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TARGET = resolve(ROOT, 'data/stations-source.json');
const RADIOS_JSON = resolve(ROOT, 'public/radios.json');

// API mirrors Radio Browser — on essaye plusieurs endpoints en cas de DNS lent
const ENDPOINTS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://fr1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
];

/** Slugify identique à src/hooks/useCatalog.js pour cohérence */
const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Normalise un nom pour fuzzy matching (espaces, casse, accents éliminés) */
const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

async function fetchFromMirror(path) {
  let lastErr;
  for (const base of ENDPOINTS) {
    try {
      const r = await fetch(`${base}${path}`, {
        headers: {
          'User-Agent': 'radiolive.ma sync-stations/1.0',
          Accept: 'application/json',
        },
      });
      if (r.ok) return await r.json();
      lastErr = new Error(`${base}${path} → HTTP ${r.status}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('all radio-browser mirrors failed');
}

/**
 * Lit l'override existant (data/stations-source.json) si présent.
 * Returns { byUuid, bySlug, byNameNorm, list }.
 */
async function loadExisting() {
  if (!existsSync(TARGET)) {
    return { byUuid: new Map(), bySlug: new Map(), byNameNorm: new Map(), list: [] };
  }
  try {
    const raw = JSON.parse(await readFile(TARGET, 'utf8'));
    const list = raw.stations || [];
    const byUuid = new Map();
    const bySlug = new Map();
    const byNameNorm = new Map();
    for (const s of list) {
      if (s.stationuuid) byUuid.set(s.stationuuid, s);
      if (s.slug) bySlug.set(s.slug, s);
      const n = s.names?.fr || s.names?.ar || '';
      if (n) byNameNorm.set(norm(n), s);
    }
    return { byUuid, bySlug, byNameNorm, list };
  } catch {
    return { byUuid: new Map(), bySlug: new Map(), byNameNorm: new Map(), list: [] };
  }
}

/**
 * Lit le catalogue runtime existant pour récupérer les entrées qu'on doit
 * conserver même si Radio Browser ne les retourne pas (radios manuelles).
 */
async function loadRuntime() {
  if (!existsSync(RADIOS_JSON)) return [];
  try {
    return JSON.parse(await readFile(RADIOS_JSON, 'utf8'));
  } catch {
    return [];
  }
}

/**
 * Merge une entrée Radio Browser dans la liste enrichie existante.
 * Préserve les overrides manuels (champs présents dans `_manual_overrides`).
 */
function mergeEntry(rb, existing) {
  const overrides = new Set(existing?._manual_overrides || []);
  const keep = (field, current) => (overrides.has(field) ? current : undefined);

  // Si le nom est en script non-latin (arabe pur), slugify retourne "" — on
  // tombe sur stationuuid comme fallback pour garantir une URL utilisable.
  const slug = existing?.slug || slugify(rb.name) || `r-${rb.stationuuid?.slice(0, 8) || 'x'}`;
  const codec = (rb.codec || '').toUpperCase() || existing?.stream_codec;
  const bitrate = parseInt(rb.bitrate, 10) || existing?.bitrate;
  const lat = parseFloat(rb.geo_lat);
  const lng = parseFloat(rb.geo_long);

  return {
    slug,
    names: {
      fr: keep('names.fr', existing?.names?.fr) ?? existing?.names?.fr ?? rb.name,
      ar: keep('names.ar', existing?.names?.ar) ?? existing?.names?.ar ?? rb.name,
    },
    stream_url: keep('stream_url', existing?.stream_url) ?? (rb.url_resolved || rb.url || existing?.stream_url || null),
    stream_codec: codec,
    bitrate,
    logo_url: keep('logo_url', existing?.logo_url) ?? existing?.logo_url ?? null,
    logo_external: rb.favicon || existing?.logo_external || null,
    tags: rb.tags ? rb.tags.split(',').map((t) => t.trim()).filter(Boolean) : existing?.tags || [],
    language: rb.language ? rb.language.split(',').map((l) => l.trim()).filter(Boolean) : existing?.language || [],
    homepage: keep('homepage', existing?.homepage) ?? (rb.homepage || existing?.homepage || null),
    frequencies: keep('frequencies', existing?.frequencies) ?? (existing?.frequencies || {}),
    stationuuid: rb.stationuuid || existing?.stationuuid || null,
    geo:
      Number.isFinite(lat) && Number.isFinite(lng)
        ? { lat, lng }
        : existing?.geo || null,
    _source: 'radio-browser',
    _last_synced: new Date().toISOString(),
    _manual_overrides: existing?._manual_overrides || [],
  };
}

/** Convertit une entrée minimale runtime (radios.json) en stations-source. */
function entryFromRuntime(r) {
  return {
    slug: slugify(r.name),
    names: { fr: r.name, ar: r.name },
    stream_url: r.stream,
    stream_codec: null,
    bitrate: null,
    logo_url: r.icon || null,
    logo_external: null,
    tags: [],
    language: [],
    homepage: null,
    frequencies: {},
    stationuuid: null,
    geo: null,
    _source: 'manual',
    _last_synced: new Date().toISOString(),
    _manual_overrides: r.icon ? ['logo_url'] : [],
  };
}

async function main() {
  console.log('[sync-stations] fetching Morocco stations from Radio Browser…');
  const rbStations = await fetchFromMirror('/json/stations/bycountrycodeexact/MA?hidebroken=true&limit=500');
  console.log(`[sync-stations] received ${rbStations.length} stations from API`);

  const { byUuid, bySlug, byNameNorm, list: existingList } = await loadExisting();
  const runtime = await loadRuntime();
  console.log(`[sync-stations] existing enriched: ${existingList.length}, runtime catalog: ${runtime.length}`);

  const merged = new Map(); // slug → entry
  let added = 0;
  let updated = 0;
  let preserved = 0;

  // 1. Pour chaque entrée Radio Browser, fuzzy-match et merge
  for (const rb of rbStations) {
    if (!rb.name || !(rb.url_resolved || rb.url)) continue;

    let existing = null;
    if (rb.stationuuid && byUuid.has(rb.stationuuid)) {
      existing = byUuid.get(rb.stationuuid);
    } else {
      const n = norm(rb.name);
      if (byNameNorm.has(n)) {
        existing = byNameNorm.get(n);
      }
    }

    const entry = mergeEntry(rb, existing);
    if (existing) updated++;
    else added++;
    merged.set(entry.slug, entry);
  }

  // 2. Conserver les entrées manuelles non couvertes par l'API (radios qu'on a
  //    ajoutées manuellement et que Radio Browser ne référence pas).
  for (const r of runtime) {
    const slug = slugify(r.name);
    if (merged.has(slug)) continue;

    const existing = bySlug.get(slug) || byNameNorm.get(norm(r.name));
    if (existing) {
      merged.set(slug, { ...existing, _last_synced: new Date().toISOString() });
    } else {
      merged.set(slug, entryFromRuntime(r));
    }
    preserved++;
  }

  // 3. Conserver également les entrées enrichies existantes qui ne sont plus
  //    dans l'API mais qu'on a customisées manuellement (avec overrides).
  for (const e of existingList) {
    if (merged.has(e.slug)) continue;
    if (e._manual_overrides?.length) {
      merged.set(e.slug, e);
      preserved++;
    }
  }

  const stations = Array.from(merged.values()).sort((a, b) => a.slug.localeCompare(b.slug));

  const out = {
    stations,
    _meta: {
      synced_at: new Date().toISOString(),
      total: stations.length,
      added,
      updated,
      preserved,
      source: 'Radio Browser API + manual',
    },
  };

  await mkdir(dirname(TARGET), { recursive: true });
  await writeFile(TARGET, JSON.stringify(out, null, 2) + '\n');

  console.log('[sync-stations] ✓ written to', TARGET);
  console.log(`[sync-stations] total=${stations.length} (added=${added}, updated=${updated}, preserved=${preserved})`);
}

main().catch((err) => {
  console.error('[sync-stations] fatal:', err);
  process.exit(1);
});
