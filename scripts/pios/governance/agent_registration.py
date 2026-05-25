#!/usr/bin/env python3
"""
Orchestration agent registration protocol for governed PI runtime.

Formal process for adding new orchestration agents with stratum assignment,
synchronization contracts, and mutation authority declaration.

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

REGISTRY_PATH = REPO_ROOT / "scripts" / "pios" / "governance" / "agent_registry.json"

CANONICAL_AGENTS = {
    "PAYLOAD_RESOLUTION": {
        "stratum": "B",
        "description": "Resolves and normalizes pipeline payloads for projection consumption",
        "mutation_authority": ["NONE"],
        "synchronization": {"requires": [], "provides": ["resolved_payload"]},
        "status": "OPERATIONAL",
    },
    "PERSONA_DISPATCH": {
        "stratum": "B",
        "description": "Routes cognitive requests to appropriate persona projection",
        "mutation_authority": ["NONE"],
        "synchronization": {"requires": ["resolved_payload"], "provides": ["persona_context"]},
        "status": "OPERATIONAL",
    },
    "EMERGENCE_ENGINE": {
        "stratum": "B",
        "description": "Detects structural patterns and hero moments during pipeline execution",
        "mutation_authority": ["hero_moment_emit"],
        "synchronization": {"requires": ["structural_topology"], "provides": ["hero_moments"]},
        "status": "OPERATIONAL",
    },
    "ZONE_TRACKER": {
        "stratum": "B",
        "description": "Tracks zone and pressure state across pipeline phases",
        "mutation_authority": ["NONE"],
        "synchronization": {"requires": ["structural_topology", "signals"], "provides": ["zone_state"]},
        "status": "OPERATIONAL",
    },
    "PIPELINE_EXECUTION": {
        "stratum": "A",
        "description": "Orchestrates sequential pipeline phase execution",
        "mutation_authority": ["structural_artifacts", "chronicle_events"],
        "synchronization": {"requires": [], "provides": ["pipeline_state", "structural_topology"]},
        "status": "OPERATIONAL",
    },
    "SQO_GOVERNANCE": {
        "stratum": "D",
        "description": "Manages qualification gates, promotion lifecycle, revalidation",
        "mutation_authority": ["promotion_state", "revalidation_result", "qualification_blockers"],
        "synchronization": {"requires": ["pipeline_state", "review_state"], "provides": ["sqo_state"]},
        "status": "OPERATIONAL",
    },
}


def load_registry() -> dict:
    if REGISTRY_PATH.exists():
        with open(REGISTRY_PATH) as f:
            return json.load(f)
    return {
        "schema_version": "1.0",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "agents": dict(CANONICAL_AGENTS),
    }


def save_registry(registry: dict):
    REGISTRY_PATH.parent.mkdir(parents=True, exist_ok=True)
    registry["updated_at"] = datetime.now(timezone.utc).isoformat()
    with open(REGISTRY_PATH, "w") as f:
        json.dump(registry, f, indent=2)


def validate_agent_spec(spec: dict) -> list:
    """Validate an agent registration specification."""
    errors = []
    required = ["stratum", "description", "mutation_authority", "synchronization"]
    for field in required:
        if field not in spec:
            errors.append(f"Missing required field: {field}")

    valid_strata = {"A", "B", "C", "D", "E"}
    if spec.get("stratum") not in valid_strata:
        errors.append(f"Invalid stratum: {spec.get('stratum')} — must be one of {valid_strata}")

    sync = spec.get("synchronization", {})
    if "requires" not in sync or "provides" not in sync:
        errors.append("synchronization must have 'requires' and 'provides' lists")

    if spec.get("stratum") == "E" and spec.get("mutation_authority", []) != ["NONE"]:
        errors.append("Stratum E agents may not have mutation authority — projections are terminal")

    return errors


def register_agent(agent_id: str, spec: dict, operator: str) -> dict:
    """Register a new orchestration agent."""
    errors = validate_agent_spec(spec)
    if errors:
        return {"result": "REJECTED", "errors": errors}

    registry = load_registry()
    if agent_id in registry["agents"]:
        return {"result": "REJECTED", "errors": [f"Agent {agent_id} already registered"]}

    spec["registered_at"] = datetime.now(timezone.utc).isoformat()
    spec["registered_by"] = operator
    spec["status"] = "REGISTERED"
    registry["agents"][agent_id] = spec
    save_registry(registry)

    return {"result": "REGISTERED", "agent_id": agent_id}


def get_agent(agent_id: str) -> Optional[dict]:
    registry = load_registry()
    return registry["agents"].get(agent_id)


def list_agents() -> dict:
    registry = load_registry()
    return registry["agents"]


def validate_agent_interaction(source_agent: str, target_agent: str) -> dict:
    """Validate that two agents can interact per synchronization contracts."""
    registry = load_registry()
    source = registry["agents"].get(source_agent)
    target = registry["agents"].get(target_agent)

    if not source:
        return {"valid": False, "error": f"Source agent {source_agent} not registered"}
    if not target:
        return {"valid": False, "error": f"Target agent {target_agent} not registered"}

    source_provides = set(source.get("synchronization", {}).get("provides", []))
    target_requires = set(target.get("synchronization", {}).get("requires", []))

    satisfied = target_requires & source_provides
    unsatisfied = target_requires - source_provides

    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from stratum_boundary import LEGAL_TRANSITIONS, ILLEGAL_TRANSITIONS
    pair = (source["stratum"], target["stratum"])
    stratum_legal = pair in LEGAL_TRANSITIONS or source["stratum"] == target["stratum"]

    return {
        "valid": stratum_legal and len(unsatisfied) == 0,
        "source": source_agent,
        "target": target_agent,
        "stratum_legal": stratum_legal,
        "stratum_pair": f"{source['stratum']}→{target['stratum']}",
        "requirements_satisfied": sorted(satisfied),
        "requirements_unsatisfied": sorted(unsatisfied),
    }


def main():
    parser = argparse.ArgumentParser(
        description="Orchestration agent registration protocol"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list", help="List registered agents")

    info_parser = subparsers.add_parser("info", help="Show agent info")
    info_parser.add_argument("agent_id")

    validate_parser = subparsers.add_parser("validate", help="Validate agent interaction")
    validate_parser.add_argument("--source", required=True)
    validate_parser.add_argument("--target", required=True)

    init_parser = subparsers.add_parser("init", help="Initialize registry with canonical agents")

    args = parser.parse_args()

    if args.command == "list":
        agents = list_agents()
        for agent_id, spec in sorted(agents.items()):
            print(f"  {agent_id}: Stratum {spec['stratum']} — {spec.get('status', '?')} — {spec['description'][:60]}")

    elif args.command == "info":
        agent = get_agent(args.agent_id)
        if not agent:
            print(f"Agent {args.agent_id} not registered")
            sys.exit(1)
        print(f"{args.agent_id}:")
        print(f"  Stratum: {agent['stratum']}")
        print(f"  Status: {agent.get('status', '?')}")
        print(f"  Description: {agent['description']}")
        print(f"  Mutation authority: {agent['mutation_authority']}")
        print(f"  Requires: {agent['synchronization']['requires']}")
        print(f"  Provides: {agent['synchronization']['provides']}")

    elif args.command == "validate":
        result = validate_agent_interaction(args.source, args.target)
        if result["valid"]:
            print(f"VALID: {args.source}→{args.target} ({result['stratum_pair']})")
        else:
            print(f"INVALID: {result.get('error', 'Interaction not permitted')}")
            if result.get("requirements_unsatisfied"):
                print(f"  Unsatisfied: {result['requirements_unsatisfied']}")
            if not result.get("stratum_legal"):
                print(f"  Stratum {result['stratum_pair']} is illegal")

    elif args.command == "init":
        registry = load_registry()
        save_registry(registry)
        print(f"Registry initialized with {len(registry['agents'])} canonical agents")


if __name__ == "__main__":
    main()
