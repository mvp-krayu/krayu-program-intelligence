# AGENTIC ORCHESTRATION TOPOLOGY

**Program:** PI.GENESIS.LENS-COGNITION-ENRICHMENT.01
**Classification:** FORENSIC / CONSTITUTIONAL / NON-IMPLEMENTATION
**Specimen:** Runtime operational cognition system (cross-persona, cross-pipeline)
**Date:** 2026-05-25

---

## PURPOSE

This document maps the OPERATIONAL orchestration topology of Program Intelligence at runtime. It answers: which orchestration agents exist, what cognition functions they coordinate, how they activate, how they escalate, how they insert into memory (spine), how they route traversal, how they mutate continuity, how they mutate qualification, and how they arbitrate enrichment.

This is a **forensic capture** of what exists and operates — not a design document. Every entry traces to operational code or governed pipeline scripts.

---

## 1. ORCHESTRATION AGENT REGISTRY

The PI runtime operates through **6 orchestration agents**, each coordinating a distinct cognitive function domain. These are not microservices — they are functional coordination boundaries within the operational system.

### Agent 1: PAYLOAD RESOLUTION ORCHESTRATOR

**What it coordinates:** Source loading → artifact validation → semantic projection → governance lifecycle projection
**Operational location:** `GenericSemanticPayloadResolver.resolveSemanticPayload()`
**Cognitive stratum:** PI Core (structural derivation)

**Coordination sequence:**
1. `GenericSemanticArtifactLoader.loadArtifacts(manifest)` — loads all required + optional artifacts from manifest
2. `projectDPSIGSignalSet()` — signal projection
3. `projectPSIGSignals()` — signal projection
4. `buildCrosswalkIndex()` — crosswalk construction
5. `GenericActorHydrator.hydrateActors()` — 15-actor registry with score/band/posture/qualifier derivation
6. `deriveStructuralEnrichment()` — code graph + centrality enrichment
7. `classifyTopologyMaturity()` — maturity classification (5 tiers)
8. Semantic domain registry construction (S1 vs S2+ path split)
9. Evidence block construction (triadic projection: ORIGIN/PASS_THROUGH/RECEIVER)
10. `GoverningNarrativeComposer.composeGoverningNarrative()` — spine-grounded narrative
11. 7 governance lifecycle projections (see §7 below)

**Output:** ~50-field canonical payload. This is the **single resolved truth** consumed by all downstream personas.

**Fail-closed:** Any required artifact missing → `{ ok: false, error: 'REQUIRED_ARTIFACT_MISSING' }`. No partial resolution.

### Agent 2: PERSONA DISPATCH ORCHESTRATOR

**What it coordinates:** Payload → adaptation → persona routing → representation rendering
**Operational location:** `IntelligenceField` component + `RepresentationField` dispatcher
**Cognitive stratum:** Agentic Orchestration (persona projection)

**Coordination sequence:**
1. `orchestrateFlagshipExperience()` → `adaptReport()` — produces adapted payload, renderState, motionProfile, densityLayout
2. `compileBoardroomProjection()` (conditional: boardroomMode) — 9-step boardroom compilation
3. `RepresentationField` dispatch:
   - `boardroomMode` → `BoardroomDecisionSurface` (compiled projection regime)
   - `INVESTIGATION_DENSE` → `InvestigationTraceField` (sequential evidence regime)
   - `EXECUTIVE_BALANCED` → `BalancedConsequenceField` (emergence orchestration regime)
   - default (`EXECUTIVE_DENSE`) → `DenseTopologyField` (zone-navigated decomposition regime)

**State managed:**
- `activeZoneKey` — current zone focus (scroll-tracked or pinned)
- `activeQueryKey` — selected query within zone
- `exploredQueries` — Set of traversed query paths
- `emergenceState` — narrative map from BALANCED emergence
- `piRuntimeActive` — escalation state
- `activeExpansionIndex` — current PI Runtime expansion
- `interrogationTrail` — accumulated evidence trail
- `selectedNarrativeArc` — boardroom narrative selection

**Mode transition guard:** When density class changes away from BALANCED, emergenceState is nulled and piRuntimeActive deactivated. Zone state resets on zone change.

### Agent 3: EMERGENCE ORCHESTRATION ENGINE

**What it coordinates:** 8 interpretive narrative functions, activation/suppression, authority escalation
**Operational location:** `BALANCED_INTERPRETIVE_NARRATIVES` registry + `BalancedConsequenceField`
**Cognitive stratum:** Agentic Orchestration (emergence synthesis)
**Activation persona:** EXECUTIVE_BALANCED only

**The 8 registered emergence functions:**

| Key | Name | Class | Activation condition |
|-----|------|-------|---------------------|
| `executiveSynthesis` | EXECUTIVE SYNTHESIS | PRIMARY | `readiness_summary.score` or `.posture` exists |
| `groundingIntelligence` | GROUNDING INTELLIGENCE | SECONDARY | Advisory ratio > 0.3 OR backed < cluster count |
| `pressureIntelligence` | PRESSURE INTELLIGENCE | SECONDARY | Activated signals ≥ 2 OR any critical OR zone ≠ NOMINAL |
| `governancePosture` | GOVERNANCE POSTURE | SECONDARY | `governance_lifecycle.available === true` |
| `propagationIntelligence` | PROPAGATION INTELLIGENCE | TERTIARY | 2+ propagation roles AND ORIGIN/PASS_THROUGH/RECEIVER present |
| `qualificationIntelligence` | QUALIFICATION INTELLIGENCE | TERTIARY | Band ≠ STRONG OR advisory ratio > 0.4 |
| `enrichmentPosture` | ENRICHMENT POSTURE | TERTIARY | `enrichment_intelligence.available` AND enrichment_events > 0 |
| `convergencePosture` | CONVERGENCE POSTURE | TERTIARY | `convergence_intelligence.available` AND total_observations > 0 |

