# GAUGE Obsidian Operational Wiki Specification
# PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01

- Version: 1.0
- Stream: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
- Authority: product-gauge-authoritative-v1 (commit 6f8c62b)
- Branch: feature/gauge-obsidian-operational-wiki
- Date: 2026-04-15

---

## SECTION 1 — PURPOSE AND PRINCIPLES

### 1.1 Purpose

This specification defines the exact Obsidian operational wiki structure for Product: GAUGE.
The wiki is a **documentation layer only**. It maps the real, existing operational chain — intake → IG → 40.2 → 40.3 → 40.4 → S1 → S2 → S3 → S4 → GAUGE product surface — into navigable, cross-linked notes without duplicating, replacing, or mutating any existing document, contract, or runtime artifact.

### 1.2 Evidence-First Documentation Principle

Every wiki node must be backed by:
- an existing repo path (file or directory), OR
- an existing governed artifact, OR
- an existing authority contract

No wiki node may assert behavior, structure, or outputs that are not evidenced in the repo.

### 1.3 Documentation Layer vs Execution Layer

| layer | definition |
|-------|-----------|
| Documentation layer | This wiki. Reads, references, and links. Does not produce, mutate, or replace. |
| Execution layer | `scripts/pios/pios.py`, `scripts/pios/runtime/*.sh`, `scripts/pios/41.1/`, `scripts/pios/41.4/` |
| Governance layer | `docs/governance/runtime/`, `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/`, `docs/psee/FRESH.RUN.BOOTSTRAP.PROTOCOL.01/` |
| Artifact layer | `clients/blueedge/psee/runs/*/package/`, `docs/pios/IG.RUNTIME/run_01/` |

The wiki references all of these layers. It belongs to none of them.

### 1.4 No-Duplication Rule

Wiki nodes must link to authoritative sources by path. They must not copy body text from:
- existing specs (`*_spec.md`)
- existing execution logs (`EXECUTION_LOG.md`)
- existing contracts (`*_contract.md`)
- existing authority protocols (`*_protocol.md`)

Copying is limited to: document title, stream ID, status, and repo-root anchored path.

### 1.5 Fail-Closed Rule

If a source path cannot be verified as existing in the repo, the wiki node must be:
- marked `STATUS: BLOCKED — path not verified`
- excluded from the minimal authoritative set

No speculative links may appear in the authoritative set.

### 1.6 Authoritative Basis Rule

The locked baseline for this wiki is:
- Tag: `product-gauge-authoritative-v1`
- Commit: `6f8c62b`
- Validated run: `run_authoritative_recomputed_01`
- Known constraint: original raw source lineage (`run_07_source_profiled_ingestion/`) not recoverable; authoritative IG basis = `docs/pios/IG.RUNTIME/run_01/`

### 1.7 Canonical vs Run-Scoped Evidence

| type | description | path pattern |
|------|-------------|-------------|
| Canonical knowledge | Contracts, protocols, authority docs — valid for all runs | `docs/psee/<STREAM>/` |
| Run-scoped evidence | Package artifacts produced for a specific run — bound to one run_id | `clients/<tenant>/psee/runs/<run_id>/package/` |
| Authoritative IG | Surviving 30-unit IG handoff package — authoritative basis | `docs/pios/IG.RUNTIME/run_01/` |

---

## SECTION 2 — WIKI ROOT STRUCTURE

### 2.1 Vault Root Page

**Page:** `GAUGE — Operational Wiki`
**Purpose:** Entry point. Links to all top-level pages. States locked baseline identity.
**Path reference:** product-gauge-authoritative-v1 (commit 6f8c62b)

### 2.2 Folder Structure

```
GAUGE Operational Wiki/
├── 00 — Meta/
│   ├── Lock Baseline
│   ├── Chain Overview
│   └── Directory Map
├── 01 — Chain Stages/
│   ├── S0 — Intake and Bootstrap
│   ├── IG — Intelligence Graph Bridge
│   ├── L40.2 — Structural Extraction
│   ├── L40.3 — Structural Relation
│   ├── L40.4 — Structural Normalization
│   ├── S1 — Coverage and Reconstruction
│   ├── S2 — Topology Emission
│   ├── S3 — Signal Emission
│   └── S4 — Gauge Computation and Freshness
├── 02 — Artifacts/
│   ├── Intake Artifacts
│   ├── IG Artifacts
│   ├── Structural Artifacts
│   ├── Package Artifacts
│   └── Gauge State
├── 03 — Governance/
│   ├── Contracts
│   └── Protocols
├── 04 — Product Surface/
│   ├── App Routes
│   └── Dual-Run Comparison
└── 05 — Alignment Streams/
    └── (index — links only)
```

### 2.3 Top-Level Page Inventory

