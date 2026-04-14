# Reconstruction Structural Layer Artifact Manifest Alignment Specification
# PRODUCTIZE.RECONSTRUCTION.STRUCTURAL.LAYER.ARTIFACT.MANIFEST.ALIGNMENT.01

- Version: 1.0
- Stream: PRODUCTIZE.RECONSTRUCTION.STRUCTURAL.LAYER.ARTIFACT.MANIFEST.ALIGNMENT.01
- Authority: RECONSTRUCTION.EXECUTABLE.CHAIN.PROOF.01 / PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01
- Branch: feature/reconstruction-structural-layer-alignment
- Date: 2026-04-14

---

## SECTION 1 — CURRENT FAILURE ANALYSIS

### Proven failure (from RECONSTRUCTION.EXECUTABLE.CHAIN.PROOF.01)

**State:** FAIL  
**Axis results before fix:** COMPLETENESS=PASS, STRUCTURAL_LINK=FAIL, REFERENTIAL_INTEGRITY=PASS, LAYER_CONSISTENCY=FAIL  
**Violation count:** 6 (3 STRUCTURAL_LINK + 3 LAYER_CONSISTENCY)

### Exact failure locations

**STRUCTURAL_LINK violations (critical — drive state=FAIL):**

```python
# scripts/pios/runtime/compute_reconstruction.sh — AXIS 2 inline Python
for lid, layer in li_layers.items():
    if layer.get("artifact_count", 0) <= 0:    # ← L40_2/3/4 have no artifact_count field
        axis2_violations.append({              # ← defaults to 0; 0 ≤ 0 = True
            "type": "STRUCTURAL_LINK",
            "description": "Layer " + lid + " has no artifacts (isolated node)",
```

**LAYER_CONSISTENCY violations (non-critical):**

```python
# scripts/pios/runtime/compute_reconstruction.sh — AXIS 4 inline Python
for lid in required_layers:
    li_count = li_layers.get(lid, {}).get("artifact_count", None)  # ← returns None
    if li_count is None:                                            # ← triggers
        axis4_violations.append({
            "type": "LAYER_CONSISTENCY",
            "description": "Layer " + lid + " missing from layer_index (cannot verify count)",
```

### Root cause

Structural layer entries in `layer_index.json` (written by `pios ig integrate-structural-layers`)
are **discoverability-only registrations**. They contain `layer_id`, `source=STRUCTURAL`, `path`,
`artifact_root`, `layer_index`, and `provenance`. They do **not** contain `artifact_count` or
`artifacts[]`.

The reconstruction script's AXIS 2 and AXIS 4 checks were written to handle L_ROOT-style layers
that carry `artifact_count > 0` and an `artifacts[]` array. The `source=STRUCTURAL` discriminator
exists in the layer entry but was not previously used by the script.

**Pre-existing non-determinism:** `required_layers = {"L40_2", "L40_3", "L40_4"}` was a Python
set, causing non-deterministic violation ordering in the JSON output.

---

## SECTION 2 — RECONSTRUCTION CONTRACT (ACTUAL LOGIC)

### How `artifact_count` is used

**AXIS 2 (STRUCTURAL_LINK):** `layer.get("artifact_count", 0) <= 0` — if True, layer is classified
as an "isolated node" (no connected artifacts). Applied to ALL layers in `li_layers`.

**AXIS 4 (LAYER_CONSISTENCY):** `li_layers.get(lid, {}).get("artifact_count", None)` — if None,
generates "missing from layer_index (cannot verify count)" violation for each required layer.

### Whether `artifacts[]` is required

`artifacts[]` is **optional for state determination** — the only artifacts-based check in AXIS 2
is `non_admitted = [a for a in layer.get("artifacts", []) if ...]`. If `artifacts=[]` (or absent),
`non_admitted` is empty, generating no violation. The `artifact_count` check is the critical gate.

### Fields driving STRUCTURAL_LINK violations

1. `artifact_count` — absence or `<= 0` → "isolated node" violation
2. `artifacts[].admission_status` — any non-ADMITTED → "non-ADMITTED artifacts" violation

### Fields driving LAYER_CONSISTENCY violations

