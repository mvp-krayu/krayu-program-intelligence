# Session Overlay Chain Governance

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how sandbox sessions govern overlay activation order,
overlay coexistence, overlay rollback, overlay revocation,
overlay supersession, and overlay lineage reconstruction —
ensuring overlay evolution remains session-visible and
reconstructable.

---

## 2. Overlay Chain Model

### 2.1 Overlay Chain Definition

```json
{
  "overlay_chain": {
    "session_ref": "SBX-<client>-<run_id>",
    "baseline_hash": "<sha256>",
    "chain": [
      {
        "position": 1,
        "overlay_id": "SEP-multi-001",
        "type": "OT-GND",
        "sensitivity": "STANDARD",
        "activated_at": "<ISO-8601>",
        "entries_applied": 5,
        "entries_skipped": 0,
        "conflicts_won": 0,
        "conflicts_lost": 0,
        "certification_status": "AUTHORITY_PROMOTED",
        "contribution_hash": "<sha256>"
      }
    ],
    "composite_hash": "<sha256>",
    "chain_hash": "<sha256>",
    "total_entries": 17,
    "total_conflicts": 3
  }
}
```

### 2.2 Chain Ordering Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| Monotonic position | Each overlay has unique position in chain | position = max(existing) + 1 |
| Package-ID ordered | Overlays ordered by package_id | Activation validates package_id > last |
| Entry-ID ordered | Entries within overlay ordered by entry_id | Application validates entry_id sequence |
| Deterministic | Same inputs produce same chain | Hash-verified at each activation |
| Append-only | Overlays are added, never reordered | Chain is immutable once activated |

---

## 3. Overlay Activation Governance

### 3.1 Activation Prerequisites

| # | Prerequisite | Gate |
|---|-------------|------|
| AP-01 | Session status is ACTIVE | Session lifecycle gate |
| AP-02 | Overlay is AUTHORIZED (proposal workflow complete) | G-AUTHORIZE |
| AP-03 | Overlay trust is CERTIFICATION-AUTHORIZED | Trust progression gate |
| AP-04 | Governance zone permits activation | Zone capability matrix |
| AP-05 | Batch limit not exceeded (≤5 per batch, ≤3 in PRESSURE) | Batch governance |
| AP-06 | Coexistence assessment passed | Coexistence gate |
| AP-07 | Namespace isolation verified | Namespace binding gate |

### 3.2 Activation Process

```
FUNCTION activateOverlay(session, overlay):

  // Step 1: Verify prerequisites
  FOR each prerequisite AP-01 through AP-07:
    IF NOT satisfied:
      → ACTIVATION_BLOCKED
      → Record blocking prerequisite

  // Step 2: Create recovery point
  pre_activation_snapshot = createRecoveryPoint(session)

  // Step 3: Apply overlay
  position = session.overlay_chain.length + 1
  FOR each entry in overlay.entries (ordered by entry_id):
    IF isAuthorized(entry.semantic_class, overlay.type):
      contribution = applyEntry(session.composite, entry)
      record contribution
    ELSE:
      record skip (UNAUTHORIZED_CLASS)

  // Step 4: Resolve conflicts
  new_conflicts = detectNewConflicts(session.composite, overlay)
  FOR each conflict:
    resolution = resolveConflict(conflict)
    record resolution

  // Step 5: Update session state
  session.overlay_chain.push(overlay_record)
  session.composite_hash = sha256(session.composite)
  session.qualification = recomputeMetrics(session.composite)

  // Step 6: Record activation event
  activation_event = {
    event: "OVERLAY_ACTIVATED",
    session_ref: session.session_id,
    overlay_id: overlay.package_id,
    position: position,
    entries_applied: count,
    conflicts: new_conflicts.length,
    composite_hash: session.composite_hash,
    s_state: session.qualification.s_state
  }

  RETURN activation_event
```

---

## 4. Overlay Coexistence in Sessions

### 4.1 Coexistence Assessment

```
FUNCTION assessCoexistence(session, candidate_overlay):

  // Check domain overlap
  overlaps = []
  FOR each existing_overlay in session.overlay_chain:
    shared_domains = intersect(
      candidate_overlay.domains,
      existing_overlay.domains
    )
    IF shared_domains.length > 0:
      overlaps.push({
        existing: existing_overlay.overlay_id,
        candidate: candidate_overlay.package_id,
        shared_domains: shared_domains,
        conflict_potential: HIGH | MEDIUM | LOW
      })

  // Check conflict resolution impact
  FOR each overlap:
    projected_conflicts = projectConflicts(overlap)
    FOR each projected_conflict:
      resolution = determineResolution(projected_conflict)
      IF resolution changes existing certified state:
        → COEXISTENCE_WARNING: "Activation changes certified overlay's contribution"

  // Assess qualification impact
  projected_metrics = projectMetrics(session, candidate_overlay)
  IF projected_metrics.zone != session.governance.zone:
    → COEXISTENCE_WARNING: "Zone transition projected"

  RETURN {
    compatible: overlaps.all(o => o.conflict_potential != "BLOCKING"),
    warnings: warnings,
    overlaps: overlaps,
    projected_conflicts: projected_conflicts.length
  }
```

### 4.2 Coexistence Rules

