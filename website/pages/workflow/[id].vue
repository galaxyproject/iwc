<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
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

const launchUrl = computed(() => {
    if (!workflow.value || !selectedInstance.value) return "";
    return `${selectedInstance.value}/workflows/trs_import?trs_server=dockstore.org&trs_id=${encodeURIComponent(workflow.value.trsID)}&trs_version=v${workflow.value.definition.release}&run_form=true`;
});

function testToRequestState() {
    const tests = workflow.value?.tests;
    if (tests && tests.length) {
        return tests[0].job;
    }
}

function trsIdAndVersionToDockstoreUrl(trs_id: string, trs_version: string) {
    return `https://dockstore.org/api/ga4gh/trs/v2/tools/${trs_id}/versions/${trs_version}`;
}

async function createLandingPage() {
    const job = testToRequestState();
    const trs_url = trsIdAndVersionToDockstoreUrl(workflow.value?.trsID!, `v${workflow.value?.definition.release}`);
    const response = await fetch(`${selectedInstance.value}/api/workflow_landings`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
            workflow_id: trs_url,
            workflow_target_type: "trs_url",
            request_state: job,
            public: true,
        }),
    });
    const json = await response.json();
    const landingPage = `${selectedInstance.value}/workflow_landings/${json["uuid"]}?public=true`;
    window.open(landingPage, "_blank");
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
        label: "About",
        content: workflow.value?.readme || "No README available.",
    },
    {
        label: "Version History",
        content: workflow.value?.changelog || "No CHANGELOG available.",
    },
    {
        label: "Tools",
        tools: tools || "This tab will show a nice listing of all the tools used in this workflow.",
    },
    {
        label: "Preview",
        preview: true,
    },
]);

/* Instance SElector -- factor out to a component */
const selectedInstance = ref("");
const instances = reactive([
    { value: "http://localhost:8081", label: "local dev instance" },
    { value: "https://usegalaxy.org", label: "usegalaxy.org" },
    { value: "https://test.galaxyproject.org", label: "test.galaxyproject.org" },
    { value: "https://usegalaxy.eu", label: "usegalaxy.eu" },
]);

onBeforeMount(() => {
    // Shift to a store to handle this, as it breaks nuxt to use localStorage in setup but this is a quick hack
    const savedInstance = localStorage.getItem("selectedInstance");
    if (savedInstance) {
        selectedInstance.value = savedInstance;
    } else {
        selectedInstance.value = instances[0].value;
    }
});

const onInstanceChange = (value: string) => {
    localStorage.setItem("selectedInstance", value);
};
</script>

<template>
    <div v-if="workflow" class="flex">
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
                <UButtonGroup class="mt-4" size="sm" orientation="vertical">
                    <USelect
                        v-model="selectedInstance"
                        :options="instances"
                        label="Select Galaxy Instance"
                        @change="onInstanceChange" />
                    <UButton
                        :to="launchUrl"
                        target="_blank"
                        icon="i-heroicons-rocket-launch"
                        color="primary"
                        variant="solid"
                        label="Launch at" />
                    <UButton
                        class="mt-4"
                        @click="createLandingPage"
                        target="_blank"
                        icon="i-heroicons-rocket-launch"
                        color="primary"
                        variant="solid"
                        label="Run with example data" />
                </UButtonGroup>
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
