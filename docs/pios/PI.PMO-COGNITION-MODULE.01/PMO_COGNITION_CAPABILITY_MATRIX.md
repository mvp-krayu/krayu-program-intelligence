# PMO Cognition Module — Constitutional Capability Matrix

> **Stream:** PI.PMO-COGNITION-MODULE.01
> **Classification:** G2 — Architecture-Consuming
> **Branch:** feature/runtime-demo
> **Date:** 2026-06-03
> **Evidence base:** Forensic inventory of PI Core (93 governance mechanisms cataloged, trajectory capabilities mapped)
> **Predecessor:** PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01 (module pattern contract)

---

## Purpose

Map every PMO-relevant cognition capability to its current implementation state in PI Core. Determine what PMO Cognition can be built immediately from existing assets, what requires new evidence substrates, and the shortest path to a commercial PMO module.

---

## QUESTION 1 — Governance Cognition Capabilities Already Inside PI Core

Forensic inventory identified 93 governance reasoning mechanisms across 7 files. Organized below by the 7 governance vectors, with implementation evidence.

### Vector 1 — Altitude Translation (22 mechanisms, EXISTS)

The system already translates the same structural truth to different executive levels.

| Capability | Location | Evidence | Status |
|---|---|---|---|
| 8 persona projection contracts with decision horizon, altitude, access tier | PIContextAssembler.js:116-243 | Board=executive, CTO=operational, Architect=structural, Investor=executive/financial, PE=strategic/due-diligence | **EXISTS** |
| Three-layer consequence vocabulary (structural → operator → operational) | ConsequenceCompiler.js:16-83 | 11 consequence types, each with structural label, operator title, operational implication | **EXISTS** |
| 6-layer ontology explanation model | CognitionOntology.js:14-525 | human_name, what_it_means, why_it_matters, operational_implication, how_detected, what_to_look_for | **EXISTS** |
| 31-entry risk class combinatorics (A-E behavioral classification) | ConsequenceCompiler.js:660-692 | Every combination of 5 behavioral classes → natural language risk label | **EXISTS** |
| Boardroom narrative synthesis (1/2/3+ domain cases) | ConsequenceCompiler.js:717-759 | Generates executive-altitude narrative with containment statements | **EXISTS** |
| Posture label derivation | ConsequenceCompiler.js:762-768 | Translates consequence count + systemic presence → governed posture name | **EXISTS** |
| Confidence executive translation | ConsequenceCompiler.js:652-656 | GOVERNED/ADVISORY_BOUND/STRUCTURAL_ONLY → human-readable labels | **EXISTS** |
| Condition-to-signal role translation | SignalSynthesisEngine.js:397-461 | Raw centrality → "Data Contract Surface — schema chokepoint" | **EXISTS** |
| Three-layer condition vocabulary (internal/technical-semantic/operator-cognition) | SignalSynthesisEngine.js:4-101 | 12 condition types with L2 and L3 labels | **EXISTS** |

**PMO implication:** Altitude translation is the most mature governance capability. PMO Module can project the same structural findings to Program Director altitude, RTE altitude, Portfolio Manager altitude, and Steering Committee altitude without building altitude translation from scratch. Requires new persona projection contracts in PIContextAssembler.js — minimal effort.

### Vector 2 — Authority Routing (24 mechanisms, EXISTS)

The system already determines what information reaches which audience and through which path.

