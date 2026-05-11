# Operator and Governance Review Model

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define which evidence intake and packaging operations require
operator review, governance review, or certification review —
ensuring no hidden evidence authority exists in the workflow.

---

## 2. Authority Domains for Evidence Workflow

### 2.1 Three Authority Domains

| Domain | Owner | Evidence Scope |
|--------|-------|---------------|
| OPERATOR | Human operator | Source selection, evidence review, packaging decisions, trust assessment |
| GOVERNANCE | Governance framework | Gate evaluation, zone enforcement, fail-closed rules, trust criteria |
| CERTIFICATION | Certification authority | Promotion eligibility, certification readiness, publication authorization |

### 2.2 Authority Principle

**No domain may exercise authority belonging to another domain
within the evidence workflow.**

- Operators select and review evidence (governance does not select)
- Governance evaluates gates and enforces rules (operators cannot bypass)
- Certification validates overlay proof (neither operator nor governance can bypass)

---

## 3. Operator Review Points

### 3.1 Mandatory Operator Review

| Review Point | Phase | What Operator Reviews | Decision |
|-------------|-------|----------------------|----------|
| Source Selection | Intake Phase 1 | Candidate sources, relevance, coverage | SELECT / DEFER / REJECT |
| Trust Assessment | Intake Phase 3 | Trust criteria results, authority verification | CONFIRM / OVERRIDE / QUARANTINE |
| Evidence Review | Intake Phase 4 | Extracted claims, evidence basis, confidence | ACCEPT / REVISE / REJECT |
| Packaging Strategy | Packaging Phase 2 | Single vs multi-domain, batch size, coverage | SELECT STRATEGY |
| Package Review | Packaging Phase 4 | Assembled package, entries, impact estimate | APPROVE / REVISE / REJECT |
| Quarantine Resolution | Quarantine | Quarantine reason, investigation results | RESOLVE / REJECT / ESCALATE |
| Conflict Resolution | Multi-source | Conflicting claims, competing sources | SELECT AUTHORITATIVE / DEFER |

### 3.2 Operator Review Record

```json
{
  "operator_review": {
    "review_point": "Evidence Review",
    "phase": "Intake Phase 4",
    "reviewed_items": ["SRC-001-ENTRY-001", "SRC-001-ENTRY-002"],
    "decision": "ACCEPT",
    "operator": "<operator identity>",
    "timestamp": "<ISO-8601>",
    "rationale": "Evidence basis is explicit, confidence justified",
    "conditions": null
  }
}
```

### 3.3 Operator Cannot

| Prohibited Action | Why |
|-------------------|-----|
| Bypass trust criteria | Trust assessment is governance-enforced |
| Override fail-closed | Fail-closed conditions are architecturally enforced |
| Fabricate evidence | Evidence must derive from external sources |
| Skip provenance | Provenance chain is mandatory for all entries |
| Register QUARANTINED evidence | Quarantined evidence must be resolved first |
| Package in RISK/PROHIBITED zone | Zone restrictions are governance-enforced |
| Self-authorize semantic classes | Class authorization follows source-to-class matrix |

---

## 4. Governance Review Points

### 4.1 Automatic Governance Reviews (Gate Evaluations)

| Gate | Phase | What Governance Evaluates | Outcome |
|------|-------|--------------------------|---------|
| G-SOURCE-CLASS | Intake Phase 2 | Source type, default authorizations | PASS / FAIL |
| G-TRUST | Intake Phase 3 | Trust criteria, trust level assignment | PASS / FAIL |
| G-EXTRACT | Intake Phase 4 | Evidence basis, domain mapping, no interpretation | PASS / FAIL |
| G-NORMALIZE | Intake Phase 5 | Schema conformance, hash integrity | PASS / FAIL |
| G-PROVENANCE | Intake Phase 6 | Provenance chain completeness | PASS / FAIL |
| G-REGISTER | Intake Phase 7 | All prior gates, trust level, no duplicates | PASS / FAIL |
| G-SELECT | Packaging Phase 1 | Trust level, confidence, domain eligibility | PASS / FAIL |
| G-PACKAGE | Packaging Phase 4 | Schema, authorization, integrity, limits | PASS / FAIL |
| G-REPLAY-BIND | Packaging Phase 5 | Replay-safe attestation, determinism | PASS / FAIL |
| G-PKG-REGISTER | Packaging Phase 6 | All prior gates, limits, uniqueness | PASS / FAIL |

### 4.2 Governance-Initiated Reviews

| Trigger | Governance Action | Operator Impact |
|---------|------------------|-----------------|
| Zone transition | Apply zone-appropriate restrictions | Packaging strategy may change |
| Trust violation post-registration | Quarantine affected evidence | Overlay may be suspended |
| Architectural limit approaching | Warn operator of limit proximity | Consolidation may be needed |
| Source conflict detected | Escalate to operator for resolution | Operator must decide |
| Entropy indicator triggered | Review all active evidence for source | May require investigation |

### 4.3 Governance Cannot

