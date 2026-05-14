# PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01

## Purpose

This folder contains the planning structure for second-client execution. It defines how the
PiOS system will be run for a new client environment without inheriting, mutating, or reusing
any BlueEdge artifacts.

## Hard constraints

- DO NOT modify `clients/blueedge/`
- DO NOT modify `docs/baseline/pios_baseline_v1.0.md` except by explicit amendment
- CREATE_ONLY until execution phase
- Evidence First throughout
- Fail closed on any ambiguity

## Baseline reference

- Git tag: `pios-baseline-v1.0-blueedge-authoritative`
- Capsule: `docs/baseline/pios_baseline_v1.0.md`
- Reference run: `clients/blueedge/psee/runs/run_authoritative_recomputed_01/`

## Execution Scope

This is an end-to-end second-client productization validation. The scope is:

**PiOS → GAUGE → LENS → sellable projection**

PiOS execution alone is insufficient. The run must validate:
- PiOS S0–S4 pipeline on second-client evidence
- GAUGE state generation from second-client artifacts
- LENS projection portability — no BlueEdge wording, paths, labels, or assumptions
- A sellable, executive-readable artifact produced from new client evidence

RBAC and audit-log attachment points are architecture requirements captured in this planning phase. They are not implemented in this run but must be documented before productization is considered complete.

## Contents

| File | Purpose |
|---|---|
| README.md | This file |
| execution_contract.md | Governing contract for second-client execution |
| baseline_comparison_plan.md | How to compare second-client run against baseline |
| brain_emission_plan.md | Expected outputs for all four brain domains |
| validation_matrix.md | Pass/fail criteria for execution readiness |
| lens_projection_portability_plan.md | LENS projection portability checks and verdict rule |
| security_audit_architecture_plan.md | RBAC/audit attachment points — architecture requirement |

## Status

PLANNING — no execution has occurred
