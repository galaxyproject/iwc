/**
 * Utility for extracting initials from workflow names.
 * Creates 2-3 letter abbreviations for visual display in glyphs.
 */

/**
 * Words to skip when extracting initials (articles, prepositions, common fillers).
 */
const SKIP_WORDS = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "of",
    "for",
    "to",
    "in",
    "on",
    "at",
    "by",
    "from",
    "with",
    "using",
    "via",
]);

/**
 * Common abbreviations and acronyms that should be treated as single units.
 */
const KNOWN_ABBREVIATIONS = new Set([
    "rna",
    "dna",
    "mrna",
    "rrna",
    "trna",
    "snp",
    "vcf",
    "bam",
    "sam",
    "qc",
    "wgs",
    "lcms",
    "gcms",
    "rnaseq",
    "chipseq",
    "atacseq",
    "scrna",
    "covid",
    "sars",
    "cov",
    "artic",
    "pe",
    "se",
]);

/**
 * Extract meaningful initials from a workflow name.
 *
 * Strategy:
 * 1. Split by common delimiters (spaces, hyphens, colons, underscores)
 * 2. Filter out skip words
 * 3. Take first letter of significant words
 * 4. Return 2-3 uppercase letters
 *
 * @param name - The workflow name
 * @returns 2-3 uppercase letters representing the workflow
 *
 * @example
 * extractInitials("RNA-Seq Differential Expression") // "RD"
 * extractInitials("Variant Calling - Paired End") // "VC"
 * extractInitials("COVID-19: variation analysis") // "CV"
 * extractInitials("Mass spectrometry: LC-MS preprocessing") // "ML"
 */
export function extractInitials(name: string): string {
    if (!name || typeof name !== "string") {
        return "??";
    }

    // Split on common delimiters
    const words = name
        .split(/[\s\-:_/]+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0);

    if (words.length === 0) {
        return "??";
    }

    // Filter out skip words and very short words (unless they're abbreviations)
    const significantWords = words.filter((word) => {
        const lower = word.toLowerCase();
        // Keep abbreviations even if short
        if (KNOWN_ABBREVIATIONS.has(lower)) {
            return true;
        }
        // Skip articles/prepositions
        if (SKIP_WORDS.has(lower)) {
            return false;
        }
        // Keep words with 2+ characters, or single uppercase (like "A" in "Type A")
        return word.length >= 2 || (word.length === 1 && word === word.toUpperCase());
    });

    // If we filtered out everything, use the original words
    const wordsToUse = significantWords.length > 0 ? significantWords : words;

    // Extract first letters
    const initials: string[] = [];
    for (const word of wordsToUse) {
        if (initials.length >= 3) break;

        // For acronyms/abbreviations that are all caps, take the first letter
        // For mixed case or lowercase, take the first letter
        const firstChar = word.charAt(0).toUpperCase();
        if (firstChar.match(/[A-Z]/)) {
            initials.push(firstChar);
        }
    }

    // Ensure we have at least 2 characters
    if (initials.length < 2 && wordsToUse.length > 0) {
        // Try to get more from the first word
        const firstWord = wordsToUse[0];
        if (firstWord.length >= 2) {
            return firstWord.substring(0, 2).toUpperCase();
        }
    }

    // Return 2-3 initials
    const result = initials.slice(0, 3).join("");
    return result.length >= 2 ? result : result.padEnd(2, result.charAt(0) || "W");
}
