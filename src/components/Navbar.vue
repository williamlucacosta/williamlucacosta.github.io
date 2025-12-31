<template>
    <nav class="navbar-fixed">
        <div class="nav-container container">
            <!-- Brand -->
            <router-link to="/" class="brand">
                LC
            </router-link>

            <!-- Links -->
            <div class="nav-links">
                <router-link to="/" class="nav-item">About</router-link>
                <router-link to="/game-projects" class="nav-item">Projects</router-link>
                <router-link to="/3d-models" class="nav-item">3D Models</router-link>
                <router-link to="/soundtracks" class="nav-item">Audio</router-link>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'NavbarComponent' });
</script>

<style scoped>
.navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--nav-height);
    background: rgba(5, 5, 5, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-dim);
    z-index: 100;
    display: flex;
    align-items: center;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}

.brand {
    font-weight: 700;
    font-size: 1.2rem;
    letter-spacing: -0.04em;
    color: var(--text-white);
}

.nav-links {
    display: flex;
    gap: 32px;
}

.nav-item {
    font-size: 0.9rem;
    color: var(--text-cloud);
    font-weight: 500;
}

.nav-item:hover {
    color: var(--text-white);
}

.router-link-exact-active {
    color: var(--text-white);
}
</style>
