# Authority and Publication Eligibility Visibility

**Stream:** PI.SQO.COCKPIT.CERTIFICATION-PROGRESSION-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how authority eligibility and publication eligibility become
operationally visible inside the cockpit — including authority
promotion prerequisites, promotion gate status, publication
prerequisites, publication readiness, and the zone effect on
authority and publication operations.

---

## 2. Authority Eligibility Visibility (CV-05)

### 2.1 Authority Eligibility Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ AUTHORITY ELIGIBILITY                                                │
│ Session: SBX-{client}-{run}  │  Zone: SAFE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ PROMOTION STATUS OVERVIEW                                           │
│   Eligible: 0  │  Promoted: 1  │  Restricted: 0  │  Revoked: 0    │
│   Pending certification: 2                                          │
│                                                                      │
│ PER-OVERLAY AUTHORITY ELIGIBILITY                                   │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Overlay       │ Cert Status    │ Promotion      │ Blocker       │ │
│ │───────────────│────────────────│────────────────│───────────────│ │
│ │ SEP-multi-001 │ ✓ CERTIFIED    │ ✓ PROMOTED     │ None          │ │
│ │ SEP-multi-002 │ ● IN_PROGRESS  │ ○ NOT_ELIGIBLE │ AP-02,03,04   │ │
│ │ SEP-multi-003 │ ○ NOT_STARTED  │ ○ NOT_ELIGIBLE │ AP-02,03,04   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ PROMOTION PREREQUISITES: SEP-multi-002                              │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Prerequisite                    │ Status          │ Detail      │ │
│ │─────────────────────────────────│─────────────────│─────────────│ │
│ │ AP-01 Overlay ACTIVATED         │ ✓ MET           │ Active      │ │
│ │ AP-02 Replay CERTIFIED          │ ✗ NOT MET       │ Phase 3/6   │ │
│ │ AP-03 Rollback CERTIFIED        │ ✗ NOT MET       │ Phase 2/5   │ │
│ │ AP-04 Combined CERTIFIED        │ ✗ NOT MET       │ Pending     │ │
│ │ AP-05 Zone permits              │ ✓ MET           │ SAFE        │ │
│ │ AP-06 No divergence             │ ✓ MET           │ 0 active    │ │
│ │ AP-07 No ambiguity              │ ✓ MET           │ 0 active    │ │
│ │ AP-08 Operator authorization    │ ○ PENDING       │ Awaiting    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ PROMOTION IMPACT PROJECTION: SEP-multi-002                          │
│   If promoted:                                                      │
│     Authority coverage: 50 → 62 fields (74.6% → 92.5%)            │
│     S-state impact: closer to S3 threshold                          │
│     Zone projection: SAFE (no degradation)                          │
│     Trust impact: HIGH → HIGH (maintained)                          │
│                                                                      │
│ NAVIGATION                                                           │
│   [Click overlay for promotion detail]                              │
│   [View Promotion History] [View Blocked Prerequisites]             │
│   [→ Certification Pipeline] [→ Publication Eligibility]            │
│   [→ Zone Impact]                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Authority Promotion Detail

