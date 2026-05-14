# Q-02 Governance Amendment

**Document type:** GOVERNANCE AMENDMENT
**Status:** AUTHORITATIVE
**Stream:** PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Issued:** 2026-05-10
**Supersedes:** in-flight `Q-00`/`Q-01` placeholder semantics used by legacy
fixture-era adapters; LOCKS the four-class qualifier model below.

---

## 1. Purpose

This amendment formally extends the qualifier taxonomy (per
`GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md` §10 — Cognitive Projection
Stabilization) to a four-class governance model required by the LENS V2
flagship surface to preserve evidence-first honesty in the live BlueEdge
productized binding.

It exists to remove the avoidable "pending semantics" shipped under
`PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01` where Q-02 was emitted only as
`derived_qualifier_class` because the active class was not yet
governance-amended.

This document is the authority for what `qualifier_class` means at the
governance layer. Legacy adapters retain a backward-compatibility mapping
declared in §6.

---

## 2. Core principle

> Q-classes are governance classifications of grounding state.
> They are NOT probabilistic AI confidence.
> They are NOT speculation indicators.
> They describe the relationship between **structural backing** and
> **semantic continuity** for a given run's semantic projection.

A qualifier class is determined by deterministic inputs (structurally
backed domain count, total semantic domain count, semantic continuity
validation status, evidence availability). It is replay-safe and
topology-safe. It does not introduce probabilistic interpolation.

---

## 3. Q-class model (LOCKED)

### Q-01 — FULL_GROUNDING

- All semantic domains are structurally grounded.
- Semantic continuity validated.
- Replay-safe.
- Deterministic continuity verified.
- **Render obligation:** the qualifier chip is NOT rendered (no
  qualification needed).
- **Disclosure language (executive register):** none required.

### Q-02 — PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY

- Semantic continuity validated.
- Partial structural grounding present (`0 < grounded/total < 1`).
- Unresolved grounding gaps explicitly disclosed.
- Replay-safe.
- Topology-safe.
- No speculative interpolation permitted.
- **Render obligation:** the qualifier chip MUST render with the
  contract-mandated language (see §5).
- **Disclosure language (executive register):** "Partial Grounding ·
  Structural Continuity"; the executive note must convey that the
  semantic continuity is validated but advisory confirmation is
  required for executive commitment on partially grounded domains.
- **Forbidden language:** "medium confidence", "AI uncertainty",
  "probabilistic", "estimated likelihood", "model thinks".

### Q-03 — SEMANTIC_ONLY

- Semantic continuity present.
- Insufficient or zero structural grounding (`grounded/total == 0`).
- Executive caution mandatory.
- **Render obligation:** the qualifier chip MUST render. The disclosure
  must explicitly state that there is no structural backing and only
  semantic continuity supports the projection.
- **Disclosure language (executive register):** "Semantic Continuity
  Only · structural grounding absent".

### Q-04 — UNAVAILABLE

- Evidence absent or rejected.
- No semantic projection allowed.
- **Render obligation:** the qualifier chip MUST NOT render. An explicit
  absence notice MUST be rendered in its place.
- **Disclosure language (executive register):** "Withheld · evidence
  unavailable".

---

## 4. Resolution rule (LOCKED)

```
let groundedRatio  = backed_count / total_count           // strict integer division
let semanticOK     = (semantic_continuity_status == 'VALIDATED')
let evidenceOK     = (evidence_availability  == 'AVAILABLE')

if (!evidenceOK)              → Q-04
if (groundedRatio == 1.0)     → Q-01
if (groundedRatio == 0)
  if (semanticOK)             → Q-03
  else                        → Q-04
if (0 < groundedRatio < 1.0)
  if (semanticOK)             → Q-02
  else                        → Q-03
```

Mandatory prohibitions:

- **Never derive Q-01 from semantic continuity alone.**
- **Never emit Q-02 without recording the unresolved grounding gaps in
  `unresolved_semantic_gaps` of the rendering metadata.**
- **Never emit Q-03 without recording the absence of structural backing
  as the explicit reason.**
- **Never collapse Q-04 into Q-03 to avoid a difficult disclosure.**

The resolver MUST be a deterministic pure function of its inputs. Re-run
on the same input MUST produce the same Q-class.

---

## 5. Disclosure obligations

The executive surface MUST visibly disclose:

