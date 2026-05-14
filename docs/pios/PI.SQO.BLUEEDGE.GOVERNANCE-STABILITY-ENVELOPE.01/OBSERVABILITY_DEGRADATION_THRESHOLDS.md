# Observability Degradation Thresholds

**Stream:** PI.SQO.BLUEEDGE.GOVERNANCE-STABILITY-ENVELOPE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Wave:** W5 — Advanced Governance

---

## 1. Purpose

Identify the specific thresholds at which each observability dimension
begins degrading under orchestration pressure, and define detection
mechanisms to prevent observability collapse.

---

## 2. Observability Dimensions (From Upstream)

Seven observability dimensions were validated in the multi-overlay
proof (PI.SQO.BLUEEDGE.MULTI-OVERLAY-ORCHESTRATION.01):

| Dimension | Proven Status |
|-----------|--------------|
| Overlay sequence | VISIBLE |
| Activation causality | VISIBLE |
| Qualification evolution | VISIBLE |
| Replay lineage | VISIBLE |
| Rollback lineage | VISIBLE |
| Coexistence state | VISIBLE |
| Namespace state | VISIBLE |

All 7 were VISIBLE at the 3-overlay scale with 0 dependencies.

---

## 3. Per-Dimension Degradation Analysis

### 3.1 Overlay Sequence Observability

**What it shows:** The ordered sequence of overlay activations and
revocations, with timing and attribution.

| Overlays | Timeline Entries | Operator Scan Time | Assessment |
|----------|-----------------|-------------------|------------|
| 3 | 6 (3 activate + 3 revoke) | < 30 seconds | VISIBLE |
| 5 | 10 | ~1 minute | VISIBLE |
| 7 | 14 | ~2 minutes | DEGRADED |
| 10 | 20 | ~3+ minutes | DEGRADED |

**Degradation threshold:** > 12 timeline entries.

**Degradation type:** CLARITY — the information exists but takes
too long for an operator to scan and comprehend.

**Mitigation:** Summary views that group events by phase (activation
batch, revocation batch) rather than showing individual events.

### 3.2 Activation Causality Observability

**What it shows:** The 5-level causal chain (L0–L4) for each overlay.

| Overlays | Causal Chains | Cross-Chain References | Assessment |
|----------|--------------|----------------------|------------|
| 3 | 3 independent | 0 | VISIBLE (proven) |
| 5 | 5 | 0–2 (if deps) | VISIBLE |
| 7 | 7 | 0–6 (if deps) | DEGRADED (with deps) |
| 10 | 10 | 0–15+ (if deps) | DEGRADED |

**Degradation threshold:** > 5 causal chains, OR > 3 cross-chain
references.

**Degradation type:** COMPLEXITY — causal chains become
interdependent, making it harder to trace a single chain in isolation.

**Mitigation:** Causal chain isolation views that show one chain at
a time with dependency links highlighted.

### 3.3 Qualification Evolution Observability

**What it shows:** The T0–TN evolution chain with per-state metrics.

| Overlays | States | Metrics Per State | Total Data Points | Assessment |
|----------|--------|------------------|-------------------|------------|
| 3 | 7 | 5 | 35 | VISIBLE (proven) |
| 5 | 11 | 5 | 55 | VISIBLE |
| 7 | 15 | 5 | 75 | DEGRADED |
| 10 | 21 | 5 | 105 | DEGRADED |

**Degradation threshold:** > 11 states in the evolution chain.

**Degradation type:** DENSITY — too many states for visual
comprehension of the evolution trajectory.

**Mitigation:** Evolution summary (start state, peak state, current
state, key transitions) rather than full chain enumeration.

### 3.4 Replay Lineage Observability

**What it shows:** Replay verification results for every state.

| Overlays | Verifications | Cross-Snapshot Checks | Assessment |
|----------|--------------|----------------------|------------|
| 3 | 7 | 3 | VISIBLE (proven) |
| 5 | 11 | 5 | VISIBLE |
| 7 | 15 | 7 | DEGRADED |
| 10 | 21 | 10 | DEGRADED |

**Degradation threshold:** > 11 verifications.

**Degradation type:** AUDITABILITY — reviewing 15+ individual
verification results becomes audit burden rather than audit assurance.

**Mitigation:** Aggregate replay status (X/Y MATCH, Z divergences)
with drill-down to individual results on demand.

### 3.5 Rollback Lineage Observability

**What it shows:** Rollback points, revocation events, cascade chains.

| Overlays | Rollback Points | Cascade Chains | Assessment |
|----------|----------------|---------------|------------|
| 3 | 7 | 0 | VISIBLE (proven) |
| 5 | 11 | 0–2 | VISIBLE |
| 7 | 15 | 0–4 | DEGRADED (with cascades) |
| 10 | 21 | 0–8 | DEGRADED |

