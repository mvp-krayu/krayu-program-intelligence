# CE.7 — Gap-to-Action Map

**Stream:** CE.7 — Engine Remediation Planning
**Artifact type:** GAP-TO-ACTION MAP (PLANNING)
**Date:** 2026-04-03
**Authority:** CE.7
**Source:** CE.6_GAP_REGISTRY.md (all 18 gaps)

---

## 1. PURPOSE

This document maps every CE.6 gap ID to its remediation domain, violated contract rule,
runtime surface, and action class. No gap is omitted.

---

## 2. ACTION CLASS DEFINITIONS

| Action class | Definition |
|---|---|
| ADD REQUIRED FIELD | A field required by the governing contract is absent from the engine output and must be added |
| REMOVE PROHIBITED FIELD | A field explicitly prohibited by the governing contract is present and must be removed |
| IMPLEMENT STATE MAPPING | A state mapping required by the governing contract does not exist in the engine and must be implemented |
| IMPLEMENT TRACE RECORD | A traceability or consumption record type required by the governing contract is not produced and must be implemented |
| ALIGN VOCABULARY | The engine uses a vocabulary that does not match the governing contract vocabulary and must be replaced |
| ENFORCE PROPAGATION RULE | A propagation rule required by CE.5 propagation_semantics.md is not enforced and must be applied |

---

## 3. EMISSION GAPS (CE.4)

| CE.6 Gap ID | Signal | Violated contract rule | Remediation domain | Action class | Runtime surface |
|---|---|---|---|---|---|
| GAP-E-001 | SIG-001 | CE.4 INV-005: PARTIAL signal MUST carry `partiality_reasons` per null field | DOMAIN-1 | ADD REQUIRED FIELD | `compute_signals.py` |
| GAP-E-002 | SIG-003 | CE.4 INV-004: BLOCKED signal MUST carry `blocking_class` | DOMAIN-1 | ADD REQUIRED FIELD | `compute_signals.py` |
| GAP-E-003 | SIG-005 | CE.4 INV-005: PARTIAL signal MUST carry `partiality_reasons` per null field | DOMAIN-1 | ADD REQUIRED FIELD | `compute_signals.py` |
| GAP-E-004 | SIG-006 | CE.4 INV-004: BLOCKED signal MUST carry `blocking_class` | DOMAIN-1 | ADD REQUIRED FIELD | `compute_signals.py` |
| GAP-E-005 | SIG-007 | CE.4 INV-005: PARTIAL signal MUST carry `partiality_reasons` per null field | DOMAIN-1 | ADD REQUIRED FIELD | `compute_signals.py` |
| GAP-E-006 | SIG-007 | CE.4 §3.3: `note` field is prohibited | DOMAIN-1 | REMOVE PROHIBITED FIELD | `compute_signals.py` |
| GAP-E-007 | SIG-008 | CE.4 INV-005: PARTIAL signal MUST carry `partiality_reasons` per null field | DOMAIN-1 | ADD REQUIRED FIELD | `compute_signals.py` |
| GAP-E-008 | SIG-008 | CE.4 §3.3: `note` field is prohibited | DOMAIN-1 | REMOVE PROHIBITED FIELD | `compute_signals.py` |

---

## 4. CONSUMPTION GAPS (CE.5)

| CE.6 Gap ID | Violated contract rule | Remediation domain | Action class | Runtime surface |
|---|---|---|---|---|
| GAP-C-001 | CE.5 CSM-1: consumption state vocabulary is AVAILABLE / PARTIAL / BLOCKED (closed set) | DOMAIN-2 | ALIGN VOCABULARY | `activate_conditions.py` |
| GAP-C-002 | CE.5 CSM-2 / C-001: CE.4 COMPLETE → CE.5 AVAILABLE mapping must be applied | DOMAIN-2 | IMPLEMENT STATE MAPPING | `activate_conditions.py` |
| GAP-C-003 | CE.5 PBE-2: downstream delivery must include `signal_id`, `consumption_state`, `output_ref`, `origin` | DOMAIN-2 | IMPLEMENT TRACE RECORD | `activate_conditions.py` or CE.5 boundary layer |

---

## 5. PROPAGATION GAPS (CE.5 and CE.2)

| CE.6 Gap ID | Violated contract rule | Remediation domain | Action class | Runtime surface |
|---|---|---|---|---|
| GAP-P-001 | CE.5 P-001: propagated record must carry `signal_id`, `origin`, `consumption_state`, `output_ref` | DOMAIN-3 | ENFORCE PROPAGATION RULE | `activate_conditions.py` |
| GAP-P-002 | CE.5 P-002: `consumption_state` must be derived exclusively from CE.4 emission state via CE.5 mapping | DOMAIN-2 | ALIGN VOCABULARY | `activate_conditions.py` |
| GAP-P-003 | CE.2 DEC-009: governed tier vocabulary is BLOCKED / DEGRADED / AT_RISK / STABLE | DOMAIN-3 | ALIGN VOCABULARY | `activate_conditions.py` |
| GAP-P-004 | CE.2 DEC-014: diagnosis state mapping is BLOCKED→BLOCKED, DEGRADED→ACTIVE, AT_RISK→ACTIVE, STABLE→INACTIVE | DOMAIN-3 | IMPLEMENT STATE MAPPING | `activate_conditions.py` |

