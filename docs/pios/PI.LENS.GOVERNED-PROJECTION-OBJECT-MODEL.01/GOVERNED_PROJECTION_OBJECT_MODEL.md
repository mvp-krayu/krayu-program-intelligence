# Governed Projection Object Model

Stream: PI.LENS.GOVERNED-PROJECTION-OBJECT-MODEL.01
Classification: G1 (architecture-mutating)
Date: 2026-05-24
Depends on: CURRENT_LENS_PROJECTION_REALITY_CHECK.md
Doctrine reference: BOARDROOM_PROJECTION_DOCTRINE.md (v2 — Rebalanced)

---

## Core Principle

**LENS consumes governed projection objects.**

LENS is a consumer of governed intelligence, not an interpreter of raw artifacts. Every visible field on every persona surface must trace to a governed projection object, which in turn traces to a resolved payload, which in turn traces to substrate artifacts.

No persona component invents intelligence. No resolver silently becomes a projection engine. No fallback creates specimen identity. No string replacement substitutes for governance.

---

## The Four Layers

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: SUBSTRATE ARTIFACTS                           │
│  Raw governed evidence and runtime state                │
│  Owner: Pipeline (40.x, 41.x, 75.x, SQO)               │
├─────────────────────────────────────────────────────────┤
│  LAYER 2: RESOLVED PAYLOAD                              │
│  Validated, normalized, altitude-neutral specimen facts  │
│  Owner: Resolver                                         │
├─────────────────────────────────────────────────────────┤
│  LAYER 3: GOVERNED PROJECTION OBJECTS                   │
│  Altitude-aware, persona-consumable intelligence         │
│  Owner: Projection Compiler                              │
├─────────────────────────────────────────────────────────┤
│  LAYER 4: PERSONA SURFACES                              │
│  Rendering, layout, interaction pacing                   │
│  Owner: Components (BOARDROOM, BALANCED, DENSE, INV.)    │
└─────────────────────────────────────────────────────────┘
```

Each layer has one owner. Each layer has defined inputs and outputs. Each boundary has explicit allowed and forbidden transformations.

---

## Layer 1: Substrate Artifacts

### Definition

Raw governed evidence and runtime state produced by the PI pipeline. These are the structural truth the entire system derives from.

### Examples

| Artifact | Source | Content |
|---|---|---|
| `signal_registry.json` | 75.x condition correlation | Raw signal activations with values, thresholds, entities |
| `promotion_state.json` | SQO | S-level, transitions, lineage, authority ceiling |
| `semantic_topology_model.json` | CEU | Domains, clusters, edges, confidence, zone anchors |
| `dpsig_signal_set.json` | DPSIG derivation | Topology signals with engineering/executive summaries |
| `proposition_review_state.json` | SQO operator workflow | Disposition counts, review events |
| `revalidation_result.json` | SQO deterministic replay | Pass/fail per check |
| `constitutional_replay_anchor.json` | SQO constitutional gate | Advancement block status |
| `convergence_observations.json` | Cross-specimen analysis | Convergences, divergences |
| `chronicle_certification.json` | Chronicle pipeline | Certification status |
| `canonical_topology_40_4.json` | 40.4 code graph | Clusters, nodes, counts |
| `spine_objects.json` | SPE/governance | Spine objects for narrative |
| `enrichment artifacts` | Enrichment pipeline | Evidence corrections, confidence deltas |

### Rules

- Substrate artifacts are READ ONLY for LENS
- Never rendered directly at executive altitude
- Never modified by LENS
- Provenance is immutable — hash, commit, timestamp
- Specimen-bound — no cross-run contamination

### Authority

Pipeline governance. LENS has no authority over substrate content.

---

## Layer 2: Resolved Payload

### Definition

The altitude-neutral, validated, specimen-specific data bundle produced by resolution. Contains structural facts derived from substrate artifacts. Answers: **"What governed facts exist for this specimen?"**

Does NOT answer: "How should BOARDROOM say this to an executive?"

### Responsibilities

1. **Load** substrate artifacts from manifest paths
2. **Validate** artifact existence, schema, integrity
3. **Normalize** structural data into consistent shapes (domain registry, signal families, cluster topology)
4. **Derive** structural facts deterministically (Q-class, grounding ratio, render state, topology maturity)
5. **Compile** cross-artifact relationships (crosswalk resolution, reconciliation, propagation chain identification)

### Output Shape

The resolved payload contains altitude-neutral facts organized by domain:

| Domain | Fields | Content |
|---|---|---|
| **Identity** | client, run_id, baseline_commit, baseline_tag, generated_at | Specimen identity |
| **Qualification** | s_level, qualifier_class, render_state, evidence_availability | Deterministic Q-class derivation |
| **Topology** | semantic_domain_registry, cluster_registry, edges, crosswalk | Domain/cluster structure |
| **Topology Statistics** | domain_count, backed_count, semantic_only_count, grounding_ratio | Structural coverage facts |
| **Signals** | normalized signal array (id, family, value, severity, activation_state) | Signal facts without interpretation |
| **Pressure Zones** | zone_id, zone_class, zone_anchor_domain, zone_anchor_cluster | Structural concentration facts |
| **Propagation** | origin/passthrough/receiver cluster identification, chain existence | Propagation chain structural facts |
| **Governance Lifecycle** | s_level, transitions, provenance, authority_ceiling | Lifecycle state facts |
| **Propositions** | total, accepted, rejected, arbitrated, friction_rate | Corpus state facts |
| **Enrichment** | enrichment_events, confidence_delta, debt_evolution | Enrichment state facts |
| **Revalidation** | status, total_checks, pass_count | Revalidation outcome facts |
| **Constitutional Anchor** | advancement_blocked, checks | Anchor gate facts |
| **Convergence** | total_observations, convergences, divergences | Cross-specimen facts |
| **Chronicle** | certification_status, checkpoint_count | Chronicle state facts |
| **Evidence** | trace_chains, reproducibility_verdict | Evidence state |
| **Structural Enrichment** | code_graph stats, centrality | Code graph structural facts |
| **Provenance** | hashes, commits, governance_assertions | Audit trail |

### Forbidden in Resolved Payload

- Executive prose or narrative text
- Persona-specific language
- Altitude-aware interpretation
- Signal captions or boardroom interpretations
- Business-label derivation for pressure zones (this is projection — mapping CLU-04 to "Platform Infrastructure and Data" is interpretation, not resolution)
- Compound narratives or co-presence prose
- Header/title prose
- Readiness score/band/posture (legacy projection model)

**Exception — zone anchor domain name:** The zone anchor business label requires crosswalk resolution (structural → semantic domain mapping). This is a resolution-adjacent operation because it resolves a structural cluster to its semantic domain name using the crosswalk. It is the boundary case. The resolved payload MAY contain the zone anchor domain name as a structural fact (it's a lookup, not interpretation). But it must NOT contain the prose "Structural load concentrated in X" — that's projection.

### Owner

`GenericSemanticPayloadResolver` (after extraction of projection responsibilities).

### Authority Ceiling

No interpretation. Pure structural derivation. Deterministic: same inputs → same output. No 75.x required.

---

## Layer 3: Governed Projection Objects

### Definition

Altitude-aware, persona-consumable intelligence objects produced by a projection compiler from the resolved payload. Each projection object contains semantic language appropriate to its target persona, bounded interpretation under explicit authority, proof references, and source lineage.

Answers: **"How should this governed intelligence be consumed at this altitude?"**

### Responsibilities

1. **Select** which resolved payload fields are relevant for this persona altitude
2. **Interpret** structural facts into altitude-appropriate language (under 75.x bounded authority)
3. **Compose** governed prose from structural facts (narrative, signal captions, tension summaries)
4. **Declare** authority (75.x declaration, L3 ceiling, evidence-traced)
5. **Reference** proof lineage (spine objects, governance events, checkpoint refs)
6. **Gate** information density (BOARDROOM sees family-level tension; DENSE sees per-signal mechanics)

### Projection Object Types

| Object | Persona | Altitude | Primary Consumer |
|---|---|---|---|
| `boardroom_projection` | BOARDROOM | Executive | Board, C-suite |
| `balanced_projection` | BALANCED | Operational-executive | Senior leadership |
| `dense_projection` | DENSE | Structural-operational | Technical leadership |
| `investigation_projection` | INVESTIGATION | Forensic | Analysts |

Each projection object type has its own contract (defined separately per Phase 3 of implementation). BOARDROOM is first.

### What Projection Objects Contain

Every projection object includes these sections:

| Section | Purpose |
|---|---|
| **Identity** | specimen_id, projection_id, persona, altitude, generated_at |
| **Qualification Posture** | s_level, qualification_method, governed/legacy distinction |
| **Intelligence Summary** | tension count, pressure zone, domain coverage — at persona altitude |
| **Signal Summaries** | per-family tension summaries at persona altitude (not raw signals for BOARDROOM; raw signals for INVESTIGATION) |
| **Governance Legitimacy** | lifecycle summary, replay status, certification, convergence — at persona altitude |
| **Topology Reference** | pointer to topology data (not embedded), governance overlay state |
| **Chronicle Descent** | available descent paths, depth appropriate to persona |
| **Authority Declaration** | 75.x, L3 ceiling, evidence-traced, 13 prohibitions |
| **Proof References** | spine object IDs, governance event IDs, checkpoint refs |
| **Source Lineage** | resolved_payload hash, substrate artifact hashes |

### Forbidden in Projection Objects

- Raw substrate artifact content (file paths, CLU-IDs, signal_value floats, population_size)
- Engineering prose (threshold ratios, activation methods, population types)
- Rendering instructions (CSS classes, layout hints, component names)
- Cross-persona content (a boardroom projection must not contain dense-altitude mechanics)
- Fabricated intelligence (claims not derivable from resolved payload)
- Uncited interpretation (every prose sentence must trace to evidence)

### Owner

Projection Compiler — a new module that takes resolved payload + persona + authority declaration and produces a governed projection object. One compiler per persona, or a single parameterized compiler.

### Authority Ceiling

75.x bounded interpretive authority. L3 ceiling for AI-derived interpretation. 13 prohibitions enforced (no team behavior, no organizational intent, no personnel attribution, etc. per CLAUDE.md §3.4.1).

---

## Layer 4: Persona Surfaces

### Definition

React components that render governed projection objects. They own layout, density, interaction pacing, visual hierarchy, and user affordances. They do NOT derive new semantic meaning.

### Responsibilities

1. **Render** projection object fields into visual elements
2. **Layout** zones, panels, instruments according to persona design
3. **Interact** — handle clicks, hovers, mode transitions, topology exploration
4. **Gate depth** — disclosure wrappers, progressive reveal, descent affordances
5. **Style** — colors, typography, spacing per persona tone

### Forbidden in Persona Surfaces

- Deriving semantic meaning from raw data (no `signal.interpretation` template literals)
- Constructing narrative prose (no inline `\`${count} pressure dimensions active\``)
- Selecting altitude (the projection object already encodes altitude)
- Hardcoded caption maps (these belong in the projection compiler)
- Fallback identity generation (no `|| 'Coordination group'`)
- Cross-persona field access (BOARDROOM must not read dense-altitude fields)

