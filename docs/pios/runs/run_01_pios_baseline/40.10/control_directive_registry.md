# Control Directive Registry

**Stream:** 40.10 — PiOS Agentic Orchestration & Runtime Control Layer
**Contract:** PIOS-40.10-ORCHESTRATION-CONTRACT
**Input source:** docs/pios/40.9/feedback_signal_registry.md, docs/pios/40.10/control_eligibility_map.md
**Date:** 2026-03-18

---

## Registry Rule

Each directive is a bounded, declarative, non-executing control output derived from a single FSR. Directives do not recommend, prioritize, rank, score, or execute. No directive modifies intelligence, diagnosis, or delivery artifacts. Directive triggering conditions are descriptive only — no causal explanation and no root-cause inference.

---

## DIR-001

| Directive Field | Value |
|---|---|
| Directive ID | DIR-001 |
| Source FSR | FSR-001 |
| FSR signal type | unknown_space |
| Eligibility class | ELIGIBILITY-3 (critical_block) |
| Triggering condition | FSR-001 coverage state is blocked; AT-001 (automation trigger frequency) and AT-002 (auto-commit event frequency) are absent from the 40.4 telemetry input set; SIG-003 (change concentration signal, CKR-008) is uncomputable; DIAG-005 and the change concentration dimension of INTEL-005 remain blocked; AT-001/AT-002 absence also affects FSR-006 (multi-FSR propagation confirmed in REC-003) |
| Dependency reference | AT-001, AT-002 → SIG-003 → COND-005 → DIAG-005, INTEL-005 |
| Permitted action type | ACT-02 (request_observability_extension) |

**Action type basis:** ELIGIBILITY-3 + dependency type = time-series → ACT-02. Time-series telemetry (push-to-main event counts across successive intervals) requires observability infrastructure extension to capture.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-002

| Directive Field | Value |
|---|---|
| Directive ID | DIR-002 |
| Source FSR | FSR-002 |
| FSR signal type | unknown_space |
| Eligibility class | ELIGIBILITY-3 (critical_block) |
| Triggering condition | FSR-002 coverage state is blocked; DT-007 (pipeline run completion status) and AT-007 (validation gate enforcement count per run) are absent from the 40.4 telemetry input set; SIG-006 (execution stability signal, CKR-011) is uncomputable; DIAG-006 and the execution stability dimension of INTEL-005 remain blocked; DT-007 absence also affects FSR-004, FSR-007, FSR-008; AT-007 absence also affects FSR-003, FSR-005, FSR-007 (multi-FSR propagation confirmed in REC-001, REC-002) |
| Dependency reference | DT-007, AT-007 → SIG-006 → COND-006 → DIAG-006, INTEL-005 |
| Permitted action type | ACT-03 (request_pipeline_activation) |

**Action type basis:** ELIGIBILITY-3 + dependency type = event-based → ACT-03. Event-based telemetry (per-run completion status, per-run validation gate count) requires live pipeline execution to generate.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-003

| Directive Field | Value |
|---|---|
| Directive ID | DIR-003 |
| Source FSR | FSR-003 |
| FSR signal type | partial_coverage |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-003 coverage state is partial; structural coordination ratio (0.875) is resolved; AT-005 (pipeline module execution count per run) and AT-007 (validation gate enforcement count per run) are absent from the 40.4 telemetry input set; SIG-001 (CKR-006) runtime component is unresolved; DIAG-003 and INTEL-002 runtime coordination dimension remain pending |
| Dependency reference | AT-005, AT-007 → SIG-001 (runtime component) → COND-003 → DIAG-003, INTEL-002 |
| Permitted action type | ACT-01 (request_evidence_extension) |

**Action type basis:** ELIGIBILITY-1 + dependency type = event-based → ACT-01. Partial coverage with unresolved runtime evidence component.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-004

| Directive Field | Value |
|---|---|
| Directive ID | DIR-004 |
| Source FSR | FSR-004 |
| FSR signal type | partial_coverage |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-004 coverage state is partial; baseline throughput constants (8 stages/run, 9 artifacts/run) are resolved; DT-007 (pipeline run completion status) and AT-006 (pipeline execution mode at runtime) are absent from the 40.4 telemetry input set; SIG-005 (CKR-010) completion-conditioned rate is unresolved; DIAG-004 and INTEL-002 completion-conditioned throughput dimension remain pending |
| Dependency reference | DT-007, AT-006 → SIG-005 (completion-conditioned component) → COND-004 → DIAG-004, INTEL-002 |
| Permitted action type | ACT-01 (request_evidence_extension) |

**Action type basis:** ELIGIBILITY-1 + dependency type = event-based → ACT-01. Partial coverage with unresolved completion-conditioned component.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-005

| Directive Field | Value |
|---|---|
| Directive ID | DIR-005 |
| Source FSR | FSR-005 |
| FSR signal type | partial_coverage |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-005 coverage state is partial; ESI dependency load component (SIG-002: 0.682) and throughput constants (SIG-005: 8 stages, 9 artifacts/run) are resolved; SIG-006 (CKR-011) execution stability signal is blocked via DT-007 and AT-007 absence; SIG-006 blocking propagates to the execution stability component of SIG-007 (CKR-014); DIAG-007 ESI stability component and INTEL-003 ESI stability dimension remain blocked within an otherwise partial element |
| Dependency reference | DT-007, AT-007 → SIG-006 (blocked) → SIG-007 → COND-007 → DIAG-007, INTEL-003 |
| Permitted action type | ACT-01 (request_evidence_extension) |

