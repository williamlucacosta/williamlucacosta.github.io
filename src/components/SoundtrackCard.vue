<template>
  <div class="soundtrack-card group">
    <div class="content-wrapper">
      <!-- Play Orb -->
      <button 
        class="play-button"
        @click="togglePlay"
        :class="{ 'playing': isPlaying }"
      >
        <div class="orb-core">
            <span v-if="!isPlaying" class="icon">▶</span>
            <span v-else class="icon">II</span>
        </div>
      </button>

      <!-- Track Data -->
      <div class="track-data">
        <h3 class="title-serif">{{ title }}</h3>
        <div class="meta-line">
            <span class="badge-year">{{ year }}</span>
            <span class="divider"></span>
            <span class="meta-desc">{{ description }}</span>
        </div>
      </div>

      <!-- Professional Equalizer -->
      <div class="eq-visualizer" v-if="isPlaying">
          <div class="bar" v-for="i in 5" :key="i" :style="{ animationDelay: `${i * 0.08}s` }"></div>
      </div>
    </div>
    
    <!-- Audio -->
    <audio ref="audioPlayer" :src="audioSrc" @ended="onEnded"></audio>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, computed } from "vue";

// Implicit defineProps (Macro)
// eslint-disable-next-line no-undef
const props = defineProps<{
  title: string;
  year: number;
  description: string;
}>();

const isPlaying = ref(false);
const audioPlayer = ref<HTMLAudioElement | null>(null);

const audioSrc = computed(() => {
    try {
        return require(`@/assets/audio/${props.title}.mp3`);
    } catch (e) {
        return "";
    }
});

const togglePlay = () => {
    if(!audioPlayer.value) return;
    if(isPlaying.value) {
        audioPlayer.value.pause();
    } else {
        audioPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
}

const onEnded = () => {
    isPlaying.value = false;
}

onUnmounted(() => {
    if(audioPlayer.value) audioPlayer.value.pause();
});
</script>

<style scoped>
/* Professional Card Container */
.soundtrack-card {
    position: relative;
    width: 100%;
    padding: 24px 32px;
    background: #0A0A0A; /* Solid Dark */
    border-radius: 12px;
    border: 1px solid #222; /* Subtle Border */
    transition: all 0.2s ease-out;
    cursor: pointer;
}

/* The Professional Blue Hover */
.soundtrack-card:hover {
    background: #101010;
    border-color: var(--accent-blue, #3B82F6);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15); /* Blue Glow Shadow */
}

/* Layout */
.content-wrapper {
    display: flex;
    align-items: center;
    gap: 32px;
}

/* Play Button */
.play-button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid #333;
    background: #111;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #FFF;
}

.soundtrack-card:hover .play-button {
    border-color: var(--accent-blue, #3B82F6);
    color: var(--accent-blue, #3B82F6);
}

.play-button.playing {
    background: var(--accent-blue, #3B82F6);
    border-color: var(--accent-blue, #3B82F6);
    color: #FFF;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
}

/* Typography */
.track-data {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.title-serif {
    font-family: 'SF Pro Display', sans-serif;
    font-size: 1.1rem;
    font-weight: 500;
    color: #FFF;
    margin: 0;
    transition: color 0.2s;
}

.soundtrack-card:hover .title-serif {
    color: var(--accent-blue, #3B82F6);
}

.meta-line {
    display: flex;
    align-items: center;
    gap: 12px;
}

.badge-year {
    font-size: 0.75rem;
    font-weight: 600;
    color: #666;
    background: #181818;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: var(--font-mono);
}

.divider {
    width: 2px;
    height: 2px;
    background: #333;
    border-radius: 50%;
}

.meta-desc {
    font-size: 0.9rem;
    color: #888;
}

/* EQ */
.eq-visualizer {
    display: flex;
    gap: 3px;
    align-items: center;
    height: 24px;
}

.bar {
    width: 3px;
    background: var(--accent-blue, #3B82F6);
    border-radius: 2px;
    animation: flow 0.8s infinite ease-in-out alternate;
    height: 6px;
}

@keyframes flow {
    0% { height: 6px; opacity: 0.5; }
    100% { height: 24px; opacity: 1; }
}
</style>
