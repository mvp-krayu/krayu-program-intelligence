#!/usr/bin/env python3
"""
Standalone debt reassessment for governed PI runtime.

Re-evaluates qualification blockers (debt items) against enrichment evidence.
Extracted from evidence_enrichment_rc04.py and generalized for both PATH A
and PATH B specimens.

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


def assess_debt_against_enrichment(
    blockers: dict, enrichment_log: dict, specimen_path: str
) -> dict:
    """Re-assess debt items using enrichment evidence."""
    timestamp = datetime.now(timezone.utc).isoformat()

    domain_enrichment = {}
    for entry in enrichment_log.get("entries", enrichment_log.get("domain_corrections", [])):
        key = entry.get("proposition_id", entry.get("domain_id", ""))
        if key:
            domain_enrichment[key] = entry

    blocker_list = blockers.get("blockers", blockers.get("qualification_blockers", []))
    debt_items = []
    improved = 0
    unchanged = 0
    worsened = 0

    for blk in blocker_list:
        blocker_id = blk.get("blocker_id", blk.get("id", ""))
        domain_id = blk.get("domain_id", "")
        original_reducibility = blk.get("reducibility", "CONTINUITY_GAP")
        severity = blk.get("severity", "UNKNOWN")
        blocks = blk.get("blocks_s_state", "none")

        enrichment = domain_enrichment.get(domain_id) or domain_enrichment.get(blocker_id)

        item = {
            "blocker_id": blocker_id,
            "domain_id": domain_id,
            "original_reducibility": original_reducibility,
            "severity": severity,
            "blocks_s_state": blocks,
        }

        if not enrichment:
            item["enrichment_impact"] = "NOT_AFFECTED"
            item["post_enrichment_reducibility"] = original_reducibility
            item["evidence_change"] = "No enrichment evidence applicable"
            unchanged += 1
        elif enrichment.get("action") == "CONFIDENCE_REDUCED":
            if original_reducibility == "IRREDUCIBLE_STRUCTURAL_ABSENCE":
                item["enrichment_impact"] = "CONFIRMED_IRREDUCIBLE"
                item["post_enrichment_reducibility"] = "IRREDUCIBLE_STRUCTURAL_ABSENCE"
                item["evidence_change"] = "Enrichment confirmed irreducibility"
                unchanged += 1
            else:
                item["enrichment_impact"] = "WORSENED"
                item["post_enrichment_reducibility"] = "IRREDUCIBLE_STRUCTURAL_ABSENCE"
                item["evidence_change"] = "Evidence reduced — reclassified as irreducible"
                worsened += 1
        elif enrichment.get("action") == "ENRICHED":
            old_conf = enrichment.get("old_confidence", 0)
            new_conf = enrichment.get("new_confidence", 0)
            if new_conf > old_conf:
                item["enrichment_impact"] = "IMPROVED"
                item["post_enrichment_reducibility"] = original_reducibility
                item["evidence_change"] = f"Confidence improved {old_conf:.3f}→{new_conf:.3f}"
                improved += 1
            elif new_conf < old_conf:
                item["enrichment_impact"] = "REDUCED_EVIDENCE"
                item["post_enrichment_reducibility"] = original_reducibility
                item["evidence_change"] = f"Confidence reduced {old_conf:.3f}→{new_conf:.3f}"
                worsened += 1
            else:
                item["enrichment_impact"] = "CONFIRMED_STABLE"
                item["post_enrichment_reducibility"] = original_reducibility
                item["evidence_change"] = "Evidence confirmed at same level"
                unchanged += 1
        elif enrichment.get("action") in ("CONFIRMED", "CONFIRMED_NO_CHANGE"):
            item["enrichment_impact"] = "CONFIRMED_STABLE"
            item["post_enrichment_reducibility"] = original_reducibility
            item["evidence_change"] = "Structural evidence confirmed stable"
            unchanged += 1
        else:
            item["enrichment_impact"] = "NOT_AFFECTED"
            item["post_enrichment_reducibility"] = original_reducibility
            item["evidence_change"] = f"Enrichment action {enrichment.get('action')} — no debt impact"
            unchanged += 1

        debt_items.append(item)

    reducibility_counts = {}
    for item in debt_items:
        r = item["post_enrichment_reducibility"]
        reducibility_counts[r] = reducibility_counts.get(r, 0) + 1

    return {
        "schema_version": "1.0",
        "stream": "PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01",
        "timestamp": timestamp,
        "specimen_path": specimen_path,
        "enrichment_source": enrichment_log.get("enrichment_type", "UNKNOWN"),
        "total_debt_items": len(debt_items),
        "improved": improved,
        "unchanged": unchanged,
        "worsened": worsened,
        "blockers_resolved": 0,
        "reducibility_distribution": reducibility_counts,
        "items": debt_items,
    }


def run(client: str, run_id: str, blockers_run: str = None) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    if not run_dir.exists():
        print(f"FAIL: Run directory does not exist: {run_dir}", file=sys.stderr)
        sys.exit(1)

    if (run_dir / "structure" / "40.3s" / "code_graph.json").exists():
        specimen_path = "PATH_A"
    else:
        specimen_path = "PATH_B"

    enrichment_log = load_json(run_dir / "semantic" / "spe" / "enrichment_log.json")
    if not enrichment_log:
        print("FAIL: No enrichment_log.json — run enrichment first", file=sys.stderr)
        sys.exit(1)

    if blockers_run:
        blockers_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / blockers_run
    else:
        blockers_dir = run_dir
    blockers_path = blockers_dir / "sqo" / "qualification_blockers.json"
    blockers = load_json(blockers_path)
    if not blockers:
        print(f"FAIL: No qualification_blockers.json at {blockers_path}", file=sys.stderr)
        sys.exit(1)

    result = assess_debt_against_enrichment(blockers, enrichment_log, specimen_path)

    output_path = run_dir / "semantic" / "spe" / "debt_reassessment.json"
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Standalone debt reassessment against enrichment evidence"
    )
    parser.add_argument("--client", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--blockers-run", help="Run containing qualification_blockers.json (defaults to --run-id)")
    args = parser.parse_args()

    result = run(args.client, args.run_id, args.blockers_run)
    print(f"DEBT REASSESSMENT: {args.client}/{args.run_id}")
    print(f"  Specimen path: {result['specimen_path']}")
    print(f"  Total items:   {result['total_debt_items']}")
    print(f"  Improved:      {result['improved']}")
    print(f"  Unchanged:     {result['unchanged']}")
    print(f"  Worsened:      {result['worsened']}")
    print(f"  Resolved:      {result['blockers_resolved']}")


if __name__ == "__main__":
    main()
