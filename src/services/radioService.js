/**
 * radioService — autonomous Moroccan-radio catalog.
 *
 * Layers, in order of preference:
 *   1. localStorage cache       (warm — instant, written after each successful sync)
 *   2. /radios.json             (cold — shipped with the build, offline fallback)
 *   3. Radio-Browser public API (live — refreshed in the background every 24 h)
 *
 * Public API:
 *   - loadCatalog()            → first paint list (cache or shipped JSON)
 *   - fetchRadiosFromAPI()     → live API → cleaned [{name, stream, icon, codec, bitrate}]
 *   - mergeCatalog(local, api) → { merged, added, updated, removed }
 *   - shouldSync()             → true when last sync > SYNC_INTERVAL_MS
 *   - readCache() / writeCache() / readLastSync() / writeLastSync()
 *
 * Schema (single source of truth across the app):
 *   { name: string, stream: string, icon: string|null,
 *     codec?: string, bitrate?: number, source?: 'manual'|'api' }
 */

const API_HOSTS = [
  'https://de1.api.radio-browser.info',
  'https://de2.api.radio-browser.info',
  'https://fi1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
];

const API_PATHS = [
  '/json/stations/bycountrycodeexact/MA',
  '/json/stations/bycountry/Morocco',
];

const CACHE_KEY = 'radio-maroc:catalog';
const SYNC_KEY = 'radio-maroc:lastSync';
const SCHEMA_KEY = 'radio-maroc:cacheSchema';
export const SCHEMA_VERSION = 46;

export const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 h
export const DEFAULT_ICON = '/default-radio.svg';

// ─── Normalization ──────────────────────────────────────────────────────────

const normalizeName = (name) =>
  (name || '')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '');

const normalizeUrl = (url) =>
  (url || '')
    .toString()
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\?.*$/, '')
    .replace(/\/$/, '')
    .toLowerCase();

