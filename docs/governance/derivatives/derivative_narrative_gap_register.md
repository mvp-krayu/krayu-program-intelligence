# Derivative Narrative Gap Register

Stream: I.5 — Canonical Narrative Expansion
Phase: 1 — Inventory + Narrative Model Definition
Authority: derivative_narrative_readiness_matrix | derivative_entity_completion_backlog | canonical_narrative_expansion_model | Phase 3 node files
Date: 2026-03-31

---

## Scope

This register identifies structural or semantic gaps that block or constrain narrative expansion. Each gap is derived from existing canonical artifacts only. No speculation.

Sources evaluated:
- derivative_entity_completion_backlog.md (I.4 Phase 4)
- derivative_entity_maturity_matrix.md (I.4 Phase 1)
- public_surface_readiness_matrix.md (I.4 Phase 4)
- Phase 3 node files (all 19)
- derivative_narrative_readiness_matrix.md (I.5 Phase 1)

---

## Gap Types

| Code | Type | Definition |
|------|------|------------|
| NG-AUTH | Missing canonical authority source | No architecture document grounds the entity — narrative cannot make authority claims |
| NG-BIND | Weak or indirect authority binding | Entity concept grounded but name not explicit — narrative scope constrained |
| NG-DRIFT | Open drift condition affecting canonical placement | Canonical home stated but implementation deviates — narrative must reflect stated canonical home, not current implementation |
| NG-REL | Incomplete dependency documentation | Outbound or inbound relationships absent — narrative cannot describe full connection set |
| NG-SCOPE | Scope ambiguity | Boundary between entity and adjacent entity unclear — narrative risks conflation |
| NG-SURF | No public surface target | Narrative written but no live page exists to receive it |
| NG-BLOCK | Hard block — narrative forbidden | publish_status not live or authority missing with no live page |
| NG-PARENT | Sub-construct sequencing constraint | Parent entity narrative must precede sub-construct narrative |

---

## Register

