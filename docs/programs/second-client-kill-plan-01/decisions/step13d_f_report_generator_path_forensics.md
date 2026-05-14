# STEP 13D-F — Report Generator BlueEdge Path Forensics

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 13D-F
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Forensic assessment complete. Root cause identified. Correct validation path defined. Selected remediation option: B (`--legacy` with explicit `--output`). No code change required. One additional secondary finding: `TIER2_REPORTS_DIR` re-assigned at module scope (line 2712).

---

## Forensic Findings

### Q1 — Which function runs in default mode?

`main(tier1=True)` at line 3783–3789 — the default when `--legacy` is NOT passed.

```python
def main(tier1: bool = True, ...):
    if tier1:
        generate_tier1_reports(output_dir=output_dir)  # line 3786
        generate_tier2_reports()                        # line 3787
    else:
        _main_legacy(output_path=output_path)           # line 3789
```

`argparse` at line 3823 sets `--tier1 action="store_true" default=True` and `--legacy action="store_true" default=False`. Entry is `main(tier1=not args.legacy)` at line 3847. Without `--legacy`, `tier1=True` always.

### Q2 — Which function runs in `--legacy` mode?

`main(tier1=False)` → `_main_legacy()` (line 3760) → `load_all_payloads()` → `build_html(payloads)` (line 3768). This is the only path that calls `compose_key_findings`, `compose_executive_summary`, `compose_current_state`, `compose_risks`, and `compose_decision_guidance`.

### Q3 — Which path uses fragments (`FRAGMENTS_DIR`)?

**`--legacy` path only.**

`_main_legacy()` calls `load_all_payloads()` which calls `load_payload(claim_id)` → `_fetch_fragment(claim_id)` at line 122:
```python
def _fetch_fragment(claim_id: str) -> Optional[Dict]:
    path = FRAGMENTS_DIR / f"{claim_id}-ZONE-2-L1.json"
```

`generate_tier1_reports()` (line 2670) and `generate_tier2_reports()` (line 3704) never call `load_all_payloads()` or `_fetch_fragment()`. They call `load_canonical_topology()`, `load_signal_registry()`, and `load_gauge_state()` — all of which read from `CANONICAL_PKG_DIR`, not `FRAGMENTS_DIR`.

### Q4 — Which path writes BlueEdge reports?

**Both paths write to `clients/<client>/reports/`** via `TIER1_REPORTS_DIR` / `TIER2_REPORTS_DIR`, which are derived from `REPORTS_DIR = REPO_ROOT / "clients" / client / "reports"` set in `_configure_runtime()` (line 94).

When `--client` is not passed, `client` defaults to `"blueedge"` (argparse line 3798), so `REPORTS_DIR = clients/blueedge/reports`. Both tier1/tier2 mode and `--legacy` mode default-output to BlueEdge paths unless `--client` or `--output` / `--output-dir` overrides are supplied.

**`--legacy` mode:** uses `_default_output_path()` which constructs the output path from `REPORTS_DIR` — BlueEdge by default. BUT: if `--output <explicit-path>` is supplied, `_default_output_path()` is never called and the explicit path is used.

```python
def _main_legacy(output_path: Optional[Path] = None) -> None:
    if output_path is None:
        output_path = _default_output_path()   # only called if --output not supplied
```

### Q5 — Are `--claims` and `--fragments-dir` ignored in default mode?

**Yes — effectively ignored** for the report generation itself.

`--claims` updates `LENS_CLAIMS` (line 89–90 in `_configure_runtime()`). `LENS_CLAIMS` is only consumed by `load_all_payloads()`, which is only called by `_main_legacy()`. `generate_tier1_reports()` and `generate_tier2_reports()` do not call `load_all_payloads()`.

`--fragments-dir` updates `FRAGMENTS_DIR` (line 98–99). `FRAGMENTS_DIR` is only consumed by `_fetch_fragment()` → `load_payload()` → `load_all_payloads()`. Same situation — not reached in default mode.

In the STEP 13D run: both flags were passed, neither had any effect on what was generated.

### Q6 — Secondary Finding: `TIER2_REPORTS_DIR` re-assigned at module scope (line 2712)

```python
# Line 58 — first assignment (inside REPORTS_DIR / "tier2" computation block):
TIER1_REPORTS_DIR = REPORTS_DIR / "tier1"
# ... (no TIER2_REPORTS_DIR line 58 — only TIER1)

# Line 2712 — second module-level assignment:
TIER2_REPORTS_DIR = REPORTS_DIR / "tier2"
```

