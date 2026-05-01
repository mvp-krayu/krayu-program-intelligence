# Volatile Field Analysis
## PI.LENS.BLUEEDGE-REPORT-DIFF.01

**Generated:** 2026-05-01

---

## Summary

Volatile field differences contribute to hash divergence but are NOT the primary cause.
The primary cause is DATA_DRIFT (data source mismatch).

---

## Volatile Fields Identified

### 1. `_ACTIVE_VAULT_RUN_ID` in nav links (DECISION_SURFACE only)

| | Value |
|--|--|
| Canonical | `run_01_authoritative_generated` |
| Generated | `run_blueedge_productized_01_fixed` |

**Source:** `_scoped_report_url()` → `runId=` query parameter in all nav links.
**Cause:** Canonical was generated WITHOUT `--run-id` flag (used module-level default `run_01_authoritative_generated`). Generated uses `--run-id run_blueedge_productized_01_fixed`.

**Affected reports:** DECISION_SURFACE only.
**NOT affected:** TIER1_NARRATIVE, TIER1_EVIDENCE — both canonical and generated show `run_blueedge_productized_01_fixed` in nav links.

### 2. Vault run_id field in TIER2_DIAGNOSTIC

| | Value |
|--|--|
| Canonical | `run_blueedge_productized_01` |
| Generated | `run_be_orchestrated_fixup_01` |

**Source:** `_resolve_vault_index_for_graph()` reads `vault_index.json` from app vault for client `blueedge`. This is NOT `_ACTIVE_VAULT_RUN_ID` — it comes from the actual vault_index.json content.
**Cause:** vault_index.json has changed since canonical was generated. At canonical generation time it showed `run_blueedge_productized_01`; now it shows `run_be_orchestrated_fixup_01`.
**Classification:** VOLATILE_METADATA (depends on external state not controlled by CLI flags).

### 3. Graph node coordinates (DECISION_SURFACE canvas)

| | Value |
|--|--|
| Canonical | Fixed xy coordinates (embedded from prior force simulation) |
| Generated | Different xy coordinates (18 nodes, 17 links, 458 ticks) |

**Source:** `export_graph_state.mjs` via Node.js subprocess. Force simulation is non-deterministic.
**Classification:** VOLATILE_METADATA — will never produce byte-identical output on re-run.

---

## Volatile Fields That Do NOT Differ

| Field | Canonical | Generated | Diff? |
|-------|-----------|-----------|-------|
| run_id in tier1 nav links | `run_blueedge_productized_01_fixed` | `run_blueedge_productized_01_fixed` | NO |
| gauge score body text | "60" | "60" | NO |
| decision body text | "INVESTIGATE" | "INVESTIGATE" | NO |
| Generated date/timestamp | none detected | none detected | N/A |

---

## Conclusion

Eliminating all volatile fields would NOT restore hash parity. The dominant differences are DATA_DRIFT: the binding schema, pressure zone presence, and domain coverage counts differ fundamentally between the two data sources. Volatile fields account for isolated lines, not the structural differences that cause the ~37KB file size discrepancy in TIER2_DIAGNOSTIC (71,008 canonical vs 33,579 generated).
