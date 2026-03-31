# Public Surface Readiness Matrix

Stream: I.4 — Canonical Completion of Derivative Entities (Graph-Aligned)
Phase: 4 — Canonical Integration / Completion / Readiness
Authority: canonical_completion_rules | derivative_entity_completion_backlog | Phase 1–3 outputs | governance/architecture/ docs
Date: 2026-03-31

---

## Readiness Values

| Value | Meaning |
|-------|---------|
| ready | Entity meets all canonical_completion_rules PBR-01 conditions. Current surface state is live. |
| partial | Entity has a live backing page but has open backlog gaps (GAP-BIND, GAP-CODE, GAP-AUTH) that affect canonical grounding. Surface status is live but authority binding is incomplete. |
| not_allowed | Entity does not meet PBR-01. Publication is blocked by GAP-SURF (not live), GAP-AUTH with no prior live page, or node has no backing page. |

---

## Canonical Source Documents Evaluated

| Document | Path |
|----------|------|
| canonical-layer-model.md | governance/architecture/canonical/canonical-layer-model.md |
| pios_architecture_whitepaper.md | governance/architecture/pios_architecture_whitepaper.md |
| pios_whitepaper.md | governance/architecture/pios_whitepaper.md |
| pios_technical_appendix.md | governance/architecture/pios_technical_appendix.md |
| pios_investor_narrative.md | governance/architecture/pios_investor_narrative.md |
| program_intelligence_stack.md | governance/architecture/program_intelligence_stack.md |
| obsidian_index.md | governance/architecture/obsidian_index.md |

---

## Matrix

