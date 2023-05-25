<template>
    <video autoplay muted loop id="myVideo">
        <source src="@/assets/bg_live.mp4" type="video/mp4">
    </video>
    <!-- <audio ref="audioWaves" src="../src/assets/waves.mp3" autoplay loop volume="0.05"></audio> -->
    <div id="videoMask"></div>
    <div id="navbar-wrapper">
        <img id="logo" src="./assets/images/icons/logo.png">
        <Navbar></Navbar>
    </div>

    <RouterView v-slot="{ Component,}">
        <transition name="fade" mode="out-in">
            <component :is="Component" />
        </transition>
    </RouterView>
</template>

<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import Navbar from './components/Navbar.vue'
</script>

<script lang="ts">
    export default {
        data() {
            return {
                prova: "800px"
            }
        },
        computed: {
            windowWidth() {
                return window.innerWidth;
            },
            windowHeight() {
                return 800;
            }
        },
        mounted() {
            const app: HTMLDivElement = document.querySelector("#app") as HTMLDivElement; 
            app.style.gridTemplateRows = "80px " + (window.innerHeight - 80) + "px";

            window.addEventListener("resize", (e) => {
                app.style.gridTemplateRows = "80px " + (window.innerHeight - 80) + "px";
            })
        }
    }
</script>

<style>
    #app {
        display: grid;
        grid-template-columns: 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        width: 100%;
        height: 100%;
    }

    #navbar-wrapper {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        z-index: 1;
    }

    #logo {
        position: absolute;
        left: 30px;
        top: 18px;
    }
    
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s ease-in-out;
    }



    @media (max-width: 660px) {
        #logo {
            top: 23px;
            left: 25px;
            width: 25px;
        }
    }
</style>
