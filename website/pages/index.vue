<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { type Workflow } from "~/models/workflow";
import { useWorkflowStore } from "~/stores/workflows";
import { useSeoMeta, useRuntimeConfig, useRoute, useRouter } from "#imports";

import MarkdownRenderer from "~/components/MarkdownRenderer.vue";

import Fuse from "fuse.js";

// Get the public runtime config to access the app URL
const config = useRuntimeConfig().public;
const baseUrl = config.appUrl || (process.client ? window.location.origin : "https://iwc.galaxyproject.org");

// Add SEO meta tags using the specialized useSeoMeta composable
useSeoMeta({
    title: "Intergalactic Workflow Commission",
    description:
        "Ready-to-use, open-source pipelines with sample data and training materials to make progress quickly and reliably",
    ogTitle: "Intergalactic Workflow Commission",
    ogDescription: "Discover and run vetted analysis pipelines on Galaxy",
    ogImage: `${baseUrl}/iwc_logo.png`,
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: "Intergalactic Workflow Commission",
    twitterDescription: "Discover and run vetted analysis pipelines on Galaxy",
    twitterImage: `${baseUrl}/iwc_logo.png`,
});

const categoryDescription = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);
const isLoading = ref(false);

const route = useRoute();
const router = useRouter();
const workflowStore = useWorkflowStore();

async function loadCategoryDescription(category: string) {
    isLoading.value = true;
    try {
        const response = await fetch(`/category-descriptions/${category.toLowerCase().replace(/ /g, "-")}.md`);
        if (response.ok) {
            categoryDescription.value = await response.text();
        } else {
            categoryDescription.value = null;
            console.error(`Failed to fetch description for ${category}`);
        }
    } catch (error) {
        categoryDescription.value = null;
        console.error(`Error fetching description for ${category}:`, error);
    } finally {
        isLoading.value = false;
    }
}

// Watch for URL query changes and update filters accordingly
watch(
    () => route.query.filter,
    (newFilter) => {
        if (newFilter && typeof newFilter === "string") {
            if (workflowStore.allFilters.includes(newFilter) && !workflowStore.selectedFilters.includes(newFilter)) {
                workflowStore.selectedFilters = [newFilter];
            }
        } else {
            workflowStore.selectedFilters = [];
        }
    },
    { immediate: true },
);

watch(
    () => workflowStore.selectedFilters,
    (newFilters) => {
        if (newFilters.length === 1) {
            selectedCategory.value = newFilters[0];
            categoryDescription.value = null;
            loadCategoryDescription(newFilters[0]);
        } else {
            selectedCategory.value = null;
            categoryDescription.value = null;
        }
    },
    { immediate: true },
);

// Initialize filters from URL on mount
onMounted(() => {
    workflowStore.setFilterFromUrl();
});

// TODO: As an initial implementation, we are explicitly defining trsIds here,
//       but this should ideally be fetched from somewhere, or provided in a yml etc.
const POPULAR_WORKFLOW_TRS_IDS = [
    "#workflow/github.com/iwc-workflows/rnaseq-pe/main",
    "#workflow/github.com/iwc-workflows/chipseq-pe/main",
    "#workflow/github.com/iwc-workflows/atacseq/main",
];

import Filters from "~/components/Filters.vue";

const searchQuery = ref("");
const selectedWorkflow = ref<Workflow | null>(null);
const gridDiv = ref<HTMLDivElement | null>(null);

const allWorkflows = computed(() => workflowStore.allWorkflows);
const allCategories = computed(() => workflowStore.allCategories);
const allTags = computed(() => workflowStore.allTags);

// Sort workflows descending by workflow.updated

const sortedWorkflows = computed(() =>
    allWorkflows.value.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
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
    const matchesSelectedFilters = (workflow: Workflow): boolean => {
        return (
            !workflowStore.selectedFilters.length ||
            workflowStore.selectedFilters.every((filter) => workflow.collections.includes(filter))
        );
    };

    if (!searchQuery.value) {
        return sortedWorkflows.value.filter(matchesSelectedFilters);
    } else {
        const searchResults = fuse.value.search(searchQuery.value.trim());
        const fuzzyMatches = searchResults.map((result) => result.item);
        return fuzzyMatches.filter(matchesSelectedFilters);
    }
});

function scrollToGrid() {
    gridDiv.value?.scrollIntoView({ behavior: "smooth" });
}

function scrollToWorkflow(workflow: Workflow) {
    const element = document.getElementById(`workflow-${workflow.definition.uuid}`);
    if (element) {
        element.parentElement?.scrollTo({
            top: element.offsetTop - element.parentElement.offsetTop - 8,
            behavior: "smooth",
        });
    }
}

function selectWorkflow(workflow: Workflow) {
    selectedWorkflow.value = workflow;
    scrollToWorkflow(workflow);
}
</script>

<template>
    <NuxtLayout>
        <template #hero>
            <div class="flex bg-ebony-clay p-4 items-center" :style="{ 'flex-direction': 'column' }">
                <h1 class="text-5xl my-8 text-white text-center font-bold">
                    Discover and run vetted analysis pipelines on Galaxy
                </h1>
                <h2 class="text-xl text-white text-center font-semibold mb-16">
                    Ready-to-use, open-source pipelines with sample data and training materials to make progress quickly
                    and reliably.
                </h2>
                <PopularWorkflows :workflow-trs-ids="POPULAR_WORKFLOW_TRS_IDS" />
                <div class="max-w-6xl w-full mt-12 p-4">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search workflows"
                        class="w-full p-2 mb-2 border rounded-lg" />
                </div>
                <Filters />
            </div>
        </template>
        <template #content>
            <div v-if="selectedCategory" class="w-full my-4 p-4 bg-white rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">{{ selectedCategory }}</h2>
                <div class="prose !max-w-none">
                    <Transition name="fade" mode="out-in">
                        <div v-if="isLoading" key="loading" class="min-h-[50px] flex items-center justify-center">
                            <span class="text-gray-500">Loading description...</span>
                        </div>
                        <MarkdownRenderer
                            v-else-if="categoryDescription"
                            key="content"
                            :markdownContent="categoryDescription" />
                        <div v-else key="empty" class="text-gray-500">No description available for this category.</div>
                    </Transition>
                </div>
            </div>
            <div id="workflows" ref="gridDiv" class="grid grid-cols-3 gap-4">
                <WorkflowCard
                    v-for="workflow in filteredWorkflows"
                    :key="workflow.definition.uuid"
                    :workflow="workflow" />
            </div>
        </template>
    </NuxtLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
