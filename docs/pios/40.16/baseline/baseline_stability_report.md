# Baseline Stability Report

**Baseline:** PiOS Core Baseline 0.1
**Run ID:** run_40_4_primary
**Input source:** docs/pios/40.4/ (primary path)
**Validation script:** scripts/pios/40.16/validate_baseline.py
**Date:** 2026-04-01

---

## Methodology

Each run executes:
1. `run_esi_derivation.py` (40.4 primary path)
2. `run_rag_derivation.py`
3. Value-level comparison against `docs/pios/40.16/baseline/` reference artifacts

Two hash columns are reported:

| Hash Type | Definition |
|---|---|
| Raw | SHA-256 of file as written to disk (includes `generated` timestamp) |
| Canonical | SHA-256 after stripping `generated` / `**Generated:**` timestamp fields |

Raw hashes vary across runs because `generated` timestamps change per execution.
Canonical hashes are the determinism signal — they must be identical across all runs.

---

## Run Results

| Run | Validation | esi_manifest.json (canonical) | rag_output_set.md (canonical) |
|---|---|---|---|
| 1 | PASS | f41c30278756c31c | 2fbc2db1608e24d2 |
| 2 | PASS | f41c30278756c31c | 2fbc2db1608e24d2 |
| 3 | PASS | f41c30278756c31c | 2fbc2db1608e24d2 |
| 4 | PASS | f41c30278756c31c | 2fbc2db1608e24d2 |
| 5 | PASS | f41c30278756c31c | 2fbc2db1608e24d2 |

---

## Hash Consistency

| Artifact | Unique canonical hashes observed | Consistent |
|---|---|---|
| esi_manifest.json | 1 (`f41c30278756c31c`) | yes |
| rag_output_set.md | 1 (`2fbc2db1608e24d2`) | yes |

Raw hashes observed: 2 distinct values for each artifact across 5 runs.
Cause: `generated` timestamp field crosses second boundary between runs.
This is expected and correct — raw hash instability does not indicate logical instability.

---

## Verdict

**STABLE**

All 5 runs PASS value-level baseline comparison.
Canonical hashes are identical across all runs.
Derivation from docs/pios/40.4/ is fully deterministic given static 40.4 inputs.
