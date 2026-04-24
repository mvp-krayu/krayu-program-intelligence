# STEP 10E — GAUGE Artifact Blocker Resolution Assessment

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10E
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Context

STEP 10E objective: determine the correct resolution path for the three GAUGE artifact
blockers identified in STEP 10D. READ-ONLY assessment. No code modifications.

Client: `e65d2f0a-dfa7-4257-9333-fcbb583f0880`
Run: `run_01_oss_fastapi`

---

## CANONICAL Brain

**Evidence audit — what native data exists:**

| Artifact | Location | Key values confirmed |
|----------|----------|---------------------|
| `lineage/raw_input.json` | `psee/runs/run_01_oss_fastapi/lineage/` | `__coverage_percent=100.0`, `__reconstruction_state=PASS`, 5 domains (DOM-01..DOM-05), 10 entities (CEU-01..CEU-10), 2 OVERLAP_STRUCTURAL relationships |
| `binding_envelope.json` | `psee/runs/run_01_oss_fastapi/binding/` | 5 domains, 30 capability surfaces, 45 nodes, 62 edges; structural authority = `structure_manifest.json` |

**Governance note — BlueEdge metadata in source artifacts:**

`lineage/raw_input.json` carries `__stream: "PSEE.BLUEEDGE.CEU.LINEAGE.EXTRACTOR"` and
`__source_run_id: "run_01_authoritative"` in its provenance header fields. These are
extractor metadata — they identify the tool stream that produced the file, not the
underlying data values. The actual computed values (5 domains, 10 entities, coverage=100.0,
reconstruction=PASS) are correct for the second client and were validated in STEP 8.
This mirrors the `binding_envelope.json:artifact_id` BlueEdge identifier concern from
STEP 10A — provenance metadata, not data contamination.

**CANONICAL decision — Option A: produce from native second-client data**

Evidence First is preserved by PATH A: all derivations trace to verified PSEE artifacts
(`lineage/raw_input.json`, `binding_envelope.json`) that passed STEP 8 validation with
`run_manifest.json:final_status=PASS`. No values need to be invented. No BlueEdge data
values need to be carried forward. The provenance metadata fields in source artifacts are
noted as a governance concern but do not block derivation.

---

## CODE Brain

**Blocker-by-blocker analysis:**

### BLOCKER-1 — No IG dir (`pios emit coverage`, `pios emit reconstruction`)

`compute_coverage.sh` reads IG pipeline artifacts (`evidence_boundary.json`,
`admissibility_log.json`, `normalized_intake_structure/layer_index.json`,
`source_manifest.json`). None of these exist for the second client — the run was
produced via STEP 7 (`run_end_to_end.py`), not the `pios ig materialize` pipeline.

However: `lineage/raw_input.json` contains `__coverage_percent=100.0` and
`__reconstruction_state=PASS` as authoritative values from the PSEE run. These are the
exact values `compute_coverage.sh` and `compute_reconstruction.sh` would compute if the
IG pipeline had run. The data exists — it is in a different artifact format.

**Assessment:** True implementation gap — IG pipeline was not run. BUT: derivation from
`lineage/raw_input.json` is feasible and Evidence First compliant.

**Minimal safe scope:** New script `emit_coverage_state.py` that reads
`lineage/raw_input.json` and produces `package/coverage_state.json` in the correct format
(deriving `coverage_percent=100.0`, `admissible_units=10`, `required_units=10`,
`state=COMPUTED` from confirmed PSEE values). Companion `emit_reconstruction_state.py`
similarly derives `reconstruction_state.json` (`state=PASS`, axis results, units from
PSEE run data). No new computation — format translation of verified values.

### BLOCKER-2 — `emit_canonical_topology.py` hardcodes BlueEdge 17/42/89 parity guard

`emit_canonical_topology.py` → `build_semantic_layer.py` → `DOMAINS[17]`, `CAPABILITIES[42]`,
`COMPONENTS[89]`. The parity guard `fail()` is unconditional. The second client has 5 domains
and 30 capability surfaces.

