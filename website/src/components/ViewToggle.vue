<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { viewMode } from "../stores/workflowStore";
import { List, LayoutGrid } from "lucide-vue-next";
import { computed } from "vue";

const mode = useStore(viewMode);

const handleValueChange = (value: "list" | "grid") => {
    viewMode.set(value);
    localStorage.setItem("iwc-view-mode", value);
};

const isGrid = computed(() => mode.value === "grid");
</script>

<template>
    <div class="flex items-center">
        <div class="relative inline-flex rounded-full bg-ebony-clay-100 p-1">
            <!-- Sliding pill indicator -->
            <div
                class="absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-full bg-hokey-pokey-500 shadow-md transition-all duration-300 ease-out"
                :class="isGrid ? 'left-[calc(50%+1px)]' : 'left-1'" />

            <!-- List button -->
            <button
                :aria-pressed="!isGrid"
                aria-label="List view"
                class="relative z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300"
                :class="!isGrid ? 'text-ebony-clay-950' : 'text-chicago-600 hover:text-chicago-800'"
                @click="handleValueChange('list')">
                <List
                    :size="16"
                    class="transition-transform duration-300"
                    :class="!isGrid ? 'scale-110' : 'scale-100'" />
                <span>List</span>
            </button>

            <!-- Grid button -->
            <button
                :aria-pressed="isGrid"
                aria-label="Grid view"
                class="relative z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300"
                :class="isGrid ? 'text-ebony-clay-950' : 'text-chicago-600 hover:text-chicago-800'"
                @click="handleValueChange('grid')">
                <LayoutGrid
                    :size="16"
                    class="transition-transform duration-300"
                    :class="isGrid ? 'scale-110' : 'scale-100'" />
                <span>Grid</span>
            </button>
        </div>
    </div>
</template>
