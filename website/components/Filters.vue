<script setup lang="ts">
import { useWorkflowStore } from "~/stores/workflows";

const store = useWorkflowStore();
const allCategories = store.allCategories;
const allTags = store.allTags;

const handleCategoryClick = (category: string) => {
    store.toggleCategory(category);
};

const handleTagClick = (tag: string) => {
    store.toggleTag(tag);
};
// ...existing code...
</script>
<template>
    <div id="filters">
        <UBadge
            v-for="category in allCategories"
            :key="category"
            :variant="store.selectedCategories.includes(category) ? null : 'soft'"
            @click="handleCategoryClick(category)"
            class="badge m-1">
            {{ category }}
        </UBadge>
        <UBadge
            v-for="tag in allTags"
            :key="tag"
            :variant="store.selectedTags.includes(tag) ? null : 'soft'"
            @click="handleTagClick(tag)"
            class="badge m-1">
            {{ tag }}
        </UBadge>
    </div>
</template>
