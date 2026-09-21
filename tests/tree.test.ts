import { describe, it, expect } from "vitest";
import { parseNewick } from "../src/lib/newick";
import {
    indexTree,
    mrca,
    mrcaDepth,
    closestPair,
    pathToLeaf,
} from "../src/lib/tree";

const balanced = () => indexTree(parseNewick("((a,b),(c,d));"));
const nested = () => indexTree(parseNewick("(((a,b),c),d);"));
const unbalanced = () => indexTree(parseNewick("((((a,b),c),d),e);"));

describe("indexTree", () => {
    it("collects leaf ids in order", () => {
        expect(balanced().leafIds).toEqual(["a", "b", "c", "d"]);
    });

    it("records a path for every leaf", () => {
        const idx = balanced();
        for (const id of idx.leafIds) {
            expect(pathToLeaf(idx, id)).toBeDefined();
        }
    });

    it("returns undefined for unknown leaves", () => {
        expect(pathToLeaf(balanced(), "z")).toBeUndefined();
    });
});

describe("mrca", () => {
    it("returns the shared parent of sister leaves", () => {
        const idx = balanced();
        const node = mrca(idx, "a", "b");
        expect(node).not.toBeNull();
        // The parent of (a, b) is not the parent of (c, d).
        expect(node).not.toBe(mrca(idx, "c", "d"));
        // And it is not the root.
        expect(node).not.toBe(idx.root);
        // Its children are exactly a and b, in order.
        if (node && node.kind === "internal") {
            expect(node.children.map((c) => (c.kind === "leaf" ? c.id : "?")))
                .toEqual(["a", "b"]);
        }
    });;

    it("returns the root for leaves on opposite sides", () => {
        const idx = balanced();
        expect(mrca(idx, "a", "c")).toBe(idx.root);
        expect(mrca(idx, "b", "d")).toBe(idx.root);
    });

    it("returns null if a leaf is missing", () => {
        expect(mrca(balanced(), "a", "z")).toBeNull();
    });
});

describe("mrcaDepth", () => {
    it("ranks sisters above cousins above distant pairs", () => {
        const idx = nested(); // (((a,b),c),d)
        expect(mrcaDepth(idx, "a", "b")).toBeGreaterThan(mrcaDepth(idx, "a", "c"));
        expect(mrcaDepth(idx, "a", "c")).toBeGreaterThan(mrcaDepth(idx, "a", "d"));
    });

    it("returns -1 for missing leaves", () => {
        expect(mrcaDepth(balanced(), "a", "z")).toBe(-1);
    });
});

describe("closestPair", () => {
    it("picks the sisters in a balanced tree", () => {
        const idx = balanced();
        expect(closestPair(idx, ["a", "b", "c"])).toEqual(["a", "b"]);
        expect(closestPair(idx, ["a", "c", "d"])).toEqual(["c", "d"]);
        expect(closestPair(idx, ["b", "c", "d"])).toEqual(["c", "d"]);
    });

    it("picks the deepest pair in a nested tree", () => {
        const idx = nested(); // (((a,b),c),d)
        expect(closestPair(idx, ["a", "b", "c"])).toEqual(["a", "b"]);
        expect(closestPair(idx, ["a", "c", "d"])).toEqual(["a", "c"]);
    });

    it("works in unbalanced trees", () => {
        const idx = unbalanced(); // ((((a,b),c),d),e)
        expect(closestPair(idx, ["a", "b", "e"])).toEqual(["a", "b"]);
        expect(closestPair(idx, ["c", "d", "e"])).toEqual(["c", "d"]);
    });

    it("throws on unknown ids", () => {
        expect(() => closestPair(balanced(), ["a", "b", "z"])).toThrow();
    });
});