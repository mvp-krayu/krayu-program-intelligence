# Authority and Publication Eligibility

**Stream:** PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the formal boundary between certified overlay state and
authority-promoted state — specifying exactly what certification
grants, what authority promotion requires, and how publication
eligibility follows from certified authority.

---

## 2. Authority Promotion Model

### 2.1 Authority Promotion Definition

Authority promotion is the governed transition by which a certified
overlay's contributions become authoritative — meaning they are
accepted as governing truth for qualification state, not merely
sandbox-computed candidates.

### 2.2 Authority Promotion Prerequisites

| # | Prerequisite | Source | Gate |
|---|-------------|--------|------|
| AP-01 | Overlay is ACTIVATED | Overlay lifecycle | G-ACTIVATION |
| AP-02 | Replay certification: REPLAY_CERTIFIED | Replay certification pipeline | G-REPLAY-CERT |
| AP-03 | Rollback certification: ROLLBACK_CERTIFIED or ROLLBACK_CERTIFIED_WITH_WARNINGS | Rollback certification pipeline | G-ROLLBACK-CERT |
| AP-04 | Combined certification: PROMOTION_ELIGIBLE or PROMOTION_RESTRICTED | Combined certification gate | G-COMBINED-CERT |
| AP-05 | Governance zone: not PROHIBITED | Governance stability envelope | G-ZONE-PROMOTE |
| AP-06 | No open CRITICAL divergence investigations | Divergence detection | G-DIVERGENCE-CLEAR |
| AP-07 | No open CRITICAL ambiguity records | Ambiguity detection | G-AMBIGUITY-CLEAR |
| AP-08 | Operator authorization | Operator responsibility model | G-OPERATOR-PROMOTE |

### 2.3 Authority Promotion Process

```
STEP 1: Verify all prerequisites
  FOR each prerequisite AP-01 through AP-08:
    CHECK gate condition
    IF any gate fails:
      → PROMOTION BLOCKED
      → Record blocking gate
      → STOP

STEP 2: Compute promotion impact
  current_authority_state = loadAuthorityState()
  projected_state = applyPromotion(current_authority_state, overlay)
  projected_metrics = computeMetrics(projected_state)
  projected_zone = computeZone(projected_metrics)
  
  IF projected_zone == PROHIBITED:
    → PROMOTION BLOCKED ("would enter PROHIBITED zone")
  IF projected_zone == RISK:
    → PROMOTION REQUIRES G-3 approval

STEP 3: Execute promotion
  overlay.authority_status = AUTHORITY_PROMOTED
  overlay.promotion_timestamp = now()
  overlay.promotion_evidence = CERT-<ref>
  authority_state = applyPromotion(authority_state, overlay)
  
  Record promotion event in governance log

STEP 4: Verify post-promotion state
  RECOMPUTE authority metrics
  VERIFY metrics match projected_metrics
  IF mismatch:
    → ROLLBACK promotion
    → Escalate to G-4
    → Record promotion failure
```

### 2.4 Authority Promotion States

```
Overlay authority lifecycle:

  SANDBOX_COMPUTED
    │  Overlay contributions computed in sandbox
    ▼
  CERTIFICATION_PENDING
    │  Awaiting replay + rollback certification
    ▼
  CERTIFICATION_COMPLETE
    │  Both certifications issued
    ▼
  PROMOTION_ELIGIBLE
    │  Combined certification grants eligibility
    ▼
  AUTHORITY_PROMOTED
    │  Contributions accepted as governing truth
    ▼
  PUBLICATION_ELIGIBLE
    │  Authority state eligible for external publication
```

---

## 3. Authority Promotion Restrictions

### 3.1 Restricted Promotion (PROMOTION_RESTRICTED)

When rollback certification is ROLLBACK_CONDITIONAL:

| Restriction | Description |
|------------|-------------|
| No cascade rollback | Overlay cannot be cascade-rolled-back (only individual) |
| Operator approval required | Any rollback requires explicit operator authorization |
| Enhanced monitoring | Overlay contributions monitored for divergence |
| Publication restricted | Cannot be included in publication until upgraded to full |

### 3.2 Promotion Upgrade Path

```
PROMOTION_RESTRICTED → PROMOTION_ELIGIBLE requires:
  1. Re-execute rollback certification with resolved cascade issues
  2. Achieve ROLLBACK_CERTIFIED (not CONDITIONAL)
  3. Re-issue combined certification
  4. Operator re-authorization
```

### 3.3 Promotion Revocation

```
Authority promotion can be revoked when:
  1. Overlay is REVOKED (from supersession/revocation workflow)
  2. Post-promotion divergence detected (replay verification fails)
  3. Post-promotion rollback safety compromised
  4. Governance zone enters PROHIBITED

Revocation process:
  STEP 1: Record revocation trigger
  STEP 2: Remove overlay's authority contributions
  STEP 3: Recompute authority metrics
  STEP 4: Verify no cascading authority failures
  STEP 5: Record promotion revocation event
```

---

## 4. Publication Eligibility Model

### 4.1 Publication Eligibility Definition

Publication eligibility is the governed determination that an
authority-promoted composite state meets the requirements for
external expression — the boundary between internal authority
and external visibility.

### 4.2 Publication Eligibility Prerequisites

