# Overlay Revocation and Rollback Model

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines how Dynamic CEU overlays are deactivated, revoked,
superseded, and rolled back without corrupting replay chains or the
deterministic substrate. Revocation is the inverse of activation — it
must be as governed, auditable, and deterministic as activation itself.

---

## 2. Revocation Types

### 2.1 Standard Revocation

**Trigger:** Explicit revocation command with reason.
**Authority:** Governance review or stream contract authorization.
**Use case:** Evidence determined to be incorrect, outdated, or no longer
applicable.

**Process:**
```
1. VERIFY no active dependent packages
   → If dependents exist: BLOCK (resolve dependencies first)
2. MARK package as REVOKED in registry
   record: timestamp, reason, authority
3. RECOMPUTE composite state WITHOUT revoked package
4. EMIT SEP_REVOKED trigger event
5. EXECUTE qualification re-evaluation
6. VERIFY composite state integrity post-removal
7. LOG revocation in governance audit trail
```

### 2.2 Emergency Revocation

**Trigger:** Governance determination that an overlay is producing
incorrect qualification state.
**Authority:** Emergency governance authority.
**Use case:** Active overlay causing material qualification error.

**Process:**
```
1. MARK package as REVOKED with EMERGENCY flag
   → Dependency checks are OVERRIDDEN (emergency authority)
   → Dependent packages are CASCADE-REVOKED with linked reason
2. RECOMPUTE composite state WITHOUT revoked package(s)
3. EMIT SEP_REVOKED trigger event(s)
4. EXECUTE qualification re-evaluation
5. FLAG all emergency-revoked packages for governance post-review
6. LOG emergency revocation with elevated audit severity
```

**Post-emergency obligations:**
- Governance review within defined timeframe
- Impact assessment: what qualification state changes occurred
- Dependent package assessment: should they be reactivated independently

### 2.3 Version Supersession

**Trigger:** New version of the same package passes activation.
**Authority:** Standard activation authorization for new version.
**Use case:** Updated evidence replaces prior evidence.

**Process:**
```
1. NEW version passes Phases 1-4 (validated, authorized, eligible, governance-approved)
2. CURRENT version transitions to SUPERSEDED
3. NEW version transitions to ACTIVATED
4. RECOMPUTE composite state with new version
5. EMIT SEP_VERSION_UPGRADE trigger event
6. EXECUTE qualification re-evaluation
7. LOG supersession event with version lineage
```

---

## 3. Rollback Model

### 3.1 Version Rollback

**Trigger:** Governance determination that a version upgrade should
be reversed.
**Authority:** Governance review.
**Use case:** Version N+1 introduced errors; version N was correct.

**Process:**
```
1. VERIFY target version was previously ACTIVATED or STAGED
2. TRANSITION current version to SUPERSEDED
3. RE-ENTER target version into activation process at Phase 1
   → Full re-validation required (state may have changed)
4. IF target version passes all phases:
   → ACTIVATE target version
   → EMIT SEP_VERSION_UPGRADE trigger
   → EXECUTE qualification re-evaluation
5. IF target version fails validation:
   → Version remains SUPERSEDED
   → Current version remains SUPERSEDED
   → No active version for this package_id
   → REPORT: rollback failed, manual resolution needed
```

### 3.2 Full Overlay Reset

**Trigger:** Governance emergency reset command.
**Authority:** Emergency governance authority.
**Use case:** Dynamic CEU layer needs to be completely removed
(e.g., systemic evidence quality issue, governance audit failure).

**Process:**
```
1. MARK ALL ACTIVATED packages as REVOKED
   record: "FULL_OVERLAY_RESET" as reason
2. RECOMPUTE composite state (= certified substrate alone)
3. EMIT SEP_REVOKED trigger for each package
4. EXECUTE qualification re-evaluation
   → S-state reverts to Static CEU evaluation
   → All overlay contributions removed
   → All overlay-attributed debt resolutions reverted
5. LOG full reset with emergency governance authority
6. FLAG all revoked packages for governance review
```

This is the nuclear option. Post-reset:
- Qualification state = Static CEU evaluation only
- All overlay contributions are zeroed
- S-state is determined by certified substrate alone
- All overlay-resolved debt items revert to unresolved

---

## 4. Post-Revocation State Integrity

### 4.1 Composite State After Revocation

After any revocation, the composite state MUST satisfy:

```
composite_state_after_revocation == computeCompositeState(
    certified_substrate,
    active_overlay_set_WITHOUT_revoked_package
)
```

This is the independent removability guarantee: the state after
revocation is exactly the state that would exist if the package
had never been activated.

### 4.2 Verification Steps

```
1. Recompute composite state from remaining active overlays
2. Hash the result
3. Verify no substrate artifacts were modified
4. Verify no orphaned dependencies remain
5. Verify no conflicts reference the revoked package
6. Verify overlay attribution excludes the revoked package
```

### 4.3 Dependency Cleanup After Revocation

If emergency revocation cascade-revoked dependent packages:

1. Each dependent package is independently assessed
2. If a dependent can function without the revoked dependency:
   → Update dependency declarations (new version)
   → Re-enter activation process
3. If a dependent cannot function without the revoked dependency:
   → Dependent remains REVOKED
   → Marked for governance review

---

## 5. Revocation and Replay Safety

### 5.1 Replay Chain Preservation

Revocation MUST NOT corrupt the replay chain. Specifically:

- The certified substrate remains unchanged (it was never modified)
- Revoked packages remain in the artifact store (not deleted)
- The package registry records the REVOKED status with timestamp
- The composite state is deterministically recomputable from:
  - certified substrate + remaining active overlays

### 5.2 Historical Replay

The qualification state at any historical point in time can be
reconstructed by:

1. Loading the certified substrate at that point
2. Loading the overlay set that was ACTIVATED at that point
3. Applying the composite state construction algorithm
4. Applying the Q-class formula

Revoked packages are included in historical replay if they were
ACTIVATED at the historical point in time.

### 5.3 Revocation Reversibility

Revocation is reversible: a REVOKED package can be reactivated
(with governance authorization) by re-entering the activation
process at Phase 1. Full re-validation is required because the
overlay context may have changed since the original activation.

---

## 6. Revocation Artifacts

Every revocation produces:

```json
{
  "revocation_id": "<uuid>",
  "package_id": "<revoked package>",
  "package_version": "<version>",
  "revocation_type": "STANDARD | EMERGENCY | FULL_RESET | SUPERSESSION",
  "reason": "<human-readable reason>",
  "authority": "<who authorized revocation>",
  "timestamp": "<ISO-8601>",
  "dependency_impact": {
    "cascade_revoked": ["<package_ids>"],
    "unaffected": ["<package_ids>"]
  },
  "state_impact": {
    "prior_composite": { "s_state": "S2", "q_class": "Q-02", "backed_count": 5 },
    "post_revocation_composite": { "s_state": "S1", "q_class": "Q-03", "backed_count": 0 }
  },
  "governance": {
    "substrate_mutation": false,
    "replay_chain_preserved": true
  }
}
```

---

## 7. Governance Rules

1. No revocation may corrupt the deterministic substrate.
2. No revocation may delete package artifacts (retention is permanent).
3. Standard revocation MUST check dependencies before proceeding.
4. Emergency revocation MAY override dependency checks but MUST cascade.
5. Full overlay reset is a last resort requiring emergency governance authority.
6. All revocations MUST produce an audit artifact.
7. Post-revocation composite state MUST be verifiable.
8. Revocation does not erase the fact that an overlay was once active —
   the activation history is preserved in the audit trail.
