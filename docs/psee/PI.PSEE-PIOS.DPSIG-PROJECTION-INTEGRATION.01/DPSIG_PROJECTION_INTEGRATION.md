# DPSIG Projection Integration — Governance Contract

Stream: PI.PSEE-PIOS.DPSIG-PROJECTION-INTEGRATION.01  
Status: COMPLETE — AUTHORITATIVE  
Generated: 2026-05-07  
Branch: feature/psee-pios-integration-productized  
Execution mode: GOVERNANCE_MODE — no implementation  

UPSTREAM: PI.PSEE-PIOS.DPSIG.RUNTIME-CERTIFICATION.01 (commit 5b60e83)  
HANDOFF_TO: PI.PSEE-PIOS.DPSIG-PROJECTION-WEIGHTING.IMPLEMENTATION.01  

LANE_SCOPE: D (governance — no Lane A mutation in this stream)  
LANE_IMPACT:  
  Modifies Lane A artifacts: NO  
  Modifies lens_report_generator.py: NO — defines the contract for the implementation stream that will  
  Modifies 75.x or 41.x: NO  
  Advances projection governance: YES — projection weighting model formally defined  

Authoritative inputs loaded:
- `docs/psee/PI.PSEE-PIOS.DPSIG.RUNTIME-CERTIFICATION.01/DPSIG_RUNTIME_CERTIFICATION.md` (commit 5b60e83)
- `docs/psee/PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01/DPSIG_RUNTIME_NORMALIZATION.md` (commit 8bc2841)
- `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/dpsig_signal_set.json` (commit ffee7d6)
- `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/replay_diff.json` (commit ffee7d6)
- `docs/governance/pipeline_execution_manifest.json` (commit 7d509a3)

Canonical reference values (FastAPI run_02 — replay-certified at commit ffee7d6):

| Signal | Value | Activation | signal_stable_key |
|--------|-------|-----------|------------------|
| DPSIG-031 CPI | 5.6126 | CLUSTER_PRESSURE_HIGH | b70663c865b168b5 |
| DPSIG-032 CFA | 0.7236 | DOMINANT_CLUSTER | 2358e0b083acda90 |
| severity_band | CRITICAL | — | CLU-17/src: 89/123 nodes |

---

## 1. Executive Summary

This document formally defines how DPSIG deterministic relational telemetry integrates into the 41.x projection layer, LENS executive rendering, and Signäl prioritization surfaces.

**Core governance claim**: DPSIG influences *visibility*, not *activation sovereignty*. Structural salience becomes visible executive intelligence — it does not become decision authority.

**What this stream establishes:**

| Domain | Governance Decision |
|--------|-------------------|
| Projection integration model | DPSIG enters LENS at a single read point in `lens_report_generator.py` — no 41.x compute layer involvement |
| 41.x consumption model | 41.x remains projection-only; DPSIG is a read input, not a compute input |
| LENS behaviors | 7 concrete DPSIG-enabled rendering surfaces defined |
| Executive prioritization | Deterministic salience weighting — CPI/CFA-derived, no semantic or AI ranking |
| Projection weighting engine | Fully deterministic formulas specified — cluster_salience_score, amplification_factor, heat weights |
| Replay-safe projection | Projection replay identity defined; rendering is TAXONOMY-01 stable |
| Commercial value surfaces | 5 executive-grade intelligence surfaces formally defined |
| Implementation boundary | Authorized first-implementation scope frozen |
| Governance verdict | AUTHORIZED — all 10 tasks yield PASS |

**This stream is the first value projection stream.** Its purpose is not to produce more telemetry. Its purpose is to formally define how structural salience becomes visible executive intelligence — deterministically, replay-safely, without contaminating Lane A activation sovereignty.

---

## 2. Projection Integration Model

### 2.1 The Fundamental Architectural Distinction

**Runtime activation** and **projection weighting** are two orthogonal operations on the same structural facts.

| Dimension | Runtime Activation (Lane A) | Projection Weighting (DPSIG) |
|-----------|---------------------------|------------------------------|
| Authority | 75.x owns it | 41.x / LENS consumes it |
| Output | PSIG activation states in signal_registry.json | DPSIG severity and salience in dpsig_signal_set.json |
| Basis | RUN_RELATIVE_OUTLIER statistical method | CLUSTER_MASS_THRESHOLD / ASYMMETRY_THRESHOLD structural method |
| Threshold | THRESHOLD=2.0 (immutable, IRC-01) | CPI_HIGH=5.0, CFA_DOMINANT=0.60 (DPSIG-owned, independently versioned) |
| Downstream consumer | lens_report_generator.py (reads signal_registry.json) | lens_report_generator.py (reads dpsig_signal_set.json — additive, separate read) |
| Cross-influence | PSIG states do NOT modify DPSIG values | DPSIG states do NOT modify PSIG values |
| Runtime sovereignty | PSIG: fully sovereign | DPSIG: projection weighting only — not sovereign |

These two operations produce two independent data streams that are consumed independently by the same LENS rendering layer. They are not merged, not blended, and not compared. They answer different questions about the same topology.

### 2.2 Projection Ingestion Point

DPSIG enters the projection architecture at exactly one location:

```
INGESTION POINT:
  scripts/pios/lens_report_generator.py
  — after loading signal_registry.json
  — before rendering TIER-1 executive content

ARTIFACT READ:
  dpsig_path = run_dir / "artifacts" / "dpsig" / client_id / run_id / "dpsig_signal_set.json"

FALLBACK:
  if not dpsig_path.exists():
      dpsig_signal_set = None
      # existing report renders unchanged — backward compatible
```

DPSIG does **not** enter:
- `scripts/pios/75x/compute_condition_correlation.py`
- `scripts/pios/75x/compute_pressure_candidates.py`
- `scripts/pios/75x/compute_pressure_zones.py`
- `scripts/pios/41x/compute_signal_projection.py`
- `vault/signal_registry.json`
- Any 75.x activation computation path

### 2.3 Projection Consumption Point

DPSIG values are consumed by `lens_report_generator.py` exclusively in the rendering phase — after all Lane A signal values and activation states have been read and before the report template is finalized.

The consumption sequence is:

```
1. Load signal_registry.json (Lane A — existing, unchanged)
2. Load binding_envelope.json (Lane A — existing, unchanged)
3. Load pressure_zone_state.json (Lane A — existing, unchanged)
4. Load dpsig_signal_set.json (NEW — additive DPSIG read; None if absent)
5. Render existing TIER-1/2/3 sections (UNCHANGED)
6. If dpsig_signal_set != None:
     Render new DPSIG sections (additive — see Section 4)
7. Output report (additive content; no existing section altered)
```

The consumption point is strictly post-activation-resolution. DPSIG never sees nor modifies PSIG activation states. The read is one-directional.

### 2.4 Rendering Influence Boundaries

