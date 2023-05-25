<template>
    <div :class="containerSideClass">
        <img :src="companyIconUrl" alt="">
        <div class="text-box">
            <h2>{{ companyName }}</h2>
            <small>({{ startDate }} - {{ endDate }})</small>
            <p>{{ description }}</p>
            <span :class="(leftSide ? 'left': 'right') + '-container-arrow'"></span>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        props: {
            companyIconUrl: {
                type: String,
                default: "https://cdn-icons-png.flaticon.com/512/189/189678.png?w=360"
            },
            leftSide: {
                type: Boolean,
                default: true
            },
            companyName: String,
            startDate: String,
            endDate: String,
            description: String
        },
        computed: {
            containerSideClass() {
                return 'container' + ' ' + (this.leftSide ? 'left-container': 'right-container')
            }
        }
    }
</script>

<style scoped>
    .container {
        padding: 10px 50px;
        position: relative;
        width: 50%;
    }

    .text-box {
        padding: 20px 30px;
        background: #0000005d;
        position: relative;
        border-radius: 4px;
        box-shadow: #64b384 0px 4px 2px, rgba(0, 0, 0, 0.558) 2px 6px 5px;
        transition: .3s ease-in-out;
    }
    .text-box:hover {
        transform: scale(1.015);
    }
    .text-box h2 {
        color: #CCD6F6;
        font-weight: 600;
        margin-bottom: 5px;
        font-size: 25px;
    }
    .text-box small {
        display: inline-block;
        margin-bottom: 15px;
        color: #7D88A5;
        font-weight: 600;
        font-size: 16px;
    }
    .text-box p {
        color: #7D88A5;
        font-size: 18px;
    }

    .right-container {
       left: 50%; 
    }
    .container img {
        position: absolute;
        width: 40px;
        border-radius: 15px;
        right: -20px;
        top: 32px;
        transition: .3s ease-in-out;
        box-shadow: #3e7c57 0px 0px 1px 3px;
    }

    .container img:hover {
        transform: scale(1.15);
    }

    .container:hover > img {
        box-shadow: #64b384 0px 0px 1px 3px;
    }

    .right-container img {
        left: -20px;
    }

    .left-container-arrow {
        height: 0;
        width: 0;
        position: absolute;
        top: 33px;
        z-index: 1;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid #64b384;
        right: -10px;
    }

    .right-container-arrow {
        height: 0;
        width: 0;
        position: absolute;
        top: 33px;
        z-index: 1;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid #64b384;
        left: -10px;
    }

    @media (max-width: 1280px) {
        .text-box {
            padding: 5px 10px;
        }
        .text-box h2 {
            font-size: 18px;
        }
        .text-box small {
            font-size: 12px;
        }
        .text-box p {
            font-size: 14px;
        }
    }
</style>