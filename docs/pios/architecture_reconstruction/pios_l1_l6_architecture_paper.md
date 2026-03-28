# PiOS Architecture — Evidence-Based Reconstruction Paper

**Stream:** A.1 — PiOS L1-L6 Architecture Reconstruction
**Branch:** feature/pios-architecture-reconstruction
**Method:** Reverse crawl from evidence — Evidence First
**Date:** 2026-03-28
**Traceability:** All claims anchored. See architecture_evidence_inventory.md, document_lineage_report.md.

---

## 1. Executive Statement

This paper reconstructs the PiOS architectural layer model from observed evidence in the Krayu repository. It does not assert what the architecture should be. It derives what the architecture is, as evidenced by existing artifacts.

**L1-L6 verdict: MODIFIED.**

The evidence supports a richer model than 6 layers. The canonical L0-L8 model referenced in binding and projection documents cannot be fully reconstructed from this repo (defining document absent). A 9-stage pipeline model and a 3-layer analytical model are confirmed from evidence.

---

## 2. What PiOS Is

OBSERVED — pios_runtime_architecture.md

PiOS (Program Intelligence Operating System) operationalizes the Program Intelligence discipline by transforming governed evidence inputs into structured program intelligence outputs through a deterministic runtime pipeline.

PiOS sits between:
- Analytical discipline models (Stream 10)
- Real program execution environments
- Downstream experience layers (demo surfaces, Signäl platform)

PiOS does NOT define analytical theory. PiOS does NOT define commercialization. PiOS does NOT define product experience rendering.

---

## 3. Canonical Pipeline

OBSERVED — pios_pipeline_specification.md, confirmed by per-stream execution manifests

```
Evidence Acquisition (40.2)
  → Program Reconstruction (40.3)
  → Telemetry Extraction (40.4)
  → Signal Computation (40.5)
  → Condition Activation (40.6)
  → Diagnosis Activation (40.6)
  → Intelligence Synthesis (40.7)
  → Agentic Orchestration (40.8)
  → Feedback (40.9)
```

Rules (OBSERVED — pios_execution_contract.md):
- Same evidence snapshot + same model versions → same outputs (determinism)
- No stage may silently proceed if upstream gate fails (fail-closed)
- Every downstream artifact retains lineage to upstream evidence (traceability)
- No unbounded agentic override of analytical or governance rules

---

## 4. Three-Layer Analytical Model

OBSERVED — program_intelligence_three_layer_model.md, pios_runtime_architecture.md

The canonical analytical architecture:

| Layer | Name | Runtime Streams | Core Function |
|---|---|---|---|
| 1 | Observability Layer | 40.2, 40.3, 40.4 | Capture without interpretation |
| 2 | Intelligence Layer | 40.5, 40.6 | Signal + condition + diagnosis |
| 3 | Executive Intelligence Layer | 40.7 | Decision-grade program insight |

The Three-Layer Model and 9-Stage Pipeline are complementary — the Three-Layer Model describes analytical function; the 9-Stage Pipeline describes operational execution.

---

## 5. Extended Architecture (beyond 40.x)

RECONSTRUCTED from observed 41.x, 42.x, 43.x, 44.x artifacts

The PiOS pipeline output flows through four additional functional layers before reaching the consumer surface:

### 5.1 Semantic Shaping Layer (41.x)

OBSERVED — 41.1/semantic_elevation_report.md, 41.4/signal_registry.json

Function: Transform structural components into semantic domains and capabilities; maintain signal registry; produce navigation surface (PIE vault).

Input: Pipeline outputs from 40.3 (89 components) and 40.5 (signals)
Output: 17 domains, 42 capabilities, signal registry (5 signals), evidence index, query-signal map, PIE vault

Evidence anchor for L4 label: 43.1 Section 10 explicitly states 43.x holds "no semantic shaping authority (L4)" — confirming 41.x = L4.

### 5.2 Signal-to-Structure Binding Layer (43.x)

OBSERVED — 43.1/signal_to_structure_binding.md

Function: Deterministically attach governed signal outputs to governed structural nodes. Non-interpretive. Non-mutative. Fail-closed on evidence.

Rule: 43.x does not compute. It binds. It does not shape. It projects. It does not invent. It attaches what already exists.

Prohibited: SSZ, SSI, signal creation, topology mutation, narrative generation, consumer-side compensation.

### 5.3 Structural Overlay Projection Layer (44.x)

OBSERVED — 44.1/structural_overlay_projection_definition.md, 44.2/projection_attachment_contract.md

Function: Attach validated binding payloads to authoritative structural nodes. Produce structural overlay for consumer consumption. Non-semantic. Non-accumulative. Refresh-based lifecycle.

Rule: 44.x does not compute. It projects. 44.x does not assess. It attaches. 44.x does not derive. It preserves.

Data flow through 44.x:
```
43.3 validated payload → 44.1 projection → 44.3 emphasis → 44.2 attachment → structural overlay
```

### 5.4 Consumer Execution Layer (42.x)

