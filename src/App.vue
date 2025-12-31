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
import { ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import "./assets/styles/base.css";
import "./assets/styles/media-query.css"

const isNavbarVisible = ref(false);

const toggleNavbar = () => {
	isNavbarVisible.value = !isNavbarVisible.value;
};

const closeNavbar = () => {
	isNavbarVisible.value = false;
};
</script>

<style>

</style>
