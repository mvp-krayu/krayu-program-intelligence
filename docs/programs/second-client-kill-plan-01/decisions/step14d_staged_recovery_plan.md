# STEP 14D — Staged Recovery Plan (Strict Forensic Compliance)

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14D
**Date:** 2026-04-25
**Branch:** work/psee-runtime
**Source of Truth:** `docs/programs/second-client-kill-plan-01/decisions/step14c_reset_full_pipeline_map.md`

---

## Compliance Declaration

All content below is derived exclusively from STEP 14C.
No stages invented. No behavior inferred. No gaps normalized.
Where STEP 14C is silent → marked UNKNOWN.

---

## Section 1 — Executive Verdict

**Deliverable parity: NO**

**System state classification:** Structurally valid, partially executed, intelligence layer absent

- Second-client canonical package (S-01..S-09) is complete up to signal layer
- EXEC and LENS are not generated but are executable without new contracts
- DIAGNOSTIC is not generated and is blocked by three independent gaps
- Tier-2 vault, workspace, and graph are fully absent
- Signal layer (`signal_registry.json`: 0 signals, NOT_EVALUATED) propagates to block every signal-dependent surface

**Hard blockers:** 5

| Blocker | Blocks |
|---------|--------|
| GAP-EXEC-01 | EXEC, LENS |
| GAP-VAULT-01 | vault_index.json, graph_state.json, DIAGNOSTIC, workspace |
| GAP-CODE-01 | graph_state.json (second-client), DIAGNOSTIC |
| GAP-CODE-02 | workspace zones (second-client) |
| GAP-SIGNAL-01 | Full signal parity (EXEC signal tier, DIAGNOSTIC signal nodes, workspace signal layer) |

**Non-blocking gaps (degrade quality, do not prevent file existence):**
- GAP-01 — CLM-25 verdict not surfaced
- DQGAP-01 — CLM-19 fragment quality
- R-05 — 11 structural claims without LENS components

---

## Section 2 — Gap → Stage Matrix

Source: STEP 14C Section "Gaps Consolidated" + Stage Map.

| Gap ID | Stage | Affects | Root Cause | Required Artifact | Required Script | Blocking? |
|--------|-------|---------|------------|-------------------|-----------------|-----------|
| GAP-EXEC-01 | S-13, S-14 | EXEC HTML, LENS HTML | `generate_tier1_reports()` never called for second client with tier1 path | `clients/e65d2f0a.../reports/tier1/lens_tier1_evidence_brief.html`, `lens_tier1_narrative_brief.html` | `scripts/pios/lens_report_generator.py --client <uuid> --run-id run_01_oss_fastapi` | YES — EXEC + LENS absent |
| GAP-VAULT-01 | S-11 | vault_index.json, S-12 (graph_state), S-15 (DIAGNOSTIC), S-17 (workspace) | `vault_export.py:validate_export()` requires `len(signals) > 0`; fails with 0 signals | `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json` | `scripts/pios/vault_export.py` (after code fix) | YES — all downstream vault/graph/DIAGNOSTIC/workspace artifacts |
| GAP-CODE-01 | S-12, S-15 | graph_state.json (second-client), DIAGNOSTIC | `lens_report_generator.py:3728`: `subprocess.run(["node", str(export_script)], check=True)` passes no `--client`/`--run-id`; `export_graph_state.mjs` defaults to `client="blueedge"` | `clients/e65d2f0a.../reports/tier2/graph_state.json` | 4-edit fix to `scripts/pios/lens_report_generator.py` (specified in STEP 14B) | YES — second-client graph_state would contain BlueEdge data without this fix |
| GAP-CODE-02 | S-17 | Tier-2 workspace zone rendering | `zones.js` API calls `tier2_query_engine.py` without `--client`/`--run-id`; always returns BlueEdge zones | Second-client zone data served by `/api/zones` | Fix to `zones.js` API (not yet specified in a contract) | YES — workspace renders BlueEdge zones for all clients |
| GAP-SIGNAL-01 | S-05 | Full signal parity: EXEC signal tier, DIAGNOSTIC signal nodes, workspace signal layer | PiOS 41.4 (`build_signals.py`) never contracted or run; `signal_registry.json` has 0 signals, NOT_EVALUATED | SIG-XXX signal artifacts; updated `signal_registry.json` with N signals, `emission_state: ACTIVE` | `scripts/pios/41.4/build_signals.py` | YES — for full parity; NO — for EXEC/LENS file existence (0-signal render is evidence-correct) |
| GAP-01 | S-16 | CLM-25 verdict on LENS live page | `GAP_01_RESOLVED = False` constant in `lens.js` and `lens_report_generator.py`; concepts.json lacks NOT_EVALUATED predicate support | Updated `concepts.json` | Not specified in STEP 14C | NO — EXEC/LENS files will exist; CLM-25 placeholder shown instead of verdict |
| DQGAP-01 | S-10 | CLM-19 fragment render quality | `CLM-19` fragment: `value.narrative = "## Source Fields"` (zero-signal artifact) | Corrected CLM-19 fragment | Not specified in STEP 14C | NO — CLM-19 will render with degraded content, not block generation |
| R-05 | S-13, S-14 | Full structural tier in EXEC/LENS | No LENS components for CLM-01/03/11/13/14/15/16/17/18/19/27 | 11 LENS component definitions | Not specified in STEP 14C | NO — those claims will be absent from render, not crash generator |

