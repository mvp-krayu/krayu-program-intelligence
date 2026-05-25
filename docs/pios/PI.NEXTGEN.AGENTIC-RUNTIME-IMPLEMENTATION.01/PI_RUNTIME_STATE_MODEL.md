# PI RUNTIME STATE MODEL

**Stream:** PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01
**Classification:** CONSTITUTIONAL / IMPLEMENTATION SPECIFICATION
**Authority:** Runtime legality and synchronization constitution
**Date:** 2026-05-25

---

## 1. PURPOSE

This document is the **runtime constitution** for Program Intelligence. It defines what is legal at runtime — what states exist, what transitions between them are permitted, what mutations each state allows, what must remain deterministic, what requires operator authority, what must persist, and what must replay identically.

This constitution governs:

- **Runtime legality** — which operations are permitted in which states
- **Orchestration synchronization** — how orchestration agents coordinate without conflict
- **Continuity mutation boundaries** — what may change, under what authority, with what lineage
- **Replay guarantees** — what must reproduce identically across executions
- **Persistence semantics** — what survives session boundaries and in what form
- **Orchestration coordination legality** — which agents may act concurrently and which must serialize

This is NOT a generic AI agent runtime architecture. This IS the constitutional specification for a governed operational cognition system that already exists philosophically and partially operationally. The mission is to formalize, stabilize, synchronize, materialize, and safely evolve it.

**Binding references:**
- Forensic basis: `PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01/PERSONA_COGNITION_TOPOLOGY_MAP.md`
- Enrichment map: `PI.GENESIS.LENS-COGNITION-ENRICHMENT.01/GENESIS_TO_LENS_COGNITION_ENRICHMENT_MAP.md`
- Orchestration topology: `PI.GENESIS.LENS-COGNITION-ENRICHMENT.01/AGENTIC_ORCHESTRATION_TOPOLOGY.md`
- SQO execution graph: `docs/pios/sqo_execution_graph.json`

---

## 2. RUNTIME STRATA MODEL

The PI runtime operates through 5 constitutionally separated strata. Each stratum has distinct legality rules, mutation authority, and persistence obligations. Cross-stratum operations require explicit synchronization contracts.

### Stratum A: DETERMINISTIC COGNITION

**Responsibility:** Immutable cognition primitives. Structural derivation. Evidence-bound computation. Constitutional execution logic.

**Contains:**
- Structural topology computation (40.4 canonical topology)
- Code graph construction (40.3s)
- Centrality computation (40.3c)
- Signal derivation (DPSIG, PSIG, ISIG)
- Actor hydration (15-actor registry with score/band/posture/qualifier)
- Confidence computation
- Revalidation engine (deterministic multi-phase validation)
- Constitutional anchor computation (8-dimensional assessment)

**Legality rules:**
- All computations MUST be deterministic: same input → same output, no exceptions
- No interpretation permitted at this stratum
- No operator override of computation results (operator may act on results, not alter them)
- All outputs are structural artifacts — not narratives, not projections
- Replay tier: EXACT — any replay of identical inputs must produce bit-identical outputs

**Mutation authority:** NONE. This stratum produces, it does not mutate. Outputs are immutable once emitted.

### Stratum B: ORCHESTRATION

**Responsibility:** Runtime coordination. Agent routing. Synchronization. Escalation choreography. Traversal coordination. Session state management.

**Contains:**
- Payload resolution orchestration (manifest → artifact loading → semantic projection assembly)
- Persona dispatch routing (density class → persona renderer)
- Emergence engine coordination (8-function threshold evaluation → authority escalation)
- Zone tracking coordination (scroll detection → zone state → query availability)
- Escalation state management (STRUCTURAL → INTERPRETIVE → PI_INTERPRETIVE)
- Interrogation trail accumulation
- Cross-persona zone targeting

**Legality rules:**
- Orchestration MAY NOT originate content — it routes, coordinates, and gates
- Orchestration state is SESSION-SCOPED — does not persist across sessions unless explicitly materialized
- Escalation is monotonic within a session: authority may escalate, never silently de-escalate (mode transition is a reset, not a de-escalation)
- Persona dispatch is EXCLUSIVE — exactly one persona renderer active at any time
- Zone state resets are MANDATORY on persona transition to prevent stale context leakage

**Mutation authority:** Session state only. No spine writes. No artifact mutation. No SQO state changes.

### Stratum C: CONTINUITY

**Responsibility:** Governed substrate evolution. Spine mutation. Hero Moment lifecycle. Convergence accumulation. Enrichment continuity. Replay continuity.

**Contains:**
- Spine object insertion (semantic_propositions, hero_moments, evidence_objects, replay_corridors)
- Chronicle event emission (append-only event log)
- Checkpoint freezing (immutable state snapshots at governance boundaries)
- Enrichment artifact production (enrichment_log, enrichment_activity_event, debt_reassessment)
- Convergence observation authoring
- Learning event lifecycle (OBSERVED → PROPOSED → REVIEWED → PROMOTED → CONSUMABLE)

**Legality rules:**
- All continuity writes MUST carry lineage (who, when, why, under what authority)
- Append-only structures (event logs, chronicle events) MUST NEVER be modified retroactively
- Checkpoints are FROZEN at creation — no post-hoc mutation
- Hero Moments are filtered at consumption (`!manufactured`), never at storage — the substrate preserves everything, the projection selects
- Enrichment mutations to existing artifacts (e.g., proposition confidence adjustment) MUST be logged as enrichment events with before/after state

**Mutation authority:** Pipeline-automated (hero moments, chronicle events) + Operator-governed (learning lifecycle, convergence observations) + Stream-governed (enrichment artifacts). Authority varies by object class — see §7.

### Stratum D: QUALIFICATION

**Responsibility:** SQO lifecycle continuity. S-state transitions. Gate enforcement. Constitutional distance assessment. Promotion authority.

**Contains:**
- Gate materializers (CEU reconciliation → proposition derivation → proposition review → revalidation → promotion)
- S-state transitions (S0 → S1 → S2)
- Constitutional replay anchor computation
- Qualification blocker tracking
- Promotion lineage accumulation
- Review obligation tracking

**Legality rules:**
- S-state transitions are IRREVERSIBLE — no demotion, no rollback
- Every transition requires: revalidation PASS + constitutional anchor not blocking + operator authority
- S2 requires: L5 authority_level + enrichment_exercised = true
- Proposition dispositions are TERMINAL — once ACCEPTED/REJECTED/ARBITRATED, no further mutation
- Gate sequence is STRICTLY ORDERED — no gate may execute before its predecessor completes
- All operator actions require identity + rationale, permanently recorded

**Mutation authority:** Operator-exclusive for disposition, promotion, reconciliation actions. Deterministic-only for revalidation and anchor computation.

### Stratum E: PROJECTION

**Responsibility:** Persona-specific cognition rendering. Compiled executive projection. Emergence narrative synthesis. Interrogation evidence rendering. Zone-navigated decomposition.

**Contains:**
- Boardroom projection compilation (9-step deterministic compilation from payload)
- Balanced emergence rendering (8-function threshold-gated narrative activation)
- Dense topology rendering (7-zone scroll-navigated structural decomposition)
- Investigation trace rendering (sequential evidence verification with backing classification)
- Governing narrative composition (spine-grounded, deterministic-bounded paragraph generation)
- Signal interpretation rendering
- Governance legitimacy rendering