`binding_envelope.json:authority_boundary:wp13b_declaration` confirms that `structure_manifest.json`
is the structural authority. The binding envelope itself derives from `structure_manifest.json`
and contains the complete second-client topology: 5 domains, 30 capability surfaces, 45 nodes,
62 edges.

**Assessment:** True implementation gap — `emit_canonical_topology.py` is a single-client
BlueEdge script, not a multi-client tool. Derivation from `binding_envelope.json` is feasible
and Evidence First compliant.

**Minimal safe scope:** New script `emit_topology_from_binding.py` that reads
`binding/binding_envelope.json` from the PSEE run and produces `package/canonical_topology.json`
with correct counts derived from the binding envelope's capability surfaces (domains=5,
capabilities=30, nodes=45). Does not modify `emit_canonical_topology.py` or BlueEdge data.

### BLOCKER-3 — `build_signals.py` hardcodes BlueEdge signal data

`build_signals.py` contains a hardcoded `SIGNALS` list: SIG-001..SIG-005 with BlueEdge-specific
evidence chains (INTEL-001, COND-001..003, DIAG-006, 40.5/40.6/40.7 stream artifacts). These
are BlueEdge intelligence signals and have no counterpart in the second-client evidence base.

The second client (`run_01_oss_fastapi`) has no computed intelligence signals. There is no
evidence in `psee/runs/run_01_oss_fastapi/` from which SIG-XXX entries could be derived.
An empty signal registry — `signals: []` with CC-2 annotation — is the accurate
representation of this state.

**Assessment:** True implementation gap AND accurate representation gap — the second client
genuinely has no signals at this stage. An empty `signal_registry.json` is not a placeholder;
it is the honest, Evidence First statement of what was computed.

**Minimal safe scope:** New script `emit_signals_empty.py` that produces
`package/signal_registry.json` with `signals: []` and the CC-2 correction block. Alternatively,
parameterize `pios emit signals` to accept an external signals list. The CC-2 annotation
ensures the empty registry is correctly governed.

---

## PRODUCT Brain

**Which Tier-2 fields become DEFERRED without GAUGE?**

All five REQUIRED_PACKAGE_ARTIFACTS feed GAUGE. Without `gauge_state.json`, the following
vault claim nodes cannot be populated:

- CLM-09 (Proven Structural Score), CLM-10 (Achievable Score), CLM-11 (Band), CLM-12 (Confidence Range) — all GAUGE `score.*` and `confidence.*` fields
- CLM-01 (Coverage), CLM-03 (Reconstruction) — GAUGE DIM-01 and DIM-02
- CLM-25 (Executive Verdict) — GAUGE multi-axis
- CLM-13 (Execution Status) — GAUGE state
- CLM-20..CLM-24 (Signal claims) — signal_registry (empty for second client)

**PATH B assessment (working vault without GAUGE):**

`build_evidence_vault.py:build_vault_model()` checks all five `REQUIRED_PACKAGE_ARTIFACTS`
before any vault content is produced (`sys.exit(1)` on missing artifact). The STEP 10C
`--package-dir` addition did NOT change this check — it only redirected where `package_dir`
points. PATH B would require weakening this fail-closed behavior, which the STEP 10C
contract explicitly prohibits. PATH B is not viable.

**PRODUCT decision:** PATH A. The PSEE evidence base for the second client is sufficient
to derive all four GAUGE inputs from native artifacts. The gap is implementation, not data.
With PATH A implemented, GAUGE produces real (not deferred) scores and a complete vault.

---

## PUBLISH Brain

**Until GAUGE runs (current state):**

- Score/confidence claims (CLM-09, CLM-10, CLM-11, CLM-12, CLM-25): DEFERRED — no
  `gauge_state.json` in vault
- Signal claims (CLM-20..CLM-24): DEFERRED — no `signal_registry.json`
- Structural claims backed by PSEE binding (CLM-01..CLM-08): derivable once GAUGE runs

No external claim may state full GAUGE completeness. No score values may be published
until GAUGE artifacts are produced at `psee/runs/run_01_oss_fastapi/package/` and vault
is built from them.

