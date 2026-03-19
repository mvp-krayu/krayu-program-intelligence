# Diagnosis Output Set

**Stream:** 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
**Input:** docs/pios/40.7/diagnosis_input_matrix.md, docs/pios/40.6/condition_output_set.md
**Governing model:** Stream 75.2 — Program Diagnosis Model
**Date:** 2026-03-18

---

## Output Rule

This document records the diagnosis output for each governed diagnosis dimension. Where all required condition inputs are evaluable, the diagnosis is computed deterministically by applying Stream 75.2 — Program Diagnosis Model. Where inputs are partial, a partial diagnosis is produced from available components. Where inputs are blocked, the diagnosis dimension is declared blocked with explicit reason. No diagnosis value is fabricated, inferred, or estimated. No recommendation, prognosis, or remediation content is produced.

---

## DIAG-001 — Structural Dependency Characterization

| Field | Value |
|---|---|
| Diagnosis ID | DIAG-001 |
| Source Condition | COND-001 (Dependency Load Elevation) |
| CKR References | CKR-005, CKR-007 |
| Temporal Reference | static (inherited from COND-001 → SIG-002) |
| Coverage State | computed |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Diagnosis Inputs Applied:**

| Dimension | Value |
|---|---|
| Dependency load ratio | 0.682 |
| Dependency edge count | 15 |
| PEG node count | 22 |
| Pipeline edges | 7 |
| Model activation edges | 3 |
| Governance edges | 2 |
| External constraint edges | 3 |

**Diagnosis Output (per Stream 75.2):**

| Diagnosis Field | Result |
|---|---|
| Dependency coupling classification | ELEVATED — ratio 0.682 indicates 68.2% of PEG nodes participate in tracked dependency relationships |
| Edge composition profile | Pipeline-dominant: 46.7% pipeline (7/15); 20.0% model activation (3/15); 13.3% governance (2/15); 20.0% external constraint (3/15) |
| Structural coupling pattern | Networked dependency pattern; non-trivial inter-component binding at pipeline and model activation layers |
| Diagnosis classification | ELEVATED_DEPENDENCY_LOAD |
| Confidence | HIGH — derived from complete static signal |

**Diagnosis state: COMPUTED**

---

## DIAG-002 — Structural Volatility Characterization

| Field | Value |
|---|---|
| Diagnosis ID | DIAG-002 |
| Source Condition | COND-002 (Structural Volatility State) |
| CKR References | CKR-005, CKR-009 |
| Temporal Reference | static (inherited from COND-002 → SIG-004) |
| Coverage State | computed |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Diagnosis Inputs Applied:**

| Dimension | Value |
|---|---|
| Edge-to-node ratio | 1.273 |
| Containment density ratio | 0.545 |
| Responsibility distribution | 0.364 |
| Module surface ratio | 0.455 |
| PEG total edges | 28 |
| PEG total nodes | 22 |
| ARZ count | 8 |

**Diagnosis Output (per Stream 75.2):**

| Diagnosis Field | Result |
|---|---|
| Topology classification | NETWORKED — edge-to-node ratio 1.273 (>1.0) confirms more connections than nodes; non-tree execution graph |
| Containment profile | MODERATE_HIERARCHY — 12 containment edges for 22 nodes; 0.545 density indicates partial hierarchical embedding |
| Responsibility partitioning | DISTRIBUTED — 8 ARZs across 22 nodes; average 2.75 nodes per zone |
| Module exposure profile | HIGH_SURFACE — 0.455 of PEG nodes are module-level entry points (10 of 22) |
| Structural volatility pattern | Dense, networked architecture with moderate containment and distributed ownership |
| Diagnosis classification | ELEVATED_STRUCTURAL_COUPLING with DISTRIBUTED_RESPONSIBILITY |
| Confidence | HIGH — derived from complete static signal |

**Diagnosis state: COMPUTED**

---

## DIAG-003 — Coordination Pressure Characterization

| Field | Value |
|---|---|
| Diagnosis ID | DIAG-003 |
| Source Condition | COND-003 (Coordination Pressure Active) |
| CKR References | CKR-005, CKR-006 |
| Temporal Reference | static + event-based (inherited from COND-003 → SIG-001) |
| Coverage State | partial |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Resolved Diagnosis Inputs:**

| Dimension | Value |
|---|---|
| Structural coordination ratio | 0.875 |
| Pipeline stages coordinated | 7 of 8 |

**Pending Diagnosis Inputs:**

