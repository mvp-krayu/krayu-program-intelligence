# Certification State and Transition Model

**Stream:** PI.SQO.COCKPIT.CERTIFICATION-PROGRESSION-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how the cockpit operationally exposes current certification
state, historical certification state, certification state transitions,
projected escalation state, publication-impact state, authority-impact
state, and qualification-trust state — ensuring certification state
never becomes opaque.

---

## 2. Certification State Model

### 2.1 Ten Certification States

| # | State | Code | Description | Authority Gate |
|---|-------|------|-------------|---------------|
| CS-01 | PROVISIONAL | PROV | Sandbox-computed, no certification attempted | None |
| CS-02 | REPLAY_REVIEW | R-REV | Replay certification pipeline in progress | None |
| CS-03 | ROLLBACK_REVIEW | RB-REV | Rollback certification pipeline in progress | None |
| CS-04 | CERTIFICATION_REVIEW | C-REV | Combined certification under assessment | None |
| CS-05 | AUTHORITY_ELIGIBLE | A-ELG | Combined certification passed, promotion eligible | G-COMBINED-CERT |
| CS-06 | PUBLICATION_AUTHORIZED | P-AUTH | Authority promoted, publication prerequisites met | G-OPERATOR-PROMOTE |
| CS-07 | QUARANTINED | QUAR | Certification failure triggered quarantine | None (blocked) |
| CS-08 | ESCALATED | ESCL | Certification issue triggered escalation | None (frozen) |
| CS-09 | REVOKED | RVKD | Authority revoked post-promotion | None (terminal) |
| CS-10 | SUPERSEDED | SUPR | Overlay superseded by newer version | None (terminal) |

### 2.2 Current Certification State View

```
┌─────────────────────────────────────────────────────────────────────┐
│ CERTIFICATION STATE                                                  │
│ Session: SBX-{client}-{run}  │  Zone: SAFE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ PER-OVERLAY CERTIFICATION STATE                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Overlay       │ State        │ Since       │ Duration │ Gate    │ │
│ │───────────────│──────────────│─────────────│──────────│─────────│ │
│ │ SEP-multi-001 │ PUB_AUTH     │ 05-10 09:00 │ 1d 3h    │ ✓ All  │ │
│ │ SEP-multi-002 │ R-REV (Ph3)  │ 05-11 08:00 │ 4h 30m   │ ○ Pend │ │
│ │ SEP-multi-003 │ PROVISIONAL  │ 05-11 10:00 │ 2h 00m   │ ○ ---  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ STATE DISTRIBUTION                                                   │
│   PROVISIONAL: 1  │  IN-REVIEW: 1  │  ELIGIBLE: 0                  │
│   AUTHORIZED: 1   │  QUARANTINED: 0  │  REVOKED: 0                 │
│                                                                      │
│ CERTIFICATION VELOCITY                                               │
│   Avg time to certification: 6.5h                                   │
│   Avg time to promotion: 24h                                        │
│   Current pipeline utilization: 33%                                 │
│                                                                      │
│ NAVIGATION                                                           │
│   [Click overlay for state detail]                                  │
│   [View State History] [View Transition Log]                        │
│   [→ Replay Pipeline] [→ Rollback Pipeline]                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Certification State Transitions

### 3.1 Transition Map

```
CS-01 PROVISIONAL
  │
  ├──[replay initiated]──▶ CS-02 REPLAY_REVIEW
  │
  └──[quarantine from prior cert]──▶ CS-07 QUARANTINED

CS-02 REPLAY_REVIEW
  │
  ├──[replay certified]──▶ CS-03 ROLLBACK_REVIEW
  ├──[replay denied/failed]──▶ CS-07 QUARANTINED
  └──[zone → PROHIBITED]──▶ CS-08 ESCALATED

CS-03 ROLLBACK_REVIEW
  │
  ├──[rollback certified]──▶ CS-04 CERTIFICATION_REVIEW
  ├──[rollback denied]──▶ CS-07 QUARANTINED
  └──[zone → PROHIBITED]──▶ CS-08 ESCALATED

CS-04 CERTIFICATION_REVIEW
  │
  ├──[combined certified: ELIGIBLE]──▶ CS-05 AUTHORITY_ELIGIBLE
  ├──[combined blocked]──▶ CS-07 QUARANTINED
  └──[zone → PROHIBITED]──▶ CS-08 ESCALATED

CS-05 AUTHORITY_ELIGIBLE
  │
  ├──[operator promotes]──▶ CS-06 PUBLICATION_AUTHORIZED
  ├──[zone blocks promotion]──▶ CS-08 ESCALATED
  └──[divergence detected post-cert]──▶ CS-07 QUARANTINED

CS-06 PUBLICATION_AUTHORIZED
  │
  ├──[post-promotion divergence]──▶ CS-09 REVOKED
  ├──[overlay superseded]──▶ CS-10 SUPERSEDED
  └──[authority quarantine]──▶ CS-07 QUARANTINED

CS-07 QUARANTINED
  │
  ├──[quarantine resolved]──▶ CS-01 PROVISIONAL (re-certification)
  ├──[quarantine confirmed]──▶ CS-09 REVOKED
  └──[quarantine expired]──▶ CS-08 ESCALATED

CS-08 ESCALATED
  │
  ├──[zone recovers]──▶ (prior state before escalation)
  └──[escalation unresolved]──▶ CS-09 REVOKED

