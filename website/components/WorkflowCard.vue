<script setup lang="ts">
import type { Workflow } from '~/models/workflow';
import { formatDate } from "~/utils/";

defineProps<{
    workflow: Workflow;
}>();
</script>
<template>
    <UCard
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
</template>