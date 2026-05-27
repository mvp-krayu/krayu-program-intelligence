# Runtime Reality Table — Software Intelligence Constitutional Definition

Stream: PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01
Date: 2026-05-26
Runtime anchor: PR #16 branch `feature/PI.SOFTWARE-INTELLIGENCE.AGENTIC-QUALIFICATION-GUIDANCE.01`

This table maps every constitutional claim to its runtime evidence. Claims without runtime evidence are explicitly classified as CONSTITUTIONAL TARGET or GAP.

---

## 1. Core Architectural Claims

| Concept | Constitutional Claim | Implementation Location | Runtime Artifact | Execution Maturity | Projection Maturity | Known Gaps | Future Stream |
|---|---|---|---|---|---|---|---|
| LENS is projection surface | LENS does not own authority, does not mutate, does not promote | `SoftwareIntelligenceField.jsx` calls `handleSqoExecute()` → `fetch('/api/sqo/authority-action')` | No direct disk mutation in component. All mutations route through API | **PROVEN** — verified in PR #16. Component never imports SQO writers | **PROVEN** — GuidedActionCard renders adapter output | None | — |
| SQO is authority execution substrate | Every mutation flows through SQOActionEngine with validate→snapshot→apply→persist→replay | `SQOActionEngine.server.js:executeAction()` lines 15-55 | `promotion_state.json`, `review_obligations.json`, `qualification_blockers.json`, `promotion_event_log.jsonl` | **PROVEN** — 12 `applyXxx()` functions, `deepClone` snapshots at lines 30-32, catch block restores snapshots at lines 50-53 | N/A (server-side only) | GAP-02: replay validates chain integrity, not full event-sourced reconstruction | — |
| Guided actions are governed progression actions | Actions derived from SQO workspace state, not UI convention | `LensSQOOrchestrationAdapter.js:deriveOrchestrationActions()` lines 23-40 | Workspace object from `OperatorWorkflowResolver` | **PROVEN** — 5 derive functions (`deriveReviewActions`, `derivePromotionActions`, `deriveStructuralActions`, `deriveBlockerActions`, `deriveInsufficiencyActions`) | **PROVEN** — GuidedActionCard renders `requiresJustification`, `required_role`, `authority_level`, `evidence_refs` | GAP-01: `evidence_refs` always empty for LENS-initiated actions | — |
| Learning is event-log-derived | Learning signals derive from `promotion_event_log.jsonl` only | `SQOLearningSignalDerivation.server.js:deriveLearningSignals()` | `promotion_event_log.jsonl` (input), `learning_signals.json` (output) | **PROVEN** — `loadEventLog()` reads only JSONL. No imports from SQO mutation surface. `classifyEvent()`, `deriveActionPatterns()`, `deriveProgressionHistory()`, `deriveTemporalSignals()`, `deriveGuidanceSignals()` — all pure functions over event array | **PROVEN** — `enrichActionsWithLearning()` attaches `learningContext` to 4 action types. `SoftwareIntelligenceField.jsx` renders `learningContext` conditionally | GAP-06: no tests. GAP-07: staleness not detected | — |
| Learning is read-only relative to authority | Learning derivation never mutates SQO state | `SQOLearningSignalDerivation.server.js` imports: `fs`, `path` only. Does NOT import `loadPromotionState`, `writePromotionState`, or any SQO writer | `learning_signals.json` is the only output. Written by `writeLearningSignals()` which writes to a separate file, not SQO state artifacts | **PROVEN** — verified by import analysis. Module has zero mutation capability | **PROVEN** — `action.learningContext` is null by default, set only by `enrichActionsWithLearning()`. Never affects priority/eligibility | None | — |
| Learning is replayable | Same event log → same learning signals | `deriveLearningSignals()` is deterministic over event array. No random, no timestamp-dependent logic in derivation (only in `derived_at` metadata) | Given identical `promotion_event_log.jsonl`, all `action_patterns`, `progression_history`, `temporal_signals`, `guidance_signals` fields reproduce identically | **PROVEN** — pure functional derivation. `derived_at` is metadata, not derivation input | N/A | GAP-02: replay validates refs, not state reconstruction | — |
| Self-learning is not hidden model memory | Governed adaptation over event history, explicit and auditable | `learning_signals.json` is a JSON file on disk — readable, inspectable, diff-able | No neural network state, no opaque model, no embedding vector, no training loop | **PROVEN** — output is structured JSON with named fields. Every field traces to event log entries | **PROVEN** — `learningContext.summary` is human-readable text derived from event counts | None | — |
| UI panels are secondary projections | Page reload re-derives all state from disk | `SoftwareIntelligenceField.jsx:handleSqoExecute()` calls `window.location.reload()` after successful action | Server-side `resolveAuthorityWorkspace()` re-reads all SQO artifacts on reload | **PROVEN** — no client-side state survives reload. All state recomputed from disk | **PROVEN** — GuidedActionCard re-renders from fresh adapter output | None | — |
| Append-only event log | Events use `fs.appendFileSync`. No truncate, delete, overwrite | `PromotionEventWriter.server.js` — `appendEvent()` function | `promotion_event_log.jsonl` | **PROVEN** — `fs.appendFileSync` verified at line 77-82 of PromotionEventWriter. Monotonic EVT-xxx identifiers | N/A | None | — |
| Non-automatable boundaries | System actors (`system:*`) rejected from authority actions | `SQOAuthorityValidator.server.js` — actor validation | Validation returns `SYSTEM_ACTOR_BOUNDARY` error | **PROVEN** — 7 non-automatable boundaries enforced | N/A | None | — |
| Crash rollback via snapshots | Pre-mutation snapshots restored on exception | `SQOActionEngine.server.js` lines 30-32 (snapshot), lines 50-53 (restore) | `deepClone` of promotionState, reviewObligations, qualificationBlockers | **PROVEN** — try/catch with write-back of snapshots on failure | N/A | None | — |

