# PI State Machine Contract

**Status:** CONSTITUTIONAL — LOCKED  
**Authority:** PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01  
**Effective:** 2026-06-07  
**Supersedes:** Ad-hoc projection behavior across LENS, THORR, EIR  

This contract defines the constitutional authority model for Program Intelligence projection. It separates three previously conflated concepts — Qualification State, Evidence Capability, and Projection Authority — and establishes projection governance as constitutional law.

No projection may exceed the authority granted by proven evidence capability. No evidence capability may be claimed without qualification support. Violations are first-class governance concerns.

---

## 1. Qualification State (S-Axis)

Qualification State measures governance maturity through the SQO progression. It describes what governance ceremonies have been exercised, not what intelligence exists.

| State | Name | Meaning |
|-------|------|---------|
| S0 | Unqualified | Ingested but not structurally resolved |
| S1 | Structurally Qualified | Structural topology resolved. No semantic binding. No governance lifecycle. |
| S2 | Semantically Qualified | Semantic topology bound. Signal registry populated. Reconciliation available. |
| S3 | Governed | Full governance lifecycle exercised. Promotion decisions recorded. Authority ceiling established. |

**Rule:** S-state advancement requires explicit SQO gate passage. No S-state may be inferred from evidence presence alone.

**Rule:** S-state is monotonic within a run. A specimen does not regress within a qualification cycle.

---

## 2. Evidence Capability State (E-Axis)

Evidence Capability describes what intelligence substrate actually exists for a specimen, independent of whether that substrate has been qualified.

| Capability | Required Evidence | Distinguishing Property |
|------------|-------------------|------------------------|
| E-STRUCTURAL | canonical_topology (40.4) + code_graph (40.3s) + structural_enrichment | Import/inheritance authority visible. Cluster distribution resolved. Centrality decomposed. |
| E-RUNTIME | E-STRUCTURAL + runtime_connectivity graphs (event, MQTT, WebSocket, API, DI) | Runtime coordination paths visible. Operational gravity measurable. Failure modes beyond static analysis detectable. |
| E-SEMANTIC | E-STRUCTURAL + semantic_topology_model + signal_registry (PSIG/DPSIG/ISIG) + reconciliation | Governed domain binding. Per-signal interpretation. Semantic narrative authority. |
| E-GOVERNED | E-SEMANTIC + governance_lifecycle + proposition_corpus + promotion_state | Authority ceiling established. Governance ceremonies exercised. Promotion decisions recorded. |

**Rule:** Evidence capability is determined by artifact presence, not by qualification state. A specimen may possess E-RUNTIME evidence at S1 qualification.

**Rule:** Evidence capability is not transitive. E-RUNTIME does not imply E-SEMANTIC. E-SEMANTIC does not imply E-RUNTIME. They are independent axes that may co-exist.

**Rule:** The canonical test for evidence capability: "If this evidence class disappeared tomorrow, would the intelligence claim still be supportable?" If no, the claim depends on that evidence class.

---

## 3. Projection Authority (P-Axis)

Projection Authority governs what PiOS is constitutionally allowed to project. This is the governing axis. It is derived from Evidence Capability, not from Qualification State directly.

| Level | Name | Authority | Required Evidence Capability |
|-------|------|-----------|------------------------------|
| P0 | Topology Only | Structural topology rendering. Cluster distribution. Node inventory. Edge counts. No interpretation. | E-STRUCTURAL (minimum) |
| P1 | Structural Observation | Topology + structural concentration, coupling pressure, centrality hotspots, architectural bottlenecks. Observations are structural measurements, not operational claims. | E-STRUCTURAL |
| P2 | Runtime Interpretation | P1 + runtime coordination paths, operational gravity, execution blindness, gravity divergence, runtime convergence. Claims about operational behavior require runtime evidence. | E-RUNTIME |
| P3 | Semantic Cognition | P2 + governed domain narrative, per-signal interpretation, semantic propagation chains, business-domain grounding. | E-SEMANTIC |
| P4 | Narrative Authority | P3 + executive narrative synthesis, governed consequence posture, promotion-ready deliverables, authority-ceiling-bounded recommendations. | E-GOVERNED |

