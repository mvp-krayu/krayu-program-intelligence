# A.10 — CONTROL Completeness & Canonical Snapshot Coverage Gate Report

---

## Metadata

| Field | Value |
|-------|-------|
| **Program** | Krayu — Program Intelligence Discipline |
| **Date** | 2026-03-28 |
| **Stream** | A.10 — CONTROL Completeness & Canonical Snapshot Coverage Gate |
| **Capture stream** | A.10R — Gate Report Capture |
| **Status** | CLOSED |
| **Verdict** | PASS WITH DECLARED GAPS |
| **Scope** | `app/execlens-demo/components/Control.js`, `app/execlens-demo/pages/index.js`, `app/execlens-demo/components/TraversalEngine.js` (read-only inspection) |
| **Evaluated runtime** | `feature/51-9-runtime-convergence` HEAD `f7a27fd` — post-A.9 execution |
| **Authority inputs** | A.9 execution receipt, A.5B validation (44/44 PASS, commit 2c539e8), A.5C (commit 49e4c32), A.6 authority switch (commit 2e21887), A.7 projection purification (commit a40ca58), canonical-layer-model.md (00.2) |

---

## Executive Determination

A.10 inspection confirms that CONTROL provides complete canonical snapshot coverage for all reachable runtime paths as of A.9 execution. The runtime is projection-only and CONTROL-driven for all paths exercised by the current demo surface.

Two legacy paths (Path B and Path C) exist within CONTROL's DEMO_NEXT handler but are not reachable in the current runtime configuration and are not declared as supported paths. Their presence is retained legacy, not active architecture.

51.9 may continue only for declared covered paths. Activation of Path B or Path C is not authorized under the current CONTROL surface without a follow-up CONTROL stream that provides full snapshot coverage for those paths.

---

## Gate Scope

A.10 evaluated the following dimensions:

**CONTROL snapshot completeness.** All fields returned by `CONTROL(intent, context, snapshot) → CONTROL_RESPONSE.newSnapshot` were inventoried. Consumption by `applyControlResponse` in index.js was verified field by field.

**Intent coverage.** All eight intents (`INIT`, `DEMO_START`, `AUTO_START`, `DEMO_NEXT`, `DEMO_EXIT`, `PANEL_TOGGLE`, `PERSONA_SELECT`, `QUERY_SELECT`) were inspected for expected mutation, actual mutation, and missing canonical wiring.

**Path coverage.** Six distinct runtime paths were evaluated: ENTRY, GUIDED/Path A, POST_COMPLETION, FREE/OPERATOR, Path B (legacy), and Path C (legacy). Each was classified as declared/undeclared, canonically covered or not, and validated or not.

**Reachable vs unreachable path status.** Path B and Path C were determined to be state-unreachable in the current runtime configuration. Path B requires `selectedPersona = null && selectedFlow != null`, a combination CONTROL's own state transitions cannot produce. Path C requires `!selectedPersona && !selectedFlow && demoActive`, similarly unreachable since `CONTROL.DEMO_START` is gated on `selectedPersona` being non-null.

**Controlled degradation attribution.** The A.9 removal of `setSelectedQuery('GQ-003')` from the demo stage useEffect was evaluated. The resulting degradation in Path C was attributed to missing canonical wiring in CONTROL.DEMO_NEXT Path C, not to a patch regression.

---

## Accepted Verdict

**PASS WITH DECLARED GAPS**

All reachable declared runtime paths are canonically covered. All gaps are enumerated (G1–G6). No gap is concealed, merged, or waived. Controlled degradation is correctly attributed. No patching occurred during A.10.

---

## Snapshot Coverage Summary

All orchestration-authoritative fields consumed by `applyControlResponse` are returned correctly by every CONTROL intent handler:

`openPanels`, `traversalHistory`, `selectedPersona`, `selectedQuery`, `resolvedPanelState`, `orchestrationState.demoActive`, `orchestrationState.demoStage`, `orchestrationState.demoComplete`, `orchestrationState.guidedStepIndex`, `orchestrationState.rawStepActive`, `orchestrationState.freeMode`, `orchestrationState.traversalNodeIndex`, `orchestrationState.selectedFlow`.

