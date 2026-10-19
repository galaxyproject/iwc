// Structure-derived workflow glyphs. Every mark in a glyph comes from the
// workflow's own step graph: where data enters, how it branches, how deep the
// pipeline runs and which steps produce the workflow's outputs.

type StepKind = "data" | "collection" | "tool" | "subworkflow";

interface RawConnection {
    id: number;
}

interface RawStep {
    id: number;
    type: string;
    input_connections?: Record<string, RawConnection | RawConnection[]> | null;
    workflow_outputs?: unknown[] | null;
}

export interface GlyphNode {
    id: string;
    kind: StepKind;
    depth: number;
    // A labelled output that nothing downstream consumes: one of the things
    // the workflow actually hands back to the user.
    isFinal: boolean;
    // Layout space: x in [0, 1] runs from inputs to final steps, y is centred on 0.
    x: number;
    y: number;
}

export interface GlyphEdge {
    from: string;
    to: string;
}

export interface GlyphGraph {
    nodes: GlyphNode[];
    edges: GlyphEdge[];
    maxDepth: number;
    maxWidth: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface GlyphDomain {
    key: string;
    label: string;
    // Tile gradient stops and the colour of the structure drawn over it.
    from: string;
    to: string;
    line: string;
}

const MIN_GAP = 1;

function stepKind(type: string): StepKind | null {
    switch (type) {
        case "data_input":
            return "data";
        case "data_collection_input":
            return "collection";
        case "subworkflow":
            return "subworkflow";
        case "tool":
        case "pause":
            return "tool";
        default:
            // Parameter inputs configure the workflow but carry no data, so
            // drawing them would only add noise to the shape.
            return null;
    }
}

function parentIds(step: RawStep): string[] {
    const ids: string[] = [];
    for (const conn of Object.values(step.input_connections ?? {})) {
        for (const c of Array.isArray(conn) ? conn : [conn]) {
            if (c && c.id !== undefined) {
                ids.push(String(c.id));
            }
        }
    }
    return ids;
}

export function buildGlyphGraph(steps: Record<string, RawStep>): GlyphGraph {
    const kinds = new Map<string, StepKind>();
    for (const [key, step] of Object.entries(steps)) {
        const kind = stepKind(step.type);
        if (kind) {
            kinds.set(String(step.id ?? key), kind);
        }
    }
    const byId = new Map<string, RawStep>();
    for (const [key, step] of Object.entries(steps)) {
        byId.set(String(step.id ?? key), step);
    }

    const parents = new Map<string, string[]>();
    const children = new Map<string, string[]>();
    const edges: GlyphEdge[] = [];
    for (const id of kinds.keys()) {
        const ps = Array.from(new Set(parentIds(byId.get(id)!).filter((p) => kinds.has(p) && p !== id)));
        parents.set(id, ps);
        for (const p of ps) {
            edges.push({ from: p, to: id });
            children.set(p, [...(children.get(p) ?? []), id]);
        }
    }

    // Longest-path layering: a step sits one column past its deepest input.
    const depth = new Map<string, number>();
    const visiting = new Set<string>();
    const depthOf = (id: string): number => {
        const known = depth.get(id);
        if (known !== undefined) {
            return known;
        }
        if (visiting.has(id)) {
            return 0;
        }
        visiting.add(id);
        const ps = parents.get(id) ?? [];
        const d = ps.length ? 1 + Math.max(...ps.map(depthOf)) : 0;
        visiting.delete(id);
        depth.set(id, d);
        return d;
    };
    for (const id of kinds.keys()) {
        depthOf(id);
    }

    const maxDepth = Math.max(0, ...depth.values());

    const layers: string[][] = Array.from({ length: maxDepth + 1 }, () => []);
    for (const id of kinds.keys()) {
        layers[depth.get(id)!].push(id);
    }
    // Stable start: inputs keep their order of declaration.
    for (const layer of layers) {
        layer.sort((a, b) => Number(a) - Number(b));
    }

    const order = new Map<string, number>();
    const reindex = () => layers.forEach((layer) => layer.forEach((id, i) => order.set(id, i)));
    reindex();

    // Barycentre sweeps reduce crossings so branches read as branches.
    const barycentre = (id: string, neighbours: Map<string, string[]>) => {
        const ns = neighbours.get(id) ?? [];
        if (!ns.length) {
            return order.get(id)!;
        }
        return ns.reduce((sum, n) => sum + order.get(n)!, 0) / ns.length;
    };
    for (let sweep = 0; sweep < 8; sweep++) {
        const down = sweep % 2 === 0;
        const range = down ? layers.slice(1) : layers.slice(0, -1).reverse();
        for (const layer of range) {
            const score = new Map(layer.map((id) => [id, barycentre(id, down ? parents : children)]));
            layer.sort((a, b) => score.get(a)! - score.get(b)!);
            layer.forEach((id, i) => order.set(id, i));
        }
    }

    const maxWidth = Math.max(1, ...layers.map((l) => l.length));

    // Initial y: each layer centred on the axis.
    const y = new Map<string, number>();
    for (const layer of layers) {
        layer.forEach((id, i) => y.set(id, i - (layer.length - 1) / 2));
    }

    // Relax toward neighbours so single-parent chains run straight and
    // fan-outs open symmetrically, then restore order and spacing.
    for (let iter = 0; iter < 24; iter++) {
        for (const layer of layers) {
            const desired = layer.map((id) => {
                const ns = [...(parents.get(id) ?? []), ...(children.get(id) ?? [])];
                if (!ns.length) {
                    return y.get(id)!;
                }
                const mean = ns.reduce((s, n) => s + y.get(n)!, 0) / ns.length;
                return 0.5 * y.get(id)! + 0.5 * mean;
            });
            for (let i = 1; i < desired.length; i++) {
                desired[i] = Math.max(desired[i], desired[i - 1] + MIN_GAP);
            }
            // Keep each layer balanced about the axis so the glyph stays centred.
            const shift = (desired[0] + desired[desired.length - 1]) / 2;
            layer.forEach((id, i) => y.set(id, desired[i] - shift * 0.6));
        }
    }

    const ys = Array.from(y.values());
    const span = Math.max(1, Math.max(...ys) - Math.min(...ys));
    const mid = (Math.max(...ys) + Math.min(...ys)) / 2;

    const isProducer = (kind: StepKind) => kind === "tool" || kind === "subworkflow";
    const nodes: GlyphNode[] = Array.from(kinds.entries()).map(([id, kind]) => {
        const step = byId.get(id)!;
        const d = depth.get(id)!;
        const isOutput = (step.workflow_outputs?.length ?? 0) > 0 && isProducer(kind);
        return {
            id,
            kind,
            depth: d,
            isFinal: isOutput && !(children.get(id)?.length ?? 0),
            x: maxDepth ? d / maxDepth : 0.5,
            y: (y.get(id)! - mid) / span,
        };
    });
    // Some workflows label only intermediate steps; their dead ends are still
    // what the user walks away with.
    if (!nodes.some((n) => n.isFinal)) {
        for (const n of nodes) {
            n.isFinal = isProducer(n.kind) && !(children.get(n.id)?.length ?? 0);
        }
    }

    return { nodes, edges, maxDepth, maxWidth };
}

// Domain tints group related collections so a grid of glyphs reads by field
// at a glance; the structure on top of the tint is what tells siblings apart.
const DOMAINS: Record<string, GlyphDomain> = {
    genomes: { key: "genomes", label: "Genomes", from: "#1F4465", to: "#387DBA", line: "#EDF4FA" },
    microbes: { key: "microbes", label: "Microbial communities", from: "#17473F", to: "#2F8A73", line: "#E6F5EF" },
    variants: { key: "variants", label: "Variants and pathogens", from: "#5A1F33", to: "#A8475E", line: "#FBEAEE" },
    expression: { key: "expression", label: "Expression", from: "#3B2659", to: "#7656A8", line: "#F1EBFA" },
    epigenetics: { key: "epigenetics", label: "Epigenetics", from: "#28305E", to: "#5363B0", line: "#ECEFFB" },
    molecules: { key: "molecules", label: "Proteins and metabolites", from: "#5B3418", to: "#A86A35", line: "#FBF0E6" },
    imaging: { key: "imaging", label: "Imaging", from: "#1D4352", to: "#3E8BA6", line: "#E7F4F8" },
    chemistry: { key: "chemistry", label: "Chemistry", from: "#2F4A1E", to: "#668F3F", line: "#EEF6E7" },
    general: { key: "general", label: "General", from: "#2C3143", to: "#5D678D", line: "#DFE2EA" },
};

const COLLECTION_DOMAIN: Record<string, string> = {
    "Vertebrate Genome Project": "genomes",
    "Genome assembly": "genomes",
    "Genome Annotation": "genomes",
    "Comparative Genomics": "genomes",
    "Bacterial Genomics": "genomes",
    Microbiome: "microbes",
    Metagenomics: "microbes",
    Metabarcoding: "microbes",
    "Variant Calling": "variants",
    "SARS-COV-2": "variants",
    Virology: "variants",
    Transcriptomics: "expression",
    "Single Cell": "expression",
    Epigenetics: "epigenetics",
    Proteomics: "molecules",
    Metaproteomics: "molecules",
    Metabolomics: "molecules",
    Imaging: "imaging",
    "Computational Chemistry": "chemistry",
};

export function glyphDomain(collections: string[] | undefined): GlyphDomain {
    for (const c of collections ?? []) {
        const key = COLLECTION_DOMAIN[c];
        if (key) {
            return DOMAINS[key];
        }
    }
    return DOMAINS.general;
}

export const GLYPH_DOMAINS = Object.values(DOMAINS);
