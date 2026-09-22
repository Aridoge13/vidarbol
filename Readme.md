# Vidarbol

**A daily puzzle about the tree of life.**

Every day, place a handful of living organisms on a phylogenetic tree. Your
score is the percentage of evolutionary relationships you got right, and 55%
or higher is a pass.

Vidarbol runs entirely in your browser, with no accounts and no tracking.
Your score never leaves your device.

>> URL: https://vidarbol-3baa2.web.app/

## Fun Fact
Vidarbol blends *vida*, the Spanish word for life, with *árbol*, the Spanish
word for tree. The two words share the letter *a*, which joins them into one
name for the tree of life.

## How to play

1. A puzzle gives you 4 to 11 organisms. The set is one of two kinds:
   - A single clade.
   - A broad mix spanning vertebrates, mammals, or insects.
2. Place each organism on a leaf of the tree scaffold:
   - **Tap** an organism, then tap an empty slot.
   - **Drag** on desktop.
   - Tap the × on a placed organism to send it back to the pool.
3. Submit to receive a score from 0 to 100%.
4. Share your result as an image, or try again.

The tree you are building is a **cladogram**. It shows branching order and
carries no information about time. Every node is a common ancestor, and every
leaf is a living species.

## Scoring

Two trees that differ only by sister-leaf swaps are the same tree, so the
score should treat them the same way. Grading by exact leaf placement would
fail that test. Vidarbol uses **triplet accuracy** instead:

> For every unordered triple of organisms, ask which two are more closely
> related. The triple is correct if the player's tree gives the same answer
> as the ground-truth tree.

For `{human, chimp, gorilla}`, the answer is `human + chimp`. If the player
places them so that pairing holds, the triple counts. Swapping human and
chimp leaves the answer unchanged, so the score is invariant under sister
swaps.

Properties:
- A correct tree scores 100%.
- A random tree scores about 33%, because one of the three possible pairings
  is correct.
- The 55% pass mark takes real knowledge of the tree, since random placement
  lands well below it.
- Partial credit is smooth, so a tree that is mostly right scores mostly high.

## Tech

- **Frontend:** React with TypeScript on Vite, and D3 for tree rendering.
- **Styling:** Tailwind CSS 4.
- **Data pipeline:** Python 3, using `ete3` and `requests`.
- **Tree data:** [Open Tree of Life](https://opentreeoflife.github.io/).
- **Sharing:** `modern-screenshot` captures the result card as a PNG. Where
  supported, the Web Share API hands it to the OS share sheet, and otherwise
  the app falls back to download or clipboard.
- **Hosting:** GitHub Pages, static only.

The site has no server and no database. Every puzzle is a JSON file fetched
by the browser.

## Project structure

```
.
├── public/
│   └── puzzles/          # daily puzzle JSON (committed)
├── scripts/              # Python data pipeline (runs locally, not shipped)
│   ├── fetch_tree.py     # Open Tree of Life API client
│   ├── build_puzzles.py  # generates puzzle JSON from a YAML config
│   ├── fetch_images.py   # downloads species images from Wikipedia
│   └── validate_puzzles.py
├── src/
│   ├── components/       # React UI
│   ├── hooks/            # usePuzzle, usePlacement
│   ├── lib/
│   │   ├── newick.ts     # Newick parser
│   │   ├── tree.ts       # MRCA, closestPair
│   │   ├── scoring.ts    # triplet accuracy
│   │   ├── puzzle.ts     # runtime fetch + validation
│   │   └── share.ts      # screenshot + share
│   └── types/
└── tests/
```

## Running locally

Prerequisites:
- Node 20.19+ or 22.12+ (see `.nvmrc`)
- Python 3.10+

```bash
# Install
npm install
pip install -r scripts/requirements.txt

# Dev server
npm run dev

# Tests
npm test

# Typecheck
npm run typecheck

# Build
npm run build
```

## Regenerating puzzles

Puzzles are precomputed and committed. To regenerate them:

```bash
# Edit scripts/puzzles.yml to add or change clades
rm public/puzzles/*.json
python scripts/build_puzzles.py --config scripts/puzzles.yml --days 31
python scripts/validate_puzzles.py
```

`puzzles.yml` defines each clade as a list of scientific and common names.
For each name, the pipeline looks up the matching taxon in Open Tree of Life
and fetches the induced subtree. It then removes internal labels and branch
lengths and writes one JSON file per date.

## Acknowledgements

This project uses phylogenetic data from the [Open Tree of Life](https://opentreeoflife.org/), a collaborative effort to synthesize a comprehensive tree of life (see [citation details](https://doi.org/10.5281/zenodo.3937741)).


## License

Code: MIT. Data and images retain their original licenses; see `LICENSE` for
details.