/**
 * radiolive-now-playing — Cloudflare Worker
 *
 * GET /api/now-playing/:slug
 *
 * Récupère les métadonnées ICY (artiste/titre) en temps réel pour la station,
 * cache 30s en KV, enrichit avec l'artwork via iTunes Search API.
 *
 * Architecture :
 *  1. KV lookup (TTL 30s) — si hit, retourne immédiatement
 *  2. Sinon, lit data/stations-source.json embarqué au build pour la stream URL
 *  3. GET sur le flux avec header Icy-MetaData: 1
 *  4. Parse icy-metaint → lit le bloc metadata → extrait StreamTitle='Artist - Song'
 *  5. Si artiste+titre trouvés, query iTunes pour artwork (artworkUrl600)
 *  6. KV put (30s) + return
 *
 * Gracefully handle :
 *  - Stream injoignable → { now_playing: null, error: "stream_unreachable" }
 *  - Pas de metadata ICY → { now_playing: null, info: "no_icy_metadata" }
 *  - Parse cassé → { now_playing: null, error: "parse_error" }
 *  - iTunes rate limit → données sans artwork
 *
 * Rate limit : 60 req/min/slug → si dépassé, retourne le cache stale
 */

// stations-source.json embarqué au build par wrangler (esbuild JSON loader natif)
import sourceData from '../../../data/stations-source.json';

const STATIONS = new Map(
  (sourceData.stations || []).map((s) => [s.slug, s])
);

const CACHE_TTL = 30; // secondes
const ICY_READ_BYTES = 16384; // lire au plus 16 KB pour atteindre le metaint
const STREAM_TIMEOUT_MS = 6000;
const ITUNES_TIMEOUT_MS = 3000;

/* ─── CORS ────────────────────────────────────────────────────────── */

function corsHeaders(origin, allowed) {
  const ok = allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

/* ─── ICY parsing ─────────────────────────────────────────────────── */

/**
 * Lit un flux audio avec header Icy-MetaData: 1 et extrait le bloc metadata
 * positionné à `icy-metaint` octets après le début du payload audio.
 *
 * Retourne { artist, title, icy: { name, genre, bitrate } } ou null.
 */
async function fetchIcyMetadata(streamUrl) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), STREAM_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(streamUrl, {
      headers: {
        'Icy-MetaData': '1',
        'User-Agent': 'radiolive.ma/1.0 (now-playing worker)',
      },
      signal: ctrl.signal,
      redirect: 'follow',
    });
  } catch (err) {
    clearTimeout(timer);
    return { error: 'stream_unreachable', detail: String(err.message || err) };
  }
  clearTimeout(timer);

  if (!res.ok || !res.body) {
    return { error: 'stream_unreachable', detail: `HTTP ${res.status}` };
  }

  const metaint = parseInt(res.headers.get('icy-metaint') || '0', 10);
  const icy = {
    name: res.headers.get('icy-name') || null,
    genre: res.headers.get('icy-genre') || null,
    bitrate: parseInt(res.headers.get('icy-br') || '0', 10) || null,
  };

  if (!metaint) {
    // Le serveur n'a pas envoyé d'icy-metaint → pas de métadonnées intégrées
    try { res.body.cancel(); } catch {}
    return { error: 'no_icy_metadata', icy };
  }

  // Lire jusqu'à metaint + 256 octets pour s'assurer d'avoir le bloc complet
  const reader = res.body.getReader();
  const buffers = [];
  let received = 0;
  const target = metaint + 256;

  try {
    while (received < target) {
      const { value, done } = await reader.read();
      if (done) break;
      buffers.push(value);
      received += value.byteLength;
      if (received >= ICY_READ_BYTES) break;
    }
  } catch {
    // tolérant — on essaye de parser ce qu'on a
  } finally {
    try { reader.cancel(); } catch {}
  }

  // Concat buffers
  const total = buffers.reduce((acc, b) => acc + b.byteLength, 0);
  const buf = new Uint8Array(total);
  let off = 0;
  for (const b of buffers) {
    buf.set(b, off);
    off += b.byteLength;
  }

  if (buf.byteLength <= metaint) return { error: 'no_icy_metadata', icy };

  const blockLen = buf[metaint] * 16; // metadata length is the byte at position metaint, multiplied by 16
  if (blockLen === 0) return { error: 'no_icy_metadata', icy };

  const metaBlock = buf.slice(metaint + 1, metaint + 1 + blockLen);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(metaBlock).replace(/\0+$/, '');

  // Parser StreamTitle='Artist - Title';  (peut contenir d'autres champs séparés par ;)
  const m = text.match(/StreamTitle='([^']*)'/);
  if (!m) return { error: 'parse_error', raw: text.slice(0, 200) };

  const streamTitle = m[1].trim();
  if (!streamTitle) return { error: 'parse_error', raw: text.slice(0, 200) };

  // Convention : "Artist - Title" séparé par " - "
  const parts = streamTitle.split(' - ');
  const artist = parts.length >= 2 ? parts[0].trim() : null;
  const title = parts.length >= 2 ? parts.slice(1).join(' - ').trim() : streamTitle;

  return { artist, title, icy };
}

