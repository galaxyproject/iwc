<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { stringify } from "yaml";
import type { Workflow } from "../models/workflow";
import MarkdownRenderer from "./MarkdownRenderer.vue";
import Author from "./Author.vue";
import GalaxyInstanceSelector from "./GalaxyInstanceSelector.vue";
import CodeBlock from "./CodeBlock.vue";
import Button from "./ui/Button.vue";
import Tabs from "./ui/Tabs.vue";
import TabsList from "./ui/TabsList.vue";
import TabsTrigger from "./ui/TabsTrigger.vue";
import TabsContent from "./ui/TabsContent.vue";
import { formatDate, normalizeGalaxyUrl } from "../utils";

const props = defineProps<{
    workflow: Workflow;
}>();

const selectedInstance = ref("");
const currentTab = ref("about");

const launchUrl = computed(() => {
    if (!selectedInstance.value) return "";
    // Normalize the URL to ensure it has a protocol
    const normalizedInstance = normalizeGalaxyUrl(selectedInstance.value) || selectedInstance.value;
    return `${normalizedInstance}/workflows/trs_import?trs_server=dockstore.org&trs_id=${encodeURIComponent(props.workflow.trsID)}&trs_version=v${props.workflow.definition.release}&run_form=true`;
});

function testToRequestState() {
    const tests = props.workflow?.tests;
    if (tests && tests.length) {
        return tests[0].job;
    }
}

function trsIdAndVersionToDockstoreUrl(trs_id: string, trs_version: string) {
    return `https://dockstore.org/api/ga4gh/trs/v2/tools/${trs_id}/versions/${trs_version}`;
}

const dockstoreWorkflowPageUrl = computed(() => {
    const repoPath = props.workflow?.trsID.substring("#workflow/".length);
    const baseUrl = "https://dockstore.org/workflows/";
    return baseUrl + repoPath;
});

const doiResolverUrl = computed(() => {
    return `https://doi.org/${props.workflow?.doi}`;
});

async function createLandingPage() {
    if (!selectedInstance.value) {
        alert("Please select a Galaxy instance first");
        return;
    }

    const job = testToRequestState();
    const trs_url = trsIdAndVersionToDockstoreUrl(props.workflow?.trsID!, `v${props.workflow?.definition.release}`);
    // Normalize the URL to ensure it has a protocol
    const normalizedInstance = normalizeGalaxyUrl(selectedInstance.value) || selectedInstance.value;

    try {
        const response = await fetch(`${normalizedInstance}/api/workflow_landings`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                workflow_id: trs_url,
                workflow_target_type: "trs_url",
                request_state: job,
                public: true,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create landing page: ${response.statusText}`);
        }

        const json = await response.json();
        const landingPage = `${normalizedInstance}/workflow_landings/${json["uuid"]}?public=true`;
        window.open(landingPage, "_blank");
    } catch (error) {
        console.error("Error creating landing page:", error);
        alert("Failed to create landing page. Please try again or check the browser console for details.");
    }
}

const tools = computed(() => {
    if (!props.workflow || !props.workflow.definition || !props.workflow.definition.steps) {
        return [];
    }
    const toolIds = Object.values(props.workflow.definition.steps)
        .map((step) => step.tool_id)
        .filter((id): id is string => id !== null && id !== undefined);
    return Array.from(new Set(toolIds));
});

const workflow_job_input = computed(() => {
    const config_init_command = `planemo workflow_job_init ${props.workflow?.iwcID}.ga -o ${props.workflow?.iwcID}-job.yml`;
    if (!props.workflow || !props.workflow || !props.workflow.workflow_job_input) {
        return `# config file: ${props.workflow?.iwcID}_job.yml file\n${config_init_command}`;
    } else {
        return `# config file: ${props.workflow?.iwcID}_job.yml\n# command: ${config_init_command}\n${stringify(props.workflow.workflow_job_input)}`;
    }
});

// Define interface for tab items
interface TabItem {
    value: string;
    label: string;
    content?: string;
}

const tabs = computed<TabItem[]>(() => [
    {
        value: "about",
        label: "About",
        content: props.workflow?.readme || "No README available.",
    },
    {
        value: "diagram",
        label: "Diagram",
        content: props.workflow?.diagrams || "No diagram available",
    },
    {
        value: "version-history",
        label: "Version History",
        content: props.workflow?.changelog || "No CHANGELOG available.",
    },
    {
        value: "how-to-run",
        label: "How to Run",
        // No content property as we'll use a custom template for this tab
    },
]);