**Legality rules:**
- All interpretive projections operate under 75.x bounded authority with 13 prohibitions enforced
- Projections MUST NOT originate evidence — they project existing structural/governance state
- Boardroom compilation is DETERMINISTIC — same payload always produces same projection
- Emergence activation is THRESHOLD-GATED — functions produce or suppress based on structural conditions, not on accumulated session state
- No projection may claim authority above L3 for AI-derived content
- Projections are EPHEMERAL — computed fresh from payload on each render, not cached across sessions

**Mutation authority:** NONE. Projections are computed outputs. They do not write to spine, SQO state, or continuity substrate.

### Cross-Stratum Legality

| Source → Target | Legal? | Contract |
|----------------|--------|----------|
| A → B | YES | Stratum A produces payload; Stratum B routes it |
| A → C | YES | Stratum A pipeline phases emit chronicle events, hero moments |
| A → D | YES | Stratum A revalidation/anchor feed Stratum D gate decisions |
| A → E | YES | Stratum A payload is the input for all projections |
| B → A | NO | Orchestration may not alter deterministic computation |
| B → C | NO | Orchestration may not write to continuity substrate |
| B → D | NO | Orchestration may not alter SQO state |
| B → E | YES | Orchestration routes to projection renderers |
| C → A | NO | Continuity substrate may not alter deterministic logic |
| C → D | YES | Enrichment continuity feeds qualification gates (enrichment_exercised) |
| C → E | YES | Spine objects consumed by projection (governed narrative) |
| D → A | NO | SQO state does not alter structural computation |
| D → C | YES | Promotion decisions write to continuity (promotion_lineage) |
| D → E | YES | SQO state consumed by governance lifecycle projection |
| E → * | NO | Projections are terminal. They produce display, not state. |

---

## 3. RUNTIME STATE MODEL

The PI runtime passes through defined states. Each state has explicit entry conditions, allowed mutations, prohibited mutations, and persistence obligations.

### State: INGESTION

**Entry:** Operator initiates pipeline run on a specimen source.
**Orchestration agents active:** Pipeline Execution Orchestrator.
**Stratum:** Deterministic Cognition.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Source file enumeration. Repository boundary validation. Raw intake artifact creation. |
| **Prohibited mutations** | No semantic claims. No signal activation. No SQO state changes. No spine writes. |
| **Continuity writes** | Chronicle: `phase_started(INGESTION)`, `phase_completed(INGESTION)`. |
| **Replay guarantee** | EXACT — identical source produces identical intake artifacts. |
| **SQO impact** | None. |
| **Traversal legality** | Not applicable — pipeline state, not LENS state. |
| **Persistence** | Raw intake artifacts persisted to disk. Chronicle event appended. |

### State: STRUCTURALIZATION

**Entry:** Ingestion complete. Raw files enumerated.
**Orchestration agents active:** Pipeline Execution Orchestrator.
**Stratum:** Deterministic Cognition.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Canonical topology construction (40.4). Relevance filtering (3.5). Code graph construction (40.3s). Centrality computation (40.3c). Semantic derivation (SDC/topology model). |
| **Prohibited mutations** | No proposition derivation yet (requires reconciliation). No SQO state. No interpretive output. |
| **Continuity writes** | Chronicle: phase events per sub-phase (3, 3.5, 3.6, 3.7, 3b). Checkpoint freeze at structural completion. Hero moments if structural discovery occurs. |
| **Replay guarantee** | EXACT — deterministic computation throughout. |
| **SQO impact** | None direct. Produces artifacts that will feed SQO gates. |
| **Traversal legality** | Not applicable — pipeline state. |
| **Persistence** | All structural artifacts persisted: topology, code graph, centrality, semantic model. |

### State: SIGNAL_ACTIVATION

**Entry:** Structuralization complete. Topology, signals, and binding envelope produced.
**Orchestration agents active:** Pipeline Execution Orchestrator.
**Stratum:** Deterministic Cognition.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | DPSIG/PSIG/ISIG signal computation. Binding envelope. CSR topology. Decision validation. |
| **Prohibited mutations** | No semantic propositions. No qualification actions. No interpretive output. |
| **Continuity writes** | Chronicle: phase events (5, 5b, 6+7). Signal activation checkpoint. |
| **Replay guarantee** | EXACT — signal derivation is deterministic. |
| **SQO impact** | None. Signals are structural observations, not SQO gates. |
| **Traversal legality** | Not applicable — pipeline state. |
| **Persistence** | Signal sets, binding envelope, vault readiness persisted. |

### State: EMERGENCE

**Entry (LENS runtime):** Payload resolved. Persona dispatched to EXECUTIVE_BALANCED. `fullReport` available.
**Orchestration agents active:** Persona Dispatch, Emergence Engine.
**Stratum:** Orchestration + Projection.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Emergence state computation (8 narrative functions evaluate thresholds). Authority escalation to INTERPRETIVE. Session state: emergenceState, authority tier. |
| **Prohibited mutations** | No spine writes. No SQO state changes. No continuity mutations. No structural artifact modification. |
| **Continuity writes** | None — emergence is session-scoped computation. |
| **Replay guarantee** | FUNCTIONAL — same payload produces same emerged narratives, but rendering is session-contextual (scroll position, user interaction). |
| **SQO impact** | None. Emergence observes SQO state (governance_lifecycle.available), does not alter it. |
| **Traversal legality** | Lateral: can transition to other personas via density class change. Vertical: Z1–Z5 depth available per emerged narrative. Escalation: PI Runtime available if sentinel conditions met. |
| **Persistence** | None. Emergence state recomputed on each render from payload. |

### State: QUALIFICATION

**Entry:** Pipeline artifacts complete. SQO execution graph loaded. Current S-level known.
**Orchestration agents active:** SQO Governance Orchestrator.
**Stratum:** Qualification.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Gate materializer execution (in gate order). Proposition derivation. CEU reconciliation. Proposition review dispositions. |
| **Prohibited mutations** | No out-of-order gate execution. No skipping gates. No automated disposition (operator-required). No S-state transition without revalidation PASS. |
| **Continuity writes** | All gate actions logged to event logs (append-only). Review obligations emitted on Gate 3 completion. Propositions written on Gate 2 completion. |
| **Replay guarantee** | EXACT for deterministic gates (2, 4). LINEAGE for operator gates (1, 3, 5) — the decisions are recorded and replayable, but the decision itself is non-deterministic (operator judgment). |
| **SQO impact** | PRIMARY — this state IS SQO mutation. |
| **Traversal legality** | Not applicable — governance state, not LENS traversal state. |
| **Persistence** | All gate artifacts, event logs, and state files persisted. No ephemeral gate state. |

### State: CONTINUITY_MUTATION

**Entry:** An operation that writes to the continuity substrate is executing.
**Orchestration agents active:** Pipeline Execution Orchestrator (hero moments) or SQO Governance Orchestrator (enrichment) or Operator (learning lifecycle).
**Stratum:** Continuity.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Spine object insertion. Hero moment emission. Learning event state transitions. Enrichment artifact creation. Convergence observation authoring. |
| **Prohibited mutations** | No retroactive mutation of existing spine objects. No deletion of chronicle events. No checkpoint modification. No mutation of certified replay segments. |
| **Continuity writes** | The defining characteristic of this state. All writes carry lineage. |
| **Replay guarantee** | LINEAGE — each mutation is recorded with timestamp, authority, rationale. The mutation sequence is replayable. The mutation decision (for operator actions) is non-deterministic. |
| **SQO impact** | Indirect — enrichment_exercised signal feeds promotion eligibility. |
| **Traversal legality** | Not applicable — substrate state. |
| **Persistence** | Mandatory — continuity mutations are permanent by definition. |