const isValidStream = (url) => {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (!/^https?:\/\//i.test(u)) return false;
  if (/\.html?$/i.test(u)) return false;
  return true;
};

const isValidIcon = (url) => {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (u === 'null' || u === 'undefined') return false;
  if (u.startsWith('/')) return true;
  if (!/^https?:\/\//i.test(u)) return false;
  if (/facebook\.com|fbid=/i.test(u)) return false;
  return true;
};

const cleanName = (name) => {
  let s = (name || '').toString().trim();
  s = s.replace(/^(MA|MRC):-/i, '').trim();
  s = s.replace(/\s+/g, ' ');
  s = s.replace(/\s*\(Morocco\)\s*$/i, '').trim();
  return s;
};

// ─── Catalog loading ────────────────────────────────────────────────────────

/**
 * Load the shipped radios.json (offline fallback / first run).
 *
 * Cache-busting : ajoute `?v=<SCHEMA_VERSION>` au path. Quand on bump
 * SCHEMA_VERSION (ex. via `npm run apply:stations`), l'URL change et le
 * navigateur force un fetch frais. Sans ça, `cache: 'force-cache'` servait
 * l'ancienne version JSON même après une mise à jour des données.
 */
async function loadShipped(url = '/radios.json', signal) {
  const bustUrl = url.includes('?') ? `${url}&v=${SCHEMA_VERSION}` : `${url}?v=${SCHEMA_VERSION}`;
  const res = await fetch(bustUrl, { cache: 'default', signal });
  if (!res.ok) throw new Error(`radios.json: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('radios.json: not an array');
  return data.map(toEntry).filter(Boolean);
}

/**
 * Load whichever catalog is fastest available: cache > shipped.
 * `meta.fromCache` lets the caller decide whether to force-sync afterwards
 * (cold load → always sync; warm load → respect 24 h interval).
 */
export async function loadCatalog({ jsonUrl = '/radios.json', signal } = {}) {
  const cached = readCache();
  if (cached?.length) {
    cached.meta = { fromCache: true };
    return cached;
  }
  const shipped = await loadShipped(jsonUrl, signal);
  shipped.meta = { fromCache: false };
  return shipped;
}

// ─── localStorage helpers ───────────────────────────────────────────────────

export function readCache() {
  try {
    if (Number(localStorage.getItem(SCHEMA_KEY)) !== SCHEMA_VERSION) {
      // Schema changed → cache is stale. Also clear the lastSync timestamp
      // so the next launch forces a fresh API sync instead of waiting 24 h.
      // Et le cache des icônes résolues — sans ça, useIconChain garde en
      // priorité l'ancienne URL cachée même après changement de radio.icon
      // (la nouvelle icône ne s'affiche jamais).
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(SYNC_KEY);
      localStorage.removeItem('radio-maroc:resolvedIcons');
      return null;
    }
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || !data.length) return null;
    return data.map(toEntry).filter(Boolean);
  } catch (_) {
    return null;
  }
}

export function writeCache(list) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(list));
    localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
  } catch (_) {}
}

export function readLastSync() {
  try {
    const v = Number(localStorage.getItem(SYNC_KEY));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch (_) {
    return 0;
  }
}

export function writeLastSync(ts = Date.now()) {
  try { localStorage.setItem(SYNC_KEY, String(ts)); } catch (_) {}
}

export function shouldSync(now = Date.now()) {
  return now - readLastSync() >= SYNC_INTERVAL_MS;
}

// ─── Entry shaping ──────────────────────────────────────────────────────────

function toEntry(raw) {
  if (!raw) return null;
  const name = cleanName(raw.name);
  const stream = (raw.stream || raw.url || '').toString().trim();
  if (!name || !isValidStream(stream)) return null;
  const icon = isValidIcon(raw.icon) ? raw.icon : null;
  const out = { name, stream, icon };
  if (raw.source) out.source = raw.source;
  if (raw.codec) out.codec = raw.codec;
  if (typeof raw.bitrate === 'number') out.bitrate = raw.bitrate;
  if (raw.homepage) out.homepage = raw.homepage;
  // Propagation du rang de popularité (Médiamétrie / Radioscope MA) — utilisé
  // par useCatalog.decorate() pour trier les stations dans la grille Home,
  // le SideMenu drawer, etc. Sans cette ligne, tous les rangs deviennent
  // undefined et le tri retombe sur alpha de fait.
  if (typeof raw.popularity_rank === 'number') out.popularity_rank = raw.popularity_rank;
  return out;
}

// ─── Radio-Browser API ──────────────────────────────────────────────────────

async function fetchOne(host, path, signal) {
  const url = `${host}${path}?hidebroken=true&order=clickcount&reverse=true&limit=200`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'radio-maroc/1.0' },
    signal,
  });
  if (!res.ok) throw new Error(`${host}: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error(`${host}: bad payload`);
  return data;
}

async function fetchAnyMirror(signal) {
  let lastErr;
  for (const host of API_HOSTS) {
    for (const path of API_PATHS) {
      try {
        return await fetchOne(host, path, signal);
      } catch (err) {
        lastErr = err;
      }
    }
  }
  throw lastErr ?? new Error('All Radio-Browser mirrors failed');
}

/**
 * Fetch & clean Moroccan stations from Radio-Browser.
 * Returns entries already in the unified schema.
 */
export async function fetchRadiosFromAPI({ signal } = {}) {
  const stations = await fetchAnyMirror(signal);
  const out = [];
  const seen = new Set();
  for (const s of stations) {
    if (s.lastcheckok !== 1) continue;
    const url = (s.url_resolved || s.url || '').trim();
    const name = cleanName(s.name);
    if (!name || !isValidStream(url)) continue;
    if (s.bitrate && s.bitrate < 32) continue;
    if (containsArabicOnly(name)) continue;
    if (looksLikeNoise(name)) continue;

    const k = normalizeName(name);
    if (!k || seen.has(k)) continue;
    if (EXCLUDED_API_NORMALIZED.has(k)) continue;
    seen.add(k);

    out.push({
      name,
      stream: url,
      icon: isValidIcon(s.favicon) ? s.favicon : null,
      homepage: (s.homepage || '').trim() || null,
      codec: (s.codec || '').toLowerCase(),
      bitrate: s.bitrate || 0,
      source: 'api',
    });
  }
  return out;
}

const containsArabicOnly = (name) => !/[A-Za-z]/.test(name);
const looksLikeNoise = (name) => {
  const n = name.toLowerCase();
  return /test|backup|stream\d+|sample/.test(n);
};

// Re-streams parasites détectés sur Radio-Browser qui font doublon avec une
// vraie station. Le merge ne les détecte pas (URL Zeno différente, nom à
// suffixe « Maroc »), donc on les filtre à la source côté API.
const EXCLUDED_API_NORMALIZED = new Set([
  'hitradiomaroc',  // doublon de Hit Radio (re-stream Zeno.fm)
  'salafwayfm',     // station libyenne hors scope MA — supprimée à la demande
  'sawtalamal',     // doublon API de Radio Sawt Alamal (manual)
  'bldi',           // supprimée à la demande
]);

// ─── Merge ──────────────────────────────────────────────────────────────────

/**
 * Merge a local list with a fresh API list.
 *  - Manual entries (source='manual' or local) keep priority on stream URL.
 *  - API entries with the same normalized name update the stream if missing or different
 *    AND the local entry has no manual source.
 *  - New API entries are appended.
 *  - Returns counts for logging.
 */
export function mergeCatalog(local, remote) {
  const byName = new Map();
  const byUrl = new Map();
  const merged = [];
  let added = 0;
  let updated = 0;

  for (const r of local) {
    const entry = { ...r };
    if (!entry.source) entry.source = 'manual';
    merged.push(entry);
    byName.set(normalizeName(entry.name), entry);
    byUrl.set(normalizeUrl(entry.stream), entry);
  }

  for (const r of remote) {
    const nKey = normalizeName(r.name);
    const uKey = normalizeUrl(r.stream);
    const matchByName = byName.get(nKey);
    const matchByUrl = byUrl.get(uKey);
    const existing = matchByName || matchByUrl;

    if (existing) {
      // refresh icon if missing
      if (!existing.icon && r.icon) {
        existing.icon = r.icon;
        updated += 1;
      }
      // backfill homepage if missing — used by RadioIcon to derive favicons
      if (!existing.homepage && r.homepage) {
        existing.homepage = r.homepage;
      }
      // refresh stream URL only when local was sourced from API
      if (existing.source === 'api' && existing.stream !== r.stream) {
        existing.stream = r.stream;
        updated += 1;
      }
      continue;
    }

    merged.push(r);
    byName.set(nKey, r);
    byUrl.set(uKey, r);
    added += 1;
  }

  return { merged, added, updated, removed: 0, total: merged.length };
}

// ─── High-level orchestrator ────────────────────────────────────────────────

/**
 * Sync-on-demand: returns the freshest catalog and whatever changed.
 * Never throws — falls back to the local list on any error.
 */
export async function syncCatalog(local, { signal } = {}) {
  try {
    const remote = await fetchRadiosFromAPI({ signal });
    console.info(`[radio-service] API returned ${remote.length} valid Moroccan stations`);
    const result = mergeCatalog(local, remote);
    if (result.added || result.updated) {
      console.info(
        `[radio-service] +${result.added} new · ${result.updated} updated · total ${result.total}`
      );
    } else {
      console.info('[radio-service] no changes — catalog up to date');
    }
    // Always write the cache after a successful sync, even if nothing changed.
    // That way a cold-start (cache invalidated by schema bump) still writes the
    // merged 43-radio list and the next launch is warm.
    writeCache(result.merged);
    writeLastSync();
    return { ...result, fetched: remote.length, ok: true };
  } catch (err) {
    if (err?.name === 'AbortError') return { ok: false, aborted: true };
    console.warn('[radio-service] sync failed, using local catalog:', err?.message || err);
    return {
      merged: local,
      added: 0,
      updated: 0,
      removed: 0,
      total: local.length,
      fetched: 0,
      ok: false,
      error: err?.message || String(err),
    };
  }
}