| # | Prerequisite | Source | Gate |
|---|-------------|--------|------|
| PE-01 | All contributing overlays: AUTHORITY_PROMOTED | Authority promotion | G-AUTHORITY-COMPLETE |
| PE-02 | Composite qualification meets publication threshold | Qualification parameters | G-QUAL-PUBLISH |
| PE-03 | No PROMOTION_RESTRICTED overlays (or restrictions resolved) | Restriction model | G-RESTRICTION-CLEAR |
| PE-04 | Governance zone: SAFE or PRESSURE | Governance stability envelope | G-ZONE-PUBLISH |
| PE-05 | Pipeline certification: PIPELINE_CERTIFIED | Pipeline certification | G-PIPELINE-CERT |
| PE-06 | No open investigations | Investigation model | G-INVESTIGATION-CLEAR |

### 4.3 Publication Eligibility Process

```
STEP 1: Verify all contributing overlays promoted
  FOR each overlay contributing to composite:
    IF overlay.authority_status != AUTHORITY_PROMOTED:
      → PUBLICATION BLOCKED ("overlay {id} not promoted")
    IF overlay.promotion_restrictions.length > 0:
      → PUBLICATION BLOCKED ("overlay {id} has unresolved restrictions")

STEP 2: Verify qualification threshold
  composite_qualification = computeQualification(authority_state)
  IF composite_qualification < publication_threshold:
    → PUBLICATION BLOCKED ("qualification below threshold")
  Record qualification metrics at publication assessment

STEP 3: Verify governance zone
  current_zone = computeZone(authority_state)
  IF current_zone IN [RISK, PROHIBITED]:
    → PUBLICATION BLOCKED ("zone {current_zone} does not permit publication")

STEP 4: Verify pipeline certification
  IF NOT pipeline_certified:
    → PUBLICATION BLOCKED ("pipeline not certified")

STEP 5: Issue publication eligibility
  publication_eligibility = {
    eligible: true,
    composite_hash: sha256(authority_state),
    qualification: composite_qualification,
    zone: current_zone,
    contributing_overlays: [list with promotion evidence],
    certification_chain: [RCERT refs, RBCERT refs, CERT refs],
    timestamp: now()
  }
```

### 4.4 Publication Eligibility States

| State | Description | Transition |
|-------|-------------|-----------|
| NOT_ELIGIBLE | Prerequisites not met | → ASSESSMENT_PENDING when prerequisites met |
| ASSESSMENT_PENDING | Eligibility assessment in progress | → ELIGIBLE or → BLOCKED |
| ELIGIBLE | All prerequisites verified | → PUBLISHED or → REVOKED |
| BLOCKED | One or more prerequisites failed | → ASSESSMENT_PENDING when blocker resolved |
| PUBLISHED | Authority state has been published | Terminal for this certification cycle |
| REVOKED | Eligibility revoked post-assessment | → ASSESSMENT_PENDING for re-evaluation |

---

## 5. Certification-to-Authority-to-Publication Chain

### 5.1 Complete Chain

```
Evidence intake (L0→L1)
    ▼
Package creation (L1→L2)
    ▼
Overlay proposal and approval (L2→L3)
    ▼
Overlay activation (L3 — sandbox computation)
    ▼
Replay certification (L3→L5)
    │  REPLAY_CERTIFIED
    ▼
Rollback certification (L3→L5)
    │  ROLLBACK_CERTIFIED
    ▼
Combined certification (L5)
    │  PROMOTION_ELIGIBLE
    ▼
Authority promotion (L5 — authority state)
    │  AUTHORITY_PROMOTED
    ▼
Publication eligibility (L5 — publication boundary)
    │  PUBLICATION_ELIGIBLE
    ▼
[External expression boundary]
```

### 5.2 Chain Integrity Requirement

Every link in the chain is hash-verified:
- Each certification references the evidence it verified (by hash)
- Authority promotion references the certifications that enabled it (by hash)
- Publication eligibility references the promotions that qualify it (by hash)

Breaking any link invalidates all downstream claims.

---

## 6. Certification Impact on S-State

### 6.1 S-State and Certification

| S-State | Certification Requirement | Authority Promotion | Publication |
|---------|--------------------------|--------------------| ------------|
| S0 (uncalibrated) | Not applicable | Not applicable | Not eligible |
| S1 (baseline-only) | Pipeline certification | Baseline authority | Eligible if pipeline certified |
| S2 (overlay-computed) | Replay + rollback certification | Overlay authority | Eligible if all overlays certified |
| S3 (fully-qualified) | Full certification chain | Full authority | Eligible |

### 6.2 Certification and S-State Progression

```
S1 → S2 requires:
  - At least one overlay ACTIVATED
  - Overlay replay-certified (REPLAY_CERTIFIED)
  - Overlay rollback-certified (ROLLBACK_CERTIFIED)
  - Overlay authority-promoted (AUTHORITY_PROMOTED)

S2 → S3 requires:
  - All qualification metrics above S3 threshold
  - All contributing overlays authority-promoted
  - Full pipeline certification
  - Publication eligibility assessment complete
```

---

## 7. Governance

- Authority promotion is the governed transition from sandbox to authority
- 8 prerequisites gate authority promotion (AP-01 through AP-08)
- Restricted promotion limits rollback and publication capabilities
- Promotion revocation is possible on divergence, safety compromise, or overlay revocation
- Publication eligibility requires all overlays promoted, qualification threshold met, and zone permits
- 6 publication eligibility states track lifecycle from NOT_ELIGIBLE to PUBLISHED
- Complete certification-to-authority-to-publication chain is hash-verified at every link
- S-state progression requires certification at each level
- No authority without certification
- No publication without authority
- Chain model is client-agnostic
