#!/usr/bin/env python3
"""
ceu_reconciliation_seeder.py
Contract: PI.SQO.CEU-RECONCILIATION-WORKFLOW.01

Seeds the CEU reconciliation state from candidate registry and evidence anchors.
Produces governed reconciliation_state.json and reconciliation_obligations.json
that the SQO CEU reconciliation workflow operates on.

This is the bridge between pipeline artifacts (candidates + evidence) and
the SQO operational workflow (actions, state transitions, governance events).

Reads:
  clients/<client>/psee/runs/<run>/ceu/candidate_registry.json
  clients/<client>/psee/runs/<run>/ceu/evidence_anchors.json  (optional)

Writes:
  clients/<client>/psee/runs/<run>/ceu/reconciliation_state.json
  clients/<client>/psee/runs/<run>/ceu/reconciliation_obligations.json
  clients/<client>/psee/runs/<run>/ceu/reconciliation_event_log.jsonl

Usage:
    python3 scripts/pios/ceu_reconciliation_seeder.py \\
        --client netbox \\
        --run-id run_github_netbox_20260520_134600

    --dry-run       Log what would be written; no files written
    --report-only   Print state summary; no files written

RULE: No AI/LLM. All computation is deterministic.
RULE: CREATE_ONLY — abort if output files already exist (in write mode).
RULE: Seeds initial state only — transitions happen via SQO action engine.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

CONTRACT_ID = "PI.SQO.CEU-RECONCILIATION-WORKFLOW.01"


def resolve_paths(client: str, run_id: str) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    ceu_dir = run_dir / "ceu"
    return {
        "run_dir": run_dir,
        "ceu_dir": ceu_dir,
        "candidate_registry": ceu_dir / "candidate_registry.json",
        "evidence_anchors": ceu_dir / "evidence_anchors.json",
        "reconciliation_state": ceu_dir / "reconciliation_state.json",
        "reconciliation_obligations": ceu_dir / "reconciliation_obligations.json",
        "reconciliation_event_log": ceu_dir / "reconciliation_event_log.jsonl",
    }


def load_json(path: Path) -> dict | None:
    if not path.is_file():
        return None
    with open(path) as f:
        return json.load(f)


def determine_initial_state(ceu_id: str, evidence_summary: dict | None) -> str:
    """Determine initial candidate state based on available evidence."""
    if not evidence_summary:
        return "PROPOSED"
    anchor_count = evidence_summary.get("total_anchors", 0)
    if anchor_count > 0:
        return "EVIDENCE_ATTACHED"
    return "PROPOSED"


def derive_initial_obligations(
    candidates: list[dict],
    evidence_summary: dict,
) -> list[dict]:
    """Derive review obligations from structural observations."""
    obligations = []
    obl_id = 0

    for candidate in candidates:
        ceu_id = candidate.get("ceu_id", "")
        domain = candidate.get("domain", "")

        if candidate.get("merge_candidate", False):
            obl_id += 1
            obligations.append({
                "obligation_id": f"OBL-CEU-{obl_id:04d}",
                "ceu_id": ceu_id,
                "obligation_type": "MERGE_REVIEW",
                "description": f"Merge candidate {ceu_id} ({domain}) has {candidate.get('file_count', 0)} files — review whether to merge into a parent domain",
                "required_evidence": "Structural coupling analysis and domain intent documentation",
                "status": "UNRESOLVED",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })

        ev = evidence_summary.get(ceu_id, {})
        if ev.get("total_anchors", 0) == 0:
            obl_id += 1
            obligations.append({
                "obligation_id": f"OBL-CEU-{obl_id:04d}",
                "ceu_id": ceu_id,
                "obligation_type": "EVIDENCE_GAP",
                "description": f"No documentation evidence found for {ceu_id} ({domain}) — requires manual evidence attachment or rejection",
                "required_evidence": "Documentation, README, or architectural description for this domain",
                "status": "UNRESOLVED",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })

        auth = candidate.get("authority_pattern", {})
        if auth.get("pattern") == "NEGLIGIBLE":
            obl_id += 1
            obligations.append({
                "obligation_id": f"OBL-CEU-{obl_id:04d}",
                "ceu_id": ceu_id,
                "obligation_type": "AUTHORITY_REVIEW",
                "description": f"{ceu_id} ({domain}) has NEGLIGIBLE authority pattern — review whether this is a valid domain or structural noise",
                "required_evidence": "Structural role justification or rejection rationale",
                "status": "UNRESOLVED",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })

    return obligations


def build_reconciliation_state(
    client: str,
    run_id: str,
    candidate_registry: dict,
    evidence_anchors: dict | None,
) -> dict:
    """Build initial reconciliation state from candidates and evidence."""

    candidates = candidate_registry.get("candidates", [])
    now = datetime.now(timezone.utc).isoformat()

    evidence_summary = {}
    if evidence_anchors:
        evidence_summary = evidence_anchors.get("domain_summary", {})

    candidate_states = {}
    for candidate in candidates:
        ceu_id = candidate.get("ceu_id", "")
        ev = evidence_summary.get(ceu_id, {})
        initial_state = determine_initial_state(ceu_id, ev)

        candidate_states[ceu_id] = {
            "domain": candidate.get("domain", ""),
            "state": initial_state,
            "tier": candidate.get("tier", "UNKNOWN"),
            "file_count": candidate.get("file_count", 0),
            "evidence_count": ev.get("total_anchors", 0),
            "evidence_types": ev.get("evidence_types", {}),
            "merge_candidate": candidate.get("merge_candidate", False),
            "authority_pattern": candidate.get("authority_pattern", {}).get("pattern", "UNKNOWN"),
            "reconciliation_finding": None,
            "last_action": None,
            "last_actor": None,
            "last_action_at": None,
        }

    total = len(candidates)
    proposed = sum(1 for c in candidate_states.values() if c["state"] == "PROPOSED")
    evidence_attached = sum(1 for c in candidate_states.values() if c["state"] == "EVIDENCE_ATTACHED")

    obligations = derive_initial_obligations(candidates, evidence_summary)
    unresolved = sum(1 for o in obligations if o["status"] == "UNRESOLVED")

    state = {
        "contract_id": CONTRACT_ID,
        "client_id": client,
        "run_id": run_id,
        "seeded_at": now,
        "review_mode": "UNCLASSIFIED",
        "reconciliation_status": "INITIALIZED",
        "summary": {
            "total": total,
            "proposed": proposed,
            "evidence_attached": evidence_attached,
            "reconciled": 0,
            "confirmed": 0,
            "rejected": 0,
            "merged": 0,
            "split": 0,
            "reclassified": 0,
            "pending": total,
        },
        "candidates": candidate_states,
        "promotion_gate": {
            "all_candidates_resolved": False,
            "unresolved_obligations": unresolved,
            "review_mode": "UNCLASSIFIED",
            "review_sufficient": False,
            "semantic_derivation_permitted": False,
            "gate_reason": "Reconciliation not started — candidates require review",
        },
    }

    return state, obligations


def build_seed_events(
    client: str,
    run_id: str,
    state: dict,
    obligations: list[dict],
) -> list[dict]:
    """Build seed events for the reconciliation event log."""
    events = []
    now = datetime.now(timezone.utc).isoformat()

    events.append({
        "event_id": "RCEU-0001",
        "timestamp": now,
        "event_type": "reconciliation_initialized",
        "actor_id": "system:ceu_reconciliation_seeder",
        "detail": {
            "candidate_count": state["summary"]["total"],
            "proposed": state["summary"]["proposed"],
            "evidence_attached": state["summary"]["evidence_attached"],
            "obligation_count": len(obligations),
        },
    })

    event_id = 1
    for obl in obligations:
        event_id += 1
        events.append({
            "event_id": f"RCEU-{event_id:04d}",
            "timestamp": now,
            "event_type": "obligation_created",
            "actor_id": "system:ceu_reconciliation_seeder",
            "obligation_id": obl["obligation_id"],
            "ceu_id": obl["ceu_id"],
            "obligation_type": obl["obligation_type"],
            "description": obl["description"],
        })

    return events


def print_report(state: dict, obligations: list[dict]):
    print("=" * 72)
    print("  CEU RECONCILIATION STATE — SEED REPORT")
    print("=" * 72)
    print(f"  Client:  {state['client_id']}")
    print(f"  Run:     {state['run_id']}")
    print(f"  Status:  {state['reconciliation_status']}")
    print()

    s = state["summary"]
    print(f"  Candidates: {s['total']}")
    print(f"    PROPOSED:          {s['proposed']}")
    print(f"    EVIDENCE_ATTACHED: {s['evidence_attached']}")
    print(f"    Pending:           {s['pending']}")
    print()

    print("-" * 72)
    print("  CANDIDATE STATES")
    print("-" * 72)
    print(f"{'CEU ID':<25} {'Domain':<20} {'State':<20} {'Evidence':>8} {'Flags'}")
    print("-" * 95)
    for ceu_id, info in state["candidates"].items():
        flags = []
        if info["merge_candidate"]:
            flags.append("MERGE")
        if info["authority_pattern"] == "NEGLIGIBLE":
            flags.append("NEGLIGIBLE")
        flag_str = ", ".join(flags) if flags else ""
        print(f"{ceu_id:<25} {info['domain']:<20} {info['state']:<20} {info['evidence_count']:>8} {flag_str}")

    if obligations:
        print()
        print("-" * 72)
        print(f"  REVIEW OBLIGATIONS ({len(obligations)})")
        print("-" * 72)
        for obl in obligations:
            print(f"  {obl['obligation_id']} [{obl['obligation_type']}] {obl['ceu_id']}")
            print(f"    {obl['description']}")
            print()

    gate = state["promotion_gate"]
    print("-" * 72)
    print("  PROMOTION GATE")
    print("-" * 72)
    print(f"  All resolved:     {gate['all_candidates_resolved']}")
    print(f"  Open obligations: {gate['unresolved_obligations']}")
    print(f"  Semantic deriv:   {'PERMITTED' if gate['semantic_derivation_permitted'] else 'BLOCKED'}")
    print(f"  Reason:           {gate['gate_reason']}")
    print()


def main():
    parser = argparse.ArgumentParser(description="CEU Reconciliation State Seeder")
    parser.add_argument("--client", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--report-only", action="store_true")
    args = parser.parse_args()

    paths = resolve_paths(args.client, args.run_id)

    if not paths["run_dir"].is_dir():
        print(f"FAIL: Run directory not found: {paths['run_dir']}", file=sys.stderr)
        sys.exit(1)

    candidate_registry = load_json(paths["candidate_registry"])
    if not candidate_registry:
        print(f"FAIL: candidate_registry.json not found: {paths['candidate_registry']}", file=sys.stderr)
        sys.exit(1)

    evidence_anchors = load_json(paths["evidence_anchors"])

    print(f"CEU Reconciliation Seeder")
    print(f"  Client: {args.client}")
    print(f"  Run:    {args.run_id}")
    print(f"  Source: candidate_registry ({candidate_registry.get('candidate_count', 0)} candidates)")
    if evidence_anchors:
        print(f"  Source: evidence_anchors ({evidence_anchors.get('total_anchors', 0)} anchors)")
    else:
        print(f"  Source: evidence_anchors (NOT FOUND — seeding without evidence)")

    state, obligations = build_reconciliation_state(
        args.client, args.run_id, candidate_registry, evidence_anchors
    )

    seed_events = build_seed_events(args.client, args.run_id, state, obligations)

    print_report(state, obligations)

    if args.report_only or args.dry_run:
        if args.dry_run:
            print(f"  DRY RUN — would write:")
            print(f"    {paths['reconciliation_state']}")
            print(f"    {paths['reconciliation_obligations']}")
            print(f"    {paths['reconciliation_event_log']}")
        return

    for output_key in ["reconciliation_state", "reconciliation_obligations", "reconciliation_event_log"]:
        if paths[output_key].is_file():
            print(f"FAIL: Output already exists (CREATE_ONLY): {paths[output_key]}", file=sys.stderr)
            sys.exit(1)

    paths["ceu_dir"].mkdir(parents=True, exist_ok=True)

    with open(paths["reconciliation_state"], "w") as f:
        json.dump(state, f, indent=2)
    print(f"  reconciliation_state.json written: {paths['reconciliation_state'].relative_to(REPO_ROOT)}")

    obligations_doc = {
        "contract_id": CONTRACT_ID,
        "client_id": args.client,
        "run_id": args.run_id,
        "total_obligations": len(obligations),
        "resolved": 0,
        "unresolved": sum(1 for o in obligations if o["status"] == "UNRESOLVED"),
        "obligations": obligations,
    }
    with open(paths["reconciliation_obligations"], "w") as f:
        json.dump(obligations_doc, f, indent=2)
    print(f"  reconciliation_obligations.json written: {paths['reconciliation_obligations'].relative_to(REPO_ROOT)}")

    with open(paths["reconciliation_event_log"], "w") as f:
        for event in seed_events:
            f.write(json.dumps(event) + "\n")
    print(f"  reconciliation_event_log.jsonl written: {paths['reconciliation_event_log'].relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
