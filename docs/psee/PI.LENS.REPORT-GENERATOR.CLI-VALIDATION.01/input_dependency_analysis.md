# Input Dependency Analysis
## PI.LENS.REPORT-GENERATOR.CLI-VALIDATION.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Summary Verdict: HYBRID

| Report Surface | Input Dependency | FastAPI Status | BlueEdge Status |
|----------------|------------------|----------------|-----------------|
| Tier-1 Evidence Brief | RUN_ARTIFACT_NATIVE | PASS | PASS |
| Tier-1 Narrative Brief | RUN_ARTIFACT_NATIVE | PASS | PASS |
| Decision Surface | RUN_ARTIFACT_NATIVE | PASS | PASS |
| Tier-2 Diagnostic Narrative | APP_VAULT_DEPENDENT | FAIL | PASS |

---

## Tier-1 + Decision Surface — Input Resolution

When called with `--package-dir <vault_dir>`:

| Data Loaded By | Path Resolved | FastAPI Available | BlueEdge Available |
|----------------|---------------|-------------------|--------------------|
| `load_canonical_topology()` | `CANONICAL_PKG_DIR/canonical_topology.json` | ✓ vault/canonical_topology.json | ✓ |
| `load_signal_registry()` | `CANONICAL_PKG_DIR/signal_registry.json` | ✓ vault/signal_registry.json | ✓ |
| `load_gauge_state()` | `CANONICAL_PKG_DIR/gauge_state.json` | ✓ vault/gauge_state.json | ✓ |
| `_load_psig_projection()` | `CANONICAL_PKG_DIR.parent/41.x/signal_projection.json` | ✓ (LEGACY path) | ✓ |
| `_load_pressure_zone_projection()` | `CANONICAL_PKG_DIR.parent/41.x/pressure_zone_projection.json` | ✓ (LEGACY path) | ✓ |
| `_load_binding_envelope()` | `CANONICAL_PKG_DIR.parent/binding/binding_envelope.json` | ✓ | ✓ |
| Decision graph_state | `CANONICAL_PKG_DIR.parent/reports/tier2/graph_state.json` (optional) | absent — skipped gracefully | ✓ if T2 run |

`CANONICAL_PKG_DIR` = `--package-dir` value = `clients/<client>/psee/runs/<run_id>/vault`
`CANONICAL_PKG_DIR.parent` = `clients/<client>/psee/runs/<run_id>`

**All Tier-1 and Decision inputs are native to the pipeline run directory.** No app vault access required.

Note: `_resolve_41x_path()` tries `41.x/grounded/` first (GROUNDED path) then falls back to `41.x/` (LEGACY path). FastAPI uses the LEGACY path — both files exist, [LEGACY] log message is informational only.

---

## Tier-2 Diagnostic Narrative — Input Resolution

Tier-2 requires ONE additional input that is NOT in the pipeline run directory:

```python
def _resolve_vault_index_for_graph() -> Optional[Path]:
    exact = (REPO_ROOT / "app" / "gauge-product" / "public" / "vault"
             / _ACTIVE_CLIENT / _ACTIVE_VAULT_RUN_ID / "vault_index.json")
    if exact.exists():
        return exact
    vault_base = REPO_ROOT / "app" / "gauge-product" / "public" / "vault" / _ACTIVE_CLIENT
    if vault_base.is_dir():
        for entry in sorted(vault_base.iterdir()):
            vi = entry / "vault_index.json"
            if vi.exists():
                return vi
    return None
```

For FastAPI (`--client fastapi`):
- Exact path: `app/gauge-product/public/vault/fastapi/<run_id>/vault_index.json` — NOT FOUND
- Fallback: `app/gauge-product/public/vault/fastapi/` — directory DOES NOT EXIST
- Result: `None` → `_fail()` → exit 1

For BlueEdge (`--client blueedge`):
- Exact path: `app/gauge-product/public/vault/blueedge/run_be_orchestrated_fixup_01/vault_index.json` — NOT FOUND
- Fallback: `app/gauge-product/public/vault/blueedge/` — EXISTS
  - First entry: `run_01_authoritative_generated/vault_index.json` — FOUND ✓
- Result: BlueEdge Tier-2 PASS

---

## App Vault vs Run Artifact Mismatch for FastAPI

| Location | Client Path | Status |
|----------|-------------|--------|
| `app/gauge-product/public/vault/fastapi/` | slug-based path | DOES NOT EXIST |
| `app/gauge-product/public/vault/e65d2f0a-dfa7-4257-9333-fcbb583f0880/run_01_oss_fastapi/` | UUID-based, OLD run | EXISTS |

The FastAPI client was historically published to the app vault using its UUID as the client key,
not its slug. The generic pipeline uses `fastapi` as the client slug. This mismatch prevents
`_resolve_vault_index_for_graph()` from finding the FastAPI vault_index.json.

The `run_01_oss_fastapi` vault_index is also from the OLD pipeline run, not the generic
`run_02_oss_fastapi_pipeline`. Using it would produce graph positions based on old binding
topology — acceptable as visualization layout (node positions), not as data truth.

---

## Vault_index.json Purpose

`vault_index.json` is consumed by `export_graph_state.mjs` (Node.js / d3-force-3d) to compute
x/y graph node positions for the Tier-2 topology visualization. It is a layout artifact, not a
data truth artifact. Its absence blocks Tier-2 entirely because the graph_state.json it produces
is a hard dependency (not optional) for the Tier-2 HTML template.

---

## Product-Layer Dependency Classification

The `vault_index.json` requirement is classified as a **product-layer dependency**, not a
pipeline requirement. Publishing vault artifacts to `app/gauge-product/public/vault/` is an
app deployment action, not a pipeline generation step. The Tier-2 surface requires this
product-layer deployment to have occurred before it can run.

This is documented as **compatibility debt** per contract NON-NEGOTIABLE FRAMING:
"Any app/public dependency must be classified as product-layer dependency, not pipeline requirement."
