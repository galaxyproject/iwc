<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { viewMode } from "../stores/workflowStore";
import ToggleGroup from "./ui/ToggleGroup.vue";
import ToggleGroupItem from "./ui/ToggleGroupItem.vue";
import { List, LayoutGrid } from "lucide-vue-next";

const mode = useStore(viewMode);

const handleValueChange = (value: string) => {
    if (value && (value === "list" || value === "grid")) {
        viewMode.set(value);
        localStorage.setItem("iwc-view-mode", value);
    }
};
</script>

<template>
    <div class="flex gap-2 items-center">
        <span class="text-sm text-gray-600 mr-2">View:</span>
        <ToggleGroup type="single" :modelValue="mode" @update:modelValue="handleValueChange">
            <ToggleGroupItem value="list" aria-label="List view">
                <List :size="16" />
                <span class="ml-1.5">List</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid :size="16" />
                <span class="ml-1.5">Grid</span>
            </ToggleGroupItem>
        </ToggleGroup>
    </div>
</template>
