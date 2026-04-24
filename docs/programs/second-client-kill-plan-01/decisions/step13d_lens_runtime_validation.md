# STEP 13D — LENS Runtime Validation

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 13D
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**FAIL-STOP** — Report generator default execution path writes to `clients/blueedge/reports/`. Validation NOT accepted. Immediate stop on generator run.

---

## Failure Description

### What Happened

STEP 13D executed the report generator with the command specified in the contract:

```bash
python3 scripts/pios/lens_report_generator.py \
  --claims CLM-09 CLM-25 CLM-12 CLM-10 \
  --fragments-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi
```

The generator ran without crash (CLM-20 KeyError fix confirmed working) but the **default execution mode** (`tier1=True`) invoked `generate_tier1_reports()` and `generate_tier2_reports()` — not `_main_legacy()` / `build_html()`.

### Consequence 1 — Wrong output path

Without `--client`, `_configure_runtime()` defaulted to `client="blueedge"`. All output was written to:
```
clients/blueedge/reports/tier1/lens_tier1_evidence_brief.html
clients/blueedge/reports/tier1/publish/lens_tier1_evidence_brief_pub.html
clients/blueedge/reports/tier1/lens_tier1_narrative_brief.html
clients/blueedge/reports/tier1/publish/lens_tier1_narrative_brief_pub.html
clients/blueedge/reports/tier2/graph_state.json        ← TRACKED file
clients/blueedge/reports/tier2/lens_tier2_diagnostic_narrative.html  ← TRACKED file
clients/blueedge/reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html  ← TRACKED file
```

Three tier2 files are **tracked** in git. They were overwritten by the failed run, then deleted during cleanup (by mistake), then **restored via `git restore`**. Working state is now clean.

### Consequence 2 — Patched code path not exercised

`compose_key_findings` and `compose_executive_summary` are called only from `build_html()` → `_main_legacy()`. The default tier1/tier2 mode calls `_build_tier1_evidence_brief()`, `_build_tier1_narrative_brief()`, and `_build_tier2_diagnostic_narrative()` — entirely separate rendering functions. The R-04 and R-02 patches to `compose_key_findings` and `compose_executive_summary` were **not exercised** by this run.

### Consequence 3 — `generate_tier2_reports()` uses `CANONICAL_PKG_DIR`

`generate_tier2_reports()` calls `load_canonical_topology()`, `load_signal_registry()`, and `load_gauge_state()` from `CANONICAL_PKG_DIR` (BlueEdge package directory). The `--fragments-dir` override does not affect these paths. The tier2 report is not fragment-based — it reads from BlueEdge canonical package.

---

## Recovery Actions

| Action | Result |
|--------|--------|
| `git status --short` | Three tier2 files showed as deleted (D) — confirmed tracked |
| `git restore` tier2 tracked files | RESTORED — working state clean |
| Remove gitignored tier1 report files (untracked) | REMOVED (4 files, gitignored) |
| Final `git status --short` | Only second-client untracked directories (correct) |

---

## Validation NOT Accepted

The following validations from STEP 13D were NOT performed:
- No confirmation that second-client Hero band loads CLM-09/10/12 from fragments
- No confirmation that CLM-25 renders placeholder in the report
- No confirmation that `compose_key_findings` GAP_01_RESOLVED gate fires correctly
- No confirmation that `compose_executive_summary` signal sentence is suppressed
- `--legacy` mode not run (not authorized in recovery)

---

## 4-BRAIN Summary

### CANONICAL

Fragment files for second-client are present and correct (30 files, confirmed in earlier steps). No fragment data was corrupted by the failed run.

### CODE

Two code paths exist in `lens_report_generator.py`:
1. **Default path** (`tier1=True`): `generate_tier1_reports()` + `generate_tier2_reports()` — reads from `CANONICAL_PKG_DIR`; writes to `clients/<client>/reports/`. This path was inadvertently exercised.
2. **Legacy path** (`--legacy`): `_main_legacy()` → `build_html(payloads)` → calls `compose_key_findings`, `compose_executive_summary`. This is the path containing the R-04 and R-02 patches. **Not exercised in this step.**

The default path does not read from `--fragments-dir` in its tier2 section. Passing `--fragments-dir` without `--legacy` does not route execution through the patched functions.

The STEP 13D contract command did not include `--legacy`. The contract command is therefore insufficient to exercise the patched code path.

### PRODUCT

Report generator validation cannot be accepted. The behavior of the patched functions under second-client conditions has not been verified.

The live LENS page validation (projection API + `lens.js` GAP_01_RESOLVED gate) also remains unperformed — no dev server was started.

### PUBLISH

No report output from this validation run survives. All generated files removed or restored. No BlueEdge content was published.

---

## Root Cause

`lens_report_generator.py` has two distinct execution modes with different code paths. The report generator contract in STEP 13B was written targeting `_main_legacy()` / `build_html()`. The STEP 13D validation command did not include `--legacy`, routing execution through the wrong mode.

Additionally, the default mode writes to `clients/<client>/reports/` using the default `client="blueedge"` when `--client` is not supplied — creating BlueEdge-path side effects.

---

## Next Required Chunk

**STEP 13D-F — Report Generator BlueEdge Path Forensics**

Scope:
1. Map all code paths in `lens_report_generator.py` that write to `clients/blueedge/reports/` or `CANONICAL_PKG_DIR`
2. Define the correct invocation pattern to exercise the patched `build_html()` / `_main_legacy()` path for second-client validation
3. Define the `--legacy` flag behavior and whether it is safe to use for second-client validation
4. Establish safe validation command that:
   - Does not write to BlueEdge paths
   - Exercises the patched `compose_key_findings` / `compose_executive_summary` functions
   - Does not require running the full tier1/tier2 pipeline

**`--legacy` mode is NOT pre-authorized.** Authorization required in STEP 13D-F contract before use.
