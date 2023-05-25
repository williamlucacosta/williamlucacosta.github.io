<template>
    <div class="page">
        <div class="experience-container">
            <PageTitle :outline="true" :title="'Experience'"></PageTitle>
            <div class="timeline">
                <TimelineBox v-for="(experience, index) in experiences"
                    :key="index" 
                    :company-name="experience.companyName" 
                    :company-icon-url="experience.companyIconUrl" 
                    :start-date="String(experience.startDate)" 
                    :end-date="String(experience.endDate)"
                    :description="experience.description" 
                    :left-side="Boolean((index+1)%2)"
                ></TimelineBox>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import DATA from '../assets/data.json'

    export default {
        data() {
            return {
                experiences: DATA["experience"],
            }
        }
    }
</script>

<script setup lang="ts">
    import PageTitle from '@/components/PageTitle.vue';
    import TimelineBox from '../components/TimelineCard.vue';
</script>

<style scoped>
    .experience-container {
        padding-top: 50px;
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
        height: 100%;
    }

    .timeline {
        position: relative;
        max-width: 1200px;
        margin: auto;
        padding-top: 50px;
        padding-bottom: 50px;
    }
    .timeline::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 100%;
        background: #0000005d;
        top: 0;
        left: 50%;
        margin-left: -3px;
        z-index: -1;
        animation: moveline 3s cubic-bezier(0.895, 0.03, 0.685, 0.22) forwards;
        box-shadow: #64b38473 1px 2px 2px, #64b38473 -1px 2px 2px;
        border-radius: 3px;
    }

    @keyframes moveline {
        0% {
            height: 0;
            box-shadow: #64b38473 0px 1px 2px, #64b38473 0px 1px 2px;
        }
        100% {
            height: 100%;
            box-shadow: #64b384 1px 2px 2px, #64b384 -1px 2px 2px;
        }
    }
</style>