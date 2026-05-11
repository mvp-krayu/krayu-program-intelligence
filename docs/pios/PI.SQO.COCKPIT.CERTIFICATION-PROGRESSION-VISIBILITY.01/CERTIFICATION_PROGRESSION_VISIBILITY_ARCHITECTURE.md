# Certification Progression Visibility Architecture

**Stream:** PI.SQO.COCKPIT.CERTIFICATION-PROGRESSION-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the canonical operational visibility architecture for
certification progression inside the SQO Cockpit — how
certification trust progression becomes operationally visible,
traceable, navigable, governance-aware, authority-aware, and
publication-aware.

---

## 2. Certification Progression Visibility Architecture

### 2.1 Fifteen Certification Visibility Domains

| # | Domain | Visibility Scope | Update Frequency |
|---|--------|-----------------|-----------------|
| CV-01 | Certification state | Current certification state per overlay | Continuous |
| CV-02 | Certification transition | State transitions, triggers, projections | On state change |
| CV-03 | Replay certification | Replay pipeline progress, hash integrity | On certification event |
| CV-04 | Rollback certification | Rollback pipeline progress, removability | On certification event |
| CV-05 | Authority eligibility | Authority promotion prerequisites, gates | On promotion event |
| CV-06 | Publication eligibility | Publication prerequisites, readiness | On publication event |
| CV-07 | Certification escalation | Escalation triggers, active escalations | On escalation event |
| CV-08 | Certification degradation | Degradation signals, trust erosion | On degradation event + periodic |
| CV-09 | Certification recoverability | Recovery paths, re-certification | On recovery event |
| CV-10 | Qualification trust | S-state progression, qualification metrics | On qualification change |
| CV-11 | Certification lineage | Hash-verified certification chain | On lineage event |
| CV-12 | Certification coexistence | Multi-trajectory coherence | On session event |
| CV-13 | Certification observability | Health indicators, event stream | Continuous |
| CV-14 | Authority boundary | Boundary integrity, anti-leakage | On authority event |
| CV-15 | Certification authority impact | Certification effect on authority and publication | On certification decision |

### 2.2 Four Visibility Layers

```
Layer 1: CERTIFICATION OVERVIEW
  Single-view certification health across all overlays
  ▼
Layer 2: DOMAIN VIEW
  Per-domain drill-down (replay, rollback, authority, publication)
  ▼
Layer 3: SIGNAL VIEW
  Per-signal detail (individual gates, checks, evidence hashes)
  ▼
Layer 4: LINEAGE / RECONSTRUCTION VIEW
  Hash-verified certification chain, evidence trail, reconstruction
```

### 2.3 Signal Aggregation Model

```
Signal aggregation prevents certification-noise while preserving detail:

  RAW SIGNALS (per-gate, per-check, per-evidence hash)
    │  100+ individual certification signals per overlay
    ▼
  DOMAIN AGGREGATION (per-domain health)
    │  15 domain health indicators
    ▼
  DIMENSION AGGREGATION (certification dimensions)
    │  5 dimensions: replay, rollback, authority, publication, trust
    ▼
  CERTIFICATION HEALTH (single indicator)
    │  HEALTHY / DEGRADED / IMPAIRED / CRITICAL
    ▼
  [Cockpit surface: certification health with drill-down to any signal]
```

---

## 3. Master Certification Visibility Dashboard

### 3.1 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ CERTIFICATION PROGRESSION VISIBILITY                  Zone: SAFE    │
│ Client: {client}  │  Run: {run}  │  Session: SBX-{id}             │
├─────────────────────────────────────────────────────────────────────┤
│ CERTIFICATION HEALTH: ● HEALTHY                                     │
│ Trend: STABLE ──  │  Trust Level: HIGH  │  S-State: S2             │
├───────────────────────────────────┬─────────────────────────────────┤
│ REPLAY CERTIFICATION              │ ROLLBACK CERTIFICATION          │
│   Certified: 1/3                  │   Certified: 1/3                │
│   In Progress: 1                  │   In Progress: 1                │
│   Pending: 1                      │   Pending: 1                    │
│   Health: ◐ ATTENTION             │   Health: ◐ ATTENTION           │
├───────────────────────────────────┼─────────────────────────────────┤
│ AUTHORITY PROGRESSION             │ PUBLICATION READINESS           │
│   Promoted: 1/3                   │   Eligible: 0/3                 │
│   Eligible: 0                     │   Blocking: 2 not promoted      │
│   Restricted: 0                   │   Gate: PE-01 ✗                 │
│   Health: ◐ ATTENTION             │   Health: ◐ ATTENTION           │
├───────────────────────────────────┼─────────────────────────────────┤
│ QUALIFICATION TRUST               │ CERTIFICATION INTEGRITY         │
│   S-State: S2 (current)           │   Evidence chain: ● INTACT      │
│   Next: S3 (3 gates unmet)       │   Quarantines: 0 active         │
│   Trust: HIGH                     │   Degradation: 0 signals        │
│   Trend: STABLE                   │   Lineage: ● VERIFIED           │
├─────────────────────────────────────────────────────────────────────┤
│ PER-OVERLAY CERTIFICATION MATRIX                                    │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Overlay       │ Replay │ Rollback│ Combined│ Promoted│ Pub Elig│ │
│ │───────────────│────────│─────────│─────────│─────────│─────────│ │
│ │ SEP-multi-001 │ ✓ CERT │ ✓ CERT  │ ✓ CERT  │ ✓ PROM  │ ○ PEND │ │
│ │ SEP-multi-002 │ ● Ph3  │ ● Ph2   │ ○ PEND  │ ○ ---   │ ○ ---  │ │
│ │ SEP-multi-003 │ ○ ---  │ ○ ---   │ ○ PEND  │ ○ ---   │ ○ ---  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ NAVIGATION                                                          │
│   [Replay Detail] [Rollback Detail] [Authority Detail]             │
│   [Publication Detail] [Lineage] [Degradation] [Escalation]       │
│   [→ Zone Impact] [→ Session Certification] [→ S-State Progress]  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Deep-Link Model