**Each function signature:** `derive(fullReport) → { narrative, evidenceChain, structuralBasis, authority, emergenceClass }`

**Suppression mechanism:** `narrative === null` means the function is NOMINAL (structural state does not warrant activation). The function returns null — it does NOT fail. This is the difference between emergence and deterministic rendering: functions CHOOSE whether to speak.

**Orchestration flow in `BalancedConsequenceField`:**
1. `useMemo` derives all 8 narratives from `fullReport`
2. Counts emerged (narrative !== null)
3. Reports authority via `onAuthorityChange('INTERPRETIVE')` if any emerged
4. Reports emergence state via `onEmergenceState(narratives)` — propagates upward
5. Fixed rendering sequence: executiveSynthesis → groundingIntelligence → pressureIntelligence → propagationIntelligence → qualificationIntelligence → governancePosture → enrichmentPosture → convergencePosture

**Emergence state flows to:**
- `ExecutiveInterpretation` — left-column narrative panel (shows emerged narratives as compact interpretive blocks)
- `SupportRail` — right-column INTELLIGENCE STATE index (dot indicators per function: filled=active, empty=nominal)

### Agent 4: ZONE TRACKING ORCHESTRATOR

**What it coordinates:** Scroll-based zone detection, zone state propagation, query path availability
**Operational location:** `DenseTopologyField.updateActiveZone()` + `IntelligenceField` state
**Cognitive stratum:** Agentic Orchestration (navigated decomposition)
**Activation persona:** EXECUTIVE_DENSE primarily (zone state also consumed by escalation logic)

**7 registered zones:**

| Key | Code | Label |
|-----|------|-------|
| `semanticTopology` | ST | Semantic Topology |
| `clusterConcentration` | CC | Cluster Concentration |
| `alignmentLandscape` | AL | Alignment Landscape |
| `signalActivation` | SA | Signal Activation |
| `pressureField` | PF | Pressure Field |
| `propagationZone` | PZ | Propagation Zone |
| `governanceLandscape` | GL | Governance Landscape |

**Tracking mechanism:**
1. Scroll listener attached to window (RAF-throttled)
2. Queries all `[data-zone-key]` elements within field ref
3. Computes distance from each zone center to viewport center
4. Selects minimum-distance zone as active
5. Calls `onZoneChange(best)` → sets `activeZoneKey`

**Zone pinning:** `pinnedZoneRef.current` suppresses scroll tracking — allows manual lock.

**Zone state drives:**
- `DENSE_ZONE_PATHS[activeZoneKey]` → query path availability in SupportRail
- `DENSE_ZONE_INTERPRETATIONS[activeZoneKey]` → zone-specific interpretation in ExecutiveInterpretation
- `STRUCTURAL_ESCALATION_CONDITIONS[densityClass]` evaluation (dense mode: `activeZoneKey exists AND backed < total`)
- `INTERROGATION_EXPANSION_REGISTRY[mode](fullReport, activeZoneKey)` → PI Runtime expansion queries

**State reset on zone change:** `activeQueryKey` and `activeExpansionIndex` reset when zone changes.

### Agent 5: PIPELINE EXECUTION ORCHESTRATOR

**What it coordinates:** Multi-phase structural + semantic pipeline with chronicle emission
**Operational location:** `scripts/pios/run_client_pipeline.py`
**Cognitive stratum:** PI Core (substrate production)

**Phase sequence:**
0L → 1 → 2 → 3 → 3.5 → 3.6 → 3.7 → 3b → 3c → 4 → 5 → 5b → 6+7 → 8a → 8b → 9 → 10L

| Phase | Function | Output |
|-------|----------|--------|
| 0L | Learning load | learning_events.jsonl hydration |
| 1 | Source boundary | repository validation |
| 2 | Intake | raw file enumeration |
| 3 | Structural | canonical topology (40.4) |
| 3.5 | Relevance | structural relevance filtering |
| 3.6 | Code graph | code graph construction (40.3s) |
| 3.7 | Centrality | structural centrality (40.3c) |
| 3b | Semantic derivation | SDC / semantic topology model |
| 3c | Proposition derivation | SPE semantic propositions |
| 4 | CEU grounding | candidate registry + evidence anchors |
| 5 | Binding envelope | decision validation + binding |
| 5b | CSR topology | client-semantic-registry topology |
| 6+7 | Activation + projection | signal activation + LENS projection |
| 8a | Vault construction | spine vault assembly |
| 8b | Vault readiness | vault readiness validation |
| 9 | Selector | final output selection |
| 10L | Learning manifest | learning event capture |

**Chronicle integration:** `ChronicleEmitter` initialized at startup. Emits `phase_started` / `phase_completed` events at every phase boundary. Freezes checkpoints at governance boundaries. Methods: `emit_hero_moment()`, `emit_ai_intervention()`, `emit_operator_decision()`, `emit_learning_promotion()`, `finalize()`.

### Agent 6: SQO GOVERNANCE ORCHESTRATOR

