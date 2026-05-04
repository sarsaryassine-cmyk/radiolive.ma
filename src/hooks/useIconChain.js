import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Resolves the best available favicon for a radio with automatic fallbacks.
 *
 * Tries, in order:
 *   1. radio.icon                                          (manual or API-provided)
 *   2. Google s2/favicons     (using radio.homepage host)
 *   3. DuckDuckGo ip3 favicon (using radio.homepage host)
 *   4. Google s2/favicons     (using radio.stream host — last-resort)
 *   5. /default-radio.svg
 *   6. Render initials gradient (handled by the consumer)
 *
 * Once a source loads successfully (image onLoad), the URL is cached in
 * localStorage under `radio-maroc:resolvedIcons` keyed by radio.id, so the
 * page never has to retry the chain on subsequent visits.
 *
 * Returns:
 *   { src, onError, onLoad, exhausted }
 *
 *   - src         : current URL to use as <img src>
 *   - onError     : pass to <img onError> — advances to the next source
 *   - onLoad      : pass to <img onLoad>  — caches the working URL
 *   - exhausted   : true once every source has failed
 */
const STORE_KEY = 'radio-maroc:resolvedIcons';

const readStore = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; }
  catch (_) { return {}; }
};
const writeStore = (id, url) => {
  try {
    const all = readStore();
    if (all[id] === url) return;
    all[id] = url;
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch (_) {}
};

const hostnameOf = (url) => {
  if (!url) return null;
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch (_) { return null; }
};

const buildChain = (radio) => {
  const chain = [];
  if (radio.icon) chain.push(radio.icon);

  const homepageHost = hostnameOf(radio.homepage);
  const streamHost = hostnameOf(radio.stream);

  // Skip generic CDN hostnames — they don't have meaningful favicons
  const isGenericHost = (h) =>
    !h ||
    /infomaniak|akamaized|easybroadcast|zeno\.fm|asurahosting|radioking|radiojar|nindohost|hajjam|asmaki|qurango|backup\.qurango|skyrock\.net/i.test(h);

  if (homepageHost && !isGenericHost(homepageHost)) {
    chain.push(`https://www.google.com/s2/favicons?domain=${homepageHost}&sz=128`);
    chain.push(`https://icons.duckduckgo.com/ip3/${homepageHost}.ico`);
    chain.push(`https://${homepageHost}/favicon.ico`);
  }
  if (streamHost && streamHost !== homepageHost && !isGenericHost(streamHost)) {
    chain.push(`https://www.google.com/s2/favicons?domain=${streamHost}&sz=128`);
  }

  chain.push('/default-radio.svg');
  return chain;
};

export default function useIconChain(radio) {
  // Memoise the computed chain so it stays stable across renders
  const chain = useMemo(() => buildChain(radio), [radio.icon, radio.homepage, radio.stream]);

  // Fast path: a previously-resolved URL goes first — MAIS uniquement quand
  // la station n'a pas d'icon explicite définie. Sinon le cache écraserait
  // toute mise à jour de radio.icon dans radios.json (l'ancienne URL résolue
  // serait essayée en premier, chargerait, et la nouvelle ne serait jamais
  // affichée). Le cache n'a d'intérêt que pour les stations qui dépendent
  // de la chaîne de favicons (radio.icon === null).
  const cachedRef = useRef(null);
  if (cachedRef.current === null) {
    cachedRef.current = readStore()[radio.id] || null;
  }
  const initialChain = cachedRef.current && !chain.includes(cachedRef.current) && !radio.icon
    ? [cachedRef.current, ...chain]
    : chain;

  const [idx, setIdx] = useState(0);

  // Reset to 0 when the radio (or its sources) change
  useEffect(() => { setIdx(0); }, [radio.id]);

  const src = initialChain[Math.min(idx, initialChain.length - 1)];
  const exhausted = idx >= initialChain.length;

  const onError = () => setIdx((i) => i + 1);
  const onLoad = () => {
    // Persist successful resolution. Skip the fallback default — only cache
    // remote sources so the chain still tries fresh fetches if a remote dies.
    if (src && !src.startsWith('/default-radio')) {
      writeStore(radio.id, src);
    }
  };

  return { src, onError, onLoad, exhausted };
}