| Capability | Location | Evidence | Status |
|---|---|---|---|
| Three-tier access control (CLIENT/OPERATOR/ENGINEER) | PIContextAssembler.js:110-114 | Board/Investor/PE=CLIENT, PD/RTE/ED/CTO/Architect=OPERATOR | **EXISTS** |
| Context level gating (L0/L1/L2/L3) | PIKnowledgeGraphAccess.js:313-321 | Progressive domain unlocking as evidence matures | **EXISTS** |
| Mode governance (9 modes with temperature, min context level, topic injection) | ModeOrchestrator.js:14-83 | Challenge requires L1+, Package requires L2+, Position injects commercial topics | **EXISTS** |
| Topic-to-document routing (16 topics → governed vault/artifact files) | topic-router.js:14-123 | Intent keyword classification → specific document loading | **EXISTS** |
| Module activation gating (teaser/full compilation) | ConsequenceCompiler.js:583-598 | Verdict exists computationally, surfaced only when SW-Intel module activated | **EXISTS** |
| Persona-to-evidence routing | PIContextAssembler.js:116-243 | Each persona specifies default evidence to surface and evidence to avoid | **EXISTS** |
| Capability context gating by access tier | PIContextAssembler.js:368-370 | PI capability map = null for CLIENT tier | **EXISTS** |
| Defining/conditional flag on consequences | ConsequenceCompiler.js:210-331 | Determines which consequence is the headline for a locus | **EXISTS** |
| Guided interventions per condition | SignalSynthesisEngine.js:114-166 | INSPECT, TRACE, COMPARE, QUALIFY, DECOMPOSE — operator action routing | **EXISTS** |
| Visible_in persona filtering | CognitionOntology.js:14-260 | GOVERNANCE_COVERAGE_STATUS visible only in DENSE/OPERATOR, not BOARDROOM | **EXISTS** |

**PMO implication:** Authority routing is fully operational. PMO Module needs: (a) new access tier assignments for PMO personas (Program Director=OPERATOR already exists), (b) new topic routes for PMO-specific knowledge documents, (c) module activation gate for PMO (same pattern as SW-Intel teaser/full). All extension, no invention.

### Vector 3 — Escalation Boundaries (16 mechanisms, EXISTS)

The system already determines when findings escalate in severity, scope, or urgency.

| Capability | Location | Evidence | Status |
|---|---|---|---|
| Severity escalation ladder (NOMINAL→LOW→MODERATE→ELEVATED→HIGH→CRITICAL) | ConsequenceCompiler.js:6-9 | One-step escalation rule | **EXISTS** |
| Multi-factor cross-evidence gates | ConsequenceCompiler.js:227-229 | Hub in-degree > 20 AND severity >= HIGH required for OP_BOTTLENECK | **EXISTS** |
| Signal volume escalation | ConsequenceCompiler.js:215-218 | >= 3 supporting signals → additional consequence emission | **EXISTS** |
| Combination detection (3 named patterns) | ConsequenceCompiler.js:374-502 | AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL, SYSTEMIC_OP_FRAG | **EXISTS** |
| Systemic fragility threshold | ConsequenceCompiler.js:495-498 | >= 3 atomics from >= 3 distinct types → CRITICAL escalation | **EXISTS** |
| NOMINAL suppression | ConsequenceCompiler.js:529-580 | Sub-threshold conditions filtered before verdict | **EXISTS** |
| Compound convergence rule | SignalSynthesisEngine.js:1260-1320 | 3+ primitive conditions converging → severity escalation | **EXISTS** |
| Mode minimum level gates | ModeOrchestrator.js:55-66 | Challenge requires specimen, Package requires verdict | **EXISTS** |

**PMO implication:** Escalation boundaries are the mechanism that would power PMO alerts. "Execution ceiling emerging" is an escalation boundary crossed — multiple conditions converging on the same program region. The existing escalation engine can be reused. PMO-specific escalation rules (e.g., "3+ ARTs routing through same structural bottleneck") would be new rules in the existing engine, not a new engine.

### Vector 4 — Confidence Governance (19 mechanisms, EXISTS)

The system already qualifies findings with evidence confidence, propagates uncertainty, and prevents overclaim.

