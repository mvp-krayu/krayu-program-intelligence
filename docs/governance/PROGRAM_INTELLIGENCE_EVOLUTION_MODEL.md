# Program Intelligence Evolution Model

Status: LOCKED — AUTHORITATIVE
Classification: Permanent Operational Meta-Model
Origin: PI.PIOS.PROGRAM-INTELLIGENCE-EVOLUTION-MODEL.01

---

## 1. CONSTITUTIONAL LAW

**Execution IS accumulation.**

Every pipeline run, every onboarding, every qualification transition, every replay, every projection — each produces governed spine objects. The spine is not documentation about intelligence. The spine IS the accumulated governed operational intelligence.

No execution may complete without producing at least one spine object.
No spine object may exist without evidence anchor.
No spine object may be modified after creation — append-only.

---

## 2. ACCUMULATION MODEL

Every execution type enriches the spine through specific object production:

| Execution Type | Produces | Spine Object Class |
|---|---|---|
| Source intake | File inventory, language distribution | evidence_object |
| Structural scan | Node inventory, topology, clusters | evidence_object |
| Code-graph enrichment | Import resolution, centrality | evidence_object |
| Semantic derivation | Candidate CSR, confidence scores | semantic_proposition |
| Qualification transition | S-state change, blocker resolution | qualification_transition |
| Operator review | Acceptance, rejection, contest | qualification_transition |
| Cross-specimen comparison | Shared patterns, divergences | convergence_observation |
| LENS projection | Executive snapshot, persona rendering | executive_projection_snapshot |
| Cockpit replay | Deterministic re-execution proof | replay_corridor |
| Structural surprise | Non-obvious topological discovery | hero_moment |
| Governance stream | Architecture mutation, term lock | doctrine_evolution_record |

The spine grows monotonically. Objects accumulate. Nothing is deleted.

---

## 3. SPINE OBJECT MODEL

Eight object classes. Each has mandatory fields, evidence anchor requirements, and governance boundaries.

### 3.1 evidence_object

**Purpose:** Raw structural evidence produced by deterministic pipeline execution.

```
evidence_object:
  id:             <uuid>
  specimen_id:    <client_id>
  run_id:         <run_id>
  phase:          <pipeline_phase>        # e.g. "40.2", "40.3s", "40.3c"
  artifact_path:  <relative_path>
  artifact_hash:  <sha256>
  timestamp:      <utc_iso>
  evidence_class: STRUCTURAL | CODE_GRAPH | CENTRALITY | INVENTORY
  node_count:     <int>                   # optional, phase-dependent
  edge_count:     <int>                   # optional, phase-dependent
  lineage:        <parent_evidence_id>    # null for intake-phase objects
```

**Anchor:** The artifact file itself. Hash-verifiable.
**Governance:** Immutable after creation. Pipeline phase determines evidence_class.

### 3.2 semantic_proposition

**Purpose:** A semantic claim derived from evidence, with confidence and authority ceiling.

```
semantic_proposition:
  id:                 <uuid>
  specimen_id:        <client_id>
  run_id:             <run_id>
  proposition:        <text>              # the semantic claim
  derivation_tier:    DIRECT_EVIDENCE | DERIVED | INFERRED
  confidence:         <0.0-1.0>
  authority_ceiling:  L1 | L2 | L3        # max L3 for AI-derived
  evidence_anchors:   [<evidence_object_id>, ...]
  status:             CANDIDATE | REVIEWED | ACCEPTED | REJECTED | CONTESTED
  timestamp:          <utc_iso>
```

**Anchor:** At least one evidence_object_id required.
**Governance:** AI propositions never exceed L3 ceiling. ACCEPTED requires human operator action.

### 3.3 replay_corridor

**Purpose:** A replayable execution sequence that produces identical outputs from identical inputs.

```
replay_corridor:
  id:             <uuid>
  specimen_id:    <client_id>
  run_id:         <run_id>
  corridor_type:  ONBOARDING | QUALIFICATION | REMEDIATION | COMPARISON
  commands:       [<ordered_command_list>]
  input_hash:     <sha256>                # hash of source archive
  output_hashes:  {<artifact>: <sha256>}  # expected outputs
  fidelity:       EXACT | STRUCTURAL      # EXACT = bit-identical outputs
  timestamp:      <utc_iso>
```

**Anchor:** Input hash + output hashes. Verifiable by re-execution.
**Governance:** Commands must be deterministic. No stochastic steps unless explicitly bounded.

### 3.4 convergence_observation

**Purpose:** A cross-specimen or cross-run structural pattern observation.

