# Sandbox Operational State Visibility

**Stream:** PI.SQO.BLUEEDGE.OVERLAY-OBSERVABILITY-AND-EVOLUTION-TRACE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 6 — Operational Semantic Observability Architecture

---

## 1. Purpose

This document defines what an operator can observe about a sandbox's
operational state at any time — lifecycle status, overlay inventory,
composite health, failure conditions, and governance disposition.
Operational state visibility is the foundation for all higher-level
observability (evolution traces, causality, lineage).

---

## 2. Sandbox State Model

### 2.1 Primary State Dimensions

An operator observes a sandbox through 5 state dimensions:

| Dimension | Question | Observable |
|-----------|----------|-----------|
| Lifecycle | What phase is the sandbox in? | INITIALIZED, ACTIVE, SUSPENDED, CLOSED |
| Overlay inventory | What overlays exist and in what status? | Package list with status per package |
| Composite health | Is the qualification state internally consistent? | Composite hash, replay verification status |
| Failure state | Are there active failures? | Failure count by zone, severity, resolution status |
| Governance posture | Is the sandbox operating normally? | Normal, under review, frozen, suspended |

### 2.2 Sandbox Status Card

The consolidated operational state view:

```json
{
  "sandbox_status_card": {
    "sandbox_id": "<id>",
    "client": "<client_id>",
    "run_id": "<run_id>",
    "lifecycle": {
      "status": "ACTIVE",
      "created_at": "<timestamp>",
      "last_event_at": "<timestamp>",
      "disposition": null
    },
    "overlay_inventory": {
      "total_packages": 1,
      "activated": 0,
      "staged": 0,
      "revoked": 1,
      "superseded": 0
    },
    "composite_health": {
      "current_hash": "<hash>",
      "last_replay_verification": "MATCH",
      "last_replay_at": "<timestamp>",
      "baseline_immutability": "VERIFIED",
      "audit_chain_integrity": "VALID"
    },
    "failure_state": {
      "active_failures": 0,
      "contained_failures": 0,
      "escalated_failures": 0,
      "critical_failures": 0
    },
    "governance_posture": {
      "status": "NORMAL",
      "restrictions": [],
      "pending_reviews": 0
    }
  }
}
```

---

## 3. Lifecycle Visibility

### 3.1 Lifecycle State Transitions

Each lifecycle transition is observable:

| From | To | Trigger | Observable Signal |
|------|-----|---------|------------------|
| — | INITIALIZED | Sandbox created | manifest.json written, baseline anchored |
| INITIALIZED | ACTIVE | First package registered or activated | First overlay operation event |
| ACTIVE | SUSPENDED | Governance hold or failure escalation | Suspension event with reason |
| SUSPENDED | ACTIVE | Governance release | Resume event with authorization |
| ACTIVE | CLOSED | Governance closure or completion | Closure event with disposition |
| SUSPENDED | CLOSED | Governance closure from suspended state | Closure event with disposition |

### 3.2 Lifecycle State Indicators

| Status | Operator Signal | Meaning |
|--------|----------------|---------|
| INITIALIZED | Ready to receive overlays | Sandbox created, baseline anchored, no operations yet |
| ACTIVE | Overlay operations in progress | Packages being registered, validated, activated |
| SUSPENDED | Operations paused | Governance hold, failure investigation, or pending review |
| CLOSED | Terminal — read-only | Sandbox completed its lifecycle; audit and replay remain available |

### 3.3 Lifecycle Duration Observability

```json
{
  "lifecycle_duration": {
    "total_lifetime": "<duration from INITIALIZED to now or CLOSED>",
    "time_in_active": "<cumulative time in ACTIVE>",
    "time_in_suspended": "<cumulative time in SUSPENDED>",
    "suspension_count": N,
    "transitions": [
      { "from": "INITIALIZED", "to": "ACTIVE", "at": "<timestamp>" },
      { "from": "ACTIVE", "to": "CLOSED", "at": "<timestamp>" }
    ]
  }
}
```

---

## 4. Overlay Inventory Visibility

### 4.1 Package Status Board

Operators see every package with its current lifecycle status:

```json
{
  "package_status_board": [
    {
      "package_id": "SEP-blueedge-run01-001",
      "version": 1,
      "status": "REVOKED",
      "lifecycle_phase": "TERMINAL",
      "registered_at": "<timestamp>",
      "activated_at": "<timestamp>",
      "revoked_at": "<timestamp>",
      "entry_count": 1,
      "domains_targeted": ["DOMAIN-11"],
      "semantic_class": "TECHNICAL",
      "contribution_when_active": {
        "backed_count_delta": "+1",
        "domains_contributed": ["DOMAIN-11"]
      }
    }
  ]
}
```

### 4.2 Package Pipeline Status

For each package, the operator can observe its lifecycle pipeline:

