# Risk Acceleration Gradient — Narrative Expansion

Stream: I.5 — Canonical Narrative Expansion
Phase: 2 — Narrative Expansion (Batch 1)
Entity: risk_acceleration_gradient
Narrative Depth: standard (level 2)
Authority: nodes/risk_acceleration_gradient.md | derivative_entity_graph_map.md | derivative_entity_dependency_map.md
Gap Register: NG-003, NG-004, NG-005
Date: 2026-03-31

---

## Risk Acceleration Gradient

### What It Is

Dynamic risk measurement model. Captures how execution risk evolves over time — measuring rate of change, acceleration, and cross-boundary propagation of risk within a program environment.

The dynamics-measurement construct for program intelligence. Answers: "How fast is the program moving — and in which direction?"

### Where It Sits

risk_acceleration_gradient holds two simultaneous placements in the derivative entity graph, both documented in derivative_entity_graph_map.md.

Primary placement: depth-1 derivative entity under the program_intelligence authority node (L0). Operates as a standalone route at /risk-acceleration-gradient/ with a live backing page.

Cross-classified placement: the fifth named dimension of execution_stability_index, at depth 2 under program_intelligence via the ESI parent. This cross-classification is a documented structural fact (XL-04) — not a duplication. Both placements carry authority. The primary graph position is L1 under program_intelligence.

Canonical layer placement follows the DRIFT-001 condition: the SSZ analogue in the architecture documents is documented as canonically belonging to L3. Current implementation has moved to L6. Narrative representation follows canonical L3 placement per architecture documents.

Produced by pios. Consumed independently by portfolio_intelligence.

### How It Connects

Inbound relationships (dependency_map entries):
- pios →[P] risk_acceleration_gradient — produced by pios
- program_intelligence →[R] risk_acceleration_gradient — referenced by the top-level authority node
- execution_stability_index →[D] risk_acceleration_gradient — owned as a named dimension by ESI
- execution_blindness →[R] risk_acceleration_gradient — referenced as a resolution-adjacent construct
- early_warning_signals →[R] risk_acceleration_gradient — referenced from the early warning surface
- execution_blindness_examples →[R] risk_acceleration_gradient — referenced from the examples surface
- why_dashboards_fail_programs →[R] risk_acceleration_gradient — referenced from the failure-framing surface

Outbound relationships (dependency_map entries):
- risk_acceleration_gradient →[D] execution_stability_index — dimension_of ESI (cross-link XL-04)
- risk_acceleration_gradient →[C] portfolio_intelligence — consumed by portfolio_intelligence
- risk_acceleration_gradient →[R] execution_stability_index — references ESI independently

### What It Is Not

- Not a top-level authority node
- The three internal dynamics components (rate_of_change, acceleration_of_risk, propagation_across_boundaries) are sub-components of this entity — not separate derivative entities in the Phase 1 inventory
- RAG scoring ranges are internal — not enumerated as separate derivative entities
- Cross-classification as both standalone L1 and dimension_of ESI is a structural fact — the two placements are not contradictory and do not create duplication

### Canonical Source

Authority container status: partial. The entity name "Risk Acceleration Gradient" / "RAG" is not explicitly named in any governance/architecture/ document. Authority binding is indirect — the SSZ (Structural Stability Zero) analogue in the architecture documents is the documented provisional analogue, marked provisional in the source. Narrative scope is bounded by partial authority per NDP-04: no statement may claim the RAG name is explicitly defined in a named architecture document.

Sources (partial binding):
- pios_architecture_whitepaper.md — SSZ analogue documented at L3 (§SSZ/SSI Note), marked provisional; DRIFT-001 open
- pios_technical_appendix.md — dynamic risk signal computation references
- canonical-layer-model.md — L3 derivation layer definition
- program_intelligence_stack.md — dynamics measurement role in stack architecture
- Authority codes: CKR-015 | RSR-07 | RSP-07 | SCI-00
