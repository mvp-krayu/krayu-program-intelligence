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

## Contents

| File | Purpose |
|---|---|
| README.md | This file |
| execution_contract.md | Governing contract for second-client execution |
| baseline_comparison_plan.md | How to compare second-client run against baseline |
| brain_emission_plan.md | Expected outputs for all four brain domains |
| validation_matrix.md | Pass/fail criteria for execution readiness |

## Status

PLANNING — no execution has occurred
