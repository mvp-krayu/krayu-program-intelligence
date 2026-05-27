# Constitutional Definition — Software Intelligence Module

Stream: PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01
Classification: G1 — Architecture-Mutating
Date: 2026-05-26
Runtime anchor: PR #16 — PI.SOFTWARE-INTELLIGENCE.AGENTIC-QUALIFICATION-GUIDANCE.01

---

## 1. What Software Intelligence IS — Proven by Runtime

Software Intelligence is a **domain cognition module** attached to the PI Spine. PR #16 proved what this means operationally: not a future specification, but a functioning governed system where LENS projects SQO authority state to operators, SQO executes governed mutations, and learning signals derive from operational history.

The proven architecture:

```
LENS (projection surface)
  └── SoftwareIntelligenceField.jsx → GuidedActionCard
        │ derives from
        ▼
LensSQOOrchestrationAdapter.js → deriveOrchestrationActions()
        │ consumes
        ▼
OperatorWorkflowResolver.server.js → resolveAuthorityWorkspace()
        │ loads from
        ▼
SQOActionEngine.server.js → validate → snapshot → apply → persist → replay → return
        │ writes to
        ▼
promotion_event_log.jsonl (append-only, immutable audit lineage)
        │ read by
        ▼
SQOLearningSignalDerivation.server.js → deriveLearningSignals()
        │ enriches
        ▼
LensSQOOrchestrationAdapter.js → enrichActionsWithLearning()
        │ displays as
        ▼
SoftwareIntelligenceField.jsx → learningContext (read-only, advisory)
```

This is the first operational domain cognition module. It transforms PI Core structural intelligence into software-domain operational cognition.

---

## 2. What Software Intelligence is NOT

- **NOT code metrics.** Lines of code, cyclomatic complexity, coverage percentages are tool outputs. Software Intelligence is operational cognition derived from structural evidence.
- **NOT GitHub analytics.** Commit frequency, PR velocity, contributor graphs are activity metrics. Software Intelligence operates on structural topology, not activity.
- **NOT repository visualization.** Folder trees, dependency graphs, file browsers are display tools. Software Intelligence interprets structural relationships through operational semantics.
- **NOT taxonomy mapping.** Renaming folders to prettier labels is cosmetic. Software Intelligence derives operational meaning — role abstractions trace to structural entities with bidirectional mappings.
- **NOT AI commentary.** Every output traces to structural evidence through deterministic derivation or governed event history. No "AI thinks" or "AI suggests."
- **NOT a separate product.** Software Intelligence is a module WITHIN Program Intelligence that permeates all strata.

---

## 3. The Five Architectural Positions — Proven

PR #16 established five constitutional positions through working code, not theory:

### Position 1: LENS is the Projection Surface

LENS does NOT own authority. LENS does NOT mutate qualification. LENS does NOT promote. LENS projects SQO state to operators through governed action cards. The bridge status document (`SQO_EXECUTION_BRIDGE_STATUS.md`) records these boundaries as verified, not aspirational.

**Runtime proof:** `SoftwareIntelligenceField.jsx` renders `GuidedActionCard` components derived from `LensSQOOrchestrationAdapter.deriveOrchestrationActions()`. The component calls `handleSqoExecute()` which posts to `/api/sqo/authority-action` — LENS never touches SQO artifacts directly.

### Position 2: SQO is the Authority Execution Substrate

SQO owns mutation. Every operator action flows through `SQOActionEngine.server.js` which enforces: role-action authorization → pre-mutation snapshot → apply function → persist to disk → event emission → replay validation → rollback on failure.

**Runtime proof:** `SQOActionEngine.executeAuthorityAction()` — 12 action types, each with `applyXxx()` function. `SQOAuthorityValidator.server.js` rejects unauthorized actors. `PromotionEventWriter.server.js` writes append-only events with `fs.appendFileSync`.

### Position 3: Guided Actions are Governed Operational Progression Actions

Not UI links. Not navigation shortcuts. Not buttons that "do things." Guided actions are governed progression steps derived from the SQO execution graph. The adapter computes which actions are available based on current workspace state, role authorization, and obligation status.