```
convergence_observation:
  id:               <uuid>
  pattern:          <text>                # the observed pattern
  specimens:        [<specimen_id>, ...]  # minimum 2 for cross-specimen
  evidence_anchors: [<evidence_object_id>, ...]
  pattern_status:   OBSERVED | REPEATABLE | CANDIDATE_LAW | CONFIRMED_LAW
  interpretation_maturity: DESCRIPTIVE | COMPARATIVE | EMERGENT_PATTERN | OPERATIONAL_LAW
  observation_count: <int>
  timestamp:        <utc_iso>
```

**Anchor:** Evidence objects from each referenced specimen.

**Interpretation maturity levels:**
- **DESCRIPTIVE** — measured difference between specimens. No causal attribution. No generalization. This is where all cross-specimen observations begin.
- **COMPARATIVE** — pattern observed across 3+ specimens with consistent direction. May indicate structural tendency but not law. Causal attribution remains prohibited.
- **EMERGENT_PATTERN** — pattern observed across 5+ specimens spanning at least 2 architecture styles. Documented as recurring structural tendency. Still not law — confounding variables not controlled.
- **OPERATIONAL_LAW** — structurally derived invariant confirmed across specimen diversity sufficient to exclude architecture-style, language, and project-age confounds. Requires explicit governance review before promotion.

**Governance:**
- CONFIRMED_LAW pattern_status requires 3+ independent specimens. No retroactive application.
- OPERATIONAL_LAW interpretation_maturity requires explicit governance stream authorization. Descriptive metrics do not become doctrine through repetition.
- Convergence observations must not claim causality ("microservices produce X") — they state measured differences ("in this specimen pair, X was observed").
- Two specimens establish a comparison, not a pattern. Three specimens begin to indicate recurrence. No specimen count alone proves a law.

### 3.5 qualification_transition

**Purpose:** A governed state change in SQO qualification.

```
qualification_transition:
  id:             <uuid>
  specimen_id:    <client_id>
  run_id:         <run_id>
  from_state:     <s_state | posture>
  to_state:       <s_state | posture>
  trigger:        OPERATOR | PIPELINE | GOVERNANCE_PROJECTION
  actor_id:       <operator_id | system:*>
  disposition:    <semantic_disposition>  # from locked taxonomy
  evidence_anchors: [<evidence_object_id>, ...]
  event_path:     <path_to_event_log>
  timestamp:      <utc_iso>
```

**Anchor:** Event log entry + triggering evidence.
**Governance:** Non-automatable boundaries enforced. System actors cannot promote.

### 3.6 hero_moment

**Purpose:** A genuinely surprising structural revelation — something PI discovered that was NOT obvious from documentation, README, or casual inspection.

```
hero_moment:
  id:             <uuid>
  specimen_id:    <client_id>
  run_id:         <run_id>
  discovery:      <text>                  # what was discovered
  surprise_class: TOPOLOGY | CENTRALITY | ISOLATION | COUPLING | EMERGENCE
  evidence_anchors: [<evidence_object_id>, ...]
  manufactured:   false                   # MUST be false — manufactured moments are rejected
  timestamp:      <utc_iso>
```

**Anchor:** Evidence objects that prove the discovery.
**Governance:** `manufactured: true` is a structural violation. Only genuinely surprising findings qualify.

### 3.7 doctrine_evolution_record

**Purpose:** A record of architectural governance change — new concept, term lock, boundary change, supersession.

```
doctrine_evolution_record:
  id:             <uuid>
  stream_id:      <stream_id>
  classification: G1 | G2 | G3
  mutation_type:  NEW_CONCEPT | TERM_LOCK | BOUNDARY_CHANGE | SUPERSESSION | STATUS_CHANGE
  subject:        <concept_or_term_name>
  description:    <text>
  vault_files_updated: [<path>, ...]
  timestamp:      <utc_iso>
```

**Anchor:** Stream CLOSURE.md + vault file diffs.
**Governance:** G1 streams produce these automatically. G2/G3 produce none.

### 3.8 executive_projection_snapshot

**Purpose:** A captured state of LENS executive projection at a specific moment.

```
executive_projection_snapshot:
  id:             <uuid>
  specimen_id:    <client_id>
  run_id:         <run_id>
  persona:        BOARDROOM | BALANCED | DENSE | INVESTIGATION
  posture:        <qualification_posture>
  s_state:        <s_state>
  q_class:        <q_class>
  signal_summary: {<signal_type>: <count>}
  zone_count:     <int>
  screenshot_path: <path>                 # optional — governed evidence capture
  timestamp:      <utc_iso>
```

**Anchor:** The fullReport payload hash at capture time.
**Governance:** Snapshots are immutable historical records. No retroactive modification.

---

