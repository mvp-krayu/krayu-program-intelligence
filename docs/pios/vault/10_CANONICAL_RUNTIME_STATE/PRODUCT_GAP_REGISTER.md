# Product Gap Register

> **Established:** 2026-06-02
> **Authority:** SKU capability audit against runtime code (feature/runtime-demo @ 43df478)
> **Source:** Commercial packaging (SKU_MODEL, OFFER_CATALOG, SA_PACKAGING, SA_DD_PACKAGING) vs runtime implementation

---

## Purpose

This register tracks every gap between what commercial packaging claims and what the runtime actually does. It is the canonical source of truth for product gaps — documentation errors, commercial model misalignments, and missing capabilities.

Every gap has a disposition: fix the documentation, fix the commercial model, or build the capability.

---

## Gap Register

### PG-001 — Cross-Session Qualification Progression

| Field | Value |
|-------|-------|
| **Category** | Product Capability Gap |
| **Description** | SC claims "continuous qualification maturity tracking." SQO progression is within-run only — resets per pipeline execution. No cross-session persistence of qualification journey. |
| **Impacted SKU** | SC, SE |
| **Severity** | CRITICAL |
| **Blocking?** | YES — blocks SC (core value proposition) |
| **Current Status** | NOT_IMPLEMENTED |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Proposed Resolution** | Implement persistent SQO state across pipeline runs. Run-over-run qualification delta computation. |

---

### PG-002 — Multi-Run Comparison

| Field | Value |
|-------|-------|
| **Category** | Product Capability Gap |
| **Description** | SC claims "run-over-run structural comparison." No UI exists for comparing assessment results across runs. `fullReport` computed per-run with no cross-run diffing surface. |
| **Impacted SKU** | SC, SE |
| **Severity** | CRITICAL |
| **Blocking?** | YES — blocks SC (no continuity narrative without comparison) |
| **Current Status** | NOT_IMPLEMENTED |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Proposed Resolution** | PICP versioning + cross-run diff engine. Consumer-generic — not SC-specific. Aligns with PICP serialization (Phase 2 of EIR roadmap). |

---

### PG-003 — SKU Gating

| Field | Value |
|-------|-------|
| **Category** | Product Capability Gap |
| **Description** | No runtime mechanism restricts features by tier. All 4 cognitive modes, all guided queries, all exports available to all users. SW-Intel has commercial gating (teaser/full toggle), but no SKU-level feature restriction exists. |
| **Impacted SKU** | SC, SE (commercial model depends on tiered access) |
| **Severity** | HIGH |
| **Blocking?** | YES — blocks tiered commercial model. SA/SA-DD not blocked (point-in-time, everything delivered). |
| **Current Status** | NOT_IMPLEMENTED |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Proposed Resolution** | SKU-aware feature gating at projection layer. SW-Intel toggle pattern is the proven model — extend to SKU-level. |

---

### PG-004 — Production RBAC

