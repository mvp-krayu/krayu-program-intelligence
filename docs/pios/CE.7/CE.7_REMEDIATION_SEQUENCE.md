# CE.7 — Remediation Sequence

**Stream:** CE.7 — Engine Remediation Planning
**Artifact type:** REMEDIATION SEQUENCE (PLANNING)
**Date:** 2026-04-03
**Authority:** CE.7
**Source:** CE.7_REMEDIATION_ARCHITECTURE.md, CE.6_GAP_REGISTRY.md

---

## 1. PURPOSE

This document defines the dependency-respecting execution order for all remediation work
identified in CE.6. Each phase has a mandatory predecessor constraint, a clear objective,
and an explicit set of CE.6 gaps it closes.

---

## 2. SEQUENCING PRINCIPLES

**Principle S-001:** CE.4 emission compliance precedes CE.5 consumption implementation.
Consumption state derivation depends on correct CE.4 emission state. Remediating consumption
before emission will re-verify compliance against a still-non-compliant upstream.

**Principle S-002:** CE.5 consumption layer precedes CE.2 DEC-009 vocabulary alignment.
The CE.2 tier vocabulary is applied to consumption state output. The consumption layer must
exist before vocabulary alignment is meaningful.

**Principle S-003:** CE.4 emission compliance precedes CE.5 traceability record production.
CE.5 Type 1 records carry `consumption_state` derived from CE.4 emission state. The CE.4
`traceability` field gap (GAP-T-001) must be resolved in the same phase as emission remediation.

**Principle S-004:** Phases within the same prerequisite tier that have no dependency between
them may be implemented concurrently. No phase may be re-ordered without re-evaluating
all downstream prerequisites.

---

## 3. REMEDIATION PHASES

---

### PHASE 1 — CE.4 Emission Contract Compliance

**Objective:**
Close all CE.4 emission contract violations in `compute_signals.py`.
Make all 8 signals emit payloads that satisfy CE.4 INV-001 through INV-007 and §3.3.

**Required predecessor phase:** None. This is the root phase.

**Gaps addressed:**
| Gap ID | Signal | Action |
|---|---|---|
| GAP-E-001 | SIG-001 | Add `partiality_reasons` for null `runtime_component` |
| GAP-E-002 | SIG-003 | Add `blocking_class` to BLOCKED payload |
| GAP-E-003 | SIG-005 | Add `partiality_reasons` for null `completion_factor` |
| GAP-E-004 | SIG-006 | Add `blocking_class` to BLOCKED payload |
| GAP-E-005 | SIG-007 | Add `partiality_reasons` for 2 null fields |
| GAP-E-006 | SIG-007 | Remove prohibited `note` field |
| GAP-E-007 | SIG-008 | Add `partiality_reasons` for 1 null field |
| GAP-E-008 | SIG-008 | Remove prohibited `note` field |
| GAP-T-001 | all | Resolve `traceability_coverage` gap (CE.4 INV-006) |

**Why this order is mandatory:**
CE.5 consumption rules (C-001..C-005) derive `consumption_state` from CE.4 `state`.
CE.5 traceability records (Type 1) carry `consumption_state` and `output_ref`.
Both depend on correct CE.4 emission. Phase 2 and Phase 3 cannot produce correct
outputs unless Phase 1 is complete.

**Phase 1 exit gate:**
A re-run of the executable validation equivalent to `run_03_executable` must produce
`traceability_coverage: PASS` and all invariant checks passing. No gap from GAP-E-001
through GAP-E-008 may remain open.

---

### PHASE 2 — CE.5 Consumption Layer Implementation

**Objective:**
Implement the CE.5 consumption layer as a governed pass-through in `activate_conditions.py`.
Apply CE.5 vocabulary mapping and produce CE.5 consumption records for all signals.

**Required predecessor phase:** PHASE 1 (complete)

**Gaps addressed:**
| Gap ID | Action |
|---|---|
| GAP-C-001 | Replace internal vocabulary with CE.5 states: AVAILABLE / PARTIAL / BLOCKED |
| GAP-C-002 | Apply COMPLETE → AVAILABLE mapping before condition evaluation |
| GAP-C-003 | Produce CE.5 consumption record `{signal_id, origin, consumption_state, output_ref}` per signal |
| GAP-P-001 | Produce CE.5 propagation record structure as defined in propagation_semantics.md P-001 |
| GAP-P-002 | Apply CE.5 consumption state vocabulary in propagation path |

