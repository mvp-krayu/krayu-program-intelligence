# Sandbox Operational Workspace

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKSPACE-ARCHITECTURE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the workspace architecture for sandbox operations (WD-09) —
how operators interact with sandbox namespaces, overlay activation
chains, replay chains, rollback chains, qualification evolution
traces, and observability traces within governed isolation.

---

## 2. Sandbox Namespace Workspace

### 2.1 Namespace Model

```
Each client+run combination constitutes a sandbox namespace:

  namespace = {
    namespace_id: "SBX-<client>-<run_id>",
    client_id: "<client>",
    run_id: "<run_id>",
    baseline: "<certified_baseline_hash>",
    overlays_activated: [list],
    composite_state_hash: "<sha256>",
    s_state: "S1 | S2 | S3",
    governance_zone: "SAFE | PRESSURE | RISK | PROHIBITED",
    status: "ACTIVE | FROZEN | ARCHIVED"
  }
```

### 2.2 Namespace Workspace View

```
┌──────────────────────────────────────────────────────┐
│ SANDBOX NAMESPACE: SBX-BlueEdge-001                  │
├──────────────────────────────────────────────────────┤
│ NAMESPACE STATUS                                      │
│ Status: ACTIVE  │  Zone: SAFE  │  S-State: S2        │
│ Baseline: a7b2..c4e1 (PIPELINE_CERTIFIED)            │
│ Composite Hash: f3d1..8a2b                            │
│ Last Modified: 2026-05-11T12:34:01Z                   │
├──────────────────────────────────────────────────────┤
│ OVERLAY ACTIVATION CHAIN                              │
│ ┌─────────────────────────────────────────────────┐  │
│ │ 1. SEP-multi-001 │ ACTIVATED │ AUTHORITY_PROMOTED│  │
│ │ 2. SEP-multi-002 │ ACTIVATED │ REPLAY_CERTIFIED │  │
│ │ 3. SEP-multi-003 │ ACTIVATED │ CERTIFICATION_PEND│  │
│ └─────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│ QUALIFICATION METRICS                                 │
│ Static Backed:   45/67  │  Overlay Backed: 12/67     │
│ Composite Backed: 57/67 │  Grounding: 85.1%          │
│ Q-Class: Q-AUTHORITY-CANDIDATE                        │
└──────────────────────────────────────────────────────┘
```

---

## 3. Overlay Activation Chain View

### 3.1 Activation Chain Visualization

```
┌──────────────────────────────────────────────────────┐
│ OVERLAY ACTIVATION CHAIN                              │
├──────────────────────────────────────────────────────┤
│                                                       │
│ Baseline (PIPELINE_CERTIFIED)                         │
│   │                                                   │
│   ├── SEP-multi-001 (OT-GND)                        │
│   │   Status: AUTHORITY_PROMOTED                      │
│   │   Entries: 5 applied, 0 skipped                  │
│   │   Conflicts: 0                                   │
│   │   Replay: CERTIFIED  │  Rollback: CERTIFIED      │
│   │                                                   │
│   ├── SEP-multi-002 (OT-CNT)                        │
│   │   Status: REPLAY_CERTIFIED                        │
│   │   Entries: 8 applied, 1 skipped                  │
│   │   Conflicts: 2 (won: 2, lost: 0)                │
│   │   Replay: CERTIFIED  │  Rollback: PENDING        │
│   │                                                   │
│   └── SEP-multi-003 (OT-SEM)                        │
│       Status: ACTIVATED (certification pending)       │
│       Entries: 4 applied, 0 skipped                  │
│       Conflicts: 1 (won: 0, lost: 1)                │
│       Replay: PENDING    │  Rollback: PENDING        │
│                                                       │
│ Composite: 17 entries │ 3 conflicts │ S2              │
└──────────────────────────────────────────────────────┘
```

### 3.2 Activation Chain Actions

| # | Action | Authorization | Prerequisite |
|---|--------|--------------|-------------|
| AC-01 | View overlay contribution details | Operator | Overlay is ACTIVATED |
| AC-02 | View conflict resolution details | Operator | Conflicts exist |
| AC-03 | Initiate replay certification | Operator | Overlay ACTIVATED, zone permits |
| AC-04 | Initiate rollback certification | Operator | Overlay ACTIVATED, zone permits |
| AC-05 | View qualification impact per overlay | Operator | Overlay is ACTIVATED |
| AC-06 | Navigate to overlay proposal | Operator | Overlay has proposal record |

---

## 4. Replay Chain View

### 4.1 Replay Chain Visualization

```
┌──────────────────────────────────────────────────────┐
│ REPLAY CHAIN: SBX-BlueEdge-001                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│ Input Inventory                                       │
│   I-01: Baseline (a7b2..c4e1) ✓                     │
│   I-02: Overlay set (3 overlays) ✓                   │
│   I-03: Application order (monotonic) ✓              │
│   I-04: Conflict resolutions (3) ✓                   │
│   I-05: Qualification params (v1.0) ✓                │
│   I-06: Governance config (v1.0) ✓                   │
│   Input Hash: d4e2..7f1a                              │
│                                                       │
│ Reconstruction History                                │
│   RCERT-BE-001-015 │ SEP-multi-001 │ CERTIFIED       │
│   RCERT-BE-001-016 │ SEP-multi-002 │ CERTIFIED       │
│   RCERT-BE-001-017 │ SEP-multi-003 │ PENDING         │
│                                                       │
│ Current Composite Hash: f3d1..8a2b                    │
│ Last Verified: 2026-05-11T12:34:01Z                   │
└──────────────────────────────────────────────────────┘
```