| Dimension | Required Telemetry | State |
|---|---|---|
| Runtime coordination events per run | AT-005, AT-007 | pending live telemetry |

**Partial Diagnosis Output (per Stream 75.2 — static component):**

| Diagnosis Field | Result |
|---|---|
| Structural coordination classification | NEAR_MAXIMAL — 7 of 8 pipeline coordination points engaged; structural ratio 0.875 indicates high pipeline coupling commitment |
| Runtime coordination characterization | PENDING — event-based component requires AT-005 (pipeline module execution count per run) and AT-007 (validation gate enforcement per run) |
| Full diagnosis classification | PENDING — full coordination pressure characterization requires complete SIG-001 |
| Confidence | PARTIAL — static structural component only |

**Diagnosis state: PARTIAL**

---

## DIAG-004 — Throughput Profile Characterization

| Field | Value |
|---|---|
| Diagnosis ID | DIAG-004 |
| Source Condition | COND-004 (Throughput Degradation Risk) |
| CKR References | CKR-005, CKR-010 |
| Temporal Reference | event-based (inherited from COND-004 → SIG-005) |
| Coverage State | partial |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Resolved Diagnosis Inputs:**

| Dimension | Value |
|---|---|
| Stage throughput per run | 8 stages/run |
| Total artifacts per run | 9 artifacts/run |
| Internal delivery per run | 5 artifacts/run |
| Intelligence output per run | 4 artifacts/run |

**Pending Diagnosis Inputs:**

| Dimension | Required Telemetry | State |
|---|---|---|
| Completion factor | DT-007 | pending live telemetry |
| Execution mode context | AT-006 | pending live telemetry |

**Partial Diagnosis Output (per Stream 75.2 — declared constant component):**

| Diagnosis Field | Result |
|---|---|
| Baseline throughput profile | ESTABLISHED — 8 pipeline stages with 9 artifacts per run represents the fixed structural throughput capacity |
| Delivery composition | Internal delivery dominant: 5 reconstruction artifacts + 4 intelligence outputs per run |
| Completion-conditioned rate | PENDING — DT-007 (pipeline run completion boolean) required to characterize throughput degradation vs. baseline |
| Full diagnosis classification | PENDING — full throughput risk profile requires completion factor and execution mode |
| Confidence | PARTIAL — fixed-capacity constants only |

**Diagnosis state: PARTIAL**

---

## DIAG-005 — Change Concentration Characterization

| Field | Value |
|---|---|
| Diagnosis ID | DIAG-005 |
| Source Condition | COND-005 (Change Concentration Accumulation) |
| CKR References | CKR-005, CKR-008 |
| Temporal Reference | time-series (inherited from COND-005 → SIG-003) |
| Coverage State | blocked |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Blocked Inputs:**

| Dimension | Blocking Reason |
|---|---|
| Change event rate | SIG-003 blocked: AT-001 (automation trigger frequency) and AT-002 (auto-commit event frequency) are time-series metrics not present in static 40.4 inputs |
| Per-event concentration | SIG-003 blocked: dependent on AT-001 time-series accumulation |

**Diagnosis Output:** BLOCKED — no diagnosis produced. Change concentration program state is unknown. No fabrication. No inference. No approximation.

**Diagnosis state: BLOCKED**

---

## DIAG-006 — Execution Stability Characterization

| Field | Value |
|---|---|
| Diagnosis ID | DIAG-006 |
| Source Condition | COND-006 (Execution Instability) |
| CKR References | CKR-005, CKR-011 |
| Temporal Reference | event-based (inherited from COND-006 → SIG-006) |
| Coverage State | blocked |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Blocked Inputs:**

| Dimension | Blocking Reason |
|---|---|
| Per-run stability | SIG-006 blocked: DT-007 requires live pipeline execution records |
| Gate enforcement rate | SIG-006 blocked: AT-007 requires live pipeline execution records |
| Feedback closure rate | SIG-006 blocked: AT-009, DT-008 require live pipeline execution records |

**Diagnosis Output:** BLOCKED — no diagnosis produced. Execution stability program state is unknown. No fabrication. No inference. No approximation.

**Diagnosis state: BLOCKED**

---

## DIAG-007 — Execution Health Index Characterization

| Field | Value |
|---|---|
| Diagnosis ID | DIAG-007 |
| Source Condition | COND-007 (Execution Health Deficit) |
| CKR References | CKR-005, CKR-014 |
| Temporal Reference | event-based (inherited from COND-007 → SIG-007) |
| Coverage State | partial |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Resolved Diagnosis Inputs:**

