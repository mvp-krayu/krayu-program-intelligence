# STEP 11C — Fragment Integrity + LENS Consumption Readiness

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 11C
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — All 30 fragment files pass schema integrity, zone separation, and narrative quality checks. No leakage. LENS consumption readiness: CONDITIONALLY READY for structural claims.

---

## Validation Results

| Check | Result |
|-------|--------|
| File count | 30 ✓ |
| Required fields present (all 30) | PASS ✓ |
| ZONE-1 count | 15 ✓ |
| ZONE-2 count | 15 ✓ |
| `run_id` = `run_01_oss_fastapi` (all 30) | PASS ✓ |
| `error_type` present | None ✓ |
| `SIG-` strings in any fragment | None ✓ |
| `ENT-` strings in any fragment | None ✓ |
| `CLM-` in ZONE-2 narrative fields | None ✓ |
| BlueEdge contamination | None ✓ |
| ZONE-1 `source_field` present | YES ✓ |
| ZONE-2 `source_field` absent | YES ✓ |
| ZONE-1 `transformation_summary` present | YES ✓ |
| ZONE-2 `transformation_summary` absent | YES ✓ |
| BC-01 caveat on CLM-25 ZONE-2 | PRESENT ✓ |
| CLM-25 ZONE-2 narrative sanitized | CONFIRMED ✓ |

---

## 4-BRAIN Assessment

### CANONICAL

**Fragment set is structurally complete for the 15 exported structural claims:** CONFIRMED

All 15 claim IDs (CLM-01, 03, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 25, 27) have both ZONE-1 and ZONE-2 fragment files. No claim is partially exported.

**Evidence classes confirmed:**

| Claim | Evidence class | Zone-1 check |
|-------|----------------|-------------|
| CLM-01 | VERIFIED | ✓ |
| CLM-03 | VERIFIED | ✓ |
| CLM-09 | VERIFIED | ✓ |
| CLM-10 | CONDITIONAL | ✓ |
| CLM-11 | CONDITIONAL | ✓ |
| CLM-12 | CONDITIONAL | ✓ |
| CLM-13 | CONDITIONAL | ✓ |
| CLM-14 | VERIFIED | ✓ |
| CLM-15 | VERIFIED | ✓ |
| CLM-16 | VERIFIED | ✓ |
| CLM-17 | VERIFIED | ✓ |
| CLM-18 | VERIFIED | ✓ |
| CLM-19 | VERIFIED | ✓ |
| CLM-25 | CONDITIONAL | ✓ |
| CLM-27 | VERIFIED | ✓ |

**Signal claims (CLM-20..24):** ABSENT from fragment set — correct by design. No signal claim files exist in output directory.

**BC-01 caveat (CLM-25):** Automatically applied by `projection_runtime.py` (lines 514–516). ZONE-2 CLM-25 narrative hardcoded to safe string: `"STRUCTURE: complete and verified. COMPLEXITY: no structural overlaps. EXECUTION: pending assessment."` — internal codes stripped. BC-01 caveat text present in `caveats` array.

### CODE

**Zone separation implementation — CORRECT:**

ZONE-1 (operator-grade) fields present:
- `source_field` — vault field derivation path (e.g. `` `gauge_state.json` → `score.canonical` ``)
- `transformation_summary` — PiOS compute step reference (e.g. `"pios compute gauge (S4)"`)

ZONE-2 (LENS-safe) fields stripped:
- `source_field` — ABSENT in all 15 ZONE-2 files ✓
- `transformation_summary` — ABSENT in all 15 ZONE-2 files ✓

Both zones retain: `projection_id`, `claim_id`, `zone`, `depth`, `evidence_class`, `persona`, `run_id`, `caveats`, `claim_label`, `value`, `explanation`.

**`projection_id` naming convention confirmed:** `PROJ-{CLM_ID}-{ZONE}-L1-{hash}` — unique per file.

**`run_id` consistency:** All 30 files contain `"run_id": "run_01_oss_fastapi"`. No BlueEdge run ID (`run_authoritative_recomputed_01`) present in any file.

**Leakage scan results:**
- `SIG-` strings: 0 matches across all 30 files
- `ENT-` strings: 0 matches across all 30 files
- `CLM-` in explanation/caveats/narrative fields (ZONE-2): 0 unauthorized appearances — `CLM-` appears only in `claim_id` and `claim_label` fields, which are `ZONE2_L1_ALLOWED_FIELDS`