## 4. SPINE INVARIANTS

1. **Append-only.** Objects are created, never modified or deleted.
2. **Evidence-anchored.** Every object references at least one evidence source.
3. **Specimen-scoped.** Every object belongs to exactly one specimen (client), except convergence_observations which span specimens.
4. **Timestamped.** UTC ISO 8601. No relative dates.
5. **Hash-verifiable.** Evidence objects carry artifact hashes. Replay corridors carry input/output hashes.
6. **Lineage-traceable.** Every object can trace backward to its evidence source through anchor chains.
7. **Authority-bounded.** No object self-escalates its authority level.
8. **Deterministic-first.** Spine objects produced by deterministic execution are authoritative over those produced by bounded-deterministic processes.

---

## 5. WHAT THE SPINE IS NOT

- Not a database schema. These contracts define governance shape, not persistence implementation.
- Not a vector store. Retrieval is evidence-ranked, not embedding-ranked.
- Not an agent orchestration platform. Agents are future consumers/enrichers, not spine infrastructure.
- Not documentation. The spine is operational accumulated intelligence, not prose about intelligence.
- Not a planning tool. The spine records what happened, not what should happen.

---

## 6. ACTIVATION SEQUENCE

The spine activates through execution, not through architecture design:

```
Phase 0 (COMPLETE):  Implicit spine — pipeline produces artifacts but no spine objects
Phase 1 (COMPLETE):  First spine objects — NetBox onboarding: 8 evidence_objects + 5 hero_moments + 1 replay_corridor
Phase 2 (COMPLETE):  Qualification spine — SQO governance projection produces qualification state
Phase 3 (COMPLETE):  Cross-specimen spine — StackStorm onboarding: 8 evidence_objects + 5 hero_moments + 1 replay_corridor + 5 convergence_observations
Phase 4 (CURRENT):   Projection spine — LENS captures produce executive_projection_snapshots
Phase 5:            Semantic spine — semantic derivation produces semantic_propositions
Phase 6:            Doctrine spine — governance streams produce doctrine_evolution_records
Phase 7:            Full spine — all 8 object classes operational
```

Each phase requires the previous. No phase may be skipped.
Phase 3 completed with StackStorm (StackStorm/st2) as second specimen.

---

## 7. GOVERNANCE BOUNDARIES

### What remains permanently deterministic
- Source intake, structural scanning, topology derivation, cluster assignment
- SRC classification, code-graph enrichment, centrality computation
- S-state detection, Q-class computation, qualification posture derivation

### What remains permanently human-governed
- S-state promotion, semantic acceptance, crosswalk acceptance
- Arbitration resolution, insufficiency acknowledgment
- CSR promotion from candidate to canonical
- Hero moment validation (manufactured = rejected)

### What may be agentically enriched (future, bounded)
- Import resolution beyond ast (SCIP, Jedi)
- Semantic proposition derivation (compiler, L3 ceiling)
- Cross-specimen pattern detection (OBSERVED only — progression requires human)
- Narrative synthesis (75.x, evidence-bound, disclosure-wrapped)

---

## 8. RELATION TO EXISTING ARCHITECTURE

This model does not replace or supersede:
- **CLAUDE.md** — execution constitution (how Claude operates)
- **git_structure_contract.md** — branch/domain authority (where code lives)
- **reference_boundary_contract.md** — cross-layer rules (what can cross boundaries)
- **SQO** — qualification state machine (assessment of maturity)
- **LENS** — projection surface (executive interaction shell)
- **PiOS** — computational substrate (deterministic derivation)

This model defines **what accumulates** as those systems execute. It is the connective tissue between execution and intelligence memory.

---

## 9. MATURITY CLASSIFICATION

| Construct | Maturity |
|---|---|
| evidence_object contract | OPERATIONAL — 19 objects produced (NetBox 9 + StackStorm 10) |
| hero_moment contract | OPERATIONAL — 6 objects produced (NetBox 5, StackStorm 1) |
| replay_corridor contract | OPERATIONAL — 2 objects produced (NetBox 1 + StackStorm 1) |
| convergence_observation contract | OPERATIONAL — 5 objects produced (NetBox × StackStorm cross-specimen) |
| qualification_transition contract | DEFINED — produced at Step 2 |
| executive_projection_snapshot contract | DEFINED — produced at Step 3 |
| semantic_proposition contract | DEFINED — produced at Step 5 |
| doctrine_evolution_record contract | DEFINED — produced at Step 7 |
| Spine persistence layer | NOT_IMPLEMENTED — governance shape defined, storage not |
| Spine query interface | NOT_IMPLEMENTED |
| Spine replay validation | NOT_IMPLEMENTED |
| Cross-specimen accumulation | OPERATIONAL — 5 convergence_observations across 2 specimens |

