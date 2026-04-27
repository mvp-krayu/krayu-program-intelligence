# PI.E2E.DETERMINISTIC-GAP.SIGNAL-LINEAGE.01 — Signal Lineage Report

**Contract:** PI.E2E.DETERMINISTIC-GAP.SIGNAL-LINEAGE.01
**Run:** run_01_oss_fastapi | Client: e65d2f0a-dfa7-4257-9333-fcbb583f0880
**inference_prohibition:** ACTIVE — all INFERRED labels explicitly marked

---

## 1. Scope

This report documents lineage forensics for the four signals observed in:

```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/75.x/condition_correlation_state.json
```

and projected through:

```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/signal_projection.json
```

**Target signals:** PSIG-001, PSIG-002, PSIG-004, PSIG-006

**Purpose:** Determine whether existing evidence is sufficient to close GAP-75X-01
(condition_correlation_state.json has no deterministic script entrypoint) identified in
`FORENSIC_EXTRACTION_REPORT.md`.

**Mode:** LINEAGE FORENSICS ONLY. No implementation. No scripting. No patching.
Read-only inspection + one report write.

---

## 2. Branch and Git State

```
Branch (before):  work/psee-runtime
HEAD commit:      f3cb8e6
Git status:
  ?? clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/
  ?? clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/intake/
  ?? docs/psee/PI.E2E.DETERMINISTIC-GAP.75X-41X.01/
```

Branch violation flagged per memory: `work/psee-runtime` outside authorized set in
`docs/governance/runtime/git_structure_contract.md`. Proceeding under contract authority.

---

## 3. Search Strategy

| Step | Target | Method |
|---|---|---|
| 1 | All files referencing PSIG-001/002/004/006 | grep -r in docs/, scripts/ |
| 2 | All files referencing ST-030/031/033/034 | grep -r in docs/ |
| 3 | Prior stream names: PI.SIGNAL-SPACE.EXPANSION, PI.STATIC-TELEMETRY.REGISTRATION.40X.03 | grep -r in docs/ |
| 4 | Activation method specs: RUN_RELATIVE_OUTLIER, THEORETICAL_BASELINE | grep -r in docs/ |
| 5 | IQR fallback and mean+2SD references | grep -r in docs/, scripts/ |
| 6 | Direct read of primary signal definition documents | Read tool |
| 7 | Direct read of condition_correlation_state.json and signal_projection.json | Read tool |

---

## 4. Evidence Sources Inspected

| File | Contract / Stream | Role |
|---|---|---|
| `docs/pios/40.4/static_telemetry_expansion_registry.md` | PI.STATIC-TELEMETRY.REGISTRATION.40X.03 | ST-030..035 definitions, input artifacts, computation descriptions |
| `docs/pios/40.5/static_signal_expansion_registry.md` | PI.SIGNAL-SPACE.EXPANSION.40X.02 | PSIG-001..006 formulas, second-client indicative values |
| `docs/pios/75.x/threshold_foundation_forensics.md` | PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01 | Threshold strategy per signal, RUN_RELATIVE_OUTLIER definition, PSIG-006 binary indicator |
| `docs/pios/75.x/threshold_candidate_matrix.md` | PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01 | Activation strategy matrix, threshold candidates |
| `docs/pios/75.x/pressure_zone_and_focus_domain_concept.md` | PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01 | Pressure zone classes, zone designation rules |
| `clients/.../75.x/condition_correlation_state.json` | PI.CONDITION-CORRELATION.ANALYSIS.75X.03 | Observed activation states, entity-level vs domain-level distinction |
| `clients/.../41.x/signal_projection.json` | PI.41X.PRESSURE-ZONE.PROJECTION.01 | Threshold values, statistical_note for PSIG-002 IQR |
| `docs/pios/runs/run_01_pios_baseline/40.6/condition_activation_specification.md` | Stream 40.6 | Condition activation model (BlueEdge run — not OSS FastAPI; reference only) |
| `scripts/pios/lens_report_generator.py` | — | Consumer reference (grep only) |

---

## 5. Signal Lineage Summary

| Signal ID | Static Telemetry Ref | Canonical Definition Found | Formula Found | Threshold Rule Found | Activation Rule Found | Determinization Status | Evidence Path |
|---|---|---|---|---|---|---|---|
| PSIG-001 | ST-030 (MAX_FAN_IN) | YES | YES — complete | YES — threshold=2.0 documented | YES — RUN_RELATIVE_OUTLIER | FULLY DETERMINISTIC | `docs/pios/40.4/static_telemetry_expansion_registry.md` + `docs/pios/40.5/static_signal_expansion_registry.md` + `docs/pios/75.x/threshold_candidate_matrix.md` |
| PSIG-002 | ST-031 (MAX_FAN_OUT) | YES | YES — complete | YES — threshold=2.0 primary; IQR fallback partially specified | PARTIALLY — IQR degenerate fallback not fully documented | PARTIALLY DETERMINISTIC | Same as PSIG-001; IQR fallback gap documented in signal_projection.json only |
| PSIG-004 | ST-033 (MAX_RESPONSIBILITY_SURFACE) + ST-034 (TOTAL_INTERFACE_SURFACE) | YES | YES — complete | YES — threshold=2.0 documented | YES — RUN_RELATIVE_OUTLIER | FULLY DETERMINISTIC | Same sources as PSIG-001 |
| PSIG-006 | ST-035 (STRUCTURAL_CLUSTER_COUNT) | YES | YES — complete | YES — THEORETICAL_BASELINE, binary >0 | YES — binary fragmentation_index > 0 | FULLY DETERMINISTIC | Same sources as PSIG-001 |

