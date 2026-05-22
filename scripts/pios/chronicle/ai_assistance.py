"""
AIAssistanceLogger — governed AI participation logging.

Contract: PI.GENESIS.GEN-3.AI-ASSISTED-OPERATIONALIZATION.01

Produces governed ai_assistance_event envelopes, ai_suggestion objects,
ai_detected_gap objects, and operator_decision_event records per
AI_ASSISTANCE_GOVERNANCE_CONTRACT.md.

All AI outputs are CANDIDATE/PROPOSED — operator review required.
Authority ceiling: L3 (ADVISORY_NON_MUTATING), fixed.
"""

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


class AIAssistanceLogger:
    """Governed logging for AI-assisted onboarding actions.

    Usage:
        logger = AIAssistanceLogger(client_id, run_id, run_dir)
        logger.initialize()

        event = logger.log_inspection(
            phase="Phase 3.6",
            artifacts_read=["structure/40.3s/code_graph.json"],
            description="Analyzed code-graph for structural anomalies",
        )

        suggestion = logger.log_suggestion(
            parent_event=event["event_id"],
            suggestion_type="ANOMALY_FLAG",
            confidence=0.85,
            rationale="Cross-domain coupling rate 60.8% exceeds threshold",
            evidence_refs=["structure/40.3s/code_graph.json"],
        )

        logger.log_operator_decision(
            ai_event_ref=event["event_id"],
            object_ref=suggestion["suggestion_id"],
            decision="ACCEPT",
            operator="operator_01",
        )
    """

    ALLOWED_EVENT_TYPES = frozenset([
        "INSPECTION", "PROPOSAL", "EXPLANATION", "RECONCILIATION", "IMPROVEMENT",
    ])

    ALLOWED_SUGGESTION_TYPES = frozenset([
        "HERO_MOMENT_CANDIDATE", "LEARNING_CANDIDATE", "ENRICHMENT_STRATEGY",
        "NARRATIVE_DRAFT", "INVESTIGATION_PATH", "GAP_DETECTION", "ANOMALY_FLAG",
    ])

    ALLOWED_GAP_TYPES = frozenset([
        "EVIDENCE_GAP", "ADAPTER_GAP", "EXTRACTION_GAP", "COVERAGE_GAP", "GROUNDING_GAP",
    ])

    ALLOWED_DECISIONS = frozenset(["ACCEPT", "REJECT", "DEFER", "MODIFY"])

    def __init__(self, client_id: str, run_id: str, run_dir: Path):
        self.client_id = client_id
        self.run_id = run_id
        self.run_dir = run_dir
        self.chronicle_dir = run_dir / "chronicle"
        self.events_path = self.chronicle_dir / "ai_assistance_events.jsonl"
        self._event_sequence = 0
        self._suggestion_sequence = 0
        self._gap_sequence = 0
        self._decision_sequence = 0

    def initialize(self):
        """Ensure chronicle directory exists."""
        self.chronicle_dir.mkdir(parents=True, exist_ok=True)

    def log_inspection(
        self,
        phase: str,
        artifacts_read: list[str],
        description: str,
        evidence_refs: Optional[list[str]] = None,
        model_id: str = "claude-opus-4-6",
        prompt_text: Optional[str] = None,
    ) -> dict:
        """Log an INSPECTION event — AI examines evidence and surfaces observations."""
        return self._log_event(
            event_type="INSPECTION",
            phase=phase,
            artifacts_read=artifacts_read,
            description=description,
            evidence_refs=evidence_refs or [],
            model_id=model_id,
            prompt_text=prompt_text,
        )

    def log_proposal(
        self,
        phase: str,
        artifacts_read: list[str],
        description: str,
        evidence_refs: Optional[list[str]] = None,
        model_id: str = "claude-opus-4-6",
        prompt_text: Optional[str] = None,
    ) -> dict:
        """Log a PROPOSAL event — AI generates suggestions requiring operator approval."""
        return self._log_event(
            event_type="PROPOSAL",
            phase=phase,
            artifacts_read=artifacts_read,
            description=description,
            evidence_refs=evidence_refs or [],
            model_id=model_id,
            prompt_text=prompt_text,
        )

    def log_explanation(
        self,
        phase: str,
        artifacts_read: list[str],
        description: str,
        evidence_refs: Optional[list[str]] = None,
        model_id: str = "claude-opus-4-6",
        prompt_text: Optional[str] = None,
    ) -> dict:
        """Log an EXPLANATION event — AI synthesizes governed evidence into narrative."""
        return self._log_event(
            event_type="EXPLANATION",
            phase=phase,
            artifacts_read=artifacts_read,
            description=description,
            evidence_refs=evidence_refs or [],
            model_id=model_id,
            prompt_text=prompt_text,
        )

    def log_reconciliation(
        self,
        phase: str,
        artifacts_read: list[str],
        description: str,
        evidence_refs: Optional[list[str]] = None,
        model_id: str = "claude-opus-4-6",
        prompt_text: Optional[str] = None,
    ) -> dict:
        """Log a RECONCILIATION event — AI assists with evidence cross-referencing."""
        return self._log_event(
            event_type="RECONCILIATION",
            phase=phase,
            artifacts_read=artifacts_read,
            description=description,
            evidence_refs=evidence_refs or [],
            model_id=model_id,
            prompt_text=prompt_text,
        )

    def log_improvement(
        self,
        phase: str,
        artifacts_read: list[str],
        description: str,
        evidence_refs: Optional[list[str]] = None,
        model_id: str = "claude-opus-4-6",
        prompt_text: Optional[str] = None,
    ) -> dict:
        """Log an IMPROVEMENT event — AI identifies pipeline/process improvements."""
        return self._log_event(
            event_type="IMPROVEMENT",
            phase=phase,
            artifacts_read=artifacts_read,
            description=description,
            evidence_refs=evidence_refs or [],
            model_id=model_id,
            prompt_text=prompt_text,
        )

    def log_suggestion(
        self,
        parent_event: str,
        suggestion_type: str,
        confidence: float,
        rationale: str,
        evidence_refs: list[str],
    ) -> dict:
        """Log an ai_suggestion object — a proposed action or finding."""
        if suggestion_type not in self.ALLOWED_SUGGESTION_TYPES:
            raise ValueError(
                f"Invalid suggestion_type: {suggestion_type}. "
                f"Allowed: {sorted(self.ALLOWED_SUGGESTION_TYPES)}"
            )

        self._suggestion_sequence += 1
        suggestion = {
            "suggestion_id": f"SUGG-{self._suggestion_sequence:03d}",
            "parent_event": parent_event,
            "suggestion_type": suggestion_type,
            "confidence": round(min(max(confidence, 0.0), 1.0), 3),
            "rationale": rationale,
            "evidence_refs": evidence_refs,
            "status": "PROPOSED",
            "operator_note": None,
            "timestamp": self._now(),
        }

        self._append_event(suggestion)
        return suggestion

    def log_detected_gap(
        self,
        parent_event: str,
        gap_type: str,
        severity: str,
        description: str,
        evidence_refs: list[str],
        remediation_suggestion: str = "",
    ) -> dict:
        """Log an ai_detected_gap object — an identified evidence deficiency."""
        if gap_type not in self.ALLOWED_GAP_TYPES:
            raise ValueError(
                f"Invalid gap_type: {gap_type}. "
                f"Allowed: {sorted(self.ALLOWED_GAP_TYPES)}"
            )

        self._gap_sequence += 1
        gap = {
            "gap_id": f"GAP-AI-{self._gap_sequence:03d}",
            "parent_event": parent_event,
            "gap_type": gap_type,
            "severity": severity,
            "description": description,
            "evidence_refs": evidence_refs,
            "remediation_suggestion": remediation_suggestion,
            "status": "IDENTIFIED",
            "timestamp": self._now(),
        }

        self._append_event(gap)
        return gap

    def log_operator_decision(
        self,
        ai_event_ref: str,
        object_ref: str,
        decision: str,
        operator: str,
        rationale: str = "",
        modifications: Optional[dict] = None,
    ) -> dict:
        """Log an operator_decision_event — the operator's response to an AI object."""
        if decision not in self.ALLOWED_DECISIONS:
            raise ValueError(
                f"Invalid decision: {decision}. "
                f"Allowed: {sorted(self.ALLOWED_DECISIONS)}"
            )

        self._decision_sequence += 1
        event = {
            "decision_id": f"OPD-{self._decision_sequence:03d}",
            "ai_event_ref": ai_event_ref,
            "object_ref": object_ref,
            "decision": decision,
            "operator": operator,
            "rationale": rationale,
            "modifications": modifications,
            "timestamp": self._now(),
        }

        self._append_event(event)
        return event

    def get_summary(self) -> dict:
        """Return a summary of AI assistance activity."""
        return {
            "total_events": self._event_sequence,
            "total_suggestions": self._suggestion_sequence,
            "total_gaps": self._gap_sequence,
            "total_operator_decisions": self._decision_sequence,
            "authority_ceiling": "L3",
            "governance_model": "ADVISORY_NON_MUTATING",
        }

    # ── Internal ──────────────────────────────────────────────────────────────

    def _log_event(
        self,
        event_type: str,
        phase: str,
        artifacts_read: list[str],
        description: str,
        evidence_refs: list[str],
        model_id: str,
        prompt_text: Optional[str],
    ) -> dict:
        """Create and persist an ai_assistance_event envelope."""
        if event_type not in self.ALLOWED_EVENT_TYPES:
            raise ValueError(
                f"Invalid event_type: {event_type}. "
                f"Allowed: {sorted(self.ALLOWED_EVENT_TYPES)}"
            )

        self._event_sequence += 1
        event_id = f"AI-{self.client_id}-{self.run_id}-{self._event_sequence:03d}"

        prompt_hash = (
            hashlib.sha256(prompt_text.encode("utf-8")).hexdigest()
            if prompt_text else None
        )

        event = {
            "event_id": event_id,
            "event_type": event_type,
            "timestamp": self._now(),
            "phase": phase,
            "description": description,
            "input_context": {
                "artifacts_read": artifacts_read,
                "evidence_refs": evidence_refs,
                "prompt_hash": prompt_hash,
            },
            "output": {
                "object_type": None,
                "object_ref": None,
            },
            "authority_ceiling": "L3",
            "requires_operator_decision": True,
            "operator_decision": None,
            "replay_trace": {
                "deterministic_inputs": True,
                "model_id": model_id,
                "temperature": 0,
            },
        }

        self._append_event(event)
        return event

    def _append_event(self, event: dict):
        """Append a single event/object to the JSONL log."""
        with open(self.events_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(event, separators=(",", ":")) + "\n")

    @staticmethod
    def _now() -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
