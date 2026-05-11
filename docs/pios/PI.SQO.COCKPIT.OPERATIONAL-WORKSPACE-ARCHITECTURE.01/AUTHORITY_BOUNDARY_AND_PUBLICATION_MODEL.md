# Authority Boundary and Publication Model

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKSPACE-ARCHITECTURE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how the cockpit separates provisional operational state
from certified operational state, publication-eligible authority,
and LENS-consumable authority — ensuring no provisional sandbox
state masquerades as authority.

---

## 2. Authority State Boundary

### 2.1 Four Authority Boundaries

```
Boundary 1: PROVISIONAL ║ CERTIFIED
  Left:  Sandbox-computed state (not yet certified)
  Right: Replay + rollback certified state
  Gate:  G-COMBINED-CERT

Boundary 2: CERTIFIED ║ AUTHORITY
  Left:  Certified but not yet promoted
  Right: Authority-promoted (governing truth)
  Gate:  G-OPERATOR-PROMOTE

Boundary 3: AUTHORITY ║ PUBLICATION-ELIGIBLE
  Left:  Authority-promoted but not yet publication-eligible
  Right: Meets all publication prerequisites
  Gate:  G-QUAL-PUBLISH + G-ZONE-PUBLISH + G-PIPELINE-CERT

Boundary 4: PUBLICATION-ELIGIBLE ║ LENS-CONSUMABLE
  Left:  Publication-eligible but not yet published
  Right: Published to LENS consumption surface
  Gate:  G-PUBLISH (operator authorization)
```

### 2.2 Boundary Visualization in Cockpit

```
┌──────────────────────────────────────────────────────┐
│ AUTHORITY BOUNDARY STATUS                             │
├──────────────────────────────────────────────────────┤
│                                                       │
│ PROVISIONAL    ║ CERTIFIED     ║ AUTHORITY            │
│ (Sandbox)      ║ (Verified)    ║ (Governing)          │
│ ──────────────────────────────────────────────────    │
│ SEP-003: ████  ║               ║                      │
│ SEP-002: ██████║████           ║                      │
│ SEP-001: ██████║██████████████ ║████████████████      │
│ ──────────────────────────────────────────────────    │
│                ║               ║                      │
│                ║ G-COMBINED    ║ G-PROMOTE             │
│                ║ CERT          ║                      │
│                                                       │
│ PUBLICATION BOUNDARY                                  │
│ ──────────────────────────────────────────────────    │
│ PUB-ELIGIBLE   ║ LENS-CONSUMABLE                      │
│ ████████████   ║ (not yet published)                  │
│ SEP-001 only   ║ G-PUBLISH pending                    │
│ ──────────────────────────────────────────────────    │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 3. Publication Domain Workspace (WD-07)

### 3.1 Publication Domain State View

```
┌──────────────────────────────────────────────────────┐
│ PUBLICATION DOMAIN                         Health: ●  │
├──────────────────────────────────────────────────────┤
│ AUTHORITY PROMOTION STATUS                            │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Overlay       │ Cert Status │ Promotion Status   │ │
│ │───────────────│─────────────│────────────────────│ │
│ │ SEP-multi-001 │ ELIGIBLE    │ AUTHORITY_PROMOTED │ │
│ │ SEP-multi-002 │ PENDING     │ NOT_ELIGIBLE       │ │
│ │ SEP-multi-003 │ PENDING     │ NOT_ELIGIBLE       │ │
│ └──────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│ PUBLICATION ELIGIBILITY                               │
│ Status: BLOCKED                                       │
│ Blocking Conditions:                                  │
│   ✗ PE-01: Not all overlays promoted (1/3)           │
│   ✗ PE-02: Qualification below threshold (85.1%<90%)│
│   ✓ PE-03: No RESTRICTED overlays                    │
│   ✓ PE-04: Zone permits (SAFE)                       │
│   ✗ PE-05: Pipeline not yet certified                │
│   ✓ PE-06: No open investigations                    │
├──────────────────────────────────────────────────────┤
│ PUBLICATION HISTORY                                   │
│ Publications: 0  │  Retractions: 0                    │
└──────────────────────────────────────────────────────┘
```

### 3.2 Publication Domain Action Surface

| # | Action | Authorization | Zone Constraint |
|---|--------|--------------|----------------|
| PA-01 | View authority promotion status | Operator | Always |
| PA-02 | View publication eligibility | Operator | Always |
| PA-03 | Authorize authority promotion | Operator + Governance | SAFE, PRESSURE |
| PA-04 | View promotion impact projection | Operator | Always |
| PA-05 | Authorize publication | Operator + Governance + Certification | SAFE |
| PA-06 | Retract publication | Operator + Governance | Always |
| PA-07 | View publication history | Operator | Always |
| PA-08 | View certification-to-authority chain | Operator | Always |

---

## 4. Authority Leakage Prevention

### 4.1 Five Anti-Leakage Rules

| # | Rule | Enforcement |
|---|------|-------------|
| AL-01 | No provisional data in authority views | Cockpit renders provisional and authority in visually separated regions |
| AL-02 | No uncertified data labeled as authority | State labels are derived from certification evidence (not operator assertion) |
| AL-03 | No authority data in LENS without publication gate | LENS consumption requires G-PUBLISH (explicit operator authorization) |
| AL-04 | No stale authority | Authority state is re-verified against latest certification on access |
| AL-05 | No partial authority presentation | All contributing overlays must be authority-promoted before composite is marked authority |

### 4.2 Anti-Leakage Verification

```
On every cockpit render that displays authority state:

  STEP 1: Verify each overlay's promotion status
    IF any overlay.authority_status != AUTHORITY_PROMOTED:
      → Display as PROVISIONAL (not authority)

  STEP 2: Verify certification evidence is current
    FOR each AUTHORITY_PROMOTED overlay:
      IF certification evidence hash is stale:
        → Display WARNING: "certification evidence needs re-verification"

  STEP 3: Verify governance zone permits display
    IF zone == PROHIBITED:
      → Display authority state as FROZEN

  STEP 4: Verify no provisional data in authority region
    SCAN rendered authority view
    IF any item lacks certification evidence reference:
      → REJECT render, display error