| DPSIG may influence | DPSIG may NOT influence |
|--------------------|------------------------|
| Section order within new DPSIG-added blocks | Section order of existing Lane A blocks |
| Severity badge appearance (new element) | PSIG badge states (existing Lane A elements) |
| Cluster pressure narrative block (new) | Condition correlation section (Lane A) |
| Cluster distribution table (new) | Pressure zone section (Lane A) |
| DPSIG signal trace section (new) | ESI/RAG section (Lane A) |
| Heat weights for new cluster visualization | Any existing numerical field in report |

### 2.5 Immutable Runtime Boundaries

The following boundaries hold unconditionally. They are permanent, not stream-scoped.

| Boundary | Rule |
|---------|------|
| IRC-01 THRESHOLD=2.0 | DPSIG thresholds are separate constants in a separate file; they share no code path with THRESHOLD=2.0 |
| IRC-02 RUN_RELATIVE_OUTLIER | DPSIG uses CLUSTER_MASS_THRESHOLD — different method, different namespace, no interaction |
| IRC-03 signal_registry.json | No DPSIG value ever touches signal_registry.json; DPSIG writes to artifacts/dpsig/ only |
| IRC-04 Lane A pipeline order | DPSIG runs at 40.5 — before Lane A pipeline begins; it does not alter the 75.x → 41.x → vault → lens sequence |
| IRC-05 binding_envelope.json | DPSIG reads canonical_topology.json only (Class 4); binding_envelope.json is an authorized read but not a compute input |
| IRC-06 semantic activation BLOCKED | DPSIG carries no semantic activation state; it cannot unblock semantic activation |
| IRC-07 namespace debt | DPSIG-031/032 and PSIG-001/002 remain separate namespaces; no equivalence claim is made |

---

## 3. 41.x Consumption Model

The 41.x projection layer consumes DPSIG exclusively through `lens_report_generator.py`. There is no direct 41.x signal compute layer involvement — 41.x does not re-derive or re-weight DPSIG values. DPSIG values arrive pre-computed from `derive_relational_signals.py` and are consumed as-is.

### 3.1 Authorized 41.x Consumption

| Consumption Pattern | Authorization | Basis |
|--------------------|---------------|-------|
| Projection weighting | AUTHORIZED | Visibility weighting; no activation mutation |
| Escalation prominence | AUTHORIZED | CRITICAL severity band triggers elevated rendering prominence |
| Cluster salience ordering | AUTHORIZED | cluster_salience_score (deterministic formula — Section 6) determines cluster table ordering |
| Amplification visibility | AUTHORIZED | amplification_factor (deterministic formula — Section 6) scales rendering intensity |
| Heatmap intensity | AUTHORIZED | cluster_heat_weight[i] (deterministic formula — Section 6) drives cluster color intensity |
| Executive ordering | AUTHORIZED | CRITICAL severity_band places cluster pressure block at TIER-1 position |
| Projection emphasis | AUTHORIZED | cluster_mass_emphasis (deterministic formula — Section 6) scales dominant cluster callout size |

All authorized consumption patterns are deterministic, formula-derived, and replay-stable (TAXONOMY-01).

### 3.2 Forbidden 41.x Operations

| Forbidden Operation | Why Forbidden |
|--------------------|--------------| 
| Activation override | 75.x owns activation; 41.x is a consumer, not a compute layer |
| Threshold override | THRESHOLD=2.0 is immutable per IRC-01; CPI/CFA thresholds are DPSIG-internal |
| Condition mutation | condition_correlation_state.json is Lane A sovereign; DPSIG has no write path to it |
| Runtime signal mutation | DPSIG values are pre-computed at 40.5; they do not re-derive at 41.x |
| Autonomous escalation | Escalation prominence is rendering emphasis only; it does not constitute an escalation event |
| PSIG-DPSIG convergence | PSIG and DPSIG activation states must never be merged into a combined activation score |
| Cross-signal activation | DPSIG HIGH does not imply PSIG HIGH; PSIG HIGH does not trigger DPSIG escalation |

### 3.3 41.x Projection-Only Declaration

41.x remains a projection-only layer with respect to DPSIG. It:

1. **Reads** dpsig_signal_set.json from the authorized artifact path
2. **Passes** DPSIG values to the rendering template without modification
3. **Renders** DPSIG-informed sections additively alongside existing Lane A sections
4. **Returns** no DPSIG-derived values to any upstream compute artifact

The 41.x layer's role with respect to DPSIG is: *render, not compute; consume, not derive; display, not decide*.

---

## 4. LENS Projection Behaviors

The following concrete LENS behaviors are enabled by DPSIG projection integration. Each is deterministic, replay-stable, and non-inferential.

### 4.1 Pressure-Ranked Cluster Zones

**Rendering description**: A ranked cluster list ordered by `cluster_salience_score` (descending), with the dominant cluster highlighted as the structural pressure apex. Non-singleton clusters are listed with their node_count, heat weight, and CPI contribution. Singleton clusters are collapsed into a count summary.

**Deterministic basis**:  
`cluster_salience_score = round((CPI / 5.0) × severity_multiplier × CFA, 4)`  
Cluster order = descending cluster_salience_score; tie-break = cluster_id ascending

**Replay expectation**: TAXONOMY-01 stable. Same topology → same ranking order, same heat weights, same salience scores.

**Explainability expectation**: Each row includes `explainability_render` from the signal entry. No additional inference.

**Rendering intent**: Surface "which cluster is the structural pressure source" in a scannable ranked view for engineering and executive audiences.

### 4.2 Cluster Mass Concentration Overlay

**Rendering description**: A mass share bar showing the dominant cluster's structural mass fraction (CFA) relative to total topology. The dominant cluster is highlighted with its share percentage. The "concentration zone" — the cluster's share of the total execution surface — is explicitly labeled.

**Deterministic basis**:  
`mass_share_display = f"{round(CFA × 100, 2)}% of structural mass in {max_cluster_name} ({max_cluster_id})"`  
`remaining_share = round((1.0 - CFA) × 100, 2)`

**Replay expectation**: TAXONOMY-01 stable. Same CFA → same display string, same bar proportions.

**Explainability expectation**: The display string is a direct arithmetic translation: "89 of 123 structural nodes (72.36%) reside in the src cluster."

**Rendering intent**: Give executives an immediate quantitative picture of structural concentration without requiring them to read signal trace details.

### 4.3 Escalation Propagation Visibility

**Rendering description**: A severity-band-gated callout block. When `severity_band = CRITICAL`, a dedicated escalation block is rendered at the top of the TIER-1 executive section, above the existing PSIG summary. When `severity_band = HIGH`, a pressure warning banner is shown. When ELEVATED or NOMINAL, no escalation block is rendered.

**Severity gate rules**:

| severity_band | Rendering behavior |
|---------------|------------------|
| CRITICAL | "Cluster Concentration Alert" block — contains both signal summaries and severity declaration |
| HIGH | "Structural Pressure Warning" banner — single-line with dominant signal summary |
| ELEVATED | No separate callout — signal values appear in cluster table only |
| NOMINAL | No callout — cluster table shown only if dpsig present |
| NULL_TOPOLOGY | "Topology signal unavailable" placeholder |

