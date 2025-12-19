<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@nanostores/vue";
import { allWorkflows, collectionSearchQuery } from "../stores/workflowStore";

const props = defineProps<{
    collectionName: string;
    showBackLink?: boolean;
}>();

const workflows = useStore(allWorkflows);
const searchQuery = useStore(collectionSearchQuery);

// Filter workflows by the selected collection
const collectionWorkflows = computed(() =>
    workflows.value.filter((workflow) =>
        workflow.collections.some((col) => col.toLowerCase() === props.collectionName.toLowerCase()),
    ),
);
</script>

<template>
    <div class="w-full p-4 bg-ebony-clay text-center">
        <h2 class="text-lg text-white font-semibold mb-4">
            Discover {{ collectionWorkflows.length }} workflow{{ collectionWorkflows.length !== 1 ? "s" : "" }} in this
            collection
        </h2>

        <div class="max-w-6xl w-full mx-auto">
            <input
                :value="searchQuery"
                @input="collectionSearchQuery.set($event.target.value)"
                type="text"
                :placeholder="`Search ${collectionName} workflows`"
                class="w-full p-3 border border-ebony-clay-200 bg-white rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-hokey-pokey-500 focus:border-transparent transition-shadow" />
        </div>

        <div v-if="showBackLink" class="mt-4">
            <a href="/" class="text-white hover:text-hokey-pokey-300 underline transition-colors"> ← Back to all workflows </a>
        </div>
    </div>
</template>
