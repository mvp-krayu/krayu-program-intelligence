# STEP 10I — Vault Integrity + Projection Readiness Assessment

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10I
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Vault integrity PASS. Projection readiness: **CONDITIONALLY READY**.

Vault is structurally valid for Tier-2 consumption and projection layer input for the 22 evidence-backed structural claims. Signal claim sets are blocked by design (NOT_EVALUATED). Two explicit flags required for projection_runtime.py invocation.

---

## 4-BRAIN Assessment

### CANONICAL

**Claim set is fully evidence-derived:** CONFIRMED

| Layer | Claims | State |
|-------|--------|-------|
| Structural / coverage (CLM-01..CLM-08) | 8 | ACTIVE — evidence-backed |
| Score (CLM-09..CLM-12) | 4 | ACTIVE — evidence-backed |
| Execution state (CLM-13) | 1 | ACTIVE — NOT_EVALUATED documented |
| Topology (CLM-14..CLM-17) | 4 | ACTIVE — evidence-backed |
| Signal meta (CLM-18, CLM-19) | 2 | ACTIVE — 0 signals, correctly reflected |
| Signal intelligence (CLM-20..CLM-24) | 0 | ABSENT — not generated, evidence-conditional |
| Executive (CLM-25..CLM-27) | 3 | ACTIVE — evidence-backed |
| **Total** | **22** | **All FULL ACTIVE** |

**Non-applicable claim categories absent:** CONFIRMED — CLM-20..CLM-24 do not appear in claims/, Claim Index, or any wikilink.

**Claim graph consistency:** CONFIRMED — zero orphan wikilinks in full vault.

**Transformation → Artifact → Claim lineage:**
- ART-01 → CLM-09, CLM-10, CLM-11, CLM-12, CLM-13, CLM-25: INTACT
- ART-02 → CLM-01: INTACT
- ART-03 → CLM-03, CLM-04: INTACT
- ART-04 → CLM-14, CLM-15, CLM-16, CLM-17, CLM-27: INTACT
- ART-05 → CLM-18, CLM-19: INTACT (0 signals documented accurately)
- ART-07 → CLM-02, CLM-05, CLM-07: INTACT

**Signal layer semantic consistency:** CONFIRMED
- `ENT-signals.md`: "0 signals. Distribution: ." — cosmetic trailing period (empty distribution string when signals=0). Non-structural, non-blocking. Noted as COSMETIC-01.
- `VAULT ENTRY`: "Signal layer: NOT_EVALUATED — signal intelligence claims not generated pending PiOS 41.4 execution." ✓
- `client-lineage`: Same NOT_EVALUATED note ✓
- CLM-13: Authoritative Value = NOT_EVALUATED ✓

### CODE

**Vault structure matches builder contract:** CONFIRMED

Expected section layout per `evidence_vault_builder_spec.md`:

| Section | Files present | Expected |
|---------|--------------|---------|
| Root | 2 (EVIDENCE VAULT V2, VAULT ENTRY) | ✓ |
| `00 — Meta/` | 3 (Claim Index, Entity Index, Vault Governance) | ✓ |
| `00 — Navigation/` | 3 (Top Claims, Core Artifacts, Value Creation Path) | ✓ |
| `claims/` | 22 | 22 (no signal claims) ✓ |
| `entities/` | 5 (structural-units, topology-nodes, signals, score-components, dimensions) | ✓ |
| `artifacts/` | 7 (ART-01..ART-07) | ✓ |
| `transformations/` | 6 (TRN-01..TRN-06) | ✓ |
| `client-lineage/` | 1 | ✓ |
| `governance/` | 3 (Exposure Zones, Known Gaps, LENS Admissibility) | ✓ |
| **Total** | **52** | **52** |

**Broken wikilinks:** 0 ✓
**Orphan wikilinks (full vault):** 0 ✓
**Unclosed `[[` brackets in claims:** 0 ✓
**ART-01..ART-07 all present:** ✓ (ART-06 present but not referenced in claims — correct; binding envelope optional)
**TRN-01..TRN-06 all present:** ✓

