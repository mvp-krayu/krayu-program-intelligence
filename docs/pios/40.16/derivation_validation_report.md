# Derivation Validation Report

**Stream:** 40.16 — Derivation Validation
**Run ID:** run_40_4_primary
**Generated:** 2026-04-01T10:51:23Z
**Script:** scripts/pios/40.16/validate_manifest.py
**Protocol:** docs/pios/40.16/derivation_validation_protocol.md

---

## Validation Summary

| Field | Value |
|---|---|
| Total Tests | 17 |
| PASS | 17 |
| FAIL | 0 |
| WARN | 0 |
| SKIP | 0 |
| Overall | PASS |

---

## DVT Results

| Test ID | Name | Result | Detail |
|---|---|---|---|
| DVT-01 | Determinism — NF-03 spot check from TC-02 | PASS | W001_40_4_intake: NF-03 determinism check passed (DT-007=None → NF-03=None) |
| DVT-02 | Metric traceability to 40.4 surfaces | PASS | All TC observations reference valid AT/DT metric IDs from 40.4 |
| DVT-03 | Evidence reference completeness — NF chains | PASS | All defined PES signals have complete NF input chains |
| DVT-04 | CG-01 gap declaration and PARTIAL mode | PASS | CG-01 active: PES-ESI-02=UNDEFINED, TC-09=NOT_DEFINED, ESI mode=PARTIAL for all windows |
| DVT-05 | Source agnosticism — no hardcoded paths in TC observations | PASS | TC observation values contain metric IDs and scalars only |
| DVT-06 | NF-02 neutral value enforcement (N<3) | PASS | N=1; NF-02=0.5 (neutral) applied correctly |
| DVT-07 | ESI UNDEFINED propagation in PARTIAL mode | PASS | ESI UNDEFINED/DEFINED status consistent with PARTIAL mode signal availability |
| DVT-08 | PARTIAL mode weight normalization | PASS | PARTIAL weights sum = 1.0000 (correct) |
| DVT-09 | RAG INSUFFICIENT_WINDOWS for N<2 | PASS | rag_output_set.md declares INSUFFICIENT_WINDOWS for N=1 run |
| DVT-10 | NF boundary: all values in [0.0, 1.0] | PASS | All non-UNDEFINED NF values within [0.0, 1.0] |
| DVT-11 | ESI boundary: value in [0, 100] | PASS | All non-UNDEFINED ESI values within [0, 100] |
| DVT-12 | Output artifact existence | PASS | All required artifacts present: esi_output_set.md, rag_output_set.md, derivation_execution_manifest.md, esi_manifest.json |
| DVT-13 | Run ID consistency across artifacts | PASS | run_id=run_40_4_primary present in all output artifacts |
| DVT-14 | Input source declaration | PASS | input_source=40.4: primary path confirmed |

## DA Results (DRIFT-001 Remediation Audit)

| Test ID | Name | Result | Detail |
|---|---|---|---|
| DA-01 | DRIFT-001: no SSZ/SSI in 40.16 scripts | PASS | No SSZ/SSI computation references found in 40.16 scripts |
| DA-02 | DRIFT-001: 40.16 does not reference L6/42.x scope | PASS | No L6/42.x scope references in 40.16 scripts |
| DA-03 | DRIFT-001: derivation inputs from 40.4 only (no L6 signals) | PASS | All TC observations reference 40.4 AT/DT metrics only |
