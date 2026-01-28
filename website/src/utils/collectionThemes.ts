/**
 * Collection theme configuration for workflow glyphs.
 * Uses Galaxy brand colors with shape-based differentiation per collection.
 */

export type ShapeType =
    | "circle"
    | "rounded-square"
    | "hexagon"
    | "octagon"
    | "diamond"
    | "pill"
    | "shield"
    | "pentagon"
    | "square";

export interface CollectionTheme {
    shape: ShapeType;
    /** Hue shift (0-360) applied to the base Galaxy blue palette */
    hueShift: number;
}

/**
 * Galaxy brand colors from global.css
 */
export const galaxyColors = {
    // Bay of many - primary blue
    bayOfMany: {
        50: "#fdfdfe",
        100: "#edf4fa",
        200: "#cde0f0",
        300: "#aecce7",
        400: "#8fb9dd",
        500: "#6fa5d4",
        600: "#5091ca",
        700: "#387dba",
        800: "#2e689a",
        900: "#25537b",
    },
    // Ebony clay - dark
    ebonyClay: {
        50: "#dfe2ea",
        100: "#d3d6e2",
        200: "#bbc0d2",
        700: "#4c5574",
        800: "#3c435c",
        900: "#2c3143",
    },
    // Hokey pokey - gold accent
    hokeyPokey: {
        300: "#e1d36b",
        400: "#daca49",
        500: "#d0bd2a",
        600: "#a19321",
    },
    // Chicago - grey
    chicago: {
        50: "#f5f5f6",
        100: "#e6e6e7",
        200: "#d0d0d1",
        400: "#878789",
        500: "#6c6c6e",
        600: "#58585a",
    },
};

/**
 * Collection themes - each gets a unique shape.
 * All use the same Galaxy color palette for consistency.
 */
export const collectionThemes: Record<string, CollectionTheme> = {
    Transcriptomics: { shape: "circle", hueShift: 0 },
    Proteomics: { shape: "rounded-square", hueShift: 0 },
    Metabolomics: { shape: "hexagon", hueShift: 0 },
    Metagenomics: { shape: "octagon", hueShift: 0 },
    Microbiome: { shape: "diamond", hueShift: 0 },
    "Genome assembly": { shape: "pill", hueShift: 0 },
    "Genome Annotation": { shape: "shield", hueShift: 0 },
    "Variant Calling": { shape: "pentagon", hueShift: 0 },
    "Single Cell": { shape: "circle", hueShift: 0 },
    Epigenetics: { shape: "rounded-square", hueShift: 0 },
    Imaging: { shape: "square", hueShift: 0 },
    "SARS-COV-2": { shape: "shield", hueShift: 0 },
    Virology: { shape: "shield", hueShift: 0 },
    "Computational Chemistry": { shape: "hexagon", hueShift: 0 },
    Metabarcoding: { shape: "pill", hueShift: 0 },
    Metaproteomics: { shape: "octagon", hueShift: 0 },
    "Vertebrate Genome Project": { shape: "diamond", hueShift: 0 },
    "Data Fetching": { shape: "square", hueShift: 0 },
};

/**
 * Default theme for collections not in the mapping.
 */
export const defaultTheme: CollectionTheme = {
    shape: "circle",
    hueShift: 0,
};

/**
 * Get the theme for a collection, or the default if not found.
 */
export function getCollectionTheme(collection: string | undefined): CollectionTheme {
    if (!collection) {
        return defaultTheme;
    }
    return collectionThemes[collection] || defaultTheme;
}

/**
 * Get the theme for a workflow based on its primary (first) collection.
 */
export function getWorkflowTheme(collections: string[] | undefined): CollectionTheme {
    if (!collections || collections.length === 0) {
        return defaultTheme;
    }
    return getCollectionTheme(collections[0]);
}
