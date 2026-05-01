<template>
    <div>
        <header class="pf-sec-head">
            <span class="pf-sec-eye">Selected Works · 2017 — 2024</span>
            <h1 class="pf-sec-title">Projects <em>&amp; Experiments</em></h1>
            <p class="pf-sec-desc">Games and interactive systems I've designed, built, and shipped. Each one an excuse to learn something new.</p>
        </header>

        <section class="pf-work">
            <div class="pf-grid">
                <BaseCard
                    v-for="project in projects"
                    :key="project.id"
                    type="projects"
                    :id="project.id"
                    :title="project.title"
                    :year="project.year"
                    :description="project.description"
                    :status="project.status"
                    :tags="project.tags"
                    routeName="game-project-details"
                />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue';
import projects from '@/assets/data/projects.json';
</script>
