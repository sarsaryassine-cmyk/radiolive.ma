/**
 * HeroScene — Aurora Nebula Shader Background
 *
 * Adapted from 21st Magic / AnoAI's "Animated Shader Background":
 *   a single full-screen quad with a fragment shader that loops 32× over
 *   an fbm-driven domain-warped aurora field.
 *
 * Customizations for Radio Maroc:
 *   - Color palette retuned to brand violet / cyan / pink
 *   - 32 iterations + 2 fbm octaves for steady 60 fps on mid-range laptops
 *   - DPR capped at 1 — shaders this heavy don't need retina sampling
 *   - Vivid output from frame 1: tanh(pow(o/25, 1.3)) × 1.6 (the original
 *     /100 with pow 1.6 crushed everything to near-black)
 *   - Pause when tab is hidden
 *
 * Vanilla WebGL2 — no Three.js, no R3F. Lean lazy chunk.
 */
import { useEffect, useRef } from 'react';

const VS = `#version 300 es
precision mediump float;
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const FS = `#version 300 es
precision highp float;
out vec4 outColor;

uniform float iTime;
uniform vec2 iResolution;

#define NUM_OCTAVES 2
#define ITER 32.0

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);
  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
    u.y
  );
  return res * res;
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.3;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.4;
  }
  return v;
}

void main() {
  vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
  vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) /
           iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
  vec2 v;
  vec4 o = vec4(0.0);

  float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

  for (float i = 0.0; i < ITER; i++) {
    v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5
          + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);

    float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / ITER));

    // Brand palette: violet / cyan / pink — retuned from the original blue/teal aurora
    vec4 auroraColors = vec4(
      0.45 + 0.45 * sin(i * 0.32 + iTime * 0.45),                  // R — pink/magenta hits
      0.20 + 0.55 * sin(i * 0.40 + iTime * 0.55 + 1.4),            // G — cyan flashes
      0.75 + 0.25 * sin(i * 0.20 + iTime * 0.30 + 0.8),            // B — violet base, always strong
      1.0
    );

    vec4 currentContribution = auroraColors *
      exp(sin(i * i + iTime * 0.8)) /
      length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));

    float thinness = smoothstep(0.0, 1.0, i / ITER) * 0.6;
    o += currentContribution * (1.0 + tailNoise * 0.8) * thinness;
  }

  o = tanh(pow(o / 25.0, vec4(1.3)));
  outColor = vec4(o.rgb * 1.6, 1.0);
}
`;

// ─── WebGL2 helpers ─────────────────────────────────────────────────────────
function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[HeroScene] shader compile error:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function link(gl, vsSrc, fsSrc) {
  const v = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const f = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  if (!v || !f) return null;
  const p = gl.createProgram();
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error('[HeroScene] program link error:', gl.getProgramInfoLog(p));
    gl.deleteShader(v); gl.deleteShader(f); gl.deleteProgram(p);
    return null;
  }
  gl.deleteShader(v); gl.deleteShader(f);
  return p;
}

// `colorA` / `colorB` are accepted but unused — the AnoAI palette is baked
// into the shader. They stay in the API so SceneBackground keeps passing the
// active-radio gradient without breakage.
export default function HeroScene({ colorA: _a, colorB: _b } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) container.removeChild(container.firstChild);

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });
    if (!gl) throw new Error('WebGL2 not supported');

    const program = link(gl, VS, FS);
    if (!program) throw new Error('shader compile failed');
    gl.useProgram(program);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'iTime');
    const uRes  = gl.getUniformLocation(program, 'iResolution');

    function resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let visible = true;
    const onVis = () => (visible = !document.hidden);
    document.addEventListener('visibilitychange', onVis);

    const t0 = performance.now();
    let frameId;
    function frame() {
      frameId = requestAnimationFrame(frame);
      if (!visible) return;
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform1f(uTime, (performance.now() - t0) * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    frame();

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('visibilitychange', onVis);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