---

## Section 3 — Phased Recovery Plan

### PHASE 1 — EXEC + LENS Generation

**Sourced from:** STEP 14C Section 8, STAGE A; Section 2 EXEC/LENS status; Section 7 PRODUCT table.

**Inputs required (all must exist — confirmed in STEP 14C):**
- `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/package/canonical_topology.json` — EXISTS ✓
- `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/package/signal_registry.json` — EXISTS ✓ (0 signals, NOT_EVALUATED)
- `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/package/gauge_state.json` — EXISTS ✓

**Missing artifacts (from STEP 14C):**
- `clients/e65d2f0a.../reports/tier1/lens_tier1_evidence_brief.html` — ABSENT
- `clients/e65d2f0a.../reports/tier1/lens_tier1_narrative_brief.html` — ABSENT
- `clients/e65d2f0a.../reports/tier1/publish/lens_tier1_evidence_brief_pub.html` — ABSENT
- `clients/e65d2f0a.../reports/tier1/publish/lens_tier1_narrative_brief_pub.html` — ABSENT

**Required script:**
`scripts/pios/lens_report_generator.py --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run-id run_01_oss_fastapi`

**Blocking gap:**
GAP-EXEC-01 (resolved by this phase)

**Execution risk (from STEP 14C STAGE A note):**
`main(tier1=True)` calls `generate_tier1_reports()` then `generate_tier2_reports()`. The tier2 call reaches `subprocess.run(["node", str(export_script)], check=True)` without `--client`/`--run-id`. Behavior of this subprocess under second-client invocation is described in STEP 14C as requiring isolation: "Must either: (a) call with --legacy equivalent to skip tier2, OR (b) accept tier2 failure and isolate." Exact subprocess outcome (pass with BlueEdge data vs. fail) is **UNKNOWN** — STEP 14C does not definitively resolve it. This risk must be addressed in the execution contract.

