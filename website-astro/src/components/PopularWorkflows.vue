<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { workflowCollections } from '../stores/workflowStore';
import WorkflowCard from './WorkflowCard.vue';

// TODO: Could use any other identifier instead of trsId that seems fit

const props = defineProps<{
    /** List of Trs Ids for most popular workflows */
    workflowTrsIds: string[];
}>();

const collections = useStore(workflowCollections);

const workflows = computed(() => {
    const allWorkflows = collections.value.flatMap((collection) => collection.workflows);
    return props.workflowTrsIds?.map((trsID) => {
        return allWorkflows.find((w) => w.trsID === trsID);
    }).filter(Boolean);
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
