# GAUGE.EXECUTABLE.PROVENANCE.RUN.01 — Static Carry-Over Scan

## Summary

All primary GAUGE data sources are static files committed to the repository. No live regeneration occurs during GAUGE page load. The score and topology chains both terminate at static committed artifacts.

---

## Finding 1 — Score Block Hardcoded in index.js

**Type:** HARDCODED_IN_CODE

| Item | Evidence |
|------|----------|
| Location | pages/index.js, lines 213–490 |
| Hardcoded values | 60 (canonical score), 100 (projected score), [60–100] (band), PHASE_1_ACTIVE, 30/30 units, 0/40 pts, COMPUTED, PASS, NOT EVALUATED |
| Dynamic reading? | NO — these are JSX string literals in the render tree |
| API used in same file | Yes, but only for right column (RuntimeIntelligence, StructuralMetrics, SignalSet, TopologySummaryPanel) |

**Risk:** The hardcoded left-column display values would not update if gauge_state.json values changed. They are effectively a static presentation layer that coincidentally matches the current artifact values.

---

## Finding 2 — gauge_state.json is a committed static artifact

**Type:** GENERATED_PRIOR_RUN (committed to git, not regenerated at runtime)

| Item | Evidence |
|------|----------|
| Path | clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json |
| Git status | Committed; first added in commit 061e3a5 |
| Emission timestamp | 2026-04-06T14:03:57Z (from package_manifest.json) |
| Producer scripts | scripts/psee/run_client_runtime.py, scripts/psee/run_end_to_end.py (present, not invoked by runtime) |
| GAUGE API reads this | YES — fs.readFileSync at runtime |

**Risk:** Values in the API response reflect a prior execution. They will not change unless gauge_state.json is regenerated and recommitted.

---

## Finding 3 — coverage_state.json and reconstruction_state.json are committed static artifacts

**Type:** GENERATED_PRIOR_RUN

| Item | Evidence |
|------|----------|
| coverage_state.json | Committed; run_id=run_01_authoritative; source stream PSEE-RUNTIME.5A |
| reconstruction_state.json | Committed; run_id=run_01_authoritative; axis_results has 4 keys; violations=[] |
| GAUGE API reads both | YES — /api/gauge returns them as coverage and reconstruction fields |

**Diff note:** docs/pios/PSEE.RUNTIME/run_01/ contains earlier versions of these files (run_id=run_01, with additional source_file fields). The package version (run_01_authoritative) has stripped some fields. These are NOT the same file. The API reads the package version only.

---

## Finding 4 — binding_envelope.json is a committed static artifact

**Type:** GENERATED_PRIOR_RUN (committed to git, not regenerated at runtime)

| Item | Evidence |
|------|----------|
| Path | clients/1de0d815.../psee/runs/run_335c0575a080/binding/binding_envelope.json |
| Git first committed | commit 061e3a5; updated in 69989d4 |
| generated_date | 2026-04-10 (declared in envelope) |
| Producer script | scripts/psee/build_binding_convergence.py (present, not invoked by runtime) |
| TOPOLOGY API reads this | YES — fs.readFileSync at runtime |

**Risk:** Topology data reflects the state of the binding envelope at last generation. It will not update unless the script is run again and the artifact recommitted.

---

## Finding 5 — raw_input.json: uncertain status

**Type:** UNKNOWN_ORIGIN

| Item | Evidence |
|------|----------|
| Path | clients/1de0d815.../input/raw_input.json |
| Comment | "WP-13B raw input — BlueEdge client — runtime artifact, not committed" |
| Physical presence | YES — file exists |
| Git status | NOT VERIFIED — git log not checked for this path |
| source_system | IG (declared) |
| entity count | 5 |

**Risk:** Comment claims it should not be committed, but it is physically present. Its origin (IG pipeline, manual placement, or script output) is not independently verifiable without git log inspection. It is NOT directly read by any active GAUGE API route. It is only indirectly referenced as the declared origin of the topology chain.

---

## Finding 6 — Two static config JSON files in business ontology are unused

**Type:** STATIC_REFERENCE_ALLOWED (unused)

| File | Status |
|------|--------|
| app/gauge-product/lib/business-ontology/terms.json | Present in directory; NOT imported by resolver.js, renderer.js, or any active page |
| app/gauge-product/lib/business-ontology/schema.json | Present in directory; NOT imported by any active code |

These are governance artifacts present in the lib directory but not imported in the active execution path.

---

## Finding 7 — Two client paths are used; no shared run scope

**Type:** STATIC_REFERENCE_UNDECLARED (structural observation, not a direct artifact)

| API | Client path | Run id |
|-----|-------------|--------|
| /api/gauge | clients/blueedge/ | run_01_authoritative |
| /api/topology | clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/ | run_335c0575a080 |

These are different clients with different run identifiers. No runtime cross-check verifies consistency. The `blueedge` path has no UUID; the UUID path has no `blueedge` alias. Whether these represent the same underlying intake is not determinable from runtime evidence alone.

---

## Finding 8 — docs/pios/PSEE.RUNTIME/run_01/ artifacts differ from active package

**Type:** LEGACY_PRESENT_NOT_ACTIVE

| Item | Evidence |
|------|----------|
| docs/pios/PSEE.RUNTIME/run_01/gauge_state.json | run_id=run_01; additional fields (threshold_line, source_file, breakdown, variance_factors) |
| clients/blueedge/.../gauge_state.json | run_id=run_01_authoritative; stripped subset of fields |
| API reads | clients/ version only |
| docs/ version | NOT read by any active API route |

The docs version appears to be an earlier draft/version. The API reads the package version only. The docs artifacts are legacy and not active.

---

## Finding 9 — scripts exist but are not invoked by runtime

**Type:** STATIC_REFERENCE_ALLOWED (infrastructure present, dormant)

| Script | Purpose | Active? |
|--------|---------|---------|
| scripts/psee/run_end_to_end.py | Full pipeline: intake → envelope | Not invoked by UI runtime |
| scripts/psee/build_binding_convergence.py | Produces binding_envelope.json | Not invoked by UI runtime |
| scripts/psee/run_client_runtime.py | Produces gauge package artifacts | Not invoked by UI runtime |
| scripts/psee/emit_structure_manifest.py | Produces structure_manifest.json | Not invoked by UI runtime |

These scripts represent a reproducible pipeline. They are not part of the live serving path.
