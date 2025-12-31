<template>
    <a
        :href="href"
        target="_blank"
    >
        <img
            class="social-icon"
            :src="icon"
            :alt="alt"
        />
    </a>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
    href: string
    icon: string
    alt?: string
}>()
</script>

<style scoped>
.social-icon {
    width: 24px; /* Smaller, more elegant */
    transition: all 0.2s ease;
    opacity: 0.6;
    filter: invert(1); /* Assuming black source icons, make them white. If source is color, grayscale(100%) brightness(200%) works too */
}

a:hover .social-icon {
    transform: translateY(-2px);
    opacity: 1;
}
</style>