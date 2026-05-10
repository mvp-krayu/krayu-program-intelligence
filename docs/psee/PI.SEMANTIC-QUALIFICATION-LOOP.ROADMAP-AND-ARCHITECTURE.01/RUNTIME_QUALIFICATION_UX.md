# Runtime Qualification UX

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Purpose

This document defines the 15 mandatory exploration areas for surfacing semantic qualification state through the LENS v2 executive projection surface. Each area specifies what information must be available, how it relates to the SQO lifecycle, and what governance constraints apply to its rendering.

This is a design exploration document. It does not authorize implementation. Each area will require a separate implementation stream contract.

---

## 2. Design principles

1. **Disclosure-first.** The executive must see what they are getting and what they are not getting. Hidden qualification state violates governance.
2. **Fail-visible.** Missing SQO artifacts → explicit absence notice, not silent omission. The surface must never appear "complete" when qualification data is absent.
3. **Governance-classified.** Every UX element must be classified by layer (L1 structural / L2 semantic / L3 executive / L4 qualification). Mixing layers without classification violates cognitive stabilization.
4. **No fabrication.** No synthetic improvement projections. No AI-generated timelines. No "you're almost at S3" messaging that is not grounded in measurable artifact evidence.
5. **PATH B authority.** SQO advises on what to render. PATH B decides whether to render it. SQO UX elements are subordinate to PATH B projection authorization.
6. **Forbidden language.** All rendering must comply with Q02_GOVERNANCE_AMENDMENT.md §5: no "probabilistic", "AI confidence", "estimated likelihood", "model thinks".

---

## 3. Mandatory exploration areas

### Area 1: S-State Overlay

**What:** A persistent, visible indicator of the current qualification state (S0/S1/S2/S3/S4+) on the LENS v2 executive surface.

**Information rendered:**
- Current S-state label
- S-state definition (one-sentence summary)
- Whether the state is the highest achievable given current artifacts
- Link to maturity scoring for progression detail

**Governance constraints:**
- S-state must be determined by the state detection algorithm (QUALIFICATION_STATE_MACHINE.md §3), not by UX logic
- S-state label must use the canonical names (STRUCTURAL_ONLY, STRUCTURAL_LABELS_ONLY, PARTIAL_GROUNDING_WITH_CONTINUITY, SEMANTICALLY_GOVERNABLE, GOVERNED_COGNITION)
- S-state overlay must not render for S0 clients on report-pack-only surfaces (S0 does not claim semantic intelligence)

**Layer classification:** L4 (qualification)

---

### Area 2: Semantic Maturity Indicator

**What:** A visual representation of the composite semantic maturity score with dimensional breakdown.

**Information rendered:**
- Composite maturity score (0.0-1.0)
- Per-dimension scores (D1-D7 from SEMANTIC_MATURITY_MODEL.md)
- Visual indicator of which dimensions are contributing and which are at zero
- Gravity coefficient with zone indication (cold start / early traction / compound / full gravity)

**Governance constraints:**
- Maturity score must be rendered from the SQO `maturity_score.json` artifact, not computed at render time
- Dimensional breakdown must show all 7 dimensions — no selective omission
- Gravity coefficient must not imply future improvement without evidence
- No "percentage complete" framing — maturity is not a completion metric

**Layer classification:** L4 (qualification)

---

### Area 3: Qualification Warnings

**What:** Active warnings when qualification state is insufficient for certain executive actions.

**Information rendered:**
- Q-class qualifier chip (per Q02_GOVERNANCE_AMENDMENT.md §5)
- Advisory confirmation requirement (Q-02)
- Executive caution notice (Q-03)
- Evidence unavailable notice (Q-04)
- S-state-specific runtime restrictions

**Governance constraints:**
- Warning language must use the executive register defined in Q02_GOVERNANCE_AMENDMENT.md
- Warnings must not be dismissible if governance-mandated (Q-02 advisory confirmation is mandatory)
- Forbidden language rules apply to all warning text
- No "soft" warnings that diminish the governance significance

