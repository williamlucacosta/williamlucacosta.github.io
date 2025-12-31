<template>
  <div class="project-card group" @click="goToDetails">
    <!-- Image Frame -->
    <div class="media-frame">
        <img
            class="media-content"
            :src="loadImg(`${title.toLowerCase()}/${COVER_FILENAME}`)"
            alt="cover"
        />
        <div class="overlay-gradient"></div>
    </div>

    <!-- Info Block -->
    <div class="info-block">
        <div class="header-row">
            <h3 class="title-serif">{{ title }}</h3>
            <span class="badge-year">{{ year }}</span>
        </div>
        <p class="desc">{{ description }}</p>
        
        <!-- Hover CTA -->
        <div class="cta-row">
            <span class="cta-text">View Case Study</span>
            <span class="cta-arrow">→</span>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import { defineProps } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: number;
  type: string;
  title: string;
  description: string;
  year: number;
  routeName: string;
  status?: string;
}>();

const COVER_FILENAME = "cover.jpg";

const images = require.context("@/assets/images/", true, /\.(png|jpe?g)$/);
const loadImg = (imgPath: string) => images(`./${props.type}/${imgPath}`);

const goToDetails = () => {
  router.push({ name: props.routeName, params: { id: props.id } });
};
</script>

<style scoped>
/* Professional Card Container */
.project-card {
    background: #0A0A0A;
    border: 1px solid #222;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease-out;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.project-card:hover {
    background: #101010;
    border-color: var(--accent-blue, #3B82F6);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px -10px rgba(59, 130, 246, 0.15);
}

/* Image Section */
.media-frame {
    width: 100%;
    aspect-ratio: 16/10;
    position: relative;
    overflow: hidden;
    background: #111;
    border-bottom: 1px solid #222;
}

.media-content {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.project-card:hover .media-content {
    transform: scale(1.05);
}

.overlay-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
    opacity: 0;
    transition: opacity 0.3s;
}

.project-card:hover .overlay-gradient {
    opacity: 1;
}

/* Info Section */
.info-block {
    padding: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.title-serif {
    font-family: 'SF Pro Display', sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #FFF;
    margin: 0;
    line-height: 1.2;
    transition: color 0.2s;
}

.project-card:hover .title-serif {
    color: var(--accent-blue, #3B82F6);
}

.badge-year {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #888;
    background: #181818;
    padding: 2px 8px;
    border-radius: 4px;
    white-space: nowrap;
}

.desc {
    font-size: 0.95rem;
    color: #888;
    line-height: 1.6;
    margin-bottom: 24px;
    flex: 1;
}

/* CTA */
.cta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--accent-blue, #3B82F6);
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
}

.project-card:hover .cta-row {
    opacity: 1;
    transform: translateY(0);
}

.cta-arrow {
    transition: transform 0.2s;
}

.project-card:hover .cta-arrow {
    transform: translateX(4px);
}
</style>
