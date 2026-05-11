# Lifecycle and Sandbox Navigation Model

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how operators navigate lifecycle-state transitions and
sandbox-state transitions inside the SQO Cockpit — including
onboarding progression, S-state advancement, session lifecycle,
and namespace state.

---

## 2. Lifecycle Navigation Architecture

### 2.1 Onboarding Lifecycle Navigation

```
ONBOARDING LIFECYCLE NAVIGATION (WN-01)

  Stage 0        Stage 1–3      Stage 4–6      Stage 7–9
  Registration   Evidence       Overlay        Sandbox
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ ✓ Done   │─▶│ ✓ Done   │─▶│ ● Active │─▶│ ○ Future │
  │ S0→S0    │  │ S0→S0    │  │ S0→S1    │  │ S1→S2    │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘
       │              │             │              │
  Stage 10–11   Stage 12      Stage 13      Stage 14
  Certification  Promotion     Publication    Authority
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ ○ Future │─▶│ ○ Future │─▶│ ○ Future │─▶│ ○ Future │
  │ S2→S2    │  │ S2→S3    │  │ S3→S3    │  │ S3       │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘

  ✓ = completed  ● = active  ○ = future  ◉ = blocked
```

### 2.2 Stage Detail Navigation

```
┌──────────────────────────────────────────────────────┐
│ STAGE 4: Overlay Proposal and Approval                │
│ Status: ACTIVE  │  S-State: S0→S1  │  Zone: SAFE     │
├──────────────────────────────────────────────────────┤
│                                                       │
│ STAGE GATES                                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ G-SELECT-OVERLAY   │ ✓ PASSED  │ Auto (GT-01)   │ │
│ │ G-CLASSIFY         │ ✓ PASSED  │ Auto (GT-01)   │ │
│ │ G-IMPACT           │ ● PENDING │ Approval (GT-02)│ │
│ │ G-REPLAY           │ ○ WAITING │ Cert (GT-03)   │ │
│ │ G-ROLLBACK         │ ○ WAITING │ Cert (GT-03)   │ │
│ │ G-ZONE-SUBMIT      │ ○ WAITING │ Zone (GT-05)   │ │
│ │ G-SUBMIT           │ ○ WAITING │ Approval (GT-02)│ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ STAGE INPUTS                                          │
│   Evidence packages: SEP-multi-001, SEP-multi-002    │
│   Trust level: CERTIFIED (2/2 packages)              │
│                                                       │
│ STAGE OUTPUTS                                         │
│   Overlay proposal: OVL-BE-001-003 (pending)         │
│   Impact assessment: In progress                      │
│                                                       │
│ GOVERNANCE                                            │
│   Zone: SAFE │ Escalation: G-0 │ Fail-closed: 0     │
│                                                       │
│ NAVIGATION                                            │
│   [← Stage 3] [Stage 5 →]                            │
│   [View Gate Detail] [View Lineage] [View Events]    │
│   [→ Evidence Domain] [→ Overlay Domain]             │
└──────────────────────────────────────────────────────┘
```

---

## 3. S-State Progression Navigation

### 3.1 S-State Progression View

```
┌──────────────────────────────────────────────────────┐
│ S-STATE PROGRESSION                                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│   S0              S1              S2              S3  │
│   ████████████    ████████        ░░░░░░░░        ░░ │
│   Baseline        Overlay-Active  Certified       Auth│
│   ✓ Achieved      ● Current       ○ Next          ○  │
│                                                       │
│ TRANSITION REQUIREMENTS                               │
│ ┌──────────────────────────────────────────────────┐ │
│ │ S0 → S1: Baseline loaded + first overlay active  │ │
│ │   Status: ✓ MET                                   │ │
│ │                                                    │ │
│ │ S1 → S2: All active overlays replay+rollback cert │ │
│ │   Status: ○ 1/3 overlays certified                │ │
│ │   Blocking: SEP-002 (replay phase 3), SEP-003    │ │
│ │                                                    │ │
│ │ S2 → S3: All certified overlays authority-promoted│ │
│ │   Status: ○ Prerequisites not met                 │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ [View Blocking Overlays] [View Certification Status] │
│ [View Authority Boundary] [View Timeline]            │
└──────────────────────────────────────────────────────┘
```

### 3.2 S-State Transition Gate Navigation

| Transition | Gate | Prerequisites | Navigation Link |
|-----------|------|---------------|-----------------|
| S0 → S1 | G-S1-TRANSITION | Baseline loaded, first overlay ACTIVATED | → WN-03 Overlay Domain |
| S1 → S2 | G-S2-TRANSITION | All active overlays REPLAY_CERTIFIED + ROLLBACK_CERTIFIED | → WN-06 Certification Domain |
| S2 → S3 | G-S3-TRANSITION | All certified overlays AUTHORITY_PROMOTED | → WN-07 Publication Domain |

---

## 4. Sandbox State Navigation

### 4.1 Session Lifecycle Navigation

