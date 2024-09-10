<template>
  <div class="grid grid-cols-3 gap-4">
    <UCard v-for="workflow in workflows" :key="workflow.id" class="p-6 text-center">
      <template #header>
        <h2 class="mb-4">{{ workflow.name }}</h2>
      </template>
      <p>{{ workflow.description }}</p>
      <nuxt-link :to="`/workflow/${workflow.id}`">Go to workflow</nuxt-link>
    </UCard>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  workflows: Array
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
</style>