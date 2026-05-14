# Dynamic CEU Migration to SQO

**Stream:** PI.SQO.DYNAMIC-CEU.RE-GOVERNANCE-AND-CLASSIFICATION.01.REVISED
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Dependency:** HISTORICAL_AUTHORITY_LOAD_REPORT.md (complete)

---

## 1. Purpose

This document defines the migration pathway by which historical Dynamic CEU
concepts transition into the canonical SQO governance framework. It maps
each proto-concept to its current-era SQO counterpart and establishes
the governance conditions under which migration is complete.

---

## 2. Migration Scope

### 2.1 What Migrates

- Proto-Dynamic-CEU concepts classified as A (CANONICAL) or B (RE-GOVERNABLE)
  per PROTO_DYNAMIC_CEU_CLASSIFICATION.md
- Governance rules from the mid era that are preserved or reformulated
- Replay-safe enrichment guarantees (R1–R5)
- Behavioral boundary definitions

### 2.2 What Does NOT Migrate

- Concepts classified as C (PROHIBITED): semantic activation authority
- Concepts classified as D (OBSOLETE): PSIG signal enrichment
- Implementation-specific details from prior eras (these were never implemented)
- Terminology that has been superseded

---

## 3. Migration Map

### 3.1 Governance Model Migration

| Proto-Concept | SQO Counterpart | Migration Type |
|--------------|-----------------|---------------|
| Allowed mapping sources (MS-1 through MS-6) | Semantic class authorization model (7 classes) | UPGRADED — source-list → class-based authorization |
| Forbidden mapping sources (FM-1 through FM-9) | Immutability boundary (9 protected elements) | UPGRADED — forbidden-list → boundary-based governance |
| Contamination prevention | Overlay isolation architecture | UPGRADED — pipeline isolation → architectural isolation |
| 8 allowable behaviors | 6 claim types | REFORMULATED — behavior list → claim type taxonomy |
| 12 prohibited behaviors | Immutability boundary + activation boundary prohibitions | UPGRADED — list → multi-boundary enforcement |
| 6-step enrichment workflow | SEP lifecycle + activation process | REFORMULATED — workflow → governed lifecycle |

### 3.2 Replay Safety Migration

| Proto-Concept | SQO Counterpart | Migration Type |
|--------------|-----------------|---------------|
| R1 (deterministic derivation) | Deterministic application order | PRESERVED — extended with package-level ordering |
| R2 (additive-only persistence) | Overlay isolation (never modifies substrate) | PRESERVED — unchanged in principle |
| R3 (source immutability) | Source hash in provenance chain + no-deletion policy | PRESERVED — extended with retention policy |
| R4 (hash-anchored provenance) | Package hash + per-entry source hash | PRESERVED — extended with package-level hashing |
| R5 (operation versioning) | Monotonic integer versioning + lineage tracking | PRESERVED — extended with lineage tracking |
| OV-01 through OV-06 | Replay-safe overlay architecture | SUBSUMED — overlay rules incorporated into comprehensive architecture |

### 3.3 Evaluation Model Migration

| Proto-Concept | SQO Counterpart | Migration Type |
|--------------|-----------------|---------------|
| CEU Paradox | Static/Dynamic CEU separation model | FORMALIZED — observation → architectural distinction |
| Governed Maturation Assistance | Evidence-activated overlay + qualification re-evaluation | REFORMULATED — assistance framing → evaluation framing |
| Evidence requirements (input/output/provenance) | Evidence provenance requirements (5-step chain) | UPGRADED — informal → formal provenance chain |

### 3.4 Boundary Model Migration

| Proto-Concept | SQO Counterpart | Migration Type |
|--------------|-----------------|---------------|
| Lane A frozen | Immutability boundary: certified topology protected | PRESERVED |
| Lane D sovereign | Immutability boundary: DPSIG signals protected | PRESERVED |
| SQO MAY list | SEP claim type taxonomy (what Dynamic CEU can do) | FORMALIZED |
| SQO MUST NEVER list | Activation boundaries (what Dynamic CEU cannot do) | FORMALIZED |
| Governance exploration block | Activation boundary: evidence ≠ semantic authority | PRESERVED |

