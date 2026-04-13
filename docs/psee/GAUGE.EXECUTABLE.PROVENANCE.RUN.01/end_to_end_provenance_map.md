# GAUGE.EXECUTABLE.PROVENANCE.RUN.01 — End-to-End Provenance Map

## Trace Overview

Two separate execution chains feed the GAUGE product. They are sourced from different client paths and were last generated at different points in time. Both chains terminate at committed static files in the repo.

---

## Chain A — Score / Dimension Data (GAUGE API → gauge_state.json)

### A1 → A5 Forward trace

```
GAUGE UI (pages/index.js, pages/overview.js)
  │
  ├─ [Right column / overview API calls]
  │     fetch('/api/gauge')
  │         │
  │         └─ pages/api/gauge.js
  │               REPO_ROOT = process.cwd()/../..
  │               PACKAGE_DIR = clients/blueedge/psee/runs/run_01_authoritative/package/
  │               │
  │               ├─ readJson(PACKAGE_DIR/gauge_state.json)       ← STATIC FILE
  │               ├─ readJson(PACKAGE_DIR/coverage_state.json)    ← STATIC FILE
  │               └─ readJson(PACKAGE_DIR/reconstruction_state.json) ← STATIC FILE
  │                     │
  │                     └─ returns { run_id, execution_status, dimensions,
  │                                  score, projection, confidence,
  │                                  coverage, reconstruction }
  │
  └─ [index.js LEFT COLUMN — score header, decomposition, confidence band]
        *** HARDCODED IN JSX — NOT READ FROM API ***
        Values hardcoded: 60, 100, [60–100], PHASE_1_ACTIVE, COMPUTED,
                          PASS, NOT EVALUATED, 30/30, 0/40
```

### Backward trace from gauge_state.json

```
clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json
  │
  └─ git first added: commit 061e3a5 (PSEE.RECONCILE.1.WP-10)
       Updated in: 62234c7 (PSEE.RECONCILE.1.WP-11)
       emission_timestamp: 2026-04-06T14:03:57Z (from package_manifest.json)
       │
       └─ Declared source: engine_state.json + coverage_state.json + reconstruction_state.json
            │
            └─ Same package dir — all committed static files
                 │
                 └─ Source scripts: scripts/psee/run_client_runtime.py
                                    scripts/psee/run_end_to_end.py
                      │
                      └─ BREAKPOINT: scripts are present but NOT currently invoked
                                     by any runtime path. No execution pipeline
                                     is running to regenerate these files.
```

### BREAKPOINT A — Score chain

| Item | Status |
|------|--------|
| gauge_state.json committed to git | CONFIRMED |
| gauge_state.json contains correct values (60, 100, [60-100]) | CONFIRMED |
| gauge_state.json was produced by PSEE scripts | DECLARED IN TRACEABILITY FIELDS, NOT INDEPENDENTLY VERIFIED |
| Scripts that produced it are present in repo | CONFIRMED |
| Scripts are currently invoked at runtime | NO EVIDENCE |
| Fresh regeneration occurs on page load | NO — file read only |

**Chain terminates at:** committed static file `clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json`

---

## Chain B — Topology Data (TOPOLOGY API → binding_envelope.json)

### B1 → B6 Forward trace

```
GAUGE UI (pages/index.js, pages/topology.js, pages/overview.js)
  │
  └─ fetch('/api/topology')
        │
        └─ pages/api/topology.js
              REPO_ROOT = process.cwd()/../..
              DEFAULT_ENVELOPE = clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/
                                   psee/runs/run_335c0575a080/binding/
                                   binding_envelope.json
              │
              ├─ fs.existsSync(envelopePath)          ← CHECK
              ├─ JSON.parse(fs.readFileSync(...))     ← READS STATIC FILE
              ├─ validateEnvelope(envelope)            ← IN-MEMORY VALIDATION
              └─ buildRenderModel(envelope, path)     ← IN-MEMORY DERIVATION
                    │
                    └─ returns { nodes[45], overlap_edges[2], signals_by_node,
                                 orphans, constraint_flags, summary, ... }
```

