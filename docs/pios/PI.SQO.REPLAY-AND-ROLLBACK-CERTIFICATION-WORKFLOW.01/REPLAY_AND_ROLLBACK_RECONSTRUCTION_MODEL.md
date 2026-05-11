# Replay and Rollback Reconstruction Model

**Stream:** PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the deterministic reconstruction model shared by both replay
certification and rollback certification — the computational core
that proves composite state is reconstructable from its inputs and
that any overlay can be independently removed.

---

## 2. Reconstruction Primitives

### 2.1 Five Reconstruction Primitives

| # | Primitive | Description | Used By |
|---|-----------|-------------|---------|
| RP-01 | Baseline load | Load certified baseline as starting state | Replay, Rollback |
| RP-02 | Overlay application | Apply single overlay to composite in deterministic order | Replay, Rollback |
| RP-03 | Conflict resolution | Resolve domain+field conflicts by deterministic rules | Replay, Rollback |
| RP-04 | Metric computation | Compute qualification metrics from composite state | Replay, Rollback |
| RP-05 | State hashing | Produce deterministic hash of composite state | Replay, Rollback |

### 2.2 Primitive Determinism Requirements

```
RP-01: Baseline Load
  - Input: certified_baseline_hash
  - Output: deepClone(baseline_state)
  - Determinism: identical hash → identical state (hash-verified)
  - Side effects: NONE

RP-02: Overlay Application
  - Input: composite_state, overlay, application_position
  - Output: composite_state with overlay contributions applied
  - Determinism: monotonic package_id + entry_id ordering
  - Side effects: contribution_records appended (ordered)
  - Authorization: entry.semantic_class must be authorized

RP-03: Conflict Resolution
  - Input: composite_state with overlapping contributions
  - Output: composite_state with conflicts resolved
  - Determinism: rule-based (later wins, higher confidence wins)
  - Side effects: conflict_resolution_records appended (ordered)
  - Tie-breaking: higher package_id wins

RP-04: Metric Computation
  - Input: composite_state with all contributions applied
  - Output: qualification metrics (backed_count, grounding_ratio, Q-class)
  - Determinism: pure function (no external state)
  - Side effects: NONE

RP-05: State Hashing
  - Input: composite_state
  - Output: sha256(JSON.stringify(state, sorted_keys))
  - Determinism: sorted keys guarantee canonical serialization
  - Side effects: NONE
```

---

## 3. Replay Reconstruction Model

### 3.1 Replay Reconstruction Sequence

```
FUNCTION replayReconstruct(baseline, overlays, resolutions, params, config):

  // Step 1: Load baseline
  composite = RP-01(baseline)
  reconstruction_log = []
  
  // Step 2: Apply overlays in order
  FOR i = 0 TO overlays.length - 1:
    overlay = overlays[i]  // ordered by package_id
    
    FOR j = 0 TO overlay.entries.length - 1:
      entry = overlay.entries[j]  // ordered by entry_id
      
      IF NOT isAuthorized(entry.semantic_class, overlay.type):
        reconstruction_log.push({
          action: "SKIP",
          reason: "UNAUTHORIZED_CLASS",
          overlay: overlay.package_id,
          entry: entry.entry_id
        })
        CONTINUE
      
      contribution = applyEntry(composite, entry)
      composite.contributions.push(contribution)
      reconstruction_log.push({
        action: "APPLY",
        overlay: overlay.package_id,
        entry: entry.entry_id,
        domain: entry.domain,
        field: entry.field
      })
  
  // Step 3: Resolve conflicts
  conflicts = detectConflicts(composite)
  FOR each conflict in conflicts:
    resolution = RP-03(conflict)
    composite = applyResolution(composite, resolution)
    reconstruction_log.push({
      action: "RESOLVE",
      domain: conflict.domain,
      field: conflict.field,
      winner: resolution.winner_package_id
    })
  
  // Step 4: Compute metrics
  composite.metrics = RP-04(composite, params)
  
  // Step 5: Hash
  composite_hash = RP-05(composite)
  
  RETURN {
    composite: composite,
    hash: composite_hash,
    log: reconstruction_log
  }
```

