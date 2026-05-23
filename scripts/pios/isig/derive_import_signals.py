#!/usr/bin/env python3
"""
derive_import_signals.py — ISIG Level 1 Import Structure Intelligence Derivation

Stream: PI.BLUEEDGE.ISIG-LEVEL1-SIGNAL-DERIVATION.01

CODE-GRAPH-NATIVE. CLIENT-AGNOSTIC.

Reads:  structure/40.3s/code_graph.json (IMPORTS relationships)
Writes: artifacts/isig/<client>/<run>/isig_signal_set.json

Implements: ISIG-001 (Import Hub Pressure), ISIG-002 (Import Fan Asymmetry)
Deferred:   ISIG-003 (Import Chain Depth — requires transitive graph traversal)

Lane A impact: NONE — additive parallel derivation; no Lane A artifacts modified.
signal_registry.json impact: NONE — ISIG writes to isig_signal_set.json only.
"""

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

# ── Constants ─────────────────────────────────────────────────────────────────

SCHEMA_VERSION = "1.0"
SCRIPT_VERSION = "1.0"
FLOAT_PRECISION = 4

# ISIG thresholds — owned by this script; independent from PSIG and DPSIG thresholds.
# Changing any threshold requires a SCRIPT_VERSION increment and a new stream contract.
ISIG_IHP_HIGH_THRESHOLD     = 5.0   # Import Hub Pressure >= 5.0  → HUB_PRESSURE_HIGH
ISIG_IHP_ELEVATED_THRESHOLD = 2.0   # Import Hub Pressure >= 2.0  → HUB_PRESSURE_ELEVATED
ISIG_IFA_HIGH_THRESHOLD     = 5.0   # Import Fan Asymmetry >= 5.0 → FAN_ASYMMETRY_HIGH
ISIG_IFA_ELEVATED_THRESHOLD = 2.0   # Import Fan Asymmetry >= 2.0 → FAN_ASYMMETRY_ELEVATED


# ── Path Resolution ───────────────────────────────────────────────────────────

def resolve_paths(repo_root: Path, client_id: str, run_id: str) -> dict:
    run_base = repo_root / "clients" / client_id / "psee" / "runs" / run_id
    return {
        "code_graph": run_base / "structure" / "40.3s" / "code_graph.json",
        "output_dir": repo_root / "artifacts" / "isig" / client_id / run_id,
    }


# ── Artifact I/O ──────────────────────────────────────────────────────────────

def sha256_file(path: Path) -> str:
    if not path.exists():
        return "ABSENT"
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def load_required_json(path: Path, label: str) -> dict:
    if not path.exists():
        print(f"REQUIRED_ARTIFACT_MISSING: {label} — {path}", file=sys.stderr)
        sys.exit(1)
    try:
        with open(path) as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"SCHEMA_VIOLATION: {label} is not valid JSON — {e}", file=sys.stderr)
        sys.exit(1)


# ── Import Degree Computation ────────────────────────────────────────────────

def compute_import_degrees(relationships: list, file_count: int) -> dict:
    """
    Compute per-file import in-degree and out-degree from IMPORTS relationships.
    Returns degree maps and population statistics.
    """
    in_degree = {}
    out_degree = {}

    for r in relationships:
        if r.get("relation_type") != "IMPORTS":
            continue
        src = r.get("source_path")
        tgt = r.get("target_path")
        src_node = r.get("source_node_id")
        tgt_node = r.get("target_node_id")

        if src:
            out_degree[src] = out_degree.get(src, 0) + 1
        if tgt:
            in_degree[tgt] = in_degree.get(tgt, 0) + 1

    all_in = sorted(in_degree.values())
    all_out = sorted(out_degree.values())
    total_imports = sum(all_in)

    mean_in = total_imports / file_count if file_count > 0 else 0.0
    mean_out = total_imports / file_count if file_count > 0 else 0.0

    max_in_file = max(in_degree, key=in_degree.get) if in_degree else None
    max_out_file = max(out_degree, key=out_degree.get) if out_degree else None

    return {
        "in_degree": in_degree,
        "out_degree": out_degree,
        "total_imports": total_imports,
        "file_count": file_count,
        "files_with_in_degree": len(in_degree),
        "files_with_out_degree": len(out_degree),
        "mean_in_degree": mean_in,
        "mean_out_degree": mean_out,
        "max_in_degree": in_degree[max_in_file] if max_in_file else 0,
        "max_in_file": max_in_file,
        "max_out_degree": out_degree[max_out_file] if max_out_file else 0,
        "max_out_file": max_out_file,
        "in_degree_distribution": all_in,
        "out_degree_distribution": all_out,
    }


