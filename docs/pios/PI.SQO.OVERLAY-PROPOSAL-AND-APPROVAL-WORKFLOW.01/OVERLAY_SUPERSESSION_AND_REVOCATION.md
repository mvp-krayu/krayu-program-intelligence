# Overlay Supersession and Revocation

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how overlays supersede, revoke, rollback, de-authorize,
and retire without breaking replay lineage — ensuring supersession
history remains externally visible and governance-bounded.

---

## 2. Supersession Model

### 2.1 Supersession Definition

Supersession occurs when a new overlay version replaces an existing
overlay for the same domain(s). The old version is SUPERSEDED (not
REVOKED) — its lineage is preserved but its contributions are
replaced by the new version.

### 2.2 Supersession Rules

| Rule | Description |
|------|------------|
| Same package_id, new version | Supersession produces a new version (v1 → v2) |
| Old version retained | Superseded version remains in artifact store |
| Contributions replaced | Old contributions removed, new contributions applied |
| Replay updated | Replay now reconstructs with new version |
| Lineage preserved | Old lineage chain remains auditable |
| Rollback to prior version | Can rollback to v1 by revoking v2 |

### 2.3 Supersession Process

```
STEP 1: Create new package version
  - Package retains same package_id
  - Version increments monotonically (v1 → v2)
  - New entries replace old entries
  - New provenance chain established

STEP 2: Validate supersession
  - New version passes all packaging gates (G-PACKAGE)
  - New version has replay binding
  - New version has rollback attestation
  - Supersession does not introduce conflicts

STEP 3: Propose supersession
  - Create proposal for version upgrade
  - Impact assessment compares v1 contribution vs v2 contribution
  - Qualification delta is net effect (v2 minus v1 impact)

STEP 4: Activate supersession
  - Old version status: ACTIVATED → SUPERSEDED
  - New version status: STAGED → ACTIVATED
  - Composite state recomputed with new version
  - Qualification re-evaluated

STEP 5: Record supersession
  - Generate OVERLAY_SUPERSEDED audit event
  - Record: old version, new version, delta, timestamp
  - Supersession history visible in observability
```

### 2.4 Supersession Impact

```json
{
  "supersession_event": {
    "package_id": "SEP-blueedge-CLU-04-001",
    "old_version": 1,
    "new_version": 2,
    "timestamp": "<ISO-8601>",
    "impact": {
      "entries_removed": 1,
      "entries_added": 2,
      "domains_affected": ["DOM-11"],
      "backed_count_delta": 0,
      "grounding_delta": 0.05,
      "net_qualification_change": "Enrichment upgrade, no backed_count change"
    },
    "superseded_version_status": "SUPERSEDED",
    "new_version_status": "ACTIVATED"
  }
}
```

---

## 3. Revocation Model

### 3.1 Revocation Definition

Revocation permanently removes an overlay's contributions from
the composite state. The overlay status becomes REVOKED (terminal).
The overlay artifact and lineage remain for audit trail.

### 3.2 Revocation Triggers

| Trigger | Severity | Who Initiates |
|---------|----------|---------------|
| Operator decision | STANDARD | OPERATOR |
| Trust violation confirmed | HIGH | GOVERNANCE |
| Replay divergence confirmed | CRITICAL | GOVERNANCE |
| Lineage chain irrecoverable | HIGH | GOVERNANCE |
| Zone recovery requirement | MEDIUM | OPERATOR (governance mandates) |
| Certification denied | MEDIUM | CERTIFICATION |
| Source material retracted | HIGH | GOVERNANCE |

### 3.3 Revocation Process

```
STEP 1: Revocation request
  - Identify overlay(s) to revoke
  - Record revocation reason
  - Assess revocation impact:
    - backed_count change
    - grounding_ratio change
    - S-state regression risk
    - Cascade impact (dependencies)

STEP 2: Pre-revocation validation
  - Verify overlay is independently removable
  - Verify no inbound dependencies (or handle cascade)
  - Verify rollback to pre-overlay state is possible
  - Generate REVOCATION_PROPOSED audit event

STEP 3: Revocation approval
  - IF operator-initiated: operator confirms with impact preview
  - IF governance-mandated: governance authority records mandate
  - Record approval decision

STEP 4: Revocation execution
  - Overlay status: ACTIVATED → REVOKED
  - Overlay contributions removed from composite state
  - Composite state recomputed without overlay
  - Qualification re-evaluated
  - Generate OVERLAY_REVOKED audit event

STEP 5: Post-revocation verification
  - Verify composite state matches expected (pre-overlay state)
  - Verify replay produces correct state without revoked overlay
  - Verify no cascade effects on remaining overlays
  - Record verification results
```

### 3.4 Revocation Impact Assessment

```json
{
  "revocation_impact": {
    "package_id": "SEP-blueedge-CLU-04-002",
    "status": "ACTIVATED → REVOKED",
    "qualification_impact": {
      "backed_count": { "before": 10, "after": 9, "delta": -1 },
      "grounding_ratio": { "before": 0.588, "after": 0.529, "delta": -0.059 },
      "s_state_regression": "NO — still above S2 threshold",
      "debt_items_reintroduced": 1
    },
    "cascade_impact": {
      "dependent_overlays": 0,
      "cascade_revocations_needed": 0
    },
    "zone_impact": {
      "zone_before": "SAFE",
      "zone_after": "SAFE",
      "overlay_count_after": 4
    }
  }
}
```

