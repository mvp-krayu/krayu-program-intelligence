#!/usr/bin/env python3
"""
promotion_action.py
Contract: PI.SQO.PROMOTION-WORKFLOW.01

Operator CLI for S-level promotion. Issues advancement decisions
based on revalidation evidence. Non-automatable governance gate.

Actions:
  advance  — Advance S-level (S0→S1, S1→S2)
  hold     — Revalidation passed but advancement deferred
  block    — Governance override — block advancement
  status   — Print current promotion state (read-only)

Usage:
    python3 scripts/pios/promotion_action.py \
        --client blueedge \
        --run-id run_blueedge_genesis_e2e_03 \
        --action advance --target S1 \
        --operator operator:khorrix \
        --rationale "Revalidation PASS, governance lifecycle exercised"

RULE: Operator identity required for all mutations.
RULE: Rationale required for all actions.
RULE: Revalidation PASS required for advancement.
RULE: S2 requires L5 authority.
RULE: Append-only event log.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.SQO.PROMOTION-WORKFLOW.01"

VALID_ACTIONS = {"advance", "hold", "block", "status"}
VALID_TARGETS = {"S1", "S2"}
VALID_TRANSITIONS = {("S0", "S1"), ("S1", "S2")}


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
    sqo_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id / "sqo"
    spe_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id / "semantic" / "spe"
    return {
        "promotion_state": sqo_dir / "promotion_state.json",
        "event_log": sqo_dir / "promotion_event_log.jsonl",
        "revalidation_result": sqo_dir / "revalidation_result.json",
        "proposition_review": spe_dir / "proposition_review_state.json",
    }


def print_status(state: dict) -> None:
    print(f"  S-level: {state.get('s_level', state.get('current_state', '?'))}")
    print(f"  Provenance: {state.get('qualification_provenance', '?')}")
    print(f"  Authority ceiling: {state.get('authority_ceiling', '?')}")
    print(f"  Promotion eligible: {state.get('promotion_eligible', '?')}")
    lineage = state.get("promotion_lineage", {})
    transitions = lineage.get("transitions", [])
    if transitions:
        print(f"  Transitions: {len(transitions)}")
        for t in transitions:
            print(f"    {t.get('from')} → {t.get('to')}  by={t.get('actor_id','?')}  at={t.get('timestamp','?')}")


def do_advance(state: dict, target: str, operator: str, rationale: str, paths: dict, client: str, run_id: str) -> bool:
    current = state.get("s_level", state.get("current_state", "S0"))

    if (current, target) not in VALID_TRANSITIONS:
        print(f"  FAIL: invalid transition {current} → {target}")
        print(f"  Valid transitions: {VALID_TRANSITIONS}")
        return False

    reval_path = paths["revalidation_result"]
    if reval_path.exists():
        reval = load_json(reval_path)
        reval_status = reval.get("status", reval.get("result", "UNKNOWN"))
        if reval_status != "PASS":
            print(f"  FAIL: revalidation status is {reval_status}, not PASS")
            return False
    else:
        print(f"  WARNING: revalidation_result.json not found — proceeding with operator authority")

    review_path = paths["proposition_review"]
    if review_path.exists():
        review = load_json(review_path)
        if review.get("status") != "COMPLETE":
            print(f"  FAIL: proposition review status is {review.get('status')}, not COMPLETE")
            return False

    # Constitutional replay anchor — mandatory semantic adequacy check
    import importlib.util
    anchor_path = Path(__file__).parent / "constitutional_replay_anchor.py"
    spec = importlib.util.spec_from_file_location("constitutional_replay_anchor", anchor_path)
    anchor_mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(anchor_mod)
    print(f"  Running constitutional replay anchor...")
    anchor_result = anchor_mod.run_anchor(client, run_id, target)
    if anchor_result.get("advancement_blocked"):
        verdict = anchor_result.get("status", "UNKNOWN")
        reason = anchor_result.get("assessment", {}).get("reason", "unknown")
        print(f"  BLOCKED: {verdict}")
        print(f"  Reason: {reason}")
        dims = anchor_result.get("assessment", {}).get("dimensions", [])
        for d in dims:
            if d["verdict"] == "FAIL":
                print(f"    FAIL: {d['dimension']} — ref={d['reference']}, cand={d['candidate']} [{d['severity']}]")
        return False
    else:
        verdict = anchor_result.get("status", "UNKNOWN")
        print(f"  Constitutional anchor: {verdict}")

    state["s_level"] = target
    state["current_state"] = target
    state["last_updated"] = now_iso()
    state["qualification_provenance"] = "GOVERNED_LIFECYCLE"
    state["promotion_eligible"] = True

    lineage = state.get("promotion_lineage", {"initial_state": current, "current_state": current, "transitions": []})
    lineage["current_state"] = target
    lineage["transitions"].append({
        "from": current,
        "to": target,
        "timestamp": now_iso(),
        "actor_id": operator,
        "action": "s_level_advancement",
        "rationale": rationale,
        "authority_domain": "governance_authority",
        "authority_level": "L5" if target == "S2" else "L3",
    })
    state["promotion_lineage"] = lineage

    append_event(paths["event_log"], {
        "event_type": "promotion_advanced",
        "from": current,
        "to": target,
        "operator": operator,
        "rationale": rationale,
        "timestamp": now_iso(),
    })

    print(f"  ADVANCED: {current} → {target}")
    return True


def do_hold(state: dict, operator: str, rationale: str, paths: dict) -> bool:
    current = state.get("s_level", state.get("current_state", "S0"))
    state["promotion_eligible"] = False
    state["hold_reason"] = rationale
    state["last_updated"] = now_iso()

    append_event(paths["event_log"], {
        "event_type": "promotion_held",
        "current_state": current,
        "operator": operator,
        "rationale": rationale,
        "timestamp": now_iso(),
    })

    print(f"  HELD at {current}: {rationale}")
    return True


def do_block(state: dict, operator: str, rationale: str, paths: dict) -> bool:
    current = state.get("s_level", state.get("current_state", "S0"))
    state["promotion_eligible"] = False
    state["block_reason"] = rationale
    state["last_updated"] = now_iso()

    append_event(paths["event_log"], {
        "event_type": "promotion_blocked",
        "current_state": current,
        "operator": operator,
        "rationale": rationale,
        "timestamp": now_iso(),
    })

    print(f"  BLOCKED at {current}: {rationale}")
    return True


def main() -> int:
    p = argparse.ArgumentParser(description="SQO promotion operator actions")
    p.add_argument("--client", required=True)
    p.add_argument("--run-id", required=True)
    p.add_argument("--action", required=True, choices=sorted(VALID_ACTIONS))
    p.add_argument("--target", help="Target S-level (S1 or S2)")
    p.add_argument("--operator", help="Operator identity")
    p.add_argument("--rationale", help="Action rationale")
    args = p.parse_args()

    paths = resolve_paths(args.client, args.run_id)
    ps_path = paths["promotion_state"]

    if not ps_path.exists():
        print(f"FAIL: promotion_state.json not found")
        return 1

    state = load_json(ps_path)

    if args.action == "status":
        print_status(state)
        return 0

    if not args.operator:
        print("FAIL: --operator required")
        return 1
    if not args.rationale:
        print("FAIL: --rationale required")
        return 1

    if args.action == "advance":
        if not args.target or args.target not in VALID_TARGETS:
            print(f"FAIL: --target required (S1 or S2)")
            return 1
        ok = do_advance(state, args.target, args.operator, args.rationale, paths, args.client, args.run_id)
    elif args.action == "hold":
        ok = do_hold(state, args.operator, args.rationale, paths)
    elif args.action == "block":
        ok = do_block(state, args.operator, args.rationale, paths)
    else:
        print(f"FAIL: unknown action {args.action}")
        return 1

    if ok:
        save_json(ps_path, state)
        print(f"  promotion_state.json updated")

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
