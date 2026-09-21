"""Validate puzzle JSON files in public/puzzles/.

Usage:
    python scripts/validate_puzzles.py
    python scripts/validate_puzzles.py --dir public/puzzles
"""

import argparse
import json
import sys
from pathlib import Path

from ete3 import Tree # pyright: ignore[reportMissingImports]

REQUIRED_TAXON_FIELDS = {"id", "name", "sci_name", "ott_id"}
MIN_TAXA = 4
MAX_TAXA = 10


def validate_one(path: Path) -> list[str]:
    """Return a list of error strings. Empty means valid."""
    errors = []
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError as e:
        return [f"{path.name}: invalid JSON: {e}"]

    for field in ("date", "clade", "difficulty", "taxa", "tree"):
        if field not in data:
            errors.append(f"{path.name}: missing field '{field}'")

    taxa = data.get("taxa", [])
    if not (MIN_TAXA <= len(taxa) <= MAX_TAXA):
        errors.append(f"{path.name}: {len(taxa)} taxa (must be {MIN_TAXA}-{MAX_TAXA})")

    seen_ids = set()
    for t in taxa:
        missing = REQUIRED_TAXON_FIELDS - set(t)
        if missing:
            errors.append(f"{path.name}: taxon {t.get('id', '?')} missing {missing}")
        if t.get("id") in seen_ids:
            errors.append(f"{path.name}: duplicate taxon id {t.get('id')}")
        seen_ids.add(t.get("id"))

    tree = data.get("tree", {})
    newick = tree.get("newick")
    leaf_ids = tree.get("leafIds", [])
    if not newick:
        errors.append(f"{path.name}: missing tree.newick")
        return errors

    try:
        t = Tree(newick, format=1)
    except Exception as e:
        errors.append(f"{path.name}: invalid newick: {e}")
        return errors

    leaves = [leaf.name for leaf in t.get_leaves()]
    if len(leaves) != len(taxa):
        errors.append(
            f"{path.name}: newick has {len(leaves)} leaves, "
            f"taxa has {len(taxa)}"
        )

    # Leaf names should be taxon slugs (ids), not display names.
    taxon_ids = {t["id"] for t in taxa}
    if set(leaves) != taxon_ids:
        errors.append(
            f"{path.name}: newick leaves {set(leaves)} != taxon ids {taxon_ids}"
        )

    if set(leaf_ids) != taxon_ids:
        errors.append(f"{path.name}: leafIds != taxon ids")

    return errors


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="public/puzzles")
    args = ap.parse_args()

    puzzle_dir = Path(args.dir)
    if not puzzle_dir.exists():
        print(f"error: {puzzle_dir} does not exist", file=sys.stderr)
        return 1

    all_errors = []
    count = 0
    for path in sorted(puzzle_dir.glob("*.json")):
        if path.name == "index.json":
            continue
        count += 1
        all_errors.extend(validate_one(path))

    if all_errors:
        for e in all_errors:
            print(e, file=sys.stderr)
        print(f"\n{len(all_errors)} error(s) across {count} puzzle(s)", file=sys.stderr)
        return 1

    print(f"ok: {count} puzzle(s) valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())