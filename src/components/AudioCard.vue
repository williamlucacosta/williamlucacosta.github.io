<template>
    <div class="centered">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <audio ref="audioElement" :src="src"></audio>
        <div class="music-player">
            <div class="cover"></div>
            <p class="title">{{ title }}</p>
            <i @click="togglePlayback" :class="'fa ' + (isPlaying ? 'fa-pause' : 'fa-play')"></i>
            <input ref="rangeElement" type="range" class="time-bar" :value="currentTime" @input="seek" max="3">
            <span class="time">{{ currentTimeFormatted }} / {{ durationFormatted }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        data() {
            return {
                title: "",
                author: "",
                src: "",
                isPlaying: false,
                duration: 0,
                currentTime: 0
            }
        },
        computed: {
            durationFormatted() {
                // format the duration as minutes:seconds
                const minutes = Math.floor(this.duration / 60);
                const seconds = Math.floor(this.duration % 60);
                return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            },
            currentTimeFormatted() {
                // format the current time as minutes:seconds
                const minutes = Math.floor(this.currentTime / 60);
                const seconds = Math.floor(this.currentTime % 60);
                return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            },
        },
        methods: {
            getSourcePath(title: string) {
                return "../../src/assets/audio/soundtracks/" + title + ".wav";
            },
            play() {
                const audio: HTMLAudioElement = this.$refs.audioElement as HTMLAudioElement;
                audio.play();
                this.isPlaying = true;
            },
            togglePlayback() {
                const audio: HTMLAudioElement = this.$refs.audioElement as HTMLAudioElement;
                if (this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
                this.isPlaying = !this.isPlaying;
            },
            seek(event: Event) {
                const audio : HTMLAudioElement = this.$refs.audioElement as HTMLAudioElement;
                const elem : HTMLInputElement = event.target as HTMLInputElement;
                const time = Number(elem.value);
                audio.currentTime = time;
                this.currentTime = time;
            },
            updateCurrentTime() {
                const audio: HTMLAudioElement = this.$refs.audioElement as HTMLAudioElement;
                this.currentTime = audio.currentTime;

                if(this.currentTime == this.duration && this.isPlaying) {
                    this.togglePlayback();
                    this.currentTime = 0;
                }
            },
            updateDuration() {
                const audio: HTMLAudioElement = this.$refs.audioElement as HTMLAudioElement;
                const range : HTMLInputElement = this.$refs.rangeElement as HTMLInputElement;
                
                this.duration = audio.duration;
                range.max = String(audio.duration);
            },
            setData(payload) {
                const newSource: string = this.getSourcePath(payload.title) as string;

                this.src = newSource;
                this.title = payload.title;

                setTimeout(() => {  this.play(); }, 300);
            }
            
        },
        mounted() {
            const audio: HTMLAudioElement = this.$refs.audioElement as HTMLAudioElement;
            audio.addEventListener("timeupdate", this.updateCurrentTime);
            audio.addEventListener("loadedmetadata", this.updateDuration);
        },
        beforeUnmount() {
            const audio: HTMLAudioElement = this.$refs.audioElement as HTMLAudioElement;
            audio.removeEventListener("timeupdate", this.updateCurrentTime);
            audio.removeEventListener("loadedmetadata", this.updateDuration);
        }
    }

</script>

<style scoped>
    .music-player {
        background: #3142564a;
        border-radius: 3px;
        width: 800px;
        height: 128px;
        padding-right: 50px;
        margin-bottom: 20px;
        margin-top: 20px;

        display: grid;
        
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr 0.2fr 0.5fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
    }
    .cover {
        grid-area: 1 / 1 / 4 / 2; 
        background: url("https://wallpaperaccess.com/full/13392.jpg");
        background-size:cover;
        background-position: center;
        background-repeat: no-repeat;
        width: 90%;
        height: 100%;
        border-radius: 3px 0px 0px 3px;
        opacity: v-bind("isPlaying ? 1 : 0.75");
        transition: 0.4s ease-in-out;
    }
    .title {
        font-style: normal;
        font-weight: 600;
        font-size: 30px;
        line-height: 48px;

        color: #CCD6F6;

        margin: 0;
        
        display: flex;
        align-items: center;
        grid-area: 1 / 2 / 2 / 5;
    }
    .time {
        font-style: normal;
        font-weight: 450;
        font-size: 20px;
        line-height: 24px;

        color: #939db6;

        margin: 0;
        
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        grid-area: 2 / 4 / 3 / 6;
    }
    .time-bar {
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        cursor: pointer;

        width: 100%;
        height: 8px;
        border-radius: 5px;

        background: rgb(68, 81, 94);

        grid-area: 3 / 2 / 4 / 6;
    }
    .time-bar::-webkit-slider-thumb {
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        background: v-bind("isPlaying ? '#88feb7' : '#4f916a'");
        box-shadow: 0px 2px 10px #88feb777;
        transition: .3s ease-in-out;
    }
    .time-bar::-webkit-slider-thumb:hover {
        transform: scale(1.2);
    }
    .fa {
        cursor: pointer;
        font-size: 2em;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        grid-area: 1 / 5 / 2 / 6;
        color: #88feb7;
        transition: .2s ease-in-out;

        text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.581);
    }

    .fa-play {
        color: #4f916a;
    }


    @media (max-width: 1280px) {
        .music-player {
            width: 500px;
            height: 100px;
        }
        .fa {
            font-size: 1.4em;
        }
    }

    @media (max-width: 660px) {
        .music-player {
            width: 100vw;
            height: 100px;
            
        }
        .centered {
            width: 100%;
            align-items: flex-start;
            justify-content: flex-start;
        }
        .time {
            font-size: 16px;
        }
        .title {
            display: none;
        }
        .fa {
            font-size: 1.2em;
        }
    }
</style>
