"""
LearningPromoter — governed operator for learning lifecycle transitions.

Contract: PI.GENESIS.GEN-4.LEARNING-PROMOTION-PIPELINE.01

Operationalizes the PROPOSED → REVIEWED → PROMOTED → CONSUMABLE lifecycle
and the genesis-extended CAPABILITY_CANDIDATE → MODULE_CANDIDATE pathway.

Every transition requires operator identity, justification, and evidence.
AI may propose — AI does not promote. All transitions are governed.
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from learning_lifecycle import (
    EMERGENCE_THRESHOLD,
    LIFECYCLE_STATES,
    OPERATOR_REQUIRED_TRANSITIONS,
    VALID_TRANSITIONS,
    LifecycleViolation,
    transition_event,
)
from learning_registry import load_registry, query_events, save_registry


class LearningPromoter:
    """Governed operator for learning event lifecycle transitions.

    Usage:
        promoter = LearningPromoter(registry_path)

        promoter.review(
            event_id="LRNE-0001",
            actor_id="operator_01",
            justification="Confirmed evidence gap in intake pipeline",
        )

        promoter.promote(
            event_id="LRNE-0001",
            actor_id="operator_01",
            justification="Repeated across NetBox and StackStorm specimens",
        )

        promoter.activate(
            event_id="LRNE-0001",
            actor_id="operator_01",
            justification="Activating for evidence_intake consumer",
        )

        promoter.save()
    """

    def __init__(self, registry_path: Optional[Path] = None):
        self._registry_path = registry_path
        self._registry = load_registry(registry_path)
        self._transition_log: list[dict] = []

    def review(
        self,
        event_id: str,
        actor_id: str,
        justification: str,
        evidence_refs: Optional[list[str]] = None,
    ) -> dict:
        """Transition PROPOSED → REVIEWED."""
        return self._transition(event_id, "REVIEWED", actor_id, justification, evidence_refs)

    def reject(
        self,
        event_id: str,
        actor_id: str,
        justification: str,
        evidence_refs: Optional[list[str]] = None,
    ) -> dict:
        """Transition PROPOSED/REVIEWED → REJECTED."""
        return self._transition(event_id, "REJECTED", actor_id, justification, evidence_refs)

    def promote(
        self,
        event_id: str,
        actor_id: str,
        justification: str,
        evidence_refs: Optional[list[str]] = None,
    ) -> dict:
        """Transition REVIEWED → PROMOTED."""
        return self._transition(event_id, "PROMOTED", actor_id, justification, evidence_refs)

    def activate(
        self,
        event_id: str,
        actor_id: str,
        justification: str,
        evidence_refs: Optional[list[str]] = None,
    ) -> dict:
        """Transition PROMOTED → CONSUMABLE."""
        return self._transition(event_id, "CONSUMABLE", actor_id, justification, evidence_refs)

    def elevate_to_capability(
        self,
        event_id: str,
        actor_id: str,
        justification: str,
        specimen_refs: Optional[list[str]] = None,
    ) -> dict:
        """Transition CONSUMABLE → CAPABILITY_CANDIDATE.

        Requires the learning pattern to be observed across EMERGENCE_THRESHOLD
        (3+) specimens. The promoter validates specimen count.
        """
        event = self._find_event(event_id)
        if event.get("lifecycle_state") != "CONSUMABLE":
            raise LifecycleViolation(
                f"CAPABILITY_CANDIDATE requires CONSUMABLE state, "
                f"got {event.get('lifecycle_state')}"
            )

        specimens = specimen_refs or []
        if len(specimens) < EMERGENCE_THRESHOLD:
            category = event.get("category", "")
            same_category = query_events(
                self._registry, category=category, lifecycle_state="CONSUMABLE"
            )
            specimen_sources = set()
            for e in same_category:
                meta = e.get("registry_metadata", {})
                source = meta.get("ingested_from", "")
                if source:
                    specimen_sources.add(source)
            if len(specimen_sources) < EMERGENCE_THRESHOLD and len(specimens) < EMERGENCE_THRESHOLD:
                raise LifecycleViolation(
                    f"CAPABILITY_CANDIDATE requires {EMERGENCE_THRESHOLD}+ specimens, "
                    f"found {max(len(specimen_sources), len(specimens))}"
                )

        return self._transition(
            event_id, "CAPABILITY_CANDIDATE", actor_id, justification, specimen_refs
        )

    def elevate_to_module(
        self,
        event_id: str,
        actor_id: str,
        justification: str,
        evidence_refs: Optional[list[str]] = None,
    ) -> dict:
        """Transition CAPABILITY_CANDIDATE → MODULE_CANDIDATE."""
        return self._transition(event_id, "MODULE_CANDIDATE", actor_id, justification, evidence_refs)

    def supersede(
        self,
        event_id: str,
        actor_id: str,
        justification: str,
        superseded_by: Optional[str] = None,
    ) -> dict:
        """Transition any non-terminal state → SUPERSEDED."""
        evidence = [f"superseded_by:{superseded_by}"] if superseded_by else []
        return self._transition(event_id, "SUPERSEDED", actor_id, justification, evidence)

    def batch_review(
        self,
        event_ids: list[str],
        actor_id: str,
        justification: str,
    ) -> list[dict]:
        """Review multiple events in a single governed batch."""
        results = []
        for eid in event_ids:
            results.append(self.review(eid, actor_id, justification))
        return results

    def get_promotable(self) -> dict:
        """Return events grouped by their available next transition."""
        result = {}
        for state in LIFECYCLE_STATES:
            targets = VALID_TRANSITIONS.get(state, [])
            if targets:
                events = query_events(self._registry, lifecycle_state=state)
                if events:
                    result[state] = {
                        "count": len(events),
                        "available_transitions": targets,
                        "events": [
                            {
                                "event_id": e["event_id"],
                                "title": e.get("title", ""),
                                "category": e.get("category", ""),
                                "capability_class": e.get("capability_class", ""),
                            }
                            for e in events
                        ],
                    }
        return result

    def get_transition_log(self) -> list[dict]:
        """Return log of transitions made in this session."""
        return list(self._transition_log)

    def save(self):
        """Persist the registry with all transitions applied."""
        save_registry(self._registry, self._registry_path)

    # ── Internal ──────────────────────────────────────────────────────────────

    def _find_event(self, event_id: str) -> dict:
        for event in self._registry["events"]:
            if event["event_id"] == event_id:
                return event
        raise LifecycleViolation(f"Event not found: {event_id}")

    def _transition(
        self,
        event_id: str,
        target_state: str,
        actor_id: str,
        justification: str,
        evidence_refs: Optional[list[str]] = None,
    ) -> dict:
        event = self._find_event(event_id)

        if target_state in OPERATOR_REQUIRED_TRANSITIONS:
            if not actor_id or actor_id.startswith("ai_") or actor_id.startswith("system_"):
                raise LifecycleViolation(
                    f"Transition to {target_state} requires operator actor, "
                    f"got {actor_id!r}"
                )

        from_state = event.get("lifecycle_state", "UNKNOWN")
        transition_event(event, target_state, actor_id, justification, evidence_refs)

        self._registry["metadata"]["lifecycle_summary"] = _summarize(self._registry["events"])

        record = {
            "event_id": event_id,
            "from_state": from_state,
            "to_state": target_state,
            "actor_id": actor_id,
            "justification": justification,
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        }
        if evidence_refs:
            record["evidence_refs"] = evidence_refs
        self._transition_log.append(record)

        return event


def _summarize(events: list) -> dict:
    from learning_lifecycle import summarize_lifecycle
    return summarize_lifecycle(events)