**Projection runtime compatibility analysis (`scripts/pios/projection_runtime.py`):**

1. `_find_claim_file(claim_id, vault_path)` — searches `claims/` directory by prefix match. All 22 structural claims resolve when `--vault` is provided. ✓

2. Signal claims (CLM-20..24) in CLAIM_SETS — if requested, `_find_claim_file` returns None and `resolve_claim` returns `ProjectionError`. Correct graceful behavior. No crash, no BlueEdge bleed.

3. `_find_signal_registry()` (line 333): Contains only BlueEdge hardcoded candidates (`run_authoritative_recomputed_01`, `run_01_authoritative`). Does NOT include `run_01_oss_fastapi`. Documented as gap G1.
   - **Blocker status for this run:** NOT A BLOCKER — signal registry lookup is only triggered for CLM-20..24 (line 475). Those claims do not exist in this vault. Code path is unreachable for all 22 emitted claims.

4. Default `run_id = "run_authoritative_recomputed_01"` (line 963, 1037, 1134). REQUIRED: pass `--run-id run_01_oss_fastapi` explicitly on all invocations.

5. `CLAIM_SETS` signal-bearing sets:
   - `SIGNAL_ZONE_1..5`: Each requests one CLM-20..24 — will return ProjectionError per claim. Correct.
   - `LENS_SIGNAL_BLOCK`: All CLM-20..24 — all error. Correct.
   - `LENS_EXECUTIVE_OVERVIEW`: Contains CLM-20..24 mixed with structural claims. Structural claims succeed; signal claims return ProjectionError per-claim. This set MUST NOT be used as a batch export for second-client until PiOS 41.4 runs.
   - All purely structural claim sets (`SCORE_ZONE`, `VERDICT_ZONE`, `TOPOLOGY_ZONE`, `COVERAGE_ZONE`, `LENS_SCORE_BLOCK`, `LENS_VERDICT_BLOCK`, `LENS_STRUCTURAL_BLOCK`): FULLY RESOLVABLE ✓

### PRODUCT

**Vault is sufficient for Tier-2 consumption:** YES — for structural claims.

**"Working vault" product mode:** This vault represents a structural-only assessment: 22 evidence-backed claims covering score, coverage, reconstruction, topology, execution state, and executive verdict. The signal intelligence layer is absent by design and documented.

**Fragment export readiness:**

Required invocation form:
```
python3 scripts/pios/projection_runtime.py export-fragments \
  --output-dir <output_dir> \
  --run-id run_01_oss_fastapi \
  --vault clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi_fixed
```

Both `--run-id` and `--vault` flags MUST be explicit. Neither has a valid default for second-client.

**graph_state generation:** Not assessed (no graph_state script located in scope). Flagged as dependency check for STEP 11.

**Missing elements for complete vault (by design, not defects):**
- Signal intelligence claims (CLM-20..24): DEFERRED — pending PiOS 41.4
- Signal entity rows in ENT-signals: empty table (correct for 0 signals)
- `LENS_EXECUTIVE_OVERVIEW` claim set: partially serveable (structural subset only)

**Score values confirmed:**
- CLM-09 canonical score: 60 ✓
- CLM-10 projected score: 100 ✓
- CLM-25 executive verdict: STRUCTURE=STRONG, COMPLEXITY=MODERATE, EXECUTION=UNKNOWN ✓
- CLM-13 execution status: NOT_EVALUATED ✓

**Known Gaps documented in vault:**
- GAP-01: CONCEPT-06 semantic gap (EXECUTION verdict predicate mismatch) — OPEN
- GAP-02: Execution layer NOT_EVALUATED — KNOWN BY DESIGN

**BC-01 caveat for CLM-25:** `projection_runtime.py` (line 108–113) has a hardcoded BC-01 caveat for the CONCEPT-06 gap. This will be automatically applied when CLM-25 is projected. Correct behavior.

### PUBLISH

