<template>
    <button
        class="pf-tr"
        :class="{ on: isActive, playing: isActive && playing }"
        type="button"
        @click="onRowClick"
    >
        <span class="pf-tnum">{{ String(id).padStart(2, '0') }}</span>

        <div class="pf-tinfo">
            <div class="pf-tt">{{ title }}</div>
            <div class="pf-tm">
                <span class="pf-tyr">{{ year }}</span>
                <span class="pf-tm-desc">{{ description }}</span>
            </div>
        </div>

        <div class="pf-twave-row">
            <Waveform
                :src="audioSrc"
                :progress="isActive ? progress : 0"
                :buckets="64"
                variant="row"
                :interactive="seekable"
                :color="isActive ? 'rgba(106, 166, 255, 0.22)' : 'rgba(238, 242, 251, 0.16)'"
                :color-played="isActive ? '#6aa6ff' : 'rgba(238, 242, 251, 0.4)'"
                @seek="onWaveSeek"
                @meta="onMeta"
            />
        </div>

        <span class="pf-tdur">{{ formattedDuration }}</span>

        <span class="pf-tp" aria-hidden="true">
            <span v-if="!(isActive && playing)" class="pf-tp-pi"></span>
            <span v-else class="pf-tp-pa"><span></span><span></span></span>
        </span>
    </button>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Waveform from '@/components/AudioWaveform.vue';

// eslint-disable-next-line no-undef
const props = defineProps<{
    id: number;
    title: string;
    year: number;
    description: string;
    isActive: boolean;
    playing: boolean;
    progress: number;
    seekable?: boolean;
}>();

// eslint-disable-next-line no-undef
const emit = defineEmits<{
    (e: 'select', id: number): void;
    (e: 'seek-ratio', ratio: number): void;
    (e: 'meta', payload: { id: number; duration: number }): void;
}>();

const decodedDuration = ref<number | null>(null);

const audioSrc = computed(() => {
    try {
        const fileName = props.title.replace(/ /g, '-');
        return require(`@/assets/audio/${fileName}.mp3`);
    } catch (e) {
        return '';
    }
});

const onMeta = (payload: { duration: number }) => {
    decodedDuration.value = payload.duration;
    emit('meta', { id: props.id, duration: payload.duration });
};

const onWaveSeek = (timeSec: number) => {
    if (!props.seekable || !decodedDuration.value) return;
    emit('seek-ratio', timeSec / decodedDuration.value);
};

const onRowClick = () => {
    emit('select', props.id);
};

const formattedDuration = computed(() => {
    const sec = decodedDuration.value;
    if (sec === null || !isFinite(sec)) return '—:—';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
});
</script>

<style scoped>
.pf-tm-desc {
    font-family: var(--fm);
    font-size: 11px;
    color: var(--text-3);
    letter-spacing: 0.02em;
    text-transform: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}

@media (max-width: 760px) {
    .pf-tm-desc {
        display: none;
    }
}
</style>
