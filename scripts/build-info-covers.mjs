/**
 * Génère une image de couverture 1200×630 par article /info, à partir de
 * src/info/articles.js (catégorie → dégradé, titre, marque). PNG dans
 * public/info/<slug>.png.
 *
 *   npm run info:covers
 *
 * Couverture = vrai fichier image (pas un fond CSS) → indexable Google Images,
 * partage social propre, et chaque article porte un <img> avec alt descriptif.
 */
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public/info');
const PHOTOS = resolve(ROOT, 'public/info/photos');

// Si une vraie photo existe dans public/info/photos/<slug>.(jpg|png|webp),
// on l'utilise (recadrée 1200×630) à la place de la couverture générée.
const PHOTO_EXTS = ['jpg', 'jpeg', 'png', 'webp'];
function findPhoto(slug) {
  for (const ext of PHOTO_EXTS) {
    const fp = join(PHOTOS, `${slug}.${ext}`);
    if (existsSync(fp)) return fp;
  }
  return null;
}

const { ARTICLES, CATEGORIES } = await import(
  'file://' + resolve(ROOT, 'src/info/articles.js').replace(/\\/g, '/')
);

const catOf = (key) => CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Découpe un titre en lignes d'au plus `max` caractères (par mots). */
function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((`${cur} ${w}`).trim().length > max) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (`${cur} ${w}`).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function svgFor(article) {
  const cat = catOf(article.category);
  const [from, to] = cat.accent;
  const lines = wrap(article.title, 24).slice(0, 4);
  const startY = 330 - (lines.length - 1) * 34;
  const tspans = lines
    .map((l, i) => `<tspan x="80" y="${startY + i * 70}">${esc(l)}</tspan>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" fill="#07060d" opacity="0.30"/>
  <text x="80" y="120" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#ffffff" opacity="0.85" letter-spacing="4">${esc(cat.fr.toUpperCase())}</text>
  <text font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="800" fill="#ffffff">${tspans}</text>
  <text x="80" y="565" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#ffffff" opacity="0.9">radiolive.ma</text>
</svg>`;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(PHOTOS, { recursive: true });
  let photos = 0;
  let generated = 0;
  for (const a of ARTICLES) {
    const src = findPhoto(a.slug);
    let buf;
    if (src) {
      // Vraie photo → recadrage 1200×630 (centré), WebP (≈10× plus léger qu'un PNG).
      buf = await sharp(src).resize(1200, 630, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toBuffer();
      photos++;
    } else {
      // Couverture générée (dégradé + texte) → WebP haute qualité pour garder un texte net.
      buf = await sharp(Buffer.from(svgFor(a))).webp({ quality: 90 }).toBuffer();
      generated++;
    }
    await writeFile(resolve(OUT, `${a.slug}.webp`), buf);
  }
  console.log(`✓ /info — ${photos} photo(s) + ${generated} couverture(s) générée(s), en WebP`);
}

main().catch((err) => {
  console.error('build-info-covers failed:', err);
  process.exit(1);
});
