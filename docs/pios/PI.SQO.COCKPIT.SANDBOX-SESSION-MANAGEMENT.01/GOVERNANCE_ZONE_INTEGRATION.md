# Governance Zone Integration

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how the 4-zone governance stability envelope integrates
into sandbox session operations — including escalation triggers,
operational restrictions, certification impacts, and publication
impacts within session boundaries.

---

## 2. Session Zone State

### 2.1 Zone State within Session

```json
{
  "session_zone_state": {
    "session_ref": "SBX-<client>-<run_id>",
    "current_zone": "SAFE",
    "zone_entered_at": "<ISO-8601>",
    "zone_history": [
      {
        "zone": "SAFE",
        "entered_at": "<ISO-8601>",
        "exited_at": null,
        "trigger": "SESSION_CREATED"
      }
    ],
    "stability_index": 94,
    "escalation_level": "G-0",
    "distance_to_pressure": 12,
    "distance_to_risk": 28,
    "distance_to_prohibited": 45
  }
}
```

---

## 3. Zone-Session Operation Matrix

### 3.1 Session Operations by Zone

| Operation | SAFE | PRESSURE | RISK | PROHIBITED |
|-----------|------|----------|------|-----------|
| Overlay activation | ✓ (batch ≤5) | ✓ (batch ≤3) | ✗ | ✗ |
| Replay certification | ✓ (≤10 conc.) | ✓ (≤3 conc.) | Restricted | ✗ |
| Rollback certification | ✓ (≤10 conc.) | ✓ (≤3 conc.) | Restricted | ✗ |
| Authority promotion | ✓ (≤5 conc.) | ✓ (≤2 conc.) | ✗ | ✗ |
| Rollback execution | ✓ | ✓ | ✓ | ✓ (recovery) |
| Revocation execution | ✓ | ✓ | ✓ | ✓ (always) |
| Session freeze | ✓ (operator) | ✓ (operator) | Automated | Automated |
| Session resume | ✓ | ✓ | Governance req. | Governance req. |
| Session archive | ✓ | ✓ | ✓ | ✗ |
| Lineage navigation | ✓ | ✓ | ✓ | ✓ (read-only) |

---

## 4. Zone Transition Impact on Sessions

### 4.1 SAFE → PRESSURE

```
Impact on session:
  - Reduce concurrent overlay activations to ≤3
  - Reduce concurrent certifications to ≤3
  - Reduce concurrent promotions to ≤2
  - Enable enhanced monitoring
  - Record zone transition in session history

Active operations:
  - In-progress activations: CONTINUE
  - In-progress certifications: CONTINUE
  - Queued operations: REQUEUE with reduced limits

Session state: remains ACTIVE
```

### 4.2 SAFE/PRESSURE → RISK

```
Impact on session:
  - BLOCK all new overlay activations
  - BLOCK all new authority promotions
  - RESTRICT certifications (input/integrity phases only)
  - BLOCK certification decisions (CERTIFIED blocked)
  - Rollback and revocation: CONTINUE (recovery operations)

Active operations:
  - In-progress activations: COMPLETE current, no new
  - In-progress certifications: PAUSE at decision phase
  - In-progress promotions: ROLLBACK if possible

Session state: remains ACTIVE but operationally constrained
```

### 4.3 ANY → PROHIBITED

```
Impact on session:
  - FREEZE session immediately
  - BLOCK ALL operations except:
    - Rollback execution (recovery)
    - Revocation execution (governance)
    - Lineage navigation (read-only)
    - Session archive (operator decision)
  - All in-progress operations: FREEZE at current point

Active operations:
  - In-progress activations: FREEZE (incomplete activation rolled back)
  - In-progress certifications: FREEZE (resume when zone exits)
  - In-progress promotions: ROLLBACK

Session state: FROZEN (with reason: PROHIBITED_ZONE)
```

### 4.4 Recovery Transitions

```
PROHIBITED → RISK:
  - Session remains FROZEN
  - Recovery operations (rollback, revocation) resume
  - Certification input/integrity phases resume
  - Governance must authorize session resume

RISK → PRESSURE:
  - Session UNFREEZES (if frozen by RISK)
  - Certification decisions resume
  - Activations resume with reduced limits
  - Promotions resume with reduced limits

PRESSURE → SAFE:
  - Full operations resume
  - Limits removed
  - Enhanced monitoring disabled
```

---

## 5. Session Escalation Architecture

### 5.1 Session Escalation Triggers

| # | Trigger | Escalation Level | Session Impact |
|---|---------|-----------------|----------------|
| SE-01 | Certification failure rate > 30% | G-1 | Advisory |
| SE-02 | Active quarantine in session | G-2 | Enhanced review |
| SE-03 | Divergence detected in session | G-3 | Session operations restricted |
| SE-04 | Non-determinism detected | G-4 | Session FROZEN |
| SE-05 | Cascade limit approaching (≥2/3 depth) | G-2 | Enhanced monitoring |
| SE-06 | Authority leakage detected | G-4 | Session QUARANTINED |
| SE-07 | Cross-session contamination | G-4 | Both sessions QUARANTINED |
| SE-08 | Zone in RISK > 1 hour | G-3 | Governance review |

### 5.2 Session Escalation Response

```
G-0 (Normal):
  - Standard operations
  - Routine monitoring

G-1 (Advisory):
  - Alert in session workspace
  - No operational restrictions
  - Operator acknowledged required

G-2 (Elevated):
  - Enhanced monitoring enabled
  - Operator review for certification decisions
  - Reduced concurrent limits

G-3 (Critical):
  - Governance intervention required
  - New activations blocked
  - Promotions blocked
  - Investigation required

G-4 (Emergency):
  - Session FROZEN or QUARANTINED
  - All operations blocked except recovery
  - Full investigation required
  - Governance must authorize resume
```

---

## 6. Session Zone Workspace View

```
┌──────────────────────────────────────────────────────┐
│ SESSION ZONE STATUS                                   │
├──────────────────────────────────────────────────────┤
│ Zone: ████████████████████ SAFE                       │
│ Stability: 94/100  │  Escalation: G-0                 │
│                                                       │
│ THRESHOLDS                                            │
│ → PRESSURE: 12 points away                            │
│ → RISK: 28 points away                                │
│ → PROHIBITED: 45 points away                          │
│                                                       │
│ OPERATIONAL CAPACITY                                  │
│ Activations: 3/5 used                                 │
│ Certifications: 1/10 active                           │
│ Promotions: 1/5 active                                │
│                                                       │
│ ZONE HISTORY (session lifetime)                       │
│ SAFE ████████████████████████████████████             │
│ No zone transitions since session creation            │
│                                                       │
│ ESCALATION TRIGGERS (active monitoring)               │
│ All triggers: OK (no thresholds approached)           │
└──────────────────────────────────────────────────────┘
```

---

## 7. Governance

- 4-zone model integrated into all session operations
- Zone-session operation matrix defines permitted/restricted/blocked operations per zone
- Zone transitions impact in-progress operations with defined rules
- PROHIBITED zone triggers immediate session freeze
- Recovery transitions restore operations progressively
- 8 session escalation triggers with 5-level response model (G-0 through G-4)
- G-4 escalation triggers session freeze or quarantine
- Unsafe session states remain externally visible through zone workspace
- Zone integration is client-agnostic
