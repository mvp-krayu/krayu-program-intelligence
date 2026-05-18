"""
Semantic Derivation Compiler — Review Queue Generator (P6)
Deterministic review trigger detection → queue artifact.

Four trigger conditions (per D-3 spec point 7):
  1. Any domain with ALL INFERRED classifications
  2. Component count per domain exceeds 15
  3. Multiple plausible groupings exist for a component
  4. Overall DIRECT_EVIDENCE ratio below 50%
"""

from dataclasses import dataclass, field, asdict
from typing import Optional

from .domain_proposer import ProposalResult, ProposedComponent
from .confidence_scorer import ConfidenceReport


@dataclass
class ReviewItem:
    trigger: str
    severity: str  # HIGH | MEDIUM | LOW
    domain_id: str
    description: str
    suggested_action: str
    affected_elements: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ReviewQueue:
    items: list[ReviewItem] = field(default_factory=list)
    review_required: bool = False
    trigger_summary: dict[str, int] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "review_required": self.review_required,
            "item_count": len(self.items),
            "trigger_summary": self.trigger_summary,
            "items": [i.to_dict() for i in self.items],
        }


def generate_review_queue(
    proposal: ProposalResult,
    confidence_report: ConfidenceReport,
) -> ReviewQueue:
    """Apply 4 trigger conditions and generate structured review items."""
    queue = ReviewQueue()
    triggers = {"all_inferred": 0, "component_overload": 0,
                "ambiguous_grouping": 0, "low_confidence": 0}

    # Trigger 1: Domain with ALL INFERRED classifications
    for dc in confidence_report.per_domain:
        if dc.all_inferred:
            triggers["all_inferred"] += 1
            queue.items.append(ReviewItem(
                trigger="ALL_INFERRED_DOMAIN",
                severity="HIGH",
                domain_id=dc.domain_id,
                description=(
                    f"Domain '{dc.domain_name}' has all INFERRED component classifications. "
                    f"No component in this domain has direct evidence support."
                ),
                suggested_action=(
                    "Review evidence documents for explicit mentions of these components. "
                    "If evidence exists, reclassify. If not, consider whether this domain "
                    "should be retained or merged."
                ),
                affected_elements=[
                    c.component_id for c in proposal.components
                    if c.domain_id == dc.domain_id
                ],
            ))

    # Trigger 2: Component count per domain exceeds 15
    for domain in proposal.domains:
        domain_comps = [c for c in proposal.components if c.domain_id == domain.domain_id]
        if len(domain_comps) > 15:
            triggers["component_overload"] += 1
            queue.items.append(ReviewItem(
                trigger="COMPONENT_OVERLOAD",
                severity="MEDIUM",
                domain_id=domain.domain_id,
                description=(
                    f"Domain '{domain.name}' has {len(domain_comps)} components "
                    f"(threshold: 15). May indicate domain needs decomposition."
                ),
                suggested_action=(
                    "Review whether this domain groups genuinely related components "
                    "or should be split into more specific domains."
                ),
                affected_elements=[c.component_id for c in domain_comps],
            ))

    # Trigger 3: Multiple plausible groupings
    comp_names = {}
    for comp in proposal.components:
        key = comp.name.lower().strip()
        comp_names.setdefault(key, []).append(comp)

    for name, comps in comp_names.items():
        if len(comps) > 1:
            triggers["ambiguous_grouping"] += 1
            queue.items.append(ReviewItem(
                trigger="AMBIGUOUS_GROUPING",
                severity="MEDIUM",
                domain_id=comps[0].domain_id,
                description=(
                    f"Component '{comps[0].name}' appears in multiple contexts "
                    f"({len(comps)} occurrences), suggesting ambiguous grouping."
                ),
                suggested_action=(
                    "Determine canonical grouping. Mark secondary occurrences "
                    "as cross_domain if they serve multiple domains."
                ),
                affected_elements=[c.component_id for c in comps],
            ))

    # Trigger 4: Overall DIRECT_EVIDENCE ratio below 50%
    if confidence_report.low_confidence_candidate:
        triggers["low_confidence"] += 1
        queue.items.append(ReviewItem(
            trigger="LOW_DIRECT_EVIDENCE_RATIO",
            severity="HIGH",
            domain_id="GLOBAL",
            description=(
                f"Overall DIRECT_EVIDENCE ratio is "
                f"{confidence_report.overall_direct_evidence_ratio:.1%} "
                f"(threshold: 50%). Candidate CSR has insufficient evidence backing."
            ),
            suggested_action=(
                "Collect additional evidence documentation. Components classified "
                "as INFERRED or DERIVED need explicit document support to advance "
                "beyond candidate status."
            ),
        ))

    queue.trigger_summary = triggers
    queue.review_required = len(queue.items) > 0

    return queue
