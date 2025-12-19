<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import Fuse from "fuse.js";
import {
    selectedFilters,
    setFilterFromUrl,
    setSearchFromUrl,
    viewMode,
    searchQuery as searchQueryStore,
    isSearchActive,
    searchIndex,
    loadSearchIndex,
} from "../stores/workflowStore";
import WorkflowCard from "./WorkflowCard.vue";
import WorkflowListItem from "./WorkflowListItem.vue";
import ViewToggle from "./ViewToggle.vue";
import type { SearchIndexEntry } from "../models/workflow";

const filters = useStore(selectedFilters);
const mode = useStore(viewMode);
const searchQuery = useStore(searchQueryStore);
const isSearching = useStore(isSearchActive);
const workflows = useStore(searchIndex);

// Sort workflows by updated date
const sortedWorkflows = computed(() =>
    workflows.value.slice().sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
);

// Fuse.js configuration (flat structure now)
const fuseOptions = {
    keys: [
        { name: "name", weight: 0.5 },
        { name: "annotation", weight: 0.4 },
        { name: "tags", weight: 0.2 },
        { name: "collections", weight: 0.1 },
    ],
    threshold: 0.4,
    ignoreLocation: true, // Match anywhere in the string equally
    minMatchCharLength: 2,
};

const fuse = computed(() => new Fuse(sortedWorkflows.value, fuseOptions));

// Filtered workflows
const filteredWorkflows = computed(() => {
    const matchesSelectedFilters = (workflow: SearchIndexEntry): boolean => {
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

// Computed for results count display
const hasActiveFilters = computed(() => isSearching.value || filters.value.length > 0);
const selectedCategory = computed(() => (filters.value.length > 0 ? filters.value[0] : null));

// Auto-scroll to grid when filter is present
onMounted(async () => {
    // Load search index from static JSON
    await loadSearchIndex();

    setFilterFromUrl();
    setSearchFromUrl();

    // Initialize view mode from localStorage
    const savedViewMode = localStorage.getItem("iwc-view-mode");
    if (savedViewMode === "list" || savedViewMode === "grid") {
        viewMode.set(savedViewMode);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("filter")) {
        setTimeout(() => {
            const gridElement = document.getElementById("workflows");
            if (gridElement) {
                gridElement.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    }
});
</script>

<template>
    <div class="w-full">
        <!-- Results header row -->
        <div class="flex justify-between items-center mb-4">
            <Transition name="fade" mode="out-in">
                <!-- Searching with category -->
                <p v-if="isSearching && selectedCategory" key="search-category" class="text-chicago-600 text-sm">
                    Found <span class="font-semibold">{{ filteredWorkflows.length }}</span>
                    <span class="font-bold text-ebony-clay-900"> {{ selectedCategory }} </span> workflows
                </p>
                <!-- Searching only -->
                <p v-else-if="isSearching" key="search" class="text-chicago-600 text-sm">
                    Found <span class="font-semibold">{{ filteredWorkflows.length }}</span> workflows
                </p>
                <!-- Category only -->
                <p v-else-if="selectedCategory" key="category" class="text-chicago-600 text-sm">
                    <span class="font-semibold">{{ filteredWorkflows.length }}</span>
                    <span class="font-bold text-ebony-clay-900"> {{ selectedCategory }} </span> workflows
                </p>
                <!-- No filters -->
                <p v-else key="total" class="text-chicago-500 text-sm">
                    {{ sortedWorkflows.length }} workflows
                </p>
            </Transition>
            <ViewToggle />
        </div>

        <!-- View transition wrapper -->
        <Transition name="view-fade" mode="out-in">
            <!-- List View -->
            <div
                v-if="mode === 'list'"
                key="list"
                id="workflows"
                class="flex flex-col border border-ebony-clay-100 rounded-xl overflow-hidden shadow-sm">
                <TransitionGroup name="list-stagger" appear>
                    <WorkflowListItem
                        v-for="(workflow, index) in filteredWorkflows"
                        :key="workflow.uuid"
                        :workflow="workflow"
                        :style="{ '--stagger-delay': `${Math.min(index * 20, 300)}ms` }" />
                </TransitionGroup>
            </div>

            <!-- Grid View -->
            <div v-else key="grid" id="workflows" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TransitionGroup name="grid-stagger" appear>
                    <WorkflowCard
                        v-for="(workflow, index) in filteredWorkflows"
                        :key="workflow.uuid"
                        :workflow="workflow"
                        :style="{ '--stagger-delay': `${Math.min(index * 30, 400)}ms` }"
                        compact />
                </TransitionGroup>
            </div>
        </Transition>

        <Transition name="fade">
            <div v-if="filteredWorkflows.length === 0" class="text-center py-12 text-chicago-500">
                <p class="text-xl">No workflows found matching your criteria.</p>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* View switch transition */
.view-fade-enter-active,
.view-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.view-fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
}

.view-fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

/* List stagger animation */
.list-stagger-enter-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;
    transition-delay: var(--stagger-delay, 0ms);
}

.list-stagger-enter-from {
    opacity: 0;
    transform: translateX(-12px);
}

/* Grid stagger animation */
.grid-stagger-enter-active {
    transition:
        opacity 0.35s ease,
        transform 0.35s ease;
    transition-delay: var(--stagger-delay, 0ms);
}

.grid-stagger-enter-from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}

/* Simple fade for empty state */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
