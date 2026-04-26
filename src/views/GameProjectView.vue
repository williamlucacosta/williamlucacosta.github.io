<template>
    <div class="project-details-page" v-if="currentProject">
        <!-- Floating back -->
        <button class="nav-floater" @click="router.back()">
            <span class="arr" aria-hidden="true">←</span>
            <span class="label">Projects</span>
        </button>

        <!-- Hero / Banner -->
        <header class="hero-section">
            <div class="hero-bg-wrapper" aria-hidden="true">
                <img v-if="bannerImagePath" class="hero-img" :src="bannerImagePath" alt="" />
                <div class="hero-radial"></div>
                <div class="hero-overlay"></div>
            </div>

            <div class="hero-content">
                <div class="hero-eyebrow">
                    <span class="hero-year">{{ currentProject.year }}</span>
                    <span class="hero-sep" aria-hidden="true"></span>
                    <span class="hero-status">{{ currentProject.status }}</span>
                </div>

                <h1 class="project-title">{{ currentProject.title }}</h1>
                <p class="project-lead">{{ currentProject.description }}</p>
            </div>
        </header>

        <!-- Body grid -->
        <main class="content-grid">
            <aside class="sidebar-col">
                <div class="sticky-wrapper">
                    <div class="sidebar-block">
                        <h3 class="sidebar-label">Tech Stack</h3>
                        <div class="tags-list">
                            <span
                                v-for="(tag, idx) in currentProject.tags"
                                :key="tag.id"
                                class="pf-tag"
                                :class="{ b: idx === 0 }"
                            >{{ tag.title }}</span>
                        </div>
                    </div>

                    <div class="sidebar-block">
                        <h3 class="sidebar-label">Platform</h3>
                        <p class="sidebar-value">PC / Windows</p>
                    </div>
                </div>
            </aside>

            <article class="article-col">
                <section
                    v-for="section in currentProject.sections"
                    :key="section.id"
                    class="content-section"
                >
                    <h2 class="section-title">
                        <span class="hash" aria-hidden="true">#</span> {{ section.title }}
                    </h2>
                    <p v-if="section.description" class="section-text">{{ section.description }}</p>

                    <div
                        v-for="sub in section.subsections"
                        :key="sub.id"
                        class="subsection"
                    >
                        <h3 class="sub-title">{{ sub.title }}</h3>
                        <p class="sub-text">{{ sub.description }}</p>
                    </div>
                </section>
            </article>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import projects from '@/assets/data/projects.json';
import router from '@/router';

// eslint-disable-next-line no-undef
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
    background: var(--bg);
    color: var(--text);
    min-height: calc(100vh - 58px);
    font-family: var(--fb);
    position: relative;
}

/* Floating back — same as 3D model page */
.nav-floater {
    position: fixed;
    top: 76px;
    left: 24px;
    z-index: 50;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: var(--chip-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--border-h);
    color: var(--text-2);
    font-family: var(--fm);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.nav-floater:hover {
    color: var(--accent-2);
    border-color: var(--accent-b);
    background: rgba(61, 139, 255, 0.06);
}

.nav-floater .arr {
    display: inline-block;
    transition: transform 0.25s ease;
}

.nav-floater:hover .arr {
    transform: translateX(-3px);
}

/* Hero */
.hero-section {
    position: relative;
    min-height: 70vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 100px 52px 80px;
    text-align: center;
}

.hero-bg-wrapper {
    position: absolute;
    inset: 0;
    z-index: 1;
}

.hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.85) brightness(0.55);
    opacity: 0.7;
}

.hero-radial {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 60% 55% at 50% 50%, rgba(61, 139, 255, 0.10), transparent 70%);
    pointer-events: none;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--bg) 0%, rgba(7, 7, 9, 0.4) 50%, transparent 100%);
}

.hero-content {
    position: relative;
    z-index: 10;
    max-width: 820px;
    width: 100%;
}

.hero-eyebrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin-bottom: 24px;
    font-family: var(--fm);
    font-size: 10px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
}

.hero-year {
    color: var(--accent-2);
}

.hero-status {
    color: var(--text-2);
}

.hero-sep {
    width: 1px;
    height: 11px;
    background: var(--border-h);
    display: inline-block;
}

.project-title {
    font-family: var(--fh);
    font-size: clamp(3rem, 8vw, 5.5rem);
    font-weight: 600;
    line-height: 0.96;
    letter-spacing: -0.038em;
    margin: 0 0 22px 0;
    background: linear-gradient(170deg, #ffffff 32%, rgba(220, 232, 255, 0.55));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.project-lead {
    font-family: var(--fb);
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-2);
    max-width: 600px;
    margin: 0 auto;
}

/* Content grid */
.content-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 60px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 80px 52px 120px;
}

.sidebar-col {
    position: relative;
}

.sticky-wrapper {
    position: sticky;
    top: 90px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.sidebar-block { display: flex; flex-direction: column; gap: 14px; }

.sidebar-label {
    font-family: var(--fm);
    font-size: 9px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--text-3);
    font-weight: 400;
    margin: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
}

.sidebar-value {
    font-family: var(--fb);
    font-size: 13px;
    color: var(--text-2);
    margin: 0;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

/* Article */
.article-col {
    width: 100%;
    min-width: 0;
}

.content-section {
    margin-bottom: 60px;
}

.content-section:last-child {
    margin-bottom: 0;
}

.section-title {
    font-family: var(--fh);
    font-size: 1.8rem;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.018em;
    color: var(--text);
    margin: 0 0 20px 0;
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.hash {
    color: var(--accent-2);
    font-family: var(--fm);
    font-weight: 400;
    font-size: 1rem;
}

.section-text {
    font-family: var(--fb);
    font-size: 14px;
    line-height: 1.75;
    color: var(--text-2);
    margin: 0 0 28px 0;
}

.subsection {
    border-left: 1px solid var(--border-h);
    padding-left: 18px;
    margin-bottom: 24px;
}

.subsection:last-child { margin-bottom: 0; }

.sub-title {
    font-family: var(--fh);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--text);
    margin: 0 0 8px 0;
}

.sub-text {
    font-family: var(--fb);
    font-size: 13px;
    line-height: 1.65;
    color: var(--text-2);
    margin: 0;
}

/* Responsive */
@media (max-width: 900px) {
    .hero-section {
        min-height: 60vh;
        padding: 80px 24px 60px;
    }

    .content-grid {
        grid-template-columns: 1fr;
        gap: 40px;
        padding: 60px 24px 100px;
    }

    .sticky-wrapper {
        position: static;
        gap: 24px;
        padding-bottom: 32px;
        border-bottom: 1px solid var(--border);
    }

    .nav-floater {
        top: 70px;
        left: 16px;
    }
}
</style>
