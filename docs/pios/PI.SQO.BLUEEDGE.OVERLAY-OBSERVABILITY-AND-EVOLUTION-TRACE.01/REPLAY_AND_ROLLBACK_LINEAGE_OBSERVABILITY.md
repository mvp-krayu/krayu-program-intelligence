# Replay and Rollback Lineage Observability

**Stream:** PI.SQO.BLUEEDGE.OVERLAY-OBSERVABILITY-AND-EVOLUTION-TRACE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 6 — Operational Semantic Observability Architecture

---

## 1. Purpose

This document defines how replay and rollback operations themselves
become observable — how their execution is traced, their results
are linked to evolution state, and their integrity is independently
verifiable by operators and governance.

---

## 2. Replay Observability

### 2.1 Replay Trace Record

Every replay reconstruction execution produces a trace record:

```json
{
  "replay_trace_id": "<uuid>",
  "timestamp": "<ISO-8601>",
  "sandbox_id": "<sandbox_id>",
  "replay_type": "BASELINE | SINGLE_OVERLAY | MULTI_OVERLAY | POST_REVOCATION | VERSION_ROLLBACK",
  "inputs": {
    "substrate_version": {
      "hash": "<hash>",
      "source": "PIPELINE_CERTIFIED",
      "verified": true
    },
    "qualification_baseline_version": {
      "hash": "<hash>",
      "source": "PIPELINE_CERTIFIED",
      "verified": true
    },
    "overlay_package_set": {
      "count": N,
      "packages": ["<package_ids>"],
      "set_hash": "<hash of ordered package list>",
      "verified": true
    },
    "activation_profile": {
      "hash": "<hash>",
      "activated_count": M,
      "verified": true
    },
    "evaluation_framework_version": {
      "version": "1.0",
      "formula_hash": "<hash>",
      "verified": true
    },
    "sandbox_manifest": {
      "hash": "<hash>",
      "verified": true
    },
    "all_inputs_verified": true
  },
  "execution": {
    "steps_executed": 8,
    "steps_passed": 8,
    "duration_concept": "deterministic",
    "overlay_application_order": ["<package_ids in application order>"],
    "entries_applied": K,
    "entries_rejected": 0,
    "conflicts_detected": 0
  },
  "result": {
    "composite_hash": "<hash of computed composite>",
    "composite_summary": {
      "s_state": "S2",
      "q_class": "Q-02",
      "backed_count": 5,
      "overlay_count": 1,
      "grounding_ratio": 0.294
    },
    "verification": "MATCH | DIVERGENCE | FIRST_SNAPSHOT",
    "reference_snapshot_id": "<snapshot compared against>",
    "divergence_details": null
  }
}
```

### 2.2 Replay Verification Observability

When a replay is verified against a prior snapshot:

| Observable | Content |
|-----------|---------|
| Input integrity | All 6 inputs hash-verified (per-input pass/fail) |
| Reconstruction path | Step-by-step overlay application order |
| Composite result | Full composite state summary |
| Verification outcome | MATCH or DIVERGENCE with exact divergence location |
| Snapshot comparison | Which snapshot was used as reference |
| Determinism proof | Same inputs produced same hash |

### 2.3 Replay Divergence Observability

When a replay produces a DIVERGENCE result:

```json
{
  "divergence_record": {
    "replay_trace_id": "<id>",
    "expected_composite_hash": "<from reference snapshot>",
    "actual_composite_hash": "<from replay reconstruction>",
    "divergence_location": {
      "metric": "<which metric diverged>",
      "expected": "<value>",
      "actual": "<value>"
    },
    "possible_causes": [
      "Input hash mismatch (substrate changed)",
      "Package artifact modification",
      "Activation profile inconsistency",
      "Framework version mismatch"
    ],
    "governance_action": "SANDBOX_FROZEN pending investigation"
  }
}
```

---

## 3. Rollback Observability

### 3.1 Rollback Trace Record

Every rollback operation produces a trace record:

```json
{
  "rollback_trace_id": "<uuid>",
  "timestamp": "<ISO-8601>",
  "sandbox_id": "<sandbox_id>",
  "rollback_type": "SINGLE_PACKAGE | CASCADE | FULL_RESET | VERSION_ROLLBACK",
  "trigger": {
    "type": "GOVERNANCE_DECISION | COMPOSITE_INCONSISTENCY | REPLAY_DIVERGENCE | EMERGENCY",
    "reason": "<human-readable reason>",
    "authority": "<who authorized the rollback>"
  },
  "scope": {
    "packages_affected": ["<package_ids>"],
    "rollback_point_used": "<rollback_point_id>",
    "rollback_point_type": "RP-INIT | RP-PRE-ACTIVATE | RP-POST-ACTIVATE | RP-PRE-REVOKE"
  },
  "state_before_rollback": {
    "s_state": "S2",
    "q_class": "Q-02",
    "backed_count": 5,
    "overlay_count": 1,
    "composite_hash": "<hash>"
  },
  "state_after_rollback": {
    "s_state": "S2",
    "q_class": "Q-02",
    "backed_count": 4,
    "overlay_count": 0,
    "composite_hash": "<hash>"
  },
  "rollback_delta": {
    "backed_count_change": "-1",
    "domains_reverted": ["DOMAIN-11"],
    "overlay_count_change": "-1",
    "certification_level_change": "SANDBOX_COMPUTED → PIPELINE_CERTIFIED"
  },
  "post_rollback_verification": {
    "composite_matches_rollback_point": true,
    "replay_verified": true,
    "baseline_immutability_verified": true,
    "audit_trail_preserved": true
  }
}
```

