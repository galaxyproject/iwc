<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { stringify } from 'yaml';
import type { Workflow } from '../models/workflow';
import MarkdownRenderer from './MarkdownRenderer.vue';
import Author from './Author.vue';
import GalaxyInstanceSelector from './GalaxyInstanceSelector.vue';
import { formatDate } from '../utils';

const props = defineProps<{
    workflow: Workflow;
}>();

const selectedInstance = ref('');
const currentTabIndex = ref(0);

const launchUrl = computed(() => {
    if (!selectedInstance.value) return '';
    return `${selectedInstance.value}/workflows/trs_import?trs_server=dockstore.org&trs_id=${encodeURIComponent(props.workflow.trsID)}&trs_version=v${props.workflow.definition.release}&run_form=true`;
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
    const repoPath = props.workflow?.trsID.substring('#workflow/'.length);
    const baseUrl = 'https://dockstore.org/workflows/';
    return baseUrl + repoPath;
});

const doiResolverUrl = computed(() => {
    return `https://doi.org/${props.workflow?.doi}`;
});

async function createLandingPage() {
    const job = testToRequestState();
    const trs_url = trsIdAndVersionToDockstoreUrl(
        props.workflow?.trsID!,
        `v${props.workflow?.definition.release}`
    );
    const response = await fetch(`${selectedInstance.value}/api/workflow_landings`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
            workflow_id: trs_url,
            workflow_target_type: 'trs_url',
            request_state: job,
            public: true,
        }),
    });
    const json = await response.json();
    const landingPage = `${selectedInstance.value}/workflow_landings/${json['uuid']}?public=true`;
    window.open(landingPage, '_blank');
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
    label: string;
    content?: string;
    tools?: string[] | string;
    preview?: boolean;
}

const tabs = computed<TabItem[]>(() => [
    {
        label: 'About',
        content: props.workflow?.readme || 'No README available.',
    },
    {
        label: 'Diagram',
        content: props.workflow?.diagrams || 'No diagram available',
    },
    {
        label: 'Version History',
        content: props.workflow?.changelog || 'No CHANGELOG available.',
    },
    {
        label: 'How to Run',
        // No content property as we'll use a custom template for this tab
    },
]);

function onTabChange(index: number) {
    currentTabIndex.value = index;
    // Set the hash in the URL to the current tab label for better navigation
    const item = tabs.value[index];
    if (item) {
        const label = item.label.toLowerCase().replace(/\s+/g, '-');
        if (window.location.hash !== `#${label}`) {
            window.location.hash = `#${label}`;
        }
    }
}

