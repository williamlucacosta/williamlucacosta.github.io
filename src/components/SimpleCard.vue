<template>
    <div class="centered" @click="sendData">
        <div :class="'card ' + (selected ? 'selected' : '')">
            <div  class="card__icon-container">
                <div v-if="isAudio">     
                    <img v-if="iconUrl && !selected" :src="iconUrl" alt="">
                    <AudioAnimatedIcon v-if="selected"></AudioAnimatedIcon>
                </div>
                <img v-if="!isAudio && iconUrl" :src="iconUrl" alt="">
            </div>
            <div class="card__separator"></div>
            <div class="card__details">
                <p class="card__details__name">{{ title }}</p>
                <p class="card__details__description">{{ description }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { getRoutePathStep } from '@/utility';

    export default {
        data() {
            return {
                selected: false
            }
        },
        props: {
            title: String,
            src: String,
            iconUrl: String,
            description: String,
            isAudio: Boolean
        },
        emits: {
            'clicked': null
        },
        methods: {
            sendData() {
                if(!this.selected) {
                    this.$emit('clicked', {...this.$props, obj: this});
                    this.selected = true;
                }
            }
        },
        mounted() {
            const otherSelections = document.querySelectorAll(".card .selected");
            if(otherSelections.length == 0 && getRoutePathStep(1) == "3d models") {
                this.$emit('clicked', {...this.$props, obj: this});
                this.selected = true;
            }
        }
    }
</script>

<script setup lang="ts">
    import AudioAnimatedIcon from './AudioAnimatedIcon.vue';
</script>

<style scoped>
    .card {
        width: 800px;
        height: 138px;

        background: #0000005d;
        border-radius: 3px;

        display: grid;
        align-items: center;
        grid-template-columns: 0.5fr 0.1fr 1.5fr 0.5fr;
        grid-template-rows: 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;

        transition: transform 0.4s cubic-bezier(0.23, 1, 0.320, 1), border-left .6s cubic-bezier(0.165, 0.84, 0.44, 1);
        border-left: 3px solid #88feb721;
    }

    .card:hover {
        transform: scaleX(1.03);
        filter:brightness(125%);
        border-left: 3px solid #88feb7;
    }

    .card:hover > .card__icon-container > img, .card:hover > .card__icon-container > div > img {
        opacity: 1;
    }

    .selected {
        transform: scaleX(1.03);
        filter:brightness(125%);
        border-left: 3px solid #88feb7;
    }

    .card__icon-container {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .card__icon-container img {
        width: 71px;
        height: 71px;
        filter: brightness(0) invert(1);
        opacity: 0.6;
        transition: 0.2s ease-in-out;
    }

    .card__separator {
        height: 94px;
        width: 1px;
        background-color: rgba(255, 255, 255, 0.09);
    }

    .card__details__name {
        font-style: normal;
        font-weight: 600;
        font-size: 40px;
        line-height: 48px;

        color: #CCD6F6;

        margin: 0;
    } 
    
    .card__details__description {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;

        color: #7D88A5;

        margin: 0;
    }

    .centered {
        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;
    }

    a {
        text-decoration: none;
    }


    @media (max-width: 1280px) {
        .card {
            width: 550px;
            height: 110px;
        }
        
        .card__icon-container img {
            width:50px;
            height: 50px;
        }

        .card__details__name {
            font-weight: 500;
            font-size: 28px;
            line-height: 30px;
        } 
        
        .card__details__description {
            font-size: 18px;
        }
    }

    @media (max-width: 660px) {
        .centered {
            width: 100%;
        }
        .card {
            width: 100%;
            height: auto;
            padding-bottom: 10px;

            grid-template-columns: 0.25fr 0.1fr 1.5fr 0.5fr;
        }
        
        .card__icon-container img {
            width: 30px;
            height: 30px;
        }

        .card__details__name {
            max-width: 250px;
            font-weight: 500;
            font-size: 25px;
            line-height: 30px;
        } 
        
        .card__details__description {
            max-width: 240px;
            font-size: 16px;
        }
    }
</style>
