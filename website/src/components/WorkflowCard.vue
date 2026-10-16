<script setup lang="ts">
import { computed } from "vue";
import type { SearchIndexEntry, Workflow } from "../models/workflow";
import { formatDate, navigateToCollection } from "../utils/";
import Card from "./ui/Card.vue";
import CardHeader from "./ui/CardHeader.vue";
import CardContent from "./ui/CardContent.vue";
import Badge from "./ui/Badge.vue";
import { Tag, Clock } from "lucide-vue-next";

const props = defineProps<{
    workflow: SearchIndexEntry | Workflow;
    compact?: boolean;
}>();

// Handle both SearchIndexEntry (flat name) and Workflow (definition.name) types
const workflowName = computed(() => {
    const w = props.workflow as Record<string, unknown>;
    if (w.definition && typeof w.definition === "object" && (w.definition as Record<string, unknown>).name) {
        return (w.definition as Record<string, string>).name;
    }
    return w.name as string;
});

const workflowAnnotation = computed(() => {
    const w = props.workflow as Record<string, unknown>;
    if (w.definition && typeof w.definition === "object" && (w.definition as Record<string, unknown>).annotation) {
        return (w.definition as Record<string, string>).annotation;
    }
    return w.annotation as string;
});

const workflowUuid = computed(() => {
    const w = props.workflow as Record<string, unknown>;
    if (w.definition && typeof w.definition === "object" && (w.definition as Record<string, unknown>).uuid) {
        return (w.definition as Record<string, string>).uuid;
    }
    return w.uuid as string;
});
</script>

<template>
    <div :id="`workflow-${workflowUuid}`" class="group relative h-full">
        <!-- Hover accent bar -->
        <div
            class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-hokey-pokey-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 z-10" />
        <Card
            :class="[
                'flex flex-col h-full',
                compact
                    ? 'hover:shadow-lg transition-all duration-200 bg-white'
                    : 'mb-6 hover:shadow-lg transition-all duration-200',
            ]">
            <!-- Header -->
            <CardHeader :class="compact ? 'p-3' : 'px-6 py-4 pb-2'">
                <a :href="`/workflow/${encodeURIComponent(workflow.iwcID)}/`" class="group/link">
                    <h2
                        :class="[
                            'font-bold text-ebony-clay-900 group-hover/link:text-hokey-pokey-600 transition-colors duration-200',
                            compact ? 'text-lg' : 'text-xl',
                        ]">
                        {{ workflowName }}
                    </h2>
                </a>
            </CardHeader>

            <!-- Body -->
            <CardContent :class="['flex-1 flex flex-col', compact ? 'px-3 py-2' : 'px-6 py-2']">
                <div class="flex flex-col flex-grow">
                    <p :class="`flex-grow ${compact ? 'text-sm line-clamp-3 mb-2' : 'mb-4'}`">
                        {{ workflowAnnotation }}
                    </p>

                    <div
                        v-if="workflow.collections && workflow.collections.length > 0 && !compact"
                        class="flex flex-wrap gap-2">
                        <Badge
                            v-for="collection in workflow.collections"
                            :key="collection"
                            variant="secondary"
                            class="cursor-pointer hover:bg-hokey-pokey-500 hover:text-ebony-clay-950 hover:border-hokey-pokey-500 transition-colors duration-200"
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
                            class="text-xs cursor-pointer hover:bg-hokey-pokey-500 hover:text-ebony-clay-950 hover:border-hokey-pokey-500 transition-colors duration-200"
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
            <div :class="[compact ? 'p-3' : 'px-6 py-3', 'border-t border-ebony-clay-100']">
                <div class="flex justify-between text-xs text-chicago-500">
                    <p class="flex items-center gap-1.5">
                        <Tag :size="14" class="text-bay-of-many-500" />
                        <span class="font-medium text-ebony-clay-700">{{ workflow.release }}</span>
                    </p>
                    <p class="flex items-center gap-1.5">
                        <Clock :size="14" class="text-bay-of-many-400" />
                        <span>{{ formatDate(workflow.updated) }}</span>
                    </p>
                </div>
            </div>
        </Card>
    </div>
</template>