### 4.1 Certification Visibility Deep-Link Structure

```
/cockpit/{client}/{run}/certification/                  → overview
/cockpit/{client}/{run}/certification/state              → CV-01 state
/cockpit/{client}/{run}/certification/transition         → CV-02 transitions
/cockpit/{client}/{run}/certification/replay             → CV-03 replay
/cockpit/{client}/{run}/certification/replay/{overlay}   → per-overlay replay
/cockpit/{client}/{run}/certification/rollback           → CV-04 rollback
/cockpit/{client}/{run}/certification/rollback/{overlay} → per-overlay rollback
/cockpit/{client}/{run}/certification/authority           → CV-05 authority
/cockpit/{client}/{run}/certification/publication        → CV-06 publication
/cockpit/{client}/{run}/certification/escalation         → CV-07 escalation
/cockpit/{client}/{run}/certification/degradation        → CV-08 degradation
/cockpit/{client}/{run}/certification/recovery           → CV-09 recovery
/cockpit/{client}/{run}/certification/qualification      → CV-10 trust
/cockpit/{client}/{run}/certification/lineage            → CV-11 lineage
/cockpit/{client}/{run}/certification/lineage/{overlay}  → per-overlay lineage
/cockpit/{client}/{run}/certification/coexistence        → CV-12 coexistence
/cockpit/{client}/{run}/certification/observability      → CV-13 observability
/cockpit/{client}/{run}/certification/boundary           → CV-14 boundary
/cockpit/{client}/{run}/certification/impact             → CV-15 impact
```

---

## 5. Signal Categories and Update Frequencies

### 5.1 Signal Categories

| Category | Signal Count | Domains | Priority |
|----------|-------------|---------|----------|
| Pipeline progress | 11 phases (6 replay + 5 rollback) | CV-03, CV-04 | INFO |
| Certification decisions | 8 decision types | CV-01, CV-02 | INFO/WARN/ERROR |
| Gate assessments | 14 gates (8 AP + 6 PE) | CV-05, CV-06 | INFO |
| Degradation signals | 12 degradation types | CV-08 | WARN/ERROR/CRITICAL |
| Escalation signals | 8 escalation triggers | CV-07 | WARN/ERROR |
| Lineage signals | 7 lineage verification types | CV-11 | INFO/ERROR |
| Trust signals | 4 S-state transitions | CV-10 | INFO/WARN |
| Authority boundary | 6 anti-leakage checks | CV-14 | INFO/CRITICAL |
| Recovery signals | 5 re-certification types | CV-09 | INFO/WARN |
| Coexistence signals | 5 coexistence rules | CV-12 | INFO/WARN |

### 5.2 Update Frequencies

| Frequency | Domains | Trigger |
|-----------|---------|---------|
| Continuous | CV-01, CV-13 | Every metric evaluation cycle |
| On certification event | CV-03, CV-04, CV-11, CV-15 | Certification phase completion or decision |
| On promotion event | CV-05, CV-14 | Authority promotion attempt or completion |
| On publication event | CV-06, CV-14 | Publication eligibility assessment |
| On escalation event | CV-07 | Escalation trigger evaluation |
| On degradation event + periodic | CV-08 | Degradation signal detection or 5-minute check |
| On recovery event | CV-09 | Re-certification attempt |
| On qualification change | CV-10 | S-state or qualification metric change |
| On session event | CV-12 | Session creation, supersession, termination |
| On state change | CV-02 | Any certification state transition |

---

## 6. Governance

- 15 certification visibility domains (CV-01 through CV-15) with 4 layers and signal aggregation
- Signal aggregation: 100+ raw signals → 15 domain indicators → 5 dimensions → single health
- Master dashboard shows replay, rollback, authority, publication, trust, and integrity
- Per-overlay certification matrix tracks full progression pipeline
- Deep-link model makes every certification domain addressable
- Visibility is read-only — observation does not alter certification state
- Architecture is client-agnostic — same visibility for BlueEdge and future clients
