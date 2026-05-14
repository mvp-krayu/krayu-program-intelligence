# STEP 14C-RESET — Full Three-Stage Deliverable-to-Source Pipeline Map

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14C-RESET
**Date:** 2026-04-25
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Full pipeline mapped from deliverables backward to raw source. No code modified. No artifacts generated. Forensics only.

---

## Deliverable Name Resolution

Before mapping, the three-stage contract names resolve to actual file names:

| Contract Term | Actual File | Report Title | Generator Function |
|--------------|-------------|--------------|-------------------|
| EXEC | `lens_tier1_evidence_brief.html` | LENS Assessment — Structural Evidence Brief | `_build_tier1_evidence_brief()` |
| LENS | `lens_tier1_narrative_brief.html` | LENS Assessment — Narrative Brief | `_build_tier1_narrative_brief()` |
| DIAGNOSTIC | `lens_tier2_diagnostic_narrative.html` | LENS Assessment — Diagnostic Narrative | `_build_tier2_diagnostic_narrative()` |

Each deliverable has a publish-safe variant (`*_pub.html`) in a `publish/` subdirectory. Total: 6 HTML files + 1 `graph_state.json`.

---

## Section 1 — BlueEdge Deliverable Pipeline

### EXEC: `clients/blueedge/reports/tier1/lens_tier1_evidence_brief.html`

```
EXEC deliverable
→ Generator: scripts/pios/lens_report_generator.py
→ Entry point: main(tier1=True) → generate_tier1_reports() → _build_tier1_evidence_brief()
→ Invocation: python3 scripts/pios/lens_report_generator.py
              (default: --client blueedge --run-id run_authoritative_recomputed_01)
→ Required inputs (all from CANONICAL_PKG_DIR):
    canonical_topology.json   → domain list, grounding states, focus domain
    signal_registry.json      → 5 signals (SIG-001..005), emission_state: ACTIVE
    gauge_state.json          → overall score, evidence floor, component counts
→ Producing scripts:
    canonical_topology.json   ← pios.py / emit_topology_from_binding.py (40.x structural)
    signal_registry.json      ← 40.5/build_signal_artifacts.py + 40.6/build_condition_artifacts.py
                                 + 40.7/build_diagnosis_artifacts.py + emit_signals_empty.py (if empty)
    gauge_state.json          ← pios.py gauge execution (STEP 10 pipeline)
→ Upstream artifacts:
    canonical_topology.json   ← binding_envelope.json + binding_model.json
                                 (clients/blueedge/psee/runs/run_authoritative_recomputed_01/binding/)
    signal_registry.json      ← vault claims (signal-type claim markdown files)
                                 + 40.x evaluation artifacts
    gauge_state.json          ← canonical_topology.json + signal_registry.json
→ CANONICAL_PKG_DIR: clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/
→ Output path: clients/blueedge/reports/tier1/lens_tier1_evidence_brief.html
→ Publish variant: clients/blueedge/reports/tier1/publish/lens_tier1_evidence_brief_pub.html
```

**Raw source:** BlueEdge OSS FastAPI codebase (original repo analysis) → `clients/blueedge/input/raw_intake/`

---

### LENS: `clients/blueedge/reports/tier1/lens_tier1_narrative_brief.html`

```
LENS deliverable
→ Generator: scripts/pios/lens_report_generator.py
→ Entry point: main(tier1=True) → generate_tier1_reports() → _build_tier1_narrative_brief()
→ Invocation: same command as EXEC — both produced in single generate_tier1_reports() call
→ Required inputs: identical to EXEC
    canonical_topology.json
    signal_registry.json
    gauge_state.json
→ Producing scripts: identical to EXEC
→ Upstream artifacts: identical to EXEC
→ Output path: clients/blueedge/reports/tier1/lens_tier1_narrative_brief.html
→ Publish variant: clients/blueedge/reports/tier1/publish/lens_tier1_narrative_brief_pub.html
```

**Note:** EXEC and LENS are produced in a single `generate_tier1_reports()` call. They share identical inputs and are inseparable at the invocation level.

---

### DIAGNOSTIC: `clients/blueedge/reports/tier2/lens_tier2_diagnostic_narrative.html`