---

## 4. Cascade Revocation

### 4.1 When Cascade Occurs

Cascade revocation is required when revoking overlay A would
invalidate overlay B (because B depends on A's claims).

```
IF overlay B has entries that reference domains modified by overlay A:
  AND overlay B's claims would be invalid without overlay A:
  → CASCADE: overlay B must also be revoked

IF overlay B has entries independent of overlay A:
  AND overlay B's claims remain valid without overlay A:
  → NO CASCADE: overlay B is unaffected
```

### 4.2 Cascade Limits

| Limit | Value | Rationale |
|-------|-------|-----------|
| Maximum cascade depth | 3 | Beyond 3 levels = governance escalation |
| Maximum cascade size | 5 overlays | Beyond 5 = governance review required |
| Cascade exceeds limits | G-2 escalation | Mandatory governance review board |

### 4.3 Cascade Revocation Process

```
STEP 1: Map dependency chain
  - Identify all overlays that depend on revocation target
  - Compute full cascade tree

STEP 2: Assess cascade impact
  - Total overlays affected
  - Total qualification impact
  - S-state regression risk

STEP 3: Cascade decision
  IF cascade within limits:
    - Proceed with cascade revocation
    - Revoke in reverse dependency order (leaves first)
  IF cascade exceeds limits:
    - Escalate to G-2 for governance review
    - May require alternative approach (selective remediation)
```

---

## 5. De-Authorization Model

### 5.1 De-Authorization Definition

De-authorization reverses the operator's AUTHORIZE decision,
returning a proposal from AUTHORIZED to APPROVED (or to DEFERRED).
This is distinct from revocation (which applies to ACTIVATED overlays).

### 5.2 De-Authorization Rules

| Rule | Description |
|------|------------|
| Only AUTHORIZED proposals | Cannot de-authorize ACTIVATED overlays (use revocation) |
| Operator-initiated | Only the authorizing operator (or higher authority) can de-authorize |
| Reason required | Must state why authorization is withdrawn |
| Packages return to STAGED | Packages remain STAGED (not REVOKED) |
| Proposal remains in registry | Audit trail preserved |

---

## 6. Retirement Model

### 6.1 Retirement Definition

Retirement is the planned end-of-life for an overlay when its
contributions are no longer needed — typically because pipeline
re-execution has promoted the overlay's claims to PIPELINE_CERTIFIED
status, making the overlay contribution redundant.

### 6.2 Retirement Process

```
STEP 1: Identify retirement candidates
  - Overlay's domains have been PIPELINE_CERTIFIED
  - Overlay contributions are now redundant
  - Overlay removal would not change qualification state

STEP 2: Validate retirement safety
  - Verify PIPELINE_CERTIFIED covers all overlay claims
  - Verify removal would not change backed_count (already certified)
  - Verify no other overlays depend on retired overlay

STEP 3: Execute retirement
  - Overlay status: ACTIVATED → RETIRED
  - Contributions removed from composite (already covered by pipeline)
  - Package count decreases (frees capacity for new overlays)
  - Generate OVERLAY_RETIRED audit event

STEP 4: Post-retirement verification
  - Verify qualification state unchanged
  - Verify replay produces same state without retired overlay
```

### 6.3 Retirement vs Revocation

| Property | Retirement | Revocation |
|----------|-----------|------------|
| Trigger | Contributions become redundant | Trust violation, operator decision, governance mandate |
| Qualification impact | ZERO (contributions covered by pipeline) | NEGATIVE (contributions removed) |
| Status | RETIRED | REVOKED |
| Motivation | Clean up (reduce overlay count) | Governance action |
| Zone impact | Reduces pressure (positive) | Reduces pressure (positive) |

---

## 7. Supersession/Revocation History Visibility

### 7.1 Version History View

```
Package: SEP-blueedge-CLU-04-001
──────────────────────────────────────────────
Version  Status       Active Period         Reason
v1       SUPERSEDED   2026-01-15 — 2026-03-20  Superseded by v2
v2       ACTIVATED    2026-03-20 — current     Enhanced entries
──────────────────────────────────────────────

Package: SEP-multi-001
──────────────────────────────────────────────
Version  Status       Active Period         Reason
v1       REVOKED      2026-01-10 — 2026-04-05  Trust violation confirmed
──────────────────────────────────────────────
```

### 7.2 History Persistence

```
artifacts/sqo/<client>/<run_id>/overlay_history/
├── SEP-<package_id>-history.json
├── supersession_log.json
├── revocation_log.json
├── retirement_log.json
└── cascade_events.json
```

---

## 8. Governance

- Supersession preserves lineage while upgrading contributions
- Revocation is terminal with full impact assessment
- Cascade revocation has depth (3) and size (5) limits
- De-authorization reverses operator decision before activation
- Retirement removes redundant overlays (post-pipeline-certification)
- Supersession history is externally visible with version tracking
- Every supersession, revocation, and retirement produces audit events
- Cascade exceeding limits triggers governance escalation
- No overlay lifecycle change occurs without full impact assessment