| page | folder | purpose |
|------|--------|---------|
| Lock Baseline | 00 — Meta | States locked tag, commit, run_id, known constraints |
| Chain Overview | 00 — Meta | Single-page stage flow: intake → IG → 40.2 → 40.3 → 40.4 → S1 → S2 → S3 → S4 |
| Directory Map | 00 — Meta | Repo root-anchored path map for all authoritative directories |
| S0 — Intake and Bootstrap | 01 — Chain Stages | Stage node: pre-S0 intake + S0 ledger/bootstrap |
| IG — Intelligence Graph Bridge | 01 — Chain Stages | Stage node: ig materialize + structural integration |
| L40.2 — Structural Extraction | 01 — Chain Stages | Stage node: pios structural extract |
| L40.3 — Structural Relation | 01 — Chain Stages | Stage node: pios structural relate |
| L40.4 — Structural Normalization | 01 — Chain Stages | Stage node: pios structural normalize |
| S1 — Coverage and Reconstruction | 01 — Chain Stages | Stage node: pios emit coverage + emit reconstruction |
| S2 — Topology Emission | 01 — Chain Stages | Stage node: pios emit topology |
| S3 — Signal Emission | 01 — Chain Stages | Stage node: pios emit signals |
| S4 — Gauge Computation and Freshness | 01 — Chain Stages | Stage node: pios compute gauge + declare coherence + validate freshness |
| Intake Artifacts | 02 — Artifacts | Artifact classification: pre-S0 intake bundle files |
| IG Artifacts | 02 — Artifacts | Artifact classification: ig/ directory files |
| Structural Artifacts | 02 — Artifacts | Artifact classification: 40_2/, 40_3/, 40_4/ files |
| Package Artifacts | 02 — Artifacts | Artifact classification: package/ files S1–S4 |
| Gauge State | 02 — Artifacts | Artifact node: gauge_state.json schema and fields |
| Contracts | 03 — Governance | Index of governing contracts, linked by path |
| Protocols | 03 — Governance | Index of governing protocols, linked by path |
| App Routes | 04 — Product Surface | gauge-product app binding: /api/gauge, /api/topology, /api/signals |
| Dual-Run Comparison | 04 — Product Surface | localhost:3001 vs localhost:3002 comparison result |
| Alignment Streams Index | 05 — Alignment Streams | Index of PRODUCTIZE.* alignment streams, linked by path |

---

## SECTION 3 — STAGE MODEL (S0 → S4)

All stage definitions are drawn from existing specs and evidenced commands only.

### Stage: PRE-S0 — Source Intake

| field | value |
|-------|-------|
| Purpose | Declare a governed source bundle before any chain execution. Hashes source files, writes intake_record.json and source_manifest.json at `clients/<tenant>/psee/intake/<intake_id>/`. |
| Producer command | `pios intake create --tenant <tenant> --intake-id <intake_id> --source-path <path>` |
| Consumer command | `pios ig materialize` (reads intake bundle) |
| Inputs | Local directory or git repository at `<source-path>` |
| Outputs | `clients/<tenant>/psee/intake/<intake_id>/intake_record.json`, `source_manifest.json`, `file_hash_manifest.json` |
| Authoritative spec | `docs/psee/PRODUCTIZE.RAW.SOURCE.INTAKE.01/intake_specification.md` |
| Constraint | Source type declared as `LOCAL_DIRECTORY` or `GIT_DIRECTORY`. Fails closed if source path invalid or output dir exists. |
| Authoritative IG note | For the 30-unit authoritative basis, the original source (`run_07_source_profiled_ingestion/`) no longer exists. `pios intake create` step is BLOCKED for that lineage. |

### Stage: S0 — Ledger and Bootstrap

| field | value |
|-------|-------|
| Purpose | Declare run identity, AC-schema ledger artifact, and initialize execution engine state. |
| Producer command 1 | `pios ledger create --run-id <run_id> --client <tenant> --source-version <version>` |
| Outputs 1 | `clients/<tenant>/psee/runs/<run_id>/intake_record.json` (full AC schema) |
| Producer command 2 | `pios bootstrap --run-dir <run_dir>` |
| Outputs 2 | `clients/<tenant>/psee/runs/<run_id>/package/engine_state.json`, `gauge_inputs.json` |
| Consumer command | All S1–S4 commands; `validate freshness` AC gate |
| Authoritative spec | `docs/psee/FRESH.RUN.BOOTSTRAP.PROTOCOL.01/fresh_run_bootstrap_protocol.md` |
| Authoritative spec 2 | `docs/psee/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01/runtime_surface_specification.md` |

### Stage: IG Bridge — Intelligence Graph Materialization