function onTabChange(value: string) {
    currentTab.value = value;
    // Set the hash in the URL for better navigation
    if (window.location.hash !== `#${value}`) {
        window.location.hash = `#${value}`;
    }
}

// Function to set the active tab based on URL hash
function setActiveTabFromHash() {
    const hash = window.location.hash.slice(1); // Remove the # character
    if (hash) {
        // Find the tab value that matches the hash
        const tab = tabs.value.find((t) => t.value === hash);
        if (tab) {
            currentTab.value = tab.value;
        }
    }
}

onMounted(() => {
    nextTick(() => {
        setActiveTabFromHash();
    });
});
</script>

<template>
    <div class="flex flex-col lg:flex-row gap-6">
        <!-- Main content area -->
        <div class="flex-1 min-w-0">
            <div class="p-4 mb-6">
                <Tabs v-model="currentTab" @update:modelValue="onTabChange">
                    <!-- Tab List -->
                    <TabsList class="mb-4">
                        <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value">
                            {{ tab.label }}
                        </TabsTrigger>
                    </TabsList>

                    <!-- About Tab -->
                    <TabsContent value="about" class="prose !max-w-none">
                        <MarkdownRenderer :markdownContent="tabs.find((t) => t.value === 'about')?.content || ''" />
                    </TabsContent>

                    <!-- Diagram Tab -->
                    <TabsContent value="diagram" class="prose !max-w-none">
                        <MarkdownRenderer :markdownContent="tabs.find((t) => t.value === 'diagram')?.content || ''" />
                    </TabsContent>

                    <!-- Version History Tab -->
                    <TabsContent value="version-history" class="prose !max-w-none">
                        <MarkdownRenderer
                            :markdownContent="tabs.find((t) => t.value === 'version-history')?.content || ''" />
                    </TabsContent>

                    <!-- How to Run Tab -->
                    <TabsContent value="how-to-run" class="prose !max-w-none">
                        <h1>How to Run This Workflow</h1>
                        <p>There are multiple ways to run this workflow. Choose the method that suits your needs:</p>

                        <div class="bg-gray-50 p-6 rounded-lg mb-8 not-prose">
                            <h3 class="text-xl font-bold mb-4">Run in Galaxy</h3>
                            <p class="mb-4">The easiest way to run this workflow is directly in a Galaxy instance:</p>

                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 1: Select a Galaxy instance</h4>
                                <GalaxyInstanceSelector v-model="selectedInstance" class="mb-4" />
                                <div v-if="selectedInstance" class="text-sm text-gray-600">
                                    Selected instance: <span class="font-medium">{{ selectedInstance }}</span>
                                </div>
                            </div>

                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 2: Choose how to run</h4>
                                <div class="grid xl:grid-cols-2 gap-6">
                                    <div class="border border-gray-300 rounded-lg p-4">
                                        <h5 class="font-bold mb-2">Run with your own data</h5>
                                        <p class="text-sm mb-4">
                                            Import the workflow and fill in your own input parameters and datasets.
                                        </p>
                                        <Button as="a" :href="launchUrl" target="_blank"> Launch Workflow </Button>
                                    </div>

                                    <div class="border border-gray-300 rounded-lg p-4">
                                        <h5 class="font-bold mb-2">Run with example data</h5>
                                        <p class="text-sm mb-4">
                                            Import the workflow with example datasets pre-filled, ready to launch.
                                        </p>
                                        <Button @click="createLandingPage" variant="outline">
                                            Try with Example Data
                                        </Button>
                                    </div>
                                </div>
                                <div v-if="!selectedInstance" class="mt-3 text-sm text-amber-600">
                                    ⚠️ Please select a Galaxy instance first
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-50 p-6 rounded-lg not-prose">
                            <h3 class="text-xl font-bold mb-4">Run with Planemo CLI</h3>
                            <p class="mb-4">
                                For advanced users and developers, you can run this workflow using the
                                <a
                                    href="https://planemo.readthedocs.io/"
                                    target="_blank"
                                    class="text-bay-of-many-700 hover:underline"
                                    >Planemo</a
                                >
                                command-line tool:
                            </p>

                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 1: Install Planemo</h4>
                                <p class="mb-2 text-sm">If you haven't already, install Planemo using pip:</p>
                                <CodeBlock code="pip install planemo" />
                            </div>

                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 2: Download the workflow</h4>
                                <p class="mb-2 text-sm">Download the workflow .ga file:</p>
                                <CodeBlock
                                    :code="`curl &quot;https://iwc.galaxyproject.org/data/${workflow?.iwcID}.ga&quot; -o ${workflow?.iwcID}.ga`" />
                            </div>

                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 3: Run the workflow tests</h4>
                                <p class="mb-2 text-sm">Run the workflow tests with Planemo:</p>
                                <CodeBlock
                                    :code="`curl &quot;https://iwc.galaxyproject.org/data/${workflow?.iwcID}-tests.yml&quot; -o ${workflow?.iwcID}-tests.yml\nplanemo test ${workflow?.iwcID}.ga`" />
                            </div>

                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 4: Create workflow job file</h4>
                                <p class="mb-2 text-sm">
                                    Create a workflow job file with your input parameters and update the values to match
                                    your environment and run:
                                </p>
                                <CodeBlock :code="workflow_job_input" />
                            </div>
                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 5: Run the workflow with your data</h4>
                                <p class="mt-2 mb-2 text-sm">Then run the workflow with your job file:</p>
                                <CodeBlock
                                    :code="`planemo run ${workflow?.iwcID}.ga ${workflow?.iwcID}-job.yml \\\n    --output_directory . \\\n    --download_outputs \\\n    --output_json output.json`" />
                            </div>
                        </div>

                        <div class="mt-8 not-prose">
                            <h3 class="text-xl font-bold mb-4">Additional Resources</h3>
                            <ul class="space-y-2">
                                <li>
                                    <a
                                        :href="dockstoreWorkflowPageUrl"
                                        target="_blank"
                                        class="text-bay-of-many-700 hover:underline">
                                        View this workflow on Dockstore ↗
                                    </a>
                                </li>
                                <li v-if="workflow.doi">
                                    <a
                                        :href="doiResolverUrl"
                                        target="_blank"
                                        class="text-bay-of-many-700 hover:underline">
                                        Cite this workflow (DOI: {{ workflow.doi }}) ↗
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://training.galaxyproject.org"
                                        target="_blank"
                                        class="text-bay-of-many-700 hover:underline">
                                        Galaxy Training Materials ↗
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        <!-- Right sidebar -->
        <div class="lg:w-1/4 lg:min-w-64">
            <div class="sticky top-4 bg-white border border-gray-200 rounded-lg p-6">
                <h2 class="font-bold text-xl mb-4">{{ workflow.definition.name }}</h2>
                <p class="mb-4 text-gray-700">{{ workflow.definition.annotation }}</p>
                <ul class="space-y-2 text-sm">
                    <li><strong>Author(s):</strong></li>
                    <li class="ml-2" v-for="author in workflow.authors" :key="author.name">
                        <Author :author="author" />
                    </li>
                    <li><strong>Release: </strong>{{ workflow.definition.release }}</li>
                    <li><strong>Updated: </strong>{{ formatDate(workflow.updated) }}</li>
                    <li><strong>License: </strong>{{ workflow.definition.license }}</li>
                    <li v-if="workflow.doi">
                        <strong>DOI: </strong>
                        <a :href="doiResolverUrl" target="_blank" class="text-bay-of-many-700 hover:underline">
                            {{ workflow.doi }} ↗
                        </a>
                    </li>
                    <li>
                        <strong>TRS: </strong>
                        <a
                            :href="dockstoreWorkflowPageUrl"
                            target="_blank"
                            class="text-bay-of-many-700 hover:underline">
                            {{ workflow.trsID }} ↗
                        </a>
                    </li>
                </ul>
                <h3 class="font-bold text-l mt-4">Running this workflow</h3>
                <GalaxyInstanceSelector v-model="selectedInstance" />
                <p class="my-3 text-sm text-gray-600">Choose how you want to run this workflow:</p>
                <div class="mt-3 flex flex-col gap-3">
                    <Button as="a" :href="launchUrl" target="_blank" class="w-full"> Launch Workflow </Button>
                    <Button @click="createLandingPage" variant="outline" class="w-full"> Try with Example Data </Button>
                </div>
                <p class="mt-3 text-xs text-gray-500">
                    <strong>Launch Workflow:</strong> Import with your own data<br />
                    <strong>Try with Examples:</strong> Pre-filled demo datasets
                </p>
            </div>
        </div>
    </div>
</template>
