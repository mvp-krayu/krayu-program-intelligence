# Sandbox Failure Containment Model

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines how sandbox failures remain isolated, reversible,
non-propagating, and audit-visible — ensuring that no sandbox failure
contaminates canonical qualification, canonical replay state, or
substrate artifacts.

---

## 2. Failure Classification

### 2.1 Contained Failures (Sandbox-Internal)

Failures that are fully contained within the sandbox namespace and
require no external recovery:

| Failure | Impact | Containment |
|---------|--------|------------|
| Package validation failure (Phase 1) | Package stays STAGED | No composite state change |
| Authorization failure (Phase 2) | Package stays STAGED | No composite state change |
| Eligibility failure (Phase 3) | Package stays STAGED | No composite state change |
| Governance denial (Phase 4) | Package stays STAGED | No composite state change |
| Conflict detection | Conflict logged, escalated | Composite reflects resolution or freeze |
| Mount computation failure | Composite not updated | Prior composite retained |
| Audit trail write failure | Audit event queued for retry | Sandbox operations paused |

### 2.2 Escalated Failures (Governance Required)

Failures that require governance intervention:

| Failure | Impact | Escalation |
|---------|--------|-----------|
| Replay divergence | Composite state may be inconsistent | FREEZE sandbox; governance review |
| Registry-mount inconsistency | Mount state unclear | FREEZE sandbox; reconciliation required |
| Audit integrity failure | Hash chain broken | FREEZE sandbox; integrity audit |
| Limit exceeded (10 packages, 200 entries) | Activation blocked | Governance decision on scope |
| Contradictory claims (unresolvable) | Composite state contested | Governance conflict resolution |

### 2.3 Critical Failures (Boundary Violations)

Failures that indicate a sandbox isolation boundary breach:

| Failure | Impact | Response |
|---------|--------|----------|
| Write outside sandbox namespace | Possible certified artifact corruption | IMMEDIATE HALT; forensic audit |
| Certified hash mismatch | Substrate changed externally | HALT; sandbox re-initialization |
| Missing origin metadata | Attribution chain broken | HALT; metadata reconstruction |
| Cross-namespace contamination | Multi-sandbox integrity compromised | HALT both namespaces |

---

## 3. Failure Containment Architecture

### 3.1 Containment Zones

```
┌─────────────────────────────────────────────────────────┐
│ ZONE 0: EXTERNAL (Certified Layer)                       │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Substrate, DPSIG, Decision Validation, Rendering    │  │
│ │ Metadata, Certified Qualification                   │  │
│ │                                                     │  │
│ │ FAILURE PROPAGATION: NEVER                          │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ ═══════════ ISOLATION BOUNDARY (fail-closed) ═══════════  │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ ZONE 1: SANDBOX OPERATIONAL                         │  │
│ │ ┌───────────────────┐ ┌───────────────────────────┐ │  │
│ │ │ ZONE 1a: MOUNT    │ │ ZONE 1b: ACTIVATION       │ │  │
│ │ │ - Mount registry  │ │ - State machine           │ │  │
│ │ │ - Composite state │ │ - Gate records            │ │  │
│ │ │ - Mount log       │ │ - Re-evaluation artifacts │ │  │
│ │ └───────────────────┘ └───────────────────────────┘ │  │
│ │ ┌───────────────────┐ ┌───────────────────────────┐ │  │
│ │ │ ZONE 1c: REPLAY   │ │ ZONE 1d: AUDIT            │ │  │
│ │ │ - Snapshots       │ │ - Event trail             │ │  │
│ │ │ - Verification    │ │ - Integrity chain         │ │  │
│ │ │ - Reconstruction  │ │ - Index                   │ │  │
│ │ └───────────────────┘ └───────────────────────────┘ │  │
│ │ ┌───────────────────┐                               │  │
│ │ │ ZONE 1e: RECOVERY │                               │  │
│ │ │ - Rollback points │                               │  │
│ │ │ - Cleanup manifest│                               │  │
│ │ └───────────────────┘                               │  │
│ └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Zone Failure Propagation Rules

| Source Zone | Can Propagate To | Cannot Propagate To |
|-------------|-----------------|---------------------|
| Zone 1a (Mount) | Zone 1b (Activation), Zone 1c (Replay) | Zone 0 (Certified) |
| Zone 1b (Activation) | Zone 1a (Mount) | Zone 0 (Certified) |
| Zone 1c (Replay) | Zone 1d (Audit) — via verification events | Zone 0 (Certified) |
| Zone 1d (Audit) | None — terminal recording zone | Zone 0 (Certified) |
| Zone 1e (Recovery) | Zone 1a, 1b, 1c — restoration operations | Zone 0 (Certified) |
| Zone 0 (Certified) | N/A — external failures halt sandbox | N/A |

### 3.3 Fail-Closed Boundary

The isolation boundary between Zone 0 and Zone 1 is fail-closed:

```
ON any failure that might propagate to Zone 0:
  1. HALT all sandbox operations immediately
  2. VERIFY Zone 0 integrity:
     - Check substrate hash
     - Check rendering metadata hash
     - Check qualification baseline hash
  3. IF Zone 0 intact:
     - Sandbox failure is contained
     - Recovery may proceed within Zone 1
  4. IF Zone 0 compromised:
     - CRITICAL governance event
     - Full forensic audit required
     - Sandbox permanently closed