**Runtime proof:** `LensSQOOrchestrationAdapter.deriveOrchestrationActions()` computes actions from `authorityPosture`, `reviewQueue`, `promotionControl`, and `blockerList`. Each action carries `requiresJustification`, `required_role`, `authority_level`, and `evidence_refs` fields.

### Position 4: Learning is Event-Log-Derived, Explicit, Replayable, Auditable, Read-Only

Learning signals derive from `promotion_event_log.jsonl` — the same append-only event log that records authority actions. Learning NEVER mutates SQO state. Learning NEVER affects action priority, eligibility, or authority. Learning is advisory context displayed to the operator.

**Runtime proof:** `SQOLearningSignalDerivation.server.js` reads only from `promotion_event_log.jsonl`. It imports nothing from the SQO mutation surface. Its output (`learning_signals.json`) contains action patterns, progression history, temporal signals, and guidance signals — all derived from event classification, not hidden model memory.

### Position 5: UI Panels are Secondary Projections of Runtime State

The React component (`SoftwareIntelligenceField.jsx`) is a projection of runtime computation. It displays what the adapter computed. When the user clicks an action, the page reloads after the server-side mutation completes — the new state is recomputed from disk, not from component state.

**Runtime proof:** After `handleSqoExecute()` succeeds, the component calls `window.location.reload()`. The server-side `resolveAuthorityWorkspace()` re-reads all SQO artifacts from disk. The adapter re-derives actions from the fresh workspace. No client-side state survives.

---

## 4. PI Core / Domain Module Separation

The separation between PI Core and domain cognition modules is constitutional. PI Core provides domain-agnostic cognition primitives. Domain modules interpret those primitives through domain-specific operational semantics.

### PI Core Provides (Domain-Agnostic — ~90%+)

| Capability | Runtime Location |
|---|---|
| Structural topology reconstruction | 40.2 → 40.3 → 40.4 evidence chain |
| Structural relevance classification | SRC — PRIMARY/SUPPORT/PERIPHERAL |
| Code-graph structural enrichment | 40.3s — resolved imports, definitions |
| Structural centrality derivation | 40.3c — metrics, structural role classification |
| Signal derivation spine | PSIG, DPSIG, BSIG, ISIG, CSIG, ESIG |
| Pressure concentration detection | Zone derivation, compound activation |
| Qualification state machine | SQO — S0/S1/S2/S3 transitions |
| Authority execution substrate | SQOActionEngine — 12 governed actions |
| Governance lifecycle | Authority workflow, event lineage |
| Replay and certification | Deterministic revalidation, chronicle |
| Persona projection system | 4-persona cognitive projection |
| Guided investigation | 36-query lattice, structural depth |
| Authority corridor model | 9-corridor posture assessment |

### Software Intelligence Provides (Software-Domain-Specific — ~9%)

| Capability | Runtime Location |
|---|---|
| Operational execution interpretation | `LensSQOOrchestrationAdapter.deriveOrchestrationActions()` |
| Guided action orchestration | `SoftwareIntelligenceField.jsx` → `GuidedActionCard` |
| Event-log-derived learning | `SQOLearningSignalDerivation.deriveLearningSignals()` |
| Learning context enrichment | `LensSQOOrchestrationAdapter.enrichActionsWithLearning()` |
| Authority workspace resolution | `OperatorWorkflowResolver.resolveAuthorityWorkspace()` |
| Software pressure meaning | Pressure zone operational typing (GAP — see §8) |
| Topology role cognition | Structural roles → operational names (GAP — see §8) |

---

## 5. Cognition Functions — What Exists vs What is Constitutional

The 10 cognition functions classify how PI Core primitives become software-domain intelligence. PR #16 proves some operationally. Others are constitutionally defined with implementation pending.

### OPERATIONAL (proven by PR #16)

| ID | Function | Runtime Evidence |
|---|---|---|
| CF-06 | Execution Governance | `SQOActionEngine` — governance enforcement density via 12-action authority workflow. `PromotionEventWriter` records governance decision lineage |
| CF-10 | Engineering Qualification Cognition | `OperatorWorkflowResolver` — SQO states become operational posture, guided actions, progression path. `QualificationPostureResolver` derives deployment readiness |
| CF-08 (partial) | Operational Attention Routing | `LensSQOOrchestrationAdapter.deriveOrchestrationActions()` derives prioritized guided actions from workspace state. `enrichActionsWithLearning()` adds historical attention context |

