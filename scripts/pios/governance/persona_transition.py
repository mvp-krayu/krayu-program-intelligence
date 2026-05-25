#!/usr/bin/env python3
"""
Persona transition protocol for governed PI runtime.

Formal definition of what resets, what persists, and what carries across
persona transitions. Extends session_lifecycle.py (P2) with per-persona
state contracts and depth entry semantics.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P3)
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


PERSONA_CONTRACTS = {
    "EXECUTIVE": {
        "authority_ceiling": "L3",
        "default_depth": "Z1",
        "allowed_depths": ["Z1", "Z2"],
        "cognitive_mode": "executive_understanding",
        "projection_type": "BOARDROOM",
        "interpretive_authority": True,
        "structural_access": "summary",
        "state_on_entry": {
            "depth_level": "Z1",
            "disclosure_state": "collapsed",
            "active_query": None,
            "interrogation_trail": [],
        },
        "carries_from_previous": [
            "spine_snapshot",
            "governance_state",
            "session_context",
        ],
        "resets_on_entry": [
            "active_query",
            "interrogation_trail",
            "depth_level",
            "disclosure_state",
            "navigation_stack",
        ],
    },
    "BALANCED": {
        "authority_ceiling": "L3",
        "default_depth": "Z1",
        "allowed_depths": ["Z1", "Z2", "Z3"],
        "cognitive_mode": "governed_narrative_interaction",
        "projection_type": "BALANCED",
        "interpretive_authority": True,
        "structural_access": "narrative_with_evidence",
        "state_on_entry": {
            "depth_level": "Z1",
            "disclosure_state": "collapsed",
            "active_query": None,
            "interrogation_trail": [],
        },
        "carries_from_previous": [
            "spine_snapshot",
            "governance_state",
            "session_context",
            "query_history",
        ],
        "resets_on_entry": [
            "active_query",
            "interrogation_trail",
            "depth_level",
            "disclosure_state",
            "navigation_stack",
        ],
    },
    "INVESTIGATION": {
        "authority_ceiling": "L2",
        "default_depth": "Z2",
        "allowed_depths": ["Z1", "Z2", "Z3", "Z4"],
        "cognitive_mode": "structural_investigation",
        "projection_type": "INVESTIGATION",
        "interpretive_authority": False,
        "structural_access": "full_structural",
        "state_on_entry": {
            "depth_level": "Z2",
            "disclosure_state": "expanded",
            "active_query": None,
            "interrogation_trail": [],
        },
        "carries_from_previous": [
            "spine_snapshot",
            "governance_state",
            "session_context",
            "investigation_targets",
        ],
        "resets_on_entry": [
            "active_query",
            "interrogation_trail",
            "depth_level",
            "disclosure_state",
            "navigation_stack",
        ],
    },
    "DENSE": {
        "authority_ceiling": "L1",
        "default_depth": "Z3",
        "allowed_depths": ["Z2", "Z3", "Z4", "Z5"],
        "cognitive_mode": "operational_substrate",
        "projection_type": "DENSE",
        "interpretive_authority": False,
        "structural_access": "raw_substrate",
        "state_on_entry": {
            "depth_level": "Z3",
            "disclosure_state": "expanded",
            "active_query": None,
            "interrogation_trail": [],
        },
        "carries_from_previous": [
            "spine_snapshot",
            "governance_state",
            "session_context",
        ],
        "resets_on_entry": [
            "active_query",
            "interrogation_trail",
            "depth_level",
            "disclosure_state",
            "navigation_stack",
        ],
    },
}


def get_persona_contract(persona: str) -> Optional[dict]:
    return PERSONA_CONTRACTS.get(persona)


def validate_transition(
    from_persona: Optional[str],
    to_persona: str,
    current_depth: str = "Z1",
) -> dict:
    """Validate a persona transition and compute the resulting state."""
    if to_persona not in PERSONA_CONTRACTS:
        return {
            "valid": False,
            "error": f"Unknown persona: {to_persona}",
        }

    target = PERSONA_CONTRACTS[to_persona]
    from_contract = PERSONA_CONTRACTS.get(from_persona) if from_persona else None

    carried_state = {}
    if from_contract:
        for field in target["carries_from_previous"]:
            carried_state[field] = f"CARRIED_FROM_{from_persona}"

    new_depth = target["default_depth"]
    if current_depth in target["allowed_depths"]:
        new_depth = current_depth

    return {
        "valid": True,
        "from_persona": from_persona,
        "to_persona": to_persona,
        "new_depth": new_depth,
        "authority_ceiling": target["authority_ceiling"],
        "cognitive_mode": target["cognitive_mode"],
        "interpretive_authority": target["interpretive_authority"],
        "reset_fields": target["resets_on_entry"],
        "carried_fields": list(carried_state.keys()),
        "entry_state": target["state_on_entry"],
    }


def validate_depth_access(persona: str, target_depth: str) -> dict:
    """Check if a persona can access a specific depth level."""
    contract = PERSONA_CONTRACTS.get(persona)
    if not contract:
        return {"allowed": False, "error": f"Unknown persona: {persona}"}

    allowed = target_depth in contract["allowed_depths"]
    return {
        "allowed": allowed,
        "persona": persona,
        "target_depth": target_depth,
        "allowed_depths": contract["allowed_depths"],
        "reason": (
            f"{persona} can access {target_depth}"
            if allowed
            else f"{persona} cannot access {target_depth} — allowed: {contract['allowed_depths']}"
        ),
    }


def get_transition_matrix() -> dict:
    """Return the full persona transition matrix."""
    personas = list(PERSONA_CONTRACTS.keys())
    matrix = {}
    for from_p in [None] + personas:
        for to_p in personas:
            key = f"{from_p or 'NONE'}→{to_p}"
            result = validate_transition(from_p, to_p)
            matrix[key] = {
                "valid": result["valid"],
                "new_depth": result.get("new_depth"),
                "authority_ceiling": result.get("authority_ceiling"),
                "reset_count": len(result.get("reset_fields", [])),
                "carry_count": len(result.get("carried_fields", [])),
            }
    return matrix


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Persona transition protocol"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    contract_parser = subparsers.add_parser("contract", help="Show persona contract")
    contract_parser.add_argument("persona", choices=list(PERSONA_CONTRACTS.keys()))

    transition_parser = subparsers.add_parser("transition", help="Validate transition")
    transition_parser.add_argument("--from", dest="from_persona", help="Source persona")
    transition_parser.add_argument("--to", required=True, help="Target persona")

    depth_parser = subparsers.add_parser("depth", help="Check depth access")
    depth_parser.add_argument("persona", choices=list(PERSONA_CONTRACTS.keys()))
    depth_parser.add_argument("depth", help="Target depth (Z1-Z5)")

    matrix_parser = subparsers.add_parser("matrix", help="Show transition matrix")

    args = parser.parse_args()

    if args.command == "contract":
        contract = PERSONA_CONTRACTS[args.persona]
        print(f"{args.persona}:")
        print(f"  Authority ceiling: {contract['authority_ceiling']}")
        print(f"  Default depth: {contract['default_depth']}")
        print(f"  Allowed depths: {contract['allowed_depths']}")
        print(f"  Cognitive mode: {contract['cognitive_mode']}")
        print(f"  Interpretive: {contract['interpretive_authority']}")
        print(f"  Structural access: {contract['structural_access']}")
        print(f"  Resets: {contract['resets_on_entry']}")
        print(f"  Carries: {contract['carries_from_previous']}")

    elif args.command == "transition":
        result = validate_transition(args.from_persona, args.to)
        if result["valid"]:
            print(f"VALID: {args.from_persona or 'NONE'}→{args.to}")
            print(f"  New depth: {result['new_depth']}")
            print(f"  Authority: {result['authority_ceiling']}")
            print(f"  Resets: {len(result['reset_fields'])} fields")
            print(f"  Carries: {len(result['carried_fields'])} fields")
        else:
            print(f"INVALID: {result.get('error')}")

    elif args.command == "depth":
        result = validate_depth_access(args.persona, args.depth)
        print(f"{'ALLOWED' if result['allowed'] else 'DENIED'}: {result['reason']}")

    elif args.command == "matrix":
        matrix = get_transition_matrix()
        for key, val in sorted(matrix.items()):
            print(f"  {key}: depth={val['new_depth']} auth={val['authority_ceiling']} reset={val['reset_count']} carry={val['carry_count']}")


if __name__ == "__main__":
    main()
