---
stream: PI.SQO.BLUEEDGE.PROGRESSIVE-RECONCILIATION-LIFECYCLE.01
type: implementation-semantics
classification: G2
primitives:
  - ReconciliationLifecycleCompiler
  - compile_blueedge_lifecycle
related_concepts:
  - Reconciliation
  - Epoch
  - Progressive Lifecycle
  - Delta
  - Semantic Debt
---

# Implementation Semantics — Progressive Reconciliation Lifecycle

**Stream:** PI.SQO.BLUEEDGE.PROGRESSIVE-RECONCILIATION-LIFECYCLE.01

---

## 1. Primitive Inventory

| # | Primitive | Module | Purpose | Reuse Status |
|---|-----------|--------|---------|--------------|
| 1 | `compileLifecycle(opts)` | ReconciliationLifecycleCompiler.js | Compile ordered correspondence epochs into a lifecycle artifact with deltas and progression | **REUSABLE** — client-agnostic |
| 2 | `extractEpochSnapshot(artifact)` | ReconciliationLifecycleCompiler.js | Extract summary, per-domain, and unmatched-structural snapshot from a correspondence artifact | **REUSABLE** — client-agnostic |
| 3 | `computeDelta(fromEpoch, toEpoch)` | ReconciliationLifecycleCompiler.js | Compute summary-level and per-domain deltas between two epoch snapshots | **REUSABLE** — client-agnostic |
| 4 | `determineTrend(epochs)` | ReconciliationLifecycleCompiler.js | Determine overall trend (IMPROVING/DEGRADING/STABLE/INSUFFICIENT_DATA) from epoch sequence | **REUSABLE** — client-agnostic |
| 5 | `compile_blueedge_lifecycle.js` | scripts/reconciliation/ | BlueEdge-specific script loading baseline + enriched artifacts and invoking compileLifecycle | **BlueEdge-specific** (hardcoded CLIENT/RUN_ID) |

---

## 2. Input Contracts

### compileLifecycle(opts)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `opts.client` | string | YES | Client identifier |
| `opts.runId` | string | YES | Run identifier |
| `opts.epochs` | Array | YES | Ordered list of epoch descriptors |

Each epoch descriptor:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `epochLabel` | string | YES | Human-readable label (e.g., "BASELINE", "AI_ENRICHED") |
| `enrichmentType` | string | YES | Type of enrichment applied (e.g., "NONE", "AI_ASSISTED_SEMANTIC_ENRICHMENT") |
| `sourceStream` | string | YES | PI stream that produced the source artifact |
| `sourceArtifact` | string | YES | Filename of the source correspondence artifact |
| `artifact` | object | YES | The correspondence artifact object (reconciliation_correspondence schema) |

### Consumed Fields from Correspondence Artifact

The lifecycle compiler reads the following fields from each correspondence artifact:

**From `artifact.summary`:**
- `total_semantic_domains`, `reconciled_count`, `unreconciled_count`
- `reconciliation_ratio`, `weighted_confidence_score`
- `confidence_distribution` (all 5 levels)
- `unmatched_structural_count`

**From `artifact.correspondences[]`:**
- `semantic_domain_id`, `semantic_domain_name`, `semantic_domain_type`
- `cluster_id`, `confidence_level`, `confidence_label`
- `structural_dom_id`, `structural_domain_name`
- `correspondence_basis`, `reconciliation_status`

**From `artifact.unmatched_structural[]`:**
- `structural_dom_id`, `structural_domain_name`

**From `artifact.generated_at`:** used as epoch timestamp

---

## 3. Output Contracts