1. `artifact_count` (via `li_layers`) — None → "cannot verify count" violation
2. `artifact_count` vs `admissibility_log` layer count — mismatch → count violation
3. `total_admitted_artifacts` in `source_manifest` vs `admissibility_log.summary.admitted` — mismatch
4. Same artifact name in multiple layers — duplicate violation

### What is NOT required for structural layers

- Structural layers are NOT expected to appear in `admissibility_log.json.entries[].layer`
  (structural layers are not IG ingestion artifacts; admissibility_log covers intake files only)
- Structural layers are NOT in `source_manifest.json.layers` dict
  (source_manifest is an IG materialization artifact covering L_ROOT only)

---

## SECTION 3 — ALIGNMENT STRATEGY (OPTION A — RECONSTRUCTION-SIDE FIX)

**Chosen: Option A — Reconstruction-side source-discriminated validation**

### Why Option A over Option B

**Option B (IG-side augmentation)** would require adding `artifact_count` and `artifacts[]`
to structural layer entries in `layer_index.json`. Even with these fields added:
- AXIS 4 would still fail: `al_count = al_layer_counts.get(lid, 0) = 0` for L40_2/3/4 because
  structural files are not entries in `admissibility_log.json`. AXIS 4 would report
  `admissibility_log=0 != layer_index=3` for each structural layer — a new LAYER_CONSISTENCY
  violation. Resolving this would require either modifying `admissibility_log.json` (a governed
  IG artifact, out of scope) or also fixing AXIS 4 in the script.
- Option B therefore cannot fully resolve the failure without also modifying the script.
- Option B would create implicit structural payload in an IG artifact, blurring the
  discoverability-only boundary established by the prior stream.

**Option A** is minimal, explicit, and correct:
- The `source=STRUCTURAL` discriminator is already present in every structural layer entry
- It precisely captures the semantic: "this layer was registered for discoverability; verify
  artifact root exists, not admissibility log counts"
- IG remains discoverability-only authority — no structural content is added to any IG artifact
- Single file change, bounded to the affected checks

### Alignment rule

For layers where `layer.get("source") == "STRUCTURAL"`:
- **AXIS 2:** Verify `path` field resolves to an accessible, non-empty directory (fail-closed if not)
- **AXIS 4:** Verify `path` field resolves to an accessible directory (fail-closed if not)
- Skip `artifact_count`, `artifacts[]`, and admissibility_log count checks entirely

For all other layers (no `source` field, or `source != "STRUCTURAL"`):
- Existing checks unchanged

---

## SECTION 4 — IMPLEMENTATION DETAILS

**File modified:** `scripts/pios/runtime/compute_reconstruction.sh`

**Change 1 — Add `import os`:**
```python
# Before:
import json, sys
# After:
import json, os, sys
```

**Change 2 — Fix `required_layers` set → sorted list (determinism fix):**
```python
# Before:
required_layers = {"L40_2", "L40_3", "L40_4"}
missing_layers = required_layers - set(li_layers.keys())

# After:
required_layers = ["L40_2", "L40_3", "L40_4"]  # sorted list — deterministic iteration
missing_layers = set(required_layers) - set(li_layers.keys())
```

**Change 3 — AXIS 2 source-discriminated per-layer check:**

```python
_repo_root = "${REPO_ROOT}"  # bash variable expansion at script execution time
for lid, layer in li_layers.items():
    if layer.get("source") == "STRUCTURAL":
        # Structural layers: verify artifact_root path exists and is non-empty
        layer_path = layer.get("path", "")
        resolved = os.path.join(_repo_root, layer_path) if (layer_path and not os.path.isabs(layer_path)) else layer_path
        if not resolved or not os.path.isdir(resolved) or not os.listdir(resolved):
            axis2_violations.append({
                "type": "STRUCTURAL_LINK",
                "description": "Structural layer " + lid + " artifact root inaccessible or empty: " + layer_path,
                "affected_units": [lid]
            })
    else:
        # IG layers: existing artifact_count and admission checks unchanged
        if layer.get("artifact_count", 0) <= 0: ...
        non_admitted = [...]; if non_admitted: ...
```

**Change 4 — AXIS 4 source-discriminated count check:**

