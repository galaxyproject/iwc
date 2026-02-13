<script setup lang="ts">
import { computed } from "vue";
import type { DiagramData, DiagramNode, DiagramEdge } from "../models/workflow";

const props = defineProps<{
    data: DiagramData;
}>();

// --- Constants ---
const COLORS: Record<string, string> = {
    input: "#ffd700",
    tool: "#25537b",
    output: "#f97316",
    report: "#10b981",
};

const HEADER_HEIGHT = 28;
const HEADER_HEIGHT_SMALL = 24;
const TITLE_BAR_HEIGHT = 45;
const PADDING = 20;
const COLUMN_GAP = 50;
const ROW_GAP = 60;
const TERMINAL_RADIUS_LARGE = 6;
const TERMINAL_RADIUS_SMALL = 5;
const FONT_FAMILY = "system-ui, sans-serif";
const LINE_HEIGHT = 14;

// --- Node sizing ---
interface NodeLayout {
    node: DiagramNode;
    x: number;
    y: number;
    width: number;
    height: number;
    headerHeight: number;
    color: string;
}

function getNodeDimensions(node: DiagramNode): { width: number; height: number; headerHeight: number } {
    const baseWidths: Record<string, number> = {
        input: 180,
        tool: 200,
        output: 140,
        report: 80,
    };

    let width = baseWidths[node.type] ?? 200;

    if (node.type === "report" && node.label.length > 8) {
        width = Math.max(80, node.label.length * 7 + 20);
    }
    if (node.type === "output" && node.label.length > 12) {
        width = Math.max(140, node.label.length * 8 + 20);
    }

    const headerHeight = node.type === "output" || node.type === "report" ? HEADER_HEIGHT_SMALL : HEADER_HEIGHT;

    let textLines = 0;
    if (node.subtitle) textLines++;
    if (node.detail) textLines++;

    if (node.type === "tool" || node.type === "input") {
        const baseBody = 42;
        return { width, height: headerHeight + baseBody + textLines * LINE_HEIGHT, headerHeight };
    }
    const baseBody = 26;
    return { width, height: headerHeight + baseBody + textLines * LINE_HEIGHT, headerHeight };
}

// --- Layout computation with global row alignment ---
interface TerminalPoint {
    x: number;
    y: number;
    side: "left" | "right" | "top" | "bottom";
}

const nodeLayouts = computed<NodeLayout[]>(() => {
    const nodes = props.data.nodes;
    if (!nodes.length) return [];

    // Collect all unique rows and columns
    const allRows = new Set<number>();
    const allCols = new Set<number>();
    for (const node of nodes) {
        allRows.add(node.row);
        allCols.add(node.column);
    }
    const sortedRows = [...allRows].sort((a, b) => a - b);
    const sortedCols = [...allCols].sort((a, b) => a - b);

    // Compute global row heights (max node height in each row across all columns)
    const rowMaxHeight = new Map<number, number>();
    for (const row of sortedRows) {
        let maxH = 0;
        for (const node of nodes) {
            if (node.row === row) {
                maxH = Math.max(maxH, getNodeDimensions(node).height);
            }
        }
        rowMaxHeight.set(row, maxH);
    }

    // Compute global row Y positions
    const rowY = new Map<number, number>();
    let currentY = TITLE_BAR_HEIGHT + PADDING;
    for (const row of sortedRows) {
        rowY.set(row, currentY);
        currentY += rowMaxHeight.get(row)! + ROW_GAP;
    }

    // Compute column widths and X positions
    const colMaxWidth = new Map<number, number>();
    for (const col of sortedCols) {
        let maxW = 0;
        for (const node of nodes) {
            if (node.column === col) {
                maxW = Math.max(maxW, getNodeDimensions(node).width);
            }
        }
        colMaxWidth.set(col, maxW);
    }

    const colX = new Map<number, number>();
    let currentX = PADDING;
    for (const col of sortedCols) {
        colX.set(col, currentX);
        currentX += colMaxWidth.get(col)! + COLUMN_GAP;
    }

    // Place nodes
    const layouts: NodeLayout[] = [];
    for (const node of nodes) {
        const dims = getNodeDimensions(node);
        const color = COLORS[node.type] ?? COLORS.tool;
        // Center node within its column width
        const colW = colMaxWidth.get(node.column)!;
        const xOffset = (colW - dims.width) / 2;
        layouts.push({
            node,
            x: colX.get(node.column)! + xOffset,
            y: rowY.get(node.row)!,
            width: dims.width,
            height: dims.height,
            headerHeight: dims.headerHeight,
            color,
        });
    }

    return layouts;
});

