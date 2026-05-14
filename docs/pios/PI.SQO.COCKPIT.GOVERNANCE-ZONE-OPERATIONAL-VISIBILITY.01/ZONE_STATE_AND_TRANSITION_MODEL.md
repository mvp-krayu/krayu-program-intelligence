# Zone State and Transition Model

**Stream:** PI.SQO.COCKPIT.GOVERNANCE-ZONE-OPERATIONAL-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how the cockpit operationally exposes current zone state,
historical zone state, zone transitions, transition triggers,
and projected zone impact — ensuring zone transitions remain
observable, traceable, and reconstructable.

---

## 2. Zone State Visibility

### 2.1 Current Zone State View

```
┌──────────────────────────────────────────────────────┐
│ CURRENT ZONE STATE                                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│ ZONE: ████████████████████████████████  SAFE          │
│                                                       │
│ ZONE METRICS                                          │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Metric                  │ Value   │ Threshold    │ │
│ │─────────────────────────│─────────│──────────────│ │
│ │ Stability index         │ 94/100  │ —            │ │
│ │ Active overlays         │ 3       │ ≤5 (SAFE)    │ │
│ │ Dependency depth        │ 1       │ ≤1 (SAFE)    │ │
│ │ Coexistence checks      │ 6       │ ≤10 (SAFE)   │ │
│ │ Re-evaluations/lifecycle│ 4       │ ≤10 (SAFE)   │ │
│ │ Observability dims vis. │ 7/7     │ ≥5 (SAFE)    │ │
│ │ Overload status         │ NORMAL  │ NORMAL (SAFE)│ │
│ │ Entropy indicators      │ 0/12    │ 0 (SAFE)     │ │
│ │ Audit trail length      │ 18      │ ≤30 (SAFE)   │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ TIME IN ZONE: 24h 0m                                  │
│ ZONE TRANSITIONS (24h): 0                             │
│                                                       │
│ NAVIGATION                                            │
│   [View Zone History] [View Threshold Detail]        │
│   [View Transition Projections]                       │
└──────────────────────────────────────────────────────┘
```

### 2.2 Historical Zone State View

```
┌──────────────────────────────────────────────────────┐
│ ZONE HISTORY                                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│ ZONE TIMELINE (last 7 days)                           │
│ ────────────────────────────────────────────────────  │
│ SAFE ████████████████████████████████████████████████ │
│ PRES                                                  │
│ RISK                                                  │
│ PROH                                                  │
│ ────────────────────────────────────────────────────  │
│ May 5   May 6   May 7   May 8   May 9   May 10  11  │
│                                                       │
│ ZONE TRANSITION LOG                                   │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Timestamp       │ From  │ To    │ Trigger        │ │
│ │─────────────────│───────│───────│────────────────│ │
│ │ (no transitions in period)                        │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ STABILITY TREND                                       │
│   94 ┤████████████████████████                        │
│   90 ┤                                                │
│   85 ┤                                                │
│   80 ┤                                                │
│      └────────────────────────────                    │
│      May 5              May 11                        │
│   Trend: STABLE  │  Direction: ──                    │
│                                                       │
│ NAVIGATION                                            │
│   [Click timeline for point-in-time detail]           │
│   [View Transition Detail] [Export History]           │
└──────────────────────────────────────────────────────┘
```

---

## 3. Zone Transition Visibility

### 3.1 Transition Trigger Visibility

```
┌──────────────────────────────────────────────────────┐
│ ZONE TRANSITION TRIGGERS                              │
├──────────────────────────────────────────────────────┤
│                                                       │
│ SAFE → PRESSURE TRIGGERS                              │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Trigger                │ Current │ Threshold│ Gap│ │
│ │────────────────────────│─────────│──────────│────│ │
│ │ Active overlays ≥6     │ 3       │ 6        │ 3  │ │
│ │ Dependency depth ≥2    │ 1       │ 2        │ 1  │ │
│ │ Coexistence checks ≥15 │ 6       │ 15       │ 9  │ │
│ │ Re-evals/lifecycle ≥15 │ 4       │ 15       │ 11 │ │
│ │ Obs. dims degraded ≥1  │ 0       │ 1        │ 1  │ │
│ │ Overload: ELEVATED     │ NORMAL  │ ELEVATED │ 1  │ │
│ │ Entropy indicators ≥1  │ 0       │ 1        │ 1  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ NEAREST TRIGGER: Active overlays (gap: 3)            │
│ PROJECTED: 3 more overlay activations → PRESSURE     │
│                                                       │
│ PRESSURE → RISK TRIGGERS                              │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Trigger                │ Current │ Threshold│ Gap│ │
│ │────────────────────────│─────────│──────────│────│ │
│ │ Active overlays ≥8     │ 3       │ 8        │ 5  │ │
│ │ Dependency depth ≥3    │ 1       │ 3        │ 2  │ │
│ │ Obs. dims degraded ≥4  │ 0       │ 4        │ 4  │ │
│ │ Entropy indicators ≥3  │ 0       │ 3        │ 3  │ │
│ │ Cert failure rate ≥30% │ 0%      │ 30%      │ 30%│ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ RISK → PROHIBITED TRIGGERS                            │
│   (all distant — minimum gap: 5+ across all metrics) │
│   [View Full Risk → Prohibited Triggers]             │
│                                                       │
│ NAVIGATION                                            │
│   [View Trigger Detail] [View Projection Model]      │
│   [→ Affected Workflows] [→ Authority Impact]        │
└──────────────────────────────────────────────────────┘
```

