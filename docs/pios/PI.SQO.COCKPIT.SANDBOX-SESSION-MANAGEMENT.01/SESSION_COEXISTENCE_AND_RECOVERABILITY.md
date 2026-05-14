# Session Coexistence and Recoverability

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how multiple sandbox sessions coexist, isolate, archive,
supersede, and recover — without operational contamination —
and how sessions recover from failures.

---

## 2. Session Coexistence Model

### 2.1 Coexistence Rules

| # | Rule | Description | Enforcement |
|---|------|-------------|-------------|
| CX-01 | One ACTIVE per run | At most one ACTIVE session per client+run | Session creation gate |
| CX-02 | Cross-client isolation | Sessions from different clients are completely isolated | Namespace isolation |
| CX-03 | Cross-run isolation | Sessions from different runs (same client) are isolated | Namespace isolation |
| CX-04 | Predecessor visibility | SUPERSEDED sessions remain readable for audit | Read-only terminal state |
| CX-05 | No shared state | Sessions share no mutable state | Namespace enforcement |
| CX-06 | Shared baseline only | Sessions may reference the same certified baseline (immutable) | Baseline is read-only |
| CX-07 | Independent certification | Each session's certifications are independent | Session-scoped certification |

### 2.2 Coexistence Scenarios

| Scenario | Permitted? | Constraint |
|----------|-----------|-----------|
| Two ACTIVE sessions, different clients | YES | Fully isolated |
| Two ACTIVE sessions, same client, different runs | YES | Run-isolated |
| Two ACTIVE sessions, same client, same run | NO | CX-01 violated |
| ACTIVE + ARCHIVED, same client+run | YES | ARCHIVED is read-only |
| ACTIVE + SUPERSEDED, same client+run | YES | SUPERSEDED is read-only |
| ACTIVE + QUARANTINED, same client+run | NO | Quarantine must resolve first |

---

## 3. Session Supersession Model

### 3.1 Supersession Process

```
FUNCTION supersedeSession(old_session, reason):

  // Step 1: Verify old session is supersession-eligible
  IF old_session.status IN [REVOKED]:
    → SUPERSESSION_BLOCKED: "REVOKED sessions cannot be superseded"
  IF old_session.status IN [QUARANTINED, ESCALATED]:
    → SUPERSESSION_BLOCKED: "Resolve quarantine/escalation first"

  // Step 2: Create successor session
  new_session = createSession(old_session.client_id, old_session.run_id)
  new_session.predecessor = old_session.session_id

  // Step 3: Determine inheritance
  // New session inherits:
  //   - Same certified baseline
  //   - Authority-promoted overlays (as starting overlay chain)
  //   - Certification evidence for promoted overlays
  // New session does NOT inherit:
  //   - Provisional overlays
  //   - Non-certified state
  //   - Quarantine history

  new_session.baseline = old_session.baseline
  FOR each overlay in old_session.overlay_chain:
    IF overlay.authority_state == AUTHORITY_PROMOTED:
      new_session.inherited_overlays.push({
        overlay_id: overlay.overlay_id,
        inherited_from: old_session.session_id,
        authority_evidence: overlay.certification_refs
      })

  // Step 4: Mark old session as SUPERSEDED
  old_session.status = SUPERSEDED
  old_session.superseded_by = new_session.session_id
  old_session.superseded_at = now()

  // Step 5: Activate new session
  new_session.status = ACTIVE

  RETURN new_session
```

### 3.2 Inheritance Rules

| Inherited | Not Inherited | Reason |
|-----------|--------------|--------|
| Certified baseline | Provisional composite | Provisional state is not authority |
| Authority-promoted overlays | Non-promoted overlays | Only authority carries forward |
| Promotion evidence | Quarantine history | Fresh start for session operations |
| S-state at authority level | Provisional S-state | Only certified S-state transfers |

---

## 4. Session Archival Model

### 4.1 Archival Process

```
FUNCTION archiveSession(session):

  // Step 1: Verify no active operations
  IF session has in_progress certifications:
    → Wait or cancel
  IF session has pending approvals:
    → Operator must resolve

  // Step 2: Create archive snapshot
  archive = {
    session_id: session.session_id,
    archive_timestamp: now(),
    final_state: fullSessionSnapshot(session),
    final_hash: sha256(session),
    overlay_chain: session.overlay_chain,
    certification_state: session.certification_state,
    authority_state: session.authority_metrics,
    lineage_summary: computeLineageSummary(session),
    zone_history: session.zone_history,
    escalation_history: session.escalation_history
  }

  // Step 3: Set terminal state
  session.status = ARCHIVED
  session.archived_at = now()

  // Step 4: Retain for audit
  // All session data retained indefinitely
  // Read-only access for lineage navigation
```

### 4.2 Archive Accessibility

| Operation | Permitted on Archived Session? |
|-----------|-------------------------------|
| View session state | YES |
| Navigate lineage | YES |
| View certification evidence | YES |
| View overlay chain | YES |
| Activate overlays | NO |
| Initiate certifications | NO |
| Promote authority | NO |
| Modify any state | NO |

---

## 5. Session Recoverability Model

### 5.1 Five Recovery Levels

| Level | Action | Cost | Trigger |
|-------|--------|------|---------|
| R-01 | Rollback last overlay | LOW | Operator decision, minor issue |
| R-02 | Rollback to specific overlay | MEDIUM | Targeted recovery after certification failure |
| R-03 | Rollback all overlays | HIGH | Major issue, return to baseline overlay state |
| R-04 | Restore from baseline | HIGH | Critical issue, start from certified baseline |
| R-05 | Supersede session | MAXIMUM | Session fundamentally compromised |

