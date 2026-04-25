# STEP 14E — Phase 1 Execution Trace

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14E
**Date:** 2026-04-25
**Branch:** work/psee-runtime
**Source of Truth:** `docs/programs/second-client-kill-plan-01/decisions/step14d_staged_recovery_plan.md`

---

## Status

**FAIL-STOP** — STEP 14D Section 6 Phase 1 STOP gate triggered before execution. No generator invoked. No Phase 1 artifacts produced. No BlueEdge paths modified.

---

## STEP 14D References Used

- Section 3 PHASE 1 — inputs, missing artifacts, required script, execution risk, exit condition
- Section 5 CANONICAL — authoritative artifacts for Phase 1
- Section 5 CODE — known defects, tier2 isolation risk
- Section 5 PRODUCT — Phase 1 deliverable definition
- Section 5 PUBLISH — Phase 1 safe-to-show / misleading constraints
- Section 6 PHASE 1 — GO condition, STOP condition

---

## Pre-Run Gate Check (STEP 14D Section 6 PHASE 1)

### GO Condition Evaluation

Required: all three package files must exist.

| File | Path | Result |
|------|------|--------|
| canonical_topology.json | `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/package/canonical_topology.json` | EXISTS (3255 bytes) |
| signal_registry.json | `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/package/signal_registry.json` | EXISTS (2312 bytes) |
| gauge_state.json | `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/package/gauge_state.json` | EXISTS (6173 bytes) |

**GO condition: MET**

---

### STOP Condition Evaluation

STEP 14D Section 6 PHASE 1 STOP condition:
> "Tier2 subprocess behavior UNKNOWN — execution contract must specify isolation method before run"

**STOP condition trigger assessment:**

1. **Isolation method not specified in STEP 14E.** The execution contract (STEP 14E) states "Execute STEP 14D Phase 1 only" and "Do NOT execute Phase 2, Phase 3, Phase 4, or Phase 5" but does not specify HOW to prevent `generate_tier2_reports()` from executing. The STOP condition explicitly requires the execution contract to specify isolation method. STEP 14E does not. STOP condition triggered.

2. **Tier2 subprocess behavior is now KNOWN — not UNKNOWN.** Direct code inspection resolves the STEP 14D uncertainty:

   **`lens_report_generator.py:3725-3731`:**
   ```python
   graph_state_path = output_dir / "graph_state.json"
   export_script = REPO_ROOT / "scripts" / "pios" / "export_graph_state.mjs"
   try:
       subprocess.run(["node", str(export_script)], check=True)
   except (subprocess.CalledProcessError, FileNotFoundError) as e:
       _fail(f"export_graph_state.js failed: {e}")
   ```

   **`export_graph_state.mjs:35-51`:**
   ```javascript
   let _client = "blueedge";
   let _runId  = "run_01_authoritative_generated";
   // ... no args from subprocess call ...
   const OUTPUT_PATH = join(REPO_ROOT, "clients", _client, "reports", "tier2", "graph_state.json");
   ```

   **Confirmed execution chain when subprocess is called without args:**
   - `_client = "blueedge"` (default)
   - `VAULT_INDEX_PATH = app/gauge-product/public/vault/blueedge/run_01_authoritative_generated/vault_index.json`
   - This file EXISTS (confirmed: 2808 bytes)
   - `OUTPUT_PATH = clients/blueedge/reports/tier2/graph_state.json`
   - Subprocess SUCCEEDS (exit 0)
   - BlueEdge `clients/blueedge/reports/tier2/graph_state.json` is OVERWRITTEN

3. **Three concrete violations if execution proceeds:**

   | Violation | Rule Triggered |
   |-----------|----------------|
   | Subprocess overwrites `clients/blueedge/reports/tier2/graph_state.json` | "Do NOT touch clients/blueedge/" |
   | `generate_tier2_reports()` produces `lens_tier2_diagnostic_narrative.html` at second-client path | "Do NOT execute Phase 4" / "STOP if execution leaves Phase 1" |
   | `generate_tier2_reports()` produces `lens_tier2_diagnostic_narrative_pub.html` at second-client path | Same |

   Additionally:
   - Python code reads `graph_state_path = output_dir / "graph_state.json"` = `clients/e65d2f0a.../reports/tier2/graph_state.json` — this path DOES NOT EXIST (subprocess wrote to BlueEdge path, not second-client path)
   - Therefore `graph_state = None` is passed to `_build_tier2_diagnostic_narrative()`
   - DIAGNOSTIC is produced with missing graph state — a Phase 4 artifact generated in a degraded state, outside Phase 1 scope

**STOP condition: TRIGGERED**

---

## Execution Decision

**NO EXECUTION.** Both trigger conditions for STOP are present:
1. Isolation method not specified in STEP 14E (gate requirement not met)
2. Tier2 behavior is known to cause: BlueEdge write + Phase 4 artifact production + Phase 1 boundary violation

Per STEP 14D Section 6: "STOP condition: unresolved blocking GAP → No qualitative judgment allowed."
Per STEP 14E: "STOP if execution leaves Phase 1." / "Do NOT suppress failures." / "Persist trace whether PASS or FAIL-STOP."

---

## Artifacts Produced

**None.** No generator was invoked. No HTML files were created.

Current state of Phase 1 target paths:

| Expected Artifact | Path | Status |
|-------------------|------|--------|
| EXEC HTML | `clients/e65d2f0a.../reports/tier1/lens_tier1_evidence_brief.html` | ABSENT (unchanged) |
| LENS HTML | `clients/e65d2f0a.../reports/tier1/lens_tier1_narrative_brief.html` | ABSENT (unchanged) |
| EXEC pub | `clients/e65d2f0a.../reports/tier1/publish/lens_tier1_evidence_brief_pub.html` | ABSENT (unchanged) |
| LENS pub | `clients/e65d2f0a.../reports/tier1/publish/lens_tier1_narrative_brief_pub.html` | ABSENT (unchanged) |

---

## 4-BRAIN Execution Summary (from STEP 14D Phase 1 context)

### CANONICAL (from STEP 14D Section 5)

Authoritative artifacts for Phase 1 are confirmed present:
- `canonical_topology.json` ✓
- `signal_registry.json` ✓ (0 signals, NOT_EVALUATED)
- `gauge_state.json` ✓

No canonical mutation occurred. Evidence base unchanged.

### CODE (from STEP 14D Section 5)

Known defect GAP-CODE-01 (`lens_report_generator.py:3728` — subprocess missing `--client`/`--run-id`) was the trigger for the STOP. Direct inspection confirmed the exact execution path:
- subprocess writes to `clients/blueedge/reports/tier2/graph_state.json` (not second-client path)
- Python reads from `clients/e65d2f0a.../reports/tier2/graph_state.json` (does not exist → `graph_state=None`)

Tier2 isolation risk (STEP 14D Section 5 CODE) is now resolved from UNKNOWN to KNOWN:
- Subprocess exits 0 (BlueEdge vault_index.json present)
- Three rule violations would occur if execution proceeded without isolation
- Isolation requires code change (not achievable via CLI args alone)

### PRODUCT (from STEP 14D Section 5)

Phase 1 deliverables (EXEC + LENS) remain absent. Phase 1 exit condition NOT met:
- `clients/e65d2f0a.../reports/tier1/lens_tier1_evidence_brief.html` DOES NOT EXIST
- `clients/e65d2f0a.../reports/tier1/lens_tier1_narrative_brief.html` DOES NOT EXIST

### PUBLISH (from STEP 14D Section 5)

No new publishable artifacts. Current demo artifact (`/tmp/lens_structural_slice_test.html` from STEP 13D-G) remains the only second-client safe-to-show surface. Constraints unchanged from STEP 14D.

---

## Validation Against STEP 14D GO / STOP Gates

| Gate | Condition | Result |
|------|-----------|--------|
| PHASE 1 GO | canonical_topology.json EXISTS AND signal_registry.json EXISTS AND gauge_state.json EXISTS | MET |
| PHASE 1 STOP | Tier2 subprocess behavior UNKNOWN — execution contract must specify isolation method before run | TRIGGERED |

Per Section 6: "STOP condition: unresolved blocking GAP" — STOP takes precedence over GO.

---

## Phase 1 Exit Condition Result

**NOT MET.**

STEP 14D Section 3 PHASE 1 exit condition:
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier1/lens_tier1_evidence_brief.html  EXISTS
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier1/lens_tier1_narrative_brief.html  EXISTS
```

Neither file exists. Execution was not attempted.

---

## Root Cause and Resolution Path

**Root cause:** The CLI invocation of `lens_report_generator.py` (as specified in STEP 14D Phase 1) always executes `main(tier1=True)` which calls both `generate_tier1_reports()` and `generate_tier2_reports()`. There is no CLI flag to run tier1 without tier2. Tier2 isolation is only achievable via code change.

**Two resolution paths available (both require code change — from STEP 14C STAGE A note):**

| Option | Description | Code Change Required |
|--------|-------------|----------------------|
| A | Add try/except around `generate_tier2_reports()` call in `main()` so tier2 failure does not abort execution | Yes — `lens_report_generator.py:main()` |
| B | Add `--tier1-only` CLI flag (or equivalent) to suppress tier2 invocation | Yes — `lens_report_generator.py` argparser |

**Neither option is authorized in STEP 14D Phase 1.** STEP 14D Phase 1 says: "Note on isolation: ...must be handled — either via try/except in the generator, or by running tier1 only." But STEP 14E says: "Do NOT patch code unless STEP 14D Phase 1 explicitly requires it." STEP 14D Phase 1 identifies the risk and requires handling but does not authorize a specific code patch.

**Resolution requires:** A new contract (STEP 14E-R or equivalent) that explicitly authorizes and specifies one of the two isolation options, then re-authorizes Phase 1 execution.

---

## Next Phase Readiness

**Phase 1 is NOT complete.** Phase 2 remains blocked (same state as STEP 14D). All downstream phases blocked.

| Phase | Status | Blocker |
|-------|--------|---------|
| PHASE 1 | NOT COMPLETE | Tier2 isolation not authorized/specified; STOP gate triggered |
| PHASE 2 | BLOCKED | Awaits PHASE 1 completion (and GAP-VAULT-01 resolution) |
| PHASE 3 | BLOCKED | Awaits PHASE 2 |
| PHASE 4 | BLOCKED | Awaits PHASES 1+2+3 |
| PHASE 5 | BLOCKED | PiOS 41.x not contracted |
