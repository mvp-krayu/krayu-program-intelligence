# Cognition Object Qualification Test

**Stream:** PI.PICP-CONSTITUTION.01
**Classification:** G1 (Architecture Defining)
**Date:** 2026-05-31
**Authority:** Constitutional gate for PICP membership

---

## Purpose

This test determines whether a new artifact qualifies as a Constitutional Cognition Object — a member of the PICP produced by a PICR materializer at L4.

Any artifact that fails ANY criterion is NOT a Cognition Object. It may be a valid artifact at another layer, but it does not belong in the PICP.

---

## The Test

### Gate 1: DERIVATION

> Is this artifact deterministically derivable from CIP inputs?

| Pass | Same CIP inputs always produce the same artifact. No randomness, no external state, no session context |
|------|---|
| Fail | Output varies across runs with identical inputs. Requires external state (user session, time-of-day, prior interaction). Contains stochastic elements |

**Why this matters:** Non-deterministic output is not cognition — it is generation. Cognition must be replayable.

### Gate 2: EVIDENCE BINDING

> Does every field in this artifact trace to a governed source artifact at L0-L3?

| Pass | Every field has a named source (e.g., "from constriction_surface L1", "from synthesisResult.active L2"). No orphan fields |
|------|---|
| Fail | Any field exists without provenance. Any field is "inferred" without a traceable derivation chain. Any field requires knowledge not present in the CIP |

**Why this matters:** A field without provenance is an assertion, not cognition. Assertions belong in L5 projection (under 75.x authority), not L4.

### Gate 3: AUDIENCE INDEPENDENCE

> Can this artifact be produced without knowing who will read it?

| Pass | The artifact contains no audience assumptions. No tone calibration. No vocabulary selected for a specific reader. No emphasis or de-emphasis based on reader role |
|------|---|
| Fail | The artifact changes based on audience (executive vs. engineer vs. analyst). Field names or values assume a specific reader. Vocabulary is calibrated for a consumption context |

**Why this matters:** Audience awareness belongs to L5 (PRE). A cognition object that changes based on who reads it is a projection artifact wearing a cognition label.

### Gate 4: PROJECTION FREEDOM

> Does this artifact contain zero rendering vocabulary, narrative framing, or commercial positioning?

| Pass | No field names or values serve a rendering purpose. No competitive framing. No "how to present this" metadata. No format assumptions |
|------|---|
| Fail | Field names position the content (e.g., "detection_advantages" implies competitive framing). Values contain narrative vocabulary (e.g., "PI uniquely detects..."). The artifact assumes a delivery format |

**Why this matters:** Rendering vocabulary is L5 territory. If a cognition object contains it, the L4/L5 boundary is breached.

**Precedent:** `competitive_intelligence` failed this gate. Its data was valid cognition, but the framing ("detection_advantages", "competitive_intelligence") was projection vocabulary. Reconstituted as `detection_boundary` with neutral measurement-frontier framing.

### Gate 5: STRUCTURAL NOVELTY

> Does this artifact produce structured understanding that no existing cognition object produces?

| Pass | The artifact answers a cognitive question not answered by any current PICP member. It is not a subset, filter, or reorganization of another object |
|------|---|
| Fail | The artifact reorganizes existing cognition (e.g., "top 5 constraints from constraint_inventory"). The artifact combines two existing objects without new synthesis. The cognitive question it answers is already answered by another object |

**Why this matters:** Derived views are valid artifacts but belong in L5 projection (where PRE selects, compresses, and sequences cognition for audiences). Duplicating cognition at L4 creates governance overhead without cognitive value.

### Gate 6: COGNITIVE QUESTION

> Does this artifact answer exactly one distinct question of the form: "What does Program Intelligence understand about [specific dimension] of this program's structural execution reality?"

| Pass | The question is articulable, specific, and distinct from all other cognition objects' questions. The artifact is the complete answer to that question |
|------|---|
| Fail | The question is vague ("what's going on?"). The question overlaps substantially with another object's question. The artifact answers multiple unrelated questions (should be decomposed) |

**Why this matters:** Each cognition object has a cognitive purpose. If that purpose can't be stated as a single clear question, the object is either too broad (decompose) or too vague (sharpen).