```

---

## 5. LENS Consumption Boundary

### 5.1 What LENS Receives

```
LENS receives ONLY:
  1. Published authority state (WS-05)
  2. Publication evidence (CE-06 references)
  3. S-state at publication time
  4. Qualification metrics at publication time
  5. Governance zone at publication time

LENS does NOT receive:
  1. Provisional sandbox state
  2. Certification details (only pass/fail)
  3. Investigation records
  4. Quarantine details
  5. Operator decisions or actions
  6. Workflow orchestration state
  7. Individual overlay details
```

### 5.2 LENS Publication Record

```json
{
  "lens_publication": {
    "publication_id": "PUB-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "authority_state_hash": "<sha256>",
    "s_state": "S2",
    "qualification": {
      "grounding_ratio": 0.851,
      "q_class": "Q-AUTHORITY-CANDIDATE",
      "backed_count": 57,
      "total_fields": 67
    },
    "governance_zone": "SAFE",
    "certification_summary": {
      "all_overlays_certified": true,
      "all_overlays_promoted": true,
      "pipeline_certified": true
    },
    "contributing_overlays": 3,
    "retracted": false
  }
}
```

---

## 6. Authority State Progression View

### 6.1 Progression Visualization

```
┌──────────────────────────────────────────────────────┐
│ AUTHORITY STATE PROGRESSION                           │
├──────────────────────────────────────────────────────┤
│                                                       │
│ S-STATE: S2                                           │
│ ┌────┐   ┌────┐   ┌────┐                            │
│ │ S0 │──▶│ S1 │──▶│ S2 │──▶ S3 (not yet reached)   │
│ │done│   │done│   │curr│                             │
│ └────┘   └────┘   └────┘                            │
│                                                       │
│ S2 → S3 REQUIREMENTS                                 │
│   ✗ All overlays authority-promoted (1/3)            │
│   ✗ Qualification ≥ S3 threshold (85.1%<90%)        │
│   ✗ Pipeline certified (pending)                     │
│   ✓ Zone permits (SAFE)                              │
│                                                       │
│ AUTHORITY COMPOSITION                                 │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Baseline authority (S1):    45 fields             │ │
│ │ Overlay authority (prom.):   5 fields (1 overlay) │ │
│ │ Overlay provisional (cert.): 12 fields (2 overlay)│ │
│ │ Total authority:            50/67 (74.6%)         │ │
│ │ Total composite:            57/67 (85.1%)         │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ GAP: 7 fields are provisionally computed but not      │
│ yet authority-promoted                                │
└──────────────────────────────────────────────────────┘
```

---

## 7. Governance

- 4 authority boundaries explicitly separate PROVISIONAL, CERTIFIED, AUTHORITY, and LENS-CONSUMABLE
- Publication domain workspace shows promotion status, eligibility, and blocking conditions
- 8 publication actions with defined authorization and zone constraints
- 5 anti-leakage rules prevent provisional state from masquerading as authority
- Anti-leakage verification runs on every authority state render
- LENS consumption boundary strictly limits what LENS receives (published authority only)
- Authority state progression shows S-state requirements and authority composition
- No provisional sandbox state directly enters LENS
- Authority boundary model is client-agnostic
