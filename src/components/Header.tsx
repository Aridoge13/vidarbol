import { formatDisplayDate } from "../lib/date";
import type { Difficulty } from "../types/puzzle";

interface HeaderProps {
    dateKey: string;
    clade: string;
    difficulty: Difficulty;
}

export function Header({ dateKey, clade, difficulty }: HeaderProps) {
    return (
        <header className="mx-auto max-w-2xl px-6 pt-10 pb-8 text-center">
            <div className="flex items-center justify-center gap-2">
                <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-teal-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M12 21v-6" />
                    <path d="M12 15c-3 0-6-2-6-6 3 0 6 2 6 6z" />
                    <path d="M12 15c3 0 6-2 6-6-3 0-6 2-6 6z" />
                    <path d="M12 9V3" />
                </svg>
                <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
                    Vidarbol
                </h1>
            </div>
            <p className="mt-2 text-sm text-stone-500">
                {formatDisplayDate(dateKey)}
                <span className="mx-2 text-stone-300">·</span>
                {clade}
                <span className="mx-2 text-stone-300">·</span>
                <span className="capitalize">{difficulty}</span>
            </p>
        </header>
    );
}