This line runs at module load time with the default BlueEdge `REPORTS_DIR`. The `_configure_runtime()` function declares `global TIER2_REPORTS_DIR` and can override it at call time. However, since `_configure_runtime()` is called in `__main__` AFTER the module is fully loaded, the line 2712 assignment is immediately overridden by `_configure_runtime()` in any CLI invocation. **Not a functional bug but a structural anomaly** — `TIER2_REPORTS_DIR` is initialized twice at module level (once at line 2712 from the default `REPORTS_DIR`, once by `_configure_runtime()`). Does not affect behavior when `_configure_runtime()` is called correctly.

### Q7 — What exact minimal code change is needed?

**None for Option B.** The `--legacy` path with explicit `--output` is fully functional with the existing STEP 13C patches. No code change is required to validate the patches.

For Option A (default mode) to exercise STEP 13C patches, `build_html()` and the compose functions would need to be called from within `generate_tier1_reports()` or `generate_tier2_reports()` — that would be a substantive refactor.

### Q8 — Which option is safest?

**Option B: `--legacy` with explicit `--output` to a controlled path.**

---

## Options Analysis

### Option A — Default mode after full parameterization

```bash
python3 scripts/pios/lens_report_generator.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --fragments-dir clients/e65d2f.../fragments/run_01_oss_fastapi \
  --output-dir /tmp/second_client_tier1/
```

**Rejected.** Reasons:
1. Does NOT exercise the STEP 13C patched functions (`compose_key_findings`, `compose_executive_summary`). `generate_tier1_reports()` and `generate_tier2_reports()` use `_build_tier1_*` and `_build_tier2_diagnostic_narrative()` — entirely separate rendering functions, none of which were patched.
2. `generate_tier2_reports()` requires `canonical_topology.json`, `signal_registry.json`, `gauge_state.json` from `CANONICAL_PKG_DIR` AND runs `export_graph_state.mjs` via Node.js subprocess (line 3728). Heavy dependency chain.
3. Even if fully parameterized, it does not validate R-04 (CLM-20 guard) or R-02 (GAP_01_RESOLVED) — the validation objective of STEP 13D.

### Option B — `--legacy` mode with explicit `--output`

```bash
python3 scripts/pios/lens_report_generator.py \
  --legacy \
  --fragments-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi \
  --claims CLM-09 CLM-25 CLM-12 CLM-10 \
  --output /tmp/lens_structural_slice_test.html
```

**Selected.** Reasons:
1. Routes through `_main_legacy()` → `load_all_payloads()` → `build_html()` — the exact path containing R-04 (`compose_key_findings` CLM-20 guard) and R-02 (`compose_key_findings` GAP_01_RESOLVED gate).
2. `FRAGMENTS_DIR` set to second-client path — `load_all_payloads()` reads from second-client fragments.
3. `--output /tmp/...` → `_default_output_path()` never called → no write to `clients/blueedge/reports/`. Safe.
4. `build_html()` attempts to load `CANONICAL_PKG_DIR` for topology (line 1688) but wraps in try/except pass — graceful fallback to `_topology = None` if unavailable. Not a blocker.
5. `validate_report_text(html)` runs FORBIDDEN_SUBSTRINGS check on output — confirms no SIG-/COND-/DIAG-/INTEL- leakage in the generated HTML.
6. No Node.js subprocess. No `CANONICAL_PKG_DIR` hard dependency.

**One known limitation:** `build_html()` calls `compose_system_intelligence()` and `compose_topology_view()` which may attempt to load BlueEdge topology if `CANONICAL_PKG_DIR` (still BlueEdge default without `--client`) exists. These sections are not second-client-correct, but since the objective is validating the R-04/R-02 patches (not topology rendering), this is acceptable.

**To prevent `build_html()` from loading BlueEdge topology:** pass `--client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run-id run_01_oss_fastapi`. If second-client `CANONICAL_PKG_DIR` doesn't have the required files, `build_html()` gracefully falls back (`_topology = None`).

### Option C — New explicit structural-slice mode

Not available. Would require new code. Deferred.

---

## 4-BRAIN Assessment

### CANONICAL

The STEP 13C patches (`GAP_01_RESOLVED`, CLM-20 guards, CLM-25 gate) are in `compose_key_findings` and `compose_executive_summary`. These are reachable ONLY via `build_html()` → `_main_legacy()`. They have never been executed against second-client data. The patches are syntactically correct (py_compile PASS) but runtime behavior is unverified.

