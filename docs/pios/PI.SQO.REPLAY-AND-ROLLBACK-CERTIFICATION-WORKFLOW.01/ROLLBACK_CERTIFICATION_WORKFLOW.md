# Rollback Certification Workflow

**Stream:** PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the canonical governed workflow by which rollback integrity
becomes a certified gating condition for authority promotion —
ensuring every overlay activated as authority can be independently
removed without corrupting the composite state that remains.

---

## 2. Rollback Certification Overview

### 2.1 Five-Phase Rollback Certification Pipeline

```
Phase 1: Dependency Inventory
    │   Map all inbound and outbound dependencies
    ▼
Phase 2: Independent Removability Verification
    │   Verify overlay can be removed without affecting others
    ▼
Phase 3: State Restoration Verification
    │   Verify composite state after removal matches expected state
    ▼
Phase 4: Cascade Safety Verification
    │   Verify rollback does not trigger unbounded cascades
    ▼
Phase 5: Certification Decision
    │   Issue ROLLBACK_CERTIFIED or ROLLBACK_DENIED
    ▼
[Output: Rollback certification record — authority gate]
```

### 2.2 Certification Boundary Rule

Rollback certification is the mandatory gate between REPLAY_CERTIFIED
overlay state and PROMOTION-ELIGIBLE state (authority candidate).
No overlay may be promoted to authority without passing BOTH replay
certification AND rollback certification.

---

## 3. Phase 1: Dependency Inventory

### 3.1 Dependency Types

| # | Type | Description | Detection Method |
|---|------|-------------|-----------------|
| D-01 | Domain overlap | Overlay contributes to same domain+field as another | Scan composite contribution records |
| D-02 | Conflict resolution dependency | Overlay's entries won conflict against another overlay | Scan conflict resolution records |
| D-03 | Qualification dependency | Overlay's metrics are used in composite qualification | Scan qualification attribution records |
| D-04 | Lineage dependency | Overlay's lineage is referenced by another overlay | Scan lineage cross-references |
| D-05 | Supersession dependency | Overlay supersedes or is superseded by another | Scan supersession registry |

### 3.2 Dependency Inventory Process

```
STEP 1: Map outbound dependencies (this overlay → others)
  FOR each entry in overlay:
    SCAN composite for domain+field overlaps with other overlays
    RECORD each overlap as outbound dependency
    CLASSIFY overlap: CONFLICT_WON, CONFLICT_LOST, NO_CONFLICT

STEP 2: Map inbound dependencies (others → this overlay)
  FOR each other ACTIVATED overlay:
    SCAN for references to this overlay's entries
    SCAN for conflict resolutions involving this overlay
    RECORD each reference as inbound dependency

STEP 3: Map qualification dependencies
  SCAN qualification attribution records
  IDENTIFY metrics that depend on this overlay's contributions
  RECORD qualification impact per metric

STEP 4: Map lineage dependencies
  SCAN lineage registry for cross-references
  IDENTIFY any overlay whose lineage chain includes this overlay
  RECORD lineage dependency graph

STEP 5: Map supersession dependencies
  IF overlay has SUPERSEDED predecessor:
    RECORD predecessor dependency
  IF overlay is SUPERSEDED by successor:
    RECORD successor dependency

STEP 6: Compute dependency inventory hash
  dependency_hash = sha256(D-01 + D-02 + D-03 + D-04 + D-05)
  Record as rollback dependency fingerprint
```

### 3.3 Dependency Inventory Gate (G-DEPENDENCY-INVENTORY)

| Check | Requirement |
|-------|------------|
| All 5 dependency types scanned | No dependency type skipped |
| All outbound dependencies recorded | Every domain+field overlap documented |
| All inbound dependencies recorded | Every reference to this overlay documented |
| Qualification impact assessed | Metric-level impact known |
| Dependency hash computed | Fingerprint available for comparison |

---

## 4. Phase 2: Independent Removability Verification

### 4.1 Seven Removability Checks

