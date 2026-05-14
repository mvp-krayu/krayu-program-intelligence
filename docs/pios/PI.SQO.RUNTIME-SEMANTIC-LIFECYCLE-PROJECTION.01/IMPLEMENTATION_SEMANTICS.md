---
stream: PI.SQO.RUNTIME-SEMANTIC-LIFECYCLE-PROJECTION.01
type: implementation-semantics
classification: G2
primitives:
  - ReconciliationLifecycleProjection
  - formatReconciliationSection (extended)
  - LifecycleProjection component
related_concepts:
  - Reconciliation Lifecycle
  - Runtime Projection
  - Semantic Debt
  - SQO Cockpit
---

# Implementation Semantics — Runtime Semantic Lifecycle Projection

**Stream:** PI.SQO.RUNTIME-SEMANTIC-LIFECYCLE-PROJECTION.01

---

## 1. Primitive Inventory

| # | Primitive | Module | Purpose | Reuse Status |
|---|-----------|--------|---------|--------------|
| 1 | `projectLifecycleForRuntime(artifact)` | ReconciliationLifecycleProjection.js | Transform lifecycle artifact into 8 runtime-consumable projection shapes | **REUSABLE** — any lifecycle artifact |
| 2 | `projectTrend(lifecycle)` | ReconciliationLifecycleProjection.js | Extract trend label, epoch count, current epoch label | **REUSABLE** |
| 3 | `projectTrajectory(lifecycle)` | ReconciliationLifecycleProjection.js | Extract epoch-indexed trajectories for confidence, ratio, unresolved, unmatched | **REUSABLE** |
| 4 | `projectCurrentPosture(lifecycle)` | ReconciliationLifecycleProjection.js | Extract current semantic posture with resolved/unresolved counts | **REUSABLE** |
| 5 | `projectEpochSummary(lifecycle)` | ReconciliationLifecycleProjection.js | Extract per-epoch summary with compact distribution | **REUSABLE** |
| 6 | `projectLatestDelta(lifecycle)` | ReconciliationLifecycleProjection.js | Extract latest epoch-to-epoch delta with domain movements | **REUSABLE** |
| 7 | `projectSemanticDebt(lifecycle)` | ReconciliationLifecycleProjection.js | Extract semantic debt summary with resolution rate | **REUSABLE** |
| 8 | `projectUnresolvedDomains(lifecycle)` | ReconciliationLifecycleProjection.js | Extract current unresolved domain list with metadata | **REUSABLE** |
| 9 | `projectProvenance(lifecycle)` | ReconciliationLifecycleProjection.js | Extract replay provenance with governance flags and epoch sources | **REUSABLE** |
| 10 | `LifecycleProjection` | ReconciliationCorrespondencePanel.jsx | React component rendering all lifecycle projection sections | **REUSABLE** — renders any lifecycle projection shape |
| 11 | `LifecyclePosture` | ReconciliationCorrespondencePanel.jsx | React component rendering current semantic posture | **REUSABLE** |
| 12 | `LifecycleTrajectory` | ReconciliationCorrespondencePanel.jsx | React component rendering confidence/unresolved bar chart | **REUSABLE** |
| 13 | `LifecycleDelta` | ReconciliationCorrespondencePanel.jsx | React component rendering latest epoch delta with per-domain movement | **REUSABLE** |
| 14 | `LifecycleSemanticDebt` | ReconciliationCorrespondencePanel.jsx | React component rendering semantic debt summary and unresolved domains | **REUSABLE** |
| 15 | `LifecycleEpochs` | ReconciliationCorrespondencePanel.jsx | React component rendering epoch timeline | **REUSABLE** |
| 16 | `LifecycleProvenance` | ReconciliationCorrespondencePanel.jsx | React component rendering replay provenance and governance | **REUSABLE** |

---

## 2. Input Contracts

### projectLifecycleForRuntime(artifact)

Expects a `reconciliation_lifecycle` artifact conforming to the schema produced by `ReconciliationLifecycleCompiler.compileLifecycle()`:

