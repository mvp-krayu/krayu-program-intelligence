# Governance Zone and Escalation Navigation

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how operators navigate governance zone states, zone transitions,
escalation levels, and recoverability options inside the SQO Cockpit —
ensuring unsafe workflow transitions remain externally visible.

---

## 2. Governance Zone Navigation (WN-08)

### 2.1 Zone State Navigation

```
┌──────────────────────────────────────────────────────┐
│ GOVERNANCE ZONE NAVIGATION                            │
│ Client: {client}  │  Run: {run}                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│ CURRENT ZONE                                          │
│ ┌──────────────────────────────────────────────────┐ │
│ │                                                   │ │
│ │  ████████████████████████████████  SAFE            │ │
│ │                                                   │ │
│ │  Stability Index: 94/100                          │ │
│ │  Time in Zone: 24h 0m                             │ │
│ │  Transitions (24h): 0                             │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ ZONE MAP                                              │
│   SAFE       ████████████████████████████████ (curr) │
│   PRESSURE   ░░░░░░░░░░░░  gap: 12 points           │
│   RISK       ░░░░░░░░      gap: 28 points           │
│   PROHIBITED ░░░░          gap: 45 points           │
│                                                       │
│ NAVIGATION                                            │
│   [View Zone History] [View Threshold Detail]        │
│   [View Zone Impact on Workflows]                    │
│   [→ Escalation Status]                              │
└──────────────────────────────────────────────────────┘
```

### 2.2 Zone Transition Navigation

```
┌──────────────────────────────────────────────────────┐
│ ZONE TRANSITION MONITOR                               │
├──────────────────────────────────────────────────────┤
│                                                       │
│ TRANSITION RISK INDICATORS                            │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Metric              │ Current │ Threshold │ Gap  │ │
│ │─────────────────────│─────────│───────────│──────│ │
│ │ Overlay batch size  │ 3/5     │ 5/5       │ 2    │ │
│ │ Quarantine count    │ 0       │ 2         │ 2    │ │
│ │ Cert failure rate   │ 15%     │ 30%       │ 15%  │ │
│ │ Cascade depth       │ 1/3     │ 3/3       │ 2    │ │
│ │ Divergence count    │ 1       │ 3         │ 2    │ │
│ │ Escalation level    │ G-0     │ G-2       │ 2    │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ PROJECTED TRANSITION IMPACT                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ If SEP-003 certifies:   SAFE → SAFE (no change) │ │
│ │ If SEP-003 fails cert:  SAFE → SAFE (no change) │ │
│ │ If 2 more overlays add: SAFE → PRESSURE (batch 5)│ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ NAVIGATION                                            │
│   [View Metric Detail] [View Projection Model]       │
│   [View Zone History Timeline]                        │
│   [→ Affected Workflows]                             │
└──────────────────────────────────────────────────────┘
```

### 2.3 Zone-Workflow Impact Navigation

```
┌──────────────────────────────────────────────────────┐
│ ZONE IMPACT ON WORKFLOWS                              │
│ Current Zone: SAFE                                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│ OPERATIONS PERMITTED IN CURRENT ZONE                  │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Operation                │ SAFE │ If PRESSURE    │ │
│ │──────────────────────────│──────│────────────────│ │
│ │ Overlay activation       │ ✓    │ ✓ (restricted) │ │
│ │ Replay certification     │ ✓    │ ✓              │ │
│ │ Rollback certification   │ ✓    │ ✓              │ │
│ │ Authority promotion      │ ✓    │ ✓ (approval)   │ │
│ │ Publication              │ ✓    │ ✗ (blocked)    │ │
│ │ New session creation     │ ✓    │ ✓ (restricted) │ │
│ │ Session supersession     │ ✓    │ ✓              │ │
│ │ Batch activation         │ ✓    │ ✗ (single only)│ │
│ │ Escalation resolution    │ ✓    │ ✓              │ │
│ │ Recovery actions         │ ✓    │ ✓ (approval)   │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ ZONE TRANSITION IMPACTS                               │
│   SAFE → PRESSURE: publication blocked, batch single │
│   SAFE → RISK: activation frozen, promotion frozen   │
│   ANY → PROHIBITED: all operations frozen            │
│                                                       │
│ NAVIGATION                                            │
│   [View Full Zone-Operation Matrix]                   │
│   [→ Affected Active Workflows]                      │
│   [→ Escalation (if zone change triggers)]           │
└──────────────────────────────────────────────────────┘
```

---

## 3. Escalation Navigation (WN-10)

### 3.1 Escalation Level Navigation

```
┌──────────────────────────────────────────────────────┐
│ ESCALATION STATUS                                     │
│ Current Level: G-0 (no escalation)                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│ ESCALATION LEVELS                                     │
│                                                       │
│   G-0  ████████████████████████████  ◀── current     │
│   G-1  ░░░░░░░░░░░░░░░░░░░░                         │
│   G-2  ░░░░░░░░░░░░░░                               │
│   G-3  ░░░░░░░░                                      │
│   G-4  ░░░░                                          │
│                                                       │
│ G-0: No active escalation                            │
│ G-1: Operator attention (informational)              │
│ G-2: Workflow restriction (partial freeze)           │
│ G-3: Governance intervention (session freeze)        │
│ G-4: Full operational freeze (all operations)        │
│                                                       │
│ ESCALATION HISTORY (last 7 days)                     │
│   (no escalations in period)                          │
│                                                       │
│ NAVIGATION                                            │
│   [View Escalation Triggers] [View Resolution History]│
│   [→ Zone Status] [→ Recovery Options]               │
└──────────────────────────────────────────────────────┘
```

