"""
Semantic Proposition Schema
Contract: PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

Canonical semantic_proposition spine object schema with SPE structural anchoring extensions.
The 8 canonical spine classes are LOCKED — semantic sub-types (relationship, grounding,
conflict, refinement) are modeled as fields within derivation lineage, NOT spine classes.
"""

from dataclasses import dataclass, field, asdict
from typing import Optional


DERIVATION_TIERS = ("DIRECT_EVIDENCE", "DERIVED", "INFERRED")
AUTHORITY_CEILINGS = ("L1", "L2", "L3")
PROPOSITION_STATUSES = ("CANDIDATE", "REVIEWED", "ACCEPTED", "REJECTED", "CONTESTED")
PROPOSITION_CLASSES = (
    "STRUCTURAL_DOMINANCE",
    "COUPLING_PATTERN",
    "AUTHORITY_TOPOLOGY",
    "TIER_GROUNDING",
    "HERO_MOMENT_GROUNDING",
    "CLUSTER_ARCHITECTURE",
)
RECONCILIATION_STATES = ("ALIGNED", "CONTESTED", "NOVEL")
SEMANTIC_TYPES = ("GROUNDING", "RELATIONSHIP", "CONFLICT", "REFINEMENT")


@dataclass
class SemanticProposition:
    # Canonical fields (PIEM schema)
    id: str
    specimen_id: str
    run_id: str
    proposition: str
    derivation_tier: str
    confidence: float
    authority_ceiling: str
    evidence_anchors: list[str]
    status: str
    timestamp: str

    # SPE extensions (structural anchoring)
    proposition_class: str
    ceu_refs: list[str]
    structural_refs: dict
    hero_moment_refs: list[str] = field(default_factory=list)
    replay_corridor_refs: list[str] = field(default_factory=list)
    derivation_rationale: str = ""
    reconciliation_state: str = "NOVEL"

    def validate(self) -> list[str]:
        errors = []
        if self.derivation_tier not in DERIVATION_TIERS:
            errors.append(f"Invalid derivation_tier: {self.derivation_tier}")
        if self.authority_ceiling not in AUTHORITY_CEILINGS:
            errors.append(f"Invalid authority_ceiling: {self.authority_ceiling}")
        if self.status not in PROPOSITION_STATUSES:
            errors.append(f"Invalid status: {self.status}")
        if self.proposition_class not in PROPOSITION_CLASSES:
            errors.append(f"Invalid proposition_class: {self.proposition_class}")
        if self.reconciliation_state not in RECONCILIATION_STATES:
            errors.append(f"Invalid reconciliation_state: {self.reconciliation_state}")
        if not 0.0 <= self.confidence <= 1.0:
            errors.append(f"Confidence out of range: {self.confidence}")
        if not self.evidence_anchors and not self.ceu_refs:
            errors.append("No evidence_anchors or ceu_refs")
        return errors

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: dict) -> "SemanticProposition":
        return cls(**{k: v for k, v in d.items() if k in cls.__dataclass_fields__})


@dataclass
class LineageEvent:
    event_id: str
    proposition_id: str
    event_type: str
    semantic_type: str
    derivation_class: str
    evidence: dict
    learning_context: list[dict] = field(default_factory=list)
    timestamp: str = ""

    def validate(self) -> list[str]:
        errors = []
        if self.semantic_type not in SEMANTIC_TYPES:
            errors.append(f"Invalid semantic_type: {self.semantic_type}")
        return errors

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class DerivationResult:
    propositions: list[SemanticProposition]
    lineage_events: list[LineageEvent]
    learning_events: list[dict]
    derivation_hash: str
    input_hash: str
    specimen_id: str
    run_id: str

    def to_dict(self) -> dict:
        return {
            "propositions": [p.to_dict() for p in self.propositions],
            "lineage_events": [e.to_dict() for e in self.lineage_events],
            "learning_events": self.learning_events,
            "derivation_hash": self.derivation_hash,
            "input_hash": self.input_hash,
            "specimen_id": self.specimen_id,
            "run_id": self.run_id,
        }
