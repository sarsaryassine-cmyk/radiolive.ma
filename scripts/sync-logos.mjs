#!/usr/bin/env node
/**
 * sync-logos.mjs
 *
 * Pour chaque station de data/stations-source.json :
 *  - Si le logo est déjà en local (`/public/logos/<slug>.{png,jpg,webp,svg,ico}`),
 *    on ne touche à rien.
 *  - Sinon, télécharge `logo_external` (favicon Radio Browser) dans
 *    `/public/logos/<slug>.<ext>`.
 *  - Si la stack le permet, génère aussi une version WebP optimisée.
 *
 * NE TOUCHE PAS aux logos déjà présents en local.
 *
 * Usage : npm run sync:logos
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE = resolve(ROOT, 'data/stations-source.json');
const LOGOS_DIR = resolve(ROOT, 'public/logos');

const ALLOWED_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.gif']);

/**
 * Vérifie si un logo existe déjà pour ce slug, peu importe l'extension.
 * Returns { found: bool, path: string | null, ext: string | null }.
 */
async function findExistingLogo(slug) {
  if (!existsSync(LOGOS_DIR)) return { found: false, path: null, ext: null };
  const files = await readdir(LOGOS_DIR);
  const match = files.find((f) => f.toLowerCase().startsWith(slug.toLowerCase() + '.'));
  if (!match) return { found: false, path: null, ext: null };
  return { found: true, path: resolve(LOGOS_DIR, match), ext: extname(match).toLowerCase() };
}

async function downloadLogo(url, slug) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'radiolive.ma sync-logos/1.0' },
      redirect: 'follow',
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const ct = (r.headers.get('content-type') || '').toLowerCase();
    let ext = '.png';
    if (ct.includes('jpeg') || ct.includes('jpg')) ext = '.jpg';
    else if (ct.includes('png')) ext = '.png';
    else if (ct.includes('webp')) ext = '.webp';
    else if (ct.includes('svg')) ext = '.svg';
    else if (ct.includes('icon') || ct.includes('ico')) ext = '.ico';
    else if (ct.includes('gif')) ext = '.gif';

    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.byteLength < 200) throw new Error('logo too small (likely 1x1 placeholder)');

    const target = resolve(LOGOS_DIR, `${slug}${ext}`);
    await writeFile(target, buf);
    return { ok: true, path: target, ext, size: buf.byteLength };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  if (!existsSync(SOURCE)) {
    console.error('[sync-logos] data/stations-source.json missing — run `npm run sync:stations` first');
    process.exit(1);
  }

  const raw = JSON.parse(await readFile(SOURCE, 'utf8'));
  const stations = raw.stations || [];
  console.log(`[sync-logos] processing ${stations.length} stations`);

  await mkdir(LOGOS_DIR, { recursive: true });

  let downloaded = 0;
  let preserved = 0;
  let skipped = 0;
  let failed = 0;

  for (const s of stations) {
    if (!s.slug) continue;

    // Si un override manuel `logo_url` est positionné sur cette entrée, on
    // garde le logo existant. Sinon on télécharge depuis logo_external.
    const overrides = new Set(s._manual_overrides || []);
    const hasManualLogo = overrides.has('logo_url') && s.logo_url;

    const existing = await findExistingLogo(s.slug);
    if (existing.found) {
      preserved++;
      continue;
    }

    if (hasManualLogo) {
      // Logo URL manuel pointe vers /icons/... — on ne télécharge pas, c'est
      // déjà géré par RadioIcon.jsx qui résout via la chaîne d'icônes.
      preserved++;
      continue;
    }

    if (!s.logo_external) {
      skipped++;
      continue;
    }

    const result = await downloadLogo(s.logo_external, s.slug);
    if (result.ok) {
      downloaded++;
      console.log(`[sync-logos] ✓ ${s.slug}${result.ext} (${(result.size / 1024).toFixed(1)} KB)`);
    } else {
      failed++;
      console.warn(`[sync-logos] ✗ ${s.slug}: ${result.error}`);
    }
  }

  console.log(
    `[sync-logos] done. downloaded=${downloaded}, preserved=${preserved}, skipped=${skipped}, failed=${failed}`
  );
  console.log(
    '[sync-logos] note: WebP conversion skipped — install `sharp` or use `npx @squoosh/cli` to convert if needed.'
  );
}

main().catch((err) => {
  console.error('[sync-logos] fatal:', err);
  process.exit(1);
});
