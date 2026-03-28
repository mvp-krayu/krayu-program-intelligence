---
title: PiOS Layer Model
type: layer-model
status: RECONSTRUCTED
confidence: HIGH
anchors: [pios_pipeline_specification.md, pios_runtime_architecture.md, program_intelligence_three_layer_model.md, 43.1, 44.1]
date: 2026-03-28
---

# PiOS Layer Model

## Status

- 9-Stage Pipeline Model: OBSERVED — HIGH confidence
- Three-Layer Analytical Model: OBSERVED — HIGH confidence
- L-Number Model (L0-L8 / L1-L6): AMBIGUOUS — LOW confidence (defining document absent)

---

## Canonical Pipeline (9 Stages)

OBSERVED — pios_pipeline_specification.md, pios_runtime_architecture.md

```
Evidence Acquisition (40.2)
→ Program Reconstruction (40.3)
→ Telemetry Extraction (40.4)
→ Signal Computation (40.5)
→ Condition Activation (40.6)
→ Diagnosis Activation (40.6)
→ Intelligence Synthesis (40.7)
→ Agentic Orchestration (40.8)
→ Feedback and Continuous Improvement (40.9)
```

Each stage is sequential. No stage may be skipped.
Same inputs → same outputs (deterministic).

---

## Three-Layer Analytical Model

OBSERVED — program_intelligence_three_layer_model.md, pios_runtime_architecture.md

| Layer | Name | Maps to Streams | Purpose |
|---|---|---|---|
| Layer 1 | Observability Layer | 40.2, 40.3, 40.4 | Capture execution evidence without interpretation |
| Layer 2 | Intelligence Layer | 40.5, 40.6 | Transform telemetry into interpretable signals |
| Layer 3 | Executive Intelligence Layer | 40.7 | Convert signals into decision-grade insight |

---

## Extended Layer Chain (beyond 40.x pipeline)

RECONSTRUCTED from evidence in 43.1, 44.1, 41.x, 42.x artifacts

```
[Three-Layer Analytical Model / 9-Stage Pipeline]
       ↓
Semantic Shaping Layer (41.x)        ← L4 fragment in 43.1
       ↓
Signal-to-Structure Binding (43.x)   ← between L4 and L5
       ↓
Structural Overlay Projection (44.x) ← between L4/L5 and L6
       ↓
Consumer Execution / Runtime (42.x)  ← L6 fragment in 43.1
       ↓
Demo Surface (51.x) — NOT an architecture layer
```

---

## L-Number Fragments (AMBIGUOUS — LOW confidence)

Defining document (Stream 00.2) absent. Fragments only.

| L-Number | Label | Evidence Anchor | Stream | Confidence |
|---|---|---|---|---|
| L3 | Signal Derivation | 44.1 Section 2: "L3 — signal derivation (authoritative)" | 40.5 | HIGH |
| L4 | Semantic Shaping | 43.1 Section 10: "no semantic shaping authority (L4)" | 41.x | HIGH |
| L5 | Presentation Assembly | 43.1 Section 10: "no presentation assembly responsibility (L5)" | 43.x-44.x (INFERRED) | MEDIUM |
| L6 | Runtime Rendering | 43.1 Section 10: "no runtime rendering responsibility (L6)" | 42.x (INFERRED) | MEDIUM |
| L0-L2 | UNDEFINED | No anchor in this repo | UNKNOWN | NONE |
| L7-L8 | UNDEFINED | No anchor in this repo | UNKNOWN | NONE |

---

## Layer Boundary Rules

OBSERVED — pios_execution_contract.md, 40.7/diagnosis_boundary_enforcement.md

- No evidence → no reconstruction
- No reconstruction → no telemetry
- No telemetry → no signals
- No signals → no conditions
- No conditions → no diagnosis
- No diagnosis → no intelligence
- Upstream layers must not be accessed from downstream (enforced at 40.7 input boundary)
- Consumer layer (42.x) must not produce bindings — receives only governed outputs