**What it coordinates:** Qualification lifecycle (Gates 1–5), enrichment, promotion, constitutional anchor
**Operational location:** Gate materializer scripts (see §7)
**Cognitive stratum:** SQO Operational (governance lifecycle)

**Gate sequence (S0→S1):**
Gate 1 (CEU Reconciliation) → Gate 2 (Proposition Derivation) → Gate 3 (Proposition Review) → Gate 4 (Revalidation) → Gate 5 (Promotion S1)

**Gate sequence (S1→S2):**
Enrichment Planning → Evidence Enrichment → Debt Reassessment → Enriched Proposition Update → Gate 4 (Revalidation post-enrichment) → Constitutional Anchor Recheck → Gate 5 (Promotion S2)

**Operator boundaries (non-automatable):**
- Gate 1: `confirm`, `reject`, `merge`, `complete` actions
- Gate 3: `accept`, `reject`, `contest`, `arbitrate`, `complete` actions
- Gate 5: `advance`, `hold`, `block` actions
- All require operator identity + rationale

**Detail in §7 (Qualification Mutation Graph).**

---

## 2. ACTIVATION GRAPH

The activation graph defines how structural state propagates through the orchestration agents to produce cognitive output.

### 2.1 Primary Activation Chain

```
DISK ARTIFACTS (governed pipeline outputs)
    │
    ▼
MANIFEST RESOLUTION ──── manifest validates → artifact paths resolve
    │
    ▼
PAYLOAD RESOLUTION ───── artifacts load → projections derive → 50-field payload
    │
    ├── FAIL: required artifact missing → { ok: false } → STOP
    │
    ▼
SERVER-SIDE BINDING ──── payload + supplementary SQO artifacts → page props
    │
    ▼
CLIENT ORCHESTRATION ─── adaptReport() → renderState + adapted payload
    │
    ├── boardroomMode? → BOARDROOM COMPILATION (9-step) → BoardroomDecisionSurface
    │
    ▼
PERSONA DISPATCH ─────── densityClass routes to persona renderer
    │
    ├── EXECUTIVE_BALANCED → EMERGENCE ENGINE activation
    ├── EXECUTIVE_DENSE ──→ ZONE TRACKER activation
    ├── INVESTIGATION ────→ sequential evidence rendering
    └── BOARDROOM ────────→ compiled projection rendering
```

### 2.2 Emergence Activation Sequence

```
fullReport enters BalancedConsequenceField
    │
    ▼
useMemo iterates BALANCED_INTERPRETIVE_NARRATIVES[0..7]
    │
    ├── fn.derive(fullReport) → { narrative: string|null, ... }
    │   each function independently evaluates structural thresholds
    │
    ▼
EMERGED = count(narrative !== null)
    │
    ├── EMERGED > 0 → onAuthorityChange('INTERPRETIVE')
    │                  onEmergenceState(narratives)
    │                  renders emerged narratives in fixed sequence
    │
    └── EMERGED === 0 → authority stays null
                        emergence state empty
                        no interpretive output
```

### 2.3 Escalation Activation (PI Runtime)

```
STRUCTURAL_ESCALATION_CONDITIONS[densityClass] evaluated
    │
    ├── boardroom: posture ∈ {INVESTIGATE, ESCALATE} OR critical_signals ≥ 2
    ├── balanced:  advisoryRatio > 0.3 AND activated_signals ≥ 2
    ├── dense:     activeZoneKey exists AND backed_count < total_domains
    └── investigation: any block has SEMANTIC_ONLY backing
    │
    ▼
escalationAvailable = true
    │
    user triggers handleEscalate()
    │
    ▼
piRuntimeActive = true
    │
    ├── authority escalates to PI_INTERPRETIVE
    ├── INTERROGATION_EXPANSION_REGISTRY[mode](fullReport, activeZoneKey)
    │   generates context-specific deeper probes
    └── expansion queries rendered in SupportRail
```

### 2.4 Pipeline Activation (Governed)

```
OPERATOR initiates pipeline run
    │
    ▼
run_client_pipeline.py phases 0L→10L execute sequentially
    │
    ├── each phase: ChronicleEmitter.emit_phase_started()
    │               execute phase logic
    │               ChronicleEmitter.emit_phase_completed()
    │
    ├── at governance boundaries: ChronicleEmitter.freeze_checkpoint()
    │
    ├── on discovery: ChronicleEmitter.emit_hero_moment()
    │                 ChronicleEmitter.emit_learning_promotion()
    │
    ▼
Pipeline outputs → manifest → available for LENS resolution
```

---

## 3. ESCALATION CHOREOGRAPHY

### 3.1 Per-Persona Escalation Conditions

| Persona | Sentinel Condition | What It Detects | Escalation Target |
|---------|-------------------|-----------------|-------------------|
| BOARDROOM | posture = INVESTIGATE/ESCALATE OR ≥ 2 critical signals | Executive-level tension requiring deeper structural examination | PI_INTERPRETIVE queries via expansion registry |
| BALANCED | advisoryRatio > 0.3 AND ≥ 2 activated signals | Emergence patterns suggesting structural stress beyond narrative surface | PI_INTERPRETIVE queries via expansion registry |
| EXECUTIVE_DENSE | activeZoneKey exists AND backed < total domains | Zone-specific structural gap between semantic claims and structural evidence | PI_INTERPRETIVE queries via expansion registry |
| INVESTIGATION | any block with SEMANTIC_ONLY backing | Evidence verification revealing ungrounded structural claims | PI_INTERPRETIVE queries via expansion registry |

### 3.2 Authority Escalation Tiers

