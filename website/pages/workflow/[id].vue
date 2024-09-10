<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { type Workflow, type WorkflowCollection } from "~/models/workflow";
import { workflowCollections } from "~/models/workflow";
import { marked } from "marked";

const route = useRoute();
const workflow = ref<Workflow | null>(null);

const allWorkflows = computed(() => workflowCollections.flatMap((collection) => collection.workflows));

workflow.value = allWorkflows.value.find((w) => w.definition.uuid === route.params.id);

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const parseMarkdown = (content: string) => {
    return marked(content);
};

// TODO: Add a component for authors.  For now, just have a computed that grabs names and joins them
const authors = computed(() => {
    let authorLine = "";
    if (workflow.value.authors) {
        authorLine = workflow.value.authors.map((author) => author.name).join(", ");
    }
    return authorLine;
});
</script>

<template>
    <div v-if="workflow" class="flex h-screen">
        <!-- Left sidebar -->
        <div class="w-1/4 p-4 overflow-y-auto">
            <p class="mb-4">{{ workflow.definition.annotation }}</p>
            <h2 class="text-xl font-semibold mb-2">Details</h2>
            <p><strong>Authors:</strong> {{ authors }}</p>
            <p><strong>Release:</strong> {{ workflow.definition.release }}</p>
        </div>

        <!-- Right side workflow cards -->
        <div class="w-3/4 p-4 overflow-y-auto" ref="workflowContainer">
            <div class="mx-auto py-8">
                <h1 class="text-3xl font-bold mb-4">{{ workflow.definition.name }}</h1>
                <div class="bg-gray-100 p-6 rounded-lg mb-6 text-gray-800">
                    <div v-if="workflow.readme" class="mt-6">
                        <div class="prose !max-w-none" v-html="parseMarkdown(workflow.readme)"></div>
                    </div>
                    <div v-if="workflow.changelog" class="mt-6">
                        <h2 class="text-2xl font-semibold mb-4">CHANGELOG</h2>
                        <div class="prose !max-w-none" v-html="parseMarkdown(workflow.changelog)"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="max-w-3xl mx-auto py-8">
        <h1 class="text-3xl font-bold mb-4">Workflow not found</h1>
        <p>Workflow with identifier {{ route.params.id }} could not be found.</p>
    </div>
</template>
