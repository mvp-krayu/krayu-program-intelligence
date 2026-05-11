# Replay Reconstruction Model

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines how any qualification state — at any point in time,
with any combination of overlay activations — can be exactly reconstructed
from its inputs. Replay reconstruction is the ultimate guarantee that
Dynamic CEU activation produces no hidden, non-reproducible state.

---

## 2. Replay Reconstruction Principle

A qualification state is FULLY RECONSTRUCTABLE if and only if:

```
qualification_state == f(
    substrate_version,
    evidence_package_set,
    overlay_activation_set,
    dynamic_ceu_activation_profile,
    qualification_evaluation_version
)
```

Given these 5 inputs, the qualification state is a deterministic
pure function. No additional state, no external dependency, no
inference, no randomness.

---

## 3. Replay Inputs

### 3.1 Substrate Version

**Definition:** The certified structural substrate at the time of evaluation.

**Identifier:** `(client, run_id, pipeline_commit_hash)`

**Contents:**
- canonical_topology
- dpsig signals (CPI, CFA)
- semantic_model
- crosswalk
- decision_validation
- reproducibility_verdict
- rendering_metadata

**Immutability guarantee:** The substrate is pipeline-derived and hash-verified.
It does not change between replay attempts.

### 3.2 Evidence Package Set

**Definition:** The complete set of SEP artifacts that existed at the
time of evaluation, regardless of their status.

**Identifier:** `(client, run_id, package_registry_snapshot)`

**Contents:**
- All SEP artifacts (STAGED, ACTIVATED, REVOKED, SUPERSEDED)
- Package registry state at the replay point

**Immutability guarantee:** SEP artifacts are never modified or deleted.
Package versions are monotonic and immutable once persisted.

### 3.3 Overlay Activation Set

**Definition:** The subset of the evidence package set that was ACTIVATED
at the specific replay point in time.

**Identifier:** `{(package_id, version, status=ACTIVATED)}`

**Derivation:** From the package registry state at the replay timestamp.

### 3.4 Dynamic CEU Activation Profile

**Definition:** The configuration parameters governing overlay application:
- Conflict resolution rules (version at replay time)
- Semantic class authorization enforcement rules
- Grounding boundary evidence standards
- Aggregate limits

**Identifier:** `activation_profile_version`

**Immutability guarantee:** Activation profile is versioned. If rules
change, the version increments and prior versions are retained.

### 3.5 Qualification Evaluation Version

**Definition:** The version of the qualification evaluation framework:
- Q-class formula version
- S-state gate definitions version
- Debt classification rules version
- Maturity scoring formula version

**Identifier:** `evaluation_framework_version`

**Immutability guarantee:** Evaluation framework is governance-locked.
Changes require explicit governance specification.

---

## 4. Replay Reconstruction Process

```
REPLAY RECONSTRUCTION
    │
    ▼
1. LOAD substrate by (client, run_id, pipeline_commit_hash)
   VERIFY substrate hash matches stored hash
    │
    ▼
2. LOAD package registry at replay timestamp
   IDENTIFY which packages were ACTIVATED at that time
    │
    ▼
3. LOAD each ACTIVATED package artifact
   VERIFY each package hash matches stored hash
    │
    ▼
4. LOAD activation profile at replay timestamp
   IDENTIFY which conflict resolution rules were active
    │
    ▼
5. APPLY overlays in deterministic order
   (package_id sequence order, entry_id sequence within)
   Apply conflict resolution rules from the activation profile
    │
    ▼
6. COMPUTE composite semantic state
   static_backed_count + overlay_backed_count = composite_backed_count
    │
    ▼
7. RESOLVE Q-class using evaluation framework at replay version
   Same formula, same gate definitions, same debt rules
    │
    ▼
8. COMPARE with stored qualification state at replay point
   │
   ├── MATCH → REPLAY VERIFIED
   │
   └── MISMATCH → REPLAY FAILURE
       Escalate for investigation
       Report: expected hash, actual hash, divergence point
```