---

## 6. TRACEABILITY GAPS

| CE.6 Gap ID | Violated contract rule | Remediation domain | Action class | Runtime surface |
|---|---|---|---|---|
| GAP-T-001 | CE.4 INV-006: COMPLETE signal MUST carry `traceability` per output field (executable gap) | DOMAIN-4 | ADD REQUIRED FIELD | `compute_signals.py` |
| GAP-T-002 | CE.5 T-001: CE.5 MUST emit structural gap trace record (Type 2) for expected-but-absent signals | DOMAIN-4 | IMPLEMENT TRACE RECORD | `activate_conditions.py` or CE.5 boundary layer |
| GAP-T-003 | CE.5 T-002: every in-scope signal must produce either Type 1 or Type 2 traceability record | DOMAIN-4 | IMPLEMENT TRACE RECORD | `activate_conditions.py` or CE.5 boundary layer |

---

## 7. CONTRACT-CRITICAL VS IMPLEMENTATION-DETAIL CLASSIFICATION

**Contract-critical** — Any gap whose resolution directly determines CE.4 or CE.5 contract
compliance status. Failure to close these gaps means the engine remains non-compliant
regardless of other fixes.

**Implementation-detail** — Changes that are required to satisfy compliance but whose
specific implementation strategy (module placement, function structure) is an engineering
decision for CE.8, not a governance decision for CE.7.

| CE.6 Gap ID | Classification | Rationale |
|---|---|---|
| GAP-E-001 | CONTRACT-CRITICAL | CE.4 INV-005 is a binding invariant; PARTIAL compliance is binary |
| GAP-E-002 | CONTRACT-CRITICAL | CE.4 INV-004 is a binding invariant |
| GAP-E-003 | CONTRACT-CRITICAL | CE.4 INV-005 is a binding invariant |
| GAP-E-004 | CONTRACT-CRITICAL | CE.4 INV-004 is a binding invariant |
| GAP-E-005 | CONTRACT-CRITICAL | CE.4 INV-005 is a binding invariant |
| GAP-E-006 | CONTRACT-CRITICAL | CE.4 §3.3 explicitly prohibits `note`; its presence is a violation |
| GAP-E-007 | CONTRACT-CRITICAL | CE.4 INV-005 is a binding invariant |
| GAP-E-008 | CONTRACT-CRITICAL | CE.4 §3.3 explicitly prohibits `note` |
| GAP-C-001 | CONTRACT-CRITICAL | CE.5 consumption state vocabulary is a closed set; deviation invalidates all downstream state |
| GAP-C-002 | CONTRACT-CRITICAL | COMPLETE → AVAILABLE mapping is required by CE.5 CSM-2; any other mapping violates the contract |
| GAP-C-003 | CONTRACT-CRITICAL | CE.5 PBE-2 defines the mandatory delivery structure; absence means CE.5 is not implemented |
| GAP-P-001 | CONTRACT-CRITICAL | CE.5 P-001 defines propagation record structure; absence means CE.5 propagation is not implemented |
| GAP-P-002 | CONTRACT-CRITICAL | CE.5 P-002 requires consumption_state from CE.5 mapping only |
| GAP-P-003 | CONTRACT-CRITICAL | CE.2 DEC-009 defines the governing tier vocabulary; using a different vocabulary invalidates condition output |
| GAP-P-004 | CONTRACT-CRITICAL | CE.2 DEC-014 mapping is a binding governance decision; deviation produces incorrect diagnosis states |
| GAP-T-001 | CONTRACT-CRITICAL | CE.4 INV-006 is a binding invariant; executable failure confirms the gap |
| GAP-T-002 | IMPLEMENTATION-DETAIL | CE.5 T-001 is binding, but the mechanism (separate module vs function) is implementation choice |
| GAP-T-003 | IMPLEMENTATION-DETAIL | CE.5 T-002 is binding, but the mechanism is implementation choice |

**All 16 contract-critical gaps must be closed before PiOS v0.4 can be evaluated as executable-candidate.**
**The 2 implementation-detail gaps must also be closed, but their implementation form is a CE.8 engineering decision.**

---

## 8. COMPLETE GAP COVERAGE VERIFICATION

Total CE.6 gaps: 18
Gaps mapped in this document: 18
Gaps omitted: 0

Coverage: COMPLETE
