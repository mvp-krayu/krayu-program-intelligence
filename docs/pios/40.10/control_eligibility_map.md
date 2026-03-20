# Control Eligibility Map
run_id: run_01_blueedge
stream: Stream 40.10 — PiOS Agentic Orchestration and Runtime Control Layer
contract: PIOS-40.10-RUN01-CONTRACT-v1
comparison_run_set: run_00_baseline, run_01_blueedge
input_source: docs/pios/40.9/feedback_signal_registry.md
date: 2026-03-19

---

## Eligibility Classification Rule

Each FSR is assigned exactly one eligibility class. Classification inputs are limited to:
- coverage_state (from FSR)
- recurrence_flag (from FSR)
- dependency_chain presence (from FSR)
- unknown_space presence (from FSR)

Classification conditions are evaluated in strict precedence order (highest to lowest). The first matching condition is applied.

**Precedence order:**

| Rank | Class | Condition |
|------|-------|-----------|
| 1 (highest) | ELIGIBILITY-3 — critical_block | coverage_state = blocked AND recurrence = yes AND multi-signal dependency propagation observed |
| 2 | ELIGIBILITY-2 — escalation_candidate | coverage_state = blocked AND recurrence = yes |
| 3 | ELIGIBILITY-1 — observation_only | coverage_state = partial OR recurrence present without blocking dependency |
| 4 (lowest) | ELIGIBILITY-0 — no_action | coverage_state = computed AND no recurrence AND no blocking dependency |

**Classification boundary rule (blocked without recurrence):**

Signals with coverage_state = blocked and recurrence_flag = no that do not satisfy ELIGIBILITY-2 or ELIGIBILITY-3 (no recurrence present) are assigned ELIGIBILITY-1 (observation_only) as the minimum applicable non-zero eligibility class. ELIGIBILITY-0 requires coverage_state = computed; since blocked signals are not computed, they cannot be classified ELIGIBILITY-0. ELIGIBILITY-1 is the applicable floor for all non-computed, non-recurrent signals with active blocking dependencies.

**Action type mapping (explicitly declared — deterministic):**

| Eligibility Class | Signal Type | Permitted Action Type |
|------------------|------------|----------------------|
| ELIGIBILITY-0 | any | ACT-05 (no_action) |
| ELIGIBILITY-1 | unknown_space | ACT-02 (request_observability_extension) |
| ELIGIBILITY-1 | partial_coverage | ACT-01 (request_evidence_extension) |
| ELIGIBILITY-2 | any | ACT-03 (request_pipeline_activation) |
| ELIGIBILITY-3 | any | ACT-04 (register_governance_review) |

This mapping is deterministic: given eligibility class and signal type, exactly one action type is assigned. No implicit, adaptive, or context-dependent mapping is applied.

**Constraints:**
- No FSR may be assigned multiple eligibility classes
- Classification is deterministic and reproducible from FSR attributes alone
- No scoring, no weighting, no prioritization, no cross-run interpretation

---

## FSR Eligibility Classification

### FSR-001 — Change Concentration Unknown Space (run_00_baseline)

| Classification Field | Value |
|---------------------|-------|
| Source FSR | FSR-001 |
| Run reference | run_00_baseline |
| Coverage state | blocked |
| Recurrence flag | no — cross-run governed recurrence not established (see recurrence_detection_report.md) |
| Unknown space present | yes — USR-001 |
| Dependency chain present | yes — AT-001, AT-002 (time-series) |
| ELIGIBILITY-3 check | FAIL — recurrence = no |
| ELIGIBILITY-2 check | FAIL — recurrence = no |
| ELIGIBILITY-1 check | FAIL — not partial; no recurrence-without-blocking; classification boundary rule applies |
| ELIGIBILITY-0 check | FAIL — not computed |
| Classification boundary rule applied | yes — blocked + no recurrence → ELIGIBILITY-1 (minimum applicable class) |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Action type | ACT-02 (request_observability_extension) — ELIGIBILITY-1 + unknown_space |

---

### FSR-002 — Execution Stability Unknown Space (run_00_baseline)

| Classification Field | Value |
|---------------------|-------|
| Source FSR | FSR-002 |
| Run reference | run_00_baseline |
| Coverage state | blocked |
| Recurrence flag | no — cross-run governed recurrence not established (DIAG-006 coverage states differ across runs) |
| Unknown space present | yes — USR-002 |
| Dependency chain present | yes — DT-007, AT-007 (event-based) |
| ELIGIBILITY-3 check | FAIL — recurrence = no |
| ELIGIBILITY-2 check | FAIL — recurrence = no |
| ELIGIBILITY-1 check | FAIL — not partial; no recurrence-without-blocking; classification boundary rule applies |
| ELIGIBILITY-0 check | FAIL — not computed |
| Classification boundary rule applied | yes — blocked + no recurrence → ELIGIBILITY-1 (minimum applicable class) |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Action type | ACT-02 (request_observability_extension) — ELIGIBILITY-1 + unknown_space |

---

### FSR-003 — Execution Pipeline Readiness Partial Coverage (run_00_baseline)

