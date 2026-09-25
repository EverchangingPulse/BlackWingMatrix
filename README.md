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

Current version: **1.29.17**.

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

## Adaptive test

The adaptive test begins with three calibration exercises. After calibration, a correct answer tends to move the next exercise toward a higher internal difficulty, while an incorrect answer tends to move it lower. The system also varies exercise families so the result is not dominated by one pattern type.

Four options are independent and disabled by default: show correct/incorrect feedback, show the explanation, show numeric difficulty values during the test, and show numeric values in the final summary.

## Feedback and explanations

When enabled, BlackWingMatrix explains the intended visual rule and, after a wrong answer, focuses on the answer that was actually selected. The explanation tries to use visible evidence from the current matrix, describe what the selected answer gets right, and identify a concrete contradiction that rules it out.

## Exercise families

The generator includes grid movements, outer-shape/inner-symbol relations, dot arrangements, line compositions, mini-grid logic, polyomino rotations, shapes and fills, diagonal fills, symbol order, radial patterns, block and dot balancing, segment overlays and other mixed transformations.

## Difficulty and results

Difficulty is an internal relative scale used to compare generated exercises and choose the next item in the adaptive test. The final summary can show qualitative labels only, or numeric values if the corresponding option is enabled. The maximum-correct difficulty refers to the hardest evaluated exercise answered correctly.

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
2. Choose **Adaptive test** or **Single puzzle**.
3. For the adaptive test, set the time limit and maximum number of exercises if needed.
4. Start the session and choose one of the eight answers for each matrix.
5. At the end, review the summary. Feedback and explanations appear only if you enabled them.

## License and attribution

Original BlackWingMatrix material for which the repository authors hold the rights is distributed under the **Apache License 2.0**. See [LICENSE](LICENSE), [NOTICE](NOTICE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix partly derives from work and ideas in **pyRavenMatrices — Can Mekik**. Rights to third-party material remain with their respective owners; the Apache-2.0 declaration only covers material for which this repository's authors have authority.

## Reporting problems

Useful reports include ambiguous matrices, duplicate-looking answers, unclear explanations, rendering problems, inconsistent difficulty, non-inferable rules and mobile-layout issues. When possible, include the seed, exercise family, level, screenshot and browser.

---

BlackWingMatrix is an experimental project for studying and practicing procedurally generated visual reasoning.
