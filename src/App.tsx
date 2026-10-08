import { useState } from "react";
import { Header } from "./components/Header";
import { OrganismPool } from "./components/OrganismPool";
import { PageDoodles } from "./components/PageDoodles";
import { ResultPanel } from "./components/ResultPanel";
import { TreeCanvas } from "./components/TreeCanvas";
import { usePlacement } from "./hooks/usePlacement";
import { usePuzzle } from "./hooks/usePuzzle";
import type { Puzzle } from "./types/puzzle";

export default function App() {
    const { status, puzzle, dateKey, error, retry } = usePuzzle();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center text-stone-600">
                Loading today's puzzle…
            </div>
        );
    }

    if (status === "error" || !puzzle || !dateKey) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="text-stone-700">
                    {error ?? "Could not load the puzzle."}
                </p>
                <button
                    onClick={retry}
                    className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700"
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

    // For the hint line: the name of whatever is currently picked up.
    const left = placement.pool.length;
    const known = [...placement.pool, ...placement.slots.map((s) => s.taxon)];
    const selectedName = known.find((t) => t && t.id === selected)?.name;

    return (
        <div className="relative min-h-screen overflow-x-hidden pb-24 lg:pb-16">
            <PageDoodles />

            <Header
                dateKey={dateKey}
                clade={puzzle.clade}
                difficulty={puzzle.difficulty}
            />

            {/* Phone: tree on top, organisms in a sticky tray below.
                Desktop (lg+): tree on the left, sticky side panel on the right. */}
            <main className="relative mx-auto grid max-w-6xl gap-6 px-2 sm:px-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8 lg:px-8 2xl:max-w-7xl">
                <TreeCanvas
                    puzzle={puzzle}
                    slots={placement.slots}
                    selectedTaxonId={selected}
                    disabled={placement.submitted}
                    onPlace={handlePlace}
                    onSelectPlaced={handleToggleSelected}
                    onClear={placement.clear}
                />

                <aside
                    className={
                        placement.submitted
                            ? "px-2 lg:sticky lg:top-6 lg:px-0"
                            : [
                                "sticky bottom-0 z-10 -mx-2 max-h-[45vh] overflow-y-auto border-t border-stone-200 bg-[#f7f5f0]/95 px-4 py-3 backdrop-blur sm:-mx-4",
                                "lg:top-6 lg:bottom-auto lg:mx-0 lg:max-h-none lg:overflow-visible lg:rounded-3xl lg:border-2 lg:border-dashed lg:border-stone-300 lg:bg-white/70 lg:p-5 lg:backdrop-blur-none",
                            ].join(" ")
                    }
                >
                    {!placement.submitted ? (
                        <>
                            <OrganismPool
                                taxa={placement.pool}
                                selectedTaxonId={selected}
                                disabled={placement.submitted}
                                onSelect={handleToggleSelected}
                                onDragStart={(id) => setSelected(id)}
                                onDragEnd={() => { }}
                            />

                            <button
                                type="button"
                                disabled={!placement.isComplete}
                                onClick={placement.submit}
                                className="mt-4 w-full rounded-full bg-stone-900 px-8 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-600 disabled:shadow-none"
                            >
                                {placement.isComplete ? "Submit" : `${left} left to place`}
                            </button>

                            <p className="mt-3 text-center text-xs text-stone-600">
                                {selectedName
                                    ? `Now tap a slot for ${selectedName}`
                                    : "Tap an organism, then a slot. Or drag it onto the tree."}
                            </p>
                        </>
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
                </aside>
            </main>
        </div>
    );
}