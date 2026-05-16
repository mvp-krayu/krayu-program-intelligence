# IMPLEMENTATION_SEMANTICS.md

**Stream:** PI.LENS.V2.PHASE5B2.NARRATIVE-RESPONSE-SURFACE.01

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| BALANCED_INTERPRETIVE_NARRATIVES | IntelligenceField.jsx | 5 interpretive derive functions with emergence thresholds | REUSABLE — consumed by BalancedConsequenceField, available to 5B.3+ |
| BalancedNarrativeSection | IntelligenceField.jsx | Reusable narrative section renderer | REUSABLE — renders any derive function output |
| Narrative Emergence Policy | IntelligenceField.jsx | Condition-driven rendering model (PRIMARY/SECONDARY) | CANONICAL — governs all future interpretive rendering |
| activeAuthorityTier state | LensDisclosureShell.jsx | Dynamic authority tier tracking | REUSABLE — consumed by governance envelope footer |
| onAuthorityChange callback | LensDisclosureShell.jsx → IntelligenceField.jsx | Authority tier propagation from content to governance envelope | REUSABLE — any content surface can trigger authority transition |
| emergenceState | IntelligenceField.jsx | Shared emergence state between center/left/right columns | REUSABLE — consumed by ExecutiveInterpretation, SupportRail |

## 2. Input Contracts

### BALANCED_INTERPRETIVE_NARRATIVES derive functions
- **Input:** `fullReport` object
- **Required fields per function:**
  - deriveExecutiveSynthesis: readiness_summary (score, band, posture), topology_summary (structurally_backed_count, semantic_domain_count), signal_interpretations
  - deriveGroundingIntelligence: topology_summary (structurally_backed_count, semantic_domain_count, semantic_only_count, cluster_count)
  - derivePressureIntelligence: signal_interpretations, propagation_summary (primary_zone_business_label, zone_classification)
  - derivePropagationIntelligence: evidence_blocks (propagation_role, domain_alias, structural_backing)
  - deriveQualificationIntelligence: readiness_summary (band), topology_summary (structurally_backed_count, semantic_domain_count)

### Elevation Thresholds (SECONDARY functions)
- deriveGroundingIntelligence: semantic_only_count / total > 0.3 OR structurally_backed_count < cluster_count
- derivePressureIntelligence: activated signals ≥ 2 OR any severity CRITICAL/HIGH OR zone_classification !== NOMINAL
- derivePropagationIntelligence: ≥ 2 distinct propagation_roles populated
- deriveQualificationIntelligence: band !== STRONG OR advisory ratio > 0.4

## 3. Output Contracts

### Derive Function Output
```javascript
{
  narrative: string | null,        // null = threshold not met or data insufficient
  evidenceChain: [
    { source: string, claim: string, severity: string }
  ],
  structuralBasis: string,
  authority: 'INTERPRETIVE',
  emergenceClass: 'PRIMARY' | 'SECONDARY',
}
```

### BalancedNarrativeSection
- Input: `derived` (derive function output)
- Output: JSX div.balanced-narrative or null (when narrative is null)

### Authority Change Callback
- Signature: `onAuthorityChange(tier: 'INTERPRETIVE' | null)`
- Called by BalancedConsequenceField when emerged count changes
- null = revert to default (INVESTIGATIVE prop)

## 4. Calibration Assumptions

- PRIMARY synthesis always eligible (not threshold-gated) — this is the gravitational center of BALANCED interpretation
- SECONDARY emergence thresholds are constants in derive functions — not externally configurable (intentional for governance stability)
- Grounding asymmetry threshold: 0.3 (30% semantic-only) — calibrated to BlueEdge data
- Advisory ratio threshold: 0.4 (40% advisory-bound) — calibrated to current qualification model
- Signal count threshold: 2 activated — above single-signal noise
- Propagation role threshold: 2 distinct roles — minimal chain

## 5. Extension Points

- **New derive functions:** Add to BALANCED_INTERPRETIVE_NARRATIVES object with key, emergenceClass, derive function, emergence/nominal labels
- **Threshold tuning:** Modify threshold constants within derive functions
- **5B.3 interaction:** SupportRail emergence indicators can become interactive (onClick handlers)
- **Cross-persona emergence:** onAuthorityChange pattern can be reused by BOARDROOM for sparse synthesis in future streams
- **Narrative depth:** BalancedNarrativeSection can accept additional display modes (collapsed, expanded, modal)

## 6. Module Responsibility Map

| File | Concern |
|---|---|
| IntelligenceField.jsx | Derive functions, emergence policy, BalancedNarrativeSection, emergence state management |
| LensDisclosureShell.jsx | activeAuthorityTier state, governance envelope authority-aware footer |
| lens-v2-flagship.js | CSS for narrative emergence surfaces, emergence index, interpretive markers |
| 75x_interpretation_authorization_contract.md | Persona scope authorization (EXECUTIVE_BALANCED) |