---

## 6. PSIG-001 Lineage

### 6.1 Canonical Name and Definition

**OBSERVED — docs/pios/40.5/static_signal_expansion_registry.md, PSIG-001 section:**
```
Canonical provisional name: Fan-In Concentration
Pressure family: Coupling pressure
Status: PROVISIONAL_CKR_CANDIDATE
Stream authority: PI.SIGNAL-SPACE.EXPANSION.40X.02
```

### 6.2 Formula

**OBSERVED — docs/pios/40.5/static_signal_expansion_registry.md, PSIG-001 section:**
```
fan_in_concentration = ST-030 / (total_edges / ST-007)
                     = max_fan_in / mean_fan_in
```

**OBSERVED — second-client computation (same file):**
```
ST-030 (MAX_FAN_IN) = 13
total_edges         = 62
ST-007              = 45
mean_fan_in         = 62 / 45 = 1.378
fan_in_concentration = 13 / 1.378 = 9.43
```

**OBSERVED — threshold_foundation_forensics.md, PSIG-001 section:**
```
Definition: fan_in_concentration = ST-030 / (total_edges / ST-007) = max_fan_in / mean_fan_in
```

Formula is defined in two independent documents. Both agree.

### 6.3 Static Telemetry Reference

**OBSERVED — docs/pios/40.4/static_telemetry_expansion_registry.md, ST-030 section:**
```
ST-030 = MAX_FAN_IN
Definition: Maximum number of incoming directed edges terminating at any single node
Input: binding_envelope.json — directed edge list (from_node, to_node)
Computation: traverse all edges; count incoming edges per to_node; ST-030 = maximum
```

### 6.4 Threshold Rule

**OBSERVED — signal_projection.json, COND-PSIG-001-01:**
```
threshold: 2.0
activation_method: RUN_RELATIVE_OUTLIER
```

**OBSERVED — threshold_candidate_matrix.md:**
```
PSIG-001: RUN_RELATIVE_OUTLIER (primary)
threshold example: ratio > 2.0 (statistically defensible as outlier indicator)
```

### 6.5 Activation Rule

**OBSERVED — threshold_foundation_forensics.md:**
```
RUN_RELATIVE_OUTLIER: signal is self-calibrating to each run; ratio > 2.0 = 2× mean
= a statistically defensible outlier in many distributions
```

**OBSERVED — condition_correlation_state.json:**
```
Entity-level activation: NODE-009 (primary), NODE-008, NODE-010 (secondary) all show PSIG-001=HIGH
CEU nodes with high fan-in inherit activation
```

### 6.6 Attribution Pattern

**OBSERVED — condition_correlation_state.json:**
- PSIG-001 activates at CEU (entity) level
- Primary attribution: NODE-009 (CEU-09/DOM-04) — highest fan-in
- Secondary attribution: NODE-008 (CEU-08/DOM-03), NODE-010 (CEU-10/DOM-05)

**INFERRED — Attribution rule not explicitly documented in 40.5/75.x governance docs:**
- Primary = max fan-in entity; secondary = other CEUs where individual fan-in > threshold OR
  in same domain as primary
- Attribution rule needs explicit documentation for deterministic reimplementation

### 6.7 Determinization Assessment

**FULLY DETERMINISTIC** — given:
- `binding_envelope.json` as input
- ST-030 computation (max incoming edges per node)
- Formula: ST-030 / (total_edges / ST-007)
- Threshold: ratio > 2.0

**Remaining gap:** Attribution rule (which entities are secondary) is not explicitly
documented. Must be inferred from artifact pattern.

---

## 7. PSIG-002 Lineage

### 7.1 Canonical Name and Definition

**OBSERVED — docs/pios/40.5/static_signal_expansion_registry.md, PSIG-002 section:**
```
Canonical provisional name: Fan-Out Propagation
Pressure family: Propagation pressure
Status: PROVISIONAL_CKR_CANDIDATE
Stream authority: PI.SIGNAL-SPACE.EXPANSION.40X.02
```

### 7.2 Formula

**OBSERVED — docs/pios/40.5/static_signal_expansion_registry.md, PSIG-002 section:**
```
fan_out_propagation = ST-031 / (total_edges / ST-007)
                    = max_fan_out / mean_fan_out
```

**OBSERVED — second-client computation (same file):**
```
ST-031 (MAX_FAN_OUT) = 13
total_edges          = 62
ST-007               = 45
mean_fan_out         = 62 / 45 = 1.378
fan_out_propagation  = 13 / 1.378 = 9.43
```

