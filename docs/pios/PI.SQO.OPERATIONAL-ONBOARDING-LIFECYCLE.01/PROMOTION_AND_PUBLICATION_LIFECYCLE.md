# Promotion and Publication Lifecycle

**Stream:** PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how provisional sandbox qualification state becomes trusted
qualification authority — the governed lifecycle for promotion review,
certification decision, and authority publication.

This is the most governance-critical lifecycle in the operational
onboarding system. Incorrect promotion creates false qualification
authority. Premature publication exposes unverified state to
downstream consumers.

---

## 2. Certification Hierarchy (From Upstream)

```
PIPELINE_CERTIFIED    Highest trust. Pipeline-verified structural truth.
    │
    ├── OVERLAY_VERIFIED    Individually validated through 8-phase lifecycle.
    │
    └── SANDBOX_COMPUTED    Composite of CERTIFIED + OVERLAY contributions.
        │
        └── UNVERIFIED      Not yet processed through lifecycle.
```

**The promotion lifecycle governs transitions between these levels.**

---

## 3. Promotion Review Lifecycle (Stage 10)

### 3.1 Promotion Eligibility Assessment

```
FOR EACH active overlay contribution:
  CHECK 1: Package passed all 8 lifecycle phases
  CHECK 2: Replay-verified at current state (MATCH)
  CHECK 3: Rollback-verified (independently removable)
  CHECK 4: Attribution complete (domain, package, entry, confidence)
  CHECK 5: No contested claims on target domain
  CHECK 6: Governance zone ≤ PRESSURE during activation
  CHECK 7: No entropy indicators triggered since activation
```

### 3.2 Promotion Eligibility Categories

| Category | Definition | Requirements |
|----------|-----------|-------------|
| ELIGIBLE | Overlay meets all 7 checks | May proceed to certification |
| CONDITIONAL | Overlay meets 5–6 checks | Requires governance review of gaps |
| INELIGIBLE | Overlay fails ≤ 4 checks | Cannot proceed, requires remediation |

### 3.3 Promotion Review Report

```json
{
  "promotion_review": {
    "sandbox_id": "<id>",
    "review_timestamp": "<ISO-8601>",
    "total_overlays": N,
    "eligible": E,
    "conditional": C,
    "ineligible": I,
    "overlays": [
      {
        "package_id": "SEP-multi-001",
        "domain": "DOMAIN-11",
        "eligibility": "ELIGIBLE",
        "checks_passed": 7,
        "checks_total": 7,
        "replay_verified": true,
        "rollback_verified": true,
        "attribution_complete": true,
        "governance_zone_at_activation": "SAFE"
      }
    ],
    "composite_promotion_status": "READY | PARTIAL | BLOCKED"
  }
}
```

### 3.4 Promotion Gate (G-PROMOTE)

| Check | Requirement |
|-------|------------|
| All overlays assessed | Every active overlay has promotion eligibility |
| Replay chain complete | All states in the chain replay-verified |
| Rollback chain complete | Round-trip proof verified |
| Attribution gap-free | Every domain contribution fully attributed |
| No contested claims | No domain has competing overlay claims |

---

## 4. Certification Decision Lifecycle (Stage 11)

### 4.1 Certification Scope

Certification confirms that overlay contributions have been:
1. Structurally validated (package integrity)
2. Semantically authorized (class authorization)
3. Deterministically applied (replay-verified)
4. Reversibly activated (rollback-verified)
5. Completely attributed (per-domain, per-package)
6. Governed throughout (governance zone, escalation, audit)

**Certification does NOT confirm:**
- Semantic truth of overlay claims (that requires pipeline re-execution)
- Business domain accuracy (outside SQO scope)
- Evidence source quality (owned by ingestion pipeline)

### 4.2 Certification Decision Process

```
STEP 1: Review Promotion Report
  - All overlays ELIGIBLE or CONDITIONAL?
  - Any INELIGIBLE overlays blocking?

STEP 2: Verify Governance Posture
  - Current governance zone ≤ PRESSURE?
  - Current escalation level ≤ G-1?
  - No active entropy indicators?

STEP 3: Verify Replay Guarantee
  - Full replay chain verified (MATCH at every state)?
  - Cross-snapshot verifications complete?
  - Replay determinism confirmed?

STEP 4: Issue Certification
  - CERTIFY: All conditions met → overlay contributions confirmed
  - CERTIFY_PARTIAL: Some overlays certified, others pending
  - DENY: Conditions not met → reason recorded, remediation identified
  - DEFER: Decision postponed → packages remain OVERLAY_VERIFIED
```

### 4.3 Certification Record

```json
{
  "certification_record": {
    "certification_id": "<uuid>",
    "sandbox_id": "<id>",
    "timestamp": "<ISO-8601>",
    "decision": "CERTIFY | CERTIFY_PARTIAL | DENY | DEFER",
    "scope": {
      "overlays_certified": ["SEP-multi-001", "SEP-multi-002", "SEP-multi-003"],
      "domains_certified": ["DOMAIN-11", "DOMAIN-02", "DOMAIN-08"],
      "composite_s_state": "S2",
      "composite_backed": 7,
      "certification_level": "OVERLAY_VERIFIED"
    },
    "guarantees": {
      "replay_verified": true,
      "rollback_verified": true,
      "attribution_complete": true,
      "governance_zone_at_certification": "SAFE",
      "entropy_indicators_at_certification": 0
    },
    "limitations": {
      "not_pipeline_certified": true,
      "overlay_dependent": true,
      "revocable": true,
      "disclosure_required": true
    }
  }
}
```

