# Session Observability Model

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the observability model for sandbox sessions — ensuring
session state, overlay-chain state, replay state, rollback state,
certification state, escalation state, governance-zone state,
authority-boundary state, and coexistence state transitions all
remain externally visible.

---

## 2. Nine Session Observability Dimensions

| # | Dimension | What Is Observed | Frequency |
|---|-----------|-----------------|-----------|
| OD-01 | Session lifecycle | State transitions (INITIALIZED → ARCHIVED) | Per transition |
| OD-02 | Overlay chain | Activations, conflicts, rollbacks, revocations | Per chain change |
| OD-03 | Replay state | Certification progress, input integrity, divergence | Per certification |
| OD-04 | Rollback state | Dependency inventory, removability, cascade | Per certification |
| OD-05 | Certification state | Combined status, promotion eligibility | Per certification |
| OD-06 | Escalation state | Level, triggers, response | Per escalation event |
| OD-07 | Zone state | Current zone, transitions, constraints | Continuous |
| OD-08 | Authority boundary | Provisional/certified/promoted counts | Per boundary change |
| OD-09 | Coexistence state | Active sessions, isolation status | Per session event |

---

## 3. Session Event Types

### 3.1 Thirty-Two Session Event Types

| # | Event | Trigger | Severity |
|---|-------|---------|----------|
| SE-01 | SESSION_CREATED | Session initialized | INFO |
| SE-02 | SESSION_ACTIVATED | Session enters ACTIVE | INFO |
| SE-03 | SESSION_FROZEN | Session frozen by zone/escalation | WARN |
| SE-04 | SESSION_RESUMED | Session unfrozen | INFO |
| SE-05 | SESSION_QUARANTINED | Critical failure detected | ERROR |
| SE-06 | SESSION_ESCALATED | G-3+ escalation | ERROR |
| SE-07 | SESSION_ARCHIVED | Session archived | INFO |
| SE-08 | SESSION_SUPERSEDED | Session replaced by successor | INFO |
| SE-09 | SESSION_REVOKED | Session permanently invalidated | ERROR |
| SE-10 | OVERLAY_ACTIVATED | Overlay applied to chain | INFO |
| SE-11 | OVERLAY_CONFLICT_RESOLVED | Conflict resolved during activation | INFO |
| SE-12 | OVERLAY_ROLLED_BACK | Overlay removed from chain | WARN |
| SE-13 | OVERLAY_REVOKED | Overlay permanently removed | ERROR |
| SE-14 | OVERLAY_SUPERSEDED | Overlay replaced by successor | INFO |
| SE-15 | REPLAY_CERT_STARTED | Replay certification initiated | INFO |
| SE-16 | REPLAY_CERT_COMPLETE | Replay certification decided | INFO |
| SE-17 | REPLAY_DIVERGENCE | Replay divergence detected | ERROR |
| SE-18 | ROLLBACK_CERT_STARTED | Rollback certification initiated | INFO |
| SE-19 | ROLLBACK_CERT_COMPLETE | Rollback certification decided | INFO |
| SE-20 | ROLLBACK_AMBIGUITY | Rollback ambiguity detected | WARN |
| SE-21 | COMBINED_CERT_READY | Combined certification available | INFO |
| SE-22 | PROMOTION_AUTHORIZED | Authority promotion executed | INFO |
| SE-23 | PROMOTION_REVOKED | Authority promotion revoked | ERROR |
| SE-24 | QUALIFICATION_CHANGED | Metrics changed by operation | INFO |
| SE-25 | S_STATE_TRANSITIONED | S-state level changed | INFO |
| SE-26 | ZONE_TRANSITION | Governance zone changed | WARN |
| SE-27 | ESCALATION_TRIGGERED | Escalation condition met | WARN/ERROR |
| SE-28 | ESCALATION_RESOLVED | Escalation condition cleared | INFO |
| SE-29 | RECOVERY_EXECUTED | Recovery operation completed | WARN |
| SE-30 | NAMESPACE_VERIFICATION | Namespace integrity verified | INFO |
| SE-31 | CONTAMINATION_DETECTED | Cross-session contamination | CRITICAL |
| SE-32 | AUTHORITY_BOUNDARY_VERIFIED | Anti-leakage check passed | INFO |

