# Certified Baseline Protection Model

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines how BlueEdge certified baselines remain immutable,
reconstructable, externally recoverable, and overlay-independent — even
when overlays are actively executing inside the sandbox.

---

## 2. Protected Baseline Elements

### 2.1 Structural Baseline (PATH A Output)

| Element | Hash | Protection |
|---------|------|-----------|
| Canonical topology | 08480c17... | IMMUTABLE — no sandbox write path exists |
| Node inventory (123 nodes) | Contained in topology hash | IMMUTABLE |
| Cluster inventory (19 clusters) | Contained in topology hash | IMMUTABLE |
| Edge typing | Contained in topology hash | IMMUTABLE |
| DPSIG signals (CPI/CFA) | Lane D hash | SOVEREIGN — Lane D isolation |

### 2.2 Semantic Baseline (Pipeline-Certified)

| Element | Hash | Protection |
|---------|------|-----------|
| Semantic topology model (17 domains) | Part of rendering metadata | IMMUTABLE |
| Crosswalk (13 entities, 9/13 labels) | Crosswalk artifact hash | IMMUTABLE |
| Decision validation (14/14 PASS) | Validation artifact hash | IMMUTABLE |
| Reproducibility verdict (FULL) | Rendering metadata hash | IMMUTABLE |
| Rendering metadata | 869d49549f... | IMMUTABLE |

### 2.3 Qualification Baseline (Pre-Overlay)

| Element | Value | Protection |
|---------|-------|-----------|
| S-state | S2 | Certified value preserved; composite may differ |
| Q-class | Q-02 | Certified value preserved; composite may differ |
| backed_count | 4/17 | Certified value preserved (static_backed_count) |
| Lineage distribution | 3 EXACT, 1 STRONG, 1 WEAK, 12 NONE | Certified distribution immutable |
| Blocking debt items | Per debt inventory | Certified items preserved; overlay may resolve |

---

## 3. Protection Mechanisms

### 3.1 Physical Separation

Certified artifacts live OUTSIDE the sandbox namespace. The sandbox
cannot construct a write path to certified artifact locations.

```
Certified: artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/*.json
Sandbox:   artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/sandbox/**

The paths are disjoint. No sandbox write can reach certified paths.
```

### 3.2 Hash Anchoring

At sandbox creation, the certified baseline is hash-anchored:

```json
{
  "baseline_protection": {
    "anchor_time": "<ISO-8601>",
    "substrate_hash": "08480c17...",
    "rendering_metadata_hash": "869d49549f...",
    "qualification_baseline": {
      "s_state": "S2",
      "q_class": "Q-02",
      "backed_count": 4,
      "total_count": 17,
      "hash": "<qualification state hash>"
    },
    "crosswalk_hash": "<crosswalk artifact hash>",
    "decision_validation_hash": "<validation artifact hash>",
    "reproducibility_verdict": "FULL_REPRODUCIBILITY"
  }
}
```

Every sandbox operation that reads certified state verifies these hashes.
If any hash fails verification, the sandbox halts.

### 3.3 Composite vs Certified Distinction

The sandbox maintains TWO qualification states:

| State | Location | Mutability | Authority |
|-------|----------|-----------|-----------|
| Certified qualification | Outside sandbox | IMMUTABLE | Pipeline-certified |
| Composite qualification | Inside sandbox | COMPUTED | Overlay-enhanced |

These are NEVER conflated:

- Certified state is the anchor
- Composite state is derived from (certified + overlays)
- Removing all overlays makes composite = certified (identity property)
- Composite never overwrites certified

### 3.4 Attribution Separation

Every qualification metric in the composite state carries attribution:

```json
{
  "backed_count": {
    "composite": 10,
    "static_certified": 4,
    "overlay_contributed": 6,
    "attribution": [
      { "package_id": "SEP-001", "domains_backed": 3 },
      { "package_id": "SEP-002", "domains_backed": 3 }
    ]
  }
}
```

The `static_certified` value ALWAYS equals the baseline protected value.
It cannot be modified by overlay execution.

---

## 4. Recovery Guarantees

### 4.1 Baseline Recovery from Sandbox Failure

If the sandbox fails catastrophically:

```
1. Certified baseline is UNAFFECTED (never modified)
2. Qualification state = certified baseline (4/17, S2, Q-02)
3. All overlay contributions are lost (sandbox-contained)
4. Sandbox namespace can be deleted entirely
5. New sandbox can be created from the same certified baseline
```

### 4.2 Baseline Recovery from Overlay Reset

If all overlays are revoked (full reset):

```
Composite state converges to certified baseline:
  static_backed_count: 4
  overlay_backed_count: 0
  composite_backed_count: 4
  S-state: S2
  Q-class: Q-02

This convergence is guaranteed by:
  composite = certified_baseline + sum(overlay_contributions)
  If overlay_contributions = empty:
    composite = certified_baseline
```

### 4.3 Baseline Recovery from Substrate Re-execution

If the pipeline is re-executed for BlueEdge (new run):

```
1. New certified baseline established (new hashes)
2. Existing sandbox invalidated (hash mismatch on next operation)
3. Sandbox must be re-initialized against new baseline
4. Overlay packages may be re-evaluated against new substrate
5. Prior overlay contributions do not carry forward automatically
```

---

## 5. BlueEdge-Specific Protection Invariants

| Invariant | Verification |
|-----------|-------------|
| 123 nodes always present | Topology hash check at sandbox creation and on read |
| 17 domains always present | Rendering metadata hash check |
| 4/17 certified backing unchanged | static_backed_count field is write-protected |
| 14/14 decision validation unchanged | Decision validation hash check |
| FULL_REPRODUCIBILITY unchanged | Reproducibility verdict hash check |
| Crosswalk 13 certified entries unchanged | Crosswalk hash check (certified subset) |
| Q-02 certified baseline unchanged | Qualification baseline hash check |
| S2 certified baseline unchanged | Qualification baseline hash check |

---

## 6. Overlay Failure Impact on Baseline

| Failure Scenario | Baseline Impact |
|------------------|----------------|
| Package activation fails at Phase 1 | NONE — no overlay contribution entered |
| Package activation fails at Phase 3 | NONE — eligibility rejection is sandbox-contained |
| Overlay produces incorrect composite | NONE — composite is sandbox-internal |
| Replay verification fails | NONE — certified replay is independent |
| Audit trail corruption | NONE — certified audit is independent |
| Sandbox namespace corrupted | NONE — delete sandbox, recreate from baseline |
| Multiple overlays produce conflict | NONE — conflict resolution is sandbox-internal |

**In every failure scenario, the certified baseline is unaffected.**

---

## 7. Governance Rules

1. Certified baseline elements are hash-anchored at sandbox creation.
2. Hash verification is mandatory before every certified artifact read.
3. Composite and certified states are never conflated.
4. Attribution always distinguishes static from overlay contributions.
5. Baseline recovery is guaranteed by physical separation.
6. Overlay failure cannot invalidate certified baseline state.
7. No sandbox operation may modify, overwrite, or shadow certified artifacts.