```python
for lid in required_layers:  # already sorted list
    layer_entry = li_layers.get(lid, {})
    if layer_entry.get("source") == "STRUCTURAL":
        # Structural layers: not in admissibility_log; verify path instead
        layer_path = layer_entry.get("path", "")
        resolved = os.path.join(_repo_root, layer_path) if (layer_path and not os.path.isabs(layer_path)) else layer_path
        if not resolved or not os.path.isdir(resolved):
            axis4_violations.append({
                "type": "LAYER_CONSISTENCY",
                "description": "Structural layer " + lid + " registered path not accessible: " + layer_path,
                "affected_units": [lid]
            })
    else:
        # IG layers: existing admissibility_log count check unchanged
        al_count = ...; li_count = ...; if li_count is None: ...; elif al_count != li_count: ...
```

### Path resolution

`_repo_root` is set by bash variable expansion of `${REPO_ROOT}` at script execution time.
`REPO_ROOT` is set at line 48 of the script via `git rev-parse --show-toplevel`.
Structural layer `path` values are relative from repo root (e.g. `clients/blueedge/psee/runs/.../40_2`).
`os.path.join(repo_root, relative_path)` produces the correct absolute path.

---

## SECTION 5 — DETERMINISM IMPACT

### Set iteration fix

Changing `required_layers` from a Python `set` to a `list` eliminates the pre-existing
non-deterministic violation ordering. Violation positions in the JSON array are now stable
across executions.

### Path checks

`os.path.isdir()` and `os.listdir()` are deterministic for a stable filesystem state.
`_repo_root` is deterministic (git rev-parse output is stable within the repo).

### No new timestamp dependencies

No clock calls, no environment-variable timestamps, no stochastic behavior introduced.

### Before/after hash comparison

| run | state | hash |
|-----|-------|------|
| Pre-fix Run 1 | FAIL | `43d97821...` |
| Pre-fix Run 2 | FAIL | `ee0a2861...` (ordering non-determinism) |
| Post-fix Run 1 | PASS | `f549d806...` |
| Post-fix Run 2 | PASS | `f549d806...` (byte-identical — determinism confirmed) |

---

## SECTION 6 — VALIDATION RESULTS

### Reconstruction output (post-fix)

```
state=PASS  validated=2/2  violations=0
COMPLETENESS=PASS  STRUCTURAL_LINK=PASS  REFERENTIAL_INTEGRITY=PASS  LAYER_CONSISTENCY=PASS
```

### Axis-by-axis confirmation

| axis | pre-fix | post-fix | change |
|------|---------|----------|--------|
| COMPLETENESS | PASS | PASS | unchanged |
| STRUCTURAL_LINK | FAIL (3 violations) | PASS (0 violations) | fixed |
| REFERENTIAL_INTEGRITY | PASS | PASS | unchanged |
| LAYER_CONSISTENCY | FAIL (3 violations) | PASS (0 violations) | fixed |

### Boundary integrity

| check | result |
|-------|--------|
| 40_2/ files unmodified | CONFIRMED — all mtime older than reconstruction_state.json |
| 40_3/ files unmodified | CONFIRMED |
| 40_4/ files unmodified | CONFIRMED |
| IG artifacts unmodified | CONFIRMED — no change to any ig/ file |
| No structural content added to layer_index.json | CONFIRMED — only reconstruction script changed |
| No structural content duplicated | CONFIRMED |
| No semantic fields introduced | CONFIRMED |
| IG remains discoverability-only | CONFIRMED — source=STRUCTURAL check is read-only consumption |

---

## SECTION 7 — FINAL VERDICT

**Alignment: COMPLETE**

Reconstruction executes without structural isolation failure. All four axes PASS. The
`source=STRUCTURAL` discriminator in layer_index.json entries is the authoritative
split point — layers registered for discoverability are validated on path accessibility,
not IG admissibility log counts.

**No new boundary identified.** reconstruction_state = PASS.

**Changes made:**
- `scripts/pios/runtime/compute_reconstruction.sh` — AXIS 2 and AXIS 4 inline Python
  source-discriminated validation + `required_layers` list fix for determinism

**Changes NOT made (confirmed):**
- No modification to `pios ig integrate-structural-layers` or its layer registration format
- No modification to `layer_index.json` structure or content
- No modification to any 40_x artifact
- No modification to any IG artifact
- No modification to `pios.py` or any other command

Authority: PRODUCTIZE.RECONSTRUCTION.STRUCTURAL.LAYER.ARTIFACT.MANIFEST.ALIGNMENT.01
