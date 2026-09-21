import {
    getLeafIds,
    isLeaf,
    type TreeNode,
} from "./newick";

/**
 * Precomputed index over a parsed tree.
 *
 * Scoring runs closestPair() for every triple of leaves — up to C(10,3) = 120
 * times per puzzle. Building the root-to-leaf paths once up front turns each
 * lookup into an O(depth) walk instead of a fresh tree traversal.
 */
export interface TreeIndex {
    readonly root: TreeNode;
    /** Leaf id -> path from root to that leaf (inclusive). */
    readonly paths: ReadonlyMap<string, readonly TreeNode[]>;
    /** Leaf ids in left-to-right order. */
    readonly leafIds: readonly string[];
}

export function indexTree(root: TreeNode): TreeIndex {
    const paths = new Map<string, TreeNode[]>();
    const stack: TreeNode[] = [];

    const walk = (node: TreeNode): void => {
        stack.push(node);
        if (isLeaf(node)) {
            // Copy so later pops don't mutate what we stored.
            paths.set(node.id, stack.slice());
        } else {
            for (const child of node.children) walk(child);
        }
        stack.pop();
    };

    walk(root);

    return {
        root,
        paths,
        leafIds: getLeafIds(root),
    };
}

/** Path from root to the given leaf, or undefined if the leaf isn't in the tree. */
export function pathToLeaf(
    index: TreeIndex,
    id: string,
): readonly TreeNode[] | undefined {
    return index.paths.get(id);
}

/**
 * Most recent common ancestor of two leaves.
 * Returns null if either leaf id is not in the tree.
 *
 * Safe for unbalanced trees and for internal nodes with any number of children.
 */
export function mrca(index: TreeIndex, a: string, b: string): TreeNode | null {
    const pa = index.paths.get(a);
    const pb = index.paths.get(b);
    if (!pa || !pb) return null;

    const n = Math.min(pa.length, pb.length);
    let last: TreeNode = pa[0];
    for (let i = 0; i < n; i++) {
        if (pa[i] !== pb[i]) break;
        last = pa[i];
    }
    return last;
}

/**
 * Depth of the MRCA of two leaves, measured as the index of the MRCA in the
 * root-to-leaf path. Root has depth 0. Higher = closer relationship.
 *
 * Returns -1 if either leaf id is not in the tree.
 */
export function mrcaDepth(index: TreeIndex, a: string, b: string): number {
    const pa = index.paths.get(a);
    const pb = index.paths.get(b);
    if (!pa || !pb) return -1;

    const n = Math.min(pa.length, pb.length);
    let depth = -1;
    for (let i = 0; i < n; i++) {
        if (pa[i] !== pb[i]) break;
        depth = i;
    }
    return depth;
}

/**
 * Given three leaf ids, return the pair that is most closely related
 * (the pair whose MRCA is deepest).
 *
 * In a strictly binary tree with three distinct leaves, the closest pair is
 * unique. In a polytomy, ties are possible; we break them deterministically
 * in the order (a,b), (a,c), (b,c). The correct answer for such a puzzle is
 * ambiguous anyway, so any deterministic rule works.
 *
 * Throws if any id is missing from the tree.
 */
export function closestPair(
    index: TreeIndex,
    ids: readonly [string, string, string],
): readonly [string, string] {
    const [a, b, c] = ids;

    const dAB = mrcaDepth(index, a, b);
    const dAC = mrcaDepth(index, a, c);
    const dBC = mrcaDepth(index, b, c);

    if (dAB < 0 || dAC < 0 || dBC < 0) {
        throw new Error(
            `closestPair: unknown leaf id in [${a}, ${b}, ${c}]`,
        );
    }

    if (dAB >= dAC && dAB >= dBC) return [a, b];
    if (dAC >= dBC) return [a, c];
    return [b, c];
}