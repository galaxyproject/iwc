<template>
    <div id="filters">
        <UBadge
            v-for="category in allCategories"
            :key="category"
            @click="handleCategoryClick(category)"
            class="badge m-1">
            {{ category }}
        </UBadge>
        <UBadge v-for="tag in allTags" :key="tag" @click="handleTagClick(tag)" class="badge m-1">
            {{ tag }}
        </UBadge>
    </div>
</template>

<script setup lang="ts">
import { useWorkflowStore } from "~/stores/workflows";

const store = useWorkflowStore();
const allCategories = store.allCategories;
const allTags = store.allTags;

const handleCategoryClick = (category: string) => {
    // ...handle category click...
};

const handleTagClick = (tag: string) => {
    // ...handle tag click...
};
// ...existing code...
</script>

<style scoped>
.badge {
    /* ...styles... */
}
/* ...existing styles... */
</style>
