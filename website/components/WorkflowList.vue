<template>
  <div class="grid grid-cols-3 gap-4">
    <template v-for="collection in workflowCollections">
    <UCard v-for="workflow in collection.workflows" :key="workflow.name" class="p-6 text-center">
      <template #header>
        <h2 class="mb-4">{{ workflow.definition.name }}</h2>
      </template>
      <p>{{ workflow.definition.annotation}}</p>
      <nuxt-link :to="`/workflow/${workflow.definition.uuid}`">Go to workflow</nuxt-link>
    </UCard>
</template>
  </div>
</template>

<script setup lang="ts">
import { type Workflow, type WorkflowCollection } from '~/models/workflow';

const props = defineProps({
  workflowCollections: {
    type: Array as PropType<WorkflowCollection[]>,
    required: true
  }
})
</script>


<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
</style>