import { formatDisplayDate } from "../lib/date";
import type { Difficulty } from "../types/puzzle";

interface HeaderProps {
    dateKey: string;
    clade: string;
    difficulty: Difficulty;
}

/** The same little tree as the favicon. */
function TreeMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <g fill="none" stroke="#0f766e" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 27h8M16 27v-7" />
                <path d="M16 20c0-4-6-3-6-7M16 20c0-4 6-3 6-7" />
                <path d="M10 13c0-3-4-3-4-6M10 13c0-3 3-3 3-7M22 13c0-3-3-3-3-7M22 13c0-3 4-3 4-6" />
            </g>
            <g fill="#0f766e">
                <circle cx="6" cy="7" r="2.1" />
                <circle cx="13" cy="6" r="2.1" />
                <circle cx="26" cy="7" r="2.1" />
            </g>
            <circle cx="19" cy="6" r="2.4" fill="#fbbf24" />
        </svg>
    );
}

export function Header({ dateKey, clade, difficulty }: HeaderProps) {
    return (
        <header className="mx-auto max-w-3xl px-6 pb-6 pt-8 text-center sm:pb-8 sm:pt-10">
            <div className="flex items-center justify-center gap-3">
                <TreeMark className="h-9 w-9 sm:h-12 sm:w-12" />
                <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                    Vidarbol
                </h1>
            </div>
            <svg
                viewBox="0 0 160 8"
                className="mx-auto mt-1 h-2 w-44"
                aria-hidden="true"
            >
                <path
                    d="M3 4 Q13 -1 23 4 T43 4 T63 4 T83 4 T103 4 T123 4 T143 4 T157 4"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                />
            </svg>
            <p className="mt-3 text-sm text-stone-600">
                {formatDisplayDate(dateKey)}
                <span className="mx-2 text-stone-400">·</span>
                {clade}
                <span className="mx-2 text-stone-400">·</span>
                <span className="capitalize">{difficulty}</span>
            </p>
            <p className="mt-2 text-sm text-stone-600">
                Place each organism where it belongs on the tree of life.
            </p>
        </header>
    );
}