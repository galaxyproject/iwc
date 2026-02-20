#!/usr/bin/env python3
"""One-off fixup: nudge terminal outputs to the rightmost column, terminal
reports to the bottom row, and orphan inputs back to column 0 so every
diagram follows the inputs-left / outputs-right / reports-bottom convention.

Safe to run repeatedly — nodes already at or past the target position are
skipped, so a second run is a no-op.
"""

import sys
from pathlib import Path

import yaml


def load_diagram(path):
    with open(path) as f:
        return yaml.safe_load(f)


def classify_nodes(nodes, edges):
    """Return (terminal_outputs, terminal_reports, orphan_inputs).

    terminal_output  — type=output with no outgoing edges to tool nodes
                       (edges to reports are OK and don't disqualify)
    terminal_report  — type=report with no outgoing edges at all
    orphan_input     — type=input whose column > min input column
    """
    node_type = {n["id"]: n["type"] for n in nodes}
    outgoing = {n["id"]: set() for n in nodes}
    for e in edges:
        outgoing[e["from"]].add(e["to"])

    terminal_outputs = []
    terminal_reports = []

    for n in nodes:
        nid = n["id"]
        if n["type"] == "output":
            feeds_tool = any(node_type.get(t) == "tool" for t in outgoing[nid])
            if not feeds_tool:
                terminal_outputs.append(n)
        elif n["type"] == "report":
            if not outgoing[nid]:
                terminal_reports.append(n)

    input_nodes = [n for n in nodes if n["type"] == "input"]
    if input_nodes:
        min_col = min(n["column"] for n in input_nodes)
        orphan_inputs = [n for n in input_nodes if n["column"] > min_col]
    else:
        orphan_inputs = []

    return terminal_outputs, terminal_reports, orphan_inputs


def compute_nudges(data):
    """Return list of (node_id, old_col, old_row, new_col, new_row, label)."""
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])
    if not nodes:
        return []

    terminal_outputs, terminal_reports, orphan_inputs = classify_nodes(nodes, edges)
    changes = []

    # --- Orphan inputs → column 0 ---
    for n in orphan_inputs:
        old_col, old_row = n["column"], n["row"]
        new_col, new_row = 0, old_row
        occupied = {o["row"] for o in nodes if o["id"] != n["id"] and o["column"] == 0}
        while new_row in occupied:
            new_row += 1
        if old_col != new_col or old_row != new_row:
            changes.append((n["id"], old_col, old_row, new_col, new_row, n.get("label", n["id"])))
            n["column"], n["row"] = new_col, new_row

    # --- Pre-compute layout targets ---
    tool_input_cols = [n["column"] for n in nodes if n["type"] in ("tool", "input")]
    output_col = max(tool_input_cols) + 1 if tool_input_cols else 1

    tool_rows = [n["row"] for n in nodes if n["type"] == "tool"]
    report_row = max(tool_rows) + 1 if tool_rows else 1

    # Reports that will be moved — exclude them from output collision check
    report_ids_moving = {n["id"] for n in terminal_reports if n["row"] < report_row}

    # --- Terminal outputs → output_col, rows packed from 0 ---
    terminal_outputs.sort(key=lambda n: (n["row"], n["column"]))
    occupied_rows = {n["row"] for n in nodes
                     if n["column"] == output_col and n["id"] not in report_ids_moving}

    next_row = 0
    for n in terminal_outputs:
        if n["column"] >= output_col:
            continue
        old_col, old_row = n["column"], n["row"]
        while next_row in occupied_rows:
            next_row += 1
        occupied_rows.add(next_row)
        if old_col != output_col or old_row != next_row:
            changes.append((n["id"], old_col, old_row, output_col, next_row, n.get("label", n["id"])))
            n["column"], n["row"] = output_col, next_row
        next_row += 1

    # --- Terminal reports → report_row, centered under tool span ---
    tool_cols = sorted(set(n["column"] for n in nodes if n["type"] == "tool"))
    center = (tool_cols[0] + tool_cols[-1]) / 2 if tool_cols else 1

    reports_to_move = [n for n in terminal_reports if n["row"] < report_row]
    reports_to_move.sort(key=lambda n: (n["column"], n["row"]))

    if reports_to_move:
        move_ids = {n["id"] for n in reports_to_move}
        start_col = round(center - (len(reports_to_move) - 1) / 2)
        start_col = max(0, start_col)
        occupied_cols = {n["column"] for n in nodes
                         if n["row"] == report_row and n["id"] not in move_ids}

        next_col = start_col
        for n in reports_to_move:
            while next_col in occupied_cols:
                next_col += 1
            old_col, old_row = n["column"], n["row"]
            if old_col != next_col or old_row != report_row:
                changes.append((n["id"], old_col, old_row, next_col, report_row, n.get("label", n["id"])))
                n["column"], n["row"] = next_col, report_row
            occupied_cols.add(next_col)
            next_col += 1

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
