# Sandbox Auditability Architecture

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines the auditability architecture for sandbox
execution — how every sandbox operation remains attributable,
reconstructable, replayable, externally visible, overlay-traceable,
and revocation-safe.

---

## 2. Auditability Properties

Every sandbox operation MUST satisfy all 6 properties:

| Property | Definition |
|----------|-----------|
| Attributable | Every change traceable to a specific package, entry, or governance action |
| Reconstructable | Full execution path reproducible from audit trail |
| Replayable | Qualification state at any point computable from recorded inputs |
| Externally visible | No hidden overlay execution state |
| Overlay-traceable | Every overlay contribution linked to origin package |
| Revocation-safe | Audit trail preserved even after overlay revocation |

---

## 3. Audit Event Model

### 3.1 Event Types

| Event Type | Trigger | Critical Data |
|-----------|---------|--------------|
| SANDBOX_CREATED | Sandbox namespace initialized | sandbox_id, baseline hashes |
| SANDBOX_STATUS_CHANGE | Status transition | from_status, to_status, reason |
| PACKAGE_REGISTERED | SEP entered sandbox (Phase 0) | package_id, version, hash, entry_count |
| VALIDATION_STARTED | Phase 1 begins | package_id, check_list |
| VALIDATION_COMPLETED | Phase 1 ends | package_id, result, failed_checks |
| AUTHORIZATION_COMPLETED | Phase 2 ends | package_id, result, authorized_classes |
| ELIGIBILITY_RESOLVED | Phase 3 ends | package_id, result, conflicts_detected |
| ACTIVATION_AUTHORIZED | Phase 4 completes | package_id, authorization_source, scope |
| OVERLAY_MOUNTED | Package mounted in composite | package_id, domains_affected, mount_time |
| REEVALUATION_TRIGGERED | Phase 5 trigger emitted | trigger_type, trigger_source |
| REEVALUATION_COMPLETED | Re-evaluation finished | composite_before, composite_after, changes |
| QUALIFICATION_UPDATED | Phase 6 — composite reflects overlay | s_state, q_class, backed_count |
| OVERLAY_UNMOUNTED | Package revoked/unmounted | package_id, reason, authority |
| VERSION_SUPERSEDED | Package version replaced | package_id, old_version, new_version |
| ROLLBACK_EXECUTED | Rollback to prior state | rollback_point_id, packages_affected |
| REPLAY_SNAPSHOT_TAKEN | Replay snapshot recorded | snapshot_id, composite_hash |
| REPLAY_VERIFIED | Replay verification completed | result (MATCH/DIVERGENCE) |
| FAILURE_DETECTED | Any failure event | classification, zone, description |
| BOUNDARY_VIOLATION | Isolation boundary breach | violation_type, severity |
| SANDBOX_CLOSED | Sandbox terminal | disposition, final_composite_hash |

### 3.2 Event Schema

```json
{
  "event_id": "<uuid>",
  "event_type": "<from event types above>",
  "timestamp": "<ISO-8601>",
  "sandbox_id": "<namespace_id>",
  "prior_event_hash": "<hash of previous event — chain link>",
  "event_hash": "<sha256 of this event content>",
  "payload": {
    "<event-type-specific data>"
  },
  "attribution": {
    "package_id": "<if applicable>",
    "governance_source": "<if applicable>",
    "operation": "<what triggered this event>"
  }
}
```

### 3.3 Hash Chain Integrity

Audit events form an immutable hash chain:

```
Event 1: event_hash = sha256(event_content_1)
         prior_event_hash = null (first event)

Event 2: event_hash = sha256(event_content_2)
         prior_event_hash = Event 1.event_hash

Event N: event_hash = sha256(event_content_N)
         prior_event_hash = Event (N-1).event_hash
```

**Verification:**
```
FOR EACH event IN audit_trail (ordered by timestamp):
  VERIFY event_hash == sha256(event_content)
  VERIFY prior_event_hash == previous_event.event_hash
IF any mismatch:
  REPORT: "AUDIT_INTEGRITY_VIOLATION"
  FREEZE sandbox operations
  ESCALATE to governance
```

---

## 4. Audit Trail Structure

```
sandbox/audit/
├── events/
│   ├── <event_id_001>.json
│   ├── <event_id_002>.json
│   └── ...
├── audit_index.json
└── audit_integrity.json
```

### 4.1 Audit Index

