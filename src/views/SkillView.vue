<template>
    <div class="page" id="subskills-page">
        <PageTitle :title="skillName"></PageTitle>
        <div class="simple-card-list">
            <SimpleCard v-for="(subskill, index) in getSectionContents()"
                :key="index"
                :title="subskill.title"
                :icon-url="subskill.cover"
                :description="subskill.description"
                @clicked="selectedCardHandler"
            ></SimpleCard>
        </div>
    </div>
</template>

<script lang="ts">
    import { getSectionContents, getRoutePathStep } from '@/utility';

    export default {
        data() {
            return {
                skillName: getRoutePathStep(1),
                lastSelection: null,
            }
        },
        methods: {
            selectedCardHandler(payload) {
                if(this.lastSelection && this.lastSelection != payload.obj) {
                    //@ts-ignore
                    this.lastSelection.selected = false;                  
                }

                this.lastSelection = payload.obj;
            }
        }
    }
</script>

<script setup lang="ts">
    import PageTitle from '@/components/PageTitle.vue';
    import SimpleCard from '@/components/SimpleCard.vue';
</script>

<style scoped>

</style>
