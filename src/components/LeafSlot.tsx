import { useState } from "react";
import { TAXON_MIME } from "./OrganismChip";
import type { Taxon } from "../types/puzzle";

interface LeafSlotProps {
    index: number;
    taxon: Taxon | null;
    selectedTaxonId: string | null;
    disabled?: boolean;
    onPlace: (slotIndex: number, taxonId: string) => void;
    onSelectPlaced: (taxonId: string) => void;
    onClear: (slotIndex: number) => void;
}

function Avatar({ taxon, size = 32 }: { taxon: Taxon; size?: number }) {
    const [failed, setFailed] = useState(false);

    if (!taxon.image || failed) {
        return (
            <span
                style={{ width: size, height: size }}
                className="flex shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800"
            >
                {taxon.name.charAt(0).toUpperCase()}
            </span>
        );
    }

    return (
        <img
            src={taxon.image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            style={{ width: size, height: size }}
            className="shrink-0 rounded-full object-cover ring-1 ring-stone-200"
        />
    );
}

export function LeafSlot({
    index,
    taxon,
    selectedTaxonId,
    disabled = false,
    onPlace,
    onSelectPlaced,
    onClear,
}: LeafSlotProps) {
    const isSelected = taxon !== null && selectedTaxonId === taxon.id;

    const handleClick = () => {
        if (disabled) return;
        if (selectedTaxonId && (!taxon || taxon.id !== selectedTaxonId)) {
            onPlace(index, selectedTaxonId);
            return;
        }
        if (taxon) onSelectPlaced(taxon.id);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (disabled) return;
        e.preventDefault();
        const id =
            e.dataTransfer.getData(TAXON_MIME) ||
            e.dataTransfer.getData("text/plain");
        if (id) onPlace(index, id);
    };

    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={
                taxon ? `Slot ${index + 1}: ${taxon.name}` : `Empty slot ${index + 1}`
            }
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
            onDragOver={(e) => {
                if (disabled) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            }}
            onDrop={handleDrop}
            className={[
                "group flex h-full w-full items-center gap-2 rounded-xl px-2.5 text-left text-sm",
                "transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f5f0]",
                taxon
                    ? "bg-white text-stone-800 shadow-sm ring-1 ring-stone-200"
                    : "border border-dashed border-stone-300 bg-stone-50/60 text-stone-400",
                isSelected && "ring-2 ring-teal-600 ring-offset-0",
                !disabled && "cursor-pointer",
                !disabled &&
                !taxon &&
                "hover:border-teal-500/60 hover:bg-teal-50/40 hover:text-teal-700",
                !disabled && taxon && "hover:ring-stone-300 hover:shadow",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {taxon ? (
                <>
                    <Avatar taxon={taxon} size={30} />
                    <span className="flex min-w-0 flex-col leading-tight">
                        <span className="truncate font-medium">{taxon.name}</span>
                        {taxon.sci_name !== taxon.name && (
                            <span className="truncate text-[10px] italic text-stone-500">
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
                            className="ml-auto rounded-full p-0.5 text-stone-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-stone-700 focus:opacity-100 focus:outline-none"
                        >
                            ×
                        </button>
                    )}
                </>
            ) : (
                <span className="mx-auto text-xs tracking-wide text-stone-400/80">
                    drop here
                </span>
            )}
        </div>
    );
}