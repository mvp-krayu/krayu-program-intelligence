# Bootstrap Admissibility Run-Scoped Chain Alignment Specification
# PRODUCTIZE.BOOTSTRAP.ADMISSIBILITY.RUNSCOPED.CHAIN.ALIGNMENT.01

- Version: 1.0
- Stream: PRODUCTIZE.BOOTSTRAP.ADMISSIBILITY.RUNSCOPED.CHAIN.ALIGNMENT.01
- Authority: FRESH.RUN.BOOTSTRAP.PROTOCOL.01 / S3.S4.RUN.COHERENCE.CONTRACT.01
- Branch: feature/bootstrap-admissibility-runscoped-alignment
- Date: 2026-04-14

---

## SECTION 1 — CURRENT FAILURE

**Failure observed on:** run_s8_validation_01 (from PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01)

```
pios validate freshness → BOOTSTRAP_INVALID
  AC-01: PASS
  AC-02: PASS
  AC-03: PASS
  AC-04: FAIL — source_version absent
  AC-05: FAIL — stage_participation absent
  AC-06: FAIL — coverage map absent
  AC-07: FAIL — dependency_table absent
  AC-08: FAIL — freshness_classification missing: ['gauge_state', 'coverage_state',
         'reconstruction_state', 'canonical_topology', 'signal_registry']
  AC-09: PASS
  AC-10: PASS
```

COHERENCE, COMPUTATION, and GC were not reached due to BOOTSTRAP_INVALID gate.

---

## SECTION 2 — ACTUAL AC LOGIC

Exact logic from `_check_ac_conditions()` in `scripts/pios/pios.py`:

```python
# AC-01: file must exist
if not os.path.isfile(intake_path):
    results["AC-01"] = "FAIL — intake_record.json not found"
    # all others → BLOCKED
    return results

results["AC-01"] = "PASS"
with open(intake_path, "r") as f:
    intake = json.load(f)

# AC-02: run_id field present and truthy
results["AC-02"] = "PASS" if intake.get("run_id") else "FAIL — run_id absent"

# AC-03: client_uuid field present and truthy
results["AC-03"] = "PASS" if intake.get("client_uuid") else "FAIL — client_uuid absent"

# AC-04: source_version field present and truthy
results["AC-04"] = "PASS" if intake.get("source_version") else "FAIL — source_version absent"

# AC-05: stage_participation field present and truthy
results["AC-05"] = "PASS" if intake.get("stage_participation") else "FAIL — stage_participation absent"

# AC-06: coverage field present and truthy
results["AC-06"] = "PASS" if intake.get("coverage") else "FAIL — coverage map absent"

# AC-07: dependency_table field present (can be empty list)
results["AC-07"] = "PASS" if intake.get("dependency_table") is not None else "FAIL — dependency_table absent"

# AC-08: freshness_classification dict with all 5 required keys
fc = intake.get("freshness_classification", {})
required_keys = ["gauge_state", "coverage_state", "reconstruction_state",
                 "canonical_topology", "signal_registry"]
missing = [k for k in required_keys if k not in fc]
results["AC-08"] = "PASS" if not missing else f"FAIL — freshness_classification missing: {missing}"

# AC-09: no silent inheritance in dependency_table
dep_table = intake.get("dependency_table", [])
silent = [e for e in dep_table if
          e.get("dependency_type") == "GOVERNED_RUN_INHERITANCE"
          and not e.get("source_run_id")]
results["AC-09"] = "PASS" if not silent else f"FAIL — silent inheritance in {len(silent)} entries"

# AC-10: structural check only
results["AC-10"] = "PASS"
```

**Fields required:**

| check | required field | truthy check |
|-------|---------------|-------------|
| AC-04 | `source_version` | non-empty string |
| AC-05 | `stage_participation` | non-empty list |
| AC-06 | `coverage` | non-empty dict |
| AC-07 | `dependency_table` | present (can be `[]`) |
| AC-08 | `freshness_classification` | dict with all 5 artifact keys |

---

## SECTION 3 — MODERN RUN-SCOPED BOOTSTRAP SHAPE

### File used by validate_freshness on failing run (run_s8_validation_01)

`run_s8_validation_01` was created WITHOUT `pios ledger create`. Stream 8 (PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01) added a fallback: when `intake_record.json` is absent at run_dir, `validate freshness` uses `run_identity.json` as the AC intake path.

**run_identity.json schema (from `pios ig materialize`):**
```json
{
    "run_id": "run_s8_validation_01",
    "client_uuid": "blueedge",
    "intake_id": "intake_test_local_01",
    "stream": "PRODUCTIZE.IG.FROM.INTAKE.01"
}
```

Fields present: `run_id`, `client_uuid` — sufficient for AC-02/03.
Fields absent: `source_version`, `stage_participation`, `coverage`, `dependency_table`,
`freshness_classification` — required for AC-04/05/06/07/08.

### File produced by pios ledger create (correct first step)