| Dimension | Source | Value |
|---|---|---|
| ESI Dependency Load component | SIG-002 via COND-007 | ratio: 0.682 |
| ESI Throughput constants | SIG-005 via COND-007 | 8 stages, 9 artifacts/run |

**Pending Diagnosis Inputs:**

| Dimension | Source | State |
|---|---|---|
| ESI Execution Stability component | SIG-006 via COND-007 | blocked |
| ESI Throughput completion factor | SIG-005 via COND-007 | pending DT-007 |

**Partial Diagnosis Output (per Stream 75.2):**

| Diagnosis Field | Result |
|---|---|
| Dependency load health contribution | CHARACTERIZED — dependency ratio 0.682 establishes structural load component of ESI |
| Throughput health contribution | PARTIAL_CONSTANTS — fixed capacity profile (8 stages, 9 artifacts/run) available; completion-conditioned rate pending |
| Stability health contribution | UNAVAILABLE — SIG-006 blocked |
| Full ESI health characterization | PENDING — requires all three ESI component signals |
| Diagnosis classification | PARTIAL_EXECUTION_HEALTH_PROFILE |
| Confidence | PARTIAL |

**Diagnosis state: PARTIAL**

---

## DIAG-008 — Risk Acceleration Characterization

| Field | Value |
|---|---|
| Diagnosis ID | DIAG-008 |
| Source Condition | COND-008 (Risk Acceleration State) |
| CKR References | CKR-005, CKR-015 |
| Temporal Reference | time-series (inherited from COND-008 → SIG-008) |
| Coverage State | partial |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Resolved Diagnosis Inputs:**

| Dimension | Source | Value |
|---|---|---|
| RAG Structural Volatility component | SIG-004 via COND-008 | edge-to-node: 1.273; containment: 0.545; responsibility: 0.364; module: 0.455 |
| RAG Coordination Pressure structural | SIG-001 via COND-008 | structural ratio: 0.875 |

**Pending Diagnosis Inputs:**

| Dimension | Source | State |
|---|---|---|
| RAG Change Concentration component | SIG-003 via COND-008 | blocked |
| RAG Coordination Pressure runtime | SIG-001 runtime component | pending AT-005, AT-007 |

**Partial Diagnosis Output (per Stream 75.2):**

| Diagnosis Field | Result |
|---|---|
| Structural volatility risk contribution | CHARACTERIZED — dense networked topology (1.273 edge-to-node) and high module surface (0.455) contribute to structural risk dimension |
| Coordination pressure risk contribution | PARTIAL — structural near-maximal coordination (0.875) contributes to static risk dimension; runtime dimension pending |
| Change concentration risk contribution | UNAVAILABLE — SIG-003 blocked; time-series accumulation dimension of risk gradient missing |
| Full risk gradient computation | PENDING — cannot compute gradient across successive intervals without SIG-003 time-series data |
| Diagnosis classification | PARTIAL_RISK_PROFILE — structural dimensions characterized; temporal gradient dimension unavailable |
| Confidence | PARTIAL |

**Diagnosis state: PARTIAL**

---

## Diagnosis Output Summary

| Diagnosis ID | Source Condition | CKR | Temporal | State | Available Output |
|---|---|---|---|---|---|
| DIAG-001 | COND-001 | CKR-007 | static | computed | ELEVATED_DEPENDENCY_LOAD; ratio 0.682; edges 15 |
| DIAG-002 | COND-002 | CKR-009 | static | computed | ELEVATED_STRUCTURAL_COUPLING; ratios 1.273/0.545/0.364/0.455 |
| DIAG-003 | COND-003 | CKR-006 | static + event-based | partial | NEAR_MAXIMAL coordination structural (0.875); runtime pending |
| DIAG-004 | COND-004 | CKR-010 | event-based | partial | BASELINE_THROUGHPUT_PROFILE (8 stages, 9 artifacts/run); completion pending |
| DIAG-005 | COND-005 | CKR-008 | time-series | blocked | — |
| DIAG-006 | COND-006 | CKR-011 | event-based | blocked | — |
| DIAG-007 | COND-007 | CKR-014 | event-based | partial | PARTIAL_EXECUTION_HEALTH_PROFILE; dependency component 0.682 |
| DIAG-008 | COND-008 | CKR-015 | time-series | partial | PARTIAL_RISK_PROFILE; structural volatility characterized |

**Computed: 2 | Partial: 4 | Blocked: 2**
**All outputs: no recommendation, no prognosis, no remediation content attached**
