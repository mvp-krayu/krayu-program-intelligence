# Control Surface Classification
run_id: run_01_blueedge
stream: Stream 40.11 — PiOS Loop Closure and Governance Review
contract: PIOS-40.11-RUN01-CONTRACT-v1
comparison_run_set: run_00_baseline, run_01_blueedge
input_source: docs/pios/40.10/control_eligibility_map.md, docs/pios/40.10/execution_manifest.md
date: 2026-03-19

---

## Classification Rule

The control surface produced by Stream 40.10 is classified using the following deterministic conditions applied in strict precedence order:

| Class | Label | Condition |
|-------|-------|-----------|
| CONTROL-SURFACE-C | critical-block-dominant | ELIGIBILITY-3 present |
| CONTROL-SURFACE-B | escalation-capable | ELIGIBILITY-2 present |
| CONTROL-SURFACE-A | observation-only | only ELIGIBILITY-1 and/or ELIGIBILITY-0 present |

Classification is structural only. No interpretation of system quality is produced. No recommendation is generated.

---

## Eligibility Presence Check

| Eligibility Class | Count in 40.10 Output | Present |
|-----------------|----------------------|---------|
| ELIGIBILITY-3 (critical_block) | 0 | no |
| ELIGIBILITY-2 (escalation_candidate) | 0 | no |
| ELIGIBILITY-1 (observation_only) | 6 | yes |
| ELIGIBILITY-0 (no_action) | 0 | no |

**Source:** docs/pios/40.10/execution_manifest.md §Eligibility Distribution Summary

---

## Classification Evaluation

| Check | Condition | Result |
|-------|-----------|--------|
| CONTROL-SURFACE-C | ELIGIBILITY-3 present | FAIL — ELIGIBILITY-3 count = 0 |
| CONTROL-SURFACE-B | ELIGIBILITY-2 present | FAIL — ELIGIBILITY-2 count = 0 |
| CONTROL-SURFACE-A | only ELIGIBILITY-1 and/or ELIGIBILITY-0 present | PASS — ELIGIBILITY-1 × 6, ELIGIBILITY-0 × 0 |

**Classification result: CONTROL-SURFACE-A (observation-only)**

---

## Control Surface Profile

| Attribute | Value |
|-----------|-------|
| Classification | CONTROL-SURFACE-A |
| Label | observation-only |
| Total directives | 6 |
| Directive composition | ELIGIBILITY-1 × 6 |
| Action type composition | ACT-01 × 3 (request_evidence_extension), ACT-02 × 3 (request_observability_extension) |
| Escalation directives | 0 |
| Critical-block directives | 0 |
| Execution required by any directive | no — all directives are declarative and non-executing |

---

## Run Attribution

| Run | Directives | Count |
|-----|-----------|-------|
| run_00_baseline | DIR-001, DIR-002, DIR-003, DIR-004, DIR-005 | 5 |
| run_01_blueedge | DIR-006 | 1 |

Both runs contribute to the control surface. Runs are treated symmetrically. No run is designated as reference truth.

---

## Classification Basis Declaration

The CONTROL-SURFACE-A classification is based exclusively on the eligibility distribution from docs/pios/40.10/control_eligibility_map.md and execution_manifest.md. No interpretation of why ELIGIBILITY-2 or ELIGIBILITY-3 are absent is produced. No evaluation of whether the control surface is adequate, desirable, or deficient is performed.

**control_surface_classification: CONTROL-SURFACE-A**
