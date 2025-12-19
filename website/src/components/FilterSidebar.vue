<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "@nanostores/vue";
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipPortal, TooltipProvider } from "radix-vue";
import { selectedFilters, toggleFilter, collectionToSlug, setFilterFromUrl } from "../stores/workflowStore";
import type { SearchIndexEntry } from "../models/workflow";

const props = defineProps<{
    workflows: SearchIndexEntry[];
}>();

const storeSelected = useStore(selectedFilters);

// Use local ref to avoid hydration mismatch - starts empty like SSR
const selected = ref<string[]>([]);
const isHydrated = ref(false);

// Compute collections directly from props (not store) for immediate render
const collections = computed(() => {
    const collectionSet = new Set<string>();
    for (const w of props.workflows) {
        for (const c of w.collections) {
            collectionSet.add(c);
        }
    }
    return Array.from(collectionSet).sort();
});

// Count workflows per collection
const collectionCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const w of props.workflows) {
        for (const c of w.collections) {
            counts[c] = (counts[c] || 0) + 1;
        }
    }
    return counts;
});

// Sort collections by workflow count (descending)
const sortedCollections = computed(() => {
    return [...collections.value].sort((a, b) => {
        return (collectionCounts.value[b] || 0) - (collectionCounts.value[a] || 0);
    });
});

onMounted(() => {
    setFilterFromUrl();
    selected.value = storeSelected.value;
    isHydrated.value = true;
});

// Keep local ref in sync with store changes (only after hydration)
selectedFilters.subscribe((value) => {
    if (isHydrated.value) {
        selected.value = value;
    }
});

const handleFilterClick = (filter: string) => {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
        const wasSelected = selected.value.includes(filter);
        toggleFilter(filter);

        const params = new URLSearchParams(window.location.search);
        if (wasSelected) {
            params.delete("filter");
        } else {
            params.set("filter", filter);
        }

        const newUrl = params.toString() ? `?${params.toString()}` : "/";
        window.history.pushState({}, "", newUrl);
    } else {
        window.location.href = `/collection/${collectionToSlug(filter)}`;
    }
};
</script>

<template>
    <aside class="w-48 lg:w-56 shrink-0 pr-6">
        <div class="sticky top-4">
            <h3 class="text-xs font-semibold text-chicago-400 uppercase tracking-wider mb-3">Categories</h3>

            <TooltipProvider :delay-duration="300">
                <nav class="flex flex-col gap-1">
                    <TooltipRoot v-for="filter in sortedCollections" :key="filter">
                        <TooltipTrigger as-child>
                            <button
                                @click="handleFilterClick(filter)"
                                class="group flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-all duration-150 border-l-4 w-full"
                                :class="{
                                    'bg-hokey-pokey-500/10 text-hokey-pokey-600 border-hokey-pokey-500 pl-2':
                                        selected.includes(filter),
                                    'text-chicago-600 hover:bg-chicago-100 hover:text-chicago-800 border-transparent':
                                        !selected.includes(filter),
                                }">
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
