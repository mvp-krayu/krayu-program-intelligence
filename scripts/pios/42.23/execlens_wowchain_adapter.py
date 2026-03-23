#!/usr/bin/env python3
"""
execlens_wowchain_adapter.py
PIOS-42.23-RUN01-CONTRACT-v1

ExecLens WOW Chain Adapter — Stream 42.23

Rewires the ExecLens topology surface from the legacy 42.7 co-occurrence
adapter to the governed WOW chain (42.22 + 51.1 + 51.1R).

Source: docs/pios/42.22/sample_runtime_output.json
Rendering spec: docs/pios/51.1/rendering_spec.md (static mapping table)

Static mapping (51.1-v1, 51.1R-v1 normalized):
  high   → RENDER_RED
  medium → RENDER_AMBER
  low    → RENDER_NEUTRAL
  none   → RENDER_NONE

Governed closed set (from 42.22/attribute_lineage.json):
  ["high", "medium", "low", "none"]

Rules:
  R1  all data from 42.22 runtime-exposed artifacts only
  R2  no co-occurrence computation, no synthetic hierarchy
  R3  static rendering mapping applied verbatim from 51.1
  R4  fail-closed: terminate with exit 1 on any invalid condition
  R5  JSON to stdout only; no file writes
  R6  deterministic — same input → same output

Fail-closed triggers (per 51.1 spec):
  1. 42.22 source file missing or unreadable
  2. emphasis field absent from any record
  3. emphasis value outside governed closed set
  4. node_id, attachment_id, projection_reference absent
  5. mapping ambiguity detected

Usage:
  python3 scripts/pios/42.23/execlens_wowchain_adapter.py
"""

import json
import re
import sys
from pathlib import Path

CONTRACT_ID         = "PIOS-42.23-RUN01-CONTRACT-v1"
SOURCE_42_22        = "docs/pios/42.22/sample_runtime_output.json"
GOVERNED_CLOSED_SET = {"high", "medium", "low", "none"}

# Static mapping table — 51.1-v1 (51.1R-v1 normalized)
RENDERING_MAP = {
    "high":   "RENDER_RED",
    "medium": "RENDER_AMBER",
    "low":    "RENDER_NEUTRAL",
    "none":   "RENDER_NONE",
}


def fail_closed(reason: str) -> None:
    print(json.dumps({
        "error":  f"FAIL-CLOSED [{CONTRACT_ID}]: {reason}",
        "status": "TERMINATED",
    }), file=sys.stderr)
    sys.exit(1)


def node_label(node_id: str) -> str:
    """Strip type prefix and numeric ID: C_02_Network_... → Network ..."""
    stripped = re.sub(r'^(?:CMP|D|C)_\d+_', '', node_id)
    return stripped.replace('_', ' ')


def get_repo_root() -> Path:
    return Path(__file__).resolve().parents[3]


def load_42_22_output() -> dict:
    source_path = get_repo_root() / SOURCE_42_22
    if not source_path.exists():
        fail_closed(f"source file not found: {source_path}")
    try:
        with open(source_path, 'r') as f:
            data = json.load(f)
    except Exception as e:
        fail_closed(f"source file unreadable: {e}")
    return data


def validate_and_map(record: dict, idx: int) -> dict:
    for field in ("node_id", "emphasis", "attachment_id", "projection_reference",
                  "binding_id", "signal_id"):
        if field not in record or record[field] is None:
            fail_closed(f"record[{idx}]: required field '{field}' absent or null")

    emphasis = record["emphasis"]
    if emphasis not in GOVERNED_CLOSED_SET:
        fail_closed(
            f"record[{idx}]: emphasis value '{emphasis}' outside governed "
            f"closed set {sorted(GOVERNED_CLOSED_SET)}"
        )

    render_token = RENDERING_MAP.get(emphasis)
    if render_token is None:
        fail_closed(f"record[{idx}]: mapping ambiguity — no token for emphasis '{emphasis}'")

    return {
        "node_id":               record["node_id"],
        "node_label":            node_label(record["node_id"]),
        "signal_id":             record["signal_id"],
        "signal_state":          record.get("signal_state"),
        "emphasis":              emphasis,
        "emphasis_render_token": render_token,
        "attachment_id":         record["attachment_id"],
        "projection_reference":  record["projection_reference"],
        "binding_id":            record["binding_id"],
    }


def main():
    data = load_42_22_output()

    exposure_records_raw = data.get("exposure_records")
    if not exposure_records_raw or not isinstance(exposure_records_raw, list):
        fail_closed("exposure_records absent or empty in 42.22 source")

    mapped = [validate_and_map(rec, i) for i, rec in enumerate(exposure_records_raw)]

    counts = {"high": 0, "medium": 0, "low": 0, "none": 0}
    for rec in mapped:
        counts[rec["emphasis"]] += 1

    result = {
        "contract_id":         CONTRACT_ID,
        "wow_chain":           True,
        "source":              "42.22",
        "source_checksum":     data.get("exposure_checksum"),
        "rendering_spec":      "51.1-v1 (51.1R-v1 normalized)",
        "governed_closed_set": sorted(GOVERNED_CLOSED_SET),
        "exposure_records":    mapped,
        "record_count":        len(mapped),
        "emphasis_counts":     counts,
    }

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
