"""
Build-time SVG renderer for workflow diagram YAML descriptors.

Reads *-diagram.yaml files and writes corresponding *-diagram.svg files.
"""

import math
from collections import defaultdict
from html import escape
from pathlib import Path

import yaml

# --- Constants ---

COLORS = {
    "input": "#ffd700",   # gold
    "tool": "#25537b",    # navy
    "output": "#10b981",  # green
    "report": "#5bc0de",  # light blue (Galaxy info)
}

TOOL_COLOR = COLORS["tool"]

HEADER_HEIGHT = 28
HEADER_HEIGHT_SMALL = 24
TITLE_BAR_HEIGHT = 45
PADDING = 20
COLUMN_GAP = 50
ROW_GAP = 60
TERMINAL_RADIUS_LARGE = 6
TERMINAL_RADIUS_SMALL = 5
FONT_FAMILY = "system-ui, sans-serif"
LINE_HEIGHT = 14

BASE_WIDTHS = {
    "input": 180,
    "tool": 200,
    "output": 140,
    "report": 80,
}

# Approximate character widths per font-size (px/char)
CHAR_WIDTHS = {
    11: 6.6,   # header label (bold)
    10: 6.0,   # subtitle
    9: 5.4,    # detail
}
TEXT_PADDING = 16  # horizontal padding on each side for centered text

DEFAULT_EDGE_STYLE = "primary"
DEFAULT_LEGEND_ITEMS = ["input", "primary", "qc", "output", "report"]

LEGEND_RECTS = {
    "input": (COLORS["input"], "Input"),
    "output": (COLORS["output"], "Output"),
    "report": (COLORS["report"], "Report"),
}

LEGEND_LINES = {
    "primary": ("4", "", "Data flow"),
    "qc": ("3", ' stroke-dasharray="5 3"', "QC metrics"),
    "secondary": ("3", "", "Secondary"),
}


def estimate_text_width(text, font_size):
    """Estimate rendered pixel width for a string at a given font size."""
    return len(text) * CHAR_WIDTHS.get(font_size, 6.0)


def get_node_dimensions(node):
    """Compute width, height, headerHeight for a node."""
    node_type = node["type"]
    base_width = BASE_WIDTHS.get(node_type, 200)

    label = node.get("label", "")
    subtitle = node.get("subtitle", "")
    detail = node.get("detail", "")

    # label starts further right when a step badge is present
    label_x_offset = 26 if node.get("step") else 10
    label_width = label_x_offset + estimate_text_width(label, 11) + TEXT_PADDING

    width = max(base_width, label_width)
    if subtitle:
        width = max(width, estimate_text_width(subtitle, 10) + 2 * TEXT_PADDING)
    if detail:
        width = max(width, estimate_text_width(detail, 9) + 2 * TEXT_PADDING)

    header_height = HEADER_HEIGHT_SMALL if node_type in ("output", "report") else HEADER_HEIGHT

    text_lines = 0
    if subtitle:
        text_lines += 1
    if detail:
        text_lines += 1

    # tool/input nodes get more body padding to accommodate subtitle+detail text
    base_body = 42 if node_type in ("tool", "input") else 26

    height = header_height + base_body + text_lines * LINE_HEIGHT
    return width, height, header_height


def compute_layout(data):
    """Compute node positions, column/row geometry. Returns list of layout dicts."""
    nodes = data["nodes"]
    if not nodes:
        return []

    nodes_by_row = defaultdict(list)
    nodes_by_col = defaultdict(list)
    for n in nodes:
        nodes_by_row[n["row"]].append(n)
        nodes_by_col[n["column"]].append(n)

    all_rows = sorted(nodes_by_row)
    all_cols = sorted(nodes_by_col)

    row_max_height = {
        row: max(get_node_dimensions(n)[1] for n in row_nodes)
        for row, row_nodes in sorted(nodes_by_row.items())
    }

    row_y = {}
    current_y = TITLE_BAR_HEIGHT + PADDING
    for row in all_rows:
        row_y[row] = current_y
        current_y += row_max_height[row] + ROW_GAP

    col_max_width = {
        col: max(get_node_dimensions(n)[0] for n in col_nodes)
        for col, col_nodes in sorted(nodes_by_col.items())
    }

    col_x = {}
    current_x = PADDING
    for col in all_cols:
        col_x[col] = current_x
        current_x += col_max_width[col] + COLUMN_GAP

    layouts = []
    for node in nodes:
        w, h, hh = get_node_dimensions(node)
        color = COLORS.get(node["type"], TOOL_COLOR)
        col_w = col_max_width[node["column"]]
        x_offset = (col_w - w) / 2
        layouts.append({
            "node": node,
            "x": col_x[node["column"]] + x_offset,
            "y": row_y[node["row"]],
            "width": w,
            "height": h,
            "headerHeight": hh,
            "color": color,
        })

    return layouts


