<template>
    <div class="page" id="portfolio-page">
        <PageTitle title="Portfolio"></PageTitle>
        <div class="simple-card-list">
            <SimpleCard v-for="(item, index) in portfolio" 
                :key="index" 
                :icon-url="item.iconUrl" 
                :title="item.title" 
                :description="item.description"
                @clicked="gotoPage('portfolio-section', {name: item.title.toLowerCase()})"
            ></SimpleCard> 
        </div>
    </div>
</template>

<script setup lang="ts">
    import SimpleCard from '@/components/SimpleCard.vue';
    import PageTitle from '@/components/PageTitle.vue';
</script>

<script lang="ts">
    import DATA from '../assets/data.json'
    import { gotoPage } from '@/utility'

    export default {
        data() {
            return {
                portfolio: DATA["portfolio"],
            }
        }
    }
</script>

<style scoped>

</style>