### Owner

Component tree (IntelligenceField, DeclarationZone, ExecutiveInterpretation, etc.)

### Authority Ceiling

Deterministic rendering. No interpretation. No 75.x required. Pure display of governed projection objects.

---

## Boundary Rules

### Layer 1 → Layer 2 (Substrate → Resolved Payload)

| Allowed | Forbidden |
|---|---|
| Load artifacts by manifest path | Modify substrate artifacts |
| Validate schema and integrity | Invent missing data |
| Normalize into consistent shapes | Interpret meaning |
| Derive Q-class deterministically | Generate prose |
| Resolve crosswalk (structural → semantic) | Apply persona-specific logic |
| Identify propagation chain structure | Select altitude |

### Layer 2 → Layer 3 (Resolved Payload → Projection Objects)

| Allowed | Forbidden |
|---|---|
| Select fields relevant to persona | Add data not in resolved payload |
| Interpret structural facts into altitude-appropriate language | Fabricate claims |
| Compose governed prose under 75.x | Generate recommendations |
| Declare authority and proof references | Prescribe action |
| Gate information density by altitude | Diagnose organizational behavior |
| Map structural IDs to business-domain language | Attribute to personnel |

### Layer 3 → Layer 4 (Projection Objects → Persona Surfaces)

| Allowed | Forbidden |
|---|---|
| Render projection object fields | Derive new semantic meaning |
| Choose layout and visual hierarchy | Construct narrative prose |
| Handle user interaction | Apply hardcoded caption maps |
| Apply persona-appropriate styling | Generate fallback identity |
| Provide depth affordances (disclosure, descent) | Access fields from wrong altitude |

