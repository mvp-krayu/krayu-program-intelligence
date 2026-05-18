"""
Semantic Derivation Compiler — Confidence Scorer (P5)
Deterministic per-element confidence assessment.

Confidence levels (semantic derivation — NOT SQO authority):
  DIRECT_EVIDENCE — document explicitly names this element and grouping
  DERIVED         — grouping follows from document structure or secondary signals
  INFERRED        — grouping based on AI analysis of evidence

SQO authority mapping:
  Compiler output supports at most L3 candidate authority prior to reconciliation/review.
  DIRECT_EVIDENCE derivation confidence does NOT imply L5 authority.
"""

from dataclasses import dataclass, field, asdict
from typing import Optional

from .domain_proposer import ProposalResult, ProposedComponent, ProposedCapability, ProposedDomain


@dataclass
class ConfidenceDistribution:
    direct_evidence: int = 0
    derived: int = 0
    inferred: int = 0
    total: int = 0

    @property
    def direct_evidence_ratio(self) -> float:
        return self.direct_evidence / self.total if self.total > 0 else 0.0

    def to_dict(self) -> dict:
        d = asdict(self)
        d["direct_evidence_ratio"] = round(self.direct_evidence_ratio, 4)
        return d


@dataclass
class DomainConfidence:
    domain_id: str
    domain_name: str
    domain_confidence: str
    component_distribution: ConfidenceDistribution = field(default_factory=ConfidenceDistribution)
    capability_distribution: ConfidenceDistribution = field(default_factory=ConfidenceDistribution)
    all_inferred: bool = False

    def to_dict(self) -> dict:
        return {
            "domain_id": self.domain_id,
            "domain_name": self.domain_name,
            "domain_confidence": self.domain_confidence,
            "component_distribution": self.component_distribution.to_dict(),
            "capability_distribution": self.capability_distribution.to_dict(),
            "all_inferred": self.all_inferred,
        }


@dataclass
class ConfidenceReport:
    overall: ConfidenceDistribution = field(default_factory=ConfidenceDistribution)
    per_domain: list[DomainConfidence] = field(default_factory=list)
    overall_direct_evidence_ratio: float = 0.0
    low_confidence_candidate: bool = False

    def to_dict(self) -> dict:
        return {
            "overall": self.overall.to_dict(),
            "per_domain": [d.to_dict() for d in self.per_domain],
            "overall_direct_evidence_ratio": round(self.overall_direct_evidence_ratio, 4),
            "low_confidence_candidate": self.low_confidence_candidate,
        }


def score_confidence(proposal: ProposalResult) -> ConfidenceReport:
    """Walk every element and assess evidence chain strength."""
    report = ConfidenceReport()

    # Overall component distribution
    for comp in proposal.components:
        report.overall.total += 1
        _increment_confidence(report.overall, comp.confidence)

    report.overall_direct_evidence_ratio = report.overall.direct_evidence_ratio
    report.low_confidence_candidate = report.overall_direct_evidence_ratio < 0.50

    # Per-domain breakdown
    for domain in proposal.domains:
        dc = DomainConfidence(
            domain_id=domain.domain_id,
            domain_name=domain.name,
            domain_confidence=domain.confidence,
        )

        domain_caps = [c for c in proposal.capabilities if c.domain_id == domain.domain_id]
        domain_comps = [c for c in proposal.components if c.domain_id == domain.domain_id]

        for cap in domain_caps:
            dc.capability_distribution.total += 1
            _increment_confidence(dc.capability_distribution, cap.confidence)

        for comp in domain_comps:
            dc.component_distribution.total += 1
            _increment_confidence(dc.component_distribution, comp.confidence)

        dc.all_inferred = (
            dc.component_distribution.total > 0
            and dc.component_distribution.inferred == dc.component_distribution.total
        )

        report.per_domain.append(dc)

    return report


def _increment_confidence(dist: ConfidenceDistribution, level: str):
    if level == "DIRECT_EVIDENCE":
        dist.direct_evidence += 1
    elif level == "DERIVED":
        dist.derived += 1
    elif level == "INFERRED":
        dist.inferred += 1