**Deterministic basis**: `severity_band` is TAXONOMY-01 stable — derives deterministically from activation states of both signals.

**Replay expectation**: TAXONOMY-01 stable. Same severity_band → same gate outcome → same callout behavior.

**Rendering intent**: Make the presence of a critical structural concentration immediately visible to executives without requiring them to interpret signal values.

### 4.4 Topology Pressure Heatmap

**Rendering description**: A cluster-level heatmap where each non-singleton cluster is assigned a heat intensity based on its node_count relative to the maximum cluster. Singletons receive zero heat. The dominant cluster receives maximum heat (intensity=1.0000). All other clusters are proportionally scaled.

**Deterministic basis**:  
`cluster_heat_weight[i] = round(cluster_node_count[i] / max_cluster_node_count, 4)`

For FastAPI:

| Cluster | node_count | heat_weight |
|---------|-----------|------------|
| CLU-17/src | 89 | 1.0000 |
| CLU-12/generated | 7 | 0.0787 |
| CLU-03/.github | 6 | 0.0674 |
| CLU-08/.vscode | 3 | 0.0337 |
| CLU-06 | 2 | 0.0225 |
| CLU-07 | 2 | 0.0225 |
| CLU-18/tests | 2 | 0.0225 |
| 12 singletons | 1 each | 0.0000 |

**Replay expectation**: TAXONOMY-01 stable. Same normalization_basis → same heat weights.

**Rendering intent**: Give visual dimensionality to the topology's structural mass distribution without requiring the viewer to read raw numbers.

### 4.5 Executive Attention Weighting

**Rendering description**: The cluster pressure section is positioned at a report location determined by `cluster_salience_score`. When `cluster_salience_score ≥ 1.0` (salience above the HIGH_THRESHOLD baseline), the section appears before the PSIG signal summary. When `cluster_salience_score < 1.0`, it appears after.

**Deterministic basis**:  
`cluster_salience_score ≥ 1.0 → render before PSIG section`  
`cluster_salience_score < 1.0 → render after PSIG section`

For FastAPI: `cluster_salience_score = 1.6243` → render before PSIG section.

**Replay expectation**: TAXONOMY-01 stable. Same cluster_salience_score → same section position.

**Rendering intent**: High-structural-salience runs automatically surface cluster intelligence at the top of the executive view, without requiring manual configuration.

### 4.6 Structural Bottleneck Highlighting

**Rendering description**: The dominant cluster (max_cluster_id/max_cluster_name with max node_count) is explicitly labeled as the structural bottleneck candidate. Its node count, CPI contribution, and mass share are displayed in a dedicated callout box within the cluster health section.

**Deterministic basis**: Bottleneck label is assigned to `normalization_basis.max_cluster_id` — the cluster with the highest node_count (tie-broken by cluster_id ascending, consistent with derive_relational_signals.py).

**Replay expectation**: TAXONOMY-01 stable. Same max_cluster_id → same bottleneck label assignment.

**Rendering intent**: Make the structural bottleneck candidate immediately identifiable without requiring the reader to compare cluster sizes.

### 4.7 Dependency Chain Amplification

**Rendering description**: A qualitative amplification statement that quantifies how much the dominant cluster's structural mass exceeds the "expected" mass for a balanced topology. Derived from CPI: the dominant cluster contains CPI × the average non-singleton cluster size.

**Deterministic basis**:  
`amplification_statement = f"{max_cluster_name} ({max_cluster_id}) structural mass is {CPI}x the average non-singleton cluster size — amplification factor {amplification_factor} above expected distribution baseline."`

For FastAPI: "src (CLU-17) structural mass is 5.6126x the average non-singleton cluster size — amplification factor 1.6243 above expected distribution baseline."

**Replay expectation**: TAXONOMY-01 stable. Same CPI and amplification_factor → same statement.

**Rendering intent**: Frame the concentration finding in amplification terms — not "the cluster is big" but "the cluster is 5.6x bigger than expected given the topology distribution." This reframes concentration as deviation from baseline.

---

## 5. Executive Prioritization Model

DPSIG creates structural salience — it does not create autonomous executive conclusions.

### 5.1 Salience Weighting

The `cluster_salience_score` is the primary weighting input for executive prioritization. It is a deterministic scalar derived from three TAXONOMY-01-stable quantities:

```
cluster_salience_score = round(
  (CPI / CPI_HIGH_THRESHOLD) × severity_multiplier × CFA,
  4
)
where:
  CPI_HIGH_THRESHOLD = 5.0 (constant from derive_relational_signals.py)
  severity_multiplier = {CRITICAL: 2.0, HIGH: 1.5, ELEVATED: 1.2, NOMINAL: 1.0, NULL_TOPOLOGY: 0.0}

FastAPI reference: round((5.6126 / 5.0) × 2.0 × 0.7236, 4) = 1.6243
```

The salience score is a rendering weight only. It does not constitute a business priority, a risk score, or an executive recommendation.

### 5.2 Pressure Amplification

`amplification_factor` expresses how far the cluster's structural mass exceeds the expected distribution baseline:

```
amplification_factor = round(cluster_salience_score / 1.0, 4)
= cluster_salience_score (since the baseline is 1.0)

Interpretation:
  amplification_factor > 1.0 → cluster promoted above distribution baseline
  amplification_factor = 1.0 → cluster at distribution baseline
  amplification_factor < 1.0 → cluster below distribution baseline
  amplification_factor = 0.0 → NULL_TOPOLOGY (no signal)

FastAPI reference: amplification_factor = 1.6243
Meaning: 62.43% above the expected distribution baseline for a run with this topology
```

### 5.3 Escalation Prominence

Escalation prominence is a rendering tier decision — it does not constitute an escalation event in the Lane A sense.

| severity_band | Escalation prominence tier | Rendering effect |
|---------------|--------------------------|-----------------|
| CRITICAL | TIER-1 apex | Cluster pressure block rendered before PSIG section; "Cluster Concentration Alert" block shown |
| HIGH | TIER-1 elevated | "Structural Pressure Warning" banner rendered; cluster block in TIER-1 |
| ELEVATED | TIER-2 standard | Cluster block in TIER-2 engineering section |
| NOMINAL | TIER-2 informational | Cluster table rendered; no prominence callout |
| NULL_TOPOLOGY | TIER-3 footnote | "Topology signal unavailable" in TIER-3 only |

### 5.4 Cluster Fragility Visibility

`fragility_score` combines CPI and CFA into a composite structural fragility indicator:

