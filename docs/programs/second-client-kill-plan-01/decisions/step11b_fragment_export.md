# STEP 11B — Structural Fragment Export (Success-Only)

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 11B
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — 30 success-only structural fragments exported. All FAIL-STOP conditions cleared.
0 error files. 0 signal references. 0 BlueEdge contamination.

---

## Execution

**Command form used:**
```bash
for CLM in CLM-01 CLM-03 CLM-09 CLM-10 CLM-11 CLM-12 CLM-13 CLM-14 CLM-15 CLM-16 CLM-17 CLM-18 CLM-19 CLM-25 CLM-27; do
  for ZONE in ZONE-1 ZONE-2; do
    python3 scripts/pios/projection_runtime.py project "$CLM" \
      --zone "$ZONE" \
      --depth L1 \
      --run-id run_01_oss_fastapi \
      --vault clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi_fixed \
      > clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi/${CLM}-${ZONE}-L1.json
  done
done
```

**Anomaly A1 — first run produced stale error file:**
Initial Bash invocation used a `$CLAIMS` variable that was not word-split. The loop treated the entire claim list as a single claim ID, producing one error fragment file:
`CLM-01 CLM-03 ... CLM-27-ZONE-1-L1.json`

Remediation: file deleted before validation. Second run used inline explicit claim list — all 30 exits 0, all 30 files correct. Stale file was from a failed pre-execution attempt, not from valid claim projection.

---

## 4-BRAIN Summary

### CANONICAL

**Claims exported: 15 structural, all evidence-backed**

| Claim | Label | Evidence class |
|-------|-------|----------------|
| CLM-01 | Structural Coverage Completeness | VERIFIED |
| CLM-03 | Structural Reconstruction Pass-Fail | VERIFIED |
| CLM-09 | Proven Structural Score | VERIFIED |
| CLM-10 | Achievable Score Projected | CONDITIONAL |
| CLM-11 | Score Band Classification | CONDITIONAL |
| CLM-12 | Score Confidence Range | CONDITIONAL |
| CLM-13 | Execution Layer Status | CONDITIONAL |
| CLM-14 | Structural Domain Count | VERIFIED |
| CLM-15 | Structural Capability Count | VERIFIED |
| CLM-16 | Structural Component Count | VERIFIED |
| CLM-17 | Cross-Domain Structural Overlaps | VERIFIED |
| CLM-18 | Governed Signal Count | VERIFIED |
| CLM-19 | Signal Evidence Quality Distribution | VERIFIED |
| CLM-25 | Executive Three-Axis Verdict | CONDITIONAL |
| CLM-27 | Full Node Inventory 148 Nodes | VERIFIED |

**Signal claims (CLM-20..24):** NOT INVOKED. No fragment files generated.
**`export-fragments`:** NOT USED.

### CODE

**Execution result:** 30 invocations, all exit 0.
**Output directory:** `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi/`
**Fragment naming convention:** `{CLM_ID}-{ZONE}-L1.json`
**run_id in all payloads:** `run_01_oss_fastapi` (confirmed)
**vault path used:** `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi_fixed`

**Payload spot-checks:**
- CLM-09 ZONE-2: `evidence_class: VERIFIED`, `value.narrative: "Proven: 60/100"`, `run_id: run_01_oss_fastapi` ✓
- CLM-25 ZONE-2: sanitized narrative `"STRUCTURE: complete and verified. COMPLEXITY: no structural overlaps. EXECUTION: pending assessment."` — BC-01 caveat automatically appended ✓

### PRODUCT

**30 fragment files produced:**
- 15 ZONE-1 fragments (full internal trace, structural field set)
- 15 ZONE-2 fragments (ZONE-2 safe payload, sanitized values, caveats present)

**Fragments are Tier-2 ready** for structural claims. ZONE-2 payloads are LENS input-safe for structural layer.

**CLM-25 ZONE-2 fragment:** Contains BC-01 caveat. Safe for fragment generation. LENS surface activation still requires GAP-01 (CONCEPT-06) resolution.

**Fragments NOT produced (not in any CLAIM_SET):**
CLM-02, CLM-04, CLM-05, CLM-06, CLM-07, CLM-08, CLM-26 — available via individual `project` calls if needed.

### PUBLISH

**ZONE-2 compliance confirmed:**
- All ZONE-2 payloads contain only `ZONE2_L1_ALLOWED_FIELDS`
- No `SIG-` strings in any fragment
- No vault-internal field names (`source_field`, `artifact_path`, etc.) in ZONE-2 outputs
- CLM-25 ZONE-2 narrative is sanitized — no STRUCTURE/COMPLEXITY/EXECUTION internal codes exposed

**Not activated:** No signal claims. No LENS surface. Fragments are projection-layer artifacts only.

---

## Validation Results

| Check | Result |
|-------|--------|
| File count | 30 ✓ |
| `"error_type"` present | None ✓ |
| SIG-* references | None ✓ |
| BlueEdge contamination | None ✓ |
| All `project` exits | 0 ✓ |
| CLM-20..24 files | Absent ✓ |

---

## Output Summary

**Path:** `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi/`
**Files:** 30
**Format:** `{CLM_ID}-{ZONE}-L1.json`
**ZONE-1 files:** 15 (CLM-01, 03, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 25, 27)
**ZONE-2 files:** 15 (same 15 claims)
**Error files:** 0
