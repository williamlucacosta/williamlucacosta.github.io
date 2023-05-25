<template>
    <div class="contenitore">
        <div v-if="(portfolioSectionName != '3d models')" :class="'page'" id="portfoliosection-page">
            <PageTitle :title="portfolioSectionName"></PageTitle>
            <div class="simple-card-list">
                <SimpleCard v-for="(item, index) in getSectionContents()"
                    :key="index"
                    :title="item.title"
                    :description="item.description"
                    :icon-url="item.cover"
                    :src="item.src"
                    :is-audio="portfolioSectionName == 'soundtracks'"
                    @clicked="selectedCardHandler"
                ></SimpleCard>
            </div>
            <AudioCard v-if="portfolioSectionName == 'soundtracks'" ref="elementViewer"></AudioCard>
            <ModelCard v-if="portfolioSectionName == '3d models'" ref="elementViewer"></ModelCard>
        </div>

        <div v-if="(portfolioSectionName == '3d models')" class="models-page" id="portfoliosection-page">
            <div class="test">
                <PageTitle :title="portfolioSectionName"></PageTitle>
                <div class="simple-card-list">
                    <SimpleCard v-for="(item, index) in getSectionContents()"
                        :key="index"
                        :title="item.title"
                        :description="item.description"
                        :icon-url="item.cover"
                        :src="item.src"
                        :is-audio="false"
                        @clicked="selectedCardHandler"
                    ></SimpleCard>
                </div>
            </div>
            <ModelCard ref="elementViewer"></ModelCard>
        </div>
    </div>

</template>

<script setup lang="ts">
    import AudioCard from '@/components/AudioCard.vue';
    import ModelCard from '@/components/ModelCard.vue';
    import SimpleCard from '@/components/SimpleCard.vue';
    import PageTitle from '@/components/PageTitle.vue';
</script>

<script lang="ts">
    import { openLinkTab, getSectionContents, getRoutePathStep } from '@/utility';

    export default {
        data() {
            return {
                lastSelection: null,
                portfolioSectionName: getRoutePathStep(1),
            }
        },
        methods: {
            selectedCardHandler(payload) {
                if(this.portfolioSectionName == "projects" ) {openLinkTab(payload.src); return;}

                const audioPlayerElement = this.$refs.elementViewer;
                //@ts-ignore
                audioPlayerElement.setData(payload);

                if(this.lastSelection && this.lastSelection != payload.obj) {
                    //@ts-ignore
                    this.lastSelection.selected = false;                  
                }

                this.lastSelection = payload.obj;
            }
        },
        mounted() {
            
        }
    }
</script>

<style scoped>
    .section {
        margin-top: 100px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .test {
        /* width: 100%; */
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .models-page {
        width: 100%;
        height: 100%;
        align-items: flex-start !important;
        flex-direction: row !important;
    }

    .simple-card-list {
        flex: 1;
    }

    .contenitore {
        width: 100%;
        height: 100%;
    }



    @media (max-width: 660px) {
        .models-page {
            flex-direction: column !important;
        }
        .test {
            width: 90%;
        }
    }
</style>