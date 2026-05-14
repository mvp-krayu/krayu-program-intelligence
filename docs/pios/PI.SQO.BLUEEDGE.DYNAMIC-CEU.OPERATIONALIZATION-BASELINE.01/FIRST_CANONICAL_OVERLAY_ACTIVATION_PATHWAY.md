# First Canonical Overlay Activation Pathway

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.OPERATIONALIZATION-BASELINE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization

---

## 1. Purpose

This document defines what constitutes the first safe operational overlay
for BlueEdge and the canonical pathway by which it would be activated.
This is not an execution plan — it is the SPECIFICATION of what a safe
first overlay looks like and the governance it must satisfy.

---

## 2. First Safe Overlay: Definition

The first safe operational overlay for BlueEdge is a Semantic Evidence
Package containing LINEAGE_UPGRADE claims for a SMALL subset of
BlueEdge's 13 unbacked domains, sourced from verifiable BlueEdge
architecture documentation.

### 2.1 Why LINEAGE_UPGRADE First

| Claim Type | First Overlay Suitability | Rationale |
|-----------|--------------------------|-----------|
| LINEAGE_UPGRADE | OPTIMAL | Directly increases backed_count; clear success metric; highest qualification impact |
| LABEL_ASSIGNMENT | ACCEPTABLE | Improves label coverage; lower qualification impact |
| CONTINUITY_MAPPING | ACCEPTABLE | Extends crosswalk; supports but doesn't directly advance S-state |
| CAPABILITY_BINDING | PREMATURE | Refinement; low qualification impact for first overlay |
| EDGE_ENRICHMENT | PREMATURE | Structural refinement; not a qualification driver |
| DOMAIN_TYPING | PREMATURE | Domain classification; not a qualification driver |

### 2.2 Why Small Subset (Not All 13)

The first overlay should target 2–4 domains, not all 13:

1. **Controlled blast radius:** If evidence is incorrect, only 2–4 domains affected
2. **Revocation simplicity:** Revoking a 4-entry package is simpler than 13-entry
3. **Governance review feasibility:** Reviewers can thoroughly assess 2–4 claims
4. **Precedent establishment:** First overlay sets the governance precedent for all subsequent
5. **Operational learning:** First activation reveals operational friction before scaling

### 2.3 Ideal First Overlay Profile

```json
{
  "package_id": "SEP-blueedge-run_blueedge_productized_01_fixed-001",
  "source_type": "ARCHITECTURE_RECORD",
  "semantic_class_authorizations": [
    { "class": "DOMAIN", "authorized": true },
    { "class": "TECHNICAL", "authorized": true }
  ],
  "evidence_entries": [
    {
      "claim_type": "LINEAGE_UPGRADE",
      "target_domain": "DOM-XX",
      "proposed_value": "NONE → STRONG",
      "confidence_basis": "DIRECT_CITATION"
    }
    // 2-4 entries total
  ],
  "entry_count": "2-4"
}
```

---

## 3. Canonical Activation Pathway

### Phase 0 — Registration

**Prerequisite:** An evidence onboarding stream has:
1. Obtained BlueEdge architecture documentation
2. Identified domains with verifiable structural correspondence
3. Produced a SEP with 2–4 LINEAGE_UPGRADE entries
4. Hashed source material and computed package hash

**Action:** SEP registered in package registry as STAGED.

### Phase 1 — Validation

**Checks applied:**

| Check | BlueEdge-Specific Verification |
|-------|-------------------------------|
| V-01: Package hash | Computed hash matches stored hash |
| V-02: Source hashes | Each entry's source_hash matches BlueEdge architecture document |
| V-03: Confidence basis | DIRECT_CITATION or STRONG_INFERENCE for each LINEAGE_UPGRADE |
| V-04: Claim type | LINEAGE_UPGRADE from authorized taxonomy |
| V-05: Entry count | 2–4 entries ≤ 50 limit |
| V-07: Scope | Client=blueedge, run_id=run_blueedge_productized_01_fixed |
| V-08: Substrate exists | BlueEdge certified substrate present with FULL_REPRODUCIBILITY |
| V-09: External authority | Source is BlueEdge architecture documentation, not self-referential |

