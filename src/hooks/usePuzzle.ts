// React is provided by the application runtime; keep this file type-checkable
// in environments where its dependency types are not installed locally.

// React is supplied by the application runtime; its types may be unavailable
// in lightweight type-checking environments.
import { useCallback, useEffect, useState } from "react";
import { fetchPuzzle, resolvePlayableDate } from "../lib/puzzle";
import type { Puzzle } from "../types/puzzle";

export type PuzzleStatus = "loading" | "error" | "ready";

export interface UsePuzzleResult {
    status: PuzzleStatus;
    /** Populated only when status === "ready". */
    puzzle: Puzzle | null;
    /** ISO date key for the current puzzle, e.g. "2026-09-18". */
    dateKey: string | null;
    /** Populated only when status === "error". */
    error: string | null;
    /** Re-run the fetch. Safe to call from an error screen. */
    retry: () => void;
}

/**
 * Load today's puzzle.
 *
 * Resolves the playable date from public/puzzles/index.json, then fetches
 * that puzzle and runs runtime validation. Never throws — errors surface
 * via the returned `error` field.
 *
 * Development-friendly: if today's puzzle file doesn't exist, this falls
 * back to the most recent available date.
 */
export function usePuzzle(): UsePuzzleResult {
    const [status, setStatus] = useState<PuzzleStatus>("loading");
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [dateKey, setDateKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        setError(null);

        (async () => {
            try {
                const key = await resolvePlayableDate();
                const p = await fetchPuzzle(key);
                if (cancelled) return;
                setPuzzle(p);
                setDateKey(key);
                setStatus("ready");
            } catch (e) {
                if (cancelled) return;
                setError((e as Error).message);
                setStatus("error");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [attempt]);

    const retry = useCallback(() => setAttempt((a: number) => a + 1), []);

    return { status, puzzle, dateKey, error, retry };
}