const layoutMap = computed(() => {
    const map = new Map<string, NodeLayout>();
    for (const layout of nodeLayouts.value) {
        map.set(layout.node.id, layout);
    }
    return map;
});

// --- Edge routing ---
// Classify each edge by its routing type
type RouteType = "horizontal" | "downward" | "wrap-around";

function classifyEdge(edge: DiagramEdge, map: Map<string, NodeLayout>): RouteType {
    const fromLayout = map.get(edge.from);
    const toLayout = map.get(edge.to);
    if (!fromLayout || !toLayout) return "horizontal";

    const fromNode = fromLayout.node;
    const toNode = toLayout.node;

    // If target is to the right (same or later column), horizontal
    if (toNode.column > fromNode.column && toNode.row === fromNode.row) {
        return "horizontal";
    }
    // If target is in a later column but different row, still horizontal if close
    if (toNode.column > fromNode.column) {
        return "horizontal";
    }
    // If target is directly below (same column)
    if (toNode.column === fromNode.column && toNode.row > fromNode.row) {
        return "downward";
    }
    // If target is to the left and below (wrap-around)
    if (toNode.column < fromNode.column && toNode.row >= fromNode.row) {
        return "wrap-around";
    }
    // If target is below in any column
    if (toNode.row > fromNode.row) {
        return "downward";
    }
    return "horizontal";
}

interface EdgeTerminals {
    edge: DiagramEdge;
    from: TerminalPoint;
    to: TerminalPoint;
    routeType: RouteType;
}

const edgeTerminals = computed<EdgeTerminals[]>(() => {
    const edges = props.data.edges;
    const map = layoutMap.value;

    // First pass: classify edges and group by node+side
    const edgeRoutes = edges.map((edge) => ({
        edge,
        routeType: classifyEdge(edge, map),
    }));

    // Count outgoing edges per side per node
    const rightOut = new Map<string, DiagramEdge[]>();
    const bottomOut = new Map<string, DiagramEdge[]>();
    const leftIn = new Map<string, DiagramEdge[]>();
    const topIn = new Map<string, DiagramEdge[]>();

    for (const { edge, routeType } of edgeRoutes) {
        if (routeType === "downward" || routeType === "wrap-around") {
            if (!bottomOut.has(edge.from)) bottomOut.set(edge.from, []);
            bottomOut.get(edge.from)!.push(edge);
        } else {
            if (!rightOut.has(edge.from)) rightOut.set(edge.from, []);
            rightOut.get(edge.from)!.push(edge);
        }
        // Wrap-around edges enter from the top; others from the left
        if (routeType === "wrap-around") {
            if (!topIn.has(edge.to)) topIn.set(edge.to, []);
            topIn.get(edge.to)!.push(edge);
        } else {
            if (!leftIn.has(edge.to)) leftIn.set(edge.to, []);
            leftIn.get(edge.to)!.push(edge);
        }
    }

    function distributeTerminals(
        layout: NodeLayout,
        edgeList: DiagramEdge[],
        edge: DiagramEdge,
        side: "left" | "right" | "bottom" | "top",
    ): TerminalPoint {
        const idx = edgeList.indexOf(edge);
        const count = edgeList.length;

        if (side === "bottom" || side === "top") {
            const spacing = layout.width / (count + 1);
            return {
                x: layout.x + spacing * (idx + 1),
                y: side === "bottom" ? layout.y + layout.height : layout.y,
                side,
            };
        }

        // left or right side: distribute along the body
        const bodyTop = layout.y + layout.headerHeight;
        const bodyHeight = layout.height - layout.headerHeight;
        const x = side === "right" ? layout.x + layout.width : layout.x;

        if (count === 1) {
            return { x, y: bodyTop + bodyHeight / 2, side };
        }
        const spacing = bodyHeight / (count + 1);
        return { x, y: bodyTop + spacing * (idx + 1), side };
    }

    const result: EdgeTerminals[] = [];

    for (const { edge, routeType } of edgeRoutes) {
        const fromLayout = map.get(edge.from);
        const toLayout = map.get(edge.to);
        if (!fromLayout || !toLayout) continue;

        let from: TerminalPoint;
        let to: TerminalPoint;

        if (routeType === "wrap-around") {
            from = distributeTerminals(fromLayout, bottomOut.get(edge.from)!, edge, "bottom");
            to = distributeTerminals(toLayout, topIn.get(edge.to)!, edge, "top");
        } else if (routeType === "downward") {
            from = distributeTerminals(fromLayout, bottomOut.get(edge.from)!, edge, "bottom");
            to = distributeTerminals(toLayout, leftIn.get(edge.to)!, edge, "left");
        } else {
            from = distributeTerminals(fromLayout, rightOut.get(edge.from)!, edge, "right");
            to = distributeTerminals(toLayout, leftIn.get(edge.to)!, edge, "left");
        }

        result.push({ edge, from, to, routeType });
    }

    return result;
});