### 4.4 Certification Gate (G-CERTIFY)

| Check | Requirement |
|-------|------------|
| Promotion review complete | All overlays assessed for eligibility |
| Governance zone | ≤ PRESSURE at time of certification |
| Replay chain | ALL states MATCH |
| Rollback chain | Round-trip proof VERIFIED |
| Entropy state | ZERO indicators triggered |
| Attribution | COMPLETE for all certified domains |

---

## 5. Authority Publication Lifecycle (Stage 12)

### 5.1 What Gets Published

Published qualification authority is the LENS-consumable,
cockpit-consumable qualification state:

| Published Artifact | Content | Certification Level |
|-------------------|---------|--------------------:|
| Qualification state card | S-state, Q-class, backed_count | SANDBOX_COMPUTED |
| Domain grid | Per-domain status with source attribution | OVERLAY_VERIFIED per domain |
| Attribution breakdown | Certified vs overlay contribution | MANDATORY DISCLOSURE |
| Progression status | Gap to S3, iteration count | INFORMATIONAL |
| Health indicators | Replay, rollback, audit, coexistence | REAL-TIME |

### 5.2 Publication Process

```
STEP 1: Certification Verification
  Verify certification record exists and is current
  Verify no governance events since certification that invalidate it

STEP 2: Disclosure Assembly
  Assemble all mandatory disclosures:
  - "Qualification includes overlay contributions"
  - "N domains backed by overlay (OVERLAY_VERIFIED)"
  - "S-state is COMPOSITE" (if S3 via overlay)
  - Per-domain source attribution

STEP 3: Data Contract Emission
  Produce cockpit-consumable data contracts:
  - qualification_state_for_cockpit.json
  - evolution_for_cockpit.json
  - health_for_cockpit.json
  (As defined in COCKPIT_INTEGRATION_BOUNDARIES)

STEP 4: Publication Authorization
  Operator authorizes publication
  Publication record created with:
  - Timestamp
  - Certified state published
  - Disclosure checklist confirmed
  - Downstream consumers identified

STEP 5: Downstream Notification
  Notify downstream consumers:
  - SQO Cockpit: updated qualification state available
  - LENS (future): updated qualification authority available
  - Governance: publication record logged
```

### 5.3 Publication Gate (G-PUBLISH)

| Check | Requirement |
|-------|------------|
| Certification current | Certification record valid and not invalidated |
| Disclosure complete | All mandatory disclosures assembled |
| Data contracts valid | Cockpit data contracts structurally valid |
| Operator authorized | Publication authorization recorded |
| Replay guarantee | Published state replay-reconstructable |
| Rollback guarantee | Published state rollback-safe |

### 5.4 Publication Retraction

If published authority must be retracted:

```
STEP 1: Retraction Decision
  Trigger: Overlay revoked, replay failure, governance escalation

STEP 2: Downstream Notification
  Notify all downstream consumers:
  - State retracted
  - Prior publication superseded
  - New state (or revert to prior publication)

STEP 3: Retraction Record
  Record retraction with:
  - Reason
  - Prior published state
  - New published state (or NONE)
  - Downstream consumers notified
```

---

## 6. Pipeline Promotion Path (Future)

### 6.1 From OVERLAY_VERIFIED to PIPELINE_CERTIFIED

Overlay contributions become PIPELINE_CERTIFIED only through
pipeline re-execution:

```
OVERLAY_VERIFIED state (sandbox)
    │
    │  Evidence that supported overlay claims is incorporated
    │  into pipeline evidence boundary
    │
    ▼
Pipeline re-execution
    │
    │  Pipeline independently derives domain grounding
    │
    ▼
New PIPELINE_CERTIFIED state
    │
    │  If pipeline confirms overlay claims:
    │  OVERLAY_VERIFIED → PIPELINE_CERTIFIED (promoted)
    │
    │  If pipeline disagrees:
    │  OVERLAY_VERIFIED claim invalidated
    │  Sandbox created against new baseline
```

### 6.2 Pipeline Promotion Rules

1. Pipeline re-execution is an EXTERNAL event (not sandbox-initiated)
2. Sandbox does NOT trigger pipeline execution
3. Pipeline results are AUTHORITATIVE regardless of overlay claims
4. New pipeline results create new certified baseline
5. Existing overlays must be re-evaluated against new baseline
6. Prior sandbox may be closed; new sandbox created

---

## 7. Authority Lineage

### 7.1 From Evidence to Published Authority

```
L0: Evidence source (provenance-tracked)
 │
L1: Package entry (hash-verified, attributed)
 │
L2: Activation lifecycle (8-phase, governance-gated)
 │
L3: Composite qualification (replay-verified, rollback-verified)
 │
L4: Certification decision (governance-authorized)
 │
L5: Published authority (disclosure-complete, retractable)
```

Every published qualification claim has a traceable lineage from
evidence source through published authority.

---

## 8. Governance

- Promotion requires ALL 7 eligibility checks per overlay
- Certification requires governance zone ≤ PRESSURE and zero entropy
- Publication requires certification, disclosure, and operator authorization
- Published state must remain replay-reconstructable for its lifetime
- Publication is retractable with downstream notification
- Pipeline promotion is external — sandbox cannot self-promote
- Authority lineage (L0–L5) is traceable for every published claim
- ONLY certified authority may become LENS-consumable qualification state
