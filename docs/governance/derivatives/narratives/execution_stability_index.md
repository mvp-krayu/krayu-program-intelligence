# Execution Stability Index — Narrative Expansion

Stream: I.5 — Canonical Narrative Expansion
Phase: 2 — Narrative Expansion (Batch 1)
Entity: execution_stability_index
Narrative Depth: standard (level 2)
Authority: nodes/execution_stability_index.md | derivative_entity_graph_map.md | derivative_entity_dependency_map.md
Gap Register: NG-001, NG-002
Date: 2026-03-31

---

## Execution Stability Index

### What It Is

Composite structural stability indicator. Converts multi-dimensional execution signals into a single 0–100 score measuring whether a program is stable, degrading, or approaching systemic risk. Computed from five named execution dimensions: schedule_stability, cost_stability, delivery_predictability, flow_compression, and risk_acceleration_gradient.

The state-measurement construct for program intelligence. Answers: "Where is the program right now?"

### Where It Sits

execution_stability_index is a depth-1 derivative entity under the program_intelligence authority node. Its canonical placement is the L3 derivation layer of the PiOS canonical layer model — the layer at which multi-dimensional execution signals are formally converted into a composite score. An open drift condition (DRIFT-001) exists: the SSI/SSZ analogues in the architecture documents are documented as canonically belonging to L3; current implementation has moved these constructs to L6. Narrative representation follows the canonical L3 placement stated in architecture documents, not the current implementation layer.

The entity operates as a standalone route at /execution-stability-index/ with a live backing page. It is produced by pios and consumed by portfolio_intelligence for cross-program comparison.

### How It Connects

Inbound relationships (dependency_map entries):
- pios →[P] execution_stability_index — produced by pios
- program_intelligence →[R] execution_stability_index — referenced by the top-level authority node
- risk_acceleration_gradient →[D] execution_stability_index — risk_acceleration_gradient is a named dimension of this entity (cross-classified)
- execution_blindness →[R] execution_stability_index — referenced as a resolution-adjacent construct
- early_warning_signals →[R] execution_stability_index — referenced from the early warning surface
- execution_blindness_examples →[R] execution_stability_index — referenced from the examples surface
- why_dashboards_fail_programs →[R] execution_stability_index — referenced from the failure-framing surface

Outbound relationships (dependency_map entries):
- execution_stability_index →[D] schedule_stability — owns schedule_stability as a named dimension
- execution_stability_index →[D] cost_stability — owns cost_stability as a named dimension
- execution_stability_index →[D] delivery_predictability — owns delivery_predictability as a named dimension
- execution_stability_index →[D] flow_compression — owns flow_compression as a named dimension
- execution_stability_index →[D] risk_acceleration_gradient — owns risk_acceleration_gradient as a named dimension
- execution_stability_index →[C] portfolio_intelligence — consumed by portfolio_intelligence for cross-program comparison
- execution_stability_index →[R] risk_acceleration_gradient — references risk_acceleration_gradient independently

### What It Is Not

- Not a top-level authority node
- Does not produce diagnosis — produces composite stability score only
- ESI score bands (internal scoring ranges) are not separate derivative entities
- risk_acceleration_gradient's cross-classification as both a dimension of this entity and a standalone L1 entity is a documented structural fact — not a duplication
- ExecLens and signal surface definitions are not part of this entity

### Canonical Source

Authority container status: partial. The entity name "Execution Stability Index" / "ESI" is not explicitly named in any governance/architecture/ document. Authority binding is indirect — the SSI (Structural Stability Index) and SSZ (Structural Stability Zero) analogues in the architecture documents serve as the canonical grounding analogues. Narrative scope is bounded by partial authority per NDP-04: no statement may claim the ESI name is explicitly defined in a named architecture document.

Sources (partial binding):
- pios_architecture_whitepaper.md — SSI/SSZ analogues documented at L3 (canonical layer model, §SSZ/SSI Note); DRIFT-001 open
- pios_technical_appendix.md — derivation layer signal computation references
- canonical-layer-model.md — L3 derivation layer definition
- program_intelligence_stack.md — composite indicator role in stack architecture
- Authority codes: CKR-014 | RSR-06 | RSP-06 | SCI-00
