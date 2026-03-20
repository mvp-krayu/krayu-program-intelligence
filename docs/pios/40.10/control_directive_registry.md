# Control Directive Registry
run_id: run_01_blueedge
stream: Stream 40.10 — PiOS Agentic Orchestration and Runtime Control Layer
contract: PIOS-40.10-RUN01-CONTRACT-v1
comparison_run_set: run_00_baseline, run_01_blueedge
input_source: docs/pios/40.9/feedback_signal_registry.md, docs/pios/40.10/control_eligibility_map.md
date: 2026-03-19

---

## Registry Rule

Each directive is a bounded, declarative, non-executing control output derived from a single FSR. Directives do not recommend, prioritize, rank, score, or execute. No directive modifies intelligence, diagnosis, delivery, or feedback artifacts. Triggering conditions are descriptive only — no causal explanation and no root-cause inference. Run references are preserved per directive. Runs are treated symmetrically — no run is used as reference truth.

---

## DIR-001

| Directive Field | Value |
|----------------|-------|
| Directive ID | DIR-001 |
| Source FSR | FSR-001 |
| Run reference | run_00_baseline |
| FSR signal type | unknown_space |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-001 coverage state is blocked; AT-001 (automation trigger frequency, time-series) and AT-002 (auto-commit event frequency, time-series) are absent from the run_00_baseline 40.4 telemetry input set; SIG-003 (change concentration signal, CKR-008) is uncomputable; DIAG-005 and the change concentration dimension of INTEL-005 are blocked; USR-001 is UNRESOLVED |
| Dependency reference | AT-001, AT-002 → SIG-003 → COND-005 → DIAG-005 → INTEL-005 |
| Permitted action type | ACT-02 (request_observability_extension) |

**Action type basis:** ELIGIBILITY-1 + signal_type = unknown_space → ACT-02. Unknown space dimensions require observability infrastructure to produce the absent time-series telemetry. Action type mapping explicitly declared in control_eligibility_map.md.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-002

| Directive Field | Value |
|----------------|-------|
| Directive ID | DIR-002 |
| Source FSR | FSR-002 |
| Run reference | run_00_baseline |
| FSR signal type | unknown_space |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-002 coverage state is blocked; DT-007 (pipeline run completion status, event-based) and AT-007 (validation gate enforcement count per run, event-based) are absent from the run_00_baseline 40.4 telemetry input set; SIG-006 (execution stability signal, CKR-011) is uncomputable; DIAG-006 and the execution stability dimension of INTEL-005 are blocked; USR-002 is UNRESOLVED |
| Dependency reference | DT-007, AT-007 → SIG-006 → COND-006 → DIAG-006 → INTEL-005 |
| Permitted action type | ACT-02 (request_observability_extension) |

**Action type basis:** ELIGIBILITY-1 + signal_type = unknown_space → ACT-02. Unknown space dimensions require observability infrastructure to produce the absent event-based telemetry. Action type mapping explicitly declared in control_eligibility_map.md.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-003

| Directive Field | Value |
|----------------|-------|
| Directive ID | DIR-003 |
| Source FSR | FSR-003 |
| Run reference | run_00_baseline |
| FSR signal type | partial_coverage |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-003 coverage state is partial; structural coordination ratio (0.875) is resolved; AT-005 (pipeline module execution count per run, event-based) and AT-007 (validation gate enforcement count per run, event-based) are absent from the run_00_baseline 40.4 telemetry input set; SIG-001 (CKR-006) runtime component is unresolved; DIAG-003 and INTEL-002 runtime coordination dimension are partial |
| Dependency reference | AT-005, AT-007 → SIG-001 (runtime component) → COND-003 → DIAG-003, INTEL-002 |
| Permitted action type | ACT-01 (request_evidence_extension) |

**Action type basis:** ELIGIBILITY-1 + signal_type = partial_coverage → ACT-01. Partial coverage with unresolved event-based evidence components. Action type mapping explicitly declared in control_eligibility_map.md.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-004

| Directive Field | Value |
|----------------|-------|
| Directive ID | DIR-004 |
| Source FSR | FSR-004 |
| Run reference | run_00_baseline |
| FSR signal type | partial_coverage |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-004 coverage state is partial; ESI dependency load component (0.682) and throughput constants (8 stages/run, 9 artifacts/run) are resolved; DT-007 (pipeline run completion status, event-based) and AT-006 (pipeline execution mode at runtime, event-based) are absent from the run_00_baseline 40.4 telemetry input set; SIG-005 (CKR-010) completion-conditioned rate is unresolved; DIAG-007 ESI stability component and INTEL-003 ESI stability dimension are partial |
| Dependency reference | DT-007, AT-006 → SIG-005 (completion-conditioned component) → COND-004 → DIAG-004 (via INTEL-003 chain); DT-007, AT-007 → SIG-006 (blocked) → SIG-007 → COND-007 → DIAG-007, INTEL-003 |
| Permitted action type | ACT-01 (request_evidence_extension) |

