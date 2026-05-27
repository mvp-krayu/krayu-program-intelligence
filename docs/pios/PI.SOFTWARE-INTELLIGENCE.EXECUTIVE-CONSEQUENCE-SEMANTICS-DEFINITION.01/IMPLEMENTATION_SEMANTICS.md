# Implementation Semantics — Executive Consequence Compilation

Stream: PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-SEMANTICS-DEFINITION.01
Classification: G1 — Architecture-Mutating
Per CLAUDE.md §5.5

---

## 1. Primitive Inventory

### 1.1 Consequence Classes (Atomic)

8 atomic consequence classes defined in EXECUTIVE_CONSEQUENCE_SEMANTICS.md §3.1:

| L1 Engine ID | Reuse Status | Notes |
|---|---|---|
| `COORD_FRAG` | REUSABLE — any domain module may produce coordination fragility consequences | Not Software Intelligence-specific |
| `DEP_AMP` | SW-INTEL SPECIFIC — requires code-graph evidence (Level 1 / ISIG) | Software Intelligence module dependency |
| `DEL_EXP` | REUSABLE — any module with delivery-affecting conditions | Generic operational consequence |
| `OP_BOTTLENECK` | REUSABLE — any module with throughput-constraining conditions | Generic operational consequence |
| `RESIL_DEF` | REUSABLE — any module with structural concentration evidence | Generic structural consequence |
| `GOV_GAP` | REUSABLE — any module with governance coverage assessment | Generic governance consequence |
| `PROP_EXP` | REUSABLE — any module with propagation-surface evidence | Generic structural consequence |
| `STAB_RISK` | REUSABLE — any module with multi-factor convergence | Generic systemic consequence |

### 1.2 Combination Patterns

3 named combination patterns defined in EXECUTIVE_CONSEQUENCE_SEMANTICS.md §5.2:

| Pattern | L1 Engine ID | Reuse Status |
|---|---|---|
| AMPLIFIED_DEPENDENCY_FRAGILITY | `AMPLIFIED_DEP_FRAG` | SW-INTEL SPECIFIC (requires DCkP + DPC) |
| STRUCTURAL_GRAVITY_WELL | `STRUCT_GRAVITY_WELL` | REUSABLE (requires mass + pressure on same locus) |
| SYSTEMIC_OPERATIONAL_FRAGILITY | `SYSTEMIC_OP_FRAG` | REUSABLE (requires 3+ convergent conditions) |

### 1.3 Escalation Rules

Severity escalation: §6 of EXECUTIVE_CONSEQUENCE_SEMANTICS.md.
Scope escalation: §5.3 combination algebra.
Confidence inheritance: §7.

---

## 2. Input Contracts

### 2.1 Primary Input: SignalSynthesisEngine Output

The consequence compiler consumes the output of `SignalSynthesisEngine.synthesize()`:

```javascript
{
  conditions: [
    {
      condition_id: String,
      condition_type: String,           // Rule name (e.g., 'DELIVERY_PRESSURE_CONCENTRATION')
      internal_condition_id: String,    // L1 vocabulary
      technical_semantic_label: String, // L2 vocabulary
      operator_cognition_title: String, // L3 vocabulary
      operational_consequence: String,
      severity: String,                 // 'NOMINAL' | 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL'
      evidence_mode: String,            // 'EVIDENCE_DERIVED' | 'STRUCTURAL_CENTRALITY_DERIVED' | etc.
      governance_boundary: String,      // 'GOVERNED' | 'ADVISORY_BOUND' | 'STRUCTURAL_ONLY'
      topology_overlay: {
        overlay_mode: String,
        emphasis_domains: [String],
        dim_domains: [String],
        advisory_zones: [Object],
        signal_overlays: [Object],
        corridor_paths: [Object]
      },
      supporting_signal_ids: [String],
      shared_topology_targets: {
        domains: [String],
        clusters: [String],
        files: [String]
      },
      derivation_trace: String,
      guided_interventions: [Object],
      contributing_condition_ids: [String]  // Only on COMPOUND_CONVERGENCE
    }
  ],
  active: Number,
  suppressed: Number,
  primitives: [condition_id],
  composites: [condition_id],
  primary: condition_id | null,
  summary: { active_count, total_count, primary_condition, primary_severity }
}
```

### 2.2 Consumed Fields

| Field | Used By | Purpose |
|---|---|---|
| `condition_type` | §4 primitive-to-consequence mapping | Determines which consequence classes to produce |
| `severity` | §4 activation rules, §6 escalation | Consequence severity derivation |
| `governance_boundary` | §7 confidence inheritance | Consequence confidence derivation |
| `shared_topology_targets.domains` | §5 combination detection | Group consequences by locus |
| `shared_topology_targets.clusters` | §5 combination detection | Group consequences by locus |
| `supporting_signal_ids` | §4 activation rules (signal count thresholds) | Some rules require minimum signal count |
| `contributing_condition_ids` | §4.8 compound convergence mapping | Inherit contributing primitives' consequences |
| `topology_overlay.advisory_zones` | §8.1 downgrade triggers | Blind spot overlap detection |

### 2.3 Secondary Input: Domain Registry

For resolving `primary_locus` display names. Same registry used by SignalSynthesisEngine (`buildDomainResolver`).

---

## 3. Output Contracts

### 3.1 Consequence Compilation Result