### State: PROJECTION_COMPILATION

**Entry:** Payload resolved. Persona dispatch determined. Compilation prerequisites available.
**Orchestration agents active:** Payload Resolution Orchestrator.
**Stratum:** Deterministic Cognition → Projection.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Payload assembly (~50 fields). Governance lifecycle projection (7 projections). Actor hydration. Structural enrichment derivation. Topology maturity classification. |
| **Prohibited mutations** | No evidence creation. No spine writes. No SQO state changes. No interpretive content at this stage (interpretation happens in Projection stratum). |
| **Continuity writes** | None — compilation is deterministic transformation of existing artifacts. |
| **Replay guarantee** | EXACT — same manifest + artifacts → same payload, always. |
| **SQO impact** | None — reads SQO state, does not alter it. |
| **Traversal legality** | Not applicable — occurs before LENS renders. |
| **Persistence** | Payload is computed per-request, not persisted. Source artifacts are the persistence layer. |

### State: EXECUTIVE_PROJECTION

**Entry:** Payload resolved. Persona dispatched to BOARDROOM.
**Orchestration agents active:** Persona Dispatch, (Boardroom Projection Compiler as sub-agent).
**Stratum:** Projection.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | 9-step boardroom projection compilation. Governing narrative composition (deterministic-bounded). Signal intelligence grouping. Governance legitimacy rendering. |
| **Prohibited mutations** | No spine writes. No SQO mutations. No evidence creation. No authority claims above L3. No violation of 13 interpretive prohibitions. |
| **Continuity writes** | None — projection is ephemeral computation. |
| **Replay guarantee** | EXACT — boardroom compilation is deterministic. Same payload → same projection. |
| **SQO impact** | None. Projects SQO state (governance_lifecycle, proposition_corpus), does not alter. |
| **Traversal legality** | Lateral: mode transition to other personas. Vertical: Z1–Z4 depth (Z5 suppressed at executive altitude). Escalation: available if posture = INVESTIGATE/ESCALATE or ≥ 2 critical signals. |
| **Persistence** | None. Projection recomputed on each render. |

### State: INVESTIGATION_REPLAY

**Entry:** Payload resolved. Persona dispatched to INVESTIGATION_DENSE.
**Orchestration agents active:** Persona Dispatch.
**Stratum:** Projection.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Sequential evidence block rendering. Backing classification (STRUCTURAL / SEMANTIC_ONLY). Evidence trail accumulation (session-scoped). |
| **Prohibited mutations** | No interpretation (prohibition + closure authority model). No narrative synthesis. No spine writes. No SQO mutations. |
| **Continuity writes** | None — investigation is evidence verification, not substrate mutation. |
| **Replay guarantee** | EXACT — evidence blocks are deterministic projections of structural state. |
| **SQO impact** | None. |
| **Traversal legality** | Lateral: mode transition available. Vertical: Z1–Z5 (full depth to raw evidence). Escalation: available if any block has SEMANTIC_ONLY backing. |
| **Persistence** | Trail export (HTML) persisted only if operator triggers export. |

### State: REPLAY_CERTIFICATION

**Entry:** All governed artifacts present. Chronicle complete. All checkpoints frozen.
**Orchestration agents active:** Certification engine (pipeline script).
**Stratum:** Qualification (assessment) + Continuity (certification artifact).

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Certification assessment (10-phase validation). Certification artifact creation (chronicle_certification.json). |
| **Prohibited mutations** | No mutation of any artifact under certification. No re-running pipeline phases. No SQO state changes. |
| **Continuity writes** | chronicle_certification.json created (CERTIFIED or CERTIFICATION_FAILED). |
| **Replay guarantee** | EXACT — certification is deterministic assessment of frozen state. |
| **SQO impact** | Indirect — certification status visible in governance lifecycle projection. |
| **Traversal legality** | Not applicable — certification is a pipeline/governance operation. |
| **Persistence** | Certification artifact persisted permanently. |

### State: ENRICHMENT

**Entry:** S1 achieved. Enrichment planned. Evidence sources identified.
**Orchestration agents active:** SQO Governance Orchestrator (enrichment pipeline).
**Stratum:** Continuity + Qualification.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Proposition confidence adjustment (with before/after logging). Component count correction. Domain reference correction. Debt reassessment. Enrichment activity signal emission. |
| **Prohibited mutations** | No new proposition creation. No disposition changes (those are Gate 3). No S-state transitions (those are Gate 5). No structural artifact modification (topology, code graph). |
| **Continuity writes** | enrichment_log.json, enrichment_activity_event.json, debt_reassessment.json, enrichment_summary.json. In-place mutation of semantic_propositions.json (logged). |
| **Replay guarantee** | EXACT for enrichment computation (same evidence → same corrections). LINEAGE for enrichment decisions (what to enrich). |
| **SQO impact** | Sets enrichment_exercised = true (required for S2 promotion). |
| **Traversal legality** | Not applicable — pipeline/governance operation. |
| **Persistence** | All enrichment artifacts persisted. Proposition mutations logged. |

### State: REVALIDATION

**Entry:** Review complete (Gate 3 COMPLETE) OR enrichment complete (post-enrichment).
**Orchestration agents active:** SQO Governance Orchestrator (revalidation engine).
**Stratum:** Deterministic Cognition (computation) + Qualification (verdict).

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | Multi-phase deterministic validation execution. Verdict emission (PASS / PARTIAL / FAIL). |
| **Prohibited mutations** | No input modification. No disposition changes. No enrichment. No promotion. |
| **Continuity writes** | revalidation_result.json created. revalidation_event_log.jsonl appended. |
| **Replay guarantee** | EXACT — revalidation is fully deterministic. Same corpus → same verdict, always. |
| **SQO impact** | Verdict is gate prerequisite for promotion. PASS required for S-state advancement. |
| **Traversal legality** | Not applicable — governance operation. |
| **Persistence** | Revalidation result persisted permanently. |

### State: STABILIZATION

**Entry:** Revalidation PASS. Constitutional anchor not blocking. All governance friction resolved.
**Orchestration agents active:** SQO Governance Orchestrator.
**Stratum:** Qualification.

| Dimension | Specification |
|-----------|--------------|
| **Allowed mutations** | S-state advancement (operator-governed). Promotion lineage recording. Constitutional anchor emission. Hold/block decisions. |
| **Prohibited mutations** | No S-state demotion. No gate re-execution. No retroactive disposition changes. No enrichment during stabilization. |
| **Continuity writes** | promotion_state.json mutated (s_level advanced). promotion_event_log.jsonl appended. constitutional_replay_anchor.json created. |
| **Replay guarantee** | LINEAGE — operator promotion decision is non-deterministic, but permanently recorded with full lineage. |
| **SQO impact** | PRIMARY — S-state transition is the defining SQO mutation. |
| **Traversal legality** | Not applicable — governance operation. |
| **Persistence** | S-state transition is permanent. Promotion lineage accumulates (never truncated). |

### State Transition Graph

