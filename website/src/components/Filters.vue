<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "@nanostores/vue";
import {
    selectedFilters,
    toggleFilter,
    collectionToSlug,
    searchIndexCollections,
    searchIndex,
    setFilterFromUrl,
} from "../stores/workflowStore";

const storeSelected = useStore(selectedFilters);
const collections = useStore(searchIndexCollections);
const workflows = useStore(searchIndex);

// Use local ref to avoid hydration mismatch - starts empty like SSR
const selected = ref<string[]>([]);

// Count workflows per collection
const collectionCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const w of workflows.value) {
        for (const c of w.collections) {
            counts[c] = (counts[c] || 0) + 1;
        }
    }
    return counts;
});

// Split filters into two equal rows
const firstRowFilters = computed(() => {
    const halfLength = Math.ceil(collections.value.length / 2);
    return collections.value.slice(0, halfLength);
});

const secondRowFilters = computed(() => {
    const halfLength = Math.ceil(collections.value.length / 2);
    return collections.value.slice(halfLength);
});

onMounted(() => {
    setFilterFromUrl();
    // Sync local ref with store after hydration
    selected.value = storeSelected.value;
});

// Keep local ref in sync with store changes
selectedFilters.subscribe((value) => {
    selected.value = value;
});

const handleFilterClick = (filter: string) => {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
        // Check state before toggling
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
        // On other pages, navigate to collection page
        window.location.href = `/collection/${collectionToSlug(filter)}`;
    }
};
</script>

<template>
    <div id="filters" class="w-full">
        <!-- First row of filters -->
        <div class="flex flex-wrap justify-center items-center mb-2">
            <template v-for="(filter, index) in firstRowFilters" :key="filter">
                <div class="filter-wrapper flex items-center">
                    <span
                        class="py-1 px-2 cursor-pointer transition-all duration-200 ease-in-out whitespace-nowrap border-b-4"
                        :class="{
                            'text-chicago-300 border-transparent hover:text-white': !selected.includes(filter),
                            'text-white border-hokey-pokey-500': selected.includes(filter),
                        }"
                        @click="handleFilterClick(filter)">
                        {{ filter }}<span class="text-chicago-500 ml-1">({{ collectionCounts[filter] || 0 }})</span>
                    </span>
                    <span v-if="index < firstRowFilters.length - 1" class="divider text-chicago-600 mx-1">·</span>
                </div>
            </template>
        </div>

        <!-- Second row of filters -->
        <div class="flex flex-wrap justify-center items-center">
            <template v-for="(filter, index) in secondRowFilters" :key="filter">
                <div class="filter-wrapper flex items-center">
                    <span
                        class="py-1 px-2 cursor-pointer transition-all duration-200 ease-in-out whitespace-nowrap border-b-4"
                        :class="{
                            'text-chicago-300 border-transparent hover:text-white': !selected.includes(filter),
                            'text-white border-hokey-pokey-500': selected.includes(filter),
                        }"
                        @click="handleFilterClick(filter)">
                        {{ filter }}<span class="text-chicago-500 ml-1">({{ collectionCounts[filter] || 0 }})</span>
                    </span>
                    <span v-if="index < secondRowFilters.length - 1" class="divider text-chicago-600 mx-1">·</span>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.filter-wrapper:last-child .divider {
    visibility: hidden;
}
</style>
