<template>
  <BaseCard
    :id="id"
    :type="type"
    :title="title"
    :description="description"
    :year="year"
    :status="status"
    routeName="game-project-details"
  />
</template>

<script lang="ts" setup>
import BaseCard from "./BaseCard.vue";
import { defineProps } from "vue";

defineProps<{
  id: number;
  type: string;
  title: string;
  description: string;
  year: number;
  status?: string;
}>();
</script>
