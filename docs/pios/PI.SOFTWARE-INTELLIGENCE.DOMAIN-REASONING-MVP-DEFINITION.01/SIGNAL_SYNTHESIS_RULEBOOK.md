# SIGNAL_SYNTHESIS_RULEBOOK.md

## Authority

- Stream: PI.SOFTWARE-INTELLIGENCE.DOMAIN-REASONING-MVP-DEFINITION.01
- Classification: G2 — Architecture-Consuming
- Specimen: GENESIS (run_blueedge_genesis_e2e_03)
- Doctrine: Conditions are topology mutation events, not UI objects

---

## 1. Signal Feature Taxonomy

Features are semantic properties extracted from signal metadata. Every feature must derive from fields that exist in the signal payload, pressure zone state, and structural enrichment.

### 1.1 Feature Definitions

| Feature | Derivation Source | Extraction Rule |
|---|---|---|
| `pressure_concentration` | signal.zone_id IS NOT NULL AND zone.zone_class IN (COMPOUND_ZONE, COUPLING_ZONE, PROPAGATION_ZONE, RESPONSIBILITY_ZONE) | Signal participates in a classified pressure zone |
| `coordination_load` | signal.primary_domain matches a domain with structural_role = HUB or SPINE in structural_enrichment | Signal affects a structurally central domain |
| `dependency_amplification` | signal.signal_value > 10x threshold AND signal.signal_family = ISIG AND signal derives from import in-degree | File-level dependency concentration exceeds population norms by extreme margin |
| `propagation_asymmetry` | signal.signal_family = ISIG AND signal derives from import out-degree AND signal.severity >= ELEVATED | A single file's outbound dependency spread creates asymmetric propagation surface |
| `coupling_exposure` | signal.signal_id IN (PSIG-001, PSIG-002) OR (signal.signal_family = PSIG AND signal.signal_label contains 'coupling') | Domain-level coupling exceeds structural norms |
| `resilience_concentration` | signal.signal_id = PSIG-004 OR (zone.zone_class = COMPOUND_ZONE AND zone.condition_count >= 3) | Structural resilience depends disproportionately on one region |
| `structural_mass_asymmetry` | signal.signal_family = DPSIG AND signal.severity >= ELEVATED | Cluster-level structural mass is asymmetrically distributed |
| `domain_anchoring_gap` | signal.signal_id = PSIG-006 AND signal.activation_state != NOMINAL AND signal.signal_value > 0 | Structural components exist without domain anchoring |
| `domain_anchoring_complete` | signal.signal_id = PSIG-006 AND signal.signal_value = 0 | All structural nodes are domain-anchored |
| `topology_blindspot` | domain_id IN pressure_zone_state.structural_blind_spot_entities | Domain excluded from pressure zone candidacy due to insufficient structural evidence |
| `cross_layer_convergence` | signals from >= 2 different families (ISIG + PSIG, or DPSIG + PSIG) affect the same structural region (domain or cluster) | Multi-layer evidence converges on same target |

### 1.2 Feature Extraction Algorithm

```
For each signal in signal_interpretations:
  1. Read signal_id, signal_family, severity, activation_state, signal_value
  2. Read primary_entity, primary_domain from signal registry
  3. Look up zone_id, zone_class from pressure_zone_state.domain_zone_mapping
  4. Look up structural_role from structural_enrichment (if domain is known)
  5. Apply extraction rules from §1.1 to tag signal with features[]
  6. Record affected_domain_ids, affected_cluster_ids from zone membership and cluster containment
```

---

## 2. Condition Synthesis Rules

Each rule produces a **topology mutation event**, not a textual card. The `topology_overlay` field is the primary output. The `title` and `operational_meaning` are explainability traces.

### 2.1 Rule: DELIVERY_PRESSURE_CONCENTRATION

**Trigger:**
- `pressure_concentration` active on >= 2 signals
- AND those signals share the same `zone_id`
- AND zone.zone_class = COMPOUND_ZONE

**GENESIS Proof:**
- PSIG-001 (coupling_pressure, HIGH, DOM-04, PZ-001) → `pressure_concentration` ✓
- PSIG-002 (domain_coupling_pressure, HIGH, DOM-04, PZ-001) → `pressure_concentration` ✓
- PSIG-004 (zone_coverage_concentration, HIGH, DOM-04, PZ-001) → `pressure_concentration` ✓
- PZ-001 zone_class = COMPOUND_ZONE ✓
- **FIRES** → 3 contributing signals on PZ-001

**Topology Mutation:**
```
overlay_mode: 'PRESSURE_ZONE'
emphasis_domains: [anchor_domain]        // DOM-04 → DOMAIN-04
dim_domains: [all non-zone, non-blindspot domains]
advisory_zones: [structural_blind_spot_entities]  // DOM-07, DOM-10, DOM-11, DOM-12, DOM-13
signal_overlays: [zone_boundary_rect, anchor_pulse, condition_legend]
corridor_paths: []                       // No corridors — zone is spatial, not directional
```

