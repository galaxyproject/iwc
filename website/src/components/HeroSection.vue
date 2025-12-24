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
            <h1 class="text-5xl my-8 text-white font-bold">Discover and run vetted analysis pipelines on Galaxy</h1>
            <h2 class="text-xl text-white font-semibold mb-8">
                Ready-to-use, open-source pipelines with sample data and training materials to make progress quickly and
                reliably.
            </h2>
        </div>

        <PopularWorkflows :workflow-trs-ids="popularTrsIds" :workflows="workflows" />
    </div>
</template>
