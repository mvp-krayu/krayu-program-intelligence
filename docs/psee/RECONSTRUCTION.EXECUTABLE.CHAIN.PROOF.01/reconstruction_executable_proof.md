# Reconstruction Executable Chain Proof
# RECONSTRUCTION.EXECUTABLE.CHAIN.PROOF.01

- Date: 2026-04-14
- Stream: RECONSTRUCTION.EXECUTABLE.CHAIN.PROOF.01
- Branch: feature/reconstruction-executable-proof
- Run under proof: run_st40_validation_01 (tenant: blueedge)
- Execution engine: Claude Code (claude-sonnet-4-6)

---

## SECTION 1 — EXECUTION ENTRYPOINT

**Primary entrypoint (CLI):**

```
python3 scripts/pios/pios.py emit reconstruction \
  --run-dir clients/blueedge/psee/runs/run_st40_validation_01 \
  --ig-dir  clients/blueedge/psee/runs/run_st40_validation_01/ig
```

**Delegation chain:**

```
pios emit reconstruction
  → cmd_emit_reconstruction()  [scripts/pios/pios.py:319]
  → DIM-01 precondition: package/coverage_state.json.state == "COMPUTED"
  → bash scripts/pios/runtime/compute_reconstruction.sh <pkg_dir> <ig_dir>
     → 4-axis Python inline validation block
     → writes package/reconstruction_state.json
     → writes package/gauge_inputs.json (DIM-02 state_label only)
```

**Script:** `scripts/pios/runtime/compute_reconstruction.sh`

**Execution is explicit, reproducible, and CLI-invocable.** No pseudo-execution.

---

## SECTION 2 — RUN CONTEXT

| field | value |
|-------|-------|
| run_id | run_st40_validation_01 |
| tenant | blueedge |
| intake_id | intake_test_local_01 |
| ig/ present | YES |
| 40_2/ present | YES |
| 40_3/ present | YES |
| 40_4/ present | YES |
| layer_index.json layers | L_ROOT, L40_2, L40_3, L40_4 |
| layer integration stream | PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01 |
| package/coverage_state.json.state | COMPUTED |
| DIM-01 precondition | PASS |

**IG artifacts consumed by script:**
- `ig/evidence_boundary.json`
- `ig/admissibility_log.json`
- `ig/normalized_intake_structure/layer_index.json`
- `ig/normalized_intake_structure/provenance_chain.json`
- `ig/normalized_intake_structure/source_profile.json`
- `ig/source_manifest.json`

---

## SECTION 3 — EXECUTION RESULT

**Outcome: FAIL**

```
state=FAIL  validated=2/2  violations=6
```

| axis | result |
|------|--------|
| COMPLETENESS | PASS |
| STRUCTURAL_LINK | FAIL |
| REFERENTIAL_INTEGRITY | PASS |
| LAYER_CONSISTENCY | FAIL |

**State determination:** `STRUCTURAL_LINK` is a declared critical type in `compute_reconstruction.sh`.
Any critical violation → `state=FAIL`. The 3 STRUCTURAL_LINK violations drive the FAIL outcome.

---

## SECTION 4 — FAILURE ISOLATION

### Violation inventory (6 total)

| # | type | description | affected |
|---|------|-------------|----------|
| 01 | STRUCTURAL_LINK | Layer L40_2 has no artifacts (isolated node) | L40_2 |
| 02 | STRUCTURAL_LINK | Layer L40_3 has no artifacts (isolated node) | L40_3 |
| 03 | STRUCTURAL_LINK | Layer L40_4 has no artifacts (isolated node) | L40_4 |
| 04 | LAYER_CONSISTENCY | Layer L40_2 missing from layer_index (cannot verify count) | L40_2 |
| 05 | LAYER_CONSISTENCY | Layer L40_3 missing from layer_index (cannot verify count) | L40_3 |
| 06 | LAYER_CONSISTENCY | Layer L40_4 missing from layer_index (cannot verify count) | L40_4 |

### Exact failure location

**File:** `scripts/pios/runtime/compute_reconstruction.sh`
**Block:** AXIS 2 (STRUCTURAL_LINK) inline Python validation — approximately line 183

```python
# AXIS 2 — check triggering violations 01–03
for lid, layer in li_layers.items():
    if layer.get("artifact_count", 0) <= 0:          # ← L40_2/3/4 have no artifact_count field
        axis2_violations.append({                     # ← defaults to 0; 0 <= 0 == True
            "type": "STRUCTURAL_LINK",
            "description": "Layer " + lid + " has no artifacts (isolated node)",
            "affected_units": [lid]
        })
```

**File:** `scripts/pios/runtime/compute_reconstruction.sh`
**Block:** AXIS 4 (LAYER_CONSISTENCY) inline Python validation — approximately line 297

```python
# AXIS 4 — check triggering violations 04–06
for lid in required_layers:
    li_count = li_layers.get(lid, {}).get("artifact_count", None)  # ← returns None
    if li_count is None:                                             # ← triggers
        axis4_violations.append({
            "type": "LAYER_CONSISTENCY",
            "description": "Layer " + lid + " missing from layer_index (cannot verify count)",
            ...
        })
```

### Root cause

