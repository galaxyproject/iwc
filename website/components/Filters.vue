<script setup lang="ts">
import { useWorkflowStore } from "~/stores/workflows";

const store = useWorkflowStore();
const validFilters = computed(() => store.validFilters);
const invalidFilters = computed(() => store.invalidFilters);
const allFilters = computed(() => store.allFilters);

const handleFilterClick = (filter: string) => {
    store.toggleFilter(filter);
};
</script>

<template>
    <div id="filters" class="mb-4">
        <TransitionGroup name="filter-transition" tag="div" class="flex flex-wrap items-center">
            <template v-for="(filter, index) in allFilters" :key="filter">
                <span
                    class="filter-item py-1 px-2"
                    :class="{
                        active: store.selectedFilters.includes(filter),
                        incompatible: !validFilters.includes(filter),
                    }"
                    @click="validFilters.includes(filter) ? handleFilterClick(filter) : null"
                    :data-tooltip="!validFilters.includes(filter) ? 'Incompatible with current selection' : null">
                    {{ filter }}
                </span>
                <span v-if="index < allFilters.length - 1" class="text-gray-400 mx-1">|</span>
            </template>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.filter-item {
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
    color: #eab308; /* yellow-500 */
}

.filter-item:hover:not(.incompatible) {
    background-color: rgba(0, 0, 0, 0.05);
    color: #ffffff; /* white */
    background-color: #eab308; /* yellow-500 background on hover */
}

.filter-item.active {
    font-weight: 600;
    color: #ffffff; /* white text for active state */
    background-color: #eab308; /* yellow-500 background for active state */
}

.incompatible {
    opacity: 0.65;
    cursor: not-allowed;
    transition: all 0.3s ease;
}

.incompatible:hover {
    opacity: 0.85;
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

/* Custom tooltip styles */
[data-tooltip] {
    position: relative;
}

[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25rem 0.5rem;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 10;
    margin-bottom: 0.25rem;
}
</style>