| # | Check | Description | Failure Consequence |
|---|-------|-------------|-------------------|
| IR-01 | No inbound hard dependencies | No other overlay requires this overlay to function | ROLLBACK_DENIED |
| IR-02 | Conflict resolution reversible | Removing this overlay restores prior conflict winners | Must verify per-conflict |
| IR-03 | Qualification metrics recomputable | Metrics can be recomputed without this overlay | Must verify per-metric |
| IR-04 | Lineage chain intact | Removing overlay does not break other lineage chains | Must verify per-chain |
| IR-05 | Supersession chain intact | Removing overlay does not orphan supersession links | Must verify per-link |
| IR-06 | No irreversible side-effects | Overlay has not triggered governance actions that persist | Must verify governance log |
| IR-07 | Batch rollback compatible | Overlay can be removed independently from batch peers | Must verify batch state |

### 4.2 Removability Verification Process

```
FOR each removability check:

  IR-01: Inbound dependency check
    IF any inbound HARD dependency exists:
      → FAIL("Inbound hard dependency: {dependent_overlay}")
    IF only SOFT dependencies exist:
      → PASS with WARNING("Soft dependencies exist — recomputation needed")

  IR-02: Conflict resolution reversibility
    FOR each conflict this overlay won:
      IDENTIFY prior winner (overlay that would win without this overlay)
      VERIFY prior winner still exists and is ACTIVATED
      IF prior winner removed or REVOKED:
        → FAIL("Conflict resolution irreversible: {domain}.{field}")

  IR-03: Qualification metric recomputability
    COMPUTE qualification metrics WITHOUT this overlay's contributions
    VERIFY all metrics are computable (no division by zero, no missing inputs)
    RECORD expected post-rollback metrics

  IR-04: Lineage chain integrity
    FOR each lineage chain referencing this overlay:
      VERIFY chain remains valid if this overlay's segment is removed
      IF chain becomes broken:
        → FAIL("Lineage chain break: {chain_id}")

  IR-05: Supersession chain integrity
    IF overlay has predecessor:
      VERIFY predecessor can be reactivated or is still ACTIVATED
    IF overlay has successor:
      → WARN("Removing superseded overlay — successor unaffected")

  IR-06: Irreversible side-effect check
    SCAN governance log for actions triggered by this overlay
    CLASSIFY each as REVERSIBLE or IRREVERSIBLE
    IF any IRREVERSIBLE action found:
      → FAIL("Irreversible side-effect: {action_id}")

  IR-07: Batch rollback compatibility
    IF overlay was activated as part of a batch:
      VERIFY overlay can be removed independently
      VERIFY remaining batch overlays remain valid
      IF removal invalidates batch:
        → FAIL("Batch rollback incompatible — must rollback entire batch")
```

### 4.3 Removability Gate (G-REMOVABILITY)

| Check | Requirement |
|-------|------------|
| IR-01 passes | No hard inbound dependencies |
| IR-02 passes | All conflict resolutions reversible |
| IR-03 passes | All metrics recomputable |
| IR-04 passes | All lineage chains intact |
| IR-05 passes | Supersession chain intact |
| IR-06 passes | No irreversible side-effects |
| IR-07 passes | Batch rollback compatible |

---

## 5. Phase 3: State Restoration Verification

### 5.1 State Restoration Process

```
STEP 1: Snapshot current composite state
  current_state = deepClone(composite)
  current_hash = sha256(JSON.stringify(current_state, sorted_keys))

STEP 2: Compute expected post-rollback state
  expected_state = deepClone(certified_baseline)
  FOR each ACTIVATED overlay EXCEPT target overlay:
    APPLY overlay in application order
    APPLY conflict resolutions (excluding target overlay)
  RECOMPUTE qualification metrics
  expected_hash = sha256(JSON.stringify(expected_state, sorted_keys))

STEP 3: Execute simulated rollback
  simulated_state = deepClone(composite)
  REMOVE target overlay's contributions from simulated_state
  REAPPLY conflict resolutions without target overlay
  RECOMPUTE qualification metrics
  simulated_hash = sha256(JSON.stringify(simulated_state, sorted_keys))

STEP 4: Compare expected vs simulated
  IF expected_hash == simulated_hash:
    → STATE_RESTORATION_VERIFIED
  IF expected_hash != simulated_hash:
    → STATE_RESTORATION_DIVERGED
    → Record divergence details (which fields differ)
    → Escalate to investigation

STEP 5: Verify S-state regression safety
  current_s_state = computeSState(current_state)
  post_rollback_s_state = computeSState(expected_state)
  IF post_rollback_s_state < current_s_state:
    → RECORD as S-state regression
    → Acceptable IF regression is to previously certified S-state
    → FAIL IF regression is to uncertified state
```

