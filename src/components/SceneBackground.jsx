import { lazy, Suspense, memo } from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '../hooks/useReducedMotion.js';
import ErrorBoundary from './ErrorBoundary.jsx';

const HeroScene = lazy(() => import('../three/HeroScene.jsx'));

/**
 * Full-screen ambient background. WebGL on desktop, animated CSS on mobile / reduced-motion.
 * Sits behind everything — pointer-events disabled, content stays fully readable
 * thanks to the dark vignette overlay.
 */
function SceneBackground({ accent = ['#7c4dff', '#38bdf8'] }) {
  const { allow3D } = useReducedMotion();
  const [a, b] = accent;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* shader takes the whole stage — opaque, so visible from frame 1 */}
      {allow3D ? (
        <ErrorBoundary tag="HeroScene" fallback={<CssAurora a={a} b={b} />}>
          <Suspense fallback={<CssAurora a={a} b={b} />}>
            <HeroScene colorA={a} colorB={b} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <>
          <div className="absolute inset-0 bg-mesh-dark opacity-95" />
          <CssAurora a={a} b={b} />
        </>
      )}

      {/* readability vignettes for cards — bottom darker, top almost untouched */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/40 to-ink-950/75 pointer-events-none" />
    </div>
  );
}

function CssAurora({ a, b }) {
  return (
    <>
      <motion.div
        className="aurora"
        style={{ width: 560, height: 560, top: -140, right: -140, background: a }}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora"
        style={{ width: 600, height: 600, bottom: -180, left: -160, background: b }}
        animate={{ x: [0, -50, 30, 0], y: [0, -40, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora"
        style={{ width: 360, height: 360, top: '40%', left: '50%', background: '#ec4899', opacity: 0.22 }}
        animate={{ x: [-40, 40, -40], y: [-30, 30, -30] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

export default memo(SceneBackground);
