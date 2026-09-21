import { describe, it, expect } from "vitest";
import { parseNewick } from "../src/lib/newick";
import { indexTree } from "../src/lib/tree";
import { relabelTree, score, scorePuzzle } from "../src/lib/scoring";
import type { Puzzle } from "../src/types/puzzle";

const TREE_4 = "((a,b),(c,d));";
const TREE_6 = "(((a,b),c),((d,e),f));";

const idx4 = () => indexTree(parseNewick(TREE_4));
const idx6 = () => indexTree(parseNewick(TREE_6));

describe("relabelTree", () => {
    it("replaces leaf ids in left-to-right order", () => {
        const t = relabelTree(parseNewick(TREE_4), ["w", "x", "y", "z"]);
        expect(t).toEqual(parseNewick("((w,x),(y,z));"));
    });

    it("throws when slots are too few", () => {
        expect(() => relabelTree(parseNewick(TREE_4), ["w", "x"])).toThrow();
    });

    it("throws when slots are too many", () => {
        expect(() =>
            relabelTree(parseNewick(TREE_4), ["w", "x", "y", "z", "extra"]),
        ).toThrow();
    });
});

describe("score", () => {
    it("returns 100% for an identical tree", () => {
        const r = score(idx4(), idx4(), ["a", "b", "c", "d"]);
        expect(r.percent).toBe(100);
        expect(r.correctTriples).toBe(r.totalTriples);
        expect(r.totalTriples).toBe(4); // C(4,3)
    });

    it("still returns 100% after swapping sister leaves", () => {
        // Player placed them as ((b,a),(d,c)). Same topology as ((a,b),(c,d)).
        const player = indexTree(parseNewick("((b,a),(d,c));"));
        const r = score(idx4(), player, ["a", "b", "c", "d"]);
        expect(r.percent).toBe(100);
    });

    it("returns 0% when the topology is completely wrong", () => {
        // ((a,c),(b,d)) is a different topology from ((a,b),(c,d)).
        const player = indexTree(parseNewick("((a,c),(b,d));"));
        const r = score(idx4(), player, ["a", "b", "c", "d"]);
        expect(r.percent).toBe(0);
    });

    it("gives partial credit on larger trees", () => {
        // Correct: (((a,b),c),((d,e),f))
        // Player:  (((a,b),f),((d,e),c))  — c and f swapped.
        const player = indexTree(parseNewick("(((a,b),f),((d,e),c));"));
        const r = score(idx6(), player, ["a", "b", "c", "d", "e", "f"]);
        expect(r.totalTriples).toBe(20); // C(6,3)
        expect(r.percent).toBeGreaterThan(0);
        expect(r.percent).toBeLessThan(100);
    });

    it("throws when fewer than 3 taxa are given", () => {
        expect(() => score(idx4(), idx4(), ["a", "b"])).toThrow();
    });

    it("is symmetric under identical relabeling", () => {
        const player = indexTree(parseNewick("((a,b),(c,d));"));
        const a = score(idx4(), player, ["a", "b", "c", "d"]);
        const b = score(idx4(), player, ["d", "c", "b", "a"]);
        expect(a.percent).toBe(b.percent);
    });
});

describe("scorePuzzle", () => {
    const puzzle: Puzzle = {
        date: "2026-09-18",
        clade: "Test",
        difficulty: "easy",
        taxa: [
            { id: "a", name: "A", sci_name: "A", ott_id: 1, image: "" },
            { id: "b", name: "B", sci_name: "B", ott_id: 2, image: "" },
            { id: "c", name: "C", sci_name: "C", ott_id: 3, image: "" },
            { id: "d", name: "D", sci_name: "D", ott_id: 4, image: "" },
        ],
        tree: { newick: TREE_4, leafIds: ["a", "b", "c", "d"] },
    };

    it("returns 100% when the player matches the ground truth", () => {
        expect(scorePuzzle(puzzle, ["a", "b", "c", "d"]).percent).toBe(100);
    });

    it("returns 100% when the player swaps sisters", () => {
        expect(scorePuzzle(puzzle, ["b", "a", "d", "c"]).percent).toBe(100);
    });

    it("returns 0% for the wrong topology", () => {
        expect(scorePuzzle(puzzle, ["a", "c", "b", "d"]).percent).toBe(0);
    });

    it("throws if newick leaf order does not match leafIds", () => {
        const bad: Puzzle = {
            ...puzzle,
            tree: { newick: TREE_4, leafIds: ["b", "a", "c", "d"] },
        };
        expect(() => scorePuzzle(bad, ["a", "b", "c", "d"])).toThrow();
    });
});