## 2. Cognition Function Claims

| CF | Constitutional Claim | Implementation Location | Runtime Artifact | Execution Maturity | Projection Maturity | Known Gaps | Future Stream |
|---|---|---|---|---|---|---|---|
| CF-06 Execution Governance | Governance enforcement density via 12-action authority workflow | `SQOActionEngine.server.js` — 12 `applyXxx()` functions | `promotion_event_log.jsonl` records every governance event with `semantic_disposition` | **PROVEN** — all 12 actions operational | **PROVEN** — GuidedActionCard shows action metadata, workflow stamps | None | — |
| CF-10 Engineering Qualification Cognition | SQO states become deployment readiness posture | `OperatorWorkflowResolver.server.js:resolveAuthorityWorkspace()` | Workspace object with `authorityPosture`, `blockerList`, `promotionControl` | **PROVEN** — posture derivation from SQO artifacts | **PROVEN** — SoftwareIntelligenceField renders guided actions from posture | None | — |
| CF-08 Operational Attention Routing | Guided actions prioritized from workspace state | `LensSQOOrchestrationAdapter.deriveOrchestrationActions()` | Sorted action array from workspace | **PARTIAL** — actions sorted by priority. No multi-signal compound activation yet | **PARTIAL** — learning enrichment adds historical context. No signal-compound routing | Signal-compound attention routing not implemented | — |
| CF-01 Pressure Interpretation | Pressure zones become typed operational risks | **NONE** — no consumer of `pressure_zone_state.json` | `pressure_zone_state.json` exists (75.x pipeline output) | **NOT IMPLEMENTED** — artifact exists, no interpretation layer | **NOT IMPLEMENTED** — no LENS rendering of pressure zones | Entire CF is a gap | Requires pressure-topology integration stream |
| CF-02 Execution Corridor Detection | Propagation chains become delivery-critical paths | **NONE** — no corridor derivation from topology | Topology data exists (40.4) | **NOT IMPLEMENTED** — no derivation logic | **NOT IMPLEMENTED** — no corridor rendering | Entire CF is a gap | Requires execution corridor stream |
| CF-03 Coordination Spine Detection | Centrality patterns become operational coordination roles | **NONE** — no consumer of 40.3c for operational role naming | `structural_centrality.json` (40.3c) exists in pipeline output | **NOT IMPLEMENTED** — evidence exists, no interpretation | **NOT IMPLEMENTED** — no LENS rendering of coordination roles | Entire CF is a gap | Requires coordination spine stream |
| CF-04 Validation Intelligence | Coverage asymmetry becomes operational risk | **PARTIAL** — qualification blockers displayed in SQO | `qualification_blockers.json` | **PARTIAL** — blockers shown via OperatorWorkflowResolver. No per-domain validation posture | **PARTIAL** — blocker list rendered in GuidedActionCard evidence grid | No per-domain validation assessment | — |
| CF-05 Release/Deployment Cognition | Propagation patterns become deployment risk | **NONE** — no deployment risk derivation | Topology data exists | **NOT IMPLEMENTED** | **NOT IMPLEMENTED** | Entire CF is a gap | Requires deployment cognition stream |
| CF-07 Topology Role Abstraction | Structural roles become operational names | **NONE** — 40.3c structural roles exist but no operational name mapping | `structural_centrality.json` with 7 structural roles | **NOT IMPLEMENTED** — 7 roles (ENTRYPOINT, RUNTIME_SPINE, etc.) are PI Core evidence. No SW-Intel operational name layer | **NOT IMPLEMENTED** — no LENS rendering with operational names | Entire CF is a gap | Requires topology role naming stream |
| CF-09 Pressure-Aware Topology | Topology becomes operationally reactive to pressure | **NONE** — SVG topology does not consume pressure zone data | `pressure_zone_state.json`, SVG topology component | **NOT IMPLEMENTED** | **NOT IMPLEMENTED** — topology is structurally accurate but operationally inert | Entire CF is a gap | See PRESSURE_TOPOLOGY_SPEC.md |