### 3.2 Transition Projection Model

```
┌──────────────────────────────────────────────────────┐
│ ZONE TRANSITION PROJECTIONS                           │
├──────────────────────────────────────────────────────┤
│                                                       │
│ SCENARIO PROJECTIONS                                  │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Scenario                     │ Result            │ │
│ │──────────────────────────────│───────────────────│ │
│ │ If SEP-003 activates         │ SAFE (4 overlays) │ │
│ │ If SEP-003 + SEP-004 activate│ SAFE (5 overlays) │ │
│ │ If 3 more overlays activate  │ PRESSURE (6 ovl)  │ │
│ │ If SEP-002 cert fails        │ SAFE (no change)  │ │
│ │ If SEP-002 diverges          │ SAFE (1 div, <3)  │ │
│ │ If cascade depth reaches 3   │ RISK (depth ≥3)   │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ PROJECTION CONFIDENCE: HIGH (stable baseline)        │
│                                                       │
│ NAVIGATION                                            │
│   [View Scenario Detail] [Add Custom Scenario]       │
└──────────────────────────────────────────────────────┘
```

---

## 4. Transition Impact Visibility

### 4.1 Zone Transition Impact Matrix

| Transition | Replay Impact | Rollback Impact | Cert Impact | Auth Impact | Publication Impact |
|-----------|--------------|----------------|------------|------------|-------------------|
| SAFE → PRESSURE | No change | No change | Enhanced review | Promotion requires approval | Publication blocked |
| PRESSURE → RISK | Chain monitoring | Cascade freeze on depth 3+ | New certs restricted | Promotion frozen | Publication blocked |
| RISK → PROHIBITED | All replays frozen | All rollbacks frozen | All certs frozen | All promotions frozen | Publication blocked |
| PRESSURE → SAFE | Normal operations | Normal operations | Normal operations | Normal operations | Publication unblocked |
| RISK → PRESSURE | Replays resume | Rollbacks resume (restricted) | Certs resume (restricted) | Promotion resumes (approval) | Publication still blocked |
| PROHIBITED → RISK | Replays resume (restricted) | Rollbacks resume (restricted) | Certs resume (restricted) | Promotion frozen | Publication blocked |

### 4.2 Transition Impact View

```
┌──────────────────────────────────────────────────────┐
│ TRANSITION IMPACT: SAFE → PRESSURE (projected)       │
├──────────────────────────────────────────────────────┤
│                                                       │
│ WORKFLOW IMPACT                                       │
│   Replay: ● No change (all phases continue)          │
│   Rollback: ● No change (all phases continue)        │
│   Certification: ◐ Enhanced review required           │
│   Promotion: ◐ Requires explicit approval             │
│   Publication: ◉ BLOCKED until return to SAFE        │
│                                                       │
│ OPERATIONAL RESTRICTIONS                              │
│   Batch activation: Single overlay only (no batches) │
│   New sessions: Restricted (approval required)       │
│   Recovery actions: Approval required                │
│                                                       │
│ ESCALATION CHANGE                                     │
│   G-0 → G-1 (enhanced governance)                    │
│   Compound pressure checks enabled                   │
│                                                       │
│ NAVIGATION                                            │
│   [View Full Restriction List]                        │
│   [→ Affected Active Workflows]                      │
│   [→ Authority Impact Detail]                        │
└──────────────────────────────────────────────────────┘
```

---

## 5. Governance

- Current zone state: all entry criteria metrics visible with thresholds
- Historical zone state: timeline with transition log and stability trend
- Transition triggers: per-trigger gap-to-threshold with nearest-trigger highlight
- Transition projections: scenario-based projection with confidence
- Transition impact: 6-dimension impact matrix per transition
- Zone transitions remain observable, traceable, and reconstructable
- All zone state addressable via deep-links
