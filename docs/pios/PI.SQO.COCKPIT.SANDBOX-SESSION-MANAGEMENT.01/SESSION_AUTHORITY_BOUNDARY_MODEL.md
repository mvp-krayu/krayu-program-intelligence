# Session Authority Boundary Model

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how sandbox sessions separate provisional operational
state from certification-ready state, authority-eligible state,
and publication-authorized state — ensuring session state may
NOT directly become LENS authority.

---

## 2. Session Authority States

### 2.1 Five Session Authority States

| # | State | Description | Boundary |
|---|-------|-------------|----------|
| SA-01 | PROVISIONAL | Sandbox-computed, no certification | Session internal only |
| SA-02 | CERTIFICATION_READY | Overlay meets certification prerequisites | Session → certification pipeline |
| SA-03 | CERTIFIED | Replay + rollback certified | Session → promotion boundary |
| SA-04 | AUTHORITY_ELIGIBLE | Combined certification grants eligibility | Session → authority boundary |
| SA-05 | AUTHORITY_PROMOTED | Promoted to governing truth | Crosses session boundary |

### 2.2 Authority State Boundaries within Session

```
┌──────────────────────────────────────────────────────┐
│ SESSION AUTHORITY BOUNDARIES                          │
│                                                       │
│ ┌────────────────────────────────────────────────┐   │
│ │ PROVISIONAL ZONE (session internal)             │   │
│ │                                                 │   │
│ │  ACTIVATED overlays (not yet certified)         │   │
│ │  Sandbox-computed qualification metrics         │   │
│ │  Provisional composite state                    │   │
│ │                                                 │   │
│ ├────────── CERTIFICATION BOUNDARY ──────────────┤   │
│ │                                                 │   │
│ │ CERTIFIED ZONE (session → promotion)            │   │
│ │                                                 │   │
│ │  Replay-certified overlays                      │   │
│ │  Rollback-certified overlays                    │   │
│ │  Certified composite contributions              │   │
│ │                                                 │   │
│ ├────────── AUTHORITY BOUNDARY ──────────────────┤   │
│ │                                                 │   │
│ │ AUTHORITY ZONE (crosses session boundary)       │   │
│ │                                                 │   │
│ │  Authority-promoted overlays                    │   │
│ │  Authority qualification metrics                │   │
│ │  Authority composite state                      │   │
│ │                                                 │   │
│ └────────────────────────────────────────────────┘   │
│                                                       │
│ ═══════════ PUBLICATION BOUNDARY ═══════════════════ │
│                                                       │
│ PUBLICATION ZONE (external to session)                │
│ Published authority → LENS consumption                │
└──────────────────────────────────────────────────────┘
```

---

## 3. Authority Transition Gates

### 3.1 Four Authority Transition Gates

| # | Gate | From | To | Requirements |
|---|------|------|----|-------------|
| AG-01 | G-CERT-READY | PROVISIONAL | CERTIFICATION_READY | Overlay AUTHORIZED, prerequisites met |
| AG-02 | G-CERTIFIED | CERTIFICATION_READY | CERTIFIED | REPLAY_CERTIFIED + ROLLBACK_CERTIFIED |
| AG-03 | G-AUTHORITY | CERTIFIED | AUTHORITY_ELIGIBLE | COMBINED_CERTIFIED (PROMOTION_ELIGIBLE) |
| AG-04 | G-PROMOTE | AUTHORITY_ELIGIBLE | AUTHORITY_PROMOTED | Operator + governance authorization |

### 3.2 Gate Evaluation within Session

```
FOR each overlay in session.overlay_chain:

  AG-01: Certification readiness
    IF overlay.status == "AUTHORIZED" AND session.status == "ACTIVE":
      overlay.authority_state = CERTIFICATION_READY
      → May initiate certification pipeline

  AG-02: Certification complete
    IF overlay.replay == "CERTIFIED" AND overlay.rollback IN ["CERTIFIED", "CERTIFIED_WITH_WARNINGS"]:
      overlay.authority_state = CERTIFIED
      → May proceed to combined certification

  AG-03: Authority eligibility
    IF overlay.combined == "PROMOTION_ELIGIBLE":
      overlay.authority_state = AUTHORITY_ELIGIBLE
      → Awaiting operator promotion authorization

  AG-04: Authority promotion
    IF operator_authorized AND governance_authorized:
      overlay.authority_state = AUTHORITY_PROMOTED
      → Overlay's contributions become governing truth
```

---

## 4. Session Authority Leakage Prevention

### 4.1 Six Anti-Leakage Rules

| # | Rule | Description | Enforcement |
|---|------|-------------|-------------|
| AL-01 | No provisional in authority views | PROVISIONAL overlay contributions never displayed as authority | Render logic checks authority_state |
| AL-02 | No uncertified promotion | AUTHORITY_PROMOTED requires AG-01 through AG-04 passage | Gate chain enforcement |
| AL-03 | No session-to-LENS direct path | Session state never directly enters LENS | Publication gate enforced outside session |
| AL-04 | No stale authority in session | If certification is invalidated, authority state reverts | Re-verification on certification event |
| AL-05 | No mixed authority display | Authority metrics and provisional metrics displayed separately | Render separation by authority_state |
| AL-06 | No authority aggregation across sessions | Authority from one session cannot combine with another | Namespace isolation enforces |