OBSERVED — 42.21/changelog.md, 42.22/exposure_validation_report.md, 42.23/rewiring_plan.md, PIOS-42.1 contract

Function: Runtime intake of governed projection artifacts; render intelligence for query execution; produce ExecLens surface.

Rule: 42.x consumes bindings. It does not generate them. No compensation behavior.
Key traversal (PIOS-42.1 contract): QUERY → SIGNAL → EVIDENCE → NAVIGATION → OUTPUT

---

## 6. L-Number Layer Model Adjudication

INFERRED from fragments in 43.1, 44.1, 44.2, 43.2, 43.3. Defining document (Stream 00.2) ABSENT.

| L-Number | Label | Mapped Stream | Confidence |
|---|---|---|---|
| L3 | Signal Derivation | 40.5 | HIGH |
| L4 | Semantic Shaping | 41.x | HIGH |
| L5 | Presentation Assembly | 43.x–44.x zone (INFERRED) | MEDIUM |
| L6 | Runtime Rendering | 42.x (INFERRED) | MEDIUM |
| L0, L1, L2, L7, L8 | Undefined | — | NONE |

**L1-L6 as a complete model: NOT CONFIRMED.** The evidence supports L3-L6 (partial) but L1-L2 have no anchor. The complete 6-layer framing cannot be adjudicated without Stream 00.2.

---

## 7. What 51.x Is

OBSERVED — 40.11/stream_50_handover_capsule.md, DEMO_CONTEXT.md

51.x (ExecLens demo surface) is a demonstration surface, not an architecture layer.

- Stream 50 is authorized to USE 40.x outputs as read-only — explicitly forbidden from recomputing or modifying
- 51.x operates under Stream 50 (Demonstrations), outside the PiOS runtime (Stream 40)
- The demo surface traverses locked artifacts and renders intelligence — it does not derive intelligence

**Verdict: 51.x EXCLUDED from architecture layer model.**

---

## 8. Boundary Summary

| Boundary | Rule | Evidence |
|---|---|---|
| 40.x → 41.x | 40.x produces; 41.x consumes and shapes | 43.1: "produced at L3 and shaped at L4" |
| 41.x → 43.x | 41.x outputs are immutable inputs to 43.x | 43.1 Section 4 |
| 43.x → 44.x | 43.3 validated payload is only valid input to 44.x | 44.1 Section 2 |
| 44.x → 42.x | 44.2 projection artifact consumed by 42.21 intake | 42.21 changelog |
| 42.x ≠ 43.x | 42.x cannot produce bindings | 43.1 Section 9 |
| 40.7 ← 40.6 only | 40.7 input boundary: 40.6 condition artifacts only | diagnosis_boundary_enforcement.md |
| 51.x ≠ architecture | 51.x is demo surface; architectural exclusion confirmed | 40.11 handover capsule |

---

## 9. Ambiguities

7 ambiguities registered. Highest impact:

**AMB-001 (HIGH):** Stream 00.2 — Canonical Layer Model Restoration absent. L1, L2, L7, L8 cannot be defined from available evidence. Resolution path: obtain Stream 00.2 from governance authority.

**AMB-007 (MEDIUM):** 75.x interpretation layer referenced but absent. Demo surface routes around it as "blocked."

See 06_Ambiguity_Register.md for complete register.

---

## 10. Verdict

| Question | Verdict |
|---|---|
| Is L1-L6 confirmed? | MODIFIED — L3-L6 partially supported; L1-L2 undefined; complete 6-layer model not confirmed |
| Is the 9-Stage Pipeline supported? | CONFIRMED — HIGH confidence |
| Is the Three-Layer Model supported? | CONFIRMED — HIGH confidence |
| Is 51.x an architecture layer? | REJECTED — demo surface only |
| Is the extended chain (41.x, 43.x, 44.x, 42.x) supported? | CONFIRMED — HIGH confidence for functions; MEDIUM for L-number labels |

---

## 11. Traceability Index

All claims in this paper trace to at least one of:

- pios_pipeline_specification.md (canonical pipeline)
- pios_runtime_architecture.md (layer mapping)
- program_intelligence_three_layer_model.md (Three-Layer Model)
- pios_execution_contract.md (execution rules)
- 43.1/signal_to_structure_binding.md (L4-L6 fragments; boundary enforcement)
- 44.1/structural_overlay_projection_definition.md (projection + evidence continuity)
- 40.7/diagnosis_boundary_enforcement.md (stage boundary enforcement)
- 40.11/stream_50_handover_capsule.md (demo surface exclusion)
- 42.22/exposure_validation_report.md (runtime chain provenance)
- governance_master_capsule.md (Evidence First; stream architecture)

Machine outputs: architecture_evidence_inventory.json, document_node_registry.json, document_edge_registry.json, concept_registry.json, layer_candidate_matrix.json, layer_adjudication_matrix.json, ambiguity_register.json

---

*Generated last per contract execution order. All prior artifacts exist and are traceable.*
