#!/usr/bin/env python3
"""
Convergence maturity progression framework for governed PI runtime.

Formal DESCRIPTIVE → EMERGENT → ESTABLISHED promotion process for
cross-specimen convergence observations. Maturity advancement requires
operator governance and specimen count thresholds.

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

MATURITY_LEVELS = {
    "DESCRIPTIVE": {
        "ordinal": 0,
        "min_specimens": 2,
        "description": "Comparison across specimens — observed but not yet a pattern",
        "evidence_requirement": "Both specimens show comparable behavior",
    },
    "EMERGENT": {
        "ordinal": 1,
        "min_specimens": 3,
        "description": "Pattern emerging across 3+ specimens — may generalize",
        "evidence_requirement": "Pattern holds across 3+ independent specimens with documented evidence",
    },
    "ESTABLISHED": {
        "ordinal": 2,
        "min_specimens": 5,
        "description": "Governance-confirmed pattern — stable across specimen diversity",
        "evidence_requirement": "5+ specimens, operator governance review, no counter-evidence",
    },
}

MATURITY_TRANSITIONS = {
    "DESCRIPTIVE": ["EMERGENT"],
    "EMERGENT": ["ESTABLISHED", "DESCRIPTIVE"],
    "ESTABLISHED": ["DESCRIPTIVE"],
}

TERMINAL_MATURITY = set()

OBSERVATION_TYPES = [
    "GOVERNANCE_LIFECYCLE_CONVERGENCE",
    "PROPOSITION_DERIVATION_DIVERGENCE",
    "ENRICHMENT_MECHANISM_DIVERGENCE",
    "REVALIDATION_PATTERN_CONVERGENCE",
    "DEBT_TAXONOMY_CONVERGENCE",
    "GOVERNANCE_FRICTION_RESPONSE_CONVERGENCE",
    "AUTHORITY_CEILING_CONVERGENCE",
]


class MaturityViolation(Exception):
    pass


def load_json(path: Path) -> Optional[dict]:
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def validate_maturity_transition(
    current: str, target: str, specimen_count: int
) -> dict:
    """Validate a maturity level transition."""
    if current not in MATURITY_TRANSITIONS:
        return {"valid": False, "error": f"Unknown maturity level: {current}"}
    if target not in MATURITY_TRANSITIONS[current]:
        return {
            "valid": False,
            "error": f"Invalid transition: {current} → {target} (allowed: {MATURITY_TRANSITIONS[current]})",
        }

    required = MATURITY_LEVELS[target]["min_specimens"]
    if specimen_count < required:
        return {
            "valid": False,
            "error": f"{target} requires {required}+ specimens, have {specimen_count}",
        }

    return {
        "valid": True,
        "from": current,
        "to": target,
        "specimen_count": specimen_count,
        "threshold_met": True,
    }


def create_observation(
    observation_type: str,
    specimen_refs: list,
    summary: str,
    evidence_refs: list,
) -> dict:
    """Create a new convergence observation at DESCRIPTIVE maturity."""
    if observation_type not in OBSERVATION_TYPES:
        raise MaturityViolation(
            f"Unknown observation type: {observation_type} "
            f"(known: {OBSERVATION_TYPES})"
        )

    if len(specimen_refs) < MATURITY_LEVELS["DESCRIPTIVE"]["min_specimens"]:
        raise MaturityViolation(
            f"DESCRIPTIVE requires {MATURITY_LEVELS['DESCRIPTIVE']['min_specimens']}+ specimens"
        )

    obs_id = f"CONV-{observation_type[:8]}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"

    return {
        "observation_id": obs_id,
        "observation_type": observation_type,
        "pattern_status": "OBSERVED",
        "interpretation_maturity": "DESCRIPTIVE",
        "specimen_refs": specimen_refs,
        "specimen_count": len(specimen_refs),
        "summary": summary,
        "evidence_refs": evidence_refs,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "maturity_log": [
            {
                "level": "DESCRIPTIVE",
                "specimen_count": len(specimen_refs),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "actor": "system",
                "reason": "Initial observation",
            }
        ],
    }


def promote_observation(
    observation: dict,
    target_maturity: str,
    new_specimen_refs: list,
    operator: str,
    justification: str,
) -> dict:
    """Promote an observation to a higher maturity level."""
    current = observation.get("interpretation_maturity", "DESCRIPTIVE")

    all_specimens = list(set(observation.get("specimen_refs", []) + new_specimen_refs))
    validation = validate_maturity_transition(current, target_maturity, len(all_specimens))

    if not validation["valid"]:
        raise MaturityViolation(validation["error"])

    if operator.startswith("ai_") or operator.startswith("system_"):
        raise MaturityViolation(
            f"Maturity promotion requires operator actor, got {operator!r}"
        )

    observation["interpretation_maturity"] = target_maturity
    observation["specimen_refs"] = all_specimens
    observation["specimen_count"] = len(all_specimens)

    observation["maturity_log"].append({
        "level": target_maturity,
        "specimen_count": len(all_specimens),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actor": operator,
        "reason": justification,
    })

    return observation


def demote_observation(
    observation: dict,
    operator: str,
    justification: str,
) -> dict:
    """Demote an observation back to DESCRIPTIVE (counter-evidence discovered)."""
    current = observation.get("interpretation_maturity", "DESCRIPTIVE")
    if current == "DESCRIPTIVE":
        raise MaturityViolation("Already at DESCRIPTIVE — cannot demote further")

    observation["interpretation_maturity"] = "DESCRIPTIVE"
    observation["maturity_log"].append({
        "level": "DESCRIPTIVE",
        "specimen_count": observation.get("specimen_count", 0),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actor": operator,
        "reason": f"DEMOTION: {justification}",
    })

    return observation


def load_convergence_registry(path: Path) -> dict:
    """Load or initialize the convergence observation registry."""
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return {
        "schema_version": "1.0",
        "stream": "PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "observations": [],
        "maturity_summary": {level: 0 for level in MATURITY_LEVELS},
    }


def save_convergence_registry(registry: dict, path: Path):
    """Save convergence registry with updated summary."""
    summary = {level: 0 for level in MATURITY_LEVELS}
    for obs in registry.get("observations", []):
        m = obs.get("interpretation_maturity", "DESCRIPTIVE")
        if m in summary:
            summary[m] += 1

    registry["maturity_summary"] = summary
    registry["updated_at"] = datetime.now(timezone.utc).isoformat()

    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(registry, f, indent=2)


def get_registry_path() -> Path:
    return REPO_ROOT / "scripts" / "pios" / "governance" / "convergence_registry.json"


def main():
    parser = argparse.ArgumentParser(
        description="Convergence maturity progression framework"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list", help="List convergence observations")

    info_parser = subparsers.add_parser("info", help="Show observation detail")
    info_parser.add_argument("observation_id")

    validate_parser = subparsers.add_parser("validate", help="Validate a maturity transition")
    validate_parser.add_argument("--current", required=True, choices=list(MATURITY_LEVELS.keys()))
    validate_parser.add_argument("--target", required=True, choices=list(MATURITY_LEVELS.keys()))
    validate_parser.add_argument("--specimens", type=int, required=True)

    levels_parser = subparsers.add_parser("levels", help="Show maturity level definitions")

    args = parser.parse_args()

    if args.command == "list":
        registry = load_convergence_registry(get_registry_path())
        observations = registry.get("observations", [])
        if not observations:
            print("No convergence observations registered")
        else:
            for obs in observations:
                print(
                    f"  {obs['observation_id']}: "
                    f"{obs['interpretation_maturity']} "
                    f"({obs['specimen_count']} specimens) — "
                    f"{obs['observation_type']}"
                )
        print(f"\nMaturity summary: {registry.get('maturity_summary', {})}")

    elif args.command == "info":
        registry = load_convergence_registry(get_registry_path())
        found = None
        for obs in registry.get("observations", []):
            if obs["observation_id"] == args.observation_id:
                found = obs
                break
        if not found:
            print(f"Observation {args.observation_id} not found")
            sys.exit(1)
        print(f"{found['observation_id']}:")
        print(f"  Type: {found['observation_type']}")
        print(f"  Maturity: {found['interpretation_maturity']}")
        print(f"  Specimens: {found['specimen_refs']}")
        print(f"  Summary: {found['summary']}")
        print(f"  Maturity log ({len(found['maturity_log'])} entries):")
        for entry in found["maturity_log"]:
            print(f"    {entry['level']} — {entry['actor']} — {entry['reason']}")

    elif args.command == "validate":
        result = validate_maturity_transition(args.current, args.target, args.specimens)
        if result["valid"]:
            print(f"VALID: {args.current} → {args.target} with {args.specimens} specimens")
        else:
            print(f"INVALID: {result['error']}")

    elif args.command == "levels":
        for level, spec in MATURITY_LEVELS.items():
            print(f"{level} (ordinal {spec['ordinal']}):")
            print(f"  Min specimens: {spec['min_specimens']}")
            print(f"  Description: {spec['description']}")
            print(f"  Evidence: {spec['evidence_requirement']}")
            print()


if __name__ == "__main__":
    main()