---

## Cross-Cutting Concerns

### Chronicle

Chronicle is **proof substrate**, not a LENS surface.

- Chronicle artifacts (certification, checkpoint refs) enter the resolved payload as structural facts
- The projection compiler includes chronicle descent paths appropriate to persona altitude
- BOARDROOM gets: "Replay-certified" + descent link. Not embedded chronicle content.
- INVESTIGATION gets: checkpoint details, governance event lineage, deeper descent
- LENS links INTO chronicle at controlled depth. LENS does not embed or replace chronicle.

### SVG Topology

SVG topology is a **governed projection artifact**.

- The semantic domain registry and cluster topology enter the resolved payload as structural facts
- The projection compiler determines which governance overlays are appropriate for the persona altitude
- The SVG component renders the topology from resolved payload data (domain positions, edges, grounding status)
- Pressure zone overlays, proposition state indicators, and governance markers are projection-level decisions
- SVG must remain specimen-bound — no cross-run topology contamination

**Current status:** SVG rendering reads from `fullReport.semantic_domain_registry` directly. This is acceptable as interim because the domain registry is a structural fact (Layer 2), not a projection (Layer 3). The governance overlays (grounding colors, pressure zone highlighting) are simple visual mappings, not semantic interpretation.

### Validation Pipeline

The validation pipeline (`validateReportObjectPipeline`) currently validates the resolver output (Layer 2 + Layer 3 collapsed). In the target architecture:

- Layer 2 validation: structural completeness, schema conformance, Q-class consistency
- Layer 3 validation: authority declaration present, proof references resolve, altitude consistency
- Layer 4 validation: not applicable (rendering is visual, not structural)

### fullReport Transition

`fullReport` is the current compatibility envelope that collapses Layers 2 and 3.

**Transition plan:**

| Phase | fullReport role |
|---|---|
| Current (INTERIM) | Compatibility envelope. Contains Layer 2 + Layer 3 collapsed. All personas consume it directly. |
| Phase 2 | Resolver produces resolved payload (Layer 2). Projection compiler produces projection objects (Layer 3). fullReport becomes an adapter that wraps both for backward compatibility. |
| Phase 3 | Persona components consume projection objects directly. fullReport deprecated for new code. Retained for legacy adapter paths. |
| Phase 4+ | fullReport removed when all consumers migrate. |

---

## Interim Classification Map

Current code classified against the 4-layer model:

| Current Location | Content | Correct Layer | Classification |
|---|---|---|---|
| `GenericSemanticPayloadResolver` — artifact loading | Load, validate, normalize | Layer 2 | CORRECTLY_LOCATED |
| `GenericSemanticPayloadResolver` — Q-class/render state | Deterministic derivation | Layer 2 | CORRECTLY_LOCATED |
| `GenericSemanticPayloadResolver` — domain registry | Crosswalk resolution | Layer 2 | CORRECTLY_LOCATED |
| `GenericSemanticPayloadResolver` — zone anchor label | Structural → semantic lookup | Layer 2 (boundary) | ACCEPTABLE_INTERIM |
| `GenericSemanticPayloadResolver` — `buildSignalInterpretations()` | Signal interpretation prose, boardroom captions | Layer 3 | INTERIM_MISLOCATED |
| `GenericSemanticPayloadResolver` — `project*()` governance functions | Governance lifecycle summaries | Layer 3 | INTERIM_MISLOCATED |
| `GenericSemanticPayloadResolver` — narrative/header blocks | Prose composition | Layer 3 | INTERIM_MISLOCATED |
| `GenericSemanticPayloadResolver` — evidence block prose | Operational-altitude descriptions | Layer 3 | INTERIM_MISLOCATED |
| `GoverningNarrativeComposer` | 75.x bounded narrative | Layer 3 | CORRECTLY_SEPARATED (wrong caller) |
| `CockpitSignalBar` — `governed` prop selecting `boardroom_interpretation` | Altitude selection | Layer 4 (acceptable) | ACCEPTABLE_INTERIM |
| `DeclarationZone` — governed branch | Prose composition from fullReport | Layer 3 + 4 collapsed | INTERIM_MISLOCATED |
| `ExecutiveInterpretation` — governed branch | Left panel prose from fullReport | Layer 3 + 4 collapsed | INTERIM_MISLOCATED |
| `IntelligenceField` — cockpit finding/narrative | Prose composition from fullReport | Layer 3 + 4 collapsed | INTERIM_MISLOCATED |

---

## Implementation Sequence

### Phase 1 — Contract Lock (this document)

- Reality check complete ✓
- Governed Projection Object Model defined (this document)
- BOARDROOM Projection Object Contract (next)
- Vault propagation complete ✓
- All current implementation classified as INTERIM

### Phase 2 — BOARDROOM Projection Builder

- Create `BoardroomProjectionCompiler` module
- Input: resolved payload (subset of current fullReport Layer 2 fields)
- Output: `boardroom_projection` object per contract
- Extract boardroom_interpretation caption maps from resolver into compiler
- Extract governed cockpit finding/narrative composition into compiler
- Extract governance legitimacy prose into compiler
- BOARDROOM components consume `boardroom_projection` instead of `fullReport` ad hoc

### Phase 3 — Resolver Extraction

- Extract `project*()` governance functions to projection layer
- Extract `buildSignalInterpretations()` to projection layer
- Extract narrative/header block composition to projection layer
- Resolver produces clean resolved payload
- fullReport becomes adapter wrapping resolved payload + projection objects

### Phase 4 — Remaining Persona Projections

- BALANCED projection compiler (after BOARDROOM boundary proven)
- DENSE projection compiler
- INVESTIGATION projection compiler
- Each written from implementation experience, not pre-specification

### Phase 5 — Projection Certification

- Every visible field traces to projection object
- No legacy fallback contamination
- Governed and legacy runs separated by projection, not by component branching
- Validation pipeline updated for 2-layer validation

---

## Governing Constraints

1. **INTELLIGENCE + QUALIFICATION + CONTROLLED DESCENT + PROOF.** Per BOARDROOM_PROJECTION_DOCTRINE.md: governance envelopes intelligence, it does not replace intelligence. Projection objects must carry both.

2. **Same structural truth, different projection depths.** Per canonical persona doctrine. The four projection objects derive from the same resolved payload. They differ in altitude, density, and language — not in structural truth.

3. **No resolver growth.** GenericSemanticPayloadResolver must not gain additional `boardroom_*`, persona-specific, or interpretive fields. New projection work goes into the projection compiler.

4. **Backward compatibility.** Legacy runs (without governed lifecycle) must continue to work throughout the transition. The projection compiler must handle both governed and legacy resolved payloads.

5. **75.x bounded authority.** All projection prose falls under 75.x bounded interpretive authority. 13 prohibitions enforced. L3 ceiling for AI-derived interpretation. Structural derivation remains primary.

6. **Evidence-traced.** Every sentence in a projection object must trace to structural evidence in the resolved payload. No fabricated claims. No uncited interpretation.
