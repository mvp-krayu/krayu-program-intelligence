# CE.7 — Remediation Architecture

**Stream:** CE.7 — Engine Remediation Planning
**Artifact type:** REMEDIATION ARCHITECTURE (PLANNING)
**Date:** 2026-04-03
**Authority:** CE.7
**Source:** CE.6 gap registry (GAP-E-001..GAP-E-008, GAP-C-001..GAP-C-003, GAP-P-001..GAP-P-004, GAP-T-001..GAP-T-003)

---

## 1. PURPOSE

This document defines the remediation domains required to close all 18 CE.6 gaps and
bring the PiOS v0.1 engine into compliance with the CE.4 emission contract and CE.5
consumption contract.

Four remediation domains are defined. Each domain is self-contained in scope and maps
to a distinct set of CE.6 gaps, governing contracts, and runtime surfaces.

---

## 2. REMEDIATION DOMAINS

---

### DOMAIN-1 — Emission Contract Compliance

**Purpose:**
Make all `compute_signals.py` signal emissions comply with CE.4 invariants INV-001
through INV-007 and CE.4 §3.3 (prohibited fields).

**CE.6 gap classes covered:**
GAP-E-001, GAP-E-002, GAP-E-003, GAP-E-004, GAP-E-005, GAP-E-006, GAP-E-007, GAP-E-008

**Gap types in this domain:**
- Missing `blocking_class` on BLOCKED signals (INV-004): SIG-003, SIG-006
- Missing `partiality_reasons` on PARTIAL signals (INV-005): SIG-001, SIG-005, SIG-007, SIG-008
- Prohibited `note` field present (§3.3): SIG-007, SIG-008

**Governing contracts:**
- CE.4 `signal_emission_contract_specification.md` — INV-004, INV-005, §3.3
- CE.4 `dependency_propagation_rules.md` — DP-001, DP-002 (partiality_reasons content for derived signals)
- CE.4 `signal_computability_governance.md` — failure class definitions (F-1a, F-1b, F-2, F-3, F-4)

**Runtime surfaces affected:**
- `pios/core/v0.1/engine/compute_signals.py` exclusively

**Prerequisites:**
None. This domain has no upstream dependency within the remediation plan.
It is the prerequisite for all other domains.

**Completion condition:**
All 8 signals emit payloads that satisfy CE.4 INV-001 through INV-007.
No `note` field appears in any signal payload.
Every BLOCKED signal carries `blocking_class`, `blocking_inputs`, `blocking_reason`.
Every PARTIAL signal carries `partiality_reasons` with an entry per null output field.

---

### DOMAIN-2 — Consumption Layer Implementation

**Purpose:**
Implement the CE.5 consumption layer as a governed pass-through between 40.5 signal
output and 40.6 condition activation. This layer must apply the CE.5 consumption state
vocabulary and produce CE.5-compliant consumption records.

**CE.6 gap classes covered:**
GAP-C-001, GAP-C-002, GAP-C-003

**Gap types in this domain:**
- CE.5 consumption state vocabulary not used (CSM-1): engine produces lowercase CE.4 names
- COMPLETE → AVAILABLE mapping not applied (CSM-2 / C-001)
- CE.5 consumption record structure not produced (PBE-2)

**Governing contracts:**
- CE.5 `consumption_state_model.md` — closed vocabulary, mapping table
- CE.5 `single_signal_consumption_rules.md` — C-001 through C-005
- CE.5 `propagation_boundary_enforcement.md` — PBE-2 (record structure)
- CE.5 `propagation_semantics.md` — P-001 through P-004

**Runtime surfaces affected:**
- `pios/core/v0.1/engine/activate_conditions.py` — existing mapping must be replaced or wrapped

**Prerequisites:**
DOMAIN-1 must be complete. CE.5 consumption state derivation depends on CE.4 emission
state correctness. A non-compliant CE.4 emission will produce incorrect CE.5 consumption
states if DOMAIN-1 is not resolved first.

**Completion condition:**
The engine applies the CE.5 mapping (COMPLETE→AVAILABLE, PARTIAL→PARTIAL, BLOCKED→BLOCKED)
before passing state to condition activation logic.
CE.5 consumption records with `{signal_id, origin, consumption_state, output_ref}` are
produced for every signal present in the CE.4 packet.

---

### DOMAIN-3 — Propagation Vocabulary Alignment

**Purpose:**
Align condition activation state vocabulary in `activate_conditions.py` with CE.2
DEC-009 (governed tier vocabulary: BLOCKED / DEGRADED / AT_RISK / STABLE) and
CE.2 DEC-014 (diagnosis state mapping).

**CE.6 gap classes covered:**
GAP-P-001, GAP-P-002, GAP-P-003, GAP-P-004

**Gap types in this domain:**
- CE.5 propagation record structure not produced (P-001)
- Wrong propagation vocabulary; engine uses complete/partial/blocked (P-002)
- CE.2 DEC-009 tier vocabulary not used at 40.6 (DEC-009)
- CE.2 DEC-014 diagnosis state mapping not applied (DEC-014)

