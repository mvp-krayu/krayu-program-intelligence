# Derivative Narrative Readiness Matrix

Stream: I.5 — Canonical Narrative Expansion
Phase: 1 — Inventory + Narrative Model Definition
Authority: derivative_entity_inventory | derivative_entity_maturity_matrix | derivative_entity_graph_map | derivative_entity_dependency_map | public_surface_readiness_matrix | canonical_narrative_expansion_model
Date: 2026-03-31

---

## Narrative Readiness Values

| Value | Definition |
|-------|------------|
| READY | Entity has: node file (complete), graph links (defined), dependencies (documented), structural completeness sufficient for non-speculative narrative, authority_container_status = bound or partial. Narrative can be written at standard or advanced depth. |
| PARTIAL | Entity has node file and graph links but one or more of the following gaps exist: incomplete dependency set, partial authority binding with significant unresolved gaps, no backing page, or sub-construct containment constraint that limits narrative scope. Narrative can be written at minimal depth only. |
| BLOCKED | Entity cannot be expanded. Block conditions: publish_status = preview-pending-publish, authority_container_status = missing with no live page, or structural gaps that would require speculation to complete narrative. No narrative may be written. |

---

## Columns

| Column | Source |
|--------|--------|
| Entity | derivative_entity_inventory §Summary Count |
| Has Node | governance/derivatives/nodes/ — file present = yes |
| Has Graph Links | derivative_entity_graph_map §Depth Verification — primary parent + cross-links |
| Has Dependencies | derivative_entity_dependency_map §Full Dependency Table — at least one inbound or outbound entry |
| Structural Completeness | derived from maturity_level (I.4 Phase 1) + node file completeness (I.4 Phase 3) |
| Narrative Readiness | READY / PARTIAL / BLOCKED per model above |
| Notes | from public_surface_readiness_matrix + completion_backlog |

---

## Matrix