```
fragility_score = round(min(CPI / CPI_HIGH_THRESHOLD, 2.0) × CFA, 4)

Fragility tiers:
  fragility_score > 0.50 → HIGH_STRUCTURAL_FRAGILITY
  fragility_score > 0.25 → ELEVATED_STRUCTURAL_FRAGILITY
  fragility_score ≤ 0.25 → NOMINAL_STRUCTURAL_FRAGILITY

FastAPI reference: round(min(5.6126 / 5.0, 2.0) × 0.7236, 4)
                 = round(min(1.12252, 2.0) × 0.7236, 4)
                 = round(1.12252 × 0.7236, 4)
                 = round(0.8122..., 4)
                 = 0.8122 → HIGH_STRUCTURAL_FRAGILITY
```

Note: `fragility_score` is a LENS rendering indicator — a derived display value. It is computed from TAXONOMY-01-stable inputs and is itself TAXONOMY-01 stable.

### 5.5 Dependency Concentration Emphasis

`cluster_mass_emphasis` expresses the dominant cluster's visual weight in the dependency concentration view:

```
cluster_mass_emphasis = round(CFA × severity_multiplier, 4)

FastAPI reference: round(0.7236 × 2.0, 4) = 1.4472
Meaning: 44.72% above the unweighted mass share — severity multiplier amplifies the display weight
```

### 5.6 Explicitly Prohibited Prioritization Methods

| Prohibited Method | Why Prohibited |
|------------------|---------------|
| Semantic prioritization | DPSIG has no semantic content; it derives from topology counts only |
| Probabilistic prioritization | DPSIG is deterministic; it does not model probability distributions |
| AI-generated escalation logic | DPSIG rendering is template-based; no LLM, no probabilistic inference |
| Cross-run trend prioritization | DPSIG operates on a single run; it has no cross-run state |
| Business risk scoring | DPSIG measures structural concentration; it has no business context to score |
| Team quality inference | DPSIG reflects topology structure; it makes no claims about team decisions |
| Investment prioritization | DPSIG informs structural salience; it does not recommend investments |

DPSIG creates **structural salience**, not **autonomous executive conclusions**. The distinction is hard and permanent.

---

## 6. Projection Weighting Engine

The projection weighting engine is the complete deterministic model for computing all rendering weights from DPSIG signals. All weights are TAXONOMY-01 stable.

### 6.1 Weighting Inputs

```
Primary inputs (all TAXONOMY-01 stable):
  CPI                    = signal_entries["DPSIG-031"].signal_value
  CFA                    = signal_entries["DPSIG-032"].signal_value
  cpi_activation         = signal_entries["DPSIG-031"].activation_state
  cfa_activation         = signal_entries["DPSIG-032"].activation_state
  severity_band          = derivation_summary.severity_band
  max_cluster_id         = normalization_basis.max_cluster_id
  max_cluster_node_count = normalization_basis.max_cluster_node_count (from derivation_trace)
  total_structural_nodes = normalization_basis.total_structural_node_count
  non_singleton_clusters = normalization_basis.non_singleton_cluster_ids (list, ascending)
  non_singleton_sizes    = normalization_basis.non_singleton_cluster_sizes (list, parallel to above)

NULL_TOPOLOGY guard:
  If CPI is null or CFA is null (denominator guard fired):
    All weights = 0.0
    severity_multiplier = 0.0
    Render NULL_TOPOLOGY placeholder
```

### 6.2 Weighting Normalization

```
Step 1 — Severity multiplier:
  severity_multiplier := {
    "CRITICAL":      2.0,
    "HIGH":          1.5,
    "ELEVATED":      1.2,
    "NOMINAL":       1.0,
    "NULL_TOPOLOGY": 0.0
  }[severity_band]

Step 2 — CPI weight:
  cpi_weight = round(CPI / 5.0, 4)
  # CPI_HIGH_THRESHOLD = 5.0 (constant — matches derive_relational_signals.py)
  # FastAPI: round(5.6126 / 5.0, 4) = round(1.12252, 4) = 1.1225

Step 3 — CFA weight:
  cfa_weight = CFA
  # CFA is already normalized to [0, 1] by formula definition
  # FastAPI: 0.7236

Step 4 — Cluster salience score:
  cluster_salience_score = round(cpi_weight × severity_multiplier × cfa_weight, 4)
  # FastAPI: round(1.1225 × 2.0 × 0.7236, 4) = round(1.6243..., 4) = 1.6243

Step 5 — Amplification factor:
  amplification_factor = cluster_salience_score
  # baseline is 1.0 (nominal weight); factor > 1.0 = promoted above baseline
  # FastAPI: 1.6243

Step 6 — Cluster mass emphasis:
  cluster_mass_emphasis = round(CFA × severity_multiplier, 4)
  # FastAPI: round(0.7236 × 2.0, 4) = 1.4472

Step 7 — Fragility score:
  fragility_score = round(min(cpi_weight, 2.0) × cfa_weight, 4)
  # Cap cpi_weight at 2.0 to prevent extreme amplification in fragility display
  # FastAPI: round(min(1.1225, 2.0) × 0.7236, 4) = round(1.1225 × 0.7236, 4) = round(0.8122..., 4) = 0.8122
```

### 6.3 Weighting Ordering

Report section ordering is determined by:

```
Section position rule:
  IF cluster_salience_score >= 1.0:
    DPSIG cluster pressure block → TIER-1 (before PSIG signal summary)
  ELSE:
    DPSIG cluster pressure block → TIER-2 (after PSIG signal summary)

Cluster table ordering:
  Primary sort: cluster_salience_score descending (max-salience cluster first)
  Tie-break: cluster_id ascending
  For the canonical FastAPI run: CLU-17/src is always first (cluster_salience_score applies globally to the dominant cluster; all other clusters are informational rows with heat weights)
```

### 6.4 Amplification Scaling

```
Amplification display text rule:
  IF amplification_factor >= 1.5:
    Label: "HIGH AMPLIFICATION" — render with full callout block
  ELIF amplification_factor >= 1.0:
    Label: "ELEVATED AMPLIFICATION" — render with summary callout
  ELIF amplification_factor > 0.0:
    Label: "BASELINE" — render as informational row
  ELSE:
    Label: "NULL" — render placeholder

FastAPI: amplification_factor = 1.6243 → "HIGH AMPLIFICATION" → full callout block
```

### 6.5 Cluster-Relative Heat Weights

```
cluster_heat_weight[i] = round(cluster_node_count[i] / max_cluster_node_count, 4)
  for all clusters i in normalization_basis.non_singleton_cluster_ids

Singleton clusters: heat_weight = 0.0000 (collapsed in display)

Rendering intensity scale:
  heat_weight = 1.0000 → maximum intensity (dominant cluster)
  heat_weight > 0.10   → high intensity
  heat_weight > 0.05   → medium intensity
  heat_weight ≤ 0.05   → low intensity (near-singleton scale)
```

### 6.6 Rendering Intensity Scaling

The rendering intensity for the dominant cluster's mass concentration bar:

```
rendering_intensity = round(max_cluster_node_count / total_structural_node_count, 4)
= CFA (by definition — they are the same ratio)
FastAPI: 0.7236 → fills 72.36% of the mass concentration bar
```