| field | value |
|-------|-------|
| Purpose | Transform governed intake bundle into IG-compatible runtime input structure (6 files) required by compute_coverage.sh and compute_reconstruction.sh. Also writes run_identity.json bridge artifact. |
| Producer command | `pios ig materialize --tenant <tenant> --intake-id <intake_id> --run-id <run_id>` |
| Inputs | `clients/<tenant>/psee/intake/<intake_id>/` bundle |
| Outputs | `clients/<tenant>/psee/runs/<run_id>/ig/` (evidence_boundary.json, admissibility_log.json, source_manifest.json, normalized_intake_structure/{layer_index.json, provenance_chain.json, source_profile.json}) + `run_identity.json` |
| Consumer command | `pios emit coverage`, `pios emit reconstruction` (via `--ig-dir`) |
| Authoritative spec | `docs/psee/PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialization_spec.md` |
| Authoritative IG note | For 30-unit authoritative basis: `docs/pios/IG.RUNTIME/run_01/` used directly as `--ig-dir`. Contains same 6 IG files. |
| Authority | `docs/psee/IG.HANDOFF.AUTHORITY.01/ig_handoff_authority.md` |

### Stage: IG Integration — Structural Layer Registration

| field | value |
|-------|-------|
| Purpose | Register produced structural layers (L40_2, L40_3, L40_4) into `ig/normalized_intake_structure/layer_index.json` so that `pios emit coverage` cross-reference matches structural artifacts. |
| Producer command | `pios ig integrate-structural-layers --tenant <tenant> --run-id <run_id>` |
| Inputs | `clients/<tenant>/psee/runs/<run_id>/40_2/`, `40_3/`, `40_4/` |
| Outputs | Updated `clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/layer_index.json` |
| Consumer command | `pios emit coverage` (reads layer_index.json for cross-reference) |
| Constraint | Required when using run-scoped ig/; not applicable when using `docs/pios/IG.RUNTIME/run_01/` directly |
| Authoritative spec | `docs/psee/PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01/s1_runscoped_ig_alignment_spec.md` |

### Stage: L40.2 — Structural Extraction

| field | value |
|-------|-------|
| Purpose | Classify every admitted file from the IG runtime package into typed structural units (CEUs). |
| Producer command | `pios structural extract --tenant <tenant> --run-id <run_id>` |
| Inputs | `clients/<tenant>/psee/runs/<run_id>/ig/` (admissibility_log.json, layer_index.json) |
| Outputs | `clients/<tenant>/psee/runs/<run_id>/40_2/` |
| Consumer command | `pios structural relate` (L40.3) |
| Authoritative spec | `docs/psee/PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01/structural_truth_40_2_spec.md` |
| Authority | `docs/psee/STRUCTURAL.TRUTH.AUTHORITY.01/structural_truth_authority.md` |

### Stage: L40.3 — Structural Relation

| field | value |
|-------|-------|
| Purpose | Derive all structurally grounded relationships (edges) between CEUs established by L40.2. |
| Producer command | `pios structural relate --tenant <tenant> --run-id <run_id>` |
| Inputs | `clients/<tenant>/psee/runs/<run_id>/40_2/` |
| Outputs | `clients/<tenant>/psee/runs/<run_id>/40_3/` |
| Consumer command | `pios structural normalize` (L40.4) |
| Authoritative spec | `docs/psee/PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01/structural_truth_40_3_spec.md` |

### Stage: L40.4 — Structural Normalization

| field | value |
|-------|-------|
| Purpose | Cross-validate L40.2 and L40.3 outputs; produce canonical, deduplicated, normalized structural topology. Terminal layer of STRUCTURAL.TRUTH stream. |
| Producer command | `pios structural normalize --tenant <tenant> --run-id <run_id>` |
| Inputs | `clients/<tenant>/psee/runs/<run_id>/40_2/` + `40_3/` |
| Outputs | `clients/<tenant>/psee/runs/<run_id>/40_4/` |
| Consumer command | `pios ig integrate-structural-layers` |
| Authoritative spec | `docs/psee/PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01/structural_truth_40_4_spec.md` |
| Constraint | L40.4 does NOT read from ig/ artifacts. Does not modify 40_2/ or 40_3/. |

### Stage: S1 — Coverage and Reconstruction

