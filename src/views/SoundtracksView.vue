<template>
    <div>
        <header class="pf-sec-head">
            <span class="pf-sec-eye">Audio Production</span>
            <h1 class="pf-sec-title">Soundtracks</h1>
            <p class="pf-sec-desc">Original compositions for games and media.</p>
        </header>

        <section class="pf-audio">
            <div class="pf-tlist">
                <SoundtrackCard
                    v-for="track in soundtracks"
                    :key="track.id"
                    :id="track.id"
                    :active-id="currentPlayingId"
                    :title="track.title"
                    :year="track.year"
                    :description="track.description"
                    @play-start="currentPlayingId = $event"
                />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SoundtrackCard from '@/components/SoundtrackCard.vue';
import soundtracks from '@/assets/data/soundtracks.json';

const currentPlayingId = ref<number | null>(null);
</script>
