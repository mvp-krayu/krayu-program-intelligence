# STEP 14R — Pipeline Reset Plan (Full Pipeline First)

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14R
**Date:** 2026-04-25
**Branch:** work/psee-runtime
**Source of Truth:** `step14c_reset_full_pipeline_map.md`, `step14e_f_focus_domain_canonicality.md`, `step14e_g_pressure_zone_canonicality.md`

---

## Status

**PLAN COMPLETE** — No code modified. No artifacts generated. Plan only.

---

## Rejection Statement

STEP 14D phases (as executed through STEP 14E-H) are **REJECTED**.

**Reason:** Partial pipeline execution produced structurally inconsistent outputs. EXEC and LENS were generated with `signals: [], emission_state: NOT_EVALUATED` in `signal_registry.json`. The resulting reports contain:
- Hardcoded BlueEdge signal narratives (lines 2141–2218 in `_build_tier1_evidence_brief()`)
- "Pressure zones not yet evaluated" disclosure — accurate as a gap statement but not a valid product output
- Score band [60, 100] spanning a 40-point uncertainty from missing execution evidence

These are not equivalent to BlueEdge outputs where structure, signals, and narrative are coherent and mutually derived. The three deliverables cannot be validated against a pipeline that was only partially run.

**New principle:** Full pipeline must run before any product projection is validated.

---

## Current Pipeline State (Second-Client)

Derived from STEP 14C forensics + STEP 14E-H execution. State as of 2026-04-25.

| Stage | Description | BlueEdge | Second-Client | State |
|-------|-------------|----------|---------------|-------|
| S-01/02 | Intake | ✓ | ✓ | COMPLETE |
| S-03 | Binding | ✓ | ✓ | COMPLETE — 45 nodes, 62 edges, 5 domain telemetry records |
| S-04 | Topology | ✓ | ✓ | COMPLETE — 5 domains, all GROUNDED |
| S-05 | Signal derivation (40.x/41.x) | ✓ (PiOS 40.5-40.7) | ✖ | NOT RUN — 41.4/build_signals.py is BlueEdge-specific |
| S-06 | Vault (markdown) | ✓ | ⚠ | PARTIAL — CLM-01..19, CLM-25..27 have second-client data; CLM-20..24 (signal claims) contain placeholder content ("Signal SIG-XXX not found / NOT_AVAILABLE") |
| S-07 | GAUGE execution | ✓ | ✓ | COMPLETE — score 60/100 (structural only) |
| S-08 | Signal registry | ✓ (5 signals) | ⚠ | NOT_EVALUATED — 0 signals; accurate for pre-41.x state |
| S-09 | Package assembly | ✓ (9 files) | ⚠ | PARTIAL — 5/9 files; engine_state.json, evidence_mapping_index.json, executive_signal_report.md, gauge_inputs.json absent |
| S-10 | Fragment export | ✓ | ⚠ | DONE (non-standard path) — 29 fragments at non-standard location |
| S-11 | Vault export (public) | ✓ | ✖ | BLOCKED — GAP-VAULT-01: validate_export() guard + signal claim content invalid |
| S-12 | Graph state | ✓ | ✖ | BLOCKED — no vault_index.json; GAP-CODE-01 subprocess bug |
| S-13/14 | EXEC + LENS | ✓ | ⚠ | GENERATED (STEP 14E-H) — REJECTED: signal tier absent; hardcoded BlueEdge narrative |
| S-15 | DIAGNOSTIC | ✓ | ✖ | BLOCKED — no graph_state.json |
| S-16 | LENS page (live) | ✓ | ⚠ | PARTIAL — hero band functional; signal sections suppressed |
| S-17 | Tier-2 workspace | ✓ | ✖ | NON-FUNCTIONAL — no public vault |

**Pipeline entry point for reset:** S-05 (signal derivation). All upstream stages (S-01..S-04, S-07) are complete. S-05 is the root unblocked gap.

---

## Known Code Gaps (Referenced in Plan)

