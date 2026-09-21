/** @jsxRuntime classic */
/** @jsx React.createElement */
import * as React from "react";
import { useMemo } from "react";
import { isLeaf, parseNewick, type TreeNode } from "../lib/newick";
import { LeafSlot } from "./LeafSlot";
import type { Puzzle, Taxon } from "../types/puzzle";

// --- Layout constants -------------------------------------------------------

const H_SPACING = 56;       // slightly wider gap between depth levels
const V_SPACING = 60;       // slightly taller leaves
const SLOT_WIDTH = 152;     // matches updated LeafSlot
const SLOT_HEIGHT = 40;     // matches updated LeafSlot
const PADDING_LEFT = 28;
const PADDING_TOP = 28;
const PADDING_RIGHT = 28;
const PADDING_BOTTOM = 28;

const BRANCH_COLOR = "#0f766e";   // teal-700
const BRANCH_WIDTH = 1.8;

// --- Layout types -----------------------------------------------------------

interface LayoutNode {
    node: TreeNode;
    x: number;
    y: number;
    children: LayoutNode[];
}

// --- Layout algorithm -------------------------------------------------------

/** Number of edges from the root to the deepest leaf. */
function computeMaxDepth(root: TreeNode): number {
    if (isLeaf(root)) return 0;
    return 1 + Math.max(...root.children.map(computeMaxDepth));
}

/**
 * Assign x/y positions to every node.
 *
 * - Leaves are spaced evenly top-to-bottom, all at x = slotX.
 * - Internal nodes sit at x = PADDING_LEFT + depth * H_SPACING.
 * - Internal y is the midpoint of the first and last child's y. For binary
 *   trees this equals the average; for polytomies it keeps the branch tidy.
 *
 * Returns the laid-out root, the number of leaves, and the total height.
 */
function layoutTree(
    root: TreeNode,
    slotX: number,
): { root: LayoutNode; numLeaves: number; height: number } {
    let leafIndex = 0;

    const visit = (node: TreeNode, depth: number): LayoutNode => {
        if (isLeaf(node)) {
            const y = PADDING_TOP + leafIndex * V_SPACING;
            leafIndex++;
            return { node, x: slotX, y, children: [] };
        }
        const children = node.children.map((c) => visit(c, depth + 1));
        const x = PADDING_LEFT + depth * H_SPACING;
        const y = (children[0].y + children[children.length - 1].y) / 2;
        return { node, x, y, children };
    };

    const laidOut = visit(root, 0);
    const numLeaves = leafIndex;
    const height =
        PADDING_TOP + Math.max(0, numLeaves - 1) * V_SPACING + PADDING_BOTTOM;

    return { root: laidOut, numLeaves, height };
}

/** Collect leaf layout nodes in left-to-right order. */
function collectLeaves(node: LayoutNode): LayoutNode[] {
    if (node.children.length === 0) return [node];
    return node.children.flatMap(collectLeaves);
}

/**
 * Build a single SVG path string covering all branches under `node`.
 *
 * For each internal node:
 *   - one vertical segment at node.x spanning the first-to-last child y
 *   - one horizontal segment from node.x to child.x at each child's y
 *   - recurse into each child
 */
function buildBranchPath(node: LayoutNode): string {
    if (node.children.length === 0) return "";

    const parts: string[] = [];

    const ys = node.children.map((c) => c.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    if (maxY > minY) {
        parts.push(`M ${node.x} ${minY} L ${node.x} ${maxY}`);
    }

    for (const child of node.children) {
        parts.push(`M ${node.x} ${child.y} L ${child.x} ${child.y}`);
        const sub = buildBranchPath(child);
        if (sub) parts.push(sub);
    }

    return parts.join(" ");
}

// --- Component --------------------------------------------------------------

export interface TreeCanvasSlot {
    index: number;
    taxonId: string | null;
    taxon: Taxon | null;
}

interface TreeCanvasProps {
    puzzle: Puzzle;
    slots: TreeCanvasSlot[];
    selectedTaxonId: string | null;
    disabled?: boolean;
    onPlace: (slotIndex: number, taxonId: string) => void;
    onSelectPlaced: (taxonId: string) => void;
    onClear: (slotIndex: number) => void;
}

export function TreeCanvas({
    puzzle,
    slots,
    selectedTaxonId,
    disabled = false,
    onPlace,
    onSelectPlaced,
    onClear,
}: TreeCanvasProps) {
    const { path, leafLayouts, width, height } = useMemo(() => {
        const root = parseNewick(puzzle.tree.newick);
        const maxDepth = computeMaxDepth(root);
        const slotX = PADDING_LEFT + maxDepth * H_SPACING;

        const { root: layoutRoot, height } = layoutTree(root, slotX);
        const leafLayouts = collectLeaves(layoutRoot);
        const path = buildBranchPath(layoutRoot);
        const width = slotX + SLOT_WIDTH + PADDING_RIGHT;

        return { path, leafLayouts, width, height };
    }, [puzzle.tree.newick]);

    return (
        <div className="overflow-x-auto rounded-2xl bg-white/60 p-2 ring-1 ring-stone-200/60">
            <div
                className="relative mx-auto"
                style={{ width, height, minWidth: width }}
                role="tree"
                aria-label="Phylogenetic tree"
            >
                <svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    className="absolute inset-0"
                    aria-hidden="true"
                >
                    <path
                        d={path}
                        fill="none"
                        stroke={BRANCH_COLOR}
                        strokeWidth={BRANCH_WIDTH}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Small root marker: a filled dot at the root position. */}
                    <circle
                        cx={PADDING_LEFT}
                        cy={leafLayouts.length > 0 ? (leafLayouts[0].y + leafLayouts[leafLayouts.length - 1].y) / 2 : 0}
                        r={3}
                        fill={BRANCH_COLOR}
                    />
                </svg>

                {leafLayouts.map((leafLayout, i) => {
                    const slot = slots[i];
                    if (!slot) return null;
                    return (
                        <div
                            key={slot.index}
                            className="absolute"
                            style={{
                                left: leafLayout.x,
                                top: leafLayout.y - SLOT_HEIGHT / 2,
                                width: SLOT_WIDTH,
                                height: SLOT_HEIGHT,
                            }}
                        >
                            <LeafSlot
                                index={slot.index}
                                taxon={slot.taxon}
                                selectedTaxonId={selectedTaxonId}
                                disabled={disabled}
                                onPlace={onPlace}
                                onSelectPlaced={onSelectPlaced}
                                onClear={onClear}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}