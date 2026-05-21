"""
SPE Learning Emitter
Contract: PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

Generates PROPOSED learning events for conditions that warrant future attention.
Compatible with scripts/pios/learning/learning_lifecycle.py lifecycle model.
"""

from collections import defaultdict
from datetime import datetime, timezone

from .proposition_schema import DerivationResult, SemanticProposition


def _ts() -> str:
    return datetime.now(timezone.utc).isoformat()


def _event_id(counter: list[int]) -> str:
    counter[0] += 1
    return f"LRNE-SPE-{counter[0]:04d}"


def emit_learning_events(
    result: DerivationResult,
    bundle_hero_moments: list[dict],
    confirmed_ceus: dict,
) -> list[dict]:
    events = []
    counter = [0]
    ts = _ts()

    for prop in result.propositions:
        if prop.confidence < 0.45:
            events.append({
                "event_id": _event_id(counter),
                "specimen_id": result.specimen_id,
                "run_id": result.run_id,
                "lifecycle_state": "PROPOSED",
                "category": "semantic_proposition_confidence",
                "capability_class": "SEMANTIC_PROPOSITION",
                "propagation_target": "SEMANTIC_PROPOSITION_ENGINE",
                "severity": "MEDIUM",
                "description": (
                    f"Low confidence proposition {prop.id} ({prop.confidence:.2f}): "
                    f"{prop.proposition[:100]}"
                ),
                "evidence_refs": [prop.id],
                "proposed_at": ts,
                "transition_log": [],
            })

    ceu_coverage = defaultdict(int)
    for prop in result.propositions:
        for ceu in prop.ceu_refs:
            ceu_coverage[ceu] += 1

    for ceu_id in confirmed_ceus:
        if ceu_id not in ceu_coverage or ceu_coverage[ceu_id] == 0:
            events.append({
                "event_id": _event_id(counter),
                "specimen_id": result.specimen_id,
                "run_id": result.run_id,
                "lifecycle_state": "PROPOSED",
                "category": "semantic_proposition_coverage",
                "capability_class": "SEMANTIC_PROPOSITION",
                "propagation_target": "SEMANTIC_PROPOSITION_ENGINE",
                "severity": "LOW",
                "description": f"CEU {ceu_id} has no semantic propositions — coverage gap",
                "evidence_refs": [ceu_id],
                "proposed_at": ts,
                "transition_log": [],
            })

    covered_hm_ids = set()
    for prop in result.propositions:
        covered_hm_ids.update(prop.hero_moment_refs)

    for hm in bundle_hero_moments:
        hm_id = hm.get("id", "")
        if hm_id and hm_id not in covered_hm_ids:
            events.append({
                "event_id": _event_id(counter),
                "specimen_id": result.specimen_id,
                "run_id": result.run_id,
                "lifecycle_state": "PROPOSED",
                "category": "hero_moment_coverage",
                "capability_class": "SEMANTIC_PROPOSITION",
                "propagation_target": "SEMANTIC_PROPOSITION_ENGINE",
                "severity": "LOW",
                "description": f"Hero moment {hm_id} not covered by any proposition",
                "evidence_refs": [hm_id],
                "proposed_at": ts,
                "transition_log": [],
            })

    over_generalized = [
        p for p in result.propositions
        if len(p.ceu_refs) > 3 and p.proposition_class not in ("COUPLING_PATTERN",)
    ]
    for prop in over_generalized:
        events.append({
            "event_id": _event_id(counter),
            "specimen_id": result.specimen_id,
            "run_id": result.run_id,
            "lifecycle_state": "PROPOSED",
            "category": "over_generalization_risk",
            "capability_class": "SEMANTIC_PROPOSITION",
            "propagation_target": "SEMANTIC_PROPOSITION_ENGINE",
            "severity": "MEDIUM",
            "description": (
                f"Proposition {prop.id} spans {len(prop.ceu_refs)} CEUs without "
                f"specific per-CEU evidence"
            ),
            "evidence_refs": [prop.id],
            "proposed_at": ts,
            "transition_log": [],
        })

    reclassified_ceus = {
        ceu_id for ceu_id, ceu in confirmed_ceus.items()
        if ceu.get("last_action") in ("ceu_reclassify", "ceu_refine")
    }
    if reclassified_ceus:
        events.append({
            "event_id": _event_id(counter),
            "specimen_id": result.specimen_id,
            "run_id": result.run_id,
            "lifecycle_state": "PROPOSED",
            "category": "reconciliation_friction",
            "capability_class": "SEMANTIC_PROPOSITION",
            "propagation_target": "SEMANTIC_PROPOSITION_ENGINE",
            "severity": "LOW",
            "description": (
                f"Reconciliation friction detected: {len(reclassified_ceus)} CEUs "
                f"reclassified/refined ({', '.join(sorted(reclassified_ceus))})"
            ),
            "evidence_refs": list(reclassified_ceus),
            "proposed_at": ts,
            "transition_log": [],
        })

    return events
