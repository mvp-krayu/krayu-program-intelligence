# Control Eligibility Map

**Stream:** 40.10 — PiOS Agentic Orchestration & Runtime Control Layer
**Contract:** PIOS-40.10-ORCHESTRATION-CONTRACT
**Input source:** docs/pios/40.9/feedback_signal_registry.md
**Date:** 2026-03-18

---

## Eligibility Classification Rule

Each FSR is assigned exactly one eligibility class. Classification applies the following conditions in strict precedence order (highest to lowest). The first matching condition is applied; lower conditions are not evaluated.

**Precedence order:**

| Rank | Class | Condition |
|---|---|---|
| 1 (highest) | ELIGIBILITY-3 | coverage state contains "blocked" AND recurrence = yes AND dependency gap appears in ≥ 2 FSRs (multi-FSR propagation) |
| 2 | ELIGIBILITY-2 | coverage state = "blocked" AND recurrence = yes AND dependency gap appears in 1 FSR only |
| 3 | ELIGIBILITY-1 | coverage state = "partial" AND recurrence = yes |
| 4 (lowest) | ELIGIBILITY-0 | coverage state = "partial" AND recurrence = no |

**Multi-FSR propagation definition:** The blocking or pending telemetry element cited in an FSR's dependency chain also appears as a blocking or pending telemetry element in at least one other FSR within the 40.9 feedback signal set.

**Precedence resolution for mixed coverage states:** Where an FSR declares a coverage state of "partial/blocked" (signal type = recurrent_dependency), the blocked component takes precedence for classification purposes. Eligibility-3 conditions apply if all other criteria are met.

**Constraints:**
- No FSR may be assigned multiple eligibility classes
- Classification is deterministic and reproducible from FSR attributes alone
- No scoring, no prioritization, no interpretation

---

## FSR Eligibility Classification

### FSR-001 — Change Concentration Unknown Space

| Classification Field | Value |
|---|---|
| Source FSR | FSR-001 |
| Coverage state | blocked |
| Recurrence status | yes (REC-003) |
| Dependency type | time-series |
| Dependency telemetry | AT-001, AT-002 |
| Multi-FSR propagation | yes — AT-001/AT-002 absence also appears in FSR-006 (DIAG-008 RAG change concentration component) |
| Eligibility class | ELIGIBILITY-3 |
| Eligibility class label | critical_block |
| Classification basis | blocked + recurrent + multi-FSR propagation confirmed |

---

### FSR-002 — Execution Stability Unknown Space

| Classification Field | Value |
|---|---|
| Source FSR | FSR-002 |
| Coverage state | blocked |
| Recurrence status | yes (REC-001, REC-002) |
| Dependency type | event-based |
| Dependency telemetry | DT-007, AT-007 |
| Multi-FSR propagation | yes — DT-007 absence appears in FSR-004, FSR-007, FSR-008; AT-007 absence appears in FSR-003, FSR-005, FSR-007 |
| Eligibility class | ELIGIBILITY-3 |
| Eligibility class label | critical_block |
| Classification basis | blocked + recurrent + multi-FSR propagation confirmed |

---

### FSR-003 — Runtime Coordination Dimension Gap

| Classification Field | Value |
|---|---|
| Source FSR | FSR-003 |
| Coverage state | partial |
| Recurrence status | yes (REC-001) |
| Dependency type | event-based |
| Dependency telemetry | AT-005, AT-007 |
| Multi-FSR propagation | not applicable — FSR-003 coverage state is partial; ELIGIBILITY-1 condition applies before multi-FSR check |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Classification basis | partial + recurrent; dependency unresolved but overall coverage state not blocked |

---

### FSR-004 — Throughput Completion Factor Gap

| Classification Field | Value |
|---|---|
| Source FSR | FSR-004 |
| Coverage state | partial |
| Recurrence status | yes (REC-002) |
| Dependency type | event-based |
| Dependency telemetry | DT-007, AT-006 |
| Multi-FSR propagation | not applicable — FSR-004 coverage state is partial; ELIGIBILITY-1 condition applies before multi-FSR check |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Classification basis | partial + recurrent; dependency unresolved but overall coverage state not blocked |

---

### FSR-005 — ESI Execution Stability Component Gap

