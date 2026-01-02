<script setup lang="ts">
import type { SearchIndexEntry } from "../models/workflow";
import { formatDate, navigateToCollection } from "../utils/";
import Badge from "./ui/Badge.vue";
import { Tag, Clock } from "lucide-vue-next";

defineProps<{
    workflow: SearchIndexEntry;
}>();
</script>

<template>
    <div
        :id="`workflow-${workflow.uuid}`"
        class="group relative px-5 py-4 border-b border-ebony-clay-100 transition-all duration-200 odd:bg-bay-of-many-50/30 hover:bg-bay-of-many-50">
        <!-- Hover accent bar -->
        <div
            class="absolute left-0 top-0 bottom-0 w-1 bg-hokey-pokey-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />

        <div class="flex items-start gap-6">
            <!-- Main content -->
            <div class="flex-1 min-w-0">
                <a :href="`/workflow/${encodeURIComponent(workflow.iwcID)}/`" class="group/link">
                    <h3
                        class="text-lg font-bold text-ebony-clay-900 group-hover/link:text-hokey-pokey-600 transition-colors duration-200 mb-1.5">
                        {{ workflow.name }}
                    </h3>
                </a>
                <p class="text-sm text-chicago-600 mb-3 line-clamp-2 leading-relaxed">
                    {{ workflow.annotation }}
                </p>

                <!-- Collections badges -->
                <div v-if="workflow.collections && workflow.collections.length > 0" class="flex flex-wrap gap-2">
                    <Badge
                        v-for="collection in workflow.collections.slice(0, 4)"
                        :key="collection"
                        variant="secondary"
                        class="text-xs cursor-pointer hover:bg-hokey-pokey-500 hover:text-ebony-clay-950 hover:border-hokey-pokey-500 transition-colors duration-200"
                        @click="navigateToCollection(collection)">
                        {{ collection }}
                    </Badge>
                    <Badge v-if="workflow.collections.length > 4" variant="secondary" class="text-xs">
                        +{{ workflow.collections.length - 4 }}
                    </Badge>
                </div>
            </div>

            <!-- Metadata sidebar -->
            <div class="flex flex-col gap-2.5 text-sm min-w-[140px] pt-0.5">
                <div class="flex items-center gap-2 text-chicago-500">
                    <Tag :size="14" class="text-bay-of-many-500" />
                    <span class="font-medium text-ebony-clay-700">{{ workflow.release }}</span>
                </div>
                <div class="flex items-center gap-2 text-chicago-500">
                    <Clock :size="14" class="text-bay-of-many-400" />
                    <span>{{ formatDate(workflow.updated) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
