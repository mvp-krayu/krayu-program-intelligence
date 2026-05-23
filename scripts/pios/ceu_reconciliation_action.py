#!/usr/bin/env python3
"""
ceu_reconciliation_action.py
Contract: PI.SQO.CEU-RECONCILIATION-WORKFLOW.01

Operator CLI for CEU reconciliation review. Issues dispositions on
structurally-derived CEU candidates. Non-automatable governance gate.

Actions:
  confirm  — Accept candidate as valid CEU
  reject   — Reject candidate as structurally invalid
  merge    — Merge candidate into another (--merge-into required)
  complete — Finalize reconciliation (all candidates must be resolved)
  status   — Print current reconciliation state (read-only)

Usage:
    python3 scripts/pios/ceu_reconciliation_action.py \
        --client blueedge \
        --run-id run_blueedge_genesis_e2e_03 \
        --action confirm --target CEU-BACKEND \
        --operator operator:khorrix \
        --rationale "Backend domain structurally grounded"

    python3 scripts/pios/ceu_reconciliation_action.py \
        --client blueedge \
        --run-id run_blueedge_genesis_e2e_03 \
        --action status

RULE: Operator identity required for all mutations.
RULE: Rationale required for all dispositions.
RULE: Append-only event log — no event deletion.
RULE: COMPLETE requires all candidates resolved.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.SQO.CEU-RECONCILIATION-WORKFLOW.01"

VALID_ACTIONS = {"confirm", "reject", "merge", "complete", "status"}
TERMINAL_STATES = {"CONFIRMED", "REJECTED", "MERGED"}


def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def append_event(path: Path, event: dict) -> None:
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def resolve_paths(client: str, run_id: str) -> dict:
    ceu_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id / "ceu"
    return {
        "reconciliation_state": ceu_dir / "reconciliation_state.json",
        "event_log": ceu_dir / "reconciliation_event_log.jsonl",
    }


def print_status(state: dict) -> None:
    status = state.get("reconciliation_status", "UNKNOWN")
    candidates = state.get("candidates", {})
    print(f"  Reconciliation status: {status}")
    print(f"  Candidates: {len(candidates)}")
    for ceu_id, cand in candidates.items():
        st = cand.get("state", "?")
        domain = cand.get("domain", "?")
        evidence = len(cand.get("evidence_refs", []))
        print(f"    {ceu_id:24s}  {domain:20s}  {st:20s}  evidence={evidence}")
    gate = state.get("promotion_gate", {})
    print(f"  All resolved: {gate.get('all_candidates_resolved', False)}")
    unresolved = sum(1 for c in candidates.values() if c.get("state") not in TERMINAL_STATES)
    print(f"  Unresolved: {unresolved}")


def do_confirm(state: dict, target: str, operator: str, rationale: str, event_log: Path) -> bool:
    candidates = state.get("candidates", {})
    if target not in candidates:
        print(f"  FAIL: {target} not found in candidates")
        return False
    cand = candidates[target]
    if cand.get("state") in TERMINAL_STATES:
        print(f"  FAIL: {target} already in terminal state: {cand['state']}")
        return False

    cand["state"] = "CONFIRMED"
    cand["reviewed_at"] = now_iso()
    cand["reviewed_by"] = operator
    cand["review_rationale"] = rationale
    state["reconciliation_status"] = "IN_REVIEW"

    append_event(event_log, {
        "event_type": "candidate_confirmed",
        "ceu_id": target,
        "operator": operator,
        "rationale": rationale,
        "timestamp": now_iso(),
    })
    print(f"  CONFIRMED: {target}")
    return True


def do_reject(state: dict, target: str, operator: str, rationale: str, event_log: Path) -> bool:
    candidates = state.get("candidates", {})
    if target not in candidates:
        print(f"  FAIL: {target} not found in candidates")
        return False
    cand = candidates[target]
    if cand.get("state") in TERMINAL_STATES:
        print(f"  FAIL: {target} already in terminal state: {cand['state']}")
        return False

    cand["state"] = "REJECTED"
    cand["reviewed_at"] = now_iso()
    cand["reviewed_by"] = operator
    cand["review_rationale"] = rationale
    state["reconciliation_status"] = "IN_REVIEW"

    append_event(event_log, {
        "event_type": "candidate_rejected",
        "ceu_id": target,
        "operator": operator,
        "rationale": rationale,
        "timestamp": now_iso(),
    })
    print(f"  REJECTED: {target}")
    return True


def do_merge(state: dict, target: str, merge_into: str, operator: str, rationale: str, event_log: Path) -> bool:
    candidates = state.get("candidates", {})
    if target not in candidates:
        print(f"  FAIL: {target} not found in candidates")
        return False
    if merge_into not in candidates:
        print(f"  FAIL: merge target {merge_into} not found in candidates")
        return False
    cand = candidates[target]
    if cand.get("state") in TERMINAL_STATES:
        print(f"  FAIL: {target} already in terminal state: {cand['state']}")
        return False

    cand["state"] = "MERGED"
    cand["merged_into"] = merge_into
    cand["reviewed_at"] = now_iso()
    cand["reviewed_by"] = operator
    cand["review_rationale"] = rationale
    state["reconciliation_status"] = "IN_REVIEW"

    append_event(event_log, {
        "event_type": "candidate_merged",
        "ceu_id": target,
        "merged_into": merge_into,
        "operator": operator,
        "rationale": rationale,
        "timestamp": now_iso(),
    })
    print(f"  MERGED: {target} → {merge_into}")
    return True


def do_complete(state: dict, operator: str, event_log: Path) -> bool:
    candidates = state.get("candidates", {})
    unresolved = [cid for cid, c in candidates.items() if c.get("state") not in TERMINAL_STATES]
    if unresolved:
        print(f"  FAIL: {len(unresolved)} unresolved candidates: {unresolved}")
        print(f"  All candidates must be CONFIRMED, REJECTED, or MERGED before completing.")
        return False

    state["reconciliation_status"] = "COMPLETE"
    state["completed_at"] = now_iso()
    state["completed_by"] = operator

    confirmed = sum(1 for c in candidates.values() if c.get("state") == "CONFIRMED")
    rejected = sum(1 for c in candidates.values() if c.get("state") == "REJECTED")
    merged = sum(1 for c in candidates.values() if c.get("state") == "MERGED")

    gate = state.get("promotion_gate", {})
    gate["all_candidates_resolved"] = True
    gate["unresolved_obligations"] = 0
    gate["semantic_derivation_eligible"] = True
    gate["reason"] = f"Reconciliation COMPLETE: {confirmed} confirmed, {rejected} rejected, {merged} merged"
    state["promotion_gate"] = gate

    summary = state.get("summary", {})
    summary["confirmed"] = confirmed
    summary["rejected"] = rejected
    summary["merged"] = merged
    state["summary"] = summary

    append_event(event_log, {
        "event_type": "reconciliation_completed",
        "operator": operator,
        "confirmed": confirmed,
        "rejected": rejected,
        "merged": merged,
        "timestamp": now_iso(),
    })
    print(f"  COMPLETE: {confirmed} confirmed, {rejected} rejected, {merged} merged")
    return True


def main() -> int:
    p = argparse.ArgumentParser(description="CEU reconciliation operator actions")
    p.add_argument("--client", required=True)
    p.add_argument("--run-id", required=True)
    p.add_argument("--action", required=True, choices=sorted(VALID_ACTIONS))
    p.add_argument("--target", help="CEU ID to act on")
    p.add_argument("--merge-into", help="CEU ID to merge into (for merge action)")
    p.add_argument("--operator", help="Operator identity (required for mutations)")
    p.add_argument("--rationale", help="Review rationale (required for dispositions)")
    args = p.parse_args()

    paths = resolve_paths(args.client, args.run_id)
    rs_path = paths["reconciliation_state"]

    if not rs_path.exists():
        print(f"FAIL: reconciliation_state.json not found")
        return 1

    state = load_json(rs_path)

    if args.action == "status":
        print_status(state)
        return 0

    if not args.operator:
        print("FAIL: --operator required for mutations")
        return 1

    if args.action in ("confirm", "reject", "merge") and not args.target:
        print(f"FAIL: --target required for {args.action}")
        return 1

    if args.action in ("confirm", "reject", "merge") and not args.rationale:
        print(f"FAIL: --rationale required for {args.action}")
        return 1

    if state.get("reconciliation_status") == "COMPLETE":
        print("FAIL: reconciliation already COMPLETE — no further actions allowed")
        return 1

    event_log = paths["event_log"]

    if args.action == "confirm":
        ok = do_confirm(state, args.target, args.operator, args.rationale, event_log)
    elif args.action == "reject":
        ok = do_reject(state, args.target, args.operator, args.rationale, event_log)
    elif args.action == "merge":
        if not args.merge_into:
            print("FAIL: --merge-into required for merge action")
            return 1
        ok = do_merge(state, args.target, args.merge_into, args.operator, args.rationale, event_log)
    elif args.action == "complete":
        ok = do_complete(state, args.operator, event_log)
    else:
        print(f"FAIL: unknown action {args.action}")
        return 1

    if ok:
        save_json(rs_path, state)
        print(f"  reconciliation_state.json updated")

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
