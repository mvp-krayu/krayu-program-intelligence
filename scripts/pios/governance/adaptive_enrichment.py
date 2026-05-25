#!/usr/bin/env python3
"""
Adaptive enrichment suggestion system for governed PI runtime.

System-generated enrichment recommendations based on debt analysis,
confidence gaps, and enrichment history. All suggestions require
operator approval before execution — AI proposes, operator disposes.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P4)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent

SUGGESTION_TYPES = {
    "CONFIDENCE_GAP": {
        "trigger": "Proposition confidence below threshold after enrichment",
        "action": "Re-enrich with broader evidence scope",
        "priority": "HIGH",
    },
    "DEBT_PERSISTENCE": {
        "trigger": "Debt item unchanged across enrichment cycles",
        "action": "Investigate alternative evidence channels",
        "priority": "MEDIUM",
    },
    "ENRICHMENT_SATURATION": {
        "trigger": "Multiple enrichment cycles with diminishing confidence delta",
        "action": "Accept current ceiling or flag as irreducible",
        "priority": "LOW",
    },
    "CROSS_SPECIMEN_PATTERN": {
        "trigger": "Similar debt pattern observed across specimens",
        "action": "Investigate structural commonality",
        "priority": "MEDIUM",
    },
    "UNENRICHED_CANDIDATES": {
        "trigger": "CANDIDATE propositions with no enrichment attempt",
        "action": "Generate enrichment plan for untouched propositions",
        "priority": "HIGH",
    },
}

CONFIDENCE_GAP_THRESHOLD = 0.70
DIMINISHING_DELTA_THRESHOLD = 0.005


def load_json(path: Path) -> Optional[dict]:
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def analyze_confidence_gaps(propositions: list, enrichment_log: Optional[dict]) -> list:
    """Identify propositions below confidence threshold after enrichment."""
    enriched_ids = set()
    if enrichment_log:
        for entry in enrichment_log.get("entries", enrichment_log.get("domain_corrections", [])):
            eid = entry.get("proposition_id", entry.get("domain_id", ""))
            if eid:
                enriched_ids.add(eid)

    suggestions = []
    for prop in propositions:
        if prop.get("status") not in ("CANDIDATE", "ACCEPTED"):
            continue
        conf = prop.get("confidence", 0)
        pid = prop.get("id", "")
        if conf < CONFIDENCE_GAP_THRESHOLD and pid in enriched_ids:
            suggestions.append({
                "suggestion_type": "CONFIDENCE_GAP",
                "proposition_id": pid,
                "proposition_class": prop.get("proposition_class", ""),
                "current_confidence": conf,
                "threshold": CONFIDENCE_GAP_THRESHOLD,
                "gap": round(CONFIDENCE_GAP_THRESHOLD - conf, 4),
                "rationale": f"Confidence {conf:.3f} remains below {CONFIDENCE_GAP_THRESHOLD} after enrichment",
            })
    return suggestions


def analyze_debt_persistence(debt_reassessment: Optional[dict]) -> list:
    """Identify debt items unchanged by enrichment."""
    if not debt_reassessment:
        return []

    suggestions = []
    for item in debt_reassessment.get("items", []):
        if item.get("enrichment_impact") == "NOT_AFFECTED":
            suggestions.append({
                "suggestion_type": "DEBT_PERSISTENCE",
                "blocker_id": item.get("blocker_id", ""),
                "domain_id": item.get("domain_id", ""),
                "severity": item.get("severity", ""),
                "reducibility": item.get("post_enrichment_reducibility", ""),
                "rationale": "Debt item unaffected by enrichment — alternative evidence channel needed",
            })
    return suggestions


def analyze_unenriched_candidates(propositions: list, enrichment_log: Optional[dict]) -> list:
    """Identify CANDIDATE propositions with no enrichment attempt."""
    enriched_ids = set()
    if enrichment_log:
        for entry in enrichment_log.get("entries", enrichment_log.get("domain_corrections", [])):
            eid = entry.get("proposition_id", entry.get("domain_id", ""))
            if eid:
                enriched_ids.add(eid)

    suggestions = []
    for prop in propositions:
        if prop.get("status") != "CANDIDATE":
            continue
        pid = prop.get("id", "")
        if pid and pid not in enriched_ids:
            suggestions.append({
                "suggestion_type": "UNENRICHED_CANDIDATES",
                "proposition_id": pid,
                "proposition_class": prop.get("proposition_class", ""),
                "current_confidence": prop.get("confidence"),
                "derivation_tier": prop.get("derivation_tier", ""),
                "rationale": "CANDIDATE proposition has not been through enrichment cycle",
            })
    return suggestions


def analyze_enrichment_saturation(enrichment_summary: Optional[dict]) -> list:
    """Identify proposition classes with diminishing enrichment returns."""
    if not enrichment_summary:
        return []

    suggestions = []
    for class_entry in enrichment_summary.get("by_class", []):
        avg_delta = class_entry.get("avg_confidence_delta", 0)
        count = class_entry.get("enriched_count", 0)
        if count > 0 and abs(avg_delta) < DIMINISHING_DELTA_THRESHOLD:
            suggestions.append({
                "suggestion_type": "ENRICHMENT_SATURATION",
                "proposition_class": class_entry.get("proposition_class", ""),
                "enriched_count": count,
                "avg_confidence_delta": avg_delta,
                "rationale": f"Average delta {avg_delta:.4f} below threshold — enrichment returns diminishing",
            })
    return suggestions


def generate_suggestions(client: str, run_id: str) -> dict:
    """Generate adaptive enrichment suggestions for a specimen run."""
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    if not run_dir.exists():
        print(f"FAIL: Run directory does not exist: {run_dir}", file=sys.stderr)
        sys.exit(1)

    spine = load_json(run_dir / "spine" / "spine_objects.json")
    propositions = []
    if spine:
        propositions = spine.get("objects", {}).get("semantic_propositions", [])
    if not propositions:
        props_data = load_json(run_dir / "semantic" / "spe" / "semantic_propositions.json")
        if props_data:
            propositions = props_data.get("propositions", [])

    enrichment_log = load_json(run_dir / "semantic" / "spe" / "enrichment_log.json")
    debt_reassessment = load_json(run_dir / "semantic" / "spe" / "debt_reassessment.json")
    enrichment_summary = load_json(run_dir / "semantic" / "spe" / "enrichment_summary.json")

    all_suggestions = []
    all_suggestions.extend(analyze_confidence_gaps(propositions, enrichment_log))
    all_suggestions.extend(analyze_debt_persistence(debt_reassessment))
    all_suggestions.extend(analyze_unenriched_candidates(propositions, enrichment_log))
    all_suggestions.extend(analyze_enrichment_saturation(enrichment_summary))

    priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    for s in all_suggestions:
        s["priority"] = SUGGESTION_TYPES.get(s["suggestion_type"], {}).get("priority", "MEDIUM")
    all_suggestions.sort(key=lambda x: priority_order.get(x.get("priority", "MEDIUM"), 1))

    by_type = {}
    for s in all_suggestions:
        st = s["suggestion_type"]
        by_type[st] = by_type.get(st, 0) + 1

    result = {
        "schema_version": "1.0",
        "stream": "PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01",
        "phase": "P4",
        "client": client,
        "run_id": run_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_suggestions": len(all_suggestions),
        "by_type": by_type,
        "approval_status": "PENDING_OPERATOR_REVIEW",
        "approved_suggestions": [],
        "rejected_suggestions": [],
        "suggestions": all_suggestions,
    }

    output_path = run_dir / "sqo" / "adaptive_enrichment_suggestions.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    return result


def approve_suggestion(client: str, run_id: str, suggestion_index: int, operator: str) -> dict:
    """Approve a specific enrichment suggestion."""
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    path = run_dir / "sqo" / "adaptive_enrichment_suggestions.json"
    if not path.exists():
        print("FAIL: No suggestions file — run generate first", file=sys.stderr)
        sys.exit(1)

    with open(path) as f:
        data = json.load(f)

    if suggestion_index < 0 or suggestion_index >= len(data["suggestions"]):
        print(f"FAIL: Invalid suggestion index {suggestion_index}", file=sys.stderr)
        sys.exit(1)

    suggestion = data["suggestions"][suggestion_index]
    approval = {
        "index": suggestion_index,
        "suggestion_type": suggestion["suggestion_type"],
        "approved_by": operator,
        "approved_at": datetime.now(timezone.utc).isoformat(),
    }
    data["approved_suggestions"].append(approval)

    approved_count = len(data["approved_suggestions"])
    rejected_count = len(data["rejected_suggestions"])
    if approved_count + rejected_count >= data["total_suggestions"]:
        data["approval_status"] = "REVIEW_COMPLETE"
    else:
        data["approval_status"] = "PARTIALLY_REVIEWED"

    with open(path, "w") as f:
        json.dump(data, f, indent=2)

    return approval


def main():
    parser = argparse.ArgumentParser(
        description="Adaptive enrichment suggestion system"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    gen_parser = subparsers.add_parser("generate", help="Generate enrichment suggestions")
    gen_parser.add_argument("--client", required=True)
    gen_parser.add_argument("--run-id", required=True)

    approve_parser = subparsers.add_parser("approve", help="Approve a suggestion")
    approve_parser.add_argument("--client", required=True)
    approve_parser.add_argument("--run-id", required=True)
    approve_parser.add_argument("--index", type=int, required=True)
    approve_parser.add_argument("--operator", required=True)

    args = parser.parse_args()

    if args.command == "generate":
        result = generate_suggestions(args.client, args.run_id)
        print(f"ADAPTIVE ENRICHMENT SUGGESTIONS: {args.client}/{args.run_id}")
        print(f"  Total: {result['total_suggestions']}")
        for st, count in sorted(result["by_type"].items()):
            print(f"  {st}: {count}")

    elif args.command == "approve":
        approval = approve_suggestion(args.client, args.run_id, args.index, args.operator)
        print(f"APPROVED: suggestion {args.index} ({approval['suggestion_type']})")


if __name__ == "__main__":
    main()