### 5.2 Recovery Decision Matrix

| Session State | R-01 | R-02 | R-03 | R-04 | R-05 |
|--------------|------|------|------|------|------|
| ACTIVE | ✓ | ✓ | ✓ | ✓ | ✓ |
| REPLAY_VALIDATING | ✗ (wait) | ✗ (wait) | ✓ | ✓ | ✓ |
| ROLLBACK_VALIDATING | ✗ (wait) | ✗ (wait) | ✓ | ✓ | ✓ |
| CERTIFICATION_REVIEW | ✓ | ✓ | ✓ | ✓ | ✓ |
| QUARANTINED | ✓ | ✓ | ✓ | ✓ | ✓ |
| ESCALATED | ✗ | ✗ | ✓ (governance) | ✓ (governance) | ✓ (governance) |
| FROZEN | ✓ (recovery) | ✓ (recovery) | ✓ (recovery) | ✓ (recovery) | ✓ |

### 5.3 Recovery Process

```
FUNCTION recoverSession(session, level, target):

  // Step 1: Verify recovery authorization
  IF level IN [R-01, R-02]:
    REQUIRE operator authorization
  IF level IN [R-03, R-04, R-05]:
    REQUIRE operator + governance authorization

  // Step 2: Create recovery point (pre-recovery state)
  pre_recovery = createRecoveryPoint(session)

  // Step 3: Execute recovery
  SWITCH level:
    R-01: rollbackOverlay(session, session.overlay_chain.last)
    R-02: rollbackToPosition(session, target.position)
    R-03: rollbackAllOverlays(session)
    R-04: restoreFromBaseline(session)
    R-05: supersedeSession(session, "RECOVERY")

  // Step 4: Recompute session state
  session.composite_hash = sha256(session.composite)
  session.qualification = recomputeMetrics(session.composite)
  session.certification_state = recomputeCertificationState(session)

  // Step 5: Record recovery event
  recovery_event = {
    event: "SESSION_RECOVERED",
    level: level,
    pre_recovery_hash: pre_recovery.hash,
    post_recovery_hash: session.composite_hash,
    s_state_change: pre_s_state + " → " + session.qualification.s_state,
    authority_impact: computeAuthorityImpact(pre_recovery, session)
  }
```

---

## 6. Recovery Impact Assessment

### 6.1 Impact Dimensions

| Dimension | Assessment |
|-----------|-----------|
| S-state regression | What S-state does the session revert to? |
| Authority loss | How many authority-promoted overlays are affected? |
| Certification loss | How many certifications become invalid? |
| Lineage impact | Are any lineage chains broken? |
| Publication impact | Is publication eligibility affected? |

### 6.2 Impact Visualization

```
┌──────────────────────────────────────────────────────┐
│ RECOVERY IMPACT ASSESSMENT                            │
│ Level: R-02 (rollback to overlay 1)                  │
├──────────────────────────────────────────────────────┤
│                                                       │
│ S-State: S2 → S1 (regression)                        │
│ Overlays removed: SEP-multi-002, SEP-multi-003       │
│ Authority impact: 0 (removed overlays not promoted)  │
│ Certifications invalidated: 1 (RCERT for SEP-002)   │
│ Lineage impact: NONE (remaining chains intact)       │
│ Publication impact: NONE (not yet eligible)          │
│                                                       │
│ POST-RECOVERY STATE                                   │
│ Overlays: 1 (SEP-multi-001)                          │
│ Composite: baseline + SEP-001 contributions          │
│ Grounding: 67.2% (down from 85.1%)                   │
│ Authority: 50/67 fields (unchanged)                   │
│                                                       │
│ [Confirm Recovery] [Cancel]                           │
└──────────────────────────────────────────────────────┘
```

---

## 7. Session Failure Modes

### 7.1 Session-Specific Failure Modes

| # | Failure | Detection | Recovery |
|---|---------|-----------|----------|
| SF-01 | Baseline corruption | Hash verification failure | R-04 (restore from backup baseline) |
| SF-02 | Overlay chain integrity failure | Chain hash verification | R-02 or R-03 (rollback to valid state) |
| SF-03 | Composite state divergence | Replay reconstruction mismatch | Investigation + R-02/R-03 |
| SF-04 | Namespace contamination | Contamination detection | R-05 (supersede session) |
| SF-05 | Certification evidence corruption | Evidence hash verification | Re-certification |
| SF-06 | Zone-induced freeze | Zone enters PROHIBITED | Wait for zone recovery |
| SF-07 | Escalation cascade | Multiple G-3+ escalations | R-04 or R-05 |

---

## 8. Governance

- One ACTIVE session per client+run; cross-client and cross-run isolation enforced
- Session supersession inherits only authority-promoted state — provisional state is abandoned
- Archival retains full session state indefinitely for audit
- 5 recovery levels from overlay rollback to session supersession
- Recovery requires operator authorization (R-01/02) or dual authorization (R-03/04/05)
- Recovery impact assessment shows S-state, authority, certification, lineage, and publication impact
- 7 session-specific failure modes with defined detection and recovery
- Sessions coexist, isolate, archive, supersede, and recover without operational contamination
- Session coexistence model is client-agnostic
