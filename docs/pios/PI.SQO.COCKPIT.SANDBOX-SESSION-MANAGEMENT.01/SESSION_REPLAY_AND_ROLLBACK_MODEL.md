# Session Replay and Rollback Model

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how sandbox sessions manage replay reconstruction,
rollback reconstruction, replay lineage, rollback lineage,
divergence detection, and rollback ambiguity detection —
ensuring replay/rollback state remains externally visible.

---

## 2. Session Replay Model

### 2.1 Session Replay State

```json
{
  "session_replay_state": {
    "session_ref": "SBX-<client>-<run_id>",
    "input_inventory": {
      "baseline_hash": "<sha256>",
      "overlay_count": 3,
      "application_order": ["SEP-001", "SEP-002", "SEP-003"],
      "conflict_count": 3,
      "params_version": "v1.0",
      "config_version": "v1.0",
      "input_hash": "<sha256>"
    },
    "replay_history": [
      {
        "certification_id": "RCERT-BE-001-015",
        "overlay_id": "SEP-multi-001",
        "decision": "REPLAY_CERTIFIED",
        "timestamp": "<ISO-8601>"
      }
    ],
    "current_replay": null,
    "divergence_history": [],
    "last_full_replay_hash": "<sha256>",
    "last_verified": "<ISO-8601>"
  }
}
```

### 2.2 Session Replay Operations

| # | Operation | Description | Session State Required |
|---|-----------|-------------|----------------------|
| SR-01 | Initiate replay | Begin replay certification for overlay | ACTIVE |
| SR-02 | View input inventory | Display 6 replay inputs | ANY (read-only) |
| SR-03 | View reconstruction progress | Display current phase | REPLAY_VALIDATING |
| SR-04 | View replay result | Display CERTIFIED/DENIED/PARTIAL | ACTIVE (post-certification) |
| SR-05 | Investigate divergence | Root cause analysis of divergence | ANY (read-only) |
| SR-06 | Re-initiate replay | Begin re-certification after investigation | ACTIVE |
| SR-07 | View replay lineage | Trace replay inputs to sources | ANY (read-only) |

### 2.3 Session Replay Workspace View

```
┌──────────────────────────────────────────────────────┐
│ SESSION REPLAY STATE                                  │
├──────────────────────────────────────────────────────┤
│ INPUT INVENTORY                                       │
│ I-01 Baseline: a7b2..c4e1 ✓                         │
│ I-02 Overlays: 3 (SEP-001, SEP-002, SEP-003) ✓      │
│ I-03 Order: monotonic (1, 2, 3) ✓                    │
│ I-04 Conflicts: 3 resolved ✓                         │
│ I-05 Params: v1.0 ✓                                  │
│ I-06 Config: v1.0 ✓                                  │
│ Input Hash: d4e2..7f1a                                │
├──────────────────────────────────────────────────────┤
│ REPLAY CERTIFICATION HISTORY                          │
│ SEP-001: REPLAY_CERTIFIED (RCERT-BE-001-015)         │
│ SEP-002: REPLAY_CERTIFIED (RCERT-BE-001-016)         │
│ SEP-003: PENDING                                      │
├──────────────────────────────────────────────────────┤
│ DIVERGENCE STATUS: NONE                               │
│ Last Full Replay: f3d1..8a2b (verified 12:34:01Z)    │
└──────────────────────────────────────────────────────┘
```

---

## 3. Session Rollback Model

### 3.1 Session Rollback State

```json
{
  "session_rollback_state": {
    "session_ref": "SBX-<client>-<run_id>",
    "dependency_inventory": {
      "overlays_assessed": 3,
      "dependencies": [
        {
          "overlay_id": "SEP-multi-002",
          "inbound_hard": 0,
          "inbound_soft": 1,
          "outbound": 1,
          "cascade_depth": 1,
          "cascade_size": 1
        }
      ]
    },
    "rollback_history": [
      {
        "certification_id": "RBCERT-BE-001-010",
        "overlay_id": "SEP-multi-001",
        "decision": "ROLLBACK_CERTIFIED",
        "timestamp": "<ISO-8601>"
      }
    ],
    "current_rollback": null,
    "ambiguity_history": [],
    "max_cascade_depth": 1,
    "max_cascade_size": 1,
    "rollback_readiness": "PARTIAL"
  }
}
```

