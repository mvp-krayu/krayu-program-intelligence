# Overlay Saturation Analysis

**Stream:** PI.SQO.BLUEEDGE.GOVERNANCE-STABILITY-ENVELOPE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Wave:** W5 — Advanced Governance

---

## 1. Purpose

Characterize how governance stability degrades as overlay count
increases toward the architectural limit, and identify the saturation
threshold beyond which governance clarity becomes at risk.

---

## 2. Architectural Limits (From Activation Model)

| Limit | Value | Source |
|-------|-------|--------|
| Max ACTIVATED packages per (client, run_id) | 10 | MULTI_OVERLAY_ACTIVATION_SEQUENCING §7 |
| Max total active entries | 200 | MULTI_OVERLAY_ACTIVATION_SEQUENCING §7 |
| Max batch activation size | 5 | MULTI_OVERLAY_ACTIVATION_SEQUENCING §7 |
| Max queued re-evaluation triggers | 20 | MULTI_OVERLAY_ACTIVATION_SEQUENCING §7 |
| Max concurrent activation requests | 1 | MULTI_OVERLAY_ACTIVATION_SEQUENCING §7 |

---

## 3. BlueEdge Domain Capacity

| Property | Value |
|----------|-------|
| Total domains | 17 |
| Certified STRONG/EXACT | 4 (DOMAIN-01, 10, 14, 16) |
| Overlay-eligible (NONE or PARTIAL) | 13 |
| Clusters | 5 (CLU-01 through CLU-05) |
| Structural edges | 12 |

Maximum possible overlay-backed domains: 13 (to reach 17/17 for S3).

---

## 4. Saturation Scaling Model

### 4.1 Overlay Count vs Governance Complexity

| Overlays | Replay Snapshots | Audit Events (est.) | Coexistence Checks | Attribution Sources | Zone |
|----------|-----------------|--------------------|--------------------|--------------------|----|
| 1 | 3 | 8 | 0 | 2 | SAFE |
| 2 | 5 | 14 | 1 | 3 | SAFE |
| 3 | 7 | 18 | 3 | 4 | SAFE (proven) |
| 4 | 9 | 24 | 6 | 5 | SAFE (projected) |
| 5 | 11 | 30 | 10 | 6 | SAFE (projected) |
| 6 | 13 | 36 | 15 | 7 | PRESSURE |
| 7 | 15 | 42 | 21 | 8 | PRESSURE |
| 8 | 17 | 48 | 28 | 9 | RISK |
| 9 | 19 | 54 | 36 | 10 | RISK |
| 10 | 21 | 60 | 45 | 11 | RISK |

### 4.2 Growth Functions

| Metric | Growth | Formula |
|--------|--------|---------|
| Replay snapshots | Linear | 2N + 1 (N activations + N revocations + baseline) |
| Audit events (sequential activation) | Linear | ~6N (register + validate + authorize + eligible + activate + mount per package) |
| Coexistence checks | Quadratic | N(N-1)/2 pair-wise overlap checks |
| Attribution sources | Linear | N + 1 (certified baseline + N overlays) |
| Rollback points | Linear | 2N (pre-activate + post-activate per package) |

### 4.3 Critical Observation

**Coexistence checks grow quadratically.** This is the primary
driver of governance complexity at high overlay counts:

```
3 overlays:   3 checks   (manageable)
5 overlays:  10 checks   (moderate)
7 overlays:  21 checks   (significant)
10 overlays: 45 checks   (governance burden)
```

---

## 5. Saturation Threshold Analysis

### 5.1 Domain Saturation

| Scenario | Overlays | Domains Covered | Coverage % | Notes |
|----------|----------|----------------|-----------|-------|
| Minimal | 3 | 3 new + 4 certified = 7 | 41.2% | Proven safe |
| Moderate | 5 | 5 new + 4 certified = 9 | 52.9% | Projected safe |
| High | 8 | 8 new + 4 certified = 12 | 70.6% | Pressure zone |
| Near-complete | 10 | 10 new + 4 certified = 14 | 82.4% | Risk zone |
| Full (theoretical) | 13 | 13 new + 4 certified = 17 | 100% | Requires 13 packages (exceeds 10-package limit) |

**Key finding:** Full domain coverage (S3 achievement) requires 13
overlay-backed domains, but the architectural limit is 10 packages.
This means S3 is achievable only if some packages contribute multiple
domain upgrades (multi-entry packages).

### 5.2 Entry Saturation

With the 200-entry limit:

| Overlays | Entries/Package (avg) | Total Entries | Entry Utilization |
|----------|-----------------------|---------------|-------------------|
| 3 | 1 | 3 | 1.5% |
| 5 | 2 | 10 | 5.0% |
| 7 | 3 | 21 | 10.5% |
| 10 | 5 | 50 | 25.0% |
| 10 | 13 | 130 | 65.0% |
| 10 | 20 | 200 | 100% (limit) |

Entry saturation is unlikely to be a governance constraint unless
packages become very large (20 entries average).

### 5.3 Cluster Saturation

| Cluster | Domains | Certified | Overlay-Eligible | Max Overlays (1:1) |
|---------|---------|-----------|------------------|--------------------|
| CLU-01 | 4 | 1 (DOMAIN-01) | 3 | 3 |
| CLU-02 | 3 | 0 | 3 | 3 |
| CLU-03 | 3 | 1 (DOMAIN-14) | 2 | 2 |
| CLU-04 | 4 | 1 (DOMAIN-10) | 3 | 3 |
| CLU-05 | 3 | 1 (DOMAIN-16) | 2 | 2 |

Maximum single-cluster saturation: 3 overlays (proven in CLU-04).
Cross-cluster orchestration introduces inter-cluster governance
complexity not yet proven.

---

## 6. Saturation Risk Indicators

| Indicator | SAFE | PRESSURE | RISK |
|-----------|------|----------|------|
| Overlay count | ≤ 5 | 6–7 | 8–10 |
| Coexistence check count | ≤ 10 | 11–21 | > 21 |
| Attribution source count | ≤ 6 | 7–8 | > 8 |
| Audit trail length per lifecycle | ≤ 30 | 31–42 | > 42 |
| Overlay-to-certified ratio | ≤ 1.25:1 | 1.25–2:1 | > 2:1 |

---

## 7. Saturation Governance Rules

### 7.1 Mandatory Saturation Checks

Before activating overlay N+1, verify:

1. Total active packages < 10
2. Total active entries < 200
3. Coexistence check count remains manageable (< 21)
4. Attribution source count remains explainable (< 8)
5. No compound pressure (≤ 2 dimensions in PRESSURE zone)

### 7.2 Saturation Escalation

| Overlay Count | Required Action |
|---------------|----------------|
| 1–5 | Standard governance — Phase 1–4 lifecycle |
| 6–7 | Enhanced review — compound pressure check mandatory |
| 8–9 | Governance escalation — operator impact assessment required |
| 10 | Maximum — no further activations permitted |

---

## 8. Governance

- Overlay saturation analysis grounded in architectural limits and proven operational data
- Coexistence complexity grows quadratically — primary governance pressure driver
- Full S3 achievement requires multi-entry packages (13 domains, 10 package limit)
- Cross-cluster orchestration is untested and introduces additional governance complexity
- No artifacts created or modified during this analysis
