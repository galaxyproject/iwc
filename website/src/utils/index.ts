/**
 * Formats an ISO timestamp into a readable date string.
 *
 * @param isoString - The ISO timestamp string to format.
 * @returns A formatted date string in the format "Month Day, Year".
 */
export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Normalizes a Galaxy instance URL by ensuring it has a valid protocol.
 * - Auto-prepends https:// to URLs without a protocol
 * - Preserves http:// for localhost/127.0.0.1 URLs
 * - Trims whitespace
 *
 * @param url - The URL string to normalize
 * @returns A normalized URL with protocol, or null if invalid
 *
 * @example
 * normalizeGalaxyUrl("usegalaxy.org") // "https://usegalaxy.org"
 * normalizeGalaxyUrl("localhost:8080") // "http://localhost:8080"
 * normalizeGalaxyUrl("https://usegalaxy.eu") // "https://usegalaxy.eu"
 */
export function normalizeGalaxyUrl(url: string): string | null {
    if (!url) {
        return null;
    }

    // Trim whitespace
    url = url.trim();

    if (!url) {
        return null;
    }

    // Handle localhost and 127.0.0.1 specially (use http if no protocol specified)
    if (url.match(/^(localhost|127\.0\.0\.1)(:\d+)?$/i)) {
        url = `http://${url}`;
    }
    // If no protocol specified, prepend https://
    else if (!url.match(/^https?:\/\//i)) {
        url = `https://${url}`;
    }

    // Validate the URL
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return null;
        }
        // Ensure there's a hostname
        if (!parsed.hostname) {
            return null;
        }
        return url;
    } catch (e) {
        // Invalid URL
        return null;
    }
}