```
DIAGNOSTIC deliverable
→ Generator: scripts/pios/lens_report_generator.py
→ Entry point: main(tier1=True) → generate_tier2_reports() → _build_tier2_diagnostic_narrative()
→ Invocation: same command as EXEC/LENS — generate_tier2_reports() called after generate_tier1_reports()
→ Required inputs:
    canonical_topology.json   → domain list, zone derivation
    signal_registry.json      → signal list, zone-signal mapping
    gauge_state.json          → score floor, evidence counts
    graph_state.json          → 3D graph node positions (d3-force-3d pre-computed)
→ Producing scripts:
    canonical_topology.json   ← (same as EXEC)
    signal_registry.json      ← (same as EXEC)
    gauge_state.json          ← (same as EXEC)
    graph_state.json          ← scripts/pios/export_graph_state.mjs (Node.js subprocess)
                                 called via: subprocess.run(["node", str(export_script)], check=True)
                                 ← reads: app/gauge-product/public/vault/blueedge/
                                          run_01_authoritative_generated/vault_index.json
                                 ← vault_index.json produced by: scripts/pios/vault_export.py
                                    --client blueedge --run run_01_authoritative_generated
                                 ← vault_export.py reads: clients/blueedge/vaults/
                                          run_01_authoritative_generated/ (vault markdown files)
→ Output path: clients/blueedge/reports/tier2/lens_tier2_diagnostic_narrative.html
→ Publish variant: clients/blueedge/reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html
→ graph_state.json output: clients/blueedge/reports/tier2/graph_state.json (18 nodes, 17 links)
```

**DIAGNOSTIC upstream chain:**
```
BlueEdge raw vault markdown (clients/blueedge/vaults/run_01_authoritative_generated/)
  → vault_export.py (scripts/pios/vault_export.py)
  → vault_index.json (app/gauge-product/public/vault/blueedge/run_01_authoritative_generated/)
  → export_graph_state.mjs (scripts/pios/export_graph_state.mjs) [Node.js, d3-force-3d]
  → graph_state.json (clients/blueedge/reports/tier2/graph_state.json)
  → _build_tier2_diagnostic_narrative() + canonical_topology + signal_registry + gauge_state
  → lens_tier2_diagnostic_narrative.html
```

---

## Section 2 — Second-Client Actual Pipeline

### EXEC: Status = **MISSING (not generated)**

| Attribute | Expected | Actual |
|-----------|----------|--------|
| Output path | `clients/e65d2f0a.../reports/tier1/lens_tier1_evidence_brief.html` | DOES NOT EXIST |
| Generator invoked | `lens_report_generator.py` (default tier1 path) | Never called for second client with tier1 path |
| CANONICAL_PKG_DIR | `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/package/` | EXISTS |
| canonical_topology.json | Required | EXISTS ✓ |
| signal_registry.json | Required | EXISTS ✓ (signals: [], NOT_EVALUATED) |
| gauge_state.json | Required | EXISTS ✓ |
| engine_state.json | In BlueEdge package (used?) | ABSENT ✖ |
| evidence_mapping_index.json | In BlueEdge package (used?) | ABSENT ✖ |

**Attempted execution path:** STEP 13D-G used `--legacy` path to `/tmp/lens_structural_slice_test.html` (31K, exit 0).
This is NOT the EXEC deliverable. It is a legacy single-HTML report using fragment files, not the tier1 canonical package path.

**Divergence:** The `generate_tier1_reports()` / `_build_tier1_evidence_brief()` path was NEVER invoked for second client. The package directory exists with the required three files (canonical_topology, signal_registry, gauge_state) but the generator was never called on them via tier1 path.

---

### LENS: Status = **MISSING (not generated)**

Identical situation to EXEC — both are produced by `generate_tier1_reports()` which was never called for second client. Same required inputs, same divergence.

---

### DIAGNOSTIC: Status = **MISSING (not generated, multiple blockers)**

| Attribute | Expected | Actual |
|-----------|----------|--------|
| Output path | `clients/e65d2f0a.../reports/tier2/lens_tier2_diagnostic_narrative.html` | DOES NOT EXIST |
| graph_state.json | Required | DOES NOT EXIST |
| vault_index.json | Required (public vault) | DOES NOT EXIST |
| Public vault path | `app/gauge-product/public/vault/<uuid>/run_01_oss_fastapi/` | DOES NOT EXIST |
| vault_export.py callable | Requires signals > 0 | BLOCKED — validate_export() fails with 0 signals |
| export_graph_state.mjs | Requires --client/--run-id | Subprocess call in generator doesn't pass them (GAP-CODE-01) |

**Attempted execution path:** None. DIAGNOSTIC was never attempted for second client. Three independent blockers exist before the generator could produce it.

---

## Section 3 — Full Stage Map

