# Dynamic CEU Activation Lifecycle

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines the complete lifecycle of Dynamic CEU activation —
from initial evidence package registration through qualification-visible
overlay contribution to eventual revocation or supersession. Every phase
is deterministic, auditable, and substrate-isolated.

---

## 2. Lifecycle Overview

```
PHASE 0: REGISTRATION
    │  SEP created and persisted to artifact store
    │
    ▼
PHASE 1: VALIDATION
    │  Package integrity, provenance, entry completeness verified
    │
    ▼
PHASE 2: AUTHORIZATION
    │  Semantic class authorizations verified against source type
    │
    ▼
PHASE 3: ELIGIBILITY RESOLUTION
    │  Overlay boundaries, dependency resolution, cohabitation checks
    │
    ▼
PHASE 4: ACTIVATION AUTHORIZATION
    │  Governance authorization issued; no autonomous activation
    │
    ▼
PHASE 5: RE-EVALUATION TRIGGER
    │  Qualification re-evaluation scheduled with overlay set
    │
    ▼
PHASE 6: QUALIFICATION-VISIBLE
    │  Overlay contributions reflected in composite evaluation
    │
    ▼
PHASE 7: TERMINAL STATE
    │  CERTIFIED (stable), REVOKED (withdrawn), SUPERSEDED (replaced)
```

---

## 3. Phase Definitions

### Phase 0 — Registration

**Trigger:** An ingestion stream produces a Semantic Evidence Package from
governed external source material.

**Inputs:**
- Source material with provenance
- Source authority declaration
- Ingestion stream contract authorization

**Actions:**
1. Assign `package_id` with monotonic sequence number
2. Assign initial `package_version: 1`
3. Compute `package_hash` (sha256 of sorted JSON)
4. Persist package artifact to `artifacts/sqo/<client>/<run_id>/semantic_evidence_packages/`
5. Register package in `package_registry.json` with status `STAGED`
6. Log registration event with timestamp and ingestion stream ID

**Output:** SEP in STAGED status. Not yet contributing to any evaluation.

**Governance:**
- Package artifact is immutable once persisted
- No qualification state changes at this phase
- No substrate interaction

---

### Phase 1 — Validation

**Trigger:** Activation request received for a STAGED package.

**Inputs:**
- Package artifact from artifact store
- Package registry entry
- Certified substrate state

**Validation checks:**

| Check | Criterion | Failure Action |
|-------|----------|----------------|
| V-01 | Package hash matches stored hash | REJECT — integrity violation |
| V-02 | All evidence entries have source_hash | REJECT — provenance gap |
| V-03 | All evidence entries have confidence_basis | REJECT — evidence standard violation |
| V-04 | All evidence entries have claim_type from authorized taxonomy | REJECT — invalid claim |
| V-05 | Entry count ≤ 50 per package | REJECT — package size limit |
| V-06 | All entries have entry_id with monotonic sequence | REJECT — ordering violation |
| V-07 | Package target (client, run_id) matches certified substrate | REJECT — scope mismatch |
| V-08 | Certified substrate exists and is valid | REJECT — temporal boundary violation |
| V-09 | Source authority is external (not self-referential) | REJECT — authority violation |

**Output:** Validation result (PASSED / REJECTED with failure details).

**Governance:**
- Validation is stateless — does not modify any artifact
- All rejections are logged with specific check ID
- Rejected packages remain STAGED (can be corrected via new version)

---

### Phase 2 — Authorization

**Trigger:** Phase 1 validation PASSED.

**Inputs:**
- Package `semantic_class_authorizations` list
- Package `source_type`
- Default source-to-class mapping (from SEMANTIC_CLASS_AUTHORIZATION_MODEL)

**Authorization checks:**

| Check | Criterion | Failure Action |
|-------|----------|----------------|
| A-01 | At least one semantic class authorized | REJECT — no scope |
| A-02 | Every entry's `semantic_class` appears in authorized list | REJECT — unauthorized class |
| A-03 | Override authorizations (beyond default profile) have justification | REJECT — unjustified override |
| A-04 | No entry spans multiple semantic classes | REJECT — cross-class violation |
| A-05 | GOVERNANCE class entries do not produce overlay contributions | REJECT — governance-class misuse |

**Output:** Authorization result (AUTHORIZED / REJECTED with failure details).

**Governance:**
- Authorization is a pure check against the declared authorization model
- Failed authorization blocks activation — fail closed
- Authorization state is immutable for a given package version

---

### Phase 3 — Eligibility Resolution

**Trigger:** Phase 2 authorization AUTHORIZED.

**Inputs:**
- Package overlay metadata
- Package dependency declarations
- Current active overlay set (from package registry)
- Aggregate limits from cohabitation rules

**Eligibility checks:**

| Check | Criterion | Failure Action |
|-------|----------|----------------|
| E-01 | Active package count < 10 | REJECT — package limit reached |
| E-02 | Total active entries + new entries ≤ 200 | REJECT — entry limit reached |
| E-03 | All declared dependencies are ACTIVATED | REJECT — unresolved dependency |
| E-04 | No contradictory claims with active overlays | ESCALATE — conflict review |
| E-05 | No immutability boundary violation in proposed claims | REJECT — substrate violation |
| E-06 | Temporal boundary: substrate evaluated, debt computed, maturity scored | REJECT — premature activation |

