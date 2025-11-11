<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "@nanostores/vue";
import Fuse from "fuse.js";
import { allWorkflows, collectionSearchQuery } from "../stores/workflowStore";
import WorkflowCard from "./WorkflowCard.vue";
import MarkdownRenderer from "./MarkdownRenderer.vue";
import type { Workflow } from "../models/workflow";

const props = defineProps<{
    collectionName: string;
}>();

const workflows = useStore(allWorkflows);
const searchQuery = useStore(collectionSearchQuery);
const collectionDescription = ref<string | null>(null);
const isLoading = ref(false);

// Load collection description
async function loadCollectionDescription(collection: string) {
    isLoading.value = true;
    try {
        const response = await fetch(`/category-descriptions/${collection.toLowerCase().replace(/ /g, "-")}.md`);
        if (response.ok) {
            collectionDescription.value = await response.text();
        } else {
            collectionDescription.value = null;
        }
    } catch (error) {
        collectionDescription.value = null;
        console.error(`Error fetching description for ${collection}:`, error);
    } finally {
        isLoading.value = false;
    }
}

// Filter workflows by the selected collection
const collectionWorkflows = computed(() =>
    workflows.value.filter((workflow) =>
        workflow.collections.some((col) => col.toLowerCase() === props.collectionName.toLowerCase()),
    ),
);

// Sort workflows descending by workflow.updated
const sortedWorkflows = computed(() =>
    collectionWorkflows.value.slice().sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
);

// Define a fuse instance for fuzzy searching
const fuseOptions = {
    keys: [
        {
            name: "definition.name",
            weight: 0.7,
        },
        {
            name: "definition.annotation",
            weight: 0.3,
        },
        {
            name: "definition.tags",
            weight: 0.1,
        },
    ],
    threshold: 0.3,
};

const fuse = computed(() => new Fuse(sortedWorkflows.value, fuseOptions));

const filteredWorkflows = computed(() => {
    if (!searchQuery.value) {
        return sortedWorkflows.value;
    } else {
        const searchResults = fuse.value.search(searchQuery.value.trim());
        return searchResults.map((result) => result.item);
    }
});

onMounted(() => {
    loadCollectionDescription(props.collectionName);
});

onUnmounted(() => {
    // Reset search query when leaving the collection page
    collectionSearchQuery.set("");
});
</script>

<template>
    <div>
        <div class="w-full my-4 p-4 bg-white rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">About {{ collectionName }}</h2>
            <div class="prose !max-w-none">
                <div v-if="isLoading" class="min-h-[50px] flex items-center justify-center">
                    <span class="text-gray-500">Loading description...</span>
                </div>
                <MarkdownRenderer v-else-if="collectionDescription" :markdownContent="collectionDescription" />
                <div v-else class="text-gray-500">No description available for this collection.</div>
            </div>
        </div>

        <div v-if="filteredWorkflows.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-lg">No workflows found for "{{ collectionName }}"</p>
            <a href="/" class="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"> Browse all workflows </a>
        </div>

        <div v-else id="workflows" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WorkflowCard v-for="workflow in filteredWorkflows" :key="workflow.definition.uuid" :workflow="workflow" />
        </div>
    </div>
</template>