| Stage | Purpose | Script / Entry | Inputs | Outputs | BlueEdge | Second-Client | Gap Type |
|-------|---------|----------------|--------|---------|----------|---------------|----------|
| S-01: Raw Intake | Source code/repository analysis | `40.2/scan_repository.sh` + `build_evidence_inventory.py` | Client source repo | `clients/<c>/input/raw_intake/` entities, events, metrics | ✓ | ✓ | None |
| S-02: Intake Processing | Normalize entities, extract relationships | `40.2/normalize_entities.py`, `extract_entities.py` | raw_intake/ | `clients/<c>/psee/runs/<r>/intake/` (intake_result.json, entities.json, etc.) | ✓ | ✓ | None |
| S-03: Binding | Bind evidence to claim model | pios.py / binding pipeline | intake artifacts | `binding_envelope.json`, `binding_model.json`, `binding_transformation_spec.json` | ✓ | ✓ | None |
| S-04: Topology Generation | Derive canonical domain topology | `emit_topology_from_binding.py` | binding artifacts | `canonical_topology.json` | ✓ | ✓ (5 domains) | Scope delta (17 vs 5 domains) — NOT a defect |
| S-05: 40.x Structural Pipeline | Build signal/condition/diagnosis artifacts | `40.5/build_signal_artifacts.py`, `40.6/build_condition_artifacts.py`, `40.7/build_diagnosis_artifacts.py` | vault claim files + structural analysis | SIG-XXX, COND-XXX, DIAG-XXX artifacts in vault | ✓ (5 signals) | ✖ NOT RUN | Missing stage — PiOS equivalent needed |
| S-06: Vault Assembly | Assemble evidence vault (vault markdown) | vault markdown + claim files | S-04 topology + S-05 artifacts | `clients/<c>/vaults/<run>/claims/` (vault markdown with frontmatter) | ✓ (run_01_authoritative_generated) | ⚠ PARTIAL (run_01_oss_fastapi, run_01_oss_fastapi_fixed — signal claims absent) | Signal claims missing |
| S-07: GAUGE Execution | Score structural coverage | `pios.py` gauge run | canonical_topology + signal_registry | `gauge_state.json`, `coverage_state.json`, `reconstruction_state.json` | ✓ | ✓ | None |
| S-08: Signal Registry Assembly | Emit signal registry with signal list | `emit_signals_empty.py` (if empty) OR `40.5` output | S-05 artifacts or empty gate | `signal_registry.json` | ✓ (5 signals, ACTIVE) | ⚠ (0 signals, NOT_EVALUATED) | PiOS 41.x not run |
| S-09: Package Assembly | Bundle canonical artifacts | pios.py package step | canonical_topology + gauge_state + signal_registry | `clients/<c>/psee/runs/<r>/package/` (3-5 JSON files) | ✓ (9 files) | ✓ (5 files — missing engine_state, evidence_mapping_index, executive_signal_report, gauge_inputs) | 4 auxiliary files absent |
| S-10: Fragment Export | Export projection fragments for each claim | `projection_runtime.py export-fragments` | `clients/<c>/vaults/<run>/claims/` + `signal_registry.json` | `CLM-XX-ZONE-Y-L1.json` fragment files | ✓ (blueedge vault) | ✓ (run via STEP 11B — 29 fragments at `clients/<uuid>/fragments/run_01_oss_fastapi/`) | Fragment path convention differs — NOT standard vault location |
| S-11: Vault Export (Public) | Export vault to public static path + build vault_index.json | `vault_export.py --client <c> --run <r>` | vault markdown files with frontmatter | `app/gauge-product/public/vault/<c>/<r>/vault_index.json` + artifact HTMLs | ✓ (run_01_authoritative_generated) | ✖ BLOCKED (validate_export() requires signals > 0) | validate_export() defect + no vault_index.json |
| S-12: Graph State Export | Pre-compute 3D graph layout | `export_graph_state.mjs --client <c> --run-id <r>` | vault_index.json from S-11 | `clients/<c>/reports/tier2/graph_state.json` | ✓ (18 nodes, 17 links) | ✖ ABSENT (no vault_index.json input; subprocess GAP-CODE-01) | 2 blockers: missing input + subprocess bug |
| S-13: EXEC Generation | Generate Structural Evidence Brief | `lens_report_generator.py` tier1 path | canonical_topology + signal_registry + gauge_state | `clients/<c>/reports/tier1/lens_tier1_evidence_brief.html` | ✓ | ✖ NOT GENERATED | Generator never called with tier1 path for second client |
| S-14: LENS Generation | Generate Narrative Brief | `lens_report_generator.py` tier1 path | canonical_topology + signal_registry + gauge_state | `clients/<c>/reports/tier1/lens_tier1_narrative_brief.html` | ✓ | ✖ NOT GENERATED | Same as S-13 — co-produced with EXEC |
| S-15: DIAGNOSTIC Generation | Generate Diagnostic Narrative | `lens_report_generator.py` tier1 path (calls generate_tier2_reports) | canonical_topology + signal_registry + gauge_state + graph_state.json | `clients/<c>/reports/tier2/lens_tier2_diagnostic_narrative.html` | ✓ | ✖ NOT GENERATED | Blocked by S-11 + S-12 + GAP-CODE-01 |
| S-16: Live Runtime (LENS page) | Serve LENS page with projection API | `app/gauge-product` Next.js dev server | `.env.local` (PROJECTION_FRAGMENTS_DIR) + fragments from S-10 | `/lens` page — real-time projection | ✓ (dev) | ⚠ PARTIAL (HTTP 200, hero band functional, sections B/C/D suppressed via R-03) | Signal tier absent; sections suppressed |
| S-17: Tier-2 Workspace (live) | Serve interactive vault graph | `app/gauge-product/pages/tier2/workspace.js` | vault_index.json (S-11) + graph_state.json (S-12) + zones API | `/tier2/workspace` page | ✓ (dev) | ✖ NON-FUNCTIONAL (no public vault; zones API returns BlueEdge defaults) | Missing S-11 + GAP-CODE-02 |