### 3.2 Session Rollback Operations

| # | Operation | Description | Session State Required |
|---|-----------|-------------|----------------------|
| SRB-01 | Initiate rollback cert | Begin rollback certification for overlay | ACTIVE |
| SRB-02 | View dependency inventory | Display all 5 dependency types | ANY (read-only) |
| SRB-03 | View removability status | Display 7 removability checks | ANY (read-only) |
| SRB-04 | View rollback result | Display CERTIFIED/DENIED/CONDITIONAL | ACTIVE (post-certification) |
| SRB-05 | Execute rollback | Remove overlay from session | ACTIVE (rollback-certified) |
| SRB-06 | Simulate rollback impact | Preview post-rollback state | ACTIVE |
| SRB-07 | Investigate ambiguity | Root cause analysis of ambiguity | ANY (read-only) |
| SRB-08 | View rollback lineage | Trace dependencies to sources | ANY (read-only) |

### 3.3 Session Rollback Workspace View

```
┌──────────────────────────────────────────────────────┐
│ SESSION ROLLBACK STATE                                │
├──────────────────────────────────────────────────────┤
│ ROLLBACK READINESS: PARTIAL (1/3 certified)           │
├──────────────────────────────────────────────────────┤
│ PER-OVERLAY ROLLBACK STATUS                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Overlay      │ Deps │ Removable│ Cascade│ Status │ │
│ │──────────────│──────│──────────│────────│────────│ │
│ │ SEP-multi-001│ 0 in │ 7/7 pass │ 0/0   │ CERT   │ │
│ │ SEP-multi-002│ 1 in │ 7/7 pass │ 1/1   │ PEND   │ │
│ │ SEP-multi-003│ 0 in │ N/A      │ N/A   │ PEND   │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ CASCADE SAFETY SUMMARY                                │
│ Max Depth: 1/3 ✓  │  Max Size: 1/5 ✓                │
│ Worst Case: rollback SEP-002 cascades to SEP-003     │
├──────────────────────────────────────────────────────┤
│ AMBIGUITY STATUS: NONE                                │
└──────────────────────────────────────────────────────┘
```

---

## 4. Session Divergence Detection

### 4.1 Session-Scoped Divergence

```
Divergence detection operates within session namespace:

  STEP 1: Reconstruct from session inputs
    reconstructed = replayReconstruct(
      session.baseline,
      session.overlay_chain,
      session.conflict_resolutions,
      session.params,
      session.config
    )

  STEP 2: Compare against session composite
    IF reconstructed.hash != session.composite_hash:
      → SESSION_DIVERGENCE detected
      → Trigger divergence investigation

  STEP 3: Scope divergence to session
    All divergence investigation is namespace-scoped
    Cross-session divergence is architecturally impossible
    (sessions are isolated)

  STEP 4: Record divergence in session history
    session.divergence_history.push({
      detected_at: now(),
      reconstructed_hash: reconstructed.hash,
      session_hash: session.composite_hash,
      divergence_type: "DIV-01 | DIV-02 | DIV-03 | DIV-04",
      root_cause: null (pending investigation)
    })
```

### 4.2 Session Divergence Response

| Divergence Severity | Session Response |
|---------------------|-----------------|
| CRITICAL (structural, non-determinism) | Session → QUARANTINED, G-4 escalation |
| HIGH (field or metric divergence) | Session → QUARANTINED, investigation required |
| MEDIUM (configuration version mismatch) | Warning in session state, continue |

---

## 5. Session Rollback Ambiguity Detection

### 5.1 Session-Scoped Ambiguity

