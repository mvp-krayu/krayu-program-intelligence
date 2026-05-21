#!/usr/bin/env python3
"""
learning_lifecycle.py
Contract: PI.GOVERNANCE.LEARNING-CONSUMPTION-ARCHITECTURE.01

Governed learning event lifecycle state machine.

States: PROPOSED → REVIEWED → PROMOTED → CONSUMABLE → SUPERSEDED
                 ↘ REJECTED

Every transition is governed: actor_id, justification, timestamp, evidence_refs.
Transitions are append-only to the event's transition_log.
Invalid transitions → fail closed.
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

VALID_TRANSITIONS = {
    "PROPOSED": ["REVIEWED", "REJECTED"],
    "REVIEWED": ["PROMOTED", "REJECTED"],
    "PROMOTED": ["CONSUMABLE", "SUPERSEDED"],
    "CONSUMABLE": ["SUPERSEDED"],
    "SUPERSEDED": [],
    "REJECTED": [],
}

LIFECYCLE_STATES = list(VALID_TRANSITIONS.keys())

CONSUMPTION_ELIGIBLE_STATES = {"CONSUMABLE"}

TERMINAL_STATES = {"SUPERSEDED", "REJECTED"}


class LifecycleViolation(Exception):
    pass


def validate_transition(current_state: str, target_state: str) -> bool:
    if current_state not in VALID_TRANSITIONS:
        raise LifecycleViolation(f"Unknown state: {current_state}")
    if target_state not in VALID_TRANSITIONS:
        raise LifecycleViolation(f"Unknown target state: {target_state}")
    return target_state in VALID_TRANSITIONS[current_state]


def transition_event(
    event: dict,
    target_state: str,
    actor_id: str,
    justification: str,
    evidence_refs: Optional[list] = None,
) -> dict:
    current_state = event.get("lifecycle_state")
    if not validate_transition(current_state, target_state):
        raise LifecycleViolation(
            f"Invalid transition: {current_state} → {target_state} "
            f"(allowed: {VALID_TRANSITIONS.get(current_state, [])})"
        )

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    transition_record = {
        "from_state": current_state,
        "to_state": target_state,
        "actor_id": actor_id,
        "justification": justification,
        "timestamp": now,
    }
    if evidence_refs:
        transition_record["evidence_refs"] = evidence_refs

    if "transition_log" not in event:
        event["transition_log"] = []
    event["transition_log"].append(transition_record)

    event["lifecycle_state"] = target_state
    event["last_transition"] = now
    event["last_actor"] = actor_id

    return event


def is_consumable(event: dict) -> bool:
    return event.get("lifecycle_state") in CONSUMPTION_ELIGIBLE_STATES


def is_terminal(event: dict) -> bool:
    return event.get("lifecycle_state") in TERMINAL_STATES


def load_learning_events(path: Path) -> list:
    events = []
    if not path.exists():
        return events
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                events.append(json.loads(line))
    return events


def save_learning_events(path: Path, events: list):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        for event in events:
            f.write(json.dumps(event, separators=(",", ":")) + "\n")


def summarize_lifecycle(events: list) -> dict:
    summary = {state: 0 for state in LIFECYCLE_STATES}
    for event in events:
        state = event.get("lifecycle_state", "UNKNOWN")
        if state in summary:
            summary[state] += 1
    summary["total"] = len(events)
    return summary
