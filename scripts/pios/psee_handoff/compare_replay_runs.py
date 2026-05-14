#!/usr/bin/env python3
"""
compare_replay_runs.py
Stream: PI.PSEE-PIOS.DETERMINISTIC-REPLAY-INSTRUMENTATION.IMPLEMENTATION.01

Passive replay diff comparator.
Compares two semantic_provenance.json artifacts (or two replay_causality.json artifacts)
using stable identity keys. Produces replay_diff.json.
Observational only — zero activation authority.
stdlib only.

Usage:
    python3 scripts/pios/psee_handoff/compare_replay_runs.py \
        --run-a <path-to-semantic_provenance.json or dir> \
        --run-b <path-to-semantic_provenance.json or dir> \
        [--out <output-dir>]
"""

import sys
import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path

SCHEMA_VERSION = "1.0"
STREAM_ID = "PI.PSEE-PIOS.DETERMINISTIC-REPLAY-INSTRUMENTATION.IMPLEMENTATION.01"

# TAXONOMY-02: fields that vary legitimately across replay runs (timestamps)
TAXONOMY_02_TIME_VARYING = {
    "captured_at", "evaluated_at", "emitted_at", "captured_at",
}

# TAXONOMY-03: fields that are version-dependent (change with script upgrades)
TAXONOMY_03_VERSION_DEPENDENT = {
    "schema_version", "script_version",
}

# Top-level fields excluded from diff (time-varying or evaluation-instance identity)
EXCLUDED_TOP_LEVEL = TAXONOMY_02_TIME_VARYING | TAXONOMY_03_VERSION_DEPENDENT | {
    "gate_session_id", "capture_context",
}


def parse_args():
    run_a = run_b = out_dir = None
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--run-a" and i + 1 < len(args):
            run_a = Path(args[i + 1])
            i += 2
        elif args[i] == "--run-b" and i + 1 < len(args):
            run_b = Path(args[i + 1])
            i += 2
        elif args[i] == "--out" and i + 1 < len(args):
            out_dir = Path(args[i + 1])
            i += 2
        else:
            i += 1
    return run_a, run_b, out_dir


def resolve_path(p: Path) -> Path:
    """Accept either a direct file or a directory containing semantic_provenance.json."""
    if p.is_dir():
        candidate = p / "semantic_provenance.json"
        if candidate.exists():
            return candidate
        candidate = p / "replay_causality.json"
        if candidate.exists():
            return candidate
    return p


def load_json(path: Path) -> dict:
    if not path.exists():
        print(f"  ERROR: file not found: {path}")
        sys.exit(1)
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def compare_scalar(key, a, b):
    if key in EXCLUDED_TOP_LEVEL:
        return None
    if a == b:
        return {"field": key, "verdict": "IDENTICAL", "a": a, "b": b}
    return {"field": key, "verdict": "DIVERGED", "a": a, "b": b}


def compare_advisory_by_stable_key(advisories_a, advisories_b):
    """Match advisories using advisory_stable_key; fall back to advisory_type+state."""
    def key_of(adv):
        sk = adv.get("advisory_stable_key")
        if sk:
            return ("stable", sk)
        return ("fallback", f"{adv.get('advisory_type')}|{adv.get('advisory_state')}")

    map_a = {key_of(a): a for a in (advisories_a or [])}
    map_b = {key_of(b): b for b in (advisories_b or [])}

    all_keys = set(map_a) | set(map_b)
    results = []
    for k in sorted(all_keys, key=str):
        a = map_a.get(k)
        b = map_b.get(k)
        if a is None:
            results.append({"stable_key": k, "verdict": "ADDED_IN_B",
                             "advisory_type": (b or {}).get("advisory_type")})
        elif b is None:
            results.append({"stable_key": k, "verdict": "REMOVED_IN_B",
                             "advisory_type": (a or {}).get("advisory_type")})
        else:
            # Compare TAXONOMY-01 stable fields; skip TAXONOMY-02/03
            diff_fields = []
            for field in ("advisory_state", "advisory_type", "enrichment_inputs_used",
                          "originating_artifact", "participation_mode_at_emission"):
                va = (a or {}).get(field)
                vb = (b or {}).get(field)
                if va != vb:
                    diff_fields.append({"field": field, "a": va, "b": vb})
            verdict = "IDENTICAL" if not diff_fields else "DIVERGED"
            results.append({"stable_key": k, "verdict": verdict,
                             "advisory_type": (a or {}).get("advisory_type"),
                             "field_diffs": diff_fields})
    return results


