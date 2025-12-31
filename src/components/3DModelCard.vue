<template>
  <BaseCard
    :id="id"
    :type="type"
    :title="title"
    :description="description"
    :year="year"
    :status="status"
    :tags="tags"
    routeName="3d-model-details"
  />
</template>

<script lang="ts" setup>
import BaseCard from "./BaseCard.vue";

interface Tag {
    id: number;
    title: string;
}

defineProps<{
  id: number;
  type: string;
  title: string;
  description: string;
  year: number;
  status?: string;
  tags?: Tag[];
}>();
</script>