**Layer classification:** L3 (executive) + L4 (qualification)

---

### Area 4: Semantic Gap Enumeration

**What:** An explicit list of unresolved semantic gaps with their impact classification.

**Information rendered:**
- Each gap: artifact key, description, impact level (CRITICAL / NON_BLOCKING / INFERENCE_PROHIBITION_PLACEHOLDER)
- Whether the gap blocks S-state progression
- Which S-state the gap prevents achieving
- Remediation pathway for each gap

**Governance constraints:**
- Gaps must be derived from the SQO `semantic_debt_inventory.json` artifact
- No fabricated gaps — every gap must reference a specific missing or insufficient artifact
- Impact classification must be deterministic from artifact state
- No "AI-detected" gap language

**Layer classification:** L4 (qualification)

---

### Area 5: Semantic Debt Panel

**What:** A comprehensive view of semantic debt with prioritized remediation pathways.

**Information rendered:**
- Total debt items count
- Debt items grouped by category (missing artifacts, insufficient grounding, absent continuity, missing validation)
- Priority ordering (which debt items have highest impact on S-state progression)
- Remediation pathway per item (what action resolves the debt)
- Estimated impact per item (which maturity dimensions improve)

**Governance constraints:**
- All debt items must be evidence-linked — no speculative debt
- Remediation pathways must reference documented enrichment pathways
- Impact estimates must state assumptions — no guaranteed outcomes
- Priority ordering must be deterministic from maturity model weights
- No "technical debt" framing — this is semantic debt (semantic maturation, not code quality)

**Layer classification:** L4 (qualification)

---

### Area 6: Enrichment Recommendations Panel

**What:** Actionable guidance for improving semantic maturity.

**Information rendered:**
- Specific source material recommendations (what to provide)
- Format guidance (what format the source material should take)
- Expected enrichment pathway (what the pipeline would do with this material)
- Impact preview (which maturity dimensions would improve)
- Priority ordering (which recommendations have highest impact)

**Governance constraints:**
- Recommendations must reference documented enrichment pathways from MINIMUM_SEMANTIC_ENVELOPE_SPECIFICATION.md §E
- No "upload anything" messaging — guidance must be specific
- Impact previews must state assumptions and limitations
- No guaranteed S-state progression — source material quality determines outcomes
- No recommendation to "run AI analysis" or "generate semantic content"

**Layer classification:** L4 (qualification)

---

### Area 7: Upload Guidance Surface

**What:** Specific instructions for what additional source material to provide and how to provide it.

**Information rendered:**
- Source material types needed (ADRs, capability models, ownership docs, domain glossaries)
- Per-material-type: what it enables, what format is expected, what pipeline step consumes it
- Current material inventory (what has already been provided)
- Material sufficiency assessment (whether current material supports the next S-state transition)

**Governance constraints:**
- Upload guidance must not request proprietary information beyond what the semantic pipeline needs
- Material types must be documented in the enrichment pathway definitions
- Sufficiency assessment must be deterministic from current artifact state
- No "the more you upload the better" framing — guidance must be specific and bounded

**Layer classification:** L4 (qualification)

---

### Area 8: Qualification Timeline Indicators

**What:** Visual representation of qualification history and trajectory.

**Information rendered:**
- Qualification history timeline (S-state transitions over time)
- Maturity score progression over enrichment cycles
- Enrichment events on timeline (when source material was added, when pipeline was re-run)
- Current trajectory (improving, stable, or degrading)

**Governance constraints:**
- Timeline must be rendered from SQO `qualification_history.json` artifact
- No projected future timeline — only historical events
- Trajectory classification must be deterministic from historical data points
- No "estimated time to S3" projections unless grounded in documented enrichment pathway completion criteria

**Layer classification:** L4 (qualification)

---

### Area 9: Qualification Banners

**What:** Prominent visual banners that communicate qualification-critical information.

