"""
SPE Confidence Engine
Contract: PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

Scores each proposition based on derivation tier, evidence density,
reconciliation alignment, structural metric strength, and cross-validation.
"""

import math
from collections import defaultdict

from .proposition_schema import SemanticProposition, DerivationResult

TIER_BASE = {
    "DIRECT_EVIDENCE": 0.70,
    "DERIVED": 0.50,
    "INFERRED": 0.35,
}

RECONCILIATION_BOOST = {
    "ALIGNED": 0.10,
    "NOVEL": 0.0,
    "CONTESTED": -0.10,
}


def _evidence_boost(anchor_count: int) -> float:
    if anchor_count <= 0:
        return 0.0
    return min(0.10, math.log(anchor_count + 1, 10) * 0.05)


def _structural_strength_boost(structural_refs: dict) -> float:
    boost = 0.0
    ratio = structural_refs.get("dominance_ratio", 0)
    if ratio >= 3.0:
        boost += 0.05
    elif ratio >= 2.0:
        boost += 0.02

    bidir = structural_refs.get("total_bidirectional", 0)
    if bidir >= 50:
        boost += 0.05
    elif bidir >= 20:
        boost += 0.02

    cross_ratio = structural_refs.get("cross_domain_ratio", 0)
    if cross_ratio >= 0.5:
        boost += 0.03

    return min(boost, 0.10)


def _cross_validation_boost(prop: SemanticProposition, all_props: list[SemanticProposition]) -> float:
    supporting_classes = set()
    for other in all_props:
        if other.id == prop.id:
            continue
        shared_ceus = set(prop.ceu_refs) & set(other.ceu_refs)
        if shared_ceus and other.proposition_class != prop.proposition_class:
            supporting_classes.add(other.proposition_class)
    if len(supporting_classes) >= 3:
        return 0.08
    elif len(supporting_classes) >= 2:
        return 0.05
    elif len(supporting_classes) >= 1:
        return 0.02
    return 0.0


def score_propositions(result: DerivationResult) -> dict:
    distribution = defaultdict(int)

    for prop in result.propositions:
        base = TIER_BASE.get(prop.derivation_tier, 0.50)
        evidence = _evidence_boost(len(prop.evidence_anchors))
        recon = RECONCILIATION_BOOST.get(prop.reconciliation_state, 0.0)
        structural = _structural_strength_boost(prop.structural_refs)
        cross_val = _cross_validation_boost(prop, result.propositions)

        confidence = min(1.0, max(0.0, base + evidence + recon + structural + cross_val))
        prop.confidence = round(confidence, 3)

        if confidence >= 0.80:
            distribution["high"] += 1
        elif confidence >= 0.60:
            distribution["medium"] += 1
        elif confidence >= 0.45:
            distribution["low"] += 1
        else:
            distribution["very_low"] += 1

    tier_dist = defaultdict(int)
    class_dist = defaultdict(int)
    for p in result.propositions:
        tier_dist[p.derivation_tier] += 1
        class_dist[p.proposition_class] += 1

    confidences = [p.confidence for p in result.propositions]
    return {
        "total": len(result.propositions),
        "confidence_distribution": dict(distribution),
        "tier_distribution": dict(tier_dist),
        "class_distribution": dict(class_dist),
        "mean_confidence": round(sum(confidences) / len(confidences), 3) if confidences else 0.0,
        "min_confidence": min(confidences) if confidences else 0.0,
        "max_confidence": max(confidences) if confidences else 0.0,
    }
