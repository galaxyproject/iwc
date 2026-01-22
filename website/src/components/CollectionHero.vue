<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@nanostores/vue";
import { allWorkflows } from "../stores/workflowStore";

const props = defineProps<{
    collectionName: string;
}>();

const workflows = useStore(allWorkflows);

// Filter workflows by the selected collection
const collectionWorkflows = computed(() =>
    workflows.value.filter((workflow) =>
        workflow.collections.some((col) => col.toLowerCase() === props.collectionName.toLowerCase()),
    ),
);
</script>

<template>
    <h2 class="text-lg text-white font-semibold mb-4">
        <span v-if="collectionWorkflows.length > 0">
            Discover {{ collectionWorkflows.length }} workflow{{ collectionWorkflows.length !== 1 ? "s" : "" }} in this
            collection
        </span>
        <span v-else class="opacity-70">Loading workflows...</span>
    </h2>
</template>
