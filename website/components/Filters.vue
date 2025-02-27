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
        <TransitionGroup name="filter-transition">
            <UBadge
                v-for="filter in allFilters"
                :key="filter"
                :variant="store.selectedFilters.includes(filter) ? 'solid' : 'soft'"
                :class="['badge m-1', { incompatible: !validFilters.includes(filter) }]"
                @click="validFilters.includes(filter) ? handleFilterClick(filter) : null"
                :data-tooltip="!validFilters.includes(filter) ? 'Incompatible with current selection' : null">
                {{ filter }}
            </UBadge>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.incompatible {
    opacity: 0.65;
    cursor: not-allowed;
    background-color: transparent !important;
    box-shadow: none !important;
    transition: all 0.3s ease; /* Add transition for a nice visual effect */
}

.incompatible:hover {
    opacity: 0.85; /* Slightly increase opacity on hover for better feedback */
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