**Weighting affects projection visibility only.** No weighting value modifies any upstream signal value, activation state, threshold, or pipeline artifact. All weights are computed from pre-existing TAXONOMY-01-stable DPSIG fields and are themselves TAXONOMY-01 stable.

---

## 7. Replay-Safe Projection Requirements

Projection replayability and runtime determinism are related but distinct properties.

### 7.1 Distinction: Projection Replayability vs. Runtime Determinism

| Property | Runtime Determinism | Projection Replayability |
|---------|-------------------|------------------------|
| Scope | `derive_relational_signals.py` output fields | `lens_report_generator.py` rendering behavior |
| Certified at | `replay_diff.json` overall_verdict=IDENTICAL | Projection render identity (see Section 7.3) |
| TAXONOMY | TAXONOMY-01 stable: 32/32 fields | TAXONOMY-01 stable: rendering weights, section positions, text output |
| TAXONOMY-02 field | `generated_at` differs across runs | Report generation timestamp differs across runs |
| Proof artifact | `replay_diff.json` (commit ffee7d6) | `projection_render_id` (defined below) |

### 7.2 Deterministic Rendering Requirements

The following rendering behaviors must be deterministic — producing identical output for identical DPSIG input:

| Rendering element | Determinism requirement |
|------------------|------------------------|
| Section position (TIER-1 vs. TIER-2) | Fully determined by `cluster_salience_score` comparison to 1.0 |
| Severity callout type | Fully determined by `severity_band` string value |
| Cluster table order | Fully determined by `cluster_salience_score` descending + cluster_id ascending tie-break |
| Heat weight values | Fully determined by `cluster_heat_weight` formula from normalization_basis |
| Amplification label | Fully determined by `amplification_factor` threshold comparison |
| Fragility tier | Fully determined by `fragility_score` threshold comparison |
| Explainability text | Fully determined by template substitution from TAXONOMY-01-stable DPSIG fields |
| Projection render ID | Fully determined by SHA256 of TAXONOMY-01 field concatenation |

**No rendering element may involve randomness, non-deterministic ordering, or runtime state that varies between executions with identical input.**

### 7.3 Replay-Stable Prioritization

Prioritization order (which cluster is ranked first, which section appears first) must be TAXONOMY-01 stable.

```
Cluster table order is determined by:
  Primary: cluster_salience_score (descending)
  Tie-break: cluster_id (ascending)

Both determinants are TAXONOMY-01 stable (cluster_salience_score derives from CPI, CFA, severity_band — all TAXONOMY-01).
```

### 7.4 Replay-Safe Salience Ordering

Salience ordering is the sequence in which clusters appear in the cluster distribution table. This sequence must be identical for any two executions of `lens_report_generator.py` with the same `dpsig_signal_set.json`.

```
Implementation rule:
  Load normalization_basis.non_singleton_cluster_ids and non_singleton_cluster_sizes
  Sort pairs by (node_count descending, cluster_id ascending) — same sort key as derive_relational_signals.py max selection
  Render in that order
```

### 7.5 Replay-Safe Explainability

All explainability text within LENS report sections must derive exclusively from TAXONOMY-01-stable DPSIG fields. The `generated_at` field (TAXONOMY-02) must never appear inside explainability text.

```
ALLOWED in explainability text:
  signal_value, activation_state, signal_stable_key, derivation_hash
  normalization_basis fields (all TAXONOMY-01)
  Any computed weight (cluster_salience_score, amplification_factor, etc.)

FORBIDDEN in explainability text:
  generated_at (TAXONOMY-02 — time-varying)
  Any runtime timestamp not from DPSIG artifact
  Any dynamically generated text not derivable from TAXONOMY-01 fields
```

### 7.6 Projection Replay Identity

The `projection_render_id` is a replay-stable fingerprint for the LENS report's DPSIG-derived sections:

```
projection_render_id = sha256(
  "|".join([
    schema_version,
    client_id,
    run_id,
    signal_stable_key_031,
    signal_stable_key_032,
    severity_band
  ])
)[:16]

FastAPI reference inputs:
  schema_version:       "1.0"
  client_id:            "fastapi"
  run_id:               "run_02_oss_fastapi_pipeline"
  signal_stable_key_031: "b70663c865b168b5"
  signal_stable_key_032: "2358e0b083acda90"
  severity_band:        "CRITICAL"
```

The `projection_render_id` is TAXONOMY-01 stable. Any two executions of `lens_report_generator.py` with the same `dpsig_signal_set.json` will produce the same `projection_render_id`. It serves as the replay identity for the report's DPSIG sections.

---

## 8. LENS UI/UX Surfaces

### 8.1 Executive Summary Surface

**Purpose**: Deliver the cluster pressure finding at the top of the executive view. Scannable in under 5 seconds.

**DPSIG inputs**:
- `derivation_summary.severity_band`
- `signal_entries["DPSIG-031"].executive_summary`
- `signal_entries["DPSIG-032"].executive_summary`
- `cluster_salience_score` (derived — Section 6)

**Rendering behavior**:
- Severity badge: one of [CRITICAL, HIGH, ELEVATED, NOMINAL] — colored label above the cluster section heading
- When CRITICAL: render "Cluster Concentration Alert" callout block with both signal executive_summary fields
- When HIGH: render "Structural Pressure Warning" single-line banner
- When ELEVATED/NOMINAL: no callout — cluster table present in TIER-2 only
- Section position: determined by `cluster_salience_score` vs. 1.0 threshold (Section 6.3)

**Executive interpretation**: The severity badge and callout give a non-technical executive an immediate answer to "is this topology structurally concentrated?" without requiring them to understand CPI or CFA.

**Replay constraint**: TAXONOMY-01 stable. Same severity_band → same badge, same callout type, same section position.

### 8.2 Pressure Zones Surface

**Purpose**: Show the cluster-level structural pressure distribution — which clusters carry structural weight and how concentrated that weight is.

**DPSIG inputs**:
- `normalization_basis.non_singleton_cluster_ids`, `non_singleton_cluster_sizes`
- `normalization_basis.total_structural_node_count`, `singleton_cluster_count`
- `cluster_heat_weight[i]` for all non-singleton clusters (derived — Section 6.5)
- `signal_entries["DPSIG-031"].signal_value` (CPI for dominant cluster annotation)

**Rendering behavior**:
- Ranked cluster table: columns = [cluster_id, cluster_name, node_count, mass_share_%, heat_weight, intensity_tier]
- Dominant cluster row highlighted (border or color differentiation)
- Singleton clusters: collapsed into a single "N singletons (1 node each)" summary row
- Total row: total_structural_node_count, 100%, —

**Executive interpretation**: An engineering lead can immediately see where the structural mass is distributed and which cluster is the outlier.

**Replay constraint**: TAXONOMY-01 stable. Same normalization_basis → same table rows, same order, same values.

### 8.3 Escalation Surfaces

**Purpose**: Render severity-gated structural escalation visibility — not an escalation event, but visibility of escalation-relevant structural conditions.