```
INGESTION
    │ source boundary validated
    ▼
STRUCTURALIZATION
    │ topology + code graph + centrality + semantic model complete
    ▼
SIGNAL_ACTIVATION
    │ signals computed, binding envelope produced
    ▼
PROJECTION_COMPILATION ──────────────────────────┐
    │ payload assembled from all artifacts       │
    │                                             │
    ├───► EXECUTIVE_PROJECTION (BOARDROOM)        │
    ├───► EMERGENCE (BALANCED)                    ├── LENS runtime
    ├───► zone-navigated (DENSE) [via dispatch]   │   (concurrent
    └───► INVESTIGATION_REPLAY (INVESTIGATION)    │    with SQO)
                                                  │
QUALIFICATION ◄───────────────────────────────────┘
    │ Gates 1→2→3 (sequential, operator-governed)
    ▼
REVALIDATION
    │ deterministic multi-phase validation
    ▼
STABILIZATION
    │ S-state advancement (S0→S1)
    ▼
ENRICHMENT
    │ evidence enrichment, debt reassessment
    ▼
REVALIDATION (post-enrichment)
    │ re-run deterministic validation
    ▼
STABILIZATION
    │ S-state advancement (S1→S2)
    ▼
REPLAY_CERTIFICATION
    │ 10-phase certification
    ▼
CONTINUITY_MUTATION
    (occurs at any point where spine/chronicle/learning writes happen)
```

---

## 4. MUTATION LEGALITY MODEL

### 4.1 IMMUTABLE

These artifacts, once produced, MUST NEVER be modified. Modification invalidates all downstream derivations.

| Artifact Class | Immutability Scope | Violation Consequence |
|---------------|-------------------|----------------------|
| Structural topology (40.4) | From production to end-of-life | All derivations invalid |
| Code graph (40.3s) | From production to end-of-life | Centrality, enrichment invalid |
| Structural centrality (40.3c) | From production to end-of-life | Authority topology invalid |
| Revalidation results | From emission to end-of-life | Promotion decisions invalid |
| Constitutional replay anchor | From computation to end-of-life | Promotion legality invalid |
| Chronicle checkpoints | From freeze to end-of-life | Replay corridor broken |
| Chronicle event log entries | Individually immutable (append-only log) | Audit trail compromised |
| Operator event log entries | Individually immutable (append-only log) | Governance lineage broken |
| Certified replay corridors | Post-certification | Certification invalid |
| Proposition terminal dispositions | Post-disposition (ACCEPTED/REJECTED/ARBITRATED) | Review integrity broken |

**Enforcement rule:** If any immutable artifact is detected as modified (hash mismatch, timestamp inconsistency), the runtime MUST fail closed. No recovery. No override. Re-execution from scratch is the only legal path.

### 4.2 GOVERNED MUTABLE

These artifacts MAY be mutated, but ONLY under explicit governance constraints.

| Artifact Class | Mutation Authority | Mutation Contract |
|---------------|-------------------|-------------------|
| Semantic propositions (confidence) | Enrichment pipeline | Before/after logged in enrichment_log.json. Enrichment_activity_event emitted. Only accepted propositions eligible. |
| Semantic propositions (component counts) | Enrichment pipeline | Corrections logged per-domain. SDC evidence required. |
| Promotion state (s_level) | Operator via promotion_action.py | Revalidation PASS required. Constitutional anchor not blocking. Operator identity + rationale recorded. |
| Promotion state (hold/block) | Operator via promotion_action.py | Operator identity + rationale recorded. Reversible only forward (new unblock action, not retroactive). |
| Reconciliation state | Operator via reconciliation_action.py | Per-candidate transitions logged. Terminal states non-reversible. COMPLETE state blocks all further action. |
| Proposition review state | Operator via proposition_review_action.py | Per-proposition dispositions logged. Terminal dispositions non-reversible. COMPLETE blocks all further action. |
| Learning events | Operator via learning_promoter.py | State machine transitions logged. PROPOSED→REVIEWED→PROMOTED lifecycle. REJECTED terminal. |
| Spine objects (hero_moments) | Pipeline execution (ChronicleEmitter) | Inserted during pipeline phases. Never deleted. Filtered at consumption. |
| CHRONICLE_MANIFEST | Pipeline execution (ChronicleEmitter) | Updated at phase boundaries. Phase status transitions logged. |
| Convergence observations | Governed stream authoring | Authored during governed streams. Pattern_status and interpretation_maturity tracked. |

**Governed mutation invariants:**
1. Every mutation carries a timestamp (UTC ISO)
2. Every operator mutation carries identity + rationale
3. Every mutation is appended to an event log (not overwritten)
4. No governed mutation may be silently undone — reversal requires a new forward-logged action
5. Terminal states are absorbing — once a disposition/reconciliation/certification reaches terminal, no further mutation is legal

### 4.3 PROHIBITED

These operations are constitutionally illegal under all circumstances.

| Prohibited Operation | Rationale |
|---------------------|-----------|
| Post-certification evidence rewriting | Certified state is frozen truth. Rewriting evidence after certification breaks the audit chain. |
| Retroactive lineage mutation | Changing who-did-what-when after the fact destroys governance integrity. |
| Replay falsification | Altering replay corridors or checkpoint state to produce different replay outcomes. |
| Uncontrolled orchestration state injection | Writing to spine/SQO from orchestration stratum without governance gate. |
| Projection-level substrate mutation | Projections are read-only views. No projection may write to continuity, qualification, or deterministic strata. |
| S-state demotion | S-state transitions are irreversible. No S2→S1 or S1→S0. |
| Automated proposition disposition | Operator identity required for every accept/reject/contest/arbitrate action. |
| Automated promotion | Operator identity + L5 authority required for every S-state advancement. |
| Interpretation without 75.x authority | No interpretive output outside bounded interpretive authority with 13 prohibitions. |
| Cross-specimen state mutation during convergence | Convergence OBSERVES specimens. It MUST NOT mutate either specimen's governed state. |
| Hero moment fabrication | `manufactured` hero moments are permanently marked and filtered at consumption. Creating unmarked synthetic hero moments is falsification. |
| Enrichment of non-accepted propositions | Only ACCEPTED propositions are eligible for confidence enrichment. REJECTED/CONTESTED/CANDIDATE propositions are not enrichment targets. |

---

## 5. ORCHESTRATION SYNCHRONIZATION

### 5.1 Orchestration Event Flow

```
PIPELINE EXECUTION
    │ (sequential phases, serialized)
    │ emits: chronicle events, hero moments, learning observations
    │ produces: disk artifacts
    │
    ▼
SQO GOVERNANCE
    │ (gate-sequential, operator-interleaved)
    │ consumes: pipeline artifacts
    │ emits: review events, promotion events, enrichment events
    │ produces: governed state artifacts
    │
    ▼
PAYLOAD RESOLUTION
    │ (single-pass, deterministic)
    │ consumes: all disk artifacts via manifest
    │ produces: canonical payload (~50 fields)
    │
    ▼
PERSONA DISPATCH
    │ (state-driven, reactive)
    │ consumes: canonical payload
    │ routes to: exactly one persona renderer
    │
    ├─► EMERGENCE ENGINE (threshold-gated, parallel evaluation)
    │   consumes: fullReport
    │   produces: emergenceState, authority tier
    │
    └─► ZONE TRACKER (scroll-driven, continuous)
        consumes: DOM state
        produces: activeZoneKey, query availability
```

### 5.2 Synchronization Authority