| Q-class | Chip rendered | Surface text                                               |
|---------|---------------|------------------------------------------------------------|
| Q-01    | NO            | (no chip; readiness badge alone is sufficient)             |
| Q-02    | YES           | "QUALIFIER Q-02 · Partial Grounding · Structural Continuity" |
| Q-03    | YES           | "QUALIFIER Q-03 · Semantic Continuity Only"                  |
| Q-04    | NO            | Explicit absence notice ("Withheld · evidence unavailable") |

For Q-02 and Q-03, the chip MUST be accompanied by a one-sentence
executive note stating the obligation: advisory confirmation before
commitment (Q-02) or executive caution due to absent structural backing
(Q-03).

**Forbidden language anywhere on the surface:** probabilistic / AI /
confidence-percent / estimated-likelihood phrasings.

---

## 6. Backward compatibility (LOCKED)

Legacy fixture-era adapters retain a compat lane. The compat mapping is:

| New (governance) class | Legacy adapter class |
|------------------------|----------------------|
| Q-01 (FULL_GROUNDING)  | Q-00 (Full Grounding)|
| Q-02 (PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY) | Q-01 (Partial Grounding) |
| Q-03 (SEMANTIC_ONLY)   | Q-02 (Structural View Only) — semantically inverse; tooltip override required |
| Q-04 (UNAVAILABLE)     | Q-04 (Withheld)      |

Rules:

1. The live payload `qualifier_summary.qualifier_class` field MUST carry
   the new (governance) class.
2. The fixture-compat top-level `qualifier_class` field MUST carry the
   legacy adapter class so existing adapter tests continue to pass.
3. The live executive surface MUST display the new class with the
   contract-mandated language.
4. The Q-03 ↔ legacy Q-02 mapping is semantically inverse; surfaces that
   render legacy Q-02 must explicitly override the tooltip with the new
   meaning before any Q-03 surface is shipped.
5. The compat mapping MUST NOT be used as a hidden shortcut to avoid
   emitting the new class. Any consumer that renders to executives MUST
   use the new class.

---

## 7. Replay safety

Replay safety is preserved by:

- The resolver is a pure function of `(backed_count, total_count,
  semantic_continuity_status, evidence_availability)`.
- The resolver records its inputs and rule version in
  `qualifier_summary.derivation_inputs` and
  `qualifier_summary.derivation_rule`.
- `rendering_metadata.json` is an additive vault artifact. It is never
  mutated; a re-emission must be byte-identical for byte-identical inputs.
- TAXONOMY-01 fields are NEVER touched by qualifier resolution. The
  qualifier is L4 semantic shaping; replay-safe DPSIG fields remain at
  L1/L2.

---

## 8. Forbidden behaviors

- Synthetic Q-class emission without evidence inputs.
- AI-generated grounding classification.
- Mutating historical qualifiers retroactively (historical artifacts
  remain under the model active at the time of emission; this amendment
  applies forward).
- Hiding unresolved grounding gaps in order to project a higher Q-class.
- Rewriting DPSIG semantics under the cover of a qualifier amendment.
- Modifying client substrate truth.
- Introducing topology mutation.
- Introducing AI calls.
- Introducing prompt UX.
- Introducing chatbot UX.

---

## 9. Manifest reference

This amendment is referenced by the manifest under stream
`PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01` (additive cognitive
stabilization). It does not modify any frozen lane (Lane A / Lane D
DPSIG / 75.x thresholds). It extends Q-XX qualifier taxonomy entries per
GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md §4 ("Allowed: Extend qualifier
taxonomy (Q-XX)").

---

## 10. Implementation surfaces

The first surface bound to this amendment is the LENS V2 flagship route
(`/lens-v2-flagship`) under the BlueEdge productized run
`run_blueedge_productized_01_fixed`. Additional clients/runs MAY adopt
this amendment by registering the corresponding `rendering_metadata.json`
in their per-run vault (see RENDERING_METADATA_IMPLEMENTATION.md).

This amendment MUST NOT be cited as authority for emitting Q-02 or Q-03
without the underlying `rendering_metadata.json` artifact being present
in the vault.

---

## 11. Governance ledger

| Field                        | Value                                            |
|------------------------------|--------------------------------------------------|
| Amendment id                 | Q02-AMENDMENT-01                                 |
| Stream                       | PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01      |
| Baseline                     | governed-dpsig-baseline-v1 (93098cb)             |
| Issuance date                | 2026-05-10                                       |
| Status                       | AUTHORITATIVE — LOCKED                           |
| Authority                    | Architect / owner via stream contract            |
| Compatibility                | Legacy adapters unaffected (compat mapping §6)   |
| Replay safety                | PRESERVED                                        |
| Topology immutability        | PRESERVED                                        |
| AI inference                 | PROHIBITED                                       |