Structural layer entries registered by `pios ig integrate-structural-layers` are
**discoverability-only registrations** — they contain `layer_id`, `source`, `path`,
`artifact_root`, `layer_index`, `provenance`. They do **not** contain `artifact_count`
or `artifacts[]`.

The reconstruction script's AXIS 2 and AXIS 4 checks expect all `layers[]` entries to carry
`artifact_count > 0` and an `artifacts[]` array — the same structure as `L_ROOT`.

**Impedance mismatch:** structural layer registration format ≠ IG runtime artifact layer format.

The script treats a layer with `artifact_count=0` (or absent) as an "isolated node" — a structural
break. This is the correct behavior given the script's invariant: every registered layer must
be substantiated with a non-empty artifact list.

### Next boundary

The boundary requiring resolution is:

> `pios ig integrate-structural-layers` writes discoverability entries only.
> The reconstruction script requires `artifact_count` and `artifacts[]` in every layer entry.
> Either the integration must include artifact manifests for structural layers,
> OR the reconstruction script must accept source=STRUCTURAL layers with a different validation path.

This is a **schema alignment boundary**, not a missing-layer boundary.

---

## SECTION 5 — BOUNDARY CONSUMPTION VALIDATION

### Old blocker: CONFIRMED REMOVED

```python
required_layers = {"L40_2", "L40_3", "L40_4"}
li_layers = {layer["layer_id"]: layer for layer in li.get("layers", [])}
missing_layers = required_layers - set(li_layers.keys())
# missing_layers = set()  ← EMPTY — all three layers are present
```

**"Required layers missing from layer_index.json"** violation count: **0**

The structural-layer absence check passes completely.

### Structural layers detected and processed

```
Layers consumed by reconstruction: ['L_ROOT', 'L40_2', 'L40_3', 'L40_4']
L40_2 detected: True
L40_3 detected: True
L40_4 detected: True
```

### No L_ROOT-only fallback

The script reads `li_layers` from the live `layer_index.json`. All 4 layers are iterated.
The failures for L40_2/L40_3/L40_4 occur **because the script processes those layers** — not
because they are absent. No fallback to L_ROOT-only behavior occurs.

### Axis consumption confirmation

| check | source | consumed | result |
|-------|--------|----------|--------|
| missing_layers check (AXIS 2) | layer_index.json layers | L40_2, L40_3, L40_4 detected | PASS |
| artifact_count check (AXIS 2) | layer_index.json per-layer | 0 for L40_2/3/4 | FAIL |
| al_count vs li_count (AXIS 4) | layer_index.json + admissibility_log | li_count=None for L40_2/3/4 | FAIL |

The reconstruction script IS consuming the integrated structural layers. It fails on what they
contain, not on their absence.

---

## SECTION 6 — DETERMINISM VERDICT

### Violation content: DETERMINISTIC

The 6 violations (3 STRUCTURAL_LINK + 3 LAYER_CONSISTENCY) are identical across both
execution runs. Types, descriptions, and affected units do not vary.

### Violation ordering in JSON: NON-DETERMINISTIC (pre-existing)

The reconstruction script iterates `required_layers = {"L40_2", "L40_3", "L40_4"}` which is a
Python **set**. Set iteration order is not guaranteed. Consequently, violations 04–06
(LAYER_CONSISTENCY) may appear in different order between runs, producing different
`reconstruction_state.json` SHA256 hashes:

```
Run 1:  43d97821083179f58323a03c8fa355299a4c5449b63c70c9fcff587829ddd4c7
Run 2:  ee0a286144b2398eedd5aba29a8032775475e18810b600b0866a083970ad538c
```

**This non-determinism is pre-existing in `compute_reconstruction.sh`** — it is not introduced
by this stream. The state (`FAIL`), axis results, and violation content are deterministic.
Only the JSON ordering within the violations array varies.

---

## SECTION 7 — FINAL VERDICT

### Old structural-layer-absence blocker: REMOVED

The `pios ig integrate-structural-layers` stream fulfilled its stated objective.
L40_2, L40_3, L40_4 are present in `layer_index.json` and are detected by the
reconstruction script. The "Required layers missing" check returns zero violations.

### Current reconstruction state: FAIL

Reconstruction fails at a new, precisely isolated boundary:

> **AXIS 2 STRUCTURAL_LINK** — `compute_reconstruction.sh` inline Python block  
> `layer.get("artifact_count", 0) <= 0` evaluates True for structural layer entries  
> because discoverability-only layer registrations carry no `artifact_count` or `artifacts[]`

### Failure is NOT due to missing structural layers

The failure is due to a **schema alignment gap** between:
- the discoverability-only registration format produced by `pios ig integrate-structural-layers`
- the IG runtime layer format expected by `compute_reconstruction.sh` AXIS 2/4 checks

### Next boundary

**Name:** STRUCTURAL_LAYER_ARTIFACT_MANIFEST_ALIGNMENT  
**Location:** `scripts/pios/runtime/compute_reconstruction.sh` AXIS 2 `artifact_count` check  
**Resolution path:** structural layer entries must either:
  - (A) include `artifact_count` and `artifacts[]` populated from the 40_x artifact directories, OR
  - (B) the reconstruction script must introduce a source-discriminated validation path for `source=STRUCTURAL` layers

Authority: RECONSTRUCTION.EXECUTABLE.CHAIN.PROOF.01
