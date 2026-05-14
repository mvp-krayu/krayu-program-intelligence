# Cross-Era Reconciliation Model

**Stream:** PI.SQO.DYNAMIC-CEU.RE-GOVERNANCE-AND-CLASSIFICATION.01.REVISED
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Dependency:** HISTORICAL_AUTHORITY_LOAD_REPORT.md (complete)

---

## 1. Purpose

This document reconciles conceptual models, terminology, governance rules,
and behavioral boundaries across the three eras (Early, Mid, Current) of
Dynamic CEU evolution. Reconciliation determines which concepts survived
intact, which were transformed, and which were superseded.

---

## 2. Terminology Reconciliation

| Term (Early Era) | Term (Mid Era) | Term (Current Era) | Reconciliation |
|-------------------|----------------|---------------------|----------------|
| Signal enrichment | Semantic enrichment | Evidence activation | TRANSFORMED: enrichment of signals → enrichment of qualification state via governed evidence |
| CEU grounding | Static CEU grounding | Static CEU | PRESERVED: pipeline-certified immutable grounding, unchanged in meaning |
| (not yet named) | Dynamic CEU | Dynamic CEU / SEP | PRESERVED: name retained, formalization added |
| Semantic activation | Semantic authority | (prohibited) | PRESERVED AS PROHIBITION: blocked in early era, remains blocked |
| PSIG enrichment | (subsumed) | (not referenced) | OBSOLETE: PSIG-specific enrichment direction abandoned |
| Contamination | Substrate mutation | Immutability boundary | TRANSFORMED: same concern, progressively stronger governance |
| Allowed mapping sources | Allowable behaviors | Authorized semantic classes | TRANSFORMED: source-list model → class-authorization model |
| Forbidden mapping sources | Prohibited behaviors | Activation boundaries | TRANSFORMED: forbidden-list → boundary-based governance |
| (not formalized) | Replay safety | Replay-safe overlay architecture | FORMALIZED: informal concern → R1–R5 → SEP package hashing |
| (not formalized) | Lane model | SQO lane architecture | FORMALIZED: implicit separation → explicit lane model |
| (not formalized) | CEU Paradox | Static/Dynamic CEU separation | RESOLVED: paradox identified the need; separation model resolves it |
| (not formalized) | Governed Maturation Assistance | Qualification re-evaluation | TRANSFORMED: concept → formal 8-step re-evaluation process |

---

## 3. Governance Rule Reconciliation

### 3.1 Immutability Rules

| Era | Rule | Current Status |
|-----|------|---------------|
| Early | 9 forbidden mapping sources (FM-1 through FM-9) | SUBSUMED by immutability boundary (9 protected elements) |
| Early | Contamination prevention via pipeline isolation | SUBSUMED by overlay isolation architecture |
| Mid | Lane A frozen, DPSIG sovereign | PRESERVED — Lane A immutability and DPSIG sovereignty unchanged |
| Mid | SQO MUST NEVER mutate Lane A | PRESERVED — overlay architecture enforces this |
| Mid | TAXONOMY-01 fields immutable | PRESERVED — replay-safe integration rules unchanged |
| Current | 9 protected elements in Static/Dynamic CEU separation | AUTHORITATIVE — current formalization |
| Current | Immutability boundary in activation specification | AUTHORITATIVE — current formalization |

**Reconciliation verdict:** All immutability rules converge. No contradiction. Current era
subsumes all prior immutability governance with strictly more comprehensive enforcement.

### 3.2 Enrichment Scope Rules

| Era | Rule | Current Status |
|-----|------|---------------|
| Early | 6 allowed mapping sources (MS-1 through MS-6) | SUBSUMED by semantic class authorization (7 classes) |
| Early | Enrichment target: PSIG signals | OBSOLETE — enrichment target is now qualification state |
| Mid | 8 allowable behaviors | SUBSUMED by activation boundaries (5 types) |
| Mid | 12 prohibited behaviors | SUBSUMED by immutability boundary (9 protected elements + activation boundary prohibitions) |
| Mid | SQO MAY enrich/annotate/qualify/contextualize | PRESERVED — SQO boundary contract unchanged |
| Current | 7 semantic classes with source-to-class authorization | AUTHORITATIVE — current formalization |
| Current | 6 claim types (LABEL_ASSIGNMENT through DOMAIN_TYPING) | AUTHORITATIVE — current formalization |

**Reconciliation verdict:** Scope governance evolved from source-list to behavior-list to
class-authorization model. Each evolution is strictly more comprehensive. No valid prior
scope rule is violated by current formalization.

### 3.3 Replay Safety Rules

