<template>
    <div class="project-details-page">
        <!-- Hero Banner -->
        <div class="hero-banner" v-if="currentProject">
            <img class="hero-img" :src="bannerImagePath" alt="Project Banner">
            <div class="hero-overlay"></div>
            <div class="hero-content container">
                <button class="back-btn" @click="router.back()">← Back</button>
                <h1 class="project-title">{{ currentProject.title }}</h1>
                <div class="meta-row">
                    <span class="year">{{ currentProject.year }}</span>
                    <div class="tags">
                        <span v-for="tag in currentProject.tags" :key="tag.id" class="tag">
                            {{ tag.title }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="content-container container" v-if="currentProject">
            <article class="project-article">
                <section v-for="section in currentProject.sections" :key="section.id" class="content-section">
                    <h2 class="section-title">{{ section.title }}</h2>
                    <p class="section-text">{{ section.description }}</p>
                    
                    <!-- Subsections -->
                    <div v-for="sub in section.subsections" :key="sub.id" class="subsection">
                        <h3 class="sub-title">{{ sub.title }}</h3>
                        <p class="sub-text">{{ sub.description }}</p>
                    </div>
                </section>
            </article>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import projects from '@/assets/data/projects.json';
import router from '@/router';

const props = defineProps<{ id: string | number }>();

const currentProject = computed(() => {
    return projects.find(p => p.id == Number(props.id));
});

const bannerImagePath = computed(() => {
    if (!currentProject.value) return '';
    const images = require.context("@/assets/images/projects", true, /\.png$|\.jpg$/);
    try {
        return images(`./${currentProject.value.title.toLowerCase()}/banner.jpg`);
    } catch (e) {
        return '';
    }
});
</script>

<style scoped>
.project-details-page {
    background: var(--bg-main);
    min-height: 100vh;
    padding-bottom: 80px;
}

.hero-banner {
    position: relative;
    height: 60vh;
    width: 100%;
    margin-bottom: 60px;
}

.hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--bg-main) 0%, rgba(5,5,5,0.4) 100%);
}

.hero-content {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    padding-bottom: 40px;
    z-index: 10;
}

.back-btn {
    background: none;
    border: none;
    color: var(--text-cloud);
    font-family: var(--font-mono);
    cursor: pointer;
    margin-bottom: 20px;
    padding: 0;
    font-size: 0.9rem;
    transition: color 0.2s;
}

.back-btn:hover {
    color: var(--text-white);
}

.project-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-white);
    margin: 0 0 16px 0;
    line-height: 1;
}

.meta-row {
    display: flex;
    align-items: center;
    gap: 20px;
}

.year {
    font-family: var(--font-mono);
    color: var(--text-white);
    background: var(--border-light);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
}

.tags {
    display: flex;
    gap: 8px;
}

.tag {
    font-size: 0.85rem;
    color: var(--text-cloud);
    border: 1px solid var(--border-light);
    padding: 2px 8px;
    border-radius: 12px;
}

/* Content */
.content-container {
    max-width: 800px; /* Editorial width */
}

.content-section {
    margin-bottom: 60px;
}

.section-title {
    font-size: 1.5rem;
    color: var(--text-white);
    margin-bottom: 16px;
    border-left: 2px solid var(--accent-blue);
    padding-left: 16px;
}

.section-text {
    font-size: 1.05rem;
    color: var(--text-cloud);
    line-height: 1.7;
    margin-bottom: 24px;
}

.sub-title {
    font-size: 1.1rem;
    color: var(--text-white);
    margin-bottom: 8px;
}

.sub-text {
    font-size: 0.95rem;
    color: var(--text-ash);
    margin-bottom: 24px;
}
</style>