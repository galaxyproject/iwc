<script setup lang="ts">
import { ref, computed, onBeforeMount, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useSeoMeta, useRuntimeConfig } from "#imports";
import MarkdownRenderer from "~/components/MarkdownRenderer.vue";
import Author from "~/components/Author.vue";
import { useWorkflowStore } from "~/stores/workflows";
import { formatDate } from "~/utils/";
import GalaxyInstanceSelector from "~/components/GalaxyInstanceSelector.vue";

const route = useRoute();
const appConfig = useAppConfig();
const workflowStore = useWorkflowStore();
const workflow = computed(() => workflowStore.workflow);

// Get the public runtime config to access the app URL
const config = useRuntimeConfig().public;
const baseUrl = config.appUrl || (process.client ? window.location.origin : "https://iwc.galaxyproject.org");

const authors = computed(() => {
    let authorLine = "";
    if (workflow.value?.authors) {
        authorLine = workflow.value.authors.map((author) => author.name).join(", ");
    }
    return authorLine;
});

const workflowName = computed(() => {
    return workflow.value?.definition?.name || "Workflow Details";
});

// Generate SEO meta tags for the workflow detail page
// Using computed properties for reactive SEO meta
useSeoMeta({
    title: computed(() =>
        workflow.value ? `${workflowName.value} | ${appConfig.site.name}` : "Workflow Details | " + appConfig.site.name,
    ),
    description: computed(() => workflow.value?.definition.annotation || "Galaxy workflow"),
    ogTitle: computed(() => workflow.value?.definition?.name || "Workflow Details"),
    ogDescription: computed(() => workflow.value?.definition.annotation || "Galaxy workflow"),
    ogImage: `${baseUrl}/iwc_logo.png`,
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: computed(() => workflow.value?.definition?.name || "Workflow Details"),
    twitterDescription: computed(() => workflow.value?.definition.annotation || "Galaxy workflow"),
    twitterImage: `${baseUrl}/iwc_logo.png`,
});

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

// Define interface for tab items
interface TabItem {
    label: string;
    content?: string;
    tools?: string[] | string;
    preview?: boolean;
}

const tabs = computed<TabItem[]>(() => [
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
    // {
    //     label: "Tools",
    //     tools: tools.value || "This tab will show a nice listing of all the tools used in this workflow.",
    // },
]);

function onTabChange(index: number) {
    // Set the hash in the URL to the current tab label for better navigation
    const item = tabs.value[index];
    if (item) {
        const label = item.label.toLowerCase().replace(/\s+/g, "-");
        if (window.location.hash !== `#${label}`) {
            // Only update if it's different to avoid unnecessary hashchange events
            window.location.hash = `#${label}`;
        }
    }
}

// Watch for changes to the tabs data
watch(
    () => tabs.value,
    () => {
        // After tabs are updated, check if we need to set a specific tab active
        nextTick(() => {
            setActiveTabFromHash();
        });
    },
    { deep: true },
);

const loading = ref(true);
const currentTabIndex = ref(0);

// Function to set the active tab based on URL hash
function setActiveTabFromHash() {
    const hash = window.location.hash.slice(1); // Remove the # character
    if (hash) {
        // Find the tab index that matches the hash
        const tabIndex = tabs.value.findIndex((tab) => tab.label.toLowerCase().replace(/\s+/g, "-") === hash);
        if (tabIndex !== -1) {
            currentTabIndex.value = tabIndex;
        }
    }
}

onBeforeMount(async () => {
    await workflowStore.setWorkflow();
    loading.value = false;

    if (workflow.value && route.params.id === workflow.value.trsID) {
        window.history.pushState({}, "", `/workflow/${encodeURIComponent(workflow.value.iwcID)}/`);
    }

    // After the page loads, set the active tab based on the hash
    nextTick(() => {
        setActiveTabFromHash();
    });
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
                    <UTabs :items="tabs" @change="onTabChange" v-model="currentTabIndex" class="w-full">
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
                <p>Workflow with iwcID {{ route.params.id }} could not be found.</p>
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