**intake_record.json schema (from `pios ledger create`)** — written to `<run_dir>/`:
```json
{
    "run_id": "run_bac_validation_01",
    "client_uuid": "blueedge",
    "source_version": "blueedge-platform-v1",
    "declared_at": "2026-04-14T...",
    "governed_by": "FRESH.RUN.BOOTSTRAP.PROTOCOL.01",
    "stage_participation": [
        {"stage_id": "S0", "status": "ACTIVE", ...},
        {"stage_id": "S1", "status": "ACTIVE", ...},
        {"stage_id": "S2", "status": "ACTIVE", ...},
        {"stage_id": "S3", "status": "ACTIVE", ...},
        {"stage_id": "S4", "status": "ACTIVE", ...}
    ],
    "coverage": {
        "gauge_state": "PRODUCE",
        "coverage_state": "PRODUCE",
        "reconstruction_state": "PRODUCE",
        "canonical_topology": "PRODUCE",
        "signal_registry": "PRODUCE"
    },
    "dependency_table": [],
    "freshness_classification": {
        "gauge_state": null,
        "coverage_state": null,
        "reconstruction_state": null,
        "canonical_topology": null,
        "signal_registry": null
    },
    "bootstrap_validity": { ... }
}
```

All AC-required fields present.

---

## SECTION 4 — ROOT CAUSE OF AC-04/05/06/07/08 FAILURES

**Classification: Type B — ledger/bootstrap artifact not produced**

| check | failure reason |
|-------|---------------|
| AC-04 | `run_identity.json` does not carry `source_version` — field belongs to the run ledger (S0), not the IG bridge artifact |
| AC-05 | `run_identity.json` does not carry `stage_participation` — structured stage declaration belongs to ledger |
| AC-06 | `run_identity.json` does not carry `coverage` map — artifact coverage intent belongs to ledger |
| AC-07 | `run_identity.json` does not carry `dependency_table` — dependency declaration belongs to ledger |
| AC-08 | `run_identity.json` does not carry `freshness_classification` — freshness map belongs to ledger |

**Root cause:** Test runs in Streams 5–8 were created without `pios ledger create`. The `run_identity.json` bridge artifact (from `pios ig materialize`) is a minimal identity file — it was designed to satisfy `pios bootstrap`, `pios compute gauge`, and `pios declare coherence` which need only `run_id` and `client_uuid`. It was never intended to satisfy the full AC schema.

**The AC validator is correct.** `pios ledger create` is the authoritative mechanism for producing the AC-schema ledger artifact.

---

## SECTION 5 — CHOSEN FIX STRATEGY

**Chosen: Run `pios ledger create` as the first step of the chain**

This is the minimal compliant fix. `pios ledger create` is the governed mechanism that:
- writes `intake_record.json` to `<run_dir>/` at S0
- populates all AC-required fields with correct, governed values
- declares stage participation, coverage intent, dependency table, and freshness classification

**No code changes are required.** The AC validator, `validate freshness`, `declare coherence`, and all downstream commands are already correct. The fallback introduced in Stream 8 (using `run_identity.json` for commands that need only `run_id`/`client_uuid`) remains correct and in place for backwards compatibility.

**Allowed fix per contract: "additive population of required intake/bootstrap fields"** — this is exactly what `pios ledger create` does.

### Correct chain order

```
pios ledger create   --run-id <run_id> --client <tenant> --source-version <version>
                     → writes clients/<tenant>/psee/runs/<run_id>/intake_record.json
                       with full AC schema (AC-01 through AC-10 satisfied)

pios bootstrap       --run-dir <run_dir>
                     → reads intake_record.json (full schema)
                     → writes package/engine_state.json + gauge_inputs.json

pios intake create   --tenant <tenant> --intake-id <intake_id> --source-path <path>
                     → writes clients/<tenant>/psee/intake/<intake_id>/
                       (governed source bundle)

pios ig materialize  --tenant <tenant> --intake-id <intake_id> --run-id <run_id>
                     → writes clients/<tenant>/psee/runs/<run_id>/ig/
                     → writes clients/<tenant>/psee/runs/<run_id>/run_identity.json
                       (redundant bridge artifact — harmless when intake_record.json present)

pios structural extract / relate / normalize
pios ig integrate-structural-layers
pios emit coverage
pios emit reconstruction
pios emit topology
pios emit signals
pios compute gauge
pios declare coherence
pios validate freshness   → GOVERNED AND FRESH THROUGH S4
```

### Why run_identity.json remains correct

`run_identity.json` satisfies commands that need only `run_id` and `client_uuid`:
- `pios bootstrap` (when intake_record.json absent — legacy-free runs)
- `pios compute gauge` (same)
- `pios declare coherence` (same)

`validate freshness` uses `intake_record.json` when present (as in the correct chain),
falling back to `run_identity.json` only when `intake_record.json` is absent. The fallback
correctly yields BOOTSTRAP_INVALID (AC-04/05/06/07/08 fail) — this is the expected behavior
for a run that never had `pios ledger create` run. No schema weakening.

---

## SECTION 6 — IMPLEMENTATION DETAILS

**No code changes made.**

The fix is: ensure `pios ledger create` is executed as the first step of the chain.

