<script setup lang="ts">
import { useWorkflowStore } from "~/stores/workflows";
import { computed } from "vue";

const store = useWorkflowStore();
const allFilters = computed(() => store.allFilters);

// Split filters into two equal rows
const firstRowFilters = computed(() => {
    const halfLength = Math.ceil(allFilters.value.length / 2);
    return allFilters.value.slice(0, halfLength);
});

const secondRowFilters = computed(() => {
    const halfLength = Math.ceil(allFilters.value.length / 2);
    return allFilters.value.slice(halfLength);
});

const handleFilterClick = (filter: string) => {
    // If we're on the main page, use the existing filter toggle behavior
    if (useRoute().path === "/") {
        store.toggleFilter(filter);
    } else {
        // If we're on a different page, navigate to the collection page
        navigateTo(`/collection/${store.collectionToSlug(filter)}`);
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
                        class="filter-item py-1 px-2"
                        :class="{
                            active: store.selectedFilters.includes(filter),
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
                        class="filter-item py-1 px-2"
                        :class="{
                            active: store.selectedFilters.includes(filter),
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
.filter-item {
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
    @apply text-gold border-b-2 border-t-2 border-transparent;
    white-space: nowrap;
}

.filter-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
    @apply text-white bg-gold;
}

.filter-item.active {
    @apply text-white border-gold;
    background-color: transparent;
}

.filter-wrapper:last-child .divider {
    visibility: hidden;
}

.filter-transition-move,
.filter-transition-enter-active,
.filter-transition-leave-active {
    transition: all 0.5s ease;
}

.filter-transition-enter-from,
.filter-transition-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.filter-transition-leave-active {
    position: absolute;
}
</style>
