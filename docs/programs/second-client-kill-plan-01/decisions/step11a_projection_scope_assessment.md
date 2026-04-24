# STEP 11A — Projection Export Scope Assessment

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 11A
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Projection scope fully assessed. Export strategy defined.
Safe claim sets identified. Blocked sets documented. Invocation contract specified.

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

**Mixed / Partial sets (PARTIAL — some claims in vault, some absent):**

| Set name | Signal claims (absent) | Structural claims (present) | Status |
|----------|----------------------|------------------------------|--------|
| `LENS_EXECUTIVE_OVERVIEW` | CLM-20..24 (5 absent) | CLM-09, CLM-10, CLM-25, CLM-18, CLM-19, CLM-12, CLM-11, CLM-01, CLM-13 (9 present) | PARTIAL |

**Fully blocked sets (all claims absent):**

| Set name | Claims | Status |
|----------|--------|--------|
| `SIGNAL_ZONE_1` | CLM-20 | BLOCKED |
| `SIGNAL_ZONE_2` | CLM-21 | BLOCKED |
| `SIGNAL_ZONE_3` | CLM-22 | BLOCKED |
| `SIGNAL_ZONE_4` | CLM-23 | BLOCKED |
| `SIGNAL_ZONE_5` | CLM-24 | BLOCKED |
| `LENS_SIGNAL_BLOCK` | CLM-20..24 | BLOCKED |

### PUBLISH

**ZONE-2 constraints confirmed:**
- ZONE2_FORBIDDEN_CONTENT_SUBSTRINGS includes `"SIG-"` — signal IDs stripped from any ZONE-2 payload by projection runtime
- CLM-25 ZONE-2 narrative is sanitized (internal codes stripped, hardcoded)
- Error payloads for absent signal claims contain NO vault content (ZONE-0 protection)

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

**6 fully blocked (all claims absent from vault):**
- `SIGNAL_ZONE_1`, `SIGNAL_ZONE_2`, `SIGNAL_ZONE_3`, `SIGNAL_ZONE_4`, `SIGNAL_ZONE_5`
- `LENS_SIGNAL_BLOCK`

**1 partial:**
- `LENS_EXECUTIVE_OVERVIEW`: 9 structural claims project successfully; 5 signal claims return `ProjectionError`. MUST NOT be used as a complete export.

---

## Invocation Contract

**`export-fragments` (full export — SAFE for second-client):**

```bash
python3 scripts/pios/projection_runtime.py export-fragments \
  --output-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi \
  --run-id run_01_oss_fastapi \
  --vault clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi_fixed
```

**`project-set` (targeted structural set — SAFE):**

```bash
python3 scripts/pios/projection_runtime.py project-set LENS_SCORE_BLOCK \
  --run-id run_01_oss_fastapi \
  --vault clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi_fixed \
  --zone ZONE-2 --depth L1
```

**Required flags (both invocation forms):**
- `--vault <path>` — REQUIRED; raises ValueError if omitted
- `--run-id run_01_oss_fastapi` — REQUIRED; defaults to BlueEdge run ID if omitted

**Optional flags:**
- `--zone` — defaults to ZONE-1
- `--depth` — defaults to L1
- `--persona` — defaults to PERSONA_SHARED

---

## Expected Output

**`export-fragments` output:**

| File type | Count | Description |
|-----------|-------|-------------|
| Success fragments (ZONE-1) | 15 | CLM-01, 03, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 25, 27 |
| Success fragments (ZONE-2) | 15 | Same 15 claims at ZONE-2 |
| Error fragments (ZONE-1) | 5 | CLM-20..24 (NOT_FOUND; no vault content) |
| Error fragments (ZONE-2) | 5 | CLM-20..24 (NOT_FOUND; no vault content) |
| **Total files** | **40** | **Exit: 0** |
| **Success count returned** | **30** | |

**Error files for CLM-20..24:** Correct and expected. Contain no vault content. Represent "signal layer NOT_EVALUATED — claim not generated." Not a failure condition.

**Claims NOT exported by `export-fragments` (not in any CLAIM_SET):**
CLM-02, CLM-04, CLM-05, CLM-06, CLM-07, CLM-08, CLM-26 — can be accessed via individual `project CLM-XX` calls if needed.

---

## Export Strategy for STEP 11B

Run `export-fragments` with the invocation above. The output will be:
- 30 valid structural fragment files (ZONE-1 + ZONE-2 for 15 claims)
- 10 error files for CLM-20..24 (correct, expected, non-contaminating)
- Exit 0

Post-export: verify success count = 30 (not 40). Presence of 10 error files is expected and must not be treated as a build failure.

Do NOT use `LENS_EXECUTIVE_OVERVIEW` or any `SIGNAL_ZONE_*` / `LENS_SIGNAL_BLOCK` as complete projection sets for second-client.

Do NOT activate CLM-25 on LENS surface until GAP-01 resolved.

---

## Next Step Definition

**STEP 11B — Fragment Export Execution**

```
MODE: CONTROLLED RUNTIME EXECUTION
Script: scripts/pios/projection_runtime.py export-fragments
Required flags: --vault, --run-id run_01_oss_fastapi
Expected: exit 0, success count = 30, 40 total files
Validation: count success files, confirm CLM-20..24 are error-only, no vault content in error files
```
