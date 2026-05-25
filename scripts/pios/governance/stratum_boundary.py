#!/usr/bin/env python3
"""
Cross-stratum boundary enforcer for governed PI runtime.

Runtime guard that classifies write operations by stratum and rejects
illegal cross-stratum mutations per the constitutional legality table.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P3)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


class StratumBoundaryViolation(Exception):
    pass


STRATA = {
    "A": "DETERMINISTIC_COGNITION",
    "B": "ORCHESTRATION",
    "C": "CONTINUITY",
    "D": "QUALIFICATION",
    "E": "PROJECTION",
}

STRATUM_BY_PATH_PREFIX = {
    "structure/": "A",
    "intake/": "A",
    "dom/": "A",
    "binding/": "A",
    "integration/": "A",
    "semantic/spe/spe_derivation_report.json": "A",
    "semantic/spe/proposition_derivation_lineage.json": "A",

    "spine/": "C",
    "chronicle/": "C",
    "semantic/spe/semantic_propositions.json": "C",
    "semantic/spe/proposition_review_state.json": "C",
    "semantic/spe/proposition_review_event_log.jsonl": "C",
    "semantic/spe/enrichment_log.json": "C",
    "semantic/spe/enrichment_activity_event.json": "C",
    "semantic/spe/enrichment_summary.json": "C",
    "semantic/spe/debt_reassessment.json": "C",
    "semantic/spe/review_obligations.json": "C",
    "ceu/": "C",
    "convergence/": "C",
    "learning_events.jsonl": "C",

    "sqo/promotion_state.json": "D",
    "sqo/promotion_event_log.jsonl": "D",
    "sqo/revalidation_result.json": "D",
    "sqo/revalidation_event_log.jsonl": "D",
    "sqo/constitutional_replay_anchor.json": "D",
    "sqo/qualification_blockers.json": "D",
    "sqo/enrichment_plan.json": "D",

    "governance/": "D",

    "75.x/": "E",
    "41.x/": "E",
}

LEGAL_TRANSITIONS = {
    ("A", "B"), ("A", "C"), ("A", "D"), ("A", "E"),
    ("B", "E"),
    ("C", "D"), ("C", "E"),
    ("D", "C"), ("D", "E"),
}

ILLEGAL_TRANSITIONS = {
    ("B", "A"), ("B", "C"), ("B", "D"),
    ("C", "A"),
    ("D", "A"),
    ("E", "A"), ("E", "B"), ("E", "C"), ("E", "D"), ("E", "E"),
}


def classify_path(relative_path: str) -> Optional[str]:
    """Classify a relative artifact path into its stratum."""
    for prefix, stratum in sorted(STRATUM_BY_PATH_PREFIX.items(), key=lambda x: -len(x[0])):
        if relative_path.startswith(prefix) or relative_path == prefix.rstrip("/"):
            return stratum
    return None


def classify_script(script_path: str) -> Optional[str]:
    """Classify a script into the stratum it operates from."""
    script_path = script_path.replace("\\", "/")

    if "governance/" in script_path:
        return "D"
    if "spe/" in script_path or "semantic_proposition" in script_path:
        return "A"
    if "sdc/" in script_path:
        return "A"
    if "revalidation" in script_path or "constitutional_replay" in script_path:
        return "A"
    if "run_client_pipeline" in script_path:
        return "A"
    if "projection_runtime" in script_path or "lens_report" in script_path:
        return "E"
    if "chronicle" in script_path:
        return "C"
    if "enrichment" in script_path:
        return "C"

    return None


def assert_write_legal(
    source_stratum: str,
    target_path: str,
    caller: str = "",
) -> dict:
    """Assert that a write from source_stratum to target_path is legal.

    Returns audit record. Raises StratumBoundaryViolation on illegal write.
    """
    target_stratum = classify_path(target_path)

    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source_stratum": source_stratum,
        "target_stratum": target_stratum,
        "target_path": target_path,
        "caller": caller,
    }

    if target_stratum is None:
        record["result"] = "UNCLASSIFIED"
        record["detail"] = f"Path {target_path} not mapped to any stratum"
        return record

    if source_stratum == target_stratum:
        record["result"] = "LEGAL_SAME_STRATUM"
        return record

    pair = (source_stratum, target_stratum)
    if pair in LEGAL_TRANSITIONS:
        record["result"] = "LEGAL_CROSS_STRATUM"
        record["contract"] = f"{source_stratum}→{target_stratum}"
        return record

    if pair in ILLEGAL_TRANSITIONS:
        record["result"] = "ILLEGAL"
        record["contract"] = f"{source_stratum}→{target_stratum} PROHIBITED"
        raise StratumBoundaryViolation(
            f"Stratum boundary violation: {STRATA.get(source_stratum, source_stratum)} "
            f"({source_stratum}) cannot write to "
            f"{STRATA.get(target_stratum, target_stratum)} ({target_stratum}) "
            f"at {target_path}"
        )

    record["result"] = "UNKNOWN_TRANSITION"
    record["detail"] = f"Transition {source_stratum}→{target_stratum} not in legality table"
    return record


def validate_run_ownership(run_dir: Path) -> dict:
    """Validate that all artifacts in a run are classified to a stratum."""
    run_dir = Path(run_dir)
    classified = {}
    unclassified = []

    for path in sorted(run_dir.rglob("*")):
        if path.is_dir():
            continue
        if path.name.startswith("."):
            continue
        rel = str(path.relative_to(run_dir))
        stratum = classify_path(rel)
        if stratum:
            classified.setdefault(stratum, []).append(rel)
        else:
            unclassified.append(rel)

    summary = {s: len(paths) for s, paths in classified.items()}

    return {
        "run_directory": str(run_dir),
        "validated_at": datetime.now(timezone.utc).isoformat(),
        "stratum_counts": summary,
        "total_classified": sum(summary.values()),
        "total_unclassified": len(unclassified),
        "unclassified_paths": unclassified[:20],
    }


def main():
    parser = argparse.ArgumentParser(
        description="Cross-stratum boundary enforcer"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    check_parser = subparsers.add_parser("check", help="Check if a write is legal")
    check_parser.add_argument("--source", required=True, choices=list(STRATA.keys()),
                              help="Source stratum")
    check_parser.add_argument("--target", required=True, help="Target artifact path (relative to run)")

    classify_parser = subparsers.add_parser("classify", help="Classify a path")
    classify_parser.add_argument("path", help="Relative artifact path")

    audit_parser = subparsers.add_parser("audit", help="Audit stratum ownership for a run")
    audit_parser.add_argument("run_dir", help="Path to run directory")

    args = parser.parse_args()

    if args.command == "check":
        try:
            record = assert_write_legal(args.source, args.target)
            print(f"{record['result']}: {args.source}→{record.get('target_stratum', '?')} for {args.target}")
        except StratumBoundaryViolation as e:
            print(f"VIOLATION: {e}", file=sys.stderr)
            sys.exit(1)

    elif args.command == "classify":
        stratum = classify_path(args.path)
        if stratum:
            print(f"{args.path} → Stratum {stratum} ({STRATA[stratum]})")
        else:
            print(f"{args.path} → UNCLASSIFIED")

    elif args.command == "audit":
        result = validate_run_ownership(Path(args.run_dir))
        print(f"Stratum ownership audit:")
        for s, count in sorted(result["stratum_counts"].items()):
            print(f"  Stratum {s} ({STRATA[s]}): {count} artifacts")
        print(f"  Unclassified: {result['total_unclassified']}")
        if result["unclassified_paths"]:
            for p in result["unclassified_paths"][:10]:
                print(f"    {p}")


if __name__ == "__main__":
    main()
