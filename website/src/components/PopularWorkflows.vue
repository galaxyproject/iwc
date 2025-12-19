<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import WorkflowCard from "./WorkflowCard.vue";
import { searchIndex, loadSearchIndex } from "../stores/workflowStore";

const props = defineProps<{
    /** List of Trs Ids for most popular workflows */
    workflowTrsIds: string[];
}>();

const workflows = useStore(searchIndex);

const popularWorkflows = computed(() => {
    return props.workflowTrsIds
        ?.map((trsID) => {
            return workflows.value.find((w) => w.trsID === trsID);
        })
        .filter(Boolean);
});

onMounted(() => {
    loadSearchIndex();
});
</script>

<template>
    <div class="w-full max-w-6xl mx-auto">
        <h2 class="text-xl my-6 text-white text-center font-semibold">
            Get started with one of our most popular workflows, or browse the full library below.
        </h2>
        <div class="grid grid-cols-3 gap-4 mx-auto px-4">
            <WorkflowCard
                v-for="workflow in popularWorkflows"
                :key="workflow.uuid"
                :workflow="workflow"
                compact />
        </div>
    </div>
</template>