| Gap ID | Location | Description |
|--------|----------|-------------|
| GAP-SIGNAL-01 | S-05 | PiOS 41.4/build_signals.py is BlueEdge-specific; no second-client equivalent |
| GAP-VAULT-01 | S-11 `vault_export.py:511` | `validate_export()` checks `len(vi['signals']) == 0`; signal claim content must be valid before this check is meaningful |
| GAP-VAULT-02 | S-06 CLM-20..24 | Signal claims contain placeholder content ("NOT_AVAILABLE"); must be replaced with second-client evidence |
| GAP-CODE-01 | S-12 `lens_report_generator.py:3728` | subprocess call missing `--client`/`--run-id` |
| GAP-CODE-02 | S-17 `zones.js` API | No `--client` passthrough for second-client zone derivation |
| GAP-CODE-04 | S-13 `lens_report_generator.py:2141-2218` | `tier1_signals` list in `_build_tier1_evidence_brief()` is a STATIC hardcoded list of 5 BlueEdge signals; not read from signal_registry.json |

---

## PHASE 0 — Pipeline Reconstruction Mapping

### Objective

Establish the complete, exact execution chain for second-client, mapped stage by stage against BlueEdge. Identify every missing execution step as a named GAP with an entry condition, not an assumption.

### Entry Condition

None. This phase is documentation only — no execution required.

### 4-BRAIN

**CANONICAL:** STEP 14C pipeline map is the canonical reference. Current state table above (this document) updates it to reflect STEP 14E-H execution. Combined state: complete through S-09; S-05 (signals) not run; S-11/S-12/S-15/S-17 blocked downstream.

**CODE:** `41.4/build_signals.py` confirmed BlueEdge-specific (hardcoded DOMAIN-10 references, BlueEdge signal narrative text, `RUN_REFERENCE = "run_01_blueedge"`). Cannot be reused for second-client without authoring a new execution.

**PRODUCT:** No product-usable pipeline output exists beyond structural layer. EXEC/LENS from STEP 14E-H are superseded by this reset plan.

**PUBLISH:** Nothing from STEP 14E-H forward is safe to show as product output until the signal layer is executed.

### Execution Steps

None — this phase is complete via the current state table in this document.

### Exit Condition

The pipeline gap map (above) is the exit artifact. It is accepted when all stages S-01..S-17 have a declared state and every gap has a GAP-ID.

### STOP Criteria

None for this phase.

---

## PHASE 1 — Structural Layer Validation (40.x parity)

### Objective

Confirm that second-client structural artifacts (S-01..S-09) are complete and equivalent in coverage to BlueEdge structural outputs. This is a pre-flight gate before signal derivation begins.

### Entry Condition

Second-client `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/package/` exists with at minimum: `canonical_topology.json`, `coverage_state.json`, `gauge_state.json`, `reconstruction_state.json`, `signal_registry.json`.

**All five files confirmed present. Entry condition: MET (pre-confirmed, no re-execution needed).**

### 4-BRAIN

**CANONICAL:**
Required artifacts (all confirmed present):

| File | Expected | Actual |
|------|----------|--------|
| `canonical_topology.json` | 5 domains, GROUNDED | ✓ — DOM-01..DOM-05, all GROUNDED |
| `signal_registry.json` | `signals: []`, `NOT_EVALUATED` | ✓ — accurate pre-41.x state |
| `gauge_state.json` | score 60/100, SPLIT band | ✓ — canonical=60, projected=100 |
| `coverage_state.json` | coverage_percent=100.0 | ✓ |
| `reconstruction_state.json` | state=PASS, all axes | ✓ |
| `binding_envelope.json` | nodes, edges, telemetry | ✓ — 45 nodes, 62 edges, 30 surfaces, 5 telemetry records, 5 L1-ST signals |

Absent auxiliary files (engine_state.json, evidence_mapping_index.json, executive_signal_report.md, gauge_inputs.json) are not required by the report generator. GAP is noted but not blocking.

