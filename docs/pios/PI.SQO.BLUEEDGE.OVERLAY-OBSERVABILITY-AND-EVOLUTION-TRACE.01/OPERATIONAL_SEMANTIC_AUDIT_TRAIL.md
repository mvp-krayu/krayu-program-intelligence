# Operational Semantic Audit Trail

**Stream:** PI.SQO.BLUEEDGE.OVERLAY-OBSERVABILITY-AND-EVOLUTION-TRACE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 6 — Operational Semantic Observability Architecture

---

## 1. Purpose

This document defines the operational semantic audit trail — the
unified narrative that ties together all sandbox operations
(activations, re-evaluations, revocations, replays, rollbacks,
failures) into a coherent, queryable, governance-grade record of
what happened, why, and with what consequence.

This trail synthesizes the event-level audit trail (from the sandbox
auditability architecture) with the qualification-level evolution
trace into a single operator-consumable record.

---

## 2. Trail Architecture

### 2.1 Audit Trail vs Operational Trail

| Concern | Event-Level Audit Trail | Operational Semantic Audit Trail |
|---------|------------------------|--------------------------------|
| Source | Sandbox audit events (20 types) | Synthesized from audit events + evolution transitions + causality chains |
| Granularity | Individual operations | Operational narratives (grouped, contextualized) |
| Primary consumer | Integrity verification | Operator understanding and governance review |
| Question answered | "What events occurred?" | "What semantic operations happened and what did they mean?" |
| Format | Hash-chained JSON events | Structured narrative records with context |

### 2.2 Operational Narrative Model

Each operational narrative groups related audit events into a
coherent story:

```json
{
  "narrative_id": "<uuid>",
  "narrative_type": "ACTIVATION_LIFECYCLE | REVOCATION | REPLAY_VERIFICATION | ROLLBACK | FAILURE_RESPONSE | SANDBOX_LIFECYCLE",
  "timestamp_start": "<ISO-8601>",
  "timestamp_end": "<ISO-8601>",
  "summary": "<one-line human-readable summary>",
  "events": ["<audit event IDs that compose this narrative>"],
  "qualification_impact": {
    "state_before": { "s_state": "S2", "backed_count": 4 },
    "state_after": { "s_state": "S2", "backed_count": 5 },
    "delta_summary": "backed_count +1 (DOMAIN-11 PARTIAL→STRONG)"
  },
  "governance_context": {
    "authorization_source": "<who authorized>",
    "safety_rules_checked": 10,
    "safety_rules_passed": 10,
    "boundary_violations": 0
  }
}
```

---

## 3. Narrative Types

### 3.1 ACTIVATION_LIFECYCLE Narrative

Groups the complete activation of a package from registration
through qualification visibility:

```json
{
  "narrative_type": "ACTIVATION_LIFECYCLE",
  "summary": "SEP-blueedge-run01-001 activated: DOMAIN-11 PARTIAL→STRONG, backed 4→5",
  "events": [
    "EVT-001: PACKAGE_REGISTERED (SEP-blueedge-run01-001)",
    "EVT-002: VALIDATION_COMPLETED (9/9 PASS)",
    "EVT-003: AUTHORIZATION_COMPLETED (5/5 PASS)",
    "EVT-004: ELIGIBILITY_RESOLVED (6/6 PASS)",
    "EVT-005: ACTIVATION_AUTHORIZED (stream_contract)",
    "EVT-006: OVERLAY_MOUNTED (DOMAIN-11 affected)",
    "EVT-007: REEVALUATION_COMPLETED (backed 4→5)",
    "EVT-008: QUALIFICATION_UPDATED (S2, Q-02, 5/17)"
  ],
  "package_detail": {
    "package_id": "SEP-blueedge-run01-001",
    "entry_count": 1,
    "claim_type": "LINEAGE_UPGRADE",
    "target": "DOMAIN-11",
    "lineage_change": "PARTIAL → STRONG"
  },
  "lifecycle_completeness": "FULL (8/8 phases)"
}
```

### 3.2 REVOCATION Narrative

Groups the revocation of a package and its state impact:

```json
{
  "narrative_type": "REVOCATION",
  "summary": "SEP-blueedge-run01-001 revoked: DOMAIN-11 STRONG→PARTIAL, backed 5→4",
  "events": [
    "EVT-009: OVERLAY_UNMOUNTED (SEP-blueedge-run01-001)",
    "EVT-010: REEVALUATION_COMPLETED (backed 5→4)"
  ],
  "revocation_detail": {
    "package_id": "SEP-blueedge-run01-001",
    "revocation_type": "STANDARD",
    "reason": "Micro-activation proof completion",
    "impact": "backed_count 5→4, grounding_ratio 0.294→0.235",
    "baseline_restored": true,
    "round_trip_verified": true
  }
}
```

### 3.3 REPLAY_VERIFICATION Narrative

Groups a replay verification event:

```json
{
  "narrative_type": "REPLAY_VERIFICATION",
  "summary": "Replay verified: 3 snapshots, 3 MATCH, zero divergences",
  "verification_results": [
    { "snapshot": "baseline", "result": "MATCH" },
    { "snapshot": "post-activation", "result": "MATCH" },
    { "snapshot": "post-revocation", "result": "MATCH" }
  ],
  "determinism_confirmed": true,
  "6_input_model_verified": true
}
```

