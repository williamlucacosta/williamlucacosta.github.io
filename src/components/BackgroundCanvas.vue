<template>
    <canvas ref="canvasEl" class="pf-bg-canvas" :class="{ ready: isReady }" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvasEl = ref<HTMLCanvasElement | null>(null);
const isReady = ref(false);

const CFG = {
    bg: [0.006, 0.010, 0.020],
    c1: [0.060, 0.090, 0.175],
    c2: [0.032, 0.052, 0.110],
    c3: [0.012, 0.020, 0.044],
    hl: [0.140, 0.180, 0.275],
    intensity: 1.35,
    warp: 0.65,
    grain: 0.020,
    vignette: 0.65,
};

const VS = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FS = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_t;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform float u_warp;
uniform float u_grain;
uniform float u_vignette;
uniform float u_scroll;
uniform vec3 u_bg;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform vec3 u_hl;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}
float dwfbm(vec2 p, float t, float warp) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0) + t * 0.02),
                fbm(p + vec2(5.2, 1.3) - t * 0.025));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.03),
                fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.022));
  return fbm(p + warp * r);
}

void main() {
  vec2 res = u_res;
  vec2 uv = v_uv;
  vec2 p = (uv - 0.5) * vec2(res.x / res.y, 1.0);

  vec2 m = (u_mouse - 0.5) * vec2(res.x / res.y, 1.0);
  p -= m * 0.02;

  float scroll = u_scroll;
  p.y += scroll * 0.18;

  float t = u_t * 0.06;
  float sNear = scroll * 0.55;
  float sFar  = scroll * 0.30;

  float n1 = dwfbm(p * 1.20 + vec2(t * 0.10, -sNear), t, u_warp * 1.2);
  float n2 = dwfbm(p * 2.50 + vec2(0.0, t * 0.06 - sFar), t * 1.3, u_warp * 0.8);

  float vBias = smoothstep(1.0, 0.0, length(p * vec2(0.7, 1.1)));
  float topGlow = smoothstep(0.6, -0.2, p.y + scroll * 0.5) * 0.65;

  float field = n1 * 0.7 + n2 * 0.3;
  field = mix(field, field * vBias + topGlow * 0.35, 0.85);

  float k = clamp(field * u_intensity, 0.0, 1.0);
  vec3 col = u_bg;
  col = mix(col, u_c3, smoothstep(0.0, 0.25, k));
  col = mix(col, u_c2, smoothstep(0.20, 0.55, k));
  col = mix(col, u_c1, smoothstep(0.45, 0.80, k));
  col = mix(col, u_hl, smoothstep(0.75, 1.00, k) * 0.7);

  float md = length(p - m * 0.5);
  float halo = exp(-md * 4.5) * 0.10;
  col += u_hl * halo;

  float r = length((uv - 0.5) * vec2(1.4, 1.0));
  float vig = smoothstep(0.95, 0.20, r);
  col *= mix(1.0 - u_vignette, 1.0, vig);

  float g = hash(uv * res + u_t * 0.001) - 0.5;
  col += g * u_grain;

  col = pow(max(col, 0.0), vec3(0.95));

  gl_FragColor = vec4(col, 1.0);
}
`;

let rafId = 0;
let gl: WebGLRenderingContext | null = null;
let prog: WebGLProgram | null = null;
let uLoc: Record<string, WebGLUniformLocation | null> = {};
let startTs = 0;
let DPR = 1;
let scrollTarget = 0;
let scrollSmoothed = 0;
let resizeRaf = 0;
let isPaused = false;

function compile(g: WebGLRenderingContext, type: number, src: string) {
    const sh = g.createShader(type);
    if (!sh) return null;
    g.shaderSource(sh, src);
    g.compileShader(sh);
    if (!g.getShaderParameter(sh, g.COMPILE_STATUS)) {
        console.error('Shader compile error:', g.getShaderInfoLog(sh));
        g.deleteShader(sh);
        return null;
    }
    return sh;
}

function applyResize() {
    const c = canvasEl.value;
    if (!c || !gl) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cw = Math.max(1, Math.floor(W * DPR));
    const ch = Math.max(1, Math.floor(H * DPR));
    if (c.width !== cw || c.height !== ch) {
        c.width = cw;
        c.height = ch;
        c.style.width = W + 'px';
        c.style.height = H + 'px';
        gl.viewport(0, 0, cw, ch);
        gl.uniform2f(uLoc.res, cw, ch);
    }
}

function onResize() {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        applyResize();
    });
}

function setStaticUniforms() {
    if (!gl) return;
    gl.uniform2f(uLoc.mouse, 0.5, 0.5);
    gl.uniform1f(uLoc.intensity, CFG.intensity);
    gl.uniform1f(uLoc.warp, CFG.warp);
    gl.uniform1f(uLoc.grain, CFG.grain);
    gl.uniform1f(uLoc.vignette, CFG.vignette);
    gl.uniform3fv(uLoc.bg, CFG.bg);
    gl.uniform3fv(uLoc.c1, CFG.c1);
    gl.uniform3fv(uLoc.c2, CFG.c2);
    gl.uniform3fv(uLoc.c3, CFG.c3);
    gl.uniform3fv(uLoc.hl, CFG.hl);
}

function frame(now: number) {
    if (!gl || !prog) return;
    if (!now) now = performance.now();
    scrollSmoothed += (scrollTarget - scrollSmoothed) * 0.06;
    gl.uniform1f(uLoc.t, (now - startTs) * 0.001);
    gl.uniform1f(uLoc.scroll, scrollSmoothed);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    rafId = requestAnimationFrame(frame);
}

let scrollRaf = 0;
function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        const h = window.innerHeight || 1;
        scrollTarget = y / h;
    });
}

function onVisibilityChange() {
    if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        isPaused = true;
    } else if (isPaused && gl && prog) {
        isPaused = false;
        rafId = requestAnimationFrame(frame);
    }
}

function initCanvas2DFallback() {
    const c = canvasEl.value;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const draw = () => {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        const w = c.width, h = c.height;
        ctx.fillStyle = '#02040a';
        ctx.fillRect(0, 0, w, h);
        const g = ctx.createRadialGradient(w * 0.5, h * 0.2, 0, w * 0.5, h * 0.2, Math.max(w, h) * 0.7);
        g.addColorStop(0, 'rgba(20,30,60,0.9)');
        g.addColorStop(1, 'rgba(2,4,10,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
    };
    draw();
    window.addEventListener('resize', draw);
    isReady.value = true;
}

onMounted(() => {
    const c = canvasEl.value;
    if (!c) return;

    DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    gl = c.getContext('webgl', {
        antialias: false,
        premultipliedAlpha: false,
        alpha: false,
    });

    if (!gl) {
        initCanvas2DFallback();
        return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VS);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) {
        gl = null;
        initCanvas2DFallback();
        return;
    }

    prog = gl.createProgram();
    if (!prog) {
        gl = null;
        initCanvas2DFallback();
        return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(prog));
        gl = null;
        prog = null;
        initCanvas2DFallback();
        return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uLoc = {
        res: gl.getUniformLocation(prog, 'u_res'),
        t: gl.getUniformLocation(prog, 'u_t'),
        mouse: gl.getUniformLocation(prog, 'u_mouse'),
        intensity: gl.getUniformLocation(prog, 'u_intensity'),
        warp: gl.getUniformLocation(prog, 'u_warp'),
        grain: gl.getUniformLocation(prog, 'u_grain'),
        vignette: gl.getUniformLocation(prog, 'u_vignette'),
        scroll: gl.getUniformLocation(prog, 'u_scroll'),
        bg: gl.getUniformLocation(prog, 'u_bg'),
        c1: gl.getUniformLocation(prog, 'u_c1'),
        c2: gl.getUniformLocation(prog, 'u_c2'),
        c3: gl.getUniformLocation(prog, 'u_c3'),
        hl: gl.getUniformLocation(prog, 'u_hl'),
    };

    setStaticUniforms();
    applyResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    onScroll();
    scrollSmoothed = scrollTarget;

    startTs = performance.now();
    gl.clearColor(CFG.bg[0], CFG.bg[1], CFG.bg[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    rafId = requestAnimationFrame(frame);
    setTimeout(() => { isReady.value = true; }, 80);
});

onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId);
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibilityChange);
});
</script>

<style scoped>
.pf-bg-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 1.2s ease;
}
.pf-bg-canvas.ready {
    opacity: 1;
}
</style>
