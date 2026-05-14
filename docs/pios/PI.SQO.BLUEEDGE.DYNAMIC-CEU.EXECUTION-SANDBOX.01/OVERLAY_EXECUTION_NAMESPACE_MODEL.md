# Overlay Execution Namespace Model

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines the execution namespace model — how overlay
operations are namespaced, isolated, and prevented from colliding
with certified state or other execution contexts.

---

## 2. Namespace Architecture

### 2.1 Namespace Definition

A sandbox execution namespace is a self-contained, addressable scope
within which all overlay operations (creation, validation, activation,
re-evaluation, revocation, replay) execute. The namespace is:

- Physically isolated (unique directory path)
- Logically bounded (scoped to one client + one run)
- Self-describing (manifest with identity and hash anchors)
- Independently destructible (deletion has no certified-side effects)

### 2.2 Namespace Identity

```json
{
  "namespace_id": "sandbox-blueedge-run01-<uuid>",
  "client": "blueedge",
  "run_id": "run_blueedge_productized_01_fixed",
  "created_at": "<ISO-8601>",
  "substrate_hash": "08480c17...",
  "baseline_hash": "<qualification baseline hash>",
  "status": "INITIALIZED | ACTIVE | SUSPENDED | CLOSED"
}
```

The namespace_id is globally unique. No two sandbox instances share
the same namespace_id, even for the same client and run.

### 2.3 Namespace Addressing

Every artifact inside the sandbox is addressed relative to the
namespace root:

```
Absolute: artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/sandbox/<path>
Relative: sandbox/<path>

Namespace root: artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/sandbox/
```

All sandbox operations resolve paths relative to the namespace root.
No operation may construct a path that escapes the namespace root.

---

## 3. Namespace Scoping Rules

### 3.1 One Namespace Per Client-Run Pair (Current Model)

The current sandbox model supports ONE active namespace per
(client, run_id) pair:

| Constraint | Value |
|-----------|-------|
| Max active namespaces per client-run | 1 |
| Concurrent overlay operations within namespace | Serialized (no concurrent mutation) |
| Namespace reuse | NOT permitted (close and create new) |

### 3.2 Namespace Lifecycle Scoping

| Phase | Namespace Requirement |
|-------|---------------------|
| Overlay registration (Phase 0) | Namespace MUST be INITIALIZED or ACTIVE |
| Overlay validation (Phase 1) | Namespace MUST be ACTIVE |
| Overlay activation (Phases 2-4) | Namespace MUST be ACTIVE |
| Re-evaluation (Phase 5) | Namespace MUST be ACTIVE |
| Qualification-visible (Phase 6) | Namespace MUST be ACTIVE |
| Revocation | Namespace MUST be ACTIVE or SUSPENDED |
| Replay reconstruction | Namespace may be ACTIVE, SUSPENDED, or CLOSED |
| Audit query | Namespace may be in ANY status |

### 3.3 Namespace Isolation Guarantees

| Property | Guarantee |
|----------|----------|
| Write isolation | All writes confined to namespace root |
| State isolation | Namespace state invisible to certified layer |
| Failure isolation | Namespace failure contained within namespace |
| Identity isolation | Namespace identity prevents artifact confusion |
| Temporal isolation | Namespace creation time anchors baseline reference |

---

## 4. Overlay Execution Within Namespace

### 4.1 Package Registration (Namespace-Scoped)

When a package enters the sandbox:

```
1. VERIFY namespace is INITIALIZED or ACTIVE
2. ASSIGN package_id within namespace scope
3. PERSIST package artifact to sandbox/packages/<package_id>/
4. REGISTER in sandbox/registry/package_registry.json
5. TAG with namespace_id and origin metadata
```

The package_id is unique within the namespace. Package IDs are
monotonically assigned: `SEP-<client>-<run_id_short>-<sequence>`.

### 4.2 Activation Execution (Namespace-Scoped)

All activation lifecycle phases (Phase 0-7) execute within the namespace:

