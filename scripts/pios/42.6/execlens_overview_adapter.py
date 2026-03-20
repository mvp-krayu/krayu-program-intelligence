#!/usr/bin/env python3
"""
execlens_overview_adapter.py
PIOS-42.6-RUN01-CONTRACT-v1

ExecLens Overview Metrics Adapter — Stream 42.6

Surfaces the four structural metrics for the landing-page gauge strip by
loading the signal registry via 42.2 → 42.1 and applying deterministic
extraction rules to signal statement fields.

Layer chain:
  42.1  computation / traversal   (signal registry, evidence index)
  42.2  narrative rendering       (module import boundary)
  42.4  JSON adapter              (established pattern)
  42.6  overview metrics          (this file — read-only, no new computation)

Metrics produced:
  dependency_load         SIG-003  statement: "computed at 0.682"
  structural_density      SIG-004  statement: "edge-to-node density (1.273)"
  coordination_pressure   SIG-005  statement: "static component of 0.875"
  visibility_deficit      SIG-002  title: "Seven Core Dimensions Are Currently Unknown"

Extraction rules (all explicit and inspectable — G7):
  dependency_load:       r"computed at (0\\.\\d+)"              → float
  structural_density:    r"edge-to-node density \\((\\d+\\.\\d+)\\)"  → float
  coordination_pressure: r"static component of (0\\.\\d+)"      → float
  visibility_deficit:    "Seven" in title → 7  (deterministic word map)

If extraction fails for any metric, that metric is returned with
value=null and extraction_status="unavailable". No fallback values.

Rules:
  R1  all data via 42.2 → 42.1 module chain (no direct 41.x file access)
  R2  no synthetic values; extraction failure → null, not default
  R3  deterministic extraction rules only
  R4  read-only; no file writes
  R5  JSON to stdout only

Usage:
  python3 scripts/pios/42.6/execlens_overview_adapter.py
"""

import json
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# R1: Import 42.2 rendering path — same pattern as 42.4 adapter
# ---------------------------------------------------------------------------

_42_2_PATH = Path(__file__).resolve().parents[2] / "pios/42.2"
if str(_42_2_PATH) not in sys.path:
    sys.path.insert(0, str(_42_2_PATH))

try:
    import render_executive_narrative as _r42
except ImportError as e:
    print(json.dumps({
        "error": f"OVERVIEW ADAPTER FAILURE [R1] — cannot import 42.2: {e}",
    }), file=sys.stderr)
    sys.exit(1)

CONTRACT_ID = "PIOS-42.6-RUN01-CONTRACT-v1"

# ---------------------------------------------------------------------------
# Extraction rules (all explicit, deterministic, inspectable — G7/R3)
# ---------------------------------------------------------------------------

# Map English word → integer for SIG-002 visibility count.
# Deterministic: the word "Seven" in the title unambiguously means 7.
_WORD_TO_INT = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
}