// --- SVG viewBox ---
const viewBox = computed(() => {
    const layouts = nodeLayouts.value;
    if (!layouts.length) return "0 0 400 200";

    let maxX = 0;
    let maxY = 0;
    for (const layout of layouts) {
        maxX = Math.max(maxX, layout.x + layout.width);
        maxY = Math.max(maxY, layout.y + layout.height);
    }

    const legendHeight = 30;
    const width = maxX + PADDING;
    const height = maxY + PADDING + legendHeight;
    return `0 0 ${width} ${height}`;
});

const svgWidth = computed(() => parseInt(viewBox.value.split(" ")[2]));
const svgHeight = computed(() => parseInt(viewBox.value.split(" ")[3]));

// --- Connection path generation ---
function connectionPath(et: EdgeTerminals): string {
    const { from, to, routeType } = et;
    const dx = Math.abs(to.x - from.x);

    if (routeType === "wrap-around") {
        // Exit vertically downward from bottom, sweep left through the row gap, arrive at top of target
        const gapMidY = (from.y + to.y) / 2;
        return `M ${from.x} ${from.y} C ${from.x} ${gapMidY}, ${to.x} ${gapMidY}, ${to.x} ${to.y}`;
    }

    if (routeType === "downward") {
        // From bottom of source to left of target — S-curve
        return `M ${from.x} ${from.y} C ${from.x} ${from.y + 30}, ${to.x - 30} ${to.y}, ${to.x} ${to.y}`;
    }

    // Horizontal: right → left bezier
    const cpOffset = Math.max(dx * 0.4, 30);
    return `M ${from.x} ${from.y} C ${from.x + cpOffset} ${from.y}, ${to.x - cpOffset} ${to.y}, ${to.x} ${to.y}`;
}

function connectionStyleAttrs(style?: string): Record<string, string | number> {
    const base: Record<string, string | number> = {
        stroke: "#25537b",
        fill: "none",
        "stroke-linecap": "round",
    };
    if (style === "qc") return { ...base, "stroke-width": 3, "stroke-dasharray": "5 3" };
    if (style === "secondary") return { ...base, "stroke-width": 3 };
    return { ...base, "stroke-width": 4 };
}

// For dual edges, render two parallel offset paths
function dualPaths(et: EdgeTerminals): [string, string] {
    const { from, to } = et;
    const offset = 3;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    const et1: EdgeTerminals = {
        ...et,
        from: { x: from.x + nx * offset, y: from.y + ny * offset, side: from.side },
        to: { x: to.x + nx * offset, y: to.y + ny * offset, side: to.side },
    };
    const et2: EdgeTerminals = {
        ...et,
        from: { x: from.x - nx * offset, y: from.y - ny * offset, side: from.side },
        to: { x: to.x - nx * offset, y: to.y - ny * offset, side: to.side },
    };

    return [connectionPath(et1), connectionPath(et2)];
}

