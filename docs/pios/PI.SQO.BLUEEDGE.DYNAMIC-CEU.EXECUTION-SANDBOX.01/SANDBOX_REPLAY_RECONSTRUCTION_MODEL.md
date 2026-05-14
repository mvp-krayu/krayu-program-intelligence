# Sandbox Replay Reconstruction Model

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines how sandbox execution replay reconstructs
qualification state deterministically — from substrate version through
overlay application to composite evaluation.

---

## 2. Replay Input Set

Sandbox replay requires 6 inputs (extending the 5-input operationalization
model with sandbox context):

| Input | Source | Role |
|-------|--------|------|
| I-1: Substrate version | Certified layer (hash-verified) | Immutable structural and semantic foundation |
| I-2: Qualification baseline version | Certified layer (hash-verified) | Pre-overlay qualification state |
| I-3: Overlay package set | Sandbox registry | SEP artifacts at specific versions |
| I-4: Activation profile | Sandbox activation state | Which packages are ACTIVATED, in what order |
| I-5: Evaluation framework version | Governance-locked formulas | Q-class, S-state gate definitions |
| I-6: Sandbox manifest | Sandbox root | Namespace identity, creation time, baseline anchors |

### 2.1 Input Integrity Verification

Before replay reconstruction begins:

```
FOR EACH input IN {I-1, I-2, I-3, I-4, I-5, I-6}:
  COMPUTE input_hash = sha256(input_content)
  VERIFY input_hash matches recorded hash in replay snapshot
  IF mismatch:
    HALT: "REPLAY_INPUT_INTEGRITY_FAILURE — input <N> hash mismatch"
    REPORT which input failed and expected vs actual hash
```

---

## 3. Reconstruction Process

### Step 1 — Sandbox Context Verification

```
LOAD sandbox/manifest.json
VERIFY sandbox_id matches replay target
VERIFY substrate_hash matches I-1 hash
VERIFY baseline_hash matches I-2 hash
IF any mismatch: HALT with CONTEXT_MISMATCH
```

### Step 2 — Substrate Load

```
LOAD certified substrate from external path (hash-verified)
VERIFY topology hash = 08480c17... (BlueEdge)
VERIFY domain count = 17
VERIFY reproducibility = FULL_REPRODUCIBILITY
IF any check fails: HALT with SUBSTRATE_VERIFICATION_FAILURE
```

### Step 3 — Baseline Qualification Load

```
LOAD certified qualification baseline (hash-verified)
VERIFY S-state = S2
VERIFY Q-class = Q-02
VERIFY backed_count = 4/17
VERIFY decision_validation = 14/14 PASS
IF any check fails: HALT with BASELINE_VERIFICATION_FAILURE
```

### Step 4 — Overlay Package Load

```
LOAD overlay packages from sandbox/packages/
FOR EACH package in activation_profile (ordered by package_id):
  VERIFY package_hash matches registry record
  VERIFY package status matches activation_profile
  LOAD package artifact
IF any package fails verification: HALT with PACKAGE_INTEGRITY_FAILURE
```

### Step 5 — Overlay Application (Deterministic)

```
composite = deepClone(certified_baseline)
composite.overlay_contributions = []

FOR EACH package IN activated_packages (ordered by package_id):
  FOR EACH entry IN package.evidence_entries (ordered by entry_id):
    IF entry.semantic_class NOT IN package.authorized_classes:
      LOG rejection, SKIP entry
    ELSE:
      result = applyEntry(composite, entry)
      composite.overlay_contributions.push({
        package_id, entry_id, claim_type, target_domain,
        applied: result.success, conflict: result.conflict
      })
```

### Step 6 — Composite Metrics Computation

```
composite.static_backed_count = countCertifiedBacking(certified_baseline)
composite.overlay_backed_count = countOverlayBacking(composite.overlay_contributions)
composite.composite_backed_count = composite.static_backed_count + composite.overlay_backed_count

composite.q_class = resolveQClass(composite)
composite.s_state = evaluateSStateGates(composite)
composite.debt_inventory = recomputeDebt(composite)
composite.progression_readiness = computeReadiness(composite)
```

### Step 7 — Replay Verification

