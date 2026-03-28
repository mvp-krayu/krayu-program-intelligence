# A.11 — CONTROL Completeness Closure Planning

---

## Metadata

| Field | Value |
|-------|-------|
| **Program** | Krayu — Program Intelligence Discipline |
| **Date** | 2026-03-28 |
| **Stream** | A.11 — CONTROL Completeness Closure Planning |
| **Status** | CLOSED — planning only, no execution |

---

## Planning Context

**A.10 verdict:** PASS WITH DECLARED GAPS

**A.10R captured:** `docs/governance/architecture/gates/A.10_control_completeness_gate_report.md`

**51.9 authority constraint:** 51.9 may continue only for declared covered paths.

**Purpose of A.11:** Transform the accepted A.10 / A.10R gate truth into a deterministic, non-drifting closure plan. This stream produces planning only. No remediation is allowed. No reinterpretation of A.10 is allowed.

---

## Gap Closure Classification Matrix

| Gap | Gap Type | Runtime Reachability | Closure Necessity | Regression Risk if Closed | Recommended Closure Vehicle | Authorization Impact |
|-----|----------|---------------------|-------------------|--------------------------|----------------------------|---------------------|
| **G1** — DEMO_NEXT Path C missing `selectedQuery` | Dormant legacy gap | Unreachable now; reachable only if Path C reactivated | Mandatory before any Path C activation or demo expansion into stage mode | Low — path currently unreachable; no active consumers | Future CONTROL execution stream (extend DEMO_NEXT Path C snapshot to include `selectedQuery` mutation) | No current 51.9 scope impact. Mandatory precondition for Path C activation eligibility. Architecture closure requires explicit disposition (close or archive). |
| **G2** — INIT snapshot only partially consumed | Initialization integrity gap | Non-runtime — affects initialization correctness, not path execution | Mandatory before architecture closure | Medium — restructuring `useState` initializers requires React mount-time batching verification; values currently match (A.5B) | Future CONTROL execution stream (CONTROL bootstrap authority closure — full INIT snapshot applied via `applyControlResponse` at mount) | No impact on current allowed 51.9 scope or demo trust. Blocks architecture closure declaration until resolved. |
| **G3** — Six unconsumed CONTROL snapshot fields | Informational surface gap | Non-runtime — no render consumer for `allowedTransitions`, `personaEnvelope`; others derivable at render time | Optional cleanup (`allowedTransitions`, `personaEnvelope` — either wire or remove); Documentation-only for `mode`, `terminalState`, `currentStepIndex`, `sequenceId` | Low — removing fields from `_rebuildDerivedFields` reduces snapshot noise with no state-authority effect; wiring fields adds render consumers with no orchestration change | Future documentation/specification stream for derivable fields; future CONTROL execution stream if `allowedTransitions`/`personaEnvelope` are wired | None. No current or future path authorization depends on these fields being consumed. |
| **G4** — Local `PERSONA_GUIDED_FLOWS` constant in viewport scroll | Consistency drift risk | Reachable now — scroll effect fires during all GUIDED/Path A demo interactions | Mandatory before demo expansion or any PERSONA_GUIDED_FLOWS update; optional cleanup under current stable flow definitions | Low — exposing CONTROL's `_PERSONA_GUIDED_FLOWS` as a named export and consuming it in index.js is a contained, non-authority-bearing change | Future CONTROL execution stream (expose canonical flow definitions as named export; consume in index.js viewport scroll useEffect) | No impact on current 51.9 scope or path authorization. Eliminates latent drift risk before it becomes a live defect. |
| **G5** — Path B undeclared and unreachable | Dormant legacy gap | Unreachable now — state combination `selectedPersona = null && selectedFlow != null` is CONTROL-unproducible | Archive only — no execution needed; mandatory disposition before architecture closure | Low — archival is documentation-only; no code change required | Legacy archival stream or documentation annotation directly in CONTROL.js DEMO_NEXT Path B | No current impact. Explicit archival annotation is a precondition for architecture closure eligibility. |
| **G6** — INIT not sole initialization authority over all state fields | Initialization integrity gap | Non-runtime — structural property of mount-time state construction | Mandatory before architecture closure | Medium — same risk profile as G2; logically coupled | Future CONTROL execution stream (same bootstrap authority closure as G2; G2 and G6 are closed by the same stream) | No impact on current allowed scope or demo trust. Blocks architecture closure declaration. Separately traceable from G2: G6 describes the structural contract gap; G2 describes the specific mechanical consequence. |

---

## Closure Priority Order

**Priority 1 — G4 (Consistency Drift Risk — Active)**
G4 is the only gap with a currently reachable runtime surface. The viewport scroll effect fires during every GUIDED/Path A demo interaction. If flow definitions change upstream in CONTROL before G4 is closed, the scroll behavior will silently drift. This is the only gap that can produce a live defect without activating a legacy path. Highest closure priority.

