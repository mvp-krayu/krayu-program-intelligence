# CE.6 — Gap Registry

**Stream:** CE.6 — Engine Compliance & Executable Validation
**Artifact type:** GAP REGISTRY (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.6
**Source reports:** CE.6_EMISSION_COMPLIANCE_REPORT.md, CE.6_CONSUMPTION_COMPLIANCE_REPORT.md, CE.6_PROPAGATION_COMPLIANCE_REPORT.md, CE.6_TRACEABILITY_COMPLIANCE_REPORT.md

---

## 1. PURPOSE

This registry consolidates all gaps identified across CE.6 compliance reports into a
single authoritative reference. Each gap is assigned a canonical gap ID, severity,
governing contract reference, and remediation requirement.

---

## 2. SEVERITY DEFINITIONS

| Severity | Definition |
|---|---|
| BLOCKING | Gap prevents CE.4/CE.5 compliance; must be resolved before executable-proven status |
| MAJOR | Gap violates a specific invariant or rule; required for compliance |
| INFORMATIONAL | Gap is observable but does not block compliance on its own |

---

## 3. EMISSION GAPS (CE.4 violations)

| Gap ID | Signal | Contract Reference | Description | Severity |
|---|---|---|---|---|
| GAP-E-001 | SIG-001 | CE.4 INV-005 | `partiality_reasons` absent for null field `runtime_component` | BLOCKING |
| GAP-E-002 | SIG-003 | CE.4 INV-004 | `blocking_class` absent from BLOCKED payload | BLOCKING |
| GAP-E-003 | SIG-005 | CE.4 INV-005 | `partiality_reasons` absent for null field `completion_factor` | BLOCKING |
| GAP-E-004 | SIG-006 | CE.4 INV-004 | `blocking_class` absent from BLOCKED payload | BLOCKING |
| GAP-E-005 | SIG-007 | CE.4 INV-005 | `partiality_reasons` absent for null fields `sig_005_completion_factor_component`, `sig_006_stability_component` | BLOCKING |
| GAP-E-006 | SIG-007 | CE.4 §3.3 | Prohibited `note` field present in payload | BLOCKING |
| GAP-E-007 | SIG-008 | CE.4 INV-005 | `partiality_reasons` absent for null field `sig_003_change_concentration_component` | BLOCKING |
| GAP-E-008 | SIG-008 | CE.4 §3.3 | Prohibited `note` field present in payload | BLOCKING |

**Emission gap count: 8 (all BLOCKING)**

---

## 4. CONSUMPTION GAPS (CE.5 violations)

| Gap ID | Contract Reference | Description | Severity |
|---|---|---|---|
| GAP-C-001 | CE.5 CSM-1 | CE.5 consumption state vocabulary not implemented; engine uses lowercase CE.4 emission state names | BLOCKING |
| GAP-C-002 | CE.5 CSM-2 / C-001 | COMPLETE → AVAILABLE mapping not applied; engine produces "complete" instead of "AVAILABLE" | BLOCKING |
| GAP-C-003 | CE.5 PBE-2 | No CE.5 consumption record structure produced (`signal_id`, `consumption_state`, `output_ref`, `origin` envelope) | BLOCKING |

**Consumption gap count: 3 (all BLOCKING)**

---

## 5. PROPAGATION GAPS (CE.5 and CE.2 violations)

| Gap ID | Contract Reference | Description | Severity |
|---|---|---|---|
| GAP-P-001 | CE.5 P-001 | CE.5 propagation record structure not produced | BLOCKING |
| GAP-P-002 | CE.5 P-002 | Engine uses wrong vocabulary in propagation (complete/partial/blocked vs AVAILABLE/PARTIAL/BLOCKED) | BLOCKING |
| GAP-P-003 | CE.2 DEC-009 | Governed tier vocabulary BLOCKED/DEGRADED/AT_RISK/STABLE not used at 40.6 | BLOCKING |
| GAP-P-004 | CE.2 DEC-014 | Diagnosis state mapping does not match DEC-014 table; "partial" and "complete" are not governed tiers | BLOCKING |

**Propagation gap count: 4 (all BLOCKING)**

---

## 6. TRACEABILITY GAPS

| Gap ID | Contract Reference | Description | Severity |
|---|---|---|---|
| GAP-T-001 | CE.4 INV-006 | Traceability coverage FAIL in run_03_executable; full field coverage not achieved | MAJOR |
| GAP-T-002 | CE.5 T-001 | No structural gap trace records (Type 2) produced by engine | MAJOR |
| GAP-T-003 | CE.5 T-002 | No CE.5 consumption traceability records (Type 1 or Type 2) produced by engine | MAJOR |

**Traceability gap count: 3 (all MAJOR)**

---

## 7. COMPLETE GAP SUMMARY

| Category | BLOCKING | MAJOR | INFORMATIONAL | Total |
|---|---|---|---|---|
| Emission (CE.4) | 8 | 0 | 0 | 8 |
| Consumption (CE.5) | 3 | 0 | 0 | 3 |
| Propagation (CE.5 / CE.2) | 4 | 0 | 0 | 4 |
| Traceability | 0 | 3 | 0 | 3 |
| **Total** | **15** | **3** | **0** | **18** |

---

## 8. REMEDIATION REQUIREMENTS

To achieve executable-proven status at PiOS v0.4, the following remediations are required:

### R-001 — BLOCKED signal payload completion (GAP-E-002, GAP-E-004)

Add `blocking_class` to SIG-003 and SIG-006 BLOCKED payloads in `compute_signals.py`.
CE.4 defines failure classes F-1a (temporal mismatch) and F-2 (formula absence) as valid
`blocking_class` values for BLOCKED signals.

### R-002 — PARTIAL signal partiality_reasons (GAP-E-001, GAP-E-003, GAP-E-005, GAP-E-007)

Add `partiality_reasons` to SIG-001, SIG-005, SIG-007, SIG-008 in `compute_signals.py`.
Each null output field requires a `partiality_reasons` entry with `failure_class`, `cause`,
and (for derived signals) `upstream_signal` per CE.4 §4.2–4.3 and dependency propagation rules.

### R-003 — Remove prohibited note field (GAP-E-006, GAP-E-008)

Remove `note` field from SIG-007 and SIG-008 payloads in `compute_signals.py`.
This field is prohibited by CE.4 §3.3. The information it contains must be migrated
into `partiality_reasons` entries (per R-002).

### R-004 — CE.5 consumption layer implementation (GAP-C-001, GAP-C-002, GAP-C-003, GAP-P-001, GAP-P-002)

Implement a governed CE.5 consumption layer in the engine. This layer must:
- Accept CE.4 signal output (COMPLETE/PARTIAL/BLOCKED)
- Map to CE.5 consumption state vocabulary (AVAILABLE/PARTIAL/BLOCKED)
- Produce consumption records with `signal_id`, `origin`, `consumption_state`, `output_ref`
- Not modify signal records

### R-005 — CE.2 tier vocabulary at 40.6 (GAP-P-003, GAP-P-004)

Revise `activate_conditions.py` to use CE.2 DEC-009 governed tier vocabulary (BLOCKED /
DEGRADED / AT_RISK / STABLE) and apply CE.2 DEC-014 diagnosis state mapping.
The current internal vocabulary (complete / partial / blocked) must be replaced.

### R-006 — CE.5 traceability record production (GAP-T-002, GAP-T-003)

Implement CE.5 traceability record generation. For each signal in scope:
- If present in CE.4 packet: produce Type 1 record `{signal_id, origin, consumption_state}`
- If expected but absent: produce Type 2 record `{signal_id, origin, status: "MISSING"}`

### R-007 — CE.4 traceability coverage (GAP-T-001)

Identify and resolve the specific traceability field coverage gap revealed by
`run_03_executable` (`traceability_coverage: FAIL`). Achieve `traceability_coverage: PASS`
in executable validation.

---

## 9. GAP REGISTRY CLOSURE CONDITION

This gap registry is closed when all 18 gaps have corresponding remediation commits
on the main engine branch and an updated executable validation run produces no FAIL
results against CE.4 INV-001 through INV-007 and CE.5 consumption requirements.

A new CE-class stream (CE.7 or equivalent) must be opened to certify closure of this registry.
