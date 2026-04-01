# PiOS Core Baseline 0.1

**Baseline ID:** baseline_0.1
**Run ID:** run_40_4_primary
**Frozen:** 2026-04-01
**Input source:** docs/pios/40.4/ (primary path)
**Branch:** feature/pios-core
**Stream:** 40.16 — ESI/RAG Derivation

---

## Baseline Contents

| Artifact | Description |
|---|---|
| esi_manifest.json | ESI derivation output — NF values, PES signals, ESI result |
| rag_output_set.md | RAG derivation output — component values and window status |
| derivation_execution_manifest.md | Full 9-section execution manifest |

## Baseline Values (Frozen)

| Field | Value |
|---|---|
| ESI value | UNDEFINED |
| ESI mode | PARTIAL |
| CG-01 active | yes |
| TC-03 coverage | COVERED (DT-001=4, DT-003=5 → 9/9) |
| NF-04 | 1.0 |
| All other NF | UNDEFINED or 0.5 neutral |
| RAG | INSUFFICIENT_WINDOWS (N=1) |
| window_count | 1 |
| artifacts_expected | 9 |
| gates_defined | 8 |

## Validation Rule

Comparison excludes `generated` / `**Generated:**` / `| Generated |` timestamp fields.
All other values must match exactly.
Governed by: scripts/pios/40.16/validate_baseline.py

## Lock Declaration

This baseline is locked as the reproducible reference for PiOS Core Baseline 0.1.
Modification requires an explicit baseline version increment and a new commit on feature/pios-core.
Do not modify these files in place.
