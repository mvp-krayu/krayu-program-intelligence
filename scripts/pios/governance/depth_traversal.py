#!/usr/bin/env python3
"""
Depth traversal contract for governed PI runtime.

Formal Z1-Z5 depth semantics per persona with defined entry/exit behavior.
Governs what content is visible, what structural access is permitted, and
how depth transitions maintain cognitive context.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P3)
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

DEPTH_LEVELS = {
    "Z1": {
        "name": "EXECUTIVE_UNDERSTANDING",
        "description": "What does this mean? Why does it matter?",
        "content_type": "narrative_summary",
        "structural_detail": "none",
        "evidence_visibility": "conclusions_only",
        "governance_visibility": "status_only",
        "authority_required": "L0",
    },
    "Z2": {
        "name": "SEMANTIC_INTERPRETATION",
        "description": "What claims stabilized? What was disputed?",
        "content_type": "semantic_claims",
        "structural_detail": "proposition_level",
        "evidence_visibility": "proposition_summaries",
        "governance_visibility": "disposition_summary",
        "authority_required": "L1",
    },
    "Z3": {
        "name": "GOVERNANCE_DETAIL",
        "description": "Who reviewed? What was contested? What was rejected?",
        "content_type": "governance_events",
        "structural_detail": "event_level",
        "evidence_visibility": "event_log_entries",
        "governance_visibility": "full_event_log",
        "authority_required": "L1",
    },
    "Z4": {
        "name": "STRUCTURAL_PROOF",
        "description": "Which spine objects? What confidence? What evidence anchors?",
        "content_type": "spine_objects",
        "structural_detail": "object_level",
        "evidence_visibility": "spine_references",
        "governance_visibility": "proof_capsules",
        "authority_required": "L1",
    },
    "Z5": {
        "name": "RAW_EVIDENCE",
        "description": "The intake files. The substrate. The source.",
        "content_type": "raw_artifacts",
        "structural_detail": "file_level",
        "evidence_visibility": "raw_files",
        "governance_visibility": "full_lineage",
        "authority_required": "L0",
    },
}

DEPTH_ORDER = {"Z1": 1, "Z2": 2, "Z3": 3, "Z4": 4, "Z5": 5}

PERSONA_DEPTH_RULES = {
    "EXECUTIVE": {
        "allowed": ["Z1", "Z2"],
        "default_entry": "Z1",
        "max_depth": "Z2",
        "descent_behavior": "disclosure_expand",
        "ascent_behavior": "disclosure_collapse",
    },
    "BALANCED": {
        "allowed": ["Z1", "Z2", "Z3"],
        "default_entry": "Z1",
        "max_depth": "Z3",
        "descent_behavior": "disclosure_expand",
        "ascent_behavior": "disclosure_collapse",
    },
    "INVESTIGATION": {
        "allowed": ["Z1", "Z2", "Z3", "Z4"],
        "default_entry": "Z2",
        "max_depth": "Z4",
        "descent_behavior": "panel_split",
        "ascent_behavior": "panel_merge",
    },
    "DENSE": {
        "allowed": ["Z2", "Z3", "Z4", "Z5"],
        "default_entry": "Z3",
        "max_depth": "Z5",
        "descent_behavior": "inline_expand",
        "ascent_behavior": "inline_collapse",
    },
}


class DepthViolation(Exception):
    pass


def validate_depth_transition(
    persona: str,
    current_depth: str,
    target_depth: str,
) -> dict:
    """Validate a depth transition for a given persona."""
    rules = PERSONA_DEPTH_RULES.get(persona)
    if not rules:
        return {"valid": False, "error": f"Unknown persona: {persona}"}

    if target_depth not in DEPTH_ORDER:
        return {"valid": False, "error": f"Unknown depth level: {target_depth}"}

    if target_depth not in rules["allowed"]:
        return {
            "valid": False,
            "error": f"{persona} cannot access {target_depth} — allowed: {rules['allowed']}",
            "persona": persona,
            "current": current_depth,
            "target": target_depth,
        }

    current_order = DEPTH_ORDER.get(current_depth, 1)
    target_order = DEPTH_ORDER.get(target_depth, 1)

    if target_order > current_order:
        direction = "DESCENT"
        behavior = rules["descent_behavior"]
    elif target_order < current_order:
        direction = "ASCENT"
        behavior = rules["ascent_behavior"]
    else:
        direction = "SAME"
        behavior = "none"

    return {
        "valid": True,
        "persona": persona,
        "current": current_depth,
        "target": target_depth,
        "direction": direction,
        "behavior": behavior,
        "target_content": DEPTH_LEVELS[target_depth]["content_type"],
        "target_detail": DEPTH_LEVELS[target_depth]["structural_detail"],
    }


def assert_depth_legal(persona: str, target_depth: str):
    """Assert a depth access is legal. Raises DepthViolation if not."""
    rules = PERSONA_DEPTH_RULES.get(persona)
    if not rules:
        raise DepthViolation(f"Unknown persona: {persona}")
    if target_depth not in rules["allowed"]:
        raise DepthViolation(
            f"Depth {target_depth} not accessible from {persona} — "
            f"allowed: {rules['allowed']}"
        )


def get_depth_context(depth: str) -> dict:
    """Return the content contract for a depth level."""
    level = DEPTH_LEVELS.get(depth)
    if not level:
        return {"error": f"Unknown depth: {depth}"}
    return {
        "depth": depth,
        **level,
    }


def compute_traversal_path(
    persona: str,
    from_depth: str,
    to_depth: str,
) -> list:
    """Compute the ordered traversal path between two depths."""
    rules = PERSONA_DEPTH_RULES.get(persona)
    if not rules:
        return []

    from_order = DEPTH_ORDER.get(from_depth, 1)
    to_order = DEPTH_ORDER.get(to_depth, 1)

    if from_order == to_order:
        return [from_depth]

    step = 1 if to_order > from_order else -1
    depth_by_order = {v: k for k, v in DEPTH_ORDER.items()}

    path = []
    for order in range(from_order, to_order + step, step):
        depth = depth_by_order.get(order)
        if depth and depth in rules["allowed"]:
            path.append(depth)

    return path


def get_persona_depth_contract(persona: str) -> Optional[dict]:
    """Return the full depth contract for a persona."""
    rules = PERSONA_DEPTH_RULES.get(persona)
    if not rules:
        return None

    depth_details = []
    for depth in rules["allowed"]:
        level = DEPTH_LEVELS[depth]
        depth_details.append({
            "depth": depth,
            "name": level["name"],
            "content_type": level["content_type"],
            "structural_detail": level["structural_detail"],
            "evidence_visibility": level["evidence_visibility"],
        })

    return {
        "persona": persona,
        "default_entry": rules["default_entry"],
        "max_depth": rules["max_depth"],
        "descent_behavior": rules["descent_behavior"],
        "ascent_behavior": rules["ascent_behavior"],
        "depth_levels": depth_details,
    }


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Depth traversal contract"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    levels_parser = subparsers.add_parser("levels", help="Show all depth levels")

    contract_parser = subparsers.add_parser("contract", help="Show persona depth contract")
    contract_parser.add_argument("persona", choices=list(PERSONA_DEPTH_RULES.keys()))

    validate_parser = subparsers.add_parser("validate", help="Validate depth transition")
    validate_parser.add_argument("--persona", required=True, choices=list(PERSONA_DEPTH_RULES.keys()))
    validate_parser.add_argument("--from", dest="from_depth", required=True)
    validate_parser.add_argument("--to", dest="to_depth", required=True)

    path_parser = subparsers.add_parser("path", help="Compute traversal path")
    path_parser.add_argument("--persona", required=True, choices=list(PERSONA_DEPTH_RULES.keys()))
    path_parser.add_argument("--from", dest="from_depth", required=True)
    path_parser.add_argument("--to", dest="to_depth", required=True)

    args = parser.parse_args()

    if args.command == "levels":
        for depth, level in DEPTH_LEVELS.items():
            print(f"  {depth} — {level['name']}: {level['description']}")

    elif args.command == "contract":
        contract = get_persona_depth_contract(args.persona)
        print(f"{args.persona} DEPTH CONTRACT:")
        print(f"  Default entry: {contract['default_entry']}")
        print(f"  Max depth: {contract['max_depth']}")
        print(f"  Descent: {contract['descent_behavior']}")
        print(f"  Ascent: {contract['ascent_behavior']}")
        for d in contract["depth_levels"]:
            print(f"  {d['depth']} {d['name']}: {d['content_type']} ({d['structural_detail']})")

    elif args.command == "validate":
        result = validate_depth_transition(args.persona, args.from_depth, args.to_depth)
        if result["valid"]:
            print(f"VALID: {result['direction']} {args.from_depth}→{args.to_depth} ({result['behavior']})")
        else:
            print(f"INVALID: {result.get('error')}")

    elif args.command == "path":
        path = compute_traversal_path(args.persona, args.from_depth, args.to_depth)
        print(f"Traversal path: {' → '.join(path)}")


if __name__ == "__main__":
    main()
