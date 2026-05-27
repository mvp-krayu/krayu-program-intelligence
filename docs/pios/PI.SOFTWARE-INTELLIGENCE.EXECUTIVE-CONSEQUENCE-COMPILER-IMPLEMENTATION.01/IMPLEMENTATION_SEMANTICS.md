# Implementation Semantics

## Stream

PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-COMPILER-IMPLEMENTATION.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|-------------|
| `compile` | ConsequenceCompiler.js | Full consequence compilation pipeline | REUSABLE — primary entry point for any persona |
| `compileTeaser` | ConsequenceCompiler.js | Lightweight teaser for SW-Intel OFF state | REUSABLE — any teaser surface |
| `forBoardroom` | ConsequenceCompiler.js | Compressed consequence posture for BOARDROOM | REUSABLE — BOARDROOM projection |
| `forInvestigation` | ConsequenceCompiler.js | Full derivation chains for INVESTIGATION | REUSABLE — INVESTIGATION projection |
| `CONSEQUENCE_VOCABULARY` | ConsequenceCompiler.js | 8 atomic + 3 combination vocabulary | READ-ONLY constant |
| `COGNITION_SLICE_VOCABULARY` | ConsequenceCompiler.js | Maps condition types to executive names with localized meanings | READ-ONLY constant |
| `ConvergenceWeb` | IntelligenceField.jsx | Radial SVG force-field showing dynamic convergence | INTERNAL — BOARDROOM only |

## 2. Input Contracts

### compile(synthesisResult, fullReport)

**synthesisResult** (from SignalSynthesisEngine.synthesize):
- `synthesisResult.conditions[]` — array of condition objects
  - `condition_type` — DPC, DCkP, PA, SMC, SDB, CC, ...
  - `severity` — CRITICAL, HIGH, ELEVATED, MODERATE, LOW, NOMINAL
  - `governance_boundary` — GOVERNED, ADVISORY_BOUND, STRUCTURAL_ONLY
  - `shared_topology_targets.domains[]` — domain IDs and display names
  - `shared_topology_targets.clusters[]` — cluster references
  - `contributing_condition_ids` — for CC (Compound Convergence) conditions

**fullReport** (limited access):
- `dpsig_signal_summary.normalization_basis` — for §4.5 cluster_fan_asymmetry check
- `signal_interpretations` — for §4.3 signal_value lookup
- `semantic_domain_registry` — display name resolution
- `structural_enrichment.centrality.top_structural_spines` — for §4.3 hub in-degree check

### forBoardroom(consequenceResult, synthesisResult, fullReport)

**consequenceResult** (from compile):
- `consequences[]` — sorted consequence objects
- `combinations[]` — detected combination patterns
- `metadata` — compilation metadata

**synthesisResult** (from SignalSynthesisEngine.synthesize):
- `conditions[]` — for cognition slice derivation

**fullReport** (limited access):
- `pressure_zone_state` — for primary locus resolution

### forInvestigation(consequenceResult)

Same as forBoardroom input — full consequenceResult.

## 3. Output Contracts

### compile() → ConsequenceResult

```
{
  consequences: [{
    type_id,        // COORD_FRAG, DEP_AMP, ..., SYSTEMIC_OP_FRAG, etc.
    title,          // Human-readable consequence title
    severity,       // CRITICAL, HIGH, ELEVATED, MODERATE
    confidence,     // GOVERNED, ADVISORY_BOUND, STRUCTURAL_ONLY
    scope,          // LOCAL, REGIONAL, SYSTEMIC
    primary_locus,  // { domain_key, display_name }
    source_conditions,  // [{ condition_id, condition_type }]
    derivation_trace    // Step-by-step compilation trace
  }],
  combinations: [{
    pattern_id,     // AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL, SYSTEMIC_OP_FRAG
    title,
    constituents    // Merged consequence objects
  }],
  metadata: {
    total_conditions, mapped_conditions, total_atomic,
    deduplication_merges, combinations_detected,
    escalations_applied, compilation_timestamp
  }
}
```

### forBoardroom() → ConsequencePosture

```
{
  posture_label,           // e.g., "Systemic Fragility Posture"
  posture_severity,        // Highest severity across all consequences
  posture_scope,           // Widest scope across all consequences
  primary_locus,           // Display name of primary pressure zone domain
  consequence_count,       // Total consequence count
  systemic_count,          // Count of SYSTEMIC-scope consequences
  overall_confidence,      // GOVERNED, ADVISORY_BOUND, STRUCTURAL_ONLY
  overall_confidence_label,// Human-readable confidence label
  cognition_slices: [{     // Executive-named dynamic slices for convergence web
    condition_type,        // e.g., DELIVERY_PRESSURE_CONCENTRATION
    executive_name,        // e.g., "Pressure Convergence"
    localized_meaning,     // Domain-specific explanation
    severity,
    confidence
  }],
  combined_synthesis       // Single-sentence systemic synthesis narrative
}
```

### compileTeaser() → TeaserShape

```
{
  consequence_teaser: {
    active_consequence_count,
    top_consequence_class,
    top_consequence_severity,
    top_consequence_scope,
    requires_module          // 'SOFTWARE_INTELLIGENCE'
  }
}
```

## 4. Calibration Assumptions

| Constant | Value | Status |
|----------|-------|--------|
| Hub in-degree threshold (OP_BOTTLENECK) | > 20 | TUNED — §4.3 |
| Cluster fan asymmetry threshold (STAB_RISK) | > 50% | TUNED — §4.5 |
| SYSTEMIC_OP_FRAG detection threshold | 3+ consequences from 3+ distinct primitive conditions | GOVERNED — §5 |
| Severity escalation ceiling | CRITICAL | GOVERNED — §6 |
| Defining vs conditional consequence distinction | `_defining: true` for always-activated | ARCHITECTURAL — drives top-level selection on independent loci |

## 5. Extension Points

| Point | Description |
|-------|-------------|
| Mapping functions | One per condition type — new condition types require new mappers |
| Combination patterns | `COMBINATION_PATTERNS` array — additional patterns follow same shape |
| Persona projections | `forBoardroom`, `forInvestigation` — additional persona functions follow same pattern |
| Vocabulary | `CONSEQUENCE_VOCABULARY` — extend for new consequence classes |

## 6. Module Responsibility Map

| File | Concern |
|------|---------|
| `ConsequenceCompiler.js` | All compilation logic: mapping, dedup, combination, escalation, cognition slice derivation, persona projection |
| `IntelligenceField.jsx` | Wiring (useMemo hooks, prop threading) + BOARDROOM cognition components (ConvergenceWeb, OperationalConfidence, Executive Posture branch, topology inheritance overlay, teaser wiring) |
| `StructuralTopologyZone.jsx` | SW_INTEL_POSTURE overlay color mapping |
| `lens-v2-flagship.js` | CSS for convergence web, operational confidence, executive posture, topology preview, teaser consequence lines |
| `SignalSynthesisEngine.js` | READ ONLY: SEVERITY_RANK, resolveDomainDisplay |
