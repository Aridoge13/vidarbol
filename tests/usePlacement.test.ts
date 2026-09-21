import { describe, it, expect } from "vitest";
import {
    placementReducer,
    type PlacementAction,
} from "../src/hooks/usePlacement";
import type { Puzzle } from "../src/types/puzzle";

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
    tree: {
        newick: "((a,b),(c,d));",
        leafIds: ["a", "b", "c", "d"],
    },
};

const run = (actions: PlacementAction[]) =>
    actions.reduce(placementReducer, placementReducer(undefined as never, { type: "INIT", puzzle }));

// Helper: fresh initial state.
const init = () => placementReducer(undefined as never, { type: "INIT", puzzle });

describe("placementReducer", () => {
    it("initializes with empty slots", () => {
        const s = init();
        expect(s.placement).toEqual([null, null, null, null]);
        expect(s.submitted).toBe(false);
        expect(s.result).toBeNull();
    });

    it("places a taxon into an empty slot", () => {
        const s = placementReducer(init(), { type: "PLACE", slotIndex: 0, taxonId: "a" });
        expect(s.placement).toEqual(["a", null, null, null]);
    });

    it("swaps when the taxon is already placed elsewhere", () => {
        let s = init();
        s = placementReducer(s, { type: "PLACE", slotIndex: 0, taxonId: "a" });
        s = placementReducer(s, { type: "PLACE", slotIndex: 1, taxonId: "b" });
        s = placementReducer(s, { type: "PLACE", slotIndex: 0, taxonId: "b" });
        expect(s.placement).toEqual(["b", "a", null, null]);
    });

    it("evicts the target taxon to the pool when placing from the pool", () => {
        let s = init();
        s = placementReducer(s, { type: "PLACE", slotIndex: 0, taxonId: "a" });
        s = placementReducer(s, { type: "PLACE", slotIndex: 0, taxonId: "c" });
        // 'a' is no longer anywhere.
        expect(s.placement).toEqual(["c", null, null, null]);
    });

    it("ignores out-of-range slot indices", () => {
        const before = init();
        const after = placementReducer(before, { type: "PLACE", slotIndex: 99, taxonId: "a" });
        expect(after).toBe(before);
    });

    it("clears a slot", () => {
        let s = init();
        s = placementReducer(s, { type: "PLACE", slotIndex: 2, taxonId: "c" });
        s = placementReducer(s, { type: "CLEAR", slotIndex: 2 });
        expect(s.placement).toEqual([null, null, null, null]);
    });

    it("ignores CLEAR on an empty slot", () => {
        const before = init();
        const after = placementReducer(before, { type: "CLEAR", slotIndex: 0 });
        expect(after).toBe(before);
    });

    it("resets placement and clears the result", () => {
        let s = init();
        s = placementReducer(s, { type: "PLACE", slotIndex: 0, taxonId: "a" });
        s = placementReducer(s, { type: "PLACE", slotIndex: 1, taxonId: "b" });
        s = placementReducer(s, { type: "PLACE", slotIndex: 2, taxonId: "c" });
        s = placementReducer(s, { type: "PLACE", slotIndex: 3, taxonId: "d" });
        s = placementReducer(s, { type: "SUBMIT", puzzle });
        s = placementReducer(s, { type: "RESET" });
        expect(s.placement).toEqual([null, null, null, null]);
        expect(s.submitted).toBe(false);
        expect(s.result).toBeNull();
    });

    it("does not submit an incomplete placement", () => {
        let s = init();
        s = placementReducer(s, { type: "PLACE", slotIndex: 0, taxonId: "a" });
        const after = placementReducer(s, { type: "SUBMIT", puzzle });
        expect(after.submitted).toBe(false);
        expect(after.result).toBeNull();
    });

    it("scores a correct placement at 100%", () => {
        let s = init();
        for (const [i, id] of ["a", "b", "c", "d"].entries()) {
            s = placementReducer(s, { type: "PLACE", slotIndex: i, taxonId: id });
        }
        s = placementReducer(s, { type: "SUBMIT", puzzle });
        expect(s.submitted).toBe(true);
        expect(s.result?.percent).toBe(100);
    });

    it("blocks PLACE and CLEAR after submit", () => {
        let s = init();
        for (const [i, id] of ["a", "b", "c", "d"].entries()) {
            s = placementReducer(s, { type: "PLACE", slotIndex: i, taxonId: id });
        }
        s = placementReducer(s, { type: "SUBMIT", puzzle });
        const before = s;
        s = placementReducer(s, { type: "PLACE", slotIndex: 0, taxonId: "d" });
        expect(s).toBe(before);
        s = placementReducer(s, { type: "CLEAR", slotIndex: 0 });
        expect(s).toBe(before);
    });
});