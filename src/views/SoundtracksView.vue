<script setup lang="ts">
import { ref } from 'vue';
import SoundtrackCard from '@/components/SoundtrackCard.vue';
import soundtracks from '@/assets/data/soundtracks.json';

const currentPlayingId = ref<number | null>(null);
</script>

<template>
    <div class="container app-page flex-center-col">
        <!-- Cinematic Header -->
        <header class="section-header-center">
            <span class="eyebrow">Audio Production</span>
            <h1 class="hero-title white">Soundtracks</h1>
            <p class="hero-subtitle">Original compositions for games and media.</p>
        </header>
      
        <!-- Linear List -->
        <div class="audio-list">
            <!-- Using index for delay -->
            <SoundtrackCard
                v-for="(track, index) in soundtracks"
                :key="track.id"
                :id="track.id"
                :active-id="currentPlayingId"
                :title="track.title"
                :year="track.year"
                :description="track.description"
                class="stagger-item"
                :style="{ animationDelay: `${index * 100}ms` }"
                @play-start="currentPlayingId = $event"
            />
        </div>
    </div>
</template>

<style scoped>
.app-page {
    padding-top: var(--nav-height);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.section-header-center {
    margin-top: 60px;
    margin-bottom: 80px;
    text-align: center;
    max-width: 600px;
}

.eyebrow {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--text-ash);
    display: block;
    margin-bottom: 16px;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    background: linear-gradient(to bottom, #FFF 20%, #AAA 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 16px 0;
}

.hero-subtitle {
    font-size: 1.1rem;
    color: var(--text-cloud);
    line-height: 1.5;
}

.audio-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 800px;
    padding-bottom: 120px;
}

/* Stagger Animation */
.stagger-item {
    opacity: 0;
    animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpFade {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>