import { memo } from 'react';
import useIconChain from '../hooks/useIconChain.js';

const SIZE_CLASSES = {
  sm: 'h-10 w-10 text-base',
  md: 'h-16 w-16 text-2xl',
  lg: 'h-24 w-24 text-3xl',
  xl: 'h-32 w-32 text-4xl',
};

const initialsOf = (name) =>
  (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/**
 * Radio logo with a multi-source fallback chain. When an icon is missing or
 * fails to load, useIconChain automatically tries Google's favicon service,
 * DuckDuckGo's, then the radio's own /favicon.ico, and finally renders an
 * initials-on-gradient fallback. Successful resolutions are cached in
 * localStorage so subsequent visits skip the chain.
 */
function RadioIcon({ radio, size = 'md', playing = false }) {
  const { src, onError, onLoad, exhausted } = useIconChain(radio);

  return (
    <div
      className={`relative ${SIZE_CLASSES[size]} flex-shrink-0 overflow-hidden rounded-2xl shadow-card`}
      style={{
        background: `linear-gradient(135deg, ${radio.gradientFrom}, ${radio.gradientTo})`,
      }}
    >
      {!exhausted ? (
        <img
          src={src}
          alt={radio.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
          onError={onError}
          onLoad={onLoad}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-white/95">
          {initialsOf(radio.name)}
        </div>
      )}
      {playing && (
        <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-2">
          <div className="flex items-end gap-0.5 h-4">
            <span className="eq-bar" />
            <span className="eq-bar" />
            <span className="eq-bar" />
            <span className="eq-bar" />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(RadioIcon);
