#!/usr/bin/env python3
"""
derive_relational_signals.py — DPSIG Class 4 Cluster Pressure Derivation

Stream: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01
Design contract: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01

TOPOLOGY-NATIVE. CLIENT-AGNOSTIC.

The DPSIG runtime implementation is topology-native and client-agnostic.
FastAPI is used exclusively as the canonical replay validation fixture.
No framework-specific, repository-specific, or client-specific logic exists
inside this script.

All signals derive from graph topology only:
- cluster structure (canonical_topology.json)
- node relationships (binding_envelope.json — reserved for future classes)
- dependency density (structural_topology_log.json — reserved for future classes)

Implements: Class 4 only (DPSIG-031, DPSIG-032)
Deferred:   Class 1/2/3/5/6/7/8

Lane A impact: NONE — additive parallel derivation; no Lane A artifacts modified.
signal_registry.json impact: NONE — DPSIG writes to dpsig_signal_set.json only.
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
FLOAT_PRECISION = 4  # decimal places for signal_value output

# Class 4 thresholds — owned by this script; independent from PSIG THRESHOLD=2.0
# Changing any threshold requires a SCRIPT_VERSION increment and a new stream contract.
DPSIG_CLASS4_CPI_HIGH_THRESHOLD       = 5.0   # CPI >= 5.0  → CLUSTER_PRESSURE_HIGH
DPSIG_CLASS4_CPI_ELEVATED_THRESHOLD   = 2.0   # CPI >= 2.0  → CLUSTER_PRESSURE_ELEVATED
DPSIG_CLASS4_CFA_DOMINANT_THRESHOLD   = 0.60  # CFA >= 0.60 → DOMINANT_CLUSTER
DPSIG_CLASS4_CFA_ASYMMETRIC_THRESHOLD = 0.35  # CFA >= 0.35 → CLUSTER_ASYMMETRIC


# ── Path Resolution ───────────────────────────────────────────────────────────

def resolve_paths(repo_root: Path, client_id: str, run_id: str) -> dict:
    """Build all artifact paths from client_id and run_id. No client-specific logic."""
    run_base = repo_root / "clients" / client_id / "psee" / "runs" / run_id
    return {
        "canonical_topology":      run_base / "structure" / "40.4" / "canonical_topology.json",
        "binding_envelope":        run_base / "binding" / "binding_envelope.json",
        "structural_topology_log": run_base / "structure" / "40.3" / "structural_topology_log.json",
        "grounding_state":         run_base / "ceu" / "grounding_state_v3.json",
        "output_dir":              repo_root / "artifacts" / "dpsig" / client_id / run_id,
    }


# ── Artifact I/O ──────────────────────────────────────────────────────────────

def sha256_file(path: Path) -> str:
    """Compute sha256 of file content. Returns 'ABSENT' if file does not exist."""
    if not path.exists():
        return "ABSENT"
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def load_required_json(path: Path, label: str) -> dict:
    """Load and parse a JSON artifact. Exits with non-zero status on missing or malformed input."""
    if not path.exists():
        print(f"REQUIRED_ARTIFACT_MISSING: {label} — {path}", file=sys.stderr)
        sys.exit(1)
    try:
        with open(path) as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"SCHEMA_VIOLATION: {label} is not valid JSON — {e}", file=sys.stderr)
        sys.exit(1)


# ── Topology Validation ───────────────────────────────────────────────────────

def validate_clusters(clusters_raw: list, label: str) -> list:
    """
    Validate cluster list. Each cluster must have cluster_id (str) and node_count (int >= 0).
    Returns validated cluster list sorted by cluster_id for canonical iteration order.
    """
    if not isinstance(clusters_raw, list):
        print(f"SCHEMA_VIOLATION: {label} 'clusters' is not a list", file=sys.stderr)
        sys.exit(1)
    if len(clusters_raw) == 0:
        print(f"SCHEMA_VIOLATION: {label} 'clusters' is empty — no topology to derive from",
              file=sys.stderr)
        sys.exit(1)

    validated = []
    for c in clusters_raw:
        cid = c.get("cluster_id")
        if not cid or not isinstance(cid, str):
            print(f"SCHEMA_VIOLATION: cluster missing or invalid 'cluster_id': {c}",
                  file=sys.stderr)
            sys.exit(1)
        nc = c.get("node_count")
        if nc is None or not isinstance(nc, int) or nc < 0:
            print(f"SCHEMA_VIOLATION: cluster {cid} 'node_count' must be a non-negative integer",
                  file=sys.stderr)
            sys.exit(1)
        validated.append(c)

    # Sort by cluster_id for deterministic iteration order across all executions
    return sorted(validated, key=lambda c: c["cluster_id"])


# ── Normalization Basis ───────────────────────────────────────────────────────

def compute_normalization_basis(clusters: list) -> dict:
    """
    Compute run-scoped normalization denominators from cluster topology.

    Uses ascending-sorted node_count list + Python left-to-right sum() to ensure
    consistent floating-point results across all CPython executions with identical input.
    Integer node_counts make sum exact (no float accumulation error for this field).
    """
    all_sizes = sorted(c["node_count"] for c in clusters)  # ascending sort
    total_nodes = sum(all_sizes)  # exact integer sum
    singleton_count = sum(1 for s in all_sizes if s == 1)
    non_singleton_sizes = sorted(s for s in all_sizes if s > 1)  # ascending, for mean stability
    non_singleton_count = len(non_singleton_sizes)

    if non_singleton_sizes:
        # Integer dividend / integer divisor; result is float64
        mean_non_singleton = sum(non_singleton_sizes) / len(non_singleton_sizes)
    else:
        mean_non_singleton = 0.0

    # Identify max cluster — sort clusters by cluster_id first (already sorted), then take max
    # to ensure deterministic tie-breaking when two clusters share the maximum node_count
    max_cluster = max(clusters, key=lambda c: (c["node_count"], c["cluster_id"]))

    return {
        "total_structural_node_count":    total_nodes,
        "total_cluster_count":            len(clusters),
        "singleton_cluster_count":        singleton_count,
        "non_singleton_cluster_count":    non_singleton_count,
        "mean_non_singleton_cluster_size": round(mean_non_singleton, FLOAT_PRECISION),
        "mean_non_singleton_raw":         mean_non_singleton,  # kept for internal derivation only
        "max_cluster_node_count":         max_cluster["node_count"],
        "max_cluster_id":                 max_cluster["cluster_id"],
        "max_cluster_name":               max_cluster.get("name", max_cluster["cluster_id"]),
        "non_singleton_cluster_ids":      sorted(
            c["cluster_id"] for c in clusters if c["node_count"] > 1
        ),
        "non_singleton_cluster_sizes":    non_singleton_sizes,
    }


# ── Stable Identity ───────────────────────────────────────────────────────────

def compute_signal_stable_key(signal_id: str, numerator: float, denominator: float,
                               signal_value) -> str:
    """
    Deterministic identity key for a signal entry.
    Stable across replay runs given identical topology inputs.
    Taxonomy: TAXONOMY-01 (REPLAY_STABLE).
    """
    sv_str = str(signal_value) if signal_value is not None else "null"
    raw = f"{signal_id}|{numerator}|{denominator}|{sv_str}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def compute_derivation_hash(signal_id: str, numerator: float, denominator: float,
                             signal_value, activation_state: str) -> str:
    """
    Hash of all TAXONOMY-01 derivation fields for a signal entry.
    Identical inputs produce identical hash on replay.
    """
    raw = f"{signal_id}|{numerator}|{denominator}|{signal_value}|{activation_state}"
    return hashlib.sha256(raw.encode()).hexdigest()


# ── Severity Classification ───────────────────────────────────────────────────

def classify_severity(entries: list) -> str:
    """
    Derive aggregate severity band from all signal activation states.
    CRITICAL: CPI HIGH and CFA HIGH simultaneously.
    HIGH: one of CPI HIGH or CFA HIGH.
    ELEVATED: CPI ELEVATED or CFA ASYMMETRIC.
    NOMINAL: all signals nominal or balanced.
    """
    state_map = {e["signal_id"]: e.get("activation_state") for e in entries}
    cpi_high = state_map.get("DPSIG-031") == "CLUSTER_PRESSURE_HIGH"
    cfa_high = state_map.get("DPSIG-032") == "DOMINANT_CLUSTER"

    if cpi_high and cfa_high:
        return "CRITICAL"
    if cpi_high or cfa_high:
        return "HIGH"
    if (state_map.get("DPSIG-031") == "CLUSTER_PRESSURE_ELEVATED"
            or state_map.get("DPSIG-032") == "CLUSTER_ASYMMETRIC"):
        return "ELEVATED"
    return "NOMINAL"


# ── DPSIG-031: Cluster Pressure Index ────────────────────────────────────────

def derive_dpsig_031(clusters: list, basis: dict) -> dict:
    """
    DPSIG-031 — Cluster Pressure Index (CPI)

    Formula:
        CPI = max(cluster_node_count) / max(mean(non_singleton_cluster_node_counts), 1)

    Measures structural mass concentration: how much larger the dominant cluster is
    relative to the typical non-singleton cluster within this topology run.

    Topology-native. Client-agnostic. Computes from cluster size distribution only.
    Input: canonical_topology.json clusters[*].node_count
    """
    entry = {
        "signal_id":             "DPSIG-031",
        "signal_class":          4,
        "signal_name":           "Cluster Pressure Index",
        "formula":               "max(cluster_node_count) / max(mean(non_singleton_cluster_node_counts), 1)",
        "normalization_scope":   "CLUSTER_RELATIVE",
        "normalization_basis_field": "normalization_basis.mean_non_singleton_cluster_size",
        "activation_method":     "CLUSTER_MASS_THRESHOLD",
        "threshold_basis":       "DPSIG_CLASS4_CPI_THRESHOLD",
        "threshold_high":        DPSIG_CLASS4_CPI_HIGH_THRESHOLD,
        "threshold_elevated":    DPSIG_CLASS4_CPI_ELEVATED_THRESHOLD,
        "replay_class":          "TAXONOMY-01",
        "lens_tier":             ["TIER-1", "TIER-2", "TIER-3"],
    }

    numerator_value = float(basis["max_cluster_node_count"])

    # ── Denominator guard: ALL_SINGLETON_CLUSTERS ─────────────────────────────
    if basis["non_singleton_cluster_count"] == 0:
        entry.update({
            "signal_value":    None,
            "activation_state": "NULL_TOPOLOGY",
            "denominator_guard": {
                "guard_condition":      "non_singleton_cluster_count == 0",
                "guard_action":         "emit null — ALL_SINGLETON_CLUSTERS",
                "denominator_zero_flag": True,
            },
            "derivation_trace": {
                "numerator_field":   "max(cluster.node_count for all clusters)",
                "numerator_value":   int(numerator_value),
                "numerator_cluster_id": basis["max_cluster_id"],
                "denominator_field": "mean(cluster.node_count for clusters where node_count > 1)",
                "denominator_value": None,
                "denominator_cluster_ids": [],
                "denominator_source": "canonical_topology.json → no non-singleton clusters exist",
                "result":            None,
                "null_reason":       "ALL_SINGLETON_CLUSTERS — no non-singleton cluster for denominator",
            },
            "topology_dependencies": [
                {
                    "artifact": "canonical_topology.json",
                    "field":    "clusters[*].node_count",
                    "usage":    "cluster size distribution — all singletons detected",
                }
            ],
            "explainability_template": (
                "All structural clusters contain exactly one node. "
                "No cluster pressure differential exists."
            ),
            "explainability_render": (
                "All structural clusters contain exactly one node. "
                "No cluster pressure differential exists."
            ),
            "executive_summary":  "No cluster concentration detected — topology is uniformly distributed.",
            "engineering_summary": "All clusters are singletons. CPI is not computable.",
            "derivation_summary": "NULL_TOPOLOGY — denominator guard fired (ALL_SINGLETON_CLUSTERS)",
        })
        entry["signal_stable_key"] = compute_signal_stable_key(
            "DPSIG-031", numerator_value, 0.0, None
        )
        entry["derivation_hash"] = compute_derivation_hash(
            "DPSIG-031", numerator_value, 0.0, None, "NULL_TOPOLOGY"
        )
        return entry

    # ── Normal computation ────────────────────────────────────────────────────
    denominator_raw = basis["mean_non_singleton_raw"]
    denominator_guarded = max(denominator_raw, 1.0)
    raw_result = numerator_value / denominator_guarded
    signal_value = round(raw_result, FLOAT_PRECISION)

    # Activation state
    if signal_value >= DPSIG_CLASS4_CPI_HIGH_THRESHOLD:
        activation_state = "CLUSTER_PRESSURE_HIGH"
        severity = "HIGH"
    elif signal_value >= DPSIG_CLASS4_CPI_ELEVATED_THRESHOLD:
        activation_state = "CLUSTER_PRESSURE_ELEVATED"
        severity = "ELEVATED"
    else:
        activation_state = "CLUSTER_PRESSURE_NOMINAL"
        severity = "NOMINAL"

    # Denominator provenance
    denominator_cluster_ids = basis["non_singleton_cluster_ids"]
    denominator_sizes = basis["non_singleton_cluster_sizes"]
    denominator_source = (
        f"canonical_topology.json → mean({denominator_sizes}) "
        f"over clusters {denominator_cluster_ids}"
    )

    # Explainability (deterministic, template-driven, no semantic inference)
    explainability_render = (
        f"The {basis['max_cluster_name']} cluster ({basis['max_cluster_id']}) contains "
        f"{int(numerator_value)} structural nodes — "
        f"{signal_value}x the mean non-singleton cluster size of "
        f"{round(denominator_raw, FLOAT_PRECISION)} nodes. "
        f"It is the dominant structural mass concentration zone in this topology."
    )
    executive_summary = (
        f"The {basis['max_cluster_name']} cluster ({basis['max_cluster_id']}) carries "
        f"{signal_value}x the average cluster structural load. "
        f"Structural investment in this cluster has system-wide impact."
    )
    engineering_summary = (
        f"CPI={signal_value} ({activation_state}): "
        f"{basis['max_cluster_id']}/{basis['max_cluster_name']} = {int(numerator_value)} nodes, "
        f"mean non-singleton = {round(denominator_raw, FLOAT_PRECISION)} nodes across "
        f"{basis['non_singleton_cluster_count']} clusters."
    )
    derivation_summary = (
        f"CPI = {int(numerator_value)} / {round(denominator_raw, FLOAT_PRECISION)} = {signal_value}"
    )

    entry.update({
        "signal_value":    signal_value,
        "activation_state": activation_state,
        "severity":        severity,
        "denominator_guard": {
            "guard_condition":      "non_singleton_cluster_count == 0",
            "guard_action":         "emit null — ALL_SINGLETON_CLUSTERS",
            "denominator_zero_flag": False,
        },
        "derivation_trace": {
            "numerator_field":       "max(cluster.node_count for all clusters)",
            "numerator_value":       int(numerator_value),
            "numerator_cluster_id":  basis["max_cluster_id"],
            "numerator_cluster_name": basis["max_cluster_name"],
            "numerator_source":      (
                f"canonical_topology.json → "
                f"clusters[cluster_id={basis['max_cluster_id']}].node_count"
            ),
            "denominator_field":     (
                "mean(cluster.node_count for clusters where node_count > 1)"
            ),
            "denominator_value":     round(denominator_raw, FLOAT_PRECISION),
            "denominator_raw":       denominator_raw,
            "denominator_cluster_ids": denominator_cluster_ids,
            "denominator_source":    denominator_source,
            "denominator_guard_applied": False,
            "result":                signal_value,
            "raw_result":            raw_result,
            "rounding":              f"round(raw, {FLOAT_PRECISION})",
        },
        "topology_dependencies": [
            {
                "artifact": "canonical_topology.json",
                "field":    "clusters[*].node_count",
                "usage":    "primary input — cluster size distribution for CPI derivation",
            }
        ],
        "explainability_template": (
            "The {max_cluster_name} cluster ({max_cluster_id}) contains {numerator_value} "
            "structural nodes — {signal_value}x the mean non-singleton cluster size of "
            "{denominator_value} nodes. It is the dominant structural mass concentration "
            "zone in this topology."
        ),
        "explainability_render":  explainability_render,
        "executive_summary":      executive_summary,
        "engineering_summary":    engineering_summary,
        "derivation_summary":     derivation_summary,
    })
    entry["signal_stable_key"] = compute_signal_stable_key(
        "DPSIG-031", numerator_value, denominator_raw, signal_value
    )
    entry["derivation_hash"] = compute_derivation_hash(
        "DPSIG-031", numerator_value, denominator_raw, signal_value, activation_state
    )
    return entry


# ── DPSIG-032: Cluster Fan Asymmetry ─────────────────────────────────────────

def derive_dpsig_032(clusters: list, basis: dict) -> dict:
    """
    DPSIG-032 — Cluster Fan Asymmetry (CFA)

    Formula:
        CFA = max(cluster_node_count) / max(sum(all cluster_node_counts), 1)

    Measures the structural mass share of the dominant cluster: what fraction of
    all structural nodes in this topology run belong to the largest single cluster.

    Topology-native. Client-agnostic. Computes from cluster size distribution only.
    Input: canonical_topology.json clusters[*].node_count
    """
    entry = {
        "signal_id":             "DPSIG-032",
        "signal_class":          4,
        "signal_name":           "Cluster Fan Asymmetry",
        "formula":               "max(cluster_node_count) / max(sum(all cluster_node_counts), 1)",
        "normalization_scope":   "RUN_RELATIVE",
        "normalization_basis_field": "normalization_basis.total_structural_node_count",
        "activation_method":     "CLUSTER_MASS_THRESHOLD",
        "threshold_basis":       "DPSIG_CLASS4_CFA_THRESHOLD",
        "threshold_dominant":    DPSIG_CLASS4_CFA_DOMINANT_THRESHOLD,
        "threshold_asymmetric":  DPSIG_CLASS4_CFA_ASYMMETRIC_THRESHOLD,
        "replay_class":          "TAXONOMY-01",
        "lens_tier":             ["TIER-1", "TIER-2", "TIER-3"],
    }

    numerator_value = float(basis["max_cluster_node_count"])
    denominator_value = float(basis["total_structural_node_count"])

    # ── Denominator guard: EMPTY_TOPOLOGY ────────────────────────────────────
    if denominator_value == 0.0:
        entry.update({
            "signal_value":    None,
            "activation_state": "NULL_TOPOLOGY",
            "denominator_guard": {
                "guard_condition":      "total_structural_node_count == 0",
                "guard_action":         "emit null — EMPTY_TOPOLOGY",
                "denominator_zero_flag": True,
            },
            "derivation_trace": {
                "result":      None,
                "null_reason": "EMPTY_TOPOLOGY — total_structural_node_count is 0",
            },
            "topology_dependencies": [
                {
                    "artifact": "canonical_topology.json",
                    "field":    "clusters[*].node_count",
                    "usage":    "cluster size distribution — empty topology detected",
                }
            ],
            "explainability_template": (
                "No structural nodes present. Cluster asymmetry is not computable."
            ),
            "explainability_render": (
                "No structural nodes present. Cluster asymmetry is not computable."
            ),
            "executive_summary":  "Empty topology — no structural nodes found.",
            "engineering_summary": "CFA not computable: total_structural_node_count = 0.",
            "derivation_summary": "NULL_TOPOLOGY — denominator guard fired (EMPTY_TOPOLOGY)",
        })
        entry["signal_stable_key"] = compute_signal_stable_key(
            "DPSIG-032", numerator_value, 0.0, None
        )
        entry["derivation_hash"] = compute_derivation_hash(
            "DPSIG-032", numerator_value, 0.0, None, "NULL_TOPOLOGY"
        )
        return entry

    # ── Normal computation ────────────────────────────────────────────────────
    raw_result = numerator_value / denominator_value
    signal_value = round(raw_result, FLOAT_PRECISION)
    pct = round(signal_value * 100, 2)
    singleton_pct = round(
        basis["singleton_cluster_count"] / basis["total_cluster_count"] * 100, 1
    )

    # Activation state
    if signal_value >= DPSIG_CLASS4_CFA_DOMINANT_THRESHOLD:
        activation_state = "DOMINANT_CLUSTER"
        severity = "HIGH"
    elif signal_value >= DPSIG_CLASS4_CFA_ASYMMETRIC_THRESHOLD:
        activation_state = "CLUSTER_ASYMMETRIC"
        severity = "ELEVATED"
    else:
        activation_state = "CLUSTER_BALANCED"
        severity = "NOMINAL"

    # Explainability (deterministic, template-driven, no semantic inference)
    explainability_render = (
        f"The {basis['max_cluster_name']} cluster ({basis['max_cluster_id']}) holds "
        f"{pct}% of the topology's {int(denominator_value)} structural nodes "
        f"({int(numerator_value)} of {int(denominator_value)}). "
        f"{basis['singleton_cluster_count']} of {basis['total_cluster_count']} clusters "
        f"({singleton_pct}%) contain only a single structural node."
    )
    executive_summary = (
        f"The {basis['max_cluster_name']} cluster ({basis['max_cluster_id']}) holds "
        f"{pct}% of all structural files. It is the topology's structural center of gravity."
    )
    engineering_summary = (
        f"CFA={signal_value} ({activation_state}): "
        f"{int(numerator_value)}/{int(denominator_value)} nodes in "
        f"{basis['max_cluster_id']}/{basis['max_cluster_name']}. "
        f"{basis['singleton_cluster_count']} singleton clusters "
        f"({singleton_pct}% of {basis['total_cluster_count']} total)."
    )
    derivation_summary = (
        f"CFA = {int(numerator_value)} / {int(denominator_value)} = {signal_value} ({pct}%)"
    )

    entry.update({
        "signal_value":    signal_value,
        "activation_state": activation_state,
        "severity":        severity,
        "denominator_guard": {
            "guard_condition":      "total_structural_node_count == 0",
            "guard_action":         "emit null — EMPTY_TOPOLOGY",
            "denominator_zero_flag": False,
        },
        "derivation_trace": {
            "numerator_field":       "max(cluster.node_count for all clusters)",
            "numerator_value":       int(numerator_value),
            "numerator_cluster_id":  basis["max_cluster_id"],
            "numerator_cluster_name": basis["max_cluster_name"],
            "numerator_source":      (
                f"canonical_topology.json → "
                f"clusters[cluster_id={basis['max_cluster_id']}].node_count"
            ),
            "denominator_field":     "sum(cluster.node_count for all clusters)",
            "denominator_value":     int(denominator_value),
            "denominator_source":    (
                f"canonical_topology.json → sum(all cluster node_counts) = "
                f"{int(denominator_value)}"
            ),
            "denominator_guard_applied": False,
            "result":                signal_value,
            "raw_result":            raw_result,
            "pct_share":             pct,
            "rounding":              f"round(raw, {FLOAT_PRECISION})",
        },
        "topology_dependencies": [
            {
                "artifact": "canonical_topology.json",
                "field":    "clusters[*].node_count",
                "usage":    (
                    "primary input — max cluster count and total node count "
                    "for CFA derivation"
                ),
            }
        ],
        "explainability_template": (
            "The {max_cluster_name} cluster ({max_cluster_id}) holds {pct_share}% of the "
            "topology's {total_nodes} structural nodes ({numerator_value} of "
            "{denominator_value}). {singleton_count} of {total_clusters} clusters "
            "({singleton_pct}%) contain only a single structural node."
        ),
        "explainability_render":  explainability_render,
        "executive_summary":      executive_summary,
        "engineering_summary":    engineering_summary,
        "derivation_summary":     derivation_summary,
    })
    entry["signal_stable_key"] = compute_signal_stable_key(
        "DPSIG-032", numerator_value, denominator_value, signal_value
    )
    entry["derivation_hash"] = compute_derivation_hash(
        "DPSIG-032", numerator_value, denominator_value, signal_value, activation_state
    )
    return entry


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="DPSIG Class 4 Cluster Pressure Derivation — topology-native, client-agnostic"
    )
    parser.add_argument("--client-id",  required=True,
                        help="Client identifier (path component only — no semantic logic)")
    parser.add_argument("--run-id",     required=True,
                        help="Run identifier (path component only — no semantic logic)")
    parser.add_argument("--repo-root",  default=None,
                        help="Repository root (default: 3 levels above this script)")
    parser.add_argument("--output-path", default=None,
                        help="Override output path for dpsig_signal_set.json (replay testing)")
    args = parser.parse_args()

    # Resolve repository root — no dynamic discovery of pipeline structure
    if args.repo_root:
        repo_root = Path(args.repo_root).resolve()
    else:
        repo_root = Path(__file__).resolve().parents[3]

    paths = resolve_paths(repo_root, args.client_id, args.run_id)

    # ── Load and hash required artifact ──────────────────────────────────────
    ct = load_required_json(paths["canonical_topology"], "canonical_topology.json")

    # Hash all declared artifacts for provenance (TAXONOMY-03)
    ct_hash  = sha256_file(paths["canonical_topology"])
    be_hash  = sha256_file(paths["binding_envelope"])
    stl_hash = sha256_file(paths["structural_topology_log"])
    gs_hash  = sha256_file(paths["grounding_state"])

    # ── Validate topology structure ───────────────────────────────────────────
    clusters_raw = ct.get("clusters")
    if clusters_raw is None:
        print("SCHEMA_VIOLATION: canonical_topology.json missing 'clusters' key",
              file=sys.stderr)
        sys.exit(1)

    clusters = validate_clusters(clusters_raw, "canonical_topology.json")

    # ── Compute normalization basis ───────────────────────────────────────────
    basis = compute_normalization_basis(clusters)

    # ── Derive Class 4 signals ────────────────────────────────────────────────
    entry_031 = derive_dpsig_031(clusters, basis)
    entry_032 = derive_dpsig_032(clusters, basis)
    signal_entries = [entry_031, entry_032]

    # ── Attach source artifact fingerprints (TAXONOMY-03) ────────────────────
    source_artifacts = {
        "canonical_topology":      ct_hash,
        "binding_envelope":        be_hash,
        "structural_topology_log": stl_hash,
        "grounding_state":         gs_hash,
    }
    for entry in signal_entries:
        entry["source_artifacts"] = source_artifacts

    # ── Derivation summary ────────────────────────────────────────────────────
    null_count   = sum(1 for e in signal_entries if e.get("signal_value") is None)
    active_count = sum(
        1 for e in signal_entries
        if e.get("activation_state") not in (
            None, "NULL_TOPOLOGY", "CLUSTER_PRESSURE_NOMINAL", "CLUSTER_BALANCED"
        )
    )
    null_reasons = [
        e["derivation_trace"].get("null_reason")
        for e in signal_entries
        if e.get("signal_value") is None
    ]
    severity = classify_severity(signal_entries)

    # ── Build output artifact ─────────────────────────────────────────────────
    now_iso = datetime.now(timezone.utc).isoformat()

    # topology_snapshot_hash = hash of the sole topology input for Class 4
    topology_snapshot_hash = ct_hash

    # Expose basis without internal-only fields
    public_basis = {k: v for k, v in basis.items()
                    if k != "mean_non_singleton_raw"
                    and k != "non_singleton_cluster_sizes"}

    output = {
        "schema_version":  SCHEMA_VERSION,
        "script_version":  SCRIPT_VERSION,
        "client_id":       args.client_id,
        "run_id":          args.run_id,
        "generated_at":    now_iso,

        "derivation_context": {
            "canonical_topology_hash":      ct_hash,
            "binding_envelope_hash":        be_hash,
            "structural_topology_log_hash": stl_hash,
            "grounding_state_hash":         gs_hash,
            "topology_snapshot_hash":       topology_snapshot_hash,
            "total_structural_nodes":       basis["total_structural_node_count"],
            "total_clusters":               basis["total_cluster_count"],
            "total_ceu_nodes":              "UNUSED_CLASS4",
            "total_edges":                  "UNUSED_CLASS4",
        },

        "normalization_basis": public_basis,

        "signal_entries": signal_entries,

        "derivation_summary": {
            "signals_derived":   len(signal_entries),
            "signals_activated": active_count,
            "signals_null":      null_count,
            "null_reasons":      null_reasons,
            "severity_band":     severity,
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
                "signal_entries[*].denominator_guard.denominator_zero_flag",
                "signal_entries[*].derivation_trace.*",
                "signal_entries[*].explainability_render",
                "signal_entries[*].executive_summary",
                "signal_entries[*].engineering_summary",
                "signal_entries[*].derivation_summary",
                "derivation_summary.*",
                "derivation_context.topology_snapshot_hash",
                "derivation_context.total_structural_nodes",
                "derivation_context.total_clusters",
            ],
            "TAXONOMY_02_TIME_VARYING": [
                "generated_at",
            ],
            "TAXONOMY_03_VERSION_DEPENDENT": [
                "schema_version",
                "script_version",
                "derivation_context.canonical_topology_hash",
                "derivation_context.binding_envelope_hash",
                "derivation_context.structural_topology_log_hash",
                "derivation_context.grounding_state_hash",
                "signal_entries[*].source_artifacts.*",
            ],
        },

        "provenance_chain": {
            "stream":            "PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01",
            "design_contract":   "PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01",
            "architecture_ref":  "PI.PSEE-PIOS.DETERMINISTIC-RELATIONAL-ENRICHMENT.01",
            "manifest_ref":      "docs/governance/pipeline_execution_manifest.json",
            "baseline_commit":   "93098cb",
            "lane_a_impact":     "NONE — additive parallel derivation; no Lane A artifacts modified",
            "signal_registry_impact": "NONE — DPSIG writes to dpsig_signal_set.json only",
            "psig_impact":       "NONE — PSIG activation, threshold, and method unchanged",
            "client_agnostic":   True,
            "topology_native":   True,
            "assertion": (
                "The DPSIG runtime implementation is topology-native and client-agnostic. "
                "FastAPI is used exclusively as the canonical replay validation fixture. "
                "No framework-specific, repository-specific, or client-specific logic exists "
                "inside derive_relational_signals.py."
            ),
        },
    }

    # ── Write output ──────────────────────────────────────────────────────────
    if args.output_path:
        out_path = Path(args.output_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
    else:
        out_dir = paths["output_dir"]
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / "dpsig_signal_set.json"

    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)

    # ── Console summary ───────────────────────────────────────────────────────
    print(f"DPSIG signal set written: {out_path}")
    cpi = entry_031.get("signal_value")
    cfa = entry_032.get("signal_value")
    print(f"  DPSIG-031 CPI: {cpi} ({entry_031.get('activation_state')})")
    print(f"  DPSIG-032 CFA: {cfa} ({entry_032.get('activation_state')})")
    print(f"  Severity band: {severity}")


if __name__ == "__main__":
    main()
