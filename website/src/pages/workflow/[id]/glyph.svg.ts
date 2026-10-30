import type { APIRoute, GetStaticPaths } from "astro";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import WorkflowGlyph from "../../../components/WorkflowGlyph.vue";
import { loadManifest, getAllWorkflows } from "../../../utils/manifest";
import type { Workflow } from "../../../models/workflow";

// Cards show the glyph as an <img> of this file rather than inline SVG: the
// homepage lists every workflow, and inline markup plus the geometry needed to
// hydrate it nearly doubled the page. Files are cached and loaded lazily.
// The glyph is size-aware, so it's drawn at the size cards show it at (compact
// cards scale it down slightly).
const CARD_SIZE = 48;

export const getStaticPaths: GetStaticPaths = async () => {
    const workflows = getAllWorkflows(await loadManifest());
    return workflows.map((workflow) => ({ params: { id: workflow.iwcID }, props: { workflow } }));
};

export const GET: APIRoute = async ({ props }) => {
    const { workflow } = props as { workflow: Workflow };
    const app = createSSRApp(WorkflowGlyph, {
        steps: workflow.definition.steps,
        collections: workflow.collections,
        uid: workflow.iwcID,
        size: CARD_SIZE,
        title: workflow.definition.name,
    });
    // Vue's hydration markers mean nothing in a standalone file, and Vue's SSR
    // lowercases attributes on a component's root element. HTML parsers fix
    // viewBox inline, but a standalone SVG is XML and would ignore it.
    const svg = (await renderToString(app))
        .replace(/<!--[^>]*-->/g, "")
        .replace(/^(<svg\b[^>]*?) viewbox=/i, "$1 viewBox=");
    // Fail the build rather than ship tiles that render uncropped.
    if (!/^<svg\b[^>]* viewBox="/.test(svg)) {
        throw new Error(`glyph.svg for ${workflow.iwcID} has no viewBox on its root element`);
    }
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
