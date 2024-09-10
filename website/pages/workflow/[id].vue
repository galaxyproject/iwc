<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { type Workflow, type WorkflowCollection } from "~/models/workflow";
import { workflowCollections } from "~/models/workflow";
import { marked } from "marked";
import Author from "~/components/Author.vue";

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
const links = [
    {
        label: "Back to index",
        icon: "i-heroicons-home",
        to: "/",
    },
];

function launchUrl(workflow: Workflow) {
    // https://usegalaxy.org/workflows/trs_import?trs_server=dockstore.org&trs_id=%23workflow/github.com/iwc-workflows/hic-hicup-cooler/hic-fastq-to-cool-hicup-cooler
    return `https://usegalaxy.org/workflows/trs_import?trs_server=dockstore.org&trs_id=${encodeURIComponent(workflow.trsID)}&trs_version=v${workflow.definition.release}&run_form=true`;
}

const tools = computed(() => {
    if (!workflow.value || !workflow.value.definition || !workflow.value.definition.steps) {
        return [];
    }
    const toolIds = Object.values(workflow.value.definition.steps)
        .map((step) => step.tool_id)
        .filter((id): id is string => id !== null && id !== undefined);
    return Array.from(new Set(toolIds));
});

const tabs = computed(() => [
    {
        label: "README",
        content: workflow.value?.readme || "No README available.",
    },
    {
        label: "CHANGELOG",
        content: workflow.value?.changelog || "No CHANGELOG available.",
    },
    {
        label: "TOOLS",
        tools: tools || "This tab will show a nice listing of all the tools used in this workflow.",
    },
    {
        label: "PREVIEW",
        preview: true,
    },
]);
</script>

<template>
    <div v-if="workflow" class="flex h-screen">
        <!-- Left sidebar -->
        <div class="w-1/4 p-4 overflow-y-auto">
            <div class="sticky top-4 h-16">
                <UBreadcrumb :links="links" />
            </div>
            <div class="mt-6">
                <h2 class="font-bold text-xl mb-4">{{ workflow.definition.name }}</h2>
                <p class="mb-4">{{ workflow.definition.annotation }}</p>
                <ul>
                    <li><strong>Author(s):</strong></li>
                    <li class="ml-2" v-for="author in workflow.authors" :key="author.name">
                        <Author :author="author" />
                    </li>
                    <li><strong>Release:</strong> {{ workflow.definition.release }}</li>
                    <li><strong>License:</strong> {{ workflow.definition.license }}</li>
                    <li><strong>UniqueID:</strong> {{ workflow.definition.uuid }}</li>
                </ul>
                <UButton
                    class="mt-4"
                    :to="launchUrl(workflow)"
                    target="_blank"
                    icon="i-heroicons-rocket-launch"
                    color="primary"
                    variant="solid"
                    label="Use this workflow" />
            </div>
        </div>

        <!-- Right side workflow cards -->
        <div class="w-3/4 p-4 overflow-y-auto" ref="workflowContainer">
            <div class="mx-auto py-8">
                <div class="bg-gray-100 p-6 rounded-lg mb-6 text-gray-800">
                    <UTabs :items="tabs" class="w-full">
                        <template #default="{ item, index, selected }">
                            <span class="truncate" :class="[selected && 'text-primary-500 dark:text-primary-400']">{{
                                item.label
                            }}</span>
                        </template>
                        <template #item="{ item }">
                            <div v-if="item.content" class="mt-6">
                                <div class="prose !max-w-none" v-html="parseMarkdown(item.content)"></div>
                            </div>
                            <div v-else-if="item.tools" class="mt-6">
                                <div class="prose !max-w-none">
                                    <h3>The following tools are required to run this workflow.</h3>
                                    <p>
                                        This will eventually be a pretty page with links to each tool in the (new)
                                        toolshed, etc.
                                    </p>
                                    <ul>
                                        <li v-for="tool in tools" :key="tool">{{ tool }}</li>
                                    </ul>
                                </div>
                            </div>
                            <div v-else-if="item.preview" class="mt-6">
                                <!-- placeholder, we need to add the linkage to construct this, and we need to handle security?-->
                                <iframe
                                    title="Galaxy Workflow Embed"
                                    style="width: 100%; height: 700px; border: none"
                                    src="https://usegalaxy.org/published/workflow?id=a63d3ee4a2a4a20b&embed=true&buttons=true&about=false&heading=false&minimap=true&zoom_controls=true&initialX=-20&initialY=-20&zoom=1"></iframe>
                            </div>
                        </template>
                    </UTabs>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="max-w-3xl mx-auto py-8">
        <h1 class="text-3xl font-bold mb-4">Workflow not found</h1>
        <p>Workflow with identifier {{ route.params.id }} could not be found.</p>
    </div>
</template>