### reconciliation_lifecycle.v1.json

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | Compilation success |
| `schema_version` | string | "1.0" |
| `artifact_type` | string | "reconciliation_lifecycle" |
| `generated_at` | ISO string | Compilation timestamp |
| `lifecycle_version` | string | Stream ID |
| `client` | string | Client identifier |
| `run_id` | string | Run identifier |
| `epochs` | Array | Epoch snapshots with summary, per_domain, unmatched_structural |
| `deltas` | Array | Pairwise epoch deltas with summary_delta and domain_deltas |
| `progression` | object | Trajectory arrays and semantic debt summary |
| `runtime_summary` | object | Compact SQO/LENS-consumable summary |
| `governance` | object | Determinism and replay guarantees |

### Progression Object

| Field | Type | Description |
|-------|------|-------------|
| `total_epochs` | number | Count of epochs |
| `current_epoch` | number | Index of latest epoch |
| `overall_trend` | string | IMPROVING / DEGRADING / STABLE / INSUFFICIENT_DATA |
| `weighted_confidence_trajectory` | number[] | Per-epoch weighted confidence scores |
| `reconciliation_ratio_trajectory` | number[] | Per-epoch reconciliation ratios |
| `unresolved_trajectory` | number[] | Per-epoch L1 unmapped counts |
| `unmatched_structural_trajectory` | number[] | Per-epoch unmatched structural counts |
| `semantic_debt_summary` | object | Current unresolved count, IDs, and resolution rate |

### Runtime Summary Object

Compact format for SQO/LENS v2 consumption:

| Field | Type | Description |
|-------|------|-------------|
| `client` | string | Client identifier |
| `run_id` | string | Run identifier |
| `current_epoch` | string | Label of current epoch |
| `total_epochs` | number | Total epoch count |
| `weighted_confidence` | number | Current weighted confidence % |
| `reconciliation_ratio` | number | Current reconciliation ratio |
| `confidence_distribution` | object | Current 5-level distribution |
| `unresolved_count` | number | Current L1 count |
| `total_domains` | number | Total semantic domains |
| `trend` | string | Overall trend label |
| `last_delta` | object/null | Most recent epoch transition summary |

---

## 4. Calibration Assumptions

No new calibration constants introduced. The lifecycle compiler is purely structural — it reads and compares existing confidence levels without recalculating them.

The `determineTrend` function uses a simple comparison of first vs. last epoch weighted confidence. This is intentionally naive for a 2-epoch lifecycle; with more epochs, a regression or windowed approach could replace it without changing the interface.

The `resolution_rate` in semantic debt uses percentage of initial L1 domains that have been resolved. Division-by-zero is avoided by returning 0 when there is only one epoch.

---

## 5. Extension Points

| Extension | Mechanism | Current State |
|-----------|-----------|---------------|
| Additional epochs | Append to `opts.epochs` array | Currently 2 epochs (baseline + enriched); unlimited by design |
| Client parameterization | Change CLIENT/RUN_ID in compilation script | Currently hardcoded in compile_blueedge_lifecycle.js |
| Trend algorithm | Replace `determineTrend()` body | Currently first-vs-last; could use slope/regression |
| Custom delta metrics | Extend `computeDelta()` return | Currently tracks confidence levels and summary stats |
| Lifecycle versioning | Append lifecycle artifacts with version suffix | Currently single lifecycle per run |

---

## 6. Module Responsibility Map

| Module | File | Responsibility | Client-Specific? |
|--------|------|---------------|------------------|
| Lifecycle compiler | `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationLifecycleCompiler.js` | Epoch snapshot extraction, delta computation, lifecycle compilation, trend detection | NO — reusable |
| Barrel export | `app/execlens-demo/lib/lens-v2/reconciliation/index.js` | Re-exports lifecycle compiler alongside correspondence compiler and artifact writer | NO — reusable |
| BlueEdge compilation script | `scripts/reconciliation/compile_blueedge_lifecycle.js` | Load BlueEdge baseline + enriched artifacts, invoke compileLifecycle, write output | YES — BlueEdge hardcoded |
| Lifecycle artifact | `artifacts/sqo/blueedge/.../reconciliation_lifecycle.v1.json` | Compiled lifecycle with epochs, deltas, progression | YES — BlueEdge output |
