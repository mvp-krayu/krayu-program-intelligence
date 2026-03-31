# Derivative Entity Inventory

Stream: I.4 — Canonical Completion of Derivative Entities (Graph-Aligned)
Phase: 1 — INVENTORY
Source: /pages/*.md + existing canonical docs
Date: 2026-03-31

---

## Exclusions — Top-Level Authority Nodes

The following are NOT included in this inventory.
They define the authority structure against which all derivative entities are positioned.

| Node | Route |
|------|-------|
| krayu | / |
| program_intelligence | /program-intelligence/ |
| manifesto | /manifesto/ |
| pios | /pios/ |
| portfolio_intelligence | /portfolio-intelligence/ |
| signal_platform | /signal-platform/ |

---

## Category A — Routed Derivative Entities

Entities with a backing page in /pages/*.md and a live or pending route.

| Entity | Route | Backing File | publish_status | Surface Type |
|--------|-------|--------------|----------------|--------------|
| execution_stability_index | /execution-stability-index/ | pages/execution-stability-index.md | live | standalone_route |
| risk_acceleration_gradient | /risk-acceleration-gradient/ | pages/risk-acceleration-gradient.md | live | standalone_route |
| execution_blindness | /execution-blindness/ | pages/execution-blindness.md | live | anchor_surface |
| program_intelligence_gap | /program-intelligence-gap/ | pages/program-intelligence-gap.md | live | anchor_surface |
| signal_infrastructure | /signal-infrastructure/ | pages/signal-infrastructure.md | live | anchor_surface |
| research | /research/ | pages/research.md | live | standalone_route |
| early_warning_signals | /early-warning-signals-program-failure/ | pages/early-warning-signals-program-failure.md | preview-pending-publish | standalone_route |
| execution_blindness_examples | /execution-blindness-examples/ | pages/execution-blindness-examples.md | preview-pending-publish | standalone_route |
| why_dashboards_fail_programs | /why-dashboards-fail-programs/ | pages/why-dashboards-fail-programs.md | preview-pending-publish | standalone_route |

---

## Category B — Named Constructs Without Own Routes

Entities explicitly named and defined within pages but without a standalone route or backing page.

| Entity | Named In | Parent Entity |
|--------|----------|---------------|
| execlens | pages/signal-infrastructure.md, pages/pios.md, pages/signal-platform.md, pages/execution-stability-index.md | signal_platform / signal_infrastructure |
| schedule_stability | pages/execution-stability-index.md, pages/execution-blindness.md, pages/early-warning-signals-program-failure.md, pages/execution-blindness-examples.md | execution_stability_index |
| cost_stability | pages/execution-stability-index.md, pages/execution-blindness.md, pages/early-warning-signals-program-failure.md, pages/execution-blindness-examples.md | execution_stability_index |
| delivery_predictability | pages/execution-stability-index.md, pages/execution-blindness.md, pages/early-warning-signals-program-failure.md, pages/execution-blindness-examples.md | execution_stability_index |
| flow_compression | pages/execution-stability-index.md, pages/execution-blindness.md, pages/early-warning-signals-program-failure.md, pages/execution-blindness-examples.md | execution_stability_index |
| program_intelligence_advisory | pages/program-intelligence.md, pages/manifesto.md | program_intelligence |
| evidence_intake | pages/signal-infrastructure.md, pages/pios.md | pios |
| structure_reconstruction | pages/signal-infrastructure.md, pages/pios.md | pios |
| signal_computation | pages/signal-infrastructure.md, pages/pios.md | pios |
| condition_and_diagnosis | pages/signal-infrastructure.md, pages/pios.md | pios |

---

## Category C — Sub-Entity Dimensions of ESI

Five execution dimensions named explicitly as ESI component constructs across multiple pages.
Included separately for completeness. Parent: execution_stability_index.

| Dimension Entity | Explicit Name Used | Named In |
|------------------|--------------------|----------|
| schedule_stability | "Schedule Stability" | esi.md, execution-blindness.md, early-warning-signals.md, execution-blindness-examples.md, portfolio-intelligence.md |
| cost_stability | "Cost Stability" | esi.md, execution-blindness.md, early-warning-signals.md, execution-blindness-examples.md, portfolio-intelligence.md |
| delivery_predictability | "Delivery Predictability" | esi.md, execution-blindness.md, early-warning-signals.md, execution-blindness-examples.md, portfolio-intelligence.md |
| flow_compression | "Flow Compression" | esi.md, execution-blindness.md, early-warning-signals.md, execution-blindness-examples.md, portfolio-intelligence.md |

Note: risk_acceleration_gradient appears as both a standalone routed entity (Category A) and as the fifth ESI dimension. It is not duplicated — it is cross-classified.

---

## Category D — Process Step Constructs of PiOS

Four transformation steps named explicitly as PiOS architecture components.
Parent: pios.

| Step Entity | Step Number | Explicit Label | Named In |
|-------------|-------------|----------------|----------|
| evidence_intake | 01 | "Evidence Intake" | pages/pios.md, pages/signal-infrastructure.md |
| structure_reconstruction | 02 | "Structure Reconstruction" | pages/pios.md, pages/signal-infrastructure.md |
| signal_computation | 03 | "Signal Computation" | pages/pios.md, pages/signal-infrastructure.md |
| condition_and_diagnosis | 04 | "Condition and Diagnosis" | pages/pios.md, pages/signal-infrastructure.md |

---

## Summary Count

| Category | Count |
|----------|-------|
| A — Routed derivative entities | 9 |
| B — Named constructs without routes | 10 |
| C — ESI dimension sub-constructs | 4 (overlapping with B) |
| D — PiOS step constructs | 4 (overlapping with B) |
| **Total distinct derivative entities** | **19** |

Excluded top-level authority nodes: 6

---

## Source Files Scanned

| File | Status |
|------|--------|
| pages/execution-stability-index.md | scanned |
| pages/risk-acceleration-gradient.md | scanned |
| pages/execution-blindness.md | scanned |
| pages/program-intelligence-gap.md | scanned |
| pages/signal-infrastructure.md | scanned |
| pages/pios.md | scanned |
| pages/portfolio-intelligence.md | scanned |
| pages/manifesto.md | scanned |
| pages/program-intelligence.md | scanned |
| pages/research.md | scanned |
| pages/signal-platform.md | scanned |
| pages/early-warning-signals-program-failure.md | scanned |
| pages/execution-blindness-examples.md | scanned |
| pages/why-dashboards-fail-programs.md | scanned |
| pages/index.md | scanned |
| WEB/base44-snapshot/signal-infrastructure.md | scanned |
| WEB/base44-snapshot/program-intelligence.md | scanned |
| docs/deep-research-report.md | scanned — IA research doc, no new entities |