---

## 4. Session Health Indicator

### 4.1 Four-Level Session Health

| Level | Criteria | Action |
|-------|----------|--------|
| HEALTHY | Session ACTIVE, no escalations, zone SAFE/PRESSURE, no divergence | Normal operations |
| DEGRADED | Zone in PRESSURE, OR certification failure in last 24h, OR 1 warning | Enhanced monitoring |
| IMPAIRED | Zone in RISK, OR active quarantine, OR escalation ≥ G-2 | Investigation required |
| CRITICAL | Zone in PROHIBITED, OR non-determinism, OR contamination, OR G-4 | Session frozen, investigation |

### 4.2 Health Computation

```
FUNCTION computeSessionHealth(session):

  IF session.zone == PROHIBITED OR
     session.contamination == "CONTAMINATED" OR
     session.escalation_level >= G-4:
    RETURN CRITICAL

  IF session.zone == RISK OR
     session.status == QUARANTINED OR
     session.escalation_level >= G-2:
    RETURN IMPAIRED

  IF session.zone == PRESSURE OR
     session.recent_cert_failures > 0 OR
     session.recent_warnings > 0:
    RETURN DEGRADED

  RETURN HEALTHY
```

---

## 5. Session Dashboard

### 5.1 Session Observability Dashboard

```
┌──────────────────────────────────────────────────────┐
│ SESSION OBSERVABILITY: SBX-BlueEdge-001    Health: ●  │
├──────────────────────────────────────────────────────┤
│ LIFECYCLE    │ ZONE      │ ESCALATION │ COEXISTENCE  │
│ ACTIVE       │ SAFE      │ G-0        │ 1 active     │
│ Since 10:00  │ Stable    │ None       │ 2 archived   │
├──────────────────────────────────────────────────────┤
│ OVERLAY CHAIN                                         │
│ Activated: 3  │ Certified: 1  │ Promoted: 1          │
│ Conflicts: 3  │ Rollbacks: 0  │ Revocations: 0       │
├──────────────────────────────────────────────────────┤
│ AUTHORITY BOUNDARY                                    │
│ Authority: 50/67  │  Provisional: 7/67  │  Gap: 10/67│
├──────────────────────────────────────────────────────┤
│ RECENT EVENTS                                         │
│ [12:34] REPLAY_CERT_COMPLETE — SEP-003 (CERTIFIED)   │
│ [12:33] QUALIFICATION_CHANGED — grounding 79%→85%    │
│ [12:30] OVERLAY_ACTIVATED — SEP-003                  │
│ [12:25] S_STATE_TRANSITIONED — S1→S2                 │
└──────────────────────────────────────────────────────┘
```

---

## 6. Session Observability Persistence

### 6.1 Session Snapshot

```json
{
  "session_observability_snapshot": {
    "snapshot_id": "SSNAP-<session_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "session_id": "SBX-<client>-<run_id>",
    "health": "HEALTHY",
    "lifecycle_state": "ACTIVE",
    "zone": "SAFE",
    "escalation": "G-0",
    "overlay_chain_length": 3,
    "certification_summary": { "certified": 1, "pending": 2 },
    "authority_summary": { "promoted": 1, "provisional": 2 },
    "coexistence": { "active": 1, "archived": 2, "contamination": "CLEAN" },
    "recent_events_count": 12,
    "s_state": "S2"
  }
}
```

### 6.2 Snapshot Triggers

| Trigger | Snapshot |
|---------|---------|
| Session state transition | Immediate |
| Overlay chain change | Immediate |
| Certification event | Immediate |
| Authority boundary change | Immediate |
| Zone transition | Immediate |
| Escalation event | Immediate |
| Periodic (during ACTIVE) | Every 5 minutes |

---

## 7. Governance

- 9 observability dimensions cover full session operational state
- 32 event types capture every session state transition
- 4-level health indicator (HEALTHY, DEGRADED, IMPAIRED, CRITICAL)
- Health computed from zone, contamination, escalation, quarantine, and cert failures
- Session dashboard shows lifecycle, zone, escalation, coexistence, overlay chain, and authority
- Observability snapshots triggered by operational events and periodic timer
- Sandbox operational transitions remain externally visible
- Session observability is client-agnostic
