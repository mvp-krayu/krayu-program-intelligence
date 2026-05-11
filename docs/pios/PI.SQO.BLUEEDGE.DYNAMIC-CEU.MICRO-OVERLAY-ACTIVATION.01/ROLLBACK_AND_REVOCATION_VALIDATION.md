# Rollback and Revocation Validation

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.MICRO-OVERLAY-ACTIVATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Wave:** 6 — First Controlled Semantic Execution

---

## 1. Purpose

This document validates that overlay revocation restores the original
qualification state exactly and that all rollback guarantees hold.

---

## 2. Revocation Execution

| Property | Value |
|----------|-------|
| Package revoked | SEP-blueedge-run01-001 |
| Revocation type | STANDARD |
| Revocation reason | Micro-activation proof complete |
| Revocation authority | stream_contract |
| Revocation timestamp | 2026-05-11T22:00:08.000Z |
| Dependent packages | NONE |
| Dependency block | N/A |

---

## 3. State Restoration Verification

### 3.1 Qualification State

| Metric | Pre-Activation | During Activation | Post-Revocation | Restored? |
|--------|---------------|-------------------|-----------------|-----------|
| S-state | S2 | S2 | S2 | YES |
| Q-class | Q-02 | Q-02 | Q-02 | YES |
| backed_count | 4/17 | 5/17 | 4/17 | YES |
| grounding_ratio | 0.235 | 0.294 | 0.235 | YES |
| DOMAIN-11 lineage | PARTIAL | STRONG | PARTIAL | YES |
| Composite hash | e7fd21c4... | sha256:comp... | e7fd21c4... | YES |

**All qualification metrics restored to pre-activation values.**

### 3.2 Unaffected Elements

| Element | Verified Unchanged |
|---------|-------------------|
| Certified substrate (topology) | YES — hash fb04994a... unchanged |
| DPSIG signals | YES — hash 21b1d380... unchanged |
| Certified qualification baseline | YES — hash e7fd21c4... unchanged |
| Continuity assessment | YES — hash 9d9d6c68... unchanged |
| Decision validation (14/14) | YES — not touched |
| Reproducibility verdict (FULL) | YES — not touched |

### 3.3 Overlay Artifact Retention

| Artifact | Status After Revocation |
|----------|----------------------|
| Package artifact (package.json) | RETAINED — status REVOKED |
| Activation record | RETAINED — includes full lifecycle |
| Mount registry entry | RETAINED — mount_status UNMOUNTED |
| Registry entry | RETAINED — status REVOKED |
| Audit events | RETAINED — revocation event appended |
| Replay snapshots | RETAINED — all 3 snapshots preserved |
| Re-evaluation artifact | RETAINED — historical record |

**No artifacts deleted.** All package artifacts retained with REVOKED
status for audit, replay, and historical reconstruction.

---

## 4. Independent Removability Proof

### 4.1 Hash Comparison

```
Pre-activation composite hash:  e7fd21c49a4e7d1585147326f17df1c7ab8dc13889cea613d4eb27251cebe10c
Post-revocation composite hash: e7fd21c49a4e7d1585147326f17df1c7ab8dc13889cea613d4eb27251cebe10c

MATCH: YES
```

### 4.2 Interpretation

Removing SEP-blueedge-run01-001 from the composite is equivalent to
the package never having been activated. The composite state after
revocation is byte-identical to the baseline state before activation.

This confirms the independent removability guarantee: revoking an
overlay produces the same state as if the overlay had never existed.

---

## 5. Rollback Determinism

### 5.1 Determinism Test

| Test | Procedure | Result |
|------|-----------|--------|
| Revoke and recompute | Remove overlay, recompute composite | Hash matches baseline |
| Replay without overlay | Reconstruct from (baseline + empty overlay set) | Hash matches baseline |
| Compare with Snapshot 001 | Compare against baseline snapshot | Hash matches exactly |

### 5.2 Conclusion

Rollback is deterministic: the same revocation operation always
produces the same qualification state, and that state matches the
certified baseline exactly.

---

## 6. Replay Chain Preservation

| Property | After Revocation |
|----------|-----------------|
| Package artifacts | Present (status: REVOKED) |
| Activation history | Complete (all phases recorded) |
| Revocation event | Logged in audit trail |
| Replay snapshots | 3 snapshots preserved (baseline, activated, revoked) |
| Audit chain | 10 events, hash chain valid |
| Reconstruction inputs | All 6 inputs preserved |

**The full activation→revocation cycle is reconstructable from
audit trail and replay snapshots.** Nothing was deleted or lost
during revocation.

---

## 7. Governance

1. Revocation restored all qualification metrics to baseline values.
2. Certified artifacts remained unchanged throughout.
3. All overlay artifacts retained (no deletion on revocation).
4. Independent removability confirmed via hash comparison.
5. Rollback is deterministic (same operation → same result).
6. Replay chain preserved for historical reconstruction.
7. Audit trail integrity maintained through revocation.
