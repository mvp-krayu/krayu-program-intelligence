# DPSIG Content Validation

**Stream:** PI.PSEE-PIOS.LENS-REPORT-CONTRACT-COMPLIANCE.FIX.01 — STEP 6  
**Date:** 2026-05-07  

---

## Evidence Brief — DPSIG Markers

All checks on `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_tier1_evidence_brief.html` (44605 bytes, generated 2026-05-07).

| Marker | Count | Check |
|---|---|---|
| `DPSIG-031` | 1 | PASS |
| `DPSIG-032` | 1 | PASS |
| `projection_render_id: 44a820d0ea720f01` | 1 | PASS |
| `cluster_salience_score: 1.6245` | 3 | PASS |
| `fragility_score: 0.8122` | 1 | PASS |
| `severity CRITICAL` | 1 | PASS |
| `CLU-17 (dominant cluster)` | 8 | PASS |
| PSIG signals section (`Active Structural Signals`, `PSIG-001`, `PSIG-002`) | 10 | PASS |

## Narrative Brief — DPSIG Markers

`clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/lens_tier1_narrative_brief.html` (34052 bytes):

| Marker | Count | Check |
|---|---|---|
| `DPSIG-031` | 1 | PASS |
| `projection_render_id: 44a820d0ea720f01` | 1 | PASS |

## Tier-2 Diagnostic Narrative

Size: 90147 bytes — non-zero, generation confirmed.  
Generated fresh with graph_state.json from vault_index.json (5 nodes: ZONE-01 + 4 PSIG signals).

## Decision Surface

Size: 12742 bytes — non-zero, generation confirmed.

## Content Continuity

| Check | Result |
|---|---|
| DPSIG block present in evidence brief | PASS |
| DPSIG block present in narrative brief | PASS |
| PSIG signals section preserved (not overwritten by DPSIG) | PASS |
| No stale report reuse — timestamps from 2026-05-07 generation | PASS |
| No overwrite corruption — all markers coherent | PASS |
| Tier rendering intact — tier-2 and decision surface generated | PASS |

## DPSIG Projection Weight Confirmation

Values visible in reports match TAXONOMY-01 canonical values from `projection_replay_diff.json`:

| Field | Expected | In Report | Match |
|---|---|---|---|
| `projection_render_id` | `44a820d0ea720f01` | `44a820d0ea720f01` | ✓ |
| `cluster_salience_score` | `1.6245` | `1.6245` | ✓ |
| `fragility_score` | `0.8122` | `0.8122` | ✓ |
| `severity_band` | `CRITICAL` | `CRITICAL` | ✓ |
| `max_cluster_id` | `CLU-17` | `CLU-17` | ✓ |

**STEP 6: PASS — DPSIG content survived contract-compliant placement and regeneration**
