import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { scorePuzzle, type ScoreResult } from "../lib/scoring";
import type { Puzzle, Taxon } from "../types/puzzle";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface PlacementState {
    /** slot index -> taxonId, or null for empty. Length = puzzle.tree.leafIds.length. */
    placement: (string | null)[];
    submitted: boolean;
    result: ScoreResult | null;
}

export type PlacementAction =
    | { type: "INIT"; puzzle: Puzzle }
    | { type: "PLACE"; slotIndex: number; taxonId: string }
    | { type: "CLEAR"; slotIndex: number }
    | { type: "RESET" }
    | { type: "SUBMIT"; puzzle: Puzzle };

function initState(puzzle: Puzzle): PlacementState {
    return {
        placement: puzzle.tree.leafIds.map(() => null),
        submitted: false,
        result: null,
    };
}

/**
 * Pure reducer. Exported for unit tests.
 *
 * Invariants maintained by this reducer:
 *   - placement.length === puzzle.tree.leafIds.length
 *   - no taxon id appears in two slots at once
 *   - once submitted, PLACE / CLEAR are no-ops until RESET
 */
export function placementReducer(
    state: PlacementState,
    action: PlacementAction,
): PlacementState {
    switch (action.type) {
        case "INIT":
            return initState(action.puzzle);

        case "PLACE": {
            if (state.submitted) return state;
            const { slotIndex, taxonId } = action;
            if (slotIndex < 0 || slotIndex >= state.placement.length) return state;

            const next = state.placement.slice();
            const prevIndex = next.indexOf(taxonId);
            const evicted = next[slotIndex];

            next[slotIndex] = taxonId;

            // If the taxon came from another slot, swap. If it came from the pool
            // (prevIndex === -1), the evicted taxon goes to the pool.
            if (prevIndex >= 0 && prevIndex !== slotIndex) {
                next[prevIndex] = evicted;
            }

            return { ...state, placement: next };
        }

        case "CLEAR": {
            if (state.submitted) return state;
            const { slotIndex } = action;
            if (slotIndex < 0 || slotIndex >= state.placement.length) return state;
            if (state.placement[slotIndex] === null) return state;

            const next = state.placement.slice();
            next[slotIndex] = null;
            return { ...state, placement: next };
        }

        case "RESET":
            return {
                ...state,
                placement: state.placement.map(() => null),
                submitted: false,
                result: null,
            };

        case "SUBMIT": {
            if (state.submitted) return state;
            if (state.placement.some((t) => t === null)) return state;

            const result = scorePuzzle(action.puzzle, state.placement as string[]);
            return { ...state, submitted: true, result };
        }

        default:
            return state;
    }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface Slot {
    index: number;
    taxonId: string | null;
    taxon: Taxon | null;
}

export interface UsePlacementResult {
    /** Every leaf slot, in left-to-right order. */
    slots: Slot[];
    /** Taxa not currently placed anywhere, in puzzle.taxa display order. */
    pool: Taxon[];
    /** True when every slot is filled. */
    isComplete: boolean;
    /** True after a successful submit. */
    submitted: boolean;
    /** Populated after submit. */
    result: ScoreResult | null;
    /** Move a taxon into a slot. Handles swap and eviction automatically. */
    place: (slotIndex: number, taxonId: string) => void;
    /** Empty a slot. No-op if already empty or if submitted. */
    clear: (slotIndex: number) => void;
    /** Wipe the placement and allow replay. Works even after submit. */
    reset: () => void;
    /** Score the current placement. No-op if incomplete or already submitted. */
    submit: () => void;
}

/**
 * Own the player's placement state for one puzzle.
 *
 * The parent should render the consuming component with `key={puzzle.date}`
 * so React remounts on date rollover. As a safety net, this hook also resets
 * when puzzle.date changes.
 */
export function usePlacement(puzzle: Puzzle): UsePlacementResult {
    const [state, dispatch] = useReducer(placementReducer, puzzle, initState);
    const lastDateRef = useRef(puzzle.date);

    useEffect(() => {
        if (lastDateRef.current !== puzzle.date) {
            lastDateRef.current = puzzle.date;
            dispatch({ type: "INIT", puzzle });
        }
    }, [puzzle]);

    const taxonById = useMemo(() => {
        const m = new Map<string, Taxon>();
        for (const t of puzzle.taxa) m.set(t.id, t);
        return m;
    }, [puzzle.taxa]);

    const slots = useMemo<Slot[]>(
        () =>
            state.placement.map((taxonId, index) => ({
                index,
                taxonId,
                taxon: taxonId ? taxonById.get(taxonId) ?? null : null,
            })),
        [state.placement, taxonById],
    );

    const pool = useMemo(() => {
        const placed = new Set(
            state.placement.filter((x): x is string => x !== null),
        );
        return puzzle.taxa.filter((t) => !placed.has(t.id));
    }, [puzzle.taxa, state.placement]);

    const isComplete = useMemo(
        () => state.placement.every((t) => t !== null),
        [state.placement],
    );

    const place = useCallback((slotIndex: number, taxonId: string) => {
        dispatch({ type: "PLACE", slotIndex, taxonId });
    }, []);

    const clear = useCallback((slotIndex: number) => {
        dispatch({ type: "CLEAR", slotIndex });
    }, []);

    const reset = useCallback(() => dispatch({ type: "RESET" }), []);

    const submit = useCallback(() => {
        dispatch({ type: "SUBMIT", puzzle });
    }, [puzzle]);

    return {
        slots,
        pool,
        isComplete,
        submitted: state.submitted,
        result: state.result,
        place,
        clear,
        reset,
        submit,
    };
}