### 3.2 Replay Verification Protocol

```
FUNCTION verifyReplay(current_composite, baseline, overlays, resolutions, params, config):

  // Reconstruct
  result = replayReconstruct(baseline, overlays, resolutions, params, config)
  
  // Compare
  current_hash = RP-05(current_composite)
  
  IF result.hash == current_hash:
    RETURN { status: "MATCH", reconstructed_hash: result.hash, current_hash: current_hash }
  ELSE:
    delta = computeDelta(result.composite, current_composite)
    RETURN { status: "DIVERGENCE", reconstructed_hash: result.hash, current_hash: current_hash, delta: delta }
```

---

## 4. Rollback Reconstruction Model

### 4.1 Rollback Reconstruction Sequence

```
FUNCTION rollbackReconstruct(baseline, overlays, target_overlay_id, resolutions, params, config):

  // Step 1: Filter overlay set
  remaining_overlays = overlays.filter(o => o.package_id != target_overlay_id)
  
  // Step 2: Reconstruct WITHOUT target overlay
  composite = RP-01(baseline)
  rollback_log = []
  
  FOR each overlay in remaining_overlays:  // ordered by package_id
    FOR each entry in overlay.entries:  // ordered by entry_id
      
      IF NOT isAuthorized(entry.semantic_class, overlay.type):
        rollback_log.push({
          action: "SKIP",
          reason: "UNAUTHORIZED_CLASS",
          overlay: overlay.package_id,
          entry: entry.entry_id
        })
        CONTINUE
      
      contribution = applyEntry(composite, entry)
      composite.contributions.push(contribution)
      rollback_log.push({
        action: "APPLY",
        overlay: overlay.package_id,
        entry: entry.entry_id
      })
  
  // Step 3: Resolve conflicts (without target overlay)
  conflicts = detectConflicts(composite)
  FOR each conflict in conflicts:
    resolution = RP-03(conflict)
    composite = applyResolution(composite, resolution)
    rollback_log.push({
      action: "RESOLVE",
      domain: conflict.domain,
      field: conflict.field,
      winner: resolution.winner_package_id
    })
  
  // Step 4: Compute metrics (without target overlay)
  composite.metrics = RP-04(composite, params)
  
  // Step 5: Hash
  composite_hash = RP-05(composite)
  
  RETURN {
    composite: composite,
    hash: composite_hash,
    log: rollback_log,
    removed_overlay: target_overlay_id
  }
```

### 4.2 Rollback Verification Protocol

```
FUNCTION verifyRollback(current_composite, baseline, overlays, target_overlay_id, resolutions, params, config):

  // Reconstruct without target
  result = rollbackReconstruct(baseline, overlays, target_overlay_id, resolutions, params, config)
  
  // Compute expected state via removal
  simulated = deepClone(current_composite)
  removeContributions(simulated, target_overlay_id)
  recomputeConflictResolutions(simulated)
  simulated.metrics = RP-04(simulated, params)
  simulated_hash = RP-05(simulated)
  
  // Compare reconstruction vs simulation
  IF result.hash == simulated_hash:
    RETURN {
      status: "VERIFIED",
      reconstruction_hash: result.hash,
      simulation_hash: simulated_hash,
      match: true
    }
  ELSE:
    delta = computeDelta(result.composite, simulated)
    RETURN {
      status: "DIVERGED",
      reconstruction_hash: result.hash,
      simulation_hash: simulated_hash,
      match: false,
      delta: delta
    }
```

---

## 5. Determinism Guarantees

### 5.1 Eight Determinism Invariants

