import { isLeaf, parseNewick, type TreeNode } from "./newick";
import { closestPair, indexTree, type TreeIndex } from "./tree";
import type { Puzzle } from "../types/puzzle";

export interface TripleResult {
    /** The three taxa ids, in canonical enumeration order. */
    taxa: readonly [string, string, string];
    /** Closest pair according to the ground-truth tree. */
    correctPair: readonly [string, string];
    /** Closest pair according to the player's tree. */
    playerPair: readonly [string, string];
    /** True if the two pairs agree (as unordered pairs). */
    ok: boolean;
}

export interface ScoreResult {
    /** Rounded integer 0-100. */
    percent: number;
    correctTriples: number;
    totalTriples: number;
    /** Every triple, for the result panel. */
    triples: readonly TripleResult[];
}

/**
 * Replace the leaf ids of `correctTree` with the taxon ids in `slotTaxa`.
 *
 * `slotTaxa[i]` is the taxon the player placed at the i-th leaf slot,
 * counting left-to-right in the ground-truth tree.
 *
 * The returned tree has the SAME topology as `correctTree` but different
 * leaf labels. That's exactly what a "player tree" is when the UI offers a
 * fixed scaffold.
 */
export function relabelTree(
    correctTree: TreeNode,
    slotTaxa: readonly string[],
): TreeNode {
    let i = 0;

    const walk = (node: TreeNode): TreeNode => {
        if (isLeaf(node)) {
            const id = slotTaxa[i];
            if (id === undefined) {
                throw new Error(
                    `relabelTree: ran out of slots at leaf ${i} (have ${slotTaxa.length})`,
                );
            }
            i++;
            return { kind: "leaf", id };
        }
        return { kind: "internal", children: node.children.map(walk) };
    };

    const result = walk(correctTree);
    if (i !== slotTaxa.length) {
        throw new Error(
            `relabelTree: ${slotTaxa.length} slots supplied but tree has ${i} leaves`,
        );
    }
    return result;
}

/** Compare two pairs of distinct ids as unordered pairs. */
function pairsEqual(
    a: readonly [string, string],
    b: readonly [string, string],
): boolean {
    return (
        (a[0] === b[0] && a[1] === b[1]) ||
        (a[0] === b[1] && a[1] === b[0])
    );
}

function* tripleIndices(n: number): Generator<[number, number, number]> {
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
            for (let k = j + 1; k < n; k++) yield [i, j, k];
}

/**
 * Triplet accuracy.
 *
 * For every unordered triple of taxa, ask which pair is more closely related.
 * The triple is correct iff the player's tree gives the same answer as the
 * ground-truth tree.
 *
 * Both trees must contain the same set of taxon ids as leaves.
 */
export function score(
    correctIndex: TreeIndex,
    playerIndex: TreeIndex,
    taxonIds: readonly string[],
): ScoreResult {
    if (taxonIds.length < 3) {
        throw new Error(
            `score: need at least 3 taxa, got ${taxonIds.length}`,
        );
    }

    const triples: TripleResult[] = [];
    let correct = 0;

    for (const [i, j, k] of tripleIndices(taxonIds.length)) {
        const taxa: [string, string, string] = [
            taxonIds[i],
            taxonIds[j],
            taxonIds[k],
        ];
        const correctPair = closestPair(correctIndex, taxa);
        const playerPair = closestPair(playerIndex, taxa);
        const ok = pairsEqual(correctPair, playerPair);
        if (ok) correct++;
        triples.push({ taxa, correctPair, playerPair, ok });
    }

    return {
        percent: Math.round((correct / triples.length) * 100),
        correctTriples: correct,
        totalTriples: triples.length,
        triples,
    };
}

/**
 * Score a full puzzle given the player's placement.
 *
 * `slotTaxa[i]` is the taxon id the player placed at the i-th leaf slot,
 * counting left-to-right in `puzzle.tree.leafIds`.
 */
export function scorePuzzle(
    puzzle: Puzzle,
    slotTaxa: readonly string[],
): ScoreResult {
    const correctRoot = parseNewick(puzzle.tree.newick);
    const correctIndex = indexTree(correctRoot);

    // Sanity: the Newick leaf order must match puzzle.tree.leafIds.
    if (
        correctIndex.leafIds.length !== puzzle.tree.leafIds.length ||
        correctIndex.leafIds.some((id, i) => id !== puzzle.tree.leafIds[i])
    ) {
        throw new Error(
            "scorePuzzle: puzzle.tree.newick leaf order does not match puzzle.tree.leafIds",
        );
    }

    const playerRoot = relabelTree(correctRoot, slotTaxa);
    const playerIndex = indexTree(playerRoot);

    // Enumerate triples in canonical tree order for deterministic tie-breaking.
    return score(correctIndex, playerIndex, puzzle.tree.leafIds);
}