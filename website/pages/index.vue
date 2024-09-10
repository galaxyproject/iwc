<template>
    <WorkflowList :workflowCollections="workflowCollections" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import WorkflowList from "../components/WorkflowList.vue";
import { workflowCollections } from "../models/workflow";

// TODO: use useFetch instead of importing the JSON file?  Tradeoffs?
// const { data: workflows } = await useFetch('/workflow_manifest.json')
</script>
