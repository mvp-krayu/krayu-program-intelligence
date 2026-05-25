#!/usr/bin/env python3
"""
Enrichment planning materializer for governed PI runtime.

Produces a formal enrichment_plan.json declaring which propositions are
enrichment targets, what evidence sources will be used, and what confidence
changes are expected. The plan requires operator approval before execution.

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


def identify_path_a_targets(propositions: list, centrality: dict) -> list:
    """Identify PATH A propositions that can be enriched by code graph evidence."""
    centrality_ranking = centrality.get("centrality_ranking", [])
    centrality_by_path = {e["path"]: e for e in centrality_ranking}
    centrality_by_node = {e.get("node_id", ""): e for e in centrality_ranking}

    targets = []
    for prop in propositions:
        if prop.get("status") not in ("CANDIDATE", "ACCEPTED"):
            continue

        refs = prop.get("structural_refs", {})
        prop_class = prop.get("proposition_class", "")

        enrichable = False
        enrichment_type = None
        evidence_source = None

        if prop_class == "STRUCTURAL_DOMINANCE":
            top_node = refs.get("top_node", "")
            centrality_rank = refs.get("centrality_rank")
            if top_node and top_node in centrality_by_path:
                live = centrality_by_path[top_node]
                if live.get("centrality_rank") != centrality_rank:
                    enrichable = True
                    enrichment_type = "CENTRALITY_RANK_REFRESH"
                    evidence_source = "40.3c"

        elif prop_class == "AUTHORITY_TOPOLOGY":
            if refs.get("import_authority") is not None:
                enrichable = True
                enrichment_type = "AUTHORITY_COMPOSITION_REFRESH"
                evidence_source = "40.3c + 40.3s"

        elif prop_class == "COUPLING_PATTERN":
            if refs.get("forward_count") is not None:
                enrichable = True
                enrichment_type = "COUPLING_EDGE_REFRESH"
                evidence_source = "40.3s"

        elif prop_class == "TIER_GROUNDING":
            if refs.get("import_in_degree") is not None:
                enrichable = True
                enrichment_type = "TIER_METRIC_REFRESH"
                evidence_source = "40.3c"

        elif prop_class == "HERO_MOMENT_GROUNDING":
            if refs.get("reconciliation_against"):
                enrichable = True
                enrichment_type = "HERO_MOMENT_REVALIDATION"
                evidence_source = "40.3c + hero_moments"

        elif prop_class == "CLUSTER_ARCHITECTURE":
            enrichable = prop.get("derivation_tier") == "DERIVED"
            enrichment_type = "CLUSTER_EVIDENCE_GROUNDING"
            evidence_source = "40.3s + 40.3c"

        if enrichable:
            targets.append({
                "proposition_id": prop["id"],
                "proposition_class": prop_class,
                "current_confidence": prop.get("confidence"),
                "derivation_tier": prop.get("derivation_tier"),
                "enrichment_type": enrichment_type,
                "evidence_source": evidence_source,
                "status": prop.get("status"),
            })

    return targets


def identify_path_b_targets(propositions: list) -> list:
    """Identify PATH B propositions that can be enriched by document evidence."""
    targets = []
    for prop in propositions:
        if prop.get("status") not in ("CANDIDATE", "ACCEPTED"):
            continue

        refs = prop.get("structural_refs", {})
        prop_class = prop.get("proposition_class", "")

        enrichable = False
        enrichment_type = None

        if prop_class == "DOMAIN_EVIDENCE_GROUNDING":
            if refs.get("sdc_match") is None:
                enrichable = True
                enrichment_type = "SDC_DOMAIN_CORRECTION"

        elif prop_class in ("CAPABILITY_EVIDENCE", "VAULT_CLAIM_GROUNDING"):
            if prop.get("derivation_tier") in ("DERIVED", "INFERRED"):
                enrichable = True
                enrichment_type = "EVIDENCE_TIER_UPGRADE"

        if enrichable:
            targets.append({
                "proposition_id": prop["id"],
                "proposition_class": prop_class,
                "current_confidence": prop.get("confidence"),
                "derivation_tier": prop.get("derivation_tier"),
                "enrichment_type": enrichment_type,
                "evidence_source": "SDC HTML evidence",
                "status": prop.get("status"),
            })

    return targets


PATH_A_CLASSES = frozenset({
    "STRUCTURAL_DOMINANCE", "COUPLING_PATTERN", "AUTHORITY_TOPOLOGY",
    "TIER_GROUNDING", "HERO_MOMENT_GROUNDING", "CLUSTER_ARCHITECTURE",
})
PATH_B_CLASSES = frozenset({
    "DOMAIN_EVIDENCE_GROUNDING", "CAPABILITY_EVIDENCE",
    "VAULT_CLAIM_STRUCTURAL", "CROSS_DOMAIN_EVIDENCE",
    "VAULT_CLAIM_GROUNDING",
})


def classify_specimen_path(run_dir: Path, propositions: list) -> str:
    """Determine whether specimen is PATH A or PATH B by proposition classes."""
    classes = {p.get("proposition_class", "") for p in propositions}
    a_count = len(classes & PATH_A_CLASSES)
    b_count = len(classes & PATH_B_CLASSES)
    if a_count > b_count:
        return "PATH_A"
    if b_count > a_count:
        return "PATH_B"
    if (run_dir / "structure" / "40.3s" / "code_graph.json").exists():
        return "PATH_A"
    return "PATH_B"


def build_enrichment_plan(
    client: str, run_id: str, operator: str = None
) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    if not run_dir.exists():
        print(f"FAIL: Run directory does not exist: {run_dir}", file=sys.stderr)
        sys.exit(1)

    spine_path = run_dir / "spine" / "spine_objects.json"
    spine = load_json(spine_path)
    if not spine:
        print(f"FAIL: No spine_objects.json found", file=sys.stderr)
        sys.exit(1)

    objects = spine.get("objects", {})
    propositions = objects.get("semantic_propositions", [])
    if not propositions:
        props_path = run_dir / "semantic" / "spe" / "semantic_propositions.json"
        props_data = load_json(props_path)
        if props_data:
            propositions = props_data.get("propositions", [])

    specimen_path = classify_specimen_path(run_dir, propositions)

    if specimen_path == "PATH_A":
        centrality_path = run_dir / "structure" / "40.3c" / "structural_centrality.json"
        centrality = load_json(centrality_path) or {}
        targets = identify_path_a_targets(propositions, centrality)
    else:
        targets = identify_path_b_targets(propositions)

    plan = {
        "schema_version": "1.0",
        "stream": "PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01",
        "plan_type": "ENRICHMENT_PLAN",
        "client": client,
        "run_id": run_id,
        "specimen_path": specimen_path,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_propositions": len(propositions),
        "enrichment_targets": len(targets),
        "approval_status": "PENDING_OPERATOR_APPROVAL",
        "approved_by": None,
        "approved_at": None,
        "targets": targets,
        "execution_prerequisites": {
            "code_graph_present": (run_dir / "structure" / "40.3s" / "code_graph.json").exists(),
            "centrality_present": (run_dir / "structure" / "40.3c" / "structural_centrality.json").exists(),
            "propositions_present": len(propositions) > 0,
            "review_complete": _check_review_complete(run_dir),
        },
    }

    plan_path = run_dir / "sqo" / "enrichment_plan.json"
    plan_path.parent.mkdir(parents=True, exist_ok=True)
    with open(plan_path, "w") as f:
        json.dump(plan, f, indent=2)

    return plan


def approve_enrichment_plan(client: str, run_id: str, operator: str) -> dict:
    """Mark an existing enrichment plan as approved."""
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    plan_path = run_dir / "sqo" / "enrichment_plan.json"

    if not plan_path.exists():
        print(f"FAIL: No enrichment_plan.json found", file=sys.stderr)
        sys.exit(1)

    with open(plan_path) as f:
        plan = json.load(f)

    if plan["approval_status"] != "PENDING_OPERATOR_APPROVAL":
        print(f"Plan already in state: {plan['approval_status']}", file=sys.stderr)
        sys.exit(1)

    plan["approval_status"] = "APPROVED"
    plan["approved_by"] = operator
    plan["approved_at"] = datetime.now(timezone.utc).isoformat()

    with open(plan_path, "w") as f:
        json.dump(plan, f, indent=2)

    return plan


def _check_review_complete(run_dir: Path) -> bool:
    review_path = run_dir / "semantic" / "spe" / "proposition_review_state.json"
    if not review_path.exists():
        return False
    review = load_json(review_path)
    return review.get("status") == "COMPLETE" if review else False


def main():
    parser = argparse.ArgumentParser(
        description="Enrichment planning materializer"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    plan_parser = subparsers.add_parser("plan", help="Generate enrichment plan")
    plan_parser.add_argument("--client", required=True)
    plan_parser.add_argument("--run-id", required=True)

    approve_parser = subparsers.add_parser("approve", help="Approve enrichment plan")
    approve_parser.add_argument("--client", required=True)
    approve_parser.add_argument("--run-id", required=True)
    approve_parser.add_argument("--operator", required=True, help="Operator identity")

    args = parser.parse_args()

    if args.command == "plan":
        plan = build_enrichment_plan(args.client, args.run_id)
        print(f"Enrichment plan generated: {plan['enrichment_targets']} targets")
        print(f"  Specimen path: {plan['specimen_path']}")
        print(f"  Status: {plan['approval_status']}")
        by_type = {}
        for t in plan["targets"]:
            by_type[t["enrichment_type"]] = by_type.get(t["enrichment_type"], 0) + 1
        for etype, count in sorted(by_type.items()):
            print(f"  {etype}: {count}")

    elif args.command == "approve":
        plan = approve_enrichment_plan(args.client, args.run_id, args.operator)
        print(f"Plan APPROVED by {args.operator}")


if __name__ == "__main__":
    main()