# ── Stable Identity ──────────────────────────────────────────────────────────

def compute_signal_stable_key(signal_id: str, numerator: float, denominator: float,
                               signal_value) -> str:
    sv_str = str(signal_value) if signal_value is not None else "null"
    raw = f"{signal_id}|{numerator}|{denominator}|{sv_str}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def compute_derivation_hash(signal_id: str, numerator: float, denominator: float,
                             signal_value, activation_state: str) -> str:
    sv_str = str(signal_value) if signal_value is not None else "null"
    raw = f"{signal_id}|{numerator}|{denominator}|{sv_str}|{activation_state}"
    return hashlib.sha256(raw.encode()).hexdigest()


# ── Signal Derivation ────────────────────────────────────────────────────────

def derive_isig_001(degrees: dict) -> dict:
    """
    ISIG-001: Import Hub Pressure
    Formula: max(import_in_degree) / mean(import_in_degree)
    Measures: file-level import centrality concentration.
    """
    signal_id = "ISIG-001"
    numerator = float(degrees["max_in_degree"])
    denominator = degrees["mean_in_degree"]

    # Guard: no imports → no signal
    if degrees["total_imports"] == 0:
        return _null_signal(signal_id, "Import Hub Pressure", "NO_IMPORTS",
                           "No IMPORTS relationships in code graph")

    # Guard: denominator zero (would require file_count == 0, already guarded)
    if denominator == 0:
        return _null_signal(signal_id, "Import Hub Pressure", "ZERO_MEAN",
                           "Mean import in-degree is zero")

    raw_value = numerator / denominator
    signal_value = round(raw_value, FLOAT_PRECISION)

    if signal_value >= ISIG_IHP_HIGH_THRESHOLD:
        activation_state = "HUB_PRESSURE_HIGH"
        severity = "HIGH"
    elif signal_value >= ISIG_IHP_ELEVATED_THRESHOLD:
        activation_state = "HUB_PRESSURE_ELEVATED"
        severity = "ELEVATED"
    else:
        activation_state = "HUB_PRESSURE_NOMINAL"
        severity = "NOMINAL"

    stable_key = compute_signal_stable_key(signal_id, numerator, denominator, signal_value)
    deriv_hash = compute_derivation_hash(signal_id, numerator, denominator, signal_value, activation_state)

    max_file = degrees["max_in_file"]
    max_deg = degrees["max_in_degree"]
    mean_deg = round(denominator, FLOAT_PRECISION)

    return {
        "signal_id": signal_id,
        "signal_name": "Import Hub Pressure",
        "signal_family": "ISIG",
        "derivation_level": "Level_1",
        "formula": "max(import_in_degree) / mean(import_in_degree)",
        "normalization_scope": "FILE_POPULATION_RELATIVE",
        "activation_method": "RATIO_THRESHOLD",
        "threshold_high": ISIG_IHP_HIGH_THRESHOLD,
        "threshold_elevated": ISIG_IHP_ELEVATED_THRESHOLD,

        "signal_value": signal_value,
        "activation_state": activation_state,
        "severity": severity,

        "signal_stable_key": stable_key,
        "derivation_hash": deriv_hash,

        "denominator_guard": {
            "guard_condition": "total_imports == 0 OR file_count == 0",
            "guard_action": "emit null — NO_IMPORTS",
            "denominator_zero_flag": False,
        },

        "derivation_trace": {
            "numerator_field": "max(import_in_degree across all files)",
            "numerator_value": max_deg,
            "numerator_file": max_file,
            "denominator_field": "mean(import_in_degree) = total_imports / file_count",
            "denominator_value": mean_deg,
            "denominator_source": f"code_graph.json → {degrees['total_imports']} IMPORTS / {degrees['file_count']} files",
            "result": signal_value,
            "raw_result": raw_value,
            "rounding": f"round(raw, {FLOAT_PRECISION})",
        },

        "topology_dependencies": [
            {
                "artifact": "code_graph.json",
                "field": "relationships[relation_type=IMPORTS].target_path",
                "usage": "per-file import in-degree (count of files that import this file)",
            }
        ],

        "explainability_template": "The file {max_file} is imported by {max_deg} other files — {signal_value}x the mean import in-degree of {mean_deg}.",
        "explainability_render": f"The file {max_file} is imported by {max_deg} other files — {signal_value}x the mean import in-degree of {mean_deg}.",
        "executive_summary": f"{max_file} is a structural import hub: {max_deg} dependents, {signal_value}x the population mean. A breaking change here propagates to {max_deg} files.",
        "engineering_summary": f"IHP={signal_value} ({activation_state}): {max_file} in_degree={max_deg}, mean={mean_deg}, file_count={degrees['file_count']}, total_imports={degrees['total_imports']}",
        "derivation_summary": f"IHP = {max_deg} / {mean_deg} = {signal_value}",

        "source_artifacts": {},
    }


