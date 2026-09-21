"""Build daily puzzle JSON files from Open Tree of Life data.

Usage:
    python scripts/build_puzzles.py --config scripts/puzzles.yml
    python scripts/build_puzzles.py --config scripts/puzzles.yml --start 2026-09-18 --days 30
"""

import argparse
import json
import random
import sys
from datetime import date, timedelta
from pathlib import Path

import yaml  # pyright: ignore[reportMissingModuleSource]
from ete3 import Tree  # pyright: ignore[reportMissingImports]

# Import from sibling scripts
sys.path.insert(0, str(Path(__file__).parent))
from fetch_tree import fetch
from schema import Puzzle, Taxon, puzzle_to_dict


def slugify(name: str) -> str:
    """Convert a taxon name to a filesystem-safe slug."""
    return (
        name.lower()
        .replace(" ", "_")
        .replace("-", "_")
        .replace(".", "")
    )

def collapse_unary(tree: Tree) -> Tree:
    """Collapse internal nodes with exactly one child.

    Open Tree can return trees rooted with a unary node after filtering
    (e.g. ((A,B),(C,D)) wrapped in an extra root). ete3 writes these out
    unchanged, but our TS parser rejects them. Collapse them so the emitted
    Newick is clean.

    Returns the (possibly new) root.
    """
    changed = True
    while changed:
        changed = False
        for node in list(tree.traverse("preorder")):
            if node.is_leaf():
                continue
            if len(node.children) != 1:
                continue

            child = node.children[0]
            if node.is_root():
                child.detach()
                tree = child
            else:
                parent = node.up
                node.detach()
                parent.add_child(child)

            changed = True
            break  # restart traversal, the tree just changed
    return tree

def normalize_newick(raw_newick: str, resolved: list[dict]) -> tuple[str, list[str]]:
    """Parse the OTT-id Newick from Open Tree, rename leaves to taxon slugs,
    strip internal node labels and branch lengths.

    Returns (clean_newick, ordered_slugs), where ordered_slugs is the
    left-to-right leaf order in the cleaned tree.
    """
    t = Tree(raw_newick, format=1)

    ott_to_slug = {r["ott_id"]: slugify(r["name"]) for r in resolved}

    for leaf in t.get_leaves():
        # Labels look like "ott12345" or "mrcaott123ott456" (the latter
        # should never appear for tip-only requests, but guard anyway).
        if not leaf.name.startswith("ott"):
            raise ValueError(f"Unexpected leaf label: {leaf.name}")
        ott_id = int(leaf.name[3:])
        if ott_id not in ott_to_slug:
            raise ValueError(f"Unknown OTT id in tree: {ott_id}")
        leaf.name = ott_to_slug[ott_id]

    for node in t.traverse():
        if not node.is_leaf():
            node.name = ""
        node.dist = 1.0
    t = collapse_unary(t) 

    ordered_slugs = [leaf.name for leaf in t.get_leaves()]
    return t.write(format=1), ordered_slugs



def build_puzzle(clade: str, species: list[dict], difficulty: str,
                 rng: random.Random) -> Puzzle:
    """Fetch and build a single puzzle.

    `species` is a list of {"sci": "...", "common": "..."} dicts.
    """
    sci_names = [s["sci"] for s in species]
    common_by_sci = {s["sci"]: s["common"] for s in species}

    raw = fetch(sci_names)
    newick, newick_order = normalize_newick(raw["newick"], raw["resolved"])

    resolved_by_slug = {slugify(r["name"]): r for r in raw["resolved"]}

    taxa = []
    for slug in newick_order:
        r = resolved_by_slug[slug]
        sci = r["name"]
        common = common_by_sci.get(sci, sci)  # fall back to sci if missing
        taxa.append(Taxon(
            id=slug,
            name=common,
            sci_name=sci,
            ott_id=r["ott_id"],
        ))

    leaf_ids = [t.id for t in taxa]
    rng.shuffle(taxa)

    return Puzzle(
        date="",
        clade=clade,
        difficulty=difficulty,
        taxa=taxa,
        newick=newick,
        leaf_ids=leaf_ids,
    )


def load_config(path: Path) -> list[dict]:
    """Load clade definitions from YAML.

    Expected shape:
        clades:
          - name: Mammalia
            difficulty: easy
            species:
              - Homo sapiens
              - Pan troglodytes
    """
    return yaml.safe_load(path.read_text())["clades"]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--out-dir", default="public/puzzles")
    ap.add_argument("--start", default=str(date.today()))
    ap.add_argument("--days", type=int, default=30)
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    clades = load_config(Path(args.config))
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    rng = random.Random(args.seed)
    start = date.fromisoformat(args.start)
    index = []

    for i in range(args.days):
        day = start + timedelta(days=i)
        clade_def = clades[i % len(clades)]
        try:
            puzzle = build_puzzle(
                clade=clade_def["name"],
                species=clade_def["species"],
                difficulty=clade_def.get("difficulty", "medium"),
                rng=rng,
            )
        except Exception as e:
            print(f"skip {day}: {e}", file=sys.stderr)
            continue
        puzzle.date = day.isoformat()
        payload = puzzle_to_dict(puzzle)
        out_path = out_dir / f"{puzzle.date}.json"
        out_path.write_text(json.dumps(payload, indent=2))
        index.append(puzzle.date)
        print(f"wrote {out_path}")

    (out_dir / "index.json").write_text(json.dumps(sorted(index), indent=2))
    print(f"wrote {out_dir}/index.json ({len(index)} puzzles)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())