<template>
	<div class="app flex justify-center" @click="closeNavbar">
		<background-effect></background-effect>

		<!-- Hamburger Menu -->
		<div 
			class="hamburger"
			:class="{ 'open': isNavbarVisible }"
			@click.stop="toggleNavbar"
		>
			<span></span>
			<span></span>
			<span></span>
		</div>

		<!-- Navbar -->
		<navbar 
			class="nav" 
			:class="{ 'visible': isNavbarVisible }" 
			@click.stop
		></navbar>

		<div class="content size-max flex justify-center items-start">
			<router-view />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import "./assets/styles/base.css";
import "./assets/styles/media-query.css"

const isNavbarVisible = ref(false);
const route = useRoute();

// Auto-close navbar when navigating to a DIFFERENT page
watch(
  () => route.path,
  () => {
    isNavbarVisible.value = false;
  }
);

const toggleNavbar = () => {
	isNavbarVisible.value = !isNavbarVisible.value;
};

const closeNavbar = () => {
	isNavbarVisible.value = false;
};
</script>

<style>
/* Hamburger Menu */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 200;
    cursor: pointer;
}

.hamburger span {
    display: block;
    height: 2px;
    width: 100%;
    background: #FFF;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
}

/* Hamburger Animation */
.hamburger.open span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
    opacity: 0;
}

.hamburger.open span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
}

@media (max-width: 1023px) {
    .hamburger {
        display: flex;
    }
}
</style>
