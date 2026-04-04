# IG.1D-R — Re-check Report

**Stream:** IG.1D-R
**Parent:** IG.1
**Layer:** INGESTION
**Status:** COMPLETE
**Date:** 2026-04-04

---

## 1. FILES COMPARED

| Role | Path |
|---|---|
| Baseline entity_telemetry.md | `docs/pios/40.4/entity_telemetry.md` |
| Regenerated entity_telemetry.md | `docs/pios/runs/run_02_blueedge/40.4/entity_telemetry.md` |

---

## 2. CE-003 RE-CHECK RESULT

### Pre-correction state (IG.1D finding DRIFT-001)

| Property | Value |
|---|---|
| Section heading | `CE-003 — Signäl Platform` (wrong) |
| `node_ref` | `N-C03` (fabricated) |
| `telemetry_coverage` | `NONE_EVIDENCED` (wrong) |
| Description | `Downstream consumer of M-08 outputs` (fabricated M-08 reference) |

### Post-correction state (IG.1R applied)

| Property | Baseline | Regenerated (post-correction) | Match |
|---|---|---|---|
| Section heading | `CE-003 — Integrated Platform Monorepo` | `CE-003 — Integrated Platform Monorepo` | MATCH |
| entity field | `entity_ref: CE-003` | `entity_ref: CE-003` | MATCH |
| `node_ref` | *(absent)* | *(absent — removed)* | MATCH |
| `telemetry_coverage` | `INDIRECT` | `INDIRECT` | MATCH |
| Description | `CE-003 contains CE-001 (OVL-01), CE-002 (OVL-02), SA-001, SA-002, INF-003. Telemetry is on the embedded components. No CE-003-specific additional surfaces evidenced beyond overlap components.` | `CE-003 contains CE-001 (OVL-01), CE-002 (OVL-02), SA-001, SA-002, INF-003. Telemetry is on the embedded components. No CE-003-specific additional surfaces evidenced beyond overlap components.` | MATCH |

**CE-003 Re-check Result: PASS — fully equivalent to baseline**

### Residual identifier scan

| Identifier | Present in corrected file |
|---|---|
| N-C03 | NO — CLEAN |
| M-08 | NO — CLEAN |

---

## 3. RESIDUAL DIFFERENCE SUMMARY FOR entity_telemetry.md

The remaining differences between baseline and regenerated entity_telemetry.md after IG.1R correction are identical in character to those classified STRUCTURALLY_EQUIVALENT in IG.1D (STRUCT-001 through STRUCT-003 for other files):

| Difference class | Examples | Normalizable | IG.1D rule |
|---|---|---|---|
| Frontmatter provenance fields | `contract`, `upstream_contract`, `run_id`, `date`, `regeneration_context`, `version` | YES | N-01 through N-05 |
| Section formatting | `entity_id:` vs `entity_ref:` field name convention; tabular vs inline format | YES — STRUCTURALLY_EQUIVALENT | N-07 |
| Path references | Input evidence paths updated to run_02_blueedge namespace | YES | N-08, N-10 |

No non-normalizable differences remain in entity_telemetry.md. DRIFT-001 is fully resolved.

---

## 4. 40.2 AND 40.3 CARRIED-FORWARD STATUS

No modifications were made to 40.2 or 40.3 artifacts during IG.1R. IG.1R scope was strictly limited to entity_telemetry.md CE-003 section.

| Layer | IG.1D verdict | IG.1D-R status | Basis |
|---|---|---|---|
| 40.2 | **NONE** | **NONE — UNCHANGED** | No 40.2 file modified; IG.1D findings carried forward |
| 40.3 | **NONE** | **NONE — UNCHANGED** | No 40.3 file modified; IG.1D findings carried forward |
| 40.4 | ~~DRIFT_MINOR~~ (DRIFT-001) | **STRUCTURALLY_EQUIVALENT** | DRIFT-001 resolved by IG.1R; no remaining non-normalizable differences |
