/**
 * Génère les favicons à partir de public/favicon-master.png (PNG carré, ≥512px).
 *   npm run favicon
 *
 * Sorties :
 *   - public/favicon.ico          (multi-tailles 16/32/48 — lu par Google Search)
 *   - public/favicon-96x96.png    (navigateurs modernes)
 *   - public/apple-touch-icon.png (180×180, fond aplati pour iOS)
 *
 * sharp ne sait pas écrire le format .ico → on assemble le conteneur ICO
 * manuellement (header + entrées PNG embarquées, supporté depuis Vista).
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'public/favicon-master.png');
const BG = '#07060d'; // fond du site (apple-touch n'aime pas la transparence)

const png = (size, opts = {}) => {
  let p = sharp(SRC).resize(size, size, { fit: 'cover' });
  if (opts.flatten) p = p.flatten({ background: BG });
  return p.png({ compressionLevel: 9 }).toBuffer();
};

/** Assemble un .ico contenant des PNG (1 entrée par taille). */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  entries.forEach(({ size, buf }, i) => {
    const e = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, e + 0); // width
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1); // height
    dir.writeUInt8(0, e + 2); // palette
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // color planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(buf.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.buf)]);
}

async function main() {
  const icoSizes = [16, 32, 48];
  const icoEntries = await Promise.all(
    icoSizes.map(async (size) => ({ size, buf: await png(size) }))
  );
  await writeFile(resolve(ROOT, 'public/favicon.ico'), buildIco(icoEntries));
  await writeFile(resolve(ROOT, 'public/favicon-96x96.png'), await png(96));
  await writeFile(resolve(ROOT, 'public/apple-touch-icon.png'), await png(180, { flatten: true }));
  console.log('✓ favicon.ico (16/32/48) + favicon-96x96.png + apple-touch-icon.png générés');
}

main().catch((err) => {
  console.error('build-favicon failed:', err);
  process.exit(1);
});