def derive_isig_002(degrees: dict) -> dict:
    """
    ISIG-002: Import Fan Asymmetry
    Formula: max(import_out_degree) / mean(import_out_degree)
    Measures: file-level coupling concentration (monolithic import orchestrators).
    """
    signal_id = "ISIG-002"
    numerator = float(degrees["max_out_degree"])
    denominator = degrees["mean_out_degree"]

    if degrees["total_imports"] == 0:
        return _null_signal(signal_id, "Import Fan Asymmetry", "NO_IMPORTS",
                           "No IMPORTS relationships in code graph")

    if denominator == 0:
        return _null_signal(signal_id, "Import Fan Asymmetry", "ZERO_MEAN",
                           "Mean import out-degree is zero")

    raw_value = numerator / denominator
    signal_value = round(raw_value, FLOAT_PRECISION)

    if signal_value >= ISIG_IFA_HIGH_THRESHOLD:
        activation_state = "FAN_ASYMMETRY_HIGH"
        severity = "HIGH"
    elif signal_value >= ISIG_IFA_ELEVATED_THRESHOLD:
        activation_state = "FAN_ASYMMETRY_ELEVATED"
        severity = "ELEVATED"
    else:
        activation_state = "FAN_ASYMMETRY_NOMINAL"
        severity = "NOMINAL"

    stable_key = compute_signal_stable_key(signal_id, numerator, denominator, signal_value)
    deriv_hash = compute_derivation_hash(signal_id, numerator, denominator, signal_value, activation_state)

    max_file = degrees["max_out_file"]
    max_deg = degrees["max_out_degree"]
    mean_deg = round(denominator, FLOAT_PRECISION)

    return {
        "signal_id": signal_id,
        "signal_name": "Import Fan Asymmetry",
        "signal_family": "ISIG",
        "derivation_level": "Level_1",
        "formula": "max(import_out_degree) / mean(import_out_degree)",
        "normalization_scope": "FILE_POPULATION_RELATIVE",
        "activation_method": "RATIO_THRESHOLD",
        "threshold_high": ISIG_IFA_HIGH_THRESHOLD,
        "threshold_elevated": ISIG_IFA_ELEVATED_THRESHOLD,

        "signal_value": signal_value,
        "activation_state": activation_state,
        "severity": severity,

        "signal_stable_key": stable_key,
        "derivation_hash": deriv_hash,

        "denominator_guard": {
            "guard_condition": "total_imports == 0 OR file_count == 0",
            "guard_action": "emit null — NO_IMPORTS",
            "denominator_zero_flag": False,
        },

        "derivation_trace": {
            "numerator_field": "max(import_out_degree across all files)",
            "numerator_value": max_deg,
            "numerator_file": max_file,
            "denominator_field": "mean(import_out_degree) = total_imports / file_count",
            "denominator_value": mean_deg,
            "denominator_source": f"code_graph.json → {degrees['total_imports']} IMPORTS / {degrees['file_count']} files",
            "result": signal_value,
            "raw_result": raw_value,
            "rounding": f"round(raw, {FLOAT_PRECISION})",
        },

        "topology_dependencies": [
            {
                "artifact": "code_graph.json",
                "field": "relationships[relation_type=IMPORTS].source_path",
                "usage": "per-file import out-degree (count of files this file imports)",
            }
        ],

        "explainability_template": "The file {max_file} imports {max_deg} other files — {signal_value}x the mean import out-degree of {mean_deg}.",
        "explainability_render": f"The file {max_file} imports {max_deg} other files — {signal_value}x the mean import out-degree of {mean_deg}.",
        "executive_summary": f"{max_file} is a coupling orchestrator: imports {max_deg} files, {signal_value}x the population mean. This file is an integration bottleneck.",
        "engineering_summary": f"IFA={signal_value} ({activation_state}): {max_file} out_degree={max_deg}, mean={mean_deg}, file_count={degrees['file_count']}, total_imports={degrees['total_imports']}",
        "derivation_summary": f"IFA = {max_deg} / {mean_deg} = {signal_value}",

        "source_artifacts": {},
    }


