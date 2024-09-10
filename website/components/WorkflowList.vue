<template>
  <div class="flex h-screen">
    <!-- Left sidebar -->
    <div class="w-1/4 p-4 overflow-y-auto">
      <input v-model="searchQuery" type="text" placeholder="Search workflows" class="w-full mb-4 p-2 border rounded">
      <ul>
        <li v-for="workflow in filteredWorkflows" :key="workflow.definition.uuid" @click="scrollToWorkflow(workflow)"
          class="cursor-pointer hover:bg-gray-100 p-2 rounded">
          {{ workflow.definition.name }}
        </li>
      </ul>
    </div>

    <!-- Right side workflow cards -->
    <div class="w-3/4 p-4 overflow-y-auto" ref="workflowContainer">
      <UCard v-for="workflow in filteredWorkflows" :key="workflow.definition.uuid"
        :id="`workflow-${workflow.definition.uuid}`" class="mb-4 p-6">
        <template #header>
          <h2 class="text-xl font-bold mb-2">{{ workflow.definition.name }}</h2>
        </template>
        <p class="mb-4">{{ workflow.definition.annotation }}</p>
        <nuxt-link :to="`/workflow/${workflow.definition.uuid}`" class="text-blue-500 hover:underline">Go to
          workflow</nuxt-link>
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
const workflowContainer = ref<HTMLElement | null>(null);

const allWorkflows = computed(() =>
  props.workflowCollections.flatMap(collection => collection.workflows)
);

const filteredWorkflows = computed(() =>
  allWorkflows.value.filter(workflow =>
    workflow.definition.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

function scrollToWorkflow(workflow: Workflow) {
  const element = document.getElementById(`workflow-${workflow.definition.uuid}`);
  if (element && workflowContainer.value) {
    workflowContainer.value.scrollTop = element.offsetTop - workflowContainer.value.offsetTop;
  }
}
</script>

<style scoped>
.h-screen {
  height: calc(100vh - 4rem);
  /* Adjust this value based on your header height */
}
</style>