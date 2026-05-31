# Executive Cognition Object Model

**Stream:** PI.EXECUTIVE-COGNITION-RUNTIME.01
**Classification:** G1 (Architecture Defining)
**Date:** May 2026

---

## 1. The Canonical Object

The **Executive Cognition Package** (ECP) is the canonical runtime artifact produced by L4 of the Program Intelligence pipeline. It is the structured representation of everything the system knows about a specimen at executive altitude — independent of how that knowledge will be rendered.

The ECP answers one question: **What does Program Intelligence understand about this program's structural execution reality?**

It does not answer: How should we tell someone about it? That is L5 (Projection).

---

## 2. Object Composition

The ECP contains nine cognition objects. Each object is a structured artifact, not prose. Each traces to specific pipeline outputs. Each has a defined schema.

### 2.1 Structural Posture

The program's overall structural identity and qualification state.

```
structural_posture: {
  qualification: {
    s_level: 'S2',
    provenance: 'GOVERNED_LIFECYCLE',
    authority_ceiling: 'L5',
    revalidation: { total: 25, passed: 25 },
    anchor: { total: 8, passed: 8, verdict: 'CONSTITUTIONAL_DISTANCE_ACCEPTABLE' },
    certification: { total: 62, passed: 62, status: 'REPLAY-CERTIFIED' },
    propositions: { total: 85, accepted: 81, rejected: 3, arbitrated: 1 },
  },
  scale: {
    total_nodes: 944,
    source_files: 680,
    import_relationships: 2139,
    class_definitions: 555,
    function_definitions: 638,
    structural_clusters: 10,
    semantic_domains: 17,
    graph_density: 0.0046,
  },
  architectural_pattern: {
    pattern_id: 'BIFURCATED',
    primary_mass: { cluster: 'CLU-04', label: 'backend', nodes: 541, share: 0.573 },
    secondary_mass: { cluster: 'CLU-05', label: 'frontend', nodes: 368, share: 0.390 },
    remaining_share: 0.037,
  },
  technology_profile: {
    language: 'TypeScript',
    backend_framework: 'NestJS',
    frontend_framework: 'React',
    composition_roots: [
      { path: 'backend/src/app.module.ts', fan_out: 69, role: 'backend_composition_root' },
      { path: 'frontend/App.tsx', fan_out: 70, role: 'frontend_entry_point' },
    ],
  },
  signal_profile: {
    total_signals: 8,
    active: 7,
    families: {
      PSIG: { count: 4, active: 3, peak_severity: 'HIGH' },
      ISIG: { count: 2, active: 2, peak_severity: 'HIGH' },
      DPSIG: { count: 2, active: 2, peak_severity: 'ELEVATED' },
    },
  },
}
```

**Source:** structural_node_inventory (L0), code_graph (L0), canonical_topology (L0), signal_registry (L1), promotion_state (L2), revalidation_result (L2), constitutional_anchor (L2), chronicle_certification (L3), proposition_review_state (L1)

**Derivation:** DETERMINISTIC — all values extracted or computed from governed artifacts

### 2.2 Tension Map

The dominant structural tensions — where independent risk vectors converge.

