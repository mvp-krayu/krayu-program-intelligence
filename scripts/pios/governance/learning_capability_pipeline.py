#!/usr/bin/env python3
"""
Learning-to-capability pipeline for governed PI runtime.

Connects CONSUMABLE learning events to pipeline parameterization pathway.
Extends existing learning_lifecycle.py and learning_promoter.py with the
bridge from governed learning observations to operational capability candidates.

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

CAPABILITY_DOMAINS = {
    "EVIDENCE_INTAKE": {
        "description": "Evidence acquisition and structural parsing",
        "parameterizable": ["parser_selection", "evidence_channel", "intake_filters"],
    },
    "SEMANTIC_DERIVATION": {
        "description": "Proposition generation from structural evidence",
        "parameterizable": ["proposition_classes", "confidence_calibration", "tier_mapping"],
    },
    "ENRICHMENT": {
        "description": "Substrate strengthening and evidence cross-referencing",
        "parameterizable": ["enrichment_targets", "delta_bounds", "evidence_sources"],
    },
    "GOVERNANCE": {
        "description": "Review, arbitration, qualification gate enforcement",
        "parameterizable": ["gate_thresholds", "review_workflow", "blocker_classification"],
    },
    "PROJECTION": {
        "description": "Cognitive projection through personas and depth levels",
        "parameterizable": ["persona_contracts", "depth_rules", "narrative_boundaries"],
    },
}

PIPELINE_IMPACT_LEVELS = {
    "PARAMETER_ADJUSTMENT": {
        "ordinal": 0,
        "description": "Tune existing parameter without logic change",
        "operator_required": True,
        "testing_required": "REVALIDATION",
    },
    "LOGIC_EXTENSION": {
        "ordinal": 1,
        "description": "Add new branch/handler to existing logic",
        "operator_required": True,
        "testing_required": "FULL_REGRESSION",
    },
    "MODULE_CREATION": {
        "ordinal": 2,
        "description": "New pipeline module from capability candidate",
        "operator_required": True,
        "testing_required": "FULL_REGRESSION + CROSS_SPECIMEN",
    },
}

CONSUMABLE_STATES = {"CONSUMABLE", "CAPABILITY_CANDIDATE", "MODULE_CANDIDATE"}


def load_json(path: Path) -> Optional[dict]:
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def load_learning_events(path: Path) -> list:
    """Load JSONL learning events."""
    events = []
    if not path.exists():
        return events
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                events.append(json.loads(line))
    return events


def find_consumable_events(events: list) -> list:
    """Filter to events in consumption-eligible states."""
    return [e for e in events if e.get("lifecycle_state") in CONSUMABLE_STATES]


def classify_capability_domain(event: dict) -> Optional[str]:
    """Map a learning event to a capability domain based on category and context."""
    category = event.get("category", "").upper()
    title = event.get("title", "").upper()

    domain_keywords = {
        "EVIDENCE_INTAKE": ["INTAKE", "PARSER", "EVIDENCE_SOURCE", "SDC", "CODE_GRAPH"],
        "SEMANTIC_DERIVATION": ["PROPOSITION", "SEMANTIC", "DERIVATION", "CONFIDENCE", "SPE"],
        "ENRICHMENT": ["ENRICHMENT", "SUBSTRATE", "STRENGTHENING", "DEBT", "DELTA"],
        "GOVERNANCE": ["GOVERNANCE", "REVIEW", "ARBITRATION", "QUALIFICATION", "GATE", "SQO", "BLOCKER"],
        "PROJECTION": ["PROJECTION", "PERSONA", "LENS", "NARRATIVE", "DEPTH", "BOARDROOM"],
    }

    for domain, keywords in domain_keywords.items():
        if any(kw in category or kw in title for kw in keywords):
            return domain

    return None


def assess_pipeline_impact(event: dict, domain: str) -> str:
    """Determine the pipeline impact level for a learning event."""
    capability_class = event.get("capability_class", "")
    state = event.get("lifecycle_state", "")

    if state == "MODULE_CANDIDATE":
        return "MODULE_CREATION"
    if capability_class in ("PIPELINE_EXTENSION", "NEW_EVIDENCE_CHANNEL"):
        return "LOGIC_EXTENSION"
    return "PARAMETER_ADJUSTMENT"


def generate_capability_proposal(event: dict, domain: str) -> dict:
    """Generate a capability proposal from a consumable learning event."""
    impact = assess_pipeline_impact(event, domain)
    domain_spec = CAPABILITY_DOMAINS.get(domain, {})

    return {
        "proposal_id": f"CAP-{event.get('event_id', 'UNKNOWN')}-{datetime.now(timezone.utc).strftime('%Y%m%d')}",
        "learning_event_ref": event.get("event_id", ""),
        "learning_state": event.get("lifecycle_state", ""),
        "capability_domain": domain,
        "domain_description": domain_spec.get("description", ""),
        "parameterizable_targets": domain_spec.get("parameterizable", []),
        "pipeline_impact": impact,
        "impact_spec": PIPELINE_IMPACT_LEVELS.get(impact, {}),
        "title": event.get("title", ""),
        "category": event.get("category", ""),
        "specimen_refs": _extract_specimen_refs(event),
        "proposal_status": "PROPOSED",
        "operator_approved": False,
        "approved_by": None,
        "approved_at": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def _extract_specimen_refs(event: dict) -> list:
    """Extract specimen references from learning event metadata."""
    refs = []
    meta = event.get("registry_metadata", event.get("metadata", {}))
    source = meta.get("ingested_from", "")
    if source:
        refs.append(source)
    specimens = meta.get("specimen_refs", [])
    if specimens:
        refs.extend(specimens)
    return list(set(refs))


def run_pipeline_scan(learning_events_path: Path) -> dict:
    """Scan learning events and generate capability proposals."""
    events = load_learning_events(learning_events_path)
    consumable = find_consumable_events(events)

    proposals = []
    unclassified = []

    for event in consumable:
        domain = classify_capability_domain(event)
        if domain:
            proposal = generate_capability_proposal(event, domain)
            proposals.append(proposal)
        else:
            unclassified.append({
                "event_id": event.get("event_id", ""),
                "title": event.get("title", ""),
                "category": event.get("category", ""),
                "state": event.get("lifecycle_state", ""),
                "reason": "No capability domain match — requires manual classification",
            })

    by_domain = {}
    for p in proposals:
        d = p["capability_domain"]
        by_domain[d] = by_domain.get(d, 0) + 1

    by_impact = {}
    for p in proposals:
        i = p["pipeline_impact"]
        by_impact[i] = by_impact.get(i, 0) + 1

    return {
        "schema_version": "1.0",
        "stream": "PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01",
        "phase": "P4",
        "scanned_at": datetime.now(timezone.utc).isoformat(),
        "total_events": len(events),
        "consumable_events": len(consumable),
        "proposals_generated": len(proposals),
        "unclassified": len(unclassified),
        "by_domain": by_domain,
        "by_impact": by_impact,
        "proposals": proposals,
        "unclassified_events": unclassified,
        "pipeline_readiness": "PROPOSALS_PENDING" if proposals else "NO_CONSUMABLE_EVENTS",
    }


def approve_proposal(proposals_data: dict, proposal_id: str, operator: str) -> dict:
    """Approve a capability proposal for pipeline integration."""
    for proposal in proposals_data.get("proposals", []):
        if proposal["proposal_id"] == proposal_id:
            if proposal["proposal_status"] != "PROPOSED":
                raise ValueError(f"Proposal {proposal_id} already in state {proposal['proposal_status']}")
            proposal["proposal_status"] = "APPROVED"
            proposal["operator_approved"] = True
            proposal["approved_by"] = operator
            proposal["approved_at"] = datetime.now(timezone.utc).isoformat()
            return proposal

    raise ValueError(f"Proposal {proposal_id} not found")


def scan_all_specimens() -> dict:
    """Scan learning events across all known specimens."""
    clients_dir = REPO_ROOT / "clients"
    if not clients_dir.exists():
        return {"error": "No clients directory found", "specimens": []}

    all_results = []
    for client_dir in sorted(clients_dir.iterdir()):
        if not client_dir.is_dir():
            continue
        runs_dir = client_dir / "psee" / "runs"
        if not runs_dir.exists():
            continue
        for run_dir in sorted(runs_dir.iterdir()):
            if not run_dir.is_dir():
                continue
            events_path = run_dir / "governance" / "learning_events.jsonl"
            if events_path.exists():
                result = run_pipeline_scan(events_path)
                result["client"] = client_dir.name
                result["run_id"] = run_dir.name
                all_results.append(result)

    total_proposals = sum(r["proposals_generated"] for r in all_results)
    total_unclassified = sum(r["unclassified"] for r in all_results)

    return {
        "scanned_at": datetime.now(timezone.utc).isoformat(),
        "specimens_scanned": len(all_results),
        "total_proposals": total_proposals,
        "total_unclassified": total_unclassified,
        "specimens": all_results,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Learning-to-capability pipeline"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    scan_parser = subparsers.add_parser("scan", help="Scan learning events for capability candidates")
    scan_parser.add_argument("--client", required=True)
    scan_parser.add_argument("--run-id", required=True)

    scan_all_parser = subparsers.add_parser("scan-all", help="Scan all specimens")

    domains_parser = subparsers.add_parser("domains", help="Show capability domains")

    args = parser.parse_args()

    if args.command == "scan":
        run_dir = REPO_ROOT / "clients" / args.client / "psee" / "runs" / args.run_id
        events_path = run_dir / "governance" / "learning_events.jsonl"
        if not events_path.exists():
            print(f"No learning_events.jsonl at {events_path}")
            sys.exit(0)

        result = run_pipeline_scan(events_path)

        output_path = run_dir / "governance" / "capability_proposals.json"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w") as f:
            json.dump(result, f, indent=2)

        print(f"LEARNING-TO-CAPABILITY PIPELINE: {args.client}/{args.run_id}")
        print(f"  Total events:      {result['total_events']}")
        print(f"  Consumable:        {result['consumable_events']}")
        print(f"  Proposals:         {result['proposals_generated']}")
        print(f"  Unclassified:      {result['unclassified']}")
        if result["by_domain"]:
            print(f"  By domain:         {result['by_domain']}")
        if result["by_impact"]:
            print(f"  By impact:         {result['by_impact']}")

    elif args.command == "scan-all":
        result = scan_all_specimens()
        print(f"CROSS-SPECIMEN PIPELINE SCAN")
        print(f"  Specimens scanned: {result['specimens_scanned']}")
        print(f"  Total proposals:   {result['total_proposals']}")
        print(f"  Unclassified:      {result['total_unclassified']}")
        for spec in result.get("specimens", []):
            print(f"  {spec.get('client')}/{spec.get('run_id')}: {spec['proposals_generated']} proposals")

    elif args.command == "domains":
        for domain, spec in CAPABILITY_DOMAINS.items():
            print(f"{domain}:")
            print(f"  {spec['description']}")
            print(f"  Parameterizable: {spec['parameterizable']}")
            print()


if __name__ == "__main__":
    main()
