import type { Taxon } from "../types/puzzle";
import { OrganismDoodle } from "./OrganismDoodle";

export const TAXON_MIME = "application/x-vidarbol-taxon";

interface OrganismChipProps {
    taxon: Taxon;
    selected?: boolean;
    disabled?: boolean;
    onSelect?: (taxonId: string) => void;
    onDragStart?: (taxonId: string) => void;
    onDragEnd?: () => void;
}

export function OrganismChip({
    taxon,
    selected = false,
    disabled = false,
    onSelect,
    onDragStart,
    onDragEnd,
}: OrganismChipProps) {
    return (
        <button
            type="button"
            role="option"
            aria-selected={selected}
            disabled={disabled}
            draggable={!disabled}
            onDragStart={(e) => {
                e.dataTransfer.setData(TAXON_MIME, taxon.id);
                e.dataTransfer.setData("text/plain", taxon.id);
                e.dataTransfer.effectAllowed = "move";
                onDragStart?.(taxon.id);
            }}
            onDragEnd={() => onDragEnd?.()}
            onClick={() => {
                if (!disabled) onSelect?.(taxon.id);
            }}
            className={[
                "inline-flex max-w-full items-center gap-2 rounded-full border py-1 pl-1.5 pr-3.5",
                "text-sm transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f5f0]",
                disabled
                    ? "cursor-default border-stone-200 bg-stone-100 text-stone-400"
                    : "cursor-pointer",
                !disabled && selected
                    ? "border-teal-600 bg-teal-50 text-teal-900 shadow-sm"
                    : !disabled
                        ? "border-stone-300 bg-white text-stone-700 shadow-sm hover:-translate-y-px hover:border-stone-400 hover:shadow"
                        : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <OrganismDoodle taxon={taxon} className="h-8 w-8 shrink-0" />
            <span className="flex flex-col items-start leading-tight">
                <span className="truncate font-medium">{taxon.name}</span>
                {taxon.sci_name !== taxon.name && (
                    <span className="truncate text-[11px] italic text-stone-500">
                        {taxon.sci_name}
                    </span>
                )}
            </span>
        </button>
    );
}