Coverage for all thirteen consumed fields is **COMPLETE** across all intents.

**Partial initialization split (Gap G2).** `CONTROL(INTENTS.INIT)` returns a full snapshot, but only `resolvedPanelState` is extracted from it during React state initialization. All other fields are initialized via independent `useState` defaults whose values match CONTROL.INIT output. This match was validated under A.5B (44/44 PASS). The split is architecturally structural, not currently functional.

**Unconsumed snapshot fields (Gap G3).** Six fields returned by CONTROL are not consumed as React state: `mode`, `currentStepIndex`, `sequenceId`, `allowedTransitions`, `personaEnvelope`, `terminalState`. These fields are either re-derivable from consumed fields at render time or informational. Their presence in the CONTROL snapshot is not an authority violation; their non-consumption is not a runtime defect under current demo scope.

---

## Path Coverage Summary

| Path | Declared | Canonical Coverage | Validated (A.5B) | Status |
|------|----------|-------------------|-----------------|--------|
| ENTRY | ✅ 51.8R | COMPLETE | ✅ 6/6 events | Authorized |
| GUIDED / Path A (EXECUTIVE, CTO, ANALYST) | ✅ 51.8R, 51.9A/B | COMPLETE | ✅ 32/44 events | Authorized |
| POST_COMPLETION | ✅ 51.8R amendment 7 | COMPLETE | ✅ 3/3 events | Authorized |
| FREE / OPERATOR | ✅ 51.8R RUN04/05 | COMPLETE | ✅ 3/3 events | Authorized |
| MID-DEMO DISRUPTION | ✅ 51.8R RUN03, A.5B §F | COMPLETE | ✅ 5/5 events | Authorized |
| Path B — legacy selectedFlow traversal [51.6] | ❌ undeclared | INCOMPLETE — no selectedQuery mutation | ❌ 0 events | Not authorized |
| Path C — standard stage mode [51.4] | ❌ undeclared | INCOMPLETE — G1 gap | ❌ 0 events | Not authorized |

All 44 A.5B-validated events fall within the five authorized paths. No authorized path has a coverage gap.

---

## Gap Register

**G1 — DEMO_NEXT Path C: missing `selectedQuery` propagation**
CONTROL.DEMO_NEXT Path C increments `demoStage` and updates `openPanels` but does not set `selectedQuery`. The prior runtime behavior `setSelectedQuery('GQ-003')` at stage 1 was local authority with no canonical CONTROL counterpart. Removed in A.9. Path C is unreachable in the current runtime; the gap is architecturally real and functionally dormant.

**G2 — INIT snapshot partially consumed**
`CONTROL(INTENTS.INIT)` returns a full 13-field snapshot. Only `resolvedPanelState` is extracted from it in `useState` initialization. All other fields use independent `useState` defaults. The values match CONTROL.INIT output (validated A.5B). No single CONTROL call initializes all runtime state fields. The initialization contract is split between CONTROL and React defaults.

**G3 — Unconsumed CONTROL snapshot fields**
Six snapshot fields — `mode`, `currentStepIndex`, `sequenceId`, `allowedTransitions`, `personaEnvelope`, `terminalState` — are produced by every CONTROL response but are not applied to React state. `mode`, `currentStepIndex`, `sequenceId`, and `terminalState` are re-derivable from consumed fields at render time. `allowedTransitions` and `personaEnvelope` have no current render consumer. No runtime authority violation. Informational gap only.

**G4 — Local `PERSONA_GUIDED_FLOWS` constant used in viewport scroll**
Index.js maintains a local copy of `PERSONA_GUIDED_FLOWS` matching CONTROL's internal `_PERSONA_GUIDED_FLOWS`. The local copy is used for DOM scroll targeting only (not state authority). If CONTROL's internal flow definitions change, the scroll targeting will lag until the local copy is updated. Latent consistency risk; no current functional gap.

**G5 — Path B undeclared and unreachable**
CONTROL.DEMO_NEXT Path B (legacy `selectedFlow` traversal) is implemented but the state combination that activates it (`selectedPersona = null && selectedFlow != null`) cannot be produced by the current runtime's CONTROL-governed state transitions. The path is retained legacy code, not active architecture. Not declared, not validated.