```
STRUCTURAL (default)
    │ no interpretation, pure structural display
    │
    ▼ emergence activates (BALANCED only)
INTERPRETIVE
    │ 75.x bounded interpretive authority
    │ evidence-synthesized narrative
    │
    ▼ escalation triggered (any persona)
PI_INTERPRETIVE
    │ full PI Runtime authority
    │ interrogation expansion queries
    │ guided structural probes
    │
    ─── CEILING: L3 (non-automatable boundary)
        no team behavior inference
        no organizational intent
        no human motive attribution
        no remediation prioritization
```

### 3.3 Escalation State Management

**Activation:** `handleEscalate()` sets `piRuntimeActive = true`, reports `PI_INTERPRETIVE` authority upward.

**Deactivation:** Mode transition guard nulls escalation state when density class changes. Explicit deactivation not exposed — escalation persists within persona session.

**Query generation:** `INTERROGATION_EXPANSION_REGISTRY[mode](fullReport, activeZoneKey)` generates expansion queries specific to the current persona and zone context:
- BOARDROOM: 4 executive-level structural probes
- EXECUTIVE_BALANCED: 4 emergence-pattern probes
- EXECUTIVE_DENSE: 4 zone-specific structural expansions
- INVESTIGATION_DENSE: 4 forensic evidence queries

---

## 4. MEMORY INSERTION PROTOCOL

"Memory" in the PI runtime is the **spine** — the governed continuity substrate.

### 4.1 Spine Object Classes

| Class | Source | Insertion Point | Consumer |
|-------|--------|-----------------|----------|
| `semantic_propositions` | SPE derivation engine (Gate 2) | `semantic/spe/semantic_propositions.json` | Resolver → proposition corpus projection |
| `hero_moments` | Pipeline execution (ChronicleEmitter) | `spine/spine_objects.json` | GoverningNarrativeComposer → boardroom narrative |
| `evidence_objects` | Pipeline execution | `spine/spine_objects.json` | GoverningNarrativeComposer → narrative anchors |
| `replay_corridors` | Chronicle certification | `spine/spine_objects.json` | Chronicle traversal |
| `convergence_observations` | Governed stream artifact | `convergence/convergence_observations.json` | Resolver → convergence intelligence projection |
| `learning_events` | Pipeline + operator | `learning_events.jsonl` per run | Learning lifecycle → capability evolution |

### 4.2 Insertion Discipline

**Pipeline-inserted (automated):**
- `ChronicleEmitter.emit_hero_moment()` — discovery during pipeline phase, written to chronicle events and spine
- `ChronicleEmitter.emit_learning_promotion()` — learning observation captured during pipeline execution
- SPE `output_emitter.py` — semantic propositions derived from evidence

**Operator-inserted (governed, non-automatable):**
- Proposition review dispositions → `proposition_review_state.json`
- CEU reconciliation actions → `reconciliation_state.json`
- Promotion decisions → `promotion_state.json`
- Learning lifecycle transitions (PROPOSED → REVIEWED → PROMOTED)

**Stream-inserted (governed document production):**
- Convergence observations — authored during governed streams, not by pipeline
- Constitutional replay anchor — computed by `constitutional_replay_anchor.py`

### 4.3 Consumption by Resolver

The Payload Resolution Orchestrator (Agent 1) consumes spine objects through 7 governance projection functions:

| Projection Function | Spine Objects Consumed | Output Key |
|---------------------|----------------------|------------|
| `projectGovernanceLifecycle()` | promotion_state | `governance_lifecycle` |
| `projectPropositionCorpus()` | semantic_propositions, proposition_review_state, review_obligations | `proposition_corpus` |
| `projectEnrichmentIntelligence()` | enrichment_summary, debt_reassessment | `enrichment_intelligence` |
| `projectRevalidationIntelligence()` | revalidation_result | `revalidation_intelligence` |
| `projectConstitutionalAnchor()` | constitutional_replay_anchor | `constitutional_anchor` |
| `projectConvergenceIntelligence()` | convergence_observations | `convergence_intelligence` |
| `projectChronicleCertification()` | chronicle_certification | `chronicle_certification` |

### 4.4 Consumption by GoverningNarrativeComposer

```
spine_objects.hero_moments (filtered: !manufactured)
    │
    ▼
deriveNarrativeAnchors(heroMoments, structuralEnrichment)
    │
    ├── 1 anchor per hero moment: NA-<8char>
    │   sorted by SURPRISE_CLASS_PRIORITY:
    │   CENTRALITY(0) > TOPOLOGY(1) > COUPLING(2) > EMERGENCE(3)
    │
    ├── synthetic NA-DUAL-AUTH anchor if dual_authority enrichment present
    │
    ▼
deterministicBoundedProvider(compositionInput)
    │
    ├── OPENING paragraph (always: system scale)
    ├── REVELATION paragraph (conditional: centrality anchors or dual authority)
    ├── DEPTH paragraph (conditional: coupling anchors)
    ├── AUTHORITY paragraph (conditional: top_spines)
    └── QUALIFICATION paragraph (always: S-state, gate status)
    │
    ▼
governed_narrative = { paragraphs, proof_graph, composition_provenance }
    method: DETERMINISTIC_BOUNDED
    replay_tier: EXACT
```

---

## 5. TRAVERSAL ROUTING GRAPH

Traversal routing defines how the audience moves through cognitive depth layers at runtime.

### 5.1 Persona-Level Routing (Lateral)

