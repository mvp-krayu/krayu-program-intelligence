# Derivative Entity Graph Map

Stream: I.4 — Canonical Completion of Derivative Entities (Graph-Aligned)
Phase: 2 — GRAPH
Source: Phase 1 inventory only
Date: 2026-03-31

---

## Graph Rules Applied

- Top-level authority nodes: 6 (fixed, no additions)
- Derivative entities: 19 (from Phase 1 inventory only)
- Maximum depth from authority node: 3
- No entity appears at L0 except the 6 authority nodes
- No orphan nodes
- Cross-links notated separately from primary hierarchy

---

## Primary Hierarchy

Notation:
- [L0] = authority node
- [L1] = depth 1 from authority node
- [L2] = depth 2 from authority node
- [L3] = depth 3 from authority node
- (×) = cross-link exists — see Cross-Link Register

```
krayu [L0]
└── program_intelligence_advisory [L1]

program_intelligence [L0]
├── execution_stability_index [L1] (×)
│   ├── schedule_stability [L2]
│   ├── cost_stability [L2]
│   ├── delivery_predictability [L2]
│   ├── flow_compression [L2]
│   └── early_warning_signals [L2] (×)
├── risk_acceleration_gradient [L1] (×)
├── execution_blindness [L1] (×)
│   ├── execution_blindness_examples [L2]
│   └── why_dashboards_fail_programs [L2]
├── program_intelligence_gap [L1] (×)
└── research [L1]

manifesto [L0]
(no exclusive derivative children)

pios [L0]
├── evidence_intake [L1]
├── structure_reconstruction [L1]
├── signal_computation [L1]
└── condition_and_diagnosis [L1]

portfolio_intelligence [L0]
(no exclusive derivative children)

signal_platform [L0]
├── signal_infrastructure [L1] (×)
└── execlens [L1] (×)
```

---

## Cross-Link Register

All cross-links are bidirectional unless marked directional with →.

| Link ID | From | To | Relationship Type | Direction |
|---------|------|----|-------------------|-----------|
| XL-01 | pios | execution_stability_index | produces | pios → execution_stability_index |
| XL-02 | pios | risk_acceleration_gradient | produces | pios → risk_acceleration_gradient |
| XL-03 | pios | signal_infrastructure | operationalizes | pios → signal_infrastructure |
| XL-04 | risk_acceleration_gradient | execution_stability_index | dimension_of | risk_acceleration_gradient → execution_stability_index |
| XL-05 | execution_stability_index | portfolio_intelligence | consumed_by | execution_stability_index → portfolio_intelligence |
| XL-06 | risk_acceleration_gradient | portfolio_intelligence | consumed_by | risk_acceleration_gradient → portfolio_intelligence |
| XL-07 | signal_infrastructure | execution_blindness | resolves | signal_infrastructure → execution_blindness |
| XL-08 | execution_blindness | program_intelligence_gap | produced_by | execution_blindness → program_intelligence_gap |
| XL-09 | early_warning_signals | risk_acceleration_gradient | references | early_warning_signals → risk_acceleration_gradient |
| XL-10 | early_warning_signals | execution_blindness | references | early_warning_signals → execution_blindness |
| XL-11 | execlens | signal_infrastructure | surface_of | execlens → signal_infrastructure |
| XL-12 | manifesto | program_intelligence | grounds | manifesto → program_intelligence |
| XL-13 | manifesto | research | references | manifesto → research |
| XL-14 | program_intelligence_gap | pios | resolved_by | program_intelligence_gap → pios |

---

## Depth Verification

All 19 derivative entities confirmed within maximum depth 3.

| Entity | Primary Parent | Depth |
|--------|---------------|-------|
| program_intelligence_advisory | krayu | 1 |
| execution_stability_index | program_intelligence | 1 |
| risk_acceleration_gradient | program_intelligence | 1 |
| execution_blindness | program_intelligence | 1 |
| program_intelligence_gap | program_intelligence | 1 |
| research | program_intelligence | 1 |
| signal_infrastructure | signal_platform | 1 |
| execlens | signal_platform | 1 |
| evidence_intake | pios | 1 |
| structure_reconstruction | pios | 1 |
| signal_computation | pios | 1 |
| condition_and_diagnosis | pios | 1 |
| schedule_stability | execution_stability_index | 2 |
| cost_stability | execution_stability_index | 2 |
| delivery_predictability | execution_stability_index | 2 |
| flow_compression | execution_stability_index | 2 |
| early_warning_signals | execution_stability_index | 2 |
| execution_blindness_examples | execution_blindness | 2 |
| why_dashboards_fail_programs | execution_blindness | 2 |

Maximum depth reached: 2. No entity at depth 3.

---

## Orphan Check

| Entity | Has Primary Parent | Has Cross-Link | Status |
|--------|-------------------|---------------|--------|
| program_intelligence_advisory | krayu | — | CONNECTED |
| execution_stability_index | program_intelligence | XL-01, XL-04, XL-05 | CONNECTED |
| risk_acceleration_gradient | program_intelligence | XL-02, XL-04, XL-06, XL-09 | CONNECTED |
| execution_blindness | program_intelligence | XL-07, XL-08, XL-10 | CONNECTED |
| program_intelligence_gap | program_intelligence | XL-08, XL-14 | CONNECTED |
| research | program_intelligence | XL-13 | CONNECTED |
| signal_infrastructure | signal_platform | XL-03, XL-07, XL-11 | CONNECTED |
| execlens | signal_platform | XL-11 | CONNECTED |
| evidence_intake | pios | — | CONNECTED |
| structure_reconstruction | pios | — | CONNECTED |
| signal_computation | pios | — | CONNECTED |
| condition_and_diagnosis | pios | — | CONNECTED |
| schedule_stability | execution_stability_index | — | CONNECTED |
| cost_stability | execution_stability_index | — | CONNECTED |
| delivery_predictability | execution_stability_index | — | CONNECTED |
| flow_compression | execution_stability_index | — | CONNECTED |
| early_warning_signals | execution_stability_index | XL-09, XL-10 | CONNECTED |
| execution_blindness_examples | execution_blindness | — | CONNECTED |
| why_dashboards_fail_programs | execution_blindness | — | CONNECTED |

Orphans: 0

---

## Authority Node Coverage

| Authority Node | Exclusive Derivative Children | Receives Cross-Links |
|----------------|------------------------------|---------------------|
| krayu | program_intelligence_advisory | — |
| program_intelligence | execution_stability_index, risk_acceleration_gradient, execution_blindness, program_intelligence_gap, research | XL-12 |
| manifesto | — | XL-12, XL-13 |
| pios | evidence_intake, structure_reconstruction, signal_computation, condition_and_diagnosis | XL-03, XL-14 |
| portfolio_intelligence | — | XL-05, XL-06 |
| signal_platform | signal_infrastructure, execlens | — |
