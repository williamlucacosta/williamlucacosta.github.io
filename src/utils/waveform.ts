export interface AudioMeta {
    peaks: Float32Array;
    duration: number;
}

let _ctx: AudioContext | null = null;
const _cache = new Map<string, Promise<AudioMeta>>();

function getCtx(): AudioContext {
    if (!_ctx) {
        const Ctor = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
            || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) throw new Error('Web Audio API not supported');
        _ctx = new Ctor();
    }
    return _ctx;
}

function extractPeaks(channel: Float32Array, buckets: number): Float32Array {
    const blockSize = Math.max(1, Math.floor(channel.length / buckets));
    const out = new Float32Array(buckets);
    let max = 0;
    for (let i = 0; i < buckets; i++) {
        const start = i * blockSize;
        const end = Math.min(start + blockSize, channel.length);
        let peak = 0;
        for (let j = start; j < end; j++) {
            const v = channel[j] < 0 ? -channel[j] : channel[j];
            if (v > peak) peak = v;
        }
        out[i] = peak;
        if (peak > max) max = peak;
    }
    if (max > 0) {
        const norm = 1 / max;
        for (let i = 0; i < buckets; i++) out[i] *= norm;
    }
    return out;
}

export function loadAudioMeta(src: string, buckets = 220): Promise<AudioMeta> {
    const key = `${src}|${buckets}`;
    const cached = _cache.get(key);
    if (cached) return cached;

    const promise = (async () => {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`Failed to fetch audio: ${src}`);
        const buf = await res.arrayBuffer();
        const ctx = getCtx();
        const audio = await ctx.decodeAudioData(buf.slice(0));
        const channel = audio.getChannelData(0);
        const peaks = extractPeaks(channel, buckets);
        return { peaks, duration: audio.duration };
    })();

    _cache.set(key, promise);
    promise.catch(() => _cache.delete(key));
    return promise;
}