```
                          PERSONA DISPATCH
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
         BOARDROOM        BALANCED         DENSE/INVESTIGATION
     compiled projection  emergence      zone-navigated / sequential
              │                │                │
              │                │                │
              ▼                ▼                ▼
    BoardroomDecision    BalancedConsequence   DenseTopology /
    Surface              Field                InvestigationTrace
                                              Field
```

**Transition mechanism:** `densityClass` state change triggers `RepresentationField` re-dispatch. All four personas receive the SAME `fullReport` — they differ in what they project and how.

**Cross-persona zone targeting:** `pendingTransitionZone` effect enables zone targeting across persona transitions with scroll-to behavior.

### 5.2 Depth Traversal (Vertical — Cognitive Descent/Ascent)

```
Z1  EXECUTIVE UNDERSTANDING
    narrative prose, governed findings
    ────────────────────────────────────
Z2  SEMANTIC INTERPRETATION
    emerged narratives, disposition summaries
    ────────────────────────────────────
Z3  GOVERNANCE DETAIL
    governance events, arbitration, review
    ────────────────────────────────────
Z4  STRUCTURAL PROOF
    spine refs, revalidation checks, evidence anchors
    ────────────────────────────────────
Z5  RAW EVIDENCE
    intake files, substrate artifacts
```

**How depth is achieved per persona:**

| Persona | Z1 | Z2 | Z3 | Z4 | Z5 |
|---------|----|----|----|----|-----|
| BOARDROOM | governed_narrative paragraphs, tension summary | qualification posture, domain coverage | governance legitimacy sections | proof_graph (hero moments, evidence objects) | *not surfaced (executive altitude)* |
| BALANCED | PRIMARY emergence narrative | SECONDARY/TERTIARY emergence narratives | governance posture narrative | evidence chains per narrative | structural basis declarations |
| DENSE | zone interpretation panel | zone-specific query answers | *via escalation to PI Runtime* | zone structural metrics | evidence blocks per domain |
| INVESTIGATION | evidence block summaries | backing classification (STRUCTURAL/SEMANTIC_ONLY) | *not applicable (evidence regime)* | full structural backing detail | raw evidence artifacts |

### 5.3 Zone-Specific Depth (DENSE Persona)

```
activeZoneKey (scroll-detected or pinned)
    │
    ▼
DENSE_ZONE_PATHS[activeZoneKey]
    │
    ├── path[0]: primary structural query
    ├── path[1]: secondary structural query
    ├── path[2]: relationship query
    └── path[3]: depth query
    │
    user selects query → added to exploredQueries Set
    │
    ▼
GUIDED_QUERY_ANSWERS[queryKey]
    │
    deterministic answer derived from fullReport
    │
    ▼
exploredQueries accumulate → evidence trail builds
    │
    handleTrailExport() → buildTrailHTML()
    │
    ▼
Self-contained HTML evidence record (InterrogationTrailBuilder)
    6 sections: posture, confidence envelope, topology,
                posture path, governance boundary, evidence review
```

---

## 6. CONTINUITY MUTATION PROTOCOL

Continuity mutation defines how the governed substrate evolves over time through pipeline execution, operator action, and enrichment.

### 6.1 Pipeline Continuity (Automated)

```
Pipeline Phase N completes
    │
    ▼
ChronicleEmitter.emit_phase_completed(phase_id, results)
    │
    ├── Appends to chronicle_events.jsonl (immutable append-only log)
    ├── Updates CHRONICLE_MANIFEST.json (phase status)
    │
    ├── if governance boundary:
    │   ChronicleEmitter.freeze_checkpoint(checkpoint_id, state_snapshot)
    │   └── writes checkpoints/checkpoint_NN.json (frozen state)
    │
    ├── if hero moment discovered:
    │   ChronicleEmitter.emit_hero_moment(moment)
    │   └── inserted into spine_objects.json under hero_moments
    │
    └── if learning observation:
        ChronicleEmitter.emit_learning_promotion(event)
        └── appended to learning_events.jsonl
```

### 6.2 Operator Continuity (Governed, Non-Automatable)

```
OPERATOR ACTION
    │
    ├── CEU Reconciliation: confirm/reject/merge/complete
    │   └── mutates reconciliation_state.json
    │       appends to reconciliation_event_log.jsonl
    │       on complete: sets promotion_gate.semantic_derivation_eligible = True
    │
    ├── Proposition Review: accept/reject/contest/arbitrate/complete
    │   └── mutates proposition_review_state.json
    │       appends to proposition_review_event_log.jsonl
    │       on complete: emits review_obligations.json
    │
    ├── Promotion: advance/hold/block
    │   └── mutates promotion_state.json
    │       appends to promotion_event_log.jsonl
    │       invokes constitutional_replay_anchor.py inline
    │       on advance: sets qualification_provenance = GOVERNED_LIFECYCLE
    │
    └── Learning: review/promote/activate
        └── mutates learning_events.jsonl
            state machine: OBSERVED → PROPOSED → REVIEWED → PROMOTED → CONSUMABLE
```

### 6.3 Enrichment Continuity

```
S1 achieved
    │
    ▼
evidence_enrichment (rc04 / PATH B)
    │
    ├── MUTATES IN PLACE: semantic_propositions.json
    │   (confidence adjustments, component count corrections)
    │
    ├── CREATES: enrichment_log.json (domain + capability corrections)
    ├── CREATES: enrichment_activity_event.json (enrichment_exercised = true)
    ├── CREATES: debt_reassessment.json (blocker impact classification)
    └── CREATES: enrichment_summary.json (aggregate statistics)
    │
    ▼
Debt evolution classified per blocker:
    IMPROVED | WORSENED | NOT_AFFECTED | CONFIRMED_STABLE | CONFIRMED_IRREDUCIBLE
```