### 3.2 Rollback Point Observability

Operators can observe all available rollback points:

```json
{
  "rollback_points": [
    {
      "rollback_point_id": "<id>",
      "type": "RP-INIT",
      "created_at": "<timestamp>",
      "state_summary": {
        "s_state": "S2",
        "backed_count": 4,
        "overlay_count": 0,
        "composite_hash": "<hash>"
      },
      "description": "Sandbox creation — certified baseline only"
    },
    {
      "rollback_point_id": "<id>",
      "type": "RP-PRE-ACTIVATE-SEP-001",
      "created_at": "<timestamp>",
      "state_summary": {
        "s_state": "S2",
        "backed_count": 4,
        "overlay_count": 0,
        "composite_hash": "<hash>"
      },
      "description": "Before SEP-blueedge-run01-001 activation"
    },
    {
      "rollback_point_id": "<id>",
      "type": "RP-POST-ACTIVATE-SEP-001",
      "created_at": "<timestamp>",
      "state_summary": {
        "s_state": "S2",
        "backed_count": 5,
        "overlay_count": 1,
        "composite_hash": "<hash>"
      },
      "description": "After SEP-blueedge-run01-001 activation"
    }
  ]
}
```

### 3.3 Cascade Rollback Observability

When a cascade rollback affects multiple packages:

```json
{
  "cascade_trace": {
    "root_package": "<package that triggered cascade>",
    "dependency_chain": [
      { "package": "PKG-C", "depends_on": "PKG-B", "revocation_order": 1 },
      { "package": "PKG-B", "depends_on": "PKG-A", "revocation_order": 2 },
      { "package": "PKG-A", "depends_on": null, "revocation_order": 3 }
    ],
    "per_package_impact": [
      { "package": "PKG-C", "domains_reverted": ["DOMAIN-05"], "backed_change": -1 },
      { "package": "PKG-B", "domains_reverted": ["DOMAIN-03"], "backed_change": -1 },
      { "package": "PKG-A", "domains_reverted": ["DOMAIN-11"], "backed_change": -1 }
    ],
    "cumulative_impact": {
      "total_domains_reverted": 3,
      "total_backed_change": -3,
      "backed_count_before": 7,
      "backed_count_after": 4
    }
  }
}
```

---

## 4. Replay-Rollback Intersection

### 4.1 Post-Rollback Replay Verification

Every rollback MUST be followed by a replay verification:

```
1. Rollback executed → new composite state
2. Replay reconstruction from current inputs
3. Verify replay composite == rollback composite
4. If MATCH: rollback confirmed deterministic
5. If DIVERGENCE: escalate (rollback may be corrupted)
```

This verification is observable as a linked pair:

```json
{
  "linked_verification": {
    "rollback_trace_id": "<rollback that triggered this>",
    "replay_trace_id": "<replay that verified it>",
    "result": "MATCH",
    "conclusion": "Rollback is deterministic and replay-safe"
  }
}
```

### 4.2 Round-Trip Proof Observability

The round-trip proof (T0 = T2 after activation + revocation) is
observable as:

```json
{
  "round_trip_proof": {
    "t0_hash": "<baseline composite hash>",
    "t1_hash": "<post-activation composite hash>",
    "t2_hash": "<post-revocation composite hash>",
    "t0_equals_t2": true,
    "proof_type": "INDEPENDENT_REMOVABILITY",
    "packages_in_round_trip": ["SEP-blueedge-run01-001"],
    "conclusion": "Activation and revocation form a perfect round-trip"
  }
}
```

---

## 5. Observability Queries

| Query | Resolution Source |
|-------|-----------------|
| Has this state been replay-verified? | Latest replay trace with MATCH result |
| What rollback points are available? | Rollback point registry |
| What would rolling back to RP-X do? | State diff: current vs RP-X snapshot |
| Was the last rollback successful? | Rollback trace + linked replay verification |
| Has any replay divergence occurred? | Replay verification log filtered by DIVERGENCE |
| What is the round-trip proof status? | Round-trip proof record (T0=T2) |
| How many replay verifications have passed? | Count of MATCH results in verification log |
| Is the replay chain intact? | Sequential replay hash chain verification |

---

## 6. Persistence

```
artifacts/sqo/<client>/<run_id>/sandbox/observability/
├── replay_traces/
│   ├── replay-trace-<id>.json
│   └── ...
├── rollback_traces/
│   ├── rollback-trace-<id>.json
│   └── ...
├── linked_verifications/
│   ├── linked-<rollback_id>-<replay_id>.json
│   └── ...
└── round_trip_proofs/
    ├── proof-<package_id>.json
    └── ...
```

---

## 7. Governance Rules

1. Every replay execution produces a trace record.
2. Every rollback execution produces a trace record.
3. Post-rollback replay verification is mandatory.
4. Replay divergence is a governance event requiring sandbox freeze.
5. Rollback points are observable on demand.
6. Round-trip proofs are computed for every activation+revocation pair.
7. Cascade rollback traces include per-package impact breakdown.
8. Replay and rollback traces are immutable and append-only.
