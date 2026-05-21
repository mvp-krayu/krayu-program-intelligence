"""
SPE Inferred Proposer (AI-Gated)
Contract: PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

Optional AI-assisted derivation tier. Takes deterministic propositions as context
and identifies cross-cutting patterns, risk patterns, intent-vs-structure gaps.

All outputs: authority_ceiling=L3, confidence 0.40-0.70, temperature=0.0.
Each INFERRED proposition must cite at least one deterministic proposition.
"""

import json
import sys
from datetime import datetime, timezone

from .proposition_schema import SemanticProposition, LineageEvent


def _ts() -> str:
    return datetime.now(timezone.utc).isoformat()


def propose_inferred(
    deterministic_propositions: list[SemanticProposition],
    specimen_id: str,
    run_id: str,
    prop_counter: list[int],
    lineage_counter: list[int],
) -> tuple[list[SemanticProposition], list[LineageEvent], bool]:
    try:
        from scripts.pios.sdc.llm_adapter import call_llm
    except ImportError:
        print("  WARNING: LLM adapter not available — INFERRED tier skipped")
        return [], [], False

    context_props = []
    for p in deterministic_propositions:
        context_props.append({
            "id": p.id,
            "class": p.proposition_class,
            "proposition": p.proposition,
            "confidence": p.confidence,
            "ceu_refs": p.ceu_refs,
        })

    prompt = f"""You are a structural analysis engine for the Program Intelligence system.
Given these {len(context_props)} deterministic structural propositions derived from code graph analysis,
identify cross-cutting patterns that span multiple propositions.

Rules:
- Each pattern MUST cite at least one proposition ID from the input
- Output JSON array of objects with: proposition (string), cited_ids (list), pattern_type (string)
- pattern_type must be one of: CROSS_CUTTING, RISK_PATTERN, INTENT_STRUCTURE_GAP
- Maximum 10 patterns
- No speculation beyond what the evidence supports
- No organizational, team, or human behavior inference

Propositions:
{json.dumps(context_props, indent=2)}

Output JSON array only, no explanation:"""

    try:
        response = call_llm(prompt, temperature=0.0)
    except Exception as e:
        print(f"  WARNING: LLM call failed — INFERRED tier skipped: {e}")
        return [], [], False

    try:
        patterns = json.loads(response)
        if not isinstance(patterns, list):
            patterns = []
    except (json.JSONDecodeError, TypeError):
        print("  WARNING: LLM response not valid JSON — INFERRED tier skipped")
        return [], [], False

    ts = _ts()
    propositions = []
    lineage_events = []
    valid_ids = {p.id for p in deterministic_propositions}
    evidence_anchors = []
    for p in deterministic_propositions:
        evidence_anchors.extend(p.evidence_anchors[:1])
    evidence_anchors = list(set(evidence_anchors))[:3]

    for pattern in patterns[:10]:
        cited = pattern.get("cited_ids", [])
        if not cited or not any(c in valid_ids for c in cited):
            continue

        text = pattern.get("proposition", "")
        if not text:
            continue

        prop_counter[0] += 1
        prop_id = f"SP-{specimen_id}-{prop_counter[0]:04d}"

        lineage_counter[0] += 1
        le_id = f"SLE-{lineage_counter[0]:04d}"

        prop = SemanticProposition(
            id=prop_id,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition=text[:300],
            derivation_tier="INFERRED",
            confidence=0.50,
            authority_ceiling="L3",
            evidence_anchors=evidence_anchors,
            status="CANDIDATE",
            timestamp=ts,
            proposition_class="COUPLING_PATTERN",
            ceu_refs=[],
            structural_refs={
                "pattern_type": pattern.get("pattern_type", "CROSS_CUTTING"),
                "cited_proposition_ids": [c for c in cited if c in valid_ids],
                "inferred": True,
            },
            derivation_rationale=f"AI-inferred cross-cutting pattern citing {len(cited)} propositions.",
            reconciliation_state="NOVEL",
        )
        propositions.append(prop)

        lineage_events.append(LineageEvent(
            event_id=le_id,
            proposition_id=prop_id,
            event_type="inferred_pattern_derivation",
            semantic_type="RELATIONSHIP",
            derivation_class="INFERRED",
            evidence={
                "cited_ids": [c for c in cited if c in valid_ids],
                "pattern_type": pattern.get("pattern_type", "CROSS_CUTTING"),
                "llm_provider": "anthropic",
            },
            learning_context=[],
            timestamp=ts,
        ))

    return propositions, lineage_events, True
