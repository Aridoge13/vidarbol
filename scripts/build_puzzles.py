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

def rng_for_date(date_key: str) -> random.Random:
    """A deterministic RNG seeded by the date.

    Every player, deploy, and regeneration on a given date produces the
    same puzzle. Different dates get independent seeds.
    """
    return random.Random(f"vidarbol-{date_key}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--out-dir", default="public/puzzles")
    ap.add_argument("--start", default=str(date.today()))
    ap.add_argument("--days", type=int, default=30)
    args = ap.parse_args()

    clades = load_config(Path(args.config))
    if not clades:
        print("error: no clades defined in config", file=sys.stderr)
        return 1

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    start = date.fromisoformat(args.start)
    skipped: list[tuple[str, str, str]] = []
    generated: list[str] = []

    recent: list[str] = []
    cooldown = 3

    for i in range(args.days):
        day = start + timedelta(days=i)
        date_key = day.isoformat()
        day_rng = rng_for_date(date_key)

        candidates = [
            c for c in clades if c["name"] not in recent[-cooldown:]
        ] or clades

        clade_def = day_rng.choice(candidates)
        recent.append(clade_def["name"])

        try:
            puzzle = build_puzzle(
                clade=clade_def["name"],
                species=clade_def["species"],
                difficulty=clade_def.get("difficulty", "medium"),
                rng=day_rng,
            )
        except Exception as e:
            print(f"skip {date_key} ({clade_def['name']}): {e}", file=sys.stderr)
            skipped.append((date_key, clade_def["name"], str(e)))
            continue

        puzzle.date = date_key
        payload = puzzle_to_dict(puzzle)
        out_path = out_dir / f"{date_key}.json"
        out_path.write_text(json.dumps(payload, indent=2))
        generated.append(date_key)
        print(f"wrote {out_path}")

    # Rebuild index from every puzzle file present, not just the ones
    # generated in this run. This lets manual JSONs survive regeneration
    # and preserves any puzzles from earlier runs you want to keep.
    all_dates = sorted(
        p.stem for p in out_dir.glob("*.json") if p.name != "index.json"
    )
    (out_dir / "index.json").write_text(json.dumps(all_dates, indent=2))

    print(
        f"\nwrote {out_dir}/index.json "
        f"({len(all_dates)} total, {len(generated)} new)"
    )

    if skipped:
        print(
            f"\nERROR: {len(skipped)} day(s) skipped. Not deploying.",
            file=sys.stderr,
        )
        for d, c, err in skipped:
            print(f"  {d} ({c}): {err}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())