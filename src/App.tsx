import { useState } from "react";
import { Header } from "./components/Header";
import { OrganismPool } from "./components/OrganismPool";
import { ResultPanel } from "./components/ResultPanel";
import { TreeCanvas } from "./components/TreeCanvas";
import { usePlacement } from "./hooks/usePlacement";
import { usePuzzle } from "./hooks/usePuzzle";
import type { Puzzle } from "./types/puzzle";

export default function App() {
    const { status, puzzle, dateKey, error, retry } = usePuzzle();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
                Loading today's puzzle…
            </div>
        );
    }

    if (status === "error" || !puzzle || !dateKey) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
                <p className="text-slate-700">
                    {error ?? "Could not load the puzzle."}
                </p>
                <button
                    onClick={retry}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <Game
            key={puzzle.date}
            puzzle={puzzle}
            dateKey={dateKey}
        />
    );
}

function Game({ puzzle, dateKey }: { puzzle: Puzzle; dateKey: string }) {
    const placement = usePlacement(puzzle);
    const [selected, setSelected] = useState<string | null>(null);

    const handlePlace = (slotIndex: number, taxonId: string) => {
        placement.place(slotIndex, taxonId);
        setSelected(null);
    };

    const handleToggleSelected = (taxonId: string) => {
        setSelected((s) => (s === taxonId ? null : taxonId));
    };

    const handleReplay = () => {
        placement.reset();
        setSelected(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <Header
                dateKey={dateKey}
                clade={puzzle.clade}
                difficulty={puzzle.difficulty}
            />

            <div className="mx-auto max-w-2xl px-4">
                <TreeCanvas
                    puzzle={puzzle}
                    slots={placement.slots}
                    selectedTaxonId={selected}
                    disabled={placement.submitted}
                    onPlace={handlePlace}
                    onSelectPlaced={handleToggleSelected}
                    onClear={placement.clear}
                />
            </div>

            {!placement.submitted ? (
                <div className="mx-auto mt-8 max-w-2xl">
                    <OrganismPool
                        taxa={placement.pool}
                        selectedTaxonId={selected}
                        disabled={placement.submitted}
                        onSelect={handleToggleSelected}
                        onDragStart={(id) => setSelected(id)}
                        onDragEnd={() => { }}
                    />

                    <div className="mt-6 flex justify-center px-4">
                        <button
                            type="button"
                            disabled={!placement.isComplete}
                            onClick={placement.submit}
                            className="rounded-full bg-stone-900 px-8 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
                        >
                            {placement.isComplete ? "Submit" : `Place all ${puzzle.taxa.length} organisms`}
                        </button>
                    </div>

                    <p className="mt-3 text-center text-xs text-slate-400">
                        Tap an organism, then tap a slot. Or drag on desktop.
                    </p>
                </div>
            ) : (
                placement.result && (
                    <ResultPanel
                        dateKey={dateKey}
                        clade={puzzle.clade}
                        result={placement.result}
                        onReplay={handleReplay}
                    />
                )
            )}
        </div>
    );
}