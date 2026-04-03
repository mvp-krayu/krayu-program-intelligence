# CE.4 — Signal Emission Surface Assessment

**Stream:** CE.4 — PiOS Signal Emission Contract Definition
**Artifact type:** ASSESSMENT (observed current state — NOT normative)
**Date:** 2026-04-03
**Evidence source:** `runs/pios/40.5/CE.2-R01-MIX/signal_output.json`, `pios/core/v0.1/engine/compute_signals.py`
**Governed by (prior):** CE.2 (40.6–40.10 only), CE.3 (boundary identification only)

---

## 1. PURPOSE

This document describes the current 40.5 emission surface exactly as observed.
Nothing here is normative. This is the baseline from which CE.4 governance is derived.
Observations are stated as facts about current behavior, not as judgments.

---

## 2. OBSERVED EMISSION STATES

The engine currently produces signals in one of three states: COMPLETE, PARTIAL, BLOCKED.
These are present in runtime output but are not defined by any governing decision.

| Signal | State | CKR | Semantic |
|---|---|---|---|
| SIG-001 | PARTIAL | CKR-006 | Coordination Pressure |
| SIG-002 | COMPLETE | CKR-007 | Dependency Load |
| SIG-003 | BLOCKED | CKR-008 | Change Concentration |
| SIG-004 | COMPLETE | CKR-009 | Structural Volatility |
| SIG-005 | PARTIAL | CKR-010 | Execution Throughput |
| SIG-006 | BLOCKED | CKR-011 | Execution Stability |
| SIG-007 | PARTIAL | CKR-014 | ESI |
| SIG-008 | PARTIAL | CKR-015 | RAG |

Summary: 2 COMPLETE / 4 PARTIAL / 2 BLOCKED

---

## 3. OBSERVED PAYLOAD STRUCTURE BY STATE CLASS

### 3.1 COMPLETE — Observed payload (SIG-002, SIG-004)

Fields present in both COMPLETE signals:
- `signal_id` (string)
- `canonical_name` (string)
- `ckr` (string)
- `state` = "COMPLETE" (string)
- `output` (object — all fields carry resolved numeric values, no null fields)
- `traceability` (object — formula string per output field)

No null values in `output`. No `blocking_inputs`, `blocking_reason`, or `note` fields.

Example — SIG-002 output object:
```json
{
  "dependency_edge_count": 17,
  "dependency_load_ratio": 0.773
}
```

### 3.2 PARTIAL — Observed payload (SIG-001, SIG-005, SIG-007, SIG-008)

PARTIAL signals split into two structural variants:

**Variant A — Primitive PARTIAL (SIG-001, SIG-005):**
- `output` contains a mix of resolved numeric values and null fields
- `traceability` present — formula string per output field (including for null fields, marked PENDING)
- No `note` field

Example — SIG-001 output:
```json
{
  "static_structural_ratio": 0.875,
  "runtime_component": null
}
```
Traceability for null field: `"runtime_component": "VAR_AT_005 * VAR_AT_007 (PENDING)"`

**Variant B — Derived PARTIAL (SIG-007, SIG-008):**
- `output` contains a mix of resolved numeric values and null fields
- NO `traceability` field
- `note` field present — free-text explanation of why composite is non-computable

Example — SIG-007 output:
```json
{
  "sig_002_dependency_load_component": 0.773,
  "sig_005_completion_factor_component": null,
  "sig_006_stability_component": null
}
```
Note: `"ESI composite not computable. SIG-006 (Execution Stability) is BLOCKED. ..."`

**Structural difference between Variant A and B:**
Variant A carries `traceability` (formula-based). Variant B carries `note` (prose).
Both appear under the same emission state label "PARTIAL" with no distinction.

A null field in Variant A means "formula exists, input pending."
A null field in Variant B means "upstream signal is BLOCKED."
These have different semantics but the same serialized representation (`null`).

### 3.3 BLOCKED — Observed payload (SIG-003, SIG-006)

BLOCKED signals split into two structural variants in the current run artifact:

**Variant X — BLOCKED with blockage metadata (SIG-006):**
- `output` = null
- `blocking_inputs` (array of variable IDs)
- `blocking_reason` (string)
- No `traceability`, no `note`

Example — SIG-006:
```json
{
  "signal_id": "SIG-006",
  "state": "BLOCKED",
  "output": null,
  "blocking_inputs": ["VAR_AT_007", "VAR_AT_009", "VAR_DT_007", "VAR_DT_008"],
  "blocking_reason": "All inputs event-based; require live pipeline execution"
}
```

**Variant Y — BLOCKED without blockage metadata (SIG-003, as observed in CE.2-R01-MIX run artifact):**
- `output` = null
- No `blocking_inputs`
- No `blocking_reason`
- No `traceability`, no `note`