**DPSIG inputs**:
- `derivation_summary.severity_band`
- `signal_entries["DPSIG-031"].activation_state`, `signal_entries["DPSIG-032"].activation_state`
- `signal_entries["DPSIG-031"].explainability_render`, `signal_entries["DPSIG-032"].explainability_render`

**Rendering behavior**:

| Severity | Surface rendered |
|---------|----------------|
| CRITICAL | "Cluster Concentration Alert" — full block with both signal explainability_render texts; severity declaration; cluster_salience_score; amplification_factor |
| HIGH | "Structural Pressure Warning" — abbreviated block with the higher-severity signal's summary |
| ELEVATED | One-line note in cluster table header: "Elevated structural concentration detected" |
| NOMINAL | No escalation surface — cluster table present without special framing |

**Executive interpretation**: When CRITICAL, an executive sees a structured callout that contextualizes the finding without requiring technical interpretation. The callout contains only arithmetic facts from `explainability_render` — no inferred conclusions.

**Replay constraint**: TAXONOMY-01 stable. Same severity_band and activation_states → same escalation surface choice.

### 8.4 Cluster Health Surface

**Purpose**: Give a composite cluster structural health indicator combining both CPI (concentration) and CFA (mass share) into a single scannable health signal.

**DPSIG inputs**:
- `signal_entries["DPSIG-031"].signal_value` (CPI)
- `signal_entries["DPSIG-032"].signal_value` (CFA)
- `fragility_score` (derived — Section 5.4)
- `normalization_basis.non_singleton_cluster_count`, `singleton_cluster_count`

**Rendering behavior**:
- Fragility tier badge: HIGH_STRUCTURAL_FRAGILITY / ELEVATED_STRUCTURAL_FRAGILITY / NOMINAL_STRUCTURAL_FRAGILITY
- Composite bar: CPI_weight (left half) + CFA (right half) → two-component health bar
- Cluster composition note: "N non-singleton clusters, M singletons — structural mass concentrated in K clusters"

**Executive interpretation**: The cluster health surface gives a synthesized indicator that combines concentration and mass share. HIGH_STRUCTURAL_FRAGILITY means both are simultaneously elevated — not a judgment, a topology fact.

**Replay constraint**: TAXONOMY-01 stable. Same fragility_score → same tier → same badge.

### 8.5 Dependency Amplification Surface

**Purpose**: Express the dominant cluster's structural amplification relative to the expected distribution baseline.

**DPSIG inputs**:
- `normalization_basis.max_cluster_id`, `max_cluster_name`, `max_cluster_node_count` (from derivation_trace)
- `signal_entries["DPSIG-031"].signal_value` (CPI = amplification factor over mean)
- `amplification_factor` (derived — Section 6.2)

**Rendering behavior**:
- Amplification statement (Section 4.7 formula)
- Node breakdown: "89 of 123 structural nodes in src (CLU-17) — 72.36% structural mass, 5.6126x amplification over mean non-singleton cluster"
- Amplification label tier: HIGH AMPLIFICATION (factor 1.6243)

**Executive interpretation**: Reframes "the src cluster is big" as "the src cluster amplifies structural dependency 5.6x above expected." This is the projection value that makes DPSIG executive-grade intelligence — it contextualizes the absolute count as a structural amplification signal.

**Replay constraint**: TAXONOMY-01 stable. Same CPI, amplification_factor, normalization_basis → same statement.

### 8.6 Attention Heatmap Surface

**Purpose**: Visual cluster-level heatmap for rapid structural attention allocation.

**DPSIG inputs**:
- `cluster_heat_weight[i]` for all non-singleton clusters (derived — Section 6.5)
- `normalization_basis` cluster sizes

**Rendering behavior**:
- Heatmap bar chart or grid: each non-singleton cluster represented as a block scaled by heat_weight
- CLU-17/src: max heat (1.0000) — 100% intensity
- CLU-12/generated: 0.0787 — low intensity (7.87%)
- CLU-03/.github: 0.0674 — low intensity
- Remaining non-singletons: minimal intensity (< 0.05)
- Singleton clusters: zero / no heat block

**Executive interpretation**: The attention heatmap makes the structural concentration visually immediate. An executive scanning the heatmap sees instantly that the topology has one dominant heat source and a large number of structurally invisible clusters.

**Replay constraint**: TAXONOMY-01 stable. Same normalization_basis → same heat weights → same heatmap proportions.

### 8.7 Structural Fragility Indicators

**Purpose**: A trio of structural fragility KPIs suitable for executive dashboard embedding.

**DPSIG inputs**:
- `fragility_score` (derived — Section 5.4)
- `cluster_salience_score` (derived — Section 6.2)
- `cluster_mass_emphasis` (derived — Section 6.2)
- `derivation_summary.severity_band`

**Rendering behavior**:
Three indicator tiles:

| Indicator | Value | Source |
|-----------|-------|--------|
| Structural Fragility | HIGH (0.8122) | fragility_score tier |
| Salience Amplification | 1.6243× | cluster_salience_score |
| Mass Concentration | 72.36% | CFA expressed as percentage |

**Executive interpretation**: These three numbers summarize the DPSIG finding in a dashboard-embeddable format. They require no tooltip, no legend, and no technical context to interpret.

**Replay constraint**: TAXONOMY-01 stable. Same source values → same indicator values.

---

## 9. Commercial Value Surfaces

DPSIG projection integration enables five executive-grade intelligence surfaces. Each translates topology arithmetic into a commercially interpretable finding.

### 9.1 "Structural Amplification Detected"

**Trigger**: CPI ≥ 5.0 (CLUSTER_PRESSURE_HIGH)

**Commercial meaning**: One component cluster amplifies execution risk disproportionately. Its structural mass exceeds the expected distribution by a factor of 5+, which means any change, defect, or pressure event in that cluster propagates structurally more widely than expected for a distributed architecture.

**Evidence basis**: CPI = max_cluster_size / mean(non_singleton_cluster_sizes)  
FastAPI reference: CPI = 5.6126 → "the src cluster carries 5.6x the structural load of an average non-singleton cluster"

**Why this becomes executive-grade intelligence**: Most structural risk assessments require either manual code review or complex dependency graph analysis. DPSIG surfaces structural amplification as a single number derived entirely from topology structure — no semantic interpretation, no manual labeling, no codebase-specific knowledge required. The finding is reproducible across any codebase.

### 9.2 "Execution Fragility Concentration"

**Trigger**: CFA ≥ 0.60 (DOMINANT_CLUSTER)

**Commercial meaning**: A single cluster holds the majority of structural mass. Execution fragility is concentrated, not distributed. In practical terms: the risk surface is not spread across the organization — it is localized in one cluster. This is structurally opposite to fault-tolerant distribution patterns.

**Evidence basis**: CFA = max_cluster_size / total_structural_nodes  
FastAPI reference: CFA = 0.7236 → "72.36% of all structural nodes reside in one cluster"

