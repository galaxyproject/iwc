<script setup lang="ts">
import { watch, onMounted, nextTick } from "vue";
import { useStore } from "@nanostores/vue";
import { searchQuery, updateSearchUrl, setSearchFromUrl, isSearchActive } from "../stores/workflowStore";
import PopularWorkflows from "./PopularWorkflows.vue";
import Filters from "./Filters.vue";
import type { LightweightWorkflow } from "../models/workflow";

const props = defineProps<{
    workflows: LightweightWorkflow[];
    collections: string[];
    popularTrsIds: string[];
}>();

const query = useStore(searchQuery);
const isSearching = useStore(isSearchActive);

// Debounced URL update
let urlUpdateTimeout: ReturnType<typeof setTimeout>;
const handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    searchQuery.set(value);

    clearTimeout(urlUpdateTimeout);
    urlUpdateTimeout = setTimeout(() => {
        updateSearchUrl(value);
    }, 300);
};

// Auto-scroll when search becomes active - scroll to top so collapsed hero stays visible
watch(isSearching, (active) => {
    if (active) {
        nextTick(() => {
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }, 150);
        });
    }
});

// Initialize from URL on mount
onMounted(() => {
    setSearchFromUrl();
});
</script>

<template>
    <div
        class="flex bg-ebony-clay p-4 items-center flex-col transition-all duration-300"
        :class="{ 'pb-6': !isSearching, 'pb-4': isSearching }">
        <!-- Titles - shrink when searching -->
        <Transition name="hero-title" mode="out-in">
            <div v-if="!isSearching" key="full" class="text-center">
                <h1 class="text-5xl my-8 text-white font-bold">Discover and run vetted analysis pipelines on Galaxy</h1>
                <h2 class="text-xl text-white font-semibold mb-8">
                    Ready-to-use, open-source pipelines with sample data and training materials to make progress quickly
                    and reliably.
                </h2>
            </div>
            <div v-else key="compact" class="py-4">
                <h1 class="text-2xl text-white font-bold text-center">Search IWC Workflows</h1>
            </div>
        </Transition>

        <!-- Popular Workflows - hide when searching -->
        <Transition name="fade-collapse">
            <PopularWorkflows
                v-if="!isSearching"
                :workflowTrsIds="popularTrsIds"
                :workflows="workflows"
                class="mb-8" />
        </Transition>

        <!-- Search Input -->
        <div class="max-w-6xl w-full p-4" :class="{ 'mt-4': !isSearching }">
            <input
                type="text"
                :value="query"
                @input="handleInput"
                placeholder="Search workflows"
                class="w-full p-3 border border-ebony-clay-200 bg-white rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-hokey-pokey-500 focus:border-transparent transition-shadow" />
        </div>

        <!-- Filters -->
        <Filters :collections="collections" />
    </div>
</template>

<style scoped>
/* Title transition */
.hero-title-enter-active,
.hero-title-leave-active {
    transition: all 0.25s ease;
}

.hero-title-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.hero-title-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

/* Popular workflows collapse */
.fade-collapse-enter-active,
.fade-collapse-leave-active {
    transition:
        opacity 0.3s ease,
        max-height 0.3s ease,
        margin 0.3s ease;
    overflow: hidden;
}

.fade-collapse-enter-from,
.fade-collapse-leave-to {
    opacity: 0;
    max-height: 0;
    margin-top: 0;
    margin-bottom: 0;
}

.fade-collapse-enter-to,
.fade-collapse-leave-from {
    max-height: 500px;
}
</style>