---

## Section 4 — Artifact Dependency Graph

```
RAW SOURCE
  BlueEdge: codebase repo analysis
  Second-client: OSS FastAPI codebase
      │
      ▼
S-01/02: INTAKE
  clients/<c>/input/raw_intake/  [entities.json, events.json, metrics.json, relationships.json]
  clients/<c>/psee/runs/<r>/intake/  [intake_result.json, entities.json, source_manifest.json]
  BlueEdge: ✓   Second-client: ✓
      │
      ▼
S-03: BINDING
  clients/<c>/psee/runs/<r>/binding/
    binding_envelope.json  [claim → evidence links]
    binding_model.json     [claim model]
    binding_transformation_spec.json
  BlueEdge: ✓   Second-client: ✓
      │
      ▼
S-04: TOPOLOGY
  clients/<c>/psee/runs/<r>/package/canonical_topology.json
    domains: 17 (BlueEdge) / 5 (second-client)
    nodes:   42 / 30
    components: 89 / 10
  BlueEdge: ✓   Second-client: ✓
      │
      ├─────────────────────────────┐
      ▼                             ▼
S-05: 40.x STRUCTURAL PIPELINE   S-07: GAUGE EXECUTION
  (SIG/COND/DIAG artifacts)        clients/<c>/psee/runs/<r>/package/
  BlueEdge: ✓ (PiOS 40.5-40.7)    gauge_state.json          ✓/✓
  Second-client: ✖ (NOT RUN)       coverage_state.json       ✓/✓
                                    reconstruction_state.json ✓/✓
      │
      ▼
S-06: VAULT (markdown)
  clients/<c>/vaults/<run>/claims/  [vault markdown with frontmatter]
  BlueEdge: ✓ (run_01_authoritative_generated — signal claims present)
  Second-client: ⚠ (run_01_oss_fastapi — claim files present, signal claims absent)
      │
      ├───────────────────────────┐
      ▼                           ▼
S-08: SIGNAL REGISTRY          S-10: FRAGMENT EXPORT
  package/signal_registry.json    clients/<c>/fragments/<run>/CLM-XX-ZONE-Y-L1.json
  BlueEdge: ✓ (5 signals)        BlueEdge: ✓ (vaults/run_01_authoritative/)
  Second-client: ⚠ (0 signals,   Second-client: ✓ (29 fragments — non-standard path)
    NOT_EVALUATED)
      │
      ▼
S-09: PACKAGE
  clients/<c>/psee/runs/<r>/package/
    canonical_topology.json  ✓/✓
    signal_registry.json     ✓/⚠ (0 signals)
    gauge_state.json         ✓/✓
    engine_state.json        ✓/✖ (missing)
    evidence_mapping_index.json ✓/✖ (missing)
    executive_signal_report.md  ✓/✖ (missing)
    gauge_inputs.json           ✓/✖ (missing)
  BlueEdge: ✓ (complete)
  Second-client: ⚠ (partial — 5/9 files)
      │
      ▼
S-11: VAULT EXPORT (PUBLIC)
  app/gauge-product/public/vault/<c>/<run>/
    vault_index.json          [signals, artifacts, nodes, zones]
    artifacts/*.html
    entities/*.html
    transformations/*.html
    navigation/*.html
  BlueEdge: ✓ (run_01_authoritative_generated)
  Second-client: ✖ BLOCKED (validate_export() requires signals > 0)
      │
      ▼
S-12: GRAPH STATE
  clients/<c>/reports/tier2/graph_state.json
    nodes: 18 (BlueEdge) / 0 (second-client — absent)
    links: 17 (BlueEdge) / 0 (second-client — absent)
  BlueEdge: ✓
  Second-client: ✖ ABSENT (blocked by S-11 + GAP-CODE-01)
      │
      │         ┌────────────────────────┐
      │         │ canonical_topology.json│
      │         │ signal_registry.json   │ ← from S-09
      │         │ gauge_state.json       │
      ▼         └────────────────────────┘
S-13: EXEC GENERATION
  clients/<c>/reports/tier1/lens_tier1_evidence_brief.html
  BlueEdge: ✓
  Second-client: ✖ NOT GENERATED (generator never called with tier1 path)

S-14: LENS GENERATION
  clients/<c>/reports/tier1/lens_tier1_narrative_brief.html
  BlueEdge: ✓
  Second-client: ✖ NOT GENERATED (co-produced with EXEC, same blocker)

S-15: DIAGNOSTIC GENERATION
  clients/<c>/reports/tier2/lens_tier2_diagnostic_narrative.html
  BlueEdge: ✓
  Second-client: ✖ NOT GENERATED (blocked: S-11 + S-12 + GAP-CODE-01)
```

