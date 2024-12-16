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
