import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { type Workflow, type WorkflowCollection } from "~/models/workflow";
import { workflowCollections } from "~/models/workflow";

export const useWorkflowStore = defineStore("workflow", () => {
    const route = useRoute();
    const workflow = ref<Workflow | null>(null);

    const allWorkflows = computed(() => workflowCollections.flatMap((collection) => collection.workflows));

    const getWorkflowByTrsId = (trsID: string) => {
        return allWorkflows.value.find((w) => w.trsID === trsID) as Workflow;
    };
    const allCategories = computed(() => Array.from(new Set(allWorkflows.value.flatMap((w) => w.categories))));
    const allCollections = computed(() => Array.from(new Set(allWorkflows.value.flatMap((w) => w.collections))));
    const allTags = computed(() => Array.from(new Set(allWorkflows.value.flatMap((w) => w.definition.tags))));

    const selectedFilters = ref<string[]>([]);

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
        } else {
            // Otherwise replace the current selection with the new filter
            selectedFilters.value = [filter];
        }
    }

    const setWorkflow = () => {
        workflow.value = allWorkflows.value.find((w) => w.trsID === route.params.id) as Workflow;
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
    };
});
