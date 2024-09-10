<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { type Workflow, type WorkflowCollection } from '~/models/workflow'
import { workflowCollections } from '~/models/workflow'

const route = useRoute()
const workflow = ref<Workflow | null>(null)

const allWorkflows = computed(() =>
  workflowCollections.flatMap(collection => collection.workflows)
)

workflow.value = allWorkflows.value.find(w => w.definition.uuid === route.params.id)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div v-if="workflow" class="max-w-3xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-4">{{ workflow.name }}</h1>
    <div class="bg-gray-100 p-4 rounded-lg mb-6">
      <p class="text-gray-700">{{ workflow.definition.annotation }}</p>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div>
        <h2 class="text-xl font-semibold mb-2">Details</h2>
        <p><strong>Authors:</strong> {{ workflow.authors.join(', ') }}</p>
        <p><strong>Release:</strong> {{ workflow.definition.release}}</p>
      </div>
      <!-- <div>
        <h2 class="text-xl font-semibold mb-2">Categories</h2>
        <ul class="list-disc list-inside">
          <li v-for="category in workflow.definition.categories" :key="category">
            {{ category }}
          </li>
        </ul>
      </div> -->
    </div>
    <div v-if="workflow.readme" class="mb-6">
      <h2 class="text-2xl font-semibold mb-4">README</h2>
      <div class="prose" v-html="workflow.readme"></div>
    </div>
    <div v-if="workflow.changelog" class="mb-6">
      <h2 class="text-2xl font-semibold mb-4">CHANGELOG</h2>
      <div class="prose" v-html="workflow.changelog"></div>
    </div>
  </div>
  <div v-else class="max-w-3xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-4">Workflow not found</h1>
    <p>Workflow with identifier {{ route.params.id }} could not be found.</p>
  </div>
</template>