---

## Section 5 — Where We Missed the Boat

### MISS-01 — PiOS 40.x equivalent (41.x) never run for second client

**Stage:** S-05
**Scripts involved:** `scripts/pios/40.5/build_signal_artifacts.py`, `40.6/build_condition_artifacts.py`, `40.7/build_diagnosis_artifacts.py`
**Expected:** Second-client structural intelligence signals derived from OSS FastAPI codebase analysis
**Actual:** `signal_registry.json` has `signals: []`, `emission_state: NOT_EVALUATED`
**Why:** PiOS 41.4 (`build_signals.py`) is the second-client equivalent of 40.5-40.7. It was never contracted or run.
**Impact:** Every downstream stage that requires signals is blocked or degraded.

---

### MISS-02 — validate_export() defect in vault_export.py blocks public vault

**Stage:** S-11
**Script:** `scripts/pios/vault_export.py:validate_export()` (approx line 505)
**Expected:** `vault_export.py --client <uuid> --run run_01_oss_fastapi` produces `vault_index.json`
**Actual:** `validate_export()` requires `len(vi['signals']) > 0` → fails with 0 signals → BLOCKED
**Why:** The validator was written for the BlueEdge case where signals always exist. It has no 0-signal path.
**Impact:** `public/vault/<uuid>/` does not exist. S-12 (graph_state) is blocked. S-15 (DIAGNOSTIC) is blocked.

---

### MISS-03 — GAP-CODE-01: subprocess in lens_report_generator.py:3728 missing --client/--run-id

**Stage:** S-12 (via S-15 trigger)
**Script:** `scripts/pios/lens_report_generator.py:3728`
```python
subprocess.run(["node", str(export_script)], check=True)
```
**Expected:** `node scripts/pios/export_graph_state.mjs --client <uuid> --run-id run_01_oss_fastapi`
**Actual:** No args passed → `export_graph_state.mjs` defaults to `client="blueedge"`, `runId="run_01_authoritative_generated"` (lines 35-36 of `export_graph_state.mjs`)
**Impact:** Even if vault_index.json existed for second client, DIAGNOSTIC generation would produce BlueEdge graph_state, not second-client.

---

### MISS-04 — Fragment path convention divergence

**Stage:** S-10
**Script:** `scripts/pios/projection_runtime.py export-fragments`
**Expected path:** `clients/<uuid>/vaults/<run>/claims/fragments/` (standard vault layout)
**Actual path:** `clients/<uuid>/fragments/<run>/` (top-level, non-standard)
**How it happened:** STEP 11B ran fragment export with explicit `--output` override → wrote to non-standard path
**Impact:** `FRAGMENTS_DIR` default in `lens_report_generator.py` resolves to standard vault path; `--fragments-dir` must be explicitly provided. Currently only the `--legacy` path uses FRAGMENTS_DIR. Not a blocker for tier1 path (tier1 uses package/, not fragments/).

---

### MISS-05 — STEP 10H FAIL-STOP: build_evidence_vault.py generated contaminated signal claims