def classify_edge(edge, layout_map):
    """Classify edge routing type."""
    from_layout = layout_map.get(edge["from"])
    to_layout = layout_map.get(edge["to"])
    if not from_layout or not to_layout:
        return "horizontal"

    from_node = from_layout["node"]
    to_node = to_layout["node"]

    if to_node["column"] < from_node["column"]:
        return "wrap-around"
    if to_node["column"] > from_node["column"]:
        return "horizontal"
    if to_node["row"] > from_node["row"]:
        return "downward"
    return "horizontal"


def distribute_terminal(layout, idx, count, side):
    """Compute terminal position for edge at index idx (of count) on a node side."""
    if side in ("bottom", "top"):
        spacing = layout["width"] / (count + 1)
        return {
            "x": layout["x"] + spacing * (idx + 1),
            "y": layout["y"] + layout["height"] if side == "bottom" else layout["y"],
            "side": side,
        }

    # left or right
    body_top = layout["y"] + layout["headerHeight"]
    body_height = layout["height"] - layout["headerHeight"]
    x = layout["x"] + layout["width"] if side == "right" else layout["x"]

    if count == 1:
        return {"x": x, "y": body_top + body_height / 2, "side": side}

    spacing = body_height / (count + 1)
    return {"x": x, "y": body_top + spacing * (idx + 1), "side": side}


def compute_edge_terminals(data, layout_map):
    """Compute from/to terminal points for all edges."""
    edges = data["edges"]

    edge_routes = [(e, classify_edge(e, layout_map)) for e in edges]

    # Group edges by node+side
    right_out = {}
    bottom_out = {}
    left_in = {}
    top_in = {}

    for edge, route_type in edge_routes:
        if route_type in ("downward", "wrap-around"):
            bottom_out.setdefault(edge["from"], []).append(edge)
        else:
            right_out.setdefault(edge["from"], []).append(edge)

        if route_type == "wrap-around":
            top_in.setdefault(edge["to"], []).append(edge)
        else:
            left_in.setdefault(edge["to"], []).append(edge)

    result = []
    for edge, route_type in edge_routes:
        from_layout = layout_map.get(edge["from"])
        to_layout = layout_map.get(edge["to"])
        if not from_layout or not to_layout:
            continue

        if route_type == "wrap-around":
            from_group = bottom_out[edge["from"]]
            to_group = top_in[edge["to"]]
            from_pt = distribute_terminal(from_layout, from_group.index(edge), len(from_group), "bottom")
            to_pt = distribute_terminal(to_layout, to_group.index(edge), len(to_group), "top")
        elif route_type == "downward":
            from_group = bottom_out[edge["from"]]
            to_group = left_in[edge["to"]]
            from_pt = distribute_terminal(from_layout, from_group.index(edge), len(from_group), "bottom")
            to_pt = distribute_terminal(to_layout, to_group.index(edge), len(to_group), "left")
        else:
            from_group = right_out[edge["from"]]
            to_group = left_in[edge["to"]]
            from_pt = distribute_terminal(from_layout, from_group.index(edge), len(from_group), "right")
            to_pt = distribute_terminal(to_layout, to_group.index(edge), len(to_group), "left")

        result.append({
            "edge": edge,
            "from": from_pt,
            "to": to_pt,
            "routeType": route_type,
        })

    return result


