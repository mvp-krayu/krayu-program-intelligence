#!/usr/bin/env python3
"""
Downstream consumption contract for governed PI runtime.

Formalizes the relationship between the NextGen Runtime baseline (P0-P4)
and any downstream consumer stream. Every downstream stream must declare
its consumption contract before execution — what strata it consumes,
what mutation intent it has, which guards it binds to, its replay impact,
and its authority ceiling.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (post-P4 governance gate)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent

CONSUMED_STRATA = {
    "A": "DETERMINISTIC_COGNITION",
    "B": "ORCHESTRATION",
    "C": "CONTINUITY",
    "D": "QUALIFICATION",
    "E": "PROJECTION",
}

MUTATION_INTENTS = {
    "READ_ONLY": "Consumes artifacts without writing to governed paths",
    "CONTINUITY_WRITER": "Writes to continuity artifacts (spine objects, checkpoints, trails)",
    "QUALIFICATION_WRITER": "Writes to qualification artifacts (promotion state, review state, blockers)",
    "PROJECTION_RENDERER": "Writes projection outputs only (HTML, evidence records, narrative)",
    "ORCHESTRATION_EXTENDER": "Extends orchestration infrastructure (agents, pipelines, materializers)",
}

REQUIRED_GUARDS = {
    "ARTIFACT_HASH": {
        "script": "artifact_integrity.py",
        "phase": "P0",
        "description": "Artifact hash verification — integrity baseline enforcement",
    },
    "IMMUTABLE_VERIFICATION": {
        "script": "artifact_integrity.py",
        "phase": "P0",
        "description": "Immutable artifact protection — prevents mutation of sealed artifacts",
    },
    "TERMINAL_STATE": {
        "script": "terminal_state_guard.py",
        "phase": "P0",
        "description": "Terminal state enforcement — irreversible transitions are respected",
    },
    "STRATUM_BOUNDARY": {
        "script": "stratum_boundary.py",
        "phase": "P3",
        "description": "Cross-stratum write legality — constitutional boundary enforcement",
    },
    "ARTIFACT_CONSISTENCY": {
        "script": "artifact_consistency.py",
        "phase": "P2",
        "description": "Cross-artifact consistency validation — spine/proposition/promotion alignment",
    },
    "SESSION_TRAIL": {
        "script": "session_lifecycle.py + trail_persistence.py",
        "phase": "P2/P3",
        "description": "Session and interrogation trail lifecycle validation",
    },
    "AGENT_REGISTRATION": {
        "script": "agent_registration.py",
        "phase": "P4",
        "description": "Orchestration agent interaction validation per synchronization contracts",
    },
    "ADAPTIVE_BOUNDARY": {
        "script": "adaptive_enrichment.py + convergence_maturity.py",
        "phase": "P4",
        "description": "Adaptive enrichment boundary and convergence maturity progression",
    },
}

REPLAY_IMPACTS = {
    "NONE": "No replay impact — pure consumer, no state written",
    "CORRIDOR_CONSUMER": "Reads replay corridor — depends on deterministic replay state",
    "CORRIDOR_WRITER": "Writes replay corridor — creates checkpoints, proof objects",
    "CERTIFICATION_AFFECTING": "Affects certification state — writes to certification-governed paths",
}

AUTHORITY_CEILINGS = {
    "L1": "Structural — deterministic rendering only",
    "L2": "Semantic — structural derivation with governed confidence",
    "L3": "Bounded interpretation — evidence-synthesized narrative under 75.x",
    "L4": "Operator judgment — human-governed decisions",
    "L5": "Governance authority — S-state transitions, qualification advancement",
}


class ConsumptionContractViolation(Exception):
    pass


def validate_contract(contract: dict) -> list:
    """Validate a downstream consumption contract declaration."""
    errors = []

    if "stream_id" not in contract:
        errors.append("Missing stream_id")
    if "consumed_strata" not in contract:
        errors.append("Missing consumed_strata")
    elif not isinstance(contract["consumed_strata"], list):
        errors.append("consumed_strata must be a list")
    else:
        for s in contract["consumed_strata"]:
            if s not in CONSUMED_STRATA:
                errors.append(f"Unknown stratum: {s} (valid: {list(CONSUMED_STRATA.keys())})")

    if "mutation_intent" not in contract:
        errors.append("Missing mutation_intent")
    elif contract["mutation_intent"] not in MUTATION_INTENTS:
        errors.append(f"Unknown mutation_intent: {contract['mutation_intent']}")

    if "required_guards" not in contract:
        errors.append("Missing required_guards")
    elif not isinstance(contract["required_guards"], list):
        errors.append("required_guards must be a list")
    else:
        for g in contract["required_guards"]:
            if g not in REQUIRED_GUARDS:
                errors.append(f"Unknown guard: {g} (valid: {list(REQUIRED_GUARDS.keys())})")

    if "replay_impact" not in contract:
        errors.append("Missing replay_impact")
    elif contract["replay_impact"] not in REPLAY_IMPACTS:
        errors.append(f"Unknown replay_impact: {contract['replay_impact']}")

    if "authority_ceiling" not in contract:
        errors.append("Missing authority_ceiling")
    elif contract["authority_ceiling"] not in AUTHORITY_CEILINGS:
        errors.append(f"Unknown authority_ceiling: {contract['authority_ceiling']}")

    mutation = contract.get("mutation_intent", "")
    guards = set(contract.get("required_guards", []))

    if mutation in ("QUALIFICATION_WRITER", "CONTINUITY_WRITER"):
        if "TERMINAL_STATE" not in guards:
            errors.append(f"Mutation intent {mutation} requires TERMINAL_STATE guard")
        if "STRATUM_BOUNDARY" not in guards:
            errors.append(f"Mutation intent {mutation} requires STRATUM_BOUNDARY guard")
        if "ARTIFACT_HASH" not in guards:
            errors.append(f"Mutation intent {mutation} requires ARTIFACT_HASH guard")

    if contract.get("replay_impact") in ("CORRIDOR_WRITER", "CERTIFICATION_AFFECTING"):
        if "ARTIFACT_CONSISTENCY" not in guards:
            errors.append(f"Replay impact {contract['replay_impact']} requires ARTIFACT_CONSISTENCY guard")

    if "E" in contract.get("consumed_strata", []):
        if mutation not in ("READ_ONLY", "PROJECTION_RENDERER"):
            errors.append("Stratum E consumers may only be READ_ONLY or PROJECTION_RENDERER")

    return errors


def verify_guard_availability() -> dict:
    """Check which guards are available (scripts exist on disk)."""
    governance_dir = Path(__file__).resolve().parent
    results = {}
    for guard_id, spec in REQUIRED_GUARDS.items():
        scripts = spec["script"].split(" + ")
        all_present = all(
            (governance_dir / s.strip()).exists() for s in scripts
        )
        results[guard_id] = {
            "available": all_present,
            "scripts": spec["script"],
            "phase": spec["phase"],
        }
    return results


def create_contract(
    stream_id: str,
    consumed_strata: list,
    mutation_intent: str,
    required_guards: list,
    replay_impact: str,
    authority_ceiling: str,
    runtime_baseline_commit: str,
    consumer_artifacts: list = None,
    consumed_artifacts: list = None,
    bypass_prohibitions: list = None,
    operator: str = None,
) -> dict:
    """Create a downstream consumption contract declaration."""
    contract = {
        "schema_version": "1.0",
        "contract_type": "DOWNSTREAM_CONSUMPTION",
        "stream_id": stream_id,
        "runtime_baseline": {
            "stream": "PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01",
            "commit": runtime_baseline_commit,
            "phases": "P0-P4",
        },
        "consumed_strata": consumed_strata,
        "consumed_strata_labels": {s: CONSUMED_STRATA[s] for s in consumed_strata},
        "mutation_intent": mutation_intent,
        "mutation_intent_description": MUTATION_INTENTS.get(mutation_intent, ""),
        "required_guards": required_guards,
        "required_guards_detail": {g: REQUIRED_GUARDS[g] for g in required_guards if g in REQUIRED_GUARDS},
        "replay_impact": replay_impact,
        "replay_impact_description": REPLAY_IMPACTS.get(replay_impact, ""),
        "authority_ceiling": authority_ceiling,
        "authority_ceiling_description": AUTHORITY_CEILINGS.get(authority_ceiling, ""),
        "consumed_artifacts": consumed_artifacts or [],
        "consumer_artifacts": consumer_artifacts or [],
        "bypass_prohibitions": bypass_prohibitions or [
            "stratum_boundary_bypass",
            "immutable_verification_bypass",
            "terminal_state_bypass",
            "replay_certification_bypass",
            "adaptive_boundary_bypass",
        ],
        "declared_at": datetime.now(timezone.utc).isoformat(),
        "declared_by": operator,
        "verification_status": "PENDING",
    }

    errors = validate_contract(contract)
    if errors:
        contract["verification_status"] = "REJECTED"
        contract["verification_errors"] = errors
    else:
        guard_status = verify_guard_availability()
        missing_guards = [g for g in required_guards if not guard_status.get(g, {}).get("available", False)]
        if missing_guards:
            contract["verification_status"] = "GUARDS_UNAVAILABLE"
            contract["missing_guards"] = missing_guards
        else:
            contract["verification_status"] = "VERIFIED"

    contract["guard_availability"] = verify_guard_availability()

    return contract


def save_contract(contract: dict, output_path: Path):
    """Save a consumption contract to disk."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(contract, f, indent=2)


