import { describe, it, expect } from "vitest";
import {
    parseNewick,
    getLeafIds,
    countLeaves,
    serializeNewick,
} from "../src/lib/newick";

describe("parseNewick", () => {
    it("parses a simple tree", () => {
        const tree = parseNewick("((a,b),(c,d));");
        expect(getLeafIds(tree)).toEqual(["a", "b", "c", "d"]);
        expect(countLeaves(tree)).toBe(4);
    });

    it("tolerates branch lengths", () => {
        const tree = parseNewick("((a:1,b:1):1,(c:1,d:1):1);");
        expect(getLeafIds(tree)).toEqual(["a", "b", "c", "d"]);
    });

    it("tolerates missing trailing semicolon", () => {
        const tree = parseNewick("((a,b),(c,d))");
        expect(getLeafIds(tree)).toEqual(["a", "b", "c", "d"]);
    });

    it("round-trips", () => {
        const input = "((a,b),(c,d));";
        expect(serializeNewick(parseNewick(input))).toBe(input);
    });

    it("throws on empty input", () => {
        expect(() => parseNewick("")).toThrow(SyntaxError);
    });

    it("throws on unbalanced parens", () => {
        expect(() => parseNewick("((a,b);")).toThrow(SyntaxError);
    });

    it("throws on trailing junk", () => {
        expect(() => parseNewick("((a,b),(c,d)); garbage")).toThrow(SyntaxError);
    });
});