# Implementation Semantics

**Stream:** PI.LENS.V2.RECONCILIATION-CONSUMPTION-LAYER.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `TRUST_POSTURE_TIERS` | LensSQOSubstrateConsumer.js | 8-tier trust classification with level, label, color | Reusable — any LENS consumer |
| `loadQualificationProjection` | LensSQOSubstrateConsumer.js | Load runtime_qualification_projection artifact | Reusable — any client |
| `loadSemanticOperationsSubstrate` | LensSQOSubstrateConsumer.js | Load runtime_semantic_operations_substrate artifact | Reusable — any client |
| `resolveTrustPosture` | LensSQOSubstrateConsumer.js | Map S-state + grounding → trust tier | Reusable — any LENS consumer |
| `resolveDebtVisibility` | LensSQOSubstrateConsumer.js | Extract debt posture for rendering | Reusable — any LENS consumer |
| `resolveTemporalVisibility` | LensSQOSubstrateConsumer.js | Extract temporal trend for rendering | Reusable — any LENS consumer |
| `resolveEvidenceVisibility` | LensSQOSubstrateConsumer.js | Extract evidence integrity for rendering | Reusable — any LENS consumer |
| `resolvePropagationVisibility` | LensSQOSubstrateConsumer.js | Extract propagation readiness for rendering | Reusable — any LENS consumer |
| `resolveStructuralBackingVisibility` | LensSQOSubstrateConsumer.js | Extract reconciliation/unresolved posture | Reusable — any LENS consumer |
| `buildLensSubstrateBinding` | LensSQOSubstrateConsumer.js | Master binding — returns full substrate shape | Reusable — any LENS consumer |
| `SemanticTrustPostureZone` | lens-v2-flagship.js | Density-aware trust posture rendering component | Page-specific |

## 2. Input Contracts

### LensSQOSubstrateConsumer

| Input | Source | Fields Consumed |
|-------|--------|-----------------|
| `runtime_qualification_projection.v1.json` | SQO artifacts | qualification (s_state, q_class, maturity_score, grounding_ratio, gravity_score, stability_score, progression_readiness, progression_target, maturity_classification, gravity_classification, stability_classification), debt (total_items, blocking_count, weighted_debt_score, operational_exposure, qualification_impact, irreducible_count, reducible_count), temporal (trend, enrichment_grade, enrichment_lift_pct, debt_reduction_ratio, persistent_unresolved, degradation_detected), evidenceIntake (total_items, accepted, rejected, quarantined, all_valid, covered_domains), propagation (ready, gates_met, gate_count, blocking_gates, s_state_current, s_state_target, s_state_readiness), reconciliation (total_domains, reconciled, unreconciled, reconciliation_ratio, weighted_confidence, trend, unresolved_domains), envelope, provenance |
| `runtime_semantic_operations_substrate.v1.json` | SQO artifacts | health |

### SemanticTrustPostureZone

| Input | Source | Fields Consumed |
|-------|--------|-----------------|
| `binding` | buildLensSubstrateBinding result | trustPosture, debtVisibility, temporalVisibility, evidenceVisibility, propagationVisibility, structuralBacking |
| `densityClass` | Page state | EXECUTIVE_BALANCED, EXECUTIVE_DENSE, INVESTIGATION_DENSE |
| `boardroomMode` | Page state | boolean |

## 3. Output Contracts

### buildLensSubstrateBinding

Returns:
```
{
  available: boolean,
  reason?: string,                    // only when available=false
  trustPosture: { level, tier_level, label, color, s_state, q_class, grounding_ratio, grounding_pct, maturity_score, maturity_classification, gravity_score, gravity_classification, stability_score, stability_classification, progression_readiness, progression_target },
  debtVisibility: { total_items, blocking_count, weighted_debt_score, operational_exposure, qualification_impact, irreducible_count, reducible_count, has_blocking_debt, exposure_color },
  temporalVisibility: { trend, trend_color, enrichment_grade, enrichment_lift_pct, debt_reduction_ratio, debt_reduction_pct, persistent_unresolved, degradation_detected },
  evidenceVisibility: { total_items, accepted, rejected, quarantined, all_valid, covered_domains, integrity_color },
  propagationVisibility: { ready, gates_met, gate_count, blocking_gates, s_state_current, s_state_target, readiness_score, readiness_pct, gate_color },
  structuralBacking: { total_domains, reconciled, unreconciled, reconciliation_ratio, reconciliation_pct, weighted_confidence, trend, unresolved_domains, unresolved_count },
  envelope: object | null,
  operationalHealth: object | null,
  provenance: object | null,
}
```

## 4. Calibration Assumptions

### Trust Posture Resolution

| S-State | Grounding | Maturity | Resolved Tier |
|---------|-----------|----------|---------------|
| S3 | >= 1.0 | any | AUTHORITY |
| S3 | < 1.0 | any | STRONG |
| S2 | >= 0.75 | any | STRONG |
| S2 | >= 0.5 | any | PARTIAL |
| S2 | < 0.5 | >= 0.5 | HYDRATED |
| S2 | < 0.5 | < 0.5 | HYDRATED |
| S1 | any | any | NONE |
| other | any | any | NONE |

These thresholds are mechanical and deterministic. The trust tier is purely a visual presentation mapping — it carries no authority.

## 5. Extension Points

- **Multi-client:** `buildLensSubstrateBinding(client, runId)` works for any client with compiled SQO projection artifacts
- **Trust tiers:** `TRUST_POSTURE_TIERS` can be extended with new tiers (CERTIFIED, EXACT, RECONCILED defined but not yet mapped)
- **Visibility resolvers:** Each resolver can be extended with additional fields as SQO projections evolve
- **Density modes:** SemanticTrustPostureZone rendering is density-parameterized; new density modes can be added

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| LensSQOSubstrateConsumer.js | Consumer-side SQO substrate binding: load projections, resolve trust posture, extract visibility shapes |
| flagshipBinding.js | Server-side binding orchestration: resolves payload + reconciliation + substrate binding for page props |
| lens-v2-flagship.js (SemanticTrustPostureZone) | Density-aware rendering of trust posture, debt, temporal, evidence, propagation, structural backing, unresolved domains |
| RuntimeQualificationProjection.js | Upstream: transforms raw SQO artifacts into consumer-safe 8-facet projection (consumed by this layer) |
| SemanticOperationsProjection.js | Upstream: transforms substrate into 8-facet operational projection (health consumed by this layer) |
