/**
 * Radio Maroc — animation construction officielle (création utilisateur).
 *
 * Reproduction strictement fidèle du fichier source
 * `public/assets/radio-maroc-construction-animated.html` :
 *  - même viewBox -512 -512 1024 1024
 *  - mêmes classes CSS (.rm-mark, .pulse, .compassR, .starGlow)
 *  - mêmes paths via starD(200, 78) + pentagramD(200) précomputés
 *  - mêmes 32 ticks compass (un tous les 11.25°, majeurs tous les 4)
 *  - mêmes keyframes (définies dans globals.css)
 *
 * Le rendu est inline SVG plutôt qu'iframe — gain perf significatif :
 *  - 1 seul DOM contre N iframes (header, sidemenu, décoratif, loader)
 *  - pas de doc HTML supplémentaire à parser
 *  - keyframes mutualisées (CSS partagé)
 *  - taille mémoire réduite ~150 KB par instance
 *
 * Le fichier `public/assets/radio-maroc-construction-animated.html` reste
 * disponible pour usage standalone (embed externe, prévisualisation).
 */

const RM_OUTER = 200;
const RM_INNER = 78;

// Étoile rouge (starD 200, 78) — 10 sommets r=200 / r=78 alternés.
const STAR_D = (() => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? RM_OUTER : RM_INNER;
    d += (i ? 'L' : 'M') + ' ' + (r * Math.cos(a)).toFixed(2) + ' ' + (r * Math.sin(a)).toFixed(2) + ' ';
  }
  return d + 'Z';
})();

// Pentagramme vert (pentagramD 200) — 5 sommets, ordre [0,2,4,1,3].
const PENTA_D = (() => {
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    pts.push([RM_OUTER * Math.cos(a), RM_OUTER * Math.sin(a)]);
  }
  const order = [0, 2, 4, 1, 3];
  let d = 'M ' + pts[order[0]][0].toFixed(2) + ' ' + pts[order[0]][1].toFixed(2);
  for (let i = 1; i < 5; i++) d += ' L ' + pts[order[i]][0].toFixed(2) + ' ' + pts[order[i]][1].toFixed(2);
  return d + ' Z';
})();

// Ticks compas — 32 ticks (un tous les 11.25°), tous les 4 sont majeurs.
const TICKS = Array.from({ length: 32 }, (_, i) => {
  const a = (i * 2 * Math.PI) / 32 - Math.PI / 2;
  const major = i % 4 === 0;
  const inn = major ? 410 : 418;
  const out = 425;
  return {
    x1: (inn * Math.cos(a)).toFixed(2),
    y1: (inn * Math.sin(a)).toFixed(2),
    x2: (out * Math.cos(a)).toFixed(2),
    y2: (out * Math.sin(a)).toFixed(2),
    width: major ? 2.5 : 1.2,
    opacity: major ? 0.85 : 0.45,
  };
});

export default function RadioMarocLogo({
  size = 80,
  className = '',
  ariaLabel = 'Radio Maroc',
  ...rest
}) {
  return (
    <svg
      className={`rm-mark ${className}`}
      viewBox="-512 -512 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      width={size}
      height={size}
      style={{ display: 'block' }}
      {...rest}
    >
      <defs>
        <radialGradient id="rmAura" cx="0" cy="-40" r="0.7" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF2A3C" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#E60E1F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rmRingG" x1="0" y1="-1" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#2EE39F" stopOpacity="1" />
          <stop offset="100%" stopColor="#006233" stopOpacity="0.6" />
        </linearGradient>
        <path id="rmTextC" d="M -380 0 A 380 380 0 1 1 380 0 A 380 380 0 1 1 -380 0" />
      </defs>

      {/* aura rouge */}
      <circle cx="0" cy="0" r="500" fill="url(#rmAura)" />

      {/* compas (rotation) */}
      <g className="compassR" stroke="rgba(244,239,227,0.18)" fill="none">
        <circle r="430" strokeWidth="0.8" />
        <circle r="400" strokeWidth="0.4" strokeDasharray="2 6" />
      </g>

      {/* ticks compas */}
      <g stroke="rgba(244,239,227,0.35)" strokeLinecap="round">
        {TICKS.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeWidth={t.width} opacity={t.opacity} />
        ))}
      </g>

      {/* anneaux pulsants */}
      <g fill="none" stroke="url(#rmRingG)" strokeLinecap="round">
        <circle className="pulse pulse-1" r="320" strokeWidth="2.5" strokeDasharray="4 8" opacity="0.85" />
        <circle className="pulse pulse-2" r="265" strokeWidth="3" opacity="0.65" />
        <circle className="pulse pulse-3" r="215" strokeWidth="3" opacity="0.45" />
      </g>

      {/* arcs verts */}
      <g fill="none" stroke="#2EE39F" strokeLinecap="round" opacity="0.85">
        <path d="M -260 -120 A 286 286 0 0 1 -120 -260" strokeWidth="6" />
        <path d="M 260 120 A 286 286 0 0 1 120 260" strokeWidth="6" />
      </g>

      {/* étoile construction : pentagramme vert intérieur + contour étoile rouge */}
      <g className="starGlow">
        <path d={PENTA_D} fill="none" stroke="#2EE39F" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
        <path d={STAR_D} fill="none" stroke="#E60E1F" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
      </g>

      {/* centre */}
      <circle r="5" fill="#F4EFE3" />

      {/* point bas */}
      <circle cx="0" cy="360" r="4" fill="#F4EFE3" opacity="0.5" />

      {/* texte courbe */}
      <text fontFamily="Inter, system-ui, sans-serif" fontSize="22" letterSpacing="14" fill="rgba(244,239,227,0.45)">
        <textPath href="#rmTextC" startOffset="0">
          {'RADIO  MAROC  ·  BROADCASTING  ·  ON  AIR  ·  ESTD  ٢٠٢٦  ·  '}
        </textPath>
      </text>
    </svg>
  );
}