### 5.2 Double-Rollback Verification

For ROLLBACK-SENSITIVE overlays, perform double-rollback:

```
ROLLBACK 1: Compute post-rollback state → hash R1
ROLLBACK 2: Compute post-rollback state (same inputs) → hash R2

ASSERT R1 == R2 (proves no non-determinism in rollback computation)
ASSERT R1 == expected_hash (proves rollback produces expected state)

IF R1 != R2:
  → Non-deterministic rollback detected
  → CRITICAL — investigation required
  → Certification DENIED
```

### 5.3 State Restoration Gate (G-STATE-RESTORATION)

| Check | Requirement |
|-------|------------|
| Expected state computed | Post-rollback state deterministically derived |
| Simulated matches expected | Hash comparison passes |
| Double-rollback passes (if ROLLBACK-SENSITIVE) | No non-determinism |
| S-state regression assessed | Regression documented and acceptable |

---

## 6. Phase 4: Cascade Safety Verification

### 6.1 Cascade Safety Checks

| # | Check | Description | Limit |
|---|-------|-------------|-------|
| CS-01 | Cascade depth | Maximum depth of triggered rollbacks | 3 |
| CS-02 | Cascade size | Maximum number of overlays affected | 5 |
| CS-03 | Cascade qualification impact | Maximum qualification metric change | Zone boundary |
| CS-04 | Cascade lineage impact | Maximum lineage chains affected | All must remain valid |
| CS-05 | Cascade governance impact | Zone change triggered by cascade | Must not enter PROHIBITED |

### 6.2 Cascade Safety Process

```
STEP 1: Compute direct cascade
  direct_cascade = []
  FOR each inbound soft dependency:
    COMPUTE impact of removing target overlay
    IF impact requires dependent overlay rollback:
      direct_cascade.push(dependent_overlay)

STEP 2: Compute transitive cascade
  transitive_cascade = []
  FOR each overlay in direct_cascade:
    COMPUTE cascade of rolling back that overlay
    transitive_cascade.push(cascaded_overlays)

STEP 3: Verify cascade limits
  total_depth = max_depth(direct_cascade + transitive_cascade)
  total_size = count(unique(direct_cascade + transitive_cascade))
  IF total_depth > 3 → FAIL("Cascade depth exceeds limit: {total_depth}")
  IF total_size > 5 → FAIL("Cascade size exceeds limit: {total_size}")

STEP 4: Compute cascade qualification impact
  pre_cascade_metrics = current_qualification_metrics
  post_cascade_metrics = compute_metrics_without(target + cascade)
  IF post_cascade_metrics crosses zone boundary:
    → ESCALATE to G-3
    → Record zone transition risk

STEP 5: Compute cascade governance impact
  post_cascade_zone = compute_zone(post_cascade_metrics)
  IF post_cascade_zone == PROHIBITED:
    → FAIL("Cascade would enter PROHIBITED zone")
  IF post_cascade_zone == RISK:
    → ESCALATE to G-3 with zone transition warning
```

### 6.3 Cascade Safety Gate (G-CASCADE-SAFETY)

| Check | Requirement |
|-------|------------|
| CS-01 passes | Cascade depth ≤ 3 |
| CS-02 passes | Cascade size ≤ 5 |
| CS-03 passes | Qualification impact within zone |
| CS-04 passes | All lineage chains remain valid |
| CS-05 passes | No entry into PROHIBITED zone |

---

## 7. Phase 5: Certification Decision

### 7.1 Decision Process

