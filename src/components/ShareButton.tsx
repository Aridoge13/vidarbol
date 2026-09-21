/** @jsx React.createElement */
/** @jsxRuntime classic */
import React, { useRef, useState } from "react";
import {
    buildShareFilename,
    buildShareText,
    shareResult,
    type ShareOutcome,
} from "../lib/share";

interface ShareButtonProps {
    /** Element to capture. Typically the ResultCard wrapper. */
    targetRef: React.RefObject<HTMLElement>;
    dateKey: string;
    clade: string;
    percent: number;
}

function statusMessage(outcome: ShareOutcome): string {
    switch (outcome.method) {
        case "shared":
            return "Shared.";
        case "downloaded":
            return "Image downloaded.";
        case "copied":
            return "Copied to clipboard.";
        case "cancelled":
            return "Share cancelled.";
        case "failed":
            return outcome.error ?? "Could not share.";
    }
}

export function ShareButton({
    targetRef,
    dateKey,
    clade,
    percent,
}: ShareButtonProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const onClick = async () => {
        const el = targetRef.current;
        if (!el || busy) return;

        setBusy(true);
        setMessage(null);

        const url = typeof window !== "undefined" ? window.location.origin : "";
        const outcome = await shareResult({
            element: el,
            fileName: buildShareFilename(dateKey, percent),
            title: "Vidarbol",
            text: buildShareText({ dateKey, percent, clade, url }),
            url,
        });

        setBusy(false);
        setMessage(statusMessage(outcome));

        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="flex flex-col items-start gap-1">
            <button
                type="button"
                onClick={onClick}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50"
            >
                {busy ? "Preparing…" : "Share result"}
            </button>
            <span
                className="min-h-[1rem] text-xs text-slate-500"
                role="status"
                aria-live="polite"
            >
                {message}
            </span>
        </div>
    );
}