| Synchronization Domain | Authority | Serialization |
|----------------------|-----------|---------------|
| Pipeline phase ordering | Pipeline Orchestrator | STRICT SERIAL — phase N must complete before phase N+1 starts |
| Gate ordering | SQO Execution Graph | STRICT SERIAL — gate N must COMPLETE before gate N+1 may begin |
| Artifact loading | Manifest + Artifact Loader | FAIL-CLOSED — any required artifact missing halts resolution |
| Persona dispatch | Density class state | EXCLUSIVE — exactly one persona active |
| Emergence evaluation | useMemo derivation | ATOMIC — all 8 functions evaluated together, results propagated as unit |
| Zone tracking | requestAnimationFrame | THROTTLED — one evaluation per animation frame, latest wins |
| Escalation state | piRuntimeActive flag | MONOTONIC within session — escalation persists until persona reset |
| Trail accumulation | exploredQueries Set | MONOTONIC within session — queries accumulate, never remove |

### 5.3 Synchronization Legality

**Legal concurrent operations:**
- LENS rendering concurrent with SQO governance operations (different strata)
- Emergence evaluation concurrent with zone tracking (different agents, independent state)
- Multiple users viewing LENS projections concurrently (projections are pure computation, no shared mutable state)

**Illegal concurrent operations:**
- Two pipeline phases executing simultaneously (pipeline is strictly sequential)
- Two SQO gate actions on the same specimen simultaneously (gate order is mandatory)
- Enrichment concurrent with revalidation on the same corpus (revalidation requires stable input)
- Promotion concurrent with enrichment (S-state transition requires enrichment to be complete)

### 5.4 Synchronization Persistence

| State | Persistence | Recovery |
|-------|------------|---------|
| Pipeline phase progress | Chronicle events (persistent) | Re-execute from last checkpoint |
| SQO gate state | Gate artifacts + event logs (persistent) | Load from disk, resume at current gate |
| LENS session state | Memory (ephemeral) | Re-derive from payload on next load |
| Emergence state | Memory (ephemeral) | Re-derive from fullReport on next render |
| Zone state | Memory (ephemeral) | Re-derive from scroll position |
| Escalation state | Memory (ephemeral) | Lost on persona change or session end |
| Explored queries | Memory (ephemeral) | Lost on session end. Persisted only via trail export (operator-triggered). |

---

## 6. REPLAYABILITY GUARANTEES

### 6.1 EXACT Replay (Bit-Identical)

These computations MUST produce identical outputs given identical inputs, across any execution context, any machine, any time.

| Computation | Inputs | Replay Contract |
|------------|--------|----------------|
| Canonical topology (40.4) | Raw file enumeration | Identical topology JSON |
| Code graph (40.3s) | Source files | Identical graph structure |
| Structural centrality (40.3c) | Code graph | Identical centrality scores |
| Signal derivation (DPSIG/PSIG/ISIG) | Topology + semantic model | Identical signal sets |
| Actor hydration | All structural artifacts | Identical actor registry + derived scores |
| Revalidation | Governed corpus | Identical phase results + verdict |
| Constitutional anchor | Governed corpus + reference specimen | Identical 8-dimensional assessment |
| Boardroom compilation | Resolved payload | Identical 9-step projection |
| Governing narrative composition | Spine objects + structural enrichment | Identical paragraph arc |
| Emergence threshold evaluation | fullReport | Identical activate/suppress decisions |

**Enforcement:** Any non-determinism in these computations is a CONSTITUTIONAL VIOLATION. If detected: fail closed, investigate root cause, fix before re-execution.

### 6.2 LINEAGE Replay (Decision-Traceable)

These operations involve operator judgment. The decisions themselves are non-deterministic, but the decision sequence is permanently recorded and replayable as a lineage trail.

| Operation | What Replays | What Doesn't |
|-----------|-------------|--------------|
| CEU reconciliation | Action sequence, timestamps, operator identity, rationale | The judgment itself (why operator chose confirm vs reject) |
| Proposition review | Disposition sequence, per-proposition rationale | The judgment itself |
| Promotion decision | Advance/hold/block choice, rationale, authority level | The judgment itself |
| Learning lifecycle | State transitions, reviewer identity | The evaluation criteria |
| Convergence authoring | Observation content, maturity classification | The interpretive synthesis |
| Enrichment decisions | What was enriched, before/after values | Why specific enrichment targets were chosen |

**Lineage completeness contract:** For any governed state, the question "how did this state arrive here?" MUST be answerable entirely from event logs + artifact snapshots. No oral history. No implicit state.

### 6.3 FUNCTIONAL Replay (Same-Behavior, Not Bit-Identical)

These operations produce equivalent behavior but may vary in exact representation across executions.

| Operation | What's Stable | What May Vary |
|-----------|-------------|---------------|
| Emergence rendering | Which narratives activate/suppress | DOM rendering details, layout timing |
| Zone tracking | Zone detection thresholds | Exact scroll position triggering |
| Persona dispatch | Which renderer activates | Rendering order within component |
| Interrogation trail HTML export | Evidence content, structural claims | CSS, formatting, timestamp |

### 6.4 What Invalidates Replay Legality

| Event | Consequence | Recovery |
|-------|------------|---------|
| Source file modification after structuralization | All structural artifacts invalid | Re-execute pipeline from INGESTION |
| Proposition mutation outside enrichment pipeline | Revalidation invalid, promotion invalid | Re-run revalidation; if propositions corrupted, re-derive from Gate 2 |
| Checkpoint modification | Replay corridor broken | No recovery — replay corridor permanently invalid |
| Event log truncation or deletion | Lineage broken | No recovery — governance audit trail permanently incomplete |
| Manifest path change without artifact migration | Payload resolution fails | Update manifest or restore artifact paths |
| Reference specimen mutation | Constitutional anchor invalid | Re-compute anchor; if reference specimen corrupted, all cross-specimen assessments invalid |

### 6.5 Re-Certification Requirements

When any of the following occurs, the existing certification (if any) is AUTOMATICALLY INVALIDATED and re-certification is required:

1. Any enrichment to the governed corpus
2. Any new proposition derivation
3. Any SQO gate re-execution
4. Any source file change triggering pipeline re-run
5. Any revalidation producing a different verdict than the certified run

Re-certification does NOT require full pipeline re-execution — only re-evaluation of the 10-phase certification engine against current artifact state.

---

## 7. SPINE PERSISTENCE MODEL

### 7.1 Continuity Object Classes

| Object Class | Lifecycle | Mutability | Lineage Requirement |
|-------------|-----------|-----------|-------------------|
| `semantic_propositions` | Created at Gate 2. Dispositioned at Gate 3. Enriched post-S1. | GOVERNED MUTABLE (confidence, component counts during enrichment only) | Derivation tier, evidence anchors, enrichment events |
| `hero_moments` | Emitted during pipeline execution. | IMMUTABLE post-emission | surprise_class, phase context, structural basis |
| `evidence_objects` | Produced by pipeline structural analysis. | IMMUTABLE post-production | evidence type, source artifact, structural location |
| `replay_corridors` | Created by chronicle compilation and certification. | IMMUTABLE post-certification | checkpoint sequence, governance events, phase markers |
| `convergence_observations` | Authored during governed streams. | GOVERNED MUTABLE (maturity progression only) | specimen references, pattern_status, interpretation_maturity |
| `learning_events` | Captured during pipeline execution or operator observation. | GOVERNED MUTABLE (lifecycle state transitions) | State machine: OBSERVED→PROPOSED→REVIEWED→PROMOTED→CONSUMABLE |
| `chronicle_events` | Emitted by ChronicleEmitter at phase boundaries. | IMMUTABLE post-emission (append-only log) | phase_id, timestamp, event_type |
| `checkpoints` | Frozen by ChronicleEmitter at governance boundaries. | IMMUTABLE post-freeze | checkpoint_id, phase_semantic, frozen state snapshot |