```
replay_hash = sha256(JSON.stringify(composite, sorted_keys))
IF replay snapshot exists:
  VERIFY replay_hash matches snapshot.composite_hash
  IF mismatch:
    REPORT: "REPLAY_DIVERGENCE — composite state differs from snapshot"
    PRESERVE both states for governance review
```

### Step 8 — Replay Artifact Emission

```
WRITE replay artifact to sandbox/replay/snapshots/<snapshot_id>.json:
{
  "snapshot_id": "<uuid>",
  "timestamp": "<ISO-8601>",
  "inputs": {
    "substrate_hash": "<hash>",
    "baseline_hash": "<hash>",
    "package_set_hash": "<hash of activated package list>",
    "activation_profile_hash": "<hash>",
    "framework_version": "<version>",
    "sandbox_id": "<id>"
  },
  "composite_hash": "<hash of computed composite>",
  "composite_summary": {
    "s_state": "<computed>",
    "q_class": "<computed>",
    "backed_count": { "static": 4, "overlay": N, "composite": 4+N },
    "overlay_count": M,
    "conflict_count": C
  },
  "verification": "MATCH | DIVERGENCE | FIRST_SNAPSHOT"
}
```

---

## 4. Replay Scenarios

### 4.1 Baseline Replay (Zero Overlays)

```
Inputs:  substrate + baseline + empty overlay set
Result:  composite = certified baseline exactly
         S2, Q-02, 4/17 backed, 0 overlay contributions
Purpose: Verify sandbox produces certified state when no overlays active
```

### 4.2 Single Overlay Replay

```
Inputs:  substrate + baseline + [SEP-001 ACTIVATED]
Result:  composite = baseline + SEP-001 contributions
         S2, Q-02, (4+N)/17 backed
Purpose: Verify single overlay application is deterministic
```

### 4.3 Multi-Overlay Replay

```
Inputs:  substrate + baseline + [SEP-001, SEP-002, SEP-003 ACTIVATED]
Result:  composite = baseline + all overlay contributions (applied in order)
         Possible S3, Q-01 if backed reaches 17/17
Purpose: Verify multi-overlay stacking is deterministic and order-stable
```

### 4.4 Post-Revocation Replay

```
Inputs:  substrate + baseline + [SEP-001, SEP-003 ACTIVATED] (SEP-002 REVOKED)
Result:  composite = baseline + contributions from 001 and 003 only
         SEP-002 contributions absent from composite
Purpose: Verify independent removability — result equals "SEP-002 never existed"
```

### 4.5 Version Rollback Replay

```
Inputs:  substrate + baseline + [SEP-001.v1 ACTIVATED] (SEP-001.v2 SUPERSEDED)
Result:  composite = baseline + SEP-001.v1 contributions
         v2 contributions absent, v1 contributions present
Purpose: Verify version rollback produces deterministic prior-version state
```

---

## 5. Replay Determinism Guarantees

| Guarantee | Enforcement |
|-----------|------------|
| Same inputs → same composite | Pure function computation, no side effects |
| Overlay application order is fixed | package_id monotonic sequence |
| Entry application order is fixed | entry_id monotonic within package |
| Conflict resolution is deterministic | Later wins, higher confidence overrides |
| Hash verification detects drift | Input and output hashes compared |
| Sandbox context prevents cross-contamination | Replay scoped to single namespace |

---

## 6. Replay Failure Handling

| Failure | Response |
|---------|----------|
| Input integrity failure | HALT — identify which input changed |
| Substrate hash mismatch | HALT — substrate may have been re-executed |
| Composite divergence | PRESERVE both states, ESCALATE to governance |
| Package artifact missing | HALT — registry/artifact inconsistency |
| Activation profile inconsistency | HALT — registry/state machine mismatch |
| Framework version mismatch | HALT — evaluation formula may have changed |

All replay failures are logged in `sandbox/replay/verification_log.json`
with full context for governance review.

---

## 7. Governance Rules

1. Replay reconstruction is deterministic — same inputs produce same output.
2. All 6 inputs are hash-verified before reconstruction.
3. Replay snapshots are retained for verification.
4. Replay divergence is a governance event requiring escalation.
5. No replay operation modifies certified state.
6. Replay executes entirely within sandbox namespace.