**G6 — INIT not authoritative over all state fields**
Related to G2. No CONTROL call serves as the single bootstrap authority for all React state initialization. Closing this gap requires a bootstrap pattern in which the full CONTROL.INIT snapshot is applied via `applyControlResponse` at mount, replacing all independent `useState` defaults with CONTROL-derived values.

---

## Controlled Degradation Classification

**Degraded behavior.** Following A.9 execution, DEMO_NEXT Path C no longer auto-selects `selectedQuery='GQ-003'` at stage 1. Data will not load automatically if Path C is ever activated.

**Canonical gap exposed.** CONTROL.DEMO_NEXT Path C produces no `selectedQuery` mutation. The removed `setSelectedQuery('GQ-003')` call was local runtime authority with no counterpart in the canonical CONTROL snapshot.

**Regression classification.** Not a regression. The degradation is exclusively in Path C. All 44 A.5B-validated events (Path A / GUIDED) are unaffected. No unauthorized logic was introduced. The failure is explicit, not synthetic.

**Path classification.** Undeclared legacy path / uncovered runtime residue. Path C requires `!selectedPersona && !selectedFlow && demoActive`. This state is unreachable because CONTROL.DEMO_START gates on `selectedPersona` being non-null. Path C cannot be entered through any current user interaction.

**Demo impact.** None. All three current personas (EXECUTIVE, CTO, ANALYST) use PERSONA_GUIDED_FLOWS exclusively. Path C is not exercised by any current demo interaction.

---

## Execution Authorization Boundary

### Authorized

51.9 may continue under the current CONTROL surface for the following paths:

- ENTRY
- GUIDED / Path A (all current personas)
- POST_COMPLETION
- FREE / OPERATOR
- MID-DEMO DISRUPTION scenarios

### Not Authorized

The following are not authorized without a follow-up CONTROL stream providing full canonical snapshot coverage:

- Activation of Path B (legacy selectedFlow traversal without persona)
- Activation of Path C (standard stage mode) or any reliance on Path C demo behavior
- Any 51.9 hardening that depends on Path B or Path C being canonically wired

---

## Required Follow-On Governance

The following actions were accepted as part of the A.10 gate result. They are recorded here as governance obligations, not implementation tasks.

1. **Declare Path C and Path B as legacy-archived.** Add explicit governance annotation in CONTROL.js marking Path B and Path C in DEMO_NEXT as undeclared legacy paths, unreachable in current runtime, requiring a dedicated CONTROL stream before activation.

2. **Close G1 only upon Path C activation.** If the standard stage mode is ever activated, CONTROL.DEMO_NEXT Path C must be extended to produce a `selectedQuery` mutation in its snapshot before reliance on that path.

3. **Close G2 in a future CONTROL stream.** Introduce a bootstrap call pattern that applies the full CONTROL.INIT snapshot to all React state fields at mount, eliminating the split initialization contract.

4. **Resolve G3 — consume or remove unconsumed snapshot fields.** Either wire `allowedTransitions` and `personaEnvelope` to render-time consumers, or declare and remove them from `_rebuildDerivedFields` output to eliminate informational noise. `mode`, `terminalState`, `currentStepIndex`, and `sequenceId` to be documented as non-authoritative derived fields.

5. **Eliminate local `PERSONA_GUIDED_FLOWS` from index.js (G4).** Expose CONTROL's canonical flow definitions as a named export so the viewport scroll effect can consume the authoritative copy rather than maintaining a local duplicate.

6. **Document G3 fields as non-authoritative derived fields.** Add specification note to CONTROL snapshot definition marking `mode`, `terminalState`, `currentStepIndex`, and `sequenceId` as projection-derivable fields not requiring React state consumers.

---

## Closure Statement

A.10 gate truth is materially captured in this artifact. The accepted verdict — PASS WITH DECLARED GAPS, with 51.9 authorized only for declared covered paths — is now persisted and may be cited by downstream streams (B.x productization, subsequent A.x hardening, or architecture closure audits) without rerunning the gate evaluation.

---

*Gate executed: 2026-03-28 | Capture stream: A.10R | Branch: feature/51-9-runtime-convergence | Runtime HEAD at gate: f7a27fd*