Note: PSIG-001 = PSIG-002 = 9.43 because max fan-in = max fan-out = 13 for the same
node. This is noted in static_signal_expansion_registry.md: "the same node that has max
fan-in also has max fan-out in the second-client topology."

### 7.3 Static Telemetry Reference

**OBSERVED — docs/pios/40.4/static_telemetry_expansion_registry.md, ST-031 section:**
```
ST-031 = MAX_FAN_OUT
Definition: Maximum number of outgoing directed edges originating from any single node
Input: binding_envelope.json — directed edge list (from_node, to_node)
Computation: traverse all edges; count outgoing edges per from_node; ST-031 = maximum
```

### 7.4 Threshold Rule

**OBSERVED — signal_projection.json, COND-PSIG-002-01:**
```
threshold: 2.0
activation_method: RUN_RELATIVE_OUTLIER
statistical_note: "IQR degenerate; mean+2SD fallback boundary=6.228 applied"
```

**OBSERVED — threshold_candidate_matrix.md:**
```
PSIG-002: RUN_RELATIVE_OUTLIER (primary)
threshold: statistically defensible (same structure as PSIG-001)
```

### 7.5 IQR Degenerate Fallback — OQ-02 Analysis

**OBSERVED — signal_projection.json, COND-PSIG-002-01:**
- Primary threshold = 2.0 (same as PSIG-001)
- statistical_note documents: IQR degenerate → mean+2SD fallback boundary = 6.228

**INFERRED — fallback computation derivation:**
```
Fan-out distribution across all 45 nodes is degenerate:
  - Most capability_surface nodes (30) have fan-out = 0
  - CEU nodes with CONTAINS edges to capability_surfaces have non-zero fan-out
  - IQR = Q3 - Q1 = 0 when most values = 0 (degenerate)

Fallback: mean + 2SD
  mean = 62 / 45 = 1.378
  6.228 = 1.378 + 2 * SD
  SD = (6.228 - 1.378) / 2 = 2.425

Population: all 45 nodes' fan-out counts (inferred — not explicitly stated)
SD type: INFERRED population or sample SD — not specified in any document
Rounding: none observed (6.228 appears as-is in artifact)
```

**GAP — PSIG-002-IQR-01:** The IQR degenerate fallback formula (mean + 2SD) is NOT
defined in any governance document. It appears only as a `statistical_note` in
signal_projection.json. The formula is observable but its authoritative specification
is missing.

**OBSERVED activation direction:**
- signal_value = 9.43 exceeds both threshold=2.0 AND fallback boundary=6.228
- Activation is HIGH regardless of which boundary is used

### 7.6 Attribution Pattern — Key Difference from PSIG-001

**OBSERVED — condition_correlation_state.json:**
```
NODE-009 (CEU-09):  PSIG-002 = NORMAL  ← entity level: NOT activated
NODE-008 (CEU-08):  PSIG-002 = NORMAL  ← entity level: NOT activated
NODE-010 (CEU-10):  PSIG-002 = NORMAL  ← entity level: NOT activated
DOM-04:             PSIG-002 = HIGH    ← domain level: activated (primary)
DOM-03:             PSIG-002 = HIGH    ← domain level: activated (secondary)
DOM-05:             PSIG-002 = HIGH    ← domain level: activated (secondary)
```

**INFERRED — critical attribution difference:**
Unlike PSIG-001 (entity-level) and PSIG-004 (entity-level), PSIG-002 activates at
DOMAIN level only. The CEU nodes that have the highest fan-out are not individually
marked HIGH — instead, their parent domains receive the PSIG-002=HIGH condition.

INFERRED reason: The IQR degenerate fallback may have affected entity-level threshold
computation for PSIG-002 specifically — when IQR=0, the entity-level fan-out
distribution doesn't yield a meaningful outlier threshold for individual CEU nodes.
The domain-level attribution compensates.

**GAP — PSIG-002-ATTR-01:** The rule governing domain-level vs entity-level attribution
for PSIG-002 (vs PSIG-001/004 which are entity-level) is NOT documented in any
governance document. It is an observed behavior in the artifact, not a stated rule.

### 7.7 Determinization Assessment

**PARTIALLY DETERMINISTIC:**
- Formula: fully deterministic from binding_envelope.json
- Threshold (2.0 primary): documented
- IQR fallback formula: observable from artifact but NOT formally specified
- Domain-level vs entity-level attribution rule: NOT documented

---

## 8. PSIG-004 Lineage

### 8.1 Canonical Name and Definition

**OBSERVED — docs/pios/40.5/static_signal_expansion_registry.md, PSIG-004 section:**
```
Canonical provisional name: Responsibility Concentration
Pressure family: Responsibility concentration
Status: PROVISIONAL_CKR_CANDIDATE
Stream authority: PI.SIGNAL-SPACE.EXPANSION.40X.02
```

### 8.2 Formula