### 3.4 ROLLBACK Narrative

Groups a rollback operation with its justification and impact:

```json
{
  "narrative_type": "ROLLBACK",
  "summary": "Single-package rollback: SEP-002 reverted, backed 6→5",
  "rollback_detail": {
    "type": "SINGLE_PACKAGE",
    "rollback_point": "<rollback_point_id>",
    "packages_affected": ["SEP-002"],
    "state_restored_to": "RP-PRE-ACTIVATE-SEP-002"
  },
  "post_rollback_verification": {
    "replay_match": true,
    "baseline_intact": true
  }
}
```

### 3.5 FAILURE_RESPONSE Narrative

Groups a failure detection and response:

```json
{
  "narrative_type": "FAILURE_RESPONSE",
  "summary": "Phase 1 validation failure: SEP-003 provenance hash mismatch",
  "failure_detail": {
    "classification": "CONTAINED",
    "zone": "Zone 1b (Activation)",
    "failure_type": "PROVENANCE_HASH_MISMATCH",
    "package_id": "SEP-003"
  },
  "response": {
    "action_taken": "Package remains STAGED, no state change",
    "impact_on_composite": "NONE",
    "governance_escalation": false
  }
}
```

### 3.6 SANDBOX_LIFECYCLE Narrative

Groups sandbox lifecycle events:

```json
{
  "narrative_type": "SANDBOX_LIFECYCLE",
  "summary": "Sandbox closed: MICRO_ACTIVATION_PROOF_COMPLETE, 10 audit events",
  "lifecycle_events": [
    "Sandbox created with certified baseline (4/17 backed)",
    "1 package lifecycle completed (activation + revocation)",
    "3 replay verifications (all MATCH)",
    "Sandbox closed — proof complete"
  ],
  "final_state": {
    "composite": "equals certified baseline",
    "packages": { "total": 1, "revoked": 1, "active": 0 },
    "audit_events": 10,
    "audit_chain": "VALID"
  }
}
```

---

## 4. Trail Ordering and Linkage

### 4.1 Temporal Ordering

Narratives are ordered by timestamp_start. When narratives overlap
(rare — typically sequential), temporal ordering is primary and
narrative_id is tiebreaker.

### 4.2 Causal Linkage

Narratives may link to each other causally:

```json
{
  "narrative_id": "NAR-002",
  "caused_by": "NAR-001",
  "causal_relationship": "REVOCATION follows ACTIVATION as part of micro-activation proof"
}
```

### 4.3 Evolution Trace Linkage

Each narrative links to the evolution trace transition it produced:

```json
{
  "narrative_id": "NAR-001",
  "evolution_transition_id": "transition-001",
  "transition_summary": "T0 → T1: backed 4→5"
}
```

---

## 5. Trail Queries

| Query | Resolution |
|-------|-----------|
| What happened in this sandbox? | Ordered list of all narratives |
| What was the last operation? | Latest narrative by timestamp |
| Show all activations | Filter narratives by type = ACTIVATION_LIFECYCLE |
| Show all failures | Filter narratives by type = FAILURE_RESPONSE |
| What is the complete story of SEP-001? | All narratives referencing SEP-001 |
| Were there any governance escalations? | Filter narratives with governance_escalation = true |
| What replay verifications have been done? | Filter narratives by type = REPLAY_VERIFICATION |
| Has any rollback occurred? | Filter narratives by type = ROLLBACK |
| What was the qualification impact of operation X? | Narrative X → qualification_impact block |
| Is the sandbox operating normally? | Latest SANDBOX_LIFECYCLE narrative + failure board |

---

## 6. Trail Completeness

### 6.1 No Hidden Operations

Every sandbox operation that affects qualification state, overlay
inventory, or sandbox lifecycle MUST produce a narrative. There are
no silent operations.

### 6.2 Completeness Verification

```
FOR EACH audit_event IN sandbox_audit_trail:
  VERIFY audit_event.event_id appears in at least one narrative.events
  IF orphaned (event not in any narrative):
    REPORT: "ORPHANED_AUDIT_EVENT — event not covered by any narrative"
```

---

## 7. Persistence

```
artifacts/sqo/<client>/<run_id>/sandbox/audit_trail/
├── narratives/
│   ├── narrative-001.json
│   ├── narrative-002.json
│   └── ...
├── trail_index.json
└── trail_completeness.json
```

### 7.1 Trail Index

```json
{
  "sandbox_id": "<id>",
  "narrative_count": N,
  "narratives_by_type": {
    "ACTIVATION_LIFECYCLE": 1,
    "REVOCATION": 1,
    "REPLAY_VERIFICATION": 1,
    "SANDBOX_LIFECYCLE": 1
  },
  "audit_events_covered": 10,
  "audit_events_total": 10,
  "completeness": "FULL"
}
```

---

## 8. Governance Rules

1. Every qualification-affecting operation produces a narrative.
2. Narratives reference constituent audit events by ID.
3. No audit event is orphaned (all covered by at least one narrative).
4. Narratives are immutable and append-only.
5. Trail completeness is verifiable on demand.
6. Governance escalations are explicitly flagged in narratives.
7. The trail is a synthesis layer — the hash-chained audit trail remains
   the integrity-verified source of truth.
8. Operators can query the trail by type, package, time range, or impact.
