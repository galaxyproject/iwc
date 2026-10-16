import { atom, computed } from "nanostores";
import type { WorkflowCollection, SearchIndexEntry } from "../models/workflow";

// Store for workflow collections
export const workflowCollections = atom<WorkflowCollection[]>([]);

// Store for search index (lightweight workflow data, initialized from props at build time)
export const searchIndex = atom<SearchIndexEntry[]>([]);

// Selected filters
export const selectedFilters = atom<string[]>([]);

// Collection page search query
export const collectionSearchQuery = atom<string>("");

// View mode (list or grid)
export const viewMode = atom<"list" | "grid">("list");

// Search query (homepage)
export const searchQuery = atom<string>("");

// Computed: is search active?
export const isSearchActive = computed(searchQuery, (q) => q.trim().length > 0);

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

export function setSearchFromUrl() {
    if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q");
        if (q) {
            searchQuery.set(q);
        }
    }
}

export function updateSearchUrl(query: string) {
    if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (query.trim()) {
            params.set("q", query.trim());
        } else {
            params.delete("q");
        }
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        window.history.replaceState({}, "", newUrl);
    }
}

export function collectionToSlug(collection: string): string {
    return collection
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

// Computed: all collections from search index
export const searchIndexCollections = computed(searchIndex, (entries) => {
    return Array.from(new Set(entries.flatMap((e) => e.collections))).sort();
});