**Why this becomes executive-grade intelligence**: The finding directly answers a common executive question: "Is our risk distributed or concentrated?" DPSIG answers it with a single number, from source structure alone, reproducibly.

### 9.3 "Dependency Overload Propagation"

**Trigger**: severity_band = CRITICAL (CPI_HIGH AND CFA_DOMINANT simultaneously)

**Commercial meaning**: Both concentration measures are simultaneously elevated. The dominant cluster is not just large (CFA) — it is also disproportionately large relative to the rest of the topology (CPI). This double signal means that execution events in the dominant cluster propagate both deeply (because of its size) and widely (because of its amplification factor).

**Evidence basis**: CPI = 5.6126 (HIGH) AND CFA = 0.7236 (DOMINANT) → CRITICAL  
FastAPI interpretation: "src carries 72% of structural mass and is 5.6x larger than expected — any structural pressure event in src propagates to the majority of the execution surface"

**Why this becomes executive-grade intelligence**: Simultaneous CPI_HIGH and CFA_DOMINANT is a compound finding that a single signal cannot express. DPSIG's severity_band = CRITICAL is the only artifact in the pipeline that captures this compound structural state deterministically, without semantic interpretation.

### 9.4 "Organizational Pressure Saturation"

**Trigger**: CRITICAL + non_singleton_cluster_count ≥ 5

**Commercial meaning**: The topology has multiple structurally active clusters (5+), but one overwhelmingly dominates. This structural pattern resembles satellite-and-hub organization — a central mass cluster with smaller functional satellites. Pressure saturation refers to the fact that the central cluster has absorbed structural mass that would, in a balanced topology, be distributed across the satellite clusters.

**Evidence basis**: non_singleton_cluster_count = 7, severity_band = CRITICAL  
FastAPI interpretation: "7 non-singleton clusters exist, but CLU-17/src contains 89 of the 111 non-singleton nodes (80%+)"

**Why this becomes executive-grade intelligence**: This surface reveals architectural pattern — not just size concentration, but the organizational implication of that concentration. It is communicable to non-technical executives as: "This codebase has one central component that has absorbed the structural work of 7."

### 9.5 "Cross-Cluster Escalation Amplification"

**Trigger**: CRITICAL + CFA > 0.50

**Commercial meaning**: The dominant cluster represents more than half of the entire codebase structure. This means that any pressure event — a hotfix, a dependency upgrade, a regression — that touches the dominant cluster, by definition affects more than half of all execution paths. The structure amplifies single-point events into topology-wide events.

**Evidence basis**: CFA = 0.7236 > 0.50 + severity_band = CRITICAL  
FastAPI interpretation: "72.36% of the execution surface is in one cluster — a single-point event in src is structurally equivalent to an event affecting the majority of the codebase"

**Why this becomes executive-grade intelligence**: This surface reframes topology concentration as execution blast radius. It is the most commercially powerful of the five surfaces because it connects structural measurement directly to operational risk exposure — expressed in topology terms, not in business speculation.

### 9.6 Why These Surfaces Are Executive-Grade Intelligence

These five surfaces share three properties that define executive-grade intelligence:

1. **Deterministic**: Each surface is computed from topology facts via exact formulas. The same codebase produces the same finding on every run. There is no ambiguity, no confidence interval, no interpretation drift.

2. **Auditable**: Every finding traces directly to `canonical_topology.json` via `derivation_trace`. An auditor with access to the source topology can reproduce every surface value by hand in under 5 minutes.

3. **Domain-agnostic**: No business context, codebase-specific knowledge, or semantic labeling is required. The findings hold for any topology that produces a `canonical_topology.json` with cluster node counts. They are structurally objective.

These three properties distinguish DPSIG-derived intelligence from semantic interpretation, AI-generated summaries, or manual analysis — and define its commercial defensibility.

---

## 10. Implementation Boundary

### 10.1 First Authorized Projection Implementation

The next authorized stream (`PI.PSEE-PIOS.DPSIG-PROJECTION-WEIGHTING.IMPLEMENTATION.01`) is authorized to implement exactly the following — no more, no less.

**AUTHORIZED for first implementation:**

| Item | Specification | Location |
|------|--------------|---------|
| DPSIG conditional read | Add `dpsig_path` load with None fallback (Section 2.2) | `lens_report_generator.py` |
| Weighting engine | Implement all formulas from Section 6 | `lens_report_generator.py` (projection section only) |
| TIER-1 cluster pressure block | severity-gated callout with executive_summary fields | `lens_report_generator.py` template |
| TIER-2 cluster distribution table | Ranked cluster table from normalization_basis | `lens_report_generator.py` template |
| TIER-3 DPSIG signal trace | Full derivation trace display | `lens_report_generator.py` template |
| Projection render ID computation | sha256 formula from Section 7.6 | `lens_report_generator.py` |
| Backward compatibility | None-dpsig path must produce identical output to current baseline | `lens_report_generator.py` |

**AUTHORIZED surfaces in first implementation:**

| Surface | Implementation method |
|---------|----------------------|
| Executive Summary severity badge | Template conditional on severity_band |
| Escalation callout block (CRITICAL/HIGH) | Template conditional on severity_band threshold |
| Pressure Zones cluster table | Deterministic table render from normalization_basis |
| Structural Fragility indicator tiles | Three computed values from Section 8.7 |
| Dependency Amplification statement | Template substitution from Section 4.7 |

### 10.2 Deferred — Not in First Implementation

| Deferred Item | Reason for Deferral |
|--------------|-------------------|
| AI interpretation layers | Semantic authority blocked; reopen conditions not met |
| Semantic narrative injection | Semantic governance exploration closed |
| Agentic orchestration | No authorized agentic stream exists |
| Autonomous remediation suggestions | Outside DPSIG scope; requires activation authority |
| Predictive semantics | No cross-run state exists; DPSIG operates on single run |
| Cross-run semantic comparison | DPSIG has no temporal dimension; cross-run would require a separate runtime state model |
| Visual heatmap rendering (graphical) | Text-based rendering is first implementation; graphical heatmap is deferred |
| Attention Heatmap UI component | Deferred to a future UI-layer stream |
| Cluster Health composite bar (visual) | Deferred — text representation in first implementation |
| Commercial surface narrative generation | Commercial surfaces are defined here as governance; AI-free narrative generation is deferred |

### 10.3 Lane A Mutation Authorization for Implementation

`lens_report_generator.py` is a protected Lane A artifact. Modifying it requires an explicit Lane A contract.

**This governance document hereby issues the Lane A modification authorization for `lens_report_generator.py`:**

