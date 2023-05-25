<template>
    <div class="container">
        <p :class="'title '  + (outline ? 'outlined' : '')">{{ title?.toUpperCase() }}</p>
    </div>
</template>

<script lang="ts">
    export default {
        props: {
            title: String,
            outline: Boolean
        }
    }
</script>

<style scoped>
    .container {
        opacity: 1;

        display: flex;
        justify-content: space-evenly;
        align-items: center;


        /* animation: floating 2s alternate infinite cubic-bezier(.62,.2,.42,.72); */
    }

    .title {
        height: 50px;
        cursor: default;
        margin: 0;
        font-style: normal;
        font-weight: 600;
        /* text-shadow: 0px 4px 6px #0a0a0a; */
        font-size: 3em;
        line-height: 24px;

        text-align: left;
        display: flex;
        justify-content: center;
        align-items: center;

        background: #0000005d;
        border-radius: 5px 5px 0px 0px;
        padding: 35px;
        color: #88feb7;
        letter-spacing: 4px;
    }

    .outlined {
        box-shadow: #64b384 0px 0px 2px 1px;
    }

    @keyframes floating {
        0% {
            transform: translateY(-11px);
        }
        100% {
            transform: translateY(0px);
        }
    }


    @media (max-width: 1280px) {
        .title {
            font-size: 2.4em;
        }
    }

    @media (max-width: 660px) {
        .container {
            width: 100%;
            margin-left: 50px;
            justify-content: flex-start;
        }
        .title {
            padding: 20px;
            font-size: 1.8em;
            max-width: 300px;
        }
    }
</style>