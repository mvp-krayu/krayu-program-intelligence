---
stream: PI.LENS.V2.RECONCILIATION-RUNTIME-CONSUMPTION.01
type: implementation-semantics
classification: G2
primitives:
  - LensReconciliationConsumptionLayer
  - ReconciliationAwarenessZone
related_concepts:
  - LENS v2
  - Reconciliation
  - Lifecycle
  - Semantic Debt
  - Qualification Trajectory
  - Replay Provenance
---

# Implementation Semantics — LENS Reconciliation Runtime Consumption

**Stream:** PI.LENS.V2.RECONCILIATION-RUNTIME-CONSUMPTION.01

---

## 1. Primitive Inventory

| # | Primitive | Module | Purpose | Reuse Status |
|---|-----------|--------|---------|--------------|
| 1 | `loadReconciliationLifecycle(client, runId)` | LensReconciliationConsumptionLayer.js | Load and project lifecycle artifact for a client/run | **REUSABLE** — any client |
| 2 | `buildReconciliationAwareness(payload, lifecycleProjection)` | LensReconciliationConsumptionLayer.js | Build unified reconciliation awareness shape from payload + lifecycle | **REUSABLE** — any payload |
| 3 | `resolveReconciliationPosture(summary)` | LensReconciliationConsumptionLayer.js | Classify posture tier (STRONG/MODERATE/WEAK/INSUFFICIENT) from reconciliation summary | **REUSABLE** |
| 4 | `resolveDebtPosture(summary, lifecycle)` | LensReconciliationConsumptionLayer.js | Merge debt metrics from summary + lifecycle projection | **REUSABLE** |
| 5 | `resolveQualificationFrame(summary, lifecycle)` | LensReconciliationConsumptionLayer.js | Build qualification trajectory frame with trend + trajectory + delta | **REUSABLE** |
| 6 | `ReconciliationAwarenessZone` | lens-v2-flagship.js | Mode-reactive reconciliation rendering (executive/dense/investigation/boardroom) | **Page-embedded** |
| 7 | `ReconTrajectoryStrip` | lens-v2-flagship.js | Epoch-indexed confidence trajectory with delta and movement chips | **Page-embedded** |
| 8 | `ReconDebtDisclosure` | lens-v2-flagship.js | Unresolved domain list with type classification | **Page-embedded** |
| 9 | `ReconDomainCorrespondence` | lens-v2-flagship.js | Per-domain L1-L5 correspondence table (investigation mode only) | **Page-embedded** |
| 10 | `ReconProvenance` | lens-v2-flagship.js | Governance flags + epoch count + generation date | **Page-embedded** |

---

## 2. Input Contracts

### loadReconciliationLifecycle(client, runId)

| Parameter | Type | Description |
|-----------|------|-------------|
| `client` | string | Client identifier (e.g., "blueedge") |
| `runId` | string | Run identifier (e.g., "run_blueedge_productized_01_fixed") |

Returns: lifecycle projection shape (from ReconciliationLifecycleProjection) or `null`.

### buildReconciliationAwareness(payload, lifecycleProjection)

| Parameter | Type | Description |
|-----------|------|-------------|
| `payload` | object | Live LENS semantic payload containing `reconciliation_summary` |
| `lifecycleProjection` | object/null | Lifecycle projection from `loadReconciliationLifecycle` |

Returns: `{ available, posture, debtPosture, qualificationFrame, lifecycle, correspondence, per_domain }` or `{ available: false, reason }`.

### ReconciliationAwarenessZone (React)

| Prop | Type | Description |
|------|------|-------------|
| `awareness` | object | Reconciliation awareness from `buildReconciliationAwareness` |
| `densityClass` | string | Active LENS mode (EXECUTIVE_BALANCED/EXECUTIVE_DENSE/INVESTIGATION_DENSE) |
| `boardroomMode` | boolean | Whether boardroom projection is active |

Mode-reactive rendering:
- **BOARDROOM**: Minimal posture strip (symbol, label, confidence, trend)
- **EXECUTIVE_BALANCED**: Posture header + metrics + trajectory. No debt disclosure.
- **EXECUTIVE_DENSE**: Posture header + metrics + trajectory + debt disclosure.
- **INVESTIGATION_DENSE**: Full view — posture, metrics, trajectory, debt, per-domain correspondence, provenance.

---

## 3. Output Contracts

### Reconciliation Awareness Shape

| Key | Type | Description |
|-----|------|-------------|
| `available` | boolean | Whether awareness was successfully built |
| `posture` | object | `{ label, tier, ratio_pct, weighted_confidence, grounded_count, unmapped_count, total_domains, coverage_pct }` |
| `debtPosture` | object | `{ unresolved_count, total_domains, resolution_pct, resolution_rate?, unresolved_domain_ids?, unresolved_domains? }` |
| `qualificationFrame` | object | `{ reconciliation_ratio, weighted_confidence, trend?, trajectory?, latest_delta?, epoch_count?, provenance? }` |
| `lifecycle` | object/null | Full lifecycle projection (trend, trajectory, posture, epochs, delta, debt, provenance) |
| `correspondence` | object | `{ reconciliation_ratio, reconciled_count, unreconciled_count, total_domains, weighted_confidence, confidence_distribution, unmatched_structural }` |
| `per_domain` | Array | Per-domain correspondence with confidence_level, structural_dom_id, reconciliation_status |

### Posture Tier Classification

| Tier | Criteria | Visual |
|------|----------|--------|
| STRONG | ratio ≥ 0.75 AND weighted ≥ 80 | Green ◆ |
| MODERATE | ratio ≥ 0.50 AND weighted ≥ 60 | Yellow ◇ |
| WEAK | weighted ≥ 40 | Orange △ |
| INSUFFICIENT | weighted < 40 | Red ▽ |

---

## 4. Calibration Assumptions

The posture tier thresholds (0.75/80, 0.50/60, 40) are governance decisions, not calibration parameters. They classify the reconciliation state for executive framing without changing the underlying confidence values.

These thresholds are intentionally conservative — a 41.2% weighted confidence with 23.5% reconciliation ratio classifies as WEAK, which is honest for BlueEdge's current state.

---

## 5. Extension Points

| Extension | Mechanism | Current State |
|-----------|-----------|---------------|
| Additional posture tiers | Extend tier classification in `resolveReconciliationPosture` | Currently 4 tiers |
| Custom mode rendering | Add mode-specific branches in `ReconciliationAwarenessZone` | Currently 4 modes (boardroom, executive, dense, investigation) |
| Multi-run comparison | Extend awareness to accept multiple payloads | Currently single payload |
| Trend narrative | Generate executive-appropriate trend framing | Currently shows raw trend label |
| SQO cross-reference | Link from LENS debt disclosure to SQO cockpit | Currently standalone |

---

## 6. Module Responsibility Map

| Module | File | Responsibility | Client-Specific? |
|--------|------|---------------|------------------|
| Consumption layer | `lib/lens-v2/LensReconciliationConsumptionLayer.js` | Load lifecycle, build awareness, classify posture | NO — reusable |
| Flagship binding | `lib/lens-v2/flagshipBinding.js` | Inject reconciliation awareness into SSR props | NO — reusable (extended) |
| Flagship page | `pages/lens-v2-flagship.js` | Render reconciliation awareness zone with mode-reactive components | NO — page-level (extended) |
| Lifecycle projection | `lib/sqo-cockpit/ReconciliationLifecycleProjection.js` | Transform lifecycle artifact into runtime shapes (consumed, not owned) | NO — reusable |
