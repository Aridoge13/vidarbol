// modern-screenshot does not expose declarations in all package versions.
// @ts-ignore The package is available at runtime, but may be untyped.
import { domToBlob } from "modern-screenshot";
import { formatDisplayDate } from "./date";

export type ShareMethod =
    | "shared"
    | "downloaded"
    | "copied"
    | "cancelled"
    | "failed";

export interface ShareOutcome {
    method: ShareMethod;
    error?: string;
}

export interface ShareRequest {
    element: HTMLElement;
    fileName: string;
    title: string;
    text: string;
    url?: string;
}

// ---------------------------------------------------------------------------
// Capture
// ---------------------------------------------------------------------------

export interface CaptureOptions {
    /** Device pixel ratio multiplier. 2 is a good default for crisp images. */
    scale?: number;
    /** Background color. modern-screenshot handles oklch, hex, rgb, hsl — all fine. */
    backgroundColor?: string;
    /**
     * Enable worker mode for large captures.
     * Only worth enabling when the element is very tall (>2000px) or the
     * device is low-powered. For a result card, leave it off.
     */
    useWorker?: boolean;
}

/**
 * Render an HTML element to a PNG blob using modern-screenshot.
 *
 * Unlike html2canvas, this renders via SVG, so modern CSS colors
 * (oklch, lch, color-mix) and Tailwind 4 output work correctly.
 *
 * The element must be attached to the document.
 */
export async function captureElementAsBlob(
    el: HTMLElement,
    opts: CaptureOptions = {},
): Promise<Blob> {
    const scale = opts.scale ?? 2;
    const backgroundColor = opts.backgroundColor ?? "#ffffff";

    if (opts.useWorker) {
        // Worker mode runs the heavy DOM-to-SVG work off the main thread.
        // Vite resolves this URL at build time.
        const workerUrl = new URL(
            "modern-screenshot/worker",
            import.meta.url,
        ).href;

        return domToBlob(el, {
            scale,
            backgroundColor,
            workerUrl,
            workerNumber: navigator.hardwareConcurrency ?? 2,
        });
    }

    return domToBlob(el, { scale, backgroundColor });
}

// ---------------------------------------------------------------------------
// Platform capability checks
// ---------------------------------------------------------------------------

export function canShareFiles(): boolean {
    return (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function"
    );
}

export function canShare(): boolean {
    return (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
    );
}

// ---------------------------------------------------------------------------
// Fallback: download
// ---------------------------------------------------------------------------

export function downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export async function shareResult(req: ShareRequest): Promise<ShareOutcome> {
    let blob: Blob | null = null;
    try {
        blob = await captureElementAsBlob(req.element);
    } catch {
        // Fall through to text-only.
    }

    if (blob) {
        const file = new File([blob], req.fileName, { type: "image/png" });

        if (canShareFiles() && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: req.title,
                    text: req.text,
                });
                return { method: "shared" };
            } catch (e) {
                const err = e as Error;
                if (err.name === "AbortError") return { method: "cancelled" };
            }
        }

        try {
            downloadBlob(blob, req.fileName);
            return { method: "downloaded" };
        } catch {
            // Fall through to text-only.
        }
    }

    const text = req.url ? `${req.text}\n${req.url}` : req.text;

    if (canShare()) {
        try {
            await navigator.share({ title: req.title, text, url: req.url });
            return { method: "shared" };
        } catch (e) {
            const err = e as Error;
            if (err.name === "AbortError") return { method: "cancelled" };
        }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            return { method: "copied" };
        } catch {
            // Fall through to failed.
        }
    }

    return {
        method: "failed",
        error: "Sharing isn't supported on this device.",
    };
}

// ---------------------------------------------------------------------------
// Content builders (unchanged)
// ---------------------------------------------------------------------------

export function buildShareFilename(dateKey: string, percent: number): string {
    return `vidarbol-${dateKey}-${percent}.png`;
}

export interface ShareTextOptions {
    dateKey: string;
    percent: number;
    clade: string;
    url: string;
}

export function buildShareText(opts: ShareTextOptions): string {
    const { dateKey, percent, clade, url } = opts;
    const date = formatDisplayDate(dateKey);
    return `Vidarbol — ${date} — ${clade}\nI scored ${percent}%.\nIf you enjoyed it, share it with a friend.\n${url}`;
}