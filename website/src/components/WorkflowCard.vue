<script setup lang="ts">
import type { Workflow, LightweightWorkflow } from "../models/workflow";
import { formatDate } from "../utils/";
import Card from "./ui/Card.vue";
import CardHeader from "./ui/CardHeader.vue";
import CardContent from "./ui/CardContent.vue";
import Badge from "./ui/Badge.vue";

defineProps<{
    workflow: Workflow | LightweightWorkflow;
    compact?: boolean;
}>();

const navigateToCollection = (collection: string) => {
    const slug = collection
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    window.location.href = `/collection/${slug}`;
};
</script>

<template>
    <Card
        :id="`workflow-${workflow.definition.uuid}`"
        :class="[
            'flex flex-col',
            compact ? 'h-[18rem] hover:shadow-lg transition-shadow bg-white' : 'mb-6 hover:shadow-lg transition-shadow',
        ]">
        <!-- Header -->
        <CardHeader :class="compact ? 'p-3' : 'px-6 py-4 pb-2'">
            <a :href="`/workflow/${encodeURIComponent(workflow.iwcID)}/`">
                <h2 :class="`font-bold hover:underline text-ebony-clay ${compact ? 'text-lg' : 'text-xl'}`">
                    {{ workflow.definition.name }}
                </h2>
            </a>
        </CardHeader>

        <!-- Body -->
        <CardContent :class="['flex-1 flex flex-col', compact ? 'px-3 py-2' : 'px-6 py-2']">
            <div class="flex flex-col flex-grow">
                <p :class="`flex-grow ${compact ? 'text-sm line-clamp-6 mb-2' : 'mb-4'}`">
                    {{ workflow.definition.annotation }}
                </p>

                <div
                    v-if="workflow.collections && workflow.collections.length > 0 && !compact"
                    class="flex flex-wrap gap-2">
                    <Badge
                        v-for="collection in workflow.collections"
                        :key="collection"
                        variant="secondary"
                        class="cursor-pointer hover:bg-hokey-pokey hover:text-white transition-colors"
                        @click="navigateToCollection(collection)">
                        {{ collection }}
                    </Badge>
                </div>
                <div
                    v-else-if="workflow.collections && workflow.collections.length > 0 && compact"
                    class="flex flex-wrap gap-1">
                    <Badge
                        v-for="collection in workflow.collections.slice(0, 2)"
                        :key="collection"
                        variant="secondary"
                        class="text-xs cursor-pointer hover:bg-hokey-pokey hover:text-white transition-colors"
                        @click="navigateToCollection(collection)">
                        {{ collection }}
                    </Badge>
                    <Badge v-if="workflow.collections.length > 2" variant="secondary" class="text-xs">
                        +{{ workflow.collections.length - 2 }}
                    </Badge>
                </div>
            </div>
        </CardContent>

        <!-- Footer -->
        <div :class="[compact ? 'p-3' : 'px-6 py-3', 'border-t border-gray-200']">
            <div :class="`flex justify-between ${compact ? 'text-xs' : 'text-xs'} text-gray-500`">
                <p class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ workflow.definition.release }}
                </p>
                <p class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Updated on {{ formatDate(workflow.updated) }}
                </p>
            </div>
        </div>
    </Card>
</template>
