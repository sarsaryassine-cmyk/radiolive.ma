/**
 * ICY metadata scraper — runs server-side, populates:
 *   public/songs/now-playing.json
 *   public/songs/history/<slug>.json
 *
 * For each station with an MP3/AAC stream (HLS streams don't expose ICY,
 * coranic streams skipped), it opens an HTTP connection with the
 * `Icy-MetaData: 1` header, reads the `icy-metaint` from the response
 * headers, then parses one block of `StreamTitle` from the audio buffer.
 *
 * Schedule on a server with cron (every 90 s recommended):
 *   * /1 * * * * cd /path/to/radio-maroc && node scripts/fetch-icy-metadata.mjs
 *
 * After this you should also re-run the aggregator periodically:
 *   * /5 * * * * cd /path/to/radio-maroc && node scripts/compute-top-songs.mjs
 *
 * The script is safe to run repeatedly. It deduplicates: if the current
 * track is the same as the last entry in the history, no new line is added.
 */
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const HISTORY_DIR = resolve(ROOT, 'public/songs/history');
const NOW_FILE = resolve(ROOT, 'public/songs/now-playing.json');

const TIMEOUT_MS = 8000;
const MAX_DATA_BYTES = 256 * 1024;

const slugify = (s) => String(s).toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Open an ICY-aware connection and read just enough bytes to extract
 * the first metadata block. Returns the parsed { artist, title } or null.
 */
function readIcyMetadata(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? httpsRequest : httpRequest;
    const opts = {
      method: 'GET',
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      headers: {
        'Icy-MetaData': '1',
        'User-Agent': 'radio-maroc-scraper/1.0',
        'Accept': '*/*',
      },
      timeout: TIMEOUT_MS,
    };

    const req = lib(opts, (res) => {
      const interval = parseInt(res.headers['icy-metaint'], 10);
      if (!Number.isFinite(interval) || interval <= 0) {
        // No ICY metadata advertised by the server (HLS, raw stream, etc.)
        res.destroy();
        return resolve(null);
      }

      let buf = Buffer.alloc(0);
      const onData = (chunk) => {
        buf = Buffer.concat([buf, chunk]);
        // We need: interval audio bytes + 1 length byte + (length×16) metadata
        if (buf.length < interval + 1) {
          if (buf.length > MAX_DATA_BYTES) { res.destroy(); resolve(null); }
          return;
        }
        const lenByte = buf[interval];
        const metaLen = lenByte * 16;
        if (metaLen === 0) {
          // No metadata in this packet — keep listening
          if (buf.length > MAX_DATA_BYTES) { res.destroy(); resolve(null); }
          return;
        }
        if (buf.length < interval + 1 + metaLen) return;

        const metaStr = buf.slice(interval + 1, interval + 1 + metaLen).toString('utf8').replace(/\0+$/, '');
        res.destroy();

        // metaStr looks like: StreamTitle='Artist - Title';StreamUrl='...';
        const m = metaStr.match(/StreamTitle='([^']*)'/);
        if (!m) return resolve(null);
        const raw = m[1].trim();
        if (!raw) return resolve(null);

        // Try to split "Artist - Title"; if no separator, use whole thing as title
        let artist = '', title = raw;
        const dash = raw.split(/\s+[-–—]\s+/);
        if (dash.length >= 2) { artist = dash[0]; title = dash.slice(1).join(' - '); }
        resolve({ artist: artist.trim(), title: title.trim() });
      };

      res.on('data', onData);
      res.on('end', () => resolve(null));
      res.on('error', () => resolve(null));
    });

    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.on('error', () => resolve(null));
    req.end();
  });
}

async function loadJson(path, fallback) {
  try { return JSON.parse(await readFile(path, 'utf8')); }
  catch (_) { return fallback; }
}

async function main() {
  await mkdir(HISTORY_DIR, { recursive: true });
  const radios = JSON.parse(await readFile(resolve(ROOT, 'public/radios.json'), 'utf8'));
  const nowPlaying = await loadJson(NOW_FILE, { _updatedAt: '', stations: {} });

  let changed = 0, queried = 0;
  const today = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();
  const nowHHmm = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca' });

  for (const radio of radios) {
    const stream = radio.stream;
    if (!stream) continue;
    if (/\.m3u8/i.test(stream)) continue;       // HLS — no ICY
    if (/qurango|backup\.qurango|hajjam/i.test(stream)) continue; // coranic placeholders
    queried += 1;

    const meta = await readIcyMetadata(stream);
    if (!meta || (!meta.artist && !meta.title)) continue;

    const slug = slugify(radio.name);
    const histPath = resolve(HISTORY_DIR, `${slug}.json`);
    const hist = await loadJson(histPath, { radio: radio.name, slug, date: today, songs: [] });

    // Reset history if the date changed
    if (hist.date !== today) {
      hist.date = today;
      hist.songs = [];
    }

    const last = hist.songs[0];
    const isSame = last && last.artist === meta.artist && last.title === meta.title;
    if (!isSame) {
      hist.songs.unshift({ time: nowHHmm, artist: meta.artist, title: meta.title });
      hist.songs = hist.songs.slice(0, 200); // keep last 200
      await writeFile(histPath, JSON.stringify(hist, null, 2));
      changed += 1;
    }

    nowPlaying.stations[slug] = { artist: meta.artist, title: meta.title, since: nowIso };
  }

  nowPlaying._updatedAt = nowIso;
  await writeFile(NOW_FILE, JSON.stringify(nowPlaying, null, 2));

  console.log(`✓ ICY scrape — queried ${queried} streams, ${changed} new tracks recorded`);
}

main().catch((err) => { console.error('ICY scraper error:', err); process.exit(1); });