**Stage:** S-06 (vault assembly)
**Script:** Attempted `build_evidence_vault.py`
**Expected:** Second-client vault claims built cleanly with NOT_EVALUATED suppression
**Actual:** `build_evidence_vault.py` generated CLM-20..24 with BlueEdge signal names, `status=ACTIVE`, `lens_admissible=YES` — contamination
**Why:** Builder defect — no NOT_EVALUATED suppression path
**Recovery:** FAIL-STOP was correctly enforced. Contaminated artifacts were NOT committed to canonical record.

---

### MISS-06 — EXEC/LENS tier1 path never invoked for second client

**Stage:** S-13/S-14
**Script:** `scripts/pios/lens_report_generator.py` (tier1 path)
**Expected:** `python3 scripts/pios/lens_report_generator.py --client <uuid> --run-id run_01_oss_fastapi`
**Actual:** Only `--legacy` path was ever run (STEP 13D-G). The legacy path uses FRAGMENTS_DIR, not CANONICAL_PKG_DIR. It produces a single HTML to `/tmp/`, not the three-deliverable set.
**Critically:** The CANONICAL_PKG_DIR exists and has all three required files (canonical_topology.json, signal_registry.json, gauge_state.json). EXEC + LENS are THEORETICALLY RUNNABLE TODAY with the --client/--run-id args, without waiting for PiOS 41.x.

---

## Section 6 — Signal Derivation Truth

**Q: Where did BlueEdge SIG-001..005 come from?**

`scripts/pios/40.5/build_signal_artifacts.py` — structural code analysis of BlueEdge OSS FastAPI codebase.
Produces SIG-XXX signal artifact definitions from code structure, not runtime monitoring.

**Q: Which pipeline stage produced them (40.x vs 41.x)?**

40.x (PiOS 40.5, 40.6, 40.7). Specifically:
- 40.5: Signal artifacts (SIG layer) — `build_signal_artifacts.py` + `validate_signal_artifacts.py`
- 40.6: Condition artifacts (COND layer) — `build_condition_artifacts.py`
- 40.7: Diagnosis artifacts (DIAG layer) — `build_diagnosis_artifacts.py`
These form the three-layer intelligence chain: SIG → COND → DIAG → INTEL-001

**Q: Whether runtime telemetry was involved?**

NO. All 5 BlueEdge signals have `runtime_required: false` in `signal_registry.json`. They are static structural intelligence — derived from code inspection, not live telemetry ingestion.

**Q: Whether second-client could have produced them?**

YES — in principle. The equivalent work is PiOS 41.4 (`scripts/pios/41.4/build_signals.py`). The second-client OSS FastAPI codebase exists in `clients/e65d2f0a.../input/` and could be analyzed. PiOS 41.x was never contracted or run.

**Q: Whether emit_signals_empty was valid or premature?**

**VALID.** `emit_signals_empty.py` correctly reflects the pre-41.x state of the second-client evidence base. `emission_state: NOT_EVALUATED` is accurate — PiOS 41.x has not run. The file does not fabricate or suppress signals; it accurately states they have not been evaluated. The STEP 10G-R correction (from `EMPTY_BY_EVIDENCE` to `NOT_EVALUATED`) was correct — signals are evaluable in principle but not yet evaluated.

---

## Section 7 — 4-BRAIN Analysis

### CANONICAL

**BlueEdge:**
- `canonical_topology.json` — authoritative domain topology from binding
- `signal_registry.json` — authoritative signal list from 40.5/40.6/40.7 structural intelligence
- `gauge_state.json` — authoritative score from GAUGE execution
- `vault_index.json` — derived from vault markdown; authoritative vault export
- `graph_state.json` — derived from vault_index; deterministic d3-force-3d layout

**Second-client:**
- `canonical_topology.json` — AUTHORITATIVE (5 domains, correctly scoped) ✓
- `signal_registry.json` — AUTHORITATIVE (0 signals, NOT_EVALUATED — correctly reflects pre-41.x state) ✓
- `gauge_state.json` — AUTHORITATIVE ✓
- `vault_index.json` — ABSENT (cannot be derived without signal claims in vault) ✖
- `graph_state.json` — ABSENT ✖
- Vault claims — PRESENT for structural claims; signal claims ABSENT (never generated — STEP 10H FAIL-STOP) ✓/✖

**Truth boundary:** Second-client canonical truth is correct up to and including S-09 (package). S-11 and beyond are blocked by the 0-signal state.

---

### CODE

**Default bindings / hardcoding:**

