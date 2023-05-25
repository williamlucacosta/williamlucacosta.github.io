<template>
    <div class="container">
        <model-viewer class="model-viewer" 
            :src="src" 
            camera-controls 
            touch-action="pan-y"
            skybox-image="../../src/assets/skybox.hdr"
            xr-environment
        >
        </model-viewer>
    </div>
</template>

<script lang="ts">
    import "@google/model-viewer";

    export default {
        data() {
            return {
                title: "",
                author: "",
                src: "",
            }
        },
        methods: {
            getSourcePath(title: string) {
                return "../../src/assets/models/" + title + ".glb";
            },
            setData(payload) {
                const newSource: string = this.getSourcePath(payload.title) as string;

                this.src = newSource;
                this.title = payload.title;
            }
        }
    }

</script>

<style scoped>
    .centered {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .container {
        width: 100%;
        height: 100%;
        border-radius: 4px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .model-viewer {
        width: 100%;
        height: 100%;
        
        border-radius: 5px 5px 0px 0px;
    }

    @media (max-width: 660px) {
        .container {
            width: 100vw;
        }
    }

    /* .title {
        font-style: normal;
        font-weight: 600;
        font-size: 30px;
        line-height: 48px;

        color: #CCD6F6;

        margin: 0;
        
        align-items: center;
    }

    .description {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;

        color: #7D88A5;

        margin: 0;
    } */
</style>
