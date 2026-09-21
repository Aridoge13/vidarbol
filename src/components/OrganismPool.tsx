import { OrganismChip } from "./OrganismChip";
import type { Taxon } from "../types/puzzle";

interface OrganismPoolProps {
    taxa: Taxon[];
    selectedTaxonId: string | null;
    disabled?: boolean;
    onSelect: (taxonId: string) => void;
    onDragStart: (taxonId: string) => void;
    onDragEnd: () => void;
}

/**
 * The set of organisms not yet placed on the tree.
 * Renders a list of chips; when empty, shows a hint.
 */
export function OrganismPool({
    taxa,
    selectedTaxonId,
    disabled = false,
    onSelect,
    onDragStart,
    onDragEnd,
}: OrganismPoolProps) {
    return (
        <section
            aria-label="Unplaced organisms"
            className="mx-auto max-w-xl px-4"
        >
            <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-stone-500">
                Organisms
            </h2>
            {taxa.length === 0 ? (
                <p className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-400">
                    All organisms placed. Tap a slot to change it.
                </p>
            ) : (
                <ul
                    role="listbox"
                    aria-label="Available organisms"
                    className="flex flex-wrap gap-2"
                >
                    {taxa.map((t) => (
                        <li key={t.id}>
                            <OrganismChip
                                taxon={t}
                                selected={selectedTaxonId === t.id}
                                disabled={disabled}
                                onSelect={onSelect}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}