```
SEP-blueedge-run01-001:
  ✓ STAGED → ✓ VALIDATED (9/9) → ✓ AUTHORIZED (5/5) →
  ✓ ELIGIBLE (6/6) → ✓ ACTIVATED → ✓ RE-EVALUATED →
  ✓ QUALIFICATION_VISIBLE → ● REVOKED
```

### 4.3 Domain Overlay Map

Which domains have overlay contributions and from which packages:

```json
{
  "domain_overlay_map": {
    "DOMAIN-01": { "status": "EXACT", "source": "CERTIFIED", "overlay": null },
    "DOMAIN-10": { "status": "STRONG", "source": "CERTIFIED", "overlay": null },
    "DOMAIN-11": { "status": "PARTIAL", "source": "CERTIFIED", "overlay": {
      "package_id": "SEP-blueedge-run01-001",
      "overlay_status": "REVOKED",
      "would_be_if_active": "STRONG"
    }},
    "DOMAIN-14": { "status": "EXACT", "source": "CERTIFIED", "overlay": null },
    "DOMAIN-16": { "status": "EXACT", "source": "CERTIFIED", "overlay": null },
    "DOMAIN-02": { "status": "NONE", "source": "CERTIFIED", "overlay": null },
    "...": "..."
  }
}
```

---

## 5. Composite Health Visibility

### 5.1 Health Indicators

| Indicator | Healthy | Degraded | Critical |
|-----------|---------|----------|----------|
| Replay verification | Latest = MATCH | No recent verification | DIVERGENCE detected |
| Baseline immutability | All hashes match | Not recently verified | Hash mismatch detected |
| Audit chain integrity | Chain valid | Not recently verified | Integrity violation |
| Composite consistency | Hash matches replay | Minor discrepancy | State corruption |

### 5.2 Composite Health Dashboard

```json
{
  "composite_health": {
    "overall": "HEALTHY | DEGRADED | CRITICAL",
    "indicators": {
      "replay_verification": {
        "status": "HEALTHY",
        "last_verified": "<timestamp>",
        "result": "MATCH",
        "total_verifications": 3,
        "total_matches": 3,
        "total_divergences": 0
      },
      "baseline_immutability": {
        "status": "HEALTHY",
        "artifacts_checked": 4,
        "artifacts_matched": 4,
        "last_verified": "<timestamp>"
      },
      "audit_chain": {
        "status": "HEALTHY",
        "chain_length": 10,
        "chain_valid": true,
        "violations": 0
      },
      "composite_consistency": {
        "status": "HEALTHY",
        "composite_hash": "<hash>",
        "matches_replay": true
      }
    }
  }
}
```

---

## 6. Failure State Visibility

### 6.1 Active Failure Board

```json
{
  "failure_board": {
    "active_count": 0,
    "failures": [],
    "containment_zones": {
      "zone_0_external": { "failures": 0, "status": "CLEAR" },
      "zone_1a_mount": { "failures": 0, "status": "CLEAR" },
      "zone_1b_activation": { "failures": 0, "status": "CLEAR" },
      "zone_1c_replay": { "failures": 0, "status": "CLEAR" },
      "zone_1d_audit": { "failures": 0, "status": "CLEAR" },
      "zone_1e_recovery": { "failures": 0, "status": "CLEAR" }
    }
  }
}
```

### 6.2 Failure Severity Indicators

| Severity | Operator Signal | Action Required |
|----------|----------------|----------------|
| CONTAINED | Informational — automatically handled | Acknowledge and monitor |
| ESCALATED | Warning — requires governance attention | Review and decide |
| CRITICAL | Alert — sandbox may be compromised | Immediate governance action |

---

## 7. Governance Posture Visibility

### 7.1 Governance Status

```json
{
  "governance_posture": {
    "status": "NORMAL | UNDER_REVIEW | FROZEN | RESTRICTED",
    "restrictions": [
      {
        "type": "NO_NEW_ACTIVATIONS",
        "reason": "Pending governance review of SEP-002",
        "imposed_at": "<timestamp>"
      }
    ],
    "pending_actions": [
      {
        "type": "REVOCATION_REVIEW",
        "package": "SEP-003",
        "requested_at": "<timestamp>",
        "authority_required": "GOVERNANCE_REVIEW"
      }
    ]
  }
}
```

---

## 8. State Observation Persistence

```
artifacts/sqo/<client>/<run_id>/sandbox/state/
├── status_card.json
├── package_board.json
├── health_dashboard.json
├── failure_board.json
├── governance_posture.json
└── state_snapshots/
    ├── snapshot-<timestamp>.json
    └── ...
```

---

## 9. Governance Rules

1. All 5 state dimensions are observable at any time.
2. Lifecycle transitions produce audit events.
3. Package status is always current and never hidden.
4. Composite health indicators reflect latest verification results.
5. Failure state is observable at zone-level granularity.
6. Governance posture is explicitly communicated (not inferred).
7. State snapshots are retained for historical observability.
8. No sandbox state is hidden from authorized operators.