### Gate 7: ZERO AUTHORITY

> Can this artifact be produced with ZERO interpretive authority?

| Pass | Production requires only: extraction, arithmetic, set operations, vocabulary lookup, rule application, deterministic classification. No 75.x authority needed |
|------|---|
| Fail | Production requires narrative judgment, audience calibration, emphasis decisions, severity interpretation beyond rule-based classification, or any form of inference not derivable from structural properties |

**Why this matters:** L4 has ZERO interpretive authority. L5 has 75.x bounded authority. If an artifact requires interpretation to produce, it belongs in L5.

---

## Decision Table

| Gates Passed | Verdict | Action |
|-------------|---------|--------|
| All 7 | **COGNITION OBJECT** | Add to PICP via G1 stream. Create materializer. Update constitution |
| 6 of 7, Gate 4 fails | **RECONSTITUTION CANDIDATE** | The data may be valid cognition with projection-contaminated framing. Rename/reframe and re-test |
| 6 of 7, Gate 5 fails | **DERIVED VIEW** | Valid content, but belongs in L5 projection as a view over existing cognition objects |
| 6 of 7, Gate 3 fails | **PROJECTION ARTIFACT** | Belongs in PRE, not PICR. Contains audience assumptions |
| 5 or fewer | **NOT COGNITION** | Does not belong in the PICP at any framing. May be valid at L1-L3 or L5 |

---

## Application Protocol

When a new artifact is proposed for PICP membership:

1. **State the cognitive question.** If you cannot articulate a clear, specific, distinct question of the form "What does PI understand about [X]?" — STOP. The artifact is not ready.

2. **Run all 7 gates.** Document PASS/FAIL for each with evidence. Do not skip gates.

3. **Apply the decision table.** The table is deterministic — there is no discretionary override.

4. **If COGNITION OBJECT:** Propose addition via G1 stream. The stream must:
   - Define the materializer (pure function, CIP inputs only)
   - Define the schema (all fields with source provenance)
   - Verify non-redundancy against all existing objects
   - Update PICP assembly rules
   - Update this qualification test's cognitive question table

5. **If RECONSTITUTION CANDIDATE:** Identify the projection contamination, propose neutral framing, re-test. If it passes after reconstitution, proceed as COGNITION OBJECT.

6. **If DERIVED VIEW or PROJECTION ARTIFACT:** Route to L5 architecture. The content may be valuable but does not belong in the PICP.

---

## Verification of Current PICP Members

All 9 current PICP members have been audited against this test (see COGNITION_OBJECT_CONSTITUTION.md §3):

| Object | G1 | G2 | G3 | G4 | G5 | G6 | G7 | Verdict |
|--------|----|----|----|----|----|----|----|----|
| structural_posture | PASS | PASS | PASS | PASS | PASS | PASS | PASS | A |
| tension_map | PASS | PASS | PASS | PASS | PASS | PASS | PASS | A |
| constraint_inventory | PASS | PASS | PASS | PASS | PASS | PASS | PASS | A |
| exposure_assessment | PASS | PASS | PASS | PASS | PASS | PASS | PASS | A |
| trajectory_assessment | PASS | PASS | PASS | PASS | PASS | PASS | PASS | A |
| decision_surface | PASS | PASS | PASS | PASS | PASS | PASS | PASS | A (boundary note) |
| absence_profile | PASS | PASS | PASS | PASS | PASS | PASS | PASS | A |
| competitive_intelligence | PASS | PASS | PASS | **FAIL** | PASS | PASS | PASS | D → A (reconstituted) |
| operational_ceiling | PASS | PASS | PASS | PASS | PASS | PASS | PASS | A |

**Post-reconstitution (competitive_intelligence → detection_boundary):** All 9 PASS all 7 gates.

---

## Constitutional Lock

This qualification test is the constitutional gate for PICP membership.

- It may only be modified by a G1 stream
- No gate may be removed — only added or refined
- No discretionary override exists — the test is deterministic
- The test applies retroactively — if a current PICP member fails after a gate refinement, it must be reconstituted or removed via G1 stream
