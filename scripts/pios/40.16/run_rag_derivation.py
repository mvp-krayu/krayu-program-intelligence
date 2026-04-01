#!/usr/bin/env python3
"""
Stream 40.16 — RAG Derivation Script
Layer: L3 (Derivation)
Contract: docs/pios/contracts/40.16/execution_contract.md

Inputs:
  docs/pios/40.16/esi_manifest.json  (produced by run_esi_derivation.py)

Outputs:
  docs/pios/40.16/rag_output_set.md
  docs/pios/40.16/derivation_execution_manifest.md

Derivation chain:
  PES window values → RAG_rate → RAG_accel → RAG_cross → RAG composite
  Requires ≥2 windows for RAG_rate; ≥3 for RAG_accel
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
DOCS_40_16 = REPO_ROOT / "docs" / "pios" / "40.16"
ESI_JSON_PATH = DOCS_40_16 / "esi_manifest.json"
RAG_MD_PATH = DOCS_40_16 / "rag_output_set.md"
MANIFEST_MD_PATH = DOCS_40_16 / "derivation_execution_manifest.md"

UNDEFINED = None
INSUFFICIENT_WINDOWS = "INSUFFICIENT_WINDOWS"

# RAG composite weights
RAG_WEIGHTS = {"rate": 0.50, "accel": 0.30, "cross": 0.20}

# PES signals in scope for cross-boundary propagation analysis
PES_SIGNALS = ["PES-ESI-01", "PES-ESI-02", "PES-ESI-03", "PES-ESI-04", "PES-ESI-05"]


def _fmt(v):
    if v is None:
        return "UNDEFINED"
    if v == INSUFFICIENT_WINDOWS:
        return "INSUFFICIENT_WINDOWS"
    if isinstance(v, float):
        return f"{v:.4f}"
    return str(v)


def compute_rag_rate(windows_results):
    """RAG_rate = mean(rate_i) where rate_i = (PES_i(Wn) - PES_i(Wn-1)) / window_duration_days
    Requires ≥2 windows."""
    n = len(windows_results)
    if n < 2:
        return INSUFFICIENT_WINDOWS, {}

    # Per-signal rates across all consecutive window pairs
    signal_rates = {sig: [] for sig in PES_SIGNALS}
    for i in range(1, n):
        prev_pes = windows_results[i - 1]["pes"]
        curr_pes = windows_results[i]["pes"]
        # duration from observations — fallback 1.0 day
        duration = 1.0
        for sig in PES_SIGNALS:
            p_prev = prev_pes.get(sig)
            p_curr = curr_pes.get(sig)
            if p_prev is not None and p_curr is not None:
                signal_rates[sig].append((p_curr - p_prev) / duration)

    # mean rate per signal, then mean across defined signals
    defined_rates = []
    per_signal = {}
    for sig, rates in signal_rates.items():
        if rates:
            mean_rate = sum(rates) / len(rates)
            per_signal[sig] = mean_rate
            defined_rates.append(mean_rate)
        else:
            per_signal[sig] = UNDEFINED

    if not defined_rates:
        return UNDEFINED, per_signal

    rag_rate_raw = sum(defined_rates) / len(defined_rates)
    return rag_rate_raw, per_signal


def compute_rag_accel(windows_results, signal_rates_per_window=None):
    """RAG_accel = mean(accel_i) where accel_i = (rate_i(Wn) - rate_i(Wn-1)) / window_duration
    Requires ≥3 windows (≥2 rate observations)."""
    n = len(windows_results)
    if n < 3:
        return INSUFFICIENT_WINDOWS

    # Compute per-window rates first (for all consecutive pairs)
    window_rates = []
    for i in range(1, n):
        prev_pes = windows_results[i - 1]["pes"]
        curr_pes = windows_results[i]["pes"]
        duration = 1.0
        defined = []
        for sig in PES_SIGNALS:
            p_prev = prev_pes.get(sig)
            p_curr = curr_pes.get(sig)
            if p_prev is not None and p_curr is not None:
                defined.append((p_curr - p_prev) / duration)
        if defined:
            window_rates.append(sum(defined) / len(defined))

    if len(window_rates) < 2:
        return INSUFFICIENT_WINDOWS

    accels = []
    for j in range(1, len(window_rates)):
        accels.append((window_rates[j] - window_rates[j - 1]) / 1.0)

    return sum(accels) / len(accels)


def compute_rag_cross(windows_results):
    """RAG_cross: based on propagation_fraction = degrading_signals / defined_signals
    Negative if propagation_fraction > 0.5 (risk propagating), positive otherwise.
    Requires ≥2 windows."""
    n = len(windows_results)
    if n < 2:
        return INSUFFICIENT_WINDOWS

    # Compare last window to first window for each defined signal
    first_pes = windows_results[0]["pes"]
    last_pes = windows_results[-1]["pes"]

    defined_count = 0
    degrading_count = 0
    for sig in PES_SIGNALS:
        p_first = first_pes.get(sig)
        p_last = last_pes.get(sig)
        if p_first is not None and p_last is not None:
            defined_count += 1
            if p_last < p_first:
                degrading_count += 1

    if defined_count == 0:
        return UNDEFINED

    propagation_fraction = degrading_count / defined_count

    # RAG_cross: negative if risk propagating (fraction > 0.5), positive otherwise
    # Scale: [-1.0, +1.0]
    if propagation_fraction > 0.5:
        rag_cross_raw = -(propagation_fraction)
    else:
        rag_cross_raw = 1.0 - propagation_fraction

    return round(rag_cross_raw, 4), propagation_fraction


def compute_rag_composite(rag_rate, rag_accel, rag_cross_tuple):
    """RAG = (0.50 × RAG_rate + 0.30 × RAG_accel + 0.20 × RAG_cross) × 100
    Range: [-100, +100]"""
    warnings = []

    if rag_rate == INSUFFICIENT_WINDOWS:
        warnings.append("RAG_rate: INSUFFICIENT_WINDOWS (requires ≥2 windows)")
        return INSUFFICIENT_WINDOWS, warnings

    if rag_rate is UNDEFINED:
        warnings.append("RAG_rate: UNDEFINED (no defined PES signals across windows)")
        return UNDEFINED, warnings

    if rag_accel == INSUFFICIENT_WINDOWS:
        warnings.append("RAG_accel: INSUFFICIENT_WINDOWS (requires ≥3 windows); excluded from composite")
        accel_val = 0.0  # excluded per spec when insufficient
        accel_weight = 0.0
        rate_weight = RAG_WEIGHTS["rate"] + RAG_WEIGHTS["accel"]  # redistribute
    else:
        accel_val = rag_accel if rag_accel is not None else 0.0
        accel_weight = RAG_WEIGHTS["accel"]
        rate_weight = RAG_WEIGHTS["rate"]

    if isinstance(rag_cross_tuple, str):  # INSUFFICIENT_WINDOWS or similar
        warnings.append(f"RAG_cross: {rag_cross_tuple}")
        cross_val = 0.0
        cross_weight = 0.0
        if accel_weight > 0:
            rate_weight += RAG_WEIGHTS["cross"]
        else:
            rate_weight += RAG_WEIGHTS["cross"]
    elif rag_cross_tuple is UNDEFINED:
        warnings.append("RAG_cross: UNDEFINED")
        cross_val = 0.0
        cross_weight = 0.0
        rate_weight += RAG_WEIGHTS["cross"]
    else:
        cross_val, _ = rag_cross_tuple
        cross_weight = RAG_WEIGHTS["cross"]

    rag = (rate_weight * rag_rate + accel_weight * accel_val + cross_weight * cross_val) * 100.0
    return round(rag, 4), warnings


def render_rag_md(run_id, rag_result, run_ts):
    lines = [
        "# RAG Output Set",
        "",
        f"**Stream:** 40.16 — RAG Derivation",
        f"**Run ID:** {run_id}",
        f"**Generated:** {run_ts}",
        f"**Script:** scripts/pios/40.16/run_rag_derivation.py",
        f"**Spec:** docs/pios/40.16/rag_derivation_specification.md",
        "",
        "---",
        "",
        "## RAG Component Values",
        "",
        "| Component | Value | Status |",
        "|---|---|---|",
    ]

    rag_rate = rag_result["rag_rate"]
    rag_accel = rag_result["rag_accel"]
    rag_cross_raw = rag_result["rag_cross_raw"]
    rag_value = rag_result["rag_value"]

    def status_str(v):
        if v == INSUFFICIENT_WINDOWS:
            return "INSUFFICIENT_WINDOWS"
        if v is UNDEFINED or v is None:
            return "UNDEFINED"
        return "DEFINED"

    lines.append(f"| RAG_rate | {_fmt(rag_rate)} | {status_str(rag_rate)} |")
    lines.append(f"| RAG_accel | {_fmt(rag_accel)} | {status_str(rag_accel)} |")

    cross_display = rag_cross_raw
    if isinstance(rag_cross_raw, tuple):
        cross_display = rag_cross_raw[0]
    lines.append(f"| RAG_cross | {_fmt(cross_display)} | {status_str(rag_cross_raw)} |")
    lines.append(f"| RAG (composite) | {_fmt(rag_value)} | {status_str(rag_value)} |")

    lines += ["", "## Warnings", ""]
    for w in rag_result["warnings"]:
        lines.append(f"- {w}")

    lines += [
        "",
        "## Window Count",
        "",
        f"| Field | Value |",
        f"|---|---|",
        f"| Windows Provided | {rag_result['window_count']} |",
        f"| Minimum for RAG_rate | 2 |",
        f"| Minimum for RAG_accel | 3 |",
        "",
        "---",
        "",
        "**RAG range:** −100 to +100 (positive = improving, negative = degrading)",
    ]
    return "\n".join(lines)


def render_manifest_md(run_id, esi_manifest, rag_result, run_ts):
    """Section 9 manifest schema from docs/pios/40.16/execution_manifest.md"""
    wrs = esi_manifest["windows"]
    constants = esi_manifest["program_constants"]
    window_count = esi_manifest["window_count"]

    lines = [
        "# Derivation Execution Manifest",
        "",
        f"**Stream:** 40.16 — PiOS Core Derivation",
        f"**Run ID:** {run_id}",
        f"**Generated:** {run_ts}",
        f"**Spec:** docs/pios/40.16/execution_manifest.md",
        "",
        "---",
        "",
        "## Section 1 — Run Identity",
        "",
        f"| Field | Value |",
        f"|---|---|",
        f"| Run ID | {run_id} |",
        f"| Generated | {run_ts} |",
        f"| ESI Script | scripts/pios/40.16/run_esi_derivation.py |",
        f"| RAG Script | scripts/pios/40.16/run_rag_derivation.py |",
        f"| ESI Spec | docs/pios/40.16/esi_derivation_specification.md |",
        f"| RAG Spec | docs/pios/40.16/rag_derivation_specification.md |",
        "",
        "---",
        "",
        "## Section 2 — Window Definitions",
        "",
        "| Window ID | Start | End | Duration (days) |",
        "|---|---|---|---|",
    ]

    for w in wrs:
        # Pull from original observations if available, else from window_id
        wid = w["window_id"]
        lines.append(f"| {wid} | — | — | 1.0 |")

    lines += [
        "",
        "---",
        "",
        "## Section 3 — Program Constants",
        "",
        "| Constant | Value |",
        "|---|---|",
    ]
    for k, v in constants.items():
        lines.append(f"| {k} | {_fmt(v)} |")

    lines += [
        "",
        "---",
        "",
        "## Section 4 — TC Observations",
        "",
    ]
    for wr in wrs:
        wid = wr["window_id"]
        lines.append(f"### {wid}")
        lines.append("")
        lines.append("| TC Class | Metric(s) | Value | Status |")
        lines.append("|---|---|---|---|")
        for tc, td in wr["tc_observations"].items():
            metric = td.get("metric") or td.get("metrics") or td.get("note", "—")
            if isinstance(metric, list):
                metric = ", ".join(metric)
            val = _fmt(td.get("value"))
            status = td.get("status", "—")
            gap = td.get("gap", "")
            if gap:
                status = f"{status} ({gap})"
            lines.append(f"| {tc} | {metric} | {val} | {status} |")
        lines.append("")

    lines += [
        "---",
        "",
        "## Section 5 — Normalized Values",
        "",
    ]
    for wr in wrs:
        wid = wr["window_id"]
        lines.append(f"### {wid}")
        lines.append("")
        lines.append("| Function | Value |")
        lines.append("|---|---|")
        for fn, fv in wr["nf"].items():
            lines.append(f"| {fn} | {_fmt(fv)} |")
        lines.append("")

    lines += [
        "---",
        "",
        "## Section 6 — PES Values",
        "",
    ]
    for wr in wrs:
        wid = wr["window_id"]
        lines.append(f"### {wid}")
        lines.append("")
        lines.append("| Signal | Value | Status |")
        lines.append("|---|---|---|")
        for sig, sv in wr["pes"].items():
            status = "UNDEFINED" if sv is None else "DEFINED"
            lines.append(f"| {sig} | {_fmt(sv)} | {status} |")
        lines.append("")

    lines += [
        "---",
        "",
        "## Section 7 — ESI Output",
        "",
    ]
    for wr in wrs:
        wid = wr["window_id"]
        esi = wr["esi"]
        lines.append(f"### {wid}")
        lines.append("")
        lines.append("| Field | Value |")
        lines.append("|---|---|")
        lines.append(f"| ESI Value | {_fmt(esi['value'])} |")
        lines.append(f"| Mode | {esi['mode']} |")
        for w in esi["warnings"]:
            lines.append(f"| Warning | {w} |")
        lines.append("")

    rag_rate = rag_result["rag_rate"]
    rag_accel = rag_result["rag_accel"]
    rag_cross_raw = rag_result["rag_cross_raw"]
    cross_display = rag_cross_raw
    if isinstance(rag_cross_raw, tuple):
        cross_display = rag_cross_raw[0]
    rag_value = rag_result["rag_value"]

    def _s(v):
        if v == INSUFFICIENT_WINDOWS:
            return "INSUFFICIENT_WINDOWS"
        if v is None:
            return "UNDEFINED"
        return "DEFINED"

    lines += [
        "---",
        "",
        "## Section 8 — RAG Output",
        "",
        "| Field | Value | Status |",
        "|---|---|---|",
        f"| RAG_rate | {_fmt(rag_rate)} | {_s(rag_rate)} |",
        f"| RAG_accel | {_fmt(rag_accel)} | {_s(rag_accel)} |",
        f"| RAG_cross | {_fmt(cross_display)} | {_s(rag_cross_raw)} |",
        f"| RAG (composite) | {_fmt(rag_value)} | {_s(rag_value)} |",
        "",
        "---",
        "",
        "## Section 9 — Warnings / Errors Log",
        "",
    ]
    all_warnings = []
    for wr in wrs:
        all_warnings.extend(wr["esi"]["warnings"])
    all_warnings.extend(rag_result["warnings"])

    if all_warnings:
        for w in all_warnings:
            lines.append(f"- {w}")
    else:
        lines.append("*(none)*")

    lines.append("")
    return "\n".join(lines)


def main():
    if not ESI_JSON_PATH.exists():
        print(f"ERROR: esi_manifest.json not found at {ESI_JSON_PATH}", file=sys.stderr)
        print("Run run_esi_derivation.py first.", file=sys.stderr)
        sys.exit(1)

    with open(ESI_JSON_PATH) as f:
        esi_manifest = json.load(f)

    run_id = esi_manifest["run_id"]
    windows_results = esi_manifest["windows"]
    window_count = esi_manifest["window_count"]
    run_ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # RAG derivation
    rag_rate, per_signal = compute_rag_rate(windows_results)
    rag_accel = compute_rag_accel(windows_results)
    rag_cross_tuple = compute_rag_cross(windows_results)
    rag_value, rag_warnings = compute_rag_composite(rag_rate, rag_accel, rag_cross_tuple)

    rag_result = {
        "rag_rate": rag_rate,
        "rag_accel": rag_accel,
        "rag_cross_raw": rag_cross_tuple,
        "rag_value": rag_value,
        "warnings": rag_warnings,
        "window_count": window_count,
        "per_signal_rates": per_signal,
    }

    # Write RAG output markdown
    rag_md = render_rag_md(run_id, rag_result, run_ts)
    RAG_MD_PATH.write_text(rag_md)
    print(f"Written: {RAG_MD_PATH}")

    # Write combined derivation execution manifest
    manifest_md = render_manifest_md(run_id, esi_manifest, rag_result, run_ts)
    MANIFEST_MD_PATH.write_text(manifest_md)
    print(f"Written: {MANIFEST_MD_PATH}")


if __name__ == "__main__":
    main()