### 6.4 Immutability Rules

- `chronicle_events.jsonl` — APPEND-ONLY. No event deletion or modification.
- `*_event_log.jsonl` — APPEND-ONLY. All operator actions permanently recorded.
- `checkpoints/*.json` — FROZEN at creation. No post-hoc modification.
- `promotion_lineage` in promotion_state.json — accumulates transitions, never removes.
- `spine_objects.json` hero_moments — filtered at consumption (`!manufactured`), not at storage.

---

## 7. QUALIFICATION MUTATION GRAPH

### 7.1 State Vocabulary

**Proposition dispositions:** `CANDIDATE` → `ACCEPTED` | `REJECTED` | `CONTESTED` → `ARBITRATED`
**Stage states:** `NOT_STARTED` | `IN_PROGRESS` | `COMPLETE` | `BLOCKED` | `DEFERRED`
**Promotion states:** `S0` → `S1` → `S2` (→ `S3` not yet issued)
**Revalidation verdicts:** `PASS` | `PARTIAL` | `FAIL`
**Anchor verdicts:** `CONSTITUTIONAL_DISTANCE_NOMINAL` | `_ELEVATED` | `_CRITICAL`

### 7.2 S0→S1 Gate Sequence

```
GATE 1: CEU RECONCILIATION
    materializer: ceu_reconciliation_seeder.py (seed)
                  ceu_reconciliation_action.py (operator)
    reads: candidate_registry.json, evidence_anchors.json
    writes: reconciliation_state.json, reconciliation_obligations.json
    operator actions: confirm, reject, merge, complete
    exit: reconciliation_status = COMPLETE
    unlocks: semantic_derivation_eligible = True
        │
        ▼
GATE 2: PROPOSITION DERIVATION
    materializer: semantic_proposition_engine.py (PATH A)
                  sdc/proposition_bridge.py (PATH B)
    reads: reconciliation_state (COMPLETE), candidate_registry,
           evidence_anchors, structural_centrality, code_graph,
           canonical_topology, spine_objects
    writes: semantic_propositions.json, spe_derivation_report.json,
            proposition_review_queue.json
    exit: propositions derived (automated, no operator gate)
        │
        ▼
GATE 3: PROPOSITION REVIEW
    materializer: proposition_review_action.py
    reads: semantic_propositions.json, review_queue.json
    writes: proposition_review_state.json, review_event_log.jsonl,
            review_obligations.json (on complete)
    operator actions: accept, reject, contest, arbitrate,
                      accept-unflagged, complete
    exit: all dispositions terminal, status = COMPLETE
        │
        ▼
GATE 4: REVALIDATION
    materializer: revalidation_engine.py (PATH A, 8-phase/25-check)
                  sdc/revalidation_rc05.py (PATH B, 9-phase/48-check)
    reads: proposition_review_state (COMPLETE), reconciliation_state,
           semantic_propositions, spine_objects, promotion_state
    writes: revalidation_result.json, revalidation_event_log.jsonl
    exit: verdict = PASS (automated, deterministic)
        │
        ▼
GATE 5: PROMOTION S1
    materializer: promotion_action.py
    reads: promotion_state.json, revalidation_result (PASS),
           proposition_review_state (COMPLETE)
    writes: promotion_state.json, promotion_event_log.jsonl,
            constitutional_replay_anchor.json (inline)
    operator actions: advance, hold, block
    guards: revalidation PASS, review COMPLETE,
            constitutional anchor not blocking
    exit: s_level = S1, qualification_provenance = GOVERNED_LIFECYCLE
```

### 7.3 S1→S2 Gate Sequence

```
ENRICHMENT PLANNING
    materializer: null (gap — no standalone script)
        │
        ▼
EVIDENCE ENRICHMENT
    materializer: sdc/evidence_enrichment_rc04.py (PATH B)
                  null (PATH A — gap)
    reads: semantic_propositions, proposition_review_state,
           SDC derivation_report, client_semantic_registry,
           qualification_blockers
    writes: semantic_propositions.json (mutated in place),
            enrichment_log.json, enrichment_activity_event.json,
            debt_reassessment.json, enrichment_summary.json
        │
        ▼
DEBT REASSESSMENT
    embedded in evidence_enrichment_rc04.py (not standalone)
    classifies: IMPROVED | WORSENED | NOT_AFFECTED |
                CONFIRMED_STABLE | CONFIRMED_IRREDUCIBLE
        │
        ▼
ENRICHED PROPOSITION UPDATE
    embedded in evidence_enrichment_rc04.py (not standalone)
        │
        ▼
GATE 4: REVALIDATION (post-enrichment)
    same materializer as S0→S1 Gate 4
        │
        ▼
CONSTITUTIONAL ANCHOR RECHECK
    materializer: constitutional_replay_anchor.py
    8 dimensions assessed against reference specimen:
    │
    │  D1: proposition_count (≥ 20% of reference) — CRITICAL
    │  D2: class_diversity (≥ 33% of reference) — CRITICAL
    │  D3: review_obligations (≥ 1) — CRITICAL(S2) / HIGH(S1)
    │  D4: governance_friction (≥ 1 friction event) — CRITICAL(S2) / HIGH(S1)
    │  D5: confidence_distribution (variance > 0.05) — HIGH
    │  D6: tier_diversity (≥ 50% of reference) — HIGH
    │  D7: governance_event_density (≥ 20% of reference) — MEDIUM
    │  D8: enrichment_activity (present) — CRITICAL(S2) / MEDIUM(S1)
    │
    blocking logic:
    │  any CRITICAL FAIL → BLOCKED (CONSTITUTIONAL_DISTANCE_TOO_HIGH)
    │  2+ HIGH FAIL → BLOCKED (CONSTITUTIONAL_DISTANCE_HIGH)
    │  1 HIGH FAIL → NOT BLOCKED (operator override, ELEVATED)
    │  otherwise → NOT BLOCKED (ACCEPTABLE)
        │
        ▼
GATE 5: PROMOTION S2
    same materializer as S0→S1 Gate 5
    additional guard: L5 authority_level required
    additional guard: enrichment_exercised must be true
    exit: s_level = S2
```