| Location | Hardcoded Value | Second-Client Override Available? |
|----------|----------------|-----------------------------------|
| `lens_report_generator.py:53` | `FRAGMENTS_DIR = .../blueedge/vaults/run_01_authoritative/...` | Yes — `--fragments-dir` arg |
| `lens_report_generator.py:54` | `REPORTS_DIR = .../blueedge/reports` | Yes — overridden by `_configure_runtime()` |
| `lens_report_generator.py:57` | `CANONICAL_PKG_DIR = .../blueedge/psee/...` | Yes — overridden by `_configure_runtime()` via `--client`/`--run-id` |
| `lens_report_generator.py:3728` | `subprocess.run(["node", str(export_script)], check=True)` | NO — no `--client`/`--run-id` passed (GAP-CODE-01) |
| `export_graph_state.mjs:35-36` | `_client = "blueedge"`, `_runId = "run_01_authoritative_generated"` | Yes — supports `--client`/`--run-id` CLI flags |
| `vault_export.py:validate_export()` | Requires `len(signals) > 0` | NO — no 0-signal path (GAP-VAULT-01) |
| `tier2_query_engine.py` | BlueEdge `canonical_topology.json` default path | NO — `zones.js` API doesn't pass `--client` |

**Executable paths for EXEC/LENS (second client):**
```bash
python3 scripts/pios/lens_report_generator.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi
```
This command would resolve `CANONICAL_PKG_DIR` correctly and is theoretically runnable TODAY for EXEC + LENS (signal_registry with 0 signals will render as "no signals" — not a hard failure). STEP 14B specifies required verification before execution.

---

### PRODUCT

| Deliverable | BlueEdge Status | Second-Client Status | Reproducible Now? |
|-------------|-----------------|----------------------|------------------|
| EXEC | ✓ COMPLETE | ✖ NOT GENERATED | YES — with `--client` arg; signal section will show 0 signals |
| LENS | ✓ COMPLETE | ✖ NOT GENERATED | YES — co-produced with EXEC |
| DIAGNOSTIC | ✓ COMPLETE | ✖ NOT GENERATED | NO — blocked by vault_index.json (S-11) |
| graph_state.json | ✓ 18 nodes | ✖ ABSENT | NO — blocked by vault_index.json + GAP-CODE-01 |
| vault_index.json | ✓ complete | ✖ ABSENT | NO — blocked by validate_export() + 0 signals |
| LENS page (live) | ✓ functional | ⚠ PARTIAL (hero band only) | PARTIAL — sections B/C/D suppressed |
| Tier-2 workspace | ✓ functional | ✖ NON-FUNCTIONAL | NO — blocked by vault_index.json |

**Key insight:** EXEC and LENS are reproducible with the existing second-client package without PiOS 41.x. The signal section of EXEC will show 0 signals / NOT_EVALUATED, which is evidence-correct. DIAGNOSTIC requires vault_index.json which is blocked until validate_export() defect is resolved OR manually bypassed.

---

### PUBLISH

**Safe to show:**
- `lens_tier1_evidence_brief.html` (EXEC) — structural claims, 0 signals explicitly stated — evidence-correct
- `lens_tier1_narrative_brief.html` (LENS) — narrative interpretation of structural claims
- Legacy `/tmp/lens_structural_slice_test.html` — current demo artifact (STEP 13D-G)
- LENS page hero band (CLM-09/10/12) — confirmed second-client data

**Not yet safe (incomplete, would mislead):**
- `lens_tier2_diagnostic_narrative.html` (DIAGNOSTIC) — blocked; any generation with BlueEdge graph_state would be fabricated data
- Tier-2 workspace — non-functional for second client
- Any claim that the Tier-2 graph represents second-client topology

**Misleading if shown without context:**
- Legacy HTML report `/tmp/lens_structural_slice_test.html` presents as a full assessment; signal tier absence should be disclosed

---

## Section 8 — Recovery Plan (Like-for-Like Parity)

**GOAL:** Second-client EXEC/LENS/DIAGNOSTIC identical in behavior to BlueEdge.

---

### STAGE A — Immediate (No new contracts required)

**STEP A-1: Generate EXEC + LENS**
- Stage restored: S-13, S-14
- Script: `scripts/pios/lens_report_generator.py --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run-id run_01_oss_fastapi`
- Artifacts produced: `clients/e65d2f0a.../reports/tier1/lens_tier1_evidence_brief.html` + `lens_tier1_narrative_brief.html` (4 files including publish variants)
- Validation expected: exit 0; no BlueEdge content; signal section shows NOT_EVALUATED; CLM-09/10/12 scores correct; CLM-25 placeholder present
- Dependency: CANONICAL_PKG_DIR exists (✓); all 3 required package files exist (✓)
- Pre-condition: STEP 14B 4-edit code fix NOT required for tier1 path; but note `generate_tier2_reports()` will also be called — and will fail on subprocess. Must either: (a) call with `--legacy` equivalent to skip tier2, OR (b) accept tier2 failure and isolate

