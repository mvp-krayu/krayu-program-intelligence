"""
SPE Review Queue Emitter
Contract: PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

Generates proposition-specific review queue identifying items requiring operator attention.
"""

from collections import defaultdict
from datetime import datetime, timezone

from .proposition_schema import DerivationResult


def emit_review_queue(
    result: DerivationResult,
    confirmed_ceus: dict,
) -> dict:
    ts = datetime.now(timezone.utc).isoformat()
    items = []

    for prop in result.propositions:
        triggers = []

        if prop.confidence < 0.50:
            triggers.append({
                "trigger": "LOW_CONFIDENCE",
                "detail": f"Confidence {prop.confidence:.3f} below 0.50 threshold",
            })

        if prop.derivation_tier == "INFERRED":
            triggers.append({
                "trigger": "INFERRED_TIER",
                "detail": "AI-assisted derivation requires operator review",
            })

        if triggers:
            items.append({
                "proposition_id": prop.id,
                "proposition_class": prop.proposition_class,
                "confidence": prop.confidence,
                "derivation_tier": prop.derivation_tier,
                "ceu_refs": prop.ceu_refs,
                "triggers": triggers,
                "proposition_summary": prop.proposition[:150],
                "review_status": "PENDING",
            })

    structural_elements = defaultdict(list)
    for prop in result.propositions:
        for key in ("top_node", "cluster_id"):
            val = prop.structural_refs.get(key)
            if val:
                structural_elements[val].append(prop)

    for element, props in structural_elements.items():
        if len(props) >= 2:
            classes = set(p.proposition_class for p in props)
            if len(classes) >= 2:
                for p in props:
                    existing = next((i for i in items if i["proposition_id"] == p.id), None)
                    trigger = {
                        "trigger": "CONFLICTING_ELEMENT",
                        "detail": f"Multiple propositions reference {element}",
                    }
                    if existing:
                        existing["triggers"].append(trigger)
                    else:
                        items.append({
                            "proposition_id": p.id,
                            "proposition_class": p.proposition_class,
                            "confidence": p.confidence,
                            "derivation_tier": p.derivation_tier,
                            "ceu_refs": p.ceu_refs,
                            "triggers": [trigger],
                            "proposition_summary": p.proposition[:150],
                            "review_status": "PENDING",
                        })

    ceu_coverage = defaultdict(int)
    for prop in result.propositions:
        for ceu in prop.ceu_refs:
            ceu_coverage[ceu] += 1

    for ceu_id in confirmed_ceus:
        if ceu_coverage.get(ceu_id, 0) == 0:
            items.append({
                "proposition_id": None,
                "proposition_class": None,
                "confidence": 0.0,
                "derivation_tier": None,
                "ceu_refs": [ceu_id],
                "triggers": [{
                    "trigger": "COVERAGE_GAP",
                    "detail": f"No propositions for {ceu_id}",
                }],
                "proposition_summary": f"Coverage gap: {ceu_id} has no semantic propositions",
                "review_status": "PENDING",
            })

    seen_ids = set()
    deduped = []
    for item in items:
        pid = item["proposition_id"] or item.get("proposition_summary", "")
        if pid not in seen_ids:
            seen_ids.add(pid)
            deduped.append(item)

    return {
        "contract_id": "PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01",
        "specimen_id": result.specimen_id,
        "run_id": result.run_id,
        "generated_at": ts,
        "total_items": len(deduped),
        "trigger_summary": _trigger_summary(deduped),
        "items": deduped,
    }


def _trigger_summary(items: list[dict]) -> dict:
    summary = defaultdict(int)
    for item in items:
        for t in item.get("triggers", []):
            summary[t["trigger"]] += 1
    return dict(summary)
