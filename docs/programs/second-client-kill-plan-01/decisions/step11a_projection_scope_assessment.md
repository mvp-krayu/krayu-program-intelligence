# STEP 11A — Projection Export Scope Assessment

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 11A
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE — AMENDED** — Export strategy corrected per program authority direction.
`export-fragments` command is NOT USABLE for second-client. `LENS_EXECUTIVE_OVERVIEW` is BLOCKED, not partial-executable. STEP 11B must produce success-only fragments via individual `project` calls. No error files are acceptable outputs.

---

## 4-BRAIN Analysis

### CANONICAL

**Vault claim groupings present:**

| Navigation node | Contents | Completeness |
|-----------------|----------|-------------|
| `00 — Navigation/Top Claims.md` | CLM-09, CLM-10, CLM-12, CLM-11, CLM-01, CLM-03, CLM-13, CLM-25; signals section empty | COMPLETE (structural), EMPTY (signals — correct) |
| `00 — Meta/Claim Index.md` | All 22 evidence-backed claims listed | COMPLETE |
| `governance/LENS Admissibility.md` | CLM-06, CLM-08, CLM-10, CLM-25 rows (CLM-24 row absent — correct) | COMPLETE for emitted claims |

**CLM-25 dependency on GAP-01 (CONCEPT-06):**

Vault `governance/Known Gaps.md` states GAP-01: "CONCEPT-06 predicate mismatch — EXECUTION verdict cannot be automatically derived." The vault's LENS Admissibility table contains: "CLM-25 Executive Verdict | YES | CONCEPT-06 gap must be fixed before LENS surface."

However, `projection_runtime.py` has a hardcoded BC-01 caveat (lines 514–516) that is **automatically appended to every CLM-25 projection output**:
> "CONCEPT-06 predicate mismatch (BC-01): EXECUTION verdict cannot be automatically derived until the predicate in concepts.json is updated to include NOT_EVALUATED. Manually confirmed as UNKNOWN based on execution_status=NOT_EVALUATED."

The ZONE-2 narrative value for CLM-25 is also hardcoded (line 561):
> "STRUCTURE: complete and verified. COMPLEXITY: no structural overlaps. EXECUTION: pending assessment."

**Assessment:** CLM-25 fragment generation is SAFE — BC-01 caveat is automatically applied by the projection runtime. The vault's "must be fixed before LENS surface" is a **LENS activation gate**, not a **projection gate**. Fragment generation ≠ surface activation. CLM-25 may be projected (fragment generated); it must NOT be activated on LENS until GAP-01 is resolved.

**Claims not in any named CLAIM_SET (7 of 22 structural claims):**
CLM-02, CLM-04, CLM-05, CLM-06, CLM-07, CLM-08, CLM-26 — present in vault, resolvable via individual `project` CLI calls, but NOT exported by `export-fragments`.

### CODE

**`export-fragments` behavior (lines 1131–1169):**

```python
all_claim_ids = sorted({
    cid
    for ids in CLAIM_SETS.values()
    for cid in ids
})
# → 20 unique claim IDs (union of all CLAIM_SETS)
# → 40 files (20 IDs × ZONE-1 + ZONE-2)
# Always exits 0 (line 1245)
# Returns count of success (non-error) fragments
```

The command iterates the UNION of ALL CLAIM_SETS. There is no `--claims` filter. Signal claim IDs (CLM-20..24) are included because they appear in `SIGNAL_ZONE_*`, `LENS_SIGNAL_BLOCK`, and `LENS_EXECUTIVE_OVERVIEW`. When `_find_claim_file` returns None for an absent claim, `project()` returns a `ProjectionError` dict. **The error dict is WRITTEN as a JSON file.** Exit is always 0.

**`export-fragments` is NOT USABLE for second-client.** It unconditionally generates CLM-20..24 error fragment files. Error files are not acceptable outputs. STEP 11B must use individual `project` calls targeting only the 15 structural claim IDs present in the vault.

**`--vault` flag:** argparse declares `default=None`. However, `_default_vault_path()` (line 947–950) raises `ValueError("vault_path must be supplied explicitly")`. This means `--vault` is **effectively required at runtime** even though argparse doesn't enforce it at parse time. Omitting `--vault` raises a runtime error.

**`--run-id` flag:** argparse default is `"run_authoritative_recomputed_01"`. Silently uses wrong run ID if omitted for second-client. Must be explicitly overridden.

**CLM-25 ZONE-2 narrative (line 559–561):** Hardcoded safe narrative — internal codes stripped. BC-01 caveat appended unconditionally (lines 514–516). CLM-25 projection is safe to run.