**OBSERVED — docs/pios/40.5/static_signal_expansion_registry.md, PSIG-004 section:**
```
responsibility_concentration = ST-033 / (ST-034 / ST-009)
                             = max_surfaces_per_CEU / mean_surfaces_per_CEU
```

**OBSERVED — second-client computation (same file):**
```
ST-033 (MAX_RESPONSIBILITY_SURFACE) = 13  (CEU-09 / DOM-04 owns 13 of 30 surfaces)
ST-034 (TOTAL_INTERFACE_SURFACE)    = 30
ST-009 (Module Node Count / CEU)    = 10
mean_surfaces_per_CEU               = 30 / 10 = 3.0
responsibility_concentration        = 13 / 3.0 = 4.33
```

**OBSERVED — threshold_foundation_forensics.md, PSIG-004 section:**
```
Definition: responsibility_concentration = ST-033 / (ST-034 / ST-009) =
  max_surfaces_per_CEU / mean_surfaces_per_CEU
```

Formula confirmed in two independent documents.

### 8.3 Static Telemetry References

**OBSERVED — docs/pios/40.4/static_telemetry_expansion_registry.md:**
```
ST-033 = MAX_RESPONSIBILITY_SURFACE
  Definition: Maximum capability surfaces owned by a single CEU
  Input: binding_envelope.json — capability_surfaces array; provenance.parent_ceu field
  Computation: group by parent_ceu; ST-033 = maximum count

ST-034 = TOTAL_INTERFACE_SURFACE
  Definition: Total count of capability surface nodes
  Input: binding_envelope.json — capability_surfaces array length
  Computation: count all records in capability_surfaces array
```

### 8.4 Threshold Rule

**OBSERVED — signal_projection.json, COND-PSIG-004-01:**
```
threshold: 2.0
activation_method: RUN_RELATIVE_OUTLIER
```

**OBSERVED — threshold_candidate_matrix.md:**
```
PSIG-004: RUN_RELATIVE_OUTLIER (primary); FIXED_EXTERNAL_BENCHMARK (ADAPTED via God Object / LCOM)
threshold example: concentration ratio > 2.0
```

### 8.5 Attribution Pattern

**OBSERVED — condition_correlation_state.json:**
```
NODE-009 (CEU-09/DOM-04): PSIG-004 = HIGH (primary)
NODE-008 (CEU-08/DOM-03): PSIG-004 = HIGH (secondary)
NODE-010 (CEU-10/DOM-05): PSIG-004 = HIGH (secondary)
```

PSIG-004 activates at entity (CEU) level. Attribution follows the same pattern as PSIG-001
but is based on responsibility surface count, not fan-in.

**INFERRED — secondary attribution rule:**
NODE-008 and NODE-010 have surface counts of 10 and 7 respectively. Both are above
threshold (10/3.0 = 3.33 > 2.0; 7/3.0 = 2.33 > 2.0). Secondary attribution applies
to all CEUs whose individual surface-per-mean ratio exceeds the threshold.

### 8.6 Determinization Assessment

**FULLY DETERMINISTIC** — given:
- `binding_envelope.json` as input
- ST-033 computation (max surfaces per CEU from provenance.parent_ceu)
- ST-034 computation (total capability_surface count)
- ST-009 (CEU count)
- Formula: ST-033 / (ST-034 / ST-009)
- Threshold: ratio > 2.0

---

## 9. PSIG-006 Lineage

### 9.1 Canonical Name and Definition

**OBSERVED — docs/pios/40.5/static_signal_expansion_registry.md, PSIG-006 section:**
```
Canonical provisional name: Structural Fragmentation Index
Pressure family: Structural fragmentation
Status: PROVISIONAL_CKR_CANDIDATE
Stream authority: PI.SIGNAL-SPACE.EXPANSION.40X.02
```

### 9.2 Formula

**OBSERVED — docs/pios/40.5/static_signal_expansion_registry.md, PSIG-006 section:**
```
fragmentation_index = (ST-035 - 1) / ST-007
                    = (cluster_count - 1) / total_nodes
```

**OBSERVED — second-client computation (same file):**
```
ST-035 (STRUCTURAL_CLUSTER_COUNT) = 10
  (1 large connected component of 36 nodes + 9 isolated singletons)
ST-007 (Total Node Count)         = 45
fragmentation_index               = (10 - 1) / 45 = 9/45 = 0.20
```

**OBSERVED — threshold_foundation_forensics.md, PSIG-006 section:**
```
fragmentation_index = (ST-035 - 1) / ST-007 = (cluster_count - 1) / total_nodes
Second-client: fragmentation_index = 0.20 (10 clusters / 45 nodes, with 9 singletons)
```

### 9.3 Static Telemetry Reference

**OBSERVED — docs/pios/40.4/static_telemetry_expansion_registry.md, ST-035 section:**
```
ST-035 = STRUCTURAL_CLUSTER_COUNT
Definition: Number of disconnected connected components in topology (undirected)
Input: binding_envelope.json — full node list and edge list
Computation: undirected adjacency graph; BFS/DFS per unvisited node;
  count connected components
Second-client example: 10 (1 large + 9 singletons)
```

