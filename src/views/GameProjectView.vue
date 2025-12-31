<template>
    <div class="project-details-page" v-if="currentProject">
        <!-- Back Navigation (Floating) -->
        <nav class="floating-nav">
             <button class="back-btn" @click="router.back()">
                <span class="arrow">←</span> Back
             </button>
        </nav>

        <!-- Hero Section -->
        <header class="hero-section">
            <div class="hero-bg-wrapper">
                <img class="hero-img" :src="bannerImagePath" alt="Project Banner">
                <div class="hero-overlay"></div>
                <div class="hero-grain"></div>
            </div>
            
            <div class="hero-content container">
                <div class="hero-meta">
                    <span class="year-badge">{{ currentProject.year }}</span>
                    <span class="divider">/</span>
                    <span class="status-text">{{ currentProject.status }}</span>
                </div>
                <h1 class="project-title">{{ currentProject.title }}</h1>
                <p class="project-lead">{{ currentProject.description }}</p>
                
                <div class="scroll-indicator">
                    <span class="mouse">
                        <span class="wheel"></span>
                    </span>
                </div>
            </div>
        </header>

        <!-- Main Content Grid -->
        <main class="content-grid container">
            <!-- Sidebar (Sticky) -->
            <aside class="sidebar-col">
                <div class="sticky-wrapper">
                    <div class="sidebar-block">
                        <h3 class="sidebar-label">Tech Stack</h3>
                        <div class="tags-list">
                            <span v-for="tag in currentProject.tags" :key="tag.id" class="tech-pill">
                                {{ tag.title }}
                            </span>
                        </div>
                    </div>

                    <!-- Optional: Add more meta blocks here if available (e.g. Platform, Roles) -->
                    <div class="sidebar-block">
                        <h3 class="sidebar-label">Platform</h3>
                        <p class="sidebar-value">PC / Windows</p> <!-- Example static for now or add to JSON -->
                    </div>
                </div>
            </aside>

            <!-- Article Body -->
            <article class="article-col">
                <section v-for="section in currentProject.sections" :key="section.id" class="content-section">
                    <h2 class="section-title">
                        <span class="hash">#</span> {{ section.title }}
                    </h2>
                    <p class="section-text">{{ section.description }}</p>
                    
                    <!-- Subsections -->
                    <div v-for="sub in section.subsections" :key="sub.id" class="subsection">
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
/* Page Variables */
.project-details-page {
    background: #050505;
    min-height: 100vh;
    color: #EAEAEA;
    font-family: 'Inter', sans-serif; /* Ensuring a clean base font */
}

/* Floating Nav */
.floating-nav {
    position: fixed;
    top: 24px;
    left: 24px;
    z-index: 100;
}

.back-btn {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #FFF;
    padding: 10px 20px;
    border-radius: 100px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.back-btn:hover {
    background: #FFF;
    color: #000;
}

/* Hero Section */
.hero-section {
    position: relative;
    height: 85vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
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
    filter: brightness(0.6);
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #050505 0%, transparent 80%);
}

.hero-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
    pointer-events: none;
}

.hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
    max-width: 800px;
}

.hero-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.8rem;
    color: #AAA;
}

.year-badge {
    color: var(--accent-blue, #3B82F6);
    font-weight: 700;
}

.project-title {
    font-family: 'SF Pro Display', sans-serif;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.04em;
    margin: 0 0 24px 0;
    background: linear-gradient(180deg, #FFFFFF 0%, #AAAAAA 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.project-lead {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #CCC;
    max-width: 600px;
    margin: 0 auto;
}

.scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.7;
}

.mouse {
    width: 26px;
    height: 42px;
    border: 2px solid #FFF;
    border-radius: 20px;
    display: block;
    position: relative;
}

.wheel {
    width: 2px;
    height: 6px;
    background: #FFF;
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
    animation: scroll 1.5s infinite;
}

@keyframes scroll {
    0% { transform: translate(-50%, 0); opacity: 1; }
    100% { transform: translate(-50%, 12px); opacity: 0; }
}

/* Content Grid */
.content-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 60px;
    padding-top: 80px;
    padding-bottom: 120px;
    max-width: 1100px;
}

/* Sidebar */
.sidebar-col {
    position: relative;
}

.sticky-wrapper {
    position: sticky;
    top: 100px;
}

.sidebar-block {
    margin-bottom: 40px;
}

.sidebar-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #666;
    margin-bottom: 16px;
    font-weight: 600;
    border-bottom: 1px solid #222;
    padding-bottom: 8px;
}

.sidebar-value {
    font-size: 0.95rem;
    color: #DDD;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tech-pill {
    font-size: 0.8rem;
    background: #111;
    border: 1px solid #333;
    padding: 6px 12px;
    border-radius: 6px;
    color: #BBB;
}

/* Article */
.article-col {
    width: 100%;
}

.content-section {
    margin-bottom: 80px;
}

.section-title {
    font-size: 2rem;
    font-family: 'SF Pro Display', sans-serif;
    font-weight: 700;
    color: #FFF;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.hash {
    color: var(--accent-blue, #3B82F6);
    font-size: 1.5rem;
    opacity: 0.5;
}

.section-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #CCC;
    margin-bottom: 32px;
}

.sub-title {
    font-size: 1.25rem;
    color: #EEE;
    margin-bottom: 12px;
    font-weight: 600;
}

.sub-text {
    font-size: 1.05rem;
    line-height: 1.7;
    color: #999;
    margin-bottom: 32px;
}

/* Responsive */
@media (max-width: 900px) {
    .content-grid {
        grid-template-columns: 1fr;
        gap: 40px;
        padding-top: 60px;
    }
    
    .sticky-wrapper {
        position: static;
        display: flex;
        flex-direction: column; /* Stack details */
        gap: 24px;
        border-bottom: 1px solid #222;
        padding-bottom: 32px;
        margin-bottom: 40px;
    }
    
    .sidebar-block {
        margin-bottom: 0;
    }
    
    .project-title {
        font-size: 3rem; /* Smaller on mobile */
    }
    
    .hero-content {
        padding: 0 16px;
    }

    .back-btn {
        background: rgba(0,0,0,0.8); /* More visible on mobile */
    }
}
</style>