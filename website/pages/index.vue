<script setup lang="ts">
import { ref, computed } from "vue";
import { type Workflow, type WorkflowCollection } from "~/models/workflow";
import { useWorkflowStore } from "~/stores/workflows";
import waveSvg from "~/public/waveNounProject.svg";

// TODO: As an initial implementation, we are explicitly defining trsIds here,
//       but this should ideally be fetched from somewhere, or provided in a yml etc.
//       Could use any other identifier instead of trsId that seems fit
const POPULAR_WORKFLOW_TRS_IDS = [
    "#workflow/github.com/iwc-workflows/atacseq/main",
    "#workflow/github.com/iwc-workflows/chipseq-sr/main",
    "#workflow/github.com/iwc-workflows/sars-cov-2-variation-reporting/COVID-19-VARIATION-REPORTING",
];

import Filters from "~/components/Filters.vue";

const searchQuery = ref("");
const selectedWorkflow = ref<Workflow | null>(null);
const gridDiv = ref<HTMLDivElement | null>(null);

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
            workflowStore.selectedFilters.every(
                (filter) => workflow.collections.includes(filter)
            );
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
    <NuxtLayout class="overflow-hidden">
        <template #hero>
            <div class="flex bg-ebony-clay p-8 space-y-6 items-center" :style="{ 'flex-direction': 'column' }">
                <h1 class="text-5xl my-2 text-white text-center font-bold">
                    Discover and run vetted analysis pipelines on Galaxy
                </h1>
                <h2 class="text-xl text-white text-center font-semibold">
                    Ready-to-use, open-source pipelines with sample data and training materials to make progress quickly
                    and reliably.
                </h2>
                <PopularWorkflows :workflow-trs-ids="POPULAR_WORKFLOW_TRS_IDS" />
                <div class="mt-6">
                    <UButton
                        to="#workflows"
                        variant="outline"
                        color="white"
                        @click="scrollToGrid"
                        icon="i-heroicons-arrow-down"
                        class="font-medium"
                    >
                        Browse all workflows
                    </UButton>
                </div>
            </div>
            <!-- <div class="overflow-hidden p-0">
                <svg
                    viewBox="14 0 100 40"
                    preserveAspectRatio="none"
                    height="100"
                    class="fill-ebony-clay w-full"
                    :style="{ transform: 'rotate(180deg)' }">
                    <use :xlink:href="`${waveSvg}#path`" />
                </svg>
            </div> -->
        </template>
        <template #content>
            <div class="h-16">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search workflows"
                    class="w-full mb-4 p-2 border rounded" />
            </div>
            <Filters />
            <div id="workflows" ref="gridDiv" class="grid grid-cols-3 gap-4">
                <WorkflowCard
                    v-for="workflow in filteredWorkflows"
                    :key="workflow.definition.uuid"
                    :workflow="workflow" />
            </div>
        </template>
    </NuxtLayout>
</template>
