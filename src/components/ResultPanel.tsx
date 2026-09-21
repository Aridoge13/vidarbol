/** @jsxRuntime classic */
import * as React from "react";
import { useRef } from "react";
import { ResultCard } from "./ResultCard";
import { ShareButton } from "./ShareButton";
import type { ScoreResult } from "../lib/scoring";

interface ResultPanelProps {
    dateKey: string;
    clade: string;
    result: ScoreResult;
    onReplay: () => void;
}

const PASS_THRESHOLD = 55;

export function ResultPanel({
    dateKey,
    clade,
    result,
    onReplay,
}: ResultPanelProps) {
    const cardRef = useRef<HTMLDivElement>(null!);
    const passed = result.percent >= PASS_THRESHOLD;

    return (
        <section
            aria-label="Result"
            className="mx-auto mt-6 flex max-w-xl flex-col items-start gap-4 px-4"
        >
            <div ref={cardRef}>
                <ResultCard dateKey={dateKey} clade={clade} result={result} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <ShareButton
                    targetRef={cardRef}
                    dateKey={dateKey}
                    clade={clade}
                    percent={result.percent}
                />
                <button
                    type="button"
                    onClick={onReplay}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                    Try again
                </button>
            </div>

            {!passed && (
                <p className="text-sm text-slate-500">
                    Score {PASS_THRESHOLD}% or higher to pass. You were close —{" "}
                    {result.totalTriples - result.correctTriples} relationships to go.
                </p>
            )}
        </section>
    );
}