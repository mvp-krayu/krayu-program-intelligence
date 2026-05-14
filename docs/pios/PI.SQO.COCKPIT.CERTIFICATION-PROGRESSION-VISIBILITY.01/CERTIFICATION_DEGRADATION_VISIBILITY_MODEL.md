# Certification Degradation Visibility Model

**Stream:** PI.SQO.COCKPIT.CERTIFICATION-PROGRESSION-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how certification degradation becomes operationally visible
inside the cockpit — including replay-certification degradation,
rollback-certification degradation, authority-certification
degradation, publication-certification degradation, coexistence-
certification degradation, and qualification-trust degradation.

---

## 2. Certification Degradation Model

### 2.1 Twelve Certification Degradation Signals

| # | Signal | Description | Trigger | Severity |
|---|--------|-------------|---------|----------|
| CD-01 | Replay certification failure | Replay hash divergence or non-determinism | CRJ-01, CRJ-02 | CRITICAL |
| CD-02 | Replay lineage break | Lineage chain incomplete after previously verified | CRJ-03 | HIGH |
| CD-03 | Rollback dependency failure | Hard dependency blocks rollback | CRJ-04 | HIGH |
| CD-04 | Rollback state divergence | Simulated rollback state differs from expected | CRJ-05, CRJ-06 | CRITICAL |
| CD-05 | Cascade safety exceeded | Cascade depth > 3 or size > 5 | CRJ-07 | HIGH |
| CD-06 | Authority promotion failure | Promotion prerequisites not met post-certification | AP gate failure | HIGH |
| CD-07 | Post-promotion divergence | Authority-promoted overlay diverges on re-verification | Post-promotion check | CRITICAL |
| CD-08 | Publication gate regression | Previously met publication prerequisite now fails | PE gate regression | HIGH |
| CD-09 | Quarantine accumulation | Multiple overlays quarantined simultaneously | ≥2 quarantines | HIGH |
| CD-10 | Zone-driven certification freeze | Zone transition freezes certification pipeline | Zone → PROHIBITED | CRITICAL |
| CD-11 | Qualification trust erosion | S-state regression or qualification metric decline | Metric decrease | HIGH |
| CD-12 | Coexistence certification conflict | Cross-session certification state inconsistency | Coexistence violation | HIGH |

### 2.2 Degradation Severity Model

```
Per-signal severity:
  CRITICAL: CD-01, CD-04, CD-07, CD-10
    → Immediate investigation required
    → Certification pipeline frozen for affected overlays
    → Authority operations blocked

  HIGH: CD-02, CD-03, CD-05, CD-06, CD-08, CD-09, CD-11, CD-12
    → Enhanced monitoring activated
    → Certification continues with warnings
    → Authority operations cautioned

Overall degradation level = worst active signal:
  NONE:     0 signals active
  LOW:      1 HIGH signal
  MODERATE: 2+ HIGH signals or 1 CRITICAL + no authority impact
  HIGH:     1+ CRITICAL with authority impact
  CRITICAL: 2+ CRITICAL signals or post-promotion divergence
```

---

## 3. Replay-Certification Degradation Visibility

### 3.1 Replay Degradation Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ REPLAY CERTIFICATION DEGRADATION                                     │
│ Health: ● NONE                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ DEGRADATION SIGNALS                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Signal                    │ Status  │ Last Checked │ Overlays  │ │
│ │───────────────────────────│─────────│──────────────│───────────│ │
│ │ CD-01 Replay hash failure │ ● CLEAR │ 12:34        │ 0 active  │ │
│ │ CD-02 Lineage break       │ ● CLEAR │ 12:34        │ 0 active  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ REPLAY CERTIFICATION HEALTH TREND (7d)                              │
│   ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● HEALTHY               │
│   Trend: STABLE                                                     │
│                                                                      │
│ IF DEGRADATION ACTIVE:                                              │
│   - Divergence detail with field-level delta                        │
│   - Root cause classification (RC-01 through RC-07)                 │
│   - Affected overlay and certification reference                    │
│   - Zone impact (does degradation trigger zone transition)          │
│   - Authority impact (does degradation block promotion)             │
│   - Recovery path (re-certification steps)                          │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Replay Cert History] [View Divergence History]              │
│   [→ Rollback Degradation] [→ Authority Impact]                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Rollback-Certification Degradation Visibility

### 4.1 Rollback Degradation Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ ROLLBACK CERTIFICATION DEGRADATION                                   │
│ Health: ● NONE                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ DEGRADATION SIGNALS                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Signal                    │ Status  │ Last Checked │ Overlays  │ │
│ │───────────────────────────│─────────│──────────────│───────────│ │
│ │ CD-03 Dependency failure  │ ● CLEAR │ 12:34        │ 0 active  │ │
│ │ CD-04 State divergence    │ ● CLEAR │ 12:34        │ 0 active  │ │
│ │ CD-05 Cascade exceeded    │ ● CLEAR │ 12:34        │ 0 active  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ROLLBACK CERTIFICATION HEALTH TREND (7d)                            │
│   ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● HEALTHY               │
│   Trend: STABLE                                                     │
│                                                                      │
│ CASCADE RISK MONITOR                                                 │
│   Max cascade depth across overlays: 1 (limit: 3)                  │
│   Max cascade size across overlays: 0 (limit: 5)                   │
│   Cascade risk: LOW                                                 │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Rollback Cert History] [View Cascade History]               │
│   [→ Replay Degradation] [→ Authority Impact]                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Authority-Certification Degradation Visibility

