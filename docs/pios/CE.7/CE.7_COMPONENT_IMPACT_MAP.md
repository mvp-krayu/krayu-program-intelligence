# CE.7 — Component Impact Map

**Stream:** CE.7 — Engine Remediation Planning
**Artifact type:** COMPONENT IMPACT MAP (PLANNING)
**Date:** 2026-04-03
**Authority:** CE.7
**Source:** CE.6 compliance reports, CE.7_REMEDIATION_ARCHITECTURE.md

---

## 1. PURPOSE

This document maps each remediation domain to the runtime components it affects.
For each component, it records the current role, which domains touch it, and its
contract sensitivity.

---

## 2. CONTRACT SENSITIVITY DEFINITIONS

| Sensitivity | Definition |
|---|---|
| HIGH | Component is the primary runtime surface for governing contract compliance. Changes here directly determine compliance status. |
| MEDIUM | Component is affected by remediation but is not the primary contract surface. Changes here are required consequences of upstream domain work. |
| LOW | Component may require minor updates as a result of remediation but is not a direct compliance surface. |

---

## 3. IMPACTED COMPONENTS

---

### COMPONENT-1 — `pios/core/v0.1/engine/compute_signals.py`

**Current role:**
Implements signal computation for all 8 PiOS signals (SIG-001 through SIG-008).
Emits the CE.4 signal output packet consumed by 40.6.
This is the authoritative 40.5 emission layer.

**Remediation domains touching this component:**

| Domain | What changes |
|---|---|
| DOMAIN-1 (Emission) | Add `blocking_class` to SIG-003, SIG-006. Add `partiality_reasons` to SIG-001, SIG-005, SIG-007, SIG-008. Remove `note` from SIG-007, SIG-008. |
| DOMAIN-4 (Traceability) | Resolve CE.4 INV-006 traceability field coverage gap (GAP-T-001). |

**Gaps affecting this component:**
GAP-E-001, GAP-E-002, GAP-E-003, GAP-E-004, GAP-E-005, GAP-E-006, GAP-E-007, GAP-E-008, GAP-T-001

**Contract sensitivity: HIGH**

This is the sole CE.4 emission surface. All CE.4 invariant compliance (INV-004, INV-005, §3.3)
is determined here. No other component can substitute for or compensate for non-compliance
at this surface.

**Required phases:** PHASE 1 (primary), PHASE 4 (partial — GAP-T-001)

---

### COMPONENT-2 — `pios/core/v0.1/engine/activate_conditions.py`

**Current role:**
Implements condition activation for 40.6. Reads signal output from the CE.4 packet,
maps signal state to condition state via `SIGNAL_TO_CONDITION_STATE`, and assigns
diagnosis state via `CONDITION_TO_DIAGNOSIS_STATE`. This is the primary 40.6 layer.

**Remediation domains touching this component:**

| Domain | What changes |
|---|---|
| DOMAIN-2 (Consumption) | Replace `SIGNAL_TO_CONDITION_STATE` with CE.5 mapping (COMPLETE→AVAILABLE, PARTIAL→PARTIAL, BLOCKED→BLOCKED). Produce CE.5 consumption records. |
| DOMAIN-3 (Propagation) | Replace condition tier vocabulary with CE.2 DEC-009 (BLOCKED/DEGRADED/AT_RISK/STABLE). Replace `CONDITION_TO_DIAGNOSIS_STATE` with CE.2 DEC-014 mapping. |
| DOMAIN-4 (Traceability) | Produce CE.5 Type 1 traceability records for signals present in CE.4 packet. Produce CE.5 Type 2 records for any expected-but-absent signals. |

**Gaps affecting this component:**
GAP-C-001, GAP-C-002, GAP-C-003, GAP-P-001, GAP-P-002, GAP-P-003, GAP-P-004, GAP-T-002, GAP-T-003

**Contract sensitivity: HIGH**

This component is the primary surface for CE.5 consumption compliance and CE.2 DEC-009/DEC-014
propagation compliance. All consumption vocabulary, record structure, and diagnosis mapping
gaps are in this component.

**Required phases:** PHASE 2 (primary), PHASE 3 (primary), PHASE 4 (partial — traceability records)

---

### COMPONENT-3 — CE.5 Boundary Layer (to be implemented)

**Current role:**
Does not exist as a discrete layer. CE.5 consumption logic is currently embedded implicitly
in `activate_conditions.py` without governed structure.

**Remediation domains touching this component:**

| Domain | What changes |
|---|---|
| DOMAIN-2 (Consumption) | CE.5 consumption record production may be implemented as a distinct function or module within or adjacent to `activate_conditions.py`. |
| DOMAIN-4 (Traceability) | CE.5 traceability record generation (Type 1 and Type 2) may be co-located here. |

**Note on scope:**
Whether the CE.5 boundary layer is implemented as a separate module or as a governed
function within `activate_conditions.py` is an implementation decision for CE.8.
CE.7 does not specify module structure — only that the function must exist and comply
with CE.5 PBE-2 record structure.

**Contract sensitivity: MEDIUM**

This is a new structural requirement. Sensitivity is MEDIUM because the boundary layer
has no existing implementation to break — it must be created, not modified.

**Required phases:** PHASE 2, PHASE 4

---

### COMPONENT-4 — Executable Validation Runner (run_03_executable equivalent)

**Current role:**
Located at `runs/pios/40.5/run_03_executable/`. Validates signal state, value parity,
traceability coverage, and losslessness against expected values. Produced the result:
`traceability_coverage: FAIL`.

**Remediation domains touching this component:**

| Domain | What changes |
|---|---|
| DOMAIN-4 (Traceability) | After PHASE 1 resolves GAP-T-001, a re-run must produce `traceability_coverage: PASS`. |

**Note:**
The validation runner itself may not require modification if the traceability coverage
gap is resolved in `compute_signals.py`. If the runner checks traceability field presence
per signal, fixing INV-006 compliance in the engine is sufficient.

**Contract sensitivity: LOW**

The runner is a validation surface, not a compliance surface. Its results confirm or deny
compliance; they do not determine it. Re-running is required as part of the PHASE 1 exit gate.

**Required phases:** PHASE 1 exit gate (re-run only, no modification expected)

---

## 4. COMPONENT SUMMARY TABLE

| Component | Domains | Gaps | Phases | Sensitivity |
|---|---|---|---|---|
| `compute_signals.py` | DOMAIN-1, DOMAIN-4 | GAP-E-001..E-008, GAP-T-001 | 1, 4 (partial) | HIGH |
| `activate_conditions.py` | DOMAIN-2, DOMAIN-3, DOMAIN-4 | GAP-C-001..C-003, GAP-P-001..P-004, GAP-T-002..T-003 | 2, 3, 4 | HIGH |
| CE.5 boundary layer (new) | DOMAIN-2, DOMAIN-4 | GAP-C-003, GAP-T-002..T-003 | 2, 4 | MEDIUM |
| Validation runner (run_03) | DOMAIN-4 | GAP-T-001 (re-run) | 1 exit gate | LOW |

---

## 5. COMPONENTS NOT AFFECTED

The following components are in scope for CE.6 inspection but require no remediation:

| Component | Reason |
|---|---|
| `synthesize_intelligence.py` (40.7) | CE.6 found no compliance gaps at this layer |
| `package_delivery.py` (40.8) | CE.6 found no compliance gaps at this layer |
| CE.4 governance artifacts | Locked — no modification permitted by CE.7 rules |
| CE.5 governance artifacts | Locked — no modification permitted by CE.7 rules |
| Signal Ledger | Locked — no structural changes required |
