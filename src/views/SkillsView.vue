<template>
    <div class="page" id="skills-page">
        <PageTitle title="Skills"></PageTitle>
        <div class="simple-card-list">
            <SimpleCard v-for="(skill, index) in skills" 
                :key="index"
                :title="skill.title"
                :description="skill.description"
                :icon-url="skill.iconUrl" 
                @clicked="gotoPage('view-skill', {name: skill.title.toLowerCase()})"
            ></SimpleCard> 
        </div>
    </div>
</template>

<script setup lang="ts">
    import PageTitle from '@/components/PageTitle.vue';
    import SimpleCard from '@/components/SimpleCard.vue';
</script>

<script lang="ts">
import DATA from '../assets/data.json'
import { gotoPage } from '@/utility';

    export default {
        data() {
            return {
                skills: DATA["skills"],
            }
        }
    }
</script>

<style scoped>
    
</style>
