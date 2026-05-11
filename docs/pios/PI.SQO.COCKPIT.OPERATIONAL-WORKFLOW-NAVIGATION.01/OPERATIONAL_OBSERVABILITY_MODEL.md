# Operational Observability Model

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the observability model for workflow navigation — ensuring
workflow state, lifecycle state, replay state, rollback state,
certification state, escalation state, governance-zone state,
authority-boundary state, and coexistence state all remain
externally visible during workflow traversal.

---

## 2. Navigation Observability Dimensions

### 2.1 Nine Observability Dimensions

| # | Dimension | Observed State | Navigation Surface |
|---|-----------|---------------|-------------------|
| NO-01 | Workflow state | Active/queued/complete/failed per domain | Workflow dashboard, domain views |
| NO-02 | Lifecycle state | Onboarding stage, S-state progression | Lifecycle navigation, S-state view |
| NO-03 | Replay state | Pipeline phase, divergence, reconstruction | Replay pipeline navigation |
| NO-04 | Rollback state | Pipeline phase, dependencies, removability | Rollback pipeline navigation |
| NO-05 | Certification state | Per-overlay combined status, quarantine | Certification matrix, detail views |
| NO-06 | Escalation state | G-level, active triggers, resolution | Escalation navigation |
| NO-07 | Zone state | Current zone, transition risk, constraints | Zone navigation, impact view |
| NO-08 | Authority state | Per-overlay authority progression | Authority boundary view |
| NO-09 | Coexistence state | Concurrent workflows, dependencies, conflicts | Coexistence view, dependency graph |

### 2.2 Observability Dashboard

```
┌──────────────────────────────────────────────────────┐
│ WORKFLOW NAVIGATION OBSERVABILITY                     │
│ Client: {client}  │  Run: {run}  │  Zone: {zone}     │
├──────────────────────────────────────────────────────┤
│ NAVIGATION HEALTH                                     │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │Workfl│ │Lifecl│ │Cert  │ │Zone  │ │Auth  │       │
│ │  ●   │ │  ●   │ │  ◐   │ │  ●   │ │  ●   │       │
│ │4 actv│ │Stg 4 │ │1/3 ok│ │SAFE  │ │1 prom│       │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
├──────────────────────────────────────────────────────┤
│ NAVIGATION ACTIVITY (last 1h)                         │
│   Domain visits: 23                                   │
│   Gate inspections: 8                                 │
│   Lineage traversals: 5                               │
│   Actions initiated: 2                                │
│   Cross-domain handoffs: 4                            │
├──────────────────────────────────────────────────────┤
│ NAVIGATION EVENT STREAM                               │
│ [12:34:01] [Nav] Domain: WN-04 Replay (operator)    │
│ [12:33:45] [Nav] Gate: G-RECONSTRUCTION inspected    │
│ [12:33:30] [Act] Replay phase 3 acknowledged         │
│ [12:33:12] [Nav] Lineage: L3→L5 (backward)          │
│ [12:32:58] [Nav] Cross-domain: WN-03→WN-04          │
│ [12:30:00] [Act] Gate G-IMPACT approved (operator)   │
└──────────────────────────────────────────────────────┘
```

---

## 3. Navigation Event Types

### 3.1 Navigation Events

| # | Event | Category | Description |
|---|-------|----------|-------------|
| NE-01 | DOMAIN_VISITED | Navigation | Operator navigated to workflow domain |
| NE-02 | INSTANCE_SELECTED | Navigation | Operator selected workflow instance |
| NE-03 | PHASE_TRAVERSED | Navigation | Operator navigated between phases |
| NE-04 | GATE_INSPECTED | Navigation | Operator inspected gate detail |
| NE-05 | CROSS_DOMAIN_HANDOFF | Navigation | Operator followed cross-domain link |
| NE-06 | LINEAGE_ENTERED | Navigation | Operator entered lineage navigation |
| NE-07 | LINEAGE_DIRECTION_CHANGED | Navigation | Operator switched lineage direction |
| NE-08 | AUTHORITY_INSPECTED | Navigation | Operator inspected authority boundary |
| NE-09 | ZONE_INSPECTED | Navigation | Operator inspected zone state |
| NE-10 | ESCALATION_INSPECTED | Navigation | Operator inspected escalation state |
| NE-11 | RECOVERY_INSPECTED | Navigation | Operator inspected recovery options |
| NE-12 | SESSION_NAVIGATED | Navigation | Operator navigated session lifecycle |
| NE-13 | ARCHIVE_ACCESSED | Navigation | Operator accessed workflow archive |
| NE-14 | SEARCH_EXECUTED | Navigation | Operator executed lineage search |
| NE-15 | FILTER_APPLIED | Navigation | Operator applied navigation filter |
| NE-16 | CONTEXT_RESTORED | Navigation | Operator used back navigation |
| NE-17 | GATE_APPROVED | Action | Operator approved gate from navigation |
| NE-18 | CERTIFICATION_INITIATED | Action | Operator initiated certification from nav |
| NE-19 | PROMOTION_INITIATED | Action | Operator initiated promotion from nav |
| NE-20 | PUBLICATION_INITIATED | Action | Operator initiated publication from nav |
| NE-21 | RECOVERY_INITIATED | Action | Operator initiated recovery from nav |
| NE-22 | ESCALATION_RESOLVED | Action | Operator resolved escalation from nav |
| NE-23 | SESSION_ARCHIVED | Action | Operator archived session from nav |
| NE-24 | SESSION_SUPERSEDED | Action | Session superseded from nav (dual auth) |
| NE-25 | GOVERNANCE_OVERRIDE | Governance | Governance override from nav |
| NE-26 | ZONE_ALERT_TRIGGERED | Alert | Zone proximity alert during navigation |
| NE-27 | ESCALATION_ALERT_TRIGGERED | Alert | Escalation trigger during navigation |
| NE-28 | AUTHORITY_LEAK_ALERT | Alert | Authority leakage detected during nav |

