# Derivative Entity Dependency Map

Stream: I.4 — Canonical Completion of Derivative Entities (Graph-Aligned)
Phase: 2 — GRAPH
Source: Phase 1 inventory only
Date: 2026-03-31

---

## Dependency Rules Applied

- Source: Phase 1 inventory entities only
- Authority nodes included as dependency anchors (not redefined)
- Dependency direction: A → B = A depends on / references / is produced by B
- No new entities
- No inferred relationships beyond explicit page evidence

---

## Dependency Types

| Type | Symbol | Meaning |
|------|--------|---------|
| produces | →[P] | upstream entity produces downstream entity |
| references | →[R] | entity explicitly references another |
| dimension_of | →[D] | entity is a named dimension of another |
| resolves | →[Rv] | entity structurally resolves the condition of another |
| produced_by | →[PB] | entity is produced by the named upstream |
| surface_of | →[S] | entity is a surface layer of another |
| operationalizes | →[Op] | entity makes another operationally executable |
| consumed_by | →[C] | entity's outputs are consumed by another |
| grounds | →[G] | entity provides foundational grounding for another |

---

## Full Dependency Table

| From Entity | Dependency Type | To Entity | Evidence Source |
|-------------|----------------|-----------|-----------------|
| pios | →[P] | execution_stability_index | pages/pios.md, pages/signal-infrastructure.md |
| pios | →[P] | risk_acceleration_gradient | pages/pios.md, pages/signal-infrastructure.md |
| pios | →[Op] | signal_infrastructure | pages/signal-infrastructure.md, pages/pios.md |
| pios | →[P] | evidence_intake | pages/pios.md |
| pios | →[P] | structure_reconstruction | pages/pios.md |
| pios | →[P] | signal_computation | pages/pios.md |
| pios | →[P] | condition_and_diagnosis | pages/pios.md |
| signal_platform | →[S] | execlens | pages/signal-infrastructure.md |
| signal_platform | →[S] | signal_infrastructure | pages/signal-platform.md, pages/signal-infrastructure.md |
| signal_infrastructure | →[Rv] | execution_blindness | pages/signal-infrastructure.md, pages/execution-blindness.md |
| signal_infrastructure | →[R] | execution_stability_index | pages/signal-infrastructure.md |
| signal_infrastructure | →[R] | risk_acceleration_gradient | pages/signal-infrastructure.md |
| execlens | →[S] | signal_infrastructure | pages/signal-infrastructure.md |
| program_intelligence | →[R] | execution_stability_index | pages/program-intelligence.md |
| program_intelligence | →[R] | risk_acceleration_gradient | pages/program-intelligence.md |
| program_intelligence | →[R] | execution_blindness | pages/program-intelligence.md |
| program_intelligence | →[R] | program_intelligence_gap | pages/program-intelligence.md |
| program_intelligence | →[R] | signal_infrastructure | pages/program-intelligence.md |
| program_intelligence | →[R] | pios | pages/program-intelligence.md |
| program_intelligence | →[R] | portfolio_intelligence | pages/program-intelligence.md |
| program_intelligence_gap | →[PB] | execution_blindness | pages/program-intelligence-gap.md, pages/execution-blindness.md |
| program_intelligence_gap | →[Rv] | pios | pages/program-intelligence-gap.md |
| program_intelligence_gap | →[Rv] | signal_infrastructure | pages/program-intelligence-gap.md |
| execution_blindness | →[Rv] | signal_infrastructure | pages/execution-blindness.md |
| execution_blindness | →[R] | execution_stability_index | pages/execution-blindness.md |
| execution_blindness | →[R] | risk_acceleration_gradient | pages/execution-blindness.md |
| execution_blindness | →[R] | execution_blindness_examples | pages/execution-blindness.md |
| execution_blindness_examples | →[R] | execution_blindness | pages/execution-blindness-examples.md |
| execution_blindness_examples | →[R] | execution_stability_index | pages/execution-blindness-examples.md |
| execution_blindness_examples | →[R] | risk_acceleration_gradient | pages/execution-blindness-examples.md |
| execution_blindness_examples | →[R] | early_warning_signals | pages/execution-blindness-examples.md |
| why_dashboards_fail_programs | →[R] | execution_blindness | pages/why-dashboards-fail-programs.md |
| why_dashboards_fail_programs | →[R] | execution_stability_index | pages/why-dashboards-fail-programs.md |
| why_dashboards_fail_programs | →[R] | risk_acceleration_gradient | pages/why-dashboards-fail-programs.md |
| why_dashboards_fail_programs | →[R] | execution_blindness_examples | pages/why-dashboards-fail-programs.md |
| why_dashboards_fail_programs | →[R] | early_warning_signals | pages/why-dashboards-fail-programs.md |
| execution_stability_index | →[D] | schedule_stability | pages/execution-stability-index.md |
| execution_stability_index | →[D] | cost_stability | pages/execution-stability-index.md |
| execution_stability_index | →[D] | delivery_predictability | pages/execution-stability-index.md |
| execution_stability_index | →[D] | flow_compression | pages/execution-stability-index.md |
| execution_stability_index | →[D] | risk_acceleration_gradient | pages/execution-stability-index.md |
| execution_stability_index | →[C] | portfolio_intelligence | pages/execution-stability-index.md, pages/portfolio-intelligence.md |
| execution_stability_index | →[R] | risk_acceleration_gradient | pages/execution-stability-index.md |
| risk_acceleration_gradient | →[D] | execution_stability_index | pages/risk-acceleration-gradient.md, pages/execution-stability-index.md |
| risk_acceleration_gradient | →[C] | portfolio_intelligence | pages/risk-acceleration-gradient.md, pages/portfolio-intelligence.md |
| risk_acceleration_gradient | →[R] | execution_stability_index | pages/risk-acceleration-gradient.md |
| early_warning_signals | →[R] | execution_stability_index | pages/early-warning-signals-program-failure.md |
| early_warning_signals | →[R] | risk_acceleration_gradient | pages/early-warning-signals-program-failure.md |
| early_warning_signals | →[R] | execution_blindness | pages/early-warning-signals-program-failure.md |
| early_warning_signals | →[R] | execution_blindness_examples | pages/early-warning-signals-program-failure.md |
| portfolio_intelligence | →[R] | execution_stability_index | pages/portfolio-intelligence.md |
| portfolio_intelligence | →[R] | risk_acceleration_gradient | pages/portfolio-intelligence.md |
| portfolio_intelligence | →[R] | program_intelligence | pages/portfolio-intelligence.md |
| manifesto | →[G] | program_intelligence | pages/manifesto.md |
| manifesto | →[R] | signal_platform | pages/manifesto.md |
| manifesto | →[R] | execution_stability_index | pages/manifesto.md |
| manifesto | →[R] | risk_acceleration_gradient | pages/manifesto.md |
| manifesto | →[R] | research | pages/manifesto.md |

