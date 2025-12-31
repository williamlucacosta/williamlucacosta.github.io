<template>
    <div class="container app-page flex-center-col">
        <!-- Cinematic Header -->
        <header class="section-header-center">
            <span class="eyebrow">Interactive Experiences</span>
            <h1 class="hero-title white">Game Projects</h1>
            <p class="hero-subtitle">Selected works in game design and engineering.</p>
        </header>
      
        <!-- Grid -->
        <div class="projects-grid">
            <BaseCard
                v-for="(project, index) in projects"
                :key="project.id"
                type="projects"
                :id="project.id"
                :title="project.title"
                :year="project.year"
                :description="project.description"
                :tags="project.tags"
                routeName="game-project-details"
                class="stagger-item"
                :style="{ animationDelay: `${index * 100}ms` }"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue';
import projects from '@/assets/data/projects.json';
</script>

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
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 16px 0;
}

.hero-subtitle {
    font-size: 1.1rem;
    color: var(--text-cloud);
    line-height: 1.5;
}

.projects-grid {
    width: 100%;
    margin-bottom: 100px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 32px;
}

@media (max-width: 600px) {
    .projects-grid {
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 0 16px; /* Ensure edge padding */
    }
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