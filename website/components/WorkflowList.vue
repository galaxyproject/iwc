<script setup lang="ts">
import { ref, computed } from "vue";
import { type Workflow, type WorkflowCollection } from "~/models/workflow";

const props = defineProps({
    workflowCollections: {
        type: Array as PropType<WorkflowCollection[]>,
        required: true,
    },
});

const searchQuery = ref("");
const workflowContainer = ref<HTMLElement | null>(null);
const selectedWorkflow = ref<Workflow | null>(null);

const allWorkflows = computed(() => props.workflowCollections.flatMap((collection) => collection.workflows));

const filteredWorkflows = computed(() =>
    allWorkflows.value.filter((workflow) =>
        workflow.definition.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
);

function scrollToWorkflow(workflow: Workflow) {
    const element = document.getElementById(`workflow-${workflow.definition.uuid}`);
    if (element && workflowContainer.value) {
        workflowContainer.value.scrollTop = element.offsetTop - workflowContainer.value.offsetTop;
    }
}

function selectWorkflow(workflow: Workflow) {
    selectedWorkflow.value = workflow;
    scrollToWorkflow(workflow);
}
</script>

<template>
    <div class="flex">
        <!-- Left sidebar -->
        <div class="w-1/4 p-4 overflow-y-auto">
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
        </div>

        <!-- Right side workflow cards -->
        <div class="w-3/4 p-4 overflow-y-auto" ref="workflowContainer">
            <UCard
                v-for="workflow in filteredWorkflows"
                :key="workflow.definition.uuid"
                :id="`workflow-${workflow.definition.uuid}`"
                class="mb-4 p-6"
                :class="{ 'border-2 border-blue-500': selectedWorkflow === workflow }">
                <template #header>
                    <h2 class="text-xl font-bold mb-2">{{ workflow.definition.name }}</h2>
                </template>
                <p class="mb-4">{{ workflow.definition.annotation }}</p>

                <div v-if="workflow.definition.tags && workflow.definition.tags.length > 0" class="mb-4">
                    <UBadge
                        v-for="tag in workflow.definition.tags"
                        :key="tag"
                        class="mr-2 mb-2"
                        color="primary"
                        variant="soft">
                        {{ tag }}
                    </UBadge>
                </div>

                <UButton :to="`/workflow/${workflow.definition.uuid}`" class="text-primary-400"> Details</UButton>
            </UCard>
        </div>
    </div>
</template>
