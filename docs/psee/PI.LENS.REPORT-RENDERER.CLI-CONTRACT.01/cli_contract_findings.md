# CLI Contract Findings
## PI.LENS.REPORT-RENDERER.CLI-CONTRACT.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Source File Inspected

`scripts/pios/lens_report_generator.py`

---

## Module-Level Defaults (lines 53–62)

```python
FRAGMENTS_DIR     = REPO_ROOT / "clients" / "blueedge" / "vaults" / "run_01_authoritative" / "claims" / "fragments"
REPORTS_DIR       = REPO_ROOT / "clients" / "blueedge" / "reports"
CANONICAL_PKG_DIR = REPO_ROOT / "clients" / "blueedge" / "psee" / "runs" / "run_authoritative_recomputed_01" / "package"
_ACTIVE_CLIENT       = "blueedge"
_ACTIVE_VAULT_RUN_ID = "run_01_authoritative_generated"
```

---

## `_configure_runtime()` Package-Dir Resolution (lines 894–943)

```python
if package_dir is not None:
    CANONICAL_PKG_DIR = package_dir
else:
    CANONICAL_PKG_DIR = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id / "package"
```

**Implication:** Without `--package-dir`, defaults to `clients/{client}/psee/runs/{run_id}/package`.
For `--run-id run_be_orchestrated_fixup_01`, this resolves to `.../run_be_orchestrated_fixup_01/package` which **does not exist**. The vault is at `.../run_be_orchestrated_fixup_01/vault`.

---

## Argparse Flags (lines 7090–7163)

| Flag | Type | Default | Notes |
|------|------|---------|-------|
| `--client` | str | `blueedge` | Client identifier |
| `--run-id` | str | `run_authoritative_recomputed_01` | Sets `_ACTIVE_VAULT_RUN_ID` (embedded in HTML nav links) |
| `--package-dir` | Path | None | Overrides `CANONICAL_PKG_DIR`; required when vault is not at `{run_id}/package` |
| `--deliverable` | choice | None (all) | `tier1`, `diagnostic`, `decision`, `all` |
| `--output-dir` | Path | None | Flat output directory (tier1+tier2+decision) |
| `--output-root` | Path | None | Structured output root: writes `reports/tier1/`, `reports/tier2/`, `reports/decision/` + metadata |
| `--api-base` | str | `http://localhost:3000` | Used by `load_all_payloads()` only (legacy path) |
| `--fragments-dir` | Path | None | Used by legacy path only |
| `--legacy` | bool | False | Activates `_main_legacy()` |
| `--tier1` | bool | True | Legacy-only flag |
| `--claims` | list | None | Legacy-only |
| `--crosswalk-path` | Path | None | Optional |
| `--semantic-topology-dir` | Path | None | Optional |
| `--output` | Path | None | Legacy output path |

---

## `main()` Routing (lines 7060–7086)

```python
def main(tier1=True, output_path=None, output_dir=None, deliverable=None, output_root=None):
    t1_dir = (output_root / "reports" / "tier1")    if output_root else output_dir
    t2_dir = (output_root / "reports" / "tier2")    if output_root else output_dir
    ds_dir = (output_root / "reports" / "decision") if output_root else output_dir
    if deliverable == "tier1":      generate_tier1_reports(output_dir=t1_dir)
    elif deliverable == "diagnostic": generate_tier2_reports(output_dir=t2_dir)
    elif deliverable == "decision":   generate_decision_surface(output_dir=ds_dir, ...)
    else:  # all or None
        generate_tier1_reports(output_dir=t1_dir)
        generate_tier2_reports(output_dir=t2_dir)
        generate_decision_surface(output_dir=ds_dir, ...)
    if output_root:
        _write_canonical_run_metadata(output_root)
```

---

## Data Dependencies Per Deliverable

### Tier 1 (`generate_tier1_reports`, lines 4397–4440)
Reads exclusively from `CANONICAL_PKG_DIR` and `CANONICAL_PKG_DIR.parent`:
- `CANONICAL_PKG_DIR/canonical_topology.json`
- `CANONICAL_PKG_DIR/signal_registry.json`
- `CANONICAL_PKG_DIR/gauge_state.json`
- `CANONICAL_PKG_DIR.parent/41.x/signal_projection.json`
- `CANONICAL_PKG_DIR.parent/41.x/pressure_zone_projection.json`
- `CANONICAL_PKG_DIR.parent/binding/binding_envelope.json`

**No API calls. No FRAGMENTS_DIR. No `load_all_payloads()`.**

### Tier 2 (`generate_tier2_reports`, lines 6375–6437)
Reads from `CANONICAL_PKG_DIR` (same files as tier1, plus `_load_language_layer()`).
**Additional dependency:** invokes `export_graph_state.mjs` via Node.js subprocess.
Requires `vault_index.json` for `_ACTIVE_CLIENT` in app vault.

### Decision Surface (`generate_decision_surface`, line 6877)
Reads from `CANONICAL_PKG_DIR` only.
**No API calls. No Node.js subprocess.**

---

## `load_all_payloads()` Scope

`load_all_payloads()` (line 6946) is called exclusively inside `_main_legacy()`.
It is **NOT** called by `generate_tier1_reports()`, `generate_tier2_reports()`, or `generate_decision_surface()`.

---

## Input File Existence Check (run_be_orchestrated_fixup_01 with --package-dir vault)

| Required Input | Resolved Path | Status |
|---------------|---------------|--------|
| canonical_topology.json | `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/canonical_topology.json` | EXISTS ✓ |
| signal_registry.json | `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/signal_registry.json` | EXISTS ✓ |
| gauge_state.json | `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/gauge_state.json` | EXISTS ✓ |
| signal_projection.json | `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/41.x/signal_projection.json` | EXISTS ✓ |
| pressure_zone_projection.json | `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/41.x/pressure_zone_projection.json` | EXISTS ✓ |
| binding_envelope.json | `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/binding/binding_envelope.json` | EXISTS ✓ |

**All tier1 + decision surface inputs: PRESENT.**

---

## Prior FAIL Analysis (PI.LENS.BLUEEDGE-REPORT-PARITY-ENFORCEMENT.01)

Command used (missing `--package-dir`):
```
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_be_orchestrated_fixup_01 \
  --output-dir /tmp/blueedge_parity_check
```

Error: `[PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01] FAIL: Canonical package directory not found: .../run_be_orchestrated_fixup_01/package`

Root cause: Script defaulted `CANONICAL_PKG_DIR` to `.../run_be_orchestrated_fixup_01/package` (does not exist). Vault is at `.../run_be_orchestrated_fixup_01/vault`.

Resolution: Add `--package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault`.

---

## `--run-id` Selection Rationale

`--run-id run_blueedge_productized_01_fixed` is used (not `run_be_orchestrated_fixup_01`) because:
- `_ACTIVE_VAULT_RUN_ID` is set from `--run-id`
- This value is embedded in HTML nav links via `_scoped_report_url()`
- Canonical reports were generated with `run_blueedge_productized_01_fixed` as the active run ID
- `--package-dir` independently specifies where data artifacts are read from
