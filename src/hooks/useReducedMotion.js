import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Détection appareil "low-end" — exécutée une fois au mount.
 * Critères (au moins un suffit) :
 *  - hardwareConcurrency < 4 cores (Snapdragon 4xx, A11 et antérieurs)
 *  - deviceMemory < 4 GB (entry/mid Android, iPhone 8 et antérieurs)
 *  - Save-Data activé par l'utilisateur (mode économique)
 * Si lowEnd, on force le fallback CSS-only et on coupe le shader WebGL2
 * pour préserver batterie + éviter le thermal throttling.
 */
function isLowEndDevice() {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 8;
  const mem = navigator.deviceMemory; // unsupportée sur Safari → undefined
  const saveData = navigator.connection?.saveData === true;
  if (cores < 4) return true;
  if (typeof mem === 'number' && mem < 4) return true;
  if (saveData) return true;
  return false;
}

/**
 * Single source of truth for "should we cut animations?":
 *  - OS-level reduced-motion preference
 *  - small viewport (mobile) where heavy 3D would tank perf
 *  - low-end device (cores/mem/save-data) — étend mid-range tablettes Android
 */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia(QUERY).matches) return true;
    return false;
  });

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  });

  const [lowEnd] = useState(isLowEndDevice);

  useEffect(() => {
    const m1 = window.matchMedia(QUERY);
    const m2 = window.matchMedia('(max-width: 768px)');
    const u1 = (e) => setReduced(e.matches);
    const u2 = (e) => setIsMobile(e.matches);
    m1.addEventListener('change', u1);
    m2.addEventListener('change', u2);
    return () => {
      m1.removeEventListener('change', u1);
      m2.removeEventListener('change', u2);
    };
  }, []);

  return {
    reduced,
    isMobile,
    lowEnd,
    allow3D: !reduced && !isMobile && !lowEnd,
  };
}