```

---

## 4. Failure Response Protocols

### 4.1 Contained Failure Response

For failures entirely within Zone 1:

```
1. LOG failure event in audit trail with:
   - failure_type
   - zone
   - affected_artifacts
   - timestamp
   - current_state_hash
2. APPLY automatic recovery if available:
   - Validation failure → package stays STAGED
   - Computation failure → retry from last rollback point
3. VERIFY sandbox consistency after recovery
4. RESUME operations if consistent
```

### 4.2 Escalated Failure Response

For failures requiring governance intervention:

```
1. FREEZE sandbox (status → SUSPENDED)
2. LOG failure event with ESCALATION flag
3. TAKE state snapshot for governance review
4. NOTIFY governance channel
5. AWAIT governance decision:
   a) RESUME — unfreeze and continue
   b) ROLLBACK — restore to specific rollback point
   c) RESET — full sandbox reset to baseline
   d) CLOSE — permanently close sandbox
```

### 4.3 Critical Failure Response

For boundary violations:

```
1. IMMEDIATE HALT — all operations stop
2. VERIFY Zone 0 integrity (hash checks)
3. IF Zone 0 intact:
   LOG boundary violation (contained but critical)
   CLOSE sandbox
   REQUIRE new sandbox creation
4. IF Zone 0 compromised:
   LOG critical boundary breach
   QUARANTINE sandbox artifacts
   INITIATE forensic audit
   ESCALATE to highest governance level
   REQUIRE Zone 0 restoration from pipeline re-execution
```

---

## 5. Non-Propagation Guarantees

### 5.1 Failure-to-Certified Isolation

| Guarantee | Mechanism |
|-----------|----------|
| Sandbox computation failure cannot corrupt certified metrics | Composite is sandbox-internal; certified values never overwritten |
| Sandbox audit failure cannot corrupt certified audit | Separate audit namespaces |
| Sandbox replay failure cannot corrupt certified replay | Sandbox replay inputs reference certified by hash (read-only) |
| Sandbox package corruption cannot corrupt certified packages | Certified has no overlay packages |
| Sandbox registry failure cannot corrupt certified state | Registry exists only in sandbox namespace |

### 5.2 Failure-to-Downstream Isolation

| Guarantee | Mechanism |
|-----------|----------|
| Sandbox failure cannot corrupt PATH B projection | Sandbox is SQO-internal; no PATH B write path |
| Sandbox failure cannot corrupt LENS output | No LENS invocation from sandbox |
| Sandbox failure cannot corrupt SQO cockpit certified state | Cockpit reads certified and composite separately |

---

## 6. Audit Visibility of Failures

### 6.1 Failure Audit Event Schema

```json
{
  "event_id": "<uuid>",
  "event_type": "FAILURE",
  "failure_classification": "CONTAINED | ESCALATED | CRITICAL",
  "timestamp": "<ISO-8601>",
  "zone": "1a | 1b | 1c | 1d | 1e | BOUNDARY",
  "description": "<human-readable failure description>",
  "affected_artifacts": ["<list of affected artifact paths>"],
  "state_at_failure": {
    "composite_hash": "<hash>",
    "registry_hash": "<hash>",
    "audit_chain_hash": "<hash>"
  },
  "recovery_action": "AUTOMATIC | ROLLBACK | FREEZE | HALT | NONE",
  "recovery_result": "SUCCESS | PENDING_GOVERNANCE | FAILED",
  "zone_0_verified": true
}
```

### 6.2 Failure Audit Queries

| Query | Answer Source |
|-------|-------------|
| Has any sandbox failure occurred? | Audit trail: filter event_type = FAILURE |
| Has any failure propagated to certified state? | zone_0_verified field (should always be true) |
| What failures are unresolved? | recovery_result = PENDING_GOVERNANCE |
| What was the recovery for failure X? | recovery_action + recovery_result |
| Has the sandbox ever been halted? | Filter failure_classification = CRITICAL |

---

## 7. BlueEdge Failure Scenarios

| Scenario | Classification | Recovery | Baseline Impact |
|----------|---------------|----------|----------------|
| BlueEdge overlay evidence incorrect | CONTAINED | Revoke package | NONE |
| Overlay claims conflict on DOM-05 | ESCALATED | Governance resolution | NONE |
| Backed_count computation error | CONTAINED | Recompute from inputs | NONE |
| Replay produces different S-state | ESCALATED | Freeze; governance review | NONE |
| Audit hash chain broken | ESCALATED | Integrity audit; rebuild chain | NONE |
| Write attempted to topology path | CRITICAL | Immediate halt; close sandbox | NONE (hash-verified) |
| Pipeline re-executed (new substrate) | CRITICAL (drift) | Close sandbox; new sandbox | New certified baseline |
| All overlays produce incorrect qualification | ESCALATED | Full sandbox reset | NONE (baseline restored) |

---

## 8. Governance Rules

1. No sandbox failure may propagate to Zone 0 (certified layer).
2. All failures are classified (CONTAINED, ESCALATED, CRITICAL).
3. Contained failures recover automatically when possible.
4. Escalated failures freeze the sandbox until governance decides.
5. Critical failures halt the sandbox immediately.
6. All failures are audit-visible with full context.
7. Zone 0 integrity is verified after any escalated or critical failure.
8. Failure recovery preserves replay chain integrity.
