#!/usr/bin/env python3
"""
Stream 40.16 — ESI Derivation Script
Layer: L3 (Derivation)
Contract: docs/pios/contracts/40.16/execution_contract.md

PRIMARY input path: docs/pios/40.4/ (via load_40_4_intake.py)
SECONDARY input path (harness/override): docs/pios/40.16/observations.json +
  docs/pios/40.16/program_constants.json

Usage:
  python run_esi_derivation.py                  # 40.4 primary path (default)
  python run_esi_derivation.py --harness        # observations.json harness path

Outputs:
  docs/pios/40.16/esi_output_set.md
  docs/pios/40.16/esi_manifest.json  (internal handoff to RAG script)

Derivation chain:
  40.4 AT/DT metrics → TC observations → NF-01..07 → PES-ESI-01..05 → ESI composite
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
DOCS_40_16 = REPO_ROOT / "docs" / "pios" / "40.16"
OBS_PATH = DOCS_40_16 / "observations.json"
CONST_PATH = DOCS_40_16 / "program_constants.json"
ESI_MD_PATH = DOCS_40_16 / "esi_output_set.md"
ESI_JSON_PATH = DOCS_40_16 / "esi_manifest.json"

# Primary input path — loaded at runtime
sys.path.insert(0, str(Path(__file__).parent))
from load_40_4_intake import build_40_4_run

UNDEFINED = None


def clamp(v):
    if v is None:
        return None
    return max(0.0, min(1.0, v))


# ---------------------------------------------------------------------------
# Normalization functions (NF-01..07)
# Spec: docs/pios/40.16/derivation_normalization_rules.md
# ---------------------------------------------------------------------------

def nf_01(at_001, f_expected):
    """NF-01: Automation trigger frequency — min(1.0, F_observed / F_expected)"""
    if at_001 is None or f_expected is None or f_expected == 0:
        return UNDEFINED
    return clamp(at_001 / f_expected)


def nf_02(variance, sigma_max, window_count):
    """NF-02: Execution stability — max(0.0, 1.0 - (variance / sigma_max))
    Returns 0.5 (neutral) if window_count < 3."""
    if window_count < 3:
        return 0.5  # neutral per spec
    if variance is None or sigma_max is None or sigma_max == 0:
        return UNDEFINED
    return clamp(1.0 - (variance / sigma_max))


def nf_03(runs_completed, runs_total):
    """NF-03: Run completion rate — runs_completed / runs_total"""
    if runs_completed is None or runs_total is None or runs_total == 0:
        return UNDEFINED
    return clamp(runs_completed / runs_total)


def nf_04(artifacts_delivered, artifacts_expected):
    """NF-04: Artifact delivery ratio — min(1.0, delivered / expected)"""
    if artifacts_delivered is None or artifacts_expected is None or artifacts_expected == 0:
        return UNDEFINED
    return clamp(artifacts_delivered / artifacts_expected)


def nf_05(l_observed, l_target, l_max):
    """NF-05: Latency — max(0.0, min(1.0, 1.0 - ((L_obs - L_target) / (L_max - L_target))))"""
    if l_observed is None or l_target is None or l_max is None:
        return UNDEFINED
    if l_max == l_target:
        return UNDEFINED
    return clamp(1.0 - ((l_observed - l_target) / (l_max - l_target)))


def nf_06(gates_enforced, gates_defined):
    """NF-06: Validation gate enforcement — min(1.0, gates_enforced / gates_defined)"""
    if gates_enforced is None or gates_defined is None or gates_defined == 0:
        return UNDEFINED
    return clamp(gates_enforced / gates_defined)


def nf_07(feedback_events, feedback_expected):
    """NF-07: Feedback routing rate — min(1.0, events / expected)"""
    if feedback_events is None or feedback_expected is None or feedback_expected == 0:
        return UNDEFINED
    return clamp(feedback_events / feedback_expected)


# ---------------------------------------------------------------------------
# PES signal computation (PES-ESI-01..05)
# Spec: docs/pios/40.16/esi_derivation_specification.md
# ---------------------------------------------------------------------------

def pes_esi_01(nf01, nf02):
    """PES-ESI-01: Execution Cadence — (0.6 × NF-01) + (0.4 × NF-02)"""
    if nf01 is None or nf02 is None:
        return UNDEFINED
    return (0.6 * nf01) + (0.4 * nf02)


def pes_esi_02(tc09_defined):
    """PES-ESI-02: Cost/Budget Adherence — requires TC-09; permanently UNDEFINED under CG-01"""
    if not tc09_defined:
        return UNDEFINED
    return UNDEFINED  # CG-01 active: no cost telemetry in 40.4


def pes_esi_03(nf03, nf04):
    """PES-ESI-03: Pipeline Completion Quality — (NF-03 + NF-04) / 2"""
    if nf03 is None or nf04 is None:
        return UNDEFINED
    return (nf03 + nf04) / 2.0


def pes_esi_04(nf05):
    """PES-ESI-04: Delivery Latency — NF-05"""
    return nf05  # may be UNDEFINED


def pes_esi_05(nf06, nf07):
    """PES-ESI-05: Governance Compliance — (NF-06 + NF-07) / 2"""
    if nf06 is None or nf07 is None:
        return UNDEFINED
    return (nf06 + nf07) / 2.0


# ---------------------------------------------------------------------------
# ESI composite — full mode and PARTIAL mode
# Spec: docs/pios/40.16/esi_derivation_specification.md §3
# PARTIAL weights (renormalized, CG-01):
#   P01=0.3125, P03=0.3125, P04=0.2500, P05=0.1250
# ---------------------------------------------------------------------------

FULL_WEIGHTS = {
    "PES-ESI-01": 0.25,
    "PES-ESI-02": 0.20,
    "PES-ESI-03": 0.25,
    "PES-ESI-04": 0.20,
    "PES-ESI-05": 0.10,
}

PARTIAL_WEIGHTS = {
    "PES-ESI-01": 0.3125,
    "PES-ESI-03": 0.3125,
    "PES-ESI-04": 0.2500,
    "PES-ESI-05": 0.1250,
}


def compute_esi(pes_values):
    """Returns (esi_value, mode, warnings)."""
    warnings = []
    p01 = pes_values.get("PES-ESI-01")
    p02 = pes_values.get("PES-ESI-02")
    p03 = pes_values.get("PES-ESI-03")
    p04 = pes_values.get("PES-ESI-04")
    p05 = pes_values.get("PES-ESI-05")

    # CG-01 is active when P02 is UNDEFINED
    cg01_active = p02 is None
    if cg01_active:
        warnings.append("CG-01 ACTIVE: TC-09 not defined; PES-ESI-02 UNDEFINED; ESI computed in PARTIAL mode")

    if cg01_active:
        # PARTIAL mode: requires P01, P03, P04, P05
        if p01 is None:
            warnings.append("PES-ESI-01 UNDEFINED; ESI UNDEFINED")
            return UNDEFINED, "PARTIAL", warnings
        if p03 is None:
            warnings.append("PES-ESI-03 UNDEFINED; ESI UNDEFINED")
            return UNDEFINED, "PARTIAL", warnings
        # P04 and P05 may be UNDEFINED — ESI UNDEFINED if so
        if p04 is None:
            warnings.append("PES-ESI-04 UNDEFINED; ESI UNDEFINED")
            return UNDEFINED, "PARTIAL", warnings
        if p05 is None:
            warnings.append("PES-ESI-05 UNDEFINED; ESI UNDEFINED")
            return UNDEFINED, "PARTIAL", warnings
        esi = (
            PARTIAL_WEIGHTS["PES-ESI-01"] * p01
            + PARTIAL_WEIGHTS["PES-ESI-03"] * p03
            + PARTIAL_WEIGHTS["PES-ESI-04"] * p04
            + PARTIAL_WEIGHTS["PES-ESI-05"] * p05
        ) * 100.0
        return round(esi, 4), "PARTIAL", warnings
    else:
        # Full mode
        if any(v is None for v in [p01, p02, p03, p04, p05]):
            warnings.append("One or more PES signals UNDEFINED; ESI UNDEFINED")
            return UNDEFINED, "FULL", warnings
        esi = (
            FULL_WEIGHTS["PES-ESI-01"] * p01
            + FULL_WEIGHTS["PES-ESI-02"] * p02
            + FULL_WEIGHTS["PES-ESI-03"] * p03
            + FULL_WEIGHTS["PES-ESI-04"] * p04
            + FULL_WEIGHTS["PES-ESI-05"] * p05
        ) * 100.0
        return round(esi, 4), "FULL", warnings


# ---------------------------------------------------------------------------
# Per-window derivation
# ---------------------------------------------------------------------------

def derive_window(window, constants, window_count):
    obs = window["observations"]
    wid = window["window_id"]

    # TC → AT/DT metric extraction
    at_001 = obs.get("AT-001")
    at_007 = obs.get("AT-007")
    at_009 = obs.get("AT-009")
    dt_001 = obs.get("DT-001")
    dt_003 = obs.get("DT-003")
    dt_006 = obs.get("DT-006")
    dt_007 = obs.get("DT-007")
    dt_008 = obs.get("DT-008")

    # Derived TC values
    runs_completed = 1 if dt_007 == "complete" else (0 if dt_007 == "incomplete" else None)
    runs_total = 1 if dt_007 is not None else None
    artifacts_delivered = None
    if dt_001 is not None and dt_003 is not None:
        artifacts_delivered = dt_001 + dt_003
    feedback_events = None
    if at_009 is not None and dt_008 is not None:
        feedback_events = at_009 + dt_008

    # Variance: requires prior windows — single window → N<3 → NF-02 neutral
    variance = None  # computed externally if multi-window

    # Normalization
    nf01 = nf_01(at_001, constants.get("F_expected"))
    nf02 = nf_02(variance, constants.get("sigma_max"), window_count)
    nf03 = nf_03(runs_completed, runs_total)
    nf04 = nf_04(artifacts_delivered, constants.get("artifacts_expected"))
    nf05 = nf_05(dt_006, constants.get("L_target"), constants.get("L_max"))
    nf06 = nf_06(at_007, constants.get("gates_defined"))
    nf07 = nf_07(feedback_events, constants.get("feedback_expected"))

    # PES signals
    p01 = pes_esi_01(nf01, nf02)
    p02 = pes_esi_02(tc09_defined=False)  # CG-01 always active
    p03 = pes_esi_03(nf03, nf04)
    p04 = pes_esi_04(nf05)
    p05 = pes_esi_05(nf06, nf07)

    pes = {
        "PES-ESI-01": p01,
        "PES-ESI-02": p02,
        "PES-ESI-03": p03,
        "PES-ESI-04": p04,
        "PES-ESI-05": p05,
    }

    esi_value, esi_mode, esi_warnings = compute_esi(pes)

    return {
        "window_id": wid,
        "nf": {
            "NF-01": nf01, "NF-02": nf02, "NF-03": nf03,
            "NF-04": nf04, "NF-05": nf05, "NF-06": nf06, "NF-07": nf07,
        },
        "pes": pes,
        "esi": {
            "value": esi_value,
            "mode": esi_mode,
            "warnings": esi_warnings,
        },
        "tc_observations": {
            "TC-01": {"metric": "AT-001", "value": at_001, "status": "COVERED" if at_001 is not None else "UNDEFINED"},
            "TC-02": {"metric": "DT-007", "value": dt_007, "status": "COVERED" if dt_007 is not None else "UNDEFINED"},
            "TC-03": {"metrics": ["DT-001", "DT-003"], "value": artifacts_delivered,
                      "status": "COVERED" if artifacts_delivered is not None else "UNDEFINED"},
            "TC-04": {"metric": "DT-006", "value": dt_006, "status": "COVERED" if dt_006 is not None else "UNDEFINED"},
            "TC-05": {"metric": "AT-007", "value": at_007, "status": "COVERED" if at_007 is not None else "UNDEFINED"},
            "TC-06": {"metric": "AT-008", "value": obs.get("AT-008"),
                      "status": "COVERED" if obs.get("AT-008") is not None else "UNDEFINED"},
            "TC-07": {"note": "variance_observed", "value": variance,
                      "status": "UNDEFINED" if window_count < 3 else ("COVERED" if variance is not None else "UNDEFINED")},
            "TC-08": {"metrics": ["AT-009", "DT-008"], "value": feedback_events,
                      "status": "COVERED" if feedback_events is not None else "UNDEFINED"},
            "TC-09": {"status": "NOT_DEFINED", "gap": "CG-01"},
        },
    }


# ---------------------------------------------------------------------------
# Output rendering
# ---------------------------------------------------------------------------

def _fmt(v):
    if v is None:
        return "UNDEFINED"
    if isinstance(v, float):
        return f"{v:.4f}"
    return str(v)


def render_esi_md(run_id, windows_results, run_ts):
    lines = [
        "# ESI Output Set",
        "",
        f"**Stream:** 40.16 — ESI Derivation",
        f"**Run ID:** {run_id}",
        f"**Generated:** {run_ts}",
        f"**Script:** scripts/pios/40.16/run_esi_derivation.py",
        f"**Spec:** docs/pios/40.16/esi_derivation_specification.md",
        "",
        "---",
        "",
    ]

    for wr in windows_results:
        wid = wr["window_id"]
        lines += [
            f"## Window: {wid}",
            "",
            "### TC Observation Status",
            "",
            "| TC Class | Metric(s) | Value | Status |",
            "|---|---|---|---|",
        ]
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

        lines += [
            "",
            "### Normalization Values",
            "",
            "| Function | Value | Note |",
            "|---|---|---|",
        ]
        nf_notes = {
            "NF-01": "TC-01 (AT-001)",
            "NF-02": "N<3 → neutral 0.5" if len(windows_results) < 3 else "variance-based",
            "NF-03": "TC-02 (DT-007)",
            "NF-04": "TC-03 (DT-001+DT-003)",
            "NF-05": "TC-04 (DT-006)",
            "NF-06": "TC-05 (AT-007)",
            "NF-07": "TC-08 (AT-009+DT-008)",
        }
        for fn, fv in wr["nf"].items():
            lines.append(f"| {fn} | {_fmt(fv)} | {nf_notes.get(fn, '')} |")

        lines += [
            "",
            "### PES Signal Values",
            "",
            "| Signal | Value | Status |",
            "|---|---|---|",
        ]
        pes_notes = {
            "PES-ESI-01": "",
            "PES-ESI-02": "CG-01 ACTIVE",
            "PES-ESI-03": "",
            "PES-ESI-04": "",
            "PES-ESI-05": "",
        }
        for sig, sv in wr["pes"].items():
            status = "UNDEFINED" if sv is None else "DEFINED"
            note = pes_notes.get(sig, "")
            lines.append(f"| {sig} | {_fmt(sv)} | {status}{' — ' + note if note else ''} |")

        esi = wr["esi"]
        lines += [
            "",
            "### ESI Output",
            "",
            f"| Field | Value |",
            f"|---|---|",
            f"| ESI Value | {_fmt(esi['value'])} |",
            f"| Mode | {esi['mode']} |",
        ]
        for w in esi["warnings"]:
            lines.append(f"| Warning | {w} |")

        lines += ["", "---", ""]

    return "\n".join(lines)


def main():
    use_harness = "--harness" in sys.argv

    if use_harness:
        # Secondary path: manually seeded observations.json
        if not OBS_PATH.exists():
            print(f"ERROR: --harness specified but observations.json not found at {OBS_PATH}", file=sys.stderr)
            sys.exit(1)
        if not CONST_PATH.exists():
            print(f"ERROR: --harness specified but program_constants.json not found at {CONST_PATH}", file=sys.stderr)
            sys.exit(1)
        with open(OBS_PATH) as f:
            observations = json.load(f)
        with open(CONST_PATH) as f:
            constants = json.load(f)
        input_source = "harness"
        print("Input path: HARNESS (observations.json)")
    else:
        # Primary path: derive observations directly from docs/pios/40.4/
        print("Input path: 40.4 PRIMARY")
        observations, constants, _ = build_40_4_run(run_id="run_40_4_primary")
        input_source = "40.4"

    run_id = observations["run_id"]
    windows = observations["windows"]
    window_count = len(windows)
    run_ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    windows_results = [derive_window(w, constants, window_count) for w in windows]

    # Write markdown output
    md = render_esi_md(run_id, windows_results, run_ts)
    ESI_MD_PATH.write_text(md)
    print(f"Written: {ESI_MD_PATH}")

    # Write JSON handoff for RAG script
    manifest = {
        "run_id": run_id,
        "generated": run_ts,
        "input_source": input_source,
        "script": "scripts/pios/40.16/run_esi_derivation.py",
        "window_count": window_count,
        "windows": windows_results,
        "program_constants": constants,
    }
    ESI_JSON_PATH.write_text(json.dumps(manifest, indent=2))
    print(f"Written: {ESI_JSON_PATH}")


if __name__ == "__main__":
    main()