**PATH A publish-safety:** Once PATH A implementation produces the four GAUGE inputs from
second-client PSEE artifacts, GAUGE (`pios compute gauge`) runs from those inputs and
produces a real `gauge_state.json` with correct `client_id=e65d2f0a-...` and
`run_id=run_01_oss_fastapi`. No BlueEdge values propagate. The contaminated
`runs/package/gauge_state.json` (with `client_id: "blueedge"`) is structurally excluded
by path — `psee/runs/` and `runs/` are separate directories.

**PUBLISH verdict:** No prohibited claims. PATH A enables real scores via clean derivation.
All score/confidence claims remain DEFERRED until STEP 10F implementation completes and
vault is built.

---

## Selected Path: A — Implement native second-client GAUGE emit path

**Rationale:**

1. Evidence exists for all four required inputs — no invention, no placeholders, no BlueEdge
   data values carried forward
2. Evidence First is preserved — all derivations trace to STEP 8-validated artifacts
3. PATH B requires weakening `build_vault_model()` fail-closed behavior — forbidden by contract
4. PATH C (block until full PiOS/GAUGE chain) delays unnecessarily: the data is available and
   the derivation is legitimate. The absence of a full PiOS 41.x native workspace for the
   second client does not prevent Evidence First derivation from PSEE artifacts
5. The empty signal registry is not a gap — it is the accurate representation of the
   second client's current intelligence state

**Implementation scope (STEP 10F — not executed here):**

| New script | Source | Output |
|-----------|--------|--------|
| `emit_coverage_state.py` | `lineage/raw_input.json` | `package/coverage_state.json` |
| `emit_reconstruction_state.py` | `lineage/raw_input.json` | `package/reconstruction_state.json` |
| `emit_topology_from_binding.py` | `binding/binding_envelope.json` | `package/canonical_topology.json` |
| `emit_signals_empty.py` | (no source — empty registry) | `package/signal_registry.json` |

After these four scripts run, `pios compute gauge --run-dir ...` completes the sequence
and produces `package/gauge_state.json`. No modifications to existing scripts required.

---

## Rejected Paths

### PATH B — Working vault without GAUGE package; GAUGE-derived fields DEFERRED

REJECTED. `build_vault_model()` enforces `REQUIRED_PACKAGE_ARTIFACTS` with `sys.exit(1)`.
The STEP 10C change did not weaken this check. Making PATH B work would require either:
(a) weakening the fail-closed artifact check — explicitly prohibited by STEP 10C contract;
(b) creating placeholder/stub artifacts — violates Evidence First. Both are impermissible.

### PATH C — Block STEP 10 until full PiOS/GAUGE chain exists

REJECTED. The full PiOS/GAUGE chain (IG pipeline, 41.1/41.4 native workspace for second
client) is not required when Evidence First derivation from verified PSEE artifacts is
available and sufficient. PATH C delays a deliverable vault without a governing reason.
The blocking condition does not exist.

---

## Next Step (10F)

STEP 10F contract requirements:

1. Implement `emit_coverage_state.py` — reads `lineage/raw_input.json`, produces
   `package/coverage_state.json` (format-compatible with `pios compute gauge` inputs)
2. Implement `emit_reconstruction_state.py` — reads `lineage/raw_input.json`, produces
   `package/reconstruction_state.json`
3. Implement `emit_topology_from_binding.py` — reads `binding/binding_envelope.json`,
   produces `package/canonical_topology.json`
4. Implement `emit_signals_empty.py` — produces `package/signal_registry.json` with
   `signals: []` and CC-2 annotation
5. Confirm output format compatibility with `pios compute gauge` requirements

STEP 10F is a CODE implementation contract. All four scripts must be written and validated
against expected schema before `pios compute gauge` may be invoked (STEP 10G).

---

## Confirmation: No Runtime Execution

No scripts executed. No pipeline commands run. No vault built. No code modified.
All assessment derived from reading existing artifacts and scripts.

---

## STEP 10E Status

**COMPLETE** (resolution path selected: PATH A; STEP 10F implementation contract required)
