import { useEffect } from 'react';

/**
 * Initializes a global Lenis smooth-scroll instance.
 * Lenis is dynamically imported only on the first render where smooth scroll
 * is enabled — keeps it out of the initial bundle for users who'd skip it
 * (mobile / reduced-motion).
 */
export default function useLenis({ enabled = true } = {}) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let lenis;
    let frameId;
    let cancelled = false;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      const raf = (time) => {
        lenis.raf(time);
        frameId = requestAnimationFrame(raf);
      };
      frameId = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      if (frameId) cancelAnimationFrame(frameId);
      if (lenis) lenis.destroy();
    };
  }, [enabled]);
}