METRIC_DEFINITIONS = [
    {
        "id":             "dependency_load",
        "label":          "Dependency Load",
        "signal_id":      "SIG-003",
        "source_field":   "statement",
        # Extracts the ratio value after "computed at"
        "extraction_rule_desc": r"statement: r'computed at (0\.\d+)'",
        "extract":        lambda sig: _extract_re(
            sig.get("statement", ""),
            r"computed at (0\.\d+)",
            float
        ),
        "unit":           "ratio",
        "fill_scale":     "0–1",
        "fill_pct_fn":    lambda v: round(v * 100, 1) if v is not None else None,
        "context":        "of architectural relationships are load-bearing dependencies",
        "threshold":      None,
    },
    {
        "id":             "structural_density",
        "label":          "Structural Density",
        "signal_id":      "SIG-004",
        "source_field":   "statement",
        # Extracts edge-to-node density value from parenthetical notation
        "extraction_rule_desc": r"statement: r'edge-to-node density \((\d+\.\d+)\)'",
        "extract":        lambda sig: _extract_re(
            sig.get("statement", ""),
            r"edge-to-node density \((\d+\.\d+)\)",
            float
        ),
        "unit":           "ratio",
        "fill_scale":     "0–2 (unity = 1.0)",
        # Fill as proportion of 2.0 scale, capped at 100%
        "fill_pct_fn":    lambda v: round(min(v / 2.0, 1.0) * 100, 1) if v is not None else None,
        "context":        "edge-to-node ratio — exceeds unity (1.0) threshold",
        "threshold":      1.0,
        "threshold_fill_pct": 50.0,  # 1.0/2.0 * 100
    },
    {
        "id":             "coordination_pressure",
        "label":          "Coordination Pressure",
        "signal_id":      "SIG-005",
        "source_field":   "statement",
        # Extracts static coordination ratio after "static component of"
        "extraction_rule_desc": r"statement: r'static component of (0\.\d+)'",
        "extract":        lambda sig: _extract_re(
            sig.get("statement", ""),
            r"static component of (0\.\d+)",
            float
        ),
        "unit":           "ratio",
        "fill_scale":     "0–1",
        "fill_pct_fn":    lambda v: round(v * 100, 1) if v is not None else None,
        "context":        "of observable interfaces are shared rather than isolated",
        "threshold":      None,
    },
    {
        "id":             "visibility_deficit",
        "label":          "Visibility Deficit",
        "signal_id":      "SIG-002",
        "source_field":   "title",
        # Deterministic word-to-int: "Seven" in title → 7
        "extraction_rule_desc": "title: 'Seven' in title → 7 (deterministic word map)",
        "extract":        lambda sig: _extract_word_count(sig.get("title", "")),
        "unit":           "count",
        "fill_scale":     "0–count (all unknown = full)",
        # All count dimensions unknown → 100% fill when all are unknown
        "fill_pct_fn":    lambda v: 100.0 if v is not None and v > 0 else None,
        "context":        "runtime dimensions currently unknown",
        "threshold":      None,
    },
]


# ---------------------------------------------------------------------------
# Extraction helpers
# ---------------------------------------------------------------------------

def _extract_re(text, pattern, cast):
    """Extract first capture group from pattern; return cast(value) or None."""
    m = re.search(pattern, text)
    if not m:
        return None
    try:
        return cast(m.group(1))
    except (ValueError, IndexError):
        return None


def _extract_word_count(title):
    """Map English number word in title to int. Case-insensitive."""
    words = title.lower().split()
    for word in words:
        clean = word.strip(".,;:")
        if clean in _WORD_TO_INT:
            return _WORD_TO_INT[clean]
    return None


# ---------------------------------------------------------------------------
# Overview data assembly
# ---------------------------------------------------------------------------

def get_overview_metrics() -> dict:
    """
    Load signal registry via 42.2 → 42.1, apply extraction rules,
    return four structured metrics for the landing gauge strip.
    No values invented. Extraction failure → null, not default.
    """
    _r42._q41.preflight_check()

    # Load signal registry via 42.2 → 42.1 (R1: no direct 41.x file access)
    signal_registry = _r42._q41.load_signal_registry()

    metrics = []
    for defn in METRIC_DEFINITIONS:
        sig = signal_registry.get(defn["signal_id"])

        if sig is None:
            metrics.append({
                "id":                   defn["id"],
                "label":                defn["label"],
                "signal_id":            defn["signal_id"],
                "source_field":         defn["source_field"],
                "extraction_rule":      defn["extraction_rule_desc"],
                "value":                None,
                "unit":                 defn["unit"],
                "fill_pct":             None,
                "fill_scale":           defn["fill_scale"],
                "confidence":           None,
                "context":              defn["context"],
                "threshold":            defn.get("threshold"),
                "threshold_fill_pct":   defn.get("threshold_fill_pct"),
                "extraction_status":    "signal_not_found",
            })
            continue

        value = defn["extract"](sig)

        metrics.append({
            "id":                   defn["id"],
            "label":                defn["label"],
            "signal_id":            defn["signal_id"],
            "signal_title":         sig.get("title"),
            "source_field":         defn["source_field"],
            "extraction_rule":      defn["extraction_rule_desc"],
            "value":                value,
            "unit":                 defn["unit"],
            "fill_pct":             defn["fill_pct_fn"](value) if value is not None else None,
            "fill_scale":           defn["fill_scale"],
            "confidence":           sig.get("evidence_confidence"),
            "context":              defn["context"],
            "threshold":            defn.get("threshold"),
            "threshold_fill_pct":   defn.get("threshold_fill_pct"),
            "extraction_status":    "ok" if value is not None else "extraction_failed",
        })

    return {
        "contract_id": CONTRACT_ID,
        "metrics":     metrics,
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    result = get_overview_metrics()
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
