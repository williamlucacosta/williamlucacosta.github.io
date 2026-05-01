<template>
    <div>
        <header class="pf-sec-head">
            <span class="pf-sec-eye">Audio Production</span>
            <h1 class="pf-sec-title">Soundtracks <em>&amp; Sound</em></h1>
            <p class="pf-sec-desc">Original compositions for games and media. Each track explores a different sonic direction.</p>
        </header>

        <section class="pf-audio">
            <!-- HERO PLAYER -->
            <div class="pf-hp" :class="{ live: isPlaying }">
                <div class="pf-hp-top">
                    <div class="pf-hp-state">
                        <span class="pf-hp-dot" :class="{ live: isPlaying }" aria-hidden="true"></span>
                        <span>{{ isPlaying ? 'Now Playing' : 'Ready' }}</span>
                    </div>
                    <div class="pf-hp-index">
                        {{ String(activeTrack.id).padStart(2, '0') }}
                        <span class="pf-hp-index-sep">/</span>
                        {{ String(soundtracks.length).padStart(2, '0') }}
                    </div>
                </div>

                <h2 class="pf-hp-title">{{ activeTrack.title }}</h2>

                <div class="pf-hp-meta">
                    <span class="pf-hp-chip">{{ activeTrack.year }}</span>
                    <span class="pf-hp-desc">{{ activeTrack.description }}</span>
                </div>

                <div class="pf-hp-wf">
                    <Waveform
                        :src="activeAudioSrc"
                        :progress="heroProgress"
                        :buckets="240"
                        variant="hero"
                        interactive
                        color="rgba(106, 166, 255, 0.18)"
                        color-played="#6aa6ff"
                        @seek="onSeek"
                        @meta="onActiveMeta"
                    />
                </div>

                <div class="pf-hp-time">
                    <span>{{ fmt(currentTime) }}</span>
                    <span class="pf-hp-time-bar" aria-hidden="true"></span>
                    <span>{{ fmt(activeDuration) }}</span>
                </div>

                <div class="pf-hp-bot">
                    <div class="pf-hp-tx">
                        <button class="pf-hp-tx-btn" type="button" :disabled="!hasPrev" @click="prevTrack" aria-label="Previous track">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                <polygon points="19 20 9 12 19 4 19 20" fill="currentColor"></polygon>
                                <line x1="5" y1="19" x2="5" y2="5"></line>
                            </svg>
                        </button>
                        <button class="pf-hp-tx-play" type="button" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
                            <svg v-if="!isPlaying" viewBox="0 0 24 24" aria-hidden="true">
                                <polygon points="6 4 20 12 6 20 6 4" fill="currentColor"></polygon>
                            </svg>
                            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="6" y="4" width="4" height="16" fill="currentColor"></rect>
                                <rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>
                            </svg>
                        </button>
                        <button class="pf-hp-tx-btn" type="button" :disabled="!hasNext" @click="nextTrack" aria-label="Next track">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                                <polygon points="5 4 15 12 5 20 5 4" fill="currentColor"></polygon>
                                <line x1="19" y1="5" x2="19" y2="19"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="pf-hp-spec">
                        <span class="pf-hp-spec-l">Source</span>
                        <span class="pf-hp-spec-v">FL Studio · 320 kbps</span>
                    </div>
                </div>
            </div>

            <!-- STATS STRIP -->
            <div class="pf-audio-stats">
                <div class="pf-stat">
                    <span class="pf-stat-l">Tracks</span>
                    <span class="pf-stat-v">{{ String(soundtracks.length).padStart(2, '0') }}</span>
                </div>
                <div class="pf-stat">
                    <span class="pf-stat-l">Span</span>
                    <span class="pf-stat-v">{{ yearRange }}</span>
                </div>
                <div class="pf-stat">
                    <span class="pf-stat-l">Genre</span>
                    <span class="pf-stat-v">Game OST · Ambient</span>
                </div>
                <div class="pf-stat">
                    <span class="pf-stat-l">Tools</span>
                    <span class="pf-stat-v">FL Studio</span>
                </div>
            </div>

            <!-- TRACK LIST -->
            <div class="pf-tlist">
                <SoundtrackCard
                    v-for="track in soundtracks"
                    :key="track.id"
                    :id="track.id"
                    :title="track.title"
                    :year="track.year"
                    :description="track.description"
                    :is-active="activeId === track.id"
                    :playing="isPlaying && activeId === track.id"
                    :progress="activeId === track.id && activeDuration > 0 ? currentTime / activeDuration : 0"
                    @select="selectTrack"
                />
            </div>

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
import Waveform from '@/components/AudioWaveform.vue';
import soundtracks from '@/assets/data/soundtracks.json';

const audioEl = ref<HTMLAudioElement | null>(null);
const activeId = ref<number>(soundtracks[0].id);
const isPlaying = ref(false);
const currentTime = ref(0);
const activeDuration = ref(0);

const activeTrack = computed(() => {
    const t = soundtracks.find(s => s.id === activeId.value);
    return t ?? soundtracks[0];
});

const activeAudioSrc = computed(() => {
    try {
        const fileName = activeTrack.value.title.replace(/ /g, '-');
        return require(`@/assets/audio/${fileName}.mp3`);
    } catch (e) {
        return '';
    }
});

const heroProgress = computed(() => {
    if (!activeDuration.value) return 0;
    return Math.max(0, Math.min(1, currentTime.value / activeDuration.value));
});

const yearRange = computed(() => {
    const years = soundtracks.map(s => s.year);
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? String(min) : `${min} — ${max}`;
});

const activeIdx = computed(() => soundtracks.findIndex(s => s.id === activeId.value));
const hasPrev = computed(() => activeIdx.value > 0);
const hasNext = computed(() => activeIdx.value < soundtracks.length - 1);

const fmt = (sec: number) => {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

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

const prevTrack = () => {
    if (!hasPrev.value) return;
    selectTrack(soundtracks[activeIdx.value - 1].id);
};

const nextTrack = () => {
    if (!hasNext.value) return;
    selectTrack(soundtracks[activeIdx.value + 1].id);
};

const onTimeUpdate = () => {
    if (audioEl.value) currentTime.value = audioEl.value.currentTime;
};

const onLoadedMeta = () => {
    if (audioEl.value && isFinite(audioEl.value.duration)) {
        activeDuration.value = audioEl.value.duration;
    }
};

const onEnded = () => {
    isPlaying.value = false;
    if (hasNext.value) nextTrack();
};

const onSeek = (t: number) => {
    if (audioEl.value) audioEl.value.currentTime = t;
};

const onActiveMeta = (payload: { duration: number }) => {
    if (!activeDuration.value && payload.duration) {
        activeDuration.value = payload.duration;
    }
};

watch(activeAudioSrc, () => {
    currentTime.value = 0;
});
</script>