### 3.1 Projection Authority Derivation

```
Qualification (S) → gates → Evidence Capability (E) → grants → Projection Authority (P)
```

A specimen's maximum projection authority is determined by its proven evidence capabilities:

| Evidence Capabilities Present | Maximum P-Level |
|-------------------------------|-----------------|
| E-STRUCTURAL only | P1 |
| E-STRUCTURAL + E-RUNTIME | P2 |
| E-STRUCTURAL + E-SEMANTIC | P3 |
| E-STRUCTURAL + E-RUNTIME + E-SEMANTIC | P3 |
| E-GOVERNED (implies all above) | P4 |

### 3.2 Projection Violation

**Definition:** A projection violation exists whenever PiOS emits intelligence whose authority level exceeds the specimen's proven evidence capability.

A projection violation is a first-class governance concern. It is not a UI bug. It is not a rendering preference. It is a constitutional breach of evidence authority.

**Detection rule:** For every projected statement, the system must be able to answer: "Which evidence capability authorizes this projection?" If no evidence capability authorizes it, the projection is invalid.

---

## 4. Topology-First Doctrine

canonical_topology is elevated from L0 evidence artifact to constitutional projection substrate.

**Rationale:** Topology is the only artifact with a monotonic survival property across all evidence capability states:

| State | Topology Present |
|-------|-----------------|
| E-STRUCTURAL | Yes |
| E-RUNTIME | Yes |
| E-SEMANTIC | Yes |
| E-GOVERNED | Yes |

Signals come and go. Conditions come and go. Narratives come and go. Topology persists.

**Constitutional rules:**

1. Topology is the primary projection anchor for all consumers (LENS, THORR, EIR).
2. All other intelligence (signals, conditions, consequences, narratives) are annotations on topology.
3. No consumer may project intelligence without topology context.
4. Topology rendering must not be suppressed by downstream intelligence failures.
5. Topology must be renderable at P0 — before any intelligence is available.

---

## 5. Allowed Projection Matrix

### 5.1 P1 — Structural Observation (E-STRUCTURAL)

**Allowed projections:**

- Topology concentration (where structural mass sits)
- Dependency concentration (import/inheritance hubs)
- Structural hotspots (centrality, coupling pressure)
- Coupling pressure (bidirectional dependencies, coupling inertia)
- Architectural bottlenecks (constriction surfaces, choke points)
- Cluster distribution (count, size, density)
- Qualification posture (current S-state, maturity path)
- Structural boundary divergence (module boundary alignment)
- Cohesion assessment (module internal cohesion)

**Condition types authorized at P1:**

- STRUCTURAL_MASS_CONCENTRATION
- CROSS_DOMAIN_COUPLING_PRESSURE
- COUPLING_INERTIA
- STRUCTURAL_BOUNDARY_DIVERGENCE
- GOVERNANCE_COVERAGE_STATUS

**Not allowed at P1:**

- EXECUTION_FRAGILITY (requires operational evidence beyond structural measurement)
- EXECUTION_CONSTRICTION (requires operational impact assessment)
- DELIVERY_PRESSURE_CONCENTRATION (requires signal-driven delivery assessment)
- DEPENDENCY_CHOKE_POINT (requires signal-driven analysis)
- PROPAGATION_ASYMMETRY (requires signal-driven propagation evidence)
- COMPOUND_CONVERGENCE (composite — authority level of its highest constituent)
- Any runtime condition type (EVENT_CONCENTRATION, BROKER_DEPENDENCY, etc.)
- Execution Blindness (requires E-RUNTIME)
- Gravity Divergence (requires E-RUNTIME)
- Any "operational," "execution," or "delivery" language in projected claims

### 5.2 P2 — Runtime Interpretation (E-RUNTIME)

**Additional projections authorized (beyond P1):**

- Runtime coordination paths (event flows, MQTT topics, WebSocket channels)
- Operational gravity (where the system actually runs vs where code sits)
- Execution Blindness (boundary, silence, coupling blindness classes)
- Gravity Divergence (static vs runtime center of mass)
- Runtime convergence (compound conditions incorporating runtime evidence)
- Operational bottleneck (runtime dependency choke points)
- Broker dependency assessment
- Topic fanout pressure
- Async propagation asymmetry

