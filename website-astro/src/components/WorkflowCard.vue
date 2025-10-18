<script setup lang="ts">
import type { Workflow } from "../models/workflow";
import { formatDate } from "../utils/";

defineProps<{
    workflow: Workflow;
    compact?: boolean;
}>();

const navigateToCollection = (collection: string) => {
    const slug = collection.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    window.location.href = `/collection/${slug}`;
};
</script>

<template>
    <div
        :id="`workflow-${workflow.definition.uuid}`"
        :class="[
            'flex flex-col border rounded-lg',
            compact
                ? 'h-[18rem] shadow-md hover:shadow-lg transition-shadow bg-white bg-opacity-90 backdrop-blur-sm'
                : 'mb-6 bg-white shadow'
        ]"
    >
        <!-- Header -->
        <div :class="compact ? 'p-3' : 'px-6 py-4'">
            <a :href="`/workflow/${encodeURIComponent(workflow.iwcID)}/`">
                <h2 :class="`font-bold hover:underline text-ebony-clay ${compact ? 'text-lg' : 'text-xl mb-2'}`">
                    {{ workflow.definition.name }}
                </h2>
            </a>
        </div>

        <!-- Body -->
        <div :class="['flex-1 flex flex-col', compact ? 'px-3 py-2' : 'px-6 py-2']">
            <div class="flex flex-col flex-grow">
                <p :class="`flex-grow ${compact ? 'text-sm line-clamp-6 mb-2' : 'mb-4'}`">
                    {{ workflow.definition.annotation }}
                </p>

                <div v-if="workflow.collections && workflow.collections.length > 0 && !compact">
                    <span
                        v-for="collection in workflow.collections"
                        :key="collection"
                        class="inline-block mr-2 mb-2 px-3 py-1 text-xs font-semibold rounded-full bg-hokey-pokey text-white cursor-pointer hover:opacity-80 transition-opacity"
                        @click="navigateToCollection(collection)">
                        {{ collection }}
                    </span>
                </div>
                <div v-else-if="workflow.collections && workflow.collections.length > 0 && compact">
                    <span
                        v-for="collection in workflow.collections.slice(0, 2)"
                        :key="collection"
                        class="inline-block mr-1 mb-1 px-2 py-1 text-xs font-semibold rounded-full bg-hokey-pokey text-white cursor-pointer hover:opacity-80 transition-opacity"
                        @click="navigateToCollection(collection)">
                        {{ collection }}
                    </span>
                    <span v-if="workflow.collections.length > 2" class="inline-block mr-1 mb-1 px-2 py-1 text-xs font-semibold rounded-full bg-hokey-pokey text-white">
                        +{{ workflow.collections.length - 2 }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div :class="[compact ? 'p-3' : 'px-6 py-2', 'border-t']">
            <div :class="`flex justify-between ${compact ? 'text-xs' : 'text-xs'} text-gray-500`">
                <p class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ workflow.definition.release }}
                </p>
                <p class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Updated on {{ formatDate(workflow.updated) }}
                </p>
            </div>
        </div>
    </div>
</template>