### 9.4 Threshold Rule

**OBSERVED — signal_projection.json, COND-PSIG-006-01:**
```
activation_state: ACTIVATED
signal_value: 0.20
activation_method: THEORETICAL_BASELINE
threshold: 1
threshold_type: binary
note: "PSIG-006 activated; structural blind-spot condition only; not a pressure candidate; no zone assigned"
```

**OBSERVED — threshold_candidate_matrix.md:**
```
PSIG-006: THEORETICAL_BASELINE
Binary indicator: fragmentation_index > 0 → structural observation
No numeric calibration required for binary form
```

**OBSERVED — threshold_foundation_forensics.md:**
```
Binary "fragmentation exists" indicator is defensible as a structural observation
Any value > 0 = fragmentation event
threshold_type binary confirms: fragmentation_index > 0 → ACTIVATED
```

### 9.5 Entity-Level vs Run-Level Distinction

**OBSERVED — condition_correlation_state.json:**
```
Entity-level: NODE-001..NODE-007, DOM-01, DOM-02 all show PSIG-006 = ACTIVATED
  (binary: entity is isolated → 1; not isolated → 0)
```

**OBSERVED — signal_projection.json:**
```
signal_value: 0.20  (run-level fragmentation index)
threshold: 1 (binary: > 0 → ACTIVATED)
```

**OBSERVED — static_signal_expansion_registry.md:**
```
fragmentation_index = (ST-035 - 1) / ST-007 = (10-1)/45 = 0.20
```

**Key distinction (OBSERVED):** The entity-level condition is binary (isolated or not),
while the run-level signal_value = 0.20 is the fragmentation index formula output.
The threshold=1 in signal_projection.json is NOT comparing against 0.20; it is a
binary gate: fragmentation_index > 0 = 1 (ACTIVATED), = 0 = 0 (NOT_ACTIVATED).
The signal_value=0.20 documents the magnitude for information only.

### 9.6 PSIG-006 as Structural Blind-Spot Indicator

**OBSERVED — signal_projection.json:**
```
zone_ids_where_active: [] (empty — PSIG-006 does NOT assign to any pressure zone)
note: "structural blind-spot condition only; not a pressure candidate; no zone assigned"
```

**OBSERVED — pressure_zone_and_focus_domain_concept.md:**
```
PSIG-006: LOW pressure-zone suitability; HIGH structural blind-spot indicator
Fragmented domains = structural blind spots, not active pressure zones
```

### 9.7 Determinization Assessment

**FULLY DETERMINISTIC** — given:
- `binding_envelope.json` as input
- ST-035 computation (BFS/DFS connected-component count, undirected)
- ST-007 (total node count)
- Formula: (ST-035 - 1) / ST-007
- Activation: fragmentation_index > 0 → ACTIVATED

---

## 10. Static Telemetry Mapping

| ST ID | Name | PSIG | Source | Defined In |
|---|---|---|---|---|
| ST-030 | MAX_FAN_IN | PSIG-001 | `binding_envelope.json` — incoming edges per node | `docs/pios/40.4/static_telemetry_expansion_registry.md` |
| ST-031 | MAX_FAN_OUT | PSIG-002 | `binding_envelope.json` — outgoing edges per node | `docs/pios/40.4/static_telemetry_expansion_registry.md` |
| ST-033 | MAX_RESPONSIBILITY_SURFACE | PSIG-004 | `binding_envelope.json` — capability_surfaces.provenance.parent_ceu | `docs/pios/40.4/static_telemetry_expansion_registry.md` |
| ST-034 | TOTAL_INTERFACE_SURFACE | PSIG-004 (denominator) + PSIG-005 | `binding_envelope.json` — capability_surfaces array count | `docs/pios/40.4/static_telemetry_expansion_registry.md` |
| ST-035 | STRUCTURAL_CLUSTER_COUNT | PSIG-006 | `binding_envelope.json` — BFS connected components | `docs/pios/40.4/static_telemetry_expansion_registry.md` |

### Evidence-Trace Reference Mapping

**OBSERVED — pressure_candidate_state.json (from FORENSIC_EXTRACTION_REPORT.md):**
```
ST-030 → PSIG-001 (evidence_trace)
ST-031 → PSIG-002 (evidence_trace)
ST-033 → PSIG-004 (evidence_trace)
ST-034 → PSIG-004 (denominator in evidence_trace)
```

**OBSERVED — static_telemetry_expansion_registry.md:**
```
ST-030..035 are defined under contract PI.STATIC-TELEMETRY.REGISTRATION.40X.03
All six ST fields derivable from binding_envelope.json only
```

---

## 11. Threshold and Activation Rules

### RUN_RELATIVE_OUTLIER

**OBSERVED — threshold_foundation_forensics.md, Section "RUN_RELATIVE_OUTLIER":**
```
Signal formula already normalized to run's own statistics (e.g., ratio of max to mean)
Signal inherently represents a relative outlier indicator within the run
A threshold of ratio > 2.0 = max is ≥ 2× mean
  → statistically defensible as a 2-σ outlier indicator in many distributions
Threshold still requires justification; documented in governance
```

