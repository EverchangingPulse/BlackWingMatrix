#!/usr/bin/env python3
"""Recalibrate BlackWingMatrix from exported adaptive-test CSV/JSON reports.

The current app calibrates expected response time by family. This tool merges
reports deterministically, preserves the gradual-adaptive settings already in
the HTML, and updates only the generated response-time calibration payload in
both standalone entry points.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import re
import statistics
from collections import defaultdict
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = (ROOT / "index.html", ROOT / "blackwingmatrix.html")
SUMMARY_FILE = ROOT / "tools" / "last-recalibration-summary.json"
START = "/* RESPONSE_TIME_CALIBRATION_DATA_START */"
END = "/* RESPONSE_TIME_CALIBRATION_DATA_END */"
MAX_SECONDS = 240.0
DEFAULT_NEUTRAL_SECONDS = 60.0
DEFAULT_CURVE_WIDTH_SECONDS = 22.0
TERNARY_GRID_OFFSETS = {2: 0.0, 3: 28.0, 4: 45.0}

Observation = tuple[str, float, float, int | None]


def as_number(value: Any) -> float | None:
    try:
        number = float(str(value).strip())
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def row_observation(row: dict[str, Any]) -> Observation | None:
    if str(row.get("evaluationIncluded", "true")).lower() == "false":
        return None
    if str(row.get("result", "")).lower() == "ignored-too-fast":
        return None
    family = str(row.get("family", "")).strip()
    score = as_number(row.get("itemScore", row.get("targetDifficulty")))
    seconds = as_number(row.get("durationSeconds"))
    if seconds is None:
        milliseconds = as_number(row.get("durationMilliseconds"))
        seconds = milliseconds / 1000 if milliseconds is not None else None
    grid_value = as_number(row.get("ternaryGridSize"))
    grid = int(round(grid_value)) if grid_value is not None and 2 <= grid_value <= 4 else None
    if not family or score is None or seconds is None:
        return None
    # Progressive structural calibration legitimately includes the 0–1 band.
    # Keep those observations instead of silently dropping the introductory
    # exercises when re-fitting response-time expectations.
    if not (0.0 <= score <= 60.0 and 0 < seconds <= MAX_SECONDS):
        return None
    return family, round(score, 3), round(seconds, 3), grid


def read_json_rows(payload: Any) -> Iterable[dict[str, Any]]:
    if isinstance(payload, dict):
        exercises = payload.get("exercises", payload.get("outcomes"))
        if isinstance(exercises, list):
            yield from (entry for entry in exercises if isinstance(entry, dict))
        elif all(key in payload for key in ("family", "itemScore")):
            yield payload
    elif isinstance(payload, list):
        yield from (entry for entry in payload if isinstance(entry, dict))


def read_report(path: Path) -> list[Observation]:
    suffix = path.suffix.lower()
    if suffix == ".csv":
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
    elif suffix == ".json":
        with path.open("r", encoding="utf-8") as handle:
            rows = list(read_json_rows(json.load(handle)))
    else:
        raise ValueError(f"Unsupported report format: {path}")
    return [observation for row in rows if (observation := row_observation(row))]


def current_calibration(html: str) -> dict[str, Any]:
    match = re.search(
        re.escape(START)
        + r"\s*(?://.*?\n)*const RESPONSE_TIME_CALIBRATION\s*=\s*(\{.*?\});\s*"
        + re.escape(END),
        html,
        re.DOTALL,
    )
    if not match:
        raise ValueError(
            "Could not locate the current RESPONSE_TIME_CALIBRATION block. "
            "This report tool targets the merged dev runtime."
        )
    calibration = json.loads(match.group(1))
    if not isinstance(calibration, dict):
        raise ValueError("RESPONSE_TIME_CALIBRATION must be a JSON object")
    return calibration


def observation_from_payload(family: str, value: Any) -> Observation | None:
    if not isinstance(value, list) or len(value) < 2:
        return None
    score, seconds = as_number(value[0]), as_number(value[1])
    grid_value = as_number(value[2]) if len(value) > 2 else None
    grid = int(round(grid_value)) if grid_value is not None and 2 <= grid_value <= 4 else None
    if score is None or seconds is None or not (0 <= score <= 60 and 0 < seconds <= MAX_SECONDS):
        return None
    return family, round(score, 3), round(seconds, 3), grid


def retained_observations(calibration: dict[str, Any]) -> list[Observation]:
    source = calibration.get("observations", {})
    if not isinstance(source, dict):
        return []
    return [observation for family, values in source.items() if isinstance(values, list)
            for value in values if (observation := observation_from_payload(str(family), value))]


def retain_and_limit(
    observations: Iterable[Observation], maximum_per_family: int,
) -> dict[str, list[list[float | int]]]:
    grouped: dict[str, list[tuple[float, float, int | None]]] = defaultdict(list)
    for family, score, seconds, grid in observations:
        grouped[family].append((round(score, 3), round(seconds, 3), grid))
    result: dict[str, list[list[float | int]]] = {}
    for family in sorted(grouped):
        values = sorted(grouped[family])
        if len(values) > maximum_per_family:
            values = [values[round(index * (len(values) - 1) / (maximum_per_family - 1))]
                      for index in range(maximum_per_family)]
        result[family] = [
            [score, seconds] if grid is None else [score, seconds, grid]
            for score, seconds, grid in values
        ]
    return result


def expected_base_seconds(family: str, score: float, grid: int | None) -> float:
    ternary = TERNARY_GRID_OFFSETS.get(grid or 4, 45.0) if family == "ternary-carry" else 0.0
    return 13.0 + score * 0.65 + ternary


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def fit_family_offsets(
    observations: Iterable[Observation], fallback: dict[str, Any],
) -> dict[str, float]:
    """Fit robust family offsets while shrinking small samples to current values."""
    grouped: dict[str, list[float]] = defaultdict(list)
    for family, score, seconds, grid in observations:
        grouped[family].append(seconds - expected_base_seconds(family, score, grid))
    offsets = {str(family): round(float(value), 3) for family, value in fallback.items()
               if as_number(value) is not None}
    for family, residuals in grouped.items():
        observed = statistics.median(residuals)
        previous = offsets.get(family, 0.0)
        reliability = len(residuals) / (len(residuals) + 4.0)
        offsets[family] = round(clamp(previous + (observed - previous) * reliability, -12.0, 75.0), 3)
    return dict(sorted(offsets.items()))


def refit_fallback_curve(observations: Iterable[Observation], calibration: dict[str, Any]) -> tuple[float, float]:
    values = sorted(seconds for _, _, seconds, _ in observations)
    if len(values) < 20:
        return float(calibration.get("neutralSeconds", DEFAULT_NEUTRAL_SECONDS)), float(
            calibration.get("curveWidthSeconds", DEFAULT_CURVE_WIDTH_SECONDS)
        )
    neutral = statistics.median(values)
    deviations = [abs(value - neutral) for value in values]
    robust_spread = statistics.median(deviations) * 1.4826
    return round(clamp(neutral, 12.0, 120.0), 3), round(clamp(robust_spread, 8.0, 40.0), 3)


def report_digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def javascript_block(calibration: dict[str, Any]) -> str:
    payload = json.dumps(calibration, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    return f'''{START}
// Generated and maintained by tools/recalibrate_reports.py. Do not hand-edit this payload.
const RESPONSE_TIME_CALIBRATION={payload};
{END}'''


def replace_calibration(html: str, replacement: str) -> str:
    pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
    updated, count = pattern.subn(replacement, html, count=1)
    if count != 1:
        raise ValueError("Could not locate the response-time calibration block in an HTML entry point")
    return updated


def write_atomically(path: Path, content: str) -> None:
    temporary = path.with_name(f".{path.name}.recalibration.tmp")
    temporary.write_text(content, encoding="utf-8")
    temporary.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reports", nargs="+", type=Path, help="CSV or JSON adaptive-test exports")
    parser.add_argument("--replace-observations", action="store_true", help="discard observations already embedded in the app")
    parser.add_argument("--reestimate-curve", action="store_true", help="refit only the neutral fallback and sigmoid-width cap")
    parser.add_argument("--max-per-family", type=int, default=500, help="maximum retained observations per family (default: 500)")
    parser.add_argument("--dry-run", action="store_true", help="calculate and print the summary without changing files")
    args = parser.parse_args()
    if args.max_per_family < 2:
        parser.error("--max-per-family must be at least 2")
    missing = [str(path) for path in args.reports if not path.is_file()]
    if missing:
        parser.error("report files not found: " + ", ".join(missing))

    html = HTML_FILES[0].read_text(encoding="utf-8")
    existing = current_calibration(html)
    known_digests = set(existing.get("reportDigests", []))
    selected_reports = [(path, report_digest(path)) for path in args.reports]
    new_reports = [(path, digest) for path, digest in selected_reports if digest not in known_digests]
    incoming = [observation for path, _ in new_reports for observation in read_report(path)]
    if not incoming:
        parser.error("no valid observations were found (the reports may already have been imported)")

    prior = [] if args.replace_observations else retained_observations(existing)
    observations = retain_and_limit([*prior, *incoming], args.max_per_family)
    flattened = [observation for family, values in observations.items() for value in values
                 if (observation := observation_from_payload(family, value))]
    offsets = fit_family_offsets(flattened, existing.get("familyOffsets", {}))
    if args.reestimate_curve:
        neutral_seconds, curve_width_seconds = refit_fallback_curve(flattened, existing)
    else:
        neutral_seconds = round(float(existing.get("neutralSeconds", DEFAULT_NEUTRAL_SECONDS)), 3)
        curve_width_seconds = round(float(existing.get("curveWidthSeconds", DEFAULT_CURVE_WIDTH_SECONDS)), 3)

    calibration = {
        "curveWidthSeconds": curve_width_seconds,
        "familyOffsets": offsets,
        "neutralSeconds": neutral_seconds,
        "observations": observations,
        "reportDigests": ([digest for _, digest in selected_reports] if args.replace_observations
                          else sorted(known_digests | {digest for _, digest in new_reports})),
        "schemaVersion": 1,
    }
    summary = {
        "inputReports": [str(path) for path in args.reports],
        "newReports": [str(path) for path, _ in new_reports],
        "incomingValidObservations": len(incoming),
        "retainedObservations": len(flattened),
        "families": {family: len(values) for family, values in observations.items()},
        "familyOffsets": offsets,
        "neutralSeconds": neutral_seconds,
        "curveWidthSeconds": curve_width_seconds,
        "mode": "replace" if args.replace_observations else "append",
        "fallbackCurve": "re-estimated" if args.reestimate_curve else "preserved",
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2, sort_keys=True))
    if args.dry_run:
        return 0

    replacement = javascript_block(calibration)
    updated = [replace_calibration(path.read_text(encoding="utf-8"), replacement) for path in HTML_FILES]
    if len(set(updated)) != 1:
        raise ValueError("entry points differ outside the generated calibration block; refusing to write")
    for path, content in zip(HTML_FILES, updated):
        write_atomically(path, content)
    write_atomically(SUMMARY_FILE, json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