| # | Invariant | Enforcement |
|---|-----------|-------------|
| DI-01 | Same baseline → same starting state | Hash-verified baseline load |
| DI-02 | Same overlay set → same contributions | Monotonic package_id ordering |
| DI-03 | Same entries → same domain+field effects | Monotonic entry_id ordering |
| DI-04 | Same conflicts → same resolutions | Rule-based resolution (later wins, higher confidence) |
| DI-05 | Same contributions → same metrics | Pure function computation |
| DI-06 | Same state → same hash | Sorted-key canonical serialization |
| DI-07 | No external state consulted | Reconstruction uses only provided inputs |
| DI-08 | No randomness or timing dependency | No stochastic operations in reconstruction |

### 5.2 Determinism Verification

```
FUNCTION verifyDeterminism(baseline, overlays, resolutions, params, config):

  // Execute reconstruction twice
  result1 = replayReconstruct(baseline, overlays, resolutions, params, config)
  result2 = replayReconstruct(baseline, overlays, resolutions, params, config)
  
  IF result1.hash != result2.hash:
    RETURN {
      deterministic: false,
      hash1: result1.hash,
      hash2: result2.hash,
      severity: "CRITICAL"
    }
  
  RETURN {
    deterministic: true,
    hash: result1.hash,
    executions: 2
  }
```

---

## 6. Reconstruction Failure Modes

### 6.1 Seven Reconstruction Failure Types

| # | Failure | Detection | Recovery |
|---|---------|-----------|----------|
| RF-01 | Baseline not found | RP-01 returns null | Investigate artifact store |
| RF-02 | Baseline hash mismatch | RP-01 hash differs from certified | Investigate baseline drift |
| RF-03 | Overlay not found | RP-02 cannot load overlay | Investigate package registry |
| RF-04 | Overlay hash mismatch | RP-02 hash differs from registration | Investigate package integrity |
| RF-05 | Unauthorized semantic class | RP-02 encounters unauthorized class | Log as SKIP, continue |
| RF-06 | Conflict resolution divergence | RP-03 produces different resolution | Investigate resolution rules |
| RF-07 | Non-deterministic hash | RP-05 produces different hashes for same state | CRITICAL — investigate serialization |

### 6.2 Failure Classification

```
CRITICAL failures (reconstruction cannot complete):
  RF-01, RF-02, RF-07
  → Certification DENIED
  → G-4 escalation
  → Sandbox freeze

RECOVERABLE failures (reconstruction can continue):
  RF-03, RF-04 (if single overlay, others unaffected)
  → Partial certification possible
  → Affected overlay excluded

INFORMATIONAL failures (logged but reconstruction continues):
  RF-05 (unauthorized class skip is expected behavior)
  → Logged in reconstruction log

INVESTIGATION-REQUIRED failures:
  RF-06 (conflict resolution divergence)
  → May indicate rule change since activation
  → Configuration version mismatch check required
```

---

## 7. Reconstruction Audit Trail

### 7.1 Audit Record Structure

```json
{
  "reconstruction_audit": {
    "audit_id": "RAUD-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "type": "REPLAY | ROLLBACK",
    "inputs": {
      "baseline_hash": "<sha256>",
      "overlay_count": 3,
      "overlay_ids": ["SEP-001", "SEP-002", "SEP-003"],
      "conflict_count": 2,
      "params_version": "v1.0",
      "config_version": "v1.0"
    },
    "execution": {
      "entries_applied": 47,
      "entries_skipped": 0,
      "conflicts_resolved": 2,
      "metrics_computed": true
    },
    "output": {
      "composite_hash": "<sha256>",
      "determinism_verified": true,
      "execution_time_ms": 150
    },
    "log_entries": 49
  }
}
```

---

## 8. Governance

- 5 reconstruction primitives are the computational core for both replay and rollback
- Every primitive has defined inputs, outputs, determinism requirements, and side-effect guarantees
- Replay reconstruction builds composite from baseline + all overlays
- Rollback reconstruction builds composite from baseline + all overlays EXCEPT target
- 8 determinism invariants enforced across all reconstructions
- 7 failure modes classified by severity with defined recovery
- Double-execution determinism verification detects non-deterministic reconstruction
- Complete reconstruction audit trail for every certification attempt
- No external state consulted during reconstruction
- Reconstruction model is client-agnostic