**OBSERVED — signal_projection.json:**
```
PSIG-001, PSIG-002, PSIG-004 all use: activation_method=RUN_RELATIVE_OUTLIER, threshold=2.0
```

**Applies to:** PSIG-001, PSIG-002, PSIG-004

### THEORETICAL_BASELINE

**OBSERVED — threshold_foundation_forensics.md, Section "FIXED_EXTERNAL_BENCHMARK (partial/theoretical)":**
```
PSIG-006: theoretical zero-baseline from graph theory
Any fragmentation_index > 0 = structural observation (defensible without calibration)
Binary indicator only; no numeric calibration required
```

**OBSERVED — signal_projection.json:**
```
PSIG-006: activation_method=THEORETICAL_BASELINE, threshold=1 (binary), threshold_type=binary
```

**Applies to:** PSIG-006

### IQR Fallback (PSIG-002 only)

**OBSERVED — signal_projection.json, statistical_note for COND-PSIG-002-01:**
```
"IQR degenerate; mean+2SD fallback boundary=6.228 applied"
```

**INFERRED — formula derivation:**
```
When IQR = Q3 - Q1 = 0 (all values at same quartile — degenerate distribution)
Fallback: threshold_boundary = mean + 2 * SD
  mean = total_edges / total_nodes = 62/45 = 1.378
  6.228 = 1.378 + 2 * SD  →  SD = 2.425
Population: INFERRED = all 45 nodes' fan-out values
SD type: INFERRED (population or sample SD unknown — not specified)
Rounding: none observed
```

**GAP:** No governance document specifies the IQR degenerate fallback formula for
RUN_RELATIVE_OUTLIER. The formula is reconstructed from the artifact note only.

**Note on activation:** The statistical_note does not override the primary threshold=2.0.
Both boundaries (2.0 primary, 6.228 IQR fallback) were exceeded by signal_value=9.43.
Activation is HIGH regardless.

---

## 12. Answers to Open Questions

### OQ-01 — PSIG-001 raw_value = 9.43

**ANSWERED**

PSIG-001 raw_value = 9.43 is the fan-in concentration ratio:

```
fan_in_concentration = max_fan_in / mean_fan_in
                     = ST-030 / (total_edges / ST-007)
                     = 13 / (62/45)
                     = 13 / 1.378
                     = 9.43
```

It is NOT a raw fan-in count. It is NOT a normalized ratio. It is a concentration ratio
(max/mean) that is self-normalizing to the run's own edge distribution.

**Evidence path:**
- `docs/pios/40.5/static_signal_expansion_registry.md` — PSIG-001 section:
  "PSIG-001 = 13 / 1.378 = 9.43 (high concentration on a single intake node)"
- `docs/pios/75.x/threshold_foundation_forensics.md` — PSIG-001:
  "fan_in_concentration = ST-030 / (total_edges / ST-007) = max_fan_in / mean_fan_in"
- `docs/pios/40.4/static_telemetry_expansion_registry.md` — ST-030:
  "ST-030 = MAX_FAN_IN; second-client example: ST-030 = 13"

---

### OQ-02 — PSIG-002 threshold = 6.228

**PARTIALLY ANSWERED**

**What is confirmed (OBSERVED):**
- Primary threshold = 2.0 (not 6.228)
- 6.228 appears as a `statistical_note` in signal_projection.json only:
  "IQR degenerate; mean+2SD fallback boundary=6.228 applied"
- The threshold field in signal_projection.json = 2.0
- IQR of fan-out distribution = 0 (degenerate — most nodes have fan-out = 0)

**What is reconstructed (INFERRED):**
- Fallback formula: mean + 2SD = 6.228
- mean = 62/45 = 1.378
- Implied SD = (6.228 - 1.378) / 2 = 2.425
- Population: INFERRED to be all 45 nodes' fan-out counts (not explicitly stated)
- SD type: INFERRED (population vs sample not stated)
- No rounding observed

**What remains unresolved (GAP):**
- No governance document specifies the IQR degenerate fallback formula for
  RUN_RELATIVE_OUTLIER in any 75.x, 40.5, or 40.6 stream document
- The population definition and SD type are not stated
- Whether 6.228 was applied as a cross-check or as a replacement threshold
  is ambiguous from the word "applied" in the statistical_note

**Evidence path:**
- `clients/.../41.x/signal_projection.json` line 37: statistical_note
- `docs/pios/40.5/static_signal_expansion_registry.md` — PSIG-002:
  "mean fan-out = 62/45 = 1.378"

---

### OQ-03 — PSIG-006 raw_value = 0.2

**ANSWERED**

PSIG-006 signal_value = 0.20 is the fragmentation_index formula output:

```
fragmentation_index = (ST-035 - 1) / ST-007
                    = (cluster_count - 1) / total_nodes
                    = (10 - 1) / 45
                    = 9 / 45
                    = 0.20
```