**Why this order is mandatory:**
CE.2 DEC-009 tier vocabulary (Phase 3) is applied to the output of the CE.5 consumption
layer. The consumption layer must exist and produce correct `consumption_state` before
DEC-009 tier derivation is meaningful. Implementing DEC-009 alignment without a CE.5
consumption layer creates a vocabulary mapping with no governed input source.

**Phase 2 exit gate:**
The engine produces CE.5 consumption records for all 8 signals.
`AVAILABLE` is produced for signals with CE.4 state=COMPLETE.
No signal carries `"complete"` as a consumption label post-mapping.
CE.5 C-001 through C-003 are satisfied for all 8 CE.2-R01-MIX signals.

---

### PHASE 3 — CE.2 Propagation Vocabulary Alignment

**Objective:**
Replace the non-governed internal vocabulary in `activate_conditions.py` with CE.2
DEC-009 tier vocabulary and apply CE.2 DEC-014 diagnosis state mapping.

**Required predecessor phase:** PHASE 2 (complete)

**Gaps addressed:**
| Gap ID | Action |
|---|---|
| GAP-P-003 | Align condition tier vocabulary with CE.2 DEC-009: BLOCKED / DEGRADED / AT_RISK / STABLE |
| GAP-P-004 | Replace `CONDITION_TO_DIAGNOSIS_STATE` with CE.2 DEC-014 mapping |

**Why this order is mandatory:**
DEC-009 tiers are derived from CE.5 consumption states. The Phase 2 consumption layer
must be in place so that the DEC-009 mapping has a compliant input. Applying DEC-009
before Phase 2 means mapping from the wrong (old lowercase) vocabulary.

**Phase 3 exit gate:**
`activate_conditions.py` produces condition tiers from the set {BLOCKED, DEGRADED, AT_RISK, STABLE}.
Diagnosis states map per DEC-014 exactly.
`"complete"`, `"partial"`, `"blocked"` (lowercase) no longer appear in tier or diagnosis outputs.

---

### PHASE 4 — CE.5 Traceability Record Implementation

**Objective:**
Implement CE.5 Type 1 and Type 2 traceability record production at the 40.5→40.6 boundary.

**Required predecessor phase:** PHASE 1 (complete), PHASE 2 (complete)

**Note:** PHASE 4 has no dependency on PHASE 3 and may proceed concurrently with PHASE 3
after both PHASE 1 and PHASE 2 are complete.

**Gaps addressed:**
| Gap ID | Action |
|---|---|
| GAP-T-002 | Implement CE.5 T-001: produce Type 2 structural gap trace record for any expected signal absent from CE.4 packet |
| GAP-T-003 | Implement CE.5 T-002: produce Type 1 consumption traceability record for all signals present in CE.4 packet |

**Why this order is mandatory:**
CE.5 Type 1 records carry `consumption_state` from the CE.5 consumption layer.
This requires Phase 2 completion. The CE.4 traceability field gap (GAP-T-001) must be
resolved in Phase 1 before traceability records accurately reflect compliant emission.

**Phase 4 exit gate:**
For each of the 8 CE.2-R01-MIX signals: a Type 1 traceability record is produced.
If any expected signal were absent from the CE.4 packet: a Type 2 record would be produced.
CE.5 T-001 and T-002 are satisfied.

---

## 4. SEQUENCE SUMMARY

```
PHASE 1: CE.4 Emission Contract Compliance
 ↓ prerequisite for PHASE 2, PHASE 4
PHASE 2: CE.5 Consumption Layer Implementation
 ↓ prerequisite for PHASE 3, PHASE 4
PHASE 3: CE.2 Propagation Vocabulary Alignment ─┐
                                                  ├─ may proceed concurrently
PHASE 4: CE.5 Traceability Record Implementation ─┘
```

---

## 5. PHASE COMPLETION CRITERIA SUMMARY

| Phase | Blocking gaps closed | Exit gate |
|---|---|---|
| PHASE 1 | GAP-E-001..E-008, GAP-T-001 | run_03_executable equivalent: traceability_coverage PASS; all emission invariants PASS |
| PHASE 2 | GAP-C-001..C-003, GAP-P-001..P-002 | CE.5 consumption records produced; AVAILABLE used for COMPLETE signals |
| PHASE 3 | GAP-P-003..P-004 | CE.2 DEC-009/DEC-014 vocabulary in effect; no legacy lowercase tiers |
| PHASE 4 | GAP-T-002..T-003 | CE.5 Type 1 and Type 2 records produced per T-001/T-002 |
