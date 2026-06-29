/**
 * Génère public/og-default.png (1200×630) — image Open Graph de marque :
 * le logo (public/favicon-master.png) composité sur un fond dégradé + texte.
 * Universelle (PNG) : rendue par Facebook, LinkedIn, WhatsApp, X et Bing
 * (vignette de résultat de recherche).
 *
 *   npm run og:png
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LOGO = resolve(ROOT, 'public/favicon-master.png');
const OUT = resolve(ROOT, 'public/og-default.png');

const W = 1200;
const H = 630;
const LOGO_SIZE = 430;

const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0a14"/>
      <stop offset="55%" stop-color="#1a0a12"/>
      <stop offset="100%" stop-color="#2a0810"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <circle cx="300" cy="315" r="300" fill="#FF2A3C" opacity="0.13"/>
  <text x="585" y="250" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="800" fill="#ffffff">Radio Maroc</text>
  <text x="585" y="322" font-family="Arial, Helvetica, sans-serif" font-size="37" font-weight="700" fill="#FF6B7A">Écouter toutes les radios</text>
  <text x="585" y="372" font-family="Arial, Helvetica, sans-serif" font-size="37" font-weight="700" fill="#FF6B7A">marocaines en direct</text>
  <text x="585" y="470" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="700" fill="#ffffff" opacity="0.85">radiolive.ma</text>
</svg>`;

async function main() {
  const logo = await sharp(LOGO)
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const base = await sharp(Buffer.from(bg)).png().toBuffer();
  const out = await sharp(base)
    .composite([{ input: logo, left: 70, top: Math.round((H - LOGO_SIZE) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(OUT, out);
  console.log('✓ og-default.png (logo de marque) 1200×630 généré');
}

main().catch((err) => {
  console.error('build-og-image failed:', err);
  process.exit(1);
});
