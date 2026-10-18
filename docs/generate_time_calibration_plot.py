#!/usr/bin/env python3
"""Render the merged runtime response-time signal used by BlackWingMatrix.

Run from the repository root:
    python3 docs/generate_time_calibration_plot.py

The plot reads the generated calibration payload from index.html, so it always
documents the same fallback neutral time and width cap used by the app.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np


START = "/* RESPONSE_TIME_CALIBRATION_DATA_START */"
END = "/* RESPONSE_TIME_CALIBRATION_DATA_END */"


def read_calibration(html_path: Path) -> dict[str, float]:
    html = html_path.read_text(encoding="utf-8")
    match = re.search(
        re.escape(START)
        + r"\s*(?://.*?\n)*const RESPONSE_TIME_CALIBRATION\s*=\s*(\{.*?\});\s*"
        + re.escape(END),
        html,
        re.DOTALL,
    )
    if not match:
        raise RuntimeError("RESPONSE_TIME_CALIBRATION block not found in index.html")
    payload = json.loads(match.group(1))
    return {
        "neutralSeconds": float(payload.get("neutralSeconds", 60)),
        "curveWidthSeconds": float(payload.get("curveWidthSeconds", 22)),
    }


def response_signal(seconds: np.ndarray, expected_seconds: float, width_cap: float) -> np.ndarray:
    expected = max(8.0, expected_seconds)
    width = max(8.0, min(width_cap, expected * 0.38))
    elapsed = np.clip(seconds, 1.0, 240.0)
    sigmoid = 1.0 / (1.0 + np.exp(-(elapsed - expected) / width))
    return np.clip(1.0 - 2.0 * sigmoid, -1.0, 1.0)


def main() -> None:
    docs = Path(__file__).resolve().parent
    root = docs.parent
    calibration = read_calibration(root / "index.html")
    neutral = calibration["neutralSeconds"]
    width_cap = calibration["curveWidthSeconds"]
    seconds = np.linspace(0.0, min(180.0, max(120.0, neutral * 2.2)), 1201)
    signal = response_signal(seconds, neutral, width_cap)
    active_width = max(8.0, min(width_cap, neutral * 0.38))

    plt.rcParams.update({
        "font.family": "DejaVu Sans",
        "font.size": 17,
        "axes.titleweight": "bold",
        "axes.labelweight": "bold",
    })
    fig, axis = plt.subplots(figsize=(15, 8.75), constrained_layout=True)
    axis.plot(seconds, signal, color="#111111", linewidth=4.2, label="time signal")
    axis.fill_between(seconds, 0, signal, where=signal >= 0, color="#417c70", alpha=0.16)
    axis.fill_between(seconds, 0, signal, where=signal < 0, color="#8c3b2d", alpha=0.16)
    axis.axhline(0, color="#555555", linewidth=1.6, linestyle="--")
    axis.axvline(neutral, color="#8c3b2d", linewidth=2.0, linestyle="--")
    axis.annotate(
        f"context-free neutral time\n{neutral:.1f} s",
        xy=(neutral, 0),
        xytext=(neutral * 1.12, 0.55),
        arrowprops={"arrowstyle": "->", "lw": 1.6, "color": "#8c3b2d"},
        color="#6b2d22",
        ha="left",
    )
    axis.text(
        seconds[-1] * 0.46,
        -0.72,
        rf"$S(t)=1-2\sigma((t-{neutral:.1f})/{active_width:.1f})$",
        fontsize=21,
        bbox={"boxstyle": "round,pad=0.5", "facecolor": "white", "edgecolor": "#9aa6a2"},
    )
    axis.set(
        xlim=(0, seconds[-1]),
        ylim=(-1.1, 1.1),
        xlabel="response time t (seconds)",
        ylabel="adaptive time signal (fast +1, slow −1)",
        title="BlackWingMatrix — merged response-time calibration",
    )
    axis.grid(True, alpha=0.22)
    axis.legend(loc="lower right", frameon=False)

    fig.savefig(docs / "time-calibration-curve.png", dpi=240, facecolor="white")
    fig.savefig(docs / "time-calibration-curve.svg", facecolor="white")


if __name__ == "__main__":
    main()