**Vault is safe for projection layer input:** YES for structural claims.

**No prohibited claim categories leak:** CONFIRMED — CLM-20..24 absent from vault; ENT-signals shows empty registry; LENS Admissibility table does not include CLM-24 row (correctly omitted when signals=0).

**ZONE-2 readiness conditions:**

| Claim | LENS Admissibility | Caveat |
|-------|-------------------|--------|
| CLM-09 Proven Structural Score | YES | None required |
| CLM-10 Achievable Score Projected | YES | "execution not yet run" must accompany |
| CLM-11 Score Band Classification | YES | None required |
| CLM-12 Score Confidence Range | YES | None required |
| CLM-01 Structural Coverage | YES | None required |
| CLM-25 Executive Verdict | YES | CONCEPT-06 gap must be fixed before LENS surface |
| CLM-06 Unknown-Space Count | CONDITIONAL | "minimum observable state, not proven zero" |
| CLM-08 Heuristic Compliance | CONDITIONAL | CTO audience only |
| CLM-20..CLM-24 Signal Claims | DEFERRED | Not generated; not activatable |

Signal claims: NOT ACTIVATED. No external expression. No ZONE-2 surface.

---

## Integrity Verdict

**PASS** — Vault is internally consistent, structurally complete for the 22 evidence-backed claims, and free of BlueEdge contamination or semantic drift.

---

## Projection Readiness Verdict

**CONDITIONALLY READY**

**Ready (no blockers) for:**
- All 22 individual structural claim projections
- Claim sets: `SCORE_ZONE`, `VERDICT_ZONE`, `TOPOLOGY_ZONE`, `COVERAGE_ZONE`, `LENS_SCORE_BLOCK`, `LENS_VERDICT_BLOCK`, `LENS_STRUCTURAL_BLOCK`
- Fragment export from any purely structural claim set

**Blocked / Restricted:**
- `LENS_SIGNAL_BLOCK`, `SIGNAL_ZONE_1..5`: All claims error (correct by design)
- `LENS_EXECUTIVE_OVERVIEW`: Must not be used as a complete batch set; structural subset only
- CLM-25 surface via LENS: Requires CONCEPT-06 gap resolution (GAP-01) first

**Required invocation flags (not optional):**
1. `--vault clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi_fixed`
2. `--run-id run_01_oss_fastapi`

---

## Anomalies

**COSMETIC-01 — ENT-signals distribution string**
`ENT-signals.md` shows "Distribution: ." — the `conf_dist_str()` function returns an empty string when no signals, leaving a trailing period in the entity node. Non-structural, non-blocking. Does not affect wikilinks, claim resolution, or projection. Deferred cosmetic fix.

**GAP-G1 — `_find_signal_registry()` BlueEdge hardcoding**
`projection_runtime.py` does not include `run_01_oss_fastapi` in its signal registry candidate list. NOT a current blocker (signal claims absent from vault, code path unreachable). Will become a blocker when PiOS 41.4 is executed and signal claims are added.

**GAP-G2 — Default `run_id` in projection_runtime.py**
Default `run_id="run_authoritative_recomputed_01"` requires explicit override. Operator must pass `--run-id run_01_oss_fastapi`. Documented; not patched in this step per STRICT constraints.

---

## Next Step Recommendation

**STEP 11 — Fragment Export**

Authorized scope:
- Run `projection_runtime.py export-fragments` with explicit `--vault` and `--run-id` flags
- Use structural-only claim sets: `SCORE_ZONE`, `VERDICT_ZONE`, `LENS_SCORE_BLOCK`, `LENS_VERDICT_BLOCK`, `LENS_STRUCTURAL_BLOCK`, `TOPOLOGY_ZONE`
- Do NOT use `LENS_EXECUTIVE_OVERVIEW` or any `SIGNAL_ZONE_*` / `LENS_SIGNAL_BLOCK`

Pre-requisite before LENS surface:
- GAP-01 (CONCEPT-06 predicate) must be resolved before CLM-25 is activated on LENS
