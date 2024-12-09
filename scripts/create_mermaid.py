import argparse
import json
import os
from typing import Literal

STEP_TYPE_TO_SHAPE = {
    "data_input": "@{ shape: doc }",
    "data_collection_input": "@{ shape: docs }",
    "parameter_input": "@{ shape: lean-l }",
    "tool": "@{ shape: process }",
    "subworkflow": "@{ shape: subprocess }",
}


def step_to_mermaid_item(
    step_type: Literal[
        "parameter_input", "data_input", "data_collection_input", "tool", "subworkflow"
    ],
    step_label: str,
):
    step_label_anchor = f'["{step_label}"]'
    shape = STEP_TYPE_TO_SHAPE.get(step_type, "")
    return f"{step_label_anchor}{shape}"


def workflow_to_mermaid_diagrams(workflow, workflows = None):
    """
    Converts a Galaxy workflow JSON to a Mermaid flowchart diagram.

    Args:
        workflow_json: The JSON representation of the Galaxy workflow.

    Returns:
        A string representing the Mermaid flowchart diagram.
    """
    if workflows is None:
        workflows = {}

    mermaid_diagram = ["graph LR"]

    # Create a mapping of step IDs to their labels
    id_step_labels = {
        step["id"]: step["label"] or step["name"] or step["content_id"] or step["id"]
        for step in workflow["steps"].values()
    }

    # Iterate through each step and its connections
    for step_id, step in workflow["steps"].items():
        step_label = id_step_labels.get(int(step_id))
        mermaid_diagram.append(
            f'{step_id}{step_to_mermaid_item(step["type"], step_label)}'
        )
        for input_connection in step.get("input_connections", {}).values():
            if not isinstance(input_connection, list):
                input_connection = [input_connection]
                for ic in input_connection:
                    mermaid_diagram.append(f"{ic['id']} --> {step_id}")
        
        if step["type"] == "subworkflow":
            workflow_to_mermaid_diagrams(step["subworkflow"], workflows=workflows)

    workflows[workflow["name"]] = "\n".join(mermaid_diagram)

    return workflows


def walk_directory(directory):
    """
    Walk directory and call workflow_to_mermaid on each discovered .ga file.
    """
    for root, _, paths in os.walk(directory):
        for path in paths:
            if path.endswith(".ga"):
                file_path = os.path.join(root, path)
                with open(file_path, "r") as f:
                    workflow_data = json.load(f)
                    mermaid_diagrams = workflow_to_mermaid_diagrams(workflow_data)

                markdown_items = ["# Workflow diagrams\n"]
                for workflow_name, diagram in reversed(mermaid_diagrams.items()):
                    markdown_items.append(f"## {workflow_name}\n")
                    markdown_items.append(f"```mermaid\n{diagram}\n```\n")

                mmd_path = f"{os.path.splitext(file_path)[0]}_diagrams.md"
                with open(mmd_path, "w") as f:
                    f.write("\n".join(markdown_items))


def parse_args():
    parser = argparse.ArgumentParser(description="Process files in a directory")
    parser.add_argument("directory", type=str, help="Path to the input directory")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    walk_directory(args.directory)