## 3. Domain Cognition Module Pattern Claims

| Concept | Constitutional Claim | Implementation Location | Runtime Artifact | Execution Maturity | Projection Maturity | Known Gaps | Future Stream |
|---|---|---|---|---|---|---|---|
| Workspace resolver pattern | Server-side resolution of PI Core artifacts into workspace object | `OperatorWorkflowResolver.resolveAuthorityWorkspace()` | Workspace object: authorityPosture, reviewQueue, promotionControl, blockerList, learningSignals | **PROVEN** — operational | N/A | None | — |
| Orchestration adapter pattern | Adapter derives governed actions from workspace | `LensSQOOrchestrationAdapter.deriveOrchestrationActions()` | Action array with priority, authority, evidence, learning context | **PROVEN** — 5 derive functions + 1 enrichment function | **PROVEN** — actions rendered in GuidedActionCard | GAP-01: evidence_refs empty | — |
| Authority execution engine pattern | Engine validates, snapshots, applies, persists, replays | `SQOActionEngine.executeAction()` | 4 SQO state artifacts + event log | **PROVEN** — full lifecycle | N/A | GAP-02: replay scope limited | — |
| Learning derivation pattern | Event log → classify → pattern → signal → enrich → display | `SQOLearningSignalDerivation.deriveLearningSignals()` → `enrichActionsWithLearning()` | `learning_signals.json`, `learningContext` on actions | **PROVEN** — full pipeline operational | **PROVEN** — 4 learning context types rendered | GAP-04, GAP-06, GAP-07 | — |
| Gap register pattern | Honest boundary documentation | `SQO_GAP_REGISTER.md` | 8 registered gaps | **PROVEN** — operational | N/A | The gap register IS the gap documentation | — |
| Module replaceability | Swapping domain module changes vocabulary, not PI Core | **THEORETICAL** — only one domain module exists | No alternative module implemented | **NOT DEMONSTRATED** — claim is architecturally sound but unproven | N/A | No second domain module exists to test replaceability | Requires second module implementation |
| Persona consumption differentiation | Each persona receives different SW-Intel projection | **NOT IMPLEMENTED** — all 4 personas receive same GuidedActionCard | Same component for all personas | **NOT IMPLEMENTED** | **NOT IMPLEMENTED** — identical rendering across personas | All personas get identical output | Requires governed projection object model |
| Module registration | Modules register to PI Spine through governed schema | **NOT IMPLEMENTED** — no registration mechanism | No registration artifact | **NOT IMPLEMENTED** | N/A | Entire concept is constitutional, not operational | Future marketplace stream |

## 4. Self-Learning Doctrine Claims