| Capability | Location | Evidence | Status |
|---|---|---|---|
| Three-tier confidence hierarchy (GOVERNED > ADVISORY_BOUND > STRUCTURAL_ONLY) | ConsequenceCompiler.js:11 | Authority classification for findings | **EXISTS** |
| Confidence floor propagation in merges | ConsequenceCompiler.js:99-104 | minConfidence() — merged findings degrade to weakest evidence class | **EXISTS** |
| Per-condition governance boundary | SignalSynthesisEngine.js:4-101 | Each condition carries its own governance requirement | **EXISTS** |
| Mixed-evidence confidence degradation | SignalSynthesisEngine.js:1300 | Composite degrades to ADVISORY_BOUND if any component is STRUCTURAL_ONLY | **EXISTS** |
| Context honesty validation | ProhibitionValidator.js:114-123 | Detects claims about data at context levels that don't support them | **EXISTS** |
| Index file qualification | PIContextAssembler.js:341-342 | INDEX_FILE_UNCLASSIFIED forces explicit finding qualification | **EXISTS** |
| Confidence suffix injection in narrative | ConsequenceCompiler.js:806-812 | "Advisory-bound — evidence classes are mixed" appended to synthesis | **EXISTS** |
| Confidence executive translation | ConsequenceCompiler.js:652-656 | Internal codes → human-readable labels per altitude | **EXISTS** |

**PMO implication:** This is the **critical commercial differentiator for PMO**. The same confidence governance that produces "Advisory-bound — structural reconciliation incomplete" for code evidence can produce "Advisory-bound — planning evidence incomplete" for Jira evidence. The mechanism exists. The evidence substrate changes. The governance discipline is identical. Planning Evidence Qualification becomes: apply confidence governance to planning graph completeness, dependency declaration density, initiative-to-epic coverage. Same engine, different inputs.

### Vector 5 — Consequence Framing (14 mechanisms, EXISTS)

The system already translates structural conditions into business consequences.

| Capability | Location | Evidence | Status |
|---|---|---|---|
| 11 consequence types with three-layer vocabulary | ConsequenceCompiler.js:16-83 | DEL_CEILING, OP_BOTTLENECK, PROP_RISK, STAB_RISK, RESIL_DEF, etc. | **EXISTS** |
| Domain risk profile derivation (shape taxonomy) | ConsequenceCompiler.js:694-715 | gravity_well, fragile_concentrated, coupled_stressed, etc. | **EXISTS** |
| Risk class behavioral classification (A-E) | CognitionOntology.js:676-687 | Flow & Propagation, Concentration & Saturation, Fragility & Resilience, Reinforcement & Accumulation, Drift & Instability | **EXISTS** |
| Relationship verb computation | ConsequenceCompiler.js:895-928 | amplifies, reinforces, widens, concentrates, converges with | **EXISTS** |
| Combination explanation derivation | ConsequenceCompiler.js:907-917 | "Coordination fragility compounded by dependency concentration" | **EXISTS** |
| Exposure widening detection | ConsequenceCompiler.js:961-975 | Detects when consequences spread beyond primary locus | **EXISTS** |

**PMO implication:** Consequence framing is what transforms "coupling score = 5.66" into "Five independent conditions converge on Platform Infrastructure creating a delivery ceiling." PMO Module consumes these framed consequences and translates them into program-level implications: "Platform Enablement ART owns 42% of cross-program dependencies — execution corridor saturated." The framing engine exists. PMO adds a program-level translation layer.

### Vector 6 — Temporal Awareness (1 mechanism, ABSENT)

| Capability | Location | Evidence | Status |
|---|---|---|---|
| Exposure widening detection (spatial, not temporal) | ConsequenceCompiler.js:961-975 | Only spatial trajectory reasoning | **PARTIAL** |
| temporal_marker field on every consequence | ConsequenceCompiler.js:201,454 | Field exists, universally null | **ABSENT** — infrastructure designed, never activated |
| EXSIG/TIMSIG signal families | Multiple files | Vocabulary defined, zero producers | **ABSENT** |
| Multi-run structural comparison | — | Does not exist for structural intelligence domain | **ABSENT** |

**PMO implication:** This is the genuine gap. PMO cannot answer "What is getting worse?" or "What will be a problem next PI?" without temporal evidence. See Question 2.

### Vector 7 — Containment Discipline (26 mechanisms, EXISTS)