**CODE:** `_configure_runtime()` in `lens_report_generator.py` correctly resolves `CANONICAL_PKG_DIR` from `--client`/`--run-id` args. No structural code gap.

**PRODUCT:** Structural layer is complete. It is the valid input basis for Phase 2.

**PUBLISH:** No publishable output from structural layer alone (without signals, reports are incomplete).

### Execution Steps

**P1-1:** Read `canonical_topology.json` — confirm 5 domains, all GROUNDED.
**P1-2:** Read `signal_registry.json` — confirm `emission_state: NOT_EVALUATED`, `signals: []`.
**P1-3:** Read `gauge_state.json` — confirm `score.canonical: 60`, `score.band_label: CONDITIONAL`.
**P1-4:** Read `binding_envelope.json` — confirm nodes ≥ 1, edges ≥ 1, domain_telemetry present.

All reads are validation only. No writes.

### Exit Condition

All 5 package files present. `canonical_topology.json` has ≥ 1 domain. `binding_envelope.json` has non-empty nodes. Exit artifact: validation log in governance trace.

### STOP Criteria

STOP if any required package file is absent or has schema violation. STOP if `canonical_topology.json` domains list is empty.

---

## PHASE 2 — Signal Layer Execution (41.x)

### Objective

Derive intelligence signals for second-client from structural evidence in `binding_envelope.json`. Produce a non-empty `signal_registry.json` with `emission_state: ACTIVE`. This phase requires a new authorized contract — it cannot be executed within STEP 14R.

### Entry Condition

Phase 1 complete. `binding_envelope.json` present with non-empty nodes, edges, domain_telemetry.

### 4-BRAIN

**CANONICAL:**
Available structural evidence for signal derivation:
- 45 structural nodes (capability/component level)
- 62 structural edges (containment + dependency)
- 5 domain telemetry records: DOM-01: 3 files, DOM-02: 4 files, DOM-03: 397 files, DOM-04: 324 files, DOM-05: 741 files
- L1-ST signals: module_count=63, file_count per surface (397, 324, 741), pwa_enabled=true
- 30 capability surfaces with path patterns and containment basis
- 5 domains, all GROUNDED (no weakly-grounded domains — contrast with BlueEdge which had 3 WEAKLY GROUNDED)

Derivable intelligence signals (evidence present in binding layer):
- **Dependency load / structural density:** edge_count/node_count = 62/45 = 1.378 (structural fact, computable)
- **Scale distribution asymmetry:** DOM-05 has 741 files vs DOM-01 at 3 files — 247× ratio (structural fact, computable)
- **Execution unknown-space:** 0 of N runtime dimensions evaluated (execution_layer_evaluated=false in gauge_state)
- **Coordination topology:** 30 surfaces across 5 domains with containment depth computable from binding edges

Second-client has NO DOMAIN designated as weakly-grounded. This means signal convergence on a "focus domain" (as in BlueEdge DOMAIN-10) does not apply — all domains are GROUNDED. The signal pattern will differ from BlueEdge's.

**CODE:**
- `41.4/build_signals.py` CANNOT be used: hardcodes BlueEdge DOMAIN-10, BlueEdge vault references, BlueEdge signal text.
- A new second-client signal derivation script must be authored. Suggested location: `scripts/pios/41.4/build_signals_second_client.py` (or new stream designation).
- Output must write to `--output-dir` (not directly to package/); subject to `parity_check.py` before canonical promotion.
- After canonical promotion: `signal_registry.json` must be updated in `clients/e65d2f0a.../package/` and `gauge_state.json` recomputed (execution layer evaluation required to close the 60-100 band).

**PRODUCT:**
- Signal tier cannot exist for second-client without this phase
- `tier1_signals` static list in `_build_tier1_evidence_brief()` (GAP-CODE-04, lines 2141-2218) must be replaced with data-driven rendering from `signal_registry.json`
- This is a PREREQUISITE for valid EXEC/LENS output

**PUBLISH:**
- No signals = no signal tier in reports = structurally incomplete deliverables
- "Pressure zones not yet evaluated" in current EXEC/LENS is accurate but product-incomplete

