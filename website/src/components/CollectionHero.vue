<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { allWorkflows, collectionSearchQuery } from "../stores/workflowStore";

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

// Wire up the static search input to the store
onMounted(() => {
    const searchInput = document.getElementById("collection-search") as HTMLInputElement;
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            collectionSearchQuery.set((e.target as HTMLInputElement).value);
        });
    }
});
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
