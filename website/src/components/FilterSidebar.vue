<script setup lang="ts">
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipPortal, TooltipProvider } from "radix-vue";
import { useFilterState } from "../composables/useFilterState";
import type { SearchIndexEntry } from "../models/workflow";

const props = defineProps<{
    workflows: SearchIndexEntry[];
}>();

const { selected, collectionCounts, sortedCollections, handleFilterClick } = useFilterState({
    workflows: props.workflows,
});
</script>

<template>
    <aside class="hidden md:block w-48 lg:w-56 shrink-0 pr-6">
        <div class="sticky top-4">
            <h3 class="text-xs font-semibold text-chicago-400 uppercase tracking-wider mb-3">Categories</h3>

            <TooltipProvider :delay-duration="300">
                <nav class="flex flex-col gap-1">
                    <TooltipRoot v-for="filter in sortedCollections" :key="filter">
                        <TooltipTrigger as-child>
                            <button
                                class="group flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-all duration-150 border-l-4 w-full"
                                :class="{
                                    'bg-hokey-pokey-500/10 text-hokey-pokey-600 border-hokey-pokey-500 pl-2':
                                        selected.includes(filter),
                                    'text-chicago-600 hover:bg-chicago-100 hover:text-chicago-800 border-transparent':
                                        !selected.includes(filter),
                                }"
                                @click="handleFilterClick(filter)">
                                <span class="truncate">{{ filter }}</span>
                                <span
                                    class="text-xs tabular-nums transition-colors ml-2 shrink-0"
                                    :class="{
                                        'text-hokey-pokey-500': selected.includes(filter),
                                        'text-chicago-400 group-hover:text-chicago-500': !selected.includes(filter),
                                    }">
                                    {{ collectionCounts[filter] || 0 }}
                                </span>
                            </button>
                        </TooltipTrigger>
                        <TooltipPortal>
                            <TooltipContent
                                side="right"
                                :side-offset="8"
                                class="bg-ebony-clay text-white text-sm px-3 py-1.5 rounded-md shadow-lg z-50">
                                {{ filter }}
                            </TooltipContent>
                        </TooltipPortal>
                    </TooltipRoot>
                </nav>
            </TooltipProvider>
        </div>
    </aside>
</template>
