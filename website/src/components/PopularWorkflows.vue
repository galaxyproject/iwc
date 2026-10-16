<script setup lang="ts">
import { computed } from "vue";
import WorkflowCard from "./WorkflowCard.vue";
import type { SearchIndexEntry } from "../models/workflow";

const props = defineProps<{
    /** List of Trs Ids for most popular workflows */
    workflowTrsIds: string[];
    workflows: SearchIndexEntry[];
}>();

const popularWorkflows = computed(() => {
    return props.workflowTrsIds
        ?.map((trsID) => {
            return props.workflows.find((w) => w.trsID === trsID);
        })
        .filter(Boolean);
});
</script>

<template>
    <div class="w-full max-w-6xl mx-auto">
        <h2 class="text-xl my-6 text-white text-center font-semibold">
            Get started with one of our most popular workflows, or browse the full library below.
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto px-4">
            <WorkflowCard v-for="workflow in popularWorkflows" :key="workflow.uuid" :workflow="workflow" compact />
        </div>
    </div>
</template>
