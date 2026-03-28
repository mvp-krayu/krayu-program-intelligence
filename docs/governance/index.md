# Governance Index

Program: Krayu — Program Intelligence Discipline
Stream: A.3 — Canonical Promotion & Governance Corpus Materialization
Date: 2026-03-28

---

## Authority Hierarchy

```
Canonical Architecture (highest authority)
    ↓
Remediation Corpus (applies canonical authority)
    ↓
Runtime Streams (governed by canonical + remediation)
```

Canonical architecture defines layer ownership, allowed behaviors, and forbidden behaviors.
Remediation corpus enforces corrections against canonical authority.
Runtime streams operate within the governance envelope they define.

---

## A. Canonical Architecture

**Location:** docs/governance/architecture/canonical/

**Authority:** Stream 00.2 — Canonical Layer Model Restoration

**Status:** PROVISIONAL (model defined and in effect; implementation has known deviations under remediation)

| File | Role |
|---|---|
| canonical-layer-model.md | PRIMARY — L0-L8 complete layer definitions, governing principles, cross-layer rules, governance lock |
| canonical-layer-model.validation.md | Validation record — 11/11 sections pass; 3 open items prevent LOCK-READY |
| canonical-layer-model.classification.md | Construct classification — 10 constructs classified against L0-L8 model |
| canonical-layer-model.drift.md | Drift record — 6 drift items (D1-D6), 4 open, corrective positioning for each |

**What canonical architecture governs:**
- Layer naming (L0–L8) and strict ordering
- Ownership of computation per layer
- Allowed transformations per layer
- Forbidden behaviors per layer
- Cross-layer flow constraints
- Placement of contracts, validation, demo, and runtime constructs

**What canonical architecture does NOT govern:**
- PiOS execution behavior (governed by docs/program-intelligence-framework/pios/)
- Signal computation specifics (governed by 40.5 stream)
- Demo sequencing (governed by 51.x streams as L7)

---

## B. Drift Cases

**Location:** docs/governance/drift/

**Register:** docs/governance/drift/drift_register.md

| ID | Name | Type | Status |
|---|---|---|---|
| DRIFT-001 | SSI / SSZ Boundary Violation | Layer Boundary Collapse (L3–L4–L6) | Resolved (Governance Reinforced) |

**Role of SSZ/SSI as drift trigger, not architecture:**
SSZ and SSI are NOT canonical architecture constructs in their current form. They are provisional, mis-layered signal constructs implemented at L6 (ExecLens runtime) that canonically belong at L3 (Derivation Layer). Their presence in the system is a known governance violation under active remediation. They must not be promoted to canonical architecture status until formally specified at L3. See DRIFT-001 and canonical-layer-model.classification.md Section 2.1-2.2.

---

## C. Remediation Corpus

**Location:** docs/governance/remediation/

**Authority basis:** Stream 00.2 (all remediation streams cite 00.2 as authority)

**Status:** Enforcement chain — governs correction of open violations and tolerated deviations

| File | Stream | Role |
|---|---|---|
| canonical-model-closure-validation.md | 00.3 | Closure validation of 00.2 + 40.12-40.15 governance record |
| derivation-ownership-correction.md | 40.12 | Derivation ownership restoration to L3 |
| derivation-boundary-audit.md | 40.13 | Boundary audit — 8 findings (F1-F8) classified |
| boundary-remediation-allocation.md | 40.14 | Violation disposition + remediation allocation |
| remediation-planning-framework.md | 40.15 | Remediation planning + execution envelopes + sequencing |
| remediation-execution-domain-01.md | 40.16 | Domain A execution — L3 derivation spec (SSZ/SSI/ESI) |
| remediation-execution-domain-02.md | 40.17 | Domain B execution — boundary enforcement |

**Important:** Remediation corpus artifacts are enforcement artifacts. They apply and operationalize the canonical model. They do not define the canonical model. For layer authority questions, canonical-layer-model.md governs.

---

## D. Recovery Evidence

**Location:** docs/architecture/_recovered_00x/

**Status:** UNCHANGED recovery evidence — do not modify, move, or delete

This directory contains the original recovered governance artifacts before canonical promotion. It is retained as the evidence record of the governance restoration discovery. The 11 files here are the source from which docs/governance/architecture/canonical/ and docs/governance/remediation/ were populated.

**Do not use this directory as a governance reference.** Use docs/governance/architecture/canonical/ instead.

---

## E. Reconstruction Outputs

**Location:** docs/pios/architecture_reconstruction/

**Status:** Active reconstruction and consolidation record (Streams A.1, A.2, A.2b, A.3)

**Key artifacts:**

| File | Stream | Contents |
|---|---|---|
| pios_l1_l6_architecture_paper.md | A.1 | Architecture paper (verdict: MODIFIED — now superseded by A.2b) |
| reconstruction_validation_report.md | A.1 | 7-rule validation; 7 ambiguities |
| ambiguity_register.md / .json | A.1 | 7 ambiguities (AMB-001 now CLOSED) |
| canonical_layer_reassessment.json | A.2b | CLR-v2 — CONFIRMED (PROVISIONAL) verdict |
| l1_l6_reassessment_report.md | A.2b | Full L1-L6 layer table with 00.2 definitions |
| recovered_00x_canonical_decision.md | A.2b | 6 formal decisions including verdict change |
| post_execution_consolidation_report.md | A.2 | A.2 consolidation summary |

**Note on A.1 paper:** The pios_l1_l6_architecture_paper.md states verdict MODIFIED. This was correct at time of writing. The A.2b reassessment upgraded the verdict to CONFIRMED (PROVISIONAL). The paper remains valid as a reconstruction record; its verdict is superseded by CLR-v2.

---

## Governance Corpus Summary

| Layer of Truth | Location | Authority Level |
|---|---|---|
| Canonical layer model | docs/governance/architecture/canonical/ | HIGHEST — defines all layer boundaries |
| Drift register | docs/governance/drift/ | GOVERNANCE — classifies and tracks violations |
| Remediation corpus | docs/governance/remediation/ | ENFORCEMENT — operationalizes corrections |
| Runtime governance | docs/governance/ (master capsule, operating model) | GOVERNING CONSTRAINTS — GC-01..GC-11 |
| PiOS framework spec | docs/program-intelligence-framework/pios/ | SPECIFICATION — execution model |
| Reconstruction evidence | docs/pios/architecture_reconstruction/ | EVIDENCE — reconstruction record |
| Recovery evidence | docs/architecture/_recovered_00x/ | EVIDENCE — source recovery record |
