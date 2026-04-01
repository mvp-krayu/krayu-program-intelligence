# Input Contract Freeze

**Baseline ID:** pios_core_40.16_baseline_0.1
**Input Contract ID:** pios_core_40.16_input_contract_0.1
**Frozen:** 2026-04-01
**Input reference:** docs/pios/40.4/

---

## Frozen Input Artifacts

| Artifact | SHA-256 (first 16) |
|---|---|
| docs/pios/40.4/telemetry_surface_definition.md | 26acc9202142d1de |
| docs/pios/40.4/telemetry_schema.md | f6f93ce64a53877e |
| docs/pios/40.4/structural_telemetry.md | 755777c7d64de930 |
| docs/pios/40.4/activity_telemetry.md | 7605fb52e647c40d |
| docs/pios/40.4/delivery_telemetry.md | 2bfe468c09479a7c |
| docs/pios/40.4/telemetry_traceability_map.md | 2b896017df1b7068 |

Full hashes recorded in: docs/pios/40.16/baseline/input_contract_lock.json

---

## Rules

1. Baseline 0.1 (`pios_core_40.16_baseline_0.1`) is valid only against this frozen input set.
2. Any upstream change to the 6 artifacts listed above invalidates Baseline 0.1 and requires new baseline generation.
3. 40.4 artifacts are read-only. No 40.16 script may write to docs/pios/40.4/.
4. Re-execution claiming baseline equivalence must be validated against both `baseline_identity_lock.json` and `input_contract_lock.json`.