**Explainability Trace:**
- Title: "Delivery Pressure Concentration"
- Operational meaning: "Execution pressure converges on {anchor_domain_name} — {condition_count} structural conditions active in a compound zone. Delivery decisions affecting this region carry elevated structural exposure."
- Severity: MAX(contributing_signal_severities)
- Supporting signals: [contributing signal IDs]
- Qualification boundary: "Structural confirmation required before deployment decisions"

---

### 2.2 Rule: DEPENDENCY_CHOKE_POINT

**Trigger:**
- `dependency_amplification` active on >= 1 signal
- AND signal.severity >= HIGH
- AND signal.primary_entity is not null

**GENESIS Proof:**
- ISIG-001 (Import Hub Pressure, HIGH, 35.29x, primary_entity=backend/src/common/dto/index.ts) → `dependency_amplification` ✓ (35.29 > 10x threshold of 5.0)
- **FIRES** → 1 contributing signal

**Topology Mutation:**
```
overlay_mode: 'IMPORT_PRESSURE'
emphasis_domains: [domain containing primary_entity]  // resolve file → domain
dim_domains: [domains with no dependency relationship to hub]
advisory_zones: []
signal_overlays: [hub_node_emphasis, import_corridor_arrows]
corridor_paths: [top-N import paths from hub file]
```

**Explainability Trace:**
- Title: "Dependency Choke Point"
- Operational meaning: "A structural dependency hub ({primary_entity}) concentrates {in_degree} inbound dependencies — {signal_value}x the population mean. Failure or change at this point has disproportionate downstream impact across {affected_file_count} files."
- Severity: signal.severity
- Supporting signals: [ISIG-001]
- Qualification boundary: "Advisory-bound until cross-domain topology confirms corridor exposure"

---

### 2.3 Rule: PROPAGATION_ASYMMETRY

**Trigger:**
- `propagation_asymmetry` active on >= 1 signal
- AND signal.severity >= ELEVATED

**GENESIS Proof:**
- ISIG-002 (Import Fan Asymmetry, HIGH, 22.25x, primary_entity=frontend/App.tsx) → `propagation_asymmetry` ✓
- **FIRES** → 1 contributing signal

**Topology Mutation:**
```
overlay_mode: 'PROPAGATION_CORRIDOR'
emphasis_domains: [domain containing primary_entity]  // resolve file → domain
dim_domains: [domains outside propagation reach]
advisory_zones: []
signal_overlays: [fan_out_arrows, downstream_impact_markers]
corridor_paths: [outbound dependency paths from fan-out file]
```

**Explainability Trace:**
- Title: "Propagation Asymmetry"
- Operational meaning: "Outbound dependency spread is asymmetric — {primary_entity} imports {out_degree} files ({signal_value}x the population mean). Changes here ripple disproportionately across the system."
- Severity: signal.severity
- Supporting signals: [ISIG-002]
- Qualification boundary: "Advisory-bound — structural confirmation needed"

---

### 2.4 Rule: STRUCTURAL_MASS_CONCENTRATION

**Trigger:**
- `structural_mass_asymmetry` active on >= 1 signal
- AND at least one of: DPSIG-031 (Cluster Pressure Index) or DPSIG-032 (Cluster Fan Asymmetry) is ELEVATED or higher

**GENESIS Proof:**
- DPSIG-031 (CPI, ELEVATED, 3.45x, CLU-04/backend, 541 of 944 nodes) → `structural_mass_asymmetry` ✓
- DPSIG-032 (CFA, ELEVATED, 57.31%, CLU-04/backend) → `structural_mass_asymmetry` ✓
- **FIRES** → 2 contributing signals, same cluster

**Topology Mutation:**
```
overlay_mode: 'CLUSTER_PRESSURE'
emphasis_domains: [domains contained in dominant cluster]  // CLU-04 → resolve to domain IDs
dim_domains: [domains in non-dominant clusters]
advisory_zones: [singleton clusters — structurally isolated]
signal_overlays: [cluster_boundary_emphasis, mass_indicator, gravity_center]
corridor_paths: []
```

**Explainability Trace:**
- Title: "Structural Mass Concentration"
- Operational meaning: "Structural load is concentrated in the {cluster_name} cluster — {node_count} of {total_nodes} structural nodes ({pct_share}%). This cluster carries disproportionate architectural weight. Organizational dependency on this structural region is elevated."
- Severity: MAX(contributing_signal_severities)
- Supporting signals: [DPSIG-031, DPSIG-032]
- Qualification boundary: "Elevated structural attention required"

---

### 2.5 Rule: CROSS_DOMAIN_COUPLING_PRESSURE

**Trigger:**
- `coupling_exposure` active on >= 1 signal
- AND signal affects a domain with structural_role = HUB or SPINE

