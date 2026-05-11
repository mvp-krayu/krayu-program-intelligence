# Operational Observability Model

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKSPACE-ARCHITECTURE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the observability model for the SQO Cockpit operational
workspace — ensuring lifecycle state, evidence state, overlay
state, replay state, rollback state, certification state,
publication state, governance-zone state, sandbox state, and
escalation state transitions all remain externally visible.

---

## 2. Ten Observability Domains

### 2.1 Domain-Aligned Observability

| # | Domain | Observed State | Key Metrics |
|---|--------|---------------|-------------|
| OD-01 | Lifecycle | Onboarding stage, gate status | Stage progression, gate pass rate |
| OD-02 | Evidence | Intake pipeline, trust levels | Throughput, trust distribution, quarantine count |
| OD-03 | Overlay | Proposal status, trust states | Proposal rate, activation rate, rejection rate |
| OD-04 | Replay | Certification pipeline, divergence | Certification rate, divergence count |
| OD-05 | Rollback | Certification pipeline, cascade | Certification rate, cascade depth |
| OD-06 | Certification | Combined status, quarantine | Combined rate, quarantine count |
| OD-07 | Publication | Promotion status, eligibility | Promotion rate, publication count |
| OD-08 | Governance | Zone status, escalation | Zone stability, escalation count |
| OD-09 | Sandbox | Namespace status, overlay chains | Active namespaces, overlay count |
| OD-10 | Escalation | Escalation level, triggers | Active escalations, resolution time |

---

## 3. Unified Observability Dashboard

### 3.1 Dashboard Architecture

```
┌──────────────────────────────────────────────────────┐
│ SQO COCKPIT — OPERATIONAL OBSERVABILITY               │
│ Client: BlueEdge  │  Run: 001  │  Zone: SAFE         │
├──────────────────────────────────────────────────────┤
│ SYSTEM HEALTH                                         │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │Life  │ │Evid  │ │Over  │ │Cert  │ │Zone  │       │
│ │  ●   │ │  ●   │ │  ●   │ │  ●   │ │  ●   │       │
│ │Stage4│ │12 src│ │3 act │ │85% ok│ │SAFE  │       │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
├──────────────────────────────────────────────────────┤
│ WORKFLOW ORCHESTRATION                                │
│ Active: 3  │  Queued: 1  │  Complete: 12  │  Failed: 0│
├──────────────────────────────────────────────────────┤
│ S-STATE PROGRESSION                                   │
│ S0 ──▶ S1 ──▶ [S2] ──▶ S3                           │
│        done    curr     next                          │
├──────────────────────────────────────────────────────┤
│ AUTHORITY BOUNDARY                                    │
│ Provisional: 2 overlays  │  Certified: 1 overlay     │
│ Authority: 1 overlay     │  Published: 0              │
├──────────────────────────────────────────────────────┤
│ EVENT STREAM (all domains)                            │
│ [12:34:01] [Cert] REPLAY_CERTIFIED — SEP-multi-003   │
│ [12:33:45] [Roll] ROLLBACK_CERTIFIED — SEP-multi-003 │
│ [12:33:12] [Cert] PROMOTION_ELIGIBLE — SEP-multi-003 │
│ [12:32:58] [Pub]  AUTHORITY_PROMOTED — SEP-multi-002 │
│ [12:30:00] [Over] OVERLAY_ACTIVATED — SEP-multi-003  │
│ [12:25:00] [Evid] PACKAGE_STAGED — SEP-multi-003     │
└──────────────────────────────────────────────────────┘
```

---

## 4. Event Stream Architecture

### 4.1 Unified Event Schema

```json
{
  "cockpit_event": {
    "event_id": "EVT-<client>-<run_id>-<domain>-<seq>",
    "timestamp": "<ISO-8601>",
    "domain": "WD-XX",
    "event_type": "<domain-specific event type>",
    "severity": "INFO | WARN | ERROR | CRITICAL",
    "source": "<artifact or action that produced event>",
    "summary": "<one-line description>",
    "detail_ref": "<link to domain detail>",
    "zone_at_event": "SAFE | PRESSURE | RISK | PROHIBITED"
  }
}
```

### 4.2 Event Aggregation

| Aggregation | Description |
|------------|-------------|
| By domain | Filter events to single domain |
| By severity | Show only WARN+ or ERROR+ events |
| By time | Show events in time window |
| By workflow | Show events for specific workflow instance |
| By overlay | Show events related to specific overlay |
| Cross-domain | Show events across all domains (default) |

### 4.3 Total Event Type Count

