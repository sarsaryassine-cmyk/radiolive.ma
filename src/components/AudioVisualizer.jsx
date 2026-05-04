import { useEffect, useRef, memo } from 'react';

/**
 * Procedural canvas visualizer.
 *
 * Live HLS / cross-origin streams cannot expose AnalyserNode without CORS,
 * so we drive bars with smooth pseudo-random noise that pulses while playing
 * and decays to a flat line when paused. Visually convincing, zero CORS pain,
 * runs on a single requestAnimationFrame.
 */
function AudioVisualizer({ active, accent = ['#7c4dff', '#38bdf8'], bars = 32 }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ raf: 0, last: 0, t: 0, levels: null, target: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (!stateRef.current.levels) {
      stateRef.current.levels = new Float32Array(bars).fill(0);
      stateRef.current.target = new Float32Array(bars).fill(0);
    }

    const draw = (now) => {
      const s = stateRef.current;
      const dt = Math.min(0.05, (now - s.last) / 1000 || 0);
      s.last = now;
      s.t += dt;

      const w = canvas.width;
      const h = canvas.height;
      const gap = 2 * dpr;
      const bw = (w - gap * (bars - 1)) / bars;

      // refresh targets every ~120 ms
      if ((s.t * 1000) % 120 < dt * 1000) {
        for (let i = 0; i < bars; i++) {
          if (active) {
            const seed = Math.sin(s.t * 2.3 + i * 0.7) * 0.5 + 0.5;
            const noise = Math.random() * 0.5;
            const center = 1 - Math.abs(i - bars / 2) / (bars / 2);
            s.target[i] = Math.max(0.06, seed * 0.55 + noise * 0.45) * (0.55 + center * 0.45);
          } else {
            s.target[i] = 0.04 + Math.random() * 0.03;
          }
        }
      }

      // ease towards targets
      const ease = active ? 0.18 : 0.08;
      for (let i = 0; i < bars; i++) {
        s.levels[i] += (s.target[i] - s.levels[i]) * ease;
      }

      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0, accent[0]);
      grad.addColorStop(1, accent[1]);

      for (let i = 0; i < bars; i++) {
        const v = Math.max(0.04, s.levels[i]);
        const bh = v * h * 0.95;
        const x = i * (bw + gap);
        const y = h - bh;
        ctx.fillStyle = grad;
        roundRect(ctx, x, y, bw, bh, Math.min(bw / 2, 4 * dpr));
        ctx.fill();
      }

      s.raf = requestAnimationFrame(draw);
    };

    stateRef.current.raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      ro.disconnect();
    };
  }, [active, accent, bars]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full"
      aria-hidden="true"
    />
  );
}

function roundRect(ctx, x, y, w, h, r) {
  if (h < 1 || w < 1) return;
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export default memo(AudioVisualizer);
