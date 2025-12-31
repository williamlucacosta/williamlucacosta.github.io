<template>
    <div class="home-wrapper">
        <div class="hero-center">
            <h1 class="name">Luca Costa.</h1>
            <div class="role">
                <span>Game Designer</span>
                <span class="divider">/</span>
                <span>Engineer</span>
            </div>
            
            <div class="socials">
                <a class="link" href="https://linkedin.com/in/luca-costa-535b5a172" target="_blank">LinkedIn</a>
                <a class="link" href="mailto:williamlucacosta17@gmail.com">Email</a>
                <a class="link" href="../assets/CV_Luca.pdf" download>Resume</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// No script needed
</script>

<style scoped>
.home-wrapper {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.hero-center {
    text-align: center;
}

.name {
    font-size: clamp(3rem, 5vw, 5vw);
    font-weight: 700;
    margin: 0 0 16px 0;
    letter-spacing: -0.04em;
    color: var(--text-white);
}

.role {
    font-family: var(--font-mono);
    color: var(--text-cloud);
    font-size: 0.9rem;
    margin-bottom: 32px;
}

.divider {
    color: var(--border-light);
    margin: 0 12px;
}

.socials {
    display: flex;
    gap: 24px;
    justify-content: center;
}

.link {
    font-size: 0.9rem;
    color: var(--text-ash);
    border-bottom: 1px solid transparent;
    padding-bottom: 2px;
}

.link:hover {
    color: var(--text-white);
    border-color: var(--text-ash);
}
</style>
