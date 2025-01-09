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

const searchQuery = ref("");
const selectedWorkflow = ref<Workflow | null>(null);
const gridDiv = ref<HTMLDivElement | null>(null);

const workflowStore = useWorkflowStore();

const allWorkflows = computed(() => workflowStore.allWorkflows);

// Sort workflows descending by workflow.updated

const sortedWorkflows = computed(() =>
    allWorkflows.value.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
);

const filteredWorkflows = computed(() =>
    sortedWorkflows.value.filter((workflow) =>
        workflow.definition.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
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
                <h1 class="text-6xl mx-8 text-white text-center" :style="{ 'font-weight': 700 }">
                    Discover and run vetted analysis pipelines on Galaxy
                </h1>
                <h3 class="text-xl mx-8 text-white text-center" :style="{ 'font-weight': 600 }">
                    Ready-to-use, open-source pipelines with sample data and training materials to make progress quickly
                    and reliably.
                </h3>
                <PopularWorkflows :workflow-trs-ids="POPULAR_WORKFLOW_TRS_IDS" />
                <div>
                    <button class="bg-white text-ebony-clay text-xl px-4 py-2 rounded" @click="scrollToGrid">
                        Browse all pipelines
                    </button>
                </div>
            </div>
            <div class="overflow-hidden p-0">
                <svg
                    viewBox="14 0 100 40"
                    preserveAspectRatio="none"
                    height="100"
                    class="fill-ebony-clay w-full"
                    :style="{ transform: 'rotate(180deg)' }">
                    <use :xlink:href="`${waveSvg}#path`" />
                </svg>
            </div>
        </template>
        <template #leftSidebar>
            <div class="sticky top-4 h-16">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search workflows"
                    class="w-full mb-4 p-2 border rounded" />
            </div>
            <ul class="mt-6">
                <li
                    v-for="workflow in filteredWorkflows"
                    :key="workflow.definition.uuid"
                    @click="selectWorkflow(workflow)"
                    class="cursor-pointer hover:bg-gray-100 p-2 rounded"
                    :class="{ 'bg-blue-100': selectedWorkflow === workflow }">
                    {{ workflow.definition.name }}
                </li>
            </ul>
        </template>
        <template #content>
            <div ref="gridDiv" class="grid grid-cols-3 gap-4">
                <WorkflowCard
                    v-for="workflow in filteredWorkflows"
                    :key="workflow.definition.uuid"
                    :workflow="workflow" />
            </div>
        </template>
    </NuxtLayout>
</template>
