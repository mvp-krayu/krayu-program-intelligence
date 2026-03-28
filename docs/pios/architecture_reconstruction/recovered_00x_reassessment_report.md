# Recovered 00.x Governance Reassessment Report

Stream: A.2b — Recovered 00.x Governance Reassessment
Date: 2026-03-28
Source directory: docs/architecture/_recovered_00x/
Prior blocker: MCA-001 — Stream 00.2 NOT FOUND (CRITICAL, A.2)

---

## Executive Finding

**Stream 00.2 is FOUND.**

`docs/architecture/_recovered_00x/canonical-layer-model.md` is explicitly labelled "Stream: 00.2 — Canonical Layer Model Restoration" and constitutes the canonical L0-L8 layer model defining document. MCA-001 is resolved.

---

## File Inventory and Stream Identity

| File | Stream | Classification |
|---|---|---|
| canonical-layer-model.md | 00.2 | CANONICAL BASELINE — Primary |
| canonical-layer-model.classification.md | 00.2 | CANONICAL BASELINE — Companion |
| canonical-layer-model.drift.md | 00.2 | CANONICAL BASELINE — Companion |
| canonical-layer-model.validation.md | 00.2 | CANONICAL BASELINE — Companion |
| canonical-model-closure-validation.md | 00.3 | DOWNSTREAM ENFORCEMENT — Closure |
| derivation-ownership-correction.md | 40.12 | DOWNSTREAM ENFORCEMENT |
| derivation-boundary-audit.md | 40.13 | DOWNSTREAM ENFORCEMENT |
| boundary-remediation-allocation.md | 40.14 | DOWNSTREAM ENFORCEMENT |
| remediation-planning-framework.md | 40.15 | DOWNSTREAM ENFORCEMENT |
| remediation-execution-domain-01.md | 40.16 | DOWNSTREAM ENFORCEMENT — Execution |
| remediation-execution-domain-02.md | 40.17 | DOWNSTREAM ENFORCEMENT — Execution |

---

## Accepted Canonical Subset (4 files)

These four files constitute the recovered Stream 00.2 governance baseline.

### canonical-layer-model.md — Stream 00.2 Primary

This is the defining document for the canonical Program Intelligence layer model.

**Structural completeness:** 11/11 sections present and validated
**Layer ordering consistency:** 4/4 checks pass
**Evidence First compliance:** 10/10 checks pass
**Boundary compliance:** 8/8 checks pass
**Overall validation confidence:** 88%
**Governance status:** PROVISIONAL (not LOCK-READY)

**Reason for PROVISIONAL (not LOCK-READY):**
- SSZ/SSI derivation is currently implemented at L6 (violation of L3 ownership) — OPEN
- L4 semantic shaping formal specification is absent — OPEN (tolerated deviation)
- Validation memory not durably archived — OPEN

**Governance lock state:** Section 10 declares the model "hereby declared the authoritative reference." The governance lock is IN EFFECT despite PROVISIONAL validation status.

### canonical-layer-model.classification.md — Stream 00.2 Construct Classification

Classifies 10 constructs: SSZ, SSI, Executive Interpretation, Demo Sequencing, Topology Highlighting, Evidence Deep Links, Killer Shots, ENL, Contracts, PiOS Scripts. Overall classification confidence 90%.

### canonical-layer-model.drift.md — Stream 00.2 Drift Record

Records 6 drift items (D1-D6). 4 OPEN. Provides corrective positioning for each. Explicitly names all streams where drift occurred.

### canonical-layer-model.validation.md — Stream 00.2 Validation Record

Validates canonical-layer-model.md. PROVISIONAL. Documents 3 unresolved items that prevent LOCK-READY status.

---

## Retained Historical Subset (7 files)

These files are downstream enforcement artifacts produced under 00.2 authority. They are not governance baseline — they operationalize and apply the baseline. Classified as retained historical subset. All are HIGH confidence and internally consistent.

| Stream | Role |
|---|---|
| 00.3 | Closure validation of 00.2 + 40.12-40.15 governance record |
| 40.12 | Derivation ownership correction |
| 40.13 | Derivation boundary audit (8 findings: F1-F8) |
| 40.14 | Violation disposition + remediation allocation |
| 40.15 | Remediation planning + execution envelopes |
| 40.16 | Domain A remediation execution (L3 derivation spec) |
| 40.17 | Domain B remediation execution (boundary enforcement) |

---

## Does the Recovered Set Fulfill the 00.2 Role?

**YES — Stream 00.2 is present and fulfills its architectural role.**

The canonical-layer-model.md defines the L0-L8 model with:
- All 9 layers defined (L0 through L8)
- Complete allowed inputs / outputs / must-never constraints per layer
- Cross-layer control rules (5.1 forward flow, 5.2 supporting bindings, 5.3 forbidden flows, 5.4 invariants)
- Artifact placement rules (6.1-6.6)
- Construct classifications (Section 7)
- Drift identification (Section 8)
- Governance lock (Section 10)

The set collectively fulfills the 00.2 governance restoration role with PROVISIONAL governance status. The model is not LOCK-READY due to open SSZ/SSI and L4 gaps, but it is defined, self-consistent, and in effect.

---

## L0-L8 Layer Definitions (from canonical-layer-model.md)

| Layer | Name | Maps To (runtime streams) |
|---|---|---|
| L0 | Evidence Source Layer | External systems (git, CI/CD, issue trackers) |
| L1 | Evidence Normalization Layer | 40.1-40.2 evidence ingestion and normalization |
| L2 | Evidence Navigation Layer (ENL) | ENL chain (40.x/41.x ENL chain construction) |
| L3 | Derivation Layer | 40.5 Signal Computation Engine |
| L4 | Semantic Shaping Layer | 41.x Semantic Shaping (41.1-41.5) |
| L5 | Presentation Assembly Layer | 43.x Binding + 44.x Projection (assembly zone) |
| L6 | Runtime Experience Layer | 42.x ExecLens consumer execution |
| L7 | Demo / Narrative Packaging Layer | 51.x Demo Surface streams |
| L8 | Governance, Contract, and Validation Layer | docs/pios/contracts/, governance docs |

---

## Execution Questions — Answered

### 1. Do the recovered files collectively constitute Stream 00.2 governance restoration?
YES. canonical-layer-model.md is explicitly Stream 00.2. The four canonical baseline files constitute the full 00.2 set.

### 2. Which files are canonical governance baseline?
canonical-layer-model.md, canonical-layer-model.classification.md, canonical-layer-model.drift.md, canonical-layer-model.validation.md — all Stream 00.2.

### 3. Which files are downstream governance enforcement rather than baseline?
All 7 non-00.2 files (streams 00.3, 40.12-40.17). They enforce and apply the baseline but do not define it.

### 4. Does their inclusion change L1-L6 from MODIFIED to CONFIRMED or still MODIFIED?
**CONFIRMED — with PROVISIONAL governance status.** All L1-L6 layers are now explicitly defined by the canonical model. The definitions are coherent, internally consistent, and match observed runtime stream behavior. The model itself is CONFIRMED. Governance status is PROVISIONAL due to open drift items (D1-D4 open), not due to definitional gaps.

### 5. Should docs/architecture/_recovered_00x/ remain as recovered storage, or should some files be logically promoted?
The four canonical baseline files (Stream 00.2) should be considered for logical promotion to `docs/architecture/` (their canonical placement per Section 6.6 of the model itself). The seven enforcement files may remain as historical record. Promotion decision is reserved for architectural authority.
