<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "@nanostores/vue";
import Fuse from "fuse.js";
import { allWorkflows, collectionSearchQuery, viewMode } from "../stores/workflowStore";
import WorkflowCard from "./WorkflowCard.vue";
import WorkflowListItem from "./WorkflowListItem.vue";
import ViewToggle from "./ViewToggle.vue";

const props = defineProps<{
    collectionName: string;
}>();

const workflows = useStore(allWorkflows);
const searchQuery = useStore(collectionSearchQuery);
const mode = useStore(viewMode);
const localSearchQuery = ref("");

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
    if (!localSearchQuery.value) {
        return sortedWorkflows.value;
    } else {
        const searchResults = fuse.value.search(localSearchQuery.value.trim());
        return searchResults.map((result) => result.item);
    }
});

const isSearching = computed(() => localSearchQuery.value.trim().length > 0);

const handleSearchInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    localSearchQuery.value = value;
    collectionSearchQuery.set(value);
};

onMounted(() => {
    // Initialize view mode from localStorage
    const savedViewMode = localStorage.getItem("iwc-view-mode");
    if (savedViewMode === "list" || savedViewMode === "grid") {
        viewMode.set(savedViewMode);
    }
});

onUnmounted(() => {
    // Reset search query when leaving the collection page
    collectionSearchQuery.set("");
});
</script>

<template>
    <div>
        <!-- Search input -->
        <div class="mb-4">
            <input
                type="text"
                :value="localSearchQuery"
                :placeholder="`Search ${collectionName} workflows...`"
                class="w-full p-3 border border-chicago-200 bg-white rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-hokey-pokey-500 focus:border-transparent transition-shadow"
                @input="handleSearchInput" />
        </div>

        <!-- Results header with view toggle -->
        <div class="flex justify-between items-center mb-4">
            <p v-if="isSearching" class="text-chicago-600 text-sm">
                Found <span class="font-semibold">{{ filteredWorkflows.length }}</span> workflows
            </p>
            <p v-else class="text-chicago-600 text-sm">
                <span class="font-semibold">{{ filteredWorkflows.length }}</span> workflows
            </p>
            <ViewToggle />
        </div>

        <div v-if="filteredWorkflows.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-lg">No workflows found matching your search.</p>
            <button
                class="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
                @click="localSearchQuery = ''; collectionSearchQuery.set('')">
                Clear search
            </button>
        </div>

        <!-- List View -->
        <div
            v-else-if="mode === 'list'"
            id="workflows"
            class="flex flex-col border border-ebony-clay-100 rounded-xl overflow-hidden shadow-sm">
            <WorkflowListItem v-for="workflow in filteredWorkflows" :key="workflow.definition.uuid" :workflow="workflow" />
        </div>

        <!-- Grid View -->
        <div v-else id="workflows" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WorkflowCard v-for="workflow in filteredWorkflows" :key="workflow.definition.uuid" :workflow="workflow" compact />
        </div>
    </div>
</template>