### CONSTITUTIONALLY DEFINED (implementation pending)

| ID | Function | Input | Status |
|---|---|---|---|
| CF-01 | Pressure Interpretation | `pressure_zone_state.json` | Artifact exists, no consumer. See PRESSURE_TOPOLOGY_SPEC.md |
| CF-02 | Execution Corridor Detection | Propagation chains from topology | Not yet derived |
| CF-03 | Coordination Spine Detection | 40.3c structural centrality | Evidence exists in pipeline output |
| CF-04 | Validation Intelligence | Coverage asymmetry, qualification blockers | Partially operational via blocker display |
| CF-05 | Release/Deployment Cognition | Propagation patterns, blast radius | Not yet derived |
| CF-07 | Topology Role Abstraction | 40.3c structural roles | Evidence exists, no projection to LENS |
| CF-09 | Pressure-Aware Topology Projection | Topology + pressure zones | Not yet rendered. See PRESSURE_TOPOLOGY_SPEC.md |

This separation is honest. The runtime proves CF-06, CF-10, and partial CF-08. The remaining functions have structural evidence in the pipeline but no consumer path to LENS.

---

## 6. Attachment Model

Software Intelligence attaches to PI Core through a governed read-interpret-project cycle. It reads PI Core state, interprets through software-operational semantics, and projects to LENS personas.

### Proven Attachment (PR #16)

```
PI CORE (SQO artifacts on disk)
│
├── promotion_state.json ─────────┐
├── review_obligations.json ──────┤ read by
├── qualification_blockers.json ──┤ OperatorWorkflowResolver
├── promotion_event_log.jsonl ────┘
│
▼
SOFTWARE INTELLIGENCE MODULE
│
├── resolveAuthorityWorkspace() ── combines all state into workspace
├── deriveLearningSignals() ────── event-log analysis (read-only)
├── deriveOrchestrationActions() ─ guided action computation
├── enrichActionsWithLearning() ── learning context attachment
│
▼
LENS PERSONA SURFACES
│
└── SoftwareIntelligenceField.jsx → GuidedActionCard → operator action
```

### Invariants (Verified)

1. SW-Intel reads SQO artifacts — it never writes to them directly
2. SW-Intel projects operational actions consumed by LENS
3. SW-Intel does NOT modify PI Core computation — it interprets results
4. Learning derivation is read-only relative to authority state
5. Every guided action traces to SQO workspace state
6. Page reload re-derives all state from disk (no stale projection)

---

## 7. Self-Learning Doctrine

PR #16 established what self-learning means constitutionally:

**Self-learning IS:** Governed adaptation over replayable operational history. The `SQOLearningSignalDerivation` module reads the event log, classifies events, computes patterns (action frequencies, progression history, temporal signals), and derives guidance signals (rejection_activity, contest_activity, arbitration_escalation, progression_friction). All computation is deterministic over the event log.

**Self-learning is NOT:** Hidden model memory. Neural network state. Opaque AI inference. The learning signals are explicit, auditable, and replayable — given the same event log, the same signals derive.

### Learning Signal Architecture (Operational)

```
promotion_event_log.jsonl
        │ classifyEvent()
        ▼
authority_action | promotion_transition | promotion_hold | lifecycle_milestone | unknown
        │ deriveActionPatterns() + deriveProgressionHistory() + deriveTemporalSignals()
        ▼
action_patterns: { by_action: {...}, by_target: {...} }
progression_history: { transitions: [...], holds: [...], hold_to_advance_ratio }
temporal_signals: { event_span_hours, avg_gap_hours }
        │ deriveGuidanceSignals()
        ▼
guidance_signals: [ rejection_activity | contest_activity | arbitration_escalation | progression_friction | multi_action_targets ]
```

### Learning Boundaries

1. Learning signals NEVER affect action priority or eligibility
2. Learning signals NEVER modify SQO state
3. Learning signals are advisory context displayed to the operator
4. Operator behavioral modeling is explicitly postponed (governance-sensitive) — GAP-04
5. Graph-based progression intelligence (which action unlocks which corridor) is Phase 3 — GAP-08
6. Failure in learning derivation is non-critical: `try { refreshLearningSignals(client, runId); } catch (_) {}`

