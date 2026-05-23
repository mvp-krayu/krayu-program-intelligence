#!/usr/bin/env python3
"""
proposition_review_action.py
Contract: PI.SQO.PROPOSITION-REVIEW-WORKFLOW.01

Operator CLI for semantic proposition review. Issues dispositions on
SPE-derived propositions. Non-automatable governance gate.

Actions:
  accept          — Accept proposition into validated corpus
  reject          — Reject proposition (structurally invalid)
  contest         — Dispute proposition (requires additional evidence)
  arbitrate       — Resolve contested proposition (higher authority)
  accept-unflagged — Batch accept all propositions not flagged in review queue
  complete        — Finalize review (all propositions must have dispositions)
  status          — Print current review state (read-only)

Usage:
    python3 scripts/pios/proposition_review_action.py \
        --client blueedge \
        --run-id run_blueedge_genesis_e2e_03 \
        --action accept --target SP-blueedge-0001 \
        --operator operator:khorrix \
        --rationale "Domain proposition structurally grounded"

RULE: Operator identity required for all mutations.
RULE: Rationale required for individual dispositions.
RULE: Append-only event log.
RULE: COMPLETE requires all propositions resolved.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.SQO.PROPOSITION-REVIEW-WORKFLOW.01"

VALID_ACTIONS = {"accept", "reject", "contest", "arbitrate", "accept-unflagged", "complete", "status"}
TERMINAL_DISPOSITIONS = {"ACCEPTED", "REJECTED", "ARBITRATED"}


def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def append_event(path: Path, event: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def resolve_paths(client: str, run_id: str) -> dict:
    spe_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id / "semantic" / "spe"
    return {
        "propositions": spe_dir / "semantic_propositions.json",
        "review_queue": spe_dir / "review_queue.json",
        "review_state": spe_dir / "proposition_review_state.json",
        "event_log": spe_dir / "proposition_review_event_log.jsonl",
    }


def load_or_init_review_state(paths: dict) -> dict:
    if paths["review_state"].exists():
        return load_json(paths["review_state"])

    props_path = paths["propositions"]
    if not props_path.exists():
        return None

    props = load_json(props_path)
    prop_list = props.get("propositions", [])

    flagged_ids = set()
    if paths["review_queue"].exists():
        rq = load_json(paths["review_queue"])
        for item in rq.get("items", []):
            flagged_ids.add(item.get("proposition_id"))

    dispositions = {}
    for p in prop_list:
        pid = p.get("proposition_id", p.get("id"))
        dispositions[pid] = {
            "disposition": None,
            "flagged": pid in flagged_ids,
            "derivation_class": p.get("derivation_class", "UNKNOWN"),
            "derivation_tier": p.get("derivation_tier", "UNKNOWN"),
            "confidence": p.get("confidence", 0),
        }

    return {
        "contract_id": CONTRACT_ID,
        "status": "NOT_STARTED",
        "total_propositions": len(prop_list),
        "flagged_count": len(flagged_ids),
        "dispositions": dispositions,
        "generated_at": now_iso(),
    }


def print_status(state: dict) -> None:
    status = state.get("status", "UNKNOWN")
    total = state.get("total_propositions", 0)
    dispositions = state.get("dispositions", {})
    counts = {}
    for d in dispositions.values():
        disp = d.get("disposition") or "PENDING"
        counts[disp] = counts.get(disp, 0) + 1

    print(f"  Review status: {status}")
    print(f"  Total propositions: {total}")
    print(f"  Flagged: {state.get('flagged_count', 0)}")
    for disp, count in sorted(counts.items()):
        print(f"    {disp}: {count}")


def do_disposition(state: dict, target: str, disposition: str, operator: str, rationale: str, event_log: Path) -> bool:
    dispositions = state.get("dispositions", {})
    if target not in dispositions:
        print(f"  FAIL: {target} not found in propositions")
        return False
    entry = dispositions[target]
    if entry.get("disposition") in TERMINAL_DISPOSITIONS:
        print(f"  FAIL: {target} already has terminal disposition: {entry['disposition']}")
        return False

    entry["disposition"] = disposition
    entry["reviewed_at"] = now_iso()
    entry["reviewed_by"] = operator
    entry["rationale"] = rationale
    state["status"] = "IN_REVIEW"

    append_event(event_log, {
        "event_type": f"proposition_{disposition.lower()}",
        "proposition_id": target,
        "disposition": disposition,
        "operator": operator,
        "rationale": rationale,
        "timestamp": now_iso(),
    })
    print(f"  {disposition}: {target}")
    return True


def do_accept_unflagged(state: dict, operator: str, event_log: Path) -> bool:
    dispositions = state.get("dispositions", {})
    count = 0
    for pid, entry in dispositions.items():
        if entry.get("disposition") is not None:
            continue
        if entry.get("flagged"):
            continue
        entry["disposition"] = "ACCEPTED"
        entry["reviewed_at"] = now_iso()
        entry["reviewed_by"] = operator
        entry["rationale"] = "Batch accepted — not flagged in review queue"
        count += 1

        append_event(event_log, {
            "event_type": "proposition_accepted",
            "proposition_id": pid,
            "disposition": "ACCEPTED",
            "operator": operator,
            "rationale": "Batch accepted — not flagged in review queue",
            "batch": True,
            "timestamp": now_iso(),
        })

    state["status"] = "IN_REVIEW"
    print(f"  BATCH ACCEPTED: {count} unflagged propositions")
    return True


def do_complete(state: dict, operator: str, event_log: Path) -> bool:
    dispositions = state.get("dispositions", {})
    pending = [pid for pid, d in dispositions.items() if d.get("disposition") is None]
    if pending:
        print(f"  FAIL: {len(pending)} propositions without dispositions")
        for pid in pending[:5]:
            print(f"    {pid}")
        if len(pending) > 5:
            print(f"    ... and {len(pending) - 5} more")
        return False

    accepted = sum(1 for d in dispositions.values() if d.get("disposition") == "ACCEPTED")
    rejected = sum(1 for d in dispositions.values() if d.get("disposition") == "REJECTED")
    contested = sum(1 for d in dispositions.values() if d.get("disposition") == "CONTESTED")
    arbitrated = sum(1 for d in dispositions.values() if d.get("disposition") == "ARBITRATED")

    state["status"] = "COMPLETE"
    state["completed_at"] = now_iso()
    state["completed_by"] = operator
    state["summary"] = {
        "accepted": accepted,
        "rejected": rejected,
        "contested": contested,
        "arbitrated": arbitrated,
    }

    append_event(event_log, {
        "event_type": "review_completed",
        "operator": operator,
        "accepted": accepted,
        "rejected": rejected,
        "contested": contested,
        "arbitrated": arbitrated,
        "timestamp": now_iso(),
    })
    print(f"  COMPLETE: {accepted} accepted, {rejected} rejected, {contested} contested, {arbitrated} arbitrated")
    return True


def main() -> int:
    p = argparse.ArgumentParser(description="Proposition review operator actions")
    p.add_argument("--client", required=True)
    p.add_argument("--run-id", required=True)
    p.add_argument("--action", required=True, choices=sorted(VALID_ACTIONS))
    p.add_argument("--target", help="Proposition ID to act on")
    p.add_argument("--operator", help="Operator identity")
    p.add_argument("--rationale", help="Review rationale")
    args = p.parse_args()

    paths = resolve_paths(args.client, args.run_id)

    if args.action == "status":
        state = load_or_init_review_state(paths)
        if state is None:
            print("  No propositions found — SPE not yet run")
            return 0
        print_status(state)
        return 0

    if not args.operator:
        print("FAIL: --operator required for mutations")
        return 1

    state = load_or_init_review_state(paths)
    if state is None:
        print("FAIL: semantic_propositions.json not found — run SPE first")
        return 1

    if state.get("status") == "COMPLETE":
        print("FAIL: review already COMPLETE")
        return 1

    event_log = paths["event_log"]

    if args.action in ("accept", "reject", "contest", "arbitrate"):
        if not args.target:
            print(f"FAIL: --target required for {args.action}")
            return 1
        if not args.rationale:
            print(f"FAIL: --rationale required for {args.action}")
            return 1
        disposition = args.action.upper()
        if args.action == "contest":
            disposition = "CONTESTED"
        elif args.action == "arbitrate":
            disposition = "ARBITRATED"
        ok = do_disposition(state, args.target, disposition, args.operator, args.rationale, event_log)
    elif args.action == "accept-unflagged":
        ok = do_accept_unflagged(state, args.operator, event_log)
    elif args.action == "complete":
        ok = do_complete(state, args.operator, event_log)
    else:
        print(f"FAIL: unknown action {args.action}")
        return 1

    if ok:
        save_json(paths["review_state"], state)
        print(f"  proposition_review_state.json updated")

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