```
Phase 0: sandbox/packages/<id>/package.json         ← package artifact
Phase 1: sandbox/activation/gate_records/<id>_gates.json ← validation record
Phase 2: sandbox/activation/gate_records/<id>_gates.json ← authorization record
Phase 3: sandbox/activation/gate_records/<id>_gates.json ← eligibility record
Phase 4: sandbox/registry/package_registry.json      ← status → ACTIVATED
Phase 5: sandbox/activation/reevaluation/<id>.json   ← re-evaluation artifact
Phase 6: sandbox/mount/composite_state.json          ← composite updated
Phase 7: sandbox/registry/package_registry.json      ← terminal state
```

Every artifact produced by the lifecycle is within the namespace.

### 4.3 Composite State Construction (Namespace-Scoped)

```
INPUT:
  certified_baseline ← READ from certified layer (hash-verified)
  activated_packages ← READ from sandbox/registry/ (status=ACTIVATED)
  package_artifacts  ← READ from sandbox/packages/

COMPUTE:
  composite = computeCompositeState(certified_baseline, activated_packages)

OUTPUT:
  sandbox/mount/composite_state.json ← WRITE to namespace only

PROPERTY:
  composite_state.json is a CACHE
  It can be deleted and recomputed from inputs at any time
  It is NEVER promoted to certified status
```

---

## 5. Namespace State Management

### 5.1 State Machine

```
INITIALIZED ──→ ACTIVE ──→ CLOSED
                  │  ↑
                  ▼  │
              SUSPENDED
```

| Transition | Trigger |
|-----------|---------|
| INITIALIZED → ACTIVE | First overlay operation |
| ACTIVE → SUSPENDED | Governance hold |
| SUSPENDED → ACTIVE | Governance release |
| ACTIVE → CLOSED | Explicit closure or lifecycle completion |
| SUSPENDED → CLOSED | Governance decision to close |

### 5.2 State Persistence

The namespace state is persisted in `sandbox/manifest.json`:

```json
{
  "namespace_id": "sandbox-blueedge-run01-<uuid>",
  "status": "ACTIVE",
  "status_history": [
    { "status": "INITIALIZED", "timestamp": "<t1>" },
    { "status": "ACTIVE", "timestamp": "<t2>", "trigger": "first_package_registered" }
  ],
  "overlay_summary": {
    "total_registered": 3,
    "activated": 2,
    "revoked": 0,
    "staged": 1
  }
}
```

---

## 6. Cross-Namespace Rules

### 6.1 No Cross-Namespace References

A namespace MUST NOT reference artifacts from another namespace:

- No package from namespace A may depend on a package in namespace B
- No composite state from namespace A may include overlays from namespace B
- No audit trail from namespace A may chain to events from namespace B

### 6.2 No Namespace Merging

Two namespaces MUST NOT be merged. If a new namespace is needed (e.g.,
after substrate re-execution), it is created fresh. Prior namespace
overlay packages may be re-evaluated and re-registered in the new
namespace, but this is a new registration (Phase 0), not a merge.

### 6.3 Closed Namespace Retention

A CLOSED namespace is retained for audit and historical replay.
Its artifacts are read-only. A closed namespace may be queried but
never written to.

---

## 7. BlueEdge Namespace Specifics

| Property | BlueEdge Value |
|----------|---------------|
| Client | blueedge |
| Run ID | run_blueedge_productized_01_fixed |
| Substrate hash | 08480c17... |
| Baseline S-state | S2 |
| Baseline Q-class | Q-02 |
| Baseline backed_count | 4/17 |
| Max packages per namespace | 10 (from operationalization limits) |
| Max entries per namespace | 200 (aggregate limit) |
| Max conflicts per namespace | 20 |

---

## 8. Governance Rules

1. One active namespace per client-run pair.
2. All overlay operations execute within namespace scope.
3. Package IDs are unique within namespace.
4. No cross-namespace references or merges.
5. Namespace writes are physically constrained to namespace root.
6. Namespace closure preserves audit trail for historical query.
7. Namespace identity is globally unique and non-reusable.
