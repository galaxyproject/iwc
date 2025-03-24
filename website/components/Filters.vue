<script setup lang="ts">
import { useWorkflowStore } from "~/stores/workflows";

const store = useWorkflowStore();
const allFilters = computed(() => store.allFilters);

const handleFilterClick = (filter: string) => {
    store.toggleFilter(filter);
};
</script>

<template>
    <div id="filters">
        <TransitionGroup name="filter-transition" tag="div" class="flex flex-wrap items-center">
            <template v-for="(filter, index) in allFilters" :key="filter">
                <span
                    class="filter-item py-1 px-2"
                    :class="{
                        active: store.selectedFilters.includes(filter),
                    }"
                    @click="handleFilterClick(filter)">
                    {{ filter }}
                </span>
                <span v-if="index < allFilters.length - 1" class="text-gray-200 mx-1">|</span>
            </template>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.filter-item {
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
    @apply text-gold border-b-2 border-t-2 border-transparent;
}

.filter-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
    @apply text-white bg-gold;
}

.filter-item.active {
    @apply text-white border-gold;
    background-color: transparent;
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