---

## 4. Migration Completeness Assessment

### 4.1 Fully Migrated

| Domain | Proto-Concepts | SQO Counterparts | Gap |
|--------|---------------|-----------------|-----|
| Governance rules | 6 proto-rules | 6 SQO counterparts | NONE |
| Replay safety | 11 proto-guarantees (R1–R5 + OV-01–OV-06) | Comprehensive overlay architecture | NONE |
| Evaluation model | 3 proto-concepts | 3 SQO counterparts | NONE |
| Boundary model | 5 proto-boundaries | 5 SQO enforcement mechanisms | NONE |

### 4.2 Migration Gaps

| Gap | Description | Status |
|-----|-------------|--------|
| Multi-package cohabitation | No prior-era concept; new governance in current era | NOT A MIGRATION GAP — new governance |
| Aggregate limits (10/50/200) | No prior-era concept; new governance in current era | NOT A MIGRATION GAP — new governance |
| Emergency revocation | No prior-era concept; new governance in current era | NOT A MIGRATION GAP — new governance |

No migration gaps exist. All proto-Dynamic-CEU concepts that have forward
validity are mapped to SQO counterparts.

---

## 5. Migration Verification

### 5.1 Governance Strength Verification

For each migrated concept, the SQO counterpart must be AT LEAST as
strong as the proto-concept:

| Proto-Concept | Proto-Strength | SQO-Strength | Regression? |
|--------------|---------------|-------------|------------|
| Allowed sources (6 items) | Source-list authorization | Class-based authorization (7 classes, 12 source types) | NO — more comprehensive |
| Forbidden sources (9 items) | Source-list prohibition | Boundary-based prohibition (9 protected elements + 5 boundaries) | NO — more comprehensive |
| 12 prohibited behaviors | Behavior list | Multi-boundary enforcement | NO — more comprehensive |
| R1–R5 guarantees | 5 formal guarantees | 5 guarantees + package hashing + versioning | NO — extended |
| OV-01–OV-06 rules | 6 overlay rules | Comprehensive overlay architecture | NO — subsumed |

**Verdict: No governance regression detected.**

### 5.2 Scope Verification

The SQO governance framework must cover all domains that proto-concepts
addressed:

| Domain | Proto-Coverage | SQO-Coverage | Gap? |
|--------|---------------|-------------|------|
| What can be enriched | 8 allowable behaviors | 6 claim types | NO — 6 claim types cover 6 of 8; remaining 2 are not CEU functions |
| What cannot be enriched | 12 prohibitions | 9 protected elements + 5 boundaries | NO — more comprehensive |
| How enrichment is governed | 6-step workflow | SEP lifecycle + activation process | NO — more detailed |
| How replay safety is ensured | R1–R5 + OV-01–OV-06 | Package hashing, ordered application, verification | NO — more comprehensive |
| How evidence is validated | Input/output/provenance requirements | 5-step provenance chain + 8 verification checks | NO — more comprehensive |

**Verdict: No scope regression detected.**

---

## 6. Post-Migration State

After migration, the following is true:

1. **All valid proto-Dynamic-CEU concepts are mapped to SQO counterparts**
2. **No proto-concept is lost without explicit classification (C or D)**
3. **No governance rule is weakened**
4. **No replay safety guarantee is weakened**
5. **No behavioral boundary is relaxed**
6. **New governance (cohabitation, limits, emergency) is additive**
7. **The historical authority chain is documented and traceable**

The proto-Dynamic-CEU conceptual lineage is FULLY MIGRATED to SQO governance.
The canonical Dynamic CEU architecture is the authoritative successor.
