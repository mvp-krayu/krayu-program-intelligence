# Derivative Narrative Scope Definition

Stream: I.5 — Canonical Narrative Expansion
Phase: 1 — Inventory + Narrative Model Definition
Authority: derivative_narrative_readiness_matrix | derivative_entity_graph_map | derivative_entity_dependency_map | canonical_narrative_expansion_model
Date: 2026-03-31

---

## 1. Prioritization Criteria

The following criteria determine expansion order. Applied in descending priority.

| Criterion | Code | Definition |
|-----------|------|------------|
| Graph centrality | C1 | Inbound dependency count from dependency_map. Higher inbound = more entities depend on this narrative being correct. |
| Narrative readiness | C2 | READY > PARTIAL > BLOCKED. No PARTIAL or BLOCKED entity may be in a batch before all READY entities are scoped. |
| Authority container status | C3 | bound > partial > missing. Stronger authority binding = safer narrative scope. |
| CAT/WEB surface relevance | C4 | Entities with live backing pages and canonical URLs are immediately usable on WEB surface once narrative is written. |
| Structural completeness | C5 | COMPLETE > PARTIAL > STUB > NONE maturity (from I.4 Phase 1). |
| Parent dependency | C6 | Sub-constructs (ESI dimensions, PiOS steps) may not be expanded before their parent entity narrative is complete. |

---

## 2. Entity Scores by Prioritization Criteria

| Entity | C1 (inbound) | C2 (readiness) | C3 (authority) | C4 (live surface) | C5 (maturity) | C6 (parent dependency) |
|--------|-------------|----------------|---------------|-------------------|---------------|----------------------|
| execution_stability_index | 7 | READY | partial | yes | COMPLETE | none (is parent) |
| risk_acceleration_gradient | 7 | READY | partial | yes | COMPLETE | none (is parent) |
| execution_blindness | 4 | READY | partial | yes | COMPLETE | none |
| program_intelligence_gap | 1 | READY | partial | yes | COMPLETE | none |
| signal_infrastructure | 5 | READY | partial | yes | COMPLETE | none |
| execlens | 2 | READY | bound | no | NONE | signal_infrastructure |
| research | 2 | PARTIAL | missing | yes | PARTIAL | none |
| program_intelligence_advisory | 1 | PARTIAL | partial | no | NONE | none |
| schedule_stability | 1 | PARTIAL | partial | no | NONE | execution_stability_index |
| cost_stability | 1 | PARTIAL | partial | no | NONE | execution_stability_index |
| delivery_predictability | 1 | PARTIAL | partial | no | NONE | execution_stability_index |
| flow_compression | 1 | PARTIAL | partial | no | NONE | execution_stability_index |
| evidence_intake | 1 | PARTIAL | partial | no | NONE | pios |
| structure_reconstruction | 1 | PARTIAL | partial | no | NONE | pios |
| signal_computation | 1 | PARTIAL | partial | no | NONE | pios |
| condition_and_diagnosis | 1 | PARTIAL | partial | no | NONE | pios |
| early_warning_signals | — | BLOCKED | missing | no | STUB | — |
| execution_blindness_examples | — | BLOCKED | missing | no | STUB | — |
| why_dashboards_fail_programs | — | BLOCKED | missing | no | STUB | — |

---

## 3. Expansion Batches

### Batch 1 — Core Analytical Constructs (FIRST EXPANSION BATCH)

**Entities:**
- execution_stability_index
- risk_acceleration_gradient
- execution_blindness
- program_intelligence_gap

**Justification:**
- All four are READY
- All four have COMPLETE maturity (I.4)
- All four have live backing pages with canonical URLs
- execution_stability_index and risk_acceleration_gradient have the highest inbound dependency counts (7 each) — narrative accuracy here propagates to 7 downstream entities
- execution_blindness and program_intelligence_gap are the structural problem-framing nodes — getting their narrative correct enables all downstream expansion
- All four have live WEB surface placement available immediately upon completion
- No parent dependency constraint blocks any of these four

**Narrative depth:** standard (level 2) for all four

---

### Batch 2 — Infrastructure and Surface

**Entities:**
- signal_infrastructure
- execlens

