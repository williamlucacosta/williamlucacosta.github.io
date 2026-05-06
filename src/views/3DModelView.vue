<template>
    <div class="studio-page" v-if="currentProject">
        <!-- Left: Immersive 3D viewport -->
        <div class="studio-viewport">
            <ModelViewer
                :modelName="currentProject.title.toLowerCase()"
                class="canvas-fill"
            />

            <button class="nav-floater" @click="router.back()">
                <span class="arr" aria-hidden="true">←</span>
                <span class="label">Library</span>
            </button>

            <div class="viewport-overlay-grad" aria-hidden="true"></div>
        </div>

        <!-- Right: Data deck -->
        <aside class="studio-sidebar">
            <div class="sidebar-header">
                <span class="project-year">{{ currentProject.year }}</span>
                <h1 class="project-headline">{{ currentProject.title }}</h1>
                <div class="tags-row">
                    <span
                        v-for="(tag, idx) in currentProject.tags"
                        :key="tag.id"
                        class="pf-tag"
                        :class="{ b: idx === 0 }"
                    >{{ tag.title }}</span>
                </div>
            </div>

            <div class="separator"></div>

            <div class="sidebar-section">
                <h2 class="section-label">Overview</h2>
                <p class="body-text">{{ currentProject.description }}</p>
            </div>

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

// eslint-disable-next-line no-undef
const props = defineProps<{ id: string | number }>();

const currentProject = computed(() => {
    return models.find(m => m.id == Number(props.id));
});
</script>

<style scoped>
/* Page fills exactly the viewport area below the sticky nav (58px) */
.studio-page {
    display: flex;
    width: 100%;
    height: calc(100vh - 58px);
    color: var(--text);
    overflow: hidden;
}

/* LEFT — viewport (transparent, aurora bg shows through) */
.studio-viewport {
    flex: 1;
    position: relative;
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
    background: radial-gradient(ellipse 90% 75% at 50% 55%, transparent 60%, rgba(4, 5, 10, 0.45) 100%);
}

/* Floating back button — hairline + sapphire on hover */
.nav-floater {
    position: absolute;
    top: 18px;
    left: 18px;
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

/* RIGHT — sidebar (own scroll, no whole-page scroll) */
.studio-sidebar {
    width: 420px;
    flex-shrink: 0;
    background: var(--surface);
    border-left: 1px solid var(--border);
    overflow-y: auto;
    padding: 40px 36px;
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.studio-sidebar::-webkit-scrollbar {
    width: 6px;
}
.studio-sidebar::-webkit-scrollbar-thumb {
    background: var(--border-h);
    border-radius: 3px;
}

/* Header */
.sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.project-year {
    font-family: var(--fm);
    font-size: 10px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--accent-2);
}

.project-headline {
    font-family: var(--fh);
    font-size: 2.4rem;
    font-weight: 600;
    line-height: 1.04;
    letter-spacing: -0.028em;
    margin: 0;
    color: var(--text);
    background: linear-gradient(170deg, #ffffff 32%, rgba(220, 232, 255, 0.55));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

/* Separator */
.separator {
    height: 1px;
    background: var(--border);
    width: 100%;
}

/* Sections */
.section-label {
    font-family: var(--fm);
    font-size: 9px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 14px;
    font-weight: 400;
}

.body-text {
    font-family: var(--fb);
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.65;
}

.body-text.text-sm { font-size: 12px; }
.body-text.mb-4 { margin-bottom: 14px; }

/* Specs grid */
.specs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.spec-item {
    background: var(--surface-h);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.spec-label {
    font-family: var(--fm);
    font-size: 8.5px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--accent-2);
}

.spec-value {
    font-family: var(--fb);
    font-size: 12.5px;
    color: var(--text);
    font-weight: 400;
}

.spec-value.highlight {
    color: var(--accent-2);
    font-family: var(--fm);
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

/* Subsections */
.subsection {
    margin-top: 14px;
    border-left: 1px solid var(--border-h);
    padding-left: 14px;
}

.sub-heading {
    font-family: var(--fh);
    font-weight: 600;
    font-size: 14px;
    letter-spacing: -0.005em;
    color: var(--text);
    margin: 0 0 6px 0;
}

/* Responsive */
@media (max-width: 1000px) {
    .studio-page {
        flex-direction: column;
        height: auto;
        min-height: calc(100vh - 58px);
        overflow: visible;
    }

    .studio-viewport {
        height: 56vh;
        flex: none;
    }

    .studio-sidebar {
        width: 100%;
        border-left: none;
        border-top: 1px solid var(--border);
        padding: 32px 24px;
    }
}
</style>