### 4.2 Anti-Leakage Verification

```
FUNCTION verifySessionAuthorityBoundary(session):

  violations = []

  // Check each overlay's authority state consistency
  FOR each overlay in session.overlay_chain:
    IF overlay.authority_state == AUTHORITY_PROMOTED:
      IF overlay.replay != "CERTIFIED":
        violations.push("AL-02: promoted without replay cert")
      IF overlay.rollback NOT IN ["CERTIFIED", "CERTIFIED_WITH_WARNINGS"]:
        violations.push("AL-02: promoted without rollback cert")
      IF overlay.combined != "PROMOTION_ELIGIBLE":
        violations.push("AL-02: promoted without combined cert")

  // Check no provisional data in authority metrics
  authority_contributions = session.overlay_chain
    .filter(o => o.authority_state == AUTHORITY_PROMOTED)
  provisional_contributions = session.overlay_chain
    .filter(o => o.authority_state != AUTHORITY_PROMOTED)

  IF authority_metrics include provisional_contributions:
    violations.push("AL-05: authority metrics include provisional data")

  IF violations.length > 0:
    → SESSION_AUTHORITY_VIOLATION
    → Session status → QUARANTINED
    → Investigation required

  RETURN { clean: true, verified_at: now() }
```

---

## 5. Authority Composition View

### 5.1 Session Authority Composition

```
┌──────────────────────────────────────────────────────┐
│ SESSION AUTHORITY COMPOSITION                         │
├──────────────────────────────────────────────────────┤
│                                                       │
│ AUTHORITY STATE (governing truth)                     │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Baseline:       45 fields (PIPELINE_CERTIFIED)   │ │
│ │ SEP-multi-001:   5 fields (AUTHORITY_PROMOTED)   │ │
│ │ ──────────────────────────────────────────────── │ │
│ │ Authority Total: 50/67 fields (74.6%)            │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ PROVISIONAL STATE (not yet authority)                 │
│ ┌──────────────────────────────────────────────────┐ │
│ │ SEP-multi-002:   4 fields (CERTIFIED, not prom.) │ │
│ │ SEP-multi-003:   3 fields (ACTIVATED, not cert.) │ │
│ │ ──────────────────────────────────────────────── │ │
│ │ Provisional Total: 7/67 fields (10.4%)           │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ COMPOSITE TOTAL: 57/67 fields (85.1%)                │
│ Authority: 74.6% │ Provisional: 10.4% │ Gap: 14.9%  │
└──────────────────────────────────────────────────────┘
```

---

## 6. Publication Boundary from Session

### 6.1 Session-to-Publication Path

```
Session authority state
    │
    │  All overlays AUTHORITY_PROMOTED?
    │  Qualification meets publication threshold?
    │  Zone permits publication?
    │  Pipeline certified?
    │  No open investigations?
    │
    ▼
Publication eligibility assessment (OUTSIDE session)
    │
    │  G-QUAL-PUBLISH + G-ZONE-PUBLISH + G-PIPELINE-CERT
    │
    ▼
Publication authorization (operator + governance + certification)
    │
    ▼
LENS consumption (published authority only)

CRITICAL: Publication assessment happens OUTSIDE the session.
The session produces authority-promoted state.
The publication pipeline consumes it.
The session does not control publication.
```

---

## 7. Authority Revocation within Session

### 7.1 Revocation Triggers

| # | Trigger | Action |
|---|---------|--------|
| AR-01 | Post-promotion divergence detected | Revert overlay to CERTIFIED, re-verify |
| AR-02 | Post-promotion rollback safety compromised | Revert overlay to CERTIFIED, re-certify |
| AR-03 | Overlay REVOKED (governance decision) | Remove overlay from authority |
| AR-04 | Session QUARANTINED | Freeze all authority operations |
| AR-05 | Zone enters PROHIBITED | Freeze all authority operations |

### 7.2 Revocation Process

```
FUNCTION revokeSessionAuthority(session, overlay_id, trigger):

  overlay = session.findOverlay(overlay_id)
  
  // Step 1: Revert authority state
  overlay.authority_state = CERTIFIED (if cert still valid) or PROVISIONAL
  
  // Step 2: Recompute authority metrics
  authority_overlays = session.overlay_chain
    .filter(o => o.authority_state == AUTHORITY_PROMOTED)
  session.authority_metrics = computeAuthorityMetrics(authority_overlays)
  
  // Step 3: Check publication impact
  IF overlay was included in publication assessment:
    → Notify publication domain of authority change
    → Publication eligibility may be revoked
  
  // Step 4: Record revocation
  revocation_event = {
    event: "AUTHORITY_REVOKED",
    overlay_id: overlay_id,
    trigger: trigger,
    session_ref: session.session_id
  }
```

---

## 8. Governance

- 5 session authority states from PROVISIONAL to AUTHORITY_PROMOTED
- 4 authority transition gates enforce sequential authority progression
- 6 anti-leakage rules prevent provisional state from masquerading as authority
- Anti-leakage verification runs on session state and can trigger quarantine
- Authority composition view separates authority and provisional contributions
- Publication boundary is OUTSIDE the session — sessions produce authority, not publication
- 5 authority revocation triggers with defined reversion process
- Session state may NOT directly become LENS authority
- Authority boundary model is client-agnostic
