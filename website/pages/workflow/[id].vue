<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import MarkdownRenderer from "~/components/MarkdownRenderer.vue";
import Author from "~/components/Author.vue";
import { useWorkflowStore } from "~/stores/workflows";
import { formatDate } from "~/utils/";
import GalaxyInstanceSelector from "~/components/GalaxyInstanceSelector.vue";

const route = useRoute();
const workflowStore = useWorkflowStore();
const workflow = computed(() => workflowStore.workflow);

const authors = computed(() => {
    let authorLine = "";
    if (workflow.value?.authors) {
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

const selectedInstance = ref("");

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

const dockstoreWorkflowPageUrl = computed(() => {
    const repoPath = workflow.value?.trsID.substring("#workflow/".length);
    const baseUrl = "https://dockstore.org/workflows/";
    return baseUrl + repoPath;
});

const doiResolverUrl = computed(() => {
    return `https://doi.org/${workflow.value?.doi}`;
});

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
        label: "Diagram",
        content: workflow.value?.diagrams || "No diagram available",
    },
    {
        label: "Version History",
        content: workflow.value?.changelog || "No CHANGELOG available.",
    },
    {
        label: "Tools",
        tools: tools || "This tab will show a nice listing of all the tools used in this workflow.",
    },
]);

const loading = ref(true);

onBeforeMount(async () => {
    await workflowStore.setWorkflow();
    loading.value = false;
});
</script>

<template>
    <div v-if="loading" class="flex mx-auto justify-center items-center" style="height: 60vh">
        <div class="relative">
            <div class="loader border-t-8 border-hokey-pokey"></div>
            <div class="absolute inset-0 flex justify-center items-center text-xl font-bold font-mono">Loading...</div>
        </div>
    </div>
    <NuxtLayout v-else>
        <template #rightSidebar>
            <div v-if="workflow" class="mt-6">
                <h2 class="font-bold text-xl mb-4">{{ workflow.definition.name }}</h2>
                <p class="mb-4">{{ workflow.definition.annotation }}</p>
                <ul>
                    <li><strong>Author(s):</strong></li>
                    <li class="ml-2" v-for="author in workflow.authors" :key="author.name">
                        <Author :author="author" />
                    </li>
                    <li><strong>Release: </strong>{{ workflow.definition.release }}</li>
                    <li><strong>Updated: </strong>{{ formatDate(workflow.updated) }}</li>
                    <li><strong>License: </strong>{{ workflow.definition.license }}</li>
                    <li v-if="workflow.doi">
                        <strong>DOI: </strong>
                        <ULink :to="doiResolverUrl" target="_blank" class="hover:underline">
                            {{ workflow.doi }}
                            <UIcon name="i-heroicons-arrow-top-right-on-square" />
                        </ULink>
                    </li>
                    <li>
                        <strong>TRS: </strong>
                        <ULink :to="dockstoreWorkflowPageUrl" target="_blank" class="hover:underline">
                            {{ workflow.trsID }}
                            <UIcon name="i-heroicons-arrow-top-right-on-square" />
                        </ULink>
                    </li>
                </ul>
                <h3 class="font-bold text-l mt-4">Running this workflow</h3>
                <GalaxyInstanceSelector v-model="selectedInstance" />
                <p class="my-2 text-sm font-medium">
                    You can choose to run the workflow with sample data prefilled, or with your own data.
                </p>
                <UButtonGroup class="mt-4" size="sm">
                    <UButton
                        :to="launchUrl"
                        target="_blank"
                        icon="i-heroicons-rocket-launch"
                        color="primary"
                        variant="solid"
                        label="Run Workflow" />
                    <UButton
                        @click="createLandingPage"
                        target="_blank"
                        icon="i-heroicons-rocket-launch"
                        color="primary"
                        variant="solid"
                        label="Run with example data" />
                </UButtonGroup>
            </div>
        </template>

        <template #content>
            <div v-if="workflow" class="mx-auto">
                <div class="p-4 mb-6">
                    <UTabs :items="tabs" class="w-full">
                        <template #default="{ item, index, selected }">
                            <span class="truncate" :class="[selected && 'text-primary-500 dark:text-primary-400']">{{
                                item.label
                            }}</span>
                        </template>
                        <template #item="{ item }">
                            <div v-if="item.content" class="mt-6">
                                <div class="prose dark:prose-invert !max-w-none">
                                    <MarkdownRenderer :markdownContent="item.content" />
                                </div>
                            </div>
                            <div v-else-if="item.tools" class="mt-6">
                                <div class="prose dark:prose-invert !max-w-none">
                                    <h3>The following tools are used by this workflow.</h3>
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
                                <iframe
                                    title="Galaxy Workflow Embed"
                                    style="width: 100%; height: 700px; border: none"
                                    src="https://usegalaxy.org/published/workflow?id=a63d3ee4a2a4a20b&embed=true&buttons=true&about=false&heading=false&minimap=true&zoom_controls=true&initialX=-20&initialY=-20&zoom=1"></iframe>
                            </div>
                        </template>
                    </UTabs>
                </div>
            </div>
            <div v-else class="max-w-3xl mx-auto py-8">
                <h1 class="text-3xl font-bold mb-4">Workflow not found</h1>
                <p>Workflow with identifier {{ route.params.id }} could not be found.</p>
            </div>
        </template>
    </NuxtLayout>
</template>

<style scoped>
.loader {
    border-radius: 50%;
    width: 240px;
    height: 240px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
