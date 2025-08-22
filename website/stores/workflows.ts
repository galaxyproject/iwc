import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { type Workflow, type WorkflowCollection } from "~/models/workflow";
import { workflowCollections } from "~/models/workflow";

export const useWorkflowStore = defineStore("workflow", () => {
    const route = useRoute();
    const router = useRouter();
    const workflow = ref<Workflow | null>(null);

    const allWorkflows = computed(() => workflowCollections.flatMap((collection) => collection.workflows));

    const getWorkflowByTrsId = (trsID: string) => {
        return allWorkflows.value.find((w) => w.trsID === trsID) as Workflow;
    };
    const allCategories = computed(() => Array.from(new Set(allWorkflows.value.flatMap((w) => w.categories))));
    const allCollections = computed(() => Array.from(new Set(allWorkflows.value.flatMap((w) => w.collections))));
    const allTags = computed(() => Array.from(new Set(allWorkflows.value.flatMap((w) => w.definition.tags))));

    // Initialize selectedFilters from URL query parameter
    const selectedFilters = ref<string[]>(process.client && route.query.filter ? [route.query.filter as string] : []);

    const allFilters = computed(() => {
        const collections = allWorkflows.value.flatMap((w) => w.collections);
        return Array.from(new Set(collections)).sort();
    });

    const validFilters = computed(() => {
        // All filters are valid when single selection is allowed
        return allFilters.value;
    });

    function toggleFilter(filter: string) {
        // If the filter is already selected, deselect it
        if (selectedFilters.value.includes(filter)) {
            selectedFilters.value = [];
            // Update URL to remove filter parameter
            if (process.client) {
                router.push({ query: {} });
            }
        } else {
            // Otherwise replace the current selection with the new filter
            selectedFilters.value = [filter];
            // Update URL with filter parameter
            if (process.client) {
                router.push({ query: { filter } });
            }
        }
    }

    // Function to set filter from URL (useful for initial load)
    function setFilterFromUrl() {
        if (process.client && route.query.filter) {
            const filterFromUrl = route.query.filter as string;
            if (allFilters.value.includes(filterFromUrl)) {
                selectedFilters.value = [filterFromUrl];
            }
        }
    }

    const setWorkflow = () => {
        workflow.value = allWorkflows.value.find(
            (w) => w.iwcID === route.params.id || w.trsID === route.params.id,
        ) as Workflow;
    };

    // Helper function to convert collection name to URL slug
    const collectionToSlug = (collection: string) => {
        return collection
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
    };

    // Helper function to convert URL slug back to collection name
    const slugToCollection = (slug: string) => {
        return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Get workflows for a specific collection
    const getWorkflowsByCollection = (collectionName: string) => {
        return allWorkflows.value.filter((workflow) =>
            workflow.collections.some((col) => col.toLowerCase() === collectionName.toLowerCase()),
        );
    };

    return {
        workflow,
        allCategories,
        allCollections,
        allTags,
        allWorkflows,
        getWorkflowByTrsId,
        setWorkflow,
        selectedFilters,
        allFilters,
        validFilters,
        invalidFilters: computed(() => {
            return allFilters.value.filter((filter) => !validFilters.value.includes(filter));
        }),
        toggleFilter,
        setFilterFromUrl,
        collectionToSlug,
        slugToCollection,
        getWorkflowsByCollection,
    };
});