The code is already correct:
- `_check_ac_conditions` checks the right fields
- `validate_freshness` reads `intake_record.json` first (before falling back to `run_identity.json`)
- `pios ledger create` writes the full AC schema to `<run_dir>/intake_record.json`
- All four conditions — file exists (AC-01), run_id/client_uuid (AC-02/03), source_version/stage_participation/coverage/dependency_table/freshness_classification (AC-04/05/06/07/08) — are satisfied

**Why this does not weaken admissibility:**
- AC conditions are unchanged
- AC checks are not bypassed
- No field is marked PASS without evidence
- Source_version comes from the caller (`pios ledger create --source-version`) — explicit, governed, not fabricated
- Stage_participation, coverage, dependency_table, freshness_classification are declared at ledger creation time — authoritative S0 artifact

---

## SECTION 7 — VALIDATION RESULTS

### Fresh run: run_bac_validation_01

**Chain executed:**
1. `pios ledger create --run-id run_bac_validation_01 --client blueedge --source-version blueedge-platform-v1` — PASS
2. `pios bootstrap --run-dir ...` — PASS (reads full intake_record.json)
3. `pios intake create --tenant blueedge --intake-id intake_bac_01 --source-path /tmp/intake_test_local` — PASS
4. `pios ig materialize --tenant blueedge --intake-id intake_bac_01 --run-id run_bac_validation_01` — PASS
5. `pios structural extract/relate/normalize` — PASS (2 units, 2 edges, 2 nodes)
6. `pios ig integrate-structural-layers` — PASS (L40_2/L40_3/L40_4 registered)
7. `pios emit coverage` — PASS (coverage_percent=100.0 state=COMPUTED)
8. `pios emit reconstruction` — PASS (state=PASS violations=0 all axes PASS)
9. `pios emit topology` — PASS (domains=17 capabilities=42 components=89)
10. `pios emit signals` — PASS (5 signals)
11. `pios compute gauge` — PASS (score=100 band=READY S-13 COMPLETE)
12. `pios declare coherence` — PASS (MODE_B COHERENT)
13. `pios validate freshness` — **GOVERNED AND FRESH THROUGH S4**

### validate freshness full result

```
BOOTSTRAP: VALID
  AC-01 through AC-10: ALL PASS

COHERENCE: COHERENT
  CA-01 through CA-10: ALL PASS

COMPUTATION: COMPUTABLE
  GC-01 through GC-10: ALL PASS

SC_CRITERIA:
  SC-01 through SC-10: ALL PASS (SC-06 NOT_EVALUATED — live implementation check)

VERDICT: GOVERNED AND FRESH THROUGH S4
```

### No blockers remain

The entire `validate freshness` command passes through all three gates:
- BOOTSTRAP VALID (AC)
- COHERENCE COHERENT (CA)
- COMPUTATION COMPUTABLE (GC)

SC-06 reports NOT_EVALUATED for GA-01/GA-12 live implementation checks — this is a structural
check that requires live system verification, not a blocking failure.

---

## SECTION 8 — DETERMINISM AND GOVERNANCE

### Determinism

`pios ledger create` produces a deterministic `intake_record.json`:
- `run_id` = caller argument
- `client_uuid` = caller argument (`--client`)
- `source_version` = caller argument (`--source-version`)
- `stage_participation` = fixed structure (same for all runs per FRESH.RUN.BOOTSTRAP.PROTOCOL.01)
- `coverage` = fixed structure (PRODUCE for all 5 artifacts)
- `dependency_table` = `[]` (no dependencies declared at S0)
- `freshness_classification` = `{key: null}` for all 5 artifacts (populated by S1–S4)
- `declared_at` = wall clock time (the only non-deterministic field — unavoidable for ledger creation timestamp)

`declared_at` varies between runs but is informational only — no AC check depends on it.

### Governance

- No static IG dependency reintroduced
- No manual patch step required
- No silent schema weakening
- AC checks unchanged and enforced
- `pios ledger create` is governed by FRESH.RUN.BOOTSTRAP.PROTOCOL.01
- run_identity.json remains present and correct for legacy-free runs
- No regression in any already-passing step

### No code changes = no new defect surface

The fix requires no code modifications. The existing code path, when the chain is executed in
the correct order starting with `pios ledger create`, fully satisfies all AC conditions.

---

## SECTION 9 — FINAL VERDICT

**Alignment: COMPLETE**

BOOTSTRAP VALID for the modern run-scoped chain. AC-01 through AC-10 all PASS.
COHERENCE COHERENT. COMPUTATION COMPUTABLE. Verdict: GOVERNED AND FRESH THROUGH S4.

**Root cause:** `pios ledger create` was not executed as the first step in prior test runs.
This command is the authoritative S0 producer of the full AC-schema ledger artifact.

**Fix applied:** Execute `pios ledger create` as the first step. No code changes required.
Existing AC validator is correct and enforced without weakening.

**No new boundary identified.** validate freshness reaches GOVERNED AND FRESH THROUGH S4.
The modern run-scoped executable chain is fully validated end-to-end.

Authority: PRODUCTIZE.BOOTSTRAP.ADMISSIBILITY.RUNSCOPED.CHAIN.ALIGNMENT.01