| Required Field | Type | Description |
|----------------|------|-------------|
| `ok` | boolean | Must be `true` for projection to proceed |
| `epochs` | Array | Epoch snapshots with `summary`, `per_domain`, `unmatched_structural` |
| `deltas` | Array | Pairwise epoch deltas with `summary_delta`, `domain_deltas` |
| `progression` | object | Trajectories and semantic debt summary |
| `runtime_summary` | object | Compact current-state summary |
| `governance` | object | Determinism/replay guarantees |

Returns `null` if artifact is falsy or `ok !== true`.

### ReconciliationCorrespondencePanel (React)

Expects `reconciliationData` prop with optional `lifecycle` key:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `summary` | object | YES | Reconciliation summary (existing) |
| `correspondences` | Array | YES | Per-domain correspondences (existing) |
| `unmatched_structural` | Array | YES | Unmatched structural domains (existing) |
| `lifecycle` | object/null | NO | Lifecycle projection (new — graceful degradation if absent) |

---

## 3. Output Contracts

### Projection Shape (projectLifecycleForRuntime output)

| Key | Shape | Description |
|-----|-------|-------------|
| `trend` | `{ label, total_epochs, current_epoch_index, current_epoch_label }` | Trend state |
| `trajectory` | `{ weighted_confidence[], reconciliation_ratio[], unresolved[], unmatched_structural[], epoch_labels[] }` | Epoch-indexed trajectories |
| `currentPosture` | `{ weighted_confidence, reconciliation_ratio, reconciliation_ratio_pct, unresolved_count, total_domains, resolved_count, confidence_distribution, trend }` | Current semantic posture |
| `epochSummary` | `[{ epoch_id, label, enrichment_type, source_stream, source_artifact, timestamp, weighted_confidence, reconciliation_ratio, unresolved, unmatched_structural, distribution }]` | Per-epoch summaries |
| `latestDelta` | `{ from_label, to_label, weighted_confidence_change, level_movement, domains_improved_count, domains_degraded_count, domain_movements[] }` or `null` | Latest transition |
| `semanticDebt` | `{ total_unresolved, resolution_rate, unresolved_domain_ids[] }` | Debt summary |
| `unresolvedDomains` | `[{ domain_id, domain_name, domain_type, cluster_id }]` | Current unresolved list |
| `provenance` | `{ lifecycle_version, schema_version, generated_at, governance, epoch_sources[] }` | Replay provenance |

---

## 4. Calibration Assumptions

No calibration constants. The projection layer is a pure structural transformation — it reads artifact values and reshapes them for rendering without recalculating or reinterpreting any metrics.

---

## 5. Extension Points

| Extension | Mechanism | Current State |
|-----------|-----------|---------------|
| Additional projection shapes | Add new `project*()` functions to ReconciliationLifecycleProjection.js | 9 projection functions; can add more without changing existing |
| Custom rendering | Replace or extend `Lifecycle*` sub-components | Currently 6 sub-components; independent, composable |
| Multi-lifecycle comparison | Extend projection to accept multiple lifecycle artifacts | Currently single lifecycle; projection shape supports arrays |
| SSR data gating | Conditional inclusion based on lifecycle availability | Currently degrades gracefully if lifecycle is null |
| Overview integration | Surface lifecycle trend/posture in SQO overview cockpit | Currently reconciliation section only; projection module is importable from any section |

---

## 6. Module Responsibility Map

| Module | File | Responsibility | Client-Specific? |
|--------|------|---------------|------------------|
| Lifecycle projection | `lib/sqo-cockpit/ReconciliationLifecycleProjection.js` | Transform lifecycle artifact into runtime shapes | NO — reusable |
| Artifact loader | `lib/sqo-cockpit/SQOCockpitArtifactLoader.js` | Load reconciliation_lifecycle artifact from disk | NO — reusable (extended) |
| Formatter | `lib/sqo-cockpit/SQOCockpitFormatter.js` | Include lifecycle projection in reconciliation section data | NO — reusable (extended) |
| Panel component | `components/sqo-cockpit/ReconciliationCorrespondencePanel.jsx` | Render lifecycle projection in reconciliation workspace | NO — reusable (extended) |
| CSS | `styles/globals.css` | Lifecycle projection visual design | NO — design system |
