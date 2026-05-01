<template>
    <div class="pf">
        <div class="pf-bg" aria-hidden="true"></div>
        <BackgroundCanvas />
        <div class="pf-vignette" aria-hidden="true"></div>

        <div class="pf-shell">
            <!-- Hamburger (mobile) -->
            <div
                class="hamburger"
                :class="{ 'open': isNavbarVisible }"
                @click.stop="toggleNavbar"
                aria-label="Toggle navigation"
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <!-- Nav -->
            <Navbar
                :class="{ 'mobile-visible': isNavbarVisible }"
                @navigate="closeNavbar"
            />

            <!-- Pages -->
            <main class="pf-scroll" @click="closeNavbar">
                <router-view v-slot="{ Component }">
                    <component :is="Component" class="pf-page" />
                </router-view>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import BackgroundCanvas from "@/components/BackgroundCanvas.vue";
import "./assets/styles/base.css";
import "./assets/styles/media-query.css";

const isNavbarVisible = ref(false);
const route = useRoute();

watch(() => route.path, () => { isNavbarVisible.value = false; });

const toggleNavbar = () => { isNavbarVisible.value = !isNavbarVisible.value; };
const closeNavbar = () => { isNavbarVisible.value = false; };
</script>

<style>
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 26px;
    height: 18px;
    position: fixed;
    top: 20px;
    right: 24px;
    z-index: 200;
    cursor: pointer;
}

.hamburger span {
    display: block;
    height: 1.5px;
    width: 100%;
    background: var(--text);
    border-radius: 1px;
    transition: all 0.3s ease-in-out;
}

.hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

@media (max-width: 1023px) {
    .hamburger { display: flex; }
}
</style>
