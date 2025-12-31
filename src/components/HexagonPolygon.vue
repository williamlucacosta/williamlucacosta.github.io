<template>
  <svg
    :width="size" 
    :height="size" 
    viewBox="-50 -50 585.688 585.688"
    stroke-linejoin="round"
    class="absolute"
    
  >
    <path 
      d="M242.846,485.691 L32.529,364.265 L32.535,121.422 L242.84,-0.005 L453.157,121.422 L453.153,364.267 Z"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  size: {
    type: Number,
    default: 600, // dimensione in px
  },
  strokeWidth: {
    type: Number,
    default: 10,
  },
  color: {
    type: String,
    default: '#000000', // colore di default (nero)
  }
})
</script>

<style scoped>

</style>