| field | value |
|-------|-------|
| Purpose (coverage) | Compute DIM-01: required vs admissible units from IG evidence boundary. |
| Producer command 1 | `pios emit coverage --run-dir <run_dir> --ig-dir <ig_dir>` |
| Script invoked | `scripts/pios/runtime/compute_coverage.sh` |
| Outputs 1 | `package/coverage_state.json`, updated `package/gauge_inputs.json` |
| Purpose (reconstruction) | Validate DIM-02: does admitted evidence assemble into structurally valid program representation? Four axes: COMPLETENESS, STRUCTURAL_LINK, REFERENTIAL_INTEGRITY, LAYER_CONSISTENCY. |
| Producer command 2 | `pios emit reconstruction --run-dir <run_dir> --ig-dir <ig_dir>` |
| Script invoked | `scripts/pios/runtime/compute_reconstruction.sh` |
| Outputs 2 | `package/reconstruction_state.json`, updated `package/gauge_inputs.json` |
| Authoritative spec | `docs/psee/PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01/s1_runscoped_ig_alignment_spec.md` |
| Authoritative IG used | `docs/pios/IG.RUNTIME/run_01/` (30 units) |
| Authoritative values | coverage=100% (30/30), reconstruction=PASS (30/30), all axes PASS |

### Stage: S2 — Topology Emission

| field | value |
|-------|-------|
| Purpose | Emit canonical topology (domains / capabilities / components) from the semantic derivation layer. |
| Producer command | `pios emit topology --run-dir <run_dir> --run-id <run_id>` |
| Script invoked | `scripts/pios/41.1/build_semantic_layer.py` (contract: PIOS-41.1-RUN01-CONTRACT-v1) |
| Inputs | Semantic derivation module `scripts/pios/41.1/build_semantic_layer.py`; run_ref `run_03_blueedge_derivation_validation` |
| Outputs | `package/canonical_topology.json` (17 domains, 42 capabilities, 89 components, 148 total nodes) |
| Consumer | `/api/topology` route in `app/gauge-product/pages/api/topology.js` (hardcoded — reads from `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`) |
| Authoritative canonical | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` |
| Execution report | `docs/psee/PSEE.FRESH.S2.S3.EMISSION.01/psee_fresh_s2_s3_emission_report.md` |

### Stage: S3 — Signal Emission

| field | value |
|-------|-------|
| Purpose | Emit governed signal registry from evidence_confidence evidence model. |
| Producer command | `pios emit signals --run-dir <run_dir>` |
| Script invoked | `scripts/pios/41.4/build_signals.py` (with CC-2 correction) |
| Outputs | `package/signal_registry.json`, `package/evidence_mapping_index.json`, `package/executive_signal_report.md` |
| Consumer | `/api/signals` route in `app/gauge-product/pages/api/signals.js` (hardcoded — reads from `docs/pios/41.4/signal_registry.json`) |
| Authoritative canonical | `docs/pios/41.4/signal_registry.json` (5 signals) |
| Authoritative values | total=5, run_reference=run_01_blueedge |

### Stage: S4 — Gauge Computation and Freshness

| field | value |
|-------|-------|
| Purpose | Compute governed gauge_state.json from S1–S3 package artifacts; declare coherence; validate freshness through all gates (AC, CA, GC, SC). |
| Producer command 1 | `pios compute gauge --run-dir <run_dir>` |
| Outputs 1 | `package/gauge_state.json` |
| Producer command 2 | `pios declare coherence --run-dir <run_dir>` |
| Outputs 2 | `coherence_record.json` |
| Producer command 3 | `pios validate freshness --run-dir <run_dir>` |
| Outputs 3 | Verdict to stdout |
| Authoritative contract | `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/gauge_state_computation_contract.md` |
| Authoritative contract 2 | `docs/psee/S3.S4.RUN.COHERENCE.CONTRACT.01/s3_s4_run_coherence_contract.md` |
| Authoritative values (recomputed) | canonical_score=60, projected_score=100, band=CONDITIONAL, execution_status=NOT_EVALUATED, verdict=GOVERNED AND FRESH THROUGH S4 |
| Score model | `docs/psee/PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01/gauge_scoring_semantic_alignment_spec.md` |

---

## SECTION 4 — NODE TEMPLATE

Every Obsidian page for a stage or artifact must follow this template:

```markdown
---
title: <note title>
node_type: <stage | artifact | governance | product-surface | meta>
stream_id: <PRODUCTIZE.*.01 or equivalent stream>
status: <ACTIVE | BLOCKED | LOCKED | INFORMATIONAL>
---

## Purpose
<one-paragraph statement of what this node represents — no invention>

## Authoritative Paths
- `<repo-root-anchored path 1>`
- `<repo-root-anchored path 2>`

## Classification
<canonical-doc | execution-log | intake-artifact | runtime-artifact | structural-artifact | gauge-artifact | lock-reference>

## Producing Step
- Command: `<exact pios command or script>`
- Script/file: `<path to script if applicable>`

## Consuming Step
- Command: `<exact pios command or downstream consumer>`
- Route: `<app route if applicable>`

## Input Artifacts
- `<artifact path 1>`

## Output Artifacts
- `<artifact path 1>`

## Linked Specs
- [[<spec doc title>]] → `<path>`

## Linked Execution Logs
- [[<exec log title>]] → `<path>`

