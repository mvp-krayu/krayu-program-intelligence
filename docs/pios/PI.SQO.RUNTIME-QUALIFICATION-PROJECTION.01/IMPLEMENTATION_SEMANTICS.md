# Implementation Semantics

**Stream:** PI.SQO.RUNTIME-QUALIFICATION-PROJECTION.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `compileRuntimeQualificationProjection` | RuntimeQualificationProjectionCompiler.js | Master compiler: load all artifacts, compile all postures, emit unified projection | Reusable — any client with SQO artifacts |
| `emitQualificationProjection` | RuntimeQualificationProjectionCompiler.js | Write projection artifact to governed path | Reusable |
| `compileQualificationPosture` | RuntimeQualificationProjectionCompiler.js | Aggregate S-state, Q-class, maturity, gravity, stability, progression | Reusable |
| `compileReconciliationPosture` | RuntimeQualificationProjectionCompiler.js | Aggregate reconciliation correspondence + lifecycle | Reusable |
| `compileSemanticDebtPosture` | RuntimeQualificationProjectionCompiler.js | Aggregate debt inventory + debt index | Reusable |
| `compileTemporalAnalyticsPosture` | RuntimeQualificationProjectionCompiler.js | Aggregate temporal analytics into posture | Reusable |
| `compileEvidenceIntakePosture` | RuntimeQualificationProjectionCompiler.js | Aggregate evidence intake into posture | Reusable |
| `compileReplayAndCertificationPosture` | RuntimeQualificationProjectionCompiler.js | Aggregate replay verifications + certifications | Reusable |
| `compilePropagationReadiness` | RuntimeQualificationProjectionCompiler.js | 6-gate assessment for qualification propagation | Reusable |
| `compileSemanticEnvelope` | RuntimeQualificationProjectionCompiler.js | 20-facet coverage assessment | Reusable |
| `compileBoundaryDisclosure` | RuntimeQualificationProjectionCompiler.js | Provenance, governance, source artifact tracking | Reusable |
| `projectQualificationForRuntime` | RuntimeQualificationProjection.js | Transform projection artifact into 8-facet runtime shape | Reusable |

## 2. Input Contracts

### compileRuntimeQualificationProjection(client, runId)

Loads all SQO cockpit artifacts via `loadAllCockpitArtifacts(client, runId)`.

**Source artifacts consumed (12 for posture compilation):**
- `qualification_state` — S-state, Q-class, authorization, grounding ratio
- `semantic_maturity_profile` — maturity score, classification
- `semantic_gravity_assessment` — gravity score, classification
- `qualification_stability` — stability score, classification
- `progression_readiness` — readiness score, blocking debt, target S-state
- `semantic_debt_inventory` — total items, blocking count
- `semantic_debt_index` — aggregate posture, domain postures, reducibility
- `reconciliation_correspondence` — summary, confidence distribution
- `reconciliation_lifecycle` — lifecycle projection (trend, posture, delta)
- `reconciliation_temporal_analytics` — trend, enrichment, debt reduction, degradation
- `semantic_evidence_intake` — intake summary, eligibility matrix
- `maturity_replay_verification`, `qualification_state_replay_verification`, `debt_replay_verification` — replay verdicts
- `maturity_certification`, `qualification_state_certification`, `debt_certification` — certification statuses

**Envelope assessment uses all 20 artifact keys.**

## 3. Output Contracts

### Runtime Qualification Projection Shape (`runtime_qualification_projection.v1.json`)
```
{
  schema_version, artifact_type, client, run_id, generated_at, compiler_version,
  qualification_posture: {
    s_state, state_label, state_reason, authorization_tier, q_class, grounding_ratio,
    maturity: { score, classification },
    gravity: { score, classification },
    stability: { score, classification },
    progression: { readiness, target, blocking_debt_count, total_debt_items }
  },
  reconciliation_posture: {
    summary: { total_semantic_domains, reconciled_count, unreconciled_count,
      reconciliation_ratio, weighted_confidence, unmatched_structural_count },
    confidence_distribution,
    lifecycle: { trend, currentPosture, latestDelta, unresolvedDomains }
  },
  semantic_debt_posture: {
    summary: { total_items, s_state, blocking_count },
    index: { aggregatePosture, reducibilitySummary, exposureSummary, lifecycle },
    domain_postures[]
  },
  temporal_analytics_posture: {
    trend, enrichmentEffectiveness, debtReduction,
    unresolvedPersistence, degradation, divergence
  },
  evidence_intake_posture: {
    summary, eligibility, accepted_count, rejected_count, quarantined_count, all_valid
  },
  replay_and_certification: {
    replays: { key → { available, verdict } },
    certifications: { key → { available, status } },
    all_replays_passed, all_certifications_passed
  },
  propagation_readiness: {
    ready, gate_count, gates_met, gates_failed, gates[],
    blocking_summary[], s_state_progression
  },
  semantic_envelope: {
    total_facets, available_count, missing_count, coverage_ratio,
    available[], missing[], complete
  },
  boundary_disclosure: {
    client, run_id, artifact_root, source_artifact_count, source_artifacts[],
    governance: { deterministic, replay_safe, no_inference, no_enrichment,
      no_path_a_mutation, no_path_b_mutation, no_authority_promotion, projection_only },
    provenance: { compiler, compiler_version, stream }
  }
}
```

### Runtime Projection Shape (consumer-safe)
```
{
  qualification, reconciliation, debt, temporal,
  evidenceIntake, propagation, envelope, provenance
}
```

## 4. Calibration Assumptions

| Constant | Value | Nature |
|----------|-------|--------|
| PROPAGATION_GATES | 6 gates | Governed gate set |
| Semantic envelope facets | 20 (matches SQO_COCKPIT_ARTIFACT_KEYS) | Governed |
| Propagation gate: critical artifacts | qualification_state + semantic_maturity_profile | From CRITICAL_ARTIFACTS |
| Propagation gate: critical debt severity | CRITICAL === 0 | Threshold |

## 5. Extension Points

- **PROPAGATION_GATES**: add new gate types as qualification requirements evolve
- **Posture compilers**: each is independent — add new posture facets without touching existing ones
- **Semantic envelope**: automatically tracks all registered artifact keys
- **Multi-client**: parameterized by client/runId, works for any client with SQO artifacts
- **Consumer projection**: `projectQualificationForRuntime` can be extended with new facets

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| RuntimeQualificationProjectionCompiler.js | Compilation: load artifacts, compile postures, assess propagation, emit artifact |
| RuntimeQualificationProjection.js | Runtime projection: transforms artifact into consumer-safe 8-facet shape |
| SQOCockpitArtifactLoader.js | Artifact registry: loads projection alongside SQO artifacts |
| SQOCockpitFormatter.js | Integration: includes qualification projection in overview section |
| compile_blueedge_qualification_projection.js | Compilation script: orchestrates BlueEdge-specific compilation |
