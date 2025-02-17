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

    const selectedCategories = ref<string[]>([]);
    const selectedTags = ref<string[]>([]);

    function toggleCategory(category: string) {
        if (selectedCategories.value.includes(category)) {
            selectedCategories.value = selectedCategories.value.filter((c) => c !== category);
        } else {
            selectedCategories.value.push(category);
        }
    }

    function toggleTag(tag: string) {
        if (selectedTags.value.includes(tag)) {
            selectedTags.value = selectedTags.value.filter((t) => t !== tag);
        } else {
            selectedTags.value.push(tag);
        }
    }

    const setWorkflow = () => {
        workflow.value = allWorkflows.value.find((w) => w.trsID === route.params.id) as Workflow;
    };

    const getValidCategories = computed(() => {
        return allCategories.value.filter((category) => {
            const tempCategories = [...selectedCategories.value, category];
            return allWorkflows.value.some(
                (workflow) =>
                    tempCategories.every((c) => workflow.categories.includes(c)) &&
                    selectedTags.value.every((t) => workflow.definition.tags.includes(t)),
            );
        });
    });

    const getValidTags = computed(() => {
        return allTags.value.filter((tag) => {
            const tempTags = [...selectedTags.value, tag];
            return allWorkflows.value.some(
                (workflow) =>
                    selectedCategories.value.every((c) => workflow.categories.includes(c)) &&
                    tempTags.every((t) => workflow.definition.tags.includes(t)),
            );
        });
    });

    return {
        workflow,
        allCategories,
        allCollections,
        allTags,
        allWorkflows,
        getWorkflowByTrsId,
        setWorkflow,
        selectedCategories,
        selectedTags,
        toggleCategory,
        toggleTag,
        getValidCategories,
        getValidTags,
    };
});
