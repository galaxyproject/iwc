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
    <div>
        <h2 class="text-2xl mx-8 my-4 text-white text-center" :style="{ 'font-weight': 600 }">
            Get started with some of the most popular or recently updated pipelines
        </h2>
        <div class="grid grid-cols-3 gap-8 mx-8">
            <WorkflowCard
                v-for="workflow in workflows"
                :key="workflow.definition.uuid"
                :workflow="workflow" />
        </div>
    </div>
</template>