### Execution Steps

**P2-1:** Issue new contract: `PI.SECOND-CLIENT.SIGNAL-DERIVATION.41X.01`
- Input: `binding_envelope.json`, `canonical_topology.json`
- Output: SIG-XXX artifact definitions for second-client (targeting 3-5 signals based on available structural evidence)
- Script: new `build_signals_second_client.py` (to be authored in contract)
- Output dir: `--output-dir /tmp/pios_second_client_signals/`

**P2-2:** Run parity check against output.

**P2-3:** With explicit authorization: promote canonical output to `clients/e65d2f0a.../package/signal_registry.json`.

**P2-4:** Update CLM-20..24 (or create new CLM-XX) in vault with second-client signal content (replacing "NOT_AVAILABLE" placeholders with derived signal evidence).

**P2-5:** Recompute `gauge_state.json` with non-empty signal_registry if GAUGE execution layer is available (or update band/score per GAUGE computation contract with new signal inputs).

### Exit Condition

`signal_registry.json` has `total_signals ≥ 1`, `emission_state: ACTIVE`. Signal claims in vault (CLM-XX) have non-placeholder content derived from second-client binding evidence. Parity check passes.

### STOP Criteria

STOP if any signal content is derived from BlueEdge artifacts. STOP if signal values are invented (not computable from structural evidence). STOP if `parity_check.py` fails. STOP if phase scope exceeds structural intelligence derivation.

### Authorization Required

**This phase CANNOT execute within STEP 14R.** A separate contract (`PI.SECOND-CLIENT.SIGNAL-DERIVATION.41X.01`) must be issued and accepted before P2-1 begins.

---

## PHASE 3 — Vault Materialization

### Objective

Run `vault_export.py` for second-client with valid signal content to produce `vault_index.json` at the correct public path. Resolve GAP-VAULT-01 correctly (not by bypassing the guard, but by satisfying it with real signal claims).

### Entry Condition

Phase 2 complete. `signal_registry.json` has `total_signals ≥ 1`. Signal claims in vault (CLM-XX) have non-placeholder content — `claim_type: signal` present in vault frontmatter with valid derivation text.

### 4-BRAIN

**CANONICAL:**
- Vault source: `clients/e65d2f0a.../vaults/run_01_oss_fastapi/`
- Claims present: CLM-01..27 (after Phase 2 updates CLM-20..24 with real content)
- Output: `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json`
- vault_index.json structure: `signals` dict (SIG-XXX → CLM-XX), `claims` dict, `artifacts` dict, `entities` dict

**CODE:**
- `vault_export.py` is parameterized: `--client <uuid> --run run_01_oss_fastapi`
- `validate_export()` at line 511: `len(vi['signals']) == 0` — this will PASS after Phase 2 (signal claims with `claim_type: signal` in vault produce the signal_to_claim dict)
- No code changes required if Phase 2 vault claims are correct. If validate_export() still fails due to claim count or artifact count guards (lines 507-510: ≥27 claims, ≥7 artifacts), these must be diagnosed and resolved without bypassing.
- Current second-client vault: CLM-01..27 (27 claims — exactly at the ≥27 threshold)

**PRODUCT:**
- `vault_index.json` is the prerequisite for S-12 (graph state) and S-17 (Tier-2 workspace)
- Without this file, the DIAGNOSTIC and workspace cannot be constructed

**PUBLISH:**
- vault_index.json itself is not client-facing, but it gates all Tier-2 exposure

### Execution Steps

**P3-1:** Run `python3 scripts/pios/vault_export.py --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run run_01_oss_fastapi`.

**P3-2:** Verify `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json` exists.

**P3-3:** Verify `vault_index.json` structure: `signals` dict non-empty, `claims` dict ≥ 27 entries, `artifacts` dict present.

**P3-4:** If `validate_export()` fails: diagnose which guard triggered. If claims < 27: vault claim count defect — return to Phase 2 or vault repair. If signals == 0: Phase 2 did not produce valid signal claims — return to Phase 2. Do NOT patch the guard out.

