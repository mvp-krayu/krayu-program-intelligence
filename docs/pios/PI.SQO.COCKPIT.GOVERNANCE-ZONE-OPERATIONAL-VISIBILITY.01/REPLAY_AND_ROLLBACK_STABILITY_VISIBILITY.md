# Replay and Rollback Stability Visibility

**Stream:** PI.SQO.COCKPIT.GOVERNANCE-ZONE-OPERATIONAL-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how replay stability and rollback stability become
operationally visible inside the cockpit — including replay
determinism, chain pressure, divergence risk, rollback
determinism, cascade complexity, and dependency risk.

---

## 2. Replay Stability Visibility (GV-03)

### 2.1 Replay Stability Dashboard

```
┌──────────────────────────────────────────────────────┐
│ REPLAY STABILITY                                      │
│ Session: SBX-{client}-{run}  │  Health: ●             │
├──────────────────────────────────────────────────────┤
│                                                       │
│ REPLAY DETERMINISM                                    │
│   Status: ● GUARANTEED                               │
│   All 8 determinism invariants (DI-01–DI-08): HOLD   │
│                                                       │
│ REPLAY CHAIN METRICS                                  │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Metric                  │ Value │ Threshold      │ │
│ │─────────────────────────│───────│────────────────│ │
│ │ Replay chain length     │ 3     │ ≤15 (clear)    │ │
│ │ Certified replays       │ 1     │ —              │ │
│ │ Active replays          │ 1     │ —              │ │
│ │ Pending replays         │ 1     │ —              │ │
│ │ Divergence count        │ 0     │ <3 (SAFE)      │ │
│ │ Cert failure rate       │ 0%    │ <30% (SAFE)    │ │
│ │ Avg reconstruction time │ 2.3s  │ —              │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ REPLAY PRESSURE INDICATOR                             │
│   Pressure: LOW (3/15 chain, 0 divergences)          │
│   Trend: STABLE                                       │
│                                                       │
│ PER-OVERLAY REPLAY STATUS                             │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Overlay       │ Replay Status │ Divergence      │ │
│ │───────────────│───────────────│─────────────────│ │
│ │ SEP-multi-001 │ ✓ CERTIFIED   │ None            │ │
│ │ SEP-multi-002 │ ● Phase 3/6   │ None            │ │
│ │ SEP-multi-003 │ ○ NOT STARTED │ —               │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ NAVIGATION                                            │
│   [View Invariant Detail] [View Chain Pressure]      │
│   [View Divergence History] [→ Replay Pipeline]      │
└──────────────────────────────────────────────────────┘
```

### 2.2 Replay Divergence Visibility

```
┌──────────────────────────────────────────────────────┐
│ REPLAY DIVERGENCE MONITOR                             │
├──────────────────────────────────────────────────────┤
│                                                       │
│ ACTIVE DIVERGENCES: 0                                 │
│ RESOLVED DIVERGENCES (7d): 0                          │
│ TOTAL DIVERGENCES (all time): 0                       │
│                                                       │
│ DIVERGENCE RISK ASSESSMENT                            │
│   Risk level: LOW                                     │
│   Nearest risk: 3 divergences → SAFE threshold breach│
│   Root cause distribution: (no data)                 │
│                                                       │
│ IF DIVERGENCE DETECTED:                               │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Visibility shows:                                 │ │
│ │ - Divergence type (DIV-01 through DIV-04)        │ │
│ │ - Severity (LOW/MODERATE/HIGH/CRITICAL)          │ │
│ │ - Affected overlay                                │ │
│ │ - Root cause category (RC-01 through RC-07)      │ │
│ │ - Investigation status (5-step protocol)          │ │
│ │ - Zone impact (does divergence trigger transition)│ │
│ │ - Authority impact (does divergence block promo)  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ NAVIGATION                                            │
│   [View Divergence Types] [View Root Causes]         │
│   [→ Certification Impact] [→ Zone Impact]           │
└──────────────────────────────────────────────────────┘
```

---

## 3. Rollback Stability Visibility (GV-04)

### 3.1 Rollback Stability Dashboard

