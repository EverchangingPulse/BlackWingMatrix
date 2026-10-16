#!/usr/bin/env python3
"""Recalibrate BlackWingMatrix from exported adaptive-test CSV/JSON reports.

The tool uses response time and item difficulty only. It preserves the app's
existing time-only approach, merges one or more reports deterministically,
re-estimates the bounded saturation curve and updates both standalone HTML
entry points atomically after validation.

Examples:
  python3 tools/recalibrate_reports.py reports/*.csv
  python3 tools/recalibrate_reports.py run.json run.csv --dry-run
  python3 tools/recalibrate_reports.py reports/*.json --replace-observations
  python3 tools/recalibrate_reports.py reports/*.csv --reestimate-curve
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import re
import statistics
import subprocess
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = (ROOT / "index.html", ROOT / "blackwingmatrix.html")
SUMMARY_FILE = ROOT / "tools" / "last-recalibration-summary.json"
START = "/* TIME_CALIBRATION_DATA_START */"
END = "/* TIME_CALIBRATION_DATA_END */"
FLOOR_SCORE, CEILING_SCORE = 5.0, 60.0
BANDWIDTH = 9.0


def as_number(value: Any) -> float | None:
    try:
        number = float(str(value).strip())
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def truthy(value: Any) -> bool:
    return str(value).strip().lower() in {"1", "true", "yes", "si", "sì"}


def row_observation(row: dict[str, Any]) -> tuple[str, float, float] | None:
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
    if not family or score is None or seconds is None:
        return None
    # Reports from older versions can contain early calibration items below the
    # current display floor of 5. They remain useful timing evidence and the
    # JavaScript mapping clamps only when it evaluates a score.
    if not (1.0 <= score <= CEILING_SCORE and seconds > 0):
        return None
    return family, round(score, 3), round(seconds, 3)


def read_json_rows(payload: Any) -> Iterable[dict[str, Any]]:
    if isinstance(payload, dict):
        exercises = payload.get("exercises")
        if isinstance(exercises, list):
            yield from (entry for entry in exercises if isinstance(entry, dict))
        elif all(key in payload for key in ("family", "itemScore")):
            yield payload
    elif isinstance(payload, list):
        yield from (entry for entry in payload if isinstance(entry, dict))


def read_report(path: Path) -> list[tuple[str, float, float]]:
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


def legacy_calibration(html: str) -> dict[str, Any]:
    """Read the pre-marker block once, without attempting to parse JavaScript in Python."""
    source = (
        "const fs=require('fs');"
        "const s=fs.readFileSync(process.argv[1],'utf8');"
        "const a=s.indexOf('const TIME_RESPONSE_CALIBRATION=');"
        "const b=s.indexOf('function relativeDifficultyFromResponseTime',a);"
        "if(a<0||b<0)process.exit(2);"
        "eval(s.slice(a,b)+';console.log(JSON.stringify(TIME_RESPONSE_CALIBRATION));');"
    )
    completed = subprocess.run(
        ["node", "-e", source, str(HTML_FILES[0])], check=True, text=True,
        capture_output=True,
    )
    return json.loads(completed.stdout)


def current_calibration(html: str) -> dict[str, Any]:
    match = re.search(
        re.escape(START)
        + r"\s*const TIME_RESPONSE_CALIBRATION = (\{.*?\});\s*"
        + re.escape(END),
        html,
        re.DOTALL,
    )
    return json.loads(match.group(1)) if match else legacy_calibration(html)


def difficulty(seconds: float, floor_seconds: float, tau_seconds: float) -> float:
    elapsed = max(0.0, seconds - floor_seconds)
    return max(FLOOR_SCORE, min(
        CEILING_SCORE,
        FLOOR_SCORE + (CEILING_SCORE - FLOOR_SCORE) * (1 - math.exp(-elapsed / tau_seconds)),
    ))


def huber(residual: float, delta: float = 7.5) -> float:
    magnitude = abs(residual)
    return 0.5 * magnitude * magnitude if magnitude <= delta else delta * (magnitude - 0.5 * delta)


def fit_curve(observations: list[tuple[str, float, float]], fallback: dict[str, Any]) -> tuple[float, float]:
    """Deterministic robust grid fit of offset and time constant.

    The score scale is relative, so a Huber objective limits the impact of an
    unusually long pause while retaining the bounded saturation model.
    """
    if len(observations) < 20:
        return float(fallback["floorSeconds"]), float(fallback["tauSeconds"])
    times = sorted(seconds for _, _, seconds in observations)
    tenth = times[max(0, int(.1 * (len(times) - 1)))]
    floor_max = min(3.5, max(0.3, tenth))
    best: tuple[float, float, float] | None = None
    for floor_tick in range(0, int(floor_max * 20) + 1):
        floor = floor_tick / 20
        for tau_tick in range(30, 241):
            tau = tau_tick / 10
            loss = sum(huber(difficulty(seconds, floor, tau) - score) for _, score, seconds in observations)
            candidate = (loss, floor, tau)
            if best is None or candidate < best:
                best = candidate
    assert best is not None
    return round(best[1], 4), round(best[2], 4)


def retain_and_limit(
    observations: Iterable[tuple[str, float, float]], maximum_per_family: int,
) -> dict[str, list[list[float]]]:
    grouped: dict[str, list[tuple[float, float]]] = defaultdict(list)
    for family, score, seconds in observations:
        grouped[family].append((round(score, 3), round(seconds, 3)))
    result: dict[str, list[list[float]]] = {}
    for family in sorted(grouped):
        values = sorted(grouped[family])
        if len(values) > maximum_per_family:
            # Deterministic evenly spaced thinning keeps the full score range
            # without retaining an ever-growing browser payload.
            values = [values[round(index * (len(values) - 1) / (maximum_per_family - 1))]
                      for index in range(maximum_per_family)]
        result[family] = [[score, seconds] for score, seconds in values]
    return result


def report_digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def javascript_block(calibration: dict[str, Any]) -> str:
    payload = json.dumps(calibration, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    return f'''{START}
// Generated by tools/recalibrate_reports.py. Do not hand-edit this payload.
const TIME_RESPONSE_CALIBRATION = {payload};
{END}
function relativeDifficultyFromResponseTime(seconds){{const c=TIME_RESPONSE_CALIBRATION,time=Math.max(0,Number(seconds)||0);return clampAdaptive(c.floorScore+(c.ceilingScore-c.floorScore)*(1-Math.exp(-Math.max(0,time-c.floorSeconds)/c.tauSeconds)),c.floorScore,c.ceilingScore)}}
function timeResponseAdjustment(family,rawScore){{const samples=TIME_RESPONSE_CALIBRATION.observations[family]||[];if(!samples.length)return{{adjustment:0,support:0,growth:0}};const bandwidth=TIME_RESPONSE_CALIBRATION.bandwidth,x=Math.max(0,Math.min(1,(Number(rawScore)-5)/55)),residuals=samples.map(([score,seconds])=>({{x:Math.max(0,Math.min(1,(score-5)/55)),delta:relativeDifficultyFromResponseTime(seconds)-score}})),mean=values=>values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length),meanX=mean(residuals.map(point=>point.x)),meanDelta=mean(residuals.map(point=>point.delta)),variance=mean(residuals.map(point=>(point.x-meanX)**2)),covariance=mean(residuals.map(point=>(point.x-meanX)*(point.delta-meanDelta))),slope=covariance/(variance+.08),curve=meanDelta+slope*(x-meanX);let localWeighted=0,support=0;for(const point of residuals){{const weight=Math.exp(-.5*((x-point.x)*55/bandwidth)**2);localWeighted+=weight*point.delta;support+=weight}}const local=localWeighted/Math.max(support,.0001),localReliability=1-Math.exp(-support/1.6),curveReliability=samples.length/(samples.length+4),combined=(local*localReliability+curve*curveReliability)/Math.max(.0001,localReliability+curveReliability),growth=x,adjustment=Math.max(-10,Math.min(10,combined*Math.max(localReliability,curveReliability)))*growth;return{{adjustment,support,curve,curveReliability,growth}}}}
function timeCalibratedDifficulty(family,rawScore){{return clampAdaptive(Number(rawScore)+timeResponseAdjustment(family,Number(rawScore)).adjustment,5,60)}}
function generatorDifficultyForCalibratedTarget(family,target){{if(!(TIME_RESPONSE_CALIBRATION.observations[family]||[]).length)return target;let best=target,bestGap=Infinity;for(let raw=5;raw<=60;raw+=.25){{const gap=Math.abs(timeCalibratedDifficulty(family,raw)-target),tie=Math.abs(raw-target)<Math.abs(best-target);if(gap<bestGap-.00001||(Math.abs(gap-bestGap)<.00001&&tie)){{best=raw;bestGap=gap}}}}return+best.toFixed(2)}}
'''


def replace_calibration(html: str, replacement: str) -> str:
    pattern = re.compile(
        r"(?:/\* TIME_CALIBRATION_DATA_START \*/\s*)?const TIME_RESPONSE_CALIBRATION=.*?"
        r"(?=function makeDifficultyMatchedPuzzle)",
        re.DOTALL,
    )
    updated, count = pattern.subn(replacement, html, count=1)
    if count != 1:
        raise ValueError("Could not locate the calibration block in an HTML entry point")
    return updated


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reports", nargs="+", type=Path, help="CSV or JSON adaptive-test exports")
    parser.add_argument("--replace-observations", action="store_true", help="discard observations already embedded in the app")
    parser.add_argument("--reestimate-curve", action="store_true", help="robustly refit the global latency offset and time constant")
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
    prior = [] if args.replace_observations else [
        (family, float(score), float(seconds))
        for family, pairs in existing.get("observations", {}).items()
        for score, seconds in pairs
    ]
    merged = prior + incoming
    observations = retain_and_limit(merged, args.max_per_family)
    flattened = [(family, score, seconds) for family, pairs in observations.items() for score, seconds in pairs]
    if args.reestimate_curve:
        floor_seconds, tau_seconds = fit_curve(flattened, existing)
    else:
        floor_seconds = round(float(existing["floorSeconds"]), 4)
        tau_seconds = round(float(existing["tauSeconds"]), 4)
    calibration = {
        "bandwidth": BANDWIDTH,
        "ceilingScore": CEILING_SCORE,
        "floorScore": FLOOR_SCORE,
        "floorSeconds": floor_seconds,
        "observations": observations,
        "reportDigests": [digest for _, digest in selected_reports] if args.replace_observations else sorted(known_digests | {digest for _, digest in new_reports}),
        "tauSeconds": tau_seconds,
    }
    summary = {
        "inputReports": [str(path) for path in args.reports],
        "newReports": [str(path) for path, _ in new_reports],
        "incomingValidObservations": len(incoming),
        "retainedObservations": len(flattened),
        "families": {family: len(pairs) for family, pairs in observations.items()},
        "floorSeconds": floor_seconds,
        "tauSeconds": tau_seconds,
        "mode": "replace" if args.replace_observations else "append",
        "globalCurve": "re-estimated" if args.reestimate_curve else "preserved",
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2, sort_keys=True))
    if args.dry_run:
        return 0

    replacement = javascript_block(calibration)
    updated = [replace_calibration(path.read_text(encoding="utf-8"), replacement) for path in HTML_FILES]
    if len(set(updated)) != 1:
        raise ValueError("entry points differ outside the generated calibration block; refusing to write")
    for path, content in zip(HTML_FILES, updated):
        path.write_text(content, encoding="utf-8")
    SUMMARY_FILE.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