| Classification Field | Value |
|---|---|
| Source FSR | FSR-005 |
| Coverage state | partial |
| Recurrence status | yes (REC-001, REC-002) |
| Dependency type | event-based |
| Dependency telemetry | DT-007, AT-007 (via SIG-006) |
| Multi-FSR propagation | not applicable — FSR-005 coverage state is partial (DIAG-007 has resolved static components); ELIGIBILITY-1 condition applies |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Classification basis | partial + recurrent; overall coverage state is partial; one component within ESI is blocked via SIG-006, but the FSR-level coverage state is declared partial |

---

### FSR-006 — RAG Change Concentration Component Gap

| Classification Field | Value |
|---|---|
| Source FSR | FSR-006 |
| Coverage state | partial |
| Recurrence status | yes (REC-003) |
| Dependency type | time-series |
| Dependency telemetry | AT-001, AT-002 (via SIG-003) |
| Multi-FSR propagation | not applicable — FSR-006 coverage state is partial; ELIGIBILITY-1 condition applies before multi-FSR check |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Classification basis | partial + recurrent; dependency unresolved but overall coverage state not blocked |

---

### FSR-007 — AT-007 Recurring Event-Based Dependency

| Classification Field | Value |
|---|---|
| Source FSR | FSR-007 |
| Coverage state | partial/blocked |
| Precedence resolution | blocked component present; blocked takes precedence |
| Recurrence status | yes (REC-001) — 5 delivery elements |
| Dependency type | event-based |
| Dependency telemetry | AT-007 |
| Multi-FSR propagation | yes — AT-007 is the recurring element in REC-001, which underlies FSR-002, FSR-003, FSR-005 as well |
| Eligibility class | ELIGIBILITY-3 |
| Eligibility class label | critical_block |
| Classification basis | blocked (component present, precedence applied) + recurrent + multi-FSR propagation confirmed |

---

### FSR-008 — DT-007 Recurring Event-Based Dependency

| Classification Field | Value |
|---|---|
| Source FSR | FSR-008 |
| Coverage state | partial/blocked |
| Precedence resolution | blocked component present; blocked takes precedence |
| Recurrence status | yes (REC-002) — 5 delivery elements |
| Dependency type | event-based |
| Dependency telemetry | DT-007 |
| Multi-FSR propagation | yes — DT-007 is the recurring element in REC-002, which underlies FSR-002, FSR-004, FSR-005 as well |
| Eligibility class | ELIGIBILITY-3 |
| Eligibility class label | critical_block |
| Classification basis | blocked (component present, precedence applied) + recurrent + multi-FSR propagation confirmed |

---

## Eligibility Classification Summary

| FSR ID | Signal Type | Coverage State | Recurrent | Multi-FSR | Eligibility Class | Action Type |
|---|---|---|---|---|---|---|
| FSR-001 | unknown_space | blocked | yes | yes | ELIGIBILITY-3 | ACT-02 |
| FSR-002 | unknown_space | blocked | yes | yes | ELIGIBILITY-3 | ACT-03 |
| FSR-003 | partial_coverage | partial | yes | — | ELIGIBILITY-1 | ACT-01 |
| FSR-004 | partial_coverage | partial | yes | — | ELIGIBILITY-1 | ACT-01 |
| FSR-005 | partial_coverage | partial | yes | — | ELIGIBILITY-1 | ACT-01 |
| FSR-006 | partial_coverage | partial | yes | — | ELIGIBILITY-1 | ACT-01 |
| FSR-007 | recurrent_dependency | partial/blocked → blocked | yes | yes | ELIGIBILITY-3 | ACT-03 |
| FSR-008 | recurrent_dependency | partial/blocked → blocked | yes | yes | ELIGIBILITY-3 | ACT-03 |

**ELIGIBILITY-3 count:** 4 (FSR-001, FSR-002, FSR-007, FSR-008)
**ELIGIBILITY-2 count:** 0
**ELIGIBILITY-1 count:** 4 (FSR-003, FSR-004, FSR-005, FSR-006)
**ELIGIBILITY-0 count:** 0

**Action type assignment rule (deterministic):**
- ELIGIBILITY-3 + dependency type = time-series → ACT-02 (request_observability_extension)
- ELIGIBILITY-3 + dependency type = event-based → ACT-03 (request_pipeline_activation)
- ELIGIBILITY-1 + any dependency type → ACT-01 (request_evidence_extension)
- ELIGIBILITY-0 → ACT-05 (no_action)