**Information rendered:**
- S1 banner: "LIVE BINDING FAILED — required semantic artifacts missing" with specific missing artifact keys
- S2 banner: "PARTIAL GROUNDING — advisory confirmation required for executive commitment"
- Degradation banner: "QUALIFICATION DEGRADED — S-state dropped from [prior] to [current]"
- Enrichment available banner: "ENRICHMENT PATHWAY AVAILABLE — source material can improve qualification"

**Governance constraints:**
- Banner text must use contract-mandated language per Q02_GOVERNANCE_AMENDMENT.md
- Banners must not be dismissible for governance-mandated disclosures (S1 rejection, Q-02 advisory)
- Degradation banners must persist until S-state recovers
- No "soft" or "informational" framing for governance-critical banners

**Layer classification:** L3 (executive)

---

### Area 10: Degraded Mode Rendering

**What:** How the executive surface renders when SQO artifacts are absent, corrupt, or stale.

**Information rendered:**
- Explicit absence notice: "Qualification data unavailable"
- Reason classification: ABSENT (never produced), STALE (outdated), CORRUPT (invalid schema)
- Impact statement: what qualification information is missing
- Recovery guidance: what would restore qualification data

**Governance constraints:**
- Missing SQO data must NEVER cause the existing LENS v2 surface to break or degrade
- SQO absence is a L4 qualification layer issue — L1/L2/L3 layers render independently
- The surface must be fully functional without SQO artifacts (SQO is additive)
- No silent fallback — absence must be explicitly disclosed

**Layer classification:** L4 (qualification)

---

### Area 11: Qualification Detail Panels

**What:** Expandable detail panels for each dimension of the maturity model.

**Information rendered:**
- Per-dimension: current score, evidence source, scoring formula, enrichment pathway
- Dimension contribution to composite score
- Dimension contribution to S-state classification
- Historical dimension values (progression over enrichment cycles)

**Governance constraints:**
- Scoring formulas must match SEMANTIC_MATURITY_MODEL.md exactly
- Evidence sources must be traceable to specific artifact fields
- Historical values must come from SQO history artifacts, not computed from git history
- No "industry benchmark" comparisons — maturity is self-referential

**Layer classification:** L4 (qualification)

---

### Area 12: Gating State Indicators

**What:** Visual indicators of projection authorization state and what gates are active.

**Information rendered:**
- Current gating state: AUTHORIZED / AUTHORIZED_WITH_QUALIFICATION / NOT_AUTHORIZED
- Active gates: which governance gates are enforced (G-01 through G-06 per MINIMUM_SEMANTIC_ENVELOPE_SPECIFICATION.md)
- Gate pass/fail status per gate
- What would change gating state (which failed gate to resolve)

**Governance constraints:**
- Gating state must derive from existing resolver and Q-class behavior
- SQO does not create new gates — it reports on existing gates
- Gate indicators must not imply that bypassing gates is possible
- No "override" or "skip" affordances

**Layer classification:** L3 (executive) + L4 (qualification)

---

### Area 13: S-State Manifestation Rendering

**What:** How each S-state manifests visually across the entire executive surface.

**S0 manifestation:**
- Report-pack viewer only
- No executive intelligence surface
- No qualification overlay (S0 does not claim semantic intelligence)

**S1 manifestation:**
- LIVE_BINDING_FAILED page with structured rejection
- Missing artifact enumeration
- Report-pack independently available
- Enrichment recommendations visible (what to do to progress)

**S2 manifestation:**
- Full LENS v2 executive surface
- Q-02 qualifier chip with contract-mandated language
- Maturity overlay active
- Semantic debt panel active
- Advisory confirmation requirement visible

**S3 manifestation:**
- Full LENS v2 executive surface without qualifier chip
- Clean readiness badge
- Maturity overlay showing full scores
- No semantic debt (all domains grounded)

**S4+ manifestation:**
- Extended executive surface with multi-signal-class layers
- Per-layer governance disclosure
- Layer classification (L1/L2/L3) visible per signal class