```
tension_map: {
  convergence_centers: [
    {
      domain: 'Platform Infrastructure and Data',
      domain_id: 'DOMAIN-10',
      severity: 'CRITICAL',
      condition_count: 5,
      contributing_conditions: [
        'DELIVERY_PRESSURE_CONCENTRATION',
        'DEPENDENCY_CHOKE_POINT',
        'STRUCTURAL_MASS_CONCENTRATION',
        'CROSS_DOMAIN_COUPLING_PRESSURE',
        'EXECUTION_CONSTRICTION',
      ],
      behavioral_classes: ['A', 'B', 'D'],
      risk_label: 'Flow, concentration, and coupling converging — everything flows through a rigidly locked region',
      convergence_type: 'COMPOUND_CONVERGENCE',
    },
    {
      domain: 'Frontend Application',
      domain_id: 'DOMAIN-14',
      severity: 'CRITICAL',
      condition_count: 4,
      contributing_conditions: [
        'PROPAGATION_ASYMMETRY',
        'EXECUTION_FRAGILITY',
        'EXECUTION_CONSTRICTION',
        'STRUCTURAL_BOUNDARY_DIVERGENCE',
      ],
      behavioral_classes: ['A', 'C', 'E'],
      risk_label: 'Flow, fragility, and drift converging — delivery pressure hits a fragile region that is also unstable',
      convergence_type: 'COMPOUND_CONVERGENCE',
    },
  ],
  cross_center_coupling: {
    connected: true,
    coupling_path: 'backend → frontend via API mediation layer',
    propagation_direction: 'ORIGIN_TO_RECEIVER',
    implication: 'Pressure originating in backend propagates to frontend, which is already under separate structural stress',
  },
  behavioral_class_activation: {
    A: { active: true, condition_count: 3, class_name: 'Flow & Propagation' },
    B: { active: true, condition_count: 3, class_name: 'Concentration & Saturation' },
    C: { active: true, condition_count: 1, class_name: 'Fragility & Resilience' },
    D: { active: true, condition_count: 1, class_name: 'Reinforcement & Accumulation' },
    E: { active: true, condition_count: 1, class_name: 'Drift & Instability' },
    total_active: 5,
    total_possible: 5,
    dominant_classes: ['A', 'B'],
    dominance_ratio: 0.667,
  },
}
```

**Source:** COMPOUND_CONVERGENCE conditions (L2), CONDITION_ONTOLOGY_CLASS (L2 static), CLASS_RISK_LABEL (L3 static), propagation_summary (L2)

**Derivation:** DETERMINISTIC — all values from pipeline outputs, class counting is arithmetic, risk_label is vocabulary lookup

### 2.3 Constraint Inventory

Execution constraints — structural truths that limit operational capacity.

```
constraint_inventory: {
  throughput_ceilings: [
    {
      constraint_type: 'STRUCTURAL_BRIDGE_SERIALIZATION',
      evidence: { bridge_count: 28, articulation_points: 50, analyzed_nodes: 587 },
      peak_constriction: { path: 'frontend/api/index.ts', score: 42, through_flow: 14 },
      operational_meaning: 'Parallel work serializes at bridge nodes regardless of team size',
      scope: 'SYSTEMIC',
    },
  ],
  blast_radius_exposures: [
    {
      constraint_type: 'DEPENDENCY_AMPLIFICATION',
      evidence: { path: 'backend/src/common/dto/index.ts', in_degree: 111, mean_in_degree: 3.15, ratio: 35.3 },
      operational_meaning: 'Change impact systematically underestimated — 111 downstream consumers',
      scope: 'REGIONAL',
    },
    {
      constraint_type: 'PROPAGATION_ASYMMETRY',
      evidence: { path: 'frontend/App.tsx', out_degree: 70, mean_out_degree: 3.15, ratio: 22.3 },
      operational_meaning: 'Changes propagate 22× further than average',
      scope: 'REGIONAL',
    },
  ],
  governance_misalignments: [
    {
      constraint_type: 'BOUNDARY_DIVERGENCE',
      evidence: { target_domain: 'Frontend Application', measurement: 'cross-boundary import ratio' },
      operational_meaning: 'Declared organizational boundaries do not match actual dependency structure',
      scope: 'REGIONAL',
    },
  ],
  structural_fragility: [
    {
      constraint_type: 'COHESION_DEFICIT',
      evidence: { path: 'frontend/hooks/index.tsx', cohesion: 0.06, dependents: 74, cross_module_ratio: 0.94 },
      operational_meaning: 'Junction with 94% cross-module edges — structurally exposed on all sides',
      scope: 'LOCALIZED',
    },
  ],
  coupling_rigidity: [
    {
      constraint_type: 'COUPLING_INERTIA',
      evidence: { bidirectional_clusters: 'detected', density: 'elevated' },
      operational_meaning: 'Coupled modules cannot evolve independently — changes cascade bidirectionally',
      scope: 'REGIONAL',
    },
  ],
}
```