def main():
    parser = argparse.ArgumentParser(
        description="Downstream consumption contract management"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    verify_parser = subparsers.add_parser("verify-guards", help="Check guard availability")

    schema_parser = subparsers.add_parser("schema", help="Show contract schema")

    validate_parser = subparsers.add_parser("validate", help="Validate a contract file")
    validate_parser.add_argument("contract_path", help="Path to contract JSON")

    args = parser.parse_args()

    if args.command == "verify-guards":
        results = verify_guard_availability()
        all_available = True
        for guard_id, status in sorted(results.items()):
            marker = "AVAILABLE" if status["available"] else "MISSING"
            if not status["available"]:
                all_available = False
            print(f"  {guard_id}: {marker} ({status['scripts']}, {status['phase']})")
        print(f"\nAll guards available: {all_available}")

    elif args.command == "schema":
        print("DOWNSTREAM CONSUMPTION CONTRACT SCHEMA\n")
        print("1. Consumed Strata:")
        for k, v in CONSUMED_STRATA.items():
            print(f"   {k} — {v}")
        print("\n2. Mutation Intent:")
        for k, v in MUTATION_INTENTS.items():
            print(f"   {k} — {v}")
        print("\n3. Required Guards:")
        for k, v in REQUIRED_GUARDS.items():
            print(f"   {k} — {v['description']} ({v['script']}, {v['phase']})")
        print("\n4. Replay Impact:")
        for k, v in REPLAY_IMPACTS.items():
            print(f"   {k} — {v}")
        print("\n5. Authority Ceiling:")
        for k, v in AUTHORITY_CEILINGS.items():
            print(f"   {k} — {v}")

    elif args.command == "validate":
        path = Path(args.contract_path)
        if not path.exists():
            print(f"FAIL: Contract file not found: {path}")
            sys.exit(1)
        with open(path) as f:
            contract = json.load(f)
        errors = validate_contract(contract)
        if errors:
            print(f"INVALID — {len(errors)} errors:")
            for e in errors:
                print(f"  {e}")
            sys.exit(1)
        else:
            print(f"VALID — {contract.get('stream_id', '?')}")
            print(f"  Strata: {contract.get('consumed_strata')}")
            print(f"  Mutation: {contract.get('mutation_intent')}")
            print(f"  Guards: {contract.get('required_guards')}")
            print(f"  Replay: {contract.get('replay_impact')}")
            print(f"  Authority: {contract.get('authority_ceiling')}")


if __name__ == "__main__":
    main()