---

## Dependency Cluster Summary

Entities grouped by the authority node they primarily depend into.

### Cluster: program_intelligence

| Entity | Inbound Dependencies | Outbound Dependencies |
|--------|---------------------|----------------------|
| execution_stability_index | pios, program_intelligence, execution_blindness, risk_acceleration_gradient (dim), early_warning_signals, execution_blindness_examples, why_dashboards_fail_programs | schedule_stability, cost_stability, delivery_predictability, flow_compression, risk_acceleration_gradient (dim), portfolio_intelligence |
| risk_acceleration_gradient | pios, program_intelligence, execution_stability_index, early_warning_signals, execution_blindness, execution_blindness_examples, why_dashboards_fail_programs | execution_stability_index, portfolio_intelligence |
| execution_blindness | program_intelligence, program_intelligence_gap, signal_infrastructure | execution_blindness_examples, why_dashboards_fail_programs, execution_stability_index, risk_acceleration_gradient |
| program_intelligence_gap | program_intelligence | pios, signal_infrastructure, execution_blindness |
| research | program_intelligence, manifesto | — |
| early_warning_signals | execution_stability_index | execution_stability_index, risk_acceleration_gradient, execution_blindness, execution_blindness_examples |
| execution_blindness_examples | execution_blindness, early_warning_signals | execution_blindness, execution_stability_index, risk_acceleration_gradient, early_warning_signals |
| why_dashboards_fail_programs | execution_blindness | execution_blindness, execution_stability_index, risk_acceleration_gradient, execution_blindness_examples, early_warning_signals |

### Cluster: pios

| Entity | Inbound Dependencies | Outbound Dependencies |
|--------|---------------------|----------------------|
| evidence_intake | pios | — |
| structure_reconstruction | pios | — |
| signal_computation | pios | — |
| condition_and_diagnosis | pios | — |

### Cluster: signal_platform

| Entity | Inbound Dependencies | Outbound Dependencies |
|--------|---------------------|----------------------|
| signal_infrastructure | signal_platform, pios, program_intelligence, program_intelligence_gap, execution_blindness | execution_blindness, execution_stability_index, risk_acceleration_gradient |
| execlens | signal_platform, signal_infrastructure | signal_infrastructure |

### Cluster: krayu

| Entity | Inbound Dependencies | Outbound Dependencies |
|--------|---------------------|----------------------|
| program_intelligence_advisory | krayu | — |

### Cluster: execution_stability_index (sub-constructs)

| Entity | Inbound Dependencies | Outbound Dependencies |
|--------|---------------------|----------------------|
| schedule_stability | execution_stability_index | — |
| cost_stability | execution_stability_index | — |
| delivery_predictability | execution_stability_index | — |
| flow_compression | execution_stability_index | — |

---

## High-Dependency Nodes

Entities with 4 or more inbound dependencies. These are load-bearing graph nodes.

| Entity | Inbound Count | Notes |
|--------|--------------|-------|
| execution_stability_index | 7 | highest inbound — central analytical construct |
| risk_acceleration_gradient | 7 | cross-classified as standalone + ESI dimension |
| execution_blindness | 4 | condition node — produced_by and resolved_by both present |
| signal_infrastructure | 5 | operationalized by pios, resolves execution_blindness |

---

## Circular Dependency Check

| Pair | Type | Status |
|------|------|--------|
| execution_stability_index ↔ risk_acceleration_gradient | mutual dimension + reference | NOTED — not a true circular dependency; RAG is both dimension_of ESI and a standalone entity |
| execution_blindness ↔ execution_blindness_examples | mutual reference | NOTED — surface reference only, not structural circularity |
| program_intelligence_gap ↔ execution_blindness | produces/produced_by | NOTED — directional causal chain, not circular |

No structural circular dependencies present.
