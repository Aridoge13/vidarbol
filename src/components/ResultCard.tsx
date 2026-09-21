/** @jsx React.createElement */
/** @jsxRuntime classic */
import React from "react";
import { formatDisplayDate } from "../lib/date";
import type { ScoreResult } from "../lib/scoring";

interface ResultCardProps {
    dateKey: string;
    clade: string;
    result: ScoreResult;
}

/**
 * The shareable result block.
 *
 * Rendered visibly inside ResultPanel AND captured by ShareButton via ref.
 * Uses only hex colors so any screenshot library captures it reliably.
 */
export function ResultCard({ dateKey, clade, result }: ResultCardProps) {
    const passed = result.percent >= 55;

    return (
        <div
            style={{
                width: 400,
                padding: 24,
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                fontFamily:
                    "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                color: "#0f172a",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 16,
                }}
            >
                <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>
                    Vidarbol
                </span>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                    {formatDisplayDate(dateKey)}
                </span>
            </div>

            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>
                {clade}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                    marginBottom: 12,
                }}
            >
                <span
                    style={{
                        fontSize: 48,
                        fontWeight: 700,
                        lineHeight: 1,
                        color: passed ? "#15803d" : "#b91c1c",
                    }}
                >
                    {result.percent}%
                </span>
                <span style={{ fontSize: 14, color: "#475569" }}>
                    {passed ? "Passed" : "Not quite"}
                </span>
            </div>

            <div
                style={{
                    height: 8,
                    backgroundColor: "#f1f5f9",
                    borderRadius: 4,
                    overflow: "hidden",
                    marginBottom: 8,
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${result.percent}%`,
                        backgroundColor: passed ? "#16a34a" : "#ef4444",
                    }}
                />
            </div>

            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
                {result.correctTriples} of {result.totalTriples} relationships
                correct
            </div>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                }}
                aria-hidden="true"
            >
                {result.triples.map((t, i) => (
                    <div
                        key={i}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            backgroundColor: t.ok ? "#16a34a" : "#e2e8f0",
                        }}
                    />
                ))}
            </div>

            <div
                style={{
                    marginTop: 20,
                    paddingTop: 12,
                    borderTop: "1px solid #e2e8f0",
                    fontSize: 11,
                    color: "#94a3b8",
                }}
            >
                Share it with a friend if you enjoyed it.
            </div>
        </div>
    );
}