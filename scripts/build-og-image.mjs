/**
 * Optional: convert public/og-default.svg → public/og-default.png at 1200×630.
 *
 * Twitter and many crawlers don't honor SVG OG images. PNG is universal.
 * Run AFTER installing sharp:
 *   npm i -D sharp
 *   npm run og:png
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error(
      '\n[og-image] `sharp` is not installed.\n' +
      'Install it with:  npm i -D sharp\n' +
      'Then re-run:      npm run og:png\n' +
      'For now, og-default.svg will be used directly (not all crawlers support SVG).\n'
    );
    process.exit(0);
  }

  const svg = await readFile(resolve(ROOT, 'public/og-default.svg'));
  const png = await sharp(svg).resize(1200, 630).png({ quality: 92 }).toBuffer();
  await writeFile(resolve(ROOT, 'public/og-default.png'), png);
  console.log('✓ og-default.png generated (1200×630)');
}

main().catch((err) => {
  console.error('og-image build failed:', err);
  process.exit(1);
});