| Rule | Description |
|------|-------------|
| No blocking conflicts | Candidate must not create unresolvable conflicts |
| Deterministic resolution | All projected conflicts must have deterministic resolution |
| Certified state preservation | Activation must not invalidate already-certified overlays |
| Batch limit respected | Total activated overlays ≤ batch limit for current zone |
| S-state regression acknowledged | If activation could cause S-state regression, operator must acknowledge |

---

## 5. Overlay Rollback in Sessions

### 5.1 Session Rollback Model

```
FUNCTION rollbackOverlay(session, target_overlay_id):

  // Step 1: Verify rollback certification
  IF target not ROLLBACK_CERTIFIED:
    → ROLLBACK_BLOCKED: "Overlay not rollback-certified"

  // Step 2: Verify session permits rollback
  IF session.status NOT IN [ACTIVE, QUARANTINED]:
    → ROLLBACK_BLOCKED: "Session status does not permit rollback"

  // Step 3: Compute post-rollback state
  remaining = session.overlay_chain.filter(o => o.overlay_id != target_overlay_id)
  post_rollback = replayReconstruct(session.baseline, remaining)

  // Step 4: Verify cascade limits
  cascade = computeCascade(session, target_overlay_id)
  IF cascade.depth > 3 OR cascade.size > 5:
    → ROLLBACK_BLOCKED: "Cascade limits exceeded"

  // Step 5: Execute rollback
  session.overlay_chain = remaining
  session.composite = post_rollback.composite
  session.composite_hash = post_rollback.hash
  session.qualification = recomputeMetrics(session.composite)

  // Step 6: Update certification state
  // Overlays that remain must be re-verified if cascade affected
  FOR each affected_overlay in cascade.affected:
    affected_overlay.certification_status = "RE_VERIFICATION_NEEDED"

  // Step 7: Record rollback event
  rollback_event = {
    event: "OVERLAY_ROLLED_BACK",
    session_ref: session.session_id,
    overlay_id: target_overlay_id,
    cascade_depth: cascade.depth,
    cascade_size: cascade.size,
    post_rollback_hash: session.composite_hash,
    s_state_change: pre_s_state + " → " + session.qualification.s_state
  }
```

---

## 6. Overlay Revocation in Sessions

### 6.1 Revocation Process

```
Revocation differs from rollback:
  - Rollback: planned removal with certification
  - Revocation: mandatory removal due to governance failure

FUNCTION revokeOverlay(session, target_overlay_id, reason):

  // Step 1: Record revocation reason
  revocation_record = {
    overlay_id: target_overlay_id,
    reason: reason,
    timestamp: now(),
    cascading: false
  }

  // Step 2: Execute removal (same as rollback Steps 3-6)
  // But WITHOUT requiring rollback certification

  // Step 3: Mark overlay as REVOKED
  target.status = "REVOKED"
  target.revocation_record = revocation_record

  // Step 4: Check cascade revocation
  IF cascade required:
    FOR each cascaded_overlay:
      revokeOverlay(session, cascaded_overlay, "CASCADE:" + reason)
    revocation_record.cascading = true
```

---

## 7. Overlay Supersession in Sessions

### 7.1 Supersession Process

```
FUNCTION supersedeOverlay(session, old_overlay_id, new_overlay):

  // Step 1: Verify supersession rules
  IF new_overlay.version <= old_overlay.version:
    → SUPERSESSION_BLOCKED: "Version not monotonically increasing"

  // Step 2: Mark old overlay as SUPERSEDED
  old_overlay.status = "SUPERSEDED"
  old_overlay.superseded_by = new_overlay.package_id

  // Step 3: Activate new overlay at old overlay's position
  // New overlay takes over old overlay's domain contributions
  activateOverlay(session, new_overlay)

  // Step 4: Record supersession
  supersession_event = {
    event: "OVERLAY_SUPERSEDED",
    old_overlay: old_overlay_id,
    new_overlay: new_overlay.package_id,
    session_ref: session.session_id
  }
```

---

## 8. Overlay Chain Reconstruction

### 8.1 Chain Reconstruction Proof

```
The overlay chain is fully reconstructable because:

  1. Baseline is hash-verified (RP-01)
  2. Overlay order is monotonic and recorded (chain positions)
  3. Each activation is hash-recorded (contribution_hash)
  4. Conflict resolutions are deterministic and recorded
  5. Qualification metrics are pure functions of state
  6. Chain hash verifies complete chain integrity

  chain_hash = sha256(
    baseline_hash +
    overlay_1.contribution_hash +
    overlay_2.contribution_hash +
    ... +
    overlay_N.contribution_hash
  )

  IF recomputed chain_hash != stored chain_hash:
    → CHAIN_INTEGRITY_FAILURE
    → Session status → QUARANTINED
```

---

## 9. Governance

- Overlay chain is ordered, deterministic, append-only, and hash-verified
- 7 activation prerequisites gate every overlay activation
- Coexistence assessment prevents blocking conflicts and certified state invalidation
- Rollback requires rollback certification and respects cascade limits (depth 3, size 5)
- Revocation is mandatory removal without requiring certification
- Supersession preserves lineage through monotonic versioning
- Chain reconstruction is provable through hash verification at every position
- Overlay evolution remains session-visible and reconstructable
- Overlay chain governance is client-agnostic