**GENESIS Proof:**
- PSIG-001 (coupling_pressure, HIGH, DOM-04) → `coupling_exposure` ✓
- PSIG-002 (domain_coupling_pressure, HIGH, DOM-04) → `coupling_exposure` ✓
- DOM-04 structural_role = HUB (from structural_enrichment) ✓
- **FIRES** → 2 contributing signals

**Topology Mutation:**
```
overlay_mode: 'COUPLING_CORRIDOR'
emphasis_domains: [affected_domain]               // DOMAIN-04
dim_domains: [domains with no coupling to affected domain]
advisory_zones: []
signal_overlays: [coupling_edge_emphasis, hub_indicator]
corridor_paths: [coupling paths from hub domain to dependent domains]
```

**Explainability Trace:**
- Title: "Cross-Domain Coupling Pressure"
- Operational meaning: "Cross-domain coupling at {domain_name} exceeds structural norms — this hub domain's interdependency constrains operational independence for {dependent_count} downstream domains."
- Severity: MAX(contributing_signal_severities)
- Supporting signals: [PSIG-001, PSIG-002]
- Qualification boundary: "Structural confirmation required before deployment decisions"

**Note:** This rule may co-fire with DELIVERY_PRESSURE_CONCENTRATION when the coupling signals are also pressure zone conditions. When both fire, the conditions are distinct: DPC describes the zone-level convergence; CDCP describes the coupling-specific operational meaning. They share topology targets but produce different overlays.

---

### 2.6 Rule: GOVERNANCE_COVERAGE_STATUS

**Trigger:**
- Signal PSIG-006 is present
- Always produces a condition (either COMPLETE or GAP)

**GENESIS Proof:**
- PSIG-006 (unanchored_nodes, ACTIVATED, value=0) → `domain_anchoring_complete` ✓
- structural_blind_spot_entities present (5 domains) → `topology_blindspot` ✓
- **FIRES** → 1 signal, coverage status + blind spots

**Topology Mutation (when gap):**
```
overlay_mode: 'COVERAGE_GAP'
emphasis_domains: []
dim_domains: []
advisory_zones: [unanchored_node_domains]
signal_overlays: [blind_spot_indicators, unanchored_markers]
corridor_paths: []
```

**Topology Mutation (when complete):**
```
overlay_mode: 'COVERAGE_COMPLETE'
emphasis_domains: []                    // No emphasis — nominal state
dim_domains: []
advisory_zones: [structural_blind_spot_entities]  // Blind spots still shown
signal_overlays: [anchoring_status_indicator]
corridor_paths: []
```

**Explainability Trace (gap):**
- Title: "Governance Coverage Gap"
- Operational meaning: "Structural components exist without domain anchoring — governance coverage has gaps. {unanchored_count} structural blind spots affect qualification confidence."
- Severity: ELEVATED
- Qualification boundary: "Governance coverage verification required"

**Explainability Trace (complete):**
- Title: "Governance Coverage Complete"
- Operational meaning: "All structural nodes are domain-anchored. Governance coverage is structurally complete. {blind_spot_count} domains remain outside pressure zone candidacy."
- Severity: NOMINAL
- Qualification boundary: "Verified — no gap"

---

### 2.7 Rule: COMPOUND_CONVERGENCE (Composite)

**Trigger:**
- >= 3 primitive conditions fire
- AND >= 2 of those conditions share topology targets (same domain or same cluster)
- Runs AFTER all primitive rules have resolved

**GENESIS Proof:**
- DELIVERY_PRESSURE_CONCENTRATION fires on DOM-04 ✓
- DEPENDENCY_CHOKE_POINT fires (primary_entity in DOM-04 territory) ✓
- CROSS_DOMAIN_COUPLING_PRESSURE fires on DOM-04 ✓
- STRUCTURAL_MASS_CONCENTRATION fires on CLU-04 (contains DOM-04) ✓
- 4 conditions converge on DOM-04/CLU-04 region ✓
- **FIRES** → 4 contributing conditions, convergence domain = DOMAIN-04

**Topology Mutation:**
```
overlay_mode: 'COMPOUND_CONVERGENCE'
emphasis_domains: [convergence_domain]           // DOMAIN-04
dim_domains: [all non-convergence, non-advisory domains]
advisory_zones: [structural_blind_spot_entities]
signal_overlays: [
  zone_boundary_rect,           // from DPC
  hub_indicator,                // from CDCP
  import_corridor_arrows,       // from DEPENDENCY_CHOKE_POINT
  cluster_boundary_emphasis,    // from SMC
  convergence_indicator         // compound: multi-factor badge
]
corridor_paths: [coupling_paths, import_paths]
```

**Explainability Trace:**
- Title: "Compound Structural Convergence"
- Operational meaning: "{convergence_count} operational conditions converge on {domain_name}: {condition_list}. This is the highest-priority structural attention target — multiple independent structural indicators point to the same region."
- Severity: CRITICAL (composite convergence always escalates)
- Supporting conditions: [list of primitive condition_ids]
- Qualification boundary: "Structural review mandatory before delivery-affecting decisions"

