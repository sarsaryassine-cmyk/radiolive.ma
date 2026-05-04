/**
 * BorderBeam — 21st Magic / MagicUI
 * https://21st.dev (Magic UI border-beam)
 *
 * A small light packet circles the card's border using CSS `offset-path: rect(...)`.
 * Implemented with raw inline CSS (no Tailwind arbitrary values) so it survives any
 * dev-server / class-parser quirk and stays portable across browsers.
 */
export default function BorderBeam({
  className = '',
  size = 220,
  duration = 12,
  borderWidth = 1.5,
  anchor = 90,
  colorFrom = '#a78bfa',
  colorTo = '#22d3ee',
  delay = 0,
}) {
  return (
    <span
      aria-hidden="true"
      className={`border-beam ${className}`}
      style={{
        '--bb-size': `${size}px`,
        '--bb-duration': `${duration}s`,
        '--bb-anchor': `${anchor}%`,
        '--bb-border-width': `${borderWidth}px`,
        '--bb-color-from': colorFrom,
        '--bb-color-to': colorTo,
        '--bb-delay': `-${delay}s`,
      }}
    />
  );
}
