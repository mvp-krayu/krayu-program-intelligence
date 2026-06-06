# Signäl — Product Language Decisions (P0-6)

> **Purpose:** Formal resolution of the 5 product language decisions (D1-D5) from SIGNAL_PRODUCT_PLAN_2026.md. These decisions align product language with implementation reality before the first SA sale.

> **Date:** 2026-06-02
> **Authority:** SIGNAL_PRODUCT_PLAN_2026.md §Implementation Decisions

---

## Decisions

All 5 decisions resolved as **Option B** — update product language to match the stronger implementation that already exists. No implementation work required. Language updates only.

---

### D1: Capability-Level Topology — RESOLVED

| Field | Value |
|-------|-------|
| **Decision** | Domain/cluster topology is sufficient. No capability drill-down required. |
| **Product Language** | "Semantic cluster topology" — not "capability-level topology" |
| **Rationale** | Domain/cluster is an architectural improvement over capability-level granularity. The structural topology at domain and cluster level delivers the executive insight the buyer needs. Capability drill-down is deferred to P3-2 (roadmap, trigger-based). |
| **Affected Artifacts** | SIGNAL_OFFER_CATALOG_2026.md, SIGNAL_TIER1_COMMERCIAL_OFFER.md — no changes needed (already use "structural topology" language) |

---

### D2: Numeric Ceiling Score — RESOLVED

| Field | Value |
|-------|-------|
| **Decision** | Governed ceiling posture with driver attribution replaces any numeric score. |
| **Product Language** | "Governed operational ceiling assessment with structural driver attribution" — not a numeric score |
| **Rationale** | A qualitative ceiling with structural drivers is more valuable than a derived number. Reinforced by GTM D9: no numeric scores on BOARDROOM. The posture (PROCEED / INVESTIGATE / ESCALATE) with driver attribution IS the executive surface. |
| **Affected Artifacts** | SIGNAL_IMPLEMENTATION_PLAN_2026.md P0-1 — DROPPED (contradicts this decision and GTM D9) |

---

### D3: Golden Query Feature — RESOLVED

| Field | Value |
|-------|-------|
| **Decision** | "Guided Structural Interrogation" replaces "Golden Query." |
| **Product Language** | "Guided Structural Interrogation" — 36 governed structural questions with evidence-traced answers |
| **Rationale** | The guided query system with 36 questions and structural escalation already exists and is stronger than a domain-scoped golden query. The product already delivers this. Language aligns with implementation. |
| **Affected Artifacts** | SIGNAL_OFFER_CATALOG_2026.md — already uses "Guided Structural Interrogation" |

---

### D4: Evidence Vault Access — RESOLVED

| Field | Value |
|-------|-------|
| **Decision** | Governed evidence inspection (current model) replaces raw vault access. |
| **Product Language** | "Governed evidence inspection" — not "vault access" or "artifact browsing" |
| **Rationale** | Raw vault access bypasses governance and is architecturally incorrect. The current governed evidence view — where every evidence artifact is presented through governance-bounded inspection with qualification metadata — is the correct product. No implementation change needed. |
| **Affected Artifacts** | None — already implemented correctly |

---

### D5: Claim+Derived+TraceDepth Output Format — RESOLVED

| Field | Value |
|-------|-------|
| **Decision** | Governed evidence trail export (InterrogationTrailBuilder) replaces Claim+Derived+TraceDepth format. |
| **Product Language** | "Governed evidence trail" — the evidence record produced by the Assessment Package export |
| **Rationale** | The InterrogationTrailBuilder produces a stronger, governed artifact with posture, confidence envelope, topology, and governance boundary — all evidence-traced and qualification-gated. The Claim+Derived+TraceDepth format was a conceptual model; the governed evidence trail is the operational reality. |
| **Affected Artifacts** | None — already implemented correctly (Evidence Record in Assessment Package) |

---

## Summary

| Decision | Resolution | Implementation Required |
|----------|-----------|----------------------|
| D1 — Topology level | Domain/cluster sufficient | None |
| D2 — Numeric score | Governed posture with drivers | None (P0-1 dropped) |
| D3 — Golden Query | Guided Structural Interrogation | None |
| D4 — Vault access | Governed evidence inspection | None |
| D5 — Output format | Governed evidence trail | None |

**Total implementation effort: zero.** All 5 decisions confirm that the current implementation is the correct product. Language alignment only.

---

## Product Language Reference

For all customer-facing materials, use:

| Concept | Correct Product Language | Do Not Use |
|---------|------------------------|------------|
| Topology | Structural topology, semantic cluster topology | Capability-level topology |
| Operational ceiling | Governed operational ceiling with structural drivers | Numeric ceiling score, readiness score |
| Executive posture | PROCEED / INVESTIGATE / ESCALATE with driver attribution | Numeric scores, percentages, ratings |
| Structural queries | Guided Structural Interrogation | Golden Query |
| Evidence access | Governed evidence inspection | Vault access, artifact browsing |
| Evidence output | Governed evidence trail, Evidence Record | Claim+Derived+TraceDepth |
