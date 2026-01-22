<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { allWorkflows } from "../stores/workflowStore";
import MarkdownRenderer from "./MarkdownRenderer.vue";

const props = defineProps<{
    collectionName: string;
}>();

const workflows = useStore(allWorkflows);
const collectionDescription = ref<string | null>(null);
const isLoading = ref(true);

// Filter workflows by the selected collection
const collectionWorkflows = computed(() =>
    workflows.value.filter((workflow) =>
        workflow.collections.some((col) => col.toLowerCase() === props.collectionName.toLowerCase()),
    ),
);

// Load collection description
async function loadCollectionDescription(collection: string) {
    try {
        const response = await fetch(`/category-descriptions/${collection.toLowerCase().replace(/ /g, "-")}.md`);
        if (response.ok) {
            collectionDescription.value = await response.text();
        } else {
            collectionDescription.value = null;
        }
    } catch (error) {
        collectionDescription.value = null;
        console.error(`Error fetching description for ${collection}:`, error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    loadCollectionDescription(props.collectionName);
});
</script>

<template>
    <div class="text-center">
        <h2 class="text-lg text-white font-semibold mb-4">
            <span v-if="collectionWorkflows.length > 0">
                Discover {{ collectionWorkflows.length }} workflow{{ collectionWorkflows.length !== 1 ? "s" : "" }} in
                this collection
            </span>
            <span v-else class="opacity-70">Loading workflows...</span>
        </h2>

        <!-- Description -->
        <div v-if="!isLoading && collectionDescription" class="max-w-4xl mx-auto mb-6">
            <div class="prose prose-invert prose-sm !max-w-none text-white/90">
                <MarkdownRenderer :markdown-content="collectionDescription" />
            </div>
        </div>
    </div>
</template>
