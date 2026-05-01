<script lang="ts">
/* eslint-disable vue/multi-word-component-names */
export default { name: 'AudioWaveform' };
</script>

<template>
    <div ref="rootEl" class="pf-wf" :class="{ interactive, ready: hasPeaks }">
        <canvas ref="canvasEl" class="pf-wf-c" @click="onClick"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { loadAudioMeta } from '@/utils/waveform';

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
    src: string;
    buckets?: number;
    progress?: number;
    interactive?: boolean;
    variant?: 'hero' | 'row';
    color?: string;
    colorPlayed?: string;
}>(), {
    buckets: 0,
    progress: 0,
    interactive: false,
    variant: 'row',
    color: 'rgba(238, 242, 251, 0.18)',
    colorPlayed: '#6aa6ff',
});

// eslint-disable-next-line no-undef
const emit = defineEmits<{ (e: 'seek', t: number): void; (e: 'meta', payload: { duration: number }): void }>();

const rootEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);
const hasPeaks = ref(false);
let peaks: Float32Array | null = null;
let duration = 0;
let ro: ResizeObserver | null = null;

const effectiveBuckets = computed(() => props.buckets || (props.variant === 'hero' ? 240 : 64));

async function load() {
    if (!props.src) return;
    hasPeaks.value = false;
    peaks = null;
    try {
        const meta = await loadAudioMeta(props.src, effectiveBuckets.value);
        peaks = meta.peaks;
        duration = meta.duration;
        hasPeaks.value = true;
        emit('meta', { duration });
        draw();
    } catch (e) {
        // silent — fallback to placeholder
    }
}

function draw() {
    const c = canvasEl.value;
    const r = rootEl.value;
    if (!c || !r) return;
    const w = r.clientWidth;
    const h = r.clientHeight;
    if (w === 0 || h === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + 'px';
    c.style.height = h + 'px';
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    if (!peaks) {
        ctx.fillStyle = props.color;
        ctx.fillRect(0, h / 2 - 0.5, w, 1);
        return;
    }

    const n = peaks.length;
    const barTotal = w / n;
    const gapPx = props.variant === 'hero' ? 1.5 : 0.7;
    const barW = Math.max(1, barTotal - gapPx);
    const playW = Math.max(0, Math.min(1, props.progress)) * w;
    const minH = props.variant === 'hero' ? 2 : 1.5;
    const heightFactor = props.variant === 'hero' ? 0.95 : 0.85;

    for (let i = 0; i < n; i++) {
        const x = i * barTotal;
        const peak = peaks[i];
        const eased = Math.pow(peak, 0.7);
        const bh = Math.max(minH, eased * h * heightFactor);
        const y = (h - bh) / 2;
        const barCenter = x + barW / 2;
        const isPlayed = barCenter <= playW;
        ctx.fillStyle = isPlayed ? props.colorPlayed : props.color;
        ctx.fillRect(x, y, barW, bh);
    }

    if (props.progress > 0 && props.progress < 1 && props.variant === 'hero') {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillRect(playW - 0.6, 0, 1.2, h);
    }
}

function onClick(e: MouseEvent) {
    if (!props.interactive || !duration) return;
    const r = rootEl.value;
    if (!r) return;
    const rect = r.getBoundingClientRect();
    const t = (e.clientX - rect.left) / rect.width;
    emit('seek', Math.max(0, Math.min(1, t)) * duration);
}

watch(() => props.src, () => load(), { immediate: false });
watch(() => [props.progress, props.color, props.colorPlayed], () => draw());

onMounted(() => {
    load();
    if ('ResizeObserver' in window && rootEl.value) {
        ro = new ResizeObserver(() => draw());
        ro.observe(rootEl.value);
    } else {
        window.addEventListener('resize', draw);
    }
});

onBeforeUnmount(() => {
    ro?.disconnect();
    window.removeEventListener('resize', draw);
});
</script>

<style scoped>
.pf-wf {
    position: relative;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease;
}
.pf-wf.ready {
    opacity: 1;
}
.pf-wf.interactive {
    cursor: pointer;
}
.pf-wf-c {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