**Priority 2 — G2 + G6 (Initialization Integrity — Architecture Closure Gate)**
G2 and G6 share a single root cause (split initialization contract) and a single closure vehicle (bootstrap authority stream). They are separately traceable but execute together. Both are mandatory for architecture closure. Their current risk is low only because A.5B validation confirmed value parity at the time of execution — a condition that must be maintained by discipline rather than by structure. Closing both eliminates the structural fragility.

**Priority 3 — G1 (Dormant Legacy Gap — Activation Precondition)**
G1 is dormant. Path C is unreachable. However, G1 defines a mandatory precondition: before Path C can be activated or relied upon, CONTROL.DEMO_NEXT Path C must produce a `selectedQuery` mutation. This must be planned and ready before any architecture decision to expand demo scope toward stage mode. Closing G1 has no current urgency but must not be allowed to persist unclosed if Path C activation is ever considered.

**Priority 4 — G5 (Dormant Legacy — Archival Disposition)**
G5 requires only a governance annotation, not a CONTROL execution stream. Path B must be explicitly annotated as dormant-governed legacy with stated activation conditions. This is low-effort and has no regression risk. It is a precondition for architecture closure and should be executed as part of the legacy archival stream.

**Priority 5 — G3 (Informational Surface — Optional Cleanup)**
G3 has no functional impact on any current or declared future path. The unconsumed fields `allowedTransitions` and `personaEnvelope` require a disposition decision (wire or remove), but neither choice is architecturally urgent. The derivable fields (`mode`, `terminalState`, `currentStepIndex`, `sequenceId`) require only specification documentation. G3 is the lowest priority gap and does not block any current or near-term stream.

---

## Dormant Legacy Decision

**Path B — Legacy selectedFlow traversal [51.6]**

Decision: **Retain as dormant but explicitly governed.**

Rationale: CONTROL.DEMO_NEXT Path B is implemented. The state combination that activates it (`selectedPersona = null && selectedFlow != null`) is unreachable through current CONTROL-governed transitions. Path B represents a prior architectural investment in flow-based traversal that may be relevant if traversal engine re-activation (B.x or later) is ever pursued. Removal is unnecessary and potentially destructive to future options. The mandatory governance action is annotation: Path B must carry an explicit marker in CONTROL.DEMO_NEXT declaring it as dormant-governed legacy, stating its activation precondition (full snapshot coverage + A.5B-equivalent validation for Path B scenarios), and referencing this plan as the governing authority. No execution without a dedicated CONTROL stream explicitly activating it.

**Path C — Standard stage mode [51.4]**

Decision: **Retain as dormant but explicitly governed.**

Rationale: CONTROL.DEMO_NEXT Path C is implemented and handles `demoStage` progression with `openPanels` correctly. The only missing canonical wiring is `selectedQuery` (Gap G1). Path C represents the original pre-51.8R demo mode and retains potential value as a fallback or regression test baseline. Activation is blocked by G1 (missing `selectedQuery`) and by the absence of any declaration. The mandatory governance action is annotation: Path C must carry an explicit marker in CONTROL.DEMO_NEXT declaring it as dormant-governed legacy with the stated preconditions for activation (G1 closed, path declared, scenario validation performed). No execution without a CONTROL stream explicitly activating it.

---

## Execution Stream Decomposition

The following minimal bounded streams are required to close all mandatory gaps. Each stream is defined by scope only. No execution detail is specified here.

**Stream A.12 — CONTROL Consistency Surface Closure**
Scope: Close G4. Expose CONTROL's `_PERSONA_GUIDED_FLOWS` as a named export (`PERSONA_GUIDED_FLOWS`). Update index.js viewport scroll useEffect to consume the CONTROL-exported constant rather than the local duplicate. Touch scope: `Control.js`, `index.js`.
Prerequisite: None. Can execute immediately under current authorization.
Closes: G4.

**Stream A.13 — CONTROL Bootstrap Authority Closure**
Scope: Close G2 and G6 jointly. Implement a bootstrap call pattern in which `CONTROL(INTENTS.INIT)` is invoked at component mount and its full snapshot is applied via `applyControlResponse` (or an equivalent single-call initialization path), replacing all independent `useState` defaults. All React state fields must derive from CONTROL.INIT output at mount. Touch scope: `index.js`, potentially `Control.js` if INIT intent requires a null-snapshot override path.
Prerequisite: A.12 must be complete (G4 closed) to prevent consistency drift at mount if viewport scroll fires before first CONTROL response. Alternatively, A.13 may execute before A.12 if scroll-before-mount is confirmed impossible.
Closes: G2, G6.

**Stream A.14 — Legacy Path Archival and Annotation**
Scope: Close G5. Annotate CONTROL.DEMO_NEXT Path B and Path C with explicit dormant-governed legacy markers. Record activation preconditions inline. Reference A.11 and A.10R as governing authority. Touch scope: `Control.js` only.
Prerequisite: None. Can execute independently of A.12 and A.13.
Closes: G5. Formally governs G1's dormant status pending Path C activation decision.