### 7.2 Persistence Boundaries

```
SESSION-SCOPED (dies with browser tab / CLI exit)
├── emergenceState
├── activeZoneKey
├── piRuntimeActive
├── exploredQueries
├── interrogationTrail
├── activeExpansionIndex
└── selectedNarrativeArc

REQUEST-SCOPED (computed per server-side render)
├── resolved payload (~50 fields)
├── boardroom projection (9-step compilation)
├── adapted report
└── supplementary SQO artifact loads

PERSISTENT (survives all session boundaries)
├── spine_objects.json
├── chronicle_events.jsonl
├── checkpoints/*.json
├── all *_event_log.jsonl files
├── promotion_state.json
├── proposition_review_state.json
├── reconciliation_state.json
├── revalidation_result.json
├── constitutional_replay_anchor.json
├── enrichment_*.json
├── convergence_observations.json
├── chronicle_certification.json
├── learning_events.jsonl
└── all structural artifacts (topology, code graph, centrality, signals)
```

### 7.3 Lineage Requirements

Every persistent object MUST carry sufficient lineage to answer:

1. **Who** — operator identity (for governed mutations) or pipeline phase (for automated emissions)
2. **When** — UTC ISO timestamp
3. **Why** — rationale (for operator actions) or derivation basis (for computed artifacts)
4. **From what** — source artifacts or input state that produced this object
5. **Under what authority** — authority level (L1–L5), governance gate, stream classification

**Lineage verification at certification:** The certification engine (10-phase) verifies that lineage chains resolve — every spine object traces to a source, every governance event traces to an operator, every deterministic output traces to its inputs.

### 7.4 Mutation Timestamps

All mutations to persistent state carry timestamps with the following precision requirements:

| Mutation Type | Timestamp Precision | Clock Authority |
|--------------|-------------------|-----------------|
| Pipeline phase events | Millisecond (ISO 8601) | Server UTC |
| Operator actions | Millisecond (ISO 8601) | Server UTC |
| Enrichment corrections | Millisecond (ISO 8601) | Server UTC |
| Checkpoint freezes | Second (ISO 8601) | Server UTC |
| Certification | Second (ISO 8601) | Server UTC |

**Timestamp ordering invariant:** For any two events in the same event log, `timestamp[N] ≤ timestamp[N+1]`. Violation indicates clock skew or concurrent write corruption — fail closed.

### 7.5 Arbitration Lineage

When a proposition passes through the governance lifecycle, its arbitration lineage accumulates:

```
CANDIDATE (Gate 2 derivation)
    │ derivation_tier, confidence, evidence_anchors
    ▼
REVIEW (Gate 3)
    │ operator_id, disposition, rationale, timestamp
    │ if CONTESTED: contest_rationale, original_disposition
    │ if ARBITRATED: arbitration_rationale, resolution
    ▼
ENRICHMENT (post-S1)
    │ enrichment_action, before_confidence, after_confidence
    │ enrichment_source (SDC domain match / NO_SDC_MATCH)
    ▼
REVALIDATION
    │ revalidation_verdict, phase_results
    ▼
CONSTITUTIONAL ANCHOR
    │ 8 dimensional assessments, distance verdict
```

This lineage is the arbitration chain. At any point, the question "why does this proposition have this confidence and this disposition?" is answerable from the chain alone.

### 7.6 Replay Insertion Legality

| Insertion Point | Legal Inserter | Insertion Contract |
|----------------|---------------|-------------------|
| spine_objects.json → hero_moments | ChronicleEmitter during pipeline | Must carry surprise_class, structural_basis. Insertion is append. |
| spine_objects.json → semantic_propositions | SPE output_emitter (Gate 2) | Must carry derivation_tier, confidence, evidence_anchors. Replaces previous set. |
| chronicle_events.jsonl | ChronicleEmitter | Append-only. Each event self-contained with phase_id, timestamp, type. |
| learning_events.jsonl | Pipeline observation OR operator promotion | Append-only. State machine transitions only. |
| convergence/convergence_observations.json | Governed stream authoring | Creates or replaces per-stream. Each observation carries specimen_refs, maturity. |

**Illegal insertion:** Any write to spine or chronicle from orchestration stratum (B), projection stratum (E), or any unauthenticated source is CONSTITUTIONALLY ILLEGAL.

### 7.7 Hero Moment Lifecycle

```
DISCOVERY (pipeline execution)
    │ ChronicleEmitter.emit_hero_moment()
    │ surprise_class assigned: CENTRALITY / TOPOLOGY / COUPLING / EMERGENCE
    │ manufactured flag: false (genuine) or true (synthetic)
    ▼
STORAGE (spine_objects.json)
    │ Hero moment persisted permanently
    │ Never deleted, never modified
    ▼
CONSUMPTION (GoverningNarrativeComposer)
    │ Filtered: only !manufactured moments
    │ Sorted by SURPRISE_CLASS_PRIORITY: CENTRALITY(0) > TOPOLOGY(1) > COUPLING(2) > EMERGENCE(3)
    │ Transformed into narrative anchors (NA-<8char>)
    ▼
PROJECTION (governed narrative paragraphs)
    │ Narrative anchors drive paragraph arc: OPENING → REVELATION → DEPTH → AUTHORITY → QUALIFICATION
    │ Composition method: DETERMINISTIC_BOUNDED
    │ Replay tier: EXACT
```

---

## 8. AUTHORITY TRANSITIONS

### 8.1 Authority Tier Model

```
L0  RAW EVIDENCE
    No computation, no derivation. Source files as-is.

L1  STRUCTURAL DERIVATION
    Deterministic computation on L0 evidence.
    Topology, code graph, centrality, signals.
    Authority: machine-verifiable, reproducible.

L2  SEMANTIC DERIVATION
    Evidence-grounded semantic claims.
    Propositions, domain classification, capability mapping.
    Authority: structurally anchored, operator-reviewable.

L3  BOUNDED INTERPRETATION (AI CEILING)
    75.x governed interpretive authority.
    Emergence narratives, signal interpretation, governance posture.
    Authority: evidence-synthesized, disclosure-wrapped, prohibition-bounded.
    ALL AI-derived content capped here.

L4  OPERATOR JUDGMENT
    Human disposition, review, arbitration.
    Accept/reject/contest/arbitrate decisions.
    Authority: non-automatable, rationale-required.

L5  GOVERNANCE AUTHORITY
    S-state promotion, constitutional decisions.
    Authority: irreversible lifecycle transitions.
    Required for: S2 promotion.
```

### 8.2 Authority Escalation Legality

| From | To | Legal? | Trigger | Reversible? |
|------|-----|--------|---------|-------------|
| L1 → L2 | YES | Proposition derivation from structural evidence | NO (propositions persist) |
| L1 → L3 | YES | Emergence function activation on structural thresholds | YES (session-scoped; re-evaluated per render) |
| L2 → L3 | YES | Interpretive projection of semantic claims | YES (session-scoped) |
| L2 → L4 | YES | Proposition submitted for operator review | NO (disposition is terminal) |
| L3 → L4 | NO | Interpretation does not generate operator obligations | — |
| L4 → L5 | YES | Operator initiates promotion after revalidation PASS | NO (S-state irreversible) |
| L3 → L1 | YES | De-escalation on persona change (mode reset) | YES (re-escalation available) |
| L5 → L4 | NO | Governance decisions are irreversible | — |
| * → L0 | NO | Cannot de-escalate to raw evidence tier (evidence is always available, not an authority state) | — |

