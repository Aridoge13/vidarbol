import { getLeafIds, parseNewick } from "./newick";
import type { Puzzle, PuzzleIndex, Taxon } from "../types/puzzle";

const PUZZLES_BASE = `${(import.meta as ImportMeta & { env: { BASE_URL: string } }).env.BASE_URL}puzzles`;

/**
 * Runtime validation. The Python pipeline already checks these files, but a
 * corrupted deploy or a bad base path should fail with a clear message rather
 * than a mystery render error.
 */
function isTaxon(x: unknown): x is Taxon {
    if (typeof x !== "object" || x === null) return false;
    const t = x as Record<string, unknown>;
    return (
        typeof t.id === "string" &&
        typeof t.name === "string" &&
        typeof t.sci_name === "string" &&
        typeof t.ott_id === "number" &&
        typeof t.image === "string"
    );
}

function isPuzzle(x: unknown): x is Puzzle {
    if (typeof x !== "object" || x === null) return false;
    const p = x as Record<string, unknown>;

    if (
        typeof p.date !== "string" ||
        typeof p.clade !== "string" ||
        typeof p.difficulty !== "string"
    ) {
        return false;
    }
    if (!["easy", "medium", "hard"].includes(p.difficulty)) return false;

    if (!Array.isArray(p.taxa) || !p.taxa.every(isTaxon)) return false;

    const tree = p.tree;
    if (typeof tree !== "object" || tree === null) return false;
    const t = tree as Record<string, unknown>;
    if (typeof t.newick !== "string") return false;
    if (!Array.isArray(t.leafIds) || !t.leafIds.every((s) => typeof s === "string")) {
        return false;
    }

    return true;
}

/**
 * Cross-field checks that JSON shape validation can't express:
 *   - every taxon id appears exactly once in leafIds
 *   - the newick parses
 *   - newick leaf order matches leafIds
 *   - taxon count is within a sane range
 */
function validatePuzzle(p: Puzzle): void {
    const ids = new Set<string>();
    for (const t of p.taxa) {
        if (ids.has(t.id)) {
            throw new Error(`puzzle ${p.date}: duplicate taxon id "${t.id}"`);
        }
        ids.add(t.id);
    }

    if (p.taxa.length < 4 || p.taxa.length > 12) {
        throw new Error(
            `puzzle ${p.date}: expected 4-12 taxa, got ${p.taxa.length}`,
        );
    }

    if (p.tree.leafIds.length !== p.taxa.length) {
        throw new Error(
            `puzzle ${p.date}: ${p.tree.leafIds.length} leafIds for ${p.taxa.length} taxa`,
        );
    }

    const leafSet = new Set(p.tree.leafIds);
    if (leafSet.size !== p.tree.leafIds.length) {
        throw new Error(`puzzle ${p.date}: duplicate ids in tree.leafIds`);
    }
    for (const id of ids) {
        if (!leafSet.has(id)) {
            throw new Error(`puzzle ${p.date}: taxon "${id}" missing from leafIds`);
        }
    }

    let root;
    try {
        root = parseNewick(p.tree.newick);
    } catch (e) {
        throw new Error(
            `puzzle ${p.date}: newick failed to parse: ${(e as Error).message}`,
        );
    }

    const newickLeafIds = getLeafIds(root);
    if (
        newickLeafIds.length !== p.tree.leafIds.length ||
        newickLeafIds.some((id, i) => id !== p.tree.leafIds[i])
    ) {
        throw new Error(
            `puzzle ${p.date}: newick leaf order does not match tree.leafIds`,
        );
    }
}

/** Fetch and validate the list of available dates. */
export async function fetchPuzzleIndex(): Promise<PuzzleIndex> {
    const res = await fetch(`${PUZZLES_BASE}/index.json`, {
        cache: "no-cache",
    });
    if (!res.ok) {
        throw new Error(`Failed to load puzzle index: HTTP ${res.status}`);
    }
    const data: unknown = await res.json();
    if (
        !Array.isArray(data) ||
        !data.every((s) => typeof s === "string")
    ) {
        throw new Error("Puzzle index is malformed: expected string[]");
    }
    return data;
}

/** Fetch and validate one puzzle by ISO date key. */
export async function fetchPuzzle(dateKey: string): Promise<Puzzle> {
    const res = await fetch(`${PUZZLES_BASE}/${dateKey}.json`, {
        cache: "no-cache",
    });;
    if (res.status === 404) {
        throw new Error(`No puzzle for ${dateKey}.`);
    }
    if (!res.ok) {
        throw new Error(
            `Failed to load puzzle ${dateKey}: HTTP ${res.status}`,
        );
    }
    const data: unknown = await res.json();
    if (!isPuzzle(data)) {
        throw new Error(`Puzzle ${dateKey} has unexpected shape.`);
    }
    validatePuzzle(data);
    return data;
}

/**
 * Pick a playable date.
 *
 * If today has a puzzle, play it. Otherwise fall back to the most recent
 * available date that isn't in the future. This keeps the game usable during
 * development, when today's file may not exist.
 */
export async function resolvePlayableDate(
    now: Date = new Date(),
): Promise<string> {
    const index = await fetchPuzzleIndex();
    if (index.length === 0) {
        throw new Error("Puzzle index is empty.");
    }

    const today = todayKey(now);
    if (index.includes(today)) return today;

    const past = index.filter((d) => d <= today).sort();
    if (past.length > 0) return past[past.length - 1];

    // All puzzles are in the future. Just take the earliest.
    return index.slice().sort()[0];
}

// Imported last to keep the file readable; date util used by resolvePlayableDate.
import { todayKey } from "./date";