// Define the interface for a workflow collection
export interface WorkflowCollection {
    name: string;
    workflows: Workflow[];
}

// Define a lightweight workflow interface for listing/search (subset of Workflow)
export interface LightweightWorkflow {
    iwcID: string;
    trsID: string;
    updated: string;
    collections: string[];
    definition: {
        uuid: string;
        name: string;
        annotation: string;
        release: string;
        tags: string[] | null;
    };
}

// Define the interface for a single workflow
export interface Workflow {
    name: string;
    subclass: string;
    publish: boolean;
    primaryDescriptorPath: string;
    testParameterFiles: string[];
    tests: any[]; // replace with actual interface from openapi schema
    authors: Author[];
    definition: WorkflowDefinition;
    readme: string;
    changelog: string;
    updated: string;
    diagrams: string;
    trsID: string;
    iwcID: string;
    categories: string[];
    collections: string[];
    doi?: string;
}

// Define the interface for an author
interface Author {
    name: string;
    orcid?: string;
    url?: string;
}

// Define the interface for the workflow definition
interface WorkflowDefinition {
    a_galaxy_workflow: string;
    annotation: string;
    creator: Creator[];
    format_version: string;
    license: string;
    name: string;
    release: string;
    steps: { [key: string]: Step };
    uuid: string;
    tags: string[] | null;
}

// Define the interface for a creator
interface Creator {
    class: string;
    name: string;
    url?: string;
    identifier?: string;
}

// Define the interface for a single step in a workflow
interface Step {
    annotation: string;
    content_id: string | null;
    errors: any | null;
    id: number;
    input_connections: { [key: string]: InputConnection };
    inputs: Input[];
    label: string | null;
    name: string;
    outputs: Output[];
    position: Position;
    tool_id: string | null;
    tool_state: string;
    tool_version: string | null;
    type: string;
    uuid: string;
    workflow_outputs: WorkflowOutput[];
}

interface InputConnection {
    id: number;
    output_name: string;
}

interface Input {
    description: string;
    name: string;
}

interface Output {
    name: string;
    type: string;
}

interface Position {
    left: number;
    top: number;
}

interface WorkflowOutput {
    label: string | null;
    output_name: string;
    uuid: string;
}

// Note: Workflow data is loaded dynamically via fetch in workflowStore.ts
// No static import needed here to avoid build issues with the symlinked JSON file
