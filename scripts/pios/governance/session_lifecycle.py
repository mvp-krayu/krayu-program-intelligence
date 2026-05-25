#!/usr/bin/env python3
"""
Session lifecycle manager for governed PI runtime.

Centralized authority/state management for LENS sessions. Tracks persona
transitions, authority escalations, session boundaries, and what state
resets vs persists across transitions.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P2)
"""

from __future__ import annotations

import argparse
import json
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent

PERSONAS = frozenset({
    "EXECUTIVE", "BALANCED", "INVESTIGATION", "DENSE",
})

AUTHORITY_TIERS = {
    "L0": 0,  # Raw Evidence
    "L1": 1,  # Structural Derivation
    "L2": 2,  # Semantic Derivation
    "L3": 3,  # Bounded Interpretation (AI ceiling)
    "L4": 4,  # Operator Judgment
    "L5": 5,  # Governance Authority
}

PERSONA_MAX_AUTHORITY = {
    "EXECUTIVE": "L3",
    "BALANCED": "L3",
    "INVESTIGATION": "L2",
    "DENSE": "L1",
}

RESETS_ON_TRANSITION = frozenset({
    "active_query",
    "interrogation_trail",
    "depth_level",
    "disclosure_state",
})

PERSISTS_ON_TRANSITION = frozenset({
    "session_id",
    "client",
    "run_id",
    "authority_ceiling",
    "governance_state",
    "spine_snapshot",
})


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class SessionState:
    """Represents the lifecycle state of a governed LENS session."""

    def __init__(self, client: str, run_id: str, operator: str = "system"):
        self.session_id = str(uuid.uuid4())
        self.client = client
        self.run_id = run_id
        self.operator = operator
        self.created_at = _now()
        self.current_persona = None
        self.authority_ceiling = "L3"
        self.effective_authority = "L0"
        self.depth_level = "Z1"
        self.transitions = []
        self.escalations = []
        self.active = True

    def activate_persona(self, persona: str) -> dict:
        """Activate a persona, resetting session-scoped state."""
        if persona not in PERSONAS:
            raise ValueError(f"Unknown persona: {persona}")

        prev = self.current_persona
        event = {
            "event_type": "PERSONA_TRANSITION",
            "timestamp": _now(),
            "from_persona": prev,
            "to_persona": persona,
            "reset_fields": list(RESETS_ON_TRANSITION),
            "persisted_fields": list(PERSISTS_ON_TRANSITION),
            "authority_before": self.effective_authority,
        }

        self.current_persona = persona
        self.depth_level = "Z1"

        max_auth = PERSONA_MAX_AUTHORITY.get(persona, "L3")
        max_order = AUTHORITY_TIERS.get(max_auth, 3)
        current_order = AUTHORITY_TIERS.get(self.effective_authority, 0)
        if current_order > max_order:
            self.effective_authority = max_auth
            event["authority_capped"] = True
            event["capped_to"] = max_auth
        else:
            event["authority_capped"] = False

        event["authority_after"] = self.effective_authority
        self.transitions.append(event)
        return event

    def escalate_authority(self, target_tier: str, reason: str) -> dict:
        """Request authority escalation within session."""
        if target_tier not in AUTHORITY_TIERS:
            raise ValueError(f"Unknown authority tier: {target_tier}")

        target_order = AUTHORITY_TIERS[target_tier]
        current_order = AUTHORITY_TIERS.get(self.effective_authority, 0)
        ceiling_order = AUTHORITY_TIERS.get(self.authority_ceiling, 3)

        event = {
            "event_type": "AUTHORITY_ESCALATION",
            "timestamp": _now(),
            "from_tier": self.effective_authority,
            "to_tier": target_tier,
            "reason": reason,
            "persona": self.current_persona,
            "session_id": self.session_id,
        }

        if target_order > ceiling_order:
            event["result"] = "REJECTED"
            event["rejection_reason"] = f"Target {target_tier} exceeds session ceiling {self.authority_ceiling}"
        elif target_order <= current_order:
            event["result"] = "REDUNDANT"
            event["note"] = f"Already at {self.effective_authority} (>= {target_tier})"
        else:
            persona_max = PERSONA_MAX_AUTHORITY.get(self.current_persona, "L3")
            persona_max_order = AUTHORITY_TIERS.get(persona_max, 3)
            if target_order > persona_max_order:
                event["result"] = "REJECTED"
                event["rejection_reason"] = f"Persona {self.current_persona} max authority is {persona_max}"
            else:
                self.effective_authority = target_tier
                event["result"] = "GRANTED"

        self.escalations.append(event)
        return event

    def close_session(self) -> dict:
        """Close the session, recording final state."""
        self.active = False
        return {
            "event_type": "SESSION_CLOSED",
            "timestamp": _now(),
            "session_id": self.session_id,
            "final_persona": self.current_persona,
            "final_authority": self.effective_authority,
            "total_transitions": len(self.transitions),
            "total_escalations": len(self.escalations),
            "escalations_granted": sum(1 for e in self.escalations if e.get("result") == "GRANTED"),
            "escalations_rejected": sum(1 for e in self.escalations if e.get("result") == "REJECTED"),
        }

    def to_dict(self) -> dict:
        return {
            "session_id": self.session_id,
            "client": self.client,
            "run_id": self.run_id,
            "operator": self.operator,
            "created_at": self.created_at,
            "active": self.active,
            "current_persona": self.current_persona,
            "authority_ceiling": self.authority_ceiling,
            "effective_authority": self.effective_authority,
            "depth_level": self.depth_level,
            "transitions": self.transitions,
            "escalations": self.escalations,
        }