| Era | Rule | Current Status |
|-----|------|---------------|
| Early | (not formalized) | N/A |
| Mid | R1: Deterministic derivation | PRESERVED — incorporated into SEP architecture |
| Mid | R2: Additive-only persistence | PRESERVED — overlay architecture is additive-only |
| Mid | R3: Source immutability | PRESERVED — source hash in provenance chain |
| Mid | R4: Hash-anchored provenance | PRESERVED — package hashing in overlay architecture |
| Mid | R5: Operation versioning | PRESERVED — monotonic integer versioning in overlay model |
| Mid | OV-01 through OV-06 overlay rules | SUBSUMED by replay-safe overlay architecture |
| Current | Package hashing, ordered application, deterministic recomputation | AUTHORITATIVE — current formalization |

**Reconciliation verdict:** R1–R5 guarantees fully preserved. OV-01 through OV-06 subsumed
by the more comprehensive SEP overlay architecture. No replay safety regression.

### 3.4 Authority and Activation Rules

| Era | Rule | Current Status |
|-----|------|---------------|
| Early | Semantic activation authority BLOCKED | PRESERVED — Dynamic CEU does NOT activate semantics |
| Early | Structural-relational intelligence ≠ semantic authority | PRESERVED — Dynamic CEU activates EVIDENCE, not semantics |
| Early | Observation allowed, activation requires governance gate | PRESERVED — activation requires pre-activation verification |
| Mid | Evidence requirements: input/output/provenance | SUBSUMED by evidence provenance requirements (5-step chain) |
| Mid | 6-stage governed extension lifecycle | PRESERVED — lifecycle model unchanged |
| Current | 9 pre-activation requirements | AUTHORITATIVE — current formalization |
| Current | 5 activation boundaries | AUTHORITATIVE — current formalization |

**Reconciliation verdict:** The early era's intentional block on semantic activation is
respected by current architecture. Dynamic CEU activates EVIDENCE that augments qualification
evaluation — it does not activate semantic authority. This is a critical distinction that
must be preserved in all future implementations.

---

## 4. Behavioral Boundary Reconciliation

### 4.1 Mid Era Allowable Behaviors → Current Era Mapping

| Mid Era Allowable | Current Era Equivalent |
|-------------------|----------------------|
| Add semantic labels to unlabeled surfaces | LABEL_ASSIGNMENT claim type |
| Upgrade lineage classification | LINEAGE_UPGRADE claim type |
| Extend crosswalk mappings | CONTINUITY_MAPPING claim type |
| Bind capability assertions | CAPABILITY_BINDING claim type |
| Enrich edge semantics | EDGE_ENRICHMENT claim type |
| Assign domain typing | DOMAIN_TYPING claim type |
| Provide maturation guidance | Not a Dynamic CEU function — moved to cockpit display |
| Gate progression readiness | Not a Dynamic CEU function — moved to qualification re-evaluation |

**Reconciliation verdict:** 6 of 8 mid-era allowable behaviors map directly to current-era
claim types. The remaining 2 are not Dynamic CEU functions — they are cockpit/evaluation
functions that use Dynamic CEU output.

### 4.2 Mid Era Prohibited Behaviors → Current Era Mapping

| Mid Era Prohibited | Current Era Enforcement |
|-------------------|------------------------|
| Mutate certified topology | Immutability boundary — PROHIBITED |
| Modify DPSIG signals | Immutability boundary — PROHIBITED |
| Override Q-class formula | Immutability boundary — PROHIBITED |
| Invent semantic labels | Claim boundary — PROHIBITED (only 6 claim types) |
| Bypass S-state gates | Immutability boundary — PROHIBITED |
| Modify decision validation | Immutability boundary — PROHIBITED |
| Alter reproducibility verdict | Immutability boundary — PROHIBITED |
| Suppress disclosure | Immutability boundary — PROHIBITED |
| Cross client/run boundaries | Scope boundary — PROHIBITED |
| Produce global enrichments | Scope boundary — PROHIBITED |
| Self-referential authority | Pre-activation requirement — PROHIBITED |
| Activate without governance | Pre-activation requirements (9 checks) — PROHIBITED |

**Reconciliation verdict:** All 12 mid-era prohibited behaviors are enforced in current
era with strictly more comprehensive governance mechanisms.

---

## 5. Cross-Era Consistency Verdict

| Dimension | Status |
|-----------|--------|
| Immutability governance | CONSISTENT — progressively strengthened, never weakened |
| Enrichment scope governance | CONSISTENT — progressively formalized, never expanded beyond authority |
| Replay safety governance | CONSISTENT — R1–R5 preserved, SEP architecture extends |
| Activation authority governance | CONSISTENT — early era block respected, evidence ≠ semantic activation |
| Behavioral boundaries | CONSISTENT — all prohibited behaviors remain prohibited |
| Terminology | RECONCILED — see §2 mapping |

**No cross-era governance contradictions detected.**