| Capability | Location | Evidence | Status |
|---|---|---|---|
| 12 absolute prohibitions with pattern enforcement | ProhibitionValidator.js:15-112 | Team behavior, org intent, human motive, remediation, ranked actions, etc. | **EXISTS** |
| Context honesty enforcement | ProhibitionValidator.js:144-174 | Level-aware claim validation | **EXISTS** |
| Knowledge boundary enforcement (CLIENT/OPERATOR tiers) | PIContextAssembler.js:277-303 | 7 explicit prohibitions per tier | **EXISTS** |
| Context stripping | PIKnowledgeGraphAccess.js:62-79 | Raw internals removed before context assembly | **EXISTS** |
| Evidence capping | PIKnowledgeGraphAccess.js:236-286 | Max 10 items per condensation type | **EXISTS** |
| Temperature governance | ModeOrchestrator.js:14-83 | 0.0 for factual modes, 0.1-0.2 for interpretive | **EXISTS** |
| Safe defaults | topic-router.js:144-161 | Unknown intent → pi-identity (safe fallback) | **EXISTS** |

**PMO implication:** Containment discipline prevents the PMO Module from prescribing ("you should"), attributing to humans, or claiming beyond evidence. Same prohibitions apply. PMO-specific containment rules may add: "Do not project PI Planning outcomes," "Do not recommend headcount changes," "Do not characterize team performance."

### Governance Cognition Summary

| Vector | Mechanism Count | Status |
|---|---|---|
| Altitude Translation | 22 | **EXISTS** |
| Authority Routing | 24 | **EXISTS** |
| Escalation Boundaries | 16 | **EXISTS** |
| Confidence Governance | 19 | **EXISTS** |
| Consequence Framing | 14 | **EXISTS** |
| Temporal Awareness | 1 | **ABSENT** |
| Containment Discipline | 26 | **ABSENT for PMO-specific prohibitions** |
| **Total** | **122** | **6/7 vectors operational** |

**Conclusion:** Governance Cognition is a naming and formalization exercise, not a greenfield build. 122 mechanisms across 6 of 7 vectors. The missing vector is temporal awareness.

---

## QUESTION 2 — Trajectory Cognition: What Requires New Evidence Substrates

### What exists today (not trajectory)

| Asset | Location | Classification | Why NOT trajectory |
|---|---|---|---|
| trajectoryAssessment.js materializer | lib/lens-v2/cognition/materializers/ | **PSEUDO-TEMPORAL** | Uses trajectory language but reasons from static structural properties. "WORSENING" is a property of the pattern type (e.g., STRUCT_GRAVITY_WELL → "mass accumulation is self-reinforcing"), not a measured temporal delta. PID-006 pattern. |
| Class E "Drift" vocabulary | ConsequenceCompiler.js:665-691, CognitionOntology.js:686 | **PSEUDO-TEMPORAL** | Boundary divergence between declared and actual dependency structure. Describes a structural gap, not a measured change over time. |
| temporal_marker field | ConsequenceCompiler.js:201,454 | **STRUCTURAL PREREQUISITE** | Field exists on every consequence object but is universally null. Infrastructure was designed, not activated. |
| EXSIG/TIMSIG signal family vocabulary | GovernanceGuard.js, AdapterErrorTaxonomy.js | **STRUCTURAL PREREQUISITE** | Recognized as signal families alongside DPSIG/ISIG/PSIG. Zero producers. Zero consumers. |

### What exists today (real temporal, wrong domain)

| Asset | Location | Classification | Reusability |
|---|---|---|---|
| ReconciliationTemporalAnalyticsCompiler.js | lib/lens-v2/sqo/ | **REAL TEMPORAL** | Computes trend classification (IMPROVING/STABLE/DEGRADING), enrichment effectiveness, debt reduction, degradation detection. Operates on semantic domain confidence across enrichment epochs. **Architecture pattern is proven and reusable.** |
| ReconciliationLifecycleCompiler.js | lib/lens-v2/reconciliation/ | **REAL TEMPORAL** | Computes per-domain deltas, weighted confidence trajectory, unresolved trajectory. Multi-epoch lifecycle compilation. **Delta computation pattern reusable.** |
| QualificationHistory.js | lib/lens-v2/sqo/ | **REAL TEMPORAL** | Append-only ledger of S-state transitions with transition type classification. **Ledger pattern reusable.** |
| compare_replay_runs.py | scripts/pios/psee_handoff/ | **STRUCTURAL PREREQUISITE** | Diffs two run artifacts. Identifies IDENTICAL/DIVERGED/ADDED/REMOVED. **Diff infrastructure reusable.** |

