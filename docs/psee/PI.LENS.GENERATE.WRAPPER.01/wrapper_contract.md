# Wrapper Contract
## PI.LENS.GENERATE.WRAPPER.01

**Date:** 2026-05-02
**Branch:** work/psee-runtime
**Baseline commit:** e0d668b1dfc08f7060b23b9937479344ad615659

---

## Wrapper

**File:** `scripts/pios/lens_generate.sh`

---

## Interface

```bash
bash scripts/pios/lens_generate.sh \
  --client <client> \
  --run <run> \
  [--output-dir <dir>]
```

---

## Path Resolution

| Variable | Value |
|----------|-------|
| `BASE_DIR` | `clients/${CLIENT}/psee/runs/${RUN}` |
| `VAULT_DIR` | `${BASE_DIR}/vault` |
| `SEMANTIC_DIR` | `${BASE_DIR}/semantic` |
| `OUTPUT_DIR` | `${BASE_DIR}/reports` (default) or `--output-dir` |
| `RENDERER` | `scripts/pios/lens_report_generator.py` |

---

## Validation Guards

- `VAULT_DIR` must exist — FAIL FAST if missing
- `SEMANTIC_DIR` must exist — FAIL FAST if missing
- `RENDERER` must exist — FAIL FAST if missing

---

## Renderer Invocation

```bash
python3 scripts/pios/lens_report_generator.py \
  --client "$CLIENT" \
  --run-id "$RUN" \
  --package-dir "$VAULT_DIR" \
  --semantic-bundle-dir "$SEMANTIC_DIR" \
  --output-dir "$OUTPUT_DIR"
```

No modifications to renderer. No pipeline execution. No fallback behavior.

---

## Output

- Absolute path to output directory
- List of generated `.html` files

---

## BlueEdge Layout Note

`run_blueedge_productized_01_fixed` stores semantic bundle and reports but not vault.
Vault is in `run_blueedge_productized_01/vault`.
A symlink `run_blueedge_productized_01_fixed/vault → ../run_blueedge_productized_01/vault`
was created (gitignored client artifact) to satisfy the expected directory layout.
No wrapper logic was added for this; the path resolution is unchanged.

---

## What This Wrapper Does NOT Do

- No pipeline execution
- No semantic rebuild
- No fallback behavior
- No FastAPI calls
- No renderer logic changes
- No abstraction layer
