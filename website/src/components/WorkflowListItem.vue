<script setup lang="ts">
import type { Workflow, LightweightWorkflow } from "../models/workflow";
import { formatDate } from "../utils/";
import Badge from "./ui/Badge.vue";
import { Tag, Clock } from "lucide-vue-next";

defineProps<{
    workflow: Workflow | LightweightWorkflow;
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
    <div
        :id="`workflow-${workflow.definition.uuid}`"
        class="p-4 border-b border-gray-100 hover:bg-gray-100 transition-colors odd:bg-gray-50">
        <div class="flex items-start gap-4">
            <!-- Main content -->
            <div class="flex-1 min-w-0">
                <a :href="`/workflow/${encodeURIComponent(workflow.iwcID)}/`">
                    <h3 class="text-lg font-bold text-ebony-clay hover:underline mb-2">
                        {{ workflow.definition.name }}
                    </h3>
                </a>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                    {{ workflow.definition.annotation }}
                </p>

                <!-- Collections badges -->
                <div v-if="workflow.collections && workflow.collections.length > 0" class="flex flex-wrap gap-2">
                    <Badge
                        v-for="collection in workflow.collections.slice(0, 4)"
                        :key="collection"
                        variant="secondary"
                        class="text-xs cursor-pointer hover:bg-hokey-pokey hover:text-white transition-colors"
                        @click="navigateToCollection(collection)">
                        {{ collection }}
                    </Badge>
                    <Badge v-if="workflow.collections.length > 4" variant="secondary" class="text-xs">
                        +{{ workflow.collections.length - 4 }}
                    </Badge>
                </div>
            </div>

            <!-- Metadata sidebar -->
            <div class="flex flex-col gap-2 text-xs text-gray-500 min-w-[160px]">
                <div class="flex items-center gap-1.5">
                    <Tag :size="14" />
                    <span>{{ workflow.definition.release }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <Clock :size="14" />
                    <span>{{ formatDate(workflow.updated) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