## Determinism / Constraint Notes
<any determinism invariants or known constraints>

## Status / Boundary Notes
<blocked lineage, NOT_EVALUATED semantics, or other boundary conditions>
```

---

## SECTION 5 — ARTIFACT CLASSIFICATION

### 5.1 Canonical Docs

| attribute | value |
|-----------|-------|
| Definition | Governance contracts, authority protocols, and stream specifications that define system behavior. Valid for all runs. |
| Path pattern | `docs/psee/<STREAM>/*_spec.md`, `docs/psee/<STREAM>/*_contract.md`, `docs/psee/<STREAM>/*_protocol.md`, `docs/governance/runtime/*.md` |
| Allowed wiki treatment | Link by path; cite title and stream ID |
| Forbidden | Copy body text; modify; treat as run-scoped |

### 5.2 Execution Logs

| attribute | value |
|-----------|-------|
| Definition | Records of a specific stream execution. Evidence of what was done, when, and with what result. |
| Path pattern | `docs/psee/<STREAM>/EXECUTION_LOG.md` |
| Allowed wiki treatment | Link by path; cite status and verdict from header only |
| Forbidden | Copy body text; use as specification authority |

### 5.3 Intake Artifacts

| attribute | value |
|-----------|-------|
| Definition | Governed hash bundle produced by `pios intake create`. Bound to a specific `intake_id`. |
| Path pattern | `clients/<tenant>/psee/intake/<intake_id>/` |
| Files | `intake_record.json`, `source_manifest.json`, `file_hash_manifest.json`, optionally `git_metadata.json` |
| Allowed wiki treatment | Reference path; describe schema fields by name |
| Forbidden | Copy file content; treat as canonical knowledge |

### 5.4 Runtime Artifacts (IG)

| attribute | value |
|-----------|-------|
| Definition | Intelligence Graph handoff package. Either run-scoped (`runs/<run_id>/ig/`) or authoritative legacy (`docs/pios/IG.RUNTIME/run_01/`). |
| Path pattern | `clients/<tenant>/psee/runs/<run_id>/ig/` OR `docs/pios/IG.RUNTIME/run_01/` |
| Files | `evidence_boundary.json`, `admissibility_log.json`, `source_manifest.json`, `normalized_intake_structure/{layer_index.json, provenance_chain.json, source_profile.json}` |
| Allowed wiki treatment | Reference path; state unit count and source_run |
| Forbidden | Treat `docs/pios/IG.RUNTIME/run_01/` as recoverable — original source absent |

### 5.5 Structural Artifacts

| attribute | value |
|-----------|-------|
| Definition | Outputs of the L40.2 / L40.3 / L40.4 structural chain. Run-scoped. |
| Path pattern | `clients/<tenant>/psee/runs/<run_id>/40_2/`, `40_3/`, `40_4/` |
| Allowed wiki treatment | Reference path; note which pios command produced them |
| Forbidden | Treat as canonical knowledge; reference pre-40.4 layers as final output |

### 5.6 Package Artifacts (S1–S4 Outputs)

| attribute | value |
|-----------|-------|
| Definition | Terminal produced artifacts of each chain stage. Consumed by `pios compute gauge` and the GAUGE app routes. |
| Path pattern | `clients/<tenant>/psee/runs/<run_id>/package/` |
| Key files | `coverage_state.json`, `reconstruction_state.json`, `canonical_topology.json`, `signal_registry.json`, `gauge_state.json`, `engine_state.json`, `gauge_inputs.json` |
| Allowed wiki treatment | Reference path; cite key field values for the authoritative run |
| Forbidden | Copy full JSON; treat as canonical knowledge |

### 5.7 Gauge Artifacts

| attribute | value |
|-----------|-------|
| Definition | `gauge_state.json` — the single terminal artifact consumed by the GAUGE product surface. |
| Path pattern | `clients/<tenant>/psee/runs/<run_id>/package/gauge_state.json` |
| Key fields | `score.canonical`, `score.projected`, `score.band_label`, `state.execution_status`, `state.execution_layer_evaluated`, `confidence.lower`, `confidence.upper`, `confidence.status` |
| Allowed wiki treatment | Field-level description; authoritative value citation |
| Forbidden | Recompute values; assert semantics not present in the file |

### 5.8 Lock / Baseline References

| attribute | value |
|-----------|-------|
| Definition | Product baseline lock artifact that freezes the authoritative state at a specific commit and tag. |
| Path | `docs/psee/GAUGE.BASELINE.LOCK.01/gauge_baseline_lock_contract.md` |
| Tag | `product-gauge-authoritative-v1` |
| Commit | `6f8c62b` |
| Allowed wiki treatment | Cite tag, commit, and lock contract path |
| Forbidden | Override with newer partial state |

---

## SECTION 6 — DIRECTORY MAPPING RULES

### 6.1 Path Notation

All paths in the wiki must be repo-root anchored using forward-slash notation:

```
docs/psee/<STREAM>/<file>
clients/<tenant>/psee/runs/<run_id>/package/<file>
scripts/pios/<command or script>
app/gauge-product/pages/api/<route>
```

No tilde paths. No absolute `/Users/...` paths. No relative `../../` paths.

### 6.2 Run-Scoped Path Convention

Run-scoped paths use `<run_id>` as a placeholder when describing schema, and the specific run_id when citing authoritative values:

```
# Schema description:
clients/blueedge/psee/runs/<run_id>/package/gauge_state.json

# Authoritative value citation:
clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json
```

### 6.3 Canonical vs Generated Path Treatment

| path type | treatment |
|-----------|-----------|
| Canonical spec path | Link as authoritative — path is stable |
| Generated run artifact | Cite with run_id qualifier — path is run-scoped |
| Script path | Link as authoritative — scripts are versioned |
| App route path | Link as authoritative — routes are versioned |

### 6.4 Authoritative-But-Nonrecoverable Upstream Lineage

`docs/pios/IG.RUNTIME/run_01/` is authoritative but its upstream source is not recoverable:

```
docs/pios/IG.RUNTIME/run_01/
  ← sourced from: docs/pios/runs/run_07_source_profiled_ingestion/  [NOT PRESENT]
  ← original files: BlueEdge source package, ingested 2026-04-05
```

Wiki treatment:
- State the IG path as authoritative
- Note the lineage constraint explicitly
- Do NOT assert the original source is recoverable
- Do NOT link to `run_07_source_profiled_ingestion/`

### 6.5 Handling Missing Directories

Any path cited in the wiki that cannot be verified as existing must be:
- marked `[NOT PRESENT — lineage constraint]` or `[BLOCKED — path not verified]`
- excluded from the minimal authoritative set's navigable links

---

## SECTION 7 — LINKING MODEL

### 7.1 Note-to-Note Links

Use Obsidian `[[Note Title]]` syntax for links between wiki pages.
Stage pages link forward and backward along the chain:
```
[[S0 — Intake and Bootstrap]] → [[IG — Intelligence Graph Bridge]] → [[L40.2 — Structural Extraction]] → ...
```

### 7.2 Note-to-File Links

Use Obsidian `[[path/to/file.md|Display Name]]` syntax for links to repo files visible in the vault.
For repo paths not visible in the vault, cite as inline code only:
```
`docs/psee/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01/runtime_surface_specification.md`
```

### 7.3 Stage Transition Links

Each stage page must include a **Transitions** section:
```markdown
## Transitions
- ← Previous: [[<prev stage>]]
- → Next: [[<next stage>]]
```

The root page (S0) and terminal page (S4) have asymmetric transitions.

### 7.4 Artifact Backlinks

Each artifact page must link back to its producing stage and consuming stage:
```markdown
## Produced By
[[<producing stage>]]

## Consumed By
[[<consuming stage>]]
```

### 7.5 Dual-Run Comparison Linking

The Dual-Run Comparison page links to:
- [[Lock Baseline]]
- [[S4 — Gauge Computation and Freshness]]
- [[Gauge State]] artifact page
- Authoritative spec: `docs/psee/PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01/gauge_dual_run_comparison_spec.md`
- Recompute spec: `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/gauge_authoritative_apples_to_apples_recompute_spec.md`

### 7.6 Lock Baseline Linking

The Lock Baseline page links to:
- `docs/psee/GAUGE.BASELINE.LOCK.01/gauge_baseline_lock_contract.md`
- Tag: `product-gauge-authoritative-v1`
- Commit: `6f8c62b`
- Validated run: `run_authoritative_recomputed_01`

### 7.7 Prohibition on Unresolved Links

A wiki link may only appear if the destination exists or is declared as a planned note in this spec.
Links to non-existent notes must be accompanied by `[PLANNED]` notation.
Links to non-recoverable source paths must be accompanied by `[NOT PRESENT]` notation.
No orphan links.

---

## SECTION 8 — MINIMAL AUTHORITATIVE SET

The minimal authoritative set is the exact set of notes, paths, and artifacts required to understand how GAUGE works as a product. All items have been verified as present in the repo.

### 8.1 Authoritative Wiki Pages (Required)

| page | folder | authoritative sources |
|------|--------|-----------------------|
| Lock Baseline | 00 — Meta | `docs/psee/GAUGE.BASELINE.LOCK.01/gauge_baseline_lock_contract.md` |
| Chain Overview | 00 — Meta | `docs/psee/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01/runtime_surface_specification.md` |
| Directory Map | 00 — Meta | All stage paths listed below |
| S0 — Intake and Bootstrap | 01 | `docs/psee/FRESH.RUN.BOOTSTRAP.PROTOCOL.01/fresh_run_bootstrap_protocol.md`; `docs/psee/PRODUCTIZE.RAW.SOURCE.INTAKE.01/intake_specification.md` |
| IG — Intelligence Graph Bridge | 01 | `docs/psee/PRODUCTIZE.IG.FROM.INTAKE.01/ig_materialization_spec.md`; `docs/psee/IG.HANDOFF.AUTHORITY.01/ig_handoff_authority.md`; `docs/pios/IG.RUNTIME/run_01/` |
| L40.2 — Structural Extraction | 01 | `docs/psee/PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01/structural_truth_40_2_spec.md` |
| L40.3 — Structural Relation | 01 | `docs/psee/PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01/structural_truth_40_3_spec.md` |
| L40.4 — Structural Normalization | 01 | `docs/psee/PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01/structural_truth_40_4_spec.md` |
| S1 — Coverage and Reconstruction | 01 | `docs/psee/PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01/s1_runscoped_ig_alignment_spec.md`; `scripts/pios/runtime/compute_coverage.sh`; `scripts/pios/runtime/compute_reconstruction.sh` |
| S2 — Topology Emission | 01 | `docs/psee/PSEE.FRESH.S2.S3.EMISSION.01/psee_fresh_s2_s3_emission_report.md`; `scripts/pios/41.1/build_semantic_layer.py`; `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` |
| S3 — Signal Emission | 01 | `docs/pios/41.4/signal_registry.json`; `scripts/pios/41.4/build_signals.py` |
| S4 — Gauge Computation and Freshness | 01 | `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/gauge_state_computation_contract.md`; `docs/psee/S3.S4.RUN.COHERENCE.CONTRACT.01/s3_s4_run_coherence_contract.md` |
| Package Artifacts | 02 | `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/` |
| Gauge State | 02 | `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json` |
| Contracts | 03 | `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/`, `docs/psee/S3.S4.RUN.COHERENCE.CONTRACT.01/`, `docs/governance/runtime/git_structure_contract.md` |
| Protocols | 03 | `docs/psee/FRESH.RUN.BOOTSTRAP.PROTOCOL.01/`, `docs/psee/BOOTSTRAP.CHAIN.AUTHORITY.01/` |
| App Routes | 04 | `app/gauge-product/pages/api/gauge.js`, `topology.js`, `signals.js` |
| Dual-Run Comparison | 04 | `docs/psee/PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01/gauge_dual_run_comparison_spec.md`; `docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/gauge_authoritative_apples_to_apples_recompute_spec.md` |
| Alignment Streams Index | 05 | `docs/psee/PRODUCTIZE.*/` (all 7 verified PRODUCTIZE streams) |

### 8.2 Excluded from Minimal Set

| item | reason for exclusion |
|------|---------------------|
| `docs/psee/runs/run_07_source_profiled_ingestion/` | DOES NOT EXIST — lineage constraint |
| `docs/psee/GAUGE.MEANING.LAYER.*` (multiple) | Interpretation layer — out of scope for operational wiki |
| `docs/psee/GAUGE.EXECUTIVE.*`, `GAUGE.RUNTIME.RENDERING.*` | UI/demo layer artifacts — not part of S0–S4 operational chain |
| `docs/psee/PSEE.PROJECTION.LAYER.*` | Projection semantics — separate concern |
| `docs/psee/BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01` | Recovery stream — not operational chain |
| `docs/psee/EXECLENS.DEMO.RESTORE.01` | Demo restore — not product chain |
| `clients/blueedge/psee/runs/run_01_authoritative/` | Pre-Stream-10 legacy artifact; superseded by run_authoritative_recomputed_01 |
| All `run_cli_validation_*`, `run_bac_*`, `run_gsca_*` | Validation runs — not authoritative operational basis |

---

## SECTION 9 — MCP EXECUTION MODEL (DESIGN ONLY)

This section defines the future operating model for Claude via MCP to generate and update the wiki deterministically. **Design only — no implementation in this stream.**

### 9.1 Scan Order

MCP execution must scan in the following order:
1. Read `docs/governance/runtime/git_structure_contract.md` — establish domain ownership
2. Read `docs/psee/GAUGE.BASELINE.LOCK.01/gauge_baseline_lock_contract.md` — establish locked baseline
3. Read `docs/psee/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01/runtime_surface_specification.md` — establish chain scope
4. Scan `docs/psee/PRODUCTIZE.*/` in stream_id order — extract stage specs
5. Scan `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/` — extract authoritative artifact values
6. Scan `scripts/pios/pios.py --help` output — verify command inventory
7. Scan `app/gauge-product/pages/api/` — verify route binding

### 9.2 Path Discovery Order

For each wiki node, path discovery must proceed:
1. Verify primary spec path (`docs/psee/<STREAM>/<spec>.md`) — REQUIRED
2. Verify execution log path (`docs/psee/<STREAM>/EXECUTION_LOG.md`) — OPTIONAL
3. Verify producing command via pios.py help or spec — REQUIRED
4. Verify output artifact path for authoritative run — REQUIRED for package artifacts
5. If any required path is absent → mark node BLOCKED

### 9.3 Update Rules

- An existing wiki note may be updated ONLY if a newer authoritative spec or execution log exists with a higher version or date
- Updates must preserve the node template structure
- Field values must be replaced, not appended, when a newer authoritative value exists
- The Lock Baseline page may only be updated by a formal new baseline lock stream

### 9.4 Note Creation Rules

- One note per stage, per artifact class, per governance doc group
- No duplicate notes for the same stage or artifact
- If a path has already been cited in an existing note, link to that note rather than creating a new one

### 9.5 Non-Duplication Rules

Before writing any wiki content, MCP must check:
- Does a note already exist for this path? → Link, do not create
- Does the content to be written already exist in a linked spec? → Cite by path, do not copy
- Is the artifact value already cited in an artifact node? → Reference by node link

### 9.6 Deterministic Regeneration Rules

Given the same repo state (same git HEAD), MCP execution must produce the same wiki structure. This requires:
- Scan order is fixed (Section 9.1)
- Path discovery order is fixed (Section 9.2)
- Node template is fixed (Section 4)
- Authoritative values are read from `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json`

### 9.7 Fail-Closed Conditions

MCP must stop and report a BLOCKED condition if:
- The locked baseline doc is absent
- A stage spec is absent and cannot be verified as intentionally excluded
- The authoritative run package is absent
- Any required input for a REQUIRED path discovery step fails
- Two notes would contain identical body text (duplication violation)

---

## SECTION 10 — FINAL STRUCTURE OVERVIEW

### 10.1 Final Obsidian Tree

```
GAUGE Operational Wiki/
├── GAUGE — Operational Wiki.md           ← root entry point
│
├── 00 — Meta/
│   ├── Lock Baseline.md
│   ├── Chain Overview.md
│   └── Directory Map.md
│
├── 01 — Chain Stages/
│   ├── S0 — Intake and Bootstrap.md
│   ├── IG — Intelligence Graph Bridge.md
│   ├── L40.2 — Structural Extraction.md
│   ├── L40.3 — Structural Relation.md
│   ├── L40.4 — Structural Normalization.md
│   ├── S1 — Coverage and Reconstruction.md
│   ├── S2 — Topology Emission.md
│   ├── S3 — Signal Emission.md
│   └── S4 — Gauge Computation and Freshness.md
│
├── 02 — Artifacts/
│   ├── Intake Artifacts.md
│   ├── IG Artifacts.md
│   ├── Structural Artifacts.md
│   ├── Package Artifacts.md
│   └── Gauge State.md
│
├── 03 — Governance/
│   ├── Contracts.md
│   └── Protocols.md
│
├── 04 — Product Surface/
│   ├── App Routes.md
│   └── Dual-Run Comparison.md
│
└── 05 — Alignment Streams/
    └── Alignment Streams Index.md
