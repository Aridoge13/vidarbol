"""Fetch phylogenetic trees from Open Tree of Life.

Usage:
    python scripts/fetch_tree.py --names "Homo sapiens,Pan troglodytes,Gorilla gorilla"
    python scripts/fetch_tree.py --names-file species.txt --out data/raw/mammals.json
"""

import argparse
import json
import sys
import time
from pathlib import Path
import re

import requests # pyright: ignore[reportMissingImports]

API_BASE = "https://api.opentreeoflife.org/v3"
TIMEOUT = 30


def match_names(names: list[str]) -> list[dict]:
    """Resolve taxon names to OTT ids via TNRS.

    Returns a list of dicts with keys: name, ott_id, unique_name, is_synonym.
    Raises on unmatched names.
    """
    url = f"{API_BASE}/tnrs/match_names"
    resp = requests.post(
        url,
        json={"names": names, "do_approximate_matching": False},
        timeout=TIMEOUT,
    )
    resp.raise_for_status()
    data = resp.json()

    results = data.get("results", [])
    resolved = []
    unmatched = []

    for r in results:
        matches = r.get("matches", [])
        if not matches:
            unmatched.append(r["name"])
            continue
        best = matches[0]
        if best.get("is_synonym"):
            # Accept synonyms but note them; caller can decide.
            pass
        resolved.append({
            "name": r["name"],
            "ott_id": best["taxon"]["ott_id"],
            "unique_name": best["taxon"]["unique_name"],
            "is_synonym": best.get("is_synonym", False),
        })

    if unmatched:
        raise ValueError(f"Could not resolve names: {unmatched}")

    return resolved


def induced_subtree(ott_ids: list[int], label_format: str = "id") -> str:
    """Fetch the induced subtree for a set of OTT ids.

    Returns a Newick string with internal mrca labels stripped.
    """
    url = f"{API_BASE}/tree_of_life/induced_subtree"
    resp = requests.post(
        url,
        json={"ott_ids": ott_ids, "label_format": label_format},
        timeout=TIMEOUT,
    )
    resp.raise_for_status()
    data = resp.json()
    newick = data.get("newick")
    if not newick:
        raise ValueError(f"No newick in response: {data}")

    # Open Tree labels internal nodes with "mrcaottXottY" strings.
    # ete3 handles these inconsistently; strip them before parsing.
    newick = re.sub(r"mrcaott\d+ott\d+", "", newick)

    return newick


def fetch(names: list[str]) -> dict:
    """Resolve names and fetch the induced subtree. Returns raw payload."""
    resolved = match_names(names)
    ott_ids = [r["ott_id"] for r in resolved]
    newick = induced_subtree(ott_ids)
    return {
        "resolved": resolved,
        "ott_ids": ott_ids,
        "newick": newick,
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    group = ap.add_mutually_exclusive_group(required=True)
    group.add_argument("--names", help="Comma-separated taxon names")
    group.add_argument("--names-file", help="File with one name per line")
    ap.add_argument("--out", help="Output JSON path")
    args = ap.parse_args()

    if args.names:
        names = [n.strip() for n in args.names.split(",") if n.strip()]
    else:
        names = [
            line.strip()
            for line in Path(args.names_file).read_text().splitlines()
            if line.strip() and not line.startswith("#")
        ]

    try:
        payload = fetch(names)
    except (requests.RequestException, ValueError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 1

    text = json.dumps(payload, indent=2)
    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text(text)
        print(f"wrote {args.out}")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())