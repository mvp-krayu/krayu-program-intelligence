# Layer Adjudication Report

Stream: A.1 — PiOS L1-L6 Architecture Reconstruction
Date: 2026-03-28

---

## Adjudication Question

**Is L1-L6 as a complete 6-layer model supported by evidence in this repo?**

**Verdict: MODIFIED**

---

## Supported Layers (with evidence)

### Layer A1 — Observability Layer (Three-Layer Model)

**Status: CONFIRMED — HIGH confidence**
Anchor: program_intelligence_three_layer_model.md; pios_runtime_architecture.md

- Maps to: 40.2 (Evidence Acquisition), 40.3 (Reconstruction), 40.4 (Telemetry)
- Purpose: Capture execution evidence without interpretation
- Inputs: Source systems (git, CI/CD, issue trackers, deployment platforms)
- Outputs: Evidence snapshot, PEG, telemetry datasets
- Forbidden: Signal interpretation, condition assessment, diagnosis

### Layer A2 — Intelligence Layer (Three-Layer Model)

**Status: CONFIRMED — HIGH confidence**
Anchor: program_intelligence_three_layer_model.md; pios_runtime_architecture.md

- Maps to: 40.5 (Signal Computation), 40.6 (Condition + Diagnosis Activation)
- Purpose: Transform telemetry into interpretable signals and conditions
- Inputs: Telemetry datasets, governed signal definitions, condition models
- Outputs: Signal datasets, condition datasets, diagnosis outputs
- Forbidden: Evidence re-acquisition, executive narrative, structural modification

### Layer A3 — Executive Intelligence Layer (Three-Layer Model)

**Status: CONFIRMED — HIGH confidence**
Anchor: program_intelligence_three_layer_model.md; pios_runtime_architecture.md

- Maps to: 40.7 (Intelligence Synthesis)
- Purpose: Convert signals into decision-grade program insight
- Inputs: Condition datasets, diagnosis outputs
- Outputs: Intelligence objects, evidence-linked packets
- Forbidden: Rendering logic, signal redefinition, diagnosis recalculation

### Layer B4 — Semantic Shaping Layer (L4 fragment)

**Status: SUPPORTED — HIGH confidence for L4 label, OBSERVED for 41.x function**
Anchor: 43.1 Section 10 ("no semantic shaping authority (L4)"); 41.1 semantic_elevation_report.md

- Maps to: 41.x streams (41.1-41.5)
- Purpose: Shape intelligence outputs into semantic representations; maintain signal registry and evidence index
- Key output: 17 domains, 42 capabilities, signal registry, PIE vault, query-signal map

### Layer B5 — Binding + Projection Zone (L5 zone)

**Status: INFERRED for L5 label — MEDIUM confidence; function OBSERVED — HIGH confidence**
Anchor: 43.1 Section 10 ("no presentation assembly responsibility (L5)"); 43.1-43.3, 44.1-44.4 artifacts

- Maps to: 43.x (Binding) + 44.x (Projection)
- Purpose: Deterministically attach governed signals to governed structural nodes; produce structural overlay
- Key rule: No interpretation, no aggregation, no SSZ/SSI

### Layer B6 — Consumer Execution / Runtime Rendering (L6)

**Status: INFERRED for L6 label — MEDIUM confidence; function OBSERVED — HIGH confidence**
Anchor: 43.1 Section 10 ("no runtime rendering responsibility (L6)"); 42.21-42.23, app/execlens-demo/

- Maps to: 42.x (Consumer Execution), app/execlens-demo/
- Purpose: Runtime intake and rendering of governed projection artifacts
- Key rule: No binding creation, no compensation for absent upstream outputs

---

## Not-Supported Layers

### L1 — NOT DEFINED

No anchor found. Stream 00.2 (defining document) absent.
Cannot map to a pipeline stage or function from available evidence.
Status: AMBIGUOUS — L1 is not definable from this repo's evidence.

### L2 — NOT DEFINED

Same as L1. No anchor found.
Status: AMBIGUOUS — L2 is not definable from this repo's evidence.

### L7-L8 — NOT REFERENCED

Not mentioned in any artifact. L0-L8 spans are referenced only in the abstract ("canonical L0-L8 model") without defining L7 or L8.
Status: AMBIGUOUS — undefined.

---

## 51.x Architecture Layer Adjudication

**Verdict: REJECTED**

51.x (ExecLens demo surface) is NOT an architecture layer.

Evidence:
- 40.11/stream_50_handover_capsule.md: Stream 50 authorized to USE 40.x outputs read-only. NOT to recompute or modify.
- 51.x streams are under Stream 50 (Demonstrations), outside PiOS (Stream 40)
- Demo surface explicitly bounded from recomputing signals, conditions, or diagnosis

---

## Layer Model Verdict Summary

| Model | Status | Confidence |
|---|---|---|
| 9-Stage Pipeline (F-A) | CONFIRMED | HIGH |
| Three-Layer Analytical Model (F-B) | CONFIRMED | HIGH |
| L-Number L3 (Signal Derivation) | SUPPORTED by fragment | HIGH |
| L-Number L4 (Semantic Shaping) | SUPPORTED by fragment | HIGH |
| L-Number L5 (Presentation Assembly) | INFERRED zone | MEDIUM |
| L-Number L6 (Runtime Rendering) | INFERRED zone | MEDIUM |
| L1-L6 as complete 6-layer model | NOT CONFIRMED — MODIFIED | LOW |
| L0-L8 as complete model | AMBIGUOUS — defining doc absent | LOW |
| 51.x as architecture layer | REJECTED | HIGH |
