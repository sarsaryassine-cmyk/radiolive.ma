import { useEffect, useRef, useState } from 'react';
import {
  loadCatalog,
  syncCatalog,
  shouldSync,
  SYNC_INTERVAL_MS,
  SCHEMA_VERSION,
} from '../services/radioService.js';
import { resolveCategory } from '../utils/categories.js';

// Cache of name → description, populated once per session.
// Cache-busting via SCHEMA_VERSION : sans ça, le navigateur servait l'ancienne
// version de radioDescriptions.json même après mise à jour des descriptions
// (typique : la page station affichait l'ancienne description Radio Mars
// "2007 / Eco-Médias" alors que le serveur avait déjà la nouvelle "2009 /
// Hicham El Khlifi"). Le query string force un fresh fetch à chaque bump.
let descriptionsCache = null;
async function loadDescriptions() {
  if (descriptionsCache) return descriptionsCache;
  try {
    const res = await fetch(`/radioDescriptions.json?v=${SCHEMA_VERSION}`);
    if (res.ok) descriptionsCache = await res.json();
  } catch (_) { /* ignore — page-level fallback handles this */ }
  return descriptionsCache || {};
}

const PALETTES = [
  ['#7c4dff', '#38bdf8'],
  ['#f43f5e', '#f59e0b'],
  ['#10b981', '#06b6d4'],
  ['#a855f7', '#ec4899'],
  ['#3b82f6', '#8b5cf6'],
  ['#f97316', '#eab308'],
  ['#14b8a6', '#22d3ee'],
  ['#ef4444', '#a855f7'],
];

const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const accentForName = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
};

const detectStreamType = (url) => {
  if (!url) return 'unknown';
  const u = url.toLowerCase();
  if (u.includes('.m3u8')) return 'hls';
  if (u.includes('.mpd')) return 'dash';
  return 'mp3';
};

// Liens d'entité (Wikipedia / Wikidata) par station, alimentent radio.sameAs
// dans le JSON-LD RadioStation. C'est l'un des signaux les plus rentables pour
// la reconnaissance d'entité par Google (Knowledge Graph) et la citation par
// les LLM. RÈGLE : n'ajouter QUE des URLs vérifiées et exactes — une mauvaise
// URL sameAs dégrade la confiance plutôt que de l'améliorer.
const STATION_SAMEAS = {
  'hit-radio': ['https://fr.wikipedia.org/wiki/Hit_Radio'],
  'medi-1-radio': [
    'https://fr.wikipedia.org/wiki/Medi_1_radio',
    'https://www.wikidata.org/wiki/Q2201536',
  ],
  'radio-mars': ['https://fr.wikipedia.org/wiki/Radio_Mars'],
  'chada-fm': ['https://fr.wikipedia.org/wiki/Chada_FM'],
  'radio-2m': ['https://fr.wikipedia.org/wiki/Radio_2M'],
  'atlantic-radio': ['https://fr.wikipedia.org/wiki/Atlantic_Radio'],
};

/**
 * UI-decorate a service entry: adds id, gradient, streamType.
 * Memoized externally — pure function of name + stream + icon.
 */