---

## 3. Condition Severity Aggregation

### 3.1 Primitive Condition Severity

Severity = MAX(contributing_signal_severities)

| Signal Severity | Numeric |
|---|---|
| CRITICAL | 0 |
| HIGH | 1 |
| ELEVATED | 2 |
| MODERATE | 3 |
| LOW | 4 |
| NOMINAL | 5 |

### 3.2 Composite Condition Severity

Composite conditions escalate severity:
- If >= 3 contributing conditions: severity = min(MAX(primitive_severities), CRITICAL)
- If 2 contributing conditions: severity = MAX(primitive_severities) (no escalation)
- Composites never de-escalate below their strongest primitive

### 3.3 GENESIS Severity Proof

| Condition | Contributing Severities | Result |
|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | HIGH, HIGH, HIGH | HIGH |
| DEPENDENCY_CHOKE_POINT | HIGH | HIGH |
| PROPAGATION_ASYMMETRY | HIGH | HIGH |
| STRUCTURAL_MASS_CONCENTRATION | ELEVATED, ELEVATED | ELEVATED |
| CROSS_DOMAIN_COUPLING_PRESSURE | HIGH, HIGH | HIGH |
| GOVERNANCE_COVERAGE_STATUS | ACTIVATED (→ NOMINAL, value=0) | NOMINAL |
| COMPOUND_CONVERGENCE | HIGH, HIGH, HIGH, ELEVATED | CRITICAL (4 conditions ≥ 3 → escalation) |

---

## 4. Topology Binding Rules

### 4.1 Domain Resolution

Signals use inconsistent domain identifiers:
- PSIG signals: `DOM-NN` (from pressure zone state)
- Semantic topology: `DOMAIN-NN` (from semantic_domain_registry)
- ISIG signals: file paths (no domain, must resolve via cluster → domain mapping)
- DPSIG signals: cluster IDs (must resolve via cluster → domain containment)

Resolution chain:
```
DOM-NN → resolveToRegistryId() → DOMAIN-NN
file_path → cluster_containment → CLU-NN → cluster_to_domain_mapping → DOMAIN-NN
CLU-NN → cluster_to_domain_mapping → DOMAIN-NN[]
```

### 4.2 Topology Target Classification

Each condition's affected targets are classified:

| Target Type | Topology Treatment | Example |
|---|---|---|
| CONVERGENCE_TARGET | Maximum emphasis — enlarged, pulsing, compound border | DOMAIN-04 under COMPOUND_CONVERGENCE |
| ZONE_MEMBER | Zone emphasis — colored stroke, zone boundary | DOMAIN-04 under DPC |
| CORRIDOR_MEMBER | Path emphasis — directional arrows, thickened edges | Domains along coupling or import corridors |
| ADVISORY_TARGET | Advisory treatment — dashed ring, reduced opacity | DOM-07, DOM-10 etc. (blind spots) |
| DIMMED | Reduced opacity, no interaction | All other domains |

### 4.3 Overlay Composition

When multiple conditions are active simultaneously (COMPOUND_CONVERGENCE), overlays compose:

1. Each condition's `topology_overlay` is a layer
2. Layers stack with the following z-order (highest on top):
   - convergence_indicator (z: 4)
   - zone_boundary (z: 3)
   - corridor_paths (z: 2)
   - hub/mass indicators (z: 1)
   - advisory zones (z: 0)
3. Conflicting emphasis on the same domain: highest severity wins
4. Conflicting dim vs emphasis on the same domain: emphasis wins

---

## 5. Qualification / Advisory Boundary Rules

### 5.1 Boundary Classification

Each synthesized condition carries a qualification boundary:

| Boundary | Meaning | When |
|---|---|---|
| `GOVERNED` | Condition is grounded in governed evidence; conclusions carry authority | All contributing signals derive from governed pipeline artifacts (40.x, 75.x) with STRUCTURAL or FULL confidence |
| `ADVISORY_BOUND` | Condition is grounded in structural evidence but interpretation is advisory | Any contributing signal has confidence = ADVISORY, or condition involves cross-domain inference |
| `STRUCTURAL_ONLY` | Condition derives from structural topology alone; no semantic enrichment | Contributing signals are Level_1 only (ISIG), no domain-level (PSIG) corroboration |

### 5.2 GENESIS Boundary Proof

