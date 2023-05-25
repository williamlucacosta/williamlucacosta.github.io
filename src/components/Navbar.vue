<script setup lang="ts">
    import { RouterLink } from 'vue-router'
    import HamburgerNavbar from './HamburgerNavbar.vue';
</script>

<script lang="ts">
     export default {
        methods: {
            hamburgerClickHandler() {
                const hamburgerImageElement: HTMLImageElement = document.querySelector("#hamburger") as HTMLImageElement;
                const navbarElement: HTMLElement = document.querySelector("#hamburger-nav") as HTMLElement;
                const hamburgerContainer: HTMLDivElement = document.querySelector("#hamburger-container") as HTMLDivElement;

                if(hamburgerImageElement.src == "https://cdn-icons-png.flaticon.com/512/4543/4543046.png") {
                    //Open navbar
                    // navbarElement.style.visibility = "visible";
                    hamburgerContainer.style.backgroundColor = "rgba(27, 22, 31, 0.353)";
                    // navbarElement.style.opacity = "1";
                    navbarElement.style.display = "flex";
                    
                    hamburgerImageElement.src = "https://cdn-icons-png.flaticon.com/512/1620/1620739.png";
                } else {
                    //Close Navbar
                    // navbarElement.style.opacity = "0";
                    hamburgerContainer.style.backgroundColor = "rgba(0, 0, 0, 0)";
                    // navbarElement.style.visibility = "hidden";
                    navbarElement.style.display = "none";
                    hamburgerImageElement.src = "https://cdn-icons-png.flaticon.com/512/4543/4543046.png"
                }
            }
        }
    }
</script>

<template>
    <div>
        <nav id="navbar">
            <RouterLink to="/">About</RouterLink>
            <RouterLink to="/experience">Experience</RouterLink>
            <RouterLink to="/portfolio">Portfolio</RouterLink>
            <RouterLink to="/skills">Skills</RouterLink>
        </nav>
        <div id="hamburger-container">
            <img @click="hamburgerClickHandler" id="hamburger" src="https://cdn-icons-png.flaticon.com/512/4543/4543046.png" alt="">
            <nav id="hamburger-nav">
                <RouterLink to="/">About</RouterLink>
                <RouterLink to="/experience">Experience</RouterLink>
                <RouterLink to="/portfolio">Portfolio</RouterLink>
                <RouterLink to="/skills">Skills</RouterLink>
            </nav>
        </div>
    </div>
</template>

<style scoped>
    #navbar {
        height: 35px;
        width: 700px;

        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    #hamburger-container {
        visibility: hidden;
        position: fixed;
        height: 100vh;
        right: 0;
        top: 0;

        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 0.1fr 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;

        transition: 0.1s ease-in-out;
        padding-left: 30px;
        padding-right: 30px;
    }

    #hamburger {
        width: 32px;
        height: 32px;
        filter: invert(1);

        justify-self: center;
        align-self: center;
    }
    
    #hamburger-nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;

        /* visibility: hidden; */
        display: none;

        padding: 20px;
        border-radius: 20px;

        transition: opacity 0.3s ease-in-out;
    }

    a {
        font-weight: 600;
        font-size: 18px;

        color: #FFFFFF;
        text-decoration: none;

        transition: 0.2s ease-out;
    }

    a:not(.router-link-active):hover {
        transform: scale(1.05);
        color: #88feb7;
    }

    .router-link-active {
        transform: scale(1.2);
        line-height: 19px;

        color: #66FFA3;
        text-shadow: #66ffa346 0px 0px 10px;
    }

    .router-link-active::after {
        width: 100% !important;
    }

    a::after, .router-link-active::after {
        content: '';
        width: 0;
        height: 2px;
        border-radius: 10px;
        background: linear-gradient(90deg, #66FFA3, rgba(0, 128, 0, 0));
        position: absolute;
        left: 0;
        bottom: -2px;
        transition: .2s ease-in-out;
    }

    a:hover::after {
        width: 100%;
    }




    @media (max-width: 1280px) {
        #navbar {
            visibility: hidden;
        }
        #hamburger-container {
            visibility: visible;
        }
    }

    @media (max-width: 660px) {
        #hamburger-container {
            padding: 5px;
        }
        #hamburger {
            width: 30px;
        }
        a {
            font-size: 12px;
        }
    }
</style>