**Justification:**
- signal_infrastructure: READY, COMPLETE maturity, highest inbound among infrastructure nodes (5), live backing page
- execlens: READY, BOUND authority (strongest in entity set), but no backing page — narrative can be written but surface deployment requires separate action
- Both entities are L1 under signal_platform — natural grouping
- signal_infrastructure must precede execlens due to XL-11 dependency (execlens is surface_of signal_infrastructure)
- Batch 2 executes only after Batch 1 is complete

**Narrative depth:** standard (level 2) for signal_infrastructure; standard (level 2) for execlens (authority is bound)

---

### Batch 3 — ESI Dimension Sub-Constructs

**Entities:**
- schedule_stability
- cost_stability
- delivery_predictability
- flow_compression

**Justification:**
- All four are PARTIAL — sub-construct containment applies
- Parent entity execution_stability_index must have completed Batch 1 narrative before sub-construct expansion
- All four have the same structure and authority conditions — batch expansion is efficient
- No live surface placement possible until backing pages exist

**Narrative depth:** minimal (level 1) for all four

**Prerequisite:** Batch 1 (execution_stability_index) must be complete.

---

### Batch 4 — PiOS Step Sub-Constructs

**Entities:**
- evidence_intake
- structure_reconstruction
- signal_computation
- condition_and_diagnosis

**Justification:**
- All four are PARTIAL — sub-construct containment applies
- Parent entity pios (top-level authority node) is the canonical anchor — pios narrative not in scope of I.5 derivative expansion, but the step nodes are
- All four have the same structure and authority conditions — batch expansion is efficient
- Natural ordering: steps 01–04 in sequence

**Narrative depth:** minimal (level 1) for all four

**Prerequisite:** Batch 2 complete (signal_infrastructure grounding is relevant to pipeline steps).

---

### Batch 5 — Named Constructs and Research Surface

**Entities:**
- research
- program_intelligence_advisory

**Justification:**
- research: PARTIAL readiness, live page, missing authority codes and outbound relationships — narrative scope limited to node file structural facts
- program_intelligence_advisory: PARTIAL readiness, no backing page, narrative scope limited to structural role under krayu
- Both have lower graph centrality and structural completeness than Batches 1–4
- research narrative depends on the completion backlog gap BL-008 (missing auth) being acknowledged — narrative must not overclaim

**Narrative depth:** minimal (level 1) for both

**Prerequisite:** Batch 1 complete (research is L1 under program_intelligence).

---

### Not Batched — BLOCKED

**Entities:**
- early_warning_signals
- execution_blindness_examples
- why_dashboards_fail_programs

**Reason:** publish_status = preview-pending-publish. Authority container status = missing. Block conditions documented in BL-011, BL-014, BL-017, BL-012, BL-015, BL-018.

These entities are excluded from all expansion batches until:
1. publish_status transitions to live, AND
2. Authority grounding is established in governance/architecture/ documents.

No narrative may be written for these entities within I.5.

---

## 4. First Expansion Batch — Explicit Definition

**Batch 1** is the first expansion batch.

**Entities in Batch 1:**
1. execution_stability_index
2. risk_acceleration_gradient
3. execution_blindness
4. program_intelligence_gap

**Authorized narrative depth:** standard (level 2)

**Authorized sections per canonical_narrative_expansion_model:**
- § What It Is
- § Where It Sits
- § How It Connects
- § What It Is Not
- § Canonical Source

**Authority constraint on Batch 1 narrative:**
- All four entities have authority_container_status = partial
- Narrative scope must not exceed the partial binding boundary per NDP-04
- DRIFT-001 (open, SSZ/SSI mis-layering) must be observed for execution_stability_index and risk_acceleration_gradient: narrative must not claim canonical L3 placement as resolved — only as the canonical home stated in architecture docs

**Surface deployment upon completion:**
- All four have live WEB surface pages
- Narrative output is immediately usable for WEB surface at standard depth
- GOV surface use requires authority codes to be resolved first (BL-001, BL-003)

---

## 5. Batch Execution Sequence

```
Batch 1 → Batch 2 → Batch 3 → Batch 4 → Batch 5
   ↑
FIRST EXPANSION BATCH
(Phase 2 of I.5 begins here)
```

No batch may begin until the preceding batch is complete.
BLOCKED entities are not sequenced.