def save_session(session: SessionState, run_dir: Path):
    """Persist session state to run directory."""
    session_dir = run_dir / "governance" / "sessions"
    session_dir.mkdir(parents=True, exist_ok=True)
    path = session_dir / f"session_{session.session_id[:8]}.json"
    with open(path, "w") as f:
        json.dump(session.to_dict(), f, indent=2)
    return path


def load_session(session_path: Path) -> SessionState:
    """Load a session from disk."""
    with open(session_path) as f:
        data = json.load(f)
    session = SessionState(data["client"], data["run_id"], data.get("operator", "system"))
    session.session_id = data["session_id"]
    session.created_at = data["created_at"]
    session.active = data["active"]
    session.current_persona = data.get("current_persona")
    session.authority_ceiling = data.get("authority_ceiling", "L3")
    session.effective_authority = data.get("effective_authority", "L0")
    session.depth_level = data.get("depth_level", "Z1")
    session.transitions = data.get("transitions", [])
    session.escalations = data.get("escalations", [])
    return session


def main():
    parser = argparse.ArgumentParser(
        description="Session lifecycle manager"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    create_parser = subparsers.add_parser("create", help="Create new session")
    create_parser.add_argument("--client", required=True)
    create_parser.add_argument("--run-id", required=True)
    create_parser.add_argument("--operator", default="system")

    info_parser = subparsers.add_parser("info", help="Show session info")
    info_parser.add_argument("session_file", help="Path to session JSON")

    list_parser = subparsers.add_parser("list", help="List sessions for a run")
    list_parser.add_argument("run_dir", help="Path to run directory")

    args = parser.parse_args()

    if args.command == "create":
        run_dir = REPO_ROOT / "clients" / args.client / "psee" / "runs" / args.run_id
        session = SessionState(args.client, args.run_id, args.operator)
        path = save_session(session, run_dir)
        print(f"Session created: {session.session_id[:8]}")
        print(f"  Written to: {path}")

    elif args.command == "info":
        session = load_session(Path(args.session_file))
        print(f"Session: {session.session_id[:8]}")
        print(f"  Client: {session.client}")
        print(f"  Run: {session.run_id}")
        print(f"  Active: {session.active}")
        print(f"  Persona: {session.current_persona}")
        print(f"  Authority: {session.effective_authority} (ceiling: {session.authority_ceiling})")
        print(f"  Transitions: {len(session.transitions)}")
        print(f"  Escalations: {len(session.escalations)}")

    elif args.command == "list":
        session_dir = Path(args.run_dir) / "governance" / "sessions"
        if not session_dir.exists():
            print("No sessions found")
            return
        for f in sorted(session_dir.glob("session_*.json")):
            session = load_session(f)
            status = "ACTIVE" if session.active else "CLOSED"
            print(f"  {session.session_id[:8]} [{status}] persona={session.current_persona} auth={session.effective_authority}")


if __name__ == "__main__":
    main()
