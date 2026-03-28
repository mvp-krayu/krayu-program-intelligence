# Recovered 00.x Canonical Decision

Stream: A.2b — Recovered 00.x Governance Reassessment
Date: 2026-03-28

---

## Decision 1 — MCA-001 Status

**BEFORE:** NOT FOUND (CRITICAL blocker; A.2 missing_canonical_artifacts)
**AFTER:** FOUND — PROVISIONALLY ACCEPTED

Stream 00.2 (canonical-layer-model.md) is located at:
`docs/architecture/_recovered_00x/canonical-layer-model.md`

This file defines the complete L0-L8 canonical layer model. It is the artifact whose absence was registered as MCA-001. The blocker is resolved.

---

## Decision 2 — Canonical Subset Acceptance

The following files from docs/architecture/_recovered_00x/ are accepted as canonical governance baseline:

| File | Stream | Acceptance Status |
|---|---|---|
| canonical-layer-model.md | 00.2 | ACCEPTED — PRIMARY CANONICAL BASELINE |
| canonical-layer-model.classification.md | 00.2 | ACCEPTED — COMPANION CANONICAL |
| canonical-layer-model.drift.md | 00.2 | ACCEPTED — COMPANION CANONICAL |
| canonical-layer-model.validation.md | 00.2 | ACCEPTED — COMPANION CANONICAL |

**Acceptance basis:**
- Explicit Stream 00.2 labelling in each file header
- Structural completeness (11/11 sections per validation record)
- Governance lock in effect (Section 10 of canonical-layer-model.md)
- Internal consistency verified by own validation record

**Acceptance caveat:**
Governance status is PROVISIONAL. The model is defined and in effect but not LOCK-READY due to three open items: SSZ/SSI L3 derivation spec absent, L4 semantic shaping spec absent, validation memory not durably archived. These are implementation gaps, not definitional gaps.

---

## Decision 3 — Retained Historical Subset

The following 7 files are retained as historical enforcement record, not elevated to canonical baseline:

Streams 00.3, 40.12, 40.13, 40.14, 40.15, 40.16, 40.17

These are downstream enforcement artifacts that apply 00.2 authority. They confirm the 00.2 model is operational across the governance chain. They are HIGH confidence and valuable for lineage but are not the defining layer model.

---

## Decision 4 — L1-L6 Verdict Change

**BEFORE (A.1 + A.2):** MODIFIED
**AFTER (A.2b):** CONFIRMED (with PROVISIONAL governance status)

Basis:
- L0-L8 are now all explicitly defined
- L1 = Evidence Normalization Layer
- L2 = Evidence Navigation Layer (ENL)
- L3 = Derivation Layer → 40.5 Signal Computation ✓ maps to observed stream
- L4 = Semantic Shaping Layer → 41.x ✓ maps to observed stream
- L5 = Presentation Assembly Layer → 43.x-44.x binding+projection zone ✓ maps to observed streams
- L6 = Runtime Experience Layer → 42.x ExecLens ✓ maps to observed streams
- All L1-L6 definitions are internally consistent with observed stream behavior from A.1 crawl

**What PROVISIONAL governance status means for the verdict:**
The layer model is CONFIRMED as defined and coherent. PROVISIONAL refers to implementation drift within the model — SSZ/SSI are implemented at L6 (violation of L3), L4 semantic shaping formal spec is absent. These are known deviations that do not change the definition of the model, only its implementation compliance.

The CONFIRMED verdict says: "The L1-L6 model exists, is fully defined, and is internally consistent with observed stream architecture." It does not say: "All implementations are in full compliance."

---

## Decision 5 — A.1 Architecture Paper Status

**BEFORE:** A.1 paper stands (A.2 found no delta)
**AFTER:** A.1 paper requires a targeted addendum or note

The A.1 architecture paper (pios_l1_l6_architecture_paper.md) was produced under the assumption that Stream 00.2 was absent. Key assertions affected:

1. "L1, L2 are NOT DEFINED" → NOW INCORRECT. L1 = Evidence Normalization, L2 = ENL. Both fully defined.
2. "L-Number Model: LOW confidence — partial fragments only" → NOW INCORRECT. Full L0-L8 definition found.
3. "L1-L6 verdict: MODIFIED" → NOW INCORRECT. Verdict is CONFIRMED (PROVISIONAL governance status).
4. AMB-001 status "OPEN" → NOW CLOSED.

The A.1 paper does NOT need to be rewritten. Its evidence documentation and framing remain valid as a historical record of the reconstruction before 00.2 was located. A note should be appended or a separate addendum produced marking the verdict change.

---

## Decision 6 — Promotion of 00.2 Artifacts

The canonical-layer-model.md itself declares in Section 6.6:
> "Canonical placement: docs/architecture/"

The recovered file is currently at docs/architecture/_recovered_00x/canonical-layer-model.md. Logically it should be at docs/architecture/canonical-layer-model.md (its own declared canonical path, per "Primary Path: docs/architecture/canonical-layer-model.md" in the file header).

**Recommendation:** Promote the four Stream 00.2 files to docs/architecture/ (removing _recovered_00x prefix). This decision is reserved for architectural authority (ChatGPT architect role). Claude Code will not promote without explicit instruction.

---

## Summary Table

| Question | Before A.2b | After A.2b |
|---|---|---|
| Stream 00.2 found? | NO | YES |
| MCA-001 status | NOT FOUND (CRITICAL) | FOUND (RESOLVED) |
| L1 defined? | NO | YES — Evidence Normalization Layer |
| L2 defined? | NO | YES — Evidence Navigation Layer (ENL) |
| L3 defined? | FRAGMENT (HIGH) | CONFIRMED (HIGH) |
| L4 defined? | FRAGMENT (HIGH) | CONFIRMED (HIGH) |
| L5 defined? | INFERRED (MEDIUM) | CONFIRMED (MEDIUM→HIGH) |
| L6 defined? | INFERRED (MEDIUM) | CONFIRMED (MEDIUM→HIGH) |
| L1-L6 verdict | MODIFIED | CONFIRMED (PROVISIONAL governance) |
| A.1 paper status | Stands as-is | Valid as reconstruction record; verdict addendum required |
| AMB-001 | OPEN | CLOSED |
