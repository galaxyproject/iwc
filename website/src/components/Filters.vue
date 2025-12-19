<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { selectedFilters, toggleFilter, collectionToSlug, searchIndexCollections, loadSearchIndex } from "../stores/workflowStore";

const selected = useStore(selectedFilters);
const collections = useStore(searchIndexCollections);

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
    loadSearchIndex();
});

const handleFilterClick = (filter: string) => {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
        // On main page, toggle filter and update URL
        toggleFilter(filter);
        const params = new URLSearchParams(window.location.search);

        if (selected.value.includes(filter)) {
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
                        class="py-1 px-2 cursor-pointer transition-all duration-200 ease-in-out rounded border-b-2 border-t-2 whitespace-nowrap"
                        :class="{
                            'text-gold border-transparent': !selected.includes(filter),
                            'text-white border-gold': selected.includes(filter),
                            'hover:bg-gold hover:text-white hover:bg-opacity-5': !selected.includes(filter),
                        }"
                        @click="handleFilterClick(filter)">
                        {{ filter }}
                    </span>
                    <span v-if="index < firstRowFilters.length - 1" class="divider text-gray-200 mx-1">|</span>
                </div>
            </template>
        </div>

        <!-- Second row of filters -->
        <div class="flex flex-wrap justify-center items-center">
            <template v-for="(filter, index) in secondRowFilters" :key="filter">
                <div class="filter-wrapper flex items-center">
                    <span
                        class="py-1 px-2 cursor-pointer transition-all duration-200 ease-in-out rounded border-b-2 border-t-2 whitespace-nowrap"
                        :class="{
                            'text-gold border-transparent': !selected.includes(filter),
                            'text-white border-gold': selected.includes(filter),
                            'hover:bg-gold hover:text-white hover:bg-opacity-5': !selected.includes(filter),
                        }"
                        @click="handleFilterClick(filter)">
                        {{ filter }}
                    </span>
                    <span v-if="index < secondRowFilters.length - 1" class="divider text-gray-200 mx-1">|</span>
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
