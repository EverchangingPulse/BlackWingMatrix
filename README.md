# BlackWingMatrix

<details>
<summary>🌐 Language: English</summary>

- [English](README.md)
- [Italiano](README.it.md)
- [Français](README.fr.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Português](README.pt.md)
- [Nederlands](README.nl.md)
- [Polski](README.pl.md)
</details>

**BlackWingMatrix** is a standalone web application for practicing abstract and visuospatial reasoning with procedurally generated 3×3 logic matrices.

Current version: **1.31.1**.

## Try it online

**[Open BlackWingMatrix in your browser](https://everchangingpulse.github.io/BlackWingMatrix/)**

The GitHub Pages version opens directly in the browser. No download or installation is required. If you want to use it offline, the repository also contains the complete standalone HTML file.

## What the program does

Each exercise shows a 3×3 matrix with the bottom-right tile missing. You choose the correct tile from eight alternatives. The generator creates many different visual-rule families instead of relying on a fixed set of hand-authored questions.

- visual pattern discovery and row/column relationships
- shape, position, rotation, reflection and scale changes
- fills, symbol sequences, counts and compositions
- mini-grid and set/Boolean operations
- multi-rule problems where several independent properties must be tracked at once

## Session modes

The session selector provides five modes:

- **Single puzzle** — generate one reproducible exercise. Choose its family and qualitative difficulty band; relevant families also expose transformations or Boolean operations.
- **Adaptive test** — a standard adaptive session that starts with three calibration exercises and then selects items around the estimated level.
- **Gradual adaptive test** — the default mode. It uses the same calibration but approaches the estimated frontier more smoothly, rather than jumping immediately to very difficult items.
- **Progressive panoramic test** — raises difficulty progressively while rotating across suitable families, for a broad non-adaptive sample.
- **Logical-relation test** — practises a selected relation group, such as spatial transformations, Boolean logic, row/column/diagonal relations, outer/inner relations, or reused relations.

## Adaptive testing and difficulty

All generators use one shared internal **0–60 difficulty scale**. It is used in single-puzzle generation, calibration and every test mode; the six visible labels are only qualitative bands of that same scale.

Each adaptive session starts with three generated calibration exercises. Their requested difficulties are selected on a 0.01 grid: the middle item is between 23 and 27, the first is between 10 and 16, and the third completes a total calibration difficulty between 74 and 76. Calibration families are selected from generators that can actually produce the requested difficulty, rather than from a fixed family list.

After calibration, the next target uses the previous performance, response time, error streaks, the strongest correctly solved difficulty and how close a wrong alternative is to the correct solution for that exercise family. The gradual mode additionally dampens the early climb and stops persistent escalation when high-level answers show no reliable success.

Four display options are independent and disabled by default: show correct/incorrect feedback, show the explanation, show numeric difficulty values during the test, and show numeric values in the final summary.

## Feedback and explanations

When enabled, BlackWingMatrix explains the intended visual rule and, after a wrong answer, focuses on the answer that was actually selected. The explanation tries to use visible evidence from the current matrix, describe what the selected answer gets right, and identify a concrete contradiction that rules it out.

## Exercise families

The generator includes grid movements, outer-shape/inner-symbol relations, dot arrangements, line compositions, mini-grid logic, polyomino rotations, shapes and fills, diagonal fills, symbol order, radial patterns, block and dot balancing, segment overlays and other mixed transformations.

## Difficulty, results and analysis

The final summary can show qualitative labels only, or numeric values when the corresponding option is enabled. It reports the hardest evaluated exercise answered correctly, the coverage of exercise families, stability of the path and the reason the session ended. It also compares the post-calibration path against simulated all-correct and all-wrong reference paths with the same start; this comparison is not a population percentile or an IQ score.

The **Gaussian** tab keeps a local exercise history. It can export results as CSV, import a CSV history, recalculate the stored difficulty values and simulate 200 reference profiles. Adaptive sessions can also export their complete results as JSON and CSV.

## Single-puzzle mode

Single-puzzle mode lets you choose a family, difficulty and, where relevant, transformations or Boolean operations. It is useful for practicing one kind of visual logic or reproducing a specific puzzle.

## Reproducibility

Every generated matrix has a seed. Using the same seed and the same settings recreates the same exercise, which makes bug reports and comparisons between versions easier.

## Offline use

BlackWingMatrix is also distributed as a single HTML file. You can download `blackwingmatrix.html` and open it with a modern browser without a backend, account, database, Node.js or Python.

## Important limitation

BlackWingMatrix is an experimental practice and relative-assessment tool. It is **not a standardized intelligence test**, does not provide a validated IQ score, does not replace official Raven's Progressive Matrices, and should not be used by itself for clinical or psychological conclusions.

## Quick start

1. Open the online version or the standalone HTML file.
2. Choose a session mode. **Gradual adaptive test** is selected by default.
3. Set the time limit and maximum number of exercises, or choose a family and band for a single puzzle.
4. Start the session and choose one of the eight answers for each matrix.
5. At the end, review the summary or export the results. Feedback and explanations appear only if you enabled them.

## License and attribution

Original BlackWingMatrix material for which the repository authors hold the rights is distributed under the **Apache License 2.0**. See [LICENSE](LICENSE), [NOTICE](NOTICE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix partly derives from work and ideas in **pyRavenMatrices — Can Mekik**. Rights to third-party material remain with their respective owners; the Apache-2.0 declaration only covers material for which this repository's authors have authority.

## Reporting problems

Useful reports include ambiguous matrices, duplicate-looking answers, unclear explanations, rendering problems, inconsistent difficulty, non-inferable rules and mobile-layout issues. When possible, include the seed, exercise family, level, screenshot and browser.

---

BlackWingMatrix is an experimental project for studying and practicing procedurally generated visual reasoning.
