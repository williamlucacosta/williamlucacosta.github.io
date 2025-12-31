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
        
        <!-- Status Dot (Absolute Top Right) -->
        <div class="status-badge" v-if="status">
            <span class="status-dot" :class="status"></span>
            {{ status }}
        </div>
    </div>

    <!-- Info Block -->
    <div class="info-block">
        <div class="header-row">
            <h3 class="title-serif">{{ title }}</h3>
            <span class="badge-year">{{ year }}</span>
        </div>
        
        <!-- Tags Row -->
        <div class="tags-row" v-if="tags && tags.length > 0">
            <span v-for="tag in tags" :key="tag.id" class="tech-tag">
                {{ tag.title }}
            </span>
        </div>

        <p class="desc">{{ description }}</p>
        
        <!-- Hover CTA -->
        <div class="cta-row">
            <span class="cta-text">Explore</span>
            <span class="cta-icon">↗</span>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";

interface Tag {
    id: number;
    title: string;
}

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: number;
  type: string;
  title: string;
  description: string;
  year: number;
  routeName: string;
  status?: string;
  tags?: Tag[];
}>();

const COVER_FILENAME = "cover.jpg";

const images = require.context("@/assets/images/", true, /\.(png|jpe?g)$/);
const loadImg = (imgPath: string) => images(`./${props.type}/${imgPath}`);

const goToDetails = () => {
  router.push({ name: props.routeName, params: { id: props.id } });
};
</script>

<style scoped>
/* Cinematic Card Container */
.project-card {
    background: #050505;
    border: 1px solid rgba(255, 255, 255, 0.08); /* Subtle border */
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease-out;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.project-card:hover {
    background: #0A0A0A;
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}

/* Image Section */
.media-frame {
    width: 100%;
    aspect-ratio: 16/9; /* Cinematic Aspect Ratio */
    position: relative;
    overflow: hidden;
    background: #111;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.media-content {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.3s;
    filter: saturate(0.9);
}

.project-card:hover .media-content {
    transform: scale(1.08);
    filter: saturate(1.1);
}

.overlay-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%);
    opacity: 0.6;
    transition: opacity 0.3s;
}

.project-card:hover .overlay-gradient {
    opacity: 0.4;
}

/* Status Badge */
.status-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,0.1);
    color: #CCC;
    font-size: 0.7rem;
    padding: 4px 8px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #666;
}

.status-dot.completed { background: #10B981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
.status-dot.wip { background: #F59E0B; }

/* Info Section */
.info-block {
    padding: 24px 28px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
}

.title-serif {
    font-family: 'SF Pro Display', sans-serif; /* Fallback to sans for now, or ensure serif if desired */
    font-size: 1.4rem;
    font-weight: 700;
    color: #EEE;
    margin: 0;
    line-height: 1.1;
    transition: color 0.2s;
}

.project-card:hover .title-serif {
    color: #FFF;
    text-shadow: 0 0 20px rgba(255,255,255,0.2);
}

.badge-year {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #666;
    border: 1px solid #333;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 4px; /* Align visually with title */
}

/* Tags */
.tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.tech-tag {
    font-size: 0.7rem;
    color: #999;
    background: rgba(255, 255, 255, 0.05);
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: all 0.2s;
}

.project-card:hover .tech-tag {
    background: rgba(255, 255, 255, 0.1);
    color: #DDD;
}

.desc {
    font-size: 0.95rem;
    color: #888;
    line-height: 1.6;
    margin-bottom: 24px;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limit description lines */
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1; /* Pushes CTA to bottom */
}

/* CTA */
.cta-row {
    display: flex;
    align-items: center;
    justify-content: flex-end; /* Align right */
    gap: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #666;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.project-card:hover .cta-row {
    color: #FFF;
}

.cta-icon {
    font-size: 1rem;
    transition: transform 0.2s;
}

.project-card:hover .cta-icon {
    transform: translate(2px, -2px);
}
</style>
