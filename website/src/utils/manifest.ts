import type { WorkflowCollection, LightweightWorkflow } from "../models/workflow";

let manifestData: WorkflowCollection[] | null = null;

export async function loadManifest(): Promise<WorkflowCollection[]> {
    if (manifestData) {
        return manifestData;
    }

    try {
        // During build (SSR), load from file system
        if (typeof window === "undefined") {
            const fs = await import("fs/promises");
            const path = await import("path");
            const manifestPath = path.join(process.cwd(), "public", "workflow_manifest.json");
            const data = await fs.readFile(manifestPath, "utf-8");
            manifestData = JSON.parse(data);
        } else {
            // Client-side, fetch from public URL
            const response = await fetch("/workflow_manifest.json");
            manifestData = await response.json();
        }
        return manifestData || [];
    } catch (error) {
        console.error("Failed to load manifest:", error);
        return [];
    }
}

export function getAllWorkflows(collections: WorkflowCollection[]) {
    return collections.flatMap((collection) => collection.workflows);
}

export function getAllCategories(collections: WorkflowCollection[]) {
    const workflows = getAllWorkflows(collections);
    return Array.from(new Set(workflows.flatMap((w) => w.categories)));
}

export function getAllCollections(collections: WorkflowCollection[]) {
    const workflows = getAllWorkflows(collections);
    return Array.from(new Set(workflows.flatMap((w) => w.collections))).sort();
}

export function getAllTags(collections: WorkflowCollection[]) {
    const workflows = getAllWorkflows(collections);
    return Array.from(new Set(workflows.flatMap((w) => w.definition.tags)));
}

// Extract only the fields needed for workflow listing and search
export function getLightweightWorkflows(collections: WorkflowCollection[]): LightweightWorkflow[] {
    return getAllWorkflows(collections).map((w) => ({
        // Identifiers
        iwcID: w.iwcID,
        trsID: w.trsID,

        // Metadata for display
        updated: w.updated,
        collections: w.collections,

        // Minimal definition fields for listing and search
        definition: {
            uuid: w.definition.uuid,
            name: w.definition.name,
            annotation: w.definition.annotation,
            release: w.definition.release,
            tags: w.definition.tags,
        },
    }));
}