### 5.1 Authority Degradation Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ AUTHORITY CERTIFICATION DEGRADATION                                  │
│ Health: ● NONE                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ DEGRADATION SIGNALS                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Signal                    │ Status  │ Last Checked │ Impact    │ │
│ │───────────────────────────│─────────│──────────────│───────────│ │
│ │ CD-06 Promotion failure   │ ● CLEAR │ 12:34        │ None      │ │
│ │ CD-07 Post-prom diverge   │ ● CLEAR │ 12:34        │ None      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ AUTHORITY TRUST LEVEL: HIGH                                         │
│   Post-promotion verification: 3 checks, all MATCH                 │
│   Last verification: 2026-05-11 12:00                              │
│   Verification interval: every 4h                                   │
│                                                                      │
│ IF CD-07 ACTIVE (post-promotion divergence):                        │
│   - IMMEDIATE authority quarantine (AUTHORITY_QUARANTINE)           │
│   - 3-day investigation timeout (no extension)                     │
│   - Authority contributions frozen                                  │
│   - Authority metrics recomputed without frozen overlay             │
│   - S-state regression assessed                                     │
│   - Publication eligibility re-assessed                             │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Authority History] [View Promotion Evidence]                │
│   [→ Publication Degradation] [→ Trust Level]                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Publication-Certification Degradation Visibility

### 6.1 Publication Degradation Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ PUBLICATION CERTIFICATION DEGRADATION                                │
│ Health: ◐ ATTENTION (not yet eligible)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ DEGRADATION SIGNALS                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Signal                    │ Status  │ Detail                    │ │
│ │───────────────────────────│─────────│───────────────────────────│ │
│ │ CD-08 Gate regression     │ ● CLEAR │ No previously-met gates   │ │
│ │                           │         │ have regressed            │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ PUBLICATION GATE STATUS TREND                                       │
│   PE-01: NOT_MET (stable) — awaiting additional promotions         │
│   PE-02: NOT_MET (stable) — awaiting qualification improvement     │
│   PE-03: MET (stable since 05-10)                                  │
│   PE-04: MET (stable since session start)                          │
│   PE-05: NOT_MET (stable) — awaiting pipeline cert                 │
│   PE-06: MET (stable since session start)                          │
│                                                                      │
│ REGRESSION WATCH                                                     │
│   If PE-03 regresses (RESTRICTED overlay appears): CD-08 triggers  │
│   If PE-04 regresses (zone degrades): CD-08 + CD-10 trigger       │
│   If PE-06 regresses (investigation opens): CD-08 triggers         │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Gate Trend History] [View Publication Projections]          │
│   [→ Authority Degradation] [→ Zone Impact]                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Coexistence and Qualification Degradation Visibility

### 7.1 Coexistence Degradation

```
COEXISTENCE CERTIFICATION DEGRADATION

  CD-12 Status: ● CLEAR
  Cross-session conflicts: 0
  Session isolation: ✓ VERIFIED

  IF CD-12 ACTIVE:
    - Cross-session certification state inconsistency detail
    - Which sessions have conflicting certification states
    - Resolution: which session's certification takes precedence
    - Impact on authority and publication
```

### 7.2 Qualification Trust Degradation

```
QUALIFICATION TRUST DEGRADATION

  CD-11 Status: ● CLEAR
  S-state: S2 (stable)
  Qualification trend: STABLE (85.1%)
  Trust level: HIGH

  IF CD-11 ACTIVE (qualification declining):
    - Current vs previous qualification metrics
    - S-state regression assessment
    - Contributing factors (which overlays/metrics declining)
    - Impact on publication eligibility
    - Recovery path: what would restore qualification
```

---

## 8. Composite Degradation View

### 8.1 Degradation Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│ CERTIFICATION DEGRADATION SUMMARY                                    │
│ Overall Level: ● NONE                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ DEGRADATION BY DIMENSION                                            │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Dimension              │ Signals │ Active │ Level              │ │
│ │────────────────────────│─────────│────────│────────────────────│ │
│ │ Replay certification   │ CD-01,02│ 0      │ ● NONE             │ │
│ │ Rollback certification │ CD-03-05│ 0      │ ● NONE             │ │
│ │ Authority certification│ CD-06,07│ 0      │ ● NONE             │ │
│ │ Publication certif.    │ CD-08   │ 0      │ ● NONE             │ │
│ │ Quarantine accum.      │ CD-09   │ 0      │ ● NONE             │ │
│ │ Zone-driven freeze     │ CD-10   │ 0      │ ● NONE             │ │
│ │ Qualification trust    │ CD-11   │ 0      │ ● NONE             │ │
│ │ Coexistence            │ CD-12   │ 0      │ ● NONE             │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ DEGRADATION TREND (7d)                                              │
│   ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● NONE                  │
│   Direction: STABLE ──                                              │
│   Confidence: HIGH (7 days of stable data)                          │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Per-Dimension Detail] [View Signal History]                 │
│   [→ Certification Health] [→ Recovery Paths]                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Governance

- 12 certification degradation signals (CD-01 through CD-12) spanning all certification dimensions
- 4 CRITICAL signals: replay hash failure, rollback state divergence, post-promotion divergence, zone-driven freeze
- 8 HIGH signals covering lineage, dependency, cascade, promotion, publication, quarantine, qualification, coexistence
- Per-dimension degradation dashboards with trend and history
- Composite degradation view with 8-dimension summary
- Degradation severity: NONE → LOW → MODERATE → HIGH → CRITICAL
- Post-promotion divergence (CD-07) triggers immediate AUTHORITY_QUARANTINE with 3-day timeout
- Publication gate regression monitoring prevents silent eligibility loss
- Degradation visibility is read-only — observation does not alter certification state
