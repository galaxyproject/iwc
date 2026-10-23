<script setup lang="ts">
import { computed } from "vue";
import { buildGlyphGraph, glyphDomain, type GlyphNode, type Point } from "../utils/workflowGlyph";

const props = withDefaults(
    defineProps<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        steps: Record<string, any>;
        // Stable per-workflow key for SVG ids, so builds are deterministic and
        // inline glyphs of different workflows don't share a gradient id.
        uid?: string;
        collections?: string[];
        size?: number;
        variant?: "flow" | "bloom";
        title?: string;
    }>(),
    { uid: undefined, size: 64, variant: "flow", collections: () => [], title: undefined },
);

const VIEW = 100;
const PAD = 17;
const GOLD = "#FFD700";

const graph = computed(() => buildGlyphGraph(props.steps));
const domain = computed(() => glyphDomain(props.collections));
// The gradient only depends on the domain, so repeated ids for the same
// workflow on one page resolve to identical definitions.
const gradientId = computed(() => `glyph-${(props.uid ?? domain.value.key).replace(/[^A-Za-z0-9_-]/g, "")}`);

// A tenth of a viewBox unit is well under a pixel at any size we draw, and
// every extra digit is repeated across every glyph on the page.
const rd = (v: number) => Math.round(v * 10) / 10;

// One viewBox unit expressed in rendered pixels, so marks can keep a minimum
// physical size and stay legible on small cards.
const pxUnit = computed(() => VIEW / props.size);
const nodeCount = computed(() => graph.value.nodes.length);

const nodeRadius = computed(() => {
    const byDensity = Math.min(7, Math.max(2.4, 15 / Math.sqrt(nodeCount.value + 2)));
    return rd(Math.max(byDensity, 1.25 * pxUnit.value));
});
const strokeWidth = computed(() => {
    const byDensity = Math.min(3.4, Math.max(1, 7 / Math.sqrt(nodeCount.value + 2)));
    return rd(Math.max(byDensity, 0.75 * pxUnit.value));
});

function layoutPoint(x: number, y: number): Point {
    const g = graph.value;
    const inner = VIEW - 2 * PAD;
    if (props.variant === "bloom") {
        const singleRoot = g.nodes.filter((n) => n.depth === 0).length === 1;
        const r0 = singleRoot ? 0 : 0.18;
        const r = r0 + x * (1 - r0);
        const spread = Math.min(Math.PI * 1.85, 0.9 + g.maxWidth * 0.55);
        const theta = -Math.PI / 2 + y * spread;
        return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
    }
    // Narrow pipelines stay slender and wide ones open up, so the outline of
    // the glyph is itself a read on how parallel the workflow is.
    const openness = Math.min(1, 0.12 + (g.maxWidth - 1) * 0.22);
    return { x: PAD + x * inner, y: VIEW / 2 + y * inner * openness };
}

// Bloom coordinates come out in unit polar space; fit them to the tile.
const fit = computed(() => {
    if (props.variant !== "bloom") {
        return (p: Point) => p;
    }
    const pts = graph.value.nodes.map((n) => layoutPoint(n.x, n.y));
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const extent = Math.max(maxX - minX, maxY - minY, 0.6);
    const scale = (VIEW - 2 * PAD) / extent;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    return (p: Point) => ({ x: VIEW / 2 + (p.x - cx) * scale, y: VIEW / 2 + (p.y - cy) * scale });
});

function place(n: GlyphNode): Point {
    const p = fit.value(layoutPoint(n.x, n.y));
    return { x: rd(p.x), y: rd(p.y) };
}

const placed = computed(() => new Map(graph.value.nodes.map((n) => [n.id, { node: n, at: place(n) }])));

function edgePath(fromId: string, toId: string): string {
    const a = placed.value.get(fromId)!.node;
    const b = placed.value.get(toId)!.node;
    if (props.variant === "flow") {
        const p = place(a);
        const q = place(b);
        const mx = rd((p.x + q.x) / 2);
        return `M${p.x} ${p.y}C${mx} ${p.y} ${mx} ${q.y} ${q.x} ${q.y}`;
    }
    // Sample the same S-curve in layout space and bend it through polar
    // space, so radial edges sweep as arcs rather than cutting chords.
    const pts: string[] = [];
    const steps = 14;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const ease = t * t * (3 - 2 * t);
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * ease;
        const p = fit.value(layoutPoint(x, y));
        pts.push(`${rd(p.x)} ${rd(p.y)}`);
    }
    return `M${pts.join("L")}`;
}