### Exit Condition

`vault_index.json` present at correct public path. `validate_export()` passes without modification. `signals` dict non-empty. `claims` dict ≥ 27.

### STOP Criteria

STOP if `validate_export()` is bypassed rather than satisfied. STOP if `vault_index.json` contains BlueEdge client_id or BlueEdge signal IDs derived from BlueEdge evidence. STOP if execution writes to `clients/blueedge/`.

---

## PHASE 4 — Graph Construction

### Objective

Build `graph_state.json` for second-client from its `vault_index.json`. This pre-computes d3-force-3d node positions for the DIAGNOSTIC report. Fix GAP-CODE-01 (subprocess missing `--client`/`--run-id`) before or during this phase.

### Entry Condition

Phase 3 complete. `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json` exists with non-empty `signals` and `artifacts`.

### 4-BRAIN

**CANONICAL:**
- Input: `vault_index.json` (from Phase 3)
- Script: `scripts/pios/export_graph_state.mjs`
- Script already supports `--client`/`--run-id` args (lines 38-41)
- Output: `clients/e65d2f0a.../reports/tier2/graph_state.json`
- Node types expected: ZONE (hub: ZONE-01), SIGNAL (SIG-XXX), CLAIM (CLM-XX for each signal), ARTIFACT (ART-XX)
- Node count: 1 (hub) + N signals + N signal claims + M artifacts (determined by vault_index.json)

**CODE:**
- GAP-CODE-01 fix required: `lens_report_generator.py:3728` currently calls `subprocess.run(["node", str(export_script)], check=True)` without `--client`/`--run-id`
- Fix: pass `_client` and `_run_id` module globals (set in `_configure_runtime()`) as subprocess args
- After fix: subprocess call becomes `subprocess.run(["node", str(export_script), "--client", _client, "--run-id", _run_id], check=True)`
- `export_graph_state.mjs` can also be called directly (not via generator subprocess) if preferred

**PRODUCT:**
- `graph_state.json` is consumed by `_build_tier2_diagnostic_narrative()` (DIAGNOSTIC builder)
- Without it, DIAGNOSTIC renders without the graph visualization

**PUBLISH:**
- `graph_state.json` feeds the Tier-2 workspace visual — no direct publish exposure

### Execution Steps

**P4-1:** Apply GAP-CODE-01 fix to `lens_report_generator.py:3728` — add `--client`, `--run-id` args to subprocess call.

**P4-2:** Run `node scripts/pios/export_graph_state.mjs --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run-id run_01_oss_fastapi`.

**P4-3:** Verify `clients/e65d2f0a.../reports/tier2/graph_state.json` exists.

**P4-4:** Verify node structure: ZONE-01 hub present, signal nodes match SIG-XXX from `vault_index.json`, no BlueEdge node IDs.

### Exit Condition

`graph_state.json` present. Node count ≥ 1. All node IDs derived from second-client `vault_index.json`. No DOMAIN-10 or BlueEdge artifacts in node list.

### STOP Criteria

STOP if `graph_state.json` contains BlueEdge node IDs. STOP if script falls back to `client="blueedge"` default. STOP if `vault_index.json` is not present (Phase 3 not complete).

---

## PHASE 5 — Report Generation (Full)

### Objective

Generate all three deliverables (EXEC, LENS, DIAGNOSTIC) from the complete second-client pipeline. Report content must be derived from second-client evidence. No hardcoded BlueEdge narratives in output.

### Entry Condition

Phases 1-4 complete. Required inputs all present:
- `canonical_topology.json` (Phase 1) ✓ (pre-confirmed)
- `signal_registry.json` with `total_signals ≥ 1` (Phase 2)
- `gauge_state.json` updated post-signals (Phase 2)
- `vault_index.json` (Phase 3)
- `graph_state.json` (Phase 4)

### 4-BRAIN

**CANONICAL:**
- All three required generator inputs must be second-client-specific and non-empty on signal tier