### 3.2 Event Filtering in Navigation

```
EVENT STREAM FILTERS

  Category: [Navigation] [Action] [Governance] [Alert] [All]
  Domain:   [WN-01] [WN-02] ... [WN-10] [All]
  Actor:    [Operator] [Governance] [Automated] [All]
  Priority: [P1-Critical] [P2-Warning] [P3-Info] [P4-Debug] [All]
  Time:     [1h] [4h] [24h] [7d] [All]

  Active filters shown in event stream header.
```

---

## 4. Navigation Health Indicator

### 4.1 Health Computation

```
Navigation health = function of:

  Workflow health:
    ● HEALTHY    = all workflows progressing, no failures
    ◐ ATTENTION  = 1+ workflow blocked or stalled
    ◉ CRITICAL   = workflow failure or escalation active
    ○ IDLE       = no active workflows

  Certification health:
    ● HEALTHY    = all active certifications progressing
    ◐ ATTENTION  = divergence or ambiguity under investigation
    ◉ CRITICAL   = certification failure or quarantine

  Zone health:
    ● HEALTHY    = SAFE zone, stable
    ◐ ATTENTION  = approaching PRESSURE threshold
    ◉ CRITICAL   = RISK or PROHIBITED zone

  Authority health:
    ● HEALTHY    = no authority leakage, boundaries intact
    ◐ ATTENTION  = promotion pending with zone constraints
    ◉ CRITICAL   = authority leakage detected

  Overall navigation health = worst of individual dimensions
```

### 4.2 Health Trend

```
NAVIGATION HEALTH TREND

  24h history:

  ●●●●●●●●●●●●●●●●●●●●●●●●  HEALTHY (24h)

  Trend: STABLE
  Direction: —
  Confidence: HIGH (24h of stable data)
```

---

## 5. Observability Persistence

### 5.1 Navigation Snapshot Model

```
Navigation snapshots captured at:
  - Every navigation action (NE-01 through NE-16)
  - Every initiated action (NE-17 through NE-24)
  - Every governance event (NE-25)
  - Every alert (NE-26 through NE-28)
  - Periodic health check (every 5 minutes)

Snapshot structure:
  {
    timestamp,
    actor,
    event_type,
    domain,
    instance_id,
    navigation_context: {
      client, run, session, zone, s_state,
      breadcrumb, context_stack_depth
    },
    health: {
      workflow, certification, zone, authority, overall
    }
  }
```

---

## 6. Alert Model

### 6.1 Navigation Alerts

| Priority | Trigger | Navigation Response |
|----------|---------|-------------------|
| P1-CRITICAL | Authority leakage (NE-28) | Red banner, blocks navigation actions |
| P1-CRITICAL | Zone → PROHIBITED (NE-26) | Red banner, freezes all action buttons |
| P2-WARNING | Zone approaching threshold (NE-26) | Yellow indicator, warning on affected actions |
| P2-WARNING | Escalation triggered (NE-27) | Yellow indicator, shows escalation context |
| P3-INFO | Certification complete | Green notification, shows next step |
| P3-INFO | Workflow handoff ready | Blue notification, shows target domain |
| P4-DEBUG | Navigation analytics | Logged only, not displayed |

---

## 7. Governance

- 9 observability dimensions aligned with navigation domains
- 28 event types (16 navigation, 8 action, 1 governance, 3 alert)
- Navigation health computed from workflow, certification, zone, authority
- Health trend tracked over 24h with stability assessment
- Snapshots at every navigation event, action, and periodic check
- 4-priority alert model (P1-CRITICAL through P4-DEBUG)
- Event filtering by category, domain, actor, priority, and time
- Observability is read-only — observation does not alter state