**Action type basis:** ELIGIBILITY-1 + signal_type = partial_coverage → ACT-01. Partial coverage with unresolved completion-conditioned evidence components. Action type mapping explicitly declared in control_eligibility_map.md.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-005

| Directive Field | Value |
|----------------|-------|
| Directive ID | DIR-005 |
| Source FSR | FSR-005 |
| Run reference | run_00_baseline |
| FSR signal type | partial_coverage |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-005 coverage state is partial; RAG structural volatility (1.273/0.545/0.364/0.455) and RAG structural coordination (0.875) components are resolved; AT-001 (automation trigger frequency, time-series) and AT-002 (auto-commit event frequency, time-series) are absent from the run_00_baseline 40.4 telemetry input set; SIG-003 (CKR-008) change concentration signal is blocked; SIG-003 blocking propagates to SIG-008 (CKR-015); DIAG-008 RAG change concentration component and INTEL-004 change concentration dimension are partial |
| Dependency reference | AT-001, AT-002 → SIG-003 (blocked) → SIG-008 → COND-008 → DIAG-008, INTEL-004 |
| Permitted action type | ACT-01 (request_evidence_extension) |

**Action type basis:** ELIGIBILITY-1 + signal_type = partial_coverage → ACT-01. Partial coverage with blocked time-series evidence component. Action type mapping explicitly declared in control_eligibility_map.md.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## DIR-006

| Directive Field | Value |
|----------------|-------|
| Directive ID | DIR-006 |
| Source FSR | FSR-006 |
| Run reference | run_01_blueedge |
| FSR signal type | unknown_space |
| Eligibility class | ELIGIBILITY-1 (observation_only) |
| Triggering condition | FSR-006 coverage state is blocked; 7 unknown space dimensions are UNRESOLVED (USR-003 through USR-009); INF-003 Prometheus scraper (TMP-004) is not active at time of run_01_blueedge evidence collection; fleet:* WebSocket rooms carry no active connections; alert event flow (TMP-003, TMP-010) and driver session events (TMP-010) are absent; DIAG-001 through DIAG-005, DIAG-007, DIAG-008 are blocked; INTEL-002 is blocked |
| Dependency reference | INF-003 Prometheus (TMP-004) → DIAG-001..004; fleet:* WebSocket (BM-062) → DIAG-005; Alert flow (TMP-003, TMP-010) → DIAG-007; Driver session (TMP-010) → DIAG-008; all → INTEL-002 |
| Permitted action type | ACT-02 (request_observability_extension) |

**Action type basis:** ELIGIBILITY-1 + signal_type = unknown_space → ACT-02. 7 unknown space dimensions require observability infrastructure activation to produce runtime telemetry. Action type mapping explicitly declared in control_eligibility_map.md.

**Directive state: ISSUED — non-executing; downstream consumption only**

---

## Control Directive Summary

| Directive ID | Run Reference | Source FSR | Eligibility Class | Action Type | Signal Type |
|-------------|--------------|-----------|------------------|-------------|-------------|
| DIR-001 | run_00_baseline | FSR-001 | ELIGIBILITY-1 | ACT-02 | unknown_space |
| DIR-002 | run_00_baseline | FSR-002 | ELIGIBILITY-1 | ACT-02 | unknown_space |
| DIR-003 | run_00_baseline | FSR-003 | ELIGIBILITY-1 | ACT-01 | partial_coverage |
| DIR-004 | run_00_baseline | FSR-004 | ELIGIBILITY-1 | ACT-01 | partial_coverage |
| DIR-005 | run_00_baseline | FSR-005 | ELIGIBILITY-1 | ACT-01 | partial_coverage |
| DIR-006 | run_01_blueedge | FSR-006 | ELIGIBILITY-1 | ACT-02 | unknown_space |

**Total directives issued: 6**
**ELIGIBILITY-3 directives: 0**
**ELIGIBILITY-2 directives: 0**
**ELIGIBILITY-1 directives: 6 (DIR-001 through DIR-006)**
**ELIGIBILITY-0 directives: 0**
**ACT-01 directives: 3 (DIR-003, DIR-004, DIR-005) — partial_coverage signals**
**ACT-02 directives: 3 (DIR-001, DIR-002, DIR-006) — unknown_space signals**
**ACT-03 directives: 0**
**ACT-04 directives: 0**
**ACT-05 directives: 0**
**All directives: declarative, bounded, non-executing; no recommendation, no prioritization, no scoring**
**Cross-run neutrality: run_00_baseline and run_01_blueedge treated symmetrically; no run designated as reference truth**