| Classification Field | Value |
|---------------------|-------|
| Source FSR | FSR-003 |
| Run reference | run_00_baseline |
| Coverage state | partial |
| Recurrence flag | no — INTEL-002 partial in run_00, blocked in run_01; cross-run governed recurrence not established |
| Unknown space present | no |
| Dependency chain present | yes — AT-005, AT-007 (event-based, pending) |
| ELIGIBILITY-3 check | FAIL — recurrence = no |
| ELIGIBILITY-2 check | FAIL — recurrence = no |
| ELIGIBILITY-1 check | PASS — coverage_state = partial satisfies ELIGIBILITY-1 condition |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Action type | ACT-01 (request_evidence_extension) — ELIGIBILITY-1 + partial_coverage |

---

### FSR-004 — Composite Execution Health State Partial Coverage (run_00_baseline)

| Classification Field | Value |
|---------------------|-------|
| Source FSR | FSR-004 |
| Run reference | run_00_baseline |
| Coverage state | partial |
| Recurrence flag | no — INTEL-003 absent in run_01; cross-run comparison not established |
| Unknown space present | no |
| Dependency chain present | yes — DT-007, AT-006 (event-based) |
| ELIGIBILITY-3 check | FAIL — recurrence = no |
| ELIGIBILITY-2 check | FAIL — recurrence = no |
| ELIGIBILITY-1 check | PASS — coverage_state = partial satisfies ELIGIBILITY-1 condition |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Action type | ACT-01 (request_evidence_extension) — ELIGIBILITY-1 + partial_coverage |

---

### FSR-005 — Risk Profile State Partial Coverage (run_00_baseline)

| Classification Field | Value |
|---------------------|-------|
| Source FSR | FSR-005 |
| Run reference | run_00_baseline |
| Coverage state | partial |
| Recurrence flag | no — INTEL-004 absent in run_01; cross-run comparison not established |
| Unknown space present | no |
| Dependency chain present | yes — DT-007, AT-007 (via SIG-006, time-series component AT-001/AT-002) |
| ELIGIBILITY-3 check | FAIL — recurrence = no |
| ELIGIBILITY-2 check | FAIL — recurrence = no |
| ELIGIBILITY-1 check | PASS — coverage_state = partial satisfies ELIGIBILITY-1 condition |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Action type | ACT-01 (request_evidence_extension) — ELIGIBILITY-1 + partial_coverage |

---

### FSR-006 — Platform Runtime Unknown Space (run_01_blueedge)

| Classification Field | Value |
|---------------------|-------|
| Source FSR | FSR-006 |
| Run reference | run_01_blueedge |
| Coverage state | blocked |
| Recurrence flag | no — INTEL-002 partial in run_00, blocked in run_01; cross-run governed recurrence not established |
| Unknown space present | yes — USR-003 through USR-009 (7 dimensions) |
| Dependency chain present | yes — INF-003 Prometheus (TMP-004), fleet:* WebSocket (BM-062), TMP-003+TMP-010, TMP-010 |
| ELIGIBILITY-3 check | FAIL — recurrence = no |
| ELIGIBILITY-2 check | FAIL — recurrence = no |
| ELIGIBILITY-1 check | FAIL — not partial; no recurrence-without-blocking; classification boundary rule applies |
| ELIGIBILITY-0 check | FAIL — not computed |
| Classification boundary rule applied | yes — blocked + no recurrence → ELIGIBILITY-1 (minimum applicable class) |
| Eligibility class | ELIGIBILITY-1 |
| Eligibility class label | observation_only |
| Action type | ACT-02 (request_observability_extension) — ELIGIBILITY-1 + unknown_space |

---

## Eligibility Classification Summary

| FSR ID | Run Reference | Signal Type | Coverage State | Recurrent | Eligibility Class | Action Type |
|--------|--------------|-------------|----------------|-----------|------------------|-------------|
| FSR-001 | run_00_baseline | unknown_space | blocked | no | ELIGIBILITY-1 | ACT-02 |
| FSR-002 | run_00_baseline | unknown_space | blocked | no | ELIGIBILITY-1 | ACT-02 |
| FSR-003 | run_00_baseline | partial_coverage | partial | no | ELIGIBILITY-1 | ACT-01 |
| FSR-004 | run_00_baseline | partial_coverage | partial | no | ELIGIBILITY-1 | ACT-01 |
| FSR-005 | run_00_baseline | partial_coverage | partial | no | ELIGIBILITY-1 | ACT-01 |
| FSR-006 | run_01_blueedge | unknown_space | blocked | no | ELIGIBILITY-1 | ACT-02 |

**ELIGIBILITY-3 count: 0**
**ELIGIBILITY-2 count: 0**
**ELIGIBILITY-1 count: 6 (FSR-001 through FSR-006)**
**ELIGIBILITY-0 count: 0**

**Classification basis:** No FSR has recurrence_flag = yes. ELIGIBILITY-2 and ELIGIBILITY-3 both require recurrence present. FSR-003, FSR-004, FSR-005 are classified ELIGIBILITY-1 via the primary partial coverage condition. FSR-001, FSR-002, FSR-006 are classified ELIGIBILITY-1 via the classification boundary rule (blocked without recurrence → minimum non-zero eligibility class).

**No cross-run interpretation applied.** Eligibility classification is derived from individual FSR attributes only. Cross-run differences are not used as classification inputs. Runs are treated symmetrically.