```
IF Phase 2 all checks pass
   AND Phase 3 state restoration verified
   AND Phase 4 cascade safety verified:
  → ROLLBACK_CERTIFIED
  → Issue rollback certification record
  → Overlay eligible for promotion review (combined with replay cert)

IF Phase 2 all checks pass
   AND Phase 3 state restoration verified
   BUT Phase 4 cascade exceeds limits:
  → ROLLBACK_CONDITIONAL
  → Certified for individual rollback only
  → Cascade rollback requires operator approval
  → Promotion eligibility: RESTRICTED

IF Phase 2 has soft dependency warnings
   AND Phase 3 state restoration verified:
  → ROLLBACK_CERTIFIED_WITH_WARNINGS
  → Warnings documented in certification record
  → Operator notified of recomputation requirements

IF Phase 2 any hard check fails:
  → ROLLBACK_DENIED
  → No promotion eligibility
  → Mandatory investigation
  → Escalation per failure severity

IF Phase 3 state restoration diverged:
  → ROLLBACK_DENIED
  → No promotion eligibility
  → Mandatory investigation
  → G-4 escalation
```

### 7.2 Certification Record

```json
{
  "rollback_certification": {
    "certification_id": "RBCERT-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "decision": "ROLLBACK_CERTIFIED",
    "overlay_id": "<package_id>",
    "dependency_hash": "<sha256 of dependency inventory>",
    "removability_checks": {
      "IR-01": "PASS",
      "IR-02": "PASS",
      "IR-03": "PASS",
      "IR-04": "PASS",
      "IR-05": "PASS",
      "IR-06": "PASS",
      "IR-07": "PASS"
    },
    "state_restoration": {
      "expected_hash": "<sha256>",
      "simulated_hash": "<sha256>",
      "match": true,
      "double_rollback": true,
      "s_state_regression": "S2 → S1 (acceptable — S1 previously certified)"
    },
    "cascade_safety": {
      "cascade_depth": 1,
      "cascade_size": 2,
      "qualification_impact": "WITHIN_ZONE",
      "governance_impact": "SAFE → SAFE"
    },
    "governance_zone": "SAFE",
    "escalation_level": "G-0"
  }
}
```

---

## 8. Combined Replay + Rollback Certification

### 8.1 Combined Certification Gate (G-COMBINED-CERT)

```
PROMOTION_ELIGIBLE requires:
  replay_certification.decision == REPLAY_CERTIFIED
  AND rollback_certification.decision IN [
    ROLLBACK_CERTIFIED,
    ROLLBACK_CERTIFIED_WITH_WARNINGS
  ]

PROMOTION_RESTRICTED requires:
  replay_certification.decision == REPLAY_CERTIFIED
  AND rollback_certification.decision == ROLLBACK_CONDITIONAL

PROMOTION_BLOCKED requires:
  replay_certification.decision IN [REPLAY_DENIED, REPLAY_FAILED]
  OR rollback_certification.decision == ROLLBACK_DENIED
```

### 8.2 Combined Certification Record

```json
{
  "combined_certification": {
    "certification_id": "CERT-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "replay_certification_id": "RCERT-<ref>",
    "rollback_certification_id": "RBCERT-<ref>",
    "promotion_eligibility": "PROMOTION_ELIGIBLE",
    "overlay_id": "<package_id>",
    "certified_for": ["AUTHORITY_PROMOTION", "PUBLICATION_ELIGIBILITY"],
    "restrictions": [],
    "governance_zone": "SAFE",
    "escalation_level": "G-0"
  }
}
```

---

## 9. Governance

- 5-phase rollback certification pipeline ensures independent removability
- 5 dependency types mapped before removability verification
- 7 removability checks verify overlay can be removed without side-effects
- State restoration verified through simulated rollback with hash comparison
- Double-rollback verification detects non-determinism for ROLLBACK-SENSITIVE overlays
- Cascade safety enforced with limits (depth 3, size 5)
- Combined replay + rollback certification is mandatory for authority promotion
- ROLLBACK_DENIED triggers immediate investigation and escalation
- S-state regression assessed and documented
- No authority promotion without both replay AND rollback certification
