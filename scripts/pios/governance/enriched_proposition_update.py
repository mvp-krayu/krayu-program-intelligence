#!/usr/bin/env python3
"""
Standalone enriched proposition update for governed PI runtime.

Applies enrichment results to propositions with full lineage tracking.
Writes enrichment_summary.json as the terminal artifact for the enrichment
stage. Works for both PATH A and PATH B specimens.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P1)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent


def load_json(path: Path) -> dict | None:
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def compute_enrichment_summary(
    client: str,
    run_id: str,
    propositions: list,
    enrichment_log: dict,
    debt_result: dict | None,
) -> dict:
    """Compute the final enrichment summary from all enrichment artifacts."""
    timestamp = datetime.now(timezone.utc).isoformat()

    entries = enrichment_log.get("entries", enrichment_log.get("domain_corrections", []))

    enriched_entries = [e for e in entries if e.get("action") == "ENRICHED"]
    confirmed_entries = [e for e in entries if e.get("action") in ("CONFIRMED", "CONFIRMED_NO_CHANGE")]
    skipped_entries = [e for e in entries if e.get("action") == "SKIPPED"]

    pre_confidences = []
    post_confidences = []
    for entry in enriched_entries:
        if "old_confidence" in entry:
            pre_confidences.append(entry["old_confidence"])
        if "new_confidence" in entry:
            post_confidences.append(entry["new_confidence"])

    accepted = [p for p in propositions if p.get("status") in ("ACCEPTED", "CANDIDATE")]
    all_confidences = [p["confidence"] for p in accepted if "confidence" in p]

    summary = {
        "schema_version": "1.0",
        "stream": "PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01",
        "sqo_stage": "enriched_proposition_update",
        "client": client,
        "run_id": run_id,
        "timestamp": timestamp,
        "specimen_path": enrichment_log.get("enrichment_type", "UNKNOWN"),
        "total_propositions": len(propositions),
        "enrichment_events": len(enriched_entries) + len(confirmed_entries),
        "enriched": len(enriched_entries),
        "confirmed": len(confirmed_entries),
        "skipped": len(skipped_entries),
        "confidence_deltas": {
            "propositions_with_change": len(enriched_entries),
            "mean_pre_enrichment": round(sum(pre_confidences) / len(pre_confidences), 3) if pre_confidences else None,
            "mean_post_enrichment": round(sum(post_confidences) / len(post_confidences), 3) if post_confidences else None,
            "mean_confidence_all": round(sum(all_confidences) / len(all_confidences), 3) if all_confidences else None,
        },
        "debt_reassessment": {
            "performed": debt_result is not None,
            "improved": debt_result.get("improved", 0) if debt_result else 0,
            "unchanged": debt_result.get("unchanged", 0) if debt_result else 0,
            "worsened": debt_result.get("worsened", 0) if debt_result else 0,
            "resolved": debt_result.get("blockers_resolved", 0) if debt_result else 0,
        },
    }

    by_class = {}
    for entry in entries:
        cls = entry.get("proposition_class", "UNKNOWN")
        by_class.setdefault(cls, {"enriched": 0, "confirmed": 0, "skipped": 0})
        action = entry.get("action", "SKIPPED")
        if action == "ENRICHED":
            by_class[cls]["enriched"] += 1
        elif action in ("CONFIRMED", "CONFIRMED_NO_CHANGE"):
            by_class[cls]["confirmed"] += 1
        else:
            by_class[cls]["skipped"] += 1
    summary["by_proposition_class"] = by_class

    return summary


def run(client: str, run_id: str) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    if not run_dir.exists():
        print(f"FAIL: Run directory does not exist: {run_dir}", file=sys.stderr)
        sys.exit(1)

    enrichment_log = load_json(run_dir / "semantic" / "spe" / "enrichment_log.json")
    if not enrichment_log:
        print("FAIL: No enrichment_log.json — run enrichment first", file=sys.stderr)
        sys.exit(1)

    spine = load_json(run_dir / "spine" / "spine_objects.json")
    propositions = []
    if spine:
        propositions = spine.get("objects", {}).get("semantic_propositions", [])

    if not propositions:
        props_data = load_json(run_dir / "semantic" / "spe" / "semantic_propositions.json")
        if props_data:
            propositions = props_data.get("propositions", [])

    if not propositions:
        print("FAIL: No propositions found", file=sys.stderr)
        sys.exit(1)

    debt_result = load_json(run_dir / "semantic" / "spe" / "debt_reassessment.json")

    summary = compute_enrichment_summary(
        client, run_id, propositions, enrichment_log, debt_result
    )

    output_path = run_dir / "semantic" / "spe" / "enrichment_summary.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(summary, f, indent=2)

    return summary


def main():
    parser = argparse.ArgumentParser(
        description="Standalone enriched proposition update and summary"
    )
    parser.add_argument("--client", required=True)
    parser.add_argument("--run-id", required=True)
    args = parser.parse_args()

    result = run(args.client, args.run_id)
    print(f"ENRICHMENT SUMMARY: {args.client}/{args.run_id}")
    print(f"  Total propositions: {result['total_propositions']}")
    print(f"  Enriched: {result['enriched']}")
    print(f"  Confirmed: {result['confirmed']}")
    print(f"  Skipped: {result['skipped']}")
    deltas = result["confidence_deltas"]
    if deltas["mean_pre_enrichment"] is not None:
        print(f"  Mean confidence: {deltas['mean_pre_enrichment']:.3f} → {deltas['mean_post_enrichment']:.3f}")
    debt = result["debt_reassessment"]
    if debt["performed"]:
        print(f"  Debt: improved={debt['improved']} unchanged={debt['unchanged']} worsened={debt['worsened']}")


if __name__ == "__main__":
    main()