### 3.2 Escalation Trigger Navigation

```
┌──────────────────────────────────────────────────────┐
│ ESCALATION TRIGGERS                                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│ SESSION ESCALATION TRIGGERS (SE-01 through SE-08)     │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Trigger                        │ Status │ Level  │ │
│ │────────────────────────────────│────────│────────│ │
│ │ SE-01 Cert failure (CRITICAL)  │ ○ OFF  │ → G-2  │ │
│ │ SE-02 Divergence (CRITICAL)    │ ○ OFF  │ → G-2  │ │
│ │ SE-03 Ambiguity (unresolvable) │ ○ OFF  │ → G-2  │ │
│ │ SE-04 Cascade limit exceeded   │ ○ OFF  │ → G-3  │ │
│ │ SE-05 Zone → PROHIBITED        │ ○ OFF  │ → G-4  │ │
│ │ SE-06 Namespace contamination  │ ○ OFF  │ → G-3  │ │
│ │ SE-07 Authority leakage detect │ ○ OFF  │ → G-4  │ │
│ │ SE-08 Multiple quarantines     │ ○ OFF  │ → G-2  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ TRIGGER PROXIMITY                                     │
│   Nearest trigger: SE-08 (quarantine count: 0/2)     │
│   Distance: 2 quarantines from activation            │
│                                                       │
│ NAVIGATION                                            │
│   [View Trigger Detail] [View Trigger History]       │
│   [→ Affected Workflows] [→ Recovery Options]        │
└──────────────────────────────────────────────────────┘
```

---

## 4. Recoverability Navigation (WN-10 extension)

### 4.1 Recovery Options Navigation

```
┌──────────────────────────────────────────────────────┐
│ RECOVERY OPTIONS                                      │
│ Session: SBX-{client}-{run}                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│ AVAILABLE RECOVERY LEVELS                             │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Level │ Action                  │ Impact │ Avail │ │
│ │───────│─────────────────────────│────────│───────│ │
│ │ R-01  │ Rollback last overlay   │ LOW    │ ✓ Yes │ │
│ │ R-02  │ Rollback to checkpoint  │ MEDIUM │ ✓ Yes │ │
│ │ R-03  │ Freeze session          │ MEDIUM │ ✓ Yes │ │
│ │ R-04  │ Revert to baseline      │ HIGH   │ ✓ Yes │ │
│ │ R-05  │ Supersede session       │ HIGH   │ ✓ Yes │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ RECOVERY IMPACT ASSESSMENT (for R-01)                 │
│   Overlay affected: SEP-multi-003                    │
│   Certification lost: none (not started)             │
│   Authority impact: none (provisional)               │
│   Zone impact: none (stays SAFE)                     │
│   Session state: ACTIVE → ACTIVE                     │
│                                                       │
│ NAVIGATION                                            │
│   [View Impact for Each Level]                        │
│   [View Recovery History]                             │
│   [→ Session State After Recovery]                   │
│   [→ Escalation (if recovery triggers)]              │
└──────────────────────────────────────────────────────┘
```

---

## 5. Zone-Escalation-Recovery Cross-Navigation

### 5.1 Cross-Navigation Links

| From | To | Trigger |
|------|----|---------|
| Zone transition | Escalation triggers | Threshold breach |
| Escalation level | Workflow restrictions | G-level change |
| Escalation level | Recovery options | G-3+ requires recovery |
| Recovery action | Session state | Recovery execution |
| Recovery action | Zone recalculation | State change impacts zone |
| Zone history | Timeline | Historical zone states |

### 5.2 Governance Alert Navigation

```
GOVERNANCE ALERTS (when active)

  ┌──────────────────────────────────────────────────┐
  │ ◉ ALERT: Zone approaching PRESSURE               │
  │   Metric: Overlay batch size (4/5)               │
  │   Gap: 1 overlay from threshold                  │
  │   [View Zone Detail] [View Affected Workflows]   │
  └──────────────────────────────────────────────────┘

  Alerts link directly to relevant navigation context.
  Alert priority: P1-CRITICAL → P2-WARNING → P3-INFO → P4-DEBUG
```

---

## 6. Governance

- Zone navigation: SAFE/PRESSURE/RISK/PROHIBITED with transition risk indicators
- Zone-workflow impact: per-operation permission matrix navigable per zone
- Escalation navigation: G-0 through G-4 with trigger proximity monitoring
- 8 escalation triggers (SE-01 through SE-08) with status and proximity
- Recovery navigation: 5 levels (R-01 through R-05) with impact assessment
- Cross-navigation: zone ↔ escalation ↔ recovery with full context
- Alert navigation links directly to governance context
- Navigation does not trigger zone transitions, escalations, or recovery
