<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "@nanostores/vue";
import {
    DialogRoot,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogClose,
} from "radix-vue";
import { Filter, X } from "lucide-vue-next";
import { selectedFilters, toggleFilter, collectionToSlug, setFilterFromUrl } from "../stores/workflowStore";
import type { SearchIndexEntry } from "../models/workflow";

const props = defineProps<{
    workflows: SearchIndexEntry[];
}>();

const storeSelected = useStore(selectedFilters);
const isOpen = ref(false);

// Use local ref to avoid hydration mismatch
const selected = ref<string[]>([]);
const isHydrated = ref(false);

// Compute collections from props
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

// Button label shows active filter or default text
const buttonLabel = computed(() => {
    if (selected.value.length > 0) {
        return selected.value[0];
    }
    return "Filter by category";
});

onMounted(() => {
    setFilterFromUrl();
    selected.value = storeSelected.value;
    isHydrated.value = true;
});

// Keep local ref in sync with store
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

    // Close the sheet after selection
    isOpen.value = false;
};
</script>

<template>
    <div class="block md:hidden mb-4">
        <DialogRoot v-model:open="isOpen">
            <DialogTrigger as-child>
                <button
                    class="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
                    :class="{
                        'bg-hokey-pokey-500/10 text-hokey-pokey-600 border-hokey-pokey-500': selected.length > 0,
                        'bg-white text-chicago-600 border-chicago-300 hover:bg-chicago-50': selected.length === 0,
                    }">
                    <Filter class="w-4 h-4" />
                    <span>{{ buttonLabel }}</span>
                </button>
            </DialogTrigger>

            <DialogPortal>
                <DialogOverlay
                    class="fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <DialogContent
                    class="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[70vh] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
                    <!-- Handle bar -->
                    <div class="flex justify-center pt-3 pb-1">
                        <div class="w-10 h-1 bg-chicago-300 rounded-full"></div>
                    </div>

                    <!-- Header -->
                    <div class="flex items-center justify-between px-4 py-2 border-b border-chicago-200">
                        <DialogTitle class="text-lg font-semibold text-chicago-800">Categories</DialogTitle>
                        <DialogClose as-child>
                            <button
                                class="p-2 rounded-full hover:bg-chicago-100 text-chicago-500 transition-colors"
                                aria-label="Close">
                                <X class="w-5 h-5" />
                            </button>
                        </DialogClose>
                    </div>

                    <!-- Category list -->
                    <div class="overflow-y-auto max-h-[calc(70vh-100px)] p-4">
                        <nav class="flex flex-col gap-1">
                            <button
                                v-for="filter in sortedCollections"
                                :key="filter"
                                class="group flex items-center justify-between px-3 py-3 rounded-lg text-sm text-left transition-all duration-150 border-l-4 w-full"
                                :class="{
                                    'bg-hokey-pokey-500/10 text-hokey-pokey-600 border-hokey-pokey-500':
                                        selected.includes(filter),
                                    'text-chicago-600 hover:bg-chicago-100 hover:text-chicago-800 border-transparent':
                                        !selected.includes(filter),
                                }"
                                @click="handleFilterClick(filter)">
                                <span>{{ filter }}</span>
                                <span
                                    class="text-xs tabular-nums transition-colors ml-2 shrink-0"
                                    :class="{
                                        'text-hokey-pokey-500': selected.includes(filter),
                                        'text-chicago-400 group-hover:text-chicago-500': !selected.includes(filter),
                                    }">
                                    {{ collectionCounts[filter] || 0 }}
                                </span>
                            </button>
                        </nav>
                    </div>
                </DialogContent>
            </DialogPortal>
        </DialogRoot>
    </div>
</template>
