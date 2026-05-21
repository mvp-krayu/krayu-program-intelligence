# Execution Report — PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

## Stream Identity

- **Stream ID:** PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01
- **Classification:** G1 — Architecture-Mutating
- **Branch:** feature/PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01
- **Baseline commit:** 4d5dc18 (main)
- **Specimen:** netbox / run_github_netbox_20260520_134600
- **Date:** 2026-05-21
- **Roadmap Phase:** 9

## Pre-Flight

- [x] git_structure_contract.md loaded
- [x] Repository: krayu-program-intelligence
- [x] Branch: feature/PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01
- [x] PIOS_CURRENT_CANONICAL_STATE.md loaded
- [x] TERMINOLOGY_LOCK.md loaded
- [x] CANONICAL_OPERATIONAL_ROADMAP.md referenced (Phase 9)

## Objective

Deliver the Semantic Proposition Engine — first operational activation of governed semantic DNA over the stabilized PATH A spine. The SPE produces semantic_propositions (spine objects) from structural artifacts, NOT CSR taxonomy entries. It runs alongside the existing SDC (BlueEdge backward compatibility preserved).

---

## 1. Architecture

### SPE vs SDC

| Dimension | SDC (existing) | SPE (new) |
|-----------|---------------|-----------|
| Input | HTML documentation files | PATH A structural artifacts |
| Output | Candidate CSR entries | Semantic propositions (spine objects) |
| Pipeline phase | 3b | 3c |
| Target specimen | BlueEdge | NetBox + all PATH A specimens |
| Derivation method | 3-tier extraction from HTML | 6 deterministic class derivers |
| AI involvement | Tier 3 extraction | INFERRED tier (optional, gated) |
| Location | scripts/pios/sdc/ | scripts/pios/spe/ |

### SPE Module Structure

```
scripts/pios/spe/
├── __init__.py
├── input_loader.py          — PATH A input bundle with readiness validation
├── proposition_schema.py    — Canonical schema + SPE extensions
├── derivation_engine.py     — 6 deterministic class derivers
├── confidence_engine.py     — Multi-factor confidence scoring
├── learning_emitter.py      — PROPOSED learning event generation
├── review_queue_emitter.py  — Operator review triggers
├── output_emitter.py        — Run directory output writer
└── inferred_proposer.py     — AI-gated INFERRED tier (optional)

scripts/pios/semantic_proposition_engine.py  — Orchestrator
```

### Six Derivation Classes

| Class | Source | Tier | NetBox Yield |
|-------|--------|------|-------------|
| STRUCTURAL_DOMINANCE | Centrality top-N per domain | DIRECT_EVIDENCE | 6 |
| COUPLING_PATTERN | Cross-domain import matrix | DIRECT_EVIDENCE | 34 |
| AUTHORITY_TOPOLOGY | Import vs inheritance authority | DERIVED | 10 |
| TIER_GROUNDING | CEU tier + reconciliation evidence | DIRECT_EVIDENCE or DERIVED | 12 |
| HERO_MOMENT_GROUNDING | Hero moment cross-reference | DERIVED | 6 |
| CLUSTER_ARCHITECTURE | Topology cluster CEU distribution | DERIVED | 6 |

---

## 2. Derivation Results (NetBox)

### Proposition Summary

| Metric | Value |
|--------|-------|
| Total propositions | 74 |
| DIRECT_EVIDENCE | 51 |
| DERIVED | 23 |
| INFERRED | 0 (not enabled) |
| Mean confidence | 0.843 |
| Min confidence | 0.524 |
| Max confidence | 0.972 |
| Authority ceiling | L3 (all) |
| Status | CANDIDATE (all) |

### Confidence Distribution

| Range | Count |
|-------|-------|
| High (≥0.80) | 51 |
| Medium (0.60–0.79) | 14 |
| Low (0.45–0.59) | 9 |
| Very low (<0.45) | 0 |

### Learning Events Emitted

- 3 PROPOSED events (reconciliation friction, hero moment coverage gaps)
- All at capability_class: SEMANTIC_PROPOSITION
- Propagation target: SEMANTIC_PROPOSITION_ENGINE

### Review Queue

- 0 items (all propositions above 0.50 confidence threshold)
- 4 trigger types operational: LOW_CONFIDENCE, INFERRED_TIER, CONFLICTING_ELEMENT, COVERAGE_GAP

---

## 3. Key Design Decisions

### 3a. Semantic Sub-Types as Lineage Fields

The 8 canonical spine classes are LOCKED. Semantic sub-types (GROUNDING, RELATIONSHIP, CONFLICT, REFINEMENT) are modeled as `semantic_type` on lineage events, not new spine classes.

### 3b. Learning Context at Derivation-Step Level

Each lineage event carries `learning_context` recording WHICH active learnings influenced THIS specific derivation step and HOW. Currently AWARENESS_ONLY (Phase 7 events at PROPOSED state).

### 3c. Replay Corridor References

Each proposition carries `replay_corridor_refs` — the replay corridors from which it is derivable. Enables replay validation of semantic derivation.

### 3d. Replayability

Derivation hash is computed from proposition content excluding timestamps and confidence scores. Two consecutive runs on identical inputs produce identical derivation hashes. Verified.

---

## 4. Pipeline Integration

Phase 3c inserted between Phase 3b (SDC) and Phase 4 (CEU Grounding):
- Gates: reconciliation_state.json + structural_centrality.json must exist
- Idempotent: skips if spe_derivation_report.json already present
- Failure isolated: pipeline continues on Phase 3c failure
- SDC (Phase 3b) completely unmodified

---

## 5. Governance Compliance

- L3 authority ceiling on all propositions — no auto-promotion
- All status=CANDIDATE — operator review required for any progression
- INFERRED tier requires explicit opt-in (`--enable-semantic-derivation`)
- No CSR produced — SPE produces spine objects, not CSR taxonomy
- SDC backward compatibility preserved — zero modifications to scripts/pios/sdc/
- Learning events at PROPOSED state — operator review required for promotion

---

## Artifacts Produced

### SPE Modules (scripts/pios/spe/)
- `__init__.py`, `proposition_schema.py`, `input_loader.py`
- `derivation_engine.py`, `confidence_engine.py`
- `learning_emitter.py`, `review_queue_emitter.py`, `output_emitter.py`
- `inferred_proposer.py`

### Orchestrator
- `scripts/pios/semantic_proposition_engine.py`

### Modified
- `scripts/pios/run_client_pipeline.py` — Phase 3c
- `docs/governance/learning/learning_registry.json` — SEMANTIC_PROPOSITION class

### Run Directory Outputs (NetBox)
- `spine/spine_objects.json` — 74 semantic_propositions appended
- `semantic/spe/proposition_derivation_lineage.json`
- `semantic/spe/proposition_review_queue.json`
- `semantic/spe/spe_derivation_report.json`
- `governance/learning_events.jsonl`

### Stream Governance
- `docs/pios/PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01/execution_report.md`
- `docs/pios/PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01/validation_log.json`
- `docs/pios/PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01/file_changes.json`
- `docs/pios/PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01/CLOSURE.md`
- `docs/pios/PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01/IMPLEMENTATION_SEMANTICS.md`
- `docs/pios/PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01/DESIGN_RATIONALE.md`