Example — SIG-003:
```json
{
  "signal_id": "SIG-003",
  "state": "BLOCKED",
  "output": null
}
```

**Observation:** Two BLOCKED signals in the same run artifact carry different payload
structures. Variant X provides blockage traceability; Variant Y does not. There is no
governing rule requiring either structure. The difference originates in which code branch
was executed — the blockage metadata in Variant X was explicitly coded into SIG-006;
the metadata in SIG-003's branch 1 is present in engine code but absent in the run artifact,
indicating a code/artifact version mismatch or a separate structural issue.

---

## 4. OBSERVED SEMANTIC AMBIGUITIES

### 4.1 Null field semantics (PARTIAL state)

A null value in an output field currently means one of two distinct things:

| Meaning | Signal | Context |
|---|---|---|
| Input variable PENDING — formula exists but input unavailable | SIG-001 (`runtime_component`), SIG-005 (`completion_factor`) | Primitive PARTIAL |
| Upstream signal BLOCKED — no formula dependency failure | SIG-007 (`sig_006_stability_component`), SIG-008 (`sig_003_change_concentration_component`) | Derived PARTIAL |

Both serialize to `null`. The only way to distinguish them is to read the `note` field
(Variant B) or the `traceability` field (Variant A). There is no semantic field that
directly classifies the null cause.

### 4.2 BLOCKED cause ambiguity

As noted in section 3.3, two BLOCKED variants exist in runtime output. Variant Y carries
no blockage context. A consumer of signal_output.json encountering Variant Y cannot
determine:
- which inputs are blocking
- whether the blockage is due to data absence or formula absence
- whether the signal can ever become unblocked

### 4.3 Absence of computability classification

No field in any signal payload states whether the signal is computable in principle.
A PARTIAL signal may be computable (all formulas exist, inputs pending) or non-computable
(formula absent in the live-input branch). A BLOCKED signal may be temporarily blocked
(data will eventually be available) or permanently blocked (no formula — structural impossibility).
The current payload has no field for this distinction.

### 4.4 PARTIAL state conflates two distinct signal categories

Primitive signals (SIG-001 through SIG-006) compute directly from telemetry variables.
Derived signals (SIG-007, SIG-008) compute from other signals as inputs. Both are labeled
PARTIAL but their PARTIAL conditions, payload structure, and resolution paths differ.
There is no field distinguishing primitive vs derived origin.

### 4.5 No emission version or governance provenance

No field in any signal payload identifies which governed contract version it conforms to.
CE.2 activation (40.6) consumes these signals with no way to verify the emission contract
version that produced them.

---

## 5. CURRENT OUTPUT ENVELOPE (summary.signal_output_completeness)

The engine emits a top-level `signal_output_completeness` field in the summary:
- Value: "COMPLETE" if no PARTIAL and no BLOCKED signals
- Value: "PARTIAL" if any PARTIAL or BLOCKED signal exists

Current value: "PARTIAL"

This field is binary — it does not distinguish between 1 BLOCKED vs 6 BLOCKED, or between
PARTIAL-due-to-pending-inputs vs PARTIAL-due-to-upstream-blockage. It is an aggregate
classification with no granularity. No governing rule defines when "PARTIAL" at this level
is acceptable for downstream consumption.

---

## 6. OBSERVED FIELDS — COMPLETE INVENTORY

| Field | COMPLETE | PARTIAL-A | PARTIAL-B | BLOCKED-X | BLOCKED-Y |
|---|---|---|---|---|---|
| signal_id | YES | YES | YES | YES | YES |
| canonical_name | YES | YES | YES | YES | YES |
| ckr | YES | YES | YES | YES | YES |
| state | YES | YES | YES | YES | YES |
| output (object) | resolved | mixed (null+resolved) | mixed (null+resolved) | null | null |
| traceability | YES | YES | NO | NO | NO |
| note | NO | NO | YES | NO | NO |
| blocking_inputs | NO | NO | NO | YES | NO |
| blocking_reason | NO | NO | NO | YES | NO |

No signal in any state carries a `computability_class`, `formula_presence`,
`dependency_source`, `governance_status`, or `documentation_status` field.

---

## 7. CONCLUSION

The current 40.5 emission surface is structurally inconsistent:
- PARTIAL is used for two distinct semantic conditions (pending input vs upstream blockage) with no field-level distinction
- BLOCKED is used with two distinct payload structures (with and without blockage metadata) in the same run artifact
- No governed rule defines what fields are required, optional, or prohibited per emission state
- No computability classification exists in any signal payload
- Downstream consumers (40.6 binding rules) receive BLOCKED as a bare null output with no traceability

These inconsistencies are not defects in CE.2 — CE.2 handles what it receives correctly.
They are ungoverned emission surface properties that CE.4 must define.