---

## 5. Replay Verification

### 5.1 Full Replay Verification

Verifies that the stored qualification state at a specific point
matches a fresh reconstruction:

```
stored_state = LOAD qualification_state_at(timestamp)
reconstructed_state = REPLAY(substrate, overlays_at(timestamp),
                             profile_at(timestamp), framework_at(timestamp))
ASSERT hash(stored_state) == hash(reconstructed_state)
```

### 5.2 Differential Replay Verification

Verifies that a specific state change (e.g., from activation or
revocation) produces the expected delta:

```
state_before = REPLAY(substrate, overlays_before_event, profile, framework)
state_after = REPLAY(substrate, overlays_after_event, profile, framework)
expected_delta = stored_re_evaluation_artifact.changes
actual_delta = DIFF(state_before, state_after)
ASSERT expected_delta == actual_delta
```

### 5.3 Removal Replay Verification

Verifies the independent removability guarantee:

```
state_with_all = REPLAY(substrate, all_overlays, profile, framework)
state_without_X = REPLAY(substrate, all_overlays - package_X, profile, framework)
state_if_X_never_existed = REPLAY(substrate, all_overlays_except_X_from_creation,
                                   profile, framework)
ASSERT state_without_X == state_if_X_never_existed
```

---

## 6. Replay Snapshot

To enable efficient replay, the system maintains replay snapshots:

```json
{
  "snapshot_id": "<uuid>",
  "timestamp": "<ISO-8601>",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "substrate_hash": "<sha256 of certified substrate>",
  "active_packages": [
    { "package_id": "SEP-001", "version": 2, "hash": "<sha256>" },
    { "package_id": "SEP-002", "version": 1, "hash": "<sha256>" }
  ],
  "activation_profile_version": "1.0",
  "evaluation_framework_version": "1.0",
  "composite_state_hash": "<sha256 of composite state>",
  "qualification_state": {
    "s_state": "S2",
    "q_class": "Q-02",
    "composite_backed_count": 5,
    "total_count": 17
  }
}
```

Snapshots are created:
- After every re-evaluation
- After every activation or revocation
- On demand for audit

---

## 7. Replay Failure Handling

If replay reconstruction produces a different result than the stored state:

### 7.1 Investigation

1. Identify the divergence point (which step produced different output)
2. Check substrate integrity (hash mismatch = substrate corruption)
3. Check package integrity (hash mismatch = package corruption)
4. Check application order (ordering error = implementation bug)
5. Check conflict resolution (rule version mismatch = profile error)
6. Check evaluation formula (version mismatch = framework error)

### 7.2 Resolution

| Cause | Resolution |
|-------|-----------|
| Substrate hash mismatch | Substrate corruption — escalate to pipeline team |
| Package hash mismatch | Package corruption — restore from backup or re-ingest |
| Application order error | Implementation bug — fix and re-verify |
| Conflict resolution mismatch | Profile versioning error — correct profile |
| Formula version mismatch | Framework versioning error — correct version reference |
| No identifiable cause | Escalate to governance audit |

### 7.3 Replay Failure Governance

Replay failure is a GOVERNANCE EVENT. It means the system cannot prove
that a qualification state was correctly computed. This triggers:

1. Freeze all activation/revocation for the affected (client, run_id)
2. Investigate root cause
3. Recompute qualification state from verified inputs
4. Issue corrected qualification state
5. Audit all re-evaluations that occurred since the divergence

---

## 8. Governance Rules

1. Every qualification state MUST be replay-reconstructable from its 5 inputs.
2. Replay snapshots MUST be created after every state change.
3. Replay verification MAY be executed at any time (audit on demand).
4. Replay failure is a governance event requiring investigation.
5. No qualification state may be accepted without replay verification capability.
6. Replay inputs are never deleted (permanent retention).
7. Replay reconstruction is a pure function — no external state, no inference.