| Prohibited Action | Why |
|-------------------|-----|
| Select evidence sources | Operator domain expertise required |
| Decide packaging strategy | Operator operational judgment required |
| Override operator's source selection | Operator authority for evidence choice |
| Fabricate gate results | Gate evaluation is deterministic |
| Suppress quarantine alerts | Quarantine visibility is mandatory |

---

## 5. Certification Review Points

### 5.1 Evidence-Related Certification Reviews

| Review Point | When | What Is Reviewed |
|-------------|------|-----------------|
| Evidence trust for promotion | Stage 10 (Promotion) | All entries in overlay have TRUSTED evidence |
| Replay proof for evidence | Stage 7 (Replay) | Evidence-derived state is replay-verified |
| Rollback proof for evidence | Stage 8 (Rollback) | Evidence removal restores prior state exactly |
| Lineage completeness | Stage 11 (Certification) | Full L0→L5 lineage chain is intact |
| Publication readiness | Stage 12 (Publication) | Evidence disclosure is complete and accurate |

### 5.2 Certification Cannot

| Prohibited Action | Why |
|-------------------|-----|
| Override trust assessment | Trust is assessed at intake, not certification |
| Modify evidence entries | Evidence is immutable once packaged |
| Bypass replay verification | Replay proof is structurally required |
| Certify PROVISIONAL evidence | Must upgrade to TRUSTED first |

---

## 6. Human vs Automated Decision Matrix

### 6.1 Fully Automatable

| Operation | Why Automatable |
|-----------|----------------|
| Schema validation | Deterministic format check |
| Source hash computation | Deterministic algorithm |
| Trust criteria evaluation | Deterministic criteria check |
| Class authorization check | Deterministic matrix lookup |
| Provenance chain verification | Deterministic linkage check |
| Architectural limit enforcement | Deterministic threshold check |
| Zone evaluation | Deterministic indicator computation |
| Gate evaluation | Deterministic rule evaluation |
| Replay binding verification | Deterministic hash comparison |
| Lineage completeness check | Deterministic chain traversal |

### 6.2 Human Required

| Operation | Why Human Required |
|-----------|-------------------|
| Source selection | Domain expertise and strategic judgment |
| Evidence basis assessment | Judgment on structural correspondence quality |
| Confidence classification | Judgment on derivation strength |
| Packaging strategy | Operational judgment on batch composition |
| Trust override decisions | Authority verification judgment |
| Quarantine resolution | Investigation and judgment |
| Source conflict resolution | Domain expertise for authoritative source selection |
| Publication authorization | Accountability for downstream impact |

### 6.3 Semi-Automated (Human Oversight)

| Operation | Automation | Human Oversight |
|-----------|-----------|----------------|
| Evidence extraction | System identifies candidate passages | Human verifies extraction correctness |
| Impact estimation | System computes projected deltas | Human reviews estimates for reasonableness |
| Coexistence assessment | System computes pairwise checks | Human reviews for domain-specific conflicts |
| Zone projection | System computes projected zone | Human reviews before packaging decision |

---

## 7. Escalation Within Evidence Workflow

### 7.1 Evidence-Specific Escalation Triggers

| Trigger | Escalation Level | Action |
|---------|-----------------|--------|
| Source authority cannot be verified | G-0 → G-1 | Enhanced review, operator investigation |
| Multiple sources conflict | G-0 → G-1 | Operator resolution required |
| Trust violation post-registration | G-1 → G-2 | Quarantine, governance review |
| Evidence causes replay divergence | G-2 → G-4 | Freeze, mandatory investigation |
| Lineage chain broken | G-1 → G-2 | Quarantine downstream claims |
| PROHIBITED source detected | G-0 → G-1 | Evidence rejected, operator notified |

### 7.2 Escalation Authority

| Level | Who Is Notified | Evidence Impact |
|-------|----------------|-----------------|
| G-0 | Operator (routine) | Normal evidence operations |
| G-1 | Operator (enhanced awareness) | Enhanced review for intake/packaging |
| G-2 | Operator + governance review | Evidence operations restricted |
| G-3 | Governance review board | All evidence intake paused |
| G-4 | Emergency response | Evidence pipeline frozen |

---

## 8. Review Audit Trail

Every review decision produces an audit event:

```json
{
  "review_audit": {
    "review_type": "OPERATOR",
    "review_point": "Package Review",
    "phase": "Packaging Phase 4",
    "decision": "APPROVE",
    "reviewer": "<operator identity>",
    "timestamp": "<ISO-8601>",
    "items_reviewed": ["SEP-blueedge-CLU-04-004"],
    "escalation_level": "G-0",
    "governance_zone": "SAFE",
    "conditions": null,
    "rationale": "All entries verified, impact projection reviewed"
  }
}
```

---

## 9. Governance

- 3 authority domains (OPERATOR, GOVERNANCE, CERTIFICATION) with clear separation
- 7 mandatory operator review points ensure human judgment at critical decisions
- 10 automatic governance gates enforce deterministic rules
- 5 certification review points validate evidence for promotion and publication
- Fully automatable operations are deterministic and require no human judgment
- Human-required operations involve domain expertise, strategic judgment, or accountability
- Evidence-specific escalation triggers map to 5 escalation levels
- Every review decision produces an auditable record
- No hidden evidence authority — all decisions are attributed