**CODE:**
Additional code fixes required before EXEC/LENS are valid product outputs:

| Gap | Location | Required Fix |
|-----|----------|--------------|
| GAP-CODE-04 | `lens_report_generator.py:2141-2218` | `tier1_signals` static list — replace hardcoded BlueEdge signal cards with data-driven rendering from `signal_registry.json` |
| GAP-CODE-04b | `_build_tier1_narrative_brief()` Section 01/02 | Hardcoded BlueEdge signal narrative text must be replaced with evidence-derived or signal_registry-driven content |
| GAP-CODE-03 | Line 2222 | Already fixed (STEP 14E-H) — `next(..., None)` in place |
| `client_name` cosmetic | Lines 2090, 2468 | `client_name` hardcodes "BlueEdge Fleet Management Platform" when `publish_safe=False` — must not appear in second-client output |

**PRODUCT:**
- EXEC deliverable: topology + gauge score + domain grid + signal cards (real second-client signals) + pressure zone block (meaningful once focus domain parameterized, or explicitly "None designated")
- LENS deliverable: narrative interpretation of second-client evidence including real signal narrative
- DIAGNOSTIC deliverable: zone analysis from `_derive_tier2_zones()` (with real signals, focus domain may be determinable), graph visualization from `graph_state.json`

**PUBLISH:**
- Internal variants (`publish_safe=False`): must not contain "BlueEdge Fleet Management Platform"
- Publish variants (`publish_safe=True`): must contain only obfuscated/generic client language

### Execution Steps

**P5-1:** Apply GAP-CODE-04 fix: refactor `tier1_signals` in `_build_tier1_evidence_brief()` to read from `signal_registry.json` instead of static list.

**P5-2:** Apply cosmetic fix to `client_name` hardcoding (lines 2090, 2468).

**P5-3:** Apply GAP-CODE-04b: make LENS narrative Section 01/02 data-driven from signal_registry.

**P5-4:** Run full pipeline: `python3 scripts/pios/lens_report_generator.py --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run-id run_01_oss_fastapi` (no `--deliverable` selector — all deliverables).

**P5-5:** Validate all 6 artifacts present (EXEC + EXEC-pub + LENS + LENS-pub + DIAGNOSTIC + DIAGNOSTIC-pub).

**P5-6:** Validate: no BlueEdge signal IDs in output; no "BlueEdge Fleet Management Platform" in output; signal cards show second-client signals; DIAGNOSTIC graph renders second-client nodes.

### Exit Condition

All 6 HTML artifacts present. Signal tier rendered from second-client `signal_registry.json`. No BlueEdge content in any output. `generate_tier2_reports()` exits 0.

### STOP Criteria

STOP if any output contains BlueEdge domain IDs (DOMAIN-01..17) or BlueEdge signal IDs from the static list. STOP if EXEC signal section renders the hardcoded BlueEdge tier1_signals list. STOP if DIAGNOSTIC graph contains BlueEdge nodes.

---

## PHASE 6 — Projection / Product Gating

### Objective

Enable live LENS page and Tier-2 workspace for second-client. Define commercial exposure boundaries. This phase gates Tier-1 / Tier-2 / workspace surface from full pipeline outputs.

### Entry Condition

Phase 5 complete. All 6 HTML artifacts valid. `vault_index.json` and `graph_state.json` present.

### 4-BRAIN

**CANONICAL:**
- Fragment export (S-10): re-run with standard vault path convention to fix MISS-04
- vault_index.json already present (Phase 3)

**CODE:**
- GAP-CODE-02: `zones.js` API must pass `--client`/`--run-id` to `tier2_query_engine.py` for second-client zone derivation
- Fragment path resolution: `FRAGMENTS_DIR` default resolves to BlueEdge path; second-client fragments at non-standard location must be re-exported to standard path OR `--fragments-dir` must be configured in `.env.local`
- Tier-2 workspace: `vault_index.json` path must be parameterized per client (currently BlueEdge default in workspace.js API)

