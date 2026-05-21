#!/usr/bin/env python3
"""
learning_registry.py
Contract: PI.GOVERNANCE.LEARNING-CONSUMPTION-ARCHITECTURE.01

Central governed learning registry. Manages the learning substrate at
docs/governance/learning/learning_registry.json.

Architecture principle:
  PROMOTED LEARNING → CONSUMABLE POLICY / CAPABILITY SIGNAL →
  PIPELINE DECLARES USAGE → REPLAY RECORDS ACTIVE LEARNING

This module is capability-oriented, not script-hardcoded.
Future agentic orchestrators plug in as governed consumers/proposers,
not silent mutators.

Responsibilities:
- Load/save the central registry
- Ingest learning events from specimen runs
- Query by lifecycle_state, category, capability_class, severity
- Resolve consumable learnings against declared consumption hooks
- Produce activation manifests for replay-safe consumption
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from learning_lifecycle import (
    CONSUMPTION_ELIGIBLE_STATES,
    is_consumable,
    load_learning_events,
    summarize_lifecycle,
)

REPO_ROOT = Path(__file__).resolve().parents[3]
REGISTRY_PATH = REPO_ROOT / "docs" / "governance" / "learning" / "learning_registry.json"


def load_registry(path: Optional[Path] = None) -> dict:
    path = path or REGISTRY_PATH
    if not path.exists():
        return _empty_registry()
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_registry(registry: dict, path: Optional[Path] = None):
    path = path or REGISTRY_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    registry["metadata"]["last_updated"] = datetime.now(timezone.utc).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )
    with open(path, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2)


def _empty_registry() -> dict:
    return {
        "registry_id": "LEARNING_REGISTRY_V1",
        "contract": "PI.GOVERNANCE.LEARNING-CONSUMPTION-ARCHITECTURE.01",
        "schema_version": "1.0.0",
        "metadata": {
            "created": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "last_updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "event_count": 0,
            "lifecycle_summary": {},
        },
        "capability_classes": {},
        "consumption_declarations": [],
        "events": [],
        "ingestion_log": [],
    }


def register_capability_class(
    registry: dict,
    class_id: str,
    description: str,
    target_capabilities: list,
    governance_level: str = "ADVISORY",
) -> dict:
    registry["capability_classes"][class_id] = {
        "class_id": class_id,
        "description": description,
        "target_capabilities": target_capabilities,
        "governance_level": governance_level,
        "registered_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    return registry


def declare_consumption(
    registry: dict,
    consumer_id: str,
    consumer_type: str,
    capability_classes: list,
    governance_level: str = "ADVISORY",
    replay_guarantee: str = "DETERMINISTIC_ADVISORY",
) -> dict:
    existing = [d for d in registry["consumption_declarations"] if d["consumer_id"] == consumer_id]
    if existing:
        existing[0]["capability_classes"] = capability_classes
        existing[0]["governance_level"] = governance_level
        existing[0]["replay_guarantee"] = replay_guarantee
        existing[0]["updated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    else:
        registry["consumption_declarations"].append({
            "consumer_id": consumer_id,
            "consumer_type": consumer_type,
            "capability_classes": capability_classes,
            "governance_level": governance_level,
            "replay_guarantee": replay_guarantee,
            "declared_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        })
    return registry


def ingest_from_specimen(
    registry: dict,
    specimen_id: str,
    run_id: str,
    events_path: Path,
    actor_id: str,
) -> dict:
    specimen_events = load_learning_events(events_path)
    if not specimen_events:
        return registry

    existing_ids = {e["event_id"] for e in registry["events"]}
    ingested = 0
    skipped = 0

    for event in specimen_events:
        if event["event_id"] in existing_ids:
            skipped += 1
            continue

        if "capability_class" not in event:
            event["capability_class"] = _derive_capability_class(event)

        event["registry_metadata"] = {
            "ingested_from": str(events_path),
            "ingested_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "ingested_by": actor_id,
        }
        registry["events"].append(event)
        existing_ids.add(event["event_id"])
        ingested += 1

    registry["ingestion_log"].append({
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "specimen_id": specimen_id,
        "run_id": run_id,
        "source_path": str(events_path),
        "events_found": len(specimen_events),
        "ingested": ingested,
        "skipped_duplicate": skipped,
        "actor_id": actor_id,
    })

    registry["metadata"]["event_count"] = len(registry["events"])
    registry["metadata"]["lifecycle_summary"] = summarize_lifecycle(registry["events"])

    return registry


def _derive_capability_class(event: dict) -> str:
    category = event.get("category", "")
    target = event.get("propagation_target", "")

    mapping = {
        "TIER_CLASSIFICATION_GAP": "SEMANTIC_DERIVATION",
        "AUTHORITY_PATTERN_GAP": "SEMANTIC_DERIVATION",
        "EVIDENCE_TYPE_GAP": "EVIDENCE_INTAKE",
        "SPINE_CONSISTENCY_GAP": "SPINE_MANAGEMENT",
        "GOVERNANCE_PROCESS_GAP": "GOVERNANCE_WORKFLOW",
    }
    if category in mapping:
        return mapping[category]

    target_mapping = {
        "CEU_DERIVATION_PIPELINE": "SEMANTIC_DERIVATION",
        "EVIDENCE_INTAKE_PIPELINE": "EVIDENCE_INTAKE",
        "SPINE_OBJECT_MANAGEMENT": "SPINE_MANAGEMENT",
        "GOVERNANCE_WORKFLOW": "GOVERNANCE_WORKFLOW",
    }
    return target_mapping.get(target, "UNCLASSIFIED")


def query_events(
    registry: dict,
    lifecycle_state: Optional[str] = None,
    category: Optional[str] = None,
    capability_class: Optional[str] = None,
    propagation_target: Optional[str] = None,
    severity: Optional[str] = None,
) -> list:
    results = registry["events"]

    if lifecycle_state:
        results = [e for e in results if e.get("lifecycle_state") == lifecycle_state]
    if category:
        results = [e for e in results if e.get("category") == category]
    if capability_class:
        results = [e for e in results if e.get("capability_class") == capability_class]
    if propagation_target:
        results = [e for e in results if e.get("propagation_target") == propagation_target]
    if severity:
        results = [e for e in results if e.get("severity") == severity]

    return results


def resolve_consumable_for_consumer(registry: dict, consumer_id: str) -> list:
    declaration = None
    for d in registry["consumption_declarations"]:
        if d["consumer_id"] == consumer_id:
            declaration = d
            break

    if not declaration:
        return []

    declared_classes = set(declaration["capability_classes"])
    consumable = [e for e in registry["events"] if is_consumable(e)]

    return [
        e for e in consumable
        if e.get("capability_class") in declared_classes
    ]


def produce_activation_manifest(
    registry: dict,
    client_id: str,
    run_id: str,
    consumer_activations: dict,
) -> dict:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    all_activated_ids = set()
    for consumer_id, events in consumer_activations.items():
        for e in events:
            all_activated_ids.add(e["event_id"])

    activated_events = []
    for event in registry["events"]:
        if event["event_id"] in all_activated_ids:
            activated_events.append({
                "event_id": event["event_id"],
                "category": event.get("category"),
                "capability_class": event.get("capability_class"),
                "title": event.get("title"),
                "lifecycle_state": event.get("lifecycle_state"),
                "propagation_target": event.get("propagation_target"),
                "severity": event.get("severity"),
            })

    consumer_details = {}
    for consumer_id, events in consumer_activations.items():
        declaration = None
        for d in registry["consumption_declarations"]:
            if d["consumer_id"] == consumer_id:
                declaration = d
                break

        consumer_details[consumer_id] = {
            "consumer_type": declaration.get("consumer_type", "UNKNOWN") if declaration else "UNKNOWN",
            "governance_level": declaration.get("governance_level", "UNKNOWN") if declaration else "UNKNOWN",
            "replay_guarantee": declaration.get("replay_guarantee", "UNKNOWN") if declaration else "UNKNOWN",
            "learnings_consumed": len(events),
            "learning_ids": [e["event_id"] for e in events],
        }

    return {
        "manifest_type": "LEARNING_ACTIVATION_MANIFEST",
        "contract": "PI.GOVERNANCE.LEARNING-CONSUMPTION-ARCHITECTURE.01",
        "schema_version": "1.0.0",
        "client_id": client_id,
        "run_id": run_id,
        "generated_at": now,
        "registry_snapshot": {
            "registry_id": registry.get("registry_id"),
            "total_events": registry["metadata"]["event_count"],
            "lifecycle_summary": registry["metadata"].get("lifecycle_summary", {}),
        },
        "activation_summary": {
            "total_activated": len(all_activated_ids),
            "consumers_with_learnings": len(consumer_activations),
            "governance_model": "ADVISORY_NON_MUTATING",
        },
        "activated_events": activated_events,
        "consumer_activations": consumer_details,
        "explainability": {
            "question": "Which historical learnings influenced this run?",
            "answer_source": "activated_events + consumer_activations",
            "replay_contract": "Same registry state + same run inputs → same activation manifest",
            "governance_assertion": "All activated learnings are CONSUMABLE-state, consumed under declared governance level, recorded for replay",
        },
    }
