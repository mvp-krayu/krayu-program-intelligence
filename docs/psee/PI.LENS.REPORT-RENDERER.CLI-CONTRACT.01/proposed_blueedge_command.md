# Proposed BlueEdge Command
## PI.LENS.REPORT-RENDERER.CLI-CONTRACT.01

**Generated:** 2026-05-01
**Status:** LOCKED — CANONICAL CLI CONTRACT

---

## Canonical BlueEdge Report Generation Command

```bash
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_blueedge_productized_01_fixed \
  --package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault \
  --output-dir <output_directory>
```

---

## Flag Breakdown

| Flag | Value | Purpose |
|------|-------|---------|
| `--client` | `blueedge` | Client identifier |
| `--run-id` | `run_blueedge_productized_01_fixed` | Sets `_ACTIVE_VAULT_RUN_ID`; embedded in HTML nav links |
| `--package-dir` | `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault` | Overrides `CANONICAL_PKG_DIR`; resolves to existing vault directory |
| `--output-dir` | `<output_directory>` | Destination for generated HTML files |

---

## Why `--package-dir` is Required

Without `--package-dir`, the script defaults `CANONICAL_PKG_DIR` to:
```
clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/package
```
This path does not exist. The BlueEdge artifact vault is at:
```
clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/
```
`--package-dir` must explicitly point to this vault directory.

---

## Why `--run-id` Is `run_blueedge_productized_01_fixed` (Not `run_be_orchestrated_fixup_01`)

`--run-id` controls `_ACTIVE_VAULT_RUN_ID`, which is embedded in HTML nav links via `_scoped_report_url()`. The four operator-confirmed canonical reports have `run_blueedge_productized_01_fixed` in their nav link structure. To reproduce reports with matching identity, this run ID must be used.

`--package-dir` independently controls where data artifacts are read from. These two flags are decoupled.

---

## Data Flow

```
--package-dir → CANONICAL_PKG_DIR = .../run_be_orchestrated_fixup_01/vault
    ├── vault/canonical_topology.json     ✓
    ├── vault/signal_registry.json        ✓
    ├── vault/gauge_state.json            ✓
    ├── 41.x/signal_projection.json       ✓  (CANONICAL_PKG_DIR.parent/41.x/)
    ├── 41.x/pressure_zone_projection.json ✓
    └── binding/binding_envelope.json     ✓  (CANONICAL_PKG_DIR.parent/binding/)

--run-id → _ACTIVE_VAULT_RUN_ID = "run_blueedge_productized_01_fixed"
    └── embedded in HTML nav links only (no data path effect)
```

---

## Deliverable Scope

Default (no `--deliverable` flag) = all: tier1 + tier2 diagnostic + decision surface.

Tier2 diagnostic invokes `export_graph_state.mjs` via Node.js subprocess.
If Node.js or vault_index.json are unavailable, tier2 will fail while tier1 and decision succeed.

To generate tier1 and decision only (no Node.js dependency):
```bash
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_blueedge_productized_01_fixed \
  --package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault \
  --deliverable tier1 \
  --output-dir <output_directory>

python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_blueedge_productized_01_fixed \
  --package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault \
  --deliverable decision \
  --output-dir <output_directory>
```

---

## Governance Notes

- This command was not in effect during the original canonical report generation
- Canonical reports at `run_blueedge_productized_01_fixed/reports/` are the ground truth
- This command is the forward-reproducibility specification
- SHA256 match is not guaranteed due to timestamp embedding or dynamic content
