<template>
    <div>
        <!-- HERO — full viewport, name vertically centered -->
        <section class="pf-hero pf-hero--full">
            <div class="pf-kick">
                <span>Portfolio · 2026</span>
            </div>

            <h1 class="pf-name pf-name--anim" aria-label="Luca Costa">
                <span
                    v-for="(ch, i) in nameChars"
                    :key="i"
                    class="pf-name-c"
                    :class="{ 'pf-name-period': ch === '.', 'pf-name-space': ch === ' ' }"
                    :style="{ animationDelay: (i * 45) + 'ms' }"
                    aria-hidden="true"
                    v-html="renderChar(ch)"
                ></span>
            </h1>

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

            <a class="pf-scroll-cue" href="#about" aria-label="Scroll to about">
                <span class="pf-scroll-cue-label">Scroll</span>
                <span class="pf-scroll-cue-line" aria-hidden="true"></span>
            </a>
        </section>

        <!-- ABOUT -->
        <section id="about" class="pf-bio">
            <div class="pf-bio-eye-wrap">
                <span class="pf-bio-rule" aria-hidden="true"></span>
                <span class="pf-bio-eye">01 / About</span>
                <span class="pf-bio-rule" aria-hidden="true"></span>
            </div>
            <p class="pf-bio-text">
                I build small, strange things — games that feel like music, tools that feel like instruments, and worlds that reward being paid attention to.
            </p>
            <p class="pf-bio-text">
                Currently based in Italy, working across engineering, game design, 3D art and sound. Ten years in, I'm still chasing the feeling of making something that doesn't already exist.
            </p>
        </section>

        <!-- SKILLS -->
        <section id="capabilities" class="pf-skills">
            <div class="pf-eyebrow"><span>02 / Toolkit</span></div>

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
import { computed } from 'vue';

const fullName = 'Luca Costa';
const nameChars = computed(() => fullName.split(''));

const renderChar = (ch: string): string => {
    if (ch === ' ') return '&nbsp;';
    return ch;
};

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