**`project-set` command:** Targets a single named CLAIM_SET. Safe for structural-only sets. Signal sets will return `ClaimSetError` with partial payload.

**Expected claim IDs in `export-fragments` (20 unique):**

| Category | IDs | In vault? |
|----------|-----|-----------|
| Score | CLM-09, CLM-10, CLM-11, CLM-12 | YES |
| Structural | CLM-01, CLM-03, CLM-17 | YES |
| Execution/verdict | CLM-13, CLM-25 | YES |
| Topology | CLM-14, CLM-15, CLM-16, CLM-27 | YES |
| Signal meta | CLM-18, CLM-19 | YES |
| Signal intelligence | CLM-20, CLM-21, CLM-22, CLM-23, CLM-24 | **NO** |

### PRODUCT

**Minimal usable export set for Tier-2:**

A Tier-2 structural assessment vault export requires at minimum:
1. Score claims: CLM-09 (canonical score), CLM-10 (projected), CLM-12 (confidence range)
2. Executive verdict: CLM-25 (with BC-01 caveat), CLM-13 (execution state)
3. Topology: CLM-14..CLM-16

All of these are in the vault and resolvable. The 15 structural claims covered by CLAIM_SETS are sufficient for a complete Tier-2 structural export.

**Structural export sets (SAFE — all claims in vault):**

| Set name | Claims | Vault status |
|----------|--------|-------------|
| `SCORE_ZONE` | CLM-09, CLM-10, CLM-12, CLM-11 | All ACTIVE ✓ |
| `VERDICT_ZONE` | CLM-25, CLM-13, CLM-03 | All ACTIVE ✓ (CLM-25 with BC-01) |
| `TOPOLOGY_ZONE` | CLM-27, CLM-14, CLM-15, CLM-16 | All ACTIVE ✓ |
| `COVERAGE_ZONE` | CLM-01, CLM-13 | All ACTIVE ✓ |
| `LENS_SCORE_BLOCK` | CLM-09, CLM-10, CLM-12, CLM-11 | All ACTIVE ✓ |
| `LENS_VERDICT_BLOCK` | CLM-25, CLM-13 | All ACTIVE ✓ |
| `LENS_STRUCTURAL_BLOCK` | CLM-01, CLM-14, CLM-15, CLM-16, CLM-17 | All ACTIVE ✓ |

**Fully blocked sets:**

| Set name | Claims | Reason |
|----------|--------|--------|
| `SIGNAL_ZONE_1` | CLM-20 | Claim absent from vault |
| `SIGNAL_ZONE_2` | CLM-21 | Claim absent from vault |
| `SIGNAL_ZONE_3` | CLM-22 | Claim absent from vault |
| `SIGNAL_ZONE_4` | CLM-23 | Claim absent from vault |
| `SIGNAL_ZONE_5` | CLM-24 | Claim absent from vault |
| `LENS_SIGNAL_BLOCK` | CLM-20..24 | All claims absent from vault |
| `LENS_EXECUTIVE_OVERVIEW` | CLM-20..24 mixed with structural | Contains absent signal claims; partial execution not allowed |

### PUBLISH

**ZONE-2 constraints confirmed:**
- ZONE2_FORBIDDEN_CONTENT_SUBSTRINGS includes `"SIG-"` — signal IDs stripped from any ZONE-2 payload by projection runtime
- CLM-25 ZONE-2 narrative is sanitized (internal codes stripped, hardcoded)
- Signal claim fragments (CLM-20..24) must NOT be generated; error files are not acceptable outputs

**Activation gates (production guards — not projection gates):**
- CLM-25 LENS activation: BLOCKED pending GAP-01 (CONCEPT-06) resolution
- CLM-20..24 LENS activation: BLOCKED pending PiOS 41.4
- Score/topology/structural claims: SAFE for LENS fragment generation; activation subject to separate LENS contract

**Not activated in this step:** No signal claims. No LENS surface. Fragment generation only.

---

## Safe Claim Sets

**7 named sets — all claims in vault, all evidence-backed:**
1. `SCORE_ZONE`
2. `VERDICT_ZONE`
3. `TOPOLOGY_ZONE`
4. `COVERAGE_ZONE`
5. `LENS_SCORE_BLOCK`
6. `LENS_VERDICT_BLOCK`
7. `LENS_STRUCTURAL_BLOCK`

---

## Blocked Claim Sets