| Condition | Contributing Confidence | Boundary |
|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | STRUCTURAL (S1 specimen, all PSIG) | GOVERNED (pipeline-derived, zone-classified) |
| DEPENDENCY_CHOKE_POINT | STRUCTURAL (ISIG-001, Level_1) | STRUCTURAL_ONLY (file-level, no domain corroboration) |
| PROPAGATION_ASYMMETRY | STRUCTURAL (ISIG-002, Level_1) | STRUCTURAL_ONLY |
| STRUCTURAL_MASS_CONCENTRATION | STRUCTURAL (DPSIG, topology-level) | GOVERNED |
| CROSS_DOMAIN_COUPLING_PRESSURE | STRUCTURAL (PSIG-001/002) | GOVERNED |
| GOVERNANCE_COVERAGE_STATUS | STRUCTURAL (PSIG-006, telemetry) | GOVERNED |
| COMPOUND_CONVERGENCE | Mixed (GOVERNED + STRUCTURAL_ONLY) | ADVISORY_BOUND (mixed confidence) |

### 5.3 Boundary Escalation

When STRUCTURAL_ONLY conditions are corroborated by GOVERNED conditions on the same topology target:
- DEPENDENCY_CHOKE_POINT (STRUCTURAL_ONLY on DOM-04 region) + DELIVERY_PRESSURE_CONCENTRATION (GOVERNED on DOM-04) → DEPENDENCY_CHOKE_POINT escalates to ADVISORY_BOUND
- Escalation is one step only. STRUCTURAL_ONLY → ADVISORY_BOUND (never directly to GOVERNED)

---

## 6. Evidence Trace Requirements

Every synthesized condition MUST include ALL of the following fields. Missing fields = invalid condition.

### 6.1 Canonical Condition Schema

```json
{
  "condition_id": "string — kebab-case unique identifier",
  "condition_type": "string — rule name from §2",

  "internal_condition_id": "string — engine vocabulary (STRUCTURAL_MASS_CONCENTRATION)",
  "technical_semantic_label": "string — L2 structural semantic (Structural Load Concentration)",
  "operator_cognition_title": "string — L3 operator vocabulary (Delivery Coordination Overload)",
  "operational_consequence": "string — what this means for operator decisions",
  "governance_boundary": "GOVERNED | ADVISORY_BOUND | STRUCTURAL_ONLY",
  "topology_effect": "string — what the topology does when this condition activates",

  "severity": "string — aggregated per §3",
  "supporting_signal_ids": ["array of signal_ids that triggered this condition"],
  "shared_topology_targets": {
    "domains": ["DOMAIN-NN"],
    "clusters": ["CLU-NN"],
    "files": ["path/to/file"]
  },
  "pressure_zone_ids": ["PZ-NNN or empty"],
  "evidence_mode": "TOPOLOGY_DRIVEN | SIGNAL_DRIVEN | MIXED",

  "topology_overlay": {
    "overlay_mode": "string",
    "emphasis_domains": [],
    "dim_domains": [],
    "advisory_zones": [],
    "signal_overlays": [],
    "corridor_paths": []
  },

  "guided_interventions": ["condition-contextual interventions per §12"],
  "orchestration_hooks": ["downstream runtime mutations this condition enables"],

  "contributing_features": ["feature tags from §1"],
  "derivation_trace": "string — human-readable derivation chain"
}
```

### 6.2 Three-Layer Vocabulary Governance

Every condition carries three vocabulary layers. These are NOT optional. They are NOT improvised per component. They are schema-enforced.

| Layer | Field | Purpose | Audience | Example |
|---|---|---|---|---|
| L1 — Engine | `internal_condition_id` | Rule identification, code references, logging | Engine / developers | `STRUCTURAL_MASS_CONCENTRATION` |
| L2 — Structural Semantic | `technical_semantic_label` | Structural meaning for advanced operators / explainability | Technical operators | "Structural Load Concentration" |
| L3 — Operator Cognition | `operator_cognition_title` | Operational consequence for decision-makers | Executive / operator | "Delivery Coordination Overload" |

### 6.3 GENESIS Vocabulary Table

| Internal (L1) | Structural Semantic (L2) | Operator Cognition (L3) |
|---|---|---|
| `DELIVERY_PRESSURE_CONCENTRATION` | Compound Pressure Zone Convergence | Delivery Pressure Concentration |
| `DEPENDENCY_CHOKE_POINT` | Dependency Hub Concentration | Structural Dependency Bottleneck |
| `PROPAGATION_ASYMMETRY` | Outbound Dependency Spread Asymmetry | Change Propagation Exposure |
| `STRUCTURAL_MASS_CONCENTRATION` | Cluster Load Asymmetry | Structural Load Imbalance |
| `CROSS_DOMAIN_COUPLING_PRESSURE` | Domain Interdependency Overload | Cross-Domain Coupling Risk |
| `GOVERNANCE_COVERAGE_STATUS` | Structural Anchoring Completeness | Governance Coverage Status |
| `COMPOUND_CONVERGENCE` | Multi-Condition Topology Convergence | Compound Structural Convergence |

### 6.4 Authority Hierarchy

The `topology_overlay` is the PRIMARY output — it is the topology mutation event.

The `guided_interventions` are the SECONDARY output — they are what the operator can do given this cognition state.

The vocabulary fields (`operator_cognition_title`, `operational_consequence`, `topology_effect`) are EXPLAINABILITY — they describe what the topology is already showing.