**Source:** constriction_surface (L1), structural_centrality (L0), fragility_surface (L1), boundary_divergence (L1), coupling_inertia (L1), signal_registry ISIG-001/002 (L1)

**Derivation:** DETERMINISTIC — all values from enrichment surfaces, scope classification is rule-based (single-file = LOCALIZED, single-domain = REGIONAL, cross-domain = SYSTEMIC)

### 2.4 Exposure Assessment

Where the program is structurally exposed — vulnerability surfaces.

```
exposure_assessment: {
  concentration_exposure: {
    mass_concentration: { cluster: 'CLU-04', share: 0.573, implication: 'Majority of structural mass in one cluster' },
    hub_exposure: [
      { path: 'backend/src/common/dto/index.ts', in_degree: 111, role: 're-export hub', vulnerability: 'Type change cascades to 16% of codebase' },
      { path: 'frontend/hooks/index.tsx', in_degree: 74, role: 'hook aggregator', vulnerability: 'Fragile hub — high coupling + low cohesion' },
      { path: 'frontend/api/client.ts', in_degree: 68, role: 'API client', vulnerability: 'Single API mediation point' },
    ],
  },
  governance_exposure: {
    boundary_divergence_domains: ['Frontend Application'],
    coupling_across_ownership: { dom_04_coupling_count: 5, implication: 'Module registration cascades across domain boundaries' },
    blind_spot_domains: ['backend_events', 'frontend', 'load_tests', 'monitoring', 'svg_agents'],
  },
  fragility_exposure: {
    fragile_hubs: [
      { path: 'frontend/hooks/index.tsx', cohesion: 0.06, fragility_class: 'CRITICAL_JUNCTION' },
    ],
    fragile_regions: ['Frontend Application hook/component shared layers'],
  },
}
```

**Source:** canonical_topology (L0), structural_centrality (L0), fragility_surface (L1), binding_envelope (L0), pressure_zone_state (L2)

**Derivation:** DETERMINISTIC — all values extracted, vulnerability descriptions are condition-specific vocabulary

### 2.5 Trajectory Assessment

Where things are heading — pattern-based trajectory inference.

```
trajectory_assessment: {
  worsening: [
    {
      pattern: 'STRUCTURAL_GRAVITY_WELL',
      locus: 'Platform Infrastructure and Data',
      mechanism: 'Mass accumulation — dominant regions attract disproportionate new functionality, increasing concentration over time',
      evidence: 'STRUCT_GRAVITY_WELL combination pattern active',
      trajectory_confidence: 'STRUCTURAL',
    },
    {
      pattern: 'COUPLING_INERTIA_GROWTH',
      locus: 'Cross-domain coupling at DOM-04',
      mechanism: 'Bidirectional dependencies resist refactoring — each new module reinforces existing coupling',
      evidence: 'COUPLING_INERTIA condition active',
      trajectory_confidence: 'STRUCTURAL',
    },
  ],
  stable: [
    {
      pattern: 'GOVERNANCE_COVERAGE',
      observation: 'All structural nodes are domain-anchored',
      evidence: 'GOVERNANCE_COVERAGE_COMPLETE condition active',
    },
  ],
  unmeasured: [
    {
      pattern: 'TEMPORAL_VELOCITY_DECAY',
      why: 'Requires multiple analysis runs over time — single structural snapshot insufficient',
      required: 'Temporal structural intelligence (repeated analysis)',
    },
    {
      pattern: 'DEPENDENCY_DEBT_ACCUMULATION',
      why: 'Deferred behavioral slice — requires temporal evidence of growing dependency mass',
      required: 'Temporal analysis across versions',
    },
  ],
}
```

**Source:** STRUCT_GRAVITY_WELL combination (L3), COUPLING_INERTIA condition (L2), GOVERNANCE_COVERAGE_COMPLETE condition (L2), behavioral slice inventory (static)

**Derivation:** DETERMINISTIC — trajectory is a PROPERTY of the consequence/condition type, not a human inference. STRUCT_GRAVITY_WELL inherently worsens because mass accumulation is self-reinforcing. This is a structural truth, not a prediction.