---

## 10. OPERATIONAL ACTIVATION ROADMAP

High-level operational sequencing. Not backlog. Not implementation tasks. Not GTM.

### Current State

- Steps 1–4 COMPLETE
- NetBox onboarded through PATH A (Phases 1–3.7 PASS, 15 spine objects: 9 evidence, 5 hero moments, 1 replay)
- StackStorm onboarded as second specimen (Phases 1–3.7 PASS, 17 spine objects: 10 evidence, 1 hero moment, 1 replay, 5 convergence observations)
- LENS v2 renders both specimens at S1 structural-only (24 clusters NetBox, 57 clusters StackStorm)
- SQO V1/V2 cockpits operational for both specimens
- pallets-flask at S1 with permanent insufficiency
- BlueEdge at S2 (only semantically qualified specimen)
- 4 spine object classes OPERATIONAL: evidence_object, hero_moment, replay_corridor, convergence_observation
- Cross-specimen accumulation operational (2 specimens, 32 total spine objects)

### Operational Sequence

```
STEP 1 ── CONSOLIDATE
           Merge evolution model + NetBox onboarding to main.
           Main becomes clean integrated baseline with spine model + first specimen.
           Spine phase: 1 CONFIRMED

STEP 2 ── NETBOX COCKPIT ACTIVATION
           Produce SQO governance projection for NetBox (S0→S1).
           Enable cockpit rendering (posture-driven overview, not "unavailable").
           Produces: qualification_transition spine objects.
           Spine phase: 2 ACTIVATED

STEP 3 ── NETBOX STRUCTURAL DEMONSTRATION
           First live structural intelligence walkthrough using NetBox evidence.
           LENS v2 rendering with structural-only manifest.
           Capture: executive_projection_snapshot spine objects.
           Output: canonical demonstration corridor (replayable).
           Spine phase: 4 ACTIVATED

STEP 4 ── SECOND SPECIMEN ONBOARDING
           Select and onboard second S2 candidate through PATH A.
           Different architecture profile than NetBox (different language, size, or structure).
           Produces: evidence_objects + hero_moments + replay_corridor for specimen 2.
           Compare: structural patterns across NetBox and specimen 2.
           Produces: convergence_observation spine objects.
           Spine phase: 3 ACTIVATED

STEP 5 ── NETBOX SEMANTIC PROGRESSION
           Define NetBox CEU model. Run semantic derivation compiler.
           Produce candidate CSR. Begin S1→S2 qualification path.
           Produces: semantic_proposition spine objects.
           Spine phase: 5 ACTIVATED

STEP 6 ── COMMERCIAL PROOF POINT
           Package NetBox structural intelligence as Signäl/PMO structural assessment.
           First canonical case study with governed confidence boundaries.
           Replayable from spine evidence — not fabricated.

STEP 7 ── DOCTRINE SPINE ACTIVATION
           Governance streams begin producing doctrine_evolution_record spine objects.
           Retroactive records for prior streams optional.
           Spine phase: 6 ACTIVATED

STEP 8 ── FULL SPINE OPERATIONAL
           All 8 object classes producing. Cross-specimen accumulation active.
           Spine phase: 7 CONFIRMED
```

### Sequencing Rules

1. **Steps 1–2 are immediate.** No architectural decision needed — merge and project.
2. **Step 3 depends on LENS manifest support for structural-only clients.** May require resolver adjustment.
3. **Step 4 candidate selection uses the same S2 scoring criteria as NetBox.** No new methodology.
4. **Step 5 requires human CSR authoring.** Compiler assists, does not replace.
5. **Step 6 is commercial — requires packaging, not engineering.** Advisory-led, per the Signäl/PMO tier.
6. **Steps may overlap.** Step 4 can begin before Step 3 completes. Step 5 can begin before Step 4.
7. **Each step produces spine objects.** If a step completes without producing spine objects, it didn't happen.

### What This Roadmap Does NOT Cover

- Specific engineering tasks within each step
- Timeline or sprint assignments
- GTM sequencing beyond "Step 6 = first commercial proof"
- Agent implementation
- Persistence infrastructure
- Marketplace module development
- Temporal capability (EXSIG/TIMSIG)

---

## 11. AMENDMENT RULES

This document may be amended ONLY by:
1. A G1 governance stream with explicit scope to modify this document
2. User-initiated direction correction

Amendments must:
- Preserve append-only invariant
- Not reduce object contract strictness
- Not remove governance boundaries
- Be recorded as doctrine_evolution_record spine objects

No informal conversation may override this model.
