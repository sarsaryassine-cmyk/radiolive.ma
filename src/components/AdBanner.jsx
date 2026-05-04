import { useEffect, useRef, useState } from 'react';
import useI18n from '../i18n/useI18n.js';

/**
 * AdSense banner — supports two layout modes:
 *
 *   1. Side / fixed-corner (default): pinned to one of four screen corners.
 *      position: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom'
 *      Hidden below 1536 px (`2xl`) so the radio grid keeps full width.
 *
 *   2. Inline (`inline` prop): centered block, flows in document order.
 *      Use it for a horizontal leaderboard 728×90 below content.
 *      Hidden below 768 px (`md`) where 728 px doesn't fit.
 *
 * Configuration:
 *   1. Set the publisher id (`ca-pub-XXXXXXXXXXXXXXXX`) in `index.html`.
 *   2. Pass each banner its own `slot` (10-digit AdSense ad-unit ID).
 *
 * Until configured, a discrete glass placeholder is shown — no layout shift
 * when the real ad eventually loads.
 */
const POSITION_CLASSES = {
  'left-top':     'left-3 top-[2rem]',
  'left-bottom':  'left-3 bottom-[2rem]',
  'right-top':    'right-3 top-[2rem]',
  'right-bottom': 'right-3 bottom-[2rem]',
};

export default function AdBanner({
  slot,
  client,
  position = 'right-top',
  inline = false,
  width,
  height,
  className = '',
}) {
  // Sensible defaults per mode
  const w = width  ?? (inline ? 728 : 120);
  const h = height ?? (inline ? 90  : 300);

  const { t } = useI18n();

  const insRef = useRef(null);
  const [, setPushed] = useState(false);

  // Resolve publisher id: prop wins, else read it from the AdSense <script>
  // tag in index.html (no need to pass it every time).
  const publisherId =
    client ||
    (typeof document !== 'undefined'
      ? document
          .querySelector('script[src*="adsbygoogle.js"]')
          ?.src.match(/client=([^&]+)/)?.[1]
      : null);

  useEffect(() => {
    if (!publisherId || !slot) return;
    if (typeof window === 'undefined') return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setPushed(true);
    } catch (err) {
      console.warn('[AdBanner] adsbygoogle push failed:', err);
    }
  }, [publisherId, slot]);

  const configured = Boolean(publisherId && slot);

  // Inline mode → centered block, flows with content
  if (inline) {
    return (
      <aside
        aria-label={t('ad.label')}
        className={`hidden md:flex mx-auto flex-col items-center gap-2 ${className}`}
        style={{ width: w, maxWidth: '100%' }}
      >
        <span className="text-[11px] sm:text-[10px] uppercase tracking-[0.18em] text-white/35">
          {t('ad.label')}
        </span>
        <div
          className="relative overflow-hidden rounded-2xl glass-strong w-full"
          style={{ height: h }}
        >
          {configured ? (
            <ins
              ref={insRef}
              className="adsbygoogle absolute inset-0"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={publisherId}
              data-ad-slot={slot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          ) : (
            <Placeholder width={w} height={h} />
          )}
        </div>
      </aside>
    );
  }

  // Side / fixed mode
  const pos = POSITION_CLASSES[position] || POSITION_CLASSES['right-top'];
  return (
    <aside
      aria-label={t('ad.label')}
      className={`hidden 2xl:flex pointer-events-auto fixed ${pos} z-20 flex-col items-center gap-2 ${className}`}
      style={{ width: w }}
    >
      <span className="text-[11px] sm:text-[10px] uppercase tracking-[0.18em] text-white/35">
        {t('ad.label')}
      </span>
      <div
        className="relative overflow-hidden rounded-2xl glass-strong"
        style={{ width: w, height: h }}
      >
        {configured ? (
          <ins
            ref={insRef}
            className="adsbygoogle absolute inset-0"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={publisherId}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="false"
          />
        ) : (
          <Placeholder width={w} height={h} />
        )}
      </div>
    </aside>
  );
}

function Placeholder({ width, height }) {
  const { t } = useI18n();
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-3"
      style={{
        background:
          'linear-gradient(135deg, rgba(124,77,255,0.08) 0%, rgba(56,189,248,0.05) 100%)',
      }}
    >
      <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-white/40"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 8h18M8 3v18" />
        </svg>
      </div>
      <p className="text-[11px] text-white/40 leading-snug">
        {t('ad.placeholder')}
        <br />
        <span className="text-white/25">{width}×{height}</span>
      </p>
    </div>
  );
}
