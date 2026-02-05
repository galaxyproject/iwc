<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "@nanostores/vue";
import Fuse from "fuse.js";
import {
    selectedFilters,
    setFilterFromUrl,
    setSearchFromUrl,
    updateSearchUrl,
    viewMode,
    searchQuery as searchQueryStore,
    searchIndex,
} from "../stores/workflowStore";
import WorkflowCard from "./WorkflowCard.vue";
import WorkflowListItem from "./WorkflowListItem.vue";
import ViewToggle from "./ViewToggle.vue";
import type { SearchIndexEntry } from "../models/workflow";

const props = defineProps<{
    workflows: SearchIndexEntry[];
}>();

// Initialize store with prop data immediately (for other components that read from store)
searchIndex.set(props.workflows);

const mode = useStore(viewMode);

// Use local refs to avoid hydration mismatch - start empty like SSR
const localFilters = ref<string[]>([]);
const localSearchQuery = ref("");
const isHydrated = ref(false);
const isSearching = computed(() => localSearchQuery.value.trim().length > 0);

// Sort workflows by updated date (use props directly, no store subscription needed)
const sortedWorkflows = computed(() =>
    props.workflows.slice().sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
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

// Filtered workflows (use local refs for hydration safety)
const filteredWorkflows = computed(() => {
    const matchesSelectedFilters = (workflow: SearchIndexEntry): boolean => {
        return (
            !localFilters.value.length || localFilters.value.every((filter) => workflow.collections.includes(filter))
        );
    };

    if (!localSearchQuery.value) {
        return sortedWorkflows.value.filter(matchesSelectedFilters);
    } else {
        const searchResults = fuse.value.search(localSearchQuery.value.trim());
        const fuzzyMatches = searchResults.map((result) => result.item);
        return fuzzyMatches.filter(matchesSelectedFilters);
    }
});

// Computed for results count display
const _hasActiveFilters = computed(() => isSearching.value || localFilters.value.length > 0);
const selectedCategory = computed(() => (localFilters.value.length > 0 ? localFilters.value[0] : null));

// Debounced URL update for search
let urlUpdateTimeout: ReturnType<typeof setTimeout>;
const handleSearchInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    localSearchQuery.value = value;
    searchQueryStore.set(value);

    clearTimeout(urlUpdateTimeout);
    urlUpdateTimeout = setTimeout(() => {
        updateSearchUrl(value);
    }, 300);
};

onMounted(() => {
    setFilterFromUrl();
    setSearchFromUrl();

    // Sync local refs with store after hydration
    localFilters.value = selectedFilters.get();
    localSearchQuery.value = searchQueryStore.get();
    isHydrated.value = true;

    // Initialize view mode from localStorage
    const savedViewMode = localStorage.getItem("iwc-view-mode");
    if (savedViewMode === "list" || savedViewMode === "grid") {
        viewMode.set(savedViewMode);
    }
});

// Keep local refs in sync with store changes (only after hydration)
selectedFilters.subscribe((value) => {
    if (isHydrated.value) {
        localFilters.value = value;
    }
});
searchQueryStore.subscribe((value) => {
    if (isHydrated.value) {
        localSearchQuery.value = value;
    }
});
</script>

<template>
    <div class="w-full">
        <!-- Search input -->
        <div class="mb-4">
            <input
                type="text"
                :value="localSearchQuery"
                placeholder="Search workflows..."
                class="w-full p-3 border border-chicago-200 bg-white rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-hokey-pokey-500 focus:border-transparent transition-shadow"
                @input="handleSearchInput" />
        </div>

        <!-- Results header row -->
        <div class="flex justify-between items-center mb-4">
            <Transition name="fade" mode="out-in">
                <!-- Searching with category -->
                <p v-if="isSearching && selectedCategory" key="search-category" class="text-chicago-600 text-sm">
                    Found <span class="font-semibold">{{ filteredWorkflows.length }}</span
                    >&nbsp;<span class="font-bold text-ebony-clay-900">{{ selectedCategory }}</span
                    >&nbsp;workflows matching your query
                </p>
                <!-- Searching only -->
                <p v-else-if="isSearching" key="search" class="text-chicago-600 text-sm">
                    Found <span class="font-semibold">{{ filteredWorkflows.length }}</span> workflows
                </p>
                <!-- Category only -->
                <p v-else-if="selectedCategory" key="category" class="text-chicago-600 text-sm">
                    <span class="font-semibold">{{ filteredWorkflows.length }}</span
                    >&nbsp;<span class="font-bold text-ebony-clay-900">{{ selectedCategory }}</span
                    >&nbsp;workflows
                </p>
                <!-- No filters -->
                <p v-else key="total" class="text-chicago-500 text-sm">
                    <span class="font-semibold">{{ sortedWorkflows.length }}</span> <span>workflows</span>
                </p>
            </Transition>
            <ViewToggle />
        </div>

        <!-- View transition wrapper -->
        <Transition name="view-fade" mode="out-in">
            <!-- List View -->
            <div
                v-if="mode === 'list'"
                id="workflows"
                key="list"
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
            <div v-else id="workflows" key="grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        <!-- Discover more workflows -->
        <div
            class="mt-8 py-5 px-6 rounded-lg border border-chicago-200 bg-chicago-50 text-center text-sm text-chicago-600">
            Find more Galaxy workflows on
            <a
                href="https://dockstore.org/search?descriptorType=Galaxy&descriptorType=gxformat2&entryType=workflows&searchMode=files"
                target="_blank"
                rel="noopener noreferrer"
                class="text-hokey-pokey-700 underline hover:text-hokey-pokey-900"
                >Dockstore</a
            >,
            <a
                href="https://workflowhub.eu/workflows?filter%5Bworkflow_type%5D=galaxy"
                target="_blank"
                rel="noopener noreferrer"
                class="text-hokey-pokey-700 underline hover:text-hokey-pokey-900"
                >WorkflowHub</a
            >, and the
            <a
                href="https://training.galaxyproject.org/training-material/workflows/list"
                target="_blank"
                rel="noopener noreferrer"
                class="text-hokey-pokey-700 underline hover:text-hokey-pokey-900"
                >Galaxy Training Network</a
            >.
        </div>
    </div>
</template>

<style scoped>
/* View switch transition */
.view-fade-enter-active,
.view-fade-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
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
