# EX.1 — Runtime Binding Correction Specification

**Stream:** EX.1 — Runtime Binding & Verification
**Artifact type:** BINDING CORRECTION SPECIFICATION
**Date:** 2026-04-03
**Authority:** EX.1

---

## 1. PURPOSE

This document specifies the corrections applied within EX.1 scope and the correction
roadmap for defects that require subsequent streams.

---

## 2. EX.1 SCOPE BOUNDARY (RECAP)

EX.1 MAY:
- Inspect runtime integration structure
- Identify binding gaps
- Add bounded verification artifacts
- Add bounded runtime conformity checks

EX.1 MUST NOT:
- Implement new adapter scripts (EX.3 scope)
- Redesign the demo experience
- Modify existing adapter contracts
- Create new API routes

---

## 3. CORRECTIONS APPLIED IN EX.1

### COR-001 — Runtime Binding Verifier Script (BD-006 partial)

**Defect addressed:** BD-006 (BIND-008 — verification absent)
**File:** `scripts/pios/EX.1/runtime_binding_verifier.py`
**Type:** Bounded verification artifact (EX.1 scope)

**What it does:**
1. Invokes the certified PiOS v0.4 engine (`compute_signals.py` → `activate_conditions.py`)
2. Validates all 4 compliance domains programmatically (per RB-006)
3. Checks regression against certified baseline values (per RB-009..RB-011)
4. Produces `runs/pios/EX.1/<run_id>/validation_result.json` (per RB-007)
5. Produces `runs/pios/EX.1/<run_id>/signal_output.json` and `condition_output.json`

**What it does NOT do:**
- It does not integrate with the 42.x runtime API path (EX.3 scope)
- It does not modify any existing adapter or component
- It does not change engine behavior

**Governance basis:** EX.H1 RB-001..RB-014 (runtime binding rules); EX.H1 Principle P4
(no partial compliance — verification is mandatory for compliance claims)

---

## 4. CORRECTIONS NOT APPLIED IN EX.1 (ROADMAP)

### BD-001 — Engine invocation path into runtime

**Required stream:** EX.3 (System Bridge)
**Work required:**
1. Implement an EX.3 adapter that reads the certified engine output files (or invokes the
   verifier) and serves CE.4 signal states, CE.5 consumption records, and CE.2
   condition/diagnosis states via a new API route (e.g., `?pios=true` or `?governed=true`)
2. Integrate the EX.1 verifier into the API invocation path so validation runs automatically
   per RB-006

**CE.11 classification:** GC-002 (engine path addition to the runtime-to-core binding surface)

---

### BD-002 — Non-governed signal_state in 42.22 source

**Required stream:** GC-003 + EX.3
**Work required:**
1. GC-003: Update `docs/pios/42.22/sample_runtime_output.json` — replace
   `signal_state: "computed"` with the corresponding CE.4 emission state for each signal
   (SIG-001: PARTIAL, SIG-003: BLOCKED, etc. — from ce10_validation outputs)
2. EX.3: Update the 42.23 adapter or a successor to validate that `signal_state` ∈
   CE.4 vocabulary before emitting the record

**CE.11 classification:** GC-003 (data/run change to update static source artifact);
GC-002 (adapter change for vocabulary validation)

---

### BD-003 — CE.5 traceability exposure

**Required stream:** EX.3
**Work required:**
Implement a bridge adapter that reads `condition_output.json` from the most recent
validated EX.1 run and exposes `ce5_consumption_records` and `ce5_traceability_records`
per EX.H1 SB-007 mandatory inspection surface requirement.

**CE.11 classification:** GC-002 (new engine output reading path)

---

### BD-004 — Propagation state exposure

**Required stream:** EX.3
**Work required:**
Implement a bridge adapter endpoint that exposes `condition_coverage_state` per condition
and `diagnosis_activation_state` per diagnosis from the most recent validated EX.1 run.
Required by EX.H1 SB-007.

**CE.11 classification:** GC-002 (new bridge surface)

---

### BD-005 — Missing adapters (42.13, 42.15, 42.16)

**Required stream:** 3 separate EX.3 stream instances

**42.13 — demo_activate.py:**
Defines what "semantic path status" means in the governed model and implements it.
Requires governance definition (CE.11 GC-001) before implementation.

**42.15 — enl_console_adapter.py:**
Implements ENL (Execution Navigation Layer) chain reveal. Requires a governing ENL
chain contract before implementation.

**42.16 — persona_view_map.py:**
Implements persona-based projection of query results. Requires a governing persona
view map contract before implementation.

**CE.11 classification:** Each requires GC-001 (governance contract defining the
feature) + GC-002 (adapter implementation)

---

## 5. CORRECTION PRIORITY ORDER

| Priority | Defect | Correction | Stream |
|---|---|---|---|
| 1 (applied) | BD-006 (verification absent) | Verifier script created | EX.1 |
| 2 (next) | BD-001 (engine not called) | EX.3 bridge to engine output | EX.3 |
| 3 | BD-003 (traceability absent) | EX.3 consumption record exposure | EX.3 |
| 4 | BD-004 (propagation absent) | EX.3 condition/diagnosis exposure | EX.3 |
| 5 | BD-002 (vocabulary mismatch) | GC-003 data fix + EX.3 validation | GC-003 → EX.3 |
| 6 | BD-005 (missing adapters) | Three EX.3 adapter implementations | EX.3 ×3 |

---

## 6. WHAT THE L3 RUNTIME CORRECTLY DOES (PRESERVE)

The following behaviors in the existing runtime are compliant with L3 scope and
MUST NOT be modified by any correction stream:

- R3 enforcement (no synthetic data): adapters return explicit null, not defaults ✓
- R4 fail-closed behavior: invalid query → exit 1, error response ✓
- R1 rule (no direct 41.x file access in 42.4/42.6/42.7): access via 42.1 module ✓
- 42.23 fail-closed on unknown emphasis values ✓
- 42.7 deterministic hierarchy (G7 documented) ✓
- Input sanitization in API route (regex replacement of non-allowed characters) ✓
- No synthetic values in overview metrics (extraction_status explicit) ✓

These behaviors satisfy L3 obligations and are not binding defects. Any EX.3 correction
must preserve them.