**7 sets — fully blocked:**
- `SIGNAL_ZONE_1`, `SIGNAL_ZONE_2`, `SIGNAL_ZONE_3`, `SIGNAL_ZONE_4`, `SIGNAL_ZONE_5`
- `LENS_SIGNAL_BLOCK`
- `LENS_EXECUTIVE_OVERVIEW` — contains absent CLM-20..24; partial execution not allowed; BLOCKED in full

---

## Invocation Contract

**`export-fragments` — NOT USABLE for second-client.**
Generates CLM-20..24 error fragment files unconditionally. Must not be invoked.

**Correct approach: individual `project` calls per claim × per zone.**

STEP 11B must invoke `project` for each of the 15 structural claim IDs covered by CLAIM_SETS, at both ZONE-1 and ZONE-2, writing stdout to individual fragment files:

```bash
VAULT="clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi_fixed"
OUT="clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi"
RUN="run_01_oss_fastapi"

# 15 structural claim IDs present in vault and covered by named CLAIM_SETS
CLAIMS="CLM-01 CLM-03 CLM-09 CLM-10 CLM-11 CLM-12 CLM-13 CLM-14 CLM-15 CLM-16 CLM-17 CLM-18 CLM-19 CLM-25 CLM-27"

for CLM in $CLAIMS; do
  for ZONE in ZONE-1 ZONE-2; do
    python3 scripts/pios/projection_runtime.py project "$CLM" \
      --zone "$ZONE" --depth L1 \
      --run-id "$RUN" \
      --vault "$VAULT" \
      > "${OUT}/${CLM}-${ZONE}-L1.json"
  done
done
```

**Required flags (all invocations):**
- `--vault <path>` — REQUIRED; raises ValueError if omitted
- `--run-id run_01_oss_fastapi` — REQUIRED; defaults to BlueEdge run ID if omitted
- `--zone` — REQUIRED; must be set explicitly per invocation
- `--depth L1` — REQUIRED; specify explicitly

**Forbidden invocations:**
- `export-fragments` — NOT USABLE
- Any invocation targeting CLM-20, CLM-21, CLM-22, CLM-23, CLM-24
- Any invocation of `LENS_EXECUTIVE_OVERVIEW`, `LENS_SIGNAL_BLOCK`, `SIGNAL_ZONE_*`

---

## Expected Output

**STEP 11B output (individual `project` calls — success only):**

| File type | Count | Description |
|-----------|-------|-------------|
| Success fragments (ZONE-1) | 15 | CLM-01, 03, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 25, 27 |
| Success fragments (ZONE-2) | 15 | Same 15 claims at ZONE-2 |
| Error fragments | **0** | None — signal claims are not invoked |
| **Total files** | **30** | **All success** |

**Validation criterion:** All 30 fragment files must be free of `"error_type"` keys. Any file containing `"error_type"` is a FAIL-STOP condition.

**Claims not included in STEP 11B export (not in any CLAIM_SET):**
CLM-02, CLM-04, CLM-05, CLM-06, CLM-07, CLM-08, CLM-26 — present in vault; accessible via individual `project CLM-XX` calls outside STEP 11B scope if needed.

---

## Export Strategy for STEP 11B

Run individual `project` calls for each of the 15 structural claim IDs × 2 zones, using the invocation contract above. The output will be:
- 30 success fragment files (ZONE-1 + ZONE-2 for 15 claims)
- 0 error files

**FAIL-STOP conditions for STEP 11B:**
- Any fragment file containing `"error_type"` → STOP
- Any CLM-20..24 file present in output directory → STOP
- Any fragment file count ≠ 30 → STOP
- Any non-zero exit from any individual `project` invocation → STOP

Do NOT invoke `export-fragments`.
Do NOT invoke any SIGNAL_ZONE, LENS_SIGNAL_BLOCK, or LENS_EXECUTIVE_OVERVIEW.
Do NOT activate CLM-25 on LENS surface until GAP-01 resolved.

---

## Next Step Definition

**STEP 11B — Fragment Export Execution**

```
MODE: CONTROLLED RUNTIME EXECUTION
Script: scripts/pios/projection_runtime.py project (individual calls)
Claims: CLM-01 CLM-03 CLM-09 CLM-10 CLM-11 CLM-12 CLM-13 CLM-14 CLM-15 CLM-16 CLM-17 CLM-18 CLM-19 CLM-25 CLM-27
Zones: ZONE-1, ZONE-2
Required flags: --vault, --run-id run_01_oss_fastapi, --zone (explicit), --depth L1
Expected: 30 files, all success, 0 error files
Validation: grep "error_type" *.json → must return empty; ls | wc -l → must equal 30
```
