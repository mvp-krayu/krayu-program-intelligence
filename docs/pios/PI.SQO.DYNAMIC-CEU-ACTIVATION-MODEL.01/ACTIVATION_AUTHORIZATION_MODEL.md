# Activation Authorization Model

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines who and what may authorize Dynamic CEU overlay
activation. Authorization is the governance gate between validation
(proving an overlay is structurally valid) and activation (making it
qualification-visible). No overlay may become ACTIVATED without explicit
governance authorization.

---

## 2. Foundational Rule

**No autonomous runtime activation.**

Dynamic CEU activation ALWAYS requires an explicit governance authorization
decision. There is no pathway by which an overlay automatically transitions
from STAGED to ACTIVATED based on runtime conditions, timers, or inference.

This rule traces to the early-era governance exploration closure: semantic
activation authority must be explicitly governed, never implicitly granted.

---

## 3. Authorization Sources

### 3.1 Ingestion Stream Contract Authorization

**Scope:** Authorizes activation of packages produced by a specific
ingestion stream operating under a specific contract.

**Mechanism:** The ingestion stream contract declares:
```
ACTIVATION_AUTHORITY: STREAM_CONTRACT
ACTIVATION_SCOPE: packages produced by this stream for (client, run_id)
```

**Constraints:**
- Stream must be a governed execution stream with CLOSURE.md
- Stream contract must explicitly include activation authorization
- Authorization is scoped to the specific (client, run_id) and stream
- Stream cannot authorize packages from other streams

**Example:** A PI.SQO.FASTAPI-EVIDENCE-ONBOARDING.01 stream contract
may authorize activation of SEPs it produces from FastAPI documentation.

### 3.2 Governance Review Authorization

**Scope:** Authorizes activation of packages that require manual review —
escalated conflicts, exceptional authorizations, or packages from
streams without embedded activation authority.

**Mechanism:** Governance review produces an authorization record:
```json
{
  "authorization_type": "GOVERNANCE_REVIEW",
  "reviewer": "<governance authority identifier>",
  "package_id": "<package being authorized>",
  "decision": "AUTHORIZE | DENY",
  "justification": "<why this package should be activated>",
  "conditions": ["<any conditions on activation>"],
  "timestamp": "<ISO-8601>"
}
```

**Constraints:**
- Reviewer must be a recognized governance authority
- Justification must be non-empty
- Conditions (if any) must be verifiable
- Review decisions are immutable and auditable

### 3.3 Emergency Governance Authorization

**Scope:** Authorizes emergency activation or revocation outside
normal governance channels.

**Mechanism:** Emergency authorization for:
- **Emergency activation:** Package needed urgently for qualification
  assessment (e.g., critical debt resolution evidence)
- **Emergency revocation:** Package producing incorrect qualification
  state (covered in OVERLAY_REVOCATION_AND_ROLLBACK_MODEL.md)

**Constraints:**
- Emergency authorization is logged with elevated audit severity
- Must include emergency justification
- Triggers post-hoc governance review within defined timeframe
- Emergency authorization does not bypass validation (Phases 1–3)

---

## 4. Authorization Scope Rules

### 4.1 Scope Matching

Authorization scope must match the package scope:

| Package Property | Authorization Must Match |
|-----------------|------------------------|
| client | Authorization issued for same client |
| run_id | Authorization issued for same run_id |
| source_type | Authorization covers this source type |
| semantic_classes | Authorization covers all declared classes |

Mismatched scope → activation REJECTED.

### 4.2 Scope Inheritance

Authorization does NOT inherit:
- Authorization for client A does not cover client B
- Authorization for run_01 does not cover run_02
- Authorization for TECHNICAL class does not cover BUSINESS class
- Authorization for SEP-001 does not cover SEP-002

Each package requires its own authorization (which may be batch-issued
by a stream contract for all packages in that stream's scope).

### 4.3 Scope Limitations

Authorization CANNOT grant:
- Permission to modify substrate artifacts
- Permission to bypass validation checks (Phases 1–3)
- Permission to exceed cohabitation limits without governance review
- Permission to activate without provenance
- Permission to override the Q-class formula

---

## 5. Authorization Lifecycle

```
1. ACTIVATION REQUESTED
   │  Package passes Phases 1–3 (validation, authorization, eligibility)
   │
   ▼
2. AUTHORIZATION SOURCE IDENTIFIED
   │  Which authorization pathway applies?
   │  - Stream contract → check contract scope
   │  - Governance review → submit for review
   │  - Emergency → flag as emergency with justification
   │
   ▼
3. AUTHORIZATION EVALUATED
   │  Does the authorization source have scope for this package?
   │  - Yes → proceed
   │  - No → DENIED (return to STAGED)
   │
   ▼
4. AUTHORIZATION RECORDED
   │  Authorization record persisted to audit trail
   │  Includes: source, scope, timestamp, package reference
   │
   ▼
5. ACTIVATION PROCEEDS
   │  Package transitions STAGED → ACTIVATED (Phase 4 → Phase 5)
```

---

## 6. Authorization for Semantic Class Expansion

When a package version upgrade introduces new semantic class
authorizations beyond those in the prior version:

**Rule:** New class authorizations require governance review,
even if the package's stream contract would normally authorize activation.

**Rationale:** Expanding semantic class scope changes the KIND of
evidence the package contributes, not just the AMOUNT. This requires
explicit governance awareness.

**Process:**
1. Version upgrade declares new class authorizations
2. Phase 2 detects class scope expansion
3. Activation pathway escalates to governance review
4. Governance review authorizes or denies the expanded scope
5. If authorized, activation proceeds normally

---

## 7. Authorization for Qualification Upgrade Eligibility

When overlay activation may cause an S-state transition (e.g., S1→S2):

**Rule:** Qualification upgrade eligibility does NOT require additional
authorization beyond the standard activation authorization. The
qualification framework's own gate model determines whether the
composite state meets transition requirements.

**Rationale:** Authorization governs whether evidence ENTERS the
evaluation. The qualification framework governs what evaluation
PRODUCES. Conflating these would create a circular dependency.

**Safeguards:**
- S-state transitions from overlay contributions are clearly attributed
- Re-evaluation artifacts distinguish overlay vs certified contributions
- Disclosure requirements ensure transparency

---

## 8. Authorization Denial Handling

When authorization is DENIED:

1. Package remains STAGED (not deleted)
2. Denial reason recorded in audit trail
3. Package may be re-submitted after:
   - Corrective action (new version addressing denial reason)
   - Changed governance conditions
   - Different authorization pathway

Denial is NOT punitive — it is protective. A denied package is not
"bad"; it has not met governance requirements for activation.

---

## 9. Authorization Verification

At any time, the following must be verifiable:

| Question | How to Answer |
|----------|--------------|
| Who authorized this overlay's activation? | Authorization record in audit trail |
| What scope was the authorization for? | Scope fields in authorization record |
| When was authorization granted? | Timestamp in authorization record |
| What type of authorization was it? | Authorization type field |
| Was the authorization scope valid for this package? | Compare authorization scope vs package scope |
| Has the authorization been revoked? | Check for subsequent revocation events |
