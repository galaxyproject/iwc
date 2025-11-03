import { atom, computed } from "nanostores";
import type { Workflow, WorkflowCollection } from "../models/workflow";

// Store for workflow collections
export const workflowCollections = atom<WorkflowCollection[]>([]);

// Selected filters
export const selectedFilters = atom<string[]>([]);

// Collection page search query
export const collectionSearchQuery = atom<string>("");

// Computed stores
export const allWorkflows = computed(workflowCollections, (collections) => {
    return collections.flatMap((collection) => collection.workflows);
});

export const allCollections = computed(allWorkflows, (workflows) => {
    return Array.from(new Set(workflows.flatMap((w) => w.collections))).sort();
});

// Helper functions
export function setWorkflowCollections(collections: WorkflowCollection[]) {
    workflowCollections.set(collections);
}

export function toggleFilter(filter: string) {
    const current = selectedFilters.get();
    if (current.includes(filter)) {
        selectedFilters.set([]);
    } else {
        selectedFilters.set([filter]);
    }
}

export function setFilterFromUrl() {
    if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const filter = params.get("filter");
        if (filter) {
            selectedFilters.set([filter]);
        }
    }
}

export function collectionToSlug(collection: string): string {
    return collection
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}
