#!/usr/bin/env python3
"""Center inputs, outputs, and reports around the tool grid for every
diagram descriptor YAML.

Inputs   → column 0, vertically centered on the tool grid's row midpoint
Outputs  → rightmost column (max tool col + 1), vertically centered
Reports  → bottom row (max tool row + 1), horizontally centered

Items within each group are sorted by connectivity (average row of
connected tools) to minimise edge crossings. Idempotent — a second run
is a no-op.
"""

import sys
from pathlib import Path

import yaml


def load_diagram(path):
    with open(path) as f:
        return yaml.safe_load(f)


def classify_nodes(nodes, edges):
    """Return (all_inputs, terminal_outputs, terminal_reports).

    all_inputs       — every node with type=input
    terminal_output  — type=output with no outgoing edges to tool nodes
                       (edges to reports are OK and don't disqualify)
    terminal_report  — type=report with no outgoing edges at all
    """
    node_type = {n["id"]: n["type"] for n in nodes}
    outgoing = {n["id"]: set() for n in nodes}
    for e in edges:
        outgoing[e["from"]].add(e["to"])

    all_inputs = []
    terminal_outputs = []
    terminal_reports = []

    for n in nodes:
        nid = n["id"]
        if n["type"] == "input":
            all_inputs.append(n)
        elif n["type"] == "output":
            feeds_tool = any(node_type.get(t) == "tool" for t in outgoing[nid])
            if not feeds_tool:
                terminal_outputs.append(n)
        elif n["type"] == "report":
            if not outgoing[nid]:
                terminal_reports.append(n)

    return all_inputs, terminal_outputs, terminal_reports


def compute_nudges(data):
    """Return list of (node_id, old_col, old_row, new_col, new_row, label)."""
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])
    if not nodes:
        return []

    all_inputs, terminal_outputs, terminal_reports = classify_nodes(nodes, edges)

    tool_nodes = [n for n in nodes if n["type"] == "tool"]
    if not tool_nodes:
        return []

    changes = []

    # --- Tool grid metrics (immutable backbone) ---
    tool_rows = [n["row"] for n in tool_nodes]
    tool_cols = [n["column"] for n in tool_nodes]
    min_tool_row, max_tool_row = min(tool_rows), max(tool_rows)
    min_tool_col, max_tool_col = min(tool_cols), max(tool_cols)
    tool_row_center = (min_tool_row + max_tool_row) / 2
    tool_col_center = (min_tool_col + max_tool_col) / 2
    output_col = max_tool_col + 1
    report_row = max_tool_row + 1

    # --- Connectivity maps ---
    node_by_id = {n["id"]: n for n in nodes}
    outgoing = {n["id"]: set() for n in nodes}
    incoming = {n["id"]: set() for n in nodes}
    for e in edges:
        outgoing[e["from"]].add(e["to"])
        incoming[e["to"]].add(e["from"])

    def avg_tool_row(node_id, direction):
        """Average row of directly connected tool nodes."""
        neighbors = outgoing[node_id] if direction == "downstream" else incoming[node_id]
        rows = [node_by_id[nid]["row"] for nid in neighbors
                if node_by_id[nid]["type"] == "tool"]
        return sum(rows) / len(rows) if rows else 0

    # --- Inputs → column 0, vertically centered ---
    all_inputs.sort(key=lambda n: avg_tool_row(n["id"], "downstream"))
    tool_rows_at_col0 = {n["row"] for n in tool_nodes if n["column"] == 0}

    if all_inputs:
        start = round(tool_row_center - (len(all_inputs) - 1) / 2)
        start = max(0, start)
        row = start
        for n in all_inputs:
            while row in tool_rows_at_col0:
                row += 1
            old_col, old_row = n["column"], n["row"]
            if old_col != 0 or old_row != row:
                changes.append((n["id"], old_col, old_row, 0, row, n.get("label", n["id"])))
                n["column"], n["row"] = 0, row
            row += 1

    # --- Terminal outputs → output_col, vertically centered ---
    terminal_outputs.sort(key=lambda n: avg_tool_row(n["id"], "upstream"))

    if terminal_outputs:
        start = round(tool_row_center - (len(terminal_outputs) - 1) / 2)
        start = max(0, start)
        row = start
        for n in terminal_outputs:
            old_col, old_row = n["column"], n["row"]
            if old_col != output_col or old_row != row:
                changes.append((n["id"], old_col, old_row, output_col, row, n.get("label", n["id"])))
                n["column"], n["row"] = output_col, row
            row += 1

    # --- Terminal reports → report_row, centered under tool span ---
    terminal_reports.sort(key=lambda n: (n["column"], n["row"]))

    if terminal_reports:
        move_ids = {n["id"] for n in terminal_reports}
        start_col = round(tool_col_center - (len(terminal_reports) - 1) / 2)
        start_col = max(0, start_col)
        occupied_cols = {n["column"] for n in nodes
                         if n["row"] == report_row and n["id"] not in move_ids}

        col = start_col
        for n in terminal_reports:
            while col in occupied_cols:
                col += 1
            old_col, old_row = n["column"], n["row"]
            if old_col != col or old_row != report_row:
                changes.append((n["id"], old_col, old_row, col, report_row, n.get("label", n["id"])))
                n["column"], n["row"] = col, report_row
            occupied_cols.add(col)
            col += 1

    return changes


def apply_changes_to_text(text, changes):
    """Replace column/row values in-place, preserving all other formatting."""
    lines = text.split("\n")

    for node_id, _, _, new_col, new_row, _ in changes:
        node_start = None
        for i, line in enumerate(lines):
            if line.strip() == f"- id: {node_id}":
                node_start = i
                break

        if node_start is None:
            raise ValueError(f"Could not find node '{node_id}' in YAML")

        col_found = row_found = False
        for i in range(node_start + 1, len(lines)):
            stripped = lines[i].strip()
            if stripped.startswith("- ") or stripped in ("", "edges:", "legend:"):
                break
            if stripped.startswith("column:"):
                indent = lines[i][: len(lines[i]) - len(lines[i].lstrip())]
                lines[i] = f"{indent}column: {new_col}"
                col_found = True
            elif stripped.startswith("row:"):
                indent = lines[i][: len(lines[i]) - len(lines[i].lstrip())]
                lines[i] = f"{indent}row: {new_row}"
                row_found = True

        if not col_found or not row_found:
            raise ValueError(f"Could not find column/row for node '{node_id}'")

    return "\n".join(lines)


def main():
    workflows_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("./workflows")
    yaml_files = sorted(workflows_dir.rglob("*-diagram.yaml"))

    total_changed = 0
    total_moves = 0

    for path in yaml_files:
        text = path.read_text()
        data = load_diagram(path)
        changes = compute_nudges(data)

        if changes:
            new_text = apply_changes_to_text(text, changes)
            path.write_text(new_text)
            total_changed += 1
            total_moves += len(changes)

            print(f"\n{path.relative_to(workflows_dir)}:")
            for _, old_col, old_row, new_col, new_row, label in changes:
                parts = []
                if old_col != new_col:
                    parts.append(f"col {old_col}\u2192{new_col}")
                if old_row != new_row:
                    parts.append(f"row {old_row}\u2192{new_row}")
                kind = "input" if new_col == 0 and old_col != 0 else ""
                print(f"  {label}: {', '.join(parts)}")

    print(f"\n{total_changed} files changed, {total_moves} nodes moved ({len(yaml_files)} files scanned)")


if __name__ == "__main__":
    main()
