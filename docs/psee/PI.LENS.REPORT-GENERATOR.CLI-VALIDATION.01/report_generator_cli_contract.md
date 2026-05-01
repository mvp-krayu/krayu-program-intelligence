# Report Generator CLI Contract
## PI.LENS.REPORT-GENERATOR.CLI-VALIDATION.01

**Generated:** 2026-05-01
**Status:** DISCOVERED

---

## Script

`scripts/pios/lens_report_generator.py`
Stream IDs: `PRODUCTIZE.LENS.REPORT.01` / `PRODUCTIZE.LENS.REPORT.DELIVERY.01` / `PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01`

---

## CLI Arguments

```
python3 scripts/pios/lens_report_generator.py \
  --client <client_slug>           # Client ID (default: blueedge)
  --run-id <run_id>                # Run ID for canonical package and vault paths
  --package-dir <path>             # Canonical package/vault directory override
  --output-root <path>             # Canonical output root: clients/<client>/lens/runs/<run_id>
  --output-dir <path>              # Output directory (single deliverable, no metadata)
  --deliverable <tier1|diagnostic|decision|all>  # Which surfaces to generate
  --fragments-dir <path>           # Fragment dir override
  --claims <CLM-XX ...>            # Explicit claim IDs
  --api-base <url>                 # API base URL (default: http://localhost:3000)
  --crosswalk-path <path>          # Optional semantic_continuity_crosswalk.json
  --semantic-topology-dir <path>   # Optional semantic topology directory
  --legacy                         # Single executive report (not Tier-1 set)
```

---

## Phase 8b Invocation (from run_client_pipeline.py)

```
python3 scripts/pios/lens_report_generator.py \
  --client <alias> \
  --run-id <run_id> \
  --package-dir clients/<alias>/psee/runs/<run_id>/vault \
  --output-root clients/<alias>/lens/runs/<run_id>
```

No `--deliverable` flag → generates ALL surfaces (tier1 + diagnostic + decision).

---

## Validated CLI Contract for FastAPI Generic Pipeline

### Tier-1 + Decision Surface (both PASS)

```
python3 scripts/pios/lens_report_generator.py \
  --client fastapi \
  --run-id run_02_oss_fastapi_pipeline \
  --package-dir clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault \
  --output-root clients/fastapi/lens/runs/run_02_oss_fastapi_pipeline \
  --deliverable tier1
```

Or for decision only:
```
  --deliverable decision
```

### Tier-2 Diagnostic (FAILS — vault_index.json dependency)

Tier-2 requires `vault_index.json` in `app/gauge-product/public/vault/<client>/<run_id>/`.
FastAPI app vault is under UUID `e65d2f0a-dfa7-4257-9333-fcbb583f0880`, not slug `fastapi`.
Resolution requires publishing FastAPI vault to app under slug (product-layer decision).

---

## Validated CLI Contract for BlueEdge Baseline (non-mutating)

```
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_be_orchestrated_fixup_01 \
  --package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault \
  --output-dir /tmp/blueedge_validation_<deliverable> \
  --deliverable <tier1|decision|diagnostic>
```

Using `--output-dir` (not `--output-root`) prevents writing selector/current metadata to
`clients/blueedge/lens/`. This preserves the BlueEdge baseline reports at
`clients/blueedge/reports/` unchanged.

---

## Data Source Priority (from script docstring)

1. HTTP: `/api/projection?claim_id=<id>&zone=ZONE-2&depth=L1` (local dev server)
2. FALLBACK: pre-generated fragment files (projection outputs — not raw vault files)
3. ACTUAL path when `--package-dir` provided: reads directly from vault JSON files

In practice (offline): reads directly from `--package-dir` (vault) + `41.x/` relative paths.

---

## Key Module-Level Globals Reset by `_configure_runtime()`

| Global | Default | Reset to |
|--------|---------|----------|
| `_ACTIVE_CLIENT` | `blueedge` | `--client` |
| `_ACTIVE_VAULT_RUN_ID` | `run_01_authoritative_generated` | `--run-id` |
| `CANONICAL_PKG_DIR` | `clients/blueedge/psee/runs/run_01_authoritative_generated/package` | `--package-dir` |
| `FRAGMENTS_DIR` | `clients/blueedge/vaults/...` | derived from `--client/--run-id` |

All globals are correctly reset when `--client fastapi --run-id run_02_oss_fastapi_pipeline` are provided.