const edges = computed(() => graph.value.edges.map((e) => ({ key: `${e.from}-${e.to}`, d: edgePath(e.from, e.to) })));
const nodes = computed(() => Array.from(placed.value.values()));
const outputs = computed(() => nodes.value.filter((n) => n.node.isFinal));
const ofKind = (kind: GlyphNode["kind"]) => computed(() => nodes.value.filter((n) => n.node.kind === kind));
const datasets = ofKind("data");
const collectionInputs = ofKind("collection");
const subworkflows = ofKind("subworkflow");
const tools = computed(() => nodes.value.filter((n) => n.node.kind === "tool" && !n.node.isFinal));
const finalTools = computed(() => nodes.value.filter((n) => n.node.kind === "tool" && n.node.isFinal));
// Past a few dozen steps individual dots turn to grit, so tool steps recede
// into the threads and the inputs and final products carry the shape.
const dense = computed(() => nodeCount.value > 26);
const edgeOpacity = computed(() => (dense.value ? 0.38 : 0.5));
// A lone final product gets a generous glow; many of them share a quieter one
// so the gold doesn't merge into a single blob.
const manyOutputs = computed(() => outputs.value.length > 8);
const haloScale = computed(() => (outputs.value.length > 6 ? 1.45 : outputs.value.length > 2 ? 1.75 : 2.1));
// At thumbnail sizes a dense graph's tool dots are noise; keep only its threads.
const hideTools = computed(() => dense.value && props.size <= 40);
const haloOpacity = computed(() => (outputs.value.length > 6 ? 0.16 : 0.22));
const inputRadius = computed(() => rd(nodeRadius.value * 1.05));
const toolRadius = computed(() => rd(nodeRadius.value * (dense.value ? 0.42 : 0.7)));
const finalRadius = computed(() => rd(nodeRadius.value * (manyOutputs.value ? 0.7 : 0.95)));

const label = computed(() => {
    const g = graph.value;
    const out = outputs.value.length;
    return `${props.title ? props.title + ": " : ""}${g.nodes.length} steps, ${g.maxDepth + 1} stages deep, up to ${g.maxWidth} in parallel, ${out} output${out === 1 ? "" : "s"}`;
});
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="size"
        :height="size"
        :viewBox="`0 0 ${VIEW} ${VIEW}`"
        role="img"
        :aria-label="label"
        class="workflow-glyph shrink-0">
        <title>{{ label }}</title>
        <defs>
            <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" :stop-color="domain.from" />
                <stop offset="1" :stop-color="domain.to" />
            </linearGradient>
        </defs>
        <rect x="0" y="0" :width="VIEW" :height="VIEW" rx="22" :fill="`url(#${gradientId})`" />
        <rect
            x="1.5"
            y="1.5"
            :width="VIEW - 3"
            :height="VIEW - 3"
            rx="20.5"
            fill="none"
            stroke="#ffffff"
            stroke-opacity="0.12"
            stroke-width="1.5" />

        <g
            fill="none"
            :stroke="domain.line"
            stroke-linecap="round"
            :stroke-width="strokeWidth"
            :stroke-opacity="edgeOpacity">
            <path v-for="e in edges" :key="e.key" :d="e.d" />
        </g>

        <!-- Outputs get a soft halo first so it sits beneath every node. -->
        <circle
            v-for="o in manyOutputs ? [] : outputs"
            :key="`halo-${o.node.id}`"
            :cx="o.at.x"
            :cy="o.at.y"
            :r="rd(nodeRadius * haloScale)"
            :fill="GOLD"
            :fill-opacity="haloOpacity" />

        <!-- One loop per mark so each step renders as a single element and shared
             attributes sit on the group: this markup repeats for every card. -->
        <g v-if="!hideTools" :fill="domain.line" :fill-opacity="dense ? 0.7 : 0.9">
            <circle v-for="n in tools" :key="n.node.id" :cx="n.at.x" :cy="n.at.y" :r="toolRadius" />
        </g>
        <g :fill="domain.line">
            <circle v-for="n in datasets" :key="n.node.id" :cx="n.at.x" :cy="n.at.y" :r="inputRadius" />
            <!-- A collection is many datasets: draw it as a small stack. -->
            <g v-for="n in collectionInputs" :key="n.node.id">
                <circle
                    :cx="rd(n.at.x - nodeRadius * 0.55)"
                    :cy="rd(n.at.y + nodeRadius * 0.55)"
                    :r="inputRadius"
                    fill-opacity="0.35" />
                <circle :cx="n.at.x" :cy="n.at.y" :r="inputRadius" />
            </g>
        </g>
        <g v-for="n in subworkflows" :key="n.node.id">
            <circle
                :cx="n.at.x"
                :cy="n.at.y"
                :r="rd(nodeRadius * 1.25)"
                :fill="n.node.isFinal ? GOLD : domain.from"
                :stroke="n.node.isFinal ? GOLD : domain.line"
                :stroke-width="strokeWidth" />
            <circle
                :cx="n.at.x"
                :cy="n.at.y"
                :r="rd(nodeRadius * 0.45)"
                :fill="n.node.isFinal ? domain.from : domain.line" />
        </g>
        <g :fill="GOLD">
            <circle v-for="n in finalTools" :key="n.node.id" :cx="n.at.x" :cy="n.at.y" :r="finalRadius" />
        </g>
    </svg>
</template>
