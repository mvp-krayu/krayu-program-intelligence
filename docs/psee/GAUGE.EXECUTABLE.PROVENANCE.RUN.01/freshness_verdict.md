# GAUGE.EXECUTABLE.PROVENANCE.RUN.01 — Freshness Verdict

## Verdict Table

| layer | verdict | evidence basis | blocking uncertainty |
|-------|---------|----------------|----------------------|
| Score composition (index.js primary display) | STATIC REFERENCE ONLY | Main score block (60, 100, [60–100], PHASE_1_ACTIVE, CONDITIONAL) is hardcoded in JSX, not read from API. Values coincide with gauge_state.json but are not derived from it at render time. | No mechanism to detect if gauge_state.json changes relative to hardcoded values |
| Score composition (overview.js / API path) | STATIC REFERENCE ONLY | gaugeData.score.canonical, gaugeData.projection.value, gaugeData.confidence.* all read from /api/gauge → gauge_state.json. File is committed to git (commit 061e3a5), emission_timestamp 2026-04-06T14:03:57Z. No runtime regeneration. | No fresh execution pipeline invoked; static file since Apr 6 |
| Coverage | STATIC REFERENCE ONLY | DIM-01 fields (coverage_percent=100.0, admissible_units=30, required_units=30) read from /api/gauge → gauge_state.json + coverage_state.json. Both are committed static artifacts from the same package (run_01_authoritative). | Same as score |
| Reconstruction | STATIC REFERENCE ONLY | DIM-02 fields (state=PASS, validated_units=30, axis_results) read from /api/gauge → gauge_state.json + reconstruction_state.json. axis_count and violation_count derived in memory but bounded by static JSON. | Same as score |
| Completion / Execution | STATIC REFERENCE ONLY | "NOT EVALUATED" is hardcoded in index.js JSX. CONCEPT-06 in overview.js reflects state.execution_status='PHASE_1_ACTIVE' from gauge_state.json (static). No execution artifact exists. The absence is real: execution has not run, and no stale execution result exists to contaminate. | No execution artifact — absence is genuine |
| Confidence band | STATIC REFERENCE ONLY | index.js: hardcoded JSX literals 60, 100. overview.js ScoreGauge: reads gaugeData.confidence.lower/.upper from /api/gauge → gauge_state.json (static, committed). confidence.status = COMPUTED declared in file. | Same as score |
| Topology | STATIC REFERENCE ONLY | binding_envelope.json: committed artifact (commits 061e3a5, 69989d4), generated_date 2026-04-10. Read by /api/topology via fs.readFileSync. buildRenderModel derives topology model in memory from committed JSON. All node counts, overlap edges, constraint_flags are deterministic derivations of this static file. | envelope produced by scripts; scripts present but not currently invoked; different client path from gauge |
| Executive / decision layer | STATIC REFERENCE ONLY | All inputs to resolver.js, renderer.js, ExecutiveDecisionBlock are derived from gaugeData (Chain A) and topoData (Chain B). Both terminate at committed static files. The in-memory derivation is correct and deterministic — but it is bounded by static inputs. | Bounded by both upstream static chains |
| Binding envelope usage | STATIC REFERENCE ONLY — ACTIVELY USED | binding_envelope.json IS actually read by /api/topology (confirmed via code inspection). It passes validateEnvelope and buildRenderModel. The topology display reflects its content faithfully. The envelope is static but it is the live source. | Envelope is committed static artifact from a prior run (run_335c0575a080) |

---

## Freshness Posture

**MIXED / PARTIALLY STATIC**

Rationale:
- The topology chain (binding_envelope.json) has a declared upstream pipeline (raw_input.json → scripts → envelope) and the scripts are present and executable. The pipeline appears to have been run at some point (generated_date: 2026-04-10). The artifacts are committed, not freshly generated on page load.
- The score chain (gauge_state.json) similarly has a declared pipeline (PSEE engine scripts) that was run at a prior point. The artifacts are committed.
- The primary index.js display is hardcoded — fully static regardless of artifact state.
- No execution layer exists. Completion = 0 is genuine absence, not contamination.
- Both static chains are internally consistent (values cross-check, run_ids consistent within each chain) and have declared upstream pipelines that could in principle regenerate them.

The system is **not FRESH** (no live regeneration occurs at runtime), **not CONTAMINATED** (no inconsistencies found between artifacts and displayed values), and **not NOT_PROVEN** (the static sources are identified and their content is verified). It is a static-reference deployment: committed artifacts serving as the live data source.

---

## Hypothesis Assessment

### H1 — GAUGE v1 baseline history
**NOT SUPPORTED by current runtime evidence.** No reference to "psee-gauge-validated-v1" tag or any IG.2–IG.7 ingestion paths found in current active code. `docs/pios/PSEE.RUNTIME/run_01/` contains an earlier version of gauge_state.json (run_id=run_01) which differs from the package version (run_01_authoritative). The docs version has additional fields including `source_file` references to `coverage_state.json` and `reconstruction_state.json`. This is HISTORICAL_CONTEXT_ONLY — not active.

### H2 — PSEE absorption / restructuring
**PARTIALLY SUPPORTED.** The active package (run_01_authoritative) has a different and stripped version of gauge_state.json compared to docs/pios/PSEE.RUNTIME/run_01/. This is consistent with restructuring: the authoritative package appears to be a cleaned-up version that dropped some IG-era fields (source_file references, threshold_line, breakdown subfields). This is HISTORICAL_CONTEXT_ONLY for the dropped fields.

### H3 — Mixed lineage hypothesis
**CONFIRMED AS STRUCTURAL FACT.** The GAUGE score chain reads from `clients/blueedge/` (aliased client path, run_01_authoritative) while the TOPOLOGY chain reads from `clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/` (UUID client path, run_335c0575a080). These are different client paths with different run IDs. This is a live two-source mixed lineage, not a single coherent run. Whether both paths represent the same underlying client is not determinable from runtime evidence alone.

---

## Chain Integrity Summary

| chain | internally consistent | cross-chain consistent | notes |
|-------|-----------------------|------------------------|-------|
| Score (A) | YES — values in gauge_state.json match coverage/reconstruction/engine_state.json | N/A within chain | package_manifest verification.log: PASS_FULL |
| Topology (B) | YES — envelope is valid JSON, passes validateEnvelope, buildRenderModel executes | N/A within chain | 45 nodes, 62 edges, 5 signals — deterministic derivation |
| A vs B | NOT VERIFIED — different clients, different run IDs | — | No runtime cross-check mechanism exists |
| Hardcoded (index.js) vs A | Values MATCH at current artifact state | — | Will drift if gauge_state.json is updated without updating JSX |