### 2.6 Decision Surface

What decisions the cognition supports — leverage points with evidence backing.

```
decision_surface: {
  leverage_points: [
    {
      intervention: 'BARREL_FILE_DISAGGREGATION',
      target: 'backend/src/common/dto/index.ts',
      source_condition: 'DEPENDENCY_CHOKE_POINT',
      evidence: { in_degree: 111, ratio: 35.3 },
      expected_effect: 'Reduce blast radius from 111 to per-DTO consumer count',
      effort_scope: 'FILE_LEVEL',
      urgency: 'IMMEDIATE',
    },
    {
      intervention: 'STRUCTURAL_IMPACT_ASSESSMENT',
      target: 'Frontend Application shared layers',
      source_condition: 'EXECUTION_FRAGILITY',
      evidence: { cohesion: 0.06, cross_module_ratio: 0.94 },
      expected_effect: 'Prevent underestimated blast radius from fragile component changes',
      effort_scope: 'PROCESS_LEVEL',
      urgency: 'IMMEDIATE',
    },
    {
      intervention: 'BRIDGE_DEPENDENCY_REDUCTION',
      target: 'frontend/api/index.ts',
      source_condition: 'EXECUTION_CONSTRICTION',
      evidence: { constriction_score: 42, through_flow: 14 },
      expected_effect: 'Create alternative API access paths, reduce serialization',
      effort_scope: 'MODULE_LEVEL',
      urgency: 'NEAR_TERM',
    },
    {
      intervention: 'BOUNDARY_REALIGNMENT',
      target: 'Frontend Application directory structure',
      source_condition: 'STRUCTURAL_BOUNDARY_DIVERGENCE',
      evidence: { divergence: 'measured cross-boundary import ratio' },
      expected_effect: 'Align governance boundaries with structural reality',
      effort_scope: 'MODULE_LEVEL',
      urgency: 'NEAR_TERM',
    },
    {
      intervention: 'CONVERGENCE_CENTER_DECOMPOSITION',
      target: 'Platform Infrastructure and Data',
      source_condition: 'COMPOUND_CONVERGENCE',
      evidence: { condition_count: 5, severity: 'CRITICAL' },
      expected_effect: 'Reduce mass concentration, distribute structural load',
      effort_scope: 'ARCHITECTURAL',
      urgency: 'STRATEGIC',
    },
    {
      intervention: 'TEMPORAL_INTELLIGENCE_ESTABLISHMENT',
      target: 'Program-wide',
      source_condition: null,
      evidence: { gap: 'Temporal behavioral slices unmeasurable with single snapshot' },
      expected_effect: 'Enable trajectory analysis, trend detection, velocity decay measurement',
      effort_scope: 'CAPABILITY',
      urgency: 'STRATEGIC',
    },
  ],
  urgency_rules: {
    IMMEDIATE: 'severity CRITICAL OR effort_scope FILE_LEVEL/PROCESS_LEVEL',
    NEAR_TERM: 'effort_scope MODULE_LEVEL AND severity HIGH',
    STRATEGIC: 'effort_scope ARCHITECTURAL/CAPABILITY OR requires temporal data',
  },
}
```

**Source:** Per-condition CONDITION_INTERVENTIONS (L2 static), severity and domain targets from synthesized conditions (L2), constriction/fragility/divergence surfaces (L1)

**Derivation:** DETERMINISTIC for intervention identification (each condition type has known intervention patterns). Urgency classification is RULE-BASED (severity × effort_scope).

### 2.7 Absence Profile

What the system looked for and did not find — negative evidence.