**PRODUCT:**
- LENS page live: CLM-09/10/12 hero band already functional (confirmed STEP 11B); signal sections (B/C/D suppressed via R-03) become active once signals exist
- Tier-2 workspace: requires vault_index.json + graph_state.json + zones API fix (GAP-CODE-02)
- Commercial gating: define which surfaces require publish_safe=True

**PUBLISH:**
- LENS page: signal section exposure controlled by `R-03` suppression (currently `GAP_01_RESOLVED=False` in concepts.json) — must be set to True once signals are validated
- Tier-2 workspace: define access boundary for second-client (open / gated / internal-only)
- Commercial documents (`docs/commercial/`) reference "pressure zones" as generic product feature — once second-client pressure zone is absent or redefined, commercial copy may need alignment note

### Execution Steps

**P6-1:** Fix GAP-CODE-02: `zones.js` API pass-through for `--client`/`--run-id`.

**P6-2:** Re-export fragments to standard vault path: `python3 scripts/pios/projection_runtime.py export-fragments --client <uuid> --run run_01_oss_fastapi` (standard output path).

**P6-3:** Update `.env.local` `PROJECTION_FRAGMENTS_DIR` or runtime config for second-client fragment path.

**P6-4:** Update `concepts.json` `GAP_01_RESOLVED` to `true` once signal section is verified.

**P6-5:** Validate LENS page signal sections render second-client evidence.

**P6-6:** Validate Tier-2 workspace shows second-client graph topology.

### Exit Condition

LENS page: all sections (A–D) functional with second-client evidence. Tier-2 workspace: shows second-client zone graph. No BlueEdge defaults in any live runtime surface.

### STOP Criteria

STOP if LENS page renders BlueEdge signal content. STOP if Tier-2 workspace defaults to BlueEdge vault. STOP if zones API returns BlueEdge zone data for second-client requests.

---

## Critical Path Summary

```
PHASE 1 (validation only — pre-confirmed) ← already done
   ↓
PHASE 2 (requires new contract: PI.SECOND-CLIENT.SIGNAL-DERIVATION.41X.01)
   ↓
PHASE 3 (vault_export — executable after Phase 2; no code changes required if signal claims valid)
   ↓
PHASE 4 (graph_state — GAP-CODE-01 fix + export_graph_state.mjs run)
   ↓
PHASE 5 (full reports — GAP-CODE-04 + cosmetic fix + generator run)
   ↓
PHASE 6 (live runtime — GAP-CODE-02 + fragment path + concepts.json)
```

**Rate-limiting step:** Phase 2 is the gate. It requires a separate authorized contract for second-client signal derivation. No subsequent phase can begin without it.

---

## Gap Register (Consolidated)

| Gap ID | Stage | Phase | Description | Fix Type |
|--------|-------|-------|-------------|----------|
| GAP-SIGNAL-01 | S-05 | 2 | 41.4/build_signals.py BlueEdge-specific; no second-client equivalent | New contract |
| GAP-VAULT-02 | S-06 | 2 | CLM-20..24 have "NOT_AVAILABLE" placeholder content | Replace content in Phase 2 |
| GAP-VAULT-01 | S-11 | 3 | validate_export() guard — will pass after Phase 2; no code bypass | Satisfied by Phase 2 |
| GAP-CODE-01 | S-12 | 4 | subprocess missing `--client`/`--run-id` | Code fix — minimal (1 line) |
| GAP-CODE-04 | S-13 | 5 | `tier1_signals` hardcoded BlueEdge list | Code fix — refactor to data-driven |
| GAP-CODE-04b | S-14 | 5 | LENS narrative hardcoded BlueEdge text | Code fix |
| Cosmetic-01 | S-13/14 | 5 | `client_name` hardcodes "BlueEdge Fleet Management Platform" | Code fix |
| GAP-CODE-02 | S-17 | 6 | zones.js no --client passthrough | Code fix |
| MISS-04 | S-10 | 6 | Fragment path non-standard | Re-export to standard path |
