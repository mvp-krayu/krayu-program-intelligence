# Execution Log
# RECONSTRUCTION.EXECUTABLE.CHAIN.PROOF.01

- Date: 2026-04-14
- Stream: RECONSTRUCTION.EXECUTABLE.CHAIN.PROOF.01
- Branch: feature/reconstruction-executable-proof
- Execution engine: Claude Code (claude-sonnet-4-6)

---

## 1. PRE-FLIGHT

| check | result |
|-------|--------|
| Starting branch | feature/ig-layer-index-integration |
| Target branch created | feature/reconstruction-executable-proof |
| run_id used | run_st40_validation_01 (tenant: blueedge) |
| IG present | YES — ig/ materialized and structural layers integrated |
| 40_2 present | YES |
| 40_3 present | YES |
| 40_4 present | YES |
| layer_index.json layers | L_ROOT, L40_2, L40_3, L40_4 (confirmed integrated) |
| Entrypoint identified | `pios emit reconstruction` → `compute_reconstruction.sh` |
| Script path | scripts/pios/runtime/compute_reconstruction.sh |
| DIM-01 prerequisite | package/coverage_state.json.state=COMPUTED — created |

---

## 2. ENTRYPOINT INSPECTION

| step | action | finding |
|------|--------|---------|
| E-01 | `pios emit reconstruction --help` | Confirmed CLI: `--run-dir`, `--ig-dir`. Delegates to `compute_reconstruction.sh <pkg_dir> <ig_dir>` |
| E-02 | Read `compute_reconstruction.sh` | Full script read. 4 axes: COMPLETENESS, STRUCTURAL_LINK, REFERENTIAL_INTEGRITY, LAYER_CONSISTENCY. Required inputs: 9 files across ig/ and package/. Inline Python validation block produces violation list → state. |
| E-03 | Inspect AXIS 2 check (STRUCTURAL_LINK) | `required_layers = {"L40_2","L40_3","L40_4"}`. Two sub-checks: (1) `missing_layers = required_layers - set(li_layers.keys())` — absence check; (2) `layer.get("artifact_count", 0) <= 0` — isolation check |
| E-04 | Inspect AXIS 4 check (LAYER_CONSISTENCY) | `li_count = li_layers.get(lid, {}).get("artifact_count", None)` — if None → "missing from layer_index (cannot verify count)" violation |
| E-05 | Inspect admissibility_log.json | summary.total=2, admitted=2, excluded=0 |
| E-06 | Inspect source_manifest.json | layers: L_ROOT only; total_admitted_artifacts=2 |
| E-07 | Inspect layer_index.json | 4 layers: L_ROOT + L40_2 + L40_3 + L40_4; structural layers have no artifact_count field |

---

## 3. PREREQUISITE SETUP

Package prerequisites created (minimal valid, for proof only):

| file | content |
|------|---------|
| `package/coverage_state.json` | state=COMPUTED, coverage_percent=100.0, required_units=2, admissible_units=2 |
| `package/engine_state.json` | run_id=run_st40_validation_01, client_id=blueedge |
| `package/gauge_inputs.json` | panel_02.DIM-01 + panel_02.DIM-02 structure present |

---

## 4. EXECUTION

### Run 1 — Primary proof execution

**Command:**
```
python3 scripts/pios/pios.py emit reconstruction \
  --run-dir clients/blueedge/psee/runs/run_st40_validation_01 \
  --ig-dir  clients/blueedge/psee/runs/run_st40_validation_01/ig
```

**Raw output:**
```
=== PSEE-RUNTIME.6A DIM-02 Reconstruction Validation ===
PSEE runtime dir: .../run_st40_validation_01/package
IG runtime dir:   .../run_st40_validation_01/ig

--- DIM-01 Precondition ---
  coverage_state.state:   COMPUTED  PASS
  coverage_percent:       100.0

--- Running 4-Axis Structural Validation ---
  Axis results: COMPLETENESS=PASS, LAYER_CONSISTENCY=FAIL, REFERENTIAL_INTEGRITY=PASS, STRUCTURAL_LINK=FAIL
  Violations:   6
  State:        FAIL

--- Output ---
reconstruction_state.json: 43d97821083179f58323a03c8fa355299a4c5449b63c70c9fcff587829ddd4c7
gauge_inputs.json:         0e57a443ff6ae97b4773ade16e175a5187027a4aac0d3aa28f8138d61b9d5c5b

VALIDATION_COMPLETE
  state=FAIL  validated=2/2  violations=6
[pios] INFO RECONSTRUCTION_COMPLETE: reconstruction_state.json written
[pios] INFO reconstruction_state: state=FAIL validated_units=2 total_units=2
pios_exit=0
```

**Classification: FAIL**

### Run 2 — Determinism check

**Command:** (identical to Run 1)

**Result:**
```
reconstruction_state.json: ee0a286144b2398eedd5aba29a8032775475e18810b600b0866a083970ad538c
```