| Gap ID | Entity | Type | Description | Blocking Impact | Recommended Action |
|--------|--------|------|-------------|----------------|-------------------|
| NG-001 | execution_stability_index | NG-BIND | Entity name "Execution Stability Index" / "ESI" not explicit in any governance/architecture/ document. Architecture docs reference SSI/SSZ as provisional signal analogues. Binding is indirect. | Narrative must not claim explicit architecture-doc authority for the ESI name. Scope constrained to partial binding per NDP-04. | Note in narrative §Canonical Source that authority binding is indirect. Do not write "ESI is defined in [architecture doc]." |
| NG-002 | execution_stability_index | NG-DRIFT | DRIFT-001 is open (pios_architecture_whitepaper.md §SSZ/SSI Note). Canonical home of ESI analogue is L3. Current implementation is L6. | Narrative must reflect canonical home (L3), not current implementation. Risk of narrative drift if implementation location is cited as canonical. | State in narrative: canonical placement is L3 derivation layer per architecture docs. Do not reference current L6 implementation as canonical. |
| NG-003 | risk_acceleration_gradient | NG-BIND | Entity name "Risk Acceleration Gradient" / "RAG" not explicit in architecture docs. SSZ is the named analogue, marked provisional. | Same constraint as NG-001 applied to RAG. | Same action as NG-001. Note partial binding in §Canonical Source. |
| NG-004 | risk_acceleration_gradient | NG-DRIFT | Same DRIFT-001 condition as NG-002. SSZ canonical home is L3; current implementation is L6. | Same constraint as NG-002 applied to RAG. | Same action as NG-002. |
| NG-005 | risk_acceleration_gradient | NG-SCOPE | risk_acceleration_gradient is cross-classified: standalone L1 entity under program_intelligence AND dimension_of execution_stability_index. Narrative must accurately represent both roles without conflating them. | If narrative describes only standalone role, the dimension role is omitted (drift by omission per DR-07). If only dimension role, standalone authority is understated. | Narrative §Where It Sits must explicitly state both placements. §How It Connects must reference both the XL-04 (dimension_of ESI) and XL-02 (produced by pios) links. |
| NG-006 | execution_blindness | NG-BIND | Entity name "Execution Blindness" not explicit in any architecture document. Grounded only as the structural failure mode that Program Intelligence addresses, in program_intelligence_stack.md §1 and pios_investor_narrative.md §1. | Narrative must not attribute definition to a specific architecture document. Scope constrained to problem-class grounding. | §Canonical Source must cite problem-class grounding only. Do not write "execution_blindness is defined in [doc]." |
| NG-007 | program_intelligence_gap | NG-BIND | Entity name "Program Intelligence Gap" not explicit in architecture documents. The interpretive gap is the structural premise of program_intelligence_stack.md §1 and pios_investor_narrative.md §1–2, but is not named as a standalone entity. | Same constraint as NG-006. | Same action as NG-006. |
| NG-008 | signal_infrastructure | NG-BIND | Entity name "Signal Infrastructure" not explicit in architecture documents. Grounded as the L0–L6 pipeline concept and Signäl product layer in program_intelligence_stack.md §3 and pios_architecture_whitepaper.md. | Narrative must not claim explicit architecture-doc authority for the Signal Infrastructure name. | §Canonical Source must reference pipeline concept and Signäl product layer grounding only. |
| NG-009 | signal_infrastructure | NG-SCOPE | signal_infrastructure must be distinguished from signal_platform (L0 authority node). Both reference the same operational concept in different contexts. | Narrative risks conflating the derivative entity (signal_infrastructure) with the authority node (signal_platform). | §What It Is Not must explicitly state: "Is not signal_platform (L0 authority node)." This distinction is in the node file §Boundaries and must carry through to narrative. |
| NG-010 | execlens | NG-SURF | execlens has no backing page and no canonical URL. Narrative can be written at standard depth (authority is BOUND) but has no live surface target for deployment. | Narrative completion does not enable immediate surface deployment. Written narrative will be held until backing page is created. | Flag in narrative §Canonical Position: "no backing page — narrative awaiting surface." |
| NG-011 | research | NG-AUTH | No reference in any governance/architecture/ document. authority_container_status = missing. | Narrative scope is limited to structural facts in node file only. No authority claims permitted per NDP-04. | §Canonical Source section must state: "no canonical architecture grounding — narrative scope limited to node structural facts." |
| NG-012 | research | NG-REL | Outbound dependencies from research are absent in Phase 2 dependency map (BL-010). research has 0 documented outbound links. | §How It Connects section in narrative will have incomplete outbound content. Cannot add relationships not in dependency map (NDP-03). | Write §How It Connects with inbound only. State "no outbound dependencies documented in Phase 2." Do not invent outbound links. |
| NG-013 | program_intelligence_advisory | NG-AUTH | No dedicated canonical document for program_intelligence_advisory as a named service entity. Indirect grounding only in program_intelligence_stack.md §1. | Narrative scope limited to structural role under krayu. No service scope claims permitted. | §What It Is limited to: "service concept referenced in program_intelligence_stack.md." No elaboration of service scope, offering structure, or commercial framing. |
| NG-014 | program_intelligence_advisory | NG-SURF | No backing page, no route. | Narrative completed cannot be deployed on public surface. | Flag in §Canonical Position: "no backing page — narrative awaiting surface." |
| NG-015 | schedule_stability | NG-BIND | "Schedule Stability" as a named dimension not explicit in architecture docs. Class-level grounding at L3 only. | Narrative limited to: sub-construct of execution_stability_index, L3 class grounding, definition from ESI node file. No standalone authority claims. | Apply minimal depth (level 1). §What It Is drawn from ESI node file definition only. |
| NG-016 | schedule_stability | NG-PARENT | Requires execution_stability_index (parent) narrative to be complete before schedule_stability narrative begins. | Sub-construct narrative written before parent narrative = sequencing violation per C6 and NDP-05. | Batch 3 must not begin until Batch 1 (execution_stability_index) is complete. |
| NG-017 | cost_stability | NG-BIND | Same as NG-015. | Same constraint. | Same action. |
| NG-018 | cost_stability | NG-PARENT | Same as NG-016. | Same constraint. | Same action. |
| NG-019 | delivery_predictability | NG-BIND | Same as NG-015. | Same constraint. | Same action. |
| NG-020 | delivery_predictability | NG-PARENT | Same as NG-016. | Same constraint. | Same action. |
| NG-021 | flow_compression | NG-BIND | Same as NG-015. | Same constraint. | Same action. |
| NG-022 | flow_compression | NG-PARENT | Same as NG-016. | Same constraint. | Same action. |
| NG-023 | evidence_intake | NG-BIND | Step name "Evidence Intake" not explicit in architecture docs. Concept maps to L0/L1 and Streams 40.1–40.2, but name differs. | Narrative limited to L0/L1 canonical layer grounding. Cannot claim step name is architecturally defined. | Apply minimal depth. §What It Is: "Step 01 of PiOS transformation chain, mapping to L0 Evidence Source Layer and L1 Evidence Normalization Layer." |
| NG-024 | structure_reconstruction | NG-BIND | Step name "Structure Reconstruction" not explicit in architecture docs. Maps to L2 ENL and L3 topology states. | Same constraint as NG-023. | Apply minimal depth. Reference L2/L3 canonical grounding. |
| NG-025 | signal_computation | NG-BIND | Step name "Signal Computation" not exact match in architecture docs — closest is "Signal Computation Engine" (Stream 40.5, L3). Closest match of any PiOS step to its architecture doc analogue. | Partial relief — closer than other steps but not exact. Narrative may reference Stream 40.5 as analogue, not as definition. | Apply minimal depth. §Canonical Source: "Stream 40.5 — Signal Computation Engine (L3) is the closest architecture analogue; step name differs." |
| NG-026 | condition_and_diagnosis | NG-BIND | Step name not in architecture docs. Maps to L4 Semantic Shaping Layer and L3 formal derivation artifact completion. | Same constraint as NG-023. | Apply minimal depth. Reference L4/L3 canonical grounding. |
| NG-027 | early_warning_signals | NG-BLOCK | publish_status: preview-pending-publish. authority_container_status: missing. Both conditions constitute a hard block per canonical_narrative_expansion_model DR-06. | No narrative may be written. | No action within I.5. Block must be resolved externally before I.5 scope can include this entity. |
| NG-028 | execution_blindness_examples | NG-BLOCK | Same block conditions as NG-027 (BL-014, BL-015, BL-016). | No narrative may be written. | No action within I.5. |
| NG-029 | why_dashboards_fail_programs | NG-BLOCK | Same block conditions as NG-027 (BL-017, BL-018, BL-019). | No narrative may be written. | No action within I.5. |

