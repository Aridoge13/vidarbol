/**
 * TypeScript mirror of scripts/schema.py.
 *
 * If you change a field name here, change it in schema.py too.
 * Both must agree on the JSON shape in public/puzzles/*.json.
 */

export type Difficulty = "easy" | "medium" | "hard";

export interface Taxon {
    /** Slug used as the leaf label in the Newick string, e.g. "homo_sapiens". */
    id: string;
    /** Display name shown to the player, e.g. "Human" (or a scientific name for now). */
    name: string;
    /** Scientific name, e.g. "Homo sapiens". */
    sci_name: string;
    /** Open Tree of Life taxonomy id. */
    ott_id: number;
    /** Optional image path relative to /public. Empty string when missing. */
    image: string;
}

export interface PuzzleTree {
    /** Ground-truth tree in Newick format. Leaves are Taxon.id slugs. */
    newick: string;
    /** Taxon ids in left-to-right leaf order. Matches the Newick leaf order. */
    leafIds: string[];
}

export interface Puzzle {
    /** ISO date, e.g. "2026-09-18". */
    date: string;
    /** Clade name for display, e.g. "Hominidae". */
    clade: string;
    difficulty: Difficulty;
    /** Shuffled display order. May differ from tree.leafIds. */
    taxa: Taxon[];
    tree: PuzzleTree;
}

/**
 * Shape of public/puzzles/index.json.
 * It's just an array of ISO date strings, sorted ascending.
 */
export type PuzzleIndex = string[];