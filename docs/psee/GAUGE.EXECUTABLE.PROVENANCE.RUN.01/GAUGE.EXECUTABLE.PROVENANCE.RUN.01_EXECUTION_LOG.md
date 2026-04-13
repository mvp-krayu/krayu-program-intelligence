# GAUGE.EXECUTABLE.PROVENANCE.RUN.01 — Execution Log

## Identity

- Contract: GAUGE.EXECUTABLE.PROVENANCE.RUN.01
- Date: 2026-04-13
- Executor: Claude Code (claude-sonnet-4-6)
- Branch: work/psee-runtime
- Mode: FORENSIC TRACE ONLY — NO REMEDIATION

---

## Pre-Flight

| Check | Result |
|-------|--------|
| git status --short | Clean: M overview.js, M gauge.css, ?? docs/psee dirs |
| git log --oneline -10 | Inspected; most recent commit: 50dec6c (gauge executive/visual layer) |
| Authorized: no code writes | CONFIRMED |

---

## Step 1 — Discover Active Paths

**Files inspected:**

| File | Method |
|------|--------|
| app/gauge-product/pages/index.js | Read (361 lines) |
| app/gauge-product/pages/overview.js | Read (420 lines) |
| app/gauge-product/pages/topology.js | Not fully read — structure from imports confirmed via GaugeContextPanels |
| app/gauge-product/pages/api/gauge.js | Read (57 lines) |
| app/gauge-product/pages/api/topology.js | Read (75 lines) |
| app/gauge-product/lib/envelope_adapter.js | Read (311 lines) |
| app/gauge-product/lib/business-ontology/resolver.js | Read (134 lines) |
| app/gauge-product/lib/business-ontology/renderer.js | Read (140 lines) |
| app/gauge-product/components/GaugeContextPanels.js | Read (185 lines) |

**Commands executed:**

```
Glob: app/gauge-product/pages/**/*.js
Glob: app/gauge-product/lib/**/*.js
Glob: app/gauge-product/components/**/*.js
```

**Key findings from Step 1:**

- /api/gauge reads from: `clients/blueedge/psee/runs/run_01_authoritative/package/`
  - `gauge_state.json`, `coverage_state.json`, `reconstruction_state.json`
  - Path hardcoded with env override option: `process.env.GAUGE_PACKAGE_DIR`
  - No .env files present in app/gauge-product/

- /api/topology reads from: `clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json`
  - Path hardcoded with env override: `process.env.GAUGE_ENVELOPE_PATH`
  - Passes through validateEnvelope → buildRenderModel in-memory

- index.js LEFT COLUMN: all score values hardcoded as JSX string literals
- index.js RIGHT COLUMN: reads from API via GaugeContextPanels

---

## Step 2 — Trace Score Cluster

**Commands:**

```bash
grep -n "60\|100\|30\|PHASE_1\|COMPUTED\|CONDITIONAL\|NOT EVALUATED\|PASS" pages/index.js | head -40
cat clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json
cat clients/blueedge/psee/runs/run_01_authoritative/package/coverage_state.json
cat clients/blueedge/psee/runs/run_01_authoritative/package/reconstruction_state.json
cat clients/blueedge/psee/runs/run_01_authoritative/package/engine_state.json
cat clients/blueedge/psee/runs/run_01_authoritative/package/package_manifest.json
cat clients/blueedge/psee/runs/run_01_authoritative/package/verification.log
ls -la clients/blueedge/psee/runs/run_01_authoritative/package/
```

**Key findings:**

- gauge_state.json confirmed: score.canonical=60, projection.value=100, confidence.lower=60, confidence.upper=100
- coverage_state.json: coverage_percent=100.0, admissible_units=30, required_units=30
- reconstruction_state.json: state=PASS, validated_units=30, violations=[], axis_results has 4 entries
- package_manifest.json: emission_timestamp=2026-04-06T14:03:57Z, lifecycle_state=EMITTED
- verification.log: Outcome=PASS_FULL, 5 domains verified

- **index.js hardcoding confirmed:** lines 213, 219, 224, 240, 245, 250, 261, 272 all contain literal value strings.

---

## Step 3 — Trace Topology

**Commands:**

```bash
ls -la clients/1de0d815.../psee/runs/run_335c0575a080/binding/
python3 -c "... binding_envelope.json stats ..."  → nodes: 45, edges: 62, signals: 5
python3 -c "... constraint_flags ..."  → overlap_count: 2, unknown_space_count: 3
python3 -c "... provenance ..."  → 6-step derivation chain declared
python3 -c "... summary keys ..."  → domain_nodes_count, capability_surface_nodes_count, etc.
ls clients/1de0d815.../psee/runs/run_335c0575a080/structure/
```

**Key findings:**

