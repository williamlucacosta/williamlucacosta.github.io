<template>
    <nav class="pf-nav">
        <router-link to="/" class="pf-logo" @click="$emit('navigate')">
            <span class="pf-logo-mk">LC</span>
            <span class="pf-logo-text">Luca Costa<span class="pf-logo-dim"> / Portfolio</span></span>
        </router-link>

        <ul class="pf-nav-links">
            <li>
                <router-link to="/" @click="$emit('navigate')">
                    <span>About</span><span class="pf-nav-dot" aria-hidden="true"></span>
                </router-link>
            </li>
            <li>
                <router-link to="/game-projects" @click="$emit('navigate')">
                    <span>Projects</span><span class="pf-nav-dot" aria-hidden="true"></span>
                </router-link>
            </li>
            <li>
                <router-link to="/3d-models" @click="$emit('navigate')">
                    <span>3D Models</span><span class="pf-nav-dot" aria-hidden="true"></span>
                </router-link>
            </li>
            <li>
                <router-link to="/soundtracks" @click="$emit('navigate')">
                    <span>Audio</span><span class="pf-nav-dot" aria-hidden="true"></span>
                </router-link>
            </li>
            <li>
                <a class="pf-nav-cta" href="mailto:williamlucacosta17@gmail.com" @click="$emit('navigate')">
                    Get in touch
                </a>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
/* eslint-disable vue/multi-word-component-names */
// eslint-disable-next-line no-undef
defineOptions({ name: 'AppNavbar' });

// eslint-disable-next-line no-undef
defineEmits<{ (e: 'navigate'): void }>();
</script>

<style scoped>
@media (max-width: 1023px) {
    .pf-nav {
        position: fixed;
        inset: 0;
        height: 100vh;
        width: 100vw;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 60px;
        padding: 60px 24px;
        background: rgba(7, 7, 9, 0.96);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-bottom: none;
        transform: translateY(-100%);
        transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
        z-index: 150;
    }

    .pf-nav.mobile-visible {
        transform: translateY(0);
    }

    .pf-logo-text {
        display: none;
    }

    .pf-logo-mk {
        font-size: 18px;
    }

    .pf-nav-links {
        flex-direction: column;
        gap: 18px;
    }

    .pf-nav-links a {
        font-family: var(--fh);
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        text-transform: none;
        color: var(--text);
    }
}
</style>
