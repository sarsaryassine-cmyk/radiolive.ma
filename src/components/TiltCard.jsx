import { useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * 3D mouse-tilt wrapper, GPU-only, perspective-projected.
 * Pointer move = subtle rotateX/Y; pointer leave = spring-back to 0.
 * Light-glare overlay tracks the cursor.
 */
function TiltCard({ children, max = 10, glare = true, className = '' }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const springCfg = { stiffness: 220, damping: 22, mass: 0.4 };
  const sx = useSpring(px, springCfg);
  const sy = useSpring(py, springCfg);

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const lightX = useTransform(sx, [0, 1], ['0%', '100%']);
  const lightY = useTransform(sy, [0, 1], ['0%', '100%']);
  // Pré-calcul du glare gradient — useTransform DOIT être appelé
  // inconditionnellement (Rules of Hooks). On l'utilise ensuite seulement
  // si glare === true dans le JSX. Sans ça, monter un TiltCard avec
  // glare=false puis glare=true changeait le nombre de hooks → crash.
  const glareBackground = useTransform(
    [lightX, lightY],
    ([x, y]) => `radial-gradient(220px circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 60%)`
  );

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        perspective: 800,
      }}
      whileHover={{ z: 0 }}
      className={`relative will-change-transform ${className}`}
    >
      <div style={{ transform: 'translateZ(0)' }}>{children}</div>
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}

export default memo(TiltCard);