TopologyCognitionState is a runtime authority object. It does not get consumed by React components for rendering decisions. It drives:
- topology overlay mutations (what the SVG shows)
- left panel content (what evidence and interpretation appears)
- right panel queries (what the operator can ask)
- guided interventions (what actions are available)
- orchestration hooks (what downstream mutations are enabled)
- SQO progression signals (what qualification transitions are reachable)

Components render what the authority declares. They do not interpret the state.

---

## 7. Suppression Rules

### 7.1 Redundancy Suppression

When a composite condition (COMPOUND_CONVERGENCE) fires, its contributing primitive conditions are NOT suppressed — they remain available for individual topology overlay activation. The composite provides the convergence view; primitives provide the decomposed view.

### 7.2 Nominal Suppression

Conditions with severity = NOMINAL are synthesized but suppressed from the active condition list. They remain queryable ("Show me governance coverage status") but do not appear in the default topology cognition state.

GENESIS example: GOVERNANCE_COVERAGE_STATUS fires as NOMINAL (value=0, all anchored). Suppressed from active display. Blind spots still visible as advisory zones when any other condition targets overlapping domains.

### 7.3 Threshold Suppression

If a rule's trigger conditions are met but ALL contributing signals have severity = LOW or below: the condition synthesizes but is suppressed from default display. Available on demand.

---

## 8. Fallback Behavior (Incomplete Evidence)

### 8.1 Missing Signal Families

| Missing | Impact | Fallback |
|---|---|---|
| No ISIG signals | DEPENDENCY_CHOKE_POINT and PROPAGATION_ASYMMETRY cannot fire | No file-level conditions. COMPOUND_CONVERGENCE reduces contributing condition count. |
| No DPSIG signals | STRUCTURAL_MASS_CONCENTRATION cannot fire | No cluster-level conditions. |
| No PSIG signals | DELIVERY_PRESSURE_CONCENTRATION and CROSS_DOMAIN_COUPLING_PRESSURE cannot fire | No domain-level pressure conditions. |
| No pressure zones | Zone-dependent rules cannot fire | Only signal-level conditions (DEPENDENCY_CHOKE_POINT, PROPAGATION_ASYMMETRY, STRUCTURAL_MASS_CONCENTRATION). |

### 8.2 Missing Structural Enrichment

If structural_enrichment is absent (no domain roles):
- `coordination_load` feature cannot be extracted
- Rules requiring HUB/SPINE role check degrade to severity-only triggers
- Qualification boundary for affected conditions downgrades to ADVISORY_BOUND

### 8.3 Zero Signals Activated

If all signals are NOMINAL or no signals exist:
- No conditions synthesize
- Topology remains in default state (SOFTWARE_TOPOLOGY_POSTURE)
- This is a valid operational state: "No structural conditions detected"

---

## 9. GENESIS Full Synthesis Proof

### Input: 8 signals from run_blueedge_genesis_e2e_03

### Step 1: Feature Extraction

| Signal | Features |
|---|---|
| PSIG-001 (coupling_pressure, HIGH) | pressure_concentration, coupling_exposure, cross_layer_convergence |
| PSIG-002 (domain_coupling_pressure, HIGH) | pressure_concentration, coupling_exposure, cross_layer_convergence |
| PSIG-004 (zone_coverage_concentration, HIGH) | pressure_concentration, resilience_concentration |
| PSIG-006 (unanchored_nodes, ACTIVATED, value=0) | domain_anchoring_complete |
| ISIG-001 (Import Hub Pressure, HIGH, 35.29x) | dependency_amplification, cross_layer_convergence |
| ISIG-002 (Import Fan Asymmetry, HIGH, 22.25x) | propagation_asymmetry |
| DPSIG-031 (Cluster Pressure Index, ELEVATED, 3.45x) | structural_mass_asymmetry |
| DPSIG-032 (Cluster Fan Asymmetry, ELEVATED, 57.31%) | structural_mass_asymmetry |

### Step 2: Primitive Rule Firing

| Rule | Fires? | Contributing Signals | Severity | Topology Target |
|---|---|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | YES | PSIG-001, PSIG-002, PSIG-004 | HIGH | DOMAIN-04, PZ-001 |
| DEPENDENCY_CHOKE_POINT | YES | ISIG-001 | HIGH | backend/src/common/dto/index.ts → DOM-04 region |
| PROPAGATION_ASYMMETRY | YES | ISIG-002 | HIGH | frontend/App.tsx → (separate domain) |
| STRUCTURAL_MASS_CONCENTRATION | YES | DPSIG-031, DPSIG-032 | ELEVATED | CLU-04/backend → DOM-04 region |
| CROSS_DOMAIN_COUPLING_PRESSURE | YES | PSIG-001, PSIG-002 | HIGH | DOMAIN-04 |
| GOVERNANCE_COVERAGE_STATUS | YES (NOMINAL) | PSIG-006 | NOMINAL | System-wide (suppressed) |

