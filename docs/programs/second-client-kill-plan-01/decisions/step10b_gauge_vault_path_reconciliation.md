# STEP 10B — GAUGE/Vault Path Reconciliation Decision Trace

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10B
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Context

STEP 10B objective: resolve the GAUGE ↔ vault path mismatch identified during STEP 10A
research before any code modification or execution. READ-ONLY assessment against four brains.
No runtime execution. No pipeline execution. No file modification except this decision trace.

Client: `e65d2f0a-dfa7-4257-9333-fcbb583f0880`
Run: `run_01_oss_fastapi`

---

## CANONICAL Brain

**Authoritative package location contract:**

`build_evidence_vault.py:main()` defines the canonical package location as:

```
clients/<client_id>/psee/runs/<run_id>/package/
```

Evidence: `scripts/psee/build_evidence_vault.py` (main function):

```python
run_dir = repo_root / "clients" / client_id / "psee" / "runs" / run_id
package_dir = run_dir / "package"
```

This path mirrors the BlueEdge reference structure:
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/`

The `psee/runs/` infix is the canonical run directory convention for all vault-bound runs.
The second client's PSEE run artifacts (binding, structure, validation, lineage) are correctly
located at `clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/` — only the `package/`
subdirectory is absent because GAUGE has not yet run.

**CANONICAL verdict:** `psee/runs/<run_id>/package/` is the authoritative contract surface.

---

## CODE Brain

**GAUGE output path (actual):**

`scripts/psee/run_client_runtime.py` docstring (confirmed):

```
Writes: clients/<client_uuid>/runs/<run_id>/
```

No `psee/` infix. Run produces artifacts to `clients/<uuid>/runs/run_01_oss_fastapi/`.

**Vault builder expected input path (actual):**

`scripts/psee/build_evidence_vault.py:main()`:

```python
run_dir = repo_root / "clients" / client_id / "psee" / "runs" / run_id
package_dir = run_dir / "package"
```

Constructs: `clients/<uuid>/psee/runs/run_01_oss_fastapi/package/`

**Mismatch:**

| | Path |
|---|---|
| `run_client_runtime.py` writes to | `clients/<uuid>/runs/run_01_oss_fastapi/` |
| `build_evidence_vault.py` reads from | `clients/<uuid>/psee/runs/run_01_oss_fastapi/package/` |

These paths differ by the `psee/` infix and the `package/` suffix. They do not overlap.

**No `--package-dir` argument exists** in `build_evidence_vault.py`. The `package_dir` is
computed unconditionally from `--client` and `--run`. The vault builder accepts
`--signal-registry` and `--binding-envelope` overrides but has no mechanism to redirect
the package input path.

**CODE verdict:** Mismatch is structural and real. Vault builder will `sys.exit(1)` at
`run_dir.exists()` check for `psee/runs/run_01_oss_fastapi/` (directory absent).

---

## PRODUCT Brain

**Which path is productized truth?**

The PSEE canonical run at `psee/runs/` is the productized truth surface.

Evidence: the second client's complete PSEE execution record (STEP 7J, STEP 8) resides at
`clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/` — binding envelope, structure
manifest, validation, lineage all at this path. The `run_manifest.json:final_status=PASS`
and `package_manifest.json:is_canonical_consumption_artifact=true` are assertions anchored
to the `psee/runs/` hierarchy.

`run_client_runtime.py` (WP-13) is the Autonomous Client Runtime — a separate execution
surface with its own governance identity. It writes to `runs/` (no `psee/` infix) and
produces a different artifact set (no `canonical_topology.json`, no `signal_registry.json`).
Its output is not the canonical PSEE execution record for this run.

**PRODUCT verdict:** The vault must be anchored to `psee/runs/run_01_oss_fastapi/` — the
canonical PSEE run surface. The `runs/` WP-13 output is a separate, non-canonical surface
for vault construction purposes.

---

## PUBLISH Brain

**Cross-client contamination risk assessment:**

- Strategy C (`--package-dir`) is publish-safe: no artifact duplication, no copy operations,
  no cross-client path traversal. The vault builder is invoked with an explicit path argument
  that the caller controls. No BlueEdge paths are referenced.
- The contaminated `gauge_state.json` at `clients/e65d2f0a-.../runs/run_01_oss_fastapi/package/`
  (containing `client_id: "blueedge"`) is not in the `psee/runs/` hierarchy. With Strategy C,
  the caller supplies the explicit `--package-dir` path. If that path points to
  `psee/runs/run_01_oss_fastapi/package/` (freshly produced by GAUGE in STEP 10C), the
  contaminated artifact is structurally excluded — it lives at a different path.
- Strategy D (copy) would require copying artifacts between paths — contamination vector if
  copy source is incorrectly specified. Rejected on publish-safety grounds.

**PUBLISH verdict:** Strategy C is publish-safe. Contamination risk is structurally excluded
by path specificity, provided GAUGE produces clean artifacts to `psee/runs/run_01_oss_fastapi/package/`.

---

## Strategy Decision

### Selected: C — Introduce explicit `--package-dir` argument to `build_evidence_vault.py`

**Rationale:**

Strategy C is the minimal, non-breaking change:
- Does not modify GAUGE output convention (`run_client_runtime.py` remains unchanged)
- Does not alter BlueEdge backward compatibility (default `psee/runs/` derivation is preserved
  when `--package-dir` is not supplied)
- Decouples vault builder from a path assumption that is inconsistent with WP-13 write behavior
- Enables explicit invocation for second-client: `--package-dir clients/<uuid>/psee/runs/run_01_oss_fastapi/package/`

STEP 10C (GAUGE execution) will produce GAUGE artifacts. The correct invocation will explicitly
pass `--package-dir` pointing to the STEP 10C output location.

**Implementation scope (CODE change contract — not executed in this step):**

File: `scripts/psee/build_evidence_vault.py`
Change: Add `--package-dir` optional argument to `main()` argparse block. When supplied,
use it directly as `package_dir` instead of computing from `run_dir`. When absent, preserve
existing behavior (`run_dir / "package"`). Scope: argparse block + two assignment lines.
No other logic changes required.

---

## Rejected Strategies

### A — Align GAUGE output → psee/runs/<run_id>/package

REJECTED. Requires modifying `run_client_runtime.py` (WP-13 stream). WP-13 has an
independent governance identity and its write path is part of its stream contract.
Modifying GAUGE output convention is a higher-impact change than adding one CLI argument
to the vault builder. The PSEE run artifacts already exist at `psee/runs/` — GAUGE artifacts
should be placed there for consistency, but the mechanism to achieve this is STEP 10C's
invocation contract, not a structural change to WP-13.

### B — Align vault builder → clients/<uuid>/runs/<run_id>/package

REJECTED. Breaks BlueEdge backward compatibility. All BlueEdge GAUGE artifacts are at
`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/`. Changing the
vault builder's default path derivation would invalidate the BlueEdge reference run
invocation. This is a regression risk with no benefit.

### D — Controlled copy/sync post-GAUGE

REJECTED. Creates artifact duplication and violates single-source-of-truth. Copy operations
introduce a contamination vector: if the copy source is incorrectly specified (e.g.,
the contaminated `runs/run_01_oss_fastapi/package/gauge_state.json` with `client_id: "blueedge"`),
the vault is built from cross-client data with no structural guard. Strategy C eliminates
this risk by requiring an explicit path argument with no copy step.

---

## Next Step (10C)

STEP 10C contract requirements:

1. Run GAUGE for `run_01_oss_fastapi` to produce five package artifacts at
   `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/package/`
2. Implement `--package-dir` argument in `build_evidence_vault.py` (Strategy C)
3. Build evidence vault using explicit `--package-dir` pointing to STEP 10C output

Pre-conditions for STEP 10C:
- GAUGE must execute cleanly against second-client input (clean `client_id`, clean `run_id`)
- `canonical_topology.json` and `signal_registry.json` must be produced (not produced by
  `run_client_runtime.py` alone — require `pios emit topology` and `pios emit signals`)
- `projection_runtime.py:_find_signal_registry()` fix (STEP 10B signal registry contract)
  must be applied before projection fragment export

---

## Confirmation: No Runtime Execution

No scripts were executed during STEP 10B. No pipeline commands were run.
All assessment derived from reading existing scripts and artifacts.

---

## Confirmation: No Files Modified

No existing files were modified. This file is a new creation only.

---

## STEP 10B Status

**COMPLETE** (path reconciliation complete; Strategy C selected; vault construction remains
BLOCKED pending STEP 10C GAUGE execution and `--package-dir` implementation)
