#!/usr/bin/env python3
"""
Authority escalation log for governed PI runtime.

Persistent, append-only record of all authority tier transitions in
governed sessions. Provides audit trail for who escalated, when, why,
and whether the escalation was granted or rejected.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P2)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent

LOG_FILENAME = "authority_escalation_log.jsonl"


def _log_path(run_dir: Path) -> Path:
    return run_dir / "governance" / LOG_FILENAME


def log_escalation(
    run_dir: Path,
    session_id: str,
    from_tier: str,
    to_tier: str,
    result: str,
    reason: str,
    persona: str = None,
    operator: str = None,
    rejection_reason: str = None,
) -> dict:
    """Append an escalation event to the authority log."""
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "session_id": session_id,
        "from_tier": from_tier,
        "to_tier": to_tier,
        "result": result,
        "reason": reason,
    }
    if persona:
        event["persona"] = persona
    if operator:
        event["operator"] = operator
    if rejection_reason:
        event["rejection_reason"] = rejection_reason

    log_file = _log_path(run_dir)
    log_file.parent.mkdir(parents=True, exist_ok=True)
    with open(log_file, "a") as f:
        f.write(json.dumps(event, separators=(",", ":")) + "\n")

    return event


def read_escalation_log(run_dir: Path) -> list:
    """Read all escalation events from the log."""
    log_file = _log_path(run_dir)
    if not log_file.exists():
        return []

    events = []
    for line in log_file.read_text().strip().split("\n"):
        if line.strip():
            try:
                events.append(json.loads(line))
            except json.JSONDecodeError:
                pass
    return events


def summarize_escalation_log(run_dir: Path) -> dict:
    """Produce summary statistics from the escalation log."""
    events = read_escalation_log(run_dir)

    granted = [e for e in events if e.get("result") == "GRANTED"]
    rejected = [e for e in events if e.get("result") == "REJECTED"]
    redundant = [e for e in events if e.get("result") == "REDUNDANT"]

    sessions = set(e.get("session_id", "") for e in events)

    tier_transitions = {}
    for e in granted:
        key = f"{e.get('from_tier', '?')}→{e.get('to_tier', '?')}"
        tier_transitions[key] = tier_transitions.get(key, 0) + 1

    rejection_reasons = {}
    for e in rejected:
        reason = e.get("rejection_reason", "unknown")
        rejection_reasons[reason] = rejection_reasons.get(reason, 0) + 1

    return {
        "total_events": len(events),
        "granted": len(granted),
        "rejected": len(rejected),
        "redundant": len(redundant),
        "unique_sessions": len(sessions),
        "tier_transitions": tier_transitions,
        "rejection_reasons": rejection_reasons,
    }


def verify_log_integrity(run_dir: Path) -> dict:
    """Verify the escalation log is parseable and chronologically ordered."""
    log_file = _log_path(run_dir)
    if not log_file.exists():
        return {"status": "NO_LOG", "message": "No escalation log found"}

    events = []
    parse_errors = 0
    for i, line in enumerate(log_file.read_text().strip().split("\n")):
        if not line.strip():
            continue
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            parse_errors += 1

    chronological = True
    for i in range(1, len(events)):
        if events[i].get("timestamp", "") < events[i - 1].get("timestamp", ""):
            chronological = False
            break

    return {
        "status": "PASS" if parse_errors == 0 and chronological else "FAIL",
        "total_events": len(events),
        "parse_errors": parse_errors,
        "chronological": chronological,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Authority escalation log"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    read_parser = subparsers.add_parser("read", help="Read escalation log")
    read_parser.add_argument("run_dir", help="Path to run directory")

    summary_parser = subparsers.add_parser("summary", help="Summarize escalation log")
    summary_parser.add_argument("run_dir", help="Path to run directory")

    verify_parser = subparsers.add_parser("verify", help="Verify log integrity")
    verify_parser.add_argument("run_dir", help="Path to run directory")

    args = parser.parse_args()

    if args.command == "read":
        events = read_escalation_log(Path(args.run_dir))
        if not events:
            print("No escalation events recorded")
        else:
            for e in events:
                result = e.get("result", "?")
                print(f"  [{e.get('timestamp', '?')}] {e.get('from_tier')}→{e.get('to_tier')} {result} ({e.get('reason', '')})")

    elif args.command == "summary":
        s = summarize_escalation_log(Path(args.run_dir))
        print(f"Authority Escalation Summary:")
        print(f"  Total events: {s['total_events']}")
        print(f"  Granted: {s['granted']}")
        print(f"  Rejected: {s['rejected']}")
        print(f"  Redundant: {s['redundant']}")
        print(f"  Unique sessions: {s['unique_sessions']}")
        if s["tier_transitions"]:
            print(f"  Transitions:")
            for k, v in s["tier_transitions"].items():
                print(f"    {k}: {v}")

    elif args.command == "verify":
        result = verify_log_integrity(Path(args.run_dir))
        print(f"Log integrity: {result['status']}")
        print(f"  Events: {result['total_events']}")
        print(f"  Parse errors: {result['parse_errors']}")
        print(f"  Chronological: {result['chronological']}")
        sys.exit(0 if result["status"] == "PASS" else 1)


if __name__ == "__main__":
    main()
