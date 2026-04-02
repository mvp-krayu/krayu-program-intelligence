# CE.2 — Core Execution Model

**Stream:** CE.2 — PiOS Core Engine Internal Contract
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** canonical-layer-model.md (00.2), docs/pios/40.16/ baseline, docs/pios/40.4/
**Scope:** 40.5 → 40.11 (PiOS Core Engine only)

---

## 1. Execution Boundary

| Boundary | Value |
|---|---|
| Core entry point | 40.5 — Signal Computation |
| Core exit point | 40.11 — Loop Closure and Integrity Validation |
| Upstream input boundary | 40.4 telemetry outputs (read-only handoff) |
| Downstream output boundary | Defined output contract surface (CE.2_CORE_OUTPUT_CONTRACT.md) |

Everything upstream of 40.5 (ingestion, normalization, telemetry extraction) is outside Core.
Everything downstream of 40.11 (semantic elevation, ENL navigation, rendering, demo) is outside Core.

---

## 2. Sequential Execution Chain

The Core Engine executes as a strict linear transformation sequence:

```
40.4 outputs (read-only input boundary)
    │
    ▼
40.5 — Signal Computation
    │   consumes: 40.4 AT/DT telemetry metrics + program constants
    │   produces: computed signal primitives (ESI, RAG, and governed derivatives)
    ▼
40.6 — Condition Activation
    │   consumes: 40.5 signal primitives
    │   produces: condition state descriptors (structured state only)
    ▼
40.7 — Diagnosis and Intelligence Synthesis
    │   consumes: 40.6 condition states + 40.5 signal primitives (evidence anchor)
    │   produces: evidence-bound diagnosis structures + intelligence packets
    ▼
40.8 — Delivery Packaging
    │   consumes: 40.7 diagnosis + intelligence outputs
    │   produces: delivery-ready packages (meaning preserved, lineage intact)
    ▼
40.9 — Feedback Registration
    │   consumes: 40.7 diagnosis outputs + 40.8 packaged delivery events
    │   produces: feedback registration records (recurrence, coverage, gap logs)
    ▼
40.10 — Orchestration Directive Formation
    │   consumes: 40.9 feedback records + governed rule set
    │   produces: orchestration directives (control instructions only)
    ▼
40.11 — Loop Closure and Integrity Validation
        consumes: outputs of 40.5–40.10 + input contract (40.4)
        produces: closure assertion + integrity validation record
```

---

## 3. Execution Rules

| Rule ID | Rule |
|---|---|
| ER-01 | Each layer consumes only its authorized prior-layer outputs |
| ER-02 | No layer may skip its immediate predecessor |
| ER-03 | No back-channel access between non-adjacent layers |
| ER-04 | No external data injection between layers |
| ER-05 | No layer may access pre-40.4 ingestion logic directly |
| ER-06 | No layer may access 41.x or 42.x behavior directly |
| ER-07 | Layer output is valid only after its layer's authorized transformation completes |
| ER-08 | If a layer's required input is UNDEFINED or PARTIAL, the layer must propagate that state — not resolve it |
| ER-09 | Execution halts at 40.11 without downstream continuation by Core |
| ER-10 | 40.4 inputs are read-only; Core does not modify them |

---

## 4. Canonical Layer Mapping

| Core Layer | Stream | Canonical Layer (00.2) | Role |
|---|---|---|---|
| Signal Computation | 40.5 | L3 — Derivation Layer | Compute governed signal primitives from telemetry |
| Condition Activation | 40.6 | L3 — Derivation Layer | Derive structural state descriptors |
| Diagnosis / Intelligence Synthesis | 40.7 | L3→L4 boundary | Evidence-bound diagnosis (L3); controlled framing (L4 boundary) |
| Delivery Packaging | 40.8 | L4→L5 boundary | Semantic preservation (L4); assembly preparation (L5 boundary) |
| Feedback Registration | 40.9 | L3 | Structured registration without interpretation |
| Orchestration Directive Formation | 40.10 | L3→L4 | Governed rule application (L3); controlled directive framing (L4) |
| Loop Closure | 40.11 | L8 | Integrity validation and governance assertion |

---

## 5. Input Contract Reference

Core consumes the following from 40.4 (read-only):

| 40.4 Artifact | Role in Core |
|---|---|
| activity_telemetry.md | AT metric values for TC observation derivation |
| delivery_telemetry.md | DT metric values for TC observation derivation |
| structural_telemetry.md | ST constants used for program constant derivation |
| telemetry_schema.md | Metric type and classification authority |
| telemetry_surface_definition.md | Surface identity for traceability |
| telemetry_traceability_map.md | Evidence lineage verification |

Input identity locked at: `pios_core_40.16_input_contract_0.1`
(docs/pios/40.16/baseline/input_contract_lock.json)

---

## 6. Baseline Reference

Core execution is anchored to:

- Baseline ID: `pios_core_40.16_baseline_0.1`
- Baseline location: `docs/pios/40.16/baseline/`
- Locked at commit: `32a083a` (identity lock), `39c3988` (input contract freeze)
- Baseline run state: ESI=UNDEFINED (PARTIAL, CG-01), RAG=INSUFFICIENT_WINDOWS (N=1)

This baseline represents the initial reconstructable state before live observation windows are available.