**ZONE-1 payload spot-check (CLM-09):**
```json
{
  "projection_id": "PROJ-CLM-09-ZONE-1-L1-d6273",
  "claim_id": "CLM-09",
  "zone": "ZONE-1",
  "depth": "L1",
  "evidence_class": "VERIFIED",
  "persona": "shared",
  "run_id": "run_01_oss_fastapi",
  "caveats": [],
  "claim_label": "CLM-09 — Proven Structural Score",
  "value": {"narrative": "Proven: 60/100", "raw": "60", "unit": "out of 100"},
  "explanation": "The canonical score is the proven floor. coverage_points=35... reconstruction_points=25... completion_points=0 because the execution layer has not been evaluated...",
  "source_field": "`gauge_state.json` → `score.canonical`",
  "transformation_summary": "pios compute gauge (S4)"
}
```

**ZONE-2 payload spot-check (CLM-25):**
```json
{
  "claim_id": "CLM-25",
  "zone": "ZONE-2",
  "evidence_class": "CONDITIONAL",
  "run_id": "run_01_oss_fastapi",
  "value": {"narrative": "STRUCTURE: complete and verified. COMPLEXITY: no structural overlaps. EXECUTION: pending assessment."},
  "caveats": ["CONCEPT-06 predicate mismatch (BC-01): EXECUTION verdict cannot be automatically derived until the predicate in concepts.json is updated to include NOT_EVALUATED. Manually confirmed as UNKNOWN based on execution_status=NOT_EVALUATED."]
}
```
No `source_field`. No `transformation_summary`. No internal execution codes. BC-01 caveat present. ✓

### PRODUCT

**30 fragments are Tier-2 ready for structural claims.**

| Fragment category | Count | Readiness |
|-------------------|-------|-----------|
| ZONE-1 structural (operator layer) | 15 | READY — full derivation trace |
| ZONE-2 structural (LENS layer) | 15 | CONDITIONALLY READY — structural claims safe; CLM-25 blocked at surface |

**LENS surface activation status:**

| Claim group | LENS activation | Gate |
|-------------|-----------------|------|
| Score (CLM-09, 10, 11, 12) | READY | No gate |
| Coverage/topology (CLM-01, 14, 15, 16, 17, 27) | READY | No gate |
| Signal meta (CLM-18, 19) | READY | No gate |
| Execution state (CLM-13) | READY | No gate |
| Reconstruction (CLM-03) | READY | No gate |
| Executive verdict (CLM-25) | BLOCKED | GAP-01 (CONCEPT-06) must be resolved |
| Signal intelligence (CLM-20..24) | BLOCKED | PiOS 41.4 not run; fragments not generated |

**Fragment file format:** `{CLM_ID}-{ZONE}-L1.json` in `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi/`.

### PUBLISH

**ZONE-2 compliance confirmed:**
- No `SIG-` string in any ZONE-2 payload
- No `source_field` or vault-internal field names in ZONE-2 outputs
- No internal execution state codes (STRUCTURE/COMPLEXITY/EXECUTION codes) in CLM-25 ZONE-2 narrative
- CLM-25 ZONE-2 narrative: sanitized and hardcoded — safe for external expression
- BC-01 caveat automatically enforced — CLM-25 cannot be published without caveat present

**Not activated:** No signal claims. No LENS surface active. Fragments are projection-layer artifacts only.

**Surface activation constraint:** CLM-25 ZONE-2 fragment is LENS input-safe but MUST NOT be activated on LENS surface until GAP-01 (CONCEPT-06 predicate mismatch) is resolved.

---

## Gaps

| ID | Description | Blocker for LENS? |
|----|-------------|-------------------|
| GAP-01 | CONCEPT-06 predicate mismatch — EXECUTION verdict cannot be automatically derived | YES — CLM-25 surface activation blocked |
| G1 | `_find_signal_registry()` does not include `run_01_oss_fastapi` path | NO (CLM-20..24 not in vault; code path unreachable) |
| G2 | Default `run_id` in `projection_runtime.py` is BlueEdge value | NO (operator constraint; documented) |
| COSMETIC-01 | `ENT-signals.md` "Distribution: ." trailing period | NO |

---

## Next Step Recommendation

**STEP 12 — LENS Surface Activation (Structural Claims)**

Authorized activation scope:
- CLM-09, CLM-10, CLM-11, CLM-12 (score layer)
- CLM-01, CLM-03, CLM-13, CLM-14, CLM-15, CLM-16, CLM-17, CLM-18, CLM-19, CLM-27 (structural + topology + signal meta)

Pre-requisite for CLM-25:
- GAP-01 (CONCEPT-06 predicate) must be resolved before CLM-25 is activated on LENS

Not activated until PiOS 41.4:
- CLM-20..24 (signal intelligence)