| # | Entity | Classification | canonical_source_documents | canonical_anchor_context | authority_container_status | public_surface_readiness | Reason |
|---|--------|---------------|---------------------------|--------------------------|---------------------------|-------------------------|--------|
| 1 | execution_stability_index | routed_live / COMPLETE | pios_architecture_whitepaper.md, pios_technical_appendix.md, program_intelligence_stack.md | L3 Derivation Layer — "acceleration or stability computations"; SSI/SSZ provisional signal note (DRIFT-001); Signal Computation Engine Stream 40.5 | partial | partial | Live backing page. Named in architecture docs only as SSI/SSZ (provisional); entity name ESI not explicit. DRIFT-001 open: canonical home is L3 but current implementation is L6. Authority binding is indirect. |
| 2 | risk_acceleration_gradient | routed_live / COMPLETE | pios_architecture_whitepaper.md, pios_technical_appendix.md, program_intelligence_stack.md | L3 Derivation Layer — SSZ note (DRIFT-001); "acceleration or stability computations" | partial | partial | Live backing page. Named in architecture docs only as SSZ (provisional signal candidate); entity name RAG not explicit. DRIFT-001 open. Authority binding is indirect. |
| 3 | execution_blindness | routed_live / COMPLETE | program_intelligence_stack.md, pios_investor_narrative.md | §1 problem framing (program_intelligence_stack.md); §1 The Problem (pios_investor_narrative.md) — the structural failure mode PI addresses | partial | partial | Live backing page. Entity name not explicit in architecture docs — conceptually addressed as the problem class. Indirect grounding only. |
| 4 | program_intelligence_gap | routed_live / COMPLETE | program_intelligence_stack.md, pios_investor_narrative.md | §1 discipline framing (program_intelligence_stack.md); §1–2 problem statement (pios_investor_narrative.md) | partial | partial | Live backing page. Entity name not explicit in architecture docs — the interpretive gap is the structural premise of both documents. Indirect grounding. |
| 5 | signal_infrastructure | routed_live / COMPLETE | pios_architecture_whitepaper.md, program_intelligence_stack.md, pios_investor_narrative.md | §3 Signäl product layer and pipeline description (program_intelligence_stack.md); L0–L6 pipeline stages (pios_architecture_whitepaper.md) | partial | partial | Live backing page. Entity name not explicit in architecture docs — grounded as the L0–L6 pipeline and Signäl product layer. Indirect grounding. |
| 6 | research | routed_live / PARTIAL | — | — | missing | partial | Live backing page (existing surface exception per PBR-03). No reference in any governance/architecture/ document. GAP-CODE: no authority codes. GAP-REL: no outbound links documented. Not promoted to authority status. |
| 7 | early_warning_signals | routed_stub / STUB | — | — | missing | not_allowed | publish_status: preview-pending-publish. Not live. GAP-AUTH: no architecture grounding. Publication blocked per PBR-02 and CCR-02 |
| 8 | execution_blindness_examples | routed_stub / STUB | — | — | missing | not_allowed | publish_status: preview-pending-publish. Not live. GAP-AUTH: no architecture grounding. Publication blocked per PBR-02 and CCR-02. |
| 9 | why_dashboards_fail_programs | routed_stub / STUB | — | — | missing | not_allowed | publish_status: preview-pending-publish. Not live. GAP-AUTH: no architecture grounding. Publication blocked per PBR-02 and CCR-02. |
| 10 | execlens | named_construct / NONE | canonical-layer-model.md, pios_architecture_whitepaper.md, pios_technical_appendix.md, program_intelligence_stack.md | L6 placement rule: "ExecLens belongs here as a runtime consumer layer" (pios_architecture_whitepaper.md); §2.5 (canonical-layer-model.md); §4 Lens (program_intelligence_stack.md) | bound | not_allowed | Authority binding is BOUND — strongest in the entity set. However: no backing page, no route, no canonical URL. Cannot be placed on public surface without a backing page. Authority binding is complete at node level only. |
| 11 | program_intelligence_advisory | named_construct / NONE | program_intelligence_stack.md, pios_investor_narrative.md | §1 Krayu as discipline holder and advisory provider (program_intelligence_stack.md) | partial | not_allowed | No backing page, no route. Indirect grounding only. Cannot be placed on public surface. |
| 12 | schedule_stability | dimension_sub_construct / NONE | pios_architecture_whitepaper.md, pios_technical_appendix.md | L3 Derivation Layer — "stability computations" class grounding | partial | not_allowed | No standalone backing page or route. Sub-construct — canonical home is within execution_stability_index authority container. Cannot be placed independently on public surface. |
| 13 | cost_stability | dimension_sub_construct / NONE | pios_architecture_whitepaper.md, pios_technical_appendix.md | L3 Derivation Layer — class-level grounding | partial | not_allowed | Same condition as schedule_stability. |
| 14 | delivery_predictability | dimension_sub_construct / NONE | pios_architecture_whitepaper.md, pios_technical_appendix.md | L3 Derivation Layer — class-level grounding | partial | not_allowed | Same condition as schedule_stability. |
| 15 | flow_compression | dimension_sub_construct / NONE | pios_architecture_whitepaper.md, pios_technical_appendix.md | L3 Derivation Layer — class-level grounding | partial | not_allowed | Same condition as schedule_stability. |
| 16 | evidence_intake | step_sub_construct / NONE | canonical-layer-model.md, pios_architecture_whitepaper.md, pios_technical_appendix.md | L0 Evidence Source Layer + L1 Evidence Normalization Layer; Streams 40.1–40.2 | partial | not_allowed | No standalone backing page or route. Step name not explicit in architecture docs — maps to L0/L1 layers. Canonical home is within pios authority container. Cannot be placed independently on public surface. |
| 17 | structure_reconstruction | step_sub_construct / NONE | canonical-layer-model.md, pios_architecture_whitepaper.md | L2 Evidence Navigation Layer (ENL) + L3 topology states | partial | not_allowed | Same condition as evidence_intake. |
| 18 | signal_computation | step_sub_construct / NONE | canonical-layer-model.md, pios_architecture_whitepaper.md, pios_technical_appendix.md | L3 Derivation Layer; Stream 40.5 — Signal Computation Engine | partial | not_allowed | Same condition as evidence_intake. Closest name match in architecture docs: "Signal Computation Engine" (Stream 40.5). |
| 19 | condition_and_diagnosis | step_sub_construct / NONE | canonical-layer-model.md, pios_architecture_whitepaper.md, pios_technical_appendix.md | L4 Semantic Shaping Layer; L3 formal derivation artifacts | partial | not_allowed | Same condition as evidence_intake. |

---

## Summary

| Readiness | Count | Entities |
|-----------|-------|---------|
| ready | 0 | — |
| partial | 6 | execution_stability_index, risk_acceleration_gradient, execution_blindness, program_intelligence_gap, signal_infrastructure, research |
| not_allowed | 13 | early_warning_signals, execution_blindness_examples, why_dashboards_fail_programs, execlens, program_intelligence_advisory, schedule_stability, cost_stability, delivery_predictability, flow_compression, evidence_intake, structure_reconstruction, signal_computation, condition_and_diagnosis |

---

## Notes

1. No entity in the 19-entity set reaches **ready** status. The six currently-live entities achieve **partial** because live backing pages exist but authority binding gaps remain open (see derivative_entity_completion_backlog.md).

2. **execlens** has the strongest authority binding in the set (bound) but cannot reach **ready** or **partial** because it has no backing page. The binding status and the surface readiness status are independent dimensions.

3. The three routed_stub entities (early_warning_signals, execution_blindness_examples, why_dashboards_fail_programs) are blocked by publish_status: preview-pending-publish. This is a surface-layer gate, not an authority binding issue.

4. All eight sub-constructs (four ESI dimensions + four PiOS steps) are **not_allowed** because they have no standalone backing pages and are structurally contained within their parent entity's authority domain.