def _null_signal(signal_id: str, signal_name: str, reason: str, detail: str) -> dict:
    return {
        "signal_id": signal_id,
        "signal_name": signal_name,
        "signal_family": "ISIG",
        "derivation_level": "Level_1",
        "signal_value": None,
        "activation_state": f"NULL_{reason}",
        "severity": "NULL",
        "signal_stable_key": compute_signal_stable_key(signal_id, 0, 0, None),
        "derivation_hash": compute_derivation_hash(signal_id, 0, 0, None, f"NULL_{reason}"),
        "denominator_guard": {
            "guard_condition": reason,
            "guard_action": f"emit null — {reason}",
            "denominator_zero_flag": True,
        },
        "derivation_trace": {"null_reason": detail},
        "topology_dependencies": [],
        "source_artifacts": {},
    }


# ── Top-N Attribution ────────────────────────────────────────────────────────

def compute_top_n(degree_map: dict, n: int = 10) -> list:
    """Return top-N files by degree, sorted descending. Deterministic tie-breaking by path."""
    items = sorted(degree_map.items(), key=lambda x: (-x[1], x[0]))
    return [{"file": f, "degree": d} for f, d in items[:n]]


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="ISIG Level 1 Import Structure Intelligence Derivation")
    parser.add_argument("--client-id", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--repo-root", default=".")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    paths = resolve_paths(repo_root, args.client_id, args.run_id)

    # ── Load ─────────────────────────────────────────────────────────────
    code_graph = load_required_json(paths["code_graph"], "code_graph (40.3s)")

    relationships = code_graph.get("relationships", [])
    file_count = code_graph.get("file_count", 0)
    if file_count == 0:
        print("GUARD: file_count is 0 — no files to derive signals from", file=sys.stderr)
        sys.exit(1)

    relationship_summary = code_graph.get("relationship_summary", {})
    import_count = relationship_summary.get("IMPORTS", 0)
    if import_count == 0:
        print("GUARD: No IMPORTS relationships in code graph — ISIG not derivable", file=sys.stderr)
        sys.exit(1)

    print(f"  ISIG: {file_count} files, {import_count} IMPORTS relationships")

    # ── Compute degrees ──────────────────────────────────────────────────
    degrees = compute_import_degrees(relationships, file_count)

    # ── Derive signals ───────────────────────────────────────────────────
    isig_001 = derive_isig_001(degrees)
    isig_002 = derive_isig_002(degrees)
    signal_entries = [isig_001, isig_002]

    # ── Source artifact hashes ───────────────────────────────────────────
    code_graph_hash = sha256_file(paths["code_graph"])
    for entry in signal_entries:
        entry["source_artifacts"] = {"code_graph": code_graph_hash}

    # ── Build output ─────────────────────────────────────────────────────
    activated = [s for s in signal_entries if s["signal_value"] is not None and s["severity"] != "NOMINAL"]
    null_signals = [s for s in signal_entries if s["signal_value"] is None]
    max_severity = "NULL"
    for sev in ["HIGH", "ELEVATED", "NOMINAL"]:
        if any(s.get("severity") == sev for s in signal_entries if s["signal_value"] is not None):
            max_severity = sev
            break

    output = {
        "schema_version": SCHEMA_VERSION,
        "script_version": SCRIPT_VERSION,
        "client_id": args.client_id,
        "run_id": args.run_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),

        "derivation_context": {
            "code_graph_hash": code_graph_hash,
            "file_count": file_count,
            "total_imports": degrees["total_imports"],
            "files_with_in_degree": degrees["files_with_in_degree"],
            "files_with_out_degree": degrees["files_with_out_degree"],
            "indexer": code_graph.get("indexer", {}),
        },

        "normalization_basis": {
            "file_count": file_count,
            "total_import_edges": degrees["total_imports"],
            "mean_import_in_degree": round(degrees["mean_in_degree"], FLOAT_PRECISION),
            "mean_import_out_degree": round(degrees["mean_out_degree"], FLOAT_PRECISION),
            "max_import_in_degree": degrees["max_in_degree"],
            "max_import_in_file": degrees["max_in_file"],
            "max_import_out_degree": degrees["max_out_degree"],
            "max_import_out_file": degrees["max_out_file"],
            "top_10_in_degree": compute_top_n(degrees["in_degree"], 10),
            "top_10_out_degree": compute_top_n(degrees["out_degree"], 10),
        },

        "signal_entries": signal_entries,

        "derivation_summary": {
            "signals_derived": len(signal_entries),
            "signals_activated": len(activated),
            "signals_null": len(null_signals),
            "null_reasons": [s["activation_state"] for s in null_signals],
            "severity_band": max_severity,
        },

        "replay_taxonomy": {
            "TAXONOMY_01_REPLAY_STABLE": [
                "normalization_basis.*",
                "signal_entries[*].signal_id",
                "signal_entries[*].signal_value",
                "signal_entries[*].activation_state",
                "signal_entries[*].severity",
                "signal_entries[*].signal_stable_key",
                "signal_entries[*].derivation_hash",
                "signal_entries[*].derivation_trace.*",
            ],
            "TAXONOMY_02_TIME_VARYING": ["generated_at"],
            "TAXONOMY_03_VERSION_DEPENDENT": [
                "schema_version",
                "script_version",
                "derivation_context.*",
                "signal_entries[*].source_artifacts.*",
            ],
        },

        "provenance_chain": {
            "stream": "PI.BLUEEDGE.ISIG-LEVEL1-SIGNAL-DERIVATION.01",
            "signal_family": "ISIG",
            "derivation_level": "Level_1",
            "classification": "SOFTWARE_MODULE",
            "source_artifact": "40.3s/code_graph.json",
            "client_agnostic": True,
            "code_graph_native": True,
        },
    }

    # ── Write ────────────────────────────────────────────────────────────
    out_dir = paths["output_dir"]
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "isig_signal_set.json"

    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"  ISIG: wrote {out_path}")
    for s in signal_entries:
        val = s["signal_value"]
        state = s["activation_state"]
        print(f"    {s['signal_id']} ({s['signal_name']}): {val} — {state}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