**Degradation threshold:** > 11 rollback points, OR > 2 cascade
chains.

**Degradation type:** NAVIGABILITY — too many rollback points to
navigate, cascade chains add branching complexity.

**Mitigation:** Rollback point timeline with cascade grouping.

### 3.6 Coexistence State Observability

**What it shows:** Overlap detection, conflict analysis, dependency
graph, coexistence health.

| Overlays | Pairwise Checks | Dependency Edges | Assessment |
|----------|----------------|-----------------|------------|
| 3 | 3 | 0 | VISIBLE (proven) |
| 5 | 10 | 0–4 | VISIBLE |
| 7 | 21 | 0–6 | DEGRADED |
| 10 | 45 | 0–9 | DEGRADED |

**Degradation threshold:** > 15 pairwise checks, OR > 3 dependency
edges.

**Degradation type:** VISUAL COMPLEXITY — the coexistence matrix
becomes too large for at-a-glance comprehension.

**Mitigation:** Coexistence summary (conflicts: N, overlaps: N,
health: STATUS) with drill-down to the full matrix.

### 3.7 Namespace State Observability

**What it shows:** Sandbox directory structure, artifact inventory,
write path validation.

| Overlays | Sandbox Artifacts (est.) | Directory Depth | Assessment |
|----------|------------------------|----------------|------------|
| 3 | 27 (proven) | 4 levels | VISIBLE |
| 5 | ~40 | 4 levels | VISIBLE |
| 7 | ~55 | 4 levels | VISIBLE |
| 10 | ~75 | 4 levels | VISIBLE |

**Degradation threshold:** Not reached at 10 overlays.

**Degradation type:** N/A — namespace structure scales linearly
and directory depth is fixed.

**Finding:** Namespace observability is the MOST pressure-resistant
dimension. It degrades last because directory structure is fixed
and artifacts are well-organized by package.

---

## 4. Compound Observability Degradation

Individual dimension degradation is manageable. The dangerous
scenario is **compound degradation** — multiple dimensions degrading
simultaneously:

| Compound Scenario | Dimensions Degraded | Assessment |
|------------------|--------------------|----|
| 7 overlays, 0 deps | 4 of 7 (sequence, evolution, replay, rollback) | PRESSURE |
| 7 overlays, 2 deps | 5 of 7 (above + causality) | RISK |
| 10 overlays, 0 deps | 5 of 7 (above + coexistence) | RISK |
| 10 overlays, 2+ deps | 6 of 7 (all except namespace) | PROHIBITED |

**Rule:** When ≥ 4 observability dimensions are simultaneously
degraded, the governance stability envelope is in the RISK zone.

---

## 5. Observability Collapse Definition

Observability COLLAPSE occurs when:

1. An operator cannot determine the current qualification state
   source (certified vs overlay) within 60 seconds
2. Replay verification results cannot be summarized in a single
   sentence per state
3. Rollback impact cannot be predicted from available observability
4. Coexistence health cannot be determined without reading raw
   artifacts
5. Evolution trajectory is not comprehensible from any summary view

**Current assessment:** Observability collapse is NOT reachable at
the 10-overlay architectural limit with the mitigation strategies
defined above. Without mitigations, collapse becomes possible at
8+ overlays with dependencies.

---

## 6. Degradation Detection Indicators

| Indicator | VISIBLE | DEGRADED | COLLAPSED |
|-----------|---------|----------|-----------|
| Timeline scan time | < 1 min | 1–3 min | > 3 min |
| Causal chains per view | ≤ 5 | 6–8 | > 8 |
| Evolution states | ≤ 11 | 12–15 | > 15 |
| Pairwise coexistence checks | ≤ 15 | 16–30 | > 30 |
| Rollback points to navigate | ≤ 11 | 12–15 | > 15 |
| Attribution sources | ≤ 6 | 7–8 | > 8 |
| Dimensions degraded | 0–2 | 3–4 | ≥ 5 |

---

## 7. Governance

- Observability degrades gradually, not suddenly — thresholds are identifiable
- Namespace observability is the most resilient dimension (never degrades at scale)
- Coexistence observability is the most pressure-sensitive (quadratic growth)
- Compound degradation (4+ dimensions) triggers RISK zone classification
- All degradation is CLARITY-type, not INTEGRITY-type — the data exists but becomes hard to consume
- Mitigation strategies (summaries, grouping, drill-down) can extend the safe zone
- Observability collapse is not reachable at the 10-overlay limit with mitigations
