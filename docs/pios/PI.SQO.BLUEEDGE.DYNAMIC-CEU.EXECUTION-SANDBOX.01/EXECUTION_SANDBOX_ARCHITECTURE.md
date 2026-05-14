# Execution Sandbox Architecture

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines the execution sandbox architecture — the isolated
operational environment within which future Dynamic CEU overlays execute
against BlueEdge semantic qualification state. The sandbox is the final
safety layer before real semantic overlay execution.

---

## 2. Core Principle

**The sandbox is a mounted semantic operational layer, NOT a mutation
environment.**

Overlays activate, materialize, coexist, replay, and revoke INSIDE the
sandbox. The certified substrate and certified qualification baselines
remain immutable and externally isolated OUTSIDE the sandbox.

```
┌──────────────────────────────────────────────────────────┐
│                    EXTERNAL / IMMUTABLE                    │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Certified Substrate (PATH A output)                │    │
│  │  - 123 nodes, 19 clusters                          │    │
│  │  - Canonical topology hash: 08480c17...            │    │
│  │  - DPSIG (Lane D sovereign)                        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Certified Qualification Baseline                   │    │
│  │  - S2, Q-02, 4/17 backed                          │    │
│  │  - Rendering metadata hash: 869d49549f...          │    │
│  │  - 14/14 decision validation                       │    │
│  │  - FULL_REPRODUCIBILITY                            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  ════════════════════ ISOLATION BOUNDARY ════════════════   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │              SANDBOX EXECUTION NAMESPACE             │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  Overlay Mount Layer                          │   │    │
│  │  │  - Mounted packages (SEP-xxx)                 │   │    │
│  │  │  - Computed composite state                   │   │    │
│  │  │  - Mount registry                             │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  Activation State                             │   │    │
│  │  │  - State machine transitions                  │   │    │
│  │  │  - Gate passage records                       │   │    │
│  │  │  - Re-evaluation artifacts                    │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  Replay & Audit                               │   │    │
│  │  │  - Replay snapshots                           │   │    │
│  │  │  - Audit event trail (hash-chained)           │   │    │
│  │  │  - Recovery checkpoints                       │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Architecture Components

### 3.1 Certified Reference Layer (External, Read-Only)

The certified reference layer is the immutable foundation that the sandbox
reads but NEVER writes. It includes:

| Component | Location | Sandbox Access |
|-----------|----------|---------------|
| Canonical topology | `artifacts/semantic/<client>/<run_id>/` | READ-ONLY |
| DPSIG signal set | `artifacts/dpsig/<client>/<run_id>/` | READ-ONLY |
| Qualification baseline | `artifacts/sqo/<client>/<run_id>/` | READ-ONLY (certified subset) |
| Rendering metadata | `artifacts/reports/<client>/<run_id>/` | READ-ONLY |

### 3.2 Sandbox Execution Namespace

The sandbox execution namespace is the isolated space where all overlay
execution occurs:

| Component | Purpose |
|-----------|---------|
| Overlay mount layer | Holds mounted overlay packages and computed composite state |
| Activation state | Tracks state machine transitions, gate passages, re-evaluation |
| Replay subsystem | Maintains replay snapshots and reconstruction inputs |
| Audit subsystem | Hash-chained audit event trail |
| Recovery subsystem | Rollback points, cleanup manifests |

### 3.3 Isolation Boundary

The isolation boundary separates certified from sandbox state:

| Property | Enforcement |
|----------|------------|
| Direction | Certified → Sandbox: READ. Sandbox → Certified: NEVER |
| Reference model | Sandbox references certified by hash, not by file handle |
| Write scope | All sandbox writes constrained to sandbox namespace |
| Failure containment | Sandbox failure cannot propagate across boundary |
| Cleanup | Deleting sandbox namespace has zero certified-side effects |

---

## 4. Sandbox Namespace Structure

```
artifacts/sqo/<client>/<run_id>/
├── <existing certified artifacts>           ← IMMUTABLE
│
└── sandbox/                                 ← SANDBOX ROOT
    ├── manifest.json                        ← sandbox instance metadata
    ├── baseline_reference.json              ← hash reference to certified state
    │
    ├── mount/                               ← OVERLAY MOUNT LAYER
    │   ├── mount_registry.json              ← mounted packages and status
    │   ├── composite_state.json             ← computed composite (not truth)
    │   └── mount_log.json                   ← mount/unmount event history
    │
    ├── packages/                            ← OVERLAY PACKAGE STORE
    │   ├── <package_id>/
    │   │   ├── package.json                 ← SEP artifact (immutable once staged)
    │   │   └── activation_record.json       ← activation state for this package
    │   └── ...
    │
    ├── registry/                            ← PACKAGE REGISTRY
    │   └── package_registry.json            ← authoritative overlay status
    │
    ├── activation/                          ← ACTIVATION STATE
    │   ├── state_machine.json               ← current state machine snapshot
    │   ├── gate_records/                    ← per-package gate passage records
    │   │   └── <package_id>_gates.json
    │   └── reevaluation/                    ← re-evaluation artifacts
    │       └── <reevaluation_id>.json
    │
    ├── replay/                              ← REPLAY SUBSYSTEM
    │   ├── reconstruction_inputs.json       ← current replay input set
    │   ├── snapshots/                       ← point-in-time replay snapshots
    │   │   └── <snapshot_id>.json
    │   └── verification_log.json            ← replay verification results
    │
    ├── audit/                               ← AUDIT SUBSYSTEM
    │   ├── events/                          ← individual audit events
    │   │   └── <event_id>.json
    │   ├── audit_index.json                 ← ordered event index
    │   └── audit_integrity.json             ← hash chain verification
    │
    └── recovery/                            ← RECOVERY SUBSYSTEM
        ├── rollback_points/                 ← named rollback snapshots
        │   └── <rollback_point_id>.json
        └── cleanup_manifest.json            ← cleanup state and history
