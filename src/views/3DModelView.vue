<template>
    <div class="studio-page" v-if="currentProject">
        
        <!-- Left: Immersive 3D Space -->
        <div class="studio-viewport">
            <ModelViewer 
                :modelName="currentProject.title.toLowerCase()" 
                class="canvas-fill"
            />
            
            <!-- Floating Back Navigation -->
            <button class="nav-floater" @click="router.back()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span class="label">Library</span>
            </button>
            
            <div class="viewport-overlay-grad"></div>
        </div>

        <!-- Right: Data Deck -->
        <aside class="studio-sidebar custom-scrollbar">
            <!-- Header Group -->
            <div class="sidebar-header">
                <span class="project-year">{{ currentProject.year }}</span>
                <h1 class="project-headline">{{ currentProject.title }}</h1>
                <div class="tags-row">
                    <span v-for="tag in currentProject.tags" :key="tag.id" class="tech-badge">
                        {{ tag.title }}
                    </span>
                </div>
            </div>

            <div class="separator"></div>

            <!-- Main Description -->
            <div class="sidebar-section">
                <h2 class="section-label">Overview</h2>
                <p class="body-text">{{ currentProject.description }}</p>
            </div>

            <!-- Technical Specs Grid -->
            <div class="sidebar-section">
                <h2 class="section-label">Technical Specs</h2>
                <div class="specs-grid">
                    <div class="spec-item">
                        <span class="spec-label">Software</span>
                        <span class="spec-value">Blender / Substance</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Pipeline</span>
                        <span class="spec-value">PBR Metallic/Roughness</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Status</span>
                        <span class="spec-value highlight">{{ currentProject.status }}</span>
                    </div>
                </div>
            </div>

            <!-- Dynamic Sections -->
            <div class="sidebar-section" v-for="section in (currentProject as any).sections" :key="section.id">
                <h2 class="section-label">{{ section.title }}</h2>
                <p class="body-text mb-4">{{ section.description }}</p>
                
                <div v-for="sub in section.subsections" :key="sub.id" class="subsection">
                    <h3 class="sub-heading">{{ sub.title }}</h3>
                    <p class="body-text text-sm">{{ sub.description }}</p>
                </div>
            </div>

        </aside>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import models from '@/assets/data/models.json';
import ModelViewer from "@/components/ModelViewer.vue";
import router from '@/router';
import { defineProps } from 'vue';

// eslint-disable-next-line no-undef
const props = defineProps<{ id: string | number }>();

const currentProject = computed(() => {
    return models.find(m => m.id == Number(props.id));
});
</script>

<style scoped>
.studio-page {
    display: flex;
    height: 100vh;
    width: 100vw;
    background: #050505;
    overflow: hidden;
    padding-top: var(--nav-height);
}

/* LEFT: Viewport */
.studio-viewport {
    flex: 1;
    position: relative;
    background: radial-gradient(circle at center, #151515 0%, #000 100%);
    overflow: hidden;
}

.canvas-fill {
    width: 100%;
    height: 100%;
}

.viewport-overlay-grad {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at 50% 50%, transparent 80%, rgba(0,0,0,0.6) 100%);
}

.nav-floater {
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 8px 16px;
    color: var(--text-ash);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
}

.nav-floater:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
}

.nav-floater .icon {
    font-family: 'Material Icons', sans-serif; /* Fallback if available, or text */
    font-size: 1.1em;
}

/* RIGHT: Sidebar */
.studio-sidebar {
    width: 450px;
    background: #080808;
    border-left: 1px solid #222;
    overflow-y: auto;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

/* Responsive collapse */
@media (max-width: 1000px) {
    .studio-page {
        flex-direction: column;
        height: auto;
        overflow-y: auto;
    }
    
    .studio-viewport {
        height: 60vh;
        flex: none;
    }
    
    .studio-sidebar {
        width: 100%;
        height: auto;
        border-left: none;
        border-top: 1px solid #222;
    }
}

/* Typography & Content */
.sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.project-year {
    font-family: var(--font-mono);
    color: var(--accent-blue);
    font-size: 0.85rem;
}

.project-headline {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.1;
    color: #FFF;
    margin: 0;
}

.tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tech-badge {
    font-size: 0.75rem;
    color: #888;
    background: #151515;
    border: 1px solid #333;
    padding: 4px 10px;
    border-radius: 4px;
}

.separator {
    height: 1px;
    background: #222;
    width: 100%;
}

.section-label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 16px;
    font-weight: 600;
}

.body-text {
    font-size: 1rem;
    color: var(--text-cloud);
    line-height: 1.6;
    font-weight: 400;
}

.text-sm {
    font-size: 0.9rem;
}

.mb-4 {
    margin-bottom: 16px;
}

/* Specs Grid */
.specs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.spec-item {
    background: #111;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.spec-label {
    font-size: 0.7rem;
    color: #666;
    text-transform: uppercase;
}

.spec-value {
    font-size: 0.9rem;
    color: #DDD;
    font-weight: 500;
}

.spec-value.highlight {
    color: var(--accent-blue);
}

.sub-heading {
    color: #FFF;
    font-size: 1.1rem;
    margin-bottom: 8px;
    font-weight: 600;
}

.subsection {
    margin-bottom: 24px;
    border-left: 2px solid #333;
    padding-left: 16px;
}
</style>