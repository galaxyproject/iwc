<template>
<WorkflowList :workflows="workflows"/>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import WorkflowList from '../components/WorkflowList.vue'
import workflows from "../public/workflow_manifest.json"

// TODO: use useFetch instead of importing the JSON file?  Tradeoffs?
// const { data: workflows } = await useFetch('/workflow_manifest.json')

</script>