```

---

## 5. Sandbox Lifecycle

### 5.1 Sandbox Creation

```
1. VERIFY certified substrate exists and hash-verifies
2. VERIFY certified qualification baseline exists
3. CREATE sandbox/ directory namespace
4. WRITE manifest.json with:
   - sandbox_id (unique)
   - client: "blueedge"
   - run_id: "run_blueedge_productized_01_fixed"
   - created_at: <timestamp>
   - substrate_hash: <certified substrate hash>
   - baseline_hash: <certified qualification baseline hash>
   - status: INITIALIZED
5. WRITE baseline_reference.json with hash pointers to certified state
6. INITIALIZE empty mount_registry, package_registry, audit_index
7. TAKE initial replay snapshot (baseline-only, zero overlays)
8. LOG sandbox creation event
```

### 5.2 Sandbox Operational State

The sandbox has 4 operational states:

| State | Description |
|-------|------------|
| INITIALIZED | Created, no overlays mounted |
| ACTIVE | One or more overlays mounted and contributing |
| SUSPENDED | Governance hold — no new activations permitted |
| CLOSED | Terminal — no further operations; preserved for audit |

### 5.3 Sandbox Closure

```
1. VERIFY all pending activation transactions complete or rolled back
2. MARK all mounted overlays with closure disposition:
   - RETAINED (overlay contributions finalized)
   - REVOKED (overlay withdrawn at closure)
3. TAKE final replay snapshot
4. VERIFY audit trail integrity (hash chain)
5. WRITE closure record in manifest.json
6. TRANSITION sandbox status to CLOSED
7. LOG sandbox closure event
```

---

## 6. Sandbox Invariants

| Invariant | Enforcement |
|-----------|------------|
| Certified artifacts never modified | Write scope physically constrained to sandbox/ |
| Composite state is computed, not persisted as truth | composite_state.json is a cache; recomputable from inputs |
| Every overlay retains visible origin | mount_registry tracks package_id, version, source for every mount |
| Sandbox deletion is safe | Removing sandbox/ restores pure certified-only evaluation |
| Replay is deterministic within sandbox | Same inputs → same composite state → same qualification |
| No cross-sandbox contamination | Each sandbox instance has unique namespace (future: multiple) |
| Audit trail is immutable | Hash-chained, append-only event log |

---

## 7. Governance

- No overlay execution occurs outside the sandbox namespace
- No certified artifact is referenced by mutable file handle
- No sandbox operation modifies PATH A, PATH B, or LENS artifacts
- The sandbox is an SQO-internal operational mechanism
- Sandbox specification only — no runtime implementation in this contract