```

**Total pages: 22**

### 10.2 Why This Set Is Sufficient and Minimal

**Sufficient:** Every stage of the chain (intake → IG → 40.2 → 40.3 → 40.4 → S1 → S2 → S3 → S4 → GAUGE surface) is represented with a dedicated stage node. Every artifact class has a classification node. Governance contracts and protocols are indexed. The product surface (app routes) and dual-run comparison are present. The locked baseline is the entry point.

**Minimal:** No interpretation/meaning layer docs are included. No demo/restore streams are included. No legacy superseded runs are included. No duplicate stage nodes. No speculative nodes. The 22 pages cover exactly what is needed to understand the operational chain and navigate to any authoritative source.

### 10.3 Page Inventory Summary

| folder | pages | coverage |
|--------|-------|---------|
| 00 — Meta | 3 | Baseline lock, chain overview, directory map |
| 01 — Chain Stages | 9 | S0 + IG bridge + L40.2 + L40.3 + L40.4 + S1 + S2 + S3 + S4 |
| 02 — Artifacts | 5 | Intake + IG + structural + package + gauge state |
| 03 — Governance | 2 | Contracts index + protocols index |
| 04 — Product Surface | 2 | App routes + dual-run comparison |
| 05 — Alignment Streams | 1 | Index of 7 PRODUCTIZE.* alignment streams |
| Root | 1 | Entry point |
| **Total** | **23** | **Complete operational coverage** |

Authority: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