// --- Legend ---
const legendY = computed(() => parseInt(viewBox.value.split(" ")[3]) - 15);
const legendItems = computed(() => props.data.legend?.items ?? ["input", "primary", "qc", "output", "report"]);

// --- Helper functions for node rendering ---
function terminalRadius(type: string): number {
    return type === "output" || type === "report" ? TERMINAL_RADIUS_SMALL : TERMINAL_RADIUS_LARGE;
}

function headerTextColor(type: string): string {
    return type === "input" ? "#2C3143" : "white";
}

function stepBadgeColor(type: string): string {
    return type === "input" ? "rgba(44,49,67,0.6)" : "rgba(255,255,255,0.7)";
}

function nodeStrokeWidth(type: string): string {
    return type === "input" || type === "output" || type === "report" ? "1.5" : "1";
}

function nodeTerminals(nodeId: string): TerminalPoint[] {
    const points: TerminalPoint[] = [];
    for (const et of edgeTerminals.value) {
        if (et.edge.from === nodeId) points.push(et.from);
        if (et.edge.to === nodeId) points.push(et.to);
    }
    const seen = new Set<string>();
    return points.filter((p) => {
        const key = `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
</script>

<template>
    <svg
        :viewBox="viewBox"
        :aria-label="data.title"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        class="workflow-diagram-svg">
        <title>{{ data.title }}</title>

        <defs>
            <pattern id="wd-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#c5d5e4" stroke-width="0.5" />
            </pattern>
            <pattern id="wd-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#wd-grid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#b0c4d8" stroke-width="1" />
            </pattern>
            <filter id="wd-shadow" x="-5%" y="-5%" width="115%" height="115%">
                <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity="0.15" />
            </filter>
        </defs>

        <!-- Background -->
        <rect :width="svgWidth" :height="svgHeight" fill="#f8f9fa" />
        <rect :width="svgWidth" :height="svgHeight" fill="url(#wd-grid-major)" />

        <!-- Title bar -->
        <rect x="0" y="0" :width="svgWidth" :height="TITLE_BAR_HEIGHT" fill="#25537b" />
        <text x="20" y="28" :font-family="FONT_FAMILY" font-size="16" font-weight="600" fill="white">
            {{ data.title }}
        </text>
        <text v-if="data.subtitle" x="20" y="40" :font-family="FONT_FAMILY" font-size="10" fill="rgba(255,255,255,0.7)">
            {{ data.subtitle }}
        </text>

        <!-- Connections (rendered behind nodes) -->
        <g v-for="(et, i) in edgeTerminals" :key="'edge-' + i">
            <template v-if="et.edge.style === 'dual'">
                <path :d="dualPaths(et)[0]" v-bind="connectionStyleAttrs('primary')" />
                <path :d="dualPaths(et)[1]" v-bind="connectionStyleAttrs('secondary')" />
            </template>
            <path v-else :d="connectionPath(et)" v-bind="connectionStyleAttrs(et.edge.style)" />
        </g>

        <!-- Nodes -->
        <g
            v-for="layout in nodeLayouts"
            :key="layout.node.id"
            filter="url(#wd-shadow)"
            :transform="`translate(${layout.x}, ${layout.y})`">
            <!-- Card body -->
            <rect
                :width="layout.width"
                :height="layout.height"
                rx="4"
                fill="white"
                :stroke="layout.color"
                :stroke-width="nodeStrokeWidth(layout.node.type)" />
            <!-- Header bar -->
            <rect :width="layout.width" :height="layout.headerHeight" rx="4" :fill="layout.color" />
            <!-- Fill gap between header rounded corners and body -->
            <rect x="0" :y="layout.headerHeight - 4" :width="layout.width" height="4" :fill="layout.color" />

            <!-- Step badge + label in header -->
            <text
                v-if="layout.node.step"
                x="10"
                :y="layout.headerHeight - 9"
                :font-family="FONT_FAMILY"
                font-size="11"
                :fill="stepBadgeColor(layout.node.type)">
                {{ layout.node.step }}:
            </text>
            <text
                :x="layout.node.step ? 26 : 10"
                :y="layout.headerHeight - 9"
                :font-family="FONT_FAMILY"
                font-size="11"
                font-weight="600"
                :fill="headerTextColor(layout.node.type)">
                {{ layout.node.label }}
            </text>

            <!-- Subtitle (body line 1) -->
            <text
                v-if="layout.node.subtitle"
                :x="layout.width / 2"
                :y="layout.headerHeight + 24"
                text-anchor="middle"
                :font-family="FONT_FAMILY"
                font-size="10"
                fill="#495057">
                {{ layout.node.subtitle }}
            </text>

            <!-- Detail (body line 2) -->
            <text
                v-if="layout.node.detail"
                :x="layout.width / 2"
                :y="layout.headerHeight + 24 + (layout.node.subtitle ? LINE_HEIGHT : 0)"
                text-anchor="middle"
                :font-family="FONT_FAMILY"
                font-size="9"
                fill="#868e96">
                {{ layout.node.detail }}
            </text>

            <!-- Terminal circles -->
            <circle
                v-for="(tp, ti) in nodeTerminals(layout.node.id)"
                :key="'t-' + ti"
                :cx="tp.x - layout.x"
                :cy="tp.y - layout.y"
                :r="terminalRadius(layout.node.type)"
                fill="white"
                :stroke="layout.color"
                stroke-width="2" />
        </g>

        <!-- Legend -->
        <g :transform="`translate(${PADDING}, ${legendY})`">
            <text x="0" y="0" :font-family="FONT_FAMILY" font-size="10" font-weight="600" fill="#495057">Legend:</text>

            <template v-for="(item, idx) in legendItems" :key="item">
                <template v-if="item === 'input'">
                    <rect
                        :x="60 + idx * 120"
                        y="-10"
                        width="14"
                        height="14"
                        rx="2"
                        fill="white"
                        stroke="#ffd700"
                        stroke-width="1.5" />
                    <text :x="80 + idx * 120" y="0" :font-family="FONT_FAMILY" font-size="9" fill="#6c757d">Input</text>
                </template>

                <template v-if="item === 'primary'">
                    <line
                        :x1="60 + idx * 120"
                        y1="-4"
                        :x2="100 + idx * 120"
                        y2="-4"
                        stroke="#25537b"
                        stroke-width="4"
                        stroke-linecap="round" />
                    <text :x="108 + idx * 120" y="0" :font-family="FONT_FAMILY" font-size="9" fill="#6c757d">
                        Data flow
                    </text>
                </template>

                <template v-if="item === 'qc'">
                    <line
                        :x1="60 + idx * 120"
                        y1="-4"
                        :x2="100 + idx * 120"
                        y2="-4"
                        stroke="#25537b"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-dasharray="5 3" />
                    <text :x="108 + idx * 120" y="0" :font-family="FONT_FAMILY" font-size="9" fill="#6c757d">
                        QC metrics
                    </text>
                </template>

                <template v-if="item === 'output'">
                    <rect
                        :x="60 + idx * 120"
                        y="-10"
                        width="14"
                        height="14"
                        rx="2"
                        fill="white"
                        stroke="#f97316"
                        stroke-width="1.5" />
                    <text :x="80 + idx * 120" y="0" :font-family="FONT_FAMILY" font-size="9" fill="#6c757d">
                        Output
                    </text>
                </template>

                <template v-if="item === 'report'">
                    <rect
                        :x="60 + idx * 120"
                        y="-10"
                        width="14"
                        height="14"
                        rx="2"
                        fill="white"
                        stroke="#10b981"
                        stroke-width="1.5" />
                    <text :x="80 + idx * 120" y="0" :font-family="FONT_FAMILY" font-size="9" fill="#6c757d">
                        Report
                    </text>
                </template>

                <template v-if="item === 'secondary'">
                    <line
                        :x1="60 + idx * 120"
                        y1="-4"
                        :x2="100 + idx * 120"
                        y2="-4"
                        stroke="#25537b"
                        stroke-width="3"
                        stroke-linecap="round" />
                    <text :x="108 + idx * 120" y="0" :font-family="FONT_FAMILY" font-size="9" fill="#6c757d">
                        Secondary
                    </text>
                </template>
            </template>
        </g>
    </svg>
</template>

<style scoped>
.workflow-diagram-svg {
    width: 100%;
    height: auto;
    display: block;
}
</style>