```javascript
{
  consequences: [ConsequenceObject],    // All compiled consequences (atomic + combination)
  atomic_consequences: [consequence_id], // Atomic only
  combination_consequences: [consequence_id], // Combination patterns only
  consequence_count: Number,
  systemic_count: Number,               // How many SYSTEMIC scope consequences
  primary_consequence: consequence_id | null, // Highest severity
  compilation_trace: {
    input_condition_count: Number,
    conditions_producing_consequences: Number,
    suppressed_conditions: Number,       // NOMINAL conditions
    combination_patterns_matched: Number,
    escalations_applied: Number
  }
}
```

### 3.2 Teaser Output (SW-Intel OFF)

```javascript
{
  consequence_teaser: {
    active_consequence_count: Number,
    top_consequence_class: String,       // L1 engine ID
    top_consequence_severity: String,
    top_consequence_scope: String,       // LOCAL | REGIONAL | SYSTEMIC
    requires_module: 'SOFTWARE_INTELLIGENCE'
  }
}
```

### 3.3 Persona Consumption Contracts

See EXECUTIVE_CONSEQUENCE_SEMANTICS.md §10. Implementation must provide:

| Persona | Contract |
|---|---|
| BOARDROOM | `compressConsequences(consequences, maxCount)` → compressed consequence summaries |
| BALANCED | `frameConsequences(consequences)` → full consequence set with narrative context fields |
| DENSE | `annotateTopology(consequences, overlays)` → lightweight topology annotation (additive) |
| INVESTIGATION | `traceConsequences(consequences)` → full derivation chains |

---

## 4. Calibration Assumptions

### 4.1 Activation Thresholds

| Threshold | Current Value | Source | Tunable? |
|---|---|---|---|
| DPC contributing signal count for OPERATIONAL_BOTTLENECK | ≥ 3 | §4.2 | YES — may adjust based on multi-client observation |
| DCkP severity threshold for COORDINATION_FRAGILITY | ≥ HIGH | §4.3 | FIXED — HIGH is the minimum meaningful severity for coordination implication |
| PA severity threshold for DELIVERY_EXPOSURE | ≥ HIGH | §4.4 | FIXED |
| SMC severity threshold for STRUCTURAL_STABILITY_RISK | ≥ ELEVATED | §4.5 | FIXED — ELEVATED is the minimum for cluster mass instability |
| SMC fan asymmetry threshold for STRUCTURAL_STABILITY_RISK | > 50% | §4.5 | YES — may adjust based on multi-client observation |
| CDCP severity threshold for PROPAGATION_EXPOSURE | ≥ HIGH | §4.6 | FIXED |
| Combination pattern minimum condition count for SYSTEMIC | ≥ 3 | §5.2.3 | FIXED — constitutional minimum for systemic claim |

### 4.2 Governed vs Tunable

- **FIXED** thresholds are constitutionally locked. Changing them requires a governance stream.
- **YES** thresholds may be adjusted by calibration streams with evidence from multi-client observation.

---

## 5. Extension Points

### 5.1 New Consequence Classes

New atomic consequence classes may be added when:
- A new topology cognition primitive is added to SignalSynthesisEngine
- An existing primitive produces a new operational implication not covered by existing classes
- A new domain cognition module requires domain-specific consequence classes

Extension protocol: governance definition stream → define class in this taxonomy → add to §3 → add mapping rules in §4 → add vocabulary in §12 → prove against GENESIS data.

### 5.2 New Combination Patterns

New combination patterns may be added when:
- Multi-client observation reveals emergent combinations not covered by existing patterns
- New consequence classes create previously impossible combination triggers

Extension protocol: governance definition stream → define pattern in §5.2 → prove against at least one specimen → add vocabulary.

### 5.3 New Signal Families → New Consequences

When new signal families become operational (BSIG, CSIG, ESIG per Signal Family Taxonomy), new conditions may emerge from SignalSynthesisEngine. Each new condition type requires:
1. Consequence mapping rules added to §4
2. Combination pattern assessment (do new conditions create new combination opportunities?)
3. GENESIS proof update

---

## 6. Module Responsibility Map

### 6.1 New Module: Consequence Compiler

| Aspect | Value |
|---|---|
| Module name | ConsequenceCompiler (or ExecutiveConsequenceCompiler) |
| Location | `app/execlens-demo/lib/lens-v2/` (alongside SignalSynthesisEngine) |
| Input | SignalSynthesisEngine output (conditions array) |
| Output | Consequence compilation result (§3.1) |
| Authority | Deterministic (no 75.x required) |
| Gating | SW-Intel module activation state |

### 6.2 Existing Module Interactions

| Module | Interaction | Direction |
|---|---|---|
| SignalSynthesisEngine | Consequence compiler consumes engine output | Engine → Compiler |
| SoftwareIntelligenceProjectionAdapter | Adapter may consume consequence objects for projection | Compiler → Adapter |
| BoardroomProjectionCompiler | May consume compressed consequences for BOARDROOM | Compiler → Boardroom |
| IntelligenceField.jsx | Renders consequence projections per persona | Compiler → LENS (via projection) |

### 6.3 Boundary Rules

- Consequence compiler MUST NOT modify SignalSynthesisEngine output
- Consequence compiler MUST NOT access raw evidence artifacts directly — it consumes the engine's compiled conditions
- Consequence compiler MUST NOT perform 75.x interpretive synthesis — it operates at deterministic authority
- Consequence compiler MUST NOT produce consequences for inactive SW-Intel module
- LENS rendering components MUST NOT independently compile consequences — they consume what the compiler produces