- binding_envelope.json: 83KB, 2235 lines — legitimate full artifact
- 45 nodes: 5 binding_context, 30 capability_surface, 10 component_entity
- 2 OVERLAP_STRUCTURAL edges confirmed; 60 CONTAINS edges
- constraint_flags.overlap_count=2 (matches edge count), unknown_space_count=3
- Provenance chain self-declared: 6 steps from raw_input.json → binding_envelope.json
- All upstream artifacts (raw_input.json, structure_manifest.json, binding_model.json) physically present

---

## Step 4 — Client Path Investigation

**Commands:**

```bash
ls -la clients/blueedge  → directory, not symlink
ls clients/1de0d815.../  → separate directory tree
# Confirmed: two different client paths, no symlink relationship
```

**Finding:** blueedge and 1de0d815... are separate directories. gauge and topology APIs read from DIFFERENT client paths with DIFFERENT run IDs. No runtime consistency check exists.

---

## Step 5 — Git History

**Commands:**

```bash
git log --oneline --diff-filter=A -- clients/blueedge/.../gauge_state.json
  Result: 061e3a5 PSEE.RECONCILE.1.WP-10

git log --oneline --diff-filter=A -- clients/1de0d815.../binding_envelope.json
  Result: 061e3a5 PSEE.RECONCILE.1.WP-10 (first add)
          69989d4 [PSEE.BLUEEDGE.PARITY.RECOVERY.NUMERICAL.DELTA.01] (update)

git log --oneline -- clients/blueedge/.../gauge_state.json
  Result: 62234c7 PSEE.RECONCILE.1.WP-11
          061e3a5 PSEE.RECONCILE.1.WP-10
          d0846a2 PSEE-RUNTIME.4-6
```

---

## Step 6 — Docs vs Package Comparison

**Command:**

```bash
diff docs/pios/PSEE.RUNTIME/run_01/gauge_state.json clients/blueedge/.../gauge_state.json
diff docs/pios/PSEE.RUNTIME/run_01/coverage_state.json clients/blueedge/.../coverage_state.json
```

**Finding:** DIFFER. docs version has run_id=run_01 with extra fields (source_file, threshold_line, breakdown, variance_factors). Package version has run_id=run_01_authoritative with stripped fields. These are not the same artifact. API reads package version only.

---

## Step 7 — Scripts Discovery

**Command:**

```bash
find scripts/ -name "*.py" | head -30
```

**Finding:** 20+ Python scripts present including:
- `run_end_to_end.py` — full pipeline orchestrator
- `build_binding_convergence.py` — produces binding_envelope.json
- `run_client_runtime.py` — produces gauge package artifacts
- `emit_structure_manifest.py` — produces structure_manifest.json

None of these scripts are invoked by any active UI runtime path. They are dormant infrastructure.

---

## Step 8 — raw_input.json Investigation

**Command:**

```bash
python3 -c "... raw_input.json ..."  → __comment: "WP-13B raw input — not committed", source_system: IG, entities: 5
```

**Finding:** File is physically present despite comment claiming "not committed." Cannot determine git status from this trace. Declared source_system is IG — consistent with H3 (mixed lineage). Not directly read by any active API route.

---

## Step 9 — Business Ontology Config

**Commands:**

```bash
ls app/gauge-product/lib/business-ontology/  → 5 files: concepts.json, phrases.json, renderer.js, resolver.js, schema.json
python3 -c "... concepts.json ..."  → 19 active, 0 deferred
```

**Finding:** concepts.json and phrases.json are static config imported at build time. terms.json and schema.json present but not imported by active code. All 19 concepts have active status.

---

## Pre-Closure Self-Check

| Check | Status |
|-------|--------|
| 1. No code files modified | PASS |
| 2. No remediation performed | PASS |
| 3. All six deliverables created | PASS |
| 4. Active GAUGE entrypoints traced | PASS — index.js, overview.js, api/gauge.js, api/topology.js, GaugeContextPanels.js |
| 5. Score cluster traced | PASS |
| 6. coverage_state.json disposition | PASS — GENERATED_PRIOR_RUN, committed, package/run_01_authoritative |
| 7. reconstruction_state.json disposition | PASS — GENERATED_PRIOR_RUN, same package |
| 8. gauge_state.json disposition | PASS — GENERATED_PRIOR_RUN, committed |
| 9. binding_envelope.json disposition | PASS — GENERATED_PRIOR_RUN, committed, actively used |
| 10. topology input disposition | PASS — binding_envelope.json, UUID client path |
| 11. overview/decision input disposition | PASS — derived in memory from Chain A + B |
| 12. At least one backward chain documented end-to-end | PASS — both chains traced to committed static files |
| 13. Static carry-over scan completed | PASS — 9 findings documented |
| 14. Hardcoded/default scan completed | PASS — index.js hardcoding fully documented |
| 15. Breakpoints explicitly classified | PASS — Breakpoint A and B documented |
| 16. Freshness verdict limited to evidence | PASS |
| 17. No architecture-intent language as substitute for evidence | PASS |
| 18. Working tree hygiene preserved | PASS — only docs/psee/GAUGE.EXECUTABLE.PROVENANCE.RUN.01/ written |
