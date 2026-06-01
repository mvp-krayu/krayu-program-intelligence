# Product Language Decisions — Resolved

> **Authority:** Resolves D1-D6 from SIGNAL_PRODUCT_PLAN_2026.md. All decisions accept the recommended option. Product language in customer-facing artifacts reflects these decisions.

> **Date:** 2026-06-01

---

## D1: Topology Depth — RESOLVED: Domain/Cluster Sufficient

**Decision:** Domain/cluster topology is the product. Update product language to reflect this as the architectural design, not a limitation.

**Product language:** "Structural topology with semantic cluster mapping" — not "capability-level topology." Domain/cluster provides the executive and operational view. Capability drill-down is a P3 roadmap item if customer feedback demands it.

**Impact:** No implementation work. Language update only.

---

## D2: Ceiling Representation — RESOLVED: Governed Posture, Not Numeric Score

**Decision:** Governed ceiling posture with driver attribution replaces any numeric ceiling score. Aligns with D9 from GTM closure (no numeric scores on BOARDROOM).

**Product language:** "Operational ceiling posture" with named structural drivers — not a score. The posture tells the executive WHAT constrains throughput and WHY. A number tells them nothing actionable.

**Impact:** No implementation work. P0-1 (score projection to BOARDROOM) confirmed dropped.

---

## D3: Golden Query — RESOLVED: Retired in Favor of Guided Structural Interrogation

**Decision:** "Golden Query" is retired. The product is "Guided Structural Interrogation" — 36 governed structural queries with evidence-traced answers and structural escalation.

**Product language:** "Guided Structural Interrogation" in all customer-facing material. Never "Golden Query."

**Impact:** No implementation work. The guided interrogation system already exists and is stronger than the golden query concept.

---

## D4: Evidence Access — RESOLVED: Governed Evidence Inspection

**Decision:** Raw artifact vault browsing is not the product. Governed evidence inspection (the current model) is the product.

**Product language:** "Governed evidence inspection" — not "vault access" or "artifact browsing." Evidence is presented through governance boundaries, not exposed as raw files.

**Impact:** No implementation work. Current governed view is the correct product.

---

## D5: Evidence Output Format — RESOLVED: Governed Evidence Trail Export

**Decision:** Claim+Derived+TraceDepth format is retired. The governed evidence trail export (InterrogationTrailBuilder) is the product.

**Product language:** "Evidence Record" — the governed structural evidence snapshot. Not a raw data export format.

**Impact:** No implementation work. InterrogationTrailBuilder already produces the governed artifact.

---

## D6: Multi-Run Comparison Scope — RESOLVED: Posture Trend for Launch

**Decision:** SC launches with posture trend line (is it getting better/stable/degrading?). Full posture delta dashboard is P3 roadmap.

**Product language:** "Structural posture evolution tracking" — not "posture delta dashboard." The buyer question is "is our architecture improving?" — a trend answers that.

**Impact:** P1-2 (multi-run posture tracking) builds the trend. P3-3 (full delta dashboard) is roadmap.

---

## Summary

| Decision | Resolution | Implementation Work |
|----------|-----------|-------------------|
| D1 — Topology depth | Domain/cluster sufficient | None — language only |
| D2 — Ceiling representation | Governed posture, not score | None — confirms P0-1 drop |
| D3 — Golden Query | Retired → Guided Structural Interrogation | None — already built |
| D4 — Evidence access | Governed inspection, not raw vault | None — already built |
| D5 — Evidence output | Governed trail export, not Claim+Derived format | None — already built |
| D6 — Multi-run scope | Posture trend for launch, dashboard as roadmap | P1-2 builds trend |

**Net implementation savings from accepting all six decisions: 5-6 weeks.**

Every decision accepts existing product reality as the correct product. No implementation work is created. The only action is ensuring customer-facing language matches these resolutions.