---

## 5. Rollback Chain View

### 5.1 Rollback Chain Visualization

```
┌──────────────────────────────────────────────────────┐
│ ROLLBACK CHAIN: SBX-BlueEdge-001                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│ Rollback Safety Summary                               │
│                                                       │
│ SEP-multi-001                                         │
│   Dependencies: 0 inbound, 2 outbound                │
│   Removability: 7/7 checks passed                    │
│   Cascade: depth 0, size 0                           │
│   Rollback: CERTIFIED                                │
│                                                       │
│ SEP-multi-002                                         │
│   Dependencies: 1 inbound (soft), 1 outbound         │
│   Removability: 7/7 checks passed                    │
│   Cascade: depth 1, size 1                           │
│   Rollback: PENDING                                  │
│                                                       │
│ SEP-multi-003                                         │
│   Dependencies: 0 inbound, 0 outbound                │
│   Removability: NOT YET ASSESSED                     │
│   Cascade: NOT YET ASSESSED                          │
│   Rollback: PENDING                                  │
│                                                       │
│ Max Cascade: depth 1, size 1 (within limits)          │
└──────────────────────────────────────────────────────┘
```

---

## 6. Qualification Evolution Trace

### 6.1 Evolution Trace Visualization

```
┌──────────────────────────────────────────────────────┐
│ QUALIFICATION EVOLUTION TRACE                         │
├──────────────────────────────────────────────────────┤
│                                                       │
│ Timeline (most recent first):                         │
│                                                       │
│ ── SEP-multi-003 activated ──────────────────────    │
│    S-State: S2 (unchanged)                            │
│    Backed: 53→57/67 (+4)                              │
│    Grounding: 79.1%→85.1% (+6.0%)                    │
│    Q-Class: Q-AUTHORITY-CANDIDATE (unchanged)         │
│                                                       │
│ ── SEP-multi-002 activated ──────────────────────    │
│    S-State: S1→S2 (PROMOTED)                         │
│    Backed: 45→53/67 (+8)                              │
│    Grounding: 67.2%→79.1% (+11.9%)                   │
│    Q-Class: Q-BASELINE→Q-AUTHORITY-CANDIDATE          │
│                                                       │
│ ── SEP-multi-001 activated ──────────────────────    │
│    S-State: S1 (unchanged)                            │
│    Backed: 45→45/67 (+0, grounding only)              │
│    Grounding: 55.0%→67.2% (+12.2%)                   │
│    Q-Class: Q-BASELINE (unchanged)                    │
│                                                       │
│ ── Baseline certified ───────────────────────────    │
│    S-State: S1                                        │
│    Static Backed: 45/67                               │
│    Grounding: 55.0%                                   │
│    Q-Class: Q-BASELINE                                │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 7. Sandbox Isolation Rules

### 7.1 Isolation Guarantees

| # | Rule | Enforcement |
|---|------|-------------|
| SI-01 | Namespace isolation | Each client+run has independent sandbox state |
| SI-02 | No cross-namespace contamination | Overlay activations in one namespace cannot affect another |
| SI-03 | Baseline immutability | Certified baseline is read-only within sandbox |
| SI-04 | Overlay ordering determinism | Application order is monotonic by package_id within namespace |
| SI-05 | Freeze capability | Sandbox can be frozen (read-only) on governance trigger |
| SI-06 | Archive capability | Completed/abandoned sandboxes can be archived |

### 7.2 Sandbox Status Transitions

```
ACTIVE → FROZEN
  Trigger: zone enters PROHIBITED, or divergence detected
  Cockpit: shows FROZEN indicator with reason
  Actions: read-only (no activations, no certifications)

FROZEN → ACTIVE
  Trigger: zone recovers, or investigation resolves
  Cockpit: shows recovery notification
  Actions: full operations resume

ACTIVE → ARCHIVED
  Trigger: run complete and published, or run abandoned
  Cockpit: shows archived indicator
  Actions: read-only, lineage navigation only
```

---

## 8. Sandbox Observability

### 8.1 Sandbox Events

| # | Event | Trigger |
|---|-------|---------|
| SE-01 | SANDBOX_CREATED | New namespace initialized |
| SE-02 | OVERLAY_ACTIVATED | Overlay applied to sandbox |
| SE-03 | QUALIFICATION_CHANGED | Metrics changed by overlay |
| SE-04 | S_STATE_TRANSITIONED | S-state level changed |
| SE-05 | SANDBOX_FROZEN | Sandbox frozen by governance |
| SE-06 | SANDBOX_RESUMED | Sandbox resumed after freeze |
| SE-07 | SANDBOX_ARCHIVED | Sandbox archived |
| SE-08 | CONFLICT_RESOLVED | Overlay conflict resolved in sandbox |

---

## 9. Governance

- Sandbox namespace per client+run ensures isolation
- Overlay activation chain shows complete overlay progression with certification status
- Replay chain shows input inventory and reconstruction history
- Rollback chain shows dependency inventory and removability per overlay
- Qualification evolution trace shows metric progression over time
- 6 isolation rules prevent cross-namespace contamination
- Sandbox status transitions (ACTIVE, FROZEN, ARCHIVED) with governed triggers
- 8 sandbox events capture all operational state changes
- Sandbox operations remain isolated, observable, and recoverable
- Sandbox workspace is client-agnostic