**Hash differs from Run 1.** Violation content confirmed identical (sorted):
```
LAYER_CONSISTENCY: Layer L40_2 missing from layer_index (cannot verify count)
LAYER_CONSISTENCY: Layer L40_3 missing from layer_index (cannot verify count)
LAYER_CONSISTENCY: Layer L40_4 missing from layer_index (cannot verify count)
STRUCTURAL_LINK:   Layer L40_2 has no artifacts (isolated node)
STRUCTURAL_LINK:   Layer L40_3 has no artifacts (isolated node)
STRUCTURAL_LINK:   Layer L40_4 has no artifacts (isolated node)
```

Hash variation source: `required_layers = {"L40_2","L40_3","L40_4"}` is a Python **set**;
iteration order is not deterministic. Violation ordering in JSON array varies between runs.
State, axis results, and violation content are deterministic. Pre-existing script behavior.

---

## 5. VIOLATION ANALYSIS

### VIOLATION-01/02/03 — STRUCTURAL_LINK (critical)

**Type:** STRUCTURAL_LINK (declared critical in `compute_reconstruction.sh`)
**Check:** `layer.get("artifact_count", 0) <= 0`
**Trigger:** L40_2/L40_3/L40_4 entries in layer_index.json have no `artifact_count` field
**Default:** `.get("artifact_count", 0)` → 0; `0 <= 0` = True → "isolated node" violation
**State effect:** STRUCTURAL_LINK ∈ critical_types → state=FAIL

### VIOLATION-04/05/06 — LAYER_CONSISTENCY (non-critical)

**Type:** LAYER_CONSISTENCY (not in critical_types)
**Check:** `li_count = li_layers.get(lid, {}).get("artifact_count", None)`
**Trigger:** L40_2/L40_3/L40_4 entries have no `artifact_count` → li_count=None
**Error msg:** "Layer L40_x missing from layer_index (cannot verify count)"
**Note:** Misleading message — layer IS present, but `artifact_count` is absent
**State effect:** non-critical → contributes to PARTIAL threshold only; already FAIL from AXIS 2

---

## 6. BOUNDARY CONSUMPTION EVIDENCE

| check | evidence | result |
|-------|----------|--------|
| missing_layers == empty | `required_layers - set(li_layers.keys())` = `{}` | CONFIRMED — old blocker removed |
| "Required layers missing" violations | count=0 | CONFIRMED — 0 such violations |
| L40_2 in layer_index | True | DETECTED |
| L40_3 in layer_index | True | DETECTED |
| L40_4 in layer_index | True | DETECTED |
| No L_ROOT-only fallback | All 4 layers iterated; L40_x failures are processing failures, not absence | CONFIRMED |
| Structural layers consumed by script | Yes — AXIS 2 and AXIS 4 process L40_2/3/4 | CONFIRMED |

---

## 7. FAILURE ISOLATION EVIDENCE

**Exact file:** `scripts/pios/runtime/compute_reconstruction.sh`
**Exact check:** AXIS 2 inline Python block — `layer.get("artifact_count", 0) <= 0`
**Root cause:** `pios ig integrate-structural-layers` writes discoverability-only entries.
The reconstruction script requires IG-style layer entries with `artifact_count` and `artifacts[]`
for every layer it processes via AXIS 2.

**This is a schema alignment gap.** The integration stream fulfilled structural-layer
discoverability. The reconstruction script requires structural-layer substantiation
(artifact manifest) in addition to discoverability.

---

## 8. PASS/FAIL CLASSIFICATION

| criterion | result |
|-----------|--------|
| Reconstruction executed (not theorized) | PASS |
| Outcome proven | PASS — state=FAIL with exact violation list |
| No structural-layer-missing errors | PASS — "Required layers missing" = 0 violations |
| Failure precisely isolated | PASS — AXIS 2 `artifact_count` check, exact line identified |
| Structural layers detected by script | PASS — L40_2/L40_3/L40_4 all in li_layers |
| System behavior fully observable | PASS — complete violation list, axis results, raw output captured |

Stream success condition: MET — reconstruction was executed; FAIL outcome proven; failure
precisely isolated; no structural-layer-missing errors remain; behavior observable and reproducible.

---

## 9. NEXT BOUNDARY IDENTIFIED

**Name:** STRUCTURAL_LAYER_ARTIFACT_MANIFEST_ALIGNMENT

**Location:**
- `scripts/pios/runtime/compute_reconstruction.sh` — AXIS 2 `artifact_count` check
- `pios ig integrate-structural-layers` — layer registration format

**Resolution requires one of:**

A. **Extend layer registration** — `pios ig integrate-structural-layers` populates
   `artifact_count` and `artifacts[]` for structural layer entries, enumerating
   the artifact files from 40_2/, 40_3/, 40_4/ directories.

B. **Source-discriminated validation** — `compute_reconstruction.sh` AXIS 2 introduces
   a separate validation path for `source=STRUCTURAL` layers that checks structural
   artifact presence via `path`/`artifact_root` fields rather than an `artifacts[]` list.

Authority: RECONSTRUCTION.EXECUTABLE.CHAIN.PROOF.01