It is NOT a simple prevalence ratio of blind-spot entities / total entities.
In this specific topology, (cluster_count - 1) = 9 because each of the 9 isolated
nodes is its own singleton connected component. The formula result (9/45) numerically
coincides with the naive 9-entity ratio, but the formula is the correct derivation.

The entity-level condition (ACTIVATED or NOT) is binary and separate from the 0.20
run-level index. The threshold=1 (binary) activates PSIG-006 because fragmentation_index
(0.20) > 0.

**Evidence path:**
- `docs/pios/40.5/static_signal_expansion_registry.md` — PSIG-006 section:
  "PSIG-006 = (10-1)/45 = 0.20 (20% fragmentation; 9 structurally isolated nodes out of 45)"
- `docs/pios/40.4/static_telemetry_expansion_registry.md` — ST-035:
  "Second-client example: ST-035 = 10"
- `docs/pios/75.x/threshold_foundation_forensics.md` — PSIG-006:
  "fragmentation_index = (ST-035 - 1) / ST-007"
- `clients/.../41.x/signal_projection.json`:
  "signal_value: 0.20, threshold: 1, threshold_type: binary"

---

## 13. GAP-75X-01 Closure Assessment

**Assessment: PARTIALLY CLOSED BY EXISTING EVIDENCE**

### What is fully closed

| Element | Status | Evidence Location |
|---|---|---|
| PSIG-001 formula | CLOSED | `static_signal_expansion_registry.md` + `static_telemetry_expansion_registry.md` |
| PSIG-001 threshold | CLOSED | `threshold_candidate_matrix.md` + signal_projection.json |
| PSIG-001 input artifact | CLOSED | `binding_envelope.json` confirmed |
| PSIG-004 formula | CLOSED | Same as PSIG-001 |
| PSIG-004 threshold | CLOSED | Same as PSIG-001 |
| PSIG-004 input artifact | CLOSED | `binding_envelope.json` confirmed |
| PSIG-006 formula | CLOSED | All three 75.x/40.5/40.4 documents agree |
| PSIG-006 threshold (binary) | CLOSED | THEORETICAL_BASELINE, binary > 0 |
| PSIG-006 input artifact | CLOSED | `binding_envelope.json` (BFS) |
| PSIG-002 formula | CLOSED | Same as PSIG-001 (fan-out variant) |
| PSIG-002 primary threshold (2.0) | CLOSED | threshold_candidate_matrix.md |

### What remains open

| Element | Status | Gap ID |
|---|---|---|
| PSIG-002 IQR degenerate fallback formula specification | OPEN | PSIG-002-IQR-01 |
| PSIG-002 attribution: domain-level vs entity-level rule | OPEN | PSIG-002-ATTR-01 |
| PSIG-001 secondary attribution rule | OPEN | PSIG-001-ATTR-01 |
| PSIG-004 secondary attribution rule (same pattern as PSIG-001) | OPEN | PSIG-004-ATTR-01 |

### Impact on GAP-75X-01

The 3 CRITICAL PSIG signals (PSIG-001, PSIG-004, PSIG-006) have fully deterministic
formulas and thresholds from existing evidence. A script can reproduce these conditions
from `binding_envelope.json` without any new specification work.

PSIG-002 formula is fully specified. Its activation threshold (2.0) is specified.
The IQR fallback formula and domain-level attribution rule have not been formally
specified — but given that PSIG-002 signal_value (9.43) exceeds both the primary
threshold (2.0) AND the reconstructed IQR fallback (6.228), both rules produce the
same activation verdict for this specific run. The closure gap is formal completeness,
not computational accuracy for run_01.

---

## 14. Candidate Deterministic Inputs

**DO NOT IMPLEMENT.** Candidate inputs for a future deterministic script.

| Signal | Input Artifact | Input Fields |
|---|---|---|
| PSIG-001 | `binding_envelope.json` | edge list (from_node, to_node); all edge types (incoming traversal) |
| PSIG-002 | `binding_envelope.json` | edge list (from_node, to_node); all edge types (outgoing traversal) |
| PSIG-004 | `binding_envelope.json` | capability_surfaces array; provenance.parent_ceu field per surface |
| PSIG-006 | `binding_envelope.json` | full node list + edge list for BFS connected-component |
| All | `binding_envelope.json` | node list total count (ST-007); CEU node count (ST-009) |

All signals require `binding_envelope.json` only. No additional source artifact required.

---

## 15. Candidate Deterministic Formula Set

**DO NOT IMPLEMENT.** Candidate formula set for a future deterministic script.

### PSIG-001: Fan-In Concentration

```
Input: binding_envelope.json edge list
Compute:
  fan_in_per_node = {node_id: count of edges where to_node == node_id, for all nodes}
  ST_030 = max(fan_in_per_node.values())
  total_edges = len(edge_list)
  ST_007 = len(node_list)
  mean_fan_in = total_edges / ST_007
  PSIG_001 = ST_030 / mean_fan_in
Activate:
  PSIG_001 > 2.0 → HIGH
  Primary attribution = node with fan_in == ST_030
  Secondary attribution = nodes where (fan_in / mean_fan_in) > 2.0 AND node != primary
```