def compare_degradation_by_stable_key(deg_a, deg_b):
    def key_of(d):
        sk = d.get("degradation_stable_key")
        if sk:
            return ("stable", sk)
        return ("fallback", f"{d.get('event_type')}|{d.get('affected_field')}")

    map_a = {key_of(d): d for d in (deg_a or [])}
    map_b = {key_of(d): d for d in (deg_b or [])}

    all_keys = set(map_a) | set(map_b)
    results = []
    for k in sorted(all_keys, key=str):
        a = map_a.get(k)
        b = map_b.get(k)
        if a is None:
            results.append({"stable_key": k, "verdict": "ADDED_IN_B",
                             "event_type": (b or {}).get("event_type")})
        elif b is None:
            results.append({"stable_key": k, "verdict": "REMOVED_IN_B",
                             "event_type": (a or {}).get("event_type")})
        else:
            diff_fields = []
            for field in ("event_type", "affected_field", "observed_value",
                          "degradation_scope", "degradation_replayable"):
                va = (a or {}).get(field)
                vb = (b or {}).get(field)
                if va != vb:
                    diff_fields.append({"field": field, "a": va, "b": vb})
            verdict = "IDENTICAL" if not diff_fields else "DIVERGED"
            results.append({"stable_key": k, "verdict": verdict,
                             "event_type": (a or {}).get("event_type"),
                             "field_diffs": diff_fields})
    return results


def overall_verdict(advisory_diffs, degradation_diffs, scalar_diffs):
    all_verdicts = (
        [d["verdict"] for d in advisory_diffs] +
        [d["verdict"] for d in degradation_diffs] +
        [d["verdict"] for d in scalar_diffs if d]
    )
    if not all_verdicts:
        return "IDENTICAL"
    if all(v == "IDENTICAL" for v in all_verdicts):
        return "IDENTICAL"
    if any(v in ("ADDED_IN_B", "REMOVED_IN_B") for v in all_verdicts):
        return "DIVERGED"
    if any(v == "DIVERGED" for v in all_verdicts):
        return "PARTIALLY_VALID"
    return "IDENTICAL"


