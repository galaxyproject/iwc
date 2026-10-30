<script setup lang="ts">
import { computed } from "vue";
import {
    buildGlyphGraph,
    glyphDomain,
    GLYPH_GOLD as GOLD,
    GLYPH_MARKS as MARKS,
    type GlyphNode,
    type GlyphStep,
    type Point,
} from "../utils/workflowGlyph";

const props = withDefaults(
    defineProps<{
        steps: Record<string, GlyphStep>;
        // Stable per-workflow key for SVG ids, so builds are deterministic and
        // inline glyphs of different workflows don't share a gradient id.
        uid: string;
        collections?: string[];
        size?: number;
        title?: string;
    }>(),
    { size: 64, collections: () => [], title: undefined },
);

const VIEW = 100;
const PAD = 17;

const graph = computed(() => buildGlyphGraph(props.steps));
const domain = computed(() => glyphDomain(props.collections));
// The gradient only depends on the domain, so repeated ids for the same
// workflow on one page resolve to identical definitions.
const gradientId = computed(() => `glyph-${props.uid.replace(/[^A-Za-z0-9_-]/g, "")}`);

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

// Inputs on the left, final steps on the right, as in the Galaxy editor.
function place(n: GlyphNode): Point {
    const inner = VIEW - 2 * PAD;
    // Narrow pipelines stay slender and wide ones open up, so the outline of
    // the glyph is itself a read on how parallel the workflow is.
    const openness = Math.min(1, 0.12 + (graph.value.maxWidth - 1) * 0.22);
    return { x: rd(PAD + n.x * inner), y: rd(VIEW / 2 + n.y * inner * openness) };
}

const placed = computed(() => new Map(graph.value.nodes.map((n) => [n.id, { node: n, at: place(n) }])));

function edgePath(fromId: string, toId: string): string {
    const p = placed.value.get(fromId)!.at;
    const q = placed.value.get(toId)!.at;
    const mx = rd((p.x + q.x) / 2);
    return `M${p.x} ${p.y}C${mx} ${p.y} ${mx} ${q.y} ${q.x} ${q.y}`;
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
const haloScale = computed(() => (outputs.value.length > 6 ? 1.45 : outputs.value.length > 2 ? 1.75 : MARKS.halo));
const haloOpacity = computed(() => (outputs.value.length > 6 ? 0.16 : MARKS.haloOpacity));
const inputRadius = computed(() => rd(nodeRadius.value * MARKS.input));
const toolRadius = computed(() => rd(nodeRadius.value * (dense.value ? 0.42 : MARKS.tool)));
const finalRadius = computed(() => rd(nodeRadius.value * (manyOutputs.value ? 0.7 : MARKS.final)));

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
        <g :fill="domain.line" :fill-opacity="dense ? 0.7 : 0.9">
            <circle v-for="n in tools" :key="n.node.id" :cx="n.at.x" :cy="n.at.y" :r="toolRadius" />
        </g>
        <g :fill="domain.line">
            <circle v-for="n in datasets" :key="n.node.id" :cx="n.at.x" :cy="n.at.y" :r="inputRadius" />
            <!-- A collection is many datasets: draw it as a small stack. -->
            <g v-for="n in collectionInputs" :key="n.node.id">
                <circle
                    :cx="rd(n.at.x - nodeRadius * MARKS.stackOffset)"
                    :cy="rd(n.at.y + nodeRadius * MARKS.stackOffset)"
                    :r="inputRadius"
                    :fill-opacity="MARKS.stackOpacity" />
                <circle :cx="n.at.x" :cy="n.at.y" :r="inputRadius" />
            </g>
        </g>
        <g v-for="n in subworkflows" :key="n.node.id">
            <circle
                :cx="n.at.x"
                :cy="n.at.y"
                :r="rd(nodeRadius * MARKS.ring)"
                :fill="n.node.isFinal ? GOLD : domain.from"
                :stroke="n.node.isFinal ? GOLD : domain.line"
                :stroke-width="strokeWidth" />
            <circle
                :cx="n.at.x"
                :cy="n.at.y"
                :r="rd(nodeRadius * MARKS.ringCore)"
                :fill="n.node.isFinal ? domain.from : domain.line" />
        </g>
        <g :fill="GOLD">
            <circle v-for="n in finalTools" :key="n.node.id" :cx="n.at.x" :cy="n.at.y" :r="finalRadius" />
        </g>
    </svg>
</template>