/* ─── iTunes artwork lookup ───────────────────────────────────────── */

async function fetchItunesArtwork(artist, title) {
  if (!artist && !title) return null;
  const term = encodeURIComponent(`${artist || ''} ${title || ''}`.trim());
  const url = `https://itunes.apple.com/search?term=${term}&media=music&limit=1`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ITUNES_TIMEOUT_MS);

  try {
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!r.ok) return null;
    const data = await r.json();
    const hit = data?.results?.[0];
    if (!hit?.artworkUrl100) return null;
    // Upgrade à 600x600 (toujours hébergé sur les CDN iTunes)
    return hit.artworkUrl100.replace('100x100bb', '600x600bb');
  } catch {
    clearTimeout(timer);
    return null;
  }
}

/* ─── Rate limit (très simple, KV-based) ──────────────────────────── */

async function checkRateLimit(env, slug) {
  const key = `rate:${slug}:${Math.floor(Date.now() / 60000)}`; // bucket 1 min
  const cur = parseInt((await env.METADATA_CACHE.get(key)) || '0', 10);
  const limit = parseInt(env.RATE_LIMIT_PER_MINUTE || '60', 10);
  if (cur >= limit) return { limited: true, count: cur };
  await env.METADATA_CACHE.put(key, String(cur + 1), { expirationTtl: 65 });
  return { limited: false, count: cur + 1 };
}

/* ─── Main handler ────────────────────────────────────────────────── */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const cors = corsHeaders(request.headers.get('Origin') || '', allowed);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    // Match /api/now-playing/:slug
    const match = url.pathname.match(/\/api\/now-playing\/([a-z0-9-]+)\/?$/i);
    if (!match) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const slug = match[1].toLowerCase();
    const station = STATIONS.get(slug);
    if (!station) {
      return new Response(JSON.stringify({ error: 'unknown_station', slug }), {
        status: 404,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const cacheKey = `np:${slug}`;

    // 1. KV cache
    const cached = await env.METADATA_CACHE.get(cacheKey, 'json');
    if (cached) {
      return new Response(JSON.stringify({ ...cached, cached: true }), {
        headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=15' },
      });
    }

    // 2. Rate limit
    const rl = await checkRateLimit(env, slug);
    if (rl.limited) {
      // Si on dépasse 60 req/min, on retourne un placeholder (cache stale aurait déjà été return ci-dessus)
      return new Response(
        JSON.stringify({ station: slug, now_playing: null, info: 'rate_limited' }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Fetch ICY metadata
    if (!station.stream_url) {
      return new Response(
        JSON.stringify({ station: slug, now_playing: null, error: 'no_stream_url' }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    const icyResult = await fetchIcyMetadata(station.stream_url);

    if (icyResult.error) {
      const payload = {
        station: slug,
        now_playing: null,
        info: icyResult.error === 'no_icy_metadata' ? 'no_icy_metadata' : undefined,
        error: icyResult.error !== 'no_icy_metadata' ? icyResult.error : undefined,
        icy_metadata: icyResult.icy || null,
        cached: false,
      };
      // Cache négatif court (10s) pour éviter de marteler un flux mort
      ctx.waitUntil(
        env.METADATA_CACHE.put(cacheKey, JSON.stringify(payload), { expirationTtl: 10 })
      );
      return new Response(JSON.stringify(payload), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // 4. iTunes artwork
    const artwork = await fetchItunesArtwork(icyResult.artist, icyResult.title);

    const payload = {
      station: slug,
      now_playing: {
        artist: icyResult.artist,
        title: icyResult.title,
        artwork_url: artwork,
        started_at: new Date().toISOString(),
      },
      icy_metadata: icyResult.icy,
      cached: false,
    };

    // 5. KV cache
    ctx.waitUntil(
      env.METADATA_CACHE.put(cacheKey, JSON.stringify(payload), { expirationTtl: CACHE_TTL })
    );

    return new Response(JSON.stringify(payload), {
      headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=15' },
    });
  },
};