```
absence_profile: {
  inactive_conditions: [
    { condition_type: 'GOVERNANCE_COVERAGE_GAP', reason: 'All nodes domain-anchored — governance coverage is complete', classification: 'POSITIVE' },
  ],
  unmeasured_conditions: [
    { condition_type: 'DEPENDENCY_DEBT_ACCUMULATION', reason: 'Requires temporal evidence — deferred behavioral slice', classification: 'EXPECTED' },
    { condition_type: 'POSTURE_DRIFT', reason: 'Requires multiple snapshots', classification: 'EXPECTED' },
    { condition_type: 'VELOCITY_DECAY', reason: 'Requires temporal measurement', classification: 'EXPECTED' },
  ],
  non_activated_signals: [
    { signal_id: 'PSIG-003', status: 'NOT_ACTIVATED', implication: 'No evidence for this pressure dimension' },
    { signal_id: 'PSIG-005', status: 'NOT_ACTIVATED', implication: 'No evidence for this pressure dimension' },
  ],
  classification_counts: {
    POSITIVE: 1,
    EXPECTED: 3,
    CONCERNING: 0,
  },
}
```

**Source:** CONDITION_VOCABULARY (full set) compared against synthesisResult.active (L2), signal_registry non-activated signals (L1), behavioral slice inventory (static)

**Derivation:** DETERMINISTIC — set comparison (all possible conditions minus active conditions = absent conditions). Classification requires knowledge of WHY something is absent: temporal requirement = EXPECTED, structurally clean = POSITIVE, evidence-present but not triggered = may need investigation.

### 2.8 Competitive Intelligence

What PI detected that traditional analysis cannot — detection capability assessment.

```
competitive_intelligence: {
  detection_advantages: [
    {
      finding: 'COMPOUND_CONVERGENCE',
      traditional_equivalent: null,
      detection_gap: 'Traditional reviews examine one dimension at a time — convergence of 5 independent conditions on one domain is invisible',
      category: 'MULTI_DIMENSIONAL_INTERSECTION',
    },
    {
      finding: 'EXECUTION_FRAGILITY',
      traditional_equivalent: 'code_complexity_metrics',
      detection_gap: 'Traditional conflates fragility with complexity — fragility is topological (coupling × cohesion), not textual (LOC, cyclomatic)',
      category: 'TOPOLOGICAL_VS_TEXTUAL',
    },
    {
      finding: 'EXECUTION_CONSTRICTION',
      traditional_equivalent: 'merge_conflict_analysis',
      detection_gap: 'Velocity analysis attributes slowdowns to process — bridge-node serialization creates throughput ceilings invisible to process metrics',
      category: 'TOPOLOGICAL_CONSTRAINT',
    },
    {
      finding: 'STRUCTURAL_BOUNDARY_DIVERGENCE',
      traditional_equivalent: 'code_ownership_review',
      detection_gap: 'Traditional assumes directory structure = coupling structure — cross-boundary import ratio reveals governance blind spots',
      category: 'DECLARED_VS_ACTUAL',
    },
    {
      finding: 'CONSEQUENCE_INTERACTIONS',
      traditional_equivalent: null,
      detection_gap: 'Traditional treats findings independently — consequence combination rules detect emergent risks from co-located conditions',
      category: 'EMERGENT_RISK',
    },
    {
      finding: 'BEHAVIORAL_CLASS_CONVERGENCE',
      traditional_equivalent: null,
      detection_gap: 'Cross-dimensional assessment requires cognition ontology — 5-class activation profile reveals the nature of structural challenge, not just its severity',
      category: 'COGNITION_ONTOLOGY',
    },
  ],
}
```

**Source:** Each detection_advantage derives from the detection method of the corresponding condition type. The gap is a PROPERTY of the measurement — it exists because traditional tools lack the measurement, not because a human decided to frame it competitively.

**Derivation:** DETERMINISTIC — each condition type's detection method implies what traditional analysis misses. A TRADITIONAL_DETECTABILITY field on CONDITION_VOCABULARY would formalize this.

### 2.9 Operational Ceiling

The integrating assessment — what the program's structural reality means for its operational capacity.

