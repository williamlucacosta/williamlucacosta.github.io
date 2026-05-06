<template>
    <div>
        <header class="pf-sec-head">
            <span class="pf-sec-eye">Audio Production</span>
            <h1 class="pf-sec-title">Soundtracks <em>&amp; Sound</em></h1>
            <p class="pf-sec-desc">Original compositions for games and media. Each track explores a different sonic direction.</p>
        </header>

        <section class="pf-audio">
            <article
                v-for="coll in groupedCollections"
                :key="coll.key"
                class="pf-coll"
            >
                <div class="pf-coll-head">
                    <div class="pf-coll-cover" :style="{ background: coll.gradient }">
                        <span class="pf-coll-cover-tag">{{ coll.tag }}</span>
                    </div>
                    <div class="pf-coll-info">
                        <span class="pf-coll-eye">{{ coll.kind }}</span>
                        <h2 class="pf-coll-title">{{ coll.title }}</h2>
                        <p class="pf-coll-sub">{{ coll.subtitle }}</p>
                        <div class="pf-coll-meta">
                            <span>{{ coll.tracks.length }} tracks</span>
                            <span class="pf-coll-meta-sep" aria-hidden="true"></span>
                            <span>{{ coll.yearRange }}</span>
                            <span class="pf-coll-meta-sep" aria-hidden="true"></span>
                            <span>{{ coll.totalDurationFmt }}</span>
                        </div>
                    </div>
                </div>

                <div class="pf-tlist">
                    <SoundtrackCard
                        v-for="track in coll.tracks"
                        :key="track.id"
                        :id="track.id"
                        :title="track.title"
                        :year="track.year"
                        :description="track.description"
                        :is-active="activeId === track.id"
                        :playing="isPlaying && activeId === track.id"
                        :progress="activeId === track.id && activeDuration > 0 ? currentTime / activeDuration : 0"
                        :seekable="activeId === track.id"
                        @select="selectTrack"
                        @seek-ratio="onSeekRatio"
                        @meta="onTrackMeta"
                    />
                </div>
            </article>

            <audio
                ref="audioEl"
                :src="activeAudioSrc"
                @timeupdate="onTimeUpdate"
                @ended="onEnded"
                @loadedmetadata="onLoadedMeta"
                @play="isPlaying = true"
                @pause="isPlaying = false"
                preload="metadata"
            ></audio>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import SoundtrackCard from '@/components/SoundtrackCard.vue';
import soundtracks from '@/assets/data/soundtracks.json';

type Track = typeof soundtracks[number] & { collection?: string };

const COLLECTIONS: Record<string, { title: string; subtitle: string; kind: string; tag: string; gradient: string }> = {
    'redshift': {
        title: 'Redshift OST',
        subtitle: 'Original soundtrack composed for Redshift — a frantic 2D arcade game.',
        kind: 'Game OST',
        tag: 'RX',
        gradient: 'linear-gradient(135deg, #1a2549 0%, #0c1734 50%, #050810 100%)',
    },
    'no-hope': {
        title: 'No Hope · Menu Loops',
        subtitle: 'Work-in-progress menu themes exploring an unsettling, atmospheric direction.',
        kind: 'Drafts',
        tag: 'NH',
        gradient: 'linear-gradient(135deg, #2a1230 0%, #160a26 50%, #07041a 100%)',
    },
};

const audioEl = ref<HTMLAudioElement | null>(null);
const activeId = ref<number | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const activeDuration = ref(0);

const trackDurations = ref<Record<number, number>>({});

const activeTrack = computed<Track | undefined>(() => {
    return soundtracks.find(s => s.id === activeId.value);
});

const activeAudioSrc = computed(() => {
    if (!activeTrack.value) return '';
    try {
        const fileName = activeTrack.value.title.replace(/ /g, '-');
        return require(`@/assets/audio/${fileName}.mp3`);
    } catch (e) {
        return '';
    }
});

const fmt = (sec: number) => {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const groupedCollections = computed(() => {
    const order = ['redshift', 'no-hope'];
    const byKey: Record<string, Track[]> = {};
    for (const t of soundtracks as Track[]) {
        const k = t.collection || 'misc';
        (byKey[k] = byKey[k] || []).push(t);
    }
    const groups = order
        .filter(k => byKey[k])
        .map(k => {
            const meta = COLLECTIONS[k];
            const tracks = byKey[k];
            const years = tracks.map(t => t.year);
            const minY = Math.min(...years);
            const maxY = Math.max(...years);
            const totalSec = tracks.reduce((sum, t) => sum + (trackDurations.value[t.id] || 0), 0);
            return {
                key: k,
                ...meta,
                tracks,
                yearRange: minY === maxY ? String(minY) : `${minY}—${maxY}`,
                totalDurationFmt: totalSec > 0 ? fmt(totalSec) : '—',
            };
        });
    return groups;
});

const selectTrack = async (id: number) => {
    if (activeId.value === id) {
        togglePlay();
        return;
    }
    activeId.value = id;
    currentTime.value = 0;
    activeDuration.value = 0;
    await nextTick();
    audioEl.value?.play().catch(() => { /* user gesture may be required */ });
};

const togglePlay = () => {
    const a = audioEl.value;
    if (!a) return;
    if (a.paused) a.play().catch(() => { /* */ });
    else a.pause();
};

const onTimeUpdate = () => {
    if (audioEl.value) currentTime.value = audioEl.value.currentTime;
};

const onLoadedMeta = () => {
    if (audioEl.value && isFinite(audioEl.value.duration)) {
        activeDuration.value = audioEl.value.duration;
        if (activeId.value !== null) {
            trackDurations.value[activeId.value] = audioEl.value.duration;
        }
    }
};

const onEnded = () => {
    isPlaying.value = false;
    if (activeId.value === null) return;
    const idx = soundtracks.findIndex(t => t.id === activeId.value);
    if (idx >= 0 && idx < soundtracks.length - 1) {
        selectTrack(soundtracks[idx + 1].id);
    }
};

const onSeekRatio = (ratio: number) => {
    if (audioEl.value && activeDuration.value) {
        audioEl.value.currentTime = Math.max(0, Math.min(1, ratio)) * activeDuration.value;
    }
};

const onTrackMeta = (payload: { id: number; duration: number }) => {
    if (payload.duration && isFinite(payload.duration)) {
        trackDurations.value[payload.id] = payload.duration;
    }
};

watch(activeAudioSrc, () => {
    currentTime.value = 0;
});
</script>
