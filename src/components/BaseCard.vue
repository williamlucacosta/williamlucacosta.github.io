<template>
  <div class="pf-card" @click="goToDetails">
    <div class="pf-cv">
      <span class="pf-cv-mark" aria-hidden="true">{{ markLetters }}</span>
      <img
        v-if="coverSrc"
        class="pf-cv-img"
        :src="coverSrc"
        :alt="title + ' cover'"
      />
      <div class="pf-cv-grad" aria-hidden="true"></div>

      <span class="pf-cv-yr">{{ year }}</span>

      <div class="pf-cv-status" v-if="status">
        <span class="pf-cv-dot" :class="status"></span>
        <span>{{ status }}</span>
      </div>
    </div>

    <div class="pf-cb">
      <span class="pf-cb-eye">{{ type === 'projects' ? 'Project' : 'Model' }}</span>
      <h3 class="pf-cb-title">{{ title }}</h3>

      <div class="pf-tags" v-if="tags && tags.length">
        <span
          v-for="(tag, idx) in tags"
          :key="tag.id"
          class="pf-tag"
          :class="{ b: idx === 0 }"
        >{{ tag.title }}</span>
      </div>

      <p class="pf-cb-desc">{{ description }}</p>

      <span class="pf-cb-cta">
        Explore <span class="pf-cb-arr" aria-hidden="true">↗</span>
      </span>
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

const coverSrc = (() => {
  try {
    return images(`./${props.type}/${props.title.toLowerCase()}/${COVER_FILENAME}`);
  } catch (e) {
    return "";
  }
})();

const markLetters = (() => {
  const t = (props.title || '').trim();
  if (!t) return '';
  const parts = t.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
})();

const goToDetails = () => {
  router.push({ name: props.routeName, params: { id: props.id } });
};
</script>