### What is genuinely absent

| Capability | Missing Evidence | Required Producer | Required Storage |
|---|---|---|---|
| **Multi-run condition comparison** | Which conditions were active in run N-1 vs run N | Condition delta tracker using stable condition IDs (dpc-*, dck-*, etc.) | Per-run condition inventory with stable keys |
| **Multi-run consequence comparison** | Which consequences existed in prior run | Consequence delta tracker | Per-run consequence inventory |
| **Multi-run pressure zone comparison** | Whether zones are growing, shrinking, or moving | Pressure zone evolution tracker | Per-run zone snapshots with stable zone IDs |
| **Multi-run signal delta** | signal_value(run_N) - signal_value(run_N-1) | Signal evolution producer → EXSIG signal family | Per-run signal value snapshots |
| **Threshold proximity computation** | When a metric is approaching a severity boundary | Threshold scanner against severity ladder | Access to severity thresholds + current values |
| **Regime transition detection** | When overall posture classification shifts | Posture history comparator | Per-run posture snapshots |
| **Structural velocity measurement** | Rate of posture/condition change across runs | Velocity computation over condition/posture deltas | Minimum 3 sequential runs |

### Evidence substrate requirements

For real trajectory cognition, the pipeline needs:

1. **Run artifact persistence with stable identity keys.** Each run's conditions, consequences, signals, and pressure zones must be persisted with stable IDs so run N can be compared to run N-1. Pattern exists in SQO reconciliation (reconciliation_lifecycle.v1.json).

2. **EXSIG producers.** Scripts that compare current vs prior structural signals and emit evolution signals.

3. **TIMSIG producers.** Scripts that compute temporal metrics (velocity of posture change, acceleration of condition accumulation).

4. **Minimum 2 runs on same specimen** for comparison. Minimum 3 runs for velocity.

**PMO implication:** Trajectory Cognition cannot be faked. Without multi-run evidence, PMO Module cannot answer "What is getting worse?" — and it should not pretend to. The honest qualification is: "Trajectory analysis requires multi-run evidence. Current assessment is based on single-run structural truth. Future-state reasoning is not available." Same discipline as PI Core's advisory-bound qualifier.

---

## QUESTION 3 — Minimum Viable PMO Cognition Module (Without Changing PI Core)

### What "without changing PI Core" means

No modifications to:
- ConsequenceCompiler.js
- SignalSynthesisEngine.js
- CognitionOntology.js
- PIKnowledgeGraphAccess.js
- ProhibitionValidator.js

PI Core produces the structural verdict. PMO Module consumes it.

### MVP PMO Cognition Module

**Inputs:**
- PI Core structural verdict (existing — forBoardroom, forBalanced, forOperator output)
- Governance Cognition outputs (existing — 122 mechanisms already operational)
- Planning evidence (new — Jira/ADO initiative-epic-story graph)

**Capabilities (MVP — no trajectory required):**

