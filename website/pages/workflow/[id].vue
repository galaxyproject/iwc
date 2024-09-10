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

</script>

<template>
  <div v-if="workflow">
    <h1>{{ workflow.name }}</h1>
    <p>{{ workflow.definition.annotation }}</p>
  </div>
  <div v-else>
    <h1>Workflow with identifier {{ route.params.id }} not found</h1>
  </div>
</template>