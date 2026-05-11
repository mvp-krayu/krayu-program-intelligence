# Activation Auditability Model

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines the auditability model for Dynamic CEU activation.
Every activation, re-evaluation, conflict, revocation, and state change
must be explainable, reconstructable, attributable, evidence-linked,
activation-versioned, and governance-traceable. No hidden semantic
activation behavior.

---

## 2. Auditability Properties

| Property | Definition |
|----------|-----------|
| Explainable | Any qualification state change can be traced to specific trigger events and overlay entries |
| Reconstructable | Any historical qualification state can be exactly reproduced from its 5 replay inputs |
| Attributable | Every overlay contribution is tagged with its source package and entry |
| Evidence-linked | Every claim links to source material via provenance chain |
| Activation-versioned | Every activation decision is versioned and timestamped |
| Governance-traceable | Every authorization can be traced to a specific governance source |

---

## 3. Audit Trail Architecture

### 3.1 Audit Event Types

| Event Type | When Produced | Key Fields |
|-----------|--------------|------------|
| PACKAGE_REGISTERED | Phase 0: SEP created and persisted | package_id, version, source_type, entry_count |
| VALIDATION_COMPLETED | Phase 1: validation checks run | package_id, result (PASSED/FAILED), check_details |
| AUTHORIZATION_EVALUATED | Phase 2: class authorization checked | package_id, result, class_list |
| ELIGIBILITY_RESOLVED | Phase 3: eligibility checks run | package_id, result, conflicts_detected, limits_checked |
| ACTIVATION_AUTHORIZED | Phase 4: governance authorization issued | package_id, authorization_source, scope |
| ACTIVATION_COMPLETED | Phase 4→5: package transitions to ACTIVATED | package_id, version, timestamp |
| REEVALUATION_TRIGGERED | Phase 5: qualification re-evaluation started | trigger_type, trigger_package, prior_state |
| REEVALUATION_COMPLETED | Phase 5→6: re-evaluation produces result | composite_state, changes, attribution |
| CONFLICT_DETECTED | During composite construction | conflict_id, entries, resolution_type |
| CONFLICT_RESOLVED | Governance review resolves conflict | conflict_id, resolution, authority |
| REVOCATION_INITIATED | Revocation process begins | package_id, reason, authority |
| REVOCATION_COMPLETED | Package transitions to REVOKED | package_id, state_impact, dependencies |
| VERSION_UPGRADED | New version supersedes prior | package_id, old_version, new_version |
| ROLLBACK_EXECUTED | Version rollback performed | package_id, from_version, to_version |
| EMERGENCY_ACTION | Emergency activation or revocation | package_id, action, emergency_justification |

### 3.2 Audit Event Schema

```json
{
  "event_id": "<uuid>",
  "event_type": "<event type from table above>",
  "timestamp": "<ISO-8601>",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "package_id": "<package, if applicable>",
  "package_version": "<version, if applicable>",
  "actor": "<who/what initiated the event>",
  "details": {
    // event-type-specific details
  },
  "governance": {
    "substrate_mutation": false,
    "authorization_source": "<source, if applicable>",
    "replay_safe": true
  }
}
```

### 3.3 Audit Trail Persistence

```
artifacts/sqo/<client>/<run_id>/audit/
├── events/
│   ├── <event_id>.json
│   └── ...
├── audit_index.json
└── audit_integrity.json
```

**audit_index.json:** Ordered list of all events by timestamp.
**audit_integrity.json:** Hash chain linking events in sequence.

---

## 4. Audit Queries

The audit trail must support the following queries:

### 4.1 Package History

"Show the complete history of package SEP-001."

```
SELECT events WHERE package_id = "SEP-001"
ORDER BY timestamp

→ REGISTERED → VALIDATION_COMPLETED → AUTHORIZATION_EVALUATED →
  ELIGIBILITY_RESOLVED → ACTIVATION_AUTHORIZED → ACTIVATION_COMPLETED →
  REEVALUATION_TRIGGERED → REEVALUATION_COMPLETED
```

### 4.2 Qualification State Attribution

"Why is the current S-state S2?"

```
SELECT latest REEVALUATION_COMPLETED event
EXTRACT: overlay_attribution
→ SEP-001 contributed 3 lineage upgrades → backed_count +3
→ SEP-002 contributed 2 crosswalk extensions → continuity +0.12
→ Composite: S2 gates met via overlay contributions
```

### 4.3 Authorization Chain

"Who authorized the activation of SEP-003?"

```
SELECT ACTIVATION_AUTHORIZED event WHERE package_id = "SEP-003"
→ authorization_source: "PI.SQO.FASTAPI-EVIDENCE-ONBOARDING.01"
→ authorization_type: "STREAM_CONTRACT"
→ timestamp: "2026-05-11T14:30:00Z"
```

### 4.4 Conflict History

"What conflicts exist for DOM-05?"

```
SELECT CONFLICT_DETECTED events WHERE details.domain = "DOM-05"
→ CONFLICT-001: SEP-001 vs SEP-002, DOMAIN_TYPING, resolution: CONFIDENCE_PRECEDENCE
→ CONFLICT-002: SEP-003 vs SEP-004, LABEL_ASSIGNMENT, resolution: LATER_PACKAGE_PRECEDENCE
```

### 4.5 Impact Analysis

"What would happen if we revoked SEP-002?"

```
current_state = latest composite state
projected_state = REPLAY(substrate, active_overlays - SEP-002, profile, framework)
delta = DIFF(current_state, projected_state)
→ backed_count: 5 → 3 (SEP-002 contributed 2 lineage upgrades)
→ S-state: S2 → S1 (S2 gate no longer met without SEP-002 lineage upgrades)
→ debt_resolved: 8 → 6 (2 debt items revert to unresolved)
```

---

## 5. Audit Integrity

### 5.1 Event Immutability

Audit events are NEVER modified or deleted. Each event is persisted
once and retained permanently.

### 5.2 Hash Chain

Events are linked by hash chain:

```json
{
  "event_id": "EVT-002",
  "prior_event_hash": "<sha256 of EVT-001>",
  "event_hash": "<sha256 of this event>",
  ...
}
```

The hash chain enables detection of:
- Missing events (gap in chain)
- Modified events (hash mismatch)
- Reordered events (sequence violation)

### 5.3 Integrity Verification

```
LOAD all events for (client, run_id) in timestamp order
FOR EACH event:
    VERIFY event_hash matches computed hash of event content
    VERIFY prior_event_hash matches previous event's event_hash
IF any mismatch:
    REPORT: audit trail integrity violation
    ESCALATE to governance audit
```

---

## 6. Audit and Disclosure

### 6.1 Mandatory Disclosure

The following must be disclosed in all qualification evaluation outputs:

1. Whether overlay contributions are present
2. How many packages are contributing
3. Which domains have overlay contributions
4. The distinction between certified and overlay grounding
5. The aggregate overlay impact on backed_count

### 6.2 Audit-on-Demand

At any time, a governance authority may request:

1. Full audit trail for a (client, run_id)
2. Package-specific audit history
3. Replay reconstruction verification
4. Conflict resolution history
5. Authorization chain verification

---

## 7. Governance Rules

1. Every activation-related event MUST produce an audit record.
2. Audit events are immutable and permanently retained.
3. Hash chain integrity MUST be verifiable on demand.
4. Mandatory disclosure requirements apply to all evaluation outputs.
5. No hidden semantic activation — every overlay contribution is
   traceable through the audit trail.
6. Audit trail gaps are governance events requiring investigation.