| # | PMO Capability | Governance Vector Consumed | What It Produces | Status |
|---|---|---|---|---|
| PMO-1 | **Planning Evidence Qualification** | Confidence Governance | Coverage ratios, dependency completeness, planning graph coherence, confidence boundary for all downstream PMO findings | **NEW** — but uses existing confidence governance pattern |
| PMO-2 | **Structural Execution Ceiling Detection** | Escalation Boundaries + Consequence Framing | "Platform Enablement ART owns 42% of cross-program dependencies — execution corridor saturated" | **EXISTS in PI Core** — PMO adds program-level translation |
| PMO-3 | **Cross-ART Dependency Pressure Mapping** | Authority Routing + Consequence Framing | Which ARTs are structurally dependent on which bottleneck regions. Maps PI Core conditions to ART/team boundaries. | **PARTIAL** — PI Core has dependency data, ART mapping requires Jira intake |
| PMO-4 | **Governance Altitude Projection for PMO Personas** | Altitude Translation | Same structural truth projected to Program Director, RTE, Portfolio Manager, Steering Committee altitudes | **EXISTS** — requires new persona contracts only |
| PMO-5 | **Capacity Absorption Analysis** | Escalation Boundaries + Consequence Framing | "This region cannot absorb more investment — execution corridor saturated. Additional funding will not increase throughput." | **PARTIAL** — PI Core has saturation evidence, capacity mapping requires external data |
| PMO-6 | **Structural Risk Framing for Steering Committee** | Altitude Translation + Containment Discipline | Board-ready risk narrative grounded in structural evidence with confidence qualification | **EXISTS** — extends forBoardroom with PMO-specific framing |
| PMO-7 | **PI Planning Input Signals** | Consequence Framing + Confidence Governance | "Budget conversations that treat these as independent capacity pools will underestimate coordination overhead" | **PARTIAL** — PI Core has the evidence, PMO adds planning-domain consequence language |

