<script setup lang="ts">
import { useWorkflowStore } from "~/stores/workflows";

const store = useWorkflowStore();
const validCategories = computed(() => store.getValidCategories);
const validTags = computed(() => store.getValidTags);

const handleCategoryClick = (category: string) => {
    store.toggleCategory(category);
};

const handleTagClick = (tag: string) => {
    store.toggleTag(tag);
};
</script>
<template>
    <div id="filters">
        <UBadge
            v-for="category in validCategories"
            :key="category"
            v-show="validCategories.includes(category)"
            :variant="store.selectedCategories.includes(category) ? 'solid' : 'soft'"
            @click="handleCategoryClick(category)"
            class="badge m-1">
            {{ category }}
        </UBadge>
        <UBadge
            v-for="tag in validTags"
            :key="tag"
            v-show="validTags.includes(tag)"
            :variant="store.selectedTags.includes(tag) ? 'solid ' : 'soft'"
            @click="handleTagClick(tag)"
            class="badge m-1">
            {{ tag }}
        </UBadge>
    </div>
</template>