**Note on isolation:** The default `main(tier1=True)` calls `generate_tier1_reports()` then `generate_tier2_reports()`. Tier2 will fail at the subprocess step. This must be handled — either via try/except in the generator, or by running tier1 only.

---

### STAGE B — Fix validate_export() + Build vault_index.json

**STEP B-1: Fix vault_export.py validate_export()**
- Stage restored: S-11 unblocked
- Script: `scripts/pios/vault_export.py` — remove or relax `len(signals) > 0` requirement
- Artifact produced: validation patch
- Dependency: requires code change (not a data problem)

**STEP B-2: Run vault_export.py for second client**
- Script: `python3 scripts/pios/vault_export.py --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 --run run_01_oss_fastapi`
- Artifact produced: `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json`
- Validation expected: vault_index.json with `signals: []`, structural artifacts from vault markdown
- Dependency: STEP B-1 (validate_export fix); second-client vault exists at `clients/e65d2f0a.../vaults/run_01_oss_fastapi/` (✓)

**Alternative to STEP B-1+B-2:** Manually construct `vault_index.json` per STEP 14B schema (no validate_export() needed). This is PATH B from STEP 14B-RESET.

---

### STAGE C — Apply GAP-CODE-01 Fix + Generate graph_state

**STEP C-1: Apply STEP 14B 4-edit code fix to lens_report_generator.py**
- Stage restored: S-12 unblocked via S-15
- Fix: Store `_client` and `_run_id` as module globals in `_configure_runtime()`; pass via subprocess in line 3728
- Artifact produced: patched `lens_report_generator.py`
- Dependency: STEP B-2 (vault_index.json must exist)

**STEP C-2: Run generate_tier2_reports() for second client**
- Script: `lens_report_generator.py --client <uuid> --run-id run_01_oss_fastapi` (default tier1 path)
- Artifact produced: `clients/e65d2f0a.../reports/tier2/graph_state.json` + `lens_tier2_diagnostic_narrative.html`
- Validation expected: graph_state.json with structural nodes (0 signal nodes, structural claim nodes only); DIAGNOSTIC renders topology section without signal tier
- Dependency: STEP B-2 + STEP C-1

---

### STAGE D — Full Signal Parity (Requires new contract)

**STEP D-1: Issue PiOS 41.4 contract**
- Stage restored: S-05 (intelligence signal derivation)
- Script: `scripts/pios/41.4/build_signals.py`
- Artifact produced: SIG-XXX signal definitions for second-client OSS FastAPI codebase
- Dependency: source code analysis — requires separate authorized contract

**STEP D-2: Update signal_registry.json**
- Stage restored: S-08
- Script: signal emit pipeline
- Artifact produced: `signal_registry.json` with N signals, `emission_state: ACTIVE`
- Dependency: STEP D-1

**STEP D-3: Rebuild vault + vault_export + graph_state**
- Stages restored: S-06 → S-11 → S-12
- Full pipeline re-run: vault rebuild → vault_export → graph_state
- Dependency: STEP D-2

**STEP D-4: Regenerate all three deliverables**
- Stages restored: S-13, S-14, S-15
- All three deliverables now at full parity with BlueEdge behavior
- Signal section populated; graph includes signal nodes; DIAGNOSTIC shows signal tier

---

## Gaps Consolidated

| Gap ID | Stage | Description | Blocker For | Recovery |
|--------|-------|-------------|-------------|----------|
| GAP-SIGNAL-01 | S-05 | PiOS 41.x not run — 0 signals | Full parity | Issue PiOS 41.x contract |
| GAP-VAULT-01 | S-11 | validate_export() requires signals > 0 | vault_index.json creation | Fix validate_export() OR bypass |
| GAP-CODE-01 | S-12/S-15 | subprocess missing --client/--run-id | graph_state for second client | 4-edit fix (STEP 14B) |
| GAP-CODE-02 | S-17 | zones API no --client passthrough | Tier-2 workspace zones | Pass --client/--run-id through API |
| GAP-EXEC-01 | S-13/S-14 | generate_tier1_reports() never called | EXEC + LENS deliverables | Run with --client arg (STAGE A) |
| GAP-01 | S-16 | GAP_01_RESOLVED=False | CLM-25 verdict on LENS page | concepts.json update + flag to True |
| DQGAP-01 | S-10 | CLM-19 fragment quality defect | CLM-19 render | Fragment re-evaluation |
| R-05 | S-13/S-14 | 11 structural claims without LENS components | Full structural tier | Component authoring |