CS-09 REVOKED → terminal
CS-10 SUPERSEDED → terminal
```

### 3.2 Transition Visibility

```
┌─────────────────────────────────────────────────────────────────────┐
│ CERTIFICATION TRANSITIONS                                            │
│ Overlay: SEP-multi-002                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ CURRENT STATE: REPLAY_REVIEW (Phase 3 of 6)                        │
│ TIME IN STATE: 4h 30m                                               │
│                                                                      │
│ POSSIBLE TRANSITIONS FROM CURRENT STATE                              │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Transition               │ Trigger        │ Likelihood │ Impact │ │
│ │──────────────────────────│────────────────│────────────│────────│ │
│ │ → ROLLBACK_REVIEW        │ Replay passes  │ EXPECTED   │ LOW    │ │
│ │ → QUARANTINED            │ Replay fails   │ LOW RISK   │ HIGH   │ │
│ │ → ESCALATED              │ Zone degrades  │ MINIMAL    │ HIGH   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ TRANSITION IMPACT ASSESSMENT                                        │
│   If → ROLLBACK_REVIEW:                                             │
│     Authority: no change  │  Publication: no change                 │
│     Trust: unchanged      │  Zone: no impact                        │
│   If → QUARANTINED:                                                 │
│     Authority: blocked    │  Publication: blocked                   │
│     Trust: degraded       │  Zone: quarantine contributes to pressure│
│   If → ESCALATED:                                                   │
│     Authority: frozen     │  Publication: frozen                    │
│     Trust: frozen         │  Zone: PROHIBITED                       │
│                                                                      │
│ TRANSITION HISTORY                                                   │
│   05-11 08:00  PROVISIONAL → REPLAY_REVIEW  [replay initiated]     │
│   05-11 10:30  REPLAY_REVIEW Phase 1 complete                      │
│   05-11 11:00  REPLAY_REVIEW Phase 2 complete                      │
│   05-11 11:30  REPLAY_REVIEW Phase 3 started                       │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Full Transition Map] [View Transition Impact Matrix]        │
│   [→ Replay Pipeline Detail] [→ Zone Projection]                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Historical Certification State

### 4.1 Certification Timeline

```
CERTIFICATION TIMELINE: All Overlays

  05-08    05-09    05-10    05-11    05-12
  ────┬────────┬────────┬────────┬────────▶
      │        │        │        │
SEP-001 ●─────────●──────●───────────────── PUB_AUTH
      PROV    R-REV   A-ELG   P-AUTH
              RB-REV
              C-REV

SEP-002 ─────────────────●───────●──────── R-REV (Ph3)
                         PROV   R-REV

SEP-003 ────────────────────────●──────── PROVISIONAL
                                PROV

  Legend: ● = state change
```

### 4.2 Historical State Query

```
For any point in time, certification visibility can reconstruct:
  - Which overlays existed
  - What state each overlay was in
  - Which gates were passed/failed
  - What the certification health was
  - What zone was active
  - What S-state was active
  - What trust level was in effect
```

---

## 5. Projected Certification State

### 5.1 Certification Projection Model

```
CERTIFICATION PROJECTIONS

  If SEP-002 replay succeeds (Phase 3-6):
    Expected: ROLLBACK_REVIEW in ~2h
    Then: CERTIFICATION_REVIEW in ~4h
    Then: AUTHORITY_ELIGIBLE in ~4.5h
    Impact: Certification rate → 67% (2/3)
    Authority impact: 2nd overlay eligible for promotion
    Trust impact: S2 progress toward S3

  If SEP-002 replay fails:
    Expected: QUARANTINED immediately
    Impact: Certification rate stays 33%
    Authority impact: no additional promotion
    Trust impact: S2→S3 blocked until re-certification
    Zone impact: +1 quarantine (still within SAFE threshold)

  If SEP-003 certification begins:
    Expected: REPLAY_REVIEW in ~1h
    Impact: Pipeline utilization → 67%
    Parallel certifications: 2 (within SAFE limit of 10)
```

---

## 6. Transition Impact Matrix

### 6.1 Six-Dimension Transition Impact

| From → To | Replay Impact | Rollback Impact | Authority Impact | Publication Impact | Trust Impact | Zone Impact |
|-----------|--------------|----------------|-----------------|-------------------|-------------|-------------|
| PROV → R-REV | Pipeline started | None | None | None | None | None |
| R-REV → RB-REV | Replay certified | Pipeline started | None | None | None | None |
| RB-REV → C-REV | None | Rollback certified | Assessment begins | None | None | None |
| C-REV → A-ELG | None | None | Eligible | None | Improved | None |
| A-ELG → P-AUTH | None | None | Promoted | Assessment begins | Improved | None |
| Any → QUAR | Frozen | Frozen | Blocked | Blocked | Degraded | +1 quarantine |
| Any → ESCL | Frozen | Frozen | Frozen | Frozen | Frozen | Zone-triggered |
| P-AUTH → RVKD | Re-verify needed | Re-verify needed | Revoked | Revoked | Degraded | May trigger |
| Any → SUPR | N/A | N/A | Inherited | Inherited | Inherited | None |

---

## 7. Governance

- 10 certification states cover full overlay certification lifecycle
- Transition map with triggers, impact assessment, and likelihood for every possible transition
- Current state, time-in-state, and velocity metrics visible per overlay
- Historical state reconstructable for any point in time
- Projected state shows expected certification outcomes with impact assessment
- 6-dimension transition impact matrix: replay, rollback, authority, publication, trust, zone
- State transitions remain observable and traceable — no opaque certification progression