def main():
    run_a, run_b, out_dir = parse_args()
    if run_a is None or run_b is None:
        print("Usage: compare_replay_runs.py --run-a <path> --run-b <path> [--out <dir>]")
        sys.exit(1)

    path_a = resolve_path(run_a.resolve())
    path_b = resolve_path(run_b.resolve())

    now_iso = datetime.now(timezone.utc).isoformat()

    print(f"[PSEE-REPLAY-COMPARATOR] compare_replay_runs")
    print(f"  run_a: {path_a}")
    print(f"  run_b: {path_b}")
    print(f"  authority: OBSERVATIONAL_ONLY — zero activation authority")

    data_a = load_json(path_a)
    data_b = load_json(path_b)

    # ── Scalar field comparison ─────────────────────────────────────────────────

    scalar_fields = [
        "activation_state", "participation_mode", "semantic_authority",
        "replay_supported", "advisory_count", "runtime_impact",
    ]
    scalar_diffs = [
        r for f in scalar_fields
        if (r := compare_scalar(f, data_a.get(f), data_b.get(f))) is not None
    ]

    # ── Advisory comparison (stable key) ────────────────────────────────────────

    advisories_a = data_a.get("advisory_lineage") or data_a.get("advisory_stable_keys", [])
    advisories_b = data_b.get("advisory_lineage") or data_b.get("advisory_stable_keys", [])
    advisory_diffs = compare_advisory_by_stable_key(advisories_a, advisories_b)

    # ── Degradation comparison (stable key) ─────────────────────────────────────

    degradation_a = data_a.get("degradation_lineage") or data_a.get("degradation_stable_keys", [])
    degradation_b = data_b.get("degradation_lineage") or data_b.get("degradation_stable_keys", [])
    degradation_diffs = compare_degradation_by_stable_key(degradation_a, degradation_b)

    # ── Replay gaps comparison ───────────────────────────────────────────────────

    gaps_a = set(data_a.get("replay_gaps", []))
    gaps_b = set(data_b.get("replay_gaps", []))
    gaps_added   = sorted(gaps_b - gaps_a)
    gaps_removed = sorted(gaps_a - gaps_b)

    # ── Input hash comparison (DEP-04-REQ) ───────────────────────────────────────

    hashes_a = (data_a.get("capture_context") or data_a.get("input_artifact_hashes") or {})
    if isinstance(hashes_a, dict) and "input_artifact_hashes" in hashes_a:
        hashes_a = hashes_a["input_artifact_hashes"]
    hashes_b = (data_b.get("capture_context") or data_b.get("input_artifact_hashes") or {})
    if isinstance(hashes_b, dict) and "input_artifact_hashes" in hashes_b:
        hashes_b = hashes_b["input_artifact_hashes"]
    hash_diffs = {}
    for k in set(list(hashes_a.keys()) + list(hashes_b.keys())):
        va = hashes_a.get(k)
        vb = hashes_b.get(k)
        if va != vb:
            hash_diffs[k] = {"a": va, "b": vb}

    # ── Overall verdict ──────────────────────────────────────────────────────────

    verdict = overall_verdict(advisory_diffs, degradation_diffs, scalar_diffs)

    result = {
        "schema_version": SCHEMA_VERSION,
        "stream": STREAM_ID,
        "compared_at": now_iso,
        "run_a": str(path_a),
        "run_b": str(path_b),
        "overall_verdict": verdict,
        "input_hash_diffs": hash_diffs,
        "scalar_diffs": scalar_diffs,
        "advisory_diffs": advisory_diffs,
        "degradation_diffs": degradation_diffs,
        "replay_gaps_added_in_b": gaps_added,
        "replay_gaps_removed_in_b": gaps_removed,
        "evaluator_authority": "OBSERVATIONAL_ONLY",
        "zero_impact_guarantee": {
            "runtime_artifacts_modified": False,
            "75x_behavior_changed": False,
            "41x_behavior_changed": False,
            "signal_values_changed": False,
        },
    }

    # ── Write artifact ───────────────────────────────────────────────────────────

    if out_dir is None:
        # Default: alongside run_a
        out_dir = path_a.parent
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "replay_diff.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
        f.write("\n")

    print()
    print(f"  overall_verdict:   {verdict}")
    print(f"  advisory_diffs:    {len(advisory_diffs)}")
    print(f"  degradation_diffs: {len(degradation_diffs)}")
    print(f"  scalar_diffs:      {len(scalar_diffs)}")
    print(f"  hash_diffs:        {len(hash_diffs)}")
    for k, v in hash_diffs.items():
        print(f"    {k}: {v['a'][:12] if v['a'] and v['a'] != 'ABSENT' else v['a']} → {v['b'][:12] if v['b'] and v['b'] != 'ABSENT' else v['b']}")
    print()
    print(f"  Written: {out_path}")
    print(f"  IMPORTANT: No runtime artifacts modified. No activation authority.")
    print(f"  Status: COMPLETE")


if __name__ == "__main__":
    main()
