# Authority Boundary and Publication Visibility

**Stream:** PI.SQO.COCKPIT.CERTIFICATION-PROGRESSION-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how certification visibility distinguishes provisional
operational state from certification-review state, authority-eligible
state, publication-authorized state, and LENS-consumable authority —
ensuring certification visibility never blurs authority boundaries.

---

## 2. Authority Boundary Visibility (CV-14)

### 2.1 Four Authority Boundaries in Certification Context

```
Boundary 1: PROVISIONAL ║ CERTIFICATION_REVIEW
  Left:  Sandbox-computed, no certification initiated
  Right: Certification pipeline active (replay/rollback)
  Gate:  certification initiation
  Visible: certification pipeline started, phase progress

Boundary 2: CERTIFICATION_REVIEW ║ AUTHORITY_ELIGIBLE
  Left:  Certification in progress or complete (not promoted)
  Right: Combined certification passed, promotion eligible
  Gate:  G-COMBINED-CERT
  Visible: combined decision, all evidence hashes

Boundary 3: AUTHORITY_ELIGIBLE ║ PUBLICATION_AUTHORIZED
  Left:  Promotion-eligible but not yet promoted and assessed
  Right: Authority-promoted and publication prerequisites met
  Gate:  G-OPERATOR-PROMOTE + G-QUAL-PUBLISH + G-ZONE-PUBLISH
  Visible: promotion record, publication gate status

Boundary 4: PUBLICATION_AUTHORIZED ║ LENS_CONSUMABLE
  Left:  Publication-eligible but not yet published
  Right: Published to LENS consumption surface
  Gate:  G-PUBLISH (operator authorization)
  Visible: publication record, LENS boundary status
```

### 2.2 Authority Boundary Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ AUTHORITY BOUNDARY VISIBILITY                                        │
│ Session: SBX-{client}-{run}                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ BOUNDARY STATE PER OVERLAY                                          │
│                                                                      │
│ PROVISIONAL   ║ CERT_REVIEW ║ AUTH_ELIGIBLE ║ PUB_AUTH ║ LENS      │
│ ─────────────────────────────────────────────────────────────────   │
│ SEP-003: ████ ║             ║              ║          ║             │
│ SEP-002: ─────║████████████ ║              ║          ║             │
│ SEP-001: ─────║─────────────║──────────────║██████████║ (pending)   │
│ ─────────────────────────────────────────────────────────────────   │
│               ║ G-CERT-INIT ║ G-COMBINED   ║G-PROMOTE ║ G-PUBLISH  │
│               ║             ║ G-CERT       ║G-QUAL-PUB║             │
│                                                                      │
│ BOUNDARY INTEGRITY                                                  │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Boundary                        │ Status    │ Violations       │ │
│ │─────────────────────────────────│───────────│──────────────────│ │
│ │ PROVISIONAL ║ CERT_REVIEW       │ ● INTACT  │ 0                │ │
│ │ CERT_REVIEW ║ AUTH_ELIGIBLE     │ ● INTACT  │ 0                │ │
│ │ AUTH_ELIGIBLE ║ PUB_AUTH         │ ● INTACT  │ 0                │ │
│ │ PUB_AUTH ║ LENS_CONSUMABLE      │ ● INTACT  │ 0                │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ANTI-LEAKAGE STATUS                                                 │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Rule                              │ Status    │ Last Verified  │ │
│ │───────────────────────────────────│───────────│────────────────│ │
│ │ AL-01 No provisional in authority │ ✓ ENFORCED│ 12:34          │ │
│ │ AL-02 No uncertified as authority │ ✓ ENFORCED│ 12:34          │ │
│ │ AL-03 No authority in LENS w/o pub│ ✓ ENFORCED│ 12:34          │ │
│ │ AL-04 No stale authority          │ ✓ ENFORCED│ 12:34          │ │
│ │ AL-05 No partial authority display│ ✓ ENFORCED│ 12:34          │ │
│ │ AL-06 No cross-boundary leakage   │ ✓ ENFORCED│ 12:34          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Boundary Detail] [View Anti-Leakage Detail]                │
│   [View Boundary History] [→ Certification Pipeline]               │
│   [→ Authority Promotion] [→ Publication Eligibility]              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Publication Boundary Visibility

### 3.1 Publication Boundary Detail