function decorate(entry, descriptions = {}) {
  const [from, to] = accentForName(entry.name);
  const id = slugify(entry.name) || `r-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    name: entry.name,
    stream: entry.stream,
    streamType: detectStreamType(entry.stream),
    icon: entry.icon || null,
    homepage: entry.homepage || null,
    codec: entry.codec,
    bitrate: entry.bitrate,
    source: entry.source || 'manual',
    gradientFrom: from,
    gradientTo: to,
    category: entry.category || resolveCategory(entry.name),
    description: descriptions[entry.name] || null,
    // Liens encyclopédiques (Wikipedia/Wikidata) → JSON-LD RadioStation.sameAs
    sameAs: STATION_SAMEAS[id] || undefined,
    // Tri par popularité au Maroc (Médiamétrie / Radioscope 2024-2025).
    // 1-25 = stations classées dans la spec ; 999 = autres (alpha fallback).
    popularity_rank: typeof entry.popularity_rank === 'number' ? entry.popularity_rank : 999,
  };
}

/**
 * Tri stable : par popularity_rank ascendant, puis alpha pour les ex æquo.
 * Utilisé partout où une liste de stations est présentée à l'utilisateur.
 */
export const sortByPopularity = (a, b) => {
  const r = (a.popularity_rank ?? 999) - (b.popularity_rank ?? 999);
  if (r !== 0) return r;
  return a.name.localeCompare(b.name, 'fr');
};

const decorateAll = (list, descriptions) => {
  const seen = new Set();
  const out = [];
  for (const r of list) {
    const id = slugify(r.name);
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    out.push(decorate(r, descriptions));
  }
  // Tri par popularité plutôt qu'alpha — Hit Radio en tête.
  return out.sort(sortByPopularity);
};

/**
 * Catalog orchestrator hook.
 *
 *  Phase 1 — instant: localStorage cache → fallback /radios.json.
 *  Phase 2 — background: hit Radio-Browser, merge, write back to cache.
 *  Phase 3 — periodic: re-sync every 24 h while the tab stays open.
 *
 * Returns:
 *   radios       : decorated UI-ready entries
 *   loading      : true until phase 1 finishes
 *   error        : phase 1 fatal error (cache + shipped JSON both failed)
 *   syncStatus   : { state: 'idle'|'syncing'|'ok'|'error',
 *                    added, updated, total, fetched, error?, lastSync? }
 *   resync()     : force a sync now
 */
export default function useCatalog() {
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState({ state: 'idle' });
  const localRef = useRef([]);
  const abortRef = useRef(null);
  const intervalRef = useRef(null);

  const runSync = async () => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setSyncStatus((s) => ({ ...s, state: 'syncing' }));

    const result = await syncCatalog(localRef.current, { signal: ctrl.signal });
    if (ctrl.signal.aborted) return;

    if (result.ok) {
      const descriptions = await loadDescriptions();
      const decorated = decorateAll(result.merged, descriptions);
      localRef.current = result.merged;
      setRadios(decorated);
      setSyncStatus({
        state: 'ok',
        added: result.added,
        updated: result.updated,
        total: result.total,
        fetched: result.fetched,
        lastSync: Date.now(),
      });
    } else {
      setSyncStatus({
        state: 'error',
        added: 0,
        updated: 0,
        total: localRef.current.length,
        fetched: 0,
        error: result.error,
      });
    }
  };

  useEffect(() => {
    let alive = true;
    let coldStart = false;
    (async () => {
      try {
        const [initial, descriptions] = await Promise.all([
          loadCatalog(),
          loadDescriptions(),
        ]);
        if (!alive) return;
        localRef.current = initial;
        const decorated = decorateAll(initial, descriptions);
        setRadios(decorated);
        coldStart = !initial?.meta?.fromCache;
        console.info(
          `[catalog] loaded ${decorated.length} radios (${coldStart ? 'cold — shipped JSON' : 'warm — cache'})`
        );
      } catch (err) {
        if (!alive) return;
        setError(err?.message || 'Impossible de charger les radios');
      } finally {
        if (alive) setLoading(false);
      }

      if (!alive) return;
      // Cold start (no cache) → always sync to merge in API additions immediately.
      // Warm start → only sync if 24 h have elapsed.
      if (coldStart || shouldSync()) {
        runSync();
      } else {
        console.info('[catalog] last sync recent — skipping API hit');
      }

      intervalRef.current = setInterval(() => {
        if (shouldSync()) runSync();
      }, 60 * 60 * 1000); // hourly check, fires only when 24h elapsed
    })();

    return () => {
      alive = false;
      if (abortRef.current) abortRef.current.abort();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { radios, loading, error, syncStatus, resync: runSync, syncIntervalMs: SYNC_INTERVAL_MS };
}