### 8.3 Runtime Authority Escalation (LENS Session)

```
STRUCTURAL (L1)
    │ Default state. Pure structural display.
    │ No interpretation.
    │
    ▼ BALANCED persona + emergence threshold met
INTERPRETIVE (L3)
    │ 75.x bounded authority.
    │ 8 emergence functions active.
    │ 13 prohibitions enforced.
    │ Disclosure wrapping mandatory.
    │
    ▼ Escalation sentinel condition met + user triggers escalation
PI_INTERPRETIVE (L3, extended scope)
    │ Full PI Runtime authority.
    │ Interrogation expansion queries.
    │ Guided structural probes.
    │ Still bounded by L3 ceiling.
    │ Still 13 prohibitions.
    │
    ─── RESET on persona transition (returns to STRUCTURAL)
```

### 8.4 Pipeline Authority Escalation

```
INGESTION (L0)
    │ Raw evidence only.
    ▼
STRUCTURALIZATION (L1)
    │ Deterministic derivation from evidence.
    ▼
SIGNAL_ACTIVATION (L1)
    │ Deterministic signal computation.
    ▼
PROPOSITION_DERIVATION (L2)
    │ Semantic claims derived from structural evidence.
    ▼
OPERATOR_REVIEW (L4)
    │ Non-automatable disposition.
    ▼
REVALIDATION (L1)
    │ Deterministic validation of L2+L4 outputs.
    ▼
PROMOTION (L5)
    │ Irreversible governance transition.
```

### 8.5 Rollback Legality

| Authority Domain | Rollback Legal? | Mechanism |
|-----------------|----------------|-----------|
| LENS session escalation | YES | Persona change resets to STRUCTURAL |
| Emergence activation | YES | Threshold re-evaluation on each render (stateless) |
| Proposition disposition | NO | Terminal states are absorbing |
| S-state advancement | NO | Irreversible |
| Certification | NO | Re-certification required (new certification, not rollback) |
| Enrichment | NO | Before/after logged; restoring previous confidence requires new enrichment event, not retroactive change |
| Pipeline re-execution | YES | Re-run from INGESTION with same or new source |

---

## 9. ADAPTIVE RUNTIME BOUNDARIES

### 9.1 What Future Adaptive Orchestration MAY Do

| Capability | Conditions | Preserves |
|-----------|-----------|-----------|
| Autonomous structural re-derivation | Source changes detected; re-execute pipeline from INGESTION | Deterministic computation guarantee |
| Dynamic enrichment source selection | New evidence sources identified; enrichment pipeline parameterized | Enrichment governance (operator still decides what to accept) |
| Adaptive zone weighting | Structural state drives zone visibility/ordering | Zone tracking semantics (scroll-based, content-driven) |
| Cross-specimen convergence expansion | 3+ specimens available; maturity promotion from DESCRIPTIVE to EMERGENT | Convergence discipline (maturity requires governance review) |
| Learning event auto-observation | Pipeline detects patterns matching learning criteria | Learning lifecycle (OBSERVED state only; PROPOSED→REVIEWED requires operator) |
| Parallel pipeline execution | Multiple specimens processed concurrently | Specimen isolation (no cross-specimen mutation during parallel execution) |
| Guided enrichment suggestion | System identifies enrichment targets from debt analysis | Operator authority (suggestions only; enrichment execution requires operator) |
| Adaptive revalidation expansion | New validation phases added for evolved corpus types | Revalidation determinism (new phases must be deterministic, not heuristic) |

### 9.2 What Future Adaptive Orchestration MUST NEVER Do

| Prohibition | Rationale |
|------------|-----------|
| Autonomous proposition disposition | Proposition review is constitutionally non-automatable. The L3→L4 boundary is the core governance invariant. |
| Autonomous S-state advancement | Promotion requires L5 authority. No automation may self-authorize governance transitions. |
| Retroactive lineage modification | Governance integrity depends on immutable audit trails. Adaptive systems may add to lineage, never alter it. |
| Projection-originating evidence | Projections derive FROM evidence. No projection may CREATE evidence that then feeds back into structural derivation. Feedback loops from projection to substrate are constitutionally illegal. |
| Uncontrolled orchestration agent spawning | New orchestration agents must be constitutionally registered with defined stratum membership, synchronization contracts, and mutation authority. No ad-hoc agent creation. |
| Interpretation without disclosure | All interpretive output must carry 75.x authority declaration and 13 prohibitions. No "hidden interpretation" that appears as structural fact. |
| Convergence law-claiming without governance review | Two specimens = comparison. Three = emerging pattern. Law requires governance review and operator acknowledgment. Adaptive systems cannot auto-promote convergence maturity. |
| Cross-session state injection without spine persistence | Adaptive learning that carries across sessions MUST go through the spine persistence model (§7). No implicit memory that bypasses governed persistence. |
| Optimization of governance friction away | Governance friction (contest, reject, arbitrate) is structurally valuable — it drives enrichment and substrate strengthening. Adaptive systems must not optimize for frictionless flow. |
| Semantic drift without re-derivation | If structural substrate changes, ALL semantic claims derived from it must be re-derived. Adaptive systems cannot patch semantic claims without re-running the derivation chain. |

### 9.3 Preservation Guarantees

The adaptive runtime MUST preserve, regardless of future evolution:

1. **Deterministic cognition substrate** — same input → same output for all Stratum A computations, forever
2. **Replay legality** — any certified replay corridor must produce identical navigation experience
3. **Evidence integrity** — evidence artifacts are immutable; no adaptive process may modify them
4. **Module embodiment** — the domain module (Software Intelligence for software specimens) permeates all strata; it is not an attachment point that adaptive orchestration can bypass
5. **Cognition richness** — emergence, interrogation, investigation, and executive projection are distinct cognitive regimes; adaptive optimization must not collapse them into a single "AI response" mode
6. **Operator sovereignty** — operator decisions are final within their authority tier; adaptive systems advise, they do not override
7. **Lineage completeness** — for any governed state, the path from raw evidence to current state must be traceable through persisted artifacts alone

---

## 10. IMPLEMENTATION GAP MATRIX

### 10.1 Current Implementation vs. Required Runtime Contracts