**Conflict detection:**
- Each proposed entry is compared against all active overlay entries
- Non-overlapping entries: no action
- Complementary entries (same domain, different claim type): no action
- Competing entries (same domain, same field): conflict recorded, precedence computed
- Contradictory entries: ESCALATED to governance review

**Output:** Eligibility result (ELIGIBLE / REJECTED / ESCALATED).

**Governance:**
- Eligibility resolution does not modify any artifact
- ESCALATED packages remain STAGED until governance resolution
- Conflict detection is deterministic (same inputs → same conflicts)

---

### Phase 4 — Activation Authorization

**Trigger:** Phase 3 eligibility ELIGIBLE.

**Inputs:**
- Eligibility result
- Governance authorization (explicit, not autonomous)

**Authorization model:**

Dynamic CEU activation is NEVER autonomous. Activation requires explicit
governance authorization from one of:

| Authorization Source | Scope |
|---------------------|-------|
| Ingestion stream contract | Authorizes activation of packages produced by that stream |
| Governance review | Authorizes activation of escalated or exceptional packages |
| Emergency governance | Authorizes emergency activation or revocation |

**Actions:**
1. Verify authorization source is valid
2. Record authorization with source, timestamp, and scope
3. Transition package status: STAGED → ACTIVATED in package registry
4. Lock package version (no further modification)
5. Log activation event

**Output:** Package transitioned to ACTIVATED status.

**Governance:**
- No autonomous activation under any circumstance
- Authorization must be traceable to a specific governance source
- Authorization scope must match the package scope

---

### Phase 5 — Re-evaluation Trigger

**Trigger:** Phase 4 activation completes.

**Inputs:**
- Newly ACTIVATED package
- Full active overlay set (including new package)
- Certified substrate
- Current qualification state

**Actions:**
1. Emit SEP_ACTIVATED trigger event
2. Schedule qualification re-evaluation per QUALIFICATION_REEVALUATION_MODEL
3. The 8-step re-evaluation process executes:
   - Load certified substrate (Static CEU)
   - Load active overlay set (Dynamic CEU)
   - Compute composite semantic state
   - Resolve Q-class from composite state
   - Re-evaluate semantic debt inventory
   - Recompute progression readiness
   - Emit re-evaluation result artifact
   - Update SQO cockpit state

**Output:** Re-evaluation result artifact with overlay attribution.

**Governance:**
- Re-evaluation uses the governance-locked Q-class formula
- Re-evaluation distinguishes overlay vs certified contributions
- Re-evaluation is idempotent

---

### Phase 6 — Qualification-Visible

**Trigger:** Phase 5 re-evaluation completes.

**State:** The overlay's contributions are now reflected in:
- Composite semantic state
- Q-class evaluation
- S-state assessment
- Semantic debt inventory (resolved items attributed to overlay)
- Progression readiness score
- SQO cockpit display

**Ongoing obligations:**
- Overlay attribution is mandatory in all evaluation outputs
- Disclosure requirements apply (packages contributing, domains affected)
- Package remains subject to revocation at any time

**Output:** Qualification state reflects overlay contributions.

---

### Phase 7 — Terminal State

An ACTIVATED overlay reaches terminal state via one of three paths:

#### 7a. CERTIFIED (stable)

The overlay remains ACTIVATED and contributing to qualification evaluation
indefinitely. It has passed activation, contributed to re-evaluation, and
no governance action has been taken against it.

#### 7b. REVOKED (withdrawn)

**Trigger:** Explicit revocation command, governance review, or emergency.

**Actions:**
1. Mark package REVOKED in registry with timestamp, reason, authority
2. Check for dependent packages (block if dependencies exist)
3. Recompute composite state WITHOUT revoked package
4. Trigger qualification re-evaluation (SEP_REVOKED event)
5. Verify composite state integrity post-removal
6. Log revocation event

**Result:** Qualification state reverts to what it would be without this package.

#### 7c. SUPERSEDED (replaced)

**Trigger:** New version of the same package is ACTIVATED.

**Actions:**
1. Mark current version SUPERSEDED
2. Activate new version (follows Phases 1–6)
3. Composite state recomputed with new version
4. SEP_VERSION_UPGRADE trigger emitted

**Result:** Newer version's contributions replace prior version's.

---

## 4. Lifecycle State Transitions

| From | To | Trigger | Reversible? |
|------|----|---------|-------------|
| (none) | STAGED | Package creation | NO (package persists) |
| STAGED | ACTIVATED | Phases 1–4 pass | YES (via revocation) |
| STAGED | STAGED | Validation/authorization fails | YES (retry with new version) |
| ACTIVATED | REVOKED | Explicit revocation | YES (via reactivation of same or new version) |
| ACTIVATED | SUPERSEDED | New version activated | YES (via version rollback) |
| REVOKED | ACTIVATED | Reactivation authorized | Only with governance authorization |
| SUPERSEDED | ACTIVATED | Version rollback authorized | Only with governance authorization |

---

## 5. Lifecycle Invariants

| Invariant | Enforcement |
|-----------|-------------|
| No substrate modification at any lifecycle phase | All phases are read-only with respect to substrate |
| No autonomous activation | Phase 4 requires explicit governance authorization |
| No hidden state transitions | Every transition is logged with timestamp and authority |
| Deterministic phase outcomes | Same inputs at any phase produce same outputs |
| Fail-closed on any check failure | Rejection at any phase blocks activation |
| Replay-safe at every phase | Phase outcomes are reproducible from inputs |
