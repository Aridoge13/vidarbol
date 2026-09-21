"""Shared puzzle schema.

This module defines the contract between the Python backend and TypeScript
frontend. Any schema changes must also be reflected in ``src/types/puzzle.ts``.
"""

from dataclasses import asdict, dataclass
from typing import Literal


Difficulty = Literal["easy", "medium", "hard"]


@dataclass
class Taxon:
    """A single organism that the player places on the tree."""

    id: str
    """Stable slug identifier, e.g. ``"homo_sapiens"``."""

    name: str
    """Common name, e.g. ``"Human"``."""

    sci_name: str
    """Scientific name, e.g. ``"Homo sapiens"``."""

    ott_id: int
    """Open Tree Taxonomy identifier."""

    image: str = ""
    """Optional image path, e.g. ``"/img/homo_sapiens.png"``."""


@dataclass
class Puzzle:
    """Representation of a single daily phylogenetic puzzle."""

    date: str
    """Puzzle date in ISO format, e.g. ``"2026-09-18"``."""

    clade: str
    """Clade represented by the puzzle, e.g. ``"Mammalia"``."""

    difficulty: Difficulty
    """Puzzle difficulty."""

    taxa: list[Taxon]
    """Taxa presented to the player in shuffled display order."""

    newick: str
    """Ground-truth phylogenetic tree in Newick format."""

    leaf_ids: list[str]
    """Taxon IDs corresponding to the leaves in Newick order."""


def puzzle_to_dict(puzzle: Puzzle) -> dict:
    """Serialize a Puzzle into the JSON structure expected by the frontend."""

    return {
        "date": puzzle.date,
        "clade": puzzle.clade,
        "difficulty": puzzle.difficulty,
        "taxa": [asdict(taxon) for taxon in puzzle.taxa],
        "tree": {
            "newick": puzzle.newick,
            "leafIds": puzzle.leaf_ids,
        },
    }