### 7.4 Materializer Gap Inventory

| Stage | Status | Note |
|-------|--------|------|
| Enrichment planning | NULL | No standalone materializer |
| Debt reassessment (standalone) | EMBEDDED | Currently inside evidence_enrichment_rc04.py |
| Enriched proposition update (standalone) | EMBEDDED | Currently inside evidence_enrichment_rc04.py |
| PATH A enrichment materializer | NULL | Does not exist |
| Convergence observation materializer | NULL | Manually authored during governed streams |

---

## 8. ENRICHMENT ARBITRATION

### 8.1 How the System Decides What to Enrich

Enrichment is NOT autonomous. The system does not decide to enrich — it IDENTIFIES what CAN be enriched, and the operator decides whether to proceed.

**Enrichment eligibility signals:**

| Signal | Source | What it indicates |
|--------|--------|-------------------|
| Proposition at ACCEPTED with confidence < 0.7 | proposition_review_state | Accepted but weakly evidenced — enrichment could strengthen |
| DERIVED tier propositions | semantic_propositions | Cross-document inference — enrichment could provide direct evidence |
| `qualification_blockers` with `enrichment_eligible = true` | qualification_blockers.json | Known blockers that evidence enrichment could resolve |
| `semantic_only_count > 0` in topology summary | resolver derivation | Semantic claims without structural backing — enrichment target |
| `debt_category = REDUCIBLE_BY_EVIDENCE` | debt assessment | Debt items that could be reduced by additional evidence |

### 8.2 Enrichment Execution (PATH B — Operational)

```
evidence_enrichment_rc04.py
    │
    ├── enrich_domain_propositions():
    │   for each DOMAIN_EVIDENCE_GROUNDING proposition at ACCEPTED:
    │     match domain name against SDC derivation_report domains
    │     if MATCH:
    │       correct component_count from SDC
    │       adjust confidence ±0.05 based on delta
    │       record DOMAIN_COMPONENT_CORRECTION
    │     if NO_MATCH:
    │       cap confidence at 0.50
    │       record NO_SDC_MATCH
    │
    ├── enrich_capability_propositions():
    │   for each CAPABILITY_EVIDENCE proposition at ACCEPTED:
    │     correct domain_refs from SDC IDs to canonical IDs
    │     record CAPABILITY_DOMAIN_CORRECTION
    │
    └── assess_debt_evolution():
        for each qualification_blocker:
          classify enrichment impact:
            IMPROVED — evidence strengthened this area
            WORSENED — enrichment revealed additional weakness
            NOT_AFFECTED — blocker outside enrichment scope
            CONFIRMED_STABLE — enrichment confirmed existing state
            CONFIRMED_IRREDUCIBLE — fundamental absence, not fixable by enrichment
```

### 8.3 Enrichment Architecture (PATH A — Gap)

PATH A enrichment via code graph authority topology is architecturally defined but not yet materialized:
- Evidence source: AST authority edges (1,494 edges in NetBox reference)
- Enrichment mechanism: code graph centrality → proposition confidence uplift
- Gap: No standalone `enrichment_engine.py` exists for PATH A
- Current status: `materializer: null` in execution graph for enrichment_planning, debt_reassessment, enriched_proposition_update stages

### 8.4 Post-Enrichment Verification

Enrichment does NOT self-validate. Verification is structurally separated:
1. Enrichment executes → mutates propositions, emits enrichment artifacts
2. Revalidation engine re-runs (Gate 4 post-enrichment) → deterministic check on enriched corpus
3. Constitutional anchor recheck → 8-dimensional assessment including D8 (enrichment_activity)
4. Operator reviews revalidation + anchor → decides promotion

The system CANNOT self-advance. Enrichment → Revalidation → Anchor → Operator is the mandatory sequence.

---

## 9. CROSS-AGENT COORDINATION MAP

### 9.1 Agent Dependencies

```
PIPELINE ORCHESTRATOR (Agent 5)
    produces: disk artifacts (topology, signals, spine, SQO state)
    │
    ▼
SQO GOVERNANCE ORCHESTRATOR (Agent 6)
    consumes: pipeline outputs
    produces: governed state transitions (propositions, review, promotion)
    │
    ├─── operator actions insert at Gates 1, 3, 5
    │
    ▼
PAYLOAD RESOLUTION ORCHESTRATOR (Agent 1)
    consumes: manifest + all artifacts (pipeline + SQO)
    produces: ~50-field canonical payload
    │
    ▼
PERSONA DISPATCH ORCHESTRATOR (Agent 2)
    consumes: canonical payload
    routes to: persona renderers
    │
    ├── BALANCED route → EMERGENCE ENGINE (Agent 3)
    │                     consumes: fullReport
    │                     produces: emerged narratives, authority state
    │
    └── DENSE route → ZONE TRACKER (Agent 4)
                      consumes: DOM scroll position
                      produces: activeZoneKey, query availability
```

