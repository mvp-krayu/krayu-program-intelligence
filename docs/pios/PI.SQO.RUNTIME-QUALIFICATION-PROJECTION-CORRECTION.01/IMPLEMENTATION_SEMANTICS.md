# Implementation Semantics — PI.SQO.RUNTIME-QUALIFICATION-PROJECTION-CORRECTION.01

## §5.5 Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| resolveClientScopedSection | ClientScopedSectionResolver.server.js | Single dispatch gate for client-scoped section data | REUSABLE — entry point for any future section data resolution |
| resolveQualificationPosture | QualificationPostureResolver.js | 8-state posture model from operational data | REUSABLE — pure function, any consumer can call with promotionState + blockers + capabilities |
| resolveSemanticQualificationIntake | SemanticQualificationIntakeResolver.server.js | Layer B semantic intake data from compiler output | REUSABLE — produces standard view model from compiler artifacts |

## Input Contracts

### ClientScopedSectionResolver.resolveClientScopedSection(client, runId, section)

**Consumed:**
- `client` (string): Client identifier
- `runId` (string): Run identifier
- `section` (string): Section key — one of: `semantic-candidates`, `ceu-admissibility`, `evidence-ingestion`, `corridor`, `evidence-rebase`

**Dependencies:**
- SQORuntimeResolver.resolveRuntimeSubstrates(client, runId) — for capabilities and sectionAvailability
- For BlueEdge: Existing loaders (ExplicitEvidenceRebaseExtractor, BlueEdgeEvidenceIngestionLoader, BlueEdgeRuntimeCorridorLoader) and view model builders
- For non-BlueEdge semantic-candidates: SemanticQualificationIntakeResolver

### QualificationPostureResolver.resolveQualificationPosture(promotionState, qualificationBlockers, runtimeCapabilities)

**Consumed:**
- `promotionState` (object|null): Raw promotion_state.json content — expects fields: `s_level`, `insufficiency_permanent`, `insufficiency_acknowledged`
- `qualificationBlockers` (object|null): Raw qualification_blockers.json content — expects field: `blockers` (array with `lane` field per blocker)
- `runtimeCapabilities` (object|null): capabilities object from SQORuntimeResolver — expects fields: `static_reconciliation`, `static_reconciliation_loop`, `review_obligations`, `semantic_candidates`, `structural_topology`

### SemanticQualificationIntakeResolver.resolveSemanticQualificationIntake(client, runId)

**Consumed files:**
- `clients/{client}/psee/runs/{runId}/semantic/compiler/candidate_csr.json`
- `clients/{client}/psee/runs/{runId}/semantic/compiler/derivation_report.json`
- `clients/{client}/psee/runs/{runId}/semantic/compiler/review_queue.json`
- `clients/{client}/psee/runs/{runId}/sqo/promotion_state.json`
- `clients/{client}/psee/runs/{runId}/sqo/qualification_blockers.json`

## Output Contracts

### ClientScopedSectionResolver → Section Data Object

Returns one of:
- `{ available: false, failReason: string, section: string, client: string, runId: string }` — section not available
- `{ available: true, layer: 'A', ...blueEdgeData }` — BlueEdge Layer A data
- `{ available: true, layer: 'B', ...intakeData }` — Layer B qualification intake data

### QualificationPostureResolver → Posture Object

```
{
  posture: string,       // One of 8 POSTURE enum values
  postureLabel: string,  // Human-readable label
  s_level: string|null,  // S0/S1/S2/S3 or null
  summary: string        // One-line operational summary
}
```

**Posture priority (highest wins):**
1. PERMANENTLY_UNQUALIFIABLE — insufficiency_permanent
2. INSUFFICIENT_EVIDENCE — insufficiency_acknowledged (not permanent)
3. QUALIFIED — S2 or S3
4. RECONCILIATION_ACTIVE — static_reconciliation or static_reconciliation_loop
5. CROSSWALK_ACTIVE — crosswalk blocker + semantic_candidates
6. QUALIFICATION_PENDING — review_obligations
7. SEMANTIC_INTAKE — semantic_candidates
8. STRUCTURAL_ONLY — structural_topology or fallback

### SemanticQualificationIntakeResolver → Intake Object

```
{
  available: true,
  layer: 'B',
  posture: { s_level, posture_state, insufficiency_status },
  intake_summary: { total_capabilities, total_components, capability_groups, direct_evidence_ratio, review_item_count },
  derivation_provenance: { total_derived, methods },
  qualification_blockers: { total, blocking_lanes, by_lane },
  lane_summary: [],
  operational_guidance: { headline, next_steps[] },
  governance: { authority_ceiling, generated_at, governance_notice }
}
```

## Calibration Assumptions

| Constant | Value | Governed vs Tuned |
|---|---|---|
| BLUEEDGE_CLIENT | 'blueedge' | GOVERNED — identity constant, not configurable |
| BLUEEDGE_RUN | 'run_blueedge_productized_01_fixed' | GOVERNED — single registered run for BlueEdge |
| Posture priority order | PERMANENTLY_UNQUALIFIABLE > ... > STRUCTURAL_ONLY | GOVERNED — hierarchy is architectural, not tunable |

## Extension Points

| Extension | Mechanism | Notes |
|---|---|---|
| New client sections | Add case to ClientScopedSectionResolver switch | Must check sectionAvailability first |
| New posture states | Add to POSTURE enum and detection in resolveQualificationPosture | Must define priority position |
| Non-BlueEdge section resolvers | Add to ClientScopedSectionResolver dispatch (currently fail-closed) | Future: when other clients produce CEU/corridor/rebase data |
| New section probes | Add to SQORuntimeResolver rebaseProbes or new probe group | Must update capabilities and sectionAvailability |

## Module Responsibility Map

| File | Concern |
|---|---|
| SQORuntimeResolver.server.js | Runtime substrate discovery — probes, capabilities, section availability |
| ClientScopedSectionResolver.server.js | Client-scoped section data dispatch — BlueEdge guard + Layer routing |
| QualificationPostureResolver.js | Posture derivation — pure function from operational state to 8-state posture |
| SemanticQualificationIntakeResolver.server.js | Compiler output consumption — reads candidate CSR/derivation/review artifacts |
| SQOWorkspaceDataResolver.js | SSR data assembly — orchestrates runtime, state, journey, posture into page props |
| SQOWorkspacePanel.jsx | Section rendering dispatch — SECTION_PANELS map + SECTION_CONTEXT |
| SQOWorkspaceShell.jsx | Page layout shell — navigation, overview routing, workspace panel |
| SectionUnavailableNotice.jsx | Fail-closed rendering — governance notice for unavailable sections |
| SemanticQualificationIntakePanel.jsx | Layer B intake rendering — operational summary, not raw data |
| QualificationPostureSummary.jsx | Posture-driven overview — S-level, capabilities, available sections |
