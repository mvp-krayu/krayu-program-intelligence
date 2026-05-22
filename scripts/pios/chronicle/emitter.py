"""
ChronicleEmitter — inline chronicle event emission during pipeline execution.

Contract: PI.GENESIS.GEN-1.CHRONICLE-EVENT-MODEL.01

Emits chronicle events to an append-only JSONL log, freezes checkpoints at
phase boundaries, and maintains a runtime-accumulating chronicle manifest.

The emitter hooks into the pipeline orchestrator loop. Events exist before
any chronicle compilation — compilation is a lens onto accumulated events.
"""

import json
import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


SEMANTIC_PHASE_MAP = {
    "Phase 0L — Learning Registry Load": "DISCOVERY",
    "Phase 1  — Source Boundary": "DISCOVERY",
    "Phase 2  — Intake Verification": "DISCOVERY",
    "Phase 3  — 40.x Structural Verification": "EMERGENCE",
    "Phase 3.5 — Structural Relevance Classification": "EMERGENCE",
    "Phase 3.6 — Code-Graph Structural Enrichment": "EMERGENCE",
    "Phase 3.7 — Structural Centrality Derivation": "EMERGENCE",
    "Phase 3b — Semantic Derivation": "FORMATION",
    "Phase 3c — Semantic Proposition Derivation": "FORMATION",
    "Phase 4  — CEU Grounding Verification": "FORMATION",
    "Phase 5  — Build Binding Envelope": "STABILIZATION",
    "Phase 5b — CSR Semantic Topology": "STABILIZATION",
    "Phase 6+7 — 75.x Activation + 41.x Projection": "STABILIZATION",
    "Phase 8a — Vault Construction": "PROJECTION",
    "Phase 8b — Vault Readiness": "PROJECTION",
    "Phase 9  — Selector Update": "PROJECTION",
    "Phase 10L — Learning Activation Manifest": "PROJECTION",
}

PHASE_INDEX_MAP = {
    "Phase 0L — Learning Registry Load": 0,
    "Phase 1  — Source Boundary": 1,
    "Phase 2  — Intake Verification": 2,
    "Phase 3  — 40.x Structural Verification": 3,
    "Phase 3.5 — Structural Relevance Classification": 4,
    "Phase 3.6 — Code-Graph Structural Enrichment": 5,
    "Phase 3.7 — Structural Centrality Derivation": 6,
    "Phase 3b — Semantic Derivation": 7,
    "Phase 3c — Semantic Proposition Derivation": 8,
    "Phase 4  — CEU Grounding Verification": 9,
    "Phase 5  — Build Binding Envelope": 10,
    "Phase 5b — CSR Semantic Topology": 11,
    "Phase 6+7 — 75.x Activation + 41.x Projection": 12,
    "Phase 8a — Vault Construction": 13,
    "Phase 8b — Vault Readiness": 14,
    "Phase 9  — Selector Update": 15,
    "Phase 10L — Learning Activation Manifest": 16,
}

PHASE_SLUG_MAP = {
    "Phase 0L — Learning Registry Load": "learning_load",
    "Phase 1  — Source Boundary": "source_boundary",
    "Phase 2  — Intake Verification": "intake_verification",
    "Phase 3  — 40.x Structural Verification": "structural_verification",
    "Phase 3.5 — Structural Relevance Classification": "relevance_classification",
    "Phase 3.6 — Code-Graph Structural Enrichment": "code_graph_enrichment",
    "Phase 3.7 — Structural Centrality Derivation": "structural_centrality",
    "Phase 3b — Semantic Derivation": "semantic_derivation",
    "Phase 3c — Semantic Proposition Derivation": "semantic_proposition",
    "Phase 4  — CEU Grounding Verification": "ceu_grounding",
    "Phase 5  — Build Binding Envelope": "binding_envelope",
    "Phase 5b — CSR Semantic Topology": "csr_topology",
    "Phase 6+7 — 75.x Activation + 41.x Projection": "activation_projection",
    "Phase 8a — Vault Construction": "vault_construction",
    "Phase 8b — Vault Readiness": "vault_readiness",
    "Phase 9  — Selector Update": "selector_update",
    "Phase 10L — Learning Activation Manifest": "learning_manifest",
}