**Condition types additionally authorized at P2:**

- EVENT_CONCENTRATION
- RUNTIME_DEPENDENCY_CHOKE_POINT
- BROKER_DEPENDENCY
- TOPIC_FANOUT_PRESSURE
- ASYNC_PROPAGATION_ASYMMETRY
- EDGE_CLOUD_PROPAGATION_RISK
- RUNTIME_OBSERVABILITY_GAP
- EXECUTION_FRAGILITY (now authorized — runtime evidence supports operational claims)
- EXECUTION_CONSTRICTION (now authorized)
- COMPOUND_CONVERGENCE (when constituents are P2-authorized)

### 5.3 P3 — Semantic Cognition (E-SEMANTIC)

**Additional projections authorized (beyond P2):**

- Governed domain narrative (business-label grounded interpretation)
- Per-signal interpretation (PSIG/DPSIG/ISIG decomposition)
- Semantic propagation chains (domain-level causal narrative)
- Delivery pressure concentration (signal-driven)
- Dependency choke point analysis (signal-driven)
- Propagation asymmetry (signal-driven)
- Business-domain grounding in all projected statements

**Condition types additionally authorized at P3:**

- DELIVERY_PRESSURE_CONCENTRATION
- DEPENDENCY_CHOKE_POINT
- PROPAGATION_ASYMMETRY

### 5.4 P4 — Narrative Authority (E-GOVERNED)

**Additional projections authorized (beyond P3):**

- Executive narrative synthesis
- Governed consequence posture
- Promotion-ready deliverables
- Authority-ceiling-bounded operational guidance

---

## 6. State x Persona x Focus Matrix

### 6.1 Persona Projection Contracts

| Persona | Audience | Projection Depth | Authority Requirement |
|---------|----------|-------------------|-----------------------|
| DENSE | CTO / Structural | Full structural and condition detail | P1 minimum |
| OPERATOR | Engineering | Evidence inspection, confidence assessment | P1 minimum |
| BALANCED | CTO / VP Eng / EA | Causal understanding, operational dynamics | P2 minimum for runtime content, P3 for semantic narrative |
| BOARDROOM | CEO / Board | Consequence posture, decision support | P3 minimum for narrative, P4 for recommendations |
| INVESTIGATION | Forensic | Evidence traversal, verification | P1 minimum |

### 6.2 Persona Isolation Rule

**Constitutional rule:** Cognition state (active surface, active condition, active query) must be cleared on persona transition. No persona may inherit projection context from another persona.

**Rationale:** DENSE concepts (Compound Structural Convergence, Execution Fragility) are not BOARDROOM concepts. Persona transition is a cognitive mode change, not a view filter.

### 6.3 SW-INTEL x State x Persona

SW-INTEL activation must respect projection authority:

| Persona | P1 (Structural) | P2 (Runtime) | P3 (Semantic) |
|---------|-----------------|--------------|---------------|
| DENSE | Structural conditions only | + Runtime conditions + EB/GD | + Signal-driven conditions |
| OPERATOR | Structural evidence | + Runtime evidence | + Semantic evidence |
| BALANCED | Structural concentration summary | + Runtime operational dynamics | + Semantic causal narrative |
| BOARDROOM | Structural posture only | + Operational posture | + Governed consequence posture |

---

## 7. Consumer Contracts

### 7.1 LENS

LENS is the primary projection surface. It must:

1. Anchor all projection on topology (Section 4).
2. Render only projections authorized by the specimen's P-level (Section 5).
3. Clear cognition state on persona transition (Section 6.2).
4. Show evidence qualification context for every zone (what evidence authorizes this view).
5. Never project "operational" or "execution" language at P1.
6. Gate SW-INTEL content by P-level x persona (Section 6.3).

### 7.2 THORR

THORR is the transformation projection layer. It must:

1. Receive the specimen's P-level and restrict answers accordingly.
2. At P1: answer structural questions only. Refuse operational/runtime questions with authority explanation.
3. At P2: answer structural + runtime questions. Refuse semantic narrative questions.
4. At P3+: full question repertoire.
5. Never project intelligence beyond the specimen's proven evidence capability.
6. Anchor explanations on topology whenever possible.