**Stream A.15 — Snapshot Surface Specification**
Scope: Address G3. Produce a snapshot field specification declaring `mode`, `terminalState`, `currentStepIndex`, and `sequenceId` as non-authoritative derived fields. Decide disposition for `allowedTransitions` and `personaEnvelope`: wire to render consumers or remove from `_rebuildDerivedFields`. If removed, touch `Control.js`; if wired, touch `Control.js` and `index.js`.
Prerequisite: A.13 complete (bootstrap authority closed) so snapshot surface is stable before specification is written.
Closes: G3.

**Stream A.16 — Path C CONTROL Wiring (conditional)**
Scope: Close G1. Extend CONTROL.DEMO_NEXT Path C to produce a `selectedQuery` mutation in its snapshot. Define the canonical query selection rule for stage 1 (currently `'GQ-003'` — must be governed as a canonical rule, not a hardcoded value). Touch scope: `Control.js`.
Prerequisite: Path C must be formally declared and activation decision made. G5 must be closed (A.14 complete). A validation stream equivalent to A.5B for Path C scenarios must accompany this stream.
Closes: G1. Prerequisite for Path C activation authorization.

---

## Current Authorization Restatement

**Allowed:**
51.9 may continue for the following declared covered paths under the current CONTROL surface: ENTRY, GUIDED/Path A (EXECUTIVE, CTO, ANALYST personas), POST_COMPLETION, FREE/OPERATOR, and MID-DEMO DISRUPTION. These paths are canonically covered, A.5B-validated, and architecturally clean as of A.9 execution.

**Not allowed:**
The following are not authorized under the current CONTROL surface without the prerequisite streams identified above: (1) activation of or reliance on Path B (legacy selectedFlow traversal); (2) activation of or reliance on Path C (standard stage mode); (3) any 51.9 hardening, demo surface expansion, or productization work that depends on Path B or Path C being canonically wired or validated; (4) declaration of CONTROL completeness as architecturally closed.

---

## Architecture Closure Condition

CONTROL completeness may be declared **CLOSED** when and only when all of the following conditions are simultaneously satisfied:

**Mandatory closures (gaps must be resolved):**
- G2: CLOSED — full CONTROL.INIT snapshot applied to all React state fields at mount via a single bootstrap authority call (A.13 complete)
- G4: CLOSED — local `PERSONA_GUIDED_FLOWS` constant eliminated from index.js; CONTROL-exported canonical constant consumed (A.12 complete)
- G6: CLOSED — subsumed by G2 closure; CONTROL.INIT is the sole initialization authority for all state fields (A.13 complete)

**Mandatory archival (gaps must be explicitly governed, not necessarily resolved):**
- G5: ARCHIVED — Path B carries explicit dormant-governed legacy annotation with stated activation preconditions in CONTROL.DEMO_NEXT (A.14 complete)
- G1: ARCHIVED or CLOSED — either Path C is annotated as dormant-governed legacy with G1 flagged as its activation blocker (A.14 complete), or G1 is closed via full Path C canonical wiring with accompanying validation (A.16 complete)

**Mandatory documentation (gaps must be declared non-authoritative, not necessarily removed):**
- G3: DOCUMENTED — snapshot field specification produced declaring `mode`, `terminalState`, `currentStepIndex`, `sequenceId` as non-authoritative derived fields; explicit disposition recorded for `allowedTransitions` and `personaEnvelope` (A.15 complete)

**No gap may be left in an undetermined state at architecture closure.** Each of G1–G6 must carry one of: CLOSED, ARCHIVED, or DOCUMENTED as its final status.

**Additional closure precondition:** All declared covered paths (ENTRY, GUIDED/Path A, POST_COMPLETION, FREE/OPERATOR, MID-DEMO DISRUPTION) must retain A.5B-equivalent validation evidence after any gap closure stream executes. Any closure stream that modifies snapshot structure or initialization must be accompanied by a rerun of the A.5B validation suite or equivalent.

---

## Planning Verdict

**Ready for bounded closure streams.**

A.10 and A.10R provide complete, unambiguous gap truth. G1–G6 are fully classified. Mandatory gaps are separated from dormant and informational gaps. Closure vehicles are defined and sequenced without regression exposure. Legacy path dispositions are determined. The architecture closure condition is stated with exact precision. No planning ambiguity remains.

Streams A.12 through A.15 are defined and executable in sequence. A.16 is conditional on a future Path C activation decision and is not on the critical path to architecture closure. A.12 and A.14 have no prerequisites and may begin immediately. A.13 follows A.12. A.15 follows A.13.

---

## Closure Statement

A.11 closure planning truth is now materially persisted and serves as the authoritative input for all subsequent CONTROL completion streams.

---

*Planning executed: 2026-03-28 | Captured: A.11R | Branch: feature/51-9-runtime-convergence | Gate input: A.10 (PASS WITH DECLARED GAPS) | Runtime HEAD at gate: f7a27fd*