### Step 3: Composite Rule Firing

| Rule | Fires? | Contributing Conditions | Convergence Target | Severity |
|---|---|---|---|---|
| COMPOUND_CONVERGENCE | YES | DPC, DCkP, SMC, CDCP (4 conditions on DOM-04/CLU-04) | DOMAIN-04 | CRITICAL |

Note: PROPAGATION_ASYMMETRY targets a different domain (frontend/App.tsx), so it does NOT contribute to COMPOUND_CONVERGENCE on DOM-04.

### Step 4: Final Synthesized Conditions

| # | Condition | Severity | Topology Target | Suppressed? |
|---|---|---|---|---|
| 1 | Compound Structural Convergence | CRITICAL | DOMAIN-04 | NO — primary attention target |
| 2 | Delivery Pressure Concentration | HIGH | DOMAIN-04, PZ-001 | NO — decomposable from #1 |
| 3 | Cross-Domain Coupling Pressure | HIGH | DOMAIN-04 | NO — decomposable from #1 |
| 4 | Dependency Choke Point | HIGH | DOM-04 region | NO — decomposable from #1 |
| 5 | Structural Mass Concentration | ELEVATED | CLU-04 → DOM-04 | NO — decomposable from #1 |
| 6 | Propagation Asymmetry | HIGH | frontend domain | NO — independent target |
| 7 | Governance Coverage Complete | NOMINAL | system-wide | YES — nominal suppression |

**Operator sees:** 1 compound convergence + 1 independent condition = 2 active topology cognition states (not 8 signal cards).

**Default topology state:** COMPOUND_CONVERGENCE overlay on DOMAIN-04. Operator can decompose into constituent conditions. Operator can separately activate PROPAGATION_ASYMMETRY to see the frontend propagation surface.

---

## 10. Hypothetical Second Client (Client B)

### Input: 5 hypothetical signals

| Signal | Family | Severity | Primary Entity | Domain |
|---|---|---|---|---|
| ISIG-001 | ISIG | ELEVATED | payments/api/client.ts (in-degree 45) | DOM-03 |
| ISIG-002 | ISIG | LOW | — | — |
| DPSIG-031 | DPSIG | MODERATE | — | CLU-02 |
| DPSIG-032 | DPSIG | LOW | — | CLU-02 |
| PSIG-006 | PSIG | ACTIVATED | value=3 (3 unanchored) | — |

### Feature Extraction

| Signal | Features |
|---|---|
| ISIG-001 | dependency_amplification (45 / mean, assuming ratio > 10x) |
| ISIG-002 | (LOW severity → no propagation_asymmetry feature) |
| DPSIG-031 | structural_mass_asymmetry |
| DPSIG-032 | (LOW severity → no feature) |
| PSIG-006 | domain_anchoring_gap (value=3 > 0) |

### Rule Firing

| Rule | Fires? | Why |
|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | NO | No pressure zones (no PSIG-001/002/004) |
| DEPENDENCY_CHOKE_POINT | YES | ISIG-001 ELEVATED, primary_entity present |
| PROPAGATION_ASYMMETRY | NO | ISIG-002 severity LOW |
| STRUCTURAL_MASS_CONCENTRATION | YES | DPSIG-031 ELEVATED (but DPSIG-032 LOW → only 1 signal) |
| CROSS_DOMAIN_COUPLING_PRESSURE | NO | No PSIG coupling signals |
| GOVERNANCE_COVERAGE_STATUS | YES (GAP) | PSIG-006 value=3 → domain_anchoring_gap |
| COMPOUND_CONVERGENCE | NO | < 3 conditions on same target |

### Result: 3 conditions

| Condition | Severity | Target |
|---|---|---|
| Dependency Choke Point | ELEVATED | DOM-03 (payments/api) |
| Structural Mass Concentration | MODERATE | CLU-02 |
| Governance Coverage Gap | ELEVATED | system-wide |

Different client. Same rules. Different topology targets. No BlueEdge-specific logic.

---

## 11. Doctrine Compliance Checklist

| # | Requirement | Status |
|---|---|---|
| 1 | Deterministic | YES — same inputs → same conditions |
| 2 | Traceable | YES — every condition traces to signal IDs and features |
| 3 | Evidence-bound | YES — features derive from payload fields, not inference |
| 4 | Client-agnostic | YES — rules reference signal semantics, not client names |
| 5 | Topology-aware | YES — every condition produces topology_overlay as primary output |
| 6 | Qualification-aware | YES — every condition carries qualification boundary |
| 7 | Explainable | YES — derivation_trace + contributing_features + supporting_signal_ids |
| 8 | Overrideable only through governed rule changes | YES — rules live in this rulebook, not hardcoded |
| 9 | Conditions are topology mutation events | YES — topology_overlay is primary, text is explainability trace |
| 10 | No hidden AI | YES — deterministic pattern matching, no LLM, no ML |
| 11 | 3-layer vocabulary governance | YES — every condition carries L1/L2/L3 as mandatory schema fields |
| 12 | TopologyCognitionState = runtime authority | YES — drives overlays, panels, queries, interventions, orchestration, SQO |
| 13 | Guided interventions are condition-contextual | YES — intervention set is a function of active cognition state |