| Field | Value |
|-------|-------|
| **Category** | Product Capability Gap |
| **Description** | SE claims "operator authority governance." SQOActionEngine has `actor_id` marked "DECLARATIVE ONLY. Not production RBAC." No authentication, no role enforcement, no identity verification. |
| **Impacted SKU** | SE |
| **Severity** | CRITICAL |
| **Blocking?** | YES — blocks SE (enterprise authority governance is SE's core value) |
| **Current Status** | DECLARATIVE_ONLY |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Proposed Resolution** | Production identity + role enforcement. 5 RBAC roles already defined (operator, reviewer, domain_authority, promotion_authority, audit_authority). Implementation gap, not design gap. |

---

### PG-005 — Multi-Program Intelligence

| Field | Value |
|-------|-------|
| **Category** | Product Capability Gap |
| **Description** | SE claims "portfolio-level intelligence across programs." Current runtime is single-program. No cross-program aggregation, comparison, or portfolio view. |
| **Impacted SKU** | SE |
| **Severity** | CRITICAL |
| **Blocking?** | YES — blocks SE (portfolio intelligence is SE's distinguishing capability) |
| **Current Status** | NOT_IMPLEMENTED |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Proposed Resolution** | Multi-program PICP aggregation + portfolio-level PRE projection. Aligns with consumer-generic architecture (marketplace consumers #3+). |

---

### PG-006 — Guided Query Mode Attribution

| Field | Value |
|-------|-------|
| **Category** | Commercial Gap |
| **Description** | All SKU documents attribute guided structural queries to OPERATOR mode. Runtime gates guided queries to `EXECUTIVE_DENSE` only (IntelligenceField.jsx line 4458, 4693). OPERATOR renders evidence traces, not queries. |
| **Impacted SKU** | SA, SA-DD (documentation accuracy) |
| **Severity** | MEDIUM |
| **Blocking?** | NO — capability exists, attribution is wrong |
| **Current Status** | **RESOLVED** (2026-06-02) |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Resolution** | Moved guided query capability from OPERATOR to DENSE in all commercial documents: SKU_MODEL (cognitive modes table, composition matrix, SA-DD row), OFFER_CATALOG (SA-DD deliverables), SA_DD_PACKAGING (mode table, guided investigation section, pricing, engagement letter, handoff). OPERATOR description updated to: evidence inspection, governance audit, signal verification. |

---

### PG-007 — Condition Count Correction

| Field | Value |
|-------|-------|
| **Category** | Runtime Truth Correction |
| **Description** | Commercial documents state "9 structural conditions." SignalSynthesisEngine has 11 primitive rules + 1 composite = 12 condition types (11 internal). |
| **Impacted SKU** | SA, SA-DD (documentation accuracy) |
| **Severity** | LOW |
| **Blocking?** | NO — the product delivers MORE than claimed |
| **Current Status** | **RESOLVED** (2026-06-02) |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Resolution** | Updated all references from "9 structural conditions" to "11 structural conditions" in SKU_MODEL, SA_DD_PACKAGING. SA_PACKAGING correctly references "9 behavioral consequence surfaces" (consequences, not conditions — accurate). |

---

### PG-008 — Query Count Correction

| Field | Value |
|-------|-------|
| **Category** | Runtime Truth Correction |
| **Description** | Commercial documents state "36 guided queries." Runtime has ~76+ query surfaces: 42 zone-level guided query paths + 34 SW-Intel domain reasoning queries. |
| **Impacted SKU** | SA, SA-DD (documentation accuracy) |
| **Severity** | LOW |
| **Blocking?** | NO — the product delivers MORE than claimed |
| **Current Status** | **RESOLVED** (2026-06-02) |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Resolution** | Updated all references from "36 governed queries" to "76+ governed structural queries" in SKU_MODEL, OFFER_CATALOG, SA_DD_PACKAGING. |

---

### PG-009 — Investigation Trail / Evidence Record Conflation

| Field | Value |
|-------|-------|
| **Category** | Commercial Gap |
| **Description** | SKU_MODEL lists "Investigation Trail" and "Evidence Record" as separate deliverables. `InterrogationTrailBuilder.buildTrailHTML()` produces ONE export artifact. They are the same thing under two names. |
| **Impacted SKU** | SA, SA-DD (artifact inventory accuracy) |
| **Severity** | MEDIUM |
| **Blocking?** | NO — one artifact exists, naming is inconsistent |
| **Current Status** | **RESOLVED** (2026-06-02) |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Resolution** | Consolidated: "Evidence Record" is the canonical surface. Investigation trail content (queries, evidence citations, governance boundary) is included within the Evidence Record when guided queries have been explored. Removed "Investigation Trail" as a separate surface from SKU_MODEL, OFFER_CATALOG, SA_DD_PACKAGING. |

---

### PG-010 — Investigation Protocol Commercial Language

| Field | Value |
|-------|-------|
| **Category** | Commercial Gap |
| **Description** | Commercial language implies customers "run investigations" via an "Investigation Protocol." InvestigationVerifier is a data-layer compilation chain verification engine (5-step SECTION_4_RULES validation). It is an internal quality mechanism, not a customer-facing workflow. |
| **Impacted SKU** | SA, SA-DD (commercial language accuracy) |
| **Severity** | MEDIUM |
| **Blocking?** | NO — internal verification works, commercial framing is misleading |
| **Current Status** | **RESOLVED** (2026-06-02) |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Resolution** | Replaced all "Investigation Protocol" references with accurate capability descriptions. Customer-facing capability is "guided structural investigation" (76+ queries in DENSE). InvestigationVerifier remains as internal compilation chain verification — not referenced in commercial materials. Updated SKU_MODEL, OFFER_CATALOG, SA_DD_PACKAGING. |

---

### PG-011 — Structural Escalation Persistence

| Field | Value |
|-------|-------|
| **Category** | Commercial Gap |
| **Description** | SC describes "structural escalation tracking" implying persistent escalation history across sessions. PI Runtime Layer (5B.3) structural escalation is within-session only — expansion state resets on page reload. |
| **Impacted SKU** | SC |
| **Severity** | MEDIUM |
| **Blocking?** | NO for SA/SA-DD (point-in-time). Contributes to SC gap (see PG-001). |
| **Current Status** | **RESOLVED** (2026-06-02) |
| **Source Audit** | SKU capability audit 2026-06-02 |
| **Resolution** | Added "within-session" qualifier to structural escalation references in SKU_MODEL composition matrix and OFFER_CATALOG SC description. Persistent escalation history remains part of PG-001 (cross-session progression). |

---

## Summary

| ID | Name | Category | Blocking SKU | Severity | Status |
|----|------|----------|-------------|----------|--------|
| PG-001 | Cross-Session Qualification Progression | Product Capability Gap | SC, SE | CRITICAL | OPEN |
| PG-002 | Multi-Run Comparison | Product Capability Gap | SC, SE | CRITICAL | OPEN |
| PG-003 | SKU Gating | Product Capability Gap | SC, SE | HIGH | OPEN |
| PG-004 | Production RBAC | Product Capability Gap | SE | CRITICAL | OPEN |
| PG-005 | Multi-Program Intelligence | Product Capability Gap | SE | CRITICAL | OPEN |
| PG-006 | Guided Query Mode Attribution | Commercial Gap | — | MEDIUM | **RESOLVED** |
| PG-007 | Condition Count Correction | Runtime Truth Correction | — | LOW | **RESOLVED** |
| PG-008 | Query Count Correction | Runtime Truth Correction | — | LOW | **RESOLVED** |
| PG-009 | Investigation Trail / Evidence Record Conflation | Commercial Gap | — | MEDIUM | **RESOLVED** |
| PG-010 | Investigation Protocol Commercial Language | Commercial Gap | — | MEDIUM | **RESOLVED** |
| PG-011 | Structural Escalation Persistence | Commercial Gap | — | MEDIUM | **RESOLVED** |

### By Disposition

| Disposition | Total | Open | Resolved | Action |
|-------------|-------|------|----------|--------|
| **Runtime Truth Correction** | 2 | 0 | 2 | All resolved 2026-06-02 |
| **Commercial Gap** | 4 | 0 | 4 | All resolved 2026-06-02 |
| **Product Capability Gap** | 5 | 5 | 0 | Build required — does not exist in runtime |

### SKU Readiness

| SKU | Blocking Gaps | Documentation Gaps | Sellable? |
|-----|--------------|-------------------|-----------|
| **SA** | 0 | 0 (all resolved) | YES — sellable today. Commercial packaging matches runtime. |
| **SA-DD** | 0 | 0 (all resolved) | YES — sellable today. Commercial packaging matches runtime. |
| **SC** | 3 (PG-001, PG-002, PG-003) | 0 | NO — requires cross-session progression, multi-run comparison, SKU gating |
| **SE** | 5 (PG-001, PG-002, PG-003, PG-004, PG-005) | 0 | NO — requires all SC blockers + production RBAC + multi-program intelligence |

---

## Cross-References

- [[COMMERCIAL_INFORMATION_ARCHITECTURE]] — commercial tree architecture
- [[CURRENT_CANONICAL_PATHS]] — runtime module inventory
- [[../00_START_HERE/PIOS_CURRENT_CANONICAL_STATE]] — canonical system state
