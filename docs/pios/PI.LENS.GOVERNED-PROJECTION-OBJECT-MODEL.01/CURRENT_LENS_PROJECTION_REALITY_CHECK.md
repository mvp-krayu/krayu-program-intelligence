# CURRENT LENS PROJECTION REALITY CHECK

Stream: PI.LENS.GOVERNED-PROJECTION-OBJECT-MODEL.01
Classification: G1 (architecture-mutating)
Date: 2026-05-24
Baseline: 3dcf894 (INTERIM governed BOARDROOM patches)

---

## 1. What does GenericSemanticPayloadResolver currently do?

`GenericSemanticPayloadResolver.js` (1,179 lines) is the single function that transforms a client/run manifest into the `fullReport` object consumed by all four LENS personas. It performs **six distinct responsibilities** in a single pass:

| Responsibility | Functions | Lines (approx) | Layer |
|---|---|---|---|
| Artifact loading + validation | `loadArtifacts()` (delegated), source checks | ~80 | Resolution |
| Structural derivation | `deriveStructuralEnrichment()`, `classifyTopologyMaturity()`, domain registry construction, zone anchor derivation, crosswalk resolution | ~250 | Resolution |
| Actor hydration + Q-class | `hydrateActors()` (delegated), qualifier derivation, render state | ~30 (call site) | Resolution |
| Signal interpretation | `buildSignalInterpretations()`, compound narrative, co-presence, boardroom_interpretation | ~130 | **Projection** |
| Governance lifecycle projection | `projectGovernanceLifecycle()`, `projectPropositionCorpus()`, `projectEnrichmentIntelligence()`, `projectRevalidationIntelligence()`, `projectConstitutionalAnchor()`, `projectConvergenceIntelligence()`, `projectChronicleCertification()` | ~240 | **Projection** |
| Narrative composition | `composeGoverningNarrative()` (delegated), header/narrative block construction | ~60 | **Projection** |
| Output assembly | Evidence blocks, propagation summary, trace block, reconciliation, topology summary, report pack, module registry | ~200 | Mixed |

**Conclusion:** The resolver performs resolution AND projection in a single function. Approximately 430 lines (37%) are projection work that does not belong in a resolver.

---

## 2. Which parts are pure resolution?

Functions that load, validate, normalize, and structurally derive — producing altitude-neutral facts:

- **`loadArtifacts()`** — reads files from manifest paths, validates existence (delegated to `GenericSemanticArtifactLoader`)
- **`deriveStructuralEnrichment()`** — computes code graph statistics from raw data
- **`classifyTopologyMaturity()`** — classifies topology state from structural facts
- **`hydrateActors()`** — derives Q-class, render state, qualifier from structural inputs (delegated to `GenericActorHydrator` / `SemanticActorHydrator`)
- **`projectDPSIGSignalSet()`** / **`projectPSIGSignals()`** — map raw signal data into normalized shapes (delegated to `DPSIGSignalMapper`)
- **`buildCrosswalkIndex()`** / **`resolveCanonicalCluster()`** — crosswalk structural matching (delegated to mappers)
- **`compileCorrespondence()`** — reconciliation computation (delegated to `ReconciliationCorrespondenceCompiler`)
- **Domain registry construction** (lines 730-770) — maps clusters to domains with crosswalk resolution
- **Zone anchor derivation** (lines 699-720) — identifies primary pressure zone from semantic domain registry
- **Evidence block construction** (lines 776-792) — triadic propagation chain from canonical topology

These produce specimen-specific, altitude-neutral structural facts. This is resolver work.

---

## 3. Which parts are projection?

Functions that derive persona-consumable intelligence objects — altitude-aware, interpretive:

### 3a. Signal interpretation projection (lines 243-368)

`buildSignalInterpretations()` does three things:
1. **Maps DPSIG signals** — transfers `executive_summary` from raw data (resolution)
2. **Generates PSIG/ISIG interpretations** — constructs interpretation text inline: `"coupling_pressure: architectural pressure at Level 2."` (projection)
3. **Generates `boardroom_interpretation`** — constructs executive-altitude text using hardcoded caption maps and template literals (projection)

The function also generates `co_presence` narrative, `compound_narrative`, and `confidence_note` — all prose generation, not resolution.

### 3b. Governance lifecycle projection (lines 370-601)

Seven `project*()` functions that transform raw governance artifacts into consumption-ready summaries:

| Function | Input | Output shape | Projection? |
|---|---|---|---|
| `projectGovernanceLifecycle()` | promotion_state.json | `{ s_level, transitions, authority_ceiling, ... }` | Yes — derives `qualification_provenance` string |
| `projectPropositionCorpus()` | proposition_review_state.json | `{ total, disposition_counts, governance_friction_rate, ... }` | Yes — computes friction rate |
| `projectEnrichmentIntelligence()` | enrichment artifacts | `{ enrichment_events, confidence_delta, ... }` | Yes — summarizes enrichment impact |
| `projectRevalidationIntelligence()` | revalidation_result.json | `{ status, total_checks, pass_count, ... }` | Yes — projects pass/fail |
| `projectConstitutionalAnchor()` | constitutional_replay_anchor.json | `{ advancement_blocked, ... }` | Yes — projects advancement gate |
| `projectConvergenceIntelligence()` | convergence_observations.json | `{ total_observations, convergences, divergences, ... }` | Yes — structures cross-specimen |
| `projectChronicleCertification()` | chronicle_certification.json | `{ certification_status, ... }` | Yes — projects certification gate |

These are legitimate projection functions. They transform substrate artifacts into consumable intelligence. But they live inside the resolver instead of a projection layer.

### 3c. Narrative composition (delegated)

`composeGoverningNarrative()` (in `GoverningNarrativeComposer.js`) generates governed prose from spine objects. This is explicitly projection — 75.x bounded interpretive authority. It's correctly separated into its own module but called from within the resolver.

### 3d. Header and narrative block construction (lines 800-920)

Constructs `header_block` and `narrative_block` objects with prose like:
- `"Structural topology active across N clusters"`
- `"Compound pressure zone centers on X"`
- `"N of M semantic domains are structurally backed"`

This is interpretation at operational altitude. It's projection work embedded in resolver output assembly.

---

## 4. Which parts are narrative interpretation?

Three categories of inline prose generation:

### 4a. Signal captions (INTERIM)

`boardroom_interpretation` field — hardcoded caption maps:
```javascript
const BOARDROOM_PSIG_CAPTIONS = {
  coupling_pressure: 'Cross-domain coupling exceeds structural norms...',
  domain_coupling_pressure: 'Domain-level interdependency is elevated...',
  ...
};
```
Generated inside `buildSignalInterpretations()`. No governance declaration, no authority ceiling, no lineage.

### 4b. Compound narrative

```javascript
const compoundNarrative = activatedSignals.length > 0
  ? `Compound pressure zone centers on "${zoneAnchorBusinessLabel}". ...`
  : null;
```
Inline template literal. Uses structural facts but produces executive-altitude prose.

### 4c. Evidence block prose

```javascript
evidence_text: `Origin group carries the dominant cluster mass across ${cluster.node_count} components.`
```
Per-evidence-block prose at operational altitude. Generated in `clusterToEvidenceBlock()`.

---

## 5. Which parts are fallback cleanup?

Two categories:

### 5a. Zone anchor fallback chain (FIXED in 3dcf894)

Previously: `|| 'Coordination group'` — hardcoded fallback that leaked non-specimen identity.
Now: semantic domain registry derivation → DPSIG normalization basis → `'Primary structural zone'`.

The fallback chain is longer but honest. Still, the fact that zone anchor naming requires a 10-line derivation function inside the resolver indicates this is projection work (deriving a business label from structural topology), not resolution work.

### 5b. Signal interpretation fallback

PSIG/ISIG signals that don't match the boardroom caption map get generic fallbacks:
```javascript
|| (domainForEntity ? `Architectural pressure detected in "${domainForEntity}".` : `Architectural binding pressure at structural level.`)
```
These are acceptable as generic fallbacks but they're interpretation, not resolution.

---

## 6. Which parts are legacy compatibility?

Lines 1085-1102 are explicitly marked:

```javascript
// Fixture-compatible fields for the existing flagshipOrchestration adapter.
report_id: `${client.toUpperCase()}-${runId.toUpperCase()}`,
baseline_ref: baselineTag,
stream_ref: manifest.stream_anchor || '...',
evidence_object_hash: ...,
governance_verdict: 'PASS',
readiness_state: derived.render_state,
qualifier_class: derived.qualifier_class_compat || ...,
```

These duplicate information already present in `qualifier_summary`, `trace_summary`, etc. They exist because the `flagshipOrchestration` adapter expects this flat shape. They are compatibility fields that should eventually be consumed from the structured summaries.

Additional legacy patterns:
- `readiness_summary` contains `score`, `band`, `posture` — legacy readiness model that pre-dates governed lifecycle
- `rendering_metadata` compatibility wrapper
- `module_registry` — fixture compatibility

---

## 7. Where does `boardroom_interpretation` live?

Inside `buildSignalInterpretations()` in `GenericSemanticPayloadResolver.js`, lines ~283-350.

