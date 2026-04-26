<template>
  <div class="pf-tr" :class="{ on: isPlaying }" @click="togglePlay">
    <button
      class="pf-tp"
      type="button"
      :aria-label="isPlaying ? 'Pause' : 'Play'"
      @click.stop="togglePlay"
    >
      <span v-if="!isPlaying" class="pf-tp-pi" aria-hidden="true"></span>
      <span v-else class="pf-tp-pa" aria-hidden="true">
        <span></span><span></span>
      </span>
    </button>

    <div>
      <div class="pf-tt">{{ title }}</div>
      <div class="pf-tm">
        <span class="pf-tyr">{{ year }}</span>
        <span class="pf-tm-desc">{{ description }}</span>
      </div>
    </div>

    <span class="pf-tdur">{{ duration || '—:—' }}</span>

    <audio ref="audioPlayer" :src="audioSrc" @ended="onEnded" @loadedmetadata="onMeta"></audio>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, computed, watch } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: number;
  activeId: number | null;
  title: string;
  year: number;
  description: string;
}>();

// eslint-disable-next-line no-undef
const emit = defineEmits(['play-start']);

const isPlaying = ref(false);
const duration = ref<string>('');
const audioPlayer = ref<HTMLAudioElement | null>(null);

const audioSrc = computed(() => {
    try {
        const fileName = props.title.replace(/ /g, '-');
        return require(`@/assets/audio/${fileName}.mp3`);
    } catch (e) {
        return "";
    }
});

const togglePlay = () => {
    if (!audioPlayer.value) return;
    if (isPlaying.value) {
        audioPlayer.value.pause();
    } else {
        audioPlayer.value.play();
        emit('play-start', props.id);
    }
    isPlaying.value = !isPlaying.value;
};

watch(() => props.activeId, (newId) => {
    if (newId !== props.id && isPlaying.value) {
        if (audioPlayer.value) {
            audioPlayer.value.pause();
            audioPlayer.value.currentTime = 0;
        }
        isPlaying.value = false;
    }
});

const onEnded = () => { isPlaying.value = false; };

const onMeta = () => {
    const sec = audioPlayer.value?.duration ?? 0;
    if (!sec || !isFinite(sec)) return;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    duration.value = `${m}:${s}`;
};

onUnmounted(() => { audioPlayer.value?.pause(); });
</script>

<style scoped>
.pf-tm-desc {
    font-family: var(--fb);
    font-size: 11px;
    color: var(--text-3);
    letter-spacing: 0.02em;
    text-transform: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}
</style>