### 9.2 Shared State

| State Object | Written By | Read By |
|-------------|-----------|---------|
| `fullReport` (canonical payload) | Agent 1 | Agents 2, 3, 4 (all downstream) |
| `emergenceState` | Agent 3 | Agent 2 (ExecutiveInterpretation, SupportRail) |
| `activeZoneKey` | Agent 4 | Agent 2 (SupportRail queries, ExecutiveInterpretation zone panel) |
| `piRuntimeActive` | Agent 2 (handleEscalate) | Agent 2 (expansion query rendering) |
| `exploredQueries` | Agent 2 (handleQuerySelect) | Agent 2 (SupportRail indicators, trail export) |
| `spine_objects.json` | Agent 5 (pipeline), Agent 6 (SQO gates) | Agent 1 (resolver consumption) |
| `promotion_state.json` | Agent 6 (promotion action) | Agent 1 (governance lifecycle projection) |

### 9.3 Non-Automatable Boundaries

```
┌─────────────────────────────────────────────────────┐
│ AUTOMATED                                           │
│                                                     │
│  Pipeline phases 0L–10L                             │
│  SDC / SPE proposition derivation                   │
│  Revalidation (deterministic)                       │
│  Constitutional anchor computation                  │
│  Emergence narrative derivation                     │
│  Zone tracking                                      │
│  Payload resolution                                 │
│  Persona dispatch                                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ OPERATOR-REQUIRED (non-automatable)                 │
│                                                     │
│  CEU reconciliation actions (G1)                    │
│  Proposition review dispositions (G3)               │
│  Promotion decisions (G5)                           │
│  Learning lifecycle transitions                     │
│  Convergence observation authoring                  │
│  PI Runtime escalation trigger (user action)        │
│  Persona transition (user action)                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ AUTHORITY CEILING: L3                               │
│                                                     │
│  All AI-derived propositions capped at L3           │
│  L5 required for S2 promotion                       │
│  13 interpretive prohibitions enforced              │
│  75.x bounded interpretive authority on narratives  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 10. ARCHITECTURAL OBSERVATIONS

### 10.1 Orchestration Model per Agent

| Agent | Orchestration Model | Authority Model |
|-------|-------------------|-----------------|
| Payload Resolution | Sequential pipeline (deterministic) | Structural derivation (no interpretation) |
| Persona Dispatch | State-driven routing (reactive) | Projection routing (no content authority) |
| Emergence Engine | Threshold-gated parallel evaluation | Bounded interpretive (75.x) |
| Zone Tracker | Scroll-driven continuous tracking | Structural navigation (no interpretation) |
| Pipeline Execution | Sequential phase chain with checkpoint | Structural production (substrate authority) |
| SQO Governance | Gate-sequential with operator boundaries | Governed lifecycle (authority escalation per gate) |

### 10.2 Stratum Distribution Across Agents

| Agent | PI Core | Agentic Orchestration | Governed Replay | SQO Operational | Domain Module |
|-------|---------|----------------------|-----------------|-----------------|---------------|
| Payload Resolution | ██████ | ░ | ░ | ░ | ░ |
| Persona Dispatch | ░ | ██████ | ░ | ░ | ░ |
| Emergence Engine | ░ | ██████ | ░ | ░ | ░ |
| Zone Tracker | ░ | ██████ | ░ | ░ | ░ |
| Pipeline Execution | ██████ | ░ | ██ | ░ | ██ |
| SQO Governance | ░ | ░ | ██ | ██████ | ░ |

### 10.3 Inverse Correlation Confirmation (Stratum Pivot Law)

The agents confirm the Stratum Pivot Law observed in persona forensics:
- Agents 2, 3, 4 (agentic orchestration dominant) have ZERO governed replay or SQO operational presence.
- Agent 6 (SQO governance dominant) has ZERO agentic orchestration presence.
- Agent 1 (PI Core dominant) and Agent 5 (PI Core + Domain Module) are the structural foundation that BOTH agentic and governance agents consume from — but neither agentic nor governance agents share stratum weight.

### 10.4 Gaps Identified

| Gap | Severity | Current Mitigation |
|-----|----------|-------------------|
| PATH A enrichment materializer | HIGH | No code graph enrichment pipeline exists |
| Enrichment planning materializer | MEDIUM | Implicit in evidence_enrichment script |
| Standalone debt reassessment | LOW | Embedded in evidence_enrichment (functional, not modular) |
| Standalone enriched proposition update | LOW | Embedded in evidence_enrichment (functional, not modular) |
| Convergence observation materializer | LOW | Manually authored (appropriate for DESCRIPTIVE maturity) |
| Cross-agent state contract | MEDIUM | Shared state is implicit (payload shape, not formal contract) |
| Agent lifecycle coordination | MEDIUM | No formal agent startup/shutdown protocol; reactive to component mount/unmount |

---

*Document produced as part of PI.GENESIS.LENS-COGNITION-ENRICHMENT.01*
*Classification: FORENSIC / CONSTITUTIONAL / NON-IMPLEMENTATION*
*All entries trace to operational code or governed pipeline scripts*