```
LANE_A_MODIFICATION_AUTHORIZATION: PI.PSEE-PIOS.DPSIG-PROJECTION-INTEGRATION.01
Authorized stream: PI.PSEE-PIOS.DPSIG-PROJECTION-WEIGHTING.IMPLEMENTATION.01
Authorized modifications:
  1. Add DPSIG conditional read (Section 2.2 integration point)
  2. Add weighting engine computation (Section 6 formulas)
  3. Add TIER-1 cluster pressure block template section (Section 8.1)
  4. Add TIER-2 cluster distribution table template section (Section 8.2)
  5. Add TIER-3 DPSIG signal trace template section
  6. Add projection_render_id computation (Section 7.6)

FORBIDDEN modifications (explicit):
  7. Any change to existing PSIG signal rendering sections
  8. Any change to condition correlation rendering
  9. Any change to pressure zone rendering
  10. Any change to ESI/RAG rendering
  11. Any change to existing Lane A data reads (signal_registry, binding_envelope, etc.)
  12. Any change that makes DPSIG read mandatory (None fallback must be preserved)

Non-regression requirement:
  lens_report_generator.py with no dpsig_signal_set.json present MUST produce
  byte-identical output to the current baseline (commit 93098cb → 5b60e83 chain).
```

### 10.4 Projection Determinism Preservation

The implementation stream must explicitly verify projection determinism:

```
Projection determinism test:
1. Run lens_report_generator.py twice with identical inputs (including dpsig_signal_set.json)
2. Compare all DPSIG-derived sections in output
3. Verify projection_render_id identical across both runs
4. Verify cluster table order identical across both runs
5. Verify all weight values identical across both runs
6. Record result in projection_determinism_check.json
```

---

## 11. Governance Verdict

### 11.1 Summary

| Governance Question | Verdict |
|--------------------|---------|
| DPSIG projection integration authorized? | YES — architecture model defined; boundaries explicit; sovereignty preserved |
| Projection weighting model valid? | YES — deterministic formulas; TAXONOMY-01 stable; no inference |
| Executive intelligence layer commercially viable? | YES — 5 surfaces defined; deterministic; auditable; domain-agnostic |
| Deterministic sovereignty preserved? | YES — all weights formula-derived from TAXONOMY-01-stable inputs; no randomness |
| LENS differentiation operationalized? | YES — 7 concrete rendering surfaces; replay-safe behavior requirements defined |
| Semantic authority still blocked? | YES — no semantic content introduced; no activation override; no LLM involvement |
| Lane A activation sovereignty preserved? | YES — IRC-01..07 unchanged; no PSIG state modified; signal_registry.json untouched |
| DPSIG projection role formally defined? | YES — "projection weighting intelligence / structural salience intelligence / topology amplification telemetry" |

### 11.2 What This Stream Authorizes

1. **The projection integration model** (Section 2) — single ingestion point, additive consumption, immutable runtime boundaries
2. **The 41.x consumption model** (Section 3) — authorized/forbidden patterns explicit
3. **The LENS projection behaviors** (Section 4) — 7 concrete rendering surfaces with deterministic basis
4. **The executive prioritization model** (Section 5) — salience weighting; prohibited prioritization methods explicit
5. **The projection weighting engine** (Section 6) — all formulas specified; all inputs/outputs defined
6. **Replay-safe projection requirements** (Section 7) — projection replay identity defined; determinism requirements specified
7. **The LENS UI/UX surfaces** (Section 8) — 7 surfaces with DPSIG inputs, rendering behavior, and replay constraints
8. **The commercial value surfaces** (Section 9) — 5 surfaces with trigger conditions, commercial meaning, evidence basis
9. **The first implementation boundary** (Section 10) — authorized/deferred items explicit; Lane A modification authorization issued
10. **The handoff contract** (Section 11.3) — next stream fully specified

### 11.3 Handoff to Projection Weighting Implementation

**HANDOFF: PI.PSEE-PIOS.DPSIG-PROJECTION-WEIGHTING.IMPLEMENTATION.01**

The implementation stream is authorized to proceed immediately. All inputs are ready:

| Input | Status |
|-------|--------|
| dpsig_signal_set.json (FastAPI canonical fixture) | COMPLETE — commit ffee7d6; replay-certified |
| derive_relational_signals.py | COMPLETE — commit ffee7d6; certified operational |
| DPSIG_PROJECTION_INTEGRATION.md (this document) | COMPLETE — governance contract |
| Lane A modification authorization (lens_report_generator.py) | ISSUED — Section 10.3 |
| Weighting formulas | SPECIFIED — Section 6 (all formulas with FastAPI reference values) |
| Rendering surfaces | SPECIFIED — Sections 4, 8 (7 surfaces with full specification) |
| Non-regression requirement | SPECIFIED — Section 10.3 |
| Projection determinism test | SPECIFIED — Section 10.4 |

The implementation stream's scope is exactly: add DPSIG-conditional sections to `lens_report_generator.py` as defined in Sections 2.2, 6, and 8, preserving full backward compatibility.

---

## 12. Validation

### PASS criteria check:

- [x] Projection weighting clearly distinguished from activation — Section 2.1 explicit contrast table; Section 5.6 prohibited methods; Section 9.1–9.5 evidence-only commercial surfaces
- [x] DPSIG consumption boundaries explicit — Section 3.1 authorized patterns table; Section 3.2 forbidden operations table; Section 10.3 forbidden modifications list
- [x] Replay-safe projection defined — Section 7 complete: deterministic rendering requirements, projection replay identity formula, salience ordering contract
- [x] Executive prioritization deterministic — Section 5 complete: all weights formula-derived; no inference; no AI; prohibited methods explicitly listed
- [x] LENS integration concrete — Section 4 (7 behaviors) + Section 8 (7 surfaces): each with deterministic basis, replay expectation, rendering intent
- [x] Implementation boundary explicit — Section 10.1 authorized items; Section 10.2 deferred items; Section 10.3 Lane A authorization issued
- [x] Semantic authority blocked — no semantic content introduced; Section 5.6 prohibits AI/probabilistic prioritization; Section 10.2 defers all semantic/AI items
- [x] Sovereignty preserved — Section 2.5 immutable runtime boundaries (IRC-01..07 all confirmed); Section 3.2 forbidden operations; Lane A manifest compliance maintained

### FAIL conditions check:

- Projection mutates activation? NO — DPSIG reads PSIG artifacts; PSIG never reads DPSIG; no write path exists from dpsig_signal_set.json to any 75.x artifact
- Semantic prioritization introduced? NO — Section 5.6 explicitly prohibits; all weights are topology-arithmetic derived
- AI authority introduced? NO — all rendering is template-substitution; no probabilistic inference; no LLM involvement
- Replay guarantees weakened? NO — Section 7 strengthens replay guarantees for the projection layer; projection replay identity adds new replay proof surface
- Projection determinism ambiguous? NO — Section 6 specifies all formulas with exact arithmetic; Section 7.2 lists all required deterministic elements
- Runtime sovereignty drift? NO — Section 2.5 enumerates all IRC constraints; Section 11.1 confirms all preserved

Status: **PASS**

Baseline commit: 93098cb  
Implementation authorized: PI.PSEE-PIOS.DPSIG-PROJECTION-WEIGHTING.IMPLEMENTATION.01  
Lane A modification authorization: ISSUED (Section 10.3)