| Domain | Event Types | Reference |
|--------|------------|-----------|
| Lifecycle (WD-01) | 8 | Onboarding lifecycle events |
| Evidence (WD-02) | 17 | Evidence observability model |
| Overlay (WD-03) | 24 | Overlay observability model |
| Replay (WD-04) | 6 | Certification observability |
| Rollback (WD-05) | 5 | Certification observability |
| Certification (WD-06) | 26 | Certification observability model |
| Publication (WD-07) | 6 | Publication events |
| Governance (WD-08) | 8 | Zone transition alerts |
| Sandbox (WD-09) | 8 | Sandbox observability |
| Workflow orchestration | 12 | Workflow events |
| **Total** | **120** | Across all domains |

---

## 5. Health Indicator Architecture

### 5.1 Per-Domain Health

```
Each domain computes its own 4-level health:

  HEALTHY:  all metrics nominal
  DEGRADED: one or more metrics approaching threshold
  IMPAIRED: one or more metrics beyond threshold
  CRITICAL: operational capability compromised

Domain health is computed from domain-specific metrics
(defined in upstream observability models).
```

### 5.2 System-Level Health

```
FUNCTION computeSystemHealth():

  domain_health = [computeHealth(WD-01), ..., computeHealth(WD-10)]

  IF any domain == CRITICAL:
    RETURN CRITICAL
  IF count(IMPAIRED) >= 2:
    RETURN CRITICAL
  IF any domain == IMPAIRED:
    RETURN IMPAIRED
  IF count(DEGRADED) >= 3:
    RETURN IMPAIRED
  IF any domain == DEGRADED:
    RETURN DEGRADED
  RETURN HEALTHY
```

### 5.3 Health Trend

```
Health trend computed over rolling 24-hour window:

  IMPROVING: health level better than 12h ago
  STABLE:    health level unchanged for 12h
  DECLINING: health level worse than 12h ago

Trend is displayed alongside current health level.
```

---

## 6. Observability Persistence

### 6.1 Snapshot Structure

```json
{
  "cockpit_observability_snapshot": {
    "snapshot_id": "SNAP-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "system_health": "HEALTHY",
    "system_trend": "STABLE",
    "domain_health": {
      "WD-01": "HEALTHY",
      "WD-02": "HEALTHY",
      "WD-03": "HEALTHY",
      "WD-04": "HEALTHY",
      "WD-05": "HEALTHY",
      "WD-06": "HEALTHY",
      "WD-07": "DEGRADED",
      "WD-08": "HEALTHY",
      "WD-09": "HEALTHY",
      "WD-10": "HEALTHY"
    },
    "s_state": "S2",
    "governance_zone": "SAFE",
    "active_workflows": 3,
    "active_escalations": 0,
    "active_quarantines": 0,
    "authority_boundary": {
      "provisional": 2,
      "certified": 1,
      "authority": 1,
      "published": 0
    }
  }
}
```

### 6.2 Snapshot Frequency

| Trigger | Snapshot |
|---------|---------|
| Workflow completion | Per workflow |
| Gate transition | Per gate |
| Zone transition | Immediate |
| Health level change | Immediate |
| S-state transition | Immediate |
| Authority boundary change | Immediate |
| Periodic | Every 5 minutes during active operations |

---

## 7. Alert Architecture

### 7.1 Alert Priority Model

| Priority | Criteria | Cockpit Behavior |
|----------|----------|-----------------|
| P1 — CRITICAL | Non-determinism, PROHIBITED zone, system CRITICAL | Full-screen alert, all operations paused |
| P2 — ERROR | Divergence, quarantine, certification failure | Domain-level alert, affected operations flagged |
| P3 — WARN | Zone approaching threshold, partial certification | Indicator update, informational |
| P4 — INFO | Workflow completion, gate pass, zone recovery | Event stream entry only |

### 7.2 Alert Lifecycle

```
RAISED → ACKNOWLEDGED → INVESTIGATING → RESOLVED

Cockpit tracks:
  - Unacknowledged alerts (prominent display)
  - Acknowledged alerts (operator is aware)
  - Investigating alerts (active investigation)
  - Resolved alerts (archived, searchable)

Unresolved P1/P2 alerts are always visible
regardless of which domain workspace is active.
```

---

## 8. Governance

- 10 observability domains aligned with workspace domains
- Unified observability dashboard shows system health, workflows, S-state, authority boundary
- Unified event schema with 120 event types across all domains
- Event aggregation by domain, severity, time, workflow, and overlay
- Per-domain 4-level health indicators with system-level aggregation
- Health trend computed over rolling 24-hour window
- Observability snapshots triggered by operational events and periodic timer
- 4-priority alert model with lifecycle tracking
- Unresolved P1/P2 alerts always visible
- Operational state transitions remain externally visible
- Observability model is client-agnostic
