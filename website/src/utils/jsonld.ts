import type { Workflow } from "../models/workflow";

/**
 * Schema.org Person or Organization type
 */
interface SchemaOrgEntity {
    "@type": "Person" | "Organization";
    name: string;
    identifier?: string;
    email?: string;
    url?: string;
}

/**
 * Schema.org JSON-LD structured data for a workflow
 */
interface WorkflowJsonLd {
    "@context": "https://schema.org";
    "@type": string[];
    name: string;
    description: string;
    version?: string;
    license?: string;
    identifier?: string;
    url: string;
    dateModified: string;
    creator: SchemaOrgEntity[];
    keywords: string[];
    programmingLanguage: {
        "@type": "ComputerLanguage";
        name: string;
        url: string;
    };
}

/**
 * Generates Schema.org JSON-LD structured data for a workflow
 * This helps with SEO and discoverability in academic search engines like Google Scholar
 *
 * @param workflow - The workflow object from the manifest
 * @param baseUrl - Base URL for the IWC website (e.g., "https://iwc.galaxyproject.org")
 * @returns JSON-LD object ready to be serialized
 */
export function generateWorkflowJsonLd(
    workflow: Workflow,
    baseUrl: string = "https://iwc.galaxyproject.org",
): WorkflowJsonLd {
    // Build Dockstore URL from TRS ID
    // TRS ID format: "#workflow/github.com/iwc-workflows/[name]/[version]"
    const dockstoreUrl = workflow.trsID
        ? `https://dockstore.org/workflows/${workflow.trsID.replace("#workflow/", "")}`
        : `${baseUrl}/workflow/${workflow.iwcID}`;

    // Map creators to Schema.org Person or Organization
    const creators: SchemaOrgEntity[] = workflow.definition.creator.map((creator) => {
        const entity: SchemaOrgEntity = {
            "@type": creator.class === "Person" ? "Person" : "Organization",
            name: creator.name,
        };

        // Add ORCID identifier if available
        if (creator.identifier) {
            entity.identifier = creator.identifier;
        }

        // Add URL if available
        if (creator.url) {
            entity.url = creator.url;
        }

        return entity;
    });

    // Combine collections and tags for keywords
    const keywords: string[] = [...(workflow.collections || []), ...(workflow.definition.tags || [])].filter(Boolean);

    const jsonLd: WorkflowJsonLd = {
        "@context": "https://schema.org",
        "@type": ["SoftwareSourceCode", "ComputationalWorkflow"],
        name: workflow.definition.name,
        description: workflow.definition.annotation || "",
        url: dockstoreUrl,
        dateModified: workflow.updated,
        creator: creators,
        keywords,
        programmingLanguage: {
            "@type": "ComputerLanguage",
            name: "Galaxy",
            url: "https://galaxyproject.org",
        },
    };

    // Add optional fields if they exist
    if (workflow.definition.release) {
        jsonLd.version = workflow.definition.release;
    }

    if (workflow.definition.license) {
        jsonLd.license = workflow.definition.license;
    }

    if (workflow.doi) {
        // Use DOI as the identifier for better academic discoverability
        jsonLd.identifier = `https://doi.org/${workflow.doi}`;
    }

    return jsonLd;
}

/**
 * Serializes JSON-LD object to a string ready for injection into HTML
 *
 * @param jsonLd - The JSON-LD object
 * @returns Stringified JSON-LD
 */
export function serializeJsonLd(jsonLd: WorkflowJsonLd): string {
    return JSON.stringify(jsonLd, null, 2);
}

/**
 * Google Scholar citation meta tag
 */
export interface CitationMetaTag {
    name: string;
    content: string;
}

/**
 * Generates Google Scholar citation meta tags for a workflow
 * Google Scholar requires: title, author(s), and publication_date
 *
 * @param workflow - The workflow object from the manifest
 * @returns Array of meta tag objects with name and content
 */
export function generateCitationMetaTags(workflow: Workflow): CitationMetaTag[] {
    const tags: CitationMetaTag[] = [];

    // Required: Title
    tags.push({
        name: "citation_title",
        content: workflow.definition.name,
    });

    // Required: Authors (one tag per person, skip organizations)
    workflow.definition.creator.forEach((creator) => {
        if (creator.class === "Person") {
            tags.push({
                name: "citation_author",
                content: creator.name,
            });
        }
    });

    // Required: Publication date
    const publicationDate = new Date(workflow.updated).toISOString().split("T")[0];
    tags.push({
        name: "citation_publication_date",
        content: publicationDate,
    });

    // Optional: DOI
    if (workflow.doi) {
        tags.push({
            name: "citation_doi",
            content: workflow.doi,
        });
    }

    // Optional: Abstract
    if (workflow.definition.annotation) {
        tags.push({
            name: "citation_abstract",
            content: workflow.definition.annotation,
        });
    }

    // Optional: Keywords
    const keywords = [...(workflow.collections || []), ...(workflow.definition.tags || [])].filter(Boolean);
    if (keywords.length > 0) {
        tags.push({
            name: "citation_keywords",
            content: keywords.join("; "),
        });
    }

    return tags;
}
