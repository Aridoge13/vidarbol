/**
 * Date helpers.
 *
 * The puzzle key is the user's LOCAL date. This is deliberate:
 * a player in Tokyo and a player in Los Angeles should each see "today's
 * puzzle" by their own clock. No timezone server involved.
 */

/** Local date as "YYYY-MM-DD". Not UTC. */
export function todayKey(now: Date = new Date()): string {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/** True if the string looks like an ISO date we can use as a puzzle key. */
export function isDateKey(s: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/** Human-readable form for the result card, e.g. "September 18, 2026". */
export function formatDisplayDate(key: string): string {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}