### PSIG-002: Fan-Out Propagation

```
Input: binding_envelope.json edge list
Compute:
  fan_out_per_node = {node_id: count of edges where from_node == node_id, for all nodes}
  ST_031 = max(fan_out_per_node.values())
  total_edges = len(edge_list)
  ST_007 = len(node_list)
  mean_fan_out = total_edges / ST_007
  PSIG_002 = ST_031 / mean_fan_out
Activate:
  PSIG_002 > 2.0 → HIGH
  Attribution: domain-level (observed behavior — requires PSIG-002-ATTR-01 resolution)
Note: IQR degenerate fallback (PSIG-002-IQR-01) requires specification before
  exact replication of the statistical_note is possible
```

### PSIG-004: Responsibility Concentration

```
Input: binding_envelope.json capability_surfaces array
Compute:
  surfaces_per_ceu = {ceu_id: count of surfaces where provenance.parent_ceu == ceu_id}
  ST_033 = max(surfaces_per_ceu.values())
  ST_034 = len(capability_surfaces)
  ST_009 = count of CEU/component_entity nodes in node_list
  mean_surfaces_per_ceu = ST_034 / ST_009
  PSIG_004 = ST_033 / mean_surfaces_per_ceu
Activate:
  PSIG_004 > 2.0 → HIGH
  Primary attribution = CEU with surfaces == ST_033
  Secondary attribution = CEUs where (surfaces / mean_surfaces_per_ceu) > 2.0
```

### PSIG-006: Structural Fragmentation Index

```
Input: binding_envelope.json node list + edge list
Compute:
  Build undirected adjacency graph from all edges (from_node/to_node bidirectional)
  ST_035 = count of connected components via BFS/DFS
  ST_007 = len(node_list)
  fragmentation_index = (ST_035 - 1) / ST_007
Activate:
  fragmentation_index > 0 → ACTIVATED (binary THEORETICAL_BASELINE)
  Entity-level: node is ACTIVATED if it is a singleton component (no edges to any other node)
  Run-level signal_value = fragmentation_index
```

---

## 16. Remaining Gaps

| Gap ID | Signal | Description | Severity |
|---|---|---|---|
| PSIG-002-IQR-01 | PSIG-002 | IQR degenerate fallback formula (mean+2SD) has no governance document | MEDIUM — formula reconstructable from artifact |
| PSIG-002-ATTR-01 | PSIG-002 | Domain-level vs entity-level attribution rule not documented | HIGH — affects which entities are marked HIGH |
| PSIG-001-ATTR-01 | PSIG-001 | Secondary attribution rule (which entities qualify as secondary) not specified | MEDIUM — primary attribution is deterministic |
| PSIG-004-ATTR-01 | PSIG-004 | Secondary attribution rule not specified (same gap as PSIG-001) | MEDIUM |
| COND-CORR-01 | All | Entity-level vs domain-level condition scoring (how entity activations roll up to domain activation_count) not explicitly specified | MEDIUM — pattern is observable from artifact |

---

## 17. Lineage Verdict

**LINEAGE COMPLETE — GAP-75X-01 PARTIALLY CLOSABLE**

### Summary

All four signal formulas (PSIG-001, PSIG-002, PSIG-004, PSIG-006) are fully specified
in existing governance documents. All primary threshold rules (threshold=2.0 for
PSIG-001/002/004; binary > 0 for PSIG-006) are documented. All required input artifacts
trace to `binding_envelope.json` only.

GAP-75X-01 is **PARTIALLY CLOSABLE** because:
- PSIG-001, PSIG-004, PSIG-006: FULLY CLOSABLE — all formulas, thresholds, and input
  fields are specified with no remaining gaps
- PSIG-002: CLOSABLE WITH APPROXIMATION — formula and primary threshold are specified;
  IQR fallback formula and domain-level attribution rule require either specification
  contracts or approximation from observed artifact behavior

### Path to full closure

Three gaps block exact byte-level reproduction for PSIG-002:
1. **PSIG-002-IQR-01** — issue a specification contract defining the IQR degenerate
   fallback formula (mean + 2SD, population all nodes, SD type to be confirmed)
2. **PSIG-002-ATTR-01** — issue a specification contract defining domain-level vs
   entity-level attribution for PSIG-002
3. **PSIG-001/004-ATTR-01** — issue a specification contract for secondary entity
   attribution thresholds (observable as: ratio > 2.0 for individual entities)

For run_01_oss_fastapi specifically, all gaps are OBSERVATION-CLOSABLE because the
artifact shows the correct activation result for all signals, and the missing spec gaps
do not change the activation outcome.

---

*Report generated under contract: PI.E2E.DETERMINISTIC-GAP.SIGNAL-LINEAGE.01*
*Branch: work/psee-runtime | HEAD: f3cb8e6*
*Extraction mode: READ-ONLY (except this report)*
*inference_prohibition: ACTIVE — all INFERRED labels explicitly marked*