**Governance constraints:**
- Each S-state manifestation must be deterministic from S-state + artifact state
- No partial rendering of higher S-state elements at lower S-states
- S-state transition must cause immediate surface re-rendering with correct manifestation

**Layer classification:** L3 (executive) + L4 (qualification)

---

### Area 14: Confidence Rendering

**What:** How semantic confidence is communicated without using forbidden probabilistic language.

**Allowed framing:**
- "Structurally grounded" (domain has EXACT or STRONG lineage)
- "Semantic continuity validated" (crosswalk VALIDATED)
- "Evidence available" (all required artifacts present)
- "Advisory confirmation recommended" (Q-02)
- "Structural backing absent" (Q-03)

**Forbidden framing:**
- "85% confident" — probabilistic
- "AI confidence: HIGH" — AI attribution
- "Estimated likelihood" — speculative
- "Model predicts" — inference attribution
- "Probably accurate" — uncertainty language

**Governance constraints:**
- Confidence rendering must use the governance vocabulary exclusively
- No numeric confidence percentages
- Confidence is a property of evidence state, not a prediction
- Grounding ratio may be rendered as a fraction (e.g., "4 of 17 domains structurally grounded") but not as a percentage implying confidence

**Layer classification:** L3 (executive)

---

### Area 15: Degradation Alerts

**What:** Active alerting when qualification state degresses (backward S-state transition).

**Information rendered:**
- Degradation event: from S-state → to S-state
- Cause classification: artifact removal, artifact invalidation, grounding regression, continuity regression
- Impact assessment: what was lost
- Recovery guidance: what would restore the prior state
- Governance obligation: degradation must be disclosed, never hidden

**Governance constraints:**
- Degradation detection must be deterministic from artifact evidence comparison
- Alerts must persist until S-state recovers or is acknowledged by governance authority
- Degradation must never be hidden to maintain a positive appearance
- Recovery guidance must reference documented enrichment pathways
- Alert severity must match the governance significance (S2→S1 is more severe than S3→S2 within maturity but both are governance-significant)

**Layer classification:** L4 (qualification)

---

## 4. Rendering architecture

### SQO artifact dependency

All 15 areas consume SQO artifacts from `artifacts/sqo/<client>/<run_id>/`. The rendering layer does not compute qualification state — it renders pre-computed state from SQO artifacts.

### Fail-safe behavior

If SQO artifacts are absent:
- Areas 1-15: render explicit absence notice
- Existing LENS v2 surface: renders normally (SQO is additive)
- Q-class chip: renders from existing resolver (not from SQO)
- Report-pack: available independently (not affected by SQO)

### Layer separation

```
L1 (structural)    → Lane A artifacts → existing structural rendering
L2 (semantic)      → semantic payload → existing semantic rendering  
L3 (executive)     → Q-class, disclosure → existing executive rendering
L4 (qualification) → SQO artifacts → qualification overlay (NEW)
```

The qualification layer (L4) is strictly additive. It does not modify or replace L1/L2/L3 rendering.

---

## 5. Implementation sequencing

Areas should be implemented in dependency order:

1. **Foundation:** Area 1 (S-state overlay), Area 10 (degraded mode)
2. **Core qualification:** Area 3 (warnings), Area 12 (gating states), Area 13 (S-state manifestation)
3. **Maturity visibility:** Area 2 (maturity indicator), Area 4 (gap enumeration), Area 11 (detail panels)
4. **Debt and remediation:** Area 5 (debt panel), Area 6 (recommendations), Area 7 (upload guidance)
5. **Lifecycle:** Area 8 (timeline), Area 9 (banners), Area 14 (confidence rendering), Area 15 (degradation alerts)

Each group requires an implementation stream contract. No implementation without authorization.

---

## 6. Governance

This document is a design exploration artifact. It identifies what must be surfaced and what constraints apply. It does not authorize implementation. Each exploration area requires a separate implementation stream contract before any code is written.
