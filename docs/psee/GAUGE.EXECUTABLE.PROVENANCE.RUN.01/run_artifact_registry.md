# GAUGE.EXECUTABLE.PROVENANCE.RUN.01 — Run Artifact Registry

## Registry

| artifact | type | path | used_by | loaded_via | classification | run_scoped_evidence | producer_if_known | notes |
|----------|------|------|---------|------------|----------------|---------------------|-------------------|-------|
| gauge_state.json | JSON | clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json | /api/gauge, index.js (hardcoded match) | fs.readFileSync (api/gauge.js:35) | GENERATED_PRIOR_RUN | emission_timestamp: 2026-04-06T14:03:57Z in package_manifest.json; committed in git (commit 061e3a5) | scripts/psee/run_client_runtime.py (declared, not verified live) | Contains run_id=run_01_authoritative, client_id=blueedge |
| coverage_state.json | JSON | clients/blueedge/psee/runs/run_01_authoritative/package/coverage_state.json | /api/gauge (coverage field) | fs.readFileSync (api/gauge.js:36) | GENERATED_PRIOR_RUN | Matches gauge_state.json run_id; same commit as gauge_state.json | Same as above | stream: PSEE-RUNTIME.5A |
| reconstruction_state.json | JSON | clients/blueedge/psee/runs/run_01_authoritative/package/reconstruction_state.json | /api/gauge (reconstruction field) | fs.readFileSync (api/gauge.js:37) | GENERATED_PRIOR_RUN | Matches gauge_state.json run_id; same commit | Same as above | stream: PSEE-RUNTIME.6A; axis_results has 4 keys |
| engine_state.json | JSON | clients/blueedge/psee/runs/run_01_authoritative/package/engine_state.json | NOT loaded by any API route | — | GENERATED_PRIOR_RUN | Same package dir; emission_timestamp from manifest | Same as above | execution_status: PHASE_1_ACTIVE |
| gauge_view.json | JSON | clients/blueedge/psee/runs/run_01_authoritative/package/gauge_view.json | NOT loaded by any active API route | — | GENERATED_PRIOR_RUN | Same package dir | Same as above | rendering_state: PHASE_1_ACTIVE; score_display.canonical_score: 60 |
| package_manifest.json | JSON | clients/blueedge/psee/runs/run_01_authoritative/package/package_manifest.json | NOT loaded by any active API route | — | GENERATED_PRIOR_RUN | emission_timestamp: 2026-04-06T14:03:57Z; lifecycle_state: EMITTED | Same as above | Contains verification_hash |
| verification.log | TEXT | clients/blueedge/psee/runs/run_01_authoritative/package/verification.log | NOT loaded by any API route | — | GENERATED_PRIOR_RUN | Part of run_01_authoritative package | Same as above | Outcome: PASS_FULL; 5 verification domains |
| binding_envelope.json | JSON | clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json | /api/topology | fs.readFileSync (api/topology.js:46) | GENERATED_PRIOR_RUN | generated_date: 2026-04-10 (in envelope); committed in git (commits 061e3a5, 69989d4) | scripts/psee/build_binding_convergence.py (declared in provenance field) | nodes: 45, edges: 62, signals: 5; run_335c0575a080 |
| binding_model.json | JSON | clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_model.json | NOT loaded by any active API route | — | GENERATED_PRIOR_RUN | Same run dir | scripts/psee/build_binding_convergence.py | Listed in envelope provenance chain |
| structure_manifest.json | JSON | clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/structure/structure_manifest.json | NOT loaded by any active API route | — | GENERATED_PRIOR_RUN | stream: PSEE.UUID.STRUCTURE.MATERIALIZATION.40_4; has determinism_hash | scripts/psee/emit_structure_manifest.py (declared) | temporal_classification: STATIC; source_artifact: raw_input.json |
| raw_input.json | JSON | clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/input/raw_input.json | Declared as source for structure_manifest | — | UNKNOWN_ORIGIN | Comment says "runtime artifact, not committed" but physically present; no git evidence inspected | source_system: IG (declared) | entity count: 5, domain count: 3; comment references WP-13B |
| concepts.json | JSON | app/gauge-product/lib/business-ontology/concepts.json | resolver.js (import) | ES module import at build | STATIC_REFERENCE_ALLOWED | No run-scope; static config in repo | Not produced by any script | 19 active concepts, version 1.0 |
| phrases.json | JSON | app/gauge-product/lib/business-ontology/phrases.json | renderer.js (import) | ES module import at build | STATIC_REFERENCE_ALLOWED | No run-scope; static config in repo | Not produced by any script | version 1.2; 19 active phrases |
| terms.json | JSON | app/gauge-product/lib/business-ontology/terms.json | NOT imported by any active code | — | STATIC_REFERENCE_ALLOWED | — | — | Present but unused in active execution path |
| schema.json | JSON | app/gauge-product/lib/business-ontology/schema.json | NOT imported by any active code | — | STATIC_REFERENCE_ALLOWED | — | — | Present but unused in active execution path |

---

## Run-Scope Evidence Summary

| artifact | run_scoped_evidence_type | strength |
|----------|--------------------------|----------|
| gauge_state.json | emission_timestamp in package_manifest.json + git commit hash | MODERATE — timestamp present but no runtime regeneration |
| coverage_state.json | Consistent run_id in file; same commit | MODERATE |
| reconstruction_state.json | Consistent run_id; same commit | MODERATE |
| binding_envelope.json | generated_date field + envelope provenance chain + git commit | MODERATE — provenance declared, not independently verified |
| structure_manifest.json | determinism_hash field + stream declaration | MODERATE |
| raw_input.json | Comment declares "not committed" but physically present | WEAK — no timestamp, no git evidence |

---

## Notes

- `engine_state.json` and `gauge_view.json` exist in the package but are not read by any active API route.
- Two of the 9 files in the `run_01_authoritative/package/` dir are consumed by `/api/gauge`; 5 are present but unused by current runtime.
- `/api/gauge` and `/api/topology` read from different client paths with no shared run_id.
- No `.env` files present; no `GAUGE_PACKAGE_DIR` or `GAUGE_ENVELOPE_PATH` overrides active.
