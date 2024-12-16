<script setup lang="ts">
import { ref, computed } from "vue";
import { type Workflow, type WorkflowCollection } from "~/models/workflow";
import { useWorkflowStore } from "~/stores/workflows";
import { formatDate } from "~/utils/";

const searchQuery = ref("");
const selectedWorkflow = ref<Workflow | null>(null);

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
        <template #sidebar>
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
            <div class="grid grid-cols-3 gap-4">
                <UCard
                    v-for="workflow in filteredWorkflows"
                    :key="workflow.definition.uuid"
                    :id="`workflow-${workflow.definition.uuid}`"
                    :ui="{
                        strategy: 'override',
                        base: 'flex flex-col',
                        header: {
                            padding: 'px-6 py-4',
                        },
                        body: {
                            base: 'flex-1',
                            padding: 'px-6 py-4',
                        },
                        footer: {
                            padding: 'px-6 py-2',
                        },
                    }"
                    class="mb-6">
                    <template #header>
                        <h2 class="text-xl font-bold mb-2">{{ workflow.definition.name }}</h2>
                    </template>
                    <p class="mb-4">{{ workflow.definition.annotation }}</p>

                    <div v-if="workflow.definition.tags && workflow.definition.tags.length > 0" class="mb-4">
                        <UBadge v-for="tag in workflow.definition.tags" :key="tag" class="mr-2 mb-2" variant="soft">
                            {{ tag }}
                        </UBadge>
                    </div>
                    <template #footer>
                        <div class="flex space-x-4">
                            <p class="text-xs text-gray-500">Release {{ workflow.definition.release }}</p>
                            <p class="text-xs text-gray-500">{{ formatDate(workflow.updated) }}</p>
                        </div>
                    </template>

                    <UButton :to="`/workflow/${encodeURIComponent(workflow.trsID)}/`">Details</UButton>
                </UCard>
            </div>
        </template>
    </NuxtLayout>
</template>
