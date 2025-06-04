<template>
    <div class="container mx-auto py-16 px-6 text-center max-w-6xl overflow-auto">
        <!-- Hero Section -->
        <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Automate your analysis from<br />
            <span class="block">data to visualization and a report</span>
        </h1>

        <p class="text-lg text-gray-700 leading-relaxed mb-6">
            The Galaxy Workflow Library is a curated collection of ready-to-use, open-source analysis workflows designed
            to help researchers make progress quickly and reliably. Each workflow comes with sample datasets, clear
            documentation, and links to training materials to streamline learning and application.
        </p>

        <p class="text-lg text-gray-700 leading-relaxed mb-10">
            Whether you're working on a public Galaxy server, your own private Galaxy instance, these workflows are here
            to empower your research with robust, reproducible, and accessible tools.
        </p>

        <NuxtLink
            to="/"
            class="inline-block bg-ebony-clay hover:bg-bay-of-many text-white font-medium py-3 px-6 rounded-lg transition duration-300 mb-16">
            Browse the library »
        </NuxtLink>

        <div class="mb-10">
            <img src="/run-flow.png" alt="Run a workflow flow" width="100%" />
        </div>

        <!-- Why Section -->
        <div class="text-left">
            <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">Why use peer-reviewed Galaxy workflows?</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(feature, index) in features" :key="index" class="p-6 bg-chicago-50 rounded-lg">
                    <div :class="`text-${feature.color} text-3xl mb-4`">
                        <Icon :name="feature.icon" />
                    </div>
                    <h3 class="font-bold text-lg mb-2">{{ feature.title }}</h3>
                    <p class="text-gray-700">{{ feature.description }}</p>
                </div>
            </div>
        </div>

        <!-- High-quality Section -->
        <div class="mt-16">
            <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">
                These are high-quality workflows, ready to run
            </h2>

            <div class="flex justify-center">
                <button
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :class="[
                        'px-4 py-2 rounded-t-lg',
                        currentTab === index ? 'bg-chicago-50' : 'bg-white hover:bg-chicago-50',
                    ]"
                    @click="currentTab = index">
                    {{ tab.title }}
                </button>
            </div>
            <div class="bg-chicago-50 rounded-b-lg p-6">
                <div v-if="currentTab === 0">{{ tabs[0].content }}</div>
                <div v-if="currentTab === 1">{{ tabs[1].content }}</div>
                <div v-if="currentTab === 2">{{ tabs[2].content }}</div>
                <div v-if="currentTab === 3">{{ tabs[3].content }}</div>
                <div v-if="currentTab === 4">{{ tabs[4].content }}</div>
            </div>
        </div>

        <!-- Join Section -->
        <div class="py-16 text-left">
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Left Side: Description -->
                <div class="md:w-1/2">
                    <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">Join the community</h2>
                    <p class="text-lg text-gray-700 mb-4">
                        The Galaxy Workflow Library is an open, collaborative project, and we welcome contributions from
                        the community. Whether you want to enhance existing workflows, report issues, or contribute new
                        workflows, your input is invaluable.
                    </p>
                    <p class="text-lg text-gray-700">
                        Have questions or feedback? Connect via
                        <a href="https://galaxyproject.org" class="text-blue-600">Galaxy’s Community Hub</a>
                        or engage with other users and contributors through project chats and social media.
                    </p>
                </div>

                <!-- Right Side: Contributions List -->
                <div class="md:w-1/2 space-y-6">
                    <div v-for="(item, index) in contributions" :key="index" class="p-4 bg-chicago-50 rounded-lg">
                        <h3 class="font-bold text-lg">
                            <span :class="`text-${item.color} font-bold`">{{ item.title }}</span>
                        </h3>
                        <p class="text-gray-700">{{ item.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-6 bg-chicago-50 rounded-lg border-l-4 border-orange-500 mt-10 text-left">
            <div class="flex flex-col md:flex-row gap-8">
                <div class="md:w-1/2">
                    <h3 class="text-2xl font-bold mb-4">Why contribute a workflow?</h3>
                    <p class="text-lg mb-4 text-gray-700">Ohh, so many reasons!</p>
                </div>
                <div class="md:w-1/2 space-y-6">
                    <ul class="list-disc list-inside text-gray-700 space-y-2">
                        <li>Get a free DOI and citations that follow</li>
                        <li>Automatic deployment to usegalaxy.*</li>
                        <li>Daily testing with easy-to-inspect results</li>
                        <li>Testing against new releases</li>
                        <li>Automatic updates and versioning</li>
                        <li>Bug reports and contributions from users</li>
                        <li>Performance benchmarks</li>
                        <li>Static webpage with all the workflow details</li>
                        <li>Discoverability by your peers</li>
                    </ul>
                </div>
            </div>
        </div>

        <NuxtLink
            to="/"
            class="inline-block bg-ebony-clay hover:bg-bay-of-many text-white font-medium py-3 px-6 rounded-lg transition duration-300 mt-8 mb-8">
            Browse the library »
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSeoMeta, useRuntimeConfig } from "#imports";

// Get the public runtime config to access the app URL
const config = useRuntimeConfig().public;
const baseUrl = config.appUrl || (process.client ? window.location.origin : "https://workflows.galaxyproject.org");

// Add SEO meta tags using the useSeoMeta composable
useSeoMeta({
    title: "About the Galaxy Workflow Library",
    description:
        "Learn about the IWC curated collection of peer-reviewed, ready-to-use Galaxy workflows for scientific analysis",
    ogTitle: "About the Galaxy Workflow Library",
    ogDescription:
        "Discover a curated collection of ready-to-use, peer-reviewed Galaxy workflows for scientific analysis",
    ogImage: `${baseUrl}/iwc_logo.png`,
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: "About the Galaxy Workflow Library",
    twitterDescription:
        "Discover a curated collection of ready-to-use, peer-reviewed Galaxy workflows for scientific analysis",
    twitterImage: `${baseUrl}/iwc_logo.png`,
});

const features = [
    {
        icon: "uil:check-circle",
        title: "Adherence to best practices",
        description:
            "Every workflow is developed following community-established standards, ensuring consistency and reliability.",
        color: "yellow-500",
    },
    {
        icon: "uil:angle-right-b",
        title: "Compatibility and portability",
        description:
            "Workflows are ready to run on usegalaxy.* servers, and they can be adapted for private Galaxy instances.",
        color: "orange-500",
    },
    {
        icon: "uil:star",
        title: "Open-source Accessibility",
        description: "All workflows are freely available, fostering transparency and collaboration.",
        color: "pink-500",
    },
    {
        icon: "uil:book-open",
        title: "Closely linked to training resources",
        description:
            "Each workflow is linked to relevant tutorials from the Galaxy Training Network (GTN), providing hands-on guidance for users.",
        color: "purple-500",
    },
    {
        icon: "uil:refresh",
        title: "Reliable and regularly tested",
        description:
            "Regular testing ensures workflows remain operational and effective, giving you confidence in their performance.",
        color: "blue-500",
    },
];

const tabs = [
    {
        title: "Peer reviewed",
        content:
            "All workflows undergo a rigorous peer-review process involving subject-matter experts. The review process validates that the workflow is scientifically sound, that it adheres to the best practices in terms of tools, parameters, and Galaxy usage. The review process also ensures the workflow has necessary documentation and annotations as well as links to training materials where applicable.",
    },
    {
        title: "Include tests and test data",
        content:
            "Each workflow includes test cases and test datasets to verify its accuracy and reproducibility. The workflows also include sample data, allowing anyone to get started quickly and explore the workflow without having to collect competitive data first.",
    },
    {
        title: "Regularly monitored",
        content:
            "Automated systems that monitor workflows regularly to confirm their ongoing functionality across supported Galaxy platforms. This ensures their robustness over time and provides assurances that one can focus on the analysis and interpreting the results, not the technical details of running the workflow.",
    },
    {
        title: "Transparently versioned",
        content:
            "Changes to workflows are documented, ensuring users can track updates and maintain reproducibility in their analyses. Every workflow is versioned so you can always go back to a specific version, which includes not only the same parameters but also same tool versions.",
    },
    {
        title: "Automatically updated",
        content:
            "Workflows are automatically updated when new versions of tools are released, ensuring that the workflows remain up-to-date and that users can benefit from the latest features and bug fixes.",
    },
];
const currentTab = ref(0);

const contributions = [
    {
        title: "Explore the GitHub Repository:",
        description:
            "Visit the library GitHub repository for contribution guidelines, issue tracking, and pull request templates.",
        color: "gray-700",
    },
    {
        title: "Improve Existing Workflows:",
        description: "Help refine current workflows by fixing bugs, adding features, or updating documentation.",
        color: "orange-500",
    },
    {
        title: "Submit New Workflows:",
        description: "Share your own workflows by following our submission guidelines.",
        color: "blue-500",
    },
    {
        title: "Participate in Peer Review:",
        description: "Join the review process to help maintain high standards for the library.",
        color: "purple-500",
    },
];
</script>

<style scoped>
h1,
h2,
h3 {
    color: #111827;
}

p,
ul li {
    color: #4b5563;
}

.overflow-auto {
    overflow: auto;
    /* Hide scrollbar for Chrome/Safari */
    &::-webkit-scrollbar {
        display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
