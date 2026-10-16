<script setup lang="ts">
import { ref, onMounted } from "vue";
import MarkdownRenderer from "./MarkdownRenderer.vue";

const props = defineProps<{
    collectionName: string;
}>();

const collectionDescription = ref<string | null>(null);
const isLoading = ref(true);

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
    <div>
        <!-- Description card with gold accent -->
        <div
            v-if="!isLoading && collectionDescription"
            class="max-w-4xl mx-auto mb-6 bg-white border border-ebony-clay-100 rounded-lg shadow-md px-6 py-4 text-left">
            <div class="prose prose-lg !max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <MarkdownRenderer :markdown-content="collectionDescription" />
            </div>
        </div>
    </div>
</template>
