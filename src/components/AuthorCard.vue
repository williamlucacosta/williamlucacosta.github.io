<template>
    <div class="component">
        <img src="../assets/images/line.png" alt="">
        <div class="card">
            <div class="card__title">
                <h1 class="card__title__greetings">{{ greetings }}</h1>
                <h1 class="card__title__name">{{ name }}</h1>
            </div>
            <p class="card__description">{{ profession }}</p>
            <div class="card__socials">
                <div v-on:click="openPage('https://www.linkedin.com/in/luca-costa-535b5a172/')"><img src="../assets/images/icons/socials/linkedin.png" alt="L"></div>
                <div v-on:click="openPage('https://discordapp.com/users/Luca%20Costa#6841')"><img src="../assets/images/icons/socials/discord.png" alt="D"></div>
                <div v-on:click="openPage('mailto:williamlucacosta17@gmail.com')"><img src="../assets/images/icons/socials/gmail.png" alt="E"></div>
                <div v-on:click="openPage('./src/assets/cv-luca-costa.pdf')"><img src="../assets/images/icons/socials/cv.png" alt="CV"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<script lang="ts">
    export default {
        props: {
            greetings: {
                type: String,
                default: "Hi, I am"
            },
            name: String,
            profession: String,
            scaleFactor: {
                type: Number,
                default: 1
            }
        },
        methods: {
            openPage(url:string) {
                window.open(url);
            }
        }
    }
</script>



<style scoped>
    .component {
        display: flex;
        align-items: flex-start;
    }

    .component img {
        margin-right: 10px;
    }
    .card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }
    .card__title__greetings, .card__title__name {
        /* font-family: 'SF Pro Display', sans-serif; */
        letter-spacing: 3px;
        margin: 0;
        font-style: normal;
        font-weight: 400;
        font-size: 64px;
    }

    .card__title {
        display: flex;
        color: #FFFFFF;
    }

    .card__title__name {
        margin-left: 10px;
        color: #66FFA3;
    }

    .card__description {
        margin: 0;
        font-style: normal;
        font-weight: 500;
        font-size: 28px;
        line-height: 33px;
        letter-spacing: 0.22em;

        color: rgba(191, 191, 191, 0.72);

        opacity: 0.55;
    }
    .card__socials {
        margin-top: 20px;
        width: 267px;
        
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card__socials img {
        cursor: pointer;
        opacity: 0.8;
        transition: 0.3s ease-in-out;
    }

    .card__socials img:hover {
        opacity: 1;
        transform: scale(1.1);
        filter: brightness(120%);
    }


    @media (max-width: 1280px) {
        .card__title__greetings, .card__title__name {
            font-size: 30px;
        }
        .card__description {
            font-size: 18px;
        }
        .component img {
            height: 120px;
            margin-left: 7px;
        }
        .card__socials {
            margin-top: 5px;
            width: 150px;
        }
        .card__socials img {
            width: 20px;
            height: 20px;
        }
    }
</style>