### CODE

**Two-path architecture confirmed:**

| | Default (`tier1=True`) | Legacy (`--legacy`) |
|--|------------------------|---------------------|
| Entry | `generate_tier1_reports()` + `generate_tier2_reports()` | `_main_legacy()` |
| Data source | `CANONICAL_PKG_DIR` (gauge_state, topology, signals) | `FRAGMENTS_DIR` (ZONE-2 JSON files) |
| Uses `LENS_CLAIMS` | NO | YES |
| Uses `FRAGMENTS_DIR` | NO | YES |
| Calls `compose_key_findings` | NO | YES (via `build_html()`) |
| Calls `compose_executive_summary` | NO | YES |
| Output path control | `--output-dir` → `TIER1/TIER2_REPORTS_DIR` | `--output` → explicit path |
| STEP 13C patches exercised | NO | YES |
| Node.js subprocess | YES (`export_graph_state.mjs`) | NO |

**`--claims` and `--fragments-dir` are only effective in `--legacy` mode.** Passing them in default mode has no observable effect on report output.

### PRODUCT

The report generator is **not product-usable** for second-client in default mode. The default mode renders from `CANONICAL_PKG_DIR` (BlueEdge), not from second-client fragments. Passing `--fragments-dir` and `--claims` in default mode is a no-op.

The `--legacy` mode IS product-usable for second-client with the correct flags. It exercises the fragment-driven path, respects `--claims` filtering, and writes to an explicit `--output` path.

**No new code change is required.** The STEP 13C patches are correct for the `--legacy` path. The STEP 13D failure was a wrong invocation, not a code defect.

### PUBLISH

No generated report from STEP 13D survives (all removed or restored). No validation is accepted. The STEP 13C remediation is implemented but unverified at runtime — the surface cannot be presented as validated until STEP 13D-G confirms Option B execution.

---

## Selected Remediation Option

**Option B** — `--legacy` with explicit `--output`.

Authorized invocation for STEP 13D-G:

```bash
python3 scripts/pios/lens_report_generator.py \
  --legacy \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --fragments-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi \
  --claims CLM-09 CLM-25 CLM-12 CLM-10 \
  --output /tmp/lens_structural_slice_test.html
```

**Why this invocation is safe:**
- `--legacy` → `_main_legacy()` → `build_html()` → patched functions exercised
- `--client e65d2f... --run-id run_01_oss_fastapi` → `CANONICAL_PKG_DIR` points to second-client (graceful fallback if files absent)
- `--fragments-dir <second-client-path>` → `FRAGMENTS_DIR` set correctly
- `--claims CLM-09 CLM-25 CLM-12 CLM-10` → CLM-20 excluded from `LENS_CLAIMS`
- `--output /tmp/...` → no write to `clients/blueedge/` or `clients/e65d2f.../reports/`

**Output validation after run:**
- Confirm no `KeyError` crash
- `grep "Conceptual coherence not yet evaluated"` → present (GAP_01_RESOLVED gate)
- `grep "Security Intelligence Pipeline Signal"` → absent (CLM-20 guard)
- `grep "One critical operational signal"` → absent (signal sentence guard)
- `grep "Proven: 60/100"` → present (second-client CLM-09 value)
- `grep "SIG-\|COND-\|DIAG-\|INTEL-"` → absent (FORBIDDEN_SUBSTRINGS validation)

---

## Rejected Options

| Option | Reason rejected |
|--------|----------------|
| A (default mode) | Does not exercise STEP 13C patches; requires Node.js; depends on full second-client package |
| C (new mode) | Requires new code — deferred |
| `--legacy` without `--output` | Default output goes to `clients/blueedge/reports/` — unsafe |
| `--legacy` without `--client` | `build_html()` would load BlueEdge topology from BlueEdge `CANONICAL_PKG_DIR` |

---

## Next Step

**STEP 13D-G — Report Generator Validation (Option B)**

Authorized scope:
- Execute the Option B invocation defined above
- Validate output file at `/tmp/lens_structural_slice_test.html`
- Run grep checks for: placeholder presence, signal absence, score values, FORBIDDEN_SUBSTRINGS
- Document results in `step13d_g_report_generator_validation.md`
- Do NOT commit `/tmp/` output
- Do NOT write to `clients/blueedge/` or `clients/e65d2f.../reports/`