| # | Entity | Has Node | Has Graph Links | Has Dependencies | Structural Completeness | Narrative Readiness | Notes |
|---|--------|----------|----------------|-----------------|------------------------|-------------------|-------|
| 1 | execution_stability_index | yes | yes — program_intelligence [L1], XL-01 XL-04 XL-05 | yes — 7 inbound, 7 outbound | COMPLETE maturity | READY | Authority binding partial (BL-001, BL-002). Narrative scope bounded by partial authority. Standard depth permitted. |
| 2 | risk_acceleration_gradient | yes | yes — program_intelligence [L1], XL-02 XL-04 XL-06 XL-09 | yes — 7 inbound, 3 outbound | COMPLETE maturity | READY | Authority binding partial (BL-003, BL-004). Cross-classified as standalone + ESI dimension — narrative must reflect both roles. Standard depth permitted. |
| 3 | execution_blindness | yes | yes — program_intelligence [L1], XL-07 XL-08 XL-10 | yes — 3 inbound, 6 outbound | COMPLETE maturity | READY | Authority binding partial (BL-005). Narrative grounded in problem-class framing from architecture docs. Standard depth permitted. |
| 4 | program_intelligence_gap | yes | yes — program_intelligence [L1], XL-08 XL-14 | yes — 1 inbound, 3 outbound | COMPLETE maturity | READY | Authority binding partial (BL-006). Narrative grounded as structural premise in architecture docs. Standard depth permitted. |
| 5 | signal_infrastructure | yes | yes — signal_platform [L1], XL-03 XL-07 XL-11 | yes — 5 inbound, 3 outbound | COMPLETE maturity | READY | Authority binding partial (BL-007). Narrative grounded as pipeline concept in architecture docs. Standard depth permitted. |
| 6 | execlens | yes | yes — signal_platform [L1], XL-11 | yes — 2 inbound, 1 outbound | NONE maturity (no backing page) | READY | Authority binding BOUND — strongest in set. No backing page limits surface placement. Narrative can be written at standard depth. Content will require backing page before surface deployment. |
| 7 | research | yes | yes — program_intelligence [L1], XL-13 | yes — 2 inbound, 0 outbound | PARTIAL maturity | PARTIAL | Authority binding missing (BL-008). Live page exists. Narrative scope limited to node file structural facts. Outbound dependencies absent (BL-010). Minimal depth only. |
| 8 | program_intelligence_advisory | yes | yes — krayu [L1] | yes — 1 inbound, 0 outbound | NONE maturity (no backing page) | PARTIAL | Authority binding partial (BL-020, BL-021). No backing page, no route. Narrative scope limited to structural role under krayu. Minimal depth only. |
| 9 | schedule_stability | yes | yes — execution_stability_index [L2] | yes — 1 inbound, 0 outbound | NONE maturity (sub-construct) | PARTIAL | Authority binding partial — class level at L3 (BL-022, BL-023). Sub-construct containment applies. Narrative must not claim independence from execution_stability_index. Minimal depth only. |
| 10 | cost_stability | yes | yes — execution_stability_index [L2] | yes — 1 inbound, 0 outbound | NONE maturity (sub-construct) | PARTIAL | Same conditions as schedule_stability (BL-024, BL-025). Minimal depth only. |
| 11 | delivery_predictability | yes | yes — execution_stability_index [L2] | yes — 1 inbound, 0 outbound | NONE maturity (sub-construct) | PARTIAL | Same conditions as schedule_stability (BL-026, BL-027). Minimal depth only. |
| 12 | flow_compression | yes | yes — execution_stability_index [L2] | yes — 1 inbound, 0 outbound | NONE maturity (sub-construct) | PARTIAL | Same conditions as schedule_stability (BL-028, BL-029). Minimal depth only. |
| 13 | evidence_intake | yes | yes — pios [L1] | yes — 1 inbound, 0 outbound | NONE maturity (sub-construct) | PARTIAL | Authority binding partial — L0/L1 canonical grounding (BL-030). Step name not in architecture docs. Sub-construct containment applies. Minimal depth only. |
| 14 | structure_reconstruction | yes | yes — pios [L1] | yes — 1 inbound, 0 outbound | NONE maturity (sub-construct) | PARTIAL | Authority binding partial — L2/L3 grounding (BL-031). Step name not in architecture docs. Sub-construct containment applies. Minimal depth only. |
| 15 | signal_computation | yes | yes — pios [L1] | yes — 1 inbound, 0 outbound | NONE maturity (sub-construct) | PARTIAL | Authority binding partial — L3 / Stream 40.5 grounding (BL-032). Closest name match in architecture docs. Sub-construct containment applies. Minimal depth only. |
| 16 | condition_and_diagnosis | yes | yes — pios [L1] | yes — 1 inbound, 0 outbound | NONE maturity (sub-construct) | PARTIAL | Authority binding partial — L4 / L3 completion grounding (BL-033). Step name not in architecture docs. Sub-construct containment applies. Minimal depth only. |
| 17 | early_warning_signals | yes | yes — execution_stability_index [L2], XL-09 XL-10 | yes — 3 inbound, 4 outbound | STUB maturity | BLOCKED | publish_status: preview-pending-publish. Authority binding missing (BL-011). Block cannot be resolved within I.5 scope. No narrative may be written. |
| 18 | execution_blindness_examples | yes | yes — execution_blindness [L2] | yes — 3 inbound, 4 outbound | STUB maturity | BLOCKED | publish_status: preview-pending-publish. Authority binding missing (BL-014). Same block condition as early_warning_signals. |
| 19 | why_dashboards_fail_programs | yes | yes — execution_blindness [L2] | yes — 1 inbound, 5 outbound | STUB maturity | BLOCKED | publish_status: preview-pending-publish. Authority binding missing (BL-017). Same block condition. |

---

## Summary

| Narrative Readiness | Count | Entities |
|--------------------|-------|---------|
| READY | 6 | execution_stability_index, risk_acceleration_gradient, execution_blindness, program_intelligence_gap, signal_infrastructure, execlens |
| PARTIAL | 10 | research, program_intelligence_advisory, schedule_stability, cost_stability, delivery_predictability, flow_compression, evidence_intake, structure_reconstruction, signal_computation, condition_and_diagnosis |
| BLOCKED | 3 | early_warning_signals, execution_blindness_examples, why_dashboards_fail_programs |
| **Total** | **19** | |

---

## Cross-Check: All 19 entities from derivative_entity_inventory accounted for

| Inventory Section | Count | Accounted in Matrix |
|-------------------|-------|-------------------|
| Category A — Routed, live | 6 | yes |
| Category A — Routed, stub | 3 | yes |
| Category B — Named constructs | 2 | yes |
| Category C — ESI dimensions | 4 | yes |
| Category D — PiOS steps | 4 | yes |
| **Total** | **19** | **19 / 19** |