---

## Summary

| Gap Type | Count | Entities Affected |
|----------|-------|------------------|
| NG-AUTH | 2 | research, program_intelligence_advisory |
| NG-BIND | 14 | execution_stability_index, risk_acceleration_gradient, execution_blindness, program_intelligence_gap, signal_infrastructure, schedule_stability, cost_stability, delivery_predictability, flow_compression, evidence_intake, structure_reconstruction, signal_computation, condition_and_diagnosis |
| NG-DRIFT | 2 | execution_stability_index, risk_acceleration_gradient |
| NG-REL | 1 | research |
| NG-SCOPE | 2 | risk_acceleration_gradient, signal_infrastructure |
| NG-SURF | 2 | execlens, program_intelligence_advisory |
| NG-BLOCK | 3 | early_warning_signals, execution_blindness_examples, why_dashboards_fail_programs |
| NG-PARENT | 5 | schedule_stability, cost_stability, delivery_predictability, flow_compression, evidence_intake (implied) |
| **Total gaps** | **31** | |

Entities with zero gaps: none.
Entity with fewest gaps: execution_blindness (1 gap: NG-006), program_intelligence_gap (1 gap: NG-007).
Entity with most gaps: risk_acceleration_gradient (4 gaps: NG-003, NG-004, NG-005 + shared DRIFT).
