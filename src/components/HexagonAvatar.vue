<template>
  <div class="avatar-container flex-center relative" :style="{ transform: `scale(${scale})` }">
    <img class="avatar" src="../assets/images/avatar2.png" alt="Avatar">
    <hexagon-polygon
        v-for="(i) in 5"
        class="hexagon"
        :color="color" 
        :size="300 + i*85"
        :strokeWidth="10/i" 
        :key="i"
        :style="{
            animationDuration: (2*i+10) + 's',
            animationDelay: (-(Math.random() * (i+13))) + 's',
            opacity: 1 - i*0.2,
        }"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import HexagonPolygon from './HexagonPolygon.vue';

defineProps({
  scale: {
    type: Number,
    default: 0.7
  },
  color: {
    type: String,
    default: '#00f0ff'
  }
});
</script>

<style scoped>

.avatar-container {
  perspective: 1500px;
  transform-style: preserve-3d;
}

/* Avatar centrale */
.avatar {
  width: 220px;
  z-index: 10;
  border-radius: 50%;
}

/* Esagoni */
.hexagon {
    transform-origin: center center; /* ruota intorno al centro */
    height: auto;
    mix-blend-mode: screen;
    filter: drop-shadow(0 0 20px #00EEFF77);
    animation: rotateHex linear infinite;
}


/* Rotazione combinata 3D intorno al centro */
@keyframes rotateHex {
  0%   { transform: rotateX(0deg) rotateY(0deg); }
  25%  { transform: rotateX(90deg) rotateY(180deg); }
  50%  { transform: rotateX(180deg) rotateY(360deg); }
  75%  { transform: rotateX(270deg) rotateY(540deg); }
  100% { transform: rotateX(360deg) rotateY(720deg); }
}


</style>