### 7.3 EIR

EIR is the executive intelligence report. It must:

1. Select narrative mode based on P-level, not just condition presence.
2. EXECUTION_BLINDNESS narrative mode requires P2 (E-RUNTIME).
3. STRUCTURAL_INTELLIGENCE narrative mode is valid at P1.
4. Chapter composition must respect P-level — no runtime chapters at P1.
5. Executive summary language must match authority level.

---

## 8. Projection Leakage Rules

### 8.1 Definition

Projection leakage occurs when intelligence from one projection context (persona, zone, state) appears in another context without re-projection.

### 8.2 Prohibited Leakage Patterns

1. **Persona leakage:** DENSE condition selections surviving into BOARDROOM.
2. **Zone leakage:** Signal assessment findings appearing in topology surface context.
3. **State leakage:** Runtime-derived intelligence appearing when runtime evidence is absent.
4. **Layer leakage:** Condition-layer detail appearing in consequence-layer projections without consequence transformation.
5. **Consumer leakage:** LENS projection context influencing THORR answers or vice versa.

### 8.3 Prevention

- Clear all cognition state on persona transition.
- Clear all cognition state on SW-INTEL deactivation.
- Gate all projected content by P-level before rendering.
- Validate consumer isolation at projection assembly time.

---

## 9. Current Implementation Deviations

The following deviations from this contract exist in the current implementation as of 2026-06-07. These constitute the migration backlog.

### 9.1 P-Level Violations

| Deviation | Current Behavior | Constitutional Requirement |
|-----------|-----------------|---------------------------|
| EXECUTION_FRAGILITY at P1 | Projected for StackStorm (S1, E-STRUCTURAL only) | Requires P2 (E-RUNTIME). Not constitutionally valid unless runtime evidence supports it. |
| EXECUTION_CONSTRICTION at P1 | Projected for StackStorm (S1, E-STRUCTURAL only) | Requires P2 (E-RUNTIME). Structural enrichment alone does not authorize "execution" claims. |
| DELIVERY_PRESSURE_CONCENTRATION at P1 | Projected when signal_interpretations are derived from conditions | Requires P3 (E-SEMANTIC). Signal-driven delivery assessment requires canonical signal registry. |
| COMPOUND_CONVERGENCE at P1 | Composites of unauthorized constituents projected freely | Composite authority = max(constituent authority). If any constituent exceeds P-level, composite exceeds P-level. |
| "Operational" language at P1 | "20 operational conditions detected" in SW-INTEL teaser | P1 authorizes "structural conditions." "Operational" requires P2. |

### 9.2 Persona Leakage

| Deviation | Current Behavior | Constitutional Requirement |
|-----------|-----------------|---------------------------|
| DENSE → BOARDROOM context survival | Active condition/surface selection persists across persona switch | Clear cognition state on persona transition |
| DENSE condition vocabulary in BOARDROOM | "Compound Structural Convergence" appears in Boardroom | Boardroom should receive consequence posture, not condition labels |

### 9.3 Layer Violations

| Deviation | Current Behavior | Constitutional Requirement |
|-----------|-----------------|---------------------------|
| Conditions bypass signal layer at S1 | 20 conditions exist, signal_interpretations backfilled | Backfill is a bridge. Constitutionally, conditions at P1 should only include P1-authorized types |
| ConsequenceCompiler produces consequences from unauthorized conditions | All conditions feed consequence formation regardless of P-level | Consequence formation should filter input conditions by P-level |
| SW-INTEL not state-aware | Shows all conditions regardless of P-level | SW-INTEL must gate by P-level x persona |

### 9.4 Consumer Violations

| Deviation | Current Behavior | Constitutional Requirement |
|-----------|-----------------|---------------------------|
| THORR answers runtime questions at P1 | THORR corridor questions reference runtime evidence for any specimen with runtime graphs | THORR should refuse or qualify runtime questions when P-level < P2 |
| EIR narrative mode ignores P-level | EXECUTION_BLINDNESS mode activates on condition presence alone | EB narrative mode requires P2 |
| INTELLIGENCE BLOCKED coexists with active intelligence | Banner shows "INTELLIGENCE BLOCKED" while 20 conditions are active | Banner should reflect P-level: "Structural intelligence available. Runtime/semantic intelligence requires additional evidence." |