**Governing contracts:**
- CE.5 `propagation_semantics.md` — P-001, P-002
- CE.2 DEC-009 — tier vocabulary (BLOCKED / DEGRADED / AT_RISK / STABLE)
- CE.2 DEC-014 — diagnosis state mapping (BLOCKED→BLOCKED, DEGRADED→ACTIVE, AT_RISK→ACTIVE, STABLE→INACTIVE)

**Runtime surfaces affected:**
- `pios/core/v0.1/engine/activate_conditions.py` — `SIGNAL_TO_CONDITION_STATE` and `CONDITION_TO_DIAGNOSIS_STATE` mappings

**Prerequisites:**
DOMAIN-2 must be complete. CE.2 DEC-009 tier vocabulary is received by the condition
activation layer from CE.5. If CE.5 consumption records do not carry the correct
`consumption_state`, DEC-009 tier derivation will not have correct input.

**Completion condition:**
`activate_conditions.py` derives condition tier using CE.2 DEC-009 vocabulary.
`CONDITION_TO_DIAGNOSIS_STATE` mapping matches CE.2 DEC-014 exactly.
`"partial"` and `"complete"` are no longer present as tier or diagnosis values.

---

### DOMAIN-4 — Traceability Record Implementation

**Purpose:**
Implement CE.5 consumption traceability record production (Type 1 and Type 2) so that
every signal in scope produces a governed traceability record at the CE.5 boundary.
Resolve the CE.4 traceability_coverage gap confirmed by run_03_executable.

**CE.6 gap classes covered:**
GAP-T-001, GAP-T-002, GAP-T-003

**Gap types in this domain:**
- run_03_executable traceability_coverage=FAIL (CE.4 INV-006 executable gap)
- No CE.5 Type 2 structural gap trace records produced (T-001)
- No CE.5 Type 1 or Type 2 consumption traceability records produced (T-002)

**Governing contracts:**
- CE.4 `signal_emission_contract_specification.md` — INV-006 (traceability field coverage)
- CE.5 `consumption_traceability_model.md` — T-001, T-002; Type 1 and Type 2 record schemas
- CE.5 `CE.5_VERSIONING_DECISION.md` — traceability as v0.4 requirement

**Runtime surfaces affected:**
- CE.4 traceability gap: `pios/core/v0.1/engine/compute_signals.py` (traceability field coverage)
- CE.5 traceability records: `pios/core/v0.1/engine/activate_conditions.py` or adjacent boundary layer

**Prerequisites:**
DOMAIN-1 must be complete for the CE.4 traceability gap (INV-006).
DOMAIN-2 must be complete for CE.5 Type 1 record production (consumption records must exist before traceability records are emitted from them).

**Completion condition:**
CE.5 Type 1 records produced for all signals present in CE.4 packet.
CE.5 Type 2 records produced for any expected signal absent from CE.4 packet.
run_03_executable produces `traceability_coverage: PASS` on re-run.

---

## 3. DOMAIN DEPENDENCY GRAPH

```
DOMAIN-1 (Emission)
    │
    ▼
DOMAIN-2 (Consumption Layer)
    │
    ▼
DOMAIN-3 (Propagation Vocabulary)

DOMAIN-1 ──────────────────────────┐
DOMAIN-2 ──────────────────────────▼
                              DOMAIN-4 (Traceability)
```

DOMAIN-1 is the root prerequisite.
DOMAIN-2 depends on DOMAIN-1.
DOMAIN-3 depends on DOMAIN-2.
DOMAIN-4 depends on DOMAIN-1 and DOMAIN-2.
DOMAIN-3 and DOMAIN-4 have no dependency between each other and may be addressed in parallel after their prerequisites are met.

---

## 4. DOMAIN SUMMARY TABLE

| Domain | Gaps covered | Gaps count | Governing contracts | Primary runtime surface | Prerequisite |
|---|---|---|---|---|---|
| DOMAIN-1: Emission | GAP-E-001..GAP-E-008 | 8 | CE.4 INV-004, INV-005, §3.3 | compute_signals.py | None |
| DOMAIN-2: Consumption | GAP-C-001..GAP-C-003 | 3 | CE.5 CSM-1, CSM-2, C-001, PBE-2 | activate_conditions.py | DOMAIN-1 |
| DOMAIN-3: Propagation | GAP-P-001..GAP-P-004 | 4 | CE.5 P-001/P-002, CE.2 DEC-009/DEC-014 | activate_conditions.py | DOMAIN-2 |
| DOMAIN-4: Traceability | GAP-T-001..GAP-T-003 | 3 | CE.4 INV-006, CE.5 T-001/T-002 | compute_signals.py + boundary layer | DOMAIN-1, DOMAIN-2 |
| **Total** | | **18** | | | |