**Exit condition:**
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier1/lens_tier1_evidence_brief.html  EXISTS
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier1/lens_tier1_narrative_brief.html  EXISTS
```

---

### PHASE 2 — Vault Export + vault_index.json

**Sourced from:** STEP 14C Section 8, STAGE B; Section 3 S-11; Section 5 MISS-02.

**Inputs required:**
- `clients/e65d2f0a.../vaults/run_01_oss_fastapi/` — EXISTS (vault markdown files with frontmatter) ✓
- `vault_export.py` with `validate_export()` fix applied (code change required first)

**Missing artifacts (from STEP 14C):**
- `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json` — ABSENT
- `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/artifacts/*.html` — ABSENT
- `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/entities/*.html` — ABSENT
- `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/transformations/*.html` — ABSENT
- `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/navigation/*.html` — ABSENT

**Required scripts:**
1. `scripts/pios/vault_export.py` — must first be patched to remove `len(signals) > 0` requirement from `validate_export()` (approx line 505)
2. `vault_export.py --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run run_01_oss_fastapi`

**Alternative path (from STEP 14C STAGE B):**
> "Manually construct vault_index.json per STEP 14B schema (no validate_export() needed). This is PATH B from STEP 14B-RESET."

The manual construction path bypasses the script fix but still produces the required artifact.

**Blocking gaps:**
GAP-VAULT-01 (resolved by this phase — either via fix or manual construction)

**Exit condition:**
```
app/gauge-product/public/vault/e65d2f0a-dfa7-4257-9333-fcbb583f0880/run_01_oss_fastapi/vault_index.json  EXISTS
```

---

### PHASE 3 — Graph State + Workspace Zones

**Sourced from:** STEP 14C Section 8, STAGE C; Section 3 S-12 and S-17; Section 5 MISS-03; Section 7 CODE table.

**Inputs required:**
- vault_index.json from PHASE 2 — MUST EXIST (PHASE 2 exit condition)
- STEP 14B 4-edit code fix applied to `lens_report_generator.py:3728` (GAP-CODE-01 fix)
- Fix to `zones.js` API to pass `--client`/`--run-id` to `tier2_query_engine.py` (GAP-CODE-02 fix — not yet contracted per STEP 14C)

**Missing artifacts (from STEP 14C):**
- `clients/e65d2f0a.../reports/tier2/graph_state.json` — ABSENT (S-12)
- Second-client zone data from `/api/zones` — DEFECTIVE (returns BlueEdge zones)

**Required scripts:**
1. 4-edit fix to `scripts/pios/lens_report_generator.py` at line 3728 (specified in STEP 14B, referenced in STEP 14C Section 5 MISS-03)
2. `scripts/pios/export_graph_state.mjs --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run-id run_01_oss_fastapi`
3. Fix to `zones.js` API — specification of this fix is **UNKNOWN** (STEP 14C identifies the gap but provides no implementation detail beyond "Pass --client/--run-id through API")

**Blocking gaps resolved:**
GAP-CODE-01 (resolved by lens_report_generator.py fix)
GAP-CODE-02 (resolved by zones.js fix — specification UNKNOWN)

**Exit condition:**
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier2/graph_state.json  EXISTS
/api/zones returns second-client zones (not BlueEdge)
```

---

### PHASE 4 — DIAGNOSTIC Narrative

**Sourced from:** STEP 14C Section 8, STAGE C step C-2; Section 3 S-15; Section 2 DIAGNOSTIC status.

**Inputs required:**
- PHASE 1 complete (EXEC/LENS exist — confirms generator works for second client)
- PHASE 2 complete (vault_index.json exists)
- PHASE 3 complete (GAP-CODE-01 fix applied; graph_state.json generated)
- `canonical_topology.json` — EXISTS ✓
- `signal_registry.json` — EXISTS ✓ (0 signals — renders without signal tier)
- `gauge_state.json` — EXISTS ✓
- `graph_state.json` from PHASE 3 — MUST EXIST

**Missing artifacts (from STEP 14C):**
- `clients/e65d2f0a.../reports/tier2/lens_tier2_diagnostic_narrative.html` — ABSENT
- `clients/e65d2f0a.../reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html` — ABSENT

**Required script:**
`scripts/pios/lens_report_generator.py --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run-id run_01_oss_fastapi`
(Same invocation as PHASE 1; `generate_tier2_reports()` now executes without contamination because GAP-CODE-01 fix routes subprocess to second-client vault.)

**Blocking gaps resolved by prior phases:**
GAP-VAULT-01 (PHASE 2), GAP-CODE-01 (PHASE 3)

**Exit condition:**
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier2/lens_tier2_diagnostic_narrative.html  EXISTS
```

---

### PHASE 5 — Full Signal Parity (Separate contract required)

**Sourced from:** STEP 14C Section 8, STAGE D; Section 5 MISS-01; Section 6 Signal Derivation Truth.

**Status:** BLOCKED — requires new authorized contract.

**Inputs required:**
- Second-client OSS FastAPI source codebase — EXISTS at `clients/e65d2f0a.../input/` ✓
- PiOS 41.4 contract — NOT YET ISSUED

**Missing artifacts:**
- SIG-XXX signal artifact definitions for second-client
- `signal_registry.json` with N signals, `emission_state: ACTIVE`
- Updated vault with signal claim markdown files
- Rebuilt vault_index.json with signals
- Rebuilt graph_state.json with signal nodes

**Required scripts (from STEP 14C):**
1. `scripts/pios/41.4/build_signals.py`
2. Signal emit pipeline (update signal_registry.json)
3. Re-run PHASE 2 (vault_export)
4. Re-run PHASE 3 (graph_state)
5. Re-run PHASE 4 (DIAGNOSTIC)

**Blocking gap:**
GAP-SIGNAL-01 (unresolved until PiOS 41.x contracted)

**Exit condition:**
```
signal_registry.json: emission_state = ACTIVE, signals count > 0
```

---

## Section 4 — Contract Sequence (Execution Order)

| Step | Contract Name | Purpose | Depends On | Gap Resolved | Blocked? |
|------|---------------|---------|------------|--------------|----------|
| 14E | EXEC/LENS Tier-1 Generation | Run `generate_tier1_reports()` for second client; isolate tier2 call | PHASE 1 inputs exist (✓) | GAP-EXEC-01 | NO — all inputs present |
| 14F | vault_export.py Fix + vault_index Build | Patch `validate_export()` OR manually construct vault_index.json per STEP 14B schema | `clients/e65d2f0a.../vaults/run_01_oss_fastapi/` exists (✓) | GAP-VAULT-01 | NO — code change or manual construction |
| 14G | GAP-CODE-01 Code Fix | Apply STEP 14B 4-edit fix to `lens_report_generator.py:3728` | 14F complete (vault_index.json must exist) | GAP-CODE-01 | BLOCKED until 14F |
| 14H | graph_state Generation | Run `export_graph_state.mjs --client <uuid> --run-id run_01_oss_fastapi` | 14F + 14G complete | — (script execution, not a gap fix) | BLOCKED until 14G |
| 14I | zones.js API Fix | Pass `--client`/`--run-id` through zones API to `tier2_query_engine.py` | None (code change) | GAP-CODE-02 | NO — but spec is UNKNOWN per STEP 14C |
| 14J | DIAGNOSTIC Generation | Run `generate_tier2_reports()` for second client with GAP-CODE-01 fix applied | 14F + 14G + 14H complete | GAP-CODE-01 (confirmed resolved) | BLOCKED until 14H |
| 14K | PiOS 41.x — Signal Derivation | Issue and run PiOS 41.4 `build_signals.py` for second-client codebase | Separate new contract | GAP-SIGNAL-01 | BLOCKED — requires new contract authorization |
| 14L | Post-signal Rebuild | Re-run vault + vault_export + graph_state + all deliverables with signals present | 14K complete | GAP-SIGNAL-01 confirmed | BLOCKED until 14K |

---

## Section 5 — 4-BRAIN (Strict)

### CANONICAL

Source: STEP 14C Section 7 CANONICAL.

**Authoritative artifacts per phase:**

| Phase | Authoritative Artifacts (from STEP 14C) |
|-------|----------------------------------------|
| PHASE 1 | `canonical_topology.json` ✓, `signal_registry.json` ✓ (NOT_EVALUATED), `gauge_state.json` ✓ |
| PHASE 2 | `clients/e65d2f0a.../vaults/run_01_oss_fastapi/` (vault markdown — structural claims present, signal claims absent) |
| PHASE 3 | `vault_index.json` (derived from vault markdown; signals: []) |
| PHASE 4 | `graph_state.json` (derived from vault_index; structural nodes only) |
| PHASE 5 | SIG-XXX artifacts from PiOS 41.4 (not yet in existence) |

**Truth boundary (from STEP 14C):** "Second-client canonical truth is correct up to and including S-09 (package). S-11 and beyond are blocked by the 0-signal state."

---

### CODE

Source: STEP 14C Section 7 CODE.

**Known defects (from STEP 14C only):**

| Defect | Location | Description |
|--------|----------|-------------|
| GAP-CODE-01 | `lens_report_generator.py:3728` | `subprocess.run(["node", str(export_script)], check=True)` — no `--client`/`--run-id` passed; defaults to `client="blueedge"`, `runId="run_01_authoritative_generated"` (export_graph_state.mjs:35-36) |
| GAP-VAULT-01 | `vault_export.py:validate_export()` approx line 505 | Requires `len(vi['signals']) > 0`; blocks 0-signal clients |
| GAP-CODE-02 | `tier2_query_engine.py` / `zones.js` API | No `--client` passthrough; always returns BlueEdge canonical_topology |
| Tier2 isolation risk | `lens_report_generator.py:main()` | `main(tier1=True)` calls `generate_tier2_reports()` after `generate_tier1_reports()`; tier2 subprocess behavior under second-client invocation is **UNKNOWN** per STEP 14C |

**Override availability (from STEP 14C):**
- `--client` / `--run-id` args correctly override `CANONICAL_PKG_DIR` and `REPORTS_DIR` via `_configure_runtime()`
- Only GAP-CODE-01 and GAP-CODE-02 have no CLI override available

---

### PRODUCT

Source: STEP 14C Section 7 PRODUCT.

| Deliverable | Available After Phase | Why Not Before |
|-------------|----------------------|----------------|
| EXEC HTML | PHASE 1 | GAP-EXEC-01 — generator never called |
| LENS HTML | PHASE 1 | GAP-EXEC-01 — co-produced with EXEC |
| vault_index.json | PHASE 2 | GAP-VAULT-01 — validate_export() defect |
| graph_state.json | PHASE 3 | GAP-CODE-01 — subprocess missing args; also blocked by PHASE 2 |
| DIAGNOSTIC HTML | PHASE 4 | GAP-VAULT-01 + GAP-CODE-01 — both must resolve first |
| workspace zones (second-client) | PHASE 3 + contract 14I | GAP-CODE-02 — zones API hardcoded to BlueEdge |
| EXEC/LENS with signal tier | PHASE 5 only | GAP-SIGNAL-01 — PiOS 41.x not run |
| DIAGNOSTIC with signal nodes | PHASE 5 only | GAP-SIGNAL-01 — graph_state has 0 signal nodes until 41.x runs |

---

### PUBLISH

Source: STEP 14C Section 7 PUBLISH.

**Safe to show after each phase:**

| After Phase | Safe To Show |
|-------------|-------------|
| PHASE 1 | `lens_tier1_evidence_brief.html` (EXEC) — 0 signals explicitly stated, evidence-correct; `lens_tier1_narrative_brief.html` (LENS) |
| PHASE 2 | vault_index.json — not a client-facing surface; internal artifact |
| PHASE 3 | graph_state.json — not a client-facing surface; powers DIAGNOSTIC |
| PHASE 4 | `lens_tier2_diagnostic_narrative.html` (DIAGNOSTIC) — topology shown, signal tier absent (evidence-correct) |
| PHASE 5 | Full signal-tier EXEC, LENS, DIAGNOSTIC |

**What remains misleading at each phase:**

| After Phase | Still Misleading |
|-------------|-----------------|
| PHASE 1 | CLM-25 placeholder (no verdict) — disclosed via placeholder text ✓; workspace non-functional — must not be linked |
| PHASE 2 | workspace renders BlueEdge zones (GAP-CODE-02 unresolved) |
| PHASE 3 | workspace zones still BlueEdge unless 14I complete |
| PHASE 4 | DIAGNOSTIC graph has 0 signal nodes — must be disclosed; not misleading if labeled correctly |
| PHASE 5 | Nothing remaining — full parity achieved |

---

## Section 6 — STOP / GO Gates

| Phase | GO Condition (exact artifact existence) | STOP Condition (unresolved blocking GAP) |
|-------|----------------------------------------|------------------------------------------|
| PHASE 1 | `clients/e65d2f0a.../package/canonical_topology.json` EXISTS AND `signal_registry.json` EXISTS AND `gauge_state.json` EXISTS | Tier2 subprocess behavior UNKNOWN — execution contract must specify isolation method before run |
| PHASE 2 | `clients/e65d2f0a.../vaults/run_01_oss_fastapi/` EXISTS (vault markdown present) | `validate_export()` defect unpatched AND manual construction not authorized → STOP |
| PHASE 3 | PHASE 2 exit condition met AND `vault_index.json` EXISTS AND GAP-CODE-01 fix applied | PHASE 2 incomplete → STOP; GAP-CODE-01 fix not applied → STOP |
| PHASE 4 | `graph_state.json` EXISTS at `clients/e65d2f0a.../reports/tier2/graph_state.json` | Any of PHASE 1/2/3 exit conditions unmet → STOP |
| PHASE 5 | PiOS 41.x contract issued and executed; `signal_registry.json` updated with signals > 0 | No PiOS 41.x contract → STOP |

---

## Section 7 — Final Parity Definition

Source: Contract requirement.

Parity is ONLY achieved when ALL of the following file paths exist and serve second-client data:

| Condition | Required Path | Populated By |
|-----------|--------------|--------------|
| EXEC exists | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier1/lens_tier1_evidence_brief.html` | PHASE 1 |
| LENS exists | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier1/lens_tier1_narrative_brief.html` | PHASE 1 |
| DIAGNOSTIC exists | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier2/lens_tier2_diagnostic_narrative.html` | PHASE 4 |
| graph_state.json exists for second client | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier2/graph_state.json` | PHASE 3 |
| vault_index.json exists for second client | `app/gauge-product/public/vault/e65d2f0a-dfa7-4257-9333-fcbb583f0880/run_01_oss_fastapi/vault_index.json` | PHASE 2 |
| workspace renders second-client zones | `/api/zones` returns second-client topology (not BlueEdge) | PHASE 3 (contract 14I) |

**Partial parity milestones (from STEP 14C):**
- After PHASE 1: EXEC + LENS exist — Tier-1 deliverables present
- After PHASE 4: All three HTML deliverables exist + graph + vault — Tier-2 present
- After PHASE 5: Full signal-tier parity — identical behavioral surface to BlueEdge

**Full parity (PHASE 5) requires PiOS 41.x contract — not yet issued.**
**Structural parity (PHASES 1–4) is achievable without PiOS 41.x.**

---

## Gaps Not Assigned to a Phase

These gaps are documented in STEP 14C but fall outside the deliverable parity definition. They are not blocking file existence.

| Gap ID | Why Not in a Phase | Status |
|--------|-------------------|--------|
| GAP-01 | CLM-25 renders placeholder — file still exists and is valid; parity definition does not require verdict | Documented defect; future contract |
| DQGAP-01 | CLM-19 fragment quality degrades content but does not block generation | Documented defect; future contract |
| R-05 | 11 structural claims absent from EXEC/LENS render — file still generated; parity definition does not require full claim set | Documented defect; future contract |