class ChronicleEmitter:
    """Inline chronicle event emitter for pipeline execution.

    Usage:
        emitter = ChronicleEmitter(client_id, run_id, run_dir)
        emitter.initialize()

        # In pipeline loop:
        emitter.emit_phase_started(phase_name)
        ok = fn()
        emitter.emit_phase_completed(phase_name, ok, duration_ms, artifacts)
        emitter.freeze_checkpoint(phase_name, state_snapshot)

        # At end:
        emitter.finalize(all_pass)
    """

    def __init__(self, client_id: str, run_id: str, run_dir: Path):
        self.client_id = client_id
        self.run_id = run_id
        self.run_dir = run_dir
        self.chronicle_dir = run_dir / "chronicle"
        self.events_path = self.chronicle_dir / "chronicle_events.jsonl"
        self.manifest_path = self.chronicle_dir / "CHRONICLE_MANIFEST.json"
        self.checkpoints_dir = self.chronicle_dir / "checkpoints"
        self._event_sequence = 0
        self._checkpoint_sequence = 0
        self._phases_reached: list[str] = []
        self._start_time: Optional[float] = None

    def initialize(self):
        """Create chronicle directory structure and initial manifest."""
        self.chronicle_dir.mkdir(parents=True, exist_ok=True)
        self.checkpoints_dir.mkdir(parents=True, exist_ok=True)
        self._start_time = time.time()

        manifest = {
            "schema_version": "2.0",
            "chronicle_id": f"{self.client_id}-{self.run_id}-genesis",
            "client": self.client_id,
            "run_id": self.run_id,
            "corridor_type": "FULL_COGNITIVE_GENESIS",
            "status": "IN_PROGRESS",
            "created_at": self._now(),
            "semantic_rhythm": [
                "DISCOVERY", "EMERGENCE", "FORMATION", "TENSION",
                "STRENGTHENING", "STABILIZATION", "QUALIFICATION",
                "CONVERGENCE", "PROJECTION"
            ],
            "events_emitted": 0,
            "checkpoints_frozen": 0,
            "hero_moments_discovered": 0,
            "learning_events_captured": 0,
            "ai_interventions_logged": 0,
            "operator_decisions_recorded": 0,
            "semantic_phases_reached": [],
            "pipeline_phases": {},
        }
        self._write_manifest(manifest)

        self._emit_event(
            event_type="chronicle_initialized",
            semantic_phase="DISCOVERY",
            description=f"Chronicle initialized for {self.client_id}/{self.run_id}",
            evidence_refs=[],
        )

        print(f"    [CHRONICLE] initialized: {self.chronicle_dir.relative_to(self.run_dir.parents[3])}")

    def emit_phase_started(self, phase_name: str):
        """Emit a phase_started event."""
        semantic_phase = SEMANTIC_PHASE_MAP.get(phase_name, "PROJECTION")
        self._track_phase(semantic_phase)

        self._emit_event(
            event_type="phase_started",
            semantic_phase=semantic_phase,
            description=f"Pipeline phase started: {phase_name}",
            evidence_refs=[],
            extra={"pipeline_phase": phase_name},
        )

    def emit_phase_completed(
        self,
        phase_name: str,
        passed: bool,
        duration_ms: int = 0,
        artifacts: Optional[list[str]] = None,
    ):
        """Emit a phase_completed event with status and artifacts produced."""
        semantic_phase = SEMANTIC_PHASE_MAP.get(phase_name, "PROJECTION")
        phase_index = PHASE_INDEX_MAP.get(phase_name, -1)

        event_type = "phase_completed" if passed else "phase_failed"
        description = (
            f"Pipeline phase {'completed' if passed else 'FAILED'}: {phase_name}"
        )

        self._emit_event(
            event_type=event_type,
            semantic_phase=semantic_phase,
            description=description,
            evidence_refs=artifacts or [],
            extra={
                "pipeline_phase": phase_name,
                "phase_index": phase_index,
                "status": "PASS" if passed else "FAIL",
                "duration_ms": duration_ms,
                "artifacts_produced": artifacts or [],
            },
        )

        manifest = self._read_manifest()
        manifest["pipeline_phases"][phase_name] = {
            "status": "PASS" if passed else "FAIL",
            "semantic_phase": semantic_phase,
            "completed_at": self._now(),
            "duration_ms": duration_ms,
        }
        self._write_manifest(manifest)

    def emit_source_discovery(self, archive_path: str, sha256: str, size_bytes: int = 0):
        """Emit source_discovery event at Phase 1."""
        self._emit_event(
            event_type="source_discovery",
            semantic_phase="DISCOVERY",
            description=f"Source archive identified and SHA256-verified: {archive_path}",
            evidence_refs=[archive_path],
            extra={
                "archive_path": archive_path,
                "sha256": sha256,
                "size_bytes": size_bytes,
            },
        )

    def emit_evidence_acquisition(self, intake_path: str, file_count: int = 0, mode: str = ""):
        """Emit evidence_acquisition event at Phase 2."""
        self._emit_event(
            event_type="evidence_acquisition",
            semantic_phase="DISCOVERY",
            description=f"Evidence files extracted and verified: {intake_path}",
            evidence_refs=[intake_path],
            extra={
                "intake_path": intake_path,
                "file_count": file_count,
                "resolution_mode": mode,
            },
        )

    def emit_structural_emergence(self, node_count: int, edge_count: int, cluster_count: int):
        """Emit structural_emergence event at Phase 3."""
        self._emit_event(
            event_type="structural_emergence",
            semantic_phase="EMERGENCE",
            description=(
                f"First topology materialized: {node_count} nodes, "
                f"{edge_count} edges, {cluster_count} clusters"
            ),
            evidence_refs=[],
            extra={
                "node_count": node_count,
                "edge_count": edge_count,
                "cluster_count": cluster_count,
            },
        )

    def emit_relevance_classification(self, primary: int, support: int, peripheral: int):
        """Emit relevance_classification event at Phase 3.5."""
        total = primary + support + peripheral
        self._emit_event(
            event_type="relevance_classification",
            semantic_phase="EMERGENCE",
            description=(
                f"Structural relevance classified: {primary} PRIMARY, "
                f"{support} SUPPORT, {peripheral} PERIPHERAL (of {total})"
            ),
            evidence_refs=[],
            extra={
                "primary_count": primary,
                "support_count": support,
                "peripheral_count": peripheral,
                "total": total,
                "primary_ratio": round(primary / total, 3) if total > 0 else 0,
            },
        )

    def emit_semantic_formation(self, proposition_count: int, derivation_source: str):
        """Emit semantic_formation event at Phase 3b/3c."""
        self._emit_event(
            event_type="semantic_formation",
            semantic_phase="FORMATION",
            description=(
                f"Semantic claims crystallized: {proposition_count} propositions "
                f"via {derivation_source}"
            ),
            evidence_refs=[],
            extra={
                "proposition_count": proposition_count,
                "derivation_source": derivation_source,
            },
        )

    def emit_hero_moment(self, hero_moment: dict):
        """Emit a hero_moment_emergence chronicle event and track count."""
        hm_id = hero_moment.get("hero_moment_id", "HM-unknown")
        hero_type = hero_moment.get("hero_type", "UNKNOWN")
        description = hero_moment.get("description", "Hero Moment detected")
        phase = hero_moment.get("discovery_phase", "")
        semantic_phase = SEMANTIC_PHASE_MAP.get(phase, "EMERGENCE")

        self._emit_event(
            event_type="hero_moment_emergence",
            semantic_phase=semantic_phase,
            description=f"Hero Moment candidate: {description}",
            evidence_refs=hero_moment.get("evidence_refs", []),
            extra={
                "hero_moment_id": hm_id,
                "hero_type": hero_type,
                "governance_state": "CANDIDATE",
                "structural_metric": hero_moment.get("structural_metric", {}),
            },
        )

        manifest = self._read_manifest()
        manifest["hero_moments_discovered"] = manifest.get("hero_moments_discovered", 0) + 1
        self._write_manifest(manifest)

    def emit_ai_intervention(self, ai_event: dict):
        """Emit an ai_intervention chronicle event and track count."""
        event_id = ai_event.get("event_id", "AI-unknown")
        event_type = ai_event.get("event_type", "UNKNOWN")
        description = ai_event.get("description", "AI assistance event")
        phase = ai_event.get("phase", "")
        semantic_phase = SEMANTIC_PHASE_MAP.get(phase, "FORMATION")

        self._emit_event(
            event_type="ai_intervention",
            semantic_phase=semantic_phase,
            description=f"AI assistance ({event_type}): {description}",
            evidence_refs=ai_event.get("input_context", {}).get("evidence_refs", []),
            extra={
                "ai_event_id": event_id,
                "ai_event_type": event_type,
                "authority_ceiling": "L3",
                "requires_operator_decision": True,
                "model_id": ai_event.get("replay_trace", {}).get("model_id", ""),
            },
        )

        manifest = self._read_manifest()
        manifest["ai_interventions_logged"] = manifest.get("ai_interventions_logged", 0) + 1
        self._write_manifest(manifest)

    def emit_operator_decision(self, decision_event: dict):
        """Emit an operator_decision chronicle event and track count."""
        decision_id = decision_event.get("decision_id", "OPD-unknown")
        decision = decision_event.get("decision", "UNKNOWN")
        ai_ref = decision_event.get("ai_event_ref", "")

        self._emit_event(
            event_type="operator_decision",
            semantic_phase="TENSION",
            description=f"Operator decision: {decision} on {ai_ref}",
            evidence_refs=[],
            extra={
                "decision_id": decision_id,
                "decision": decision,
                "ai_event_ref": ai_ref,
                "object_ref": decision_event.get("object_ref", ""),
                "operator": decision_event.get("operator", ""),
            },
        )

        manifest = self._read_manifest()
        manifest["operator_decisions_recorded"] = manifest.get("operator_decisions_recorded", 0) + 1
        self._write_manifest(manifest)

    def emit_learning_promotion(self, transition_record: dict):
        """Emit a learning_promotion chronicle event and track count."""
        event_id = transition_record.get("event_id", "LRNE-unknown")
        from_state = transition_record.get("from_state", "")
        to_state = transition_record.get("to_state", "")
        actor = transition_record.get("actor_id", "")

        phase_map = {
            "REVIEWED": "FORMATION",
            "PROMOTED": "STRENGTHENING",
            "CONSUMABLE": "STABILIZATION",
            "CAPABILITY_CANDIDATE": "CONVERGENCE",
            "MODULE_CANDIDATE": "PROJECTION",
            "REJECTED": "TENSION",
            "SUPERSEDED": "TENSION",
        }
        semantic_phase = phase_map.get(to_state, "FORMATION")

        self._emit_event(
            event_type="learning_promotion",
            semantic_phase=semantic_phase,
            description=f"Learning {event_id}: {from_state} → {to_state} (by {actor})",
            evidence_refs=transition_record.get("evidence_refs", []),
            extra={
                "learning_event_id": event_id,
                "from_state": from_state,
                "to_state": to_state,
                "actor_id": actor,
                "justification": transition_record.get("justification", ""),
            },
        )

        manifest = self._read_manifest()
        manifest["learning_events_captured"] = manifest.get("learning_events_captured", 0) + 1
        self._write_manifest(manifest)

    def emit_custom(self, event_type: str, semantic_phase: str, description: str,
                    evidence_refs: Optional[list[str]] = None, extra: Optional[dict] = None):
        """Emit a custom chronicle event."""
        self._emit_event(
            event_type=event_type,
            semantic_phase=semantic_phase,
            description=description,
            evidence_refs=evidence_refs or [],
            extra=extra,
        )

    def freeze_checkpoint(self, phase_name: str, state_snapshot: Optional[dict] = None):
        """Freeze a checkpoint at a phase boundary."""
        phase_index = PHASE_INDEX_MAP.get(phase_name, self._checkpoint_sequence)
        slug = PHASE_SLUG_MAP.get(phase_name, f"phase_{phase_index}")
        semantic_phase = SEMANTIC_PHASE_MAP.get(phase_name, "PROJECTION")
        checkpoint_id = f"checkpoint_{phase_index:02d}_{slug}"

        predecessor = None
        if self._checkpoint_sequence > 0:
            prev_index = self._checkpoint_sequence - 1
            prev_phases = [k for k, v in PHASE_INDEX_MAP.items() if v == prev_index]
            if prev_phases:
                prev_slug = PHASE_SLUG_MAP.get(prev_phases[0], f"phase_{prev_index}")
                predecessor = f"checkpoint_{prev_index:02d}_{prev_slug}"

        checkpoint = {
            "checkpoint_id": checkpoint_id,
            "checkpoint_index": phase_index,
            "semantic_phase": semantic_phase,
            "pipeline_phase": phase_name,
            "timestamp": self._now(),
            "status": "FROZEN",
            "predecessor": predecessor,
            "events_since_predecessor": self._event_sequence,
            "state_snapshot": state_snapshot or {},
        }

        checkpoint_path = self.checkpoints_dir / f"{checkpoint_id}.json"
        with open(checkpoint_path, "w", encoding="utf-8") as f:
            json.dump(checkpoint, f, indent=2)

        self._checkpoint_sequence += 1

        manifest = self._read_manifest()
        manifest["checkpoints_frozen"] = self._checkpoint_sequence
        self._write_manifest(manifest)

        self._emit_event(
            event_type="chronicle_checkpoint",
            semantic_phase=semantic_phase,
            description=f"Checkpoint frozen: {checkpoint_id}",
            evidence_refs=[str(checkpoint_path.relative_to(self.run_dir.parents[3]))],
            extra={"checkpoint_id": checkpoint_id},
        )

    def finalize(self, all_pass: bool):
        """Finalize the chronicle after pipeline completion."""
        elapsed_ms = int((time.time() - self._start_time) * 1000) if self._start_time else 0

        status = "COMPLETE" if all_pass else "INCOMPLETE"
        self._emit_event(
            event_type="chronicle_finalized",
            semantic_phase="PROJECTION" if all_pass else self._phases_reached[-1] if self._phases_reached else "DISCOVERY",
            description=f"Chronicle finalized: {status} ({self._event_sequence} events, {self._checkpoint_sequence} checkpoints)",
            evidence_refs=[],
            extra={
                "final_status": status,
                "total_events": self._event_sequence,
                "total_checkpoints": self._checkpoint_sequence,
                "elapsed_ms": elapsed_ms,
            },
        )

        manifest = self._read_manifest()
        manifest["status"] = status
        manifest["completed_at"] = self._now()
        manifest["elapsed_ms"] = elapsed_ms
        manifest["events_emitted"] = self._event_sequence
        self._write_manifest(manifest)

        print(f"    [CHRONICLE] finalized: {status} — {self._event_sequence} events, {self._checkpoint_sequence} checkpoints")

    # ── Internal ──────────────────────────────────────────────────────────────

    def _emit_event(self, event_type: str, semantic_phase: str, description: str,
                    evidence_refs: list, extra: Optional[dict] = None):
        """Append a single event to chronicle_events.jsonl."""
        self._event_sequence += 1
        event_id = f"CE-{self.client_id}-{self.run_id}-{self._event_sequence:04d}"

        event = {
            "event_id": event_id,
            "event_type": event_type,
            "timestamp": self._now(),
            "semantic_phase": semantic_phase,
            "description": description,
            "evidence_refs": evidence_refs,
            "replay_safe": True,
        }
        if extra:
            event["detail"] = extra

        with open(self.events_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(event, separators=(",", ":")) + "\n")

        manifest = self._read_manifest()
        manifest["events_emitted"] = self._event_sequence
        self._write_manifest(manifest)

    def _track_phase(self, semantic_phase: str):
        """Track which semantic phases have been reached."""
        if semantic_phase not in self._phases_reached:
            self._phases_reached.append(semantic_phase)
            manifest = self._read_manifest()
            manifest["semantic_phases_reached"] = list(self._phases_reached)
            self._write_manifest(manifest)

    def _read_manifest(self) -> dict:
        with open(self.manifest_path, encoding="utf-8") as f:
            return json.load(f)

    def _write_manifest(self, data: dict):
        with open(self.manifest_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    @staticmethod
    def _now() -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
