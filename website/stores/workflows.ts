import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { type Workflow, type WorkflowCollection } from "~/models/workflow";
import { workflowCollections } from "~/models/workflow";

export const useWorkflowStore = defineStore("workflow", () => {
    const route = useRoute();
    const workflow = ref<Workflow | null>(null);

    const allWorkflows = computed(() => workflowCollections.flatMap((collection) => collection.workflows));

    const setWorkflow = () => {
        workflow.value = allWorkflows.value.find((w) => w.definition.uuid === route.params.id);
    };

    return {
        workflow,
        allWorkflows,
        setWorkflow,
    };
});