| Runtime Contract | Current State | Gap |
|-----------------|--------------|-----|
| **Deterministic replay guarantee** | Revalidation engine (8-phase/25-check PATH A; 9-phase/48-check PATH B) is deterministic. Governing narrative composition is DETERMINISTIC_BOUNDED. Boardroom compilation is deterministic. | No deterministic replay VERIFICATION exists — no automated test that re-runs computation and asserts identical output. |
| **Immutability enforcement** | Event logs are append-only by convention. Checkpoints frozen by convention. | No runtime hash verification. No tamper detection. Convention-enforced, not system-enforced. |
| **Authority tier enforcement** | L3 ceiling declared in authority_declaration. 75.x prohibitions listed in constitution. | No runtime enforcement of L3 ceiling. Prohibitions are compositional discipline, not code guards. |
| **Stratum isolation** | Strata are architecturally separated (different files/scripts). | No runtime boundary enforcement. A coding error could violate stratum isolation without detection. |
| **Synchronization contracts** | Pipeline is sequential (phase ordering). SQO gates are sequential (gate ordering). LENS personas are exclusive (dispatch logic). | No formal synchronization primitives. No deadlock detection. No concurrent access guards on governed artifacts. |
| **Session state lifecycle** | Session state managed via React useState/useMemo. | No explicit session lifecycle management. State reset on persona change is coded into individual handlers, not a centralized lifecycle manager. |
| **Persistence completeness** | All governed artifacts persisted to disk via JSON files. | No persistence verification (confirm all required artifacts actually written). No consistency check across artifact set. |
| **Lineage verification** | Lineage carried in artifact metadata fields. Certification engine checks some lineage chains. | No continuous lineage verification. Certification is point-in-time, not continuous enforcement. |

### 10.2 Missing Materializers

| Materializer | Stratum | Impact |
|-------------|---------|--------|
| PATH A enrichment engine | Continuity + Qualification | Code graph enrichment pipeline not materialized. NetBox (canonical PATH A specimen) cannot exercise enrichment lifecycle. |
| Enrichment planning materializer | Qualification | No formal planning step — enrichment targets selected implicitly. |
| Standalone debt reassessment | Qualification | Embedded in evidence_enrichment script. Not independently executable. |
| Standalone enriched proposition update | Qualification | Embedded in evidence_enrichment script. Not independently executable. |
| Convergence observation materializer | Continuity | Manually authored. Appropriate at DESCRIPTIVE maturity; will need formalization at EMERGENT. |

### 10.3 Missing Synchronization Layers

| Layer | Purpose | Current Mitigation |
|-------|---------|-------------------|
| Artifact consistency validator | Verify all artifacts in a governed set are internally consistent | Certification engine (point-in-time, not continuous) |
| Concurrent write guard | Prevent simultaneous mutation of governed artifacts | Single-user assumption (no concurrent pipeline or SQO actions) |
| Session lifecycle manager | Centralized authority/state reset on persona transition | Distributed reset handlers in individual components |
| Cross-stratum boundary enforcer | Prevent illegal cross-stratum writes | Code review discipline (not runtime enforced) |

### 10.4 Missing Persistence Objects

| Object | Purpose | Current State |
|--------|---------|---------------|
| Artifact hash manifest | Track hash of every governed artifact for tamper detection | Not implemented |
| Session replay log | Record LENS session interactions for replay audit | Not implemented (trail export captures subset) |
| Enrichment plan artifact | Formal declaration of enrichment targets before execution | Not implemented (enrichment targets are implicit) |
| Authority escalation log | Record all authority tier transitions in LENS sessions | Not implemented |

### 10.5 Missing Legality Enforcement

| Enforcement | Purpose | Current State |
|-------------|---------|---------------|
| Immutable artifact verification | Detect unauthorized modification of immutable artifacts | Not implemented |
| Terminal state enforcement | Prevent mutation of terminal-state propositions/reconciliations | Enforced in action scripts (convention), not at storage layer |
| Authority ceiling runtime guard | Prevent AI-derived content from exceeding L3 | Compositional discipline, not runtime guard |
| Stratum isolation guard | Prevent cross-stratum writes | Architectural separation, not runtime enforcement |
| Replay determinism test | Verify exact replay guarantee holds | Not implemented |

---

## 11. IMPLEMENTATION SEQUENCING

### P0: Runtime Legality Foundation

**Objective:** Establish the enforceable legality layer that prevents constitutional violations at runtime.

**Deliverables:**
- Artifact hash manifest system — compute and store hashes for all governed artifacts at creation time; verify on load
- Terminal state enforcement at storage layer — reject writes to terminal-state propositions/reconciliations regardless of calling code
- Immutable artifact verification — tamper detection for checkpoints, event logs, certified corridors
- Replay determinism test harness — automated re-execution of deterministic computations with output comparison

**Why P0:** Without legality enforcement, all downstream synchronization and materialization operates on trust. Legality enforcement is the foundation that makes the rest of the constitution binding rather than advisory.

### P1: Continuity Materializers

**Objective:** Close the materializer gaps that prevent full governance lifecycle exercise.

**Deliverables:**
- PATH A enrichment engine — code graph authority topology → proposition confidence enrichment for PATH A specimens
- Enrichment planning materializer — formal enrichment target declaration with operator approval before execution
- Standalone debt reassessment — extractable from evidence_enrichment, independently executable and testable
- Standalone enriched proposition update — extractable from evidence_enrichment, independently executable

**Why P1:** Without these materializers, NetBox (canonical PATH A specimen) cannot exercise the S1→S2 enrichment lifecycle. The governance lifecycle is incomplete for the primary specimen type.

### P2: Synchronization Layer

**Objective:** Formalize the synchronization contracts that are currently convention-enforced.

**Deliverables:**
- Artifact consistency validator — continuous verification that governed artifact sets are internally consistent (not just at certification)
- Concurrent write guard — formal locking or serialization for governed artifact mutation (preparing for multi-operator, multi-pipeline future)
- Session lifecycle manager — centralized authority/state management on persona transition, escalation, and session boundaries
- Authority escalation log — persistent record of all LENS session authority transitions

**Why P2:** Synchronization failures are silent. Without explicit synchronization, concurrent operations (future multi-operator, parallel pipeline) risk governed state corruption with no detection.

### P3: Traversal Contracts

**Objective:** Formalize the traversal semantics that projections depend on.

**Deliverables:**
- Cross-stratum boundary enforcer — runtime guard preventing illegal writes from orchestration/projection strata to continuity/qualification strata
- Persona transition protocol — formal definition of what resets, what persists, what carries across persona transitions
- Depth traversal contract — formal Z1–Z5 depth semantics per persona with defined entry/exit behavior
- Interrogation trail persistence — governed persistence of exploration trails (currently session-scoped, lost on exit)

**Why P3:** Traversal is the cognitive interface. Without formal contracts, traversal behavior is implementation-dependent rather than constitutionally governed. Persona transitions, depth navigation, and trail accumulation should be predictable and auditable.

### P4: Adaptive Runtime Enablement

**Objective:** Create the controlled extension points for future adaptive orchestration.

**Deliverables:**
- Orchestration agent registration protocol — formal process for adding new orchestration agents with stratum assignment, synchronization contracts, and mutation authority declaration
- Adaptive enrichment suggestion system — system-generated enrichment recommendations based on debt analysis, with mandatory operator approval gate
- Convergence maturity progression framework — formal process for promoting convergence observations from DESCRIPTIVE → EMERGENT → ESTABLISHED as specimen count grows
- Learning-to-capability pipeline — formal pathway for CONSUMABLE learning events to influence pipeline parameterization (not governance decisions)

**Why P4:** Adaptive capability is the future of the runtime, but it must be constitutionally governed. P4 creates the controlled apertures through which adaptation can occur without violating the legality, synchronization, and replay guarantees established in P0–P3.

---

*Document produced as part of PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01*
*Classification: CONSTITUTIONAL / IMPLEMENTATION SPECIFICATION*
*All specifications grounded in operational LENS cognition reality*
*Forensic basis: PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01*
*Orchestration basis: PI.GENESIS.LENS-COGNITION-ENRICHMENT.01/AGENTIC_ORCHESTRATION_TOPOLOGY.md*