```
┌─────────────────────────────────────────────────────────────────────┐
│ PUBLICATION BOUNDARY                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ AUTHORITY → LENS BOUNDARY                                           │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                                                                  │ │
│ │ AUTHORITY STATE                ║  LENS CONSUMPTION              │ │
│ │ ──────────────────────────────║──────────────────────────────  │ │
│ │ 1 overlay promoted            ║  0 publications                │ │
│ │ 2 overlays in certification   ║  Gate: G-PUBLISH               │ │
│ │ Authority hash: k1l2…         ║  Status: CLOSED                │ │
│ │                               ║                                 │ │
│ │ WHAT CROSSES BOUNDARY:        ║  WHAT LENS SEES:               │ │
│ │ - Published authority state   ║  - State hash                  │ │
│ │ - Publication evidence        ║  - S-state                     │ │
│ │ - S-state + qualification     ║  - Qualification summary       │ │
│ │ - Zone at publication         ║  - Zone                        │ │
│ │                               ║                                 │ │
│ │ WHAT STAYS INSIDE:            ║  WHAT LENS NEVER SEES:         │ │
│ │ - Provisional state           ║  - Sandbox state               │ │
│ │ - Certification details       ║  - Pipeline phases             │ │
│ │ - Quarantine records          ║  - Investigation details       │ │
│ │ - Operator decisions          ║  - Operator identity           │ │
│ │ - Divergence investigations   ║  - Divergence detail           │ │
│ │ - Individual overlay state    ║  - Per-overlay certification   │ │
│ │                                                                  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ NAVIGATION                                                           │
│   [← Authority Promotion] [View Publication Records]                │
│   Terminal boundary — LENS is consumption-only.                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Zone Effect on Authority Boundaries

### 4.1 Zone-Boundary Interaction Matrix

| Zone | Cert Initiation | Combined Decision | Promotion | Publication | LENS |
|------|----------------|-------------------|-----------|-------------|------|
| SAFE | ✓ ALLOWED | ✓ ALLOWED | ✓ ALLOWED | ✓ ALLOWED | ✓ ALLOWED |
| PRESSURE | ✓ ALLOWED | ✓ ALLOWED | ✓ With approval | ✗ CAUTIONED | ✗ CAUTIONED |
| RISK | ✓ ALLOWED | ✗ RESTRICTED | ✗ BLOCKED | ✗ BLOCKED | ✗ BLOCKED |
| PROHIBITED | ✗ BLOCKED | ✗ BLOCKED | ✗ BLOCKED | ✗ BLOCKED | ✗ BLOCKED |

### 4.2 Zone Effect on Boundary Crossing

```
Zone SAFE:
  All boundary crossings permitted
  Overlays can progress from PROVISIONAL through to LENS_CONSUMABLE

Zone PRESSURE:
  Boundaries 1-2 crossable (certification can proceed)
  Boundary 3 requires enhanced approval
  Boundary 4 cautioned (operator must confirm zone stability)

Zone RISK:
  Boundary 1 crossable (cert can initiate)
  Boundary 2 restricted (only DENIED decisions, not CERTIFIED)
  Boundaries 3-4 blocked

Zone PROHIBITED:
  No boundary crossings permitted
  All overlays frozen at current state
  Revocation remains available (Boundary 3 regression)
```

---

## 5. Boundary Violation Detection

### 5.1 Violation Types

| # | Violation | Trigger | Severity | Response |
|---|-----------|---------|----------|----------|
| BV-01 | Provisional data in authority view | Uncertified data rendered as authority | CRITICAL | Render rejected, alert raised |
| BV-02 | Uncertified labeled as authority | Certification evidence missing or invalid | CRITICAL | Label corrected, investigation |
| BV-03 | Authority in LENS without publication | LENS receives unpublished state | CRITICAL | LENS boundary sealed, investigation |
| BV-04 | Stale authority presented | Certification evidence hash outdated | HIGH | Re-verification triggered |
| BV-05 | Partial authority rendered as complete | Not all overlays promoted but displayed as authority | HIGH | Render corrected, warning |
| BV-06 | Cross-boundary data leakage | Data crossing boundary without proper gate | CRITICAL | Boundary sealed, investigation |

### 5.2 Violation Monitoring

```
BOUNDARY VIOLATION MONITOR

  Active violations: 0
  Total violations (all time): 0
  Last boundary verification: 2026-05-11 12:34
  Verification frequency: every render + periodic (5 min)

  On every cockpit render that displays authority-related state:
    STEP 1: Verify overlay certification state against evidence
    STEP 2: Verify boundary integrity (no cross-boundary data)
    STEP 3: Verify anti-leakage rules (AL-01 through AL-06)
    STEP 4: Verify zone permits current boundary state

  Any violation → immediate CD-07 degradation signal
```

---

## 6. Governance

- 4 authority boundaries explicitly separated: PROVISIONAL, CERT_REVIEW, AUTH_ELIGIBLE, PUB_AUTH, LENS_CONSUMABLE
- Per-overlay boundary state visible with gate status
- 6 anti-leakage rules (AL-01 through AL-06) verified and visible
- Publication boundary: strict separation of what crosses to LENS and what stays inside
- Zone effect on boundary crossing: per-zone matrix defines allowed operations
- 6 boundary violation types with CRITICAL/HIGH severity and defined responses
- Boundary verification on every render plus periodic checks
- Boundary visibility does not mutate authority, publication, or LENS state
