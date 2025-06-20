<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { type Workflow } from "~/models/workflow";
import { useWorkflowStore } from "~/stores/workflows";
import { useSeoMeta, useRuntimeConfig, useRoute } from "#imports";
import MarkdownRenderer from "~/components/MarkdownRenderer.vue";
import Fuse from "fuse.js";

const route = useRoute();
const slug = route.params.slug as string;

// Convert slug back to collection name (reverse of slug creation)
const collectionName = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// Get the public runtime config to access the app URL
const config = useRuntimeConfig().public;
const baseUrl = config.appUrl || (process.client ? window.location.origin : "https://iwc.galaxyproject.org");

// Add SEO meta tags
useSeoMeta({
    title: `${collectionName} - Intergalactic Workflow Commission`,
    description: `Discover ${collectionName} workflows - Ready-to-use, open-source pipelines with sample data and training materials`,
    ogTitle: `${collectionName} - Intergalactic Workflow Commission`,
    ogDescription: `Discover ${collectionName} workflows on Galaxy`,
    ogImage: `${baseUrl}/iwc_logo.png`,
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: `${collectionName} - Intergalactic Workflow Commission`,
    twitterDescription: `Discover ${collectionName} workflows on Galaxy`,
    twitterImage: `${baseUrl}/iwc_logo.png`,
});

const collectionDescription = ref<string | null>(null);
const isLoading = ref(false);
const searchQuery = ref("");

const workflowStore = useWorkflowStore();

async function loadCollectionDescription(collection: string) {
    isLoading.value = true;
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

const allWorkflows = computed(() => workflowStore.allWorkflows);

// Filter workflows by the selected collection
const collectionWorkflows = computed(() =>
    allWorkflows.value.filter((workflow) =>
        workflow.collections.some((col) => col.toLowerCase() === collectionName.toLowerCase()),
    ),
);

// Sort workflows descending by workflow.updated
const sortedWorkflows = computed(() =>
    collectionWorkflows.value.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()),
);

// Define a fuse instance for fuzzy searching
const fuseOptions = {
    keys: [
        {
            name: "definition.name",
            weight: 0.7,
        },
        {
            name: "definition.annotation",
            weight: 0.3,
        },
        {
            name: "definition.tags",
            weight: 0.1,
        },
    ],
    threshold: 0.3,
};

const fuse = computed(() => new Fuse(sortedWorkflows.value, fuseOptions));

const filteredWorkflows = computed(() => {
    if (!searchQuery.value) {
        return sortedWorkflows.value;
    } else {
        const searchResults = fuse.value.search(searchQuery.value.trim());
        return searchResults.map((result) => result.item);
    }
});

// Load collection description on mount
onMounted(() => {
    loadCollectionDescription(collectionName);
});

// Redirect to home if no workflows found for this collection
if (process.client && collectionWorkflows.value.length === 0) {
    // Check if collection exists in any workflow
    const collectionExists = allWorkflows.value.some((workflow) =>
        workflow.collections.some((col) => col.toLowerCase() === collectionName.toLowerCase()),
    );

    if (!collectionExists) {
        throw createError({
            statusCode: 404,
            statusMessage: `Collection "${collectionName}" not found`,
        });
    }
}
</script>

<template>
    <NuxtLayout>
        <template #hero>
            <div class="flex bg-ebony-clay p-4 items-center" :style="{ 'flex-direction': 'column' }">
                <h1 class="text-4xl my-8 text-white text-center font-bold">{{ collectionName }} Workflows</h1>
                <h2 class="text-lg text-white text-center font-semibold mb-8">
                    Discover {{ collectionWorkflows.length }} workflow{{ collectionWorkflows.length !== 1 ? "s" : "" }}
                    in this collection
                </h2>

                <div class="max-w-6xl w-full mt-4 p-4">
                    <input
                        v-model="searchQuery"
                        type="text"
                        :placeholder="`Search ${collectionName} workflows`"
                        class="w-full p-2 mb-2 border rounded-lg" />
                </div>

                <div class="mt-4">
                    <NuxtLink to="/" class="text-white hover:text-gray-300 underline">
                        ← Back to all workflows
                    </NuxtLink>
                </div>
            </div>
        </template>
        <template #content>
            <div class="w-full my-4 p-4 bg-white rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">About {{ collectionName }}</h2>
                <div class="prose !max-w-none">
                    <Transition name="fade" mode="out-in">
                        <div v-if="isLoading" key="loading" class="min-h-[50px] flex items-center justify-center">
                            <span class="text-gray-500">Loading description...</span>
                        </div>
                        <MarkdownRenderer
                            v-else-if="collectionDescription"
                            key="content"
                            :markdownContent="collectionDescription" />
                        <div v-else key="empty" class="text-gray-500">
                            No description available for this collection.
                        </div>
                    </Transition>
                </div>
            </div>

            <div v-if="filteredWorkflows.length === 0" class="text-center py-8">
                <p class="text-gray-500 text-lg">No workflows found for "{{ collectionName }}"</p>
                <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 underline mt-2 inline-block">
                    Browse all workflows
                </NuxtLink>
            </div>

            <div v-else id="workflows" class="grid grid-cols-3 gap-4">
                <WorkflowCard
                    v-for="workflow in filteredWorkflows"
                    :key="workflow.definition.uuid"
                    :workflow="workflow" />
            </div>
        </template>
    </NuxtLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