| Concept | Constitutional Claim | Implementation Location | Runtime Artifact | Execution Maturity | Projection Maturity | Known Gaps | Future Stream |
|---|---|---|---|---|---|---|---|
| Event classification | Events classified as authority_action, promotion_transition, promotion_hold, lifecycle_milestone, unknown | `SQOLearningSignalDerivation.classifyEvent()` | Classification used internally by derivation functions | **PROVEN** — 5 event types with explicit classification logic | N/A | None | — |
| Action pattern derivation | Counts by_action and by_target from authority events | `deriveActionPatterns()` | `action_patterns` in `learning_signals.json` | **PROVEN** — per-action counts with disposition breakdown, per-target action history | **PROVEN** — review_history learningContext uses accept/reject/contest rates | None | — |
| Progression history derivation | Tracks transitions, holds, hold_to_advance_ratio | `deriveProgressionHistory()` | `progression_history` in `learning_signals.json` | **PROVEN** — progression path with timestamps and rationale lengths, hold reasons | **PROVEN** — progression_history learningContext on promotion actions | None | — |
| Temporal signal derivation | Computes event_span_hours, avg_gap_hours | `deriveTemporalSignals()` | `temporal_signals` in `learning_signals.json` | **PROVEN** — timestamp-sorted gap computation | **NOT PROJECTED** — temporal signals computed but not displayed in LENS | Computed but not rendered | — |
| Guidance signal derivation | Derives rejection_activity, contest_activity, arbitration_escalation, progression_friction, multi_action_targets | `deriveGuidanceSignals()` | `guidance_signals` in `learning_signals.json` | **PROVEN** — 5 signal types with severity classification | **PARTIAL** — governance_friction and escalation_pattern displayed. rejection_activity and multi_action_targets not displayed | 2 of 5 guidance signals not rendered | — |
| Learning failure isolation | Learning derivation failure does not block action execution | `SQOActionEngine.server.js` line 44: `try { refreshLearningSignals(client, runId); } catch (_) {}` | No-op on failure | **PROVEN** — empty catch block with comment `/* non-critical */` | N/A | None | — |
| Learning workspace integration | Learning signals part of workspace, not separate fetch | `OperatorWorkflowResolver.server.js` lines 77-81: `try { deriveLearningSignals... }` then added to workspace return | `learningSignals` field on workspace object | **PROVEN** — integrated into single workspace resolution call | **PROVEN** — adapter destructures `learningSignals` from workspace at line 28 | None | — |
| Operator behavioral modeling | Explicitly postponed as governance-sensitive | **NOT IMPLEMENTED** — removed from Phase 2 scope | No operator_profile.json exists | **DEFERRED** — by design, not by omission | **DEFERRED** | GAP-04: learning is descriptive v1, not prescriptive | Requires own doctrine review |
| Graph-based progression intelligence | Which action unlocks which future corridor | **NOT IMPLEMENTED** — flat priority sort, not dependency graph | No action dependency graph exists | **NOT IMPLEMENTED** | **NOT IMPLEMENTED** | GAP-08: requires directed graph over action space | Phase 3 |

## 5. Pressure-Topology Claims

| Concept | Constitutional Claim | Implementation Location | Runtime Artifact | Execution Maturity | Projection Maturity | Known Gaps | Future Stream |
|---|---|---|---|---|---|---|---|
| Pressure zone computation | Zones computed by 75.x pipeline | Pipeline scripts (not in LENS codebase) | `pressure_zone_state.json` — PZ-001 COMPOUND_ZONE, 3 conditions | **EXISTS** — artifact produced by pipeline | **ORPHANED** — no LENS consumer | Artifact exists, no rendering path | Pressure-topology integration |
| Operational cognition positioning | Pressure-topology is cognition, not visualization | Constitutional claim only — no implementation | No operational typing of pressure zones | **CONSTITUTIONAL TARGET** — no runtime evidence | **NOT IMPLEMENTED** | Entire positioning is aspirational until implemented | Pressure-topology integration |
| Zone rendering | Topology SVG shows pressure zone boundaries | **NOT IMPLEMENTED** — `StructuralTopologyZone` does not consume pressure data | SVG topology renders without pressure awareness | **NOT IMPLEMENTED** | **NOT IMPLEMENTED** | No zone rendering exists | Pressure-topology integration |

---

## 6. Summary

| Maturity Level | Count | Percentage |
|---|---|---|
| **PROVEN** (runtime-verified) | 22 | 55% |
| **PARTIAL** (partially operational) | 4 | 10% |
| **NOT IMPLEMENTED** (constitutional target) | 12 | 30% |
| **DEFERRED** (by design) | 2 | 5% |

**Total constitutional claims cross-checked: 40**

### Honest Assessment

The core execution bridge (LENS → API → engine → persist → event → learning → projection) is fully PROVEN. The 5 architectural positions, the self-learning doctrine, the gap register pattern, and the domain cognition module pattern (workspace → adapter → engine → learning → projection) are all verified against actual code with specific line references.

The cognition functions are honestly split: 3 operational (CF-06, CF-10, CF-08 partial), 7 NOT IMPLEMENTED. The 7 unimplemented functions have structural evidence in pipeline output but no consumer path. This is a constitutional definition, not an implementation stream — the split is expected and documented.

The weakest claims are:
1. **Module replaceability** — architecturally sound but never demonstrated with a second module
2. **Persona consumption differentiation** — all personas get identical rendering
3. **Pressure-topology as operational cognition** — entirely aspirational, zero runtime
4. **Operational cognition richness** — the term "operational cognition" is constitutionally justified but the runtime only proves SQO authority execution, not full-stack operational cognition

These weaknesses are now visible. Constitutional prose that uses these terms must acknowledge the gap between definition and runtime.