**Outputs:**
- Planning Evidence Qualification report (coverage, completeness, coherence, confidence boundary)
- Structural Execution Risk briefing (per-ART, per-program, per-steering-committee)
- Dependency pressure map (which ARTs route through which bottleneck)
- Governance-altitude projections for 4 PMO personas
- Capacity absorption advisory (where investment is/isn't absorbed)
- PI Planning input signals (what structural evidence says about planning assumptions)

**Limitations (MVP — explicitly stated, not hidden):**
- No trajectory: cannot answer "What is getting worse?" or "What will be a problem next PI?"
- No transformation readiness: cannot answer "Can we launch PI-4?" or "Is migration structurally safe?"
- No scenario comparison: cannot answer "What happens if we invest here vs there?"
- Planning evidence qualification depends on Jira intake completeness
- All PMO findings inherit PI Core's confidence boundary (advisory-bound if structural reconciliation is incomplete)

### Architecture

Follows the Domain Cognition Module pattern from PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01:

```
PI CORE VERDICT (existing)
        │ consumed by
        ▼
PMO WORKSPACE RESOLVER (new — reads verdict + planning evidence)
        │ produces
        ▼
PMO ORCHESTRATION ADAPTER (new — maps structural findings to program context)
        │ computes
        ▼
PMO PROJECTIONS + PLANNING QUALIFICATION
        │ rendered by
        ▼
THORR (existing Co-Pilot — new PMO persona contracts)
   or
LENS PMO SURFACE (future — not MVP)
```

### Implementation estimate

| Component | Work | LOC Estimate |
|---|---|---|
| PMO persona contracts (4 personas in PIContextAssembler) | Extension — same pattern as existing 8 personas | ~80 LOC |
| Planning Evidence Qualification engine | New — but follows confidence governance pattern | ~200 LOC |
| Jira planning graph intake | New — initiative/epic/story/dependency ingestion | ~300 LOC |
| ART-to-structural-domain mapping | New — maps Jira team/ART boundaries to PI Core domains | ~150 LOC |
| PMO consequence vocabulary | New — program-level consequence translations | ~100 LOC |
| PMO containment rules | Extension — PMO-specific prohibitions | ~30 LOC |
| PMO topic routes (THORR context loading) | Extension — same pattern as existing 16 topics | ~40 LOC |
| **Total new code** | | **~900 LOC** |

PI Core changes: **zero.**

---

## QUESTION 4 — What Can Be Delivered Without Waiting for Trajectory Cognition

### Immediately deliverable (existing Governance Cognition only)

| Capability | What It Answers | Evidence Required | Available Today? |
|---|---|---|---|
| **Structural execution risk briefing** | "Where is delivery structurally blocked?" | PI Core verdict only | **YES** — proven in BlueEdge Program Director interrogation |
| **Governance altitude projection** | Same findings projected to PD/RTE/PM/SC altitudes | PI Core verdict + new persona contracts | **YES** — persona contracts are ~80 LOC |
| **Dependency pressure mapping** | "Which dependencies actually matter?" | PI Core verdict (hub centrality, coupling, constriction) | **YES** — data exists in verdict |
| **Cross-domain blast radius framing** | "If Platform Infrastructure fails, what else breaks?" | PI Core verdict (consequence propagation) | **YES** — consequence framing exists |
| **Confidence-qualified risk narrative** | "This finding is advisory-bound because..." | PI Core verdict (confidence governance) | **YES** — confidence propagation is end-to-end |
| **Steering Committee structural brief** | Board-ready summary with evidence references | PI Core verdict + altitude translation | **YES** — forBoardroom already produces this |

### Deliverable with Jira intake addition

| Capability | What It Answers | Evidence Required | Jira Dependency |
|---|---|---|---|
| **Planning Evidence Qualification** | "Your planning data is 62% complete" | Jira initiative/epic/story graph | Jira REST API or export |
| **ART dependency pressure** | "ART-3 owns 42% of cross-program dependencies" | Jira team/ART boundaries + PI Core dependency data | Jira team/component mapping |
| **Capacity absorption advisory** | "This region cannot absorb more investment" | PI Core saturation evidence + Jira capacity data | Jira capacity/allocation fields |
| **PI Planning input signals** | "Budget for these teams is structurally constrained" | PI Core verdict + Jira ART/team mapping | Jira ART structure |

### NOT deliverable without trajectory cognition

| Capability | What It Answers | Why Not |
|---|---|---|
| "What is getting worse?" | Trend detection | Requires multi-run comparison |
| "What will be a problem next PI?" | Threshold proximity | Requires temporal evidence |
| "Is the execution ceiling growing?" | Velocity measurement | Requires minimum 3 sequential runs |
| "Are we making structural progress?" | Posture trajectory | Requires posture history |

---

## QUESTION 5 — What Becomes Possible After Adding Temporal Evidence

### With multi-run structural comparison (minimum 2 runs)

| Capability | What It Answers | PMO Value |
|---|---|---|
| **Condition evolution tracking** | Which conditions appeared, disappeared, changed severity | "The delivery ceiling in Platform Infrastructure was ELEVATED last PI, now CRITICAL — pressure is increasing" |
| **Posture drift detection** | Whether overall posture is improving or degrading | "Systemic Operational Fragility persists across 3 runs — structural intervention has not reduced exposure" |
| **Signal delta analysis** | Which signals are changing and in which direction | "Coupling pressure signal increased from z=3.2 to z=5.66 over 2 PI cycles" |
| **Pressure zone evolution** | Whether zones are growing, shrinking, or moving | "The pressure zone expanded from 1 domain to 3 domains over 2 runs" |

### With velocity measurement (minimum 3 runs)

| Capability | What It Answers | PMO Value |
|---|---|---|
| **Structural velocity** | Rate of change per PI cycle | "Dependency density is increasing at 17% per PI cycle — at this rate, the next PI will cross the CRITICAL threshold" |
| **Threshold proximity** | How close a metric is to the next severity boundary | "Coupling pressure is at 87% of the CRITICAL threshold — one more PI cycle at current velocity will cross it" |
| **Regime transition detection** | When the system crosses from one posture to another | "BlueEdge crossed from Compound Structural Stress to Systemic Operational Fragility between PI-3 and PI-4" |

### With capacity evidence (Jira + HR/allocation data)

| Capability | What It Answers | PMO Value |
|---|---|---|
| **Investment absorption analysis** | Where investment is absorbed vs wasted | "Program A cannot absorb more investment. Execution corridor saturated. Additional funding will not increase throughput." |
| **Capacity-structural alignment** | Whether team capacity matches structural pressure | "ART-3 has 12 engineers allocated to the highest-pressure region. ART-5 has 20 engineers allocated to a region with no structural findings. Capacity and structural pressure are misaligned." |
| **Transformation readiness** | Whether structural prerequisites for change are met | "3 structural prerequisites remain unresolved. Program can proceed, but probability of successful adoption is reduced." |

---

## Constitutional Capability Matrix — Summary

| Capability Domain | Status | Detail |
|---|---|---|
| **Structural Cognition (PI Core)** | **EXISTS** | Mature. Graph, signals, conditions, pressure zones, consequences, confidence, qualification. Proven on BlueEdge. |
| **Governance Cognition** | **EXISTS** (unnamed) | 122 mechanisms across 6/7 vectors. Hidden inside existing pipeline. Naming and formalization exercise, not greenfield. |
| **Trajectory Cognition** | **ABSENT** | No multi-run structural comparison. Infrastructure designed (temporal_marker, EXSIG/TIMSIG vocabulary) but not activated. SQO reconciliation domain has proven temporal architecture pattern. |
| **Transformation Cognition** | **ABSENT** | No readiness models, prerequisite chains, or intervention sequencing. Requires Trajectory Cognition as prerequisite. |
| **PMO Cognition Module** | **NOT BUILT** | Can be built immediately from existing Governance Cognition + PI Core verdict + Jira intake. ~900 LOC new code. Zero PI Core changes. |

### Per-Capability Status

| Capability | PI Core | Gov. Cognition | Traj. Cognition | Trans. Cognition | PMO Module |
|---|---|---|---|---|---|
| Structural truth computation | EXISTS | — | — | — | consumes |
| Altitude translation | EXISTS | EXISTS | — | — | extends |
| Authority routing | EXISTS | EXISTS | — | — | extends |
| Escalation boundaries | EXISTS | EXISTS | — | — | extends |
| Confidence governance | EXISTS | EXISTS | — | — | extends |
| Consequence framing | EXISTS | EXISTS | — | — | extends |
| Containment discipline | EXISTS | EXISTS | — | — | extends |
| Temporal awareness | ABSENT | ABSENT | ABSENT | — | blocked |
| Planning evidence qualification | — | — | — | — | NEW |
| Multi-run comparison | — | — | ABSENT | — | blocked |
| Structural velocity | — | — | ABSENT | — | blocked |
| Threshold proximity | — | — | ABSENT | — | blocked |
| Regime transition detection | — | — | ABSENT | — | blocked |
| Transformation readiness | — | — | — | ABSENT | blocked |
| Prerequisite chains | — | — | — | ABSENT | blocked |
| ART dependency mapping | — | — | — | — | NEW (with Jira) |
| Capacity absorption analysis | — | — | — | — | NEW (with Jira + capacity) |

---

## The Answer

**"What PMO Cognition can we ship first using assets we already own?"**

A PMO Cognition Module that consumes PI Core's structural verdict through existing Governance Cognition (122 mechanisms, 6/7 vectors operational) and adds:

1. **Planning Evidence Qualification** — qualify Jira planning data before reasoning over it (commercial differentiator, prevents blame-the-tool)
2. **4 PMO persona projections** — Program Director, RTE, Portfolio Manager, Steering Committee (extends existing altitude translation)
3. **PMO consequence vocabulary** — program-level translation of structural findings ("execution corridor saturated" instead of "coupling z-score = 5.66")
4. **ART-to-structural-domain mapping** — which ARTs are structurally constrained (requires Jira team/ART intake)
5. **PMO containment rules** — PMO-specific prohibitions (no headcount recommendations, no PI Planning outcome prediction)

What it answers on day one:
- "Where is delivery structurally blocked?"
- "Which dependencies actually matter?"
- "What should I tell the Steering Committee?"
- "Is our planning data good enough to trust these findings?"

What it honestly cannot answer yet:
- "What is getting worse?" (requires trajectory)
- "Can we launch PI-4?" (requires transformation readiness)
- "What happens if we invest here vs there?" (requires scenario cognition)

~900 LOC new code. Zero PI Core changes. First commercial domain module outside Software Intelligence.