---

## 10. Migration Path

### 10.1 Phase 1: Authority Computation (prerequisite)

Add `computeProjectionAuthority(fullReport)` that returns:
- `evidenceCapabilities: Set<E-STRUCTURAL | E-RUNTIME | E-SEMANTIC | E-GOVERNED>`
- `projectionLevel: P0 | P1 | P2 | P3 | P4`
- `authorizedConditionTypes: Set<string>`
- `qualificationState: S0 | S1 | S2 | S3`

### 10.2 Phase 2: Condition Filtering

`synthesize()` output must be filtered by `authorizedConditionTypes` before reaching consumers. Unauthorized conditions are suppressed, not deleted — they exist in the evidence layer but are not projected.

### 10.3 Phase 3: Consumer Gating

LENS, THORR, EIR each receive the `projectionLevel` and gate their output accordingly. Persona x P-level matrix (Section 6.3) becomes enforceable.

### 10.4 Phase 4: Persona Isolation

Clear cognition state on persona transition. Clear cognition state on SW-INTEL deactivation (already implemented as of commit 42239b0).

### 10.5 Phase 5: Projection Violation Detection

Add a validation pass that flags any projected content whose authority level exceeds the specimen's P-level. This becomes a test class in the cognition contract test suite.

---

## Appendix A: Evidence Capability Detection

```
E-STRUCTURAL:
  canonical_topology present AND (structural_enrichment.available OR code_graph present)

E-RUNTIME:
  E-STRUCTURAL AND runtime_connectivity/ directory contains >= 1 graph artifact
  AND _runtime_signals.length > 0

E-SEMANTIC:
  E-STRUCTURAL AND signal_registry present AND semantic_topology_model present
  AND reconciliation_summary.available === true

E-GOVERNED:
  E-SEMANTIC AND governance_lifecycle present AND governance_lifecycle.available === true
  AND proposition_corpus present
```

## Appendix B: Condition Type Authority Classification

| Condition Type | Minimum P-Level | Evidence Basis |
|----------------|-----------------|----------------|
| STRUCTURAL_MASS_CONCENTRATION | P1 | Structural topology |
| CROSS_DOMAIN_COUPLING_PRESSURE | P1 | Structural enrichment |
| COUPLING_INERTIA | P1 | Structural enrichment |
| STRUCTURAL_BOUNDARY_DIVERGENCE | P1 | Structural enrichment |
| GOVERNANCE_COVERAGE_STATUS | P1 | Structural enrichment |
| EXECUTION_FRAGILITY | P2 | Operational evidence |
| EXECUTION_CONSTRICTION | P2 | Operational evidence |
| EVENT_CONCENTRATION | P2 | Runtime connectivity |
| RUNTIME_DEPENDENCY_CHOKE_POINT | P2 | Runtime connectivity |
| BROKER_DEPENDENCY | P2 | Runtime connectivity |
| TOPIC_FANOUT_PRESSURE | P2 | Runtime connectivity |
| ASYNC_PROPAGATION_ASYMMETRY | P2 | Runtime connectivity |
| EDGE_CLOUD_PROPAGATION_RISK | P2 | Runtime connectivity |
| RUNTIME_OBSERVABILITY_GAP | P2 | Runtime connectivity |
| DELIVERY_PRESSURE_CONCENTRATION | P3 | Signal registry |
| DEPENDENCY_CHOKE_POINT | P3 | Signal registry |
| PROPAGATION_ASYMMETRY | P3 | Signal registry |
| COMPOUND_CONVERGENCE | max(constituents) | Composite |

## Appendix C: Projection Authority Test

For any projected statement S:

1. Identify the condition type(s) that authorize S.
2. Look up the minimum P-level for each condition type (Appendix B).
3. Determine the specimen's current P-level (Section 3.1).
4. If any required P-level exceeds the specimen's P-level, S is a projection violation.

This test is deterministic and automatable.