def connection_path(et):
    """Generate bezier path string for an edge terminal pair."""
    from_pt = et["from"]
    to_pt = et["to"]
    route_type = et["routeType"]

    if route_type == "wrap-around":
        gap_mid_y = (from_pt["y"] + to_pt["y"]) / 2
        return (
            f'M {from_pt["x"]:.1f} {from_pt["y"]:.1f} '
            f'C {from_pt["x"]:.1f} {gap_mid_y:.1f}, '
            f'{to_pt["x"]:.1f} {gap_mid_y:.1f}, '
            f'{to_pt["x"]:.1f} {to_pt["y"]:.1f}'
        )

    if route_type == "downward":
        return (
            f'M {from_pt["x"]:.1f} {from_pt["y"]:.1f} '
            f'C {from_pt["x"]:.1f} {from_pt["y"] + 30:.1f}, '
            f'{to_pt["x"] - 30:.1f} {to_pt["y"]:.1f}, '
            f'{to_pt["x"]:.1f} {to_pt["y"]:.1f}'
        )

    # Horizontal
    dx = abs(to_pt["x"] - from_pt["x"])
    cp_offset = max(dx * 0.4, 30)
    return (
        f'M {from_pt["x"]:.1f} {from_pt["y"]:.1f} '
        f'C {from_pt["x"] + cp_offset:.1f} {from_pt["y"]:.1f}, '
        f'{to_pt["x"] - cp_offset:.1f} {to_pt["y"]:.1f}, '
        f'{to_pt["x"]:.1f} {to_pt["y"]:.1f}'
    )


def connection_style_attrs(style):
    """SVG stroke attributes for an edge style."""
    if style == "qc":
        return f'stroke="{TOOL_COLOR}" fill="none" stroke-linecap="round" stroke-width="3" stroke-dasharray="5 3"'
    if style == "secondary":
        return f'stroke="{TOOL_COLOR}" fill="none" stroke-linecap="round" stroke-width="3"'
    return f'stroke="{TOOL_COLOR}" fill="none" stroke-linecap="round" stroke-width="4"'


def dual_paths(et):
    """Compute offset path pair for dual-style edges."""
    from_pt = et["from"]
    to_pt = et["to"]
    offset = 3

    dx = to_pt["x"] - from_pt["x"]
    dy = to_pt["y"] - from_pt["y"]
    length = math.sqrt(dx * dx + dy * dy) or 1
    nx = -dy / length
    ny = dx / length

    et1 = {
        **et,
        "from": {"x": from_pt["x"] + nx * offset, "y": from_pt["y"] + ny * offset, "side": from_pt["side"]},
        "to": {"x": to_pt["x"] + nx * offset, "y": to_pt["y"] + ny * offset, "side": to_pt["side"]},
    }
    et2 = {
        **et,
        "from": {"x": from_pt["x"] - nx * offset, "y": from_pt["y"] - ny * offset, "side": from_pt["side"]},
        "to": {"x": to_pt["x"] - nx * offset, "y": to_pt["y"] - ny * offset, "side": to_pt["side"]},
    }

    return connection_path(et1), connection_path(et2)


def compute_viewbox(layouts):
    """Compute SVG viewBox width and height."""
    if not layouts:
        return 400, 200

    max_x = max(lay["x"] + lay["width"] for lay in layouts)
    max_y = max(lay["y"] + lay["height"] for lay in layouts)

    legend_height = 30
    return int(max_x + PADDING), int(max_y + PADDING + legend_height)


def header_text_color(node_type):
    return "#2C3143" if node_type == "input" else "white"


def step_badge_color(node_type):
    return "rgba(44,49,67,0.6)" if node_type == "input" else "rgba(255,255,255,0.7)"


def node_stroke_width(node_type):
    return "1.5" if node_type in ("input", "output", "report") else "1"


def terminal_radius(node_type):
    return TERMINAL_RADIUS_SMALL if node_type in ("output", "report") else TERMINAL_RADIUS_LARGE


def collect_node_terminals(node_id, edge_terminals):
    """Collect unique terminal points for a node."""
    points = []
    for et in edge_terminals:
        if et["edge"]["from"] == node_id:
            points.append(et["from"])
        if et["edge"]["to"] == node_id:
            points.append(et["to"])

    seen = set()
    unique = []
    for p in points:
        key = f'{p["x"]:.1f},{p["y"]:.1f}'
        if key not in seen:
            seen.add(key)
            unique.append(p)
    return unique


