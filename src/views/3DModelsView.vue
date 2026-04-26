<template>
    <div>
        <header class="pf-sec-head">
            <span class="pf-sec-eye">Assets &amp; Environments</span>
            <h1 class="pf-sec-title">3D Models</h1>
            <p class="pf-sec-desc">High-fidelity 3D assets for games and simulation — modeled, textured, and rendered.</p>
        </header>

        <section class="pf-work">
            <div class="pf-grid">
                <BaseCard
                    v-for="model in models"
                    :key="model.id"
                    type="models"
                    :id="model.id"
                    :title="model.title"
                    :year="model.year"
                    :description="model.description"
                    :status="model.status"
                    :tags="model.tags"
                    routeName="3d-model-details"
                />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue';
import models from '@/assets/data/models.json';
</script>
