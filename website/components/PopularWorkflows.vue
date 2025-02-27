<script setup lang="ts">
import { useWorkflowStore } from "~/stores/workflows";

// TODO: Could use any other identifier instead of trsId that seems fit

const props = defineProps<{
    /** List of Trs Ids for most popular workflows */
    workflowTrsIds: string[];
}>();

const workflowStore = useWorkflowStore();

const workflows = computed(() => {
    return props.workflowTrsIds?.map((trsID) => workflowStore.getWorkflowByTrsId(trsID));
});
</script>

<template>
    <div class="w-full max-w-6xl mx-auto">
        <h2 class="text-xl my-6 text-white text-center font-semibold">
            Get started with one of our most popular workflows, or browse the full library below.
        </h2>
        <div class="grid grid-cols-3 gap-4 mx-auto px-4">
            <WorkflowCard v-for="workflow in workflows" :key="workflow.definition.uuid" :workflow="workflow" compact />
        </div>
    </div>
</template>