### Backward trace from binding_envelope.json

```
clients/1de0d815.../psee/runs/run_335c0575a080/binding/binding_envelope.json
  │
  ├─ git first added: commit 061e3a5 (PSEE.RECONCILE.1.WP-10)
  │   Updated in: 69989d4 (PSEE.BLUEEDGE.PARITY.RECOVERY.NUMERICAL.DELTA.01)
  │
  ├─ Envelope self-declares provenance chain (envelope.provenance field):
  │     step 1: raw_input.json  →  clients/1de0d815.../input/raw_input.json
  │     step 2: domain_structure.json  →  docs/pios/.../domain_structure.json
  │     step 3: ceu_registry.json  →  docs/pios/.../ceu_registry.json
  │     step 4: structure_manifest.json (via emit_structure_manifest.py)
  │     step 5: binding_model.json (via build_binding_convergence.py)
  │     step 6: binding_envelope.json (this artifact)
  │
  └─ BREAKPOINT B:
       raw_input.json comment: "WP-13B raw input — BlueEdge client — runtime artifact, not committed"
       raw_input.json IS present in filesystem (source_system: IG, entity count: 5)
       No git history verifiable on this file from this trace
       build_binding_convergence.py script is present: scripts/psee/build_binding_convergence.py
       Script was NOT invoked freshly — artifact is committed, not regenerated
```

### BREAKPOINT B — Topology chain

| Item | Status |
|------|--------|
| binding_envelope.json committed to git | CONFIRMED |
| binding_envelope.json parsed + validated by topology API | CONFIRMED (fail-closed path exists) |
| buildRenderModel derives topology render model in memory | CONFIRMED |
| binding_envelope.json produced by build_binding_convergence.py | DECLARED IN PROVENANCE FIELD |
| build_binding_convergence.py present in scripts/ | CONFIRMED |
| Scripts are currently invoked at runtime | NO EVIDENCE |
| raw_input.json present | CONFIRMED (physical file) |
| raw_input.json freshly generated | NOT PROVEN |

**Chain terminates at:** committed static file `clients/1de0d815.../psee/runs/run_335c0575a080/binding/binding_envelope.json`

---

## Chain C — Business Ontology / Executive Layer (in-memory derivation)

```
overview.js
  │
  ├─ resolver.js → resolveMatchedConcepts(gaugeData, topoData)
  │     Reads: concepts.json (static config, bundled at build)
  │     Evaluates predicates against gaugeData (Chain A) + topoData (Chain B)
  │
  ├─ renderer.js → renderPhrase(conceptId, scope, gaugeData, topoData)
  │     Reads: phrases.json (static config, bundled at build)
  │     Builds value map from live gaugeData + topoData
  │     Returns rendered phrases
  │
  └─ ExecutiveDecisionBlock
        Reads: matchedConcepts[] (in memory, derived from A + B)
        Classification: boolean, in-memory only
        No new data sources
```

**Chain C is entirely DERIVED_IN_MEMORY from Chains A and B.** Its freshness is bounded by A and B.

---

## Critical Provenance Finding

**GAUGE API and TOPOLOGY API read from DIFFERENT client paths:**

| API | Client | Run |
|-----|--------|-----|
| /api/gauge | `clients/blueedge/` | `run_01_authoritative` |
| /api/topology | `clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/` | `run_335c0575a080` |

These are not the same client. The score data and topology data do not share a common run_id. No cross-reference or consistency check between these two chains exists at runtime.

---

## index.js Hardcoding Finding

The main visible score block in `pages/index.js` (top bar, score decomposition, confidence band, operator mode table) is **entirely hardcoded in JSX**. It does NOT read from the API. The API is used only for the right-column dynamic panels (RuntimeIntelligence, StructuralMetrics, SignalSet, TopologySummaryPanel).

Evidence: lines 213–490, pages/index.js — score values 60, 100, [60–100], PHASE_1_ACTIVE, 30/30, COMPUTED, PASS are JSX string literals.