// Function to set the active tab based on URL hash
function setActiveTabFromHash() {
    const hash = window.location.hash.slice(1); // Remove the # character
    if (hash) {
        // Find the tab index that matches the hash
        const tabIndex = tabs.value.findIndex((tab) => tab.label.toLowerCase().replace(/\s+/g, '-') === hash);
        if (tabIndex !== -1) {
            currentTabIndex.value = tabIndex;
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
        <div class="flex-1">
            <div class="p-4 mb-6">
                <!-- Tabs -->
                <div class="border-b border-gray-200 mb-4">
                    <nav class="flex gap-2" aria-label="Tabs">
                        <button
                            v-for="(tab, index) in tabs"
                            :key="index"
                            @click="onTabChange(index)"
                            :class="[
                                'px-4 py-2 font-medium text-sm border-b-2 transition-colors',
                                currentTabIndex === index
                                    ? 'border-bay-of-many-700 text-bay-of-many-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            ]"
                        >
                            {{ tab.label }}
                        </button>
                    </nav>
                </div>

                <!-- Tab content -->
                <div class="mt-6">
                    <!-- About, Diagram, Version History tabs -->
                    <div v-if="tabs[currentTabIndex].content" class="prose !max-w-none">
                        <MarkdownRenderer :markdownContent="tabs[currentTabIndex].content!" />
                    </div>

                    <!-- How to Run tab -->
                    <div v-else-if="tabs[currentTabIndex].label === 'How to Run'" class="prose !max-w-none">
                        <h2>How to Run This Workflow</h2>
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
                                <div class="grid md:grid-cols-2 gap-6">
                                    <div class="border border-gray-300 rounded-lg p-4">
                                        <h5 class="font-bold mb-2">Run with your own data</h5>
                                        <p class="text-sm mb-4">
                                            Import the workflow and fill in your own input parameters and datasets.
                                        </p>
                                        <a
                                            :href="launchUrl"
                                            target="_blank"
                                            class="inline-block px-4 py-2 bg-bay-of-many-700 text-white rounded hover:bg-bay-of-many-800"
                                        >
                                            🚀 Run Workflow
                                        </a>
                                    </div>

                                    <div class="border border-gray-300 rounded-lg p-4">
                                        <h5 class="font-bold mb-2">Run with example data</h5>
                                        <p class="text-sm mb-4">
                                            Import the workflow with example datasets pre-filled, ready to launch.
                                        </p>
                                        <button
                                            @click="createLandingPage"
                                            class="px-4 py-2 bg-bay-of-many-700 text-white rounded hover:bg-bay-of-many-800"
                                        >
                                            🚀 Run with example data
                                        </button>
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
                                <pre class="p-3 rounded overflow-x-auto bg-gray-800 text-gray-100"><code>pip install planemo</code></pre>
                            </div>

                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 2: Download the workflow</h4>
                                <p class="mb-2 text-sm">Download the workflow .ga file:</p>
                                <pre class="p-3 rounded overflow-x-auto bg-gray-800 text-gray-100"><code>curl "https://iwc.galaxyproject.org/data/{{ workflow?.iwcID }}.ga" -o {{ workflow?.iwcID }}.ga</code></pre>
                            </div>

                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 3: Run the workflow tests</h4>
                                <p class="mb-2 text-sm">Run the workflow tests with Planemo:</p>
                                <pre class="p-3 rounded overflow-x-auto bg-gray-800 text-gray-100"><code>curl "https://iwc.galaxyproject.org/data/{{ workflow?.iwcID }}-tests.yml" -o {{ workflow?.iwcID }}-tests.yml
planemo test {{ workflow?.iwcID }}.ga</code></pre>
                            </div>

                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 4: Create workflow job file</h4>
                                <p class="mb-2 text-sm">
                                    Create a workflow job file with your input parameters and update the values to
                                    match your environment and run:
                                </p>
                                <pre class="p-3 rounded overflow-x-auto bg-gray-800 text-gray-100"><code>{{ workflow_job_input }}</code></pre>
                            </div>
                            <div class="mb-6">
                                <h4 class="text-lg font-medium mb-2">Step 5: Run the workflow with your data</h4>
                                <p class="mt-2 mb-2 text-sm">Then run the workflow with your job file:</p>
                                <pre class="p-3 rounded overflow-x-auto bg-gray-800 text-gray-100"><code>planemo run {{ workflow?.iwcID }}.ga {{ workflow?.iwcID }}-job.yml \
    --output_directory . \
    --download_outputs \
    --output_json output.json </code></pre>
                            </div>
                        </div>

                        <div class="mt-8 not-prose">
                            <h3 class="text-xl font-bold mb-4">Additional Resources</h3>
                            <ul class="space-y-2">
                                <li>
                                    <a
                                        :href="dockstoreWorkflowPageUrl"
                                        target="_blank"
                                        class="text-bay-of-many-700 hover:underline"
                                    >
                                        View this workflow on Dockstore ↗
                                    </a>
                                </li>
                                <li v-if="workflow.doi">
                                    <a :href="doiResolverUrl" target="_blank" class="text-bay-of-many-700 hover:underline">
                                        Cite this workflow (DOI: {{ workflow.doi }}) ↗
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://training.galaxyproject.org"
                                        target="_blank"
                                        class="text-bay-of-many-700 hover:underline"
                                    >
                                        Galaxy Training Materials ↗
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right sidebar -->
        <div class="lg:w-80">
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
                        <a :href="dockstoreWorkflowPageUrl" target="_blank" class="text-bay-of-many-700 hover:underline">
                            {{ workflow.trsID }} ↗
                        </a>
                    </li>
                </ul>
                <h3 class="font-bold text-l mt-4">Running this workflow</h3>
                <GalaxyInstanceSelector v-model="selectedInstance" />
                <p class="my-2 text-sm font-medium">
                    You can choose to run the workflow with sample data prefilled, or with your own data.
                </p>
                <div class="mt-4 flex flex-col gap-2">
                    <a
                        :href="launchUrl"
                        target="_blank"
                        class="inline-block px-4 py-2 bg-bay-of-many-700 text-white text-center rounded hover:bg-bay-of-many-800"
                    >
                        🚀 Run Workflow
                    </a>
                    <button
                        @click="createLandingPage"
                        class="px-4 py-2 bg-bay-of-many-700 text-white rounded hover:bg-bay-of-many-800"
                    >
                        🚀 Run with example data
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
