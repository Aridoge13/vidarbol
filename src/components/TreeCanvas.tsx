/** @jsxRuntime classic */
/** @jsx React.createElement */
import * as React from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { isLeaf, parseNewick, type TreeNode } from "../lib/newick";
import { LeafSlot } from "./LeafSlot";
import type { Puzzle, Taxon } from "../types/puzzle";

// --- Layout constants -------------------------------------------------------

interface Dims {
    hSpacing: number;     // gap between depth levels
    vSpacing: number;     // gap between leaves
    slotWidth: number;
    slotHeight: number;
    padLeft: number;      // includes room for the trunk stub
    padTop: number;
    padRight: number;
    padBottom: number;
    trunk: number;
}

const ROOMY: Dims = {
    hSpacing: 72, vSpacing: 64, slotWidth: 192, slotHeight: 56,
    padLeft: 44, padTop: 32, padRight: 28, padBottom: 32, trunk: 34,
};

// Phones: narrower gaps and slots so the whole tree fits without scrolling.
const COMPACT: Dims = {
    hSpacing: 30, vSpacing: 58, slotWidth: 158, slotHeight: 52,
    padLeft: 30, padTop: 24, padRight: 8, padBottom: 24, trunk: 22,
};

const COMPACT_BELOW = 640;  // px of window width
const MIN_SCALE = 0.6;      // below this the tree scrolls sideways instead
const MAX_SCALE = 1.35;     // how much the tree may grow on big screens

const BRANCH_COLOR = "#0f766e";   // teal-700

/** Thicker near the root, thinner at the tips. */
function widthFor(leaves: number): number {
    return Math.min(10, 2.6 + 1.6 * Math.sqrt(leaves));
}

/** Stable pseudo-random number in [-amp, amp] for the hand-drawn wobble. */
function jitter(n: number, amp: number): number {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return (s - Math.floor(s) - 0.5) * 2 * amp;
}

// --- Layout types -----------------------------------------------------------

interface LayoutNode {
    node: TreeNode;
    x: number;
    y: number;
    leaves: number;
    children: LayoutNode[];
}

interface Edge {
    d: string;
    w: number;
}

// --- Layout algorithm -------------------------------------------------------

function computeMaxDepth(root: TreeNode): number {
    if (isLeaf(root)) return 0;
    return 1 + Math.max(...root.children.map(computeMaxDepth));
}

function layoutTree(
    root: TreeNode,
    slotX: number,
    d: Dims,
): { root: LayoutNode; numLeaves: number; height: number } {
    let leafIndex = 0;

    const visit = (node: TreeNode, depth: number): LayoutNode => {
        if (isLeaf(node)) {
            const y = d.padTop + leafIndex * d.vSpacing;
            leafIndex++;
            return { node, x: slotX, y, leaves: 1, children: [] };
        }
        const children = node.children.map((c) => visit(c, depth + 1));
        const x = d.padLeft + depth * d.hSpacing;
        const y = (children[0].y + children[children.length - 1].y) / 2;
        const leaves = children.reduce((sum, c) => sum + c.leaves, 0);
        return { node, x, y, leaves, children };
    };

    const laidOut = visit(root, 0);
    const numLeaves = leafIndex;
    const height = d.padTop + Math.max(0, numLeaves - 1) * d.vSpacing + d.padBottom;

    return { root: laidOut, numLeaves, height };
}

function collectLeaves(node: LayoutNode): LayoutNode[] {
    if (node.children.length === 0) return [node];
    return node.children.flatMap(collectLeaves);
}

/** One slightly irregular S-curve per parent -> child edge. */
function buildEdges(node: LayoutNode, out: Edge[] = []): Edge[] {
    for (const child of node.children) {
        const i = out.length;
        const endX = child.children.length === 0 ? child.x - 4 : child.x;
        const dx = endX - node.x;
        const c1x = node.x + dx * (0.5 + jitter(i * 4 + 1, 0.08));
        const c1y = node.y + jitter(i * 4 + 2, 4);
        const c2x = node.x + dx * (0.5 + jitter(i * 4 + 3, 0.08));
        const c2y = child.y + jitter(i * 4 + 4, 4);
        out.push({
            d: `M ${node.x} ${node.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${child.y}`,
            w: widthFor(child.leaves),
        });
        buildEdges(child, out);
    }
    return out;
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
    const [compact, setCompact] = useState(
        () => typeof window !== "undefined" && window.innerWidth < COMPACT_BELOW,
    );
    const dims = compact ? COMPACT : ROOMY;

    const { edges, trunk, leafLayouts, width, height } = useMemo(() => {
        const root = parseNewick(puzzle.tree.newick);
        const maxDepth = computeMaxDepth(root);
        const slotX = dims.padLeft + maxDepth * dims.hSpacing;

        const { root: layoutRoot, height } = layoutTree(root, slotX, dims);
        const leafLayouts = collectLeaves(layoutRoot);
        const edges = buildEdges(layoutRoot);
        const trunk: Edge = {
            d: `M ${dims.padLeft - dims.trunk} ${layoutRoot.y} L ${layoutRoot.x} ${layoutRoot.y}`,
            w: widthFor(layoutRoot.leaves) + 1.5,
        };
        const width = slotX + dims.slotWidth + dims.padRight;

        return { edges, trunk, leafLayouts, width, height };
    }, [puzzle.tree.newick, dims]);

    // Fit the tree to its card: shrink a little on phones, grow on big
    // screens, but on desktop never taller than ~85% of the window.
    const frameRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
        const el = frameRef.current;
        if (!el) return;
        const fit = () => {
            setCompact(window.innerWidth < COMPACT_BELOW);
            const byWidth = (el.clientWidth - 16) / width;
            const byHeight =
                window.innerWidth >= 1024 ? (window.innerHeight * 0.85) / height : Infinity;
            setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, byWidth, byHeight)));
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        window.addEventListener("resize", fit);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", fit);
        };
    }, [width, height]);

    return (
        <div
            ref={frameRef}
            className="overflow-x-auto rounded-3xl bg-white/70 p-2 shadow-sm ring-1 ring-stone-200/70 sm:p-4"
        >
            <div className="mx-auto" style={{ width: width * scale, height: height * scale }}>
                <div
                    className="relative"
                    style={{
                        width,
                        height,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                    }}
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
                        <g
                            fill="none"
                            stroke={BRANCH_COLOR}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d={trunk.d} strokeWidth={trunk.w} />
                            {edges.map((e, i) => (
                                <path key={i} d={e.d} strokeWidth={e.w} />
                            ))}
                        </g>
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
                                    top: leafLayout.y - dims.slotHeight / 2,
                                    width: dims.slotWidth,
                                    height: dims.slotHeight,
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
        </div>
    );
}