It is:
- Generated per-signal using hardcoded caption maps and template string substitution
- Stored as a field on each signal interpretation object in the `signal_interpretations` array
- Consumed by `CockpitSignalBar` component when `governed` prop is true
- Has no authority declaration, no governance lineage, no versioning
- Has no schema definition — the field name is not in any contract

---

## 8. Why is it currently a patch?

Because it solves the right problem (executive-altitude signal language for governed BOARDROOM) in the wrong location (inline in a resolver function) using the wrong mechanism (hardcoded caption maps + string replacement).

Specifically:
- The caption maps (`BOARDROOM_PSIG_CAPTIONS`, `BOARDROOM_ISIG_CAPTIONS`) are static — they don't derive from the specimen's governance state
- The DPSIG boardroom interpretation uses regex replacement on `executive_summary` — string manipulation as governance
- The field is selected by a boolean prop (`governed`) on a component — altitude selection at the rendering layer
- There is no intermediate projection object that BOARDROOM consumes — the component reaches directly into `fullReport.signal_interpretations[n].boardroom_interpretation`

---

## 9. What must be extracted into governed projection objects?

### Must extract:

1. **Signal interpretation at altitude** — `boardroom_interpretation`, `interpretation`, `engineering_detail` should be altitude-keyed fields on a projection object, not ad hoc fields on a resolver output
2. **Governance lifecycle summary** — the seven `project*()` functions produce genuine projection objects. They should live in a projection layer, not inline in the resolver
3. **Narrative composition** — `composeGoverningNarrative()` is already separated but called from the wrong layer
4. **Zone anchor business label derivation** — projection work (deriving executive naming from structural topology)
5. **Compound narrative and co-presence prose** — executive-altitude generated text
6. **Evidence block prose** — `evidence_text`, `evidence_description` are operational-altitude projections

### Should extract (lower priority):

7. **Header block and narrative block** — currently constructed inline with altitude-specific prose
8. **Propagation summary business label** — `primary_zone_business_label`
9. **Topology summary coverage classification** — maps Q-class to coverage label (projection logic)

---

## 10. What is acceptable temporarily?

The following can remain in the resolver as INTERIM classification:

- **The seven `project*()` governance functions** — they're clean, well-separated, and produce honest projection objects. They just live in the wrong file. Moving them is a refactor, not a redesign.
- **`boardroom_interpretation` field** — works correctly, verified in browser, legacy-safe. The field exists and is consumed. Its location is wrong but its content is right.
- **Legacy compatibility fields** — report_id, baseline_ref, etc. These are consumed by `flagshipOrchestration` and removing them requires adapter changes.
- **`readiness_summary` with score/band/posture** — legacy readiness model still consumed by non-governed runs.

---

## 11. What is blocking true consumer-layer architecture?

Three structural blockers:

### 11a. No projection layer exists

There is no module, function, or file whose job is: "take resolved payload, produce altitude-aware projection objects." The resolver does both. Components reach into `fullReport` and select fields ad hoc.

### 11b. `fullReport` is the only handoff

Every persona receives the same `fullReport` object. BOARDROOM, BALANCED, DENSE, and INVESTIGATION all get the entire bag. Altitude selection happens inside each component — each component decides what to show and what to hide. There's no contract that says "BOARDROOM receives X, DENSE receives Y."

### 11c. No persona consumption contract

Each persona component individually decides:
- Which fields of `fullReport` to read
- What prose to generate from those fields
- What altitude to render at
- What to hide

This means persona altitude is enforced by convention (code review) not by contract (type system / schema).

---

## 12. What can safely remain for this phase?

The following should NOT be refactored in Phase 1:

- **The seven `project*()` governance functions** — they're already clean projections. Moving them to a separate file is Phase 2 work.
- **`flagshipOrchestration` adapter** — legacy compatibility layer. Changing it requires coordinated adapter updates.
- **BALANCED/DENSE/INVESTIGATION components** — they consume `fullReport` directly. Refactoring them requires the projection layer to exist first.
- **Validation pipeline** (`validateReportObjectPipeline`)— validates the resolver output. Must be updated when the output shape changes, not before.
- **`hydrateActors()` / Q-class derivation** — pure resolution. Correctly located.
- **`compileCorrespondence()`** — pure resolution. Correctly located.

---

## Output Object Field Inventory

The `resolveSemanticPayload()` return object contains **42 top-level fields**. Classification:

### Resolution (altitude-neutral facts) — 22 fields

| Field | Purpose |
|---|---|
| `schema_version` | Version tag |
| `client` | Specimen identifier |
| `run_id` | Run identifier |
| `baseline_governance_tag` | Git baseline |
| `baseline_commit` | Git commit |
| `generated_at` | Timestamp |
| `dpsig_signal_summary` | Raw DPSIG projection (normalized, not interpreted) |
| `semantic_domain_registry` | Domain list with grounding status |
| `semantic_cluster_registry` | Cluster list |
| `semantic_topology_edges` | Edge list |
| `semantic_crosswalk` | Cluster-to-domain resolution |
| `topology_summary` | Domain counts, grounding ratio |
| `evidence_summary` | Signal counts, verdict |
| `trace_summary` | Hashes, provenance |
| `qualifier_summary` | Q-class derivation with full audit trail |
| `actor_registry` | Hydrated actor states |
| `actor_hydration_status` | Actor status map |
| `unresolved_gaps` | Missing artifact list |
| `governance_assertions` | Replay-safety declarations |
| `source_artifacts` | Artifact paths consumed |
| `structural_enrichment` | Code graph stats |
| `topology_maturity` | Topology classification |

### Projection (altitude-aware intelligence) — 12 fields

| Field | Purpose | Altitude |
|---|---|---|
| `signal_interpretations` | Signal objects with `interpretation`, `boardroom_interpretation`, prose | Multi-altitude |
| `evidence_blocks` | Propagation chain with prose descriptions | Operational |
| `narrative_block` | Executive/structural narrative prose | Operational |
| `header_block` | Title, subtitle, badge text | Executive |
| `governed_narrative` | 75.x bounded narrative from spine objects | Executive |
| `governance_lifecycle` | Projected governance state | Multi-altitude |
| `proposition_corpus` | Projected proposition summary | Multi-altitude |
| `enrichment_intelligence` | Projected enrichment impact | Operational |
| `revalidation_intelligence` | Projected revalidation outcome | Multi-altitude |
| `constitutional_anchor` | Projected anchor gate | Multi-altitude |
| `convergence_intelligence` | Projected cross-specimen observations | Executive |
| `chronicle_certification` | Projected certification status | Multi-altitude |

### Legacy compatibility — 6 fields

| Field | Purpose |
|---|---|
| `report_id` | Fixture adapter |
| `baseline_ref` | Fixture adapter |
| `stream_ref` | Fixture adapter |
| `evidence_object_hash` | Fixture adapter |
| `derivation_hash` | Fixture adapter |
| `governance_verdict` | Fixture adapter (always 'PASS') |

### Mixed (resolution + projection collapsed) — 5 fields

| Field | Purpose |
|---|---|
| `readiness_state` | Derived render state (resolution) consumed as display state (projection) |
| `readiness_summary` | Score/band/posture (legacy projection) |
| `governance_summary` | Lane impact flags (resolution) + governance_verdict (projection) |
| `propagation_summary` | Zone evidence (resolution) + business_label (projection) |
| `report_pack` | Report availability flags |

### Rendering/interaction — 4 fields

| Field | Purpose |
|---|---|
| `rendering_metadata` | Compatibility wrapper |
| `explainability_bundle` | Report pack metadata |
| `interaction_registry` | Empty stub |
| `module_registry` | Fixture compatibility |

---

## Architectural Diagnosis

```
CURRENT STATE:

  Substrate Artifacts
       │
       ▼
  GenericSemanticPayloadResolver (RESOLUTION + PROJECTION collapsed)
       │
       ▼
  fullReport (42-field emergent bag — no contract)
       │
       ├──→ validateReportObjectPipeline() (validates resolver output)
       │
       ├──→ adaptReport() (compatibility adapter)
       │
       ▼
  orchestrateFlagshipExperience()
       │
       ▼
  Component tree (BOARDROOM / BALANCED / DENSE / INVESTIGATION)
       │
       └──→ each component selects fields ad hoc from fullReport
            and derives altitude-specific rendering inline


TARGET STATE:

  Substrate Artifacts
       │
       ▼
  Resolver (RESOLUTION ONLY — structural facts, altitude-neutral)
       │
       ▼
  Resolved Payload (contracted, validated, altitude-neutral)
       │
       ▼
  Projection Compiler (per-persona, governed, altitude-aware)
       │
       ├──→ boardroom_projection (contracted)
       ├──→ balanced_projection (contracted)
       ├──→ dense_projection (contracted)
       └──→ investigation_projection (contracted)
              │
              ▼
  Persona Components (rendering only — no semantic derivation)
```

---

## Interim Classification

All BOARDROOM projection work currently inside GenericSemanticPayloadResolver is classified as:

**INTERIM_RESOLVER_EMBEDDED_PROJECTION**

This classification means:
- The code works correctly and is verified
- The code lives in the wrong architectural layer
- The code will be extracted when the projection layer is built
- No further projection work should be added to the resolver without acknowledging this classification
- The resolver should not grow additional `boardroom_*` or persona-specific fields

Committed baseline for this classification: `3dcf894`.
