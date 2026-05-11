# Preserved vs Prohibited Concepts

**Stream:** PI.SQO.DYNAMIC-CEU.RE-GOVERNANCE-AND-CLASSIFICATION.01.REVISED
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Dependency:** HISTORICAL_AUTHORITY_LOAD_REPORT.md (complete), PROTO_DYNAMIC_CEU_CLASSIFICATION.md (complete)

---

## 1. Purpose

This document provides a definitive registry of which historical Dynamic CEU
concepts are preserved in the current canonical architecture and which are
explicitly prohibited. This is the authoritative reference for determining
whether a historical concept has forward validity.

---

## 2. Preserved Concepts

### Category A — Preserved Intact (No Reformulation)

| ID | Concept | Origin | Preserved As |
|----|---------|--------|-------------|
| A-01 | Structural-relational intelligence | Early (governance exploration) | Foundation of Dynamic CEU: observation ≠ activation |
| A-02 | CEU grounding classification (GROUNDED/NON_GROUNDED/DERIVED/INVALID) | Early (grounding design) | Static CEU — the immutable certified substrate |
| A-03 | 11-step mapping algorithm | Early (grounding design) | Static CEU pipeline grounding process |
| A-04 | CEU Paradox | Mid (governance model) | Foundational justification for Static/Dynamic separation |
| A-05 | 12 prohibited behaviors | Mid (governance model) | Immutability boundary + activation boundary prohibitions |
| A-06 | Replay-safe guarantees R1–R5 | Mid (replay-safe model) | SEP overlay architecture replay safety |
| A-07 | Lane architecture (A/B/C/D) | Mid (SQO lane architecture) | Structural boundary model for all SQO operations |
| A-08 | SQO boundary contract (MAY/MUST NEVER) | Mid (SQO lane architecture) | Dynamic CEU activation boundary foundations |
| A-09 | 6-stage governed extension lifecycle | Mid (extension model) | Governance lifecycle for Dynamic CEU deployment |

### Category B — Preserved with Reformulation

| ID | Concept | Origin | Reformulated As |
|----|---------|--------|----------------|
| B-01 | Contamination prevention (FM-1 through FM-9) | Early (grounding design) | Immutability boundary (9 protected elements) |
| B-02 | Allowed mapping sources (MS-1 through MS-6) | Early (grounding design) | Semantic class authorization (7 classes) |
| B-03 | CEU as Governed Maturation Assistance | Mid (governance model) | Evidence-activated additive semantic overlay |
| B-04 | 8 allowable behaviors | Mid (governance model) | 6 claim types (LABEL_ASSIGNMENT through DOMAIN_TYPING) |
| B-05 | 6-step enrichment workflow | Mid (governance model) | SEP lifecycle + activation process |
| B-06 | Overlay rules OV-01 through OV-06 | Mid (replay-safe model) | Replay-safe overlay architecture |

---

## 3. Prohibited Concepts

### Category C — Historically Important, Currently Prohibited

| ID | Concept | Origin | Why Prohibited | Governance Enforcement |
|----|---------|--------|---------------|----------------------|
| C-01 | Semantic activation authority | Early (governance exploration) | The 21-stream exploration INTENTIONALLY BLOCKED this. Dynamic CEU activates evidence, not semantics. Reintroducing semantic activation would violate the foundational governance boundary. | Pre-activation: "Source authority is external." Immutability: cannot override Q-class or bypass S-state gates. |

### Category D — Obsolete (No Forward Path)

| ID | Concept | Origin | Why Obsolete |
|----|---------|--------|-------------|
| D-01 | PSIG signal enrichment | Early (governance exploration) | Enrichment target shifted from signals to qualification state. DPSIG is Lane D sovereign. Signal enrichment has no mechanism in SEP architecture. |

---

## 4. Preservation Integrity Rules

The following rules govern how preserved concepts interact with the
current architecture:

### Rule P-01: Preserved concepts must not expand scope

A preserved concept retains its original governance scope. Preservation
does NOT grant new authority. Example: the SQO boundary contract's MAY
list (A-08) cannot be expanded without explicit governance extension.

### Rule P-02: Reformulated concepts must subsume the original

A reformulated concept must be strictly more comprehensive than the
original. Example: the immutability boundary (B-01) must cover ALL
contamination scenarios that FM-1 through FM-9 covered, plus additional
scenarios the original did not address.

### Rule P-03: Prohibited concepts may not be re-enabled without governance stream

A prohibited concept (Category C) cannot be re-enabled by a runtime
implementation, a contract, or an operational decision. Re-enabling
requires a dedicated governance specification stream that:
1. Loads the original prohibition authority
2. Demonstrates that conditions have changed
3. Establishes new governance boundaries
4. Passes all 4-brain alignment checks

### Rule P-04: Obsolete concepts may not be resurrected

An obsolete concept (Category D) has no forward path. Resurrection would
require a new concept stream, not a re-governance stream. The obsolete
concept cannot be cited as precedent for new work.

### Rule P-05: Historical authority does not decay

A concept's historical authority chain does not weaken over time.
If a concept was prohibited in the early era, the prohibition is as
strong today as it was when issued. Time does not create authority gaps.

---

## 5. Cross-Reference to Current Architecture

| Current Architecture Element | Preserved Concepts Used | Reformulated Concepts Used |
|-----------------------------|------------------------|--------------------------|
| Static CEU | A-02, A-03 | — |
| Dynamic CEU (overall) | A-01, A-04, A-05, A-06, A-07, A-08, A-09 | B-01, B-02, B-03, B-04, B-05, B-06 |
| SEP architecture | A-06 | B-03, B-05, B-06 |
| Activation boundaries | A-05, A-08 | B-01, B-02 |
| Claim type taxonomy | — | B-04 |
| Overlay mechanics | A-06 | B-06 |
| Qualification re-evaluation | A-04 | B-03 |
| Immutability boundary | A-05, A-07 | B-01 |
| Semantic class authorization | — | B-02 |
| Provenance requirements | A-06 | — |

---

## 6. Verification Matrix

| Check | Status |
|-------|--------|
| All preserved concepts traceable to authority document | VERIFIED |
| All reformulated concepts subsume their originals | VERIFIED |
| All prohibited concepts have enforcement mechanism | VERIFIED |
| All obsolete concepts have no forward path | VERIFIED |
| No prohibited concept appears in current architecture | VERIFIED |
| No obsolete concept appears in current architecture | VERIFIED |
| Preservation integrity rules are self-consistent | VERIFIED |
