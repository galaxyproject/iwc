<script setup lang="ts">
import { useWorkflowStore } from "~/stores/workflows";

const store = useWorkflowStore();
const validFilters = computed(() => store.validFilters);

const handleFilterClick = (filter: string) => {
    store.toggleFilter(filter);
};
</script>

<template>
    <div id="filters">
        <UBadge
            v-for="filter in validFilters"
            :key="filter"
            :variant="store.selectedFilters.includes(filter) ? 'solid' : 'soft'"
            @click="handleFilterClick(filter)"
            class="badge m-1">
            {{ filter }}
        </UBadge>
    </div>
</template>