**Action type basis:** ELIGIBILITY-1 + dependency type = event-based → ACT-01. Overall FSR coverage state is partial (resolved static components exist); the blocked internal component is captured in FSR-002 and FSR-007 at ELIGIBILITY-3.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-006

| Directive Field | Value |
|---|---|
| Directive ID | DIR-006 |
| Source FSR | FSR-006 |
| FSR signal type | partial_coverage |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-006 coverage state is partial; structural volatility component (SIG-004: 1.273/0.545/0.364/0.455) and structural coordination component (SIG-001 structural: 0.875) are resolved; SIG-003 (CKR-008) change concentration signal is blocked via AT-001 and AT-002 absence; SIG-003 blocking propagates to the change concentration component of SIG-008 (CKR-015); DIAG-008 RAG change concentration component and INTEL-004 change concentration dimension remain blocked within an otherwise partial element |
| Dependency reference | AT-001, AT-002 → SIG-003 (blocked) → SIG-008 → COND-008 → DIAG-008, INTEL-004 |
| Permitted action type | ACT-01 (request_evidence_extension) |

**Action type basis:** ELIGIBILITY-1 + dependency type = time-series → ACT-01. Overall FSR coverage state is partial (resolved structural components exist); the blocked internal component is captured in FSR-001 at ELIGIBILITY-3.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-007

| Directive Field | Value |
|---|---|
| Directive ID | DIR-007 |
| Source FSR | FSR-007 |
| FSR signal type | recurrent_dependency |
| Eligibility class | ELIGIBILITY-3 (critical_block) |
| Triggering condition | FSR-007 identifies AT-007 (validation gate enforcement count per run) as a recurring dependency gap across 5 delivery elements; AT-007 absence causes partial or blocked coverage in DIAG-003, DIAG-006, DIAG-007, INTEL-002, INTEL-003; AT-007 blocking role in SIG-006 propagates to SIG-007 and the ESI stability component; coverage states range from partial (DIAG-003, DIAG-007, INTEL-002, INTEL-003) to blocked (DIAG-006); blocked component takes precedence for classification |
| Dependency reference | AT-007 → SIG-001 (pending, DIAG-003), SIG-006 (blocked, DIAG-006), SIG-007 via SIG-006 (DIAG-007), INTEL-002, INTEL-003 |
| Permitted action type | ACT-03 (request_pipeline_activation) |

**Action type basis:** ELIGIBILITY-3 + dependency type = event-based → ACT-03. AT-007 is an event-based per-run metric requiring live pipeline execution.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-008

| Directive Field | Value |
|---|---|
| Directive ID | DIR-008 |
| Source FSR | FSR-008 |
| FSR signal type | recurrent_dependency |
| Eligibility class | ELIGIBILITY-3 (critical_block) |
| Triggering condition | FSR-008 identifies DT-007 (pipeline run completion status) as a recurring dependency gap across 5 delivery elements; DT-007 absence causes partial or blocked coverage in DIAG-004, DIAG-006, DIAG-007, INTEL-002, INTEL-003; DT-007 blocking role in SIG-006 propagates to the ESI stability component; coverage states range from partial (DIAG-004, DIAG-007, INTEL-002, INTEL-003) to blocked (DIAG-006); blocked component takes precedence for classification |
| Dependency reference | DT-007 → SIG-005 (pending, DIAG-004), SIG-006 (blocked, DIAG-006), SIG-007 via SIG-006 (DIAG-007), INTEL-002, INTEL-003 |
| Permitted action type | ACT-03 (request_pipeline_activation) |

**Action type basis:** ELIGIBILITY-3 + dependency type = event-based → ACT-03. DT-007 is an event-based per-run metric requiring live pipeline execution.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## Control Directive Summary

| Directive ID | Source FSR | Eligibility Class | Action Type | Dependency Type |
|---|---|---|---|---|
| DIR-001 | FSR-001 | ELIGIBILITY-3 | ACT-02 | time-series |
| DIR-002 | FSR-002 | ELIGIBILITY-3 | ACT-03 | event-based |
| DIR-003 | FSR-003 | ELIGIBILITY-1 | ACT-01 | event-based |
| DIR-004 | FSR-004 | ELIGIBILITY-1 | ACT-01 | event-based |
| DIR-005 | FSR-005 | ELIGIBILITY-1 | ACT-01 | event-based |
| DIR-006 | FSR-006 | ELIGIBILITY-1 | ACT-01 | time-series |
| DIR-007 | FSR-007 | ELIGIBILITY-3 | ACT-03 | event-based |
| DIR-008 | FSR-008 | ELIGIBILITY-3 | ACT-03 | event-based |

**Total directives issued: 8**
**ELIGIBILITY-3 directives: 4 (DIR-001, DIR-002, DIR-007, DIR-008)**
**ELIGIBILITY-1 directives: 4 (DIR-003, DIR-004, DIR-005, DIR-006)**
**ELIGIBILITY-2 directives: 0**
**ELIGIBILITY-0 directives: 0**
**All directives: declarative, bounded, non-executing; no recommendation, no prioritization, no scoring**
