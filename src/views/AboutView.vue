<template>
    <div class="page" id="about-page">
        <div>
            <AuthorCard name="Luca" profession="Game Developer"></AuthorCard>
            <div class="motivations-container">
                <p v-for="(item, index) in aboutMotivations" 
                :key="index" 
                class="about-text"
                >
                    {{ item }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import DATA from "../assets/data.json"

    export default {
        data() {
            return {
                aboutMotivations: DATA["about"]
            }
        }
    }
</script>

<script setup lang="ts">
    import AuthorCard from '../components/AuthorCard.vue'
</script>

<style scoped>
    @import url('https://fonts.cdnfonts.com/css/cardigan-titling');

    .motivations-container {
        display: flex;
        flex-direction: column;
    }
    .about-text:nth-child(1) {
        animation: fadeIn 2s ease-in-out;
    }
    .about-text:nth-child(2) {
        animation: fadeIn 4s ease-in-out;
    }
    .about-text:nth-child(3) {
        animation: fadeIn 7s ease-in-out;
    }
    .about-text:nth-child(4) {
        animation: fadeIn 9s ease-in-out;
    }
    .about-text:nth-child(5) {
        color: rgba(255, 255, 255, 0.487);
        animation: fadeIn 11s ease-in-out;
    }

    .about-text {              
        max-width: 1100px;
        font-weight: 200;
        font-size: 22px;
        letter-spacing: 2px;

        color: rgba(255, 255, 255, 0.387);
        margin: 11px;

        padding-left: 20px;
        box-shadow: -2px 0px 0px 0px #88feb73e;
        transition: color 0.2s ease-in-out, box-shadow 0.7s ease-in-out, transform 1s;
    }

    .about-text:hover {
        color: rgba(255, 255, 255, 0.787);
        box-shadow: -6px 0px 0px 0px #88feb798;
        transform: translateY(2px);
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        20% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes floating {
        0% {
            transform: translateY(0px);
        }
        100% {
            transform: translateY(3px);
        }
    }



    @media (max-width: 1280px) {
        .about-text {
            max-width: 600px;
            font-size: 16px;
        }
    }

    @media (max-width: 660px) {
        .about-text {
            max-width: 300px;
            font-size: 10px;
        }
    }
</style>