```
Rollback ambiguity detection operates within session namespace:

  STEP 1: Verify dependency inventory completeness
    FOR each overlay in session.overlay_chain:
      IF dependency inventory incomplete:
        → AMBIGUITY: incomplete dependency data

  STEP 2: Verify conflict resolution determinism
    FOR each conflict in session.conflicts:
      expected_resolution = computeResolution(conflict)
      IF expected_resolution != recorded_resolution:
        → AMBIGUITY: non-deterministic resolution

  STEP 3: Verify cascade computation
    FOR each overlay in session.overlay_chain:
      cascade = computeCascade(session, overlay)
      IF cascade contains unresolvable dependency:
        → AMBIGUITY: unresolvable cascade dependency

  STEP 4: Record ambiguity
    session.ambiguity_history.push({
      detected_at: now(),
      ambiguity_type: "AMB-XX",
      affected_overlay: overlay_id,
      blocking: true | false
    })
```

---

## 6. Session Replay Lineage

### 6.1 Replay Lineage within Session

```
Session replay lineage traces:

  Session Input Inventory
    │
    ├── I-01: Baseline → artifact store → pipeline certification
    ├── I-02: Overlays → package registry → evidence intake
    ├── I-03: Order → activation records → proposal approval
    ├── I-04: Resolutions → conflict records → activation events
    ├── I-05: Params → governance config → versioned config store
    └── I-06: Config → governance config → versioned config store

Each input is traceable within session namespace.
Cross-session lineage references are PROHIBITED.
```

### 6.2 Rollback Lineage within Session

```
Session rollback lineage traces:

  Session Dependency Inventory
    │
    ├── D-01: Domain overlaps → composite contribution records
    ├── D-02: Conflict deps → conflict resolution records
    ├── D-03: Qualification deps → qualification attribution records
    ├── D-04: Lineage deps → lineage cross-references
    └── D-05: Supersession deps → supersession registry

Each dependency is traceable within session namespace.
Cross-session dependency references are PROHIBITED.
```

---

## 7. Session Certification Progression

### 7.1 Per-Overlay Certification Progression

```
Within a session, each overlay progresses through:

  ACTIVATED
    │  Overlay applied to session composite
    ▼
  REPLAY_CERTIFIED (or DENIED)
    │  6-phase replay certification complete
    ▼
  ROLLBACK_CERTIFIED (or DENIED)
    │  5-phase rollback certification complete
    ▼
  COMBINED_CERTIFIED (PROMOTION_ELIGIBLE)
    │  Both replay and rollback certified
    ▼
  AUTHORITY_PROMOTED
    │  Promoted to governing truth
    ▼
  [Publication eligibility assessment]

Session tracks this progression for every overlay in the chain.
```

### 7.2 Session Certification Summary

```
┌──────────────────────────────────────────────────────┐
│ SESSION CERTIFICATION SUMMARY                         │
├──────────────────────────────────────────────────────┤
│ Overlay      │ Replay │ Rollback │ Combined │ Auth   │
│──────────────│────────│──────────│──────────│────────│
│ SEP-multi-001│ CERT   │ CERT     │ ELIGIBLE │ PROM   │
│ SEP-multi-002│ CERT   │ PEND     │ PEND     │ —      │
│ SEP-multi-003│ PEND   │ PEND     │ PEND     │ —      │
├──────────────────────────────────────────────────────┤
│ Overall: 1/3 fully certified, 1/3 partial, 1/3 pend │
└──────────────────────────────────────────────────────┘
```

---

## 8. Governance

- Session replay state tracks input inventory, certification history, and divergence history
- Session rollback state tracks dependency inventory, certification history, and ambiguity history
- 7 replay operations and 8 rollback operations with defined session state requirements
- Divergence detection is namespace-scoped — cross-session divergence is architecturally impossible
- Rollback ambiguity detection verifies dependency completeness, resolution determinism, and cascade safety
- Replay and rollback lineage traces within session namespace only
- Per-overlay certification progression tracked from ACTIVATED to AUTHORITY_PROMOTED
- All replay/rollback state remains externally visible in session workspace
- Session replay/rollback model is client-agnostic
