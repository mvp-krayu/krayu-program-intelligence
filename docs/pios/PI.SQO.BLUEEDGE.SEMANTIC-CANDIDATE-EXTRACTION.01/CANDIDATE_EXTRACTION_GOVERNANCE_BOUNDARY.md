# Candidate Extraction Governance Boundary

**Stream:** PI.SQO.BLUEEDGE.SEMANTIC-CANDIDATE-EXTRACTION.01
**Type:** Reusable Doctrine — Governance Boundary

---

## 1. Purpose

This document defines the governance boundary for semantic candidate extraction. It establishes what candidates ARE and what they ARE NOT, and defines the hard boundary between extraction and all downstream pipeline stages.

## 2. What a Candidate IS

A semantic candidate is:

- A **signal** extracted from registered evidence material
- **Non-authoritative** — it carries no governance weight
- **Deterministic** — produced by pattern matching, not interpretation
- **Traceable** — linked to a specific evidence item, source file, and source span
- **Gated** — cannot proceed without Dynamic CEU admissibility evaluation
- **Additive** — extraction creates new candidates without modifying existing state
- **Fail-closed** — any extraction failure stops the pipeline

## 3. What a Candidate IS NOT

### 3.1 A Candidate Is Not Authority

A candidate does not constitute semantic authority. It is not:
- Certified truth
- Grounding evidence
- Authoritative assertion
- Governance-weight-bearing signal

The authority state `NON_AUTHORITATIVE_SEMANTIC_CANDIDATE` is permanent within the extraction corridor. It cannot be escalated to authority through any extraction-corridor mechanism.

### 3.2 A Candidate Is Not Grounding

A candidate that maps to DOMAIN-XX does NOT ground that domain. The mapping indicates that evidence material references the domain — it does not assert that the domain's lineage is improved, its grounding status has changed, or its semantic debt is reduced.

Grounding changes require:
- Dynamic CEU admissibility evaluation
- Overlay proposal and approval
- Qualification delta calculation
- Authority certification

None of these occur in extraction.

### 3.3 A Candidate Is Not an Overlay

A candidate is not an overlay, overlay proposal, or overlay input. Overlays are governed artifacts that modify domain grounding state through a formal proposal and approval workflow.

Candidates may eventually become input to overlay proposals, but ONLY after passing Dynamic CEU admissibility. Extraction does not produce overlays.

### 3.4 A Candidate Is Not a Qualification Delta

A candidate does not change:
- S-state (S0, S1, S2, S3, S4)
- Q-class
- Qualification readiness
- Gate satisfaction
- Progression status

Qualification deltas are computed downstream, after admissibility evaluation, overlay proposal, and formal qualification assessment.

### 3.5 A Candidate Is Not LENS-Consumable

Candidates are not projected through LENS. They do not appear in:
- LENS executive surfaces
- LENS decision surfaces
- LENS tier 1 or tier 2 reports
- Any product-facing artifact

Candidates are visible only in the SQO Cockpit's semantic candidate extraction corridor, which is an operational intelligence view, not a client-facing product.

## 4. Dynamic CEU Remains the Next Required Gate

All candidates carry:

```
next_required_gate: DYNAMIC_CEU_ADMISSIBILITY_REQUIRED
```

This gate is:
- **Mandatory** — no candidate may bypass it
- **Immutable within extraction** — no extraction-corridor operation changes it
- **Rendered in the UI** — every candidate row shows "CEU REQUIRED"
- **Tested** — 63 extraction tests verify gate enforcement

Dynamic CEU admissibility evaluation will:
- Assess whether the candidate provides admissible evidence for its target domain
- Apply admissibility criteria defined in a future contract
- Produce CEU_ADMISSIBLE_CANDIDATE or CEU_REJECTED_CANDIDATE

Until Dynamic CEU is implemented, all candidates remain at `DYNAMIC_CEU_ADMISSIBILITY_REQUIRED`.

## 5. Governance Flags

The extraction corridor enforces these governance flags:

| Flag | Value | Meaning |
|------|-------|---------|
| no_grounding_mutation | true | Extraction cannot change domain grounding status |
| no_overlay_generation | true | Extraction cannot produce overlays |
| no_qualification_mutation | true | Extraction cannot change S-state, Q-class, or gates |
| no_authority_assertion | true | Extraction cannot assert authority |
| no_lens_mutation | true | Extraction cannot modify LENS projection |
| extraction_only | true | Only candidate signal extraction is performed |
| additive_only | true | No existing artifacts or state are modified |
| fail_closed | true | Any failure halts extraction |

These flags are:
- Set in the server-side extractor return value
- Passed through the view model to the UI
- Rendered in the CandidateAuthorityBoundaryNotice component
- Verified by governance tests

## 6. Server/Client Boundary

The governance boundary extends to the implementation architecture:

- **Server side** (`getServerSideProps`): `fs`, `path`, `crypto` used for file reading and hash verification
- **Client side** (React components, view model): No `fs`, `path`, or `crypto` imports; receives serialized JSON props only
- **No browser-side file access**: All evidence file reading occurs server-side

This boundary is:
- Enforced architecturally (Next.js pages-router pattern)
- Verified by 15 tests checking for prohibited imports in client files

## 7. Pipeline Position

```
Evidence Material (HTML artifacts)
  ↓ [PI.SQO.BLUEEDGE.EVIDENCE-INGESTION-CORRIDOR.01]
Evidence Registry (registered, hash-verified, NON_AUTHORITATIVE_EVIDENCE)
  ↓ [PI.SQO.BLUEEDGE.SEMANTIC-CANDIDATE-EXTRACTION.01] ← THIS CORRIDOR
Semantic Candidates (extracted, non-authoritative, gated)
  ↓ [FUTURE: Dynamic CEU admissibility evaluation]
Admissible Candidates (evaluated, scored)
  ↓ [FUTURE: Overlay proposal and approval]
Overlay Proposals (proposed, governance-reviewed)
  ↓ [FUTURE: Qualification delta calculation]
Qualification Deltas (computed, applied)
  ↓ [FUTURE: Authority certification]
Certified Authority (consumable by LENS)
```

This corridor operates at the third stage. It has no authority over any downstream stage and no mechanism to skip stages.