---

## 8. Current Implementation Boundary — Gap Register

The gap register (`SQO_GAP_REGISTER.md`) documents the honest boundary between what is proven and what is constitutional:

| Gap | Description | Classification |
|---|---|---|
| GAP-01 | `evidence_refs` empty for LENS-initiated actions | Non-blocking — event structure supports refs, LENS path doesn't populate them |
| GAP-02 | Replay validates chain integrity, not event-sourced reconstruction | Non-blocking — detects broken refs, not state drift |
| GAP-03 | Confirmation UX is direct-click, not formal ceremony | Non-blocking — low-friction execution, no preview of before/after |
| GAP-04 | Learning is v1 descriptive, not prescriptive | Expected — operator modeling postponed, governance-sensitive |
| GAP-05 | Before/after state not displayed to operator | Non-blocking — result message shown, not governance record |
| GAP-06 | No tests for learning signal derivation | Non-blocking — derivation logic untested |
| GAP-07 | Stale learning signals not explicitly detected | Non-blocking — `derived_from_events` field exists, no consumer checks |
| GAP-08 | Graph-based progression intelligence | Future phase — action dependency graph, corridor projections |

These gaps define the scope of the proven runtime. Constitutional claims in this document do not extend beyond what is verified or honestly classified as pending.

---

## 9. Doctrine Compliance

PR #16 proved compliance with the SQO doctrine priority order:

| Priority | Requirement | Status |
|---|---|---|
| 1 | SQO state machine fidelity | PROVEN — `ensureLanes()` guard, 12 apply functions, null-safe |
| 2 | Doctrine compliance | PROVEN — append-only events, no destructive revert, compensating corrections |
| 3 | Playback/replay | PROVEN — `replayValidate()` runs after every action |
| 4 | Revert/undo | PROVEN — crash rollback via deepClone snapshots, corrections via compensating events |
| 5 | Traceability | PROVEN — `prior_state` / `resulting_state` on every event, monotonic EVT-xxx IDs |
| 6 | Authority validation | PROVEN — `SQOAuthorityValidator` enforces role-action mapping, non-automatable boundaries |
| 7 | Posture recomputation | PROVEN — page reload triggers full server-side re-resolution from disk |
| 8 | Adaptive/self-learning | PROVEN (v1) — event-log-derived, read-only, advisory context |

---

## 10. Relationship to Existing Architecture

### 10.1 Corridor Model (§3.9)

The SOFTWARE_INTELLIGENCE corridor was specified in the Authority Corridor Model. `evaluateSoftwareIntelligenceCorridor()` currently returns ABSENT unconditionally. This is correct — the full artifact-based corridor activation (§7 in prior version) requires the pipeline to produce `software_intelligence_module.json`, which is not yet implemented. But the operational essence of Software Intelligence — governed domain cognition that gives PI Core operational meaning — is proven through the SQO execution bridge.

### 10.2 BOARDROOM Advisory (Phase 2 Forensics)

`BOARDROOM_SOFTWARE_INTELLIGENCE_ADVISORY.md` identified 7 executive consequence channels and 5 harmful absences. The persona consumption specification formalizes these within the constraint of what the runtime actually delivers.

### 10.3 PI Runtime State Model (§9.3.4)

PI_RUNTIME_STATE_MODEL.md established that "the domain module permeates all strata; it is not an attachment point that adaptive orchestration can bypass." The SQO execution bridge proves this: Software Intelligence is not a rendering overlay — it is operational cognition that flows from SQO authority artifacts through workspace resolution, action derivation, learning enrichment, and LENS projection.

### 10.4 Signal Derivation Levels

Level 1 signals (ISIG, CSIG) are inherently SOFTWARE EXECUTION intelligence. Level 2 signals (PSIG, BSIG) are ARCHITECTURAL GOVERNANCE intelligence. This distinction aligns with the domain module concept — Level 1 intelligence IS the domain module's operational vocabulary.

### 10.5 SQO Execution Bridge

PR #16 (`feature/PI.SOFTWARE-INTELLIGENCE.AGENTIC-QUALIFICATION-GUIDANCE.01`) established the verified operational bridge. This constitutional definition formalizes what that bridge proves architecturally — not what might exist in the future, but what has been demonstrated in working code.
