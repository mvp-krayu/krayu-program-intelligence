"""
Stream 40.16 — 40.4 Intake Reader
Layer: L3 (Derivation input boundary)
Contract: docs/pios/contracts/40.16/execution_contract.md

Reads docs/pios/40.4/activity_telemetry.md and delivery_telemetry.md.
Extracts explicitly stated per-run metric values from Description fields.
Returns TC observations and program_constants derivable from the 40.4 handoff.

This module is the PRIMARY input path for run_esi_derivation.py.
docs/pios/40.4/* artifacts are READ-ONLY — this module never writes to them.
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
DOCS_40_4 = REPO_ROOT / "docs" / "pios" / "40.4"

# Regex to extract explicit "Value per run: N", "Value per invocation: N",
# "Value per execution: N", or "Value: N" from Description field text.
_VALUE_PATTERNS = [
    re.compile(r"Value per run:\s*(\d+(?:\.\d+)?)", re.IGNORECASE),
    re.compile(r"Value per invocation:\s*(\d+(?:\.\d+)?)", re.IGNORECASE),
    re.compile(r"Value per execution:\s*(\d+(?:\.\d+)?)", re.IGNORECASE),
    re.compile(r"(?<!\w)Value:\s*(\d+(?:\.\d+)?)", re.IGNORECASE),
]


def _extract_table_field(section_text, field_name):
    """Extract value from a markdown table row: | field_name | value |"""
    pattern = re.compile(
        r"^\|\s*" + re.escape(field_name) + r"\s*\|\s*(.*?)\s*\|",
        re.MULTILINE | re.IGNORECASE,
    )
    m = pattern.search(section_text)
    return m.group(1).strip() if m else None


def _extract_value_from_description(description):
    """Extract explicit numeric value from a Description string."""
    for pat in _VALUE_PATTERNS:
        m = pat.search(description)
        if m:
            raw = m.group(1)
            return int(raw) if raw.isdigit() else float(raw)
    return None


def _parse_telemetry_file(path):
    """Parse a 40.4 telemetry markdown file into per-metric dicts."""
    text = path.read_text()
    # Split on metric section headers: ### AT-NNN — or ### DT-NNN —
    sections = re.split(r"\n(?=### [A-Z]{2}-\d{3}\s*—)", text)

    metrics = {}
    for section in sections:
        metric_id = _extract_table_field(section, "Metric ID")
        if not metric_id:
            continue
        temporal_class = _extract_table_field(section, "Temporal Classification") or ""
        description = _extract_table_field(section, "Description") or ""
        unit = _extract_table_field(section, "Unit") or ""

        explicit_value = _extract_value_from_description(description)

        # Time-series metrics never carry a static per-run value
        is_time_series = temporal_class.lower() == "time-series"
        if is_time_series:
            explicit_value = None

        metrics[metric_id] = {
            "temporal_class": temporal_class,
            "unit": unit,
            "description": description,
            "explicit_value": explicit_value,
            "is_time_series": is_time_series,
        }

    return metrics


def load_40_4_metrics():
    """Load all AT and DT metrics from 40.4. Returns dict keyed by metric ID."""
    activity_path = DOCS_40_4 / "activity_telemetry.md"
    delivery_path = DOCS_40_4 / "delivery_telemetry.md"

    if not activity_path.exists():
        raise FileNotFoundError(f"40.4 artifact not found: {activity_path}")
    if not delivery_path.exists():
        raise FileNotFoundError(f"40.4 artifact not found: {delivery_path}")

    metrics = {}
    metrics.update(_parse_telemetry_file(activity_path))
    metrics.update(_parse_telemetry_file(delivery_path))
    return metrics


def build_observations_from_40_4(metrics, window_id="W001_40_4_intake"):
    """
    Construct a single-window observations dict from 40.4 metric values.

    Only explicitly stated per-run values from Description fields are used.
    Time-series and event-based metrics without explicit values remain null.
    This is the spec-compliant primary execution path.
    """
    def _val(metric_id):
        m = metrics.get(metric_id)
        return m["explicit_value"] if m else None

    # TC-02 (DT-007): boolean completion status — no static value in 40.4
    # Left null; harness override required for non-null derivation.
    dt_007_val = None  # event-based boolean, no explicit value in 40.4

    obs = {
        "window_id": window_id,
        "window_start": "2026-03-18T00:00:00Z",
        "window_end": "2026-03-18T23:59:59Z",
        "window_duration_days": 1.0,
        "input_source": "40.4",
        "observations": {
            "AT-001": _val("AT-001"),   # TC-01: time-series → null
            "AT-007": _val("AT-007"),   # TC-05: event-based, no explicit value → null
            "AT-008": _val("AT-008"),   # TC-06: event-based, no explicit value → null
            "AT-009": _val("AT-009"),   # TC-08a: event-based, no explicit value → null
            "DT-001": _val("DT-001"),   # TC-03a: explicit "Value per run: 4"
            "DT-003": _val("DT-003"),   # TC-03b: explicit "Value per run: 5"
            "DT-006": _val("DT-006"),   # TC-04: time-series → null
            "DT-007": dt_007_val,       # TC-02: event-based boolean → null
            "DT-008": _val("DT-008"),   # TC-08b: event-based, no explicit value → null
        },
    }
    return obs


def build_program_constants_from_40_4(metrics):
    """
    Derive program_constants from 40.4 metric values.

    - artifacts_expected: DT-001 + DT-003 (both explicitly stated in 40.4)
    - gates_defined: AT-005 (8 pipeline modules = 8 stages, one gate each)
    - F_expected: 1.0 (one automation trigger per push-to-main event; structural constant)
    - feedback_expected: 1 (E-06a is one edge: one delivery event per pipeline run)
    - sigma_max, L_target, L_max: null (no values in 40.4)
    """
    dt_001 = metrics.get("DT-001", {}).get("explicit_value")
    dt_003 = metrics.get("DT-003", {}).get("explicit_value")
    at_005 = metrics.get("AT-005", {}).get("explicit_value")

    artifacts_expected = None
    if dt_001 is not None and dt_003 is not None:
        artifacts_expected = dt_001 + dt_003

    gates_defined = at_005  # 8 pipeline modules → 8 validation gates

    return {
        "F_expected": 1.0,              # structural: one trigger per push-to-main
        "sigma_max": None,              # not in 40.4
        "artifacts_expected": artifacts_expected,
        "L_target": None,               # not in 40.4
        "L_max": None,                  # not in 40.4
        "gates_defined": gates_defined,
        "feedback_expected": 1,         # structural: one feedback edge (E-06a)
        "_source": "40.4",
        "_derivation": {
            "artifacts_expected": f"DT-001({dt_001}) + DT-003({dt_003})",
            "gates_defined": f"AT-005({at_005})",
            "F_expected": "structural: one push-to-main trigger per interval",
            "feedback_expected": "structural: one feedback delivery edge E-06a",
        },
    }


def build_40_4_run(run_id="run_40_4_primary"):
    """
    Full 40.4-sourced observations + constants for a single baseline window.
    Returns (observations_dict, constants_dict, metrics_raw).
    """
    metrics = load_40_4_metrics()
    window = build_observations_from_40_4(metrics)
    observations = {
        "run_id": run_id,
        "input_source": "40.4",
        "windows": [window],
    }
    constants = build_program_constants_from_40_4(metrics)
    return observations, constants, metrics
