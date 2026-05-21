# Design Rationale — Semantic Proposition Engine

## 1. Why SPE Exists Alongside SDC

The Semantic Derivation Compiler (SDC, `scripts/pios/sdc/`) was built for BlueEdge: it parses HTML documentation files with CSS-class-encoded semantic structure (`.m`, `.mn`, `.md`) and produces candidate CSR (Client Semantic Registry) entries — a taxonomy of DOMAINs, capabilities, and components.

NetBox has no HTML semantic evidence. Its semantic substrate is the PATH A structural artifacts: centrality rankings, import topology, CEU reconciliation, hero moments, code graph enrichment. These artifacts are structurally richer than BlueEdge's documentation evidence but semantically different — they don't map to a CSR taxonomy.

The SPE produces **semantic_propositions** (spine objects), not CSR entries. Propositions are structural claims about the codebase — dominance patterns, coupling topology, authority gradients, tier grounding — anchored to specific evidence.

**SDC → CSR → crosswalk → reconciliation** (BlueEdge path)
**SPE → semantic_propositions → operator review** (PATH A structural path)

Both coexist. SDC remains operational. The SPE is a parallel module — not a replacement.

## 2. Why Semantic Sub-Types Are Lineage Fields

The 8 canonical spine classes are LOCKED per PROGRAM_INTELLIGENCE_EVOLUTION_MODEL.md:
- evidence_object, semantic_proposition, replay_corridor, convergence_observation, qualification_transition, hero_moment, doctrine_evolution_record, executive_projection_snapshot

Semantic sub-types (`semantic_relationship`, `semantic_grounding`, `semantic_conflict`, `semantic_refinement`) describe the nature of a derivation relationship, not a distinct spine object class. They are modeled as the `semantic_type` field on each `LineageEvent`:

- **GROUNDING** — proposition directly grounded in structural evidence
- **RELATIONSHIP** — proposition captures inter-CEU or inter-cluster structural relationship
- **CONFLICT** — derivation encountered contradictory evidence (recorded, not suppressed)
- **REFINEMENT** — proposition refines a prior derivation based on additional evidence

This keeps the spine schema clean while preserving rich semantic classification within the derivation lineage record. Consumers query lineage events by `semantic_type` to understand derivation character.

## 3. Why Learning Context Records Influence at Derivation-Step Level

The `learning_context` field on each lineage event answers: "Did any active learning event influence THIS specific derivation step, and HOW?"

Not "which learnings were active during the run" (that's the activation manifest from Phase 10L). The derivation-step-level record captures:
- event_id: which learning event
- influence: HOW it affected this step (threshold change, awareness, method adjustment)
- influence_type: AWARENESS_ONLY (event active but no threshold change) vs THRESHOLD_ADJUSTMENT vs METHOD_CHANGE

Currently all Phase 7 learning events are at PROPOSED state, so influence_type is AWARENESS_ONLY. When learnings reach CONSUMABLE state and actually modify derivation parameters, this field records the specific adjustment.

## 4. Controlled Evolution Relationship

SDC and SPE are designed for eventual convergence:
- Both use confidence scoring (SDC: confidence_scorer.py, SPE: confidence_engine.py)
- Both use review queues (SDC: review_queue_generator.py, SPE: review_queue_emitter.py)
- Both produce CANDIDATE-grade output with L3 ceiling
- Both are pipeline-integrated (SDC: Phase 3b, SPE: Phase 3c)
- SPE reuses LLM adapter from SDC for INFERRED tier

The SDC serves BlueEdge's HTML evidence path. The SPE serves PATH A structural evidence path. As the system matures, shared infrastructure (confidence patterns, review queue patterns, learning hooks) may be extracted into a common derivation framework. Phase 9 does not force this — it establishes the SPE as a parallel operational module.
