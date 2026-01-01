<script setup lang="ts">
import PopularWorkflows from "./PopularWorkflows.vue";
import type { SearchIndexEntry } from "../models/workflow";

defineProps<{
    popularTrsIds: string[];
    workflows: SearchIndexEntry[];
}>();
</script>

<template>
    <div class="flex bg-ebony-clay p-4 pb-8 items-center flex-col">
        <div class="text-center">
            <h1 class="text-5xl my-6 text-white font-bold">Open, peer-reviewed workflows for reproducible science</h1>
        </div>

        <PopularWorkflows :workflow-trs-ids="popularTrsIds" :workflows="workflows" />
    </div>
</template>
