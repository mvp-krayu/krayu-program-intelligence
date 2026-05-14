# Implementation Semantics

**Stream:** PI.LENS.V2.NEXTGEN-REPORTS.RECONCILIATION-INTEGRATION.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `buildReportQualificationSection` | NextGenReportReconciliationBinding.js | Extract qualification posture for report rendering | Reusable |
| `buildReportReconciliationSection` | NextGenReportReconciliationBinding.js | Extract reconciliation posture for report rendering | Reusable |
| `buildReportDebtSection` | NextGenReportReconciliationBinding.js | Extract semantic debt visibility for report rendering | Reusable |
| `buildReportStructuralBackingMatrix` | NextGenReportReconciliationBinding.js | Extract structural backing matrix with unresolved domains | Reusable |
| `buildReportTemporalNarrative` | NextGenReportReconciliationBinding.js | Extract temporal reconciliation narrative for reports | Reusable |
| `buildReportUnresolvedDisclosure` | NextGenReportReconciliationBinding.js | Extract unresolved-domain disclosure section | Reusable |
| `buildReportTrustPosture` | NextGenReportReconciliationBinding.js | Extract trust posture summary for reports | Reusable |
| `buildReportExecutiveDisclosure` | NextGenReportReconciliationBinding.js | Generate governance disclosure items from binding state | Reusable |
| `buildReportPropagationSection` | NextGenReportReconciliationBinding.js | Extract propagation readiness for reports | Reusable |
| `buildReportEvidenceIntegritySection` | NextGenReportReconciliationBinding.js | Extract evidence integrity summary for reports | Reusable |
| `buildNextGenReportBinding` | NextGenReportReconciliationBinding.js | Master composition — builds all 9 sections + executive disclosure | Reusable |
| `validateReportRuntimeParity` | NextGenReportReconciliationBinding.js | 4-dimension parity check between report binding and substrate | Reusable |
| `ReconciliationAwareSections` | ReportModuleShell.jsx | React component rendering all reconciliation sections | Shell-specific |

## 2. Input Contracts

### NextGenReportReconciliationBinding

| Input | Source | Fields Consumed |
|-------|--------|-----------------|
| `substrateBinding` | LensSQOSubstrateConsumer.buildLensSubstrateBinding | available, trustPosture (level, tier_level, label, color, s_state, q_class, grounding_ratio, grounding_pct, maturity_score, maturity_classification, gravity_score, gravity_classification, stability_score, stability_classification, progression_readiness, progression_target), structuralBacking (total_domains, reconciled, unreconciled, reconciliation_ratio, reconciliation_pct, weighted_confidence, trend, unresolved_count, unresolved_domains), debtVisibility (total_items, blocking_count, weighted_debt_score, operational_exposure, qualification_impact, irreducible_count, reducible_count, has_blocking_debt, exposure_color), temporalVisibility (trend, trend_color, enrichment_grade, enrichment_lift_pct, debt_reduction_ratio, debt_reduction_pct, persistent_unresolved, degradation_detected), propagationVisibility (ready, gates_met, gate_count, blocking_gates, readiness_score, readiness_pct, gate_color), evidenceVisibility (total_items, accepted, rejected, quarantined, all_valid, covered_domains, integrity_color) |

### ReportModuleShell (reconciliation props)

| Input | Source | Fields Consumed |
|-------|--------|-----------------|
| `reportBinding` | flagshipBinding.resolveFlagshipBinding → buildNextGenReportBinding | available, sections (qualification, reconciliation, debt, structuralBacking, temporalNarrative, unresolvedDisclosure, trustPosture, propagation, evidenceIntegrity), executiveDisclosure (available, disclosure_required, disclosure_items) |

## 3. Output Contracts

### buildNextGenReportBinding

Returns when available:
```
{
  available: true,
  sections: {
    qualification: { trust_level, trust_label, trust_color, s_state, q_class, grounding_ratio, grounding_pct, maturity_score, maturity_classification, gravity_score, gravity_classification, stability_score, stability_classification, progression_readiness, progression_target },
    reconciliation: { total_domains, reconciled, unreconciled, reconciliation_ratio, reconciliation_pct, weighted_confidence, trend, unresolved_count },
    debt: { total_items, blocking_count, weighted_debt_score, operational_exposure, qualification_impact, irreducible_count, reducible_count, has_blocking_debt, exposure_color },
    structuralBacking: { total_domains, reconciled, unreconciled, reconciliation_pct, weighted_confidence, unresolved_domains },
    temporalNarrative: { trend, trend_color, enrichment_grade, enrichment_lift_pct, debt_reduction_ratio, debt_reduction_pct, persistent_unresolved, degradation_detected },
    unresolvedDisclosure: { unresolved_count, unresolved_domains, disclosure_required } | null,
    trustPosture: { level, tier_level, label, color, s_state, q_class, grounding_pct, maturity_classification },
    propagation: { ready, gates_met, gate_count, blocking_gates, readiness_score, readiness_pct, gate_color },
    evidenceIntegrity: { total_items, accepted, rejected, quarantined, all_valid, covered_domains, integrity_color },
  },
  executiveDisclosure: { available, disclosure_required, disclosure_items },
}
```

Returns when unavailable:
```
{
  available: false,
  reason: string,
  sections: null,
  executiveDisclosure: { available: false, disclosure_items: [...] },
}
```

### validateReportRuntimeParity

```
{
  pass: boolean,
  checks: [
    { check: 'QUALIFICATION_PARITY', pass: boolean, detail: string },
    { check: 'RECONCILIATION_PARITY', pass: boolean, detail: string },
    { check: 'DEBT_PARITY', pass: boolean, detail: string },
    { check: 'TRUST_POSTURE_PARITY', pass: boolean, detail: string },
  ],
}
```

## 4. Executive Disclosure Doctrine

Disclosure items are generated mechanically from binding state:

| Condition | Disclosure Text |
|-----------|----------------|
| Q-class not Q-01 | "Qualification class {q_class} — not fully grounded. {pct}% structurally grounded." |
| Trust level NONE | "Trust posture {label} — structural backing is absent." |
| Trust level HYDRATED | "Trust posture {label} — structural backing is partial." |
| Blocking debt exists | "{count} blocking debt items prevent qualification advancement." |
| Unresolved domains > 0 | "{count} semantic domains remain unresolved — disclosed below." |
| Substrate unavailable | "Qualification substrate unavailable — report rendered without SQO posture data" |

No inference. No summarization. Text is deterministic from binding state.

## 5. Parity Validation Semantics

Runtime/report parity validation checks structural equivalence:

| Dimension | Fields Compared |
|-----------|----------------|
| QUALIFICATION_PARITY | s_state, q_class, trust_level ↔ level |
| RECONCILIATION_PARITY | reconciliation_pct, total_domains |
| DEBT_PARITY | total_items, blocking_count |
| TRUST_POSTURE_PARITY | level, grounding_pct |

All comparisons are strict equality. No tolerance bands.

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| NextGenReportReconciliationBinding.js | Transform SQO substrate binding into report-ready sections; parity validation; executive disclosure generation |
| flagshipBinding.js | Server-side report binding construction; passes pre-computed reportBinding in page props |
| CoreReportContainer.jsx | Accepts and forwards reportBinding through rendering pipeline |
| SurfaceModeRouter.jsx | Routes reportBinding to ReportModuleShell on EXECUTIVE_READY routes |
| ReportModuleShell.jsx | Renders reconciliation-aware sections; executive disclosure on unavailable; preserves existing empty slots |
| globals.css | Styling: all .rms-* classes for report section rendering |