### Phase 2 — Authorization

**BlueEdge class boundaries:**

| Class | Authorization | Justification |
|-------|-------------|---------------|
| DOMAIN | AUTHORIZED | Architecture records define domain boundaries |
| TECHNICAL | AUTHORIZED | Architecture records contain technical decisions |
| STRUCTURAL | NOT AUTHORIZED | No topology evidence in architecture records |
| PRODUCT | NOT AUTHORIZED | First overlay is technical/domain scoped |
| OPERATIONAL | NOT AUTHORIZED | No operational evidence in scope |
| BUSINESS | NOT AUTHORIZED | Deferred to subsequent overlays |
| GOVERNANCE | NOT AUTHORIZED | Not applicable |

### Phase 3 — Eligibility

**BlueEdge-specific eligibility:**

| Check | BlueEdge Context |
|-------|-----------------|
| E-01: Package count | First overlay → 1 < 10 limit |
| E-02: Entry count | 2–4 entries ≤ 200 aggregate limit |
| E-03: Dependencies | None (first overlay, no dependencies) |
| E-04: Conflicts | None expected (no prior active overlays) |
| E-05: Immutability | Verified — targets unbacked domains only |
| E-06: Temporal | Substrate exists, debt computed, maturity scored |

### Phase 4 — Activation Authorization

**Source:** Onboarding stream contract with ACTIVATION_AUTHORITY declaration.

**BlueEdge first overlay authorization is STREAM_CONTRACT type** —
the onboarding stream that produces the SEP also authorizes its activation.

### Phase 5 — Re-evaluation

**Expected re-evaluation impact (2–4 domain upgrades):**

| Metric | Before | After (projected) |
|--------|--------|-------------------|
| backed_count | 4 | 6–8 |
| Q-class | Q-02 | Q-02 (still partial) |
| S-state | S2 | S2 (S3 requires 17/17) |
| Progression readiness | 0.133 | Improved (blocking debt reduced) |

**Re-evaluation process:** Standard 8-step per QUALIFICATION_REEVALUATION_TRIGGER_MODEL.

### Phase 6 — Qualification-Visible

Overlay contributions visible in:
- Composite semantic state
- SQO cockpit display (backed_count updated)
- Debt inventory (resolved items attributed to overlay)
- Progression readiness (improved score)

---

## 4. First Overlay Success Criteria

| Criterion | Measurement |
|-----------|------------|
| Package activation completes all 7 phases | PASS/FAIL |
| Composite state computable with overlay | PASS/FAIL |
| Replay verification passes | PASS/FAIL |
| Substrate remains unmodified | PASS/FAIL |
| Overlay attribution is visible | PASS/FAIL |
| Revocation restores pre-overlay state exactly | PASS/FAIL |
| Re-evaluation is idempotent | PASS/FAIL |
| backed_count increases by expected amount | PASS/FAIL |

---

## 5. First Overlay Failure Modes

| Failure | Consequence | Recovery |
|---------|-------------|----------|
| Validation failure (any V-check) | Package remains STAGED | Correct and create new version |
| Authorization failure | Package remains STAGED | Review class authorizations |
| Eligibility failure | Package remains STAGED | Address eligibility issue |
| Re-evaluation inconsistency | Governance review | Investigate divergence |
| Replay verification failure | Emergency revocation | Investigate root cause |

---

## 6. Post-First-Overlay Governance

After the first overlay is successfully activated:

1. **Document operational observations** — what worked, what was friction
2. **Verify all governance guarantees hold** — replay, reversibility, attribution
3. **Assess for second overlay readiness** — is the process safe for scale-up
4. **Report to governance** — first overlay activation report

The first overlay is a GOVERNANCE LEARNING EVENT as much as a
qualification improvement event.
