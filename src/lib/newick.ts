/**
 * Minimal Newick parser and serializer.
 *
 * Only handles the subset of Newick we generate:
 *   - leaf labels are slugs like "homo_sapiens"
 *   - internal nodes have no labels (stripped by build_puzzles.py)
 *   - branch lengths are ignored if present
 *   - no quoted labels, no comments, no rooted/unrooted markers
 *
 * If you ever start emitting quoted labels or branch lengths you care about,
 * extend the parser — don't try to make it handle everything now.
 */

export interface LeafNode {
    kind: "leaf";
    id: string;
}

export interface InternalNode {
    kind: "internal";
    children: TreeNode[];
}

export type TreeNode = LeafNode | InternalNode;

export function isLeaf(node: TreeNode): node is LeafNode {
    return node.kind === "leaf";
}

export function isInternal(node: TreeNode): node is InternalNode {
    return node.kind === "internal";
}

/** Parse a Newick string into a TreeNode. Throws SyntaxError on bad input. */
export function parseNewick(input: string): TreeNode {
    return new Parser(input).parse();
}

/**
 * Left-to-right leaf ids.
 *
 * This is the canonical order for the tree and should match
 * Puzzle.tree.leafIds if the JSON was generated correctly.
 */
export function getLeafIds(root: TreeNode): string[] {
    const out: string[] = [];
    const walk = (node: TreeNode): void => {
        if (node.kind === "leaf") out.push(node.id);
        else for (const child of node.children) walk(child);
    };
    walk(root);
    return out;
}

/** Count leaves under a node. Useful for asserting tree size. */
export function countLeaves(node: TreeNode): number {
    if (node.kind === "leaf") return 1;
    let total = 0;
    for (const child of node.children) total += countLeaves(child);
    return total;
}

/** Serialize back to Newick. Round-trips with parseNewick for our subset. */
export function serializeNewick(root: TreeNode): string {
    const walk = (node: TreeNode): string => {
        if (node.kind === "leaf") return node.id;
        return "(" + node.children.map(walk).join(",") + ")";
    };
    return walk(root) + ";";
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

class Parser {
    private i = 0;

    constructor(private readonly s: string) { }

    parse(): TreeNode {
        this.skipWs();
        if (this.i >= this.s.length) {
            throw new SyntaxError("Newick: empty input");
        }

        const root = this.parseNode();
        this.skipWs();

        // Optional trailing semicolon.
        if (this.peek() === ";") this.i++;
        this.skipWs();

        if (this.i < this.s.length) {
            const tail = this.s.slice(this.i, this.i + 12);
            throw new SyntaxError(
                `Newick: unexpected trailing input at position ${this.i}: "${tail}"`,
            );
        }
        return root;
    }

    private parseNode(): TreeNode {
        this.skipWs();
        return this.peek() === "(" ? this.parseInternal() : this.parseLeaf();
    }

    private parseInternal(): TreeNode {
        this.expect("(");
        const children: TreeNode[] = [this.parseNode()];
        this.skipWs();

        while (this.peek() === ",") {
            this.i++;
            children.push(this.parseNode());
            this.skipWs();
        }

        this.expect(")");

        this.skipOptionalLabel();
        this.skipOptionalLength();

        // Tolerate unary internal nodes by collapsing them.
        // Open Tree sometimes emits these; the Python pipeline strips them,
        // but this keeps old or hand-written puzzle files parseable.
        if (children.length === 1) {
            return children[0];
        }

        return { kind: "internal", children };
    }

    private parseLeaf(): LeafNode {
        const id = this.parseLabel();
        this.skipOptionalLength();
        return { kind: "leaf", id };
    }

    /** Read a run of characters that aren't Newick syntax or whitespace. */
    private parseLabel(): string {
        const start = this.i;
        while (this.i < this.s.length && !isDelimiter(this.s[this.i])) {
            this.i++;
        }
        if (this.i === start) {
            throw new SyntaxError(`Newick: expected label at position ${this.i}`);
        }
        return this.s.slice(start, this.i);
    }

    private skipOptionalLabel(): void {
        const c = this.peek();
        if (c !== undefined && !isDelimiter(c)) this.parseLabel();
    }

    private skipOptionalLength(): void {
        if (this.peek() !== ":") return;
        this.i++; // consume colon

        const start = this.i;
        while (this.i < this.s.length && !isDelimiter(this.s[this.i])) {
            this.i++;
        }
        if (this.i === start) {
            throw new SyntaxError(
                `Newick: expected branch length after ':' at position ${start}`,
            );
        }
        // We don't validate that it's numeric. We never use these values.
    }

    private expect(c: string): void {
        this.skipWs();
        if (this.peek() !== c) {
            const got = this.peek() ?? "end of input";
            throw new SyntaxError(
                `Newick: expected '${c}' at position ${this.i}, got ${got}`,
            );
        }
        this.i++;
    }

    private peek(): string | undefined {
        return this.s[this.i];
    }

    private skipWs(): void {
        while (this.i < this.s.length && /\s/.test(this.s[this.i])) this.i++;
    }
}

function isDelimiter(c: string): boolean {
    return (
        c === "(" || c === ")" || c === "," || c === ":" || c === ";" || /\s/.test(c)
    );
}