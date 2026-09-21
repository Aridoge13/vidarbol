import { describe, it, expect } from "vitest";
import { buildShareFilename, buildShareText } from "../src/lib/share";

describe("buildShareFilename", () => {
    it("embeds date and percent", () => {
        expect(buildShareFilename("2026-09-18", 73)).toBe(
            "vidarbol-2026-09-18-73.png",
        );
    });

    it("works with zero", () => {
        expect(buildShareFilename("2026-09-18", 0)).toBe(
            "vidarbol-2026-09-18-0.png",
        );
    });
});

describe("buildShareText", () => {
    it("includes date, clade, score and url", () => {
        const t = buildShareText({
            dateKey: "2026-09-18",
            percent: 73,
            clade: "Hominidae",
            url: "https://vidarbol.com",
        });
        expect(t).toContain("Hominidae");
        expect(t).toContain("73%");
        expect(t).toContain("https://vidarbol.com");
        expect(t).toMatch(/September/); // formatDisplayDate ran
    });
});