def render_svg(data):
    """Render a diagram descriptor to an SVG string."""
    if "nodes" not in data or "edges" not in data:
        raise ValueError("Diagram descriptor must contain 'nodes' and 'edges' keys")
    for i, node in enumerate(data["nodes"]):
        for field in ("id", "type", "column", "row"):
            if field not in node:
                raise ValueError(f"Node {i} missing required field '{field}'")

    layouts = compute_layout(data)
    layout_map = {lay["node"]["id"]: lay for lay in layouts}
    edge_terms = compute_edge_terminals(data, layout_map)
    svg_width, svg_height = compute_viewbox(layouts)

    title = escape(data.get("title", "Workflow Diagram"))
    subtitle = data.get("subtitle")

    legend_items = (data.get("legend") or {}).get("items", DEFAULT_LEGEND_ITEMS)
    legend_y = svg_height - 15

    lines = []
    lines.append(
        f'<svg viewBox="0 0 {svg_width} {svg_height}" '
        f'aria-label="{title}" role="img" '
        f'xmlns="http://www.w3.org/2000/svg">'
    )
    lines.append(f"  <title>{title}</title>")

    # Defs
    lines.append("  <defs>")
    lines.append('    <pattern id="wd-grid" width="20" height="20" patternUnits="userSpaceOnUse">')
    lines.append('      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#c5d5e4" stroke-width="0.5"/>')
    lines.append("    </pattern>")
    lines.append('    <pattern id="wd-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">')
    lines.append('      <rect width="100" height="100" fill="url(#wd-grid)"/>')
    lines.append('      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#b0c4d8" stroke-width="1"/>')
    lines.append("    </pattern>")
    lines.append('    <filter id="wd-shadow" x="-5%" y="-5%" width="115%" height="115%">')
    lines.append('      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity="0.15"/>')
    lines.append("    </filter>")
    lines.append("  </defs>")

    # Background
    lines.append(f'  <rect width="{svg_width}" height="{svg_height}" fill="#f8f9fa"/>')
    lines.append(f'  <rect width="{svg_width}" height="{svg_height}" fill="url(#wd-grid-major)"/>')

    # Title bar
    lines.append(f'  <rect x="0" y="0" width="{svg_width}" height="{TITLE_BAR_HEIGHT}" fill="{TOOL_COLOR}"/>')
    lines.append(
        f'  <text x="20" y="28" font-family="{FONT_FAMILY}" font-size="16" '
        f'font-weight="600" fill="white">{title}</text>'
    )
    if subtitle:
        lines.append(
            f'  <text x="20" y="40" font-family="{FONT_FAMILY}" font-size="10" '
            f'fill="rgba(255,255,255,0.7)">{escape(subtitle)}</text>'
        )

    # Connections (behind nodes)
    for et in edge_terms:
        style = et["edge"].get("style", DEFAULT_EDGE_STYLE)
        if style == "dual":
            p1, p2 = dual_paths(et)
            lines.append(f'  <path d="{p1}" {connection_style_attrs("primary")}/>')
            lines.append(f'  <path d="{p2}" {connection_style_attrs("secondary")}/>')
        else:
            path = connection_path(et)
            lines.append(f'  <path d="{path}" {connection_style_attrs(style)}/>')

    # Nodes
    for layout in layouts:
        node = layout["node"]
        x = layout["x"]
        y = layout["y"]
        w = layout["width"]
        h = layout["height"]
        hh = layout["headerHeight"]
        color = layout["color"]
        ntype = node["type"]

        lines.append(f'  <g filter="url(#wd-shadow)" transform="translate({x:.1f}, {y:.1f})">')

        # Card body
        lines.append(
            f'    <rect width="{w:.1f}" height="{h:.1f}" rx="4" '
            f'fill="white" stroke="{color}" stroke-width="{node_stroke_width(ntype)}"/>'
        )
        # Header bar
        lines.append(f'    <rect width="{w:.1f}" height="{hh}" rx="4" fill="{color}"/>')
        # Fill gap between header rounded corners and body
        lines.append(f'    <rect x="0" y="{hh - 4}" width="{w:.1f}" height="4" fill="{color}"/>')

        # Step badge + label
        step = node.get("step")
        label = escape(node.get("label", ""))
        label_x = 10
        if step:
            lines.append(
                f'    <text x="10" y="{hh - 9}" font-family="{FONT_FAMILY}" '
                f'font-size="11" fill="{step_badge_color(ntype)}">{escape(str(step))}:</text>'
            )
            label_x = 26
        lines.append(
            f'    <text x="{label_x}" y="{hh - 9}" font-family="{FONT_FAMILY}" '
            f'font-size="11" font-weight="600" fill="{header_text_color(ntype)}">{label}</text>'
        )

        # Subtitle
        sub = node.get("subtitle")
        if sub:
            lines.append(
                f'    <text x="{w / 2:.1f}" y="{hh + 24}" text-anchor="middle" '
                f'font-family="{FONT_FAMILY}" font-size="10" fill="#495057">{escape(sub)}</text>'
            )

        # Detail
        detail = node.get("detail")
        if detail:
            detail_y = hh + 24 + (LINE_HEIGHT if sub else 0)
            lines.append(
                f'    <text x="{w / 2:.1f}" y="{detail_y}" text-anchor="middle" '
                f'font-family="{FONT_FAMILY}" font-size="9" fill="#868e96">{escape(detail)}</text>'
            )

        # Terminal circles
        terminals = collect_node_terminals(node["id"], edge_terms)
        r = terminal_radius(ntype)
        for tp in terminals:
            cx = tp["x"] - x
            cy = tp["y"] - y
            lines.append(
                f'    <circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" '
                f'fill="white" stroke="{color}" stroke-width="2"/>'
            )

        lines.append("  </g>")

    # Legend
    lines.append(f'  <g transform="translate({PADDING}, {legend_y})">')
    lines.append(
        f'    <text x="0" y="0" font-family="{FONT_FAMILY}" font-size="10" '
        f'font-weight="600" fill="#495057">Legend:</text>'
    )

    for idx, item in enumerate(legend_items):
        ox = 60 + idx * 120

        if item in LEGEND_RECTS:
            color, label = LEGEND_RECTS[item]
            lines.append(
                f'    <rect x="{ox}" y="-10" width="14" height="14" rx="2" '
                f'fill="white" stroke="{color}" stroke-width="1.5"/>'
            )
            lines.append(
                f'    <text x="{ox + 20}" y="0" font-family="{FONT_FAMILY}" '
                f'font-size="9" fill="#6c757d">{label}</text>'
            )
        elif item in LEGEND_LINES:
            width, extra, label = LEGEND_LINES[item]
            lines.append(
                f'    <line x1="{ox}" y1="-4" x2="{ox + 40}" y2="-4" '
                f'stroke="{TOOL_COLOR}" stroke-width="{width}" stroke-linecap="round"{extra}/>'
            )
            lines.append(
                f'    <text x="{ox + 48}" y="0" font-family="{FONT_FAMILY}" '
                f'font-size="9" fill="#6c757d">{label}</text>'
            )

    lines.append("  </g>")
    lines.append("</svg>")

    return "\n".join(lines)


def render_all_diagram_svgs(workflows_dir):
    """Walk workflows_dir for *-diagram.yaml files and write corresponding SVGs."""
    count = 0
    for yaml_path in Path(workflows_dir).rglob("*-diagram.yaml"):
        svg_path = yaml_path.with_name(yaml_path.name.replace("-diagram.yaml", "-diagram.svg"))

        with open(yaml_path) as f:
            data = yaml.safe_load(f)

        svg_content = render_svg(data)
        with open(svg_path, "w") as f:
            f.write(svg_content)

        count += 1
        print(f"Rendered {svg_path}")

    print(f"Rendered {count} diagram SVG(s)")
    return count


if __name__ == "__main__":
    import sys

    directory = sys.argv[1] if len(sys.argv) > 1 else "./workflows"
    render_all_diagram_svgs(directory)