```
┌─────────────────────────────────────────────────────────────────────┐
│ AUTHORITY PROMOTION DETAIL: SEP-multi-001                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ PROMOTION RECORD                                                    │
│   Promotion ID: PROM-BE-001-001                                    │
│   Promoted at: 2026-05-10 09:00                                    │
│   Promoted by: operator@krayu                                      │
│   Zone at promotion: SAFE                                          │
│   Escalation at promotion: G-0                                     │
│                                                                      │
│ CERTIFICATION CHAIN                                                  │
│   Replay: RCERT-BE-001-017 (REPLAY_CERTIFIED)                      │
│   Rollback: RBCERT-BE-001-012 (ROLLBACK_CERTIFIED)                 │
│   Combined: CERT-BE-001-009 (PROMOTION_ELIGIBLE)                   │
│   Chain integrity: ✓ VERIFIED                                       │
│                                                                      │
│ AUTHORITY CONTRIBUTION                                               │
│   Fields contributed: 12                                            │
│   Domains affected: Revenue, Capacity, Growth                       │
│   Qualification impact: grounding +7.2%                             │
│                                                                      │
│ POST-PROMOTION HEALTH                                                │
│   Divergence checks since promotion: 3 (all MATCH)                 │
│   Last verification: 2026-05-11 12:00                              │
│   Authority status: ● STABLE                                       │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Certification Evidence] [View Contribution Detail]          │
│   [→ Publication Eligibility] [→ Authority Boundary]               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Publication Eligibility Visibility (CV-06)

### 3.1 Publication Eligibility Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ PUBLICATION ELIGIBILITY                                              │
│ Session: SBX-{client}-{run}  │  Zone: SAFE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ COMPOSITE PUBLICATION STATUS: BLOCKED                               │
│   Blocking reason: 2 overlays not yet authority-promoted            │
│                                                                      │
│ PUBLICATION PREREQUISITES (PE-01 through PE-06)                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Prerequisite                         │ Status    │ Detail       │ │
│ │──────────────────────────────────────│───────────│──────────────│ │
│ │ PE-01 All overlays PROMOTED          │ ✗ NOT MET │ 1/3 promoted │ │
│ │ PE-02 Qualification meets threshold  │ ✗ NOT MET │ 85.1% < 90% │ │
│ │ PE-03 No RESTRICTED promotions       │ ✓ MET     │ 0 restricted │ │
│ │ PE-04 Zone permits publication       │ ✓ MET     │ SAFE         │ │
│ │ PE-05 Pipeline certification         │ ✗ NOT MET │ Pending      │ │
│ │ PE-06 No open investigations         │ ✓ MET     │ 0 active     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ PUBLICATION READINESS TIMELINE                                      │
│   PE-01: requires SEP-002 + SEP-003 certification and promotion    │
│     Estimated: ~48h (if both certifications proceed normally)       │
│   PE-02: requires additional overlay contributions                  │
│     Gap: 4.9% to publication threshold                              │
│   PE-05: requires pipeline certification                            │
│     Estimated: pending scheduling                                   │
│                                                                      │
│ PUBLICATION GATES                                                    │
│   G-AUTHORITY-COMPLETE: ✗ BLOCKED (1/3 promoted)                   │
│   G-QUAL-PUBLISH: ✗ BLOCKED (85.1% < 90%)                         │
│   G-ZONE-PUBLISH: ✓ PASSED                                         │
│   G-PIPELINE-CERT: ✗ BLOCKED (pending)                             │
│                                                                      │
│ PUBLICATION BOUNDARY                                                 │
│   AUTHORITY          ║ LENS-CONSUMABLE                              │
│   1 overlay promoted ║ (not yet eligible)                           │
│   Gate: G-PUBLISH (requires all prerequisites + operator auth)      │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Blocker Detail] [View Publication History]                  │
│   [→ Authority Promotion] [→ LENS Boundary]                        │
│   [→ Qualification Detail] [→ Zone Impact]                         │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Publication Impact Projection

```
┌─────────────────────────────────────────────────────────────────────┐
│ PUBLICATION IMPACT PROJECTION                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ SCENARIO: All 3 overlays certified and promoted                     │
│   Qualification: 85.1% → ~93% (estimated)                          │
│   S-state: S2 → S3 (if all thresholds met)                         │
│   Publication: ELIGIBLE                                             │
│   LENS impact: authority state published with full overlay coverage │
│                                                                      │
│ SCENARIO: Only SEP-002 certified (SEP-003 fails)                   │
│   Qualification: 85.1% → ~89% (estimated)                          │
│   S-state: S2 (threshold not met)                                   │
│   Publication: BLOCKED (PE-02 not met: 89% < 90%)                  │
│   Gap: 1% below publication threshold                               │
│                                                                      │
│ ZONE EFFECT ON PUBLICATION                                          │
│   Current zone: SAFE → publication PERMITTED                        │
│   If zone → PRESSURE: publication CAUTIONED (operator confirm)      │
│   If zone → RISK: publication BLOCKED                               │
│   If zone → PROHIBITED: publication BLOCKED                         │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Scenario Detail] [View Zone Projection]                     │
│   [→ Qualification Metrics] [→ S-State Progression]                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. LENS Consumption Boundary Visibility

### 4.1 LENS Boundary Status

```
┌─────────────────────────────────────────────────────────────────────┐
│ LENS CONSUMPTION BOUNDARY                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ BOUNDARY STATUS: CLOSED (no publication authorized)                 │
│                                                                      │
│ WHAT LENS WOULD RECEIVE (if published):                             │
│   Published authority state hash                                    │
│   S-state at publication: S2                                        │
│   Qualification at publication: 85.1%                               │
│   Governance zone at publication: SAFE                              │
│   Certification summary: all-overlays-certified = false             │
│                                                                      │
│ WHAT LENS DOES NOT RECEIVE:                                         │
│   Provisional sandbox state                                        │
│   Certification pipeline details                                    │
│   Investigation records                                             │
│   Quarantine details                                                │
│   Operator decisions                                                │
│                                                                      │
│ PUBLICATION HISTORY: 0 publications  │  0 retractions              │
│                                                                      │
│ NAVIGATION                                                           │
│   [← Publication Eligibility]                                       │
│   This is the terminal certification boundary.                      │
│   LENS is consumption-only — no cockpit traversal beyond.           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Governance

- Authority eligibility: 8 prerequisites (AP-01 through AP-08) visible per overlay
- Promotion impact projection before execution
- Authority contribution and post-promotion health monitoring
- Publication eligibility: 6 prerequisites (PE-01 through PE-06) visible
- Publication readiness timeline with estimated completion
- Publication impact projection under multiple scenarios
- LENS consumption boundary visible with strict content separation
- Zone effect on authority and publication operations visible
- Visibility does not mutate authority, publication, or LENS state
