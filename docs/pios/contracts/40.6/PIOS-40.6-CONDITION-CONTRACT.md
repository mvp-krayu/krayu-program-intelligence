# PIOS-40.6-CONDITION-CONTRACT

**Contract ID:** PIOS-40.6-CONDITION-CONTRACT
**Stream:** 40.6 — PiOS Condition Activation Engine
**Repository:** krayu-program-intelligence
**Date:** 2026-03-18

---

## Contract Purpose

Govern the execution of Stream 40.6 — PiOS Condition Activation Engine. Define the input boundary, output boundary, transformation rules, constraints, and validation requirements for program condition activation from governed signal inputs. Condition activation is the exclusive authority of this stream, applying Stream 75.1 — Program Condition Model (M-07). Diagnosis remains out of scope.

---

## Input Boundary

All required inputs must exist at the exact paths below before execution may proceed.

| Path |
|---|
| docs/pios/40.5/signal_output_set.md |
| docs/pios/40.5/signal_validation_report.md |
| docs/pios/40.5/signal_traceability_map.md |
| docs/pios/40.5/execution_manifest.md |

**Total required inputs: 4**

---

## Output Boundary

Execution must produce exactly these artifacts:

| Path |
|---|
| docs/pios/40.6/condition_input_matrix.md |
| docs/pios/40.6/condition_activation_specification.md |
| docs/pios/40.6/condition_output_set.md |
| docs/pios/40.6/condition_traceability_map.md |
| docs/pios/40.6/condition_validation_report.md |
| docs/pios/40.6/condition_boundary_enforcement.md |
| docs/pios/40.6/execution_manifest.md |
| scripts/pios/40.6/build_condition_artifacts.py |
| scripts/pios/40.6/validate_condition_artifacts.py |
| docs/pios/contracts/40.6/PIOS-40.6-CONDITION-CONTRACT.md |
| docs/pios/contracts/40.6/PIOS-40.6-CONDITION.execution.md |

---

## Runtime Directories

| Directory |
|---|
| docs/pios/40.6/ |
| scripts/pios/40.6/ |
| docs/pios/contracts/40.6/ |

---

## Governed Condition Definitions

Condition activation is restricted to the following 8 governed conditions only, all under CKR-012 (Program Conditions). Activation logic for all conditions is governed by Stream 75.1 — Program Condition Model.

| Condition ID | Name | CKR | Class | Governing Signal |
|---|---|---|---|---|
| COND-001 | Dependency Load Elevation | CKR-012 | structural | SIG-002 |
| COND-002 | Structural Volatility State | CKR-012 | structural | SIG-004 |
| COND-003 | Coordination Pressure Active | CKR-012 | execution | SIG-001 |
| COND-004 | Throughput Degradation Risk | CKR-012 | execution | SIG-005 |
| COND-005 | Change Concentration Accumulation | CKR-012 | activity | SIG-003 |
| COND-006 | Execution Instability | CKR-012 | execution | SIG-006 |
| COND-007 | Execution Health Deficit | CKR-012 | composite | SIG-007 (ESI) |
| COND-008 | Risk Acceleration State | CKR-012 | composite | SIG-008 (RAG) |

**Governing activation model:** Stream 75.1 — Program Condition Model (applied by M-07).

---

## Transformation Rules

1. Derive conditions only from governed 40.5 signal output artifacts
2. Map every condition input explicitly to governed signals
3. Activate conditions only across the 8 governed condition definitions
4. Inherit temporal reference from governing signal without modification
5. Propagate signal coverage states (complete → evaluable; partial → partial; blocked → blocked)
6. Never elevate a condition coverage state above its least-available signal input
7. Require full traceability from condition to signal to 40.5 source artifact
8. Preserve strict separation: signal ≠ condition ≠ diagnosis ≠ intelligence (GC-07)
9. Do not define threshold values — threshold authority belongs to Stream 75.1
10. Do not introduce diagnosis, interpretation, or narrative

---

## Constraints and Prohibitions

| Prohibited | Rule |
|---|---|
| Telemetry generation | No telemetry produced in this stream |
| Signal generation | No signal artifacts produced in this stream |
| Diagnosis | No diagnostic output |
| Intelligence synthesis | No intelligence artifacts produced |
| Narrative generation | No narrative text in outputs |
| Modification of 40.5 artifacts | 40.5 is read-only |
| Direct access to 40.4 artifacts | Prohibited — consume 40.5 outputs only |
| Direct access to 40.3 artifacts | Prohibited |
| Direct access to 40.2 artifacts | Prohibited |
| Threshold definition | Stream 75.1 authority — not defined in this stream |
| Inferred or reconstructed input data | Prohibited |
| Condition without CKR-012 trace | Every condition must reference CKR-012 |
| Condition without signal trace | Every condition must trace to at least one governed signal |
| Condition without temporal reference | Every condition must inherit temporal reference from governing signal |
| Elevated coverage state | Coverage state may not be elevated above least-available signal input |
| Heuristic enrichment | All activation states derived from signal coverage states only |

---

## Validation Requirements

| Check | Requirement |
|---|---|
| 1. Completeness | All 7 expected condition artifacts exist |
| 2. Condition traceability coverage | Every condition traces to CKR-012 + signal inputs + 40.5 artifact |
| 3. Temporal reference inheritance | Every condition carries a valid inherited temporal reference |
| 4. Boundary compliance | All prohibitions satisfied; no forbidden content in any artifact |
| 5. Coverage propagation correctness | All blocked/partial states correctly inherited from 40.5 signal states |

---

## Decision Logic

| Case | Condition | Action |
|---|---|---|
| A | Input boundary incomplete | Stop; do not generate; final status = INCOMPLETE |
| B | Input boundary complete, validation fails | Generation may occur; artifacts non-final; final status = INCOMPLETE |
| C | Input boundary complete, validation passes, all signals complete | Finalize all artifacts; final status = COMPLETE |
| D | Input boundary complete, some conditions blocked or partial due to upstream signal state | Generate all activatable conditions; declare blocked/partial explicitly; final status = PARTIAL |

---

## Completion State Definitions

| State | Condition |
|---|---|
| COMPLETE | All 8 governed conditions fully evaluated (all signals complete) |
| PARTIAL | Some conditions evaluable or partially evaluable; remaining conditions blocked by upstream signal gaps; no contract violation |
| INCOMPLETE | Execution failure, contract violation, or fabricated/inferred condition activation |

---

## Partial Completion Rules

1. DO NOT fabricate missing conditions
2. DO NOT infer or approximate blocked signal values
3. DO NOT mark COMPLETE if any governed condition is blocked
4. MUST explicitly list in condition_validation_report.md:
   - evaluable conditions (all required signals complete)
   - partial conditions (some signal components available; full evaluation pending)
   - blocked conditions with explicit blocking reason per condition
5. Evidence-First (GC-06) overrides completion targets — missing signal coverage MUST result in PARTIAL, not COMPLETE
6. State–Diagnosis Separation (GC-07) — condition activation state is not diagnosis; no causal attribution produced
7. Coverage cannot be elevated to satisfy completeness pressure
