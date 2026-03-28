# Layer Candidate Report

Stream: A.1 — PiOS L1-L6 Architecture Reconstruction
Date: 2026-03-28

---

## Three Framings Evaluated

### Framing A — 9-Stage Pipeline Model

Source: pios_pipeline_specification.md, pios_runtime_architecture.md
Status: OBSERVED — HIGH confidence

| Stage | Name | Stream | Key Output |
|---|---|---|---|
| 1 | Evidence Acquisition | 40.2 | Evidence snapshot, provenance |
| 2 | Program Reconstruction | 40.3 | PEG, repository map, capability map |
| 3 | Telemetry Extraction | 40.4 | Structural/activity/delivery telemetry |
| 4 | Signal Computation | 40.5 | Signal datasets (8 defined, 1 computed in run_01) |
| 5 | Condition Activation | 40.6 | Condition datasets |
| 6 | Diagnosis Activation | 40.6 | Diagnosis outputs |
| 7 | Intelligence Synthesis | 40.7 | Intelligence objects |
| 8 | Agentic Orchestration | 40.8 | Execution monitoring |
| 9 | Feedback | 40.9 | Structured feedback records |

### Framing B — Three-Layer Analytical Model

Source: program_intelligence_three_layer_model.md
Status: OBSERVED — HIGH confidence

| Layer | Name | Streams | Purpose |
|---|---|---|---|
| 1 | Observability Layer | 40.2-40.4 | Evidence capture without interpretation |
| 2 | Intelligence Layer | 40.5-40.6 | Signal computation and diagnosis |
| 3 | Executive Intelligence Layer | 40.7 | Decision-grade insight |

### Framing C — L-Number Model (L0-L8)

Source: 43.1, 44.1, 44.2, 43.2, 43.3 fragments; Stream 00.2 ABSENT
Status: AMBIGUOUS — LOW confidence (partial fragments only)

| L-Number | Label | Evidence | Confidence |
|---|---|---|---|
| L3 | Signal Derivation | 44.1 Section 2 explicit | HIGH |
| L4 | Semantic Shaping | 43.1 Section 10 explicit | HIGH |
| L5 | Presentation Assembly | 43.1 Section 10 (negative assertion) | MEDIUM |
| L6 | Runtime Rendering | 43.1 Section 10 (negative assertion) | MEDIUM |
| L0-L2, L7-L8 | UNDEFINED | No anchor | NONE |

---

## Extended Functional Layer Candidates (beyond 40.x)

These functional zones are OBSERVED even if L-number labels are AMBIGUOUS:

| Zone | Streams | Function | Evidence |
|---|---|---|---|
| Semantic Shaping | 41.1-41.5 | Signal→semantic domain transformation | 41.1/semantic_elevation_report.md |
| Binding | 43.1-43.3 | Signal-to-node deterministic attachment | 43.1 definition |
| Projection | 44.1-44.4 | Validated binding → structural overlay | 44.1 definition |
| Consumer Execution | 42.x | Governed artifact intake and rendering | 42.21-42.23 changelogs |

---

## Candidate Summary

| Candidate | Support Level | From Framing |
|---|---|---|
| 9-Stage Pipeline (A) | CONFIRMED | F-A |
| Three-Layer Analytical Model (B) | CONFIRMED | F-B |
| Semantic Shaping Zone (41.x) | CONFIRMED functionally; L4 label supported | F-C fragment |
| Binding Zone (43.x) | CONFIRMED; L5 label INFERRED | F-C fragment |
| Projection Zone (44.x) | CONFIRMED; L5 label INFERRED | F-C fragment |
| Consumer Execution Zone (42.x) | CONFIRMED; L6 label INFERRED | F-C fragment |
| L1-L6 complete model | NOT CONFIRMED | F-C missing L0-L2 |