```
┌──────────────────────────────────────────────────────┐
│ ROLLBACK STABILITY                                    │
│ Session: SBX-{client}-{run}  │  Health: ●             │
├──────────────────────────────────────────────────────┤
│                                                       │
│ ROLLBACK DETERMINISM                                  │
│   Status: ● GUARANTEED                               │
│   Independent removability: ALL overlays removable   │
│                                                       │
│ ROLLBACK COMPLEXITY METRICS                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Metric                  │ Value │ Threshold      │ │
│ │─────────────────────────│───────│────────────────│ │
│ │ Cascade depth           │ 1     │ ≤1 (SAFE)      │ │
│ │ Max cascade size        │ 1     │ ≤5 (limit)     │ │
│ │ Dependency count        │ 2     │ —              │ │
│ │ Certified rollbacks     │ 1     │ —              │ │
│ │ Active rollbacks        │ 1     │ —              │ │
│ │ Pending rollbacks       │ 1     │ —              │ │
│ │ Ambiguity count         │ 0     │ <3 (SAFE)      │ │
│ │ Removability rate       │ 100%  │ 100% (required)│ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ ROLLBACK PRESSURE INDICATOR                           │
│   Pressure: LOW (depth 1, 0 ambiguities)             │
│   Trend: STABLE                                       │
│                                                       │
│ PER-OVERLAY ROLLBACK STATUS                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Overlay       │ Rollback Status│ Dependencies    │ │
│ │───────────────│────────────────│─────────────────│ │
│ │ SEP-multi-001 │ ✓ CERTIFIED    │ 0 upstream      │ │
│ │ SEP-multi-002 │ ● Phase 2/5    │ 1 downstream    │ │
│ │ SEP-multi-003 │ ○ NOT STARTED  │ 0               │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ NAVIGATION                                            │
│   [View Dependency Graph] [View Cascade Analysis]    │
│   [View Ambiguity History] [→ Rollback Pipeline]     │
└──────────────────────────────────────────────────────┘
```

### 3.2 Cascade Visibility

```
┌──────────────────────────────────────────────────────┐
│ CASCADE COMPLEXITY MONITOR                            │
├──────────────────────────────────────────────────────┤
│                                                       │
│ DEPENDENCY GRAPH                                      │
│                                                       │
│   SEP-multi-001 ── (no dependencies)                 │
│        │                                              │
│        └─▶ SEP-multi-002 depends on SEP-001          │
│                  │                                    │
│                  └─▶ SEP-multi-003 (no deps on 002)  │
│                                                       │
│ CASCADE DEPTH: 1 (limit: 3)                          │
│ CASCADE SIZE: 1 (limit: 5)                           │
│                                                       │
│ CASCADE PROJECTION                                    │
│   If SEP-001 revoked: cascade affects SEP-002        │
│   If SEP-002 revoked: no cascade                     │
│   If SEP-003 revoked: no cascade                     │
│                                                       │
│ ZONE IMPACT                                           │
│   Current cascade depth vs threshold:                │
│   SAFE: ≤1 ✓  │  PRESSURE: ≤2  │  RISK: ≤3         │
│                                                       │
│ NAVIGATION                                            │
│   [View Full Dependency Graph]                        │
│   [View Cascade Scenarios]                            │
│   [→ Zone Threshold Impact]                          │
└──────────────────────────────────────────────────────┘
```

---

## 4. Replay-Rollback Combined Stability

### 4.1 Combined Stability View

```
┌──────────────────────────────────────────────────────┐
│ COMBINED REPLAY + ROLLBACK STABILITY                  │
├──────────────────────────────────────────────────────┤
│                                                       │
│ PER-OVERLAY COMBINED STATUS                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Overlay       │ Replay  │ Rollback│ Combined     │ │
│ │───────────────│─────────│─────────│──────────────│ │
│ │ SEP-multi-001 │ ● Stable│ ● Stable│ ● Stable     │ │
│ │ SEP-multi-002 │ ● Stable│ ● Stable│ ● Progressing│ │
│ │ SEP-multi-003 │ ○ N/A   │ ○ N/A   │ ○ Pending    │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ OVERALL STABILITY                                     │
│   Replay stability: ● STABLE                         │
│   Rollback stability: ● STABLE                       │
│   Combined assessment: ● HEALTHY                     │
│                                                       │
│ ZONE CONTRIBUTION                                     │
│   Replay signals → zone stability: +47 points       │
│   Rollback signals → zone stability: +47 points     │
│   (out of 100-point stability index)                 │
│                                                       │
│ NAVIGATION                                            │
│   [→ Replay Detail] [→ Rollback Detail]              │
│   [→ Certification Status] [→ Zone Impact]           │
└──────────────────────────────────────────────────────┘
```

---

## 5. Governance

- Replay stability: determinism invariants, chain pressure, divergence risk
- Rollback stability: cascade complexity, dependency graph, ambiguity risk
- Per-overlay replay and rollback status with zone threshold proximity
- Divergence monitoring: type, severity, root cause, investigation status
- Cascade monitoring: depth, size, projection, zone threshold impact
- Combined replay+rollback stability contributes to zone stability index
- Visibility does not mutate replay, rollback, or certification state
