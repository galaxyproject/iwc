<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { type Workflow } from "~/models/workflow";
import { useWorkflowStore } from "~/stores/workflows";

import MarkdownRenderer from '~/components/MarkdownRenderer.vue';

const categoryDescription = ref<string | null>(null);

async function handleFilterSelected(category: string) {
    selectedCategory.value = category;
    try {
        const response = await fetch(`/category-descriptions/${category.toLowerCase().replace(/ /g, '-')}.md`);
        if (response.ok) {
            categoryDescription.value = await response.text();
        } else {
            categoryDescription.value = null;
            console.error(`Failed to fetch description for ${category}`);
        }
    } catch (error) {
        categoryDescription.value = null;
        console.error(`Error fetching description for ${category}:`, error);
    }
}

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
const selectedCategory = ref<string | null>(null);

const workflowStore = useWorkflowStore();

const allWorkflows = computed(() => workflowStore.allWorkflows);
const allCategories = computed(() => workflowStore.allCategories);
const allTags = computed(() => workflowStore.allTags);

// Sort workflows descending by workflow.updated

const sortedWorkflows = computed(() =>
    allWorkflows.value.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
);

const filteredWorkflows = computed(() =>
    sortedWorkflows.value.filter((workflow) => {
        const matchesSearch = workflow.definition.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesFilters =
            !workflowStore.selectedFilters.length ||
            workflowStore.selectedFilters.every((filter) => workflow.collections.includes(filter));
        return matchesSearch && matchesFilters;
    }),
);

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
                        placeholder="Search pipelines"
                        class="w-full p-2 mb-2 border rounded-lg" />
                </div>
                <Filters @filter-selected="handleFilterSelected" />
            </div>
        </template>
        <template #content>
            <div v-if="selectedCategory" class="w-full my-4 p-4 bg-white rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">{{ selectedCategory }}</h2>
                <div class="prose !max-w-none">
                    <MarkdownRenderer v-if="categoryDescription" :markdownContent="categoryDescription" />
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