```
SESSION LIFECYCLE NAVIGATION (WN-09)

  INITIALIZED ─▶ ACTIVE ─┬─▶ REPLAY_VALIDATING ─┐
     SS-01        SS-02   │                        │
                          ├─▶ ROLLBACK_VALIDATING ─┤
                          │                        │
                          │   ┌────────────────────┘
                          │   ▼
                          ├── CERTIFICATION_REVIEW ──┬─▶ ACTIVE (pass)
                          │      SS-05               │
                          │                          ├─▶ QUARANTINED
                          │                          │      SS-06
                          │                          │       │
                          │                          │  ┌────┘
                          │                          │  ▼
                          │                          └─ ESCALATED
                          │                                SS-07
                          │
                          ├─▶ ARCHIVED (SS-09)
                          └─▶ SUPERSEDED (SS-10)

Terminal states: REVOKED (SS-08), ARCHIVED, SUPERSEDED
```

### 4.2 Session List Navigation

```
┌──────────────────────────────────────────────────────┐
│ SANDBOX SESSIONS: {client} / {run}                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│ ● SBX-{client}-{run} (ACTIVE)                       │
│   State: SS-02  │  Created: 2026-05-10               │
│   Overlays: 3   │  Certified: 1  │  Promoted: 1     │
│   Zone: SAFE    │  Health: ●                          │
│   [Open Session] [View Lifecycle] [View Chain]       │
│                                                       │
│ ○ SBX-{client}-{run}-v0 (SUPERSEDED)                │
│   Final State: SS-10  │  Superseded: 2026-05-10      │
│   Reason: re-baseline │  Inherited: SEP-001          │
│   [View Archive] [Compare with Current]              │
│                                                       │
├──────────────────────────────────────────────────────┤
│ SESSION LIFECYCLE SUMMARY                             │
│   Active: 1  │  Terminal: 1  │  Total: 2             │
│   Namespace: SBX-{client}-{run}                      │
│   Isolation: ● VERIFIED (7/7 rules pass)             │
└──────────────────────────────────────────────────────┘
```

### 4.3 Session State Detail Navigation

```
┌──────────────────────────────────────────────────────┐
│ SESSION: SBX-{client}-{run}  │  ACTIVE  │  Health: ● │
├──────────────────────────────────────────────────────┤
│ [Overview] [Chain] [Cert] [Auth] [Lineage] [Zone]   │
│ [Recovery] [Events]                                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│ LIFECYCLE STATE                                       │
│   Current: ACTIVE (SS-02)                            │
│   Previous: INITIALIZED → ACTIVE (2026-05-10 12:00) │
│   Duration in state: 24h 34m                          │
│                                                       │
│ POSSIBLE TRANSITIONS FROM ACTIVE                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ → REPLAY_VALIDATING │ Trigger: replay initiated  │ │
│ │ → ROLLBACK_VALIDATING│ Trigger: rollback initiated│ │
│ │ → ARCHIVED          │ Trigger: operator archive  │ │
│ │ → SUPERSEDED        │ Trigger: new session       │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ NAMESPACE ISOLATION                                   │
│   Namespace: SBX-{client}-{run}                      │
│   Isolation check: ● 7/7 rules PASS                  │
│   Contamination: NONE DETECTED                        │
│   [View Isolation Detail] [View Namespace Bindings]  │
│                                                       │
│ NAVIGATION                                            │
│   [→ Onboarding Stage] [→ Overlay Chain]             │
│   [→ Certification Status] [→ Authority Boundary]    │
│   [→ Governance Zone] [→ Event Stream]               │
└──────────────────────────────────────────────────────┘
```

---

## 5. Lifecycle-Sandbox Cross-Navigation

### 5.1 Cross-Navigation Links

| From | To | Context Preserved |
|------|----|-------------------|
| Onboarding stage | Session lifecycle | Stage number, S-state, active overlays |
| S-state progression | Session certification | S-state requirements, blocking overlays |
| Session lifecycle | Overlay chain | Session ID, namespace, overlay list |
| Session lifecycle | Certification status | Session ID, per-overlay certification |
| Session state change | Event stream | Transition event, timestamp, trigger |
| Session quarantine | Escalation | Quarantine reason, governance impact |
| Session supersession | Session comparison | Predecessor/successor, inherited state |

### 5.2 Lifecycle Timeline Navigation

```
LIFECYCLE TIMELINE

  2026-05-05    2026-05-08    2026-05-10    2026-05-11
  ─────────────────────────────────────────────────────
  │             │             │             │
  │ SBX-pilot   │ SBX-v0      │ SBX-current │
  │ created     │ created     │ created     │
  │  │          │  │          │  │          │
  │  └─ARCHIVED │  └─SUPERSED.│  └─ACTIVE   │
  │             │             │             │
  │ Stage 0–2   │ Stage 3     │ Stage 4     │ ← now
  │ S0          │ S0→S1       │ S1          │
  ─────────────────────────────────────────────────────

  [Click any point to navigate to that state]
```

---

## 6. Governance

- Onboarding lifecycle navigation: 15 stages with gate detail per stage
- S-state progression: 4 states (S0–S3) with transition requirements
- Session lifecycle: 10 states with transition paths and triggers
- Session list navigation with isolation verification
- Cross-navigation: lifecycle ↔ session with full context preservation
- Timeline navigation across session history
- All lifecycle and sandbox states addressable via deep-links
