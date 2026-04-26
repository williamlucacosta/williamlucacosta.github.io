<template>
    <div>
        <!-- HERO — full viewport, name vertically centered -->
        <section class="pf-hero pf-hero--full">
            <div class="pf-kick">
                <span>Portfolio · 2025</span>
            </div>

            <h1 class="pf-name">Luca Costa</h1>

            <div class="pf-roles">
                <span class="pf-role">Software Engineer</span>
                <span class="pf-rsep" aria-hidden="true"></span>
                <span class="pf-role">Game Designer</span>
            </div>

            <div class="pf-links">
                <a class="pf-link" href="https://linkedin.com/in/luca-costa-535b5a172" target="_blank" rel="noopener">
                    LinkedIn <span class="pf-link-arr" aria-hidden="true">↗</span>
                </a>
                <a class="pf-link" href="mailto:williamlucacosta17@gmail.com">
                    Email <span class="pf-link-arr" aria-hidden="true">↗</span>
                </a>
                <a class="pf-link" href="../assets/CV_Luca.pdf" download>
                    Resume <span class="pf-link-arr" aria-hidden="true">↗</span>
                </a>
            </div>

            <a class="pf-scroll-cue" href="#capabilities" aria-label="Scroll to capabilities">
                <span class="pf-scroll-cue-label">Scroll</span>
                <span class="pf-scroll-cue-line" aria-hidden="true"></span>
            </a>
        </section>

        <!-- SKILLS -->
        <section id="capabilities" class="pf-skills">
            <div class="pf-eyebrow"><span>Capabilities</span></div>

            <div class="pf-skills-g">
                <div class="pf-sk" v-for="(group, idx) in skills" :key="group.name">
                    <div class="pf-sk-num">{{ String(idx + 1).padStart(2, '0') }}</div>
                    <div class="pf-sk-name">{{ group.name }}</div>
                    <div class="pf-sk-items">
                        <span class="pf-sk-item" v-for="item in group.items" :key="item">{{ item }}</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
const skills = [
    {
        name: 'Engineering',
        items: ['TypeScript', 'Vue / React', 'Node.js', 'Python', 'C# / Unity'],
    },
    {
        name: 'Game Design',
        items: ['Mechanics design', 'Level design', 'Prototyping', 'Playtesting'],
    },
    {
        name: 'Audio',
        items: ['Composition', 'Sound design', 'Mixing', 'FL Studio'],
    },
    {
        name: '3D & Visual',
        items: ['Blender', 'Modeling', 'Texturing', 'Rendering'],
    },
];
</script>
