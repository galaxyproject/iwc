<template>
  <div class="flex">
    <!-- Left sidebar -->
    <div class="w-1/4 p-4 border-r">
      <input v-model="searchQuery" type="text" placeholder="Search workflows" class="w-full mb-4 p-2 border rounded">
      <ul>
        <li v-for="workflow in filteredWorkflows" :key="workflow.definition.uuid" 
            @click="selectWorkflow(workflow)"
            class="cursor-pointer hover:bg-gray-100 p-2 rounded">
          {{ workflow.definition.name }}
        </li>
      </ul>
    </div>
    
    <!-- Right side workflow cards -->
    <div class="w-3/4 p-4">
      <UCard v-for="workflow in selectedWorkflows" :key="workflow.definition.uuid" class="mb-4 p-6">
        <template #header>
          <h2 class="mb-4">{{ workflow.definition.name }}</h2>
        </template>
        <p>{{ workflow.definition.annotation }}</p>
        <nuxt-link :to="`/workflow/${workflow.definition.uuid}`" class="mt-4 inline-block">Go to workflow</nuxt-link>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { type Workflow, type WorkflowCollection } from '~/models/workflow';

const props = defineProps({
  workflowCollections: {
    type: Array as PropType<WorkflowCollection[]>,
    required: true
  }
});

const searchQuery = ref('');
const selectedWorkflows = ref<Workflow[]>([]);

const allWorkflows = computed(() => 
  props.workflowCollections.flatMap(collection => collection.workflows)
);

const filteredWorkflows = computed(() => 
  allWorkflows.value.filter(workflow => 
    workflow.definition.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

function selectWorkflow(workflow: Workflow) {
  const index = selectedWorkflows.value.findIndex(w => w.definition.uuid === workflow.definition.uuid);
  if (index === -1) {
    selectedWorkflows.value.push(workflow);
  } else {
    selectedWorkflows.value.splice(index, 1);
  }
}
</script>

<style scoped>
/* You can add any additional styles here if needed */
</style>