# CE.2 — Determinism and Traceability Rules

**Stream:** CE.2 — PiOS Core Engine Internal Contract
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** canonical-layer-model.md (00.2), CE.2_CORE_EXECUTION_MODEL.md

---

## 1. Determinism Rules

### DR-01 — Same Inputs Produce Same Outputs

Given identical 40.4 input artifacts and identical program constants, the full Core execution chain (40.5–40.11) must produce outputs with identical values (excluding timestamp fields).

Verified by: `validate_baseline.py` — canonical hash comparison across repeated runs.

### DR-02 — No Stochastic Behavior

No layer in 40.5–40.11 may use random number generation, probabilistic modeling, or any non-deterministic computation. All computation must be closed-form and rule-governed.

### DR-03 — No Hidden State

No layer may carry internal state across runs unless that state is explicitly declared in a durable artifact (e.g., prior ESI manifest for RAG window accumulation). Undeclared inter-run state is forbidden.

### DR-04 — No Heuristic Invention

No layer may produce an output value that is not derivable by tracing the computation from authorized inputs through governed rules. Heuristic approximation is forbidden.

### DR-05 — Timestamp Fields Are Not Content

`generated` / `**Generated:**` fields carry metadata only. They are explicitly excluded from determinism checks. All non-timestamp fields must be deterministic.

### DR-06 — UNDEFINED Is a Valid Deterministic State

A value of UNDEFINED produced consistently from missing inputs is deterministic and correct. Transforming UNDEFINED into a numerical estimate is a determinism violation.

### DR-07 — PARTIAL Mode Is Governed

ESI PARTIAL mode activates deterministically when CG-01 is active (PES-ESI-02 unavailable). The PARTIAL weights are fixed: P01=0.3125, P03=0.3125, P04=0.2500, P05=0.1250. These weights must not vary.

---

## 2. Traceability Rules

### TR-01 — Every Output Maps to an Authorized Input

Every value in every Core output must be traceable to:
1. A 40.4 metric value (AT-NNN or DT-NNN), or
2. A program constant derived from 40.4 structural telemetry, or
3. A governed computation rule applied to (1) or (2)

If traceability cannot be shown → output is INVALID.

### TR-02 — Layer Lineage Must Be Preserved

Every output artifact must declare its layer of origin and the layer chain it consumed. Example:

```
input_source: 40.4
layer_chain: 40.4 → 40.5 → 40.6 → ...
```

### TR-03 — TC Class Linkage Is Mandatory

Every normalization function (NF-01..NF-07) must declare which TC class it derives from, and which AT/DT metric supplies its input. This linkage is the primary evidence chain.

| Normalization | TC Class | 40.4 Metric |
|---|---|---|
| NF-01 | TC-01 | AT-001 |
| NF-02 | TC-07 | (variance, requires N≥3 windows) |
| NF-03 | TC-02 | DT-007 |
| NF-04 | TC-03 | DT-001 + DT-003 |
| NF-05 | TC-04 | DT-006 |
| NF-06 | TC-05 | AT-007 |
| NF-07 | TC-08 | AT-009 + DT-008 |

### TR-04 — Gap Declarations Are Traced

Every UNDEFINED, PARTIAL, or INSUFFICIENT_WINDOWS state must reference its source gap:
- CG-01: TC-09 (cost/budget telemetry) not defined in 40.4
- Time-series: metric is time-series class; no value in static 40.4 catalog
- N<2: insufficient windows for RAG rate computation
- N<3: insufficient windows for RAG acceleration; NF-02 neutral fallback applied

### TR-05 — Input Contract Identity Is Verified at 40.11

At loop closure, 40.11 must confirm that the 40.4 artifacts used as inputs match the frozen SHA-256 hashes in `input_contract_lock.json`. A mismatch invalidates the run.

### TR-06 — Derivation Lineage Is Archived

The ESI manifest (`esi_manifest.json`) and derivation execution manifest (`derivation_execution_manifest.md`) are the durable lineage records. They must be produced on every Core run and retained.

---

## 3. Failure Conditions

| Condition | Classification | Required Response |
|---|---|---|
| 40.4 input hash mismatch | INTEGRITY VIOLATION | STOP — report at 40.11 |
| Signal value outside governed range | COMPUTATION VIOLATION | STOP — do not propagate |
| Heuristic value substituted for UNDEFINED | DETERMINISM VIOLATION | STOP — do not propagate |
| Layer output missing required fields | TRACEABILITY VIOLATION | STOP — do not pass to next layer |
| Undeclared state carried between runs | DETERMINISM VIOLATION | STOP |
| Cross-layer access bypassing sequence | BOUNDARY VIOLATION | STOP |

All failures must be declared in the 40.11 integrity validation record. Silent failure is forbidden.
