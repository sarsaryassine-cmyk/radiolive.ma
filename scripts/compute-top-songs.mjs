/**
 * Aggregate every public/songs/history/<slug>.json into:
 *   public/songs/top-songs.json   →   {
 *     "_updatedAt": "...",
 *     "global":     [ {artist, title, plays, radios:[...] } x 50 ],
 *     "byRadio":    { "<slug>": [ {artist, title, plays} x 10 ] }
 *   }
 *
 * Ranking rule: Number of distinct plays in today's history JSON.
 * Cross-radio score for the global chart adds a +10% boost per distinct radio.
 *
 * Run with:
 *   node scripts/compute-top-songs.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const HISTORY_DIR = resolve(ROOT, 'public/songs/history');
const OUT_FILE = resolve(ROOT, 'public/songs/top-songs.json');

const titleKey = (t) => t.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/feat\.?|featuring|ft\.?/g, '').replace(/[^a-z0-9]+/g, '');

async function main() {
  const files = (await readdir(HISTORY_DIR).catch(() => [])).filter(f => f.endsWith('.json'));
  if (!files.length) { console.error('No history files found.'); process.exit(1); }

  const byRadio = {};
  const global = new Map(); // key → { artist, title, plays, radios: Set }

  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    const data = JSON.parse(await readFile(resolve(HISTORY_DIR, file), 'utf8'));
    const songs = data.songs || [];

    // Per-radio counts
    const local = new Map();
    for (const s of songs) {
      const k = `${titleKey(s.artist)}|${titleKey(s.title)}`;
      const ex = local.get(k);
      if (ex) ex.plays += 1;
      else local.set(k, { artist: s.artist, title: s.title, plays: 1 });

      // Global aggregate
      const g = global.get(k);
      if (g) {
        g.plays += 1;
        g.radios.add(slug);
      } else {
        global.set(k, { artist: s.artist, title: s.title, plays: 1, radios: new Set([slug]) });
      }
    }

    byRadio[slug] = [...local.values()]
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 10);
  }

  // Global top — score = plays × (1 + 0.10 × (radios − 1))
  const globalArr = [...global.values()].map((g) => ({
    artist: g.artist,
    title: g.title,
    plays: g.plays,
    radios: g.radios.size,
    score: g.plays * (1 + 0.1 * (g.radios.size - 1)),
  })).sort((a, b) => b.score - a.score).slice(0, 50);

  const out = {
    _updatedAt: new Date().toISOString(),
    global: globalArr,
    byRadio,
  };

  await writeFile(OUT_FILE, JSON.stringify(out, null, 2));
  console.log(`✓ top-songs: wrote ${OUT_FILE}`);
  console.log(`  global top 5:`);
  globalArr.slice(0, 5).forEach((g, i) =>
    console.log(`    ${i + 1}. ${g.artist} — ${g.title}  (${g.plays} plays / ${g.radios} radios)`)
  );
}

main().catch((err) => { console.error(err); process.exit(1); });
