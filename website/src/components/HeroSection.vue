<script setup lang="ts">
import PopularWorkflows from "./PopularWorkflows.vue";
import type { SearchIndexEntry } from "../models/workflow";

defineProps<{
    popularTrsIds: string[];
    workflows: SearchIndexEntry[];
}>();
</script>

<template>
    <div class="relative flex p-4 pb-8 items-center flex-col">
        <div class="text-center relative z-10">
            <h1 class="text-5xl my-6 font-bold">
                <span class="text-white">Open, peer-reviewed workflows for </span>
                <span class="text-gold">reproducible science</span>
            </h1>
        </div>

        <div class="relative z-10">
            <PopularWorkflows :workflow-trs-ids="popularTrsIds" :workflows="workflows" />
        </div>
    </div>
</template>