---

## 12. Condition-Contextual Guided Interventions

### 12.1 Doctrine

Guided interventions are NOT a static list. They are a function of the active cognition state.

When no condition is active → no interventions available (topology is in default posture).
When a condition activates → interventions specific to that condition become available.
When the condition deactivates → those interventions disappear.

Interventions are NOT detached suggestions. They are runtime mutations enabled by the active cognition state.

### 12.2 Intervention Schema

```json
{
  "intervention_id": "string — unique identifier",
  "condition_id": "string — which condition enables this intervention",
  "action_type": "INSPECT | DECOMPOSE | TRACE | COMPARE | QUALIFY",
  "operator_label": "string — what the operator sees",
  "topology_mutation": "string — what happens to the topology when triggered",
  "panel_mutation": "string — what the left/right panel shows",
  "orchestration_effect": "string — downstream effect on orchestration/SQO"
}
```

### 12.3 GENESIS Intervention Map

**When COMPOUND_CONVERGENCE is active:**

| Intervention | Action Type | Topology Mutation | Panel Mutation |
|---|---|---|---|
| "Decompose convergence into contributing conditions" | DECOMPOSE | Overlay transitions from compound to selected primitive condition's overlay | Left panel shows selected primitive's evidence |
| "Inspect convergence domain structural role" | INSPECT | Convergence domain enlarges, connections emphasized | Left panel shows domain structural profile (role, centrality, member count) |
| "Compare convergence severity across conditions" | COMPARE | Conditions listed with severity indicators on topology | Right panel shows severity comparison matrix |
| "Assess qualification impact of convergence" | QUALIFY | Governance boundary indicators appear on convergence domain | Left panel shows qualification boundary assessment, SQO progression implications |

**When DELIVERY_PRESSURE_CONCENTRATION is active:**

| Intervention | Action Type | Topology Mutation | Panel Mutation |
|---|---|---|---|
| "Inspect pressure zone members" | INSPECT | Zone members emphasized, non-members dimmed | Left panel shows zone member inventory with per-member evidence |
| "Trace condition origins" | TRACE | Contributing signal paths visualized on topology | Left panel shows signal → feature → condition derivation chain |
| "Assess blast radius" | INSPECT | Advisory zones (blind spots) emphasized | Left panel shows blind spot inventory and proximity to zone |

**When DEPENDENCY_CHOKE_POINT is active:**

| Intervention | Action Type | Topology Mutation | Panel Mutation |
|---|---|---|---|
| "Trace dependency hub connections" | TRACE | Import corridors from hub file visualized | Left panel shows top-N dependents of hub file |
| "Inspect hub domain structural role" | INSPECT | Domain containing hub file emphasized | Left panel shows domain profile |
| "Assess propagation exposure from hub" | TRACE | Downstream impact paths from hub illuminated | Right panel shows "if this file changes, N files affected" |

**When PROPAGATION_ASYMMETRY is active:**

| Intervention | Action Type | Topology Mutation | Panel Mutation |
|---|---|---|---|
| "Trace outbound dependency spread" | TRACE | Fan-out corridors from asymmetric file visualized | Left panel shows outbound dependency inventory |
| "Inspect propagation domain" | INSPECT | Domain containing fan-out file emphasized | Left panel shows domain profile |

**When STRUCTURAL_MASS_CONCENTRATION is active:**

| Intervention | Action Type | Topology Mutation | Panel Mutation |
|---|---|---|---|
| "Inspect dominant cluster composition" | INSPECT | Cluster boundary emphasized, member domains highlighted | Left panel shows cluster member inventory |
| "Compare cluster load distribution" | COMPARE | All clusters sized by node count on topology | Right panel shows cluster distribution table |

**When GOVERNANCE_COVERAGE_STATUS is active (GAP):**

| Intervention | Action Type | Topology Mutation | Panel Mutation |
|---|---|---|---|
| "Inspect unanchored structural components" | INSPECT | Unanchored nodes/domains emphasized | Left panel shows unanchored component inventory |
| "Assess qualification impact of coverage gap" | QUALIFY | Governance boundary indicators on affected regions | Left panel shows qualification boundary + SQO implications |

### 12.4 Intervention Activation Rules

1. Interventions are ONLY available when their parent condition is active
2. Triggering an intervention mutates topology AND panel simultaneously
3. An intervention may transition the cognition state (e.g., DECOMPOSE transitions from COMPOUND_CONVERGENCE to a primitive condition)
4. Multiple interventions cannot be active simultaneously — triggering one replaces the previous
5. "Back" returns to the parent condition's default topology state