```
operational_ceiling: {
  posture_statement: {
    qualified: true,
    functional: true,
    ceiling_exists: true,
    ceiling_nature: 'STRUCTURAL',
  },
  ceiling_drivers: [
    { driver: 'COMPOUND_CONVERGENCE at Platform Infrastructure', severity: 'CRITICAL', share_of_ceiling: 'PRIMARY' },
    { driver: 'COMPOUND_CONVERGENCE at Frontend Application', severity: 'CRITICAL', share_of_ceiling: 'PRIMARY' },
    { driver: 'BRIDGE_SERIALIZATION (28 nodes)', severity: 'HIGH', share_of_ceiling: 'CONTRIBUTING' },
    { driver: 'DEPENDENCY_AMPLIFICATION (111 hub)', severity: 'HIGH', share_of_ceiling: 'CONTRIBUTING' },
  ],
  ceiling_properties: {
    staffing_sensitive: false,
    process_sensitive: false,
    architecture_sensitive: true,
    persistence: 'Persists regardless of team composition, sprint planning, or process maturity',
  },
  operational_experience: {
    likely_symptoms: [
      'Merge conflicts in shared layers',
      'Broader-than-expected blast radii from simple changes',
      'Coordination overhead disproportionate to work scope',
      'Velocity plateaus despite staffing increases',
    ],
    symptom_source: 'STRUCTURAL',
  },
}
```

**Source:** synthesisResult.composites (L2), constriction_surface (L1), structural_centrality (L0), ceiling_properties derived from constraint_inventory

**Derivation:** Ceiling existence is DETERMINISTIC (COMPOUND_CONVERGENCE at CRITICAL = ceiling exists). Ceiling properties are RULE-BASED (staffing_sensitive = false when constraints are topological). Likely symptoms are VOCABULARY-BASED — formalizable as condition-type-specific operational experience patterns.

---

## 3. Schema Summary

| Object | Fields | Source Layer | Derivation |
|---|---|---|---|
| structural_posture | qualification, scale, architectural_pattern, technology_profile, signal_profile | L0–L3 | DETERMINISTIC |
| tension_map | convergence_centers, cross_center_coupling, behavioral_class_activation | L2–L3 | DETERMINISTIC |
| constraint_inventory | throughput_ceilings, blast_radius_exposures, governance_misalignments, fragility, rigidity | L0–L1 | DETERMINISTIC |
| exposure_assessment | concentration_exposure, governance_exposure, fragility_exposure | L0–L2 | DETERMINISTIC |
| trajectory_assessment | worsening, stable, unmeasured | L2–L3 | DETERMINISTIC (property of patterns) |
| decision_surface | leverage_points, urgency_rules | L1–L2 + static | RULE-BASED |
| absence_profile | inactive, unmeasured, non_activated | L1–L2 + vocabulary | DETERMINISTIC (set comparison) |
| competitive_intelligence | detection_advantages | Static (condition properties) | DETERMINISTIC |
| operational_ceiling | posture, ceiling_drivers, ceiling_properties, operational_experience | L2 + rules | RULE-BASED |

**Every object in the ECP is deterministically derivable from governed pipeline outputs.**

None require interpretation. None require audience calibration. None require narrative judgment. None require consulting craft.

The entire 25% "consulting craft" (T7) was a misclassification. What was classified as T7 was actually a mixture of:
- **Latent L4 cognition** — structured objects that were computed mentally but never formalized
- **L5 projection rendering** — audience-specific format decisions that belong in the rendering layer

---

## 4. The ECP as Runtime Artifact

The ECP is not a document scaffold. It is a **runtime artifact** with the same governance properties as every other PI artifact:

| Property | Value |
|---|---|
| Deterministic | YES — same inputs → same ECP |
| Replayable | YES — reproducible from CIP |
| Evidence-bound | YES — every field traces to a source artifact |
| Governed | YES — produced under PI governance, no interpretation without 75.x |
| Storable | YES — JSON-serializable structured object |
| Diffable | YES — two ECPs from different snapshots can be structurally compared |
| Projectable | YES — multiple rendering surfaces from one ECP |

The ECP can be:
- Stored alongside specimen artifacts (`runs/{run_id}/executive_cognition_package.json`)
- Versioned across time (delta analysis between ECPs)
- Validated (all fields trace to source artifacts)
- Replayed (same CIP always produces same ECP)
- Projected (one ECP → N deliverables)