```json
{
  "sandbox_id": "<id>",
  "event_count": N,
  "first_event": "<event_id>",
  "last_event": "<event_id>",
  "chain_head_hash": "<hash of latest event>",
  "events": [
    {
      "event_id": "<id>",
      "event_type": "<type>",
      "timestamp": "<time>",
      "event_hash": "<hash>"
    }
  ]
}
```

### 4.2 Audit Integrity Record

```json
{
  "sandbox_id": "<id>",
  "last_verified": "<ISO-8601>",
  "chain_length": N,
  "chain_valid": true,
  "verification_hash": "<hash of verification computation>",
  "violations": []
}
```

---

## 5. Mandatory Audit Queries

Every sandbox execution MUST support these queries:

| Query | Resolution |
|-------|-----------|
| What is the current sandbox state? | manifest.json: status, overlay_summary |
| Which overlays are mounted? | mount_registry.json: mounts where status = MOUNTED |
| What changed with the last activation? | Latest REEVALUATION_COMPLETED event |
| Who authorized overlay X? | ACTIVATION_AUTHORIZED event for package X |
| What would happen if overlay X is revoked? | Replay reconstruction minus package X |
| What is the full activation history? | Audit trail filtered by OVERLAY_MOUNTED events |
| Has any failure occurred? | Audit trail filtered by FAILURE_DETECTED events |
| Is the audit trail intact? | audit_integrity.json: chain_valid field |
| What is the overlay attribution ratio? | Latest QUALIFICATION_UPDATED event: static vs overlay |
| Can the current state be replayed? | Latest REPLAY_VERIFIED event: result field |

---

## 6. Mandatory Disclosure

### 6.1 Sandbox Disclosure Requirements

When a sandbox has active overlays, every evaluation output MUST include:

| Disclosure | Content |
|-----------|---------|
| Sandbox presence | "Evaluation computed within sandbox execution namespace" |
| Overlay count | "N overlays mounted contributing to composite" |
| Domain attribution | "X domains certified, Y domains overlay-backed" |
| Composite grounding | "backed_count: A certified + B overlay = C composite" |
| S-state source | "S-state derived from composite evaluation" or "S-state from certified baseline" |

### 6.2 Disclosure Levels

| Context | Disclosure Level |
|---------|-----------------|
| Sandbox audit trail | FULL — every event and attribution detail |
| Re-evaluation artifacts | FULL — overlay_attribution with per-package breakdown |
| SQO cockpit display | SUMMARY — counts, percentages, overlay-present flag |
| Governance review | FULL — complete audit trail and replay verification |
| LENS projection (downstream) | SUMMARY — overlay-present flag and attribution ratio |

---

## 7. Audit Persistence and Retention

| Artifact | Retention | Mutability |
|----------|-----------|-----------|
| Audit events | Permanent (sandbox lifetime + archive) | IMMUTABLE (append-only) |
| Audit index | Updated on each event | Append-only |
| Audit integrity record | Updated on each verification | Recomputed (not mutable) |
| Rollback points | Permanent (sandbox lifetime + archive) | IMMUTABLE |
| Replay snapshots | Permanent (sandbox lifetime + archive) | IMMUTABLE |
| Package artifacts (including REVOKED) | Permanent | IMMUTABLE |
| Mount log | Updated on each mount/unmount | Append-only |

### 7.1 Sandbox Closure Retention

When a sandbox is CLOSED:

```
1. ALL audit artifacts are RETAINED (not deleted)
2. Audit trail is read-only (no new events)
3. Audit queries continue to function
4. Replay reconstruction continues to function
5. Archive disposition determined by governance
```

---

## 8. BlueEdge Audit Specifics

| Audit Property | BlueEdge Value |
|---------------|---------------|
| Baseline hash anchor | Substrate: 08480c17..., Metadata: 869d49549f... |
| Certified backed_count | 4 (always in static_backed_count) |
| Max overlay-backed domains | 13 (17 total - 4 certified) |
| Audit trail per package | Minimum 6 events (register, validate, authorize, eligible, activate, mount) |
| Post-revocation events | Unmount, re-evaluation, replay snapshot |
| S3 achievement disclosure | "S3 via composite: 4 certified + 13 overlay = 17/17" |

---

## 9. Governance Rules

1. All sandbox operations produce audit events.
2. Audit events are immutable and hash-chained.
3. Audit integrity is verified on demand and periodically.
4. Mandatory disclosures cannot be suppressed.
5. No hidden overlay execution state — every mount is audit-visible.
6. Audit trail survives sandbox closure.
7. Hash chain integrity failure is a governance event.
8. Every overlay contribution is attribution-linked to its origin package.
