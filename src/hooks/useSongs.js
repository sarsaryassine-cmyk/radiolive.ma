import { useEffect, useState } from 'react';

/**
 * Browser-side data fetchers for songs/* JSON files.
 *
 *   useNowPlaying(slug)           → current track for a station
 *   useStationHistory(slug)       → full history for a station
 *   useStationTopSongs(slug)      → top 10 for a station
 *   useGlobalTopSongs()           → global top 50
 *
 * Each hook auto-refreshes on a sensible interval and caches across renders
 * via the global `_cache` map (per-URL).
 */
const _cache = new Map();

async function fetchJson(url) {
  if (_cache.has(url)) return _cache.get(url);
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    _cache.set(url, data);
    return data;
  } catch (_) {
    return null;
  }
}

function useAutoRefresh(url, intervalMs) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      return;
    }
    let alive = true;
    const tick = async () => {
      _cache.delete(url);
      const d = await fetchJson(url);
      if (alive) {
        setData(d);
        setLoading(false);
      }
    };
    tick();
    const id = setInterval(tick, intervalMs);
    return () => { alive = false; clearInterval(id); };
  }, [url, intervalMs]);

  return { data, loading };
}

/* ─── public hooks ────────────────────────────────────────────────────── */

export function useNowPlaying(slug) {
  const { data } = useAutoRefresh('/songs/now-playing.json', 30 * 1000);
  return data?.stations?.[slug] || null;
}

/**
 * Live now-playing — hits the Cloudflare Worker for real-time ICY metadata
 * + iTunes artwork. Use for the active player or /now/[station] pages.
 *
 * Falls back gracefully :
 *  - 404 unknown_station → null
 *  - error stream_unreachable → static JSON fallback
 *  - no_icy_metadata → static JSON fallback
 *
 * Returns { artist, title, artwork, source: 'worker' | 'static' | null }.
 */
export function useLiveNowPlaying(slug) {
  const { data: workerResp } = useAutoRefresh(slug ? `/api/now-playing/${slug}` : null, 30 * 1000);
  const { data: staticResp } = useAutoRefresh('/songs/now-playing.json', 30 * 1000);

  const fromWorker = workerResp?.now_playing;
  if (fromWorker?.artist || fromWorker?.title) {
    return {
      artist: fromWorker.artist,
      title: fromWorker.title,
      artwork: fromWorker.artwork_url || null,
      source: 'worker',
    };
  }

  const fromStatic = staticResp?.stations?.[slug];
  if (fromStatic?.artist || fromStatic?.title) {
    return {
      artist: fromStatic.artist,
      title: fromStatic.title,
      artwork: fromStatic.artwork || null,
      source: 'static',
    };
  }

  return null;
}

export function useStationHistory(slug) {
  return useAutoRefresh(`/songs/history/${slug}.json`, 60 * 1000);
}

export function useStationTopSongs(slug) {
  const { data, loading } = useAutoRefresh('/songs/top-songs.json', 5 * 60 * 1000);
  return { data: data?.byRadio?.[slug] || [], loading };
}

export function useGlobalTopSongs() {
  const { data, loading } = useAutoRefresh('/songs/top-songs.json', 5 * 60 * 1000);
  return { data: data?.global || [], updatedAt: data?._updatedAt, loading };
}

/* ─── helpers used by pages ─────────────────────────────────────────── */

export function youtubeSearchUrl(artist, title) {
  const q = encodeURIComponent(`${artist} ${title}`.trim());
  return `https://www.youtube.com/results?search_query=${q}`;
}

export function shareUrl(artist, title) {
  const text = `Écoutez ${artist} — ${title} sur Radio Maroc`;
  const u = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${u}`;
}
