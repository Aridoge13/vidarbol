import { useState } from "react";
import type { Taxon } from "../types/puzzle";
import { TAXON_MIME } from "./OrganismChip";
import { OrganismDoodle } from "./OrganismDoodle";

interface LeafSlotProps {
    index: number;
    taxon: Taxon | null;
    selectedTaxonId: string | null;
    disabled?: boolean;
    /** Smaller doodle and text, used on phones. */
    compact?: boolean;
    onPlace: (slotIndex: number, taxonId: string) => void;
    onSelectPlaced: (taxonId: string) => void;
    onClear: (slotIndex: number) => void;
}

/** One landing spot at the tip of a branch. */
export function LeafSlot({
    index,
    taxon,
    selectedTaxonId,
    disabled = false,
    compact = false,
    onPlace,
    onSelectPlaced,
    onClear,
}: LeafSlotProps) {
    const [over, setOver] = useState(false);

    const isSelected = !!taxon && selectedTaxonId === taxon.id;
    // An organism is picked up and this slot would receive it on click.
    const armed = !disabled && selectedTaxonId !== null && selectedTaxonId !== taxon?.id;

    const activate = () => {
        if (disabled) return;
        if (selectedTaxonId && selectedTaxonId !== taxon?.id) {
            onPlace(index, selectedTaxonId);
        } else if (taxon) {
            onSelectPlaced(taxon.id);
        }
    };

    const state = taxon
        ? over
            ? "border-amber-400 bg-amber-50"
            : isSelected
                ? "border-teal-600 bg-white ring-2 ring-teal-600/30"
                : armed
                    ? "border-amber-300 bg-white"
                    : "border-stone-300 bg-white"
        : over || armed
            ? "border-dashed border-amber-400 bg-amber-50/80"
            : "border-dashed border-stone-400 bg-white/60";

    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={taxon ? `Slot ${index + 1}: ${taxon.name}` : `Empty slot ${index + 1}`}
            aria-disabled={disabled || undefined}
            onClick={activate}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    activate();
                }
            }}
            onDragOver={(e) => {
                if (disabled) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            }}
            onDragEnter={() => {
                if (!disabled) setOver(true);
            }}
            onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
            }}
            onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                if (disabled) return;
                const id = e.dataTransfer.getData(TAXON_MIME) || e.dataTransfer.getData("text/plain");
                if (id) onPlace(index, id);
            }}
            className={[
                "group relative flex h-full w-full items-center rounded-2xl border-2 text-left",
                compact ? "gap-1.5 px-1.5" : "gap-2 px-2",
                "transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f5f0]",
                state,
                disabled ? "cursor-default" : "cursor-pointer",
                !disabled && !over ? "hover:border-stone-500" : "",
                over ? "scale-[1.03]" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {taxon ? (
                <>
                    <OrganismDoodle
                        taxon={taxon}
                        className={compact ? "h-8 w-8 shrink-0" : "h-10 w-10 shrink-0"}
                    />
                    <span className="flex min-w-0 flex-col leading-tight">
                        <span
                            className={`break-words font-medium text-stone-800 ${compact ? "text-xs" : "text-sm"}`}
                        >
                            {taxon.name}
                        </span>
                        {taxon.sci_name !== taxon.name && (
                            <span
                                className={`break-words italic text-stone-500 ${compact ? "text-[9.5px]" : "text-[10.5px]"}`}
                            >
                                {taxon.sci_name}
                            </span>
                        )}
                    </span>
                    {!disabled && (
                        <button
                            type="button"
                            aria-label={`Remove ${taxon.name}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear(index);
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 bg-white text-sm leading-none text-stone-600 opacity-0 shadow-sm transition hover:bg-stone-100 focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100"
                        >
                            ×
                        </button>
                    )}
                </>
            ) : (
                <>
                    <span
                        aria-hidden="true"
                        className={`flex shrink-0 items-center justify-center rounded-full border-2 border-dashed border-amber-400 font-bold text-amber-500 ${compact ? "h-7 w-7 text-sm" : "h-8 w-8 text-base"}`}
                    >
                        ?
                    </span>
                    <span className={`text-stone-500 ${compact ? "text-xs" : "text-sm"}`}>place here</span>
                </>
            )}
        </div>
    );
}