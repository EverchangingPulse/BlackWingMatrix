#!/usr/bin/env python3
"""Render the response-time saturation curve used by BlackWingMatrix.

Run from the repository root:
    python3 docs/generate_time_calibration_plot.py

The script writes both a lossless 3600×2100 PNG and a scalable SVG.
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np


FLOOR_SCORE = 5.0
CEILING_SCORE = 60.0
FLOOR_SECONDS = 1.364
TAU_SECONDS = 8.7216


def difficulty_from_seconds(seconds: np.ndarray) -> np.ndarray:
    """Exact bounded negative-exponential mapping used in the application."""
    elapsed = np.maximum(0.0, seconds - FLOOR_SECONDS)
    return FLOOR_SCORE + (CEILING_SCORE - FLOOR_SCORE) * (
        1.0 - np.exp(-elapsed / TAU_SECONDS)
    )


def main() -> None:
    root = Path(__file__).resolve().parent
    seconds = np.linspace(0.0, 60.0, 1201)
    difficulty = difficulty_from_seconds(seconds)

    plt.rcParams.update({
        "font.family": "DejaVu Sans",
        "font.size": 17,
        "axes.titleweight": "bold",
        "axes.labelweight": "bold",
    })
    fig, axis = plt.subplots(figsize=(15, 8.75), constrained_layout=True)
    axis.plot(seconds, difficulty, color="#111111", linewidth=4.2, label="D(t)")
    axis.fill_between(seconds, FLOOR_SCORE, difficulty, color="#417c70", alpha=0.15)
    axis.axhline(FLOOR_SCORE, color="#555555", linewidth=1.6, linestyle="--")
    axis.axhline(CEILING_SCORE, color="#555555", linewidth=1.6, linestyle="--")
    axis.axvline(FLOOR_SECONDS, color="#8c3b2d", linewidth=2.0, linestyle="--")
    axis.annotate(
        "minimum human-latency offset\n1.364 s",
        xy=(FLOOR_SECONDS, FLOOR_SCORE),
        xytext=(7.5, 15.0),
        arrowprops={"arrowstyle": "->", "lw": 1.6, "color": "#8c3b2d"},
        color="#6b2d22",
        ha="left",
    )
    axis.annotate(
        "upper asymptote: 60",
        xy=(53, difficulty_from_seconds(np.array([53]))[0]),
        xytext=(35, 57),
        arrowprops={"arrowstyle": "->", "lw": 1.6, "color": "#333333"},
        color="#333333",
    )
    axis.text(
        31,
        23,
        r"$D(t)=5+55\left(1-e^{-\max(0,t-1.364)/8.7216}\right)$",
        fontsize=21,
        bbox={"boxstyle": "round,pad=0.5", "facecolor": "white", "edgecolor": "#9aa6a2"},
    )
    axis.set(
        xlim=(0, 60),
        ylim=(0, 63),
        xlabel="response time t (seconds)",
        ylabel="relative calibrated difficulty D(t) (0–60)",
        title="BlackWingMatrix — response-time saturation curve",
    )
    axis.grid(True, alpha=0.22)
    axis.legend(loc="lower right", frameon=False)

    fig.savefig(root / "time-calibration-curve.png", dpi=240, facecolor="white")
    fig.savefig(root / "time-calibration-curve.svg", facecolor="white")


if __name__ == "__main__":
    main()
