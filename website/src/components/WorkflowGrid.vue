<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import Fuse from "fuse.js";
import { selectedFilters, setFilterFromUrl } from "../stores/workflowStore";
import WorkflowCard from "./WorkflowCard.vue";
import type { LightweightWorkflow } from "../models/workflow";

// Accept workflows as props (passed from Astro at build time)
const props = defineProps<{
    workflows: LightweightWorkflow[];
}>();

const filters = useStore(selectedFilters);
const searchQuery = ref("");

// Sort workflows by updated date
const sortedWorkflows = computed(() =>
    props.workflows.slice().sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
);

// Fuse.js configuration
const fuseOptions = {
    keys: [
        { name: "definition.name", weight: 0.7 },
        { name: "definition.annotation", weight: 0.3 },
        { name: "definition.tags", weight: 0.1 },
    ],
    threshold: 0.3,
};

const fuse = computed(() => new Fuse(sortedWorkflows.value, fuseOptions));

// Filtered workflows
const filteredWorkflows = computed(() => {
    const matchesSelectedFilters = (workflow: LightweightWorkflow): boolean => {
        return !filters.value.length || filters.value.every((filter) => workflow.collections.includes(filter));
    };

    if (!searchQuery.value) {
        return sortedWorkflows.value.filter(matchesSelectedFilters);
    } else {
        const searchResults = fuse.value.search(searchQuery.value.trim());
        const fuzzyMatches = searchResults.map((result) => result.item);
        return fuzzyMatches.filter(matchesSelectedFilters);
    }
});

// Auto-scroll to grid when filter is present
onMounted(() => {
    setFilterFromUrl();

    const params = new URLSearchParams(window.location.search);
    if (params.get("filter")) {
        setTimeout(() => {
            const gridElement = document.getElementById("workflows");
            if (gridElement) {
                gridElement.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    }

    // Listen for search input changes
    window.addEventListener("search-change", (e: Event) => {
        const customEvent = e as CustomEvent;
        searchQuery.value = customEvent.detail;
    });
});
</script>

<template>
    <div class="w-full">
        <div id="workflows" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WorkflowCard v-for="workflow in filteredWorkflows" :key="workflow.definition.uuid" :workflow="workflow" />
        </div>
        <div v-if="filteredWorkflows.length === 0" class="text-center py-12 text-gray-500">
            <p class="text-xl">No workflows found matching your criteria.</p>
        </div>
    </div>
</template>
