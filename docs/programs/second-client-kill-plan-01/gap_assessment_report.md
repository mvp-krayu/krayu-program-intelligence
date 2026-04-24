# Gap Assessment Report

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.GAP-ASSESSMENT.01
Branch: feature/second-client-kill-plan-01
Date: 2026-04-24
Status: ASSESSMENT COMPLETE — no runtime execution performed
Mode: ASSESSMENT ONLY

---

## Assessment Scope

PiOS → GAUGE → LENS → sellable projection → brain emission

Evidence sources inspected:
- `docs/programs/second-client-kill-plan-01/` (7 planning documents)
- `docs/baseline/pios_baseline_v1.0.md`
- `scripts/pios/` (80+ scripts across 40.2–42.x)
- `scripts/psee/` (16 production scripts)
- `app/execlens-demo/`, `app/gauge-product/`
- `clients/` (registry, blueedge, UUID client, template)

---

## Findings

---

### BLOCKERS

---

ID: GAP-01
Area: S1 — Evidence Ingestion
Severity: BLOCKER
Finding: S1 ingestion scripts (40.2) hardcode BlueEdge evidence source paths. `EVIDENCE_ORIGIN_ROOT` is set to `Path.home() / "Projects/blueedge-program-intelligence/source-v3.23"`. Primary evidence paths, provenance-only paths, and excluded paths are all BlueEdge-specific constants. No parameter exists for overriding the source path.
Evidence: `scripts/pios/40.2/build_evidence_inventory.py` lines 17–48
Impact: S1 cannot be executed for any non-BlueEdge client without code modification. This blocks the entire S1 stage of second-client execution.
Recommendation: Parameterize `EVIDENCE_ORIGIN_ROOT` and primary evidence path lists via CLI argument or config file. The spec `PRODUCTIZE.RAW.SOURCE.INTAKE.01` already supports arbitrary source paths — the 40.2 script needs to read its source boundary from that intake record rather than from hardcoded constants.
Depends on: None (standalone fix)

---

ID: GAP-02
Area: S1 — Validation Scripts
Severity: BLOCKER
Finding: Approximately 15 validation scripts across 40.2–40.8 hardcode BlueEdge-specific run IDs as pass/fail criteria. They check for `"run_01_blueedge"`, `"run_02_blueedge"`, `"run_03_blueedge_derivation_validation"`, and `"run_authoritative_recomputed_01"`. Any second-client run with a different run ID will fail these validators.
Evidence:
- `scripts/pios/40.2/validate_evidence_inventory.py` (run_id check: `"run_02_blueedge"`)
- `scripts/pios/40.3/validate_reconstruction.py` (checks `"run_02_blueedge"`)
- `scripts/pios/40.4/validate_structure_immutability.py` (`EXPECTED_40_3_RUN_ID = "run_02_blueedge"`)
- `scripts/pios/41.1/build_semantic_layer.py` line 34: `RUN_REFERENCE = "run_03_blueedge_derivation_validation"`
Impact: All S1–S2 validation gates will fail for any second-client run. Validation cannot be used to confirm a successful second-client execution.
Recommendation: Refactor validators to accept `--expected-run-id` as a parameter or to derive the expected run ID from the intake record. Validators should verify structural properties of the run, not match against hardcoded BlueEdge identifiers.
Depends on: GAP-01 (source parameterization must precede validation fix)

---

ID: GAP-03
Area: S3 — Activation (43.x / 44.x)
Severity: BLOCKER
Finding: S3 activation scripts do not exist. The execution contract requires 43.x (Signal-to-Structure Binding) and 44.x (Structural Overlay Projection). `scripts/pios/` contains directories 40.x, 41.x, and 42.x only. No `43.x` or `44.x` directories are present.
Evidence: `ls scripts/pios/` — output shows highest numbered directories are `42.27` and `42.9`. No `43.*` or `44.*` directories found.
Impact: S3 cannot be executed. The validation matrix group 3 (S3 activation) requires `scripts/pios/43.x` and `44.x` to produce binding and projection outputs. Without these, the end-to-end run cannot reach PASS on group 3.
Recommendation: Determine whether S3 execution currently routes through `scripts/psee/run_end_to_end.py` (which is parameterized and includes a transformation/envelope stage) or whether 43.x/44.x scripts are genuinely absent. This is a human decision point — see execution_readiness_plan.md.
Depends on: Human decision on pipeline routing (see Open Question OQ-01)

---

ID: GAP-04
Area: S4 — LENS Report Generator
Severity: BLOCKER
Finding: `lens_report_generator.py` contains six BlueEdge-specific hardcodes that cannot be overridden without code modification:
  (1) `LENS_CLAIMS = ["CLM-25", "CLM-09", "CLM-20", "CLM-12", "CLM-10"]` — claim IDs are BlueEdge-specific
  (2) `FRAGMENTS_DIR = clients/blueedge/vaults/run_01_authoritative/claims/fragments` — BlueEdge vault path
  (3) `REPORTS_DIR = clients/blueedge/reports` — BlueEdge report output path
  (4) `CANONICAL_PKG_DIR = clients/blueedge/psee/runs/run_authoritative_recomputed_01/package` — BlueEdge run
  (5) 17 domains, 42 capabilities, 89 components embedded in report HTML sections (lines ~731–755)
  (6) Domain cluster names (e.g., "Fleet Operations", "Edge Data Acquisition") embedded in report structure
Evidence:
- `scripts/pios/lens_report_generator.py` lines 44, 50–55 (claims, paths)
- `scripts/pios/lens_report_generator.py` lines 731–755 (domain topology)
Impact: A LENS report generated for a second client will contain BlueEdge-specific content. This directly fails validation matrix group 7 check "No BlueEdge reference in LENS output." The lens_projection_portability_plan.md pass condition cannot be met without fixing this.
Recommendation: Parameterize LENS_CLAIMS, FRAGMENTS_DIR, REPORTS_DIR, and CANONICAL_PKG_DIR via CLI arguments. Extract domain topology from the canonical package at runtime rather than embedding BlueEdge-specific counts. Accept `--client` and `--run-id` arguments consistent with other scripts.
Depends on: GAP-05 (fragment generation for second client)

---

ID: GAP-05
Area: S4 — LENS Fragment / Projection Source
Severity: BLOCKER
Finding: `lens_report_generator.py` has two data sources: (1) a live API at `http://localhost:3000` (hardcoded, no env var), and (2) fragment files at the BlueEdge vault path. Neither source can serve second-client data in its current form. The API path requires a running gauge-product dev server pre-loaded with BlueEdge data. The fragment fallback reads from BlueEdge vault path (also hardcoded).
Evidence:
- `scripts/pios/lens_report_generator.py` line 46: `API_BASE = "http://localhost:3000"`
- `scripts/pios/lens_report_generator.py` line 50: `FRAGMENTS_DIR = REPO_ROOT / "clients" / "blueedge" / "vaults" / ...`
- `scripts/pios/lens_report_generator.py` line 79: `path = FRAGMENTS_DIR / f"{claim_id}-ZONE-2-L1.json"`
Impact: Without a parameterized fragment source, the LENS generator cannot consume second-client projection outputs. This blocks LENS projection portability verification.
Recommendation: Add `--fragments-dir` CLI argument. Verify that `projection_runtime.py export_fragments()` can write second-client fragments to a parameterized output directory, and wire that path into the report generator.
Depends on: GAP-04

---

ID: GAP-06
Area: S2 — Semantic Layer (41.1)
Severity: BLOCKER
Finding: `build_semantic_layer.py` embeds the full 17-domain BlueEdge domain model as a hardcoded Python constant. `RUN_REFERENCE = "run_03_blueedge_derivation_validation"` is also hardcoded. The semantic layer outputs (semantic_domain_model.md, capability_map.md, etc.) currently exist in `docs/pios/41.1/` as BlueEdge-specific artifacts.
Evidence:
- `scripts/pios/41.1/build_semantic_layer.py` line 34: `RUN_REFERENCE = "run_03_blueedge_derivation_validation"`
- `scripts/pios/41.1/build_semantic_layer.py` lines 39–55: All 17 domain names, types, and groundings hardcoded
Impact: The semantic layer cannot be rebuilt for a second client with different evidence. If the second client has a different domain structure (which is expected per baseline_comparison_plan.md), the semantic layer will produce BlueEdge-specific output. This violates "Domain classification logic is client-agnostic" invariant.
Recommendation: S2 semantic layer derivation must read domain structure from evidence-derived artifacts (40.4 handoff outputs or canonical_topology.json) rather than embedded constants. The current script is valid as a BlueEdge replay mechanism but is not portable.
Depends on: GAP-01, GAP-02

---

ID: GAP-07
Area: Tier-2 Query Layer
Severity: BLOCKER
Finding: `tier2_data.py` has zero parameterization. `CANONICAL_PKG_DIR`, `FOCUS_DOMAIN`, and `RUN_ID` are all module-level constants with BlueEdge-specific values. All three data-loading functions (`load_topology()`, `load_signals()`, `load_gauge()`) read from the hardcoded path unconditionally.
Evidence:
- `scripts/pios/tier2_data.py` lines 18–25: `CANONICAL_PKG_DIR = clients/blueedge/psee/runs/run_authoritative_recomputed_01/package`, `FOCUS_DOMAIN = "DOMAIN-10"`, `RUN_ID = "run_authoritative_recomputed_01"`
Impact: Tier-2 LENS diagnostic queries cannot be served for a second client. The tier-2 query engine is the runtime backing for LENS Tier-2 report content and the DiagnosticNarrative component. Blocking this blocks Tier-2 LENS projection entirely.
Recommendation: Refactor `tier2_data.py` to accept `client_id`, `run_id`, and optionally `focus_domain` as constructor arguments or module-level inits. Downstream callers (`tier2_query_engine.py`) must be updated accordingly.
Depends on: GAP-04

---

ID: GAP-08
Area: Client Registry
Severity: BLOCKER
Finding: `clients/registry/client_index.json` contains only one client: `blueedge`. There is no documented process for registering a second client before execution. The registry is referenced by stream `PSEE.RECONCILE.1.WP-13` but no script for adding entries is found.
Evidence: `clients/registry/client_index.json` lines 1–12: single entry for `blueedge` with `lifecycle_state: ACTIVE`
Impact: Without a registered second-client entry, the client isolation requirement in validation matrix group 2 cannot be confirmed. The gap is also a governance gap — the execution contract requires a `client-id` to be assigned before execution, but no mechanism exists to do this cleanly.
Recommendation: Define a client registration step as part of second-client pre-execution: manually add an entry to `client_index.json` with a new `client_uuid` and `business_client_id`. Document this as an explicit pre-execution step in the execution_contract.md amendment.
Depends on: Human decision on client ID assignment

---

### MAJORS

---

ID: GAP-09
Area: S4 — GAUGE Envelope Adapter
Severity: MAJOR
Finding: `envelope_adapter.py` (the GAUGE render model generator) defaults to `client_uuid = "1de0d815-0721-58e9-bc8d-ca83e70fa903"` and `run_id = "run_335c0575a080"` — both BlueEdge-specific values. The function accepts parameters but the defaults point to BlueEdge artifacts.
Evidence:
- `app/execlens-demo/lib/gauge/envelope_adapter.py` lines 36–42: hardcoded default client UUID and run ID
Impact: Running the GAUGE envelope adapter without explicit parameters will produce BlueEdge-specific render output. A second-client run must explicitly override these defaults. If defaults are relied upon at any step, GAUGE portability validation will fail.
Recommendation: Require `client_uuid` and `run_id` as explicit required parameters (no defaults). Remove BlueEdge-specific default values.
Depends on: GAP-08 (client UUID must be assigned)

---

ID: GAP-10
Area: S4 — Projection Runtime
Severity: MAJOR
Finding: `projection_runtime.py` defaults `run_id` to `"run_authoritative_recomputed_01"`. While the function accepts a `run_id` parameter, BlueEdge-specific defaults will be used if the caller omits the parameter.
Evidence: `scripts/pios/projection_runtime.py` line 52: `run_id: str = "run_authoritative_recomputed_01"`
Impact: Any caller that does not explicitly pass `run_id` will consume BlueEdge projections for the second-client run. This is a silent contamination risk.
Recommendation: Remove the default or make it an explicit required parameter. Callers must supply client-specific run IDs explicitly.
Depends on: GAP-08

---

ID: GAP-11
Area: S4 — Graph State Export (Tier-2 Panel)
Severity: MAJOR
Finding: `export_graph_state.mjs` hardcodes the BlueEdge vault path as input and `clients/blueedge/reports/tier2/graph_state.json` as output. No parameterization exists.
Evidence: `scripts/pios/export_graph_state.mjs` lines 28–35: hardcoded vault index path and output path
Impact: The Tier-2 graph snapshot panel in the LENS Tier-2 commercial brief currently uses the BlueEdge graph state. For a second-client run, the graph state file cannot be generated for the new client without code changes. The LENS Tier-2 projection for a second client will show BlueEdge topology.
Recommendation: Parameterize `--client`, `--run-id`, and `--output` in `export_graph_state.mjs`. Accept vault path as a CLI argument consistent with `build_evidence_vault.py`.
Depends on: GAP-04, GAP-08

---

ID: GAP-12
Area: Pipeline Routing Ambiguity
Severity: MAJOR
Finding: Two distinct pipeline paths exist, and their relationship is not documented. `scripts/pios/` contains the numbered stream scripts (40.x → 42.x). `scripts/psee/run_end_to_end.py` is a separate production-grade runner that accepts `--client <uuid>` and `--source <path>` and appears fully parameterized. It is unclear whether these are sequential (psee orchestrates pios), parallel (alternative paths), or whether one supersedes the other for second-client execution.
Evidence:
- `scripts/psee/run_end_to_end.py` lines 1–31: parameterized production runner
- `scripts/pios/40.2/build_evidence_inventory.py` lines 1–10: stream-specific build script with hardcoded source
Impact: Selecting the wrong execution path may result in either (a) BlueEdge-specific scripts blocking execution, or (b) skipping governance validation steps that the numbered stream scripts enforce. This ambiguity cannot be resolved by assessment alone.
Recommendation: Human decision required. See OQ-01 in execution_readiness_plan.md.
Depends on: Human decision (OQ-01)

---

ID: GAP-13
Area: Brain Emission — No Concrete Format
Severity: MAJOR
Finding: `brain_emission_plan.md` defines categories for all four brain domains (CANONICAL, CODE, PRODUCT, PUBLISH) but provides only planning text. No emission script exists. No JSON schema exists for brain emission outputs. No automated mechanism populates brain branches from run artifacts. The brain/* branches were not visible for content assessment.
Evidence: `docs/programs/second-client-kill-plan-01/brain_emission_plan.md` — all sections marked "To be populated post-run" or contain structural categories without executable format
Impact: Validation matrix group 6 (Brain Emission Completeness) cannot be verified programmatically. Emissions will require manual population, which introduces risk of omission and non-determinism.
Recommendation: Before execution, define the minimum emission format as a structured template (e.g., markdown with required section headers per brain). This does not require a script — a documented fill-in template with explicit PASS criteria is sufficient for first run.
Depends on: None (documentation-only fix)

---

ID: GAP-14
Area: Tenant Architecture
Severity: MAJOR
Finding: `pios.py` accepts `--tenant` as a CLI parameter and several `ig` subcommands (`ig materialize`, `ig integrate-structural-layers`) use `--tenant` as a required argument. However, no `tenants/` directory exists in the repository. The relationship between `tenant` and `client` in the runtime model is not documented.
Evidence:
- `scripts/pios/pios.py` lines 19, 23: `--tenant` parameter in multiple commands
- Bash output: `ls /Users/khorrix/Projects/k-pi-core/tenants/` — NOT FOUND
Impact: If S1 IG commands require a tenant context and no tenant is defined, IG-layer execution will fail or behave undefined for a second client.
Recommendation: Clarify whether `tenant` and `client` are synonymous in the current system or whether tenant is a superclient grouping. If tenants/ directory is required, define it before execution. If `--tenant` maps to `--client`, document that mapping.
Depends on: Human decision (OQ-02)

---

### MINORS

---

ID: GAP-15
Area: S4 — API Dependency
Severity: MINOR
Finding: `lens_report_generator.py` uses `http://localhost:3000` as the primary data source, with fragment files as fallback. No environment variable or CLI argument controls the API base URL.
Evidence: `scripts/pios/lens_report_generator.py` line 46: `API_BASE = "http://localhost:3000"`
Impact: For offline or CI execution, the API source will fail and the fallback (BlueEdge fragment files) will activate — which is also hardcoded to BlueEdge. The API dependency must be satisfied or explicitly bypassed for second-client execution.
Recommendation: Add `--api-base` CLI argument or `LENS_API_BASE` environment variable. For second-client execution, running in fragment-only mode with a parameterized `--fragments-dir` is the cleaner path.
Depends on: GAP-04, GAP-05

---

ID: GAP-16
Area: Client Template
Severity: MINOR
Finding: `clients/client_template_01/` exists with partial coverage (22/30 units, score 46, `PHASE_1_ACTIVE`). This appears to be test data, not a reusable onboarding scaffold. It is not documented as the canonical template for adding a new client.
Evidence: `clients/client_template_01/psee/config/runtime_profile.json` lines 1–20: partial coverage state
Impact: There is no canonical scaffold or documentation for what a new client directory must contain before execution. This could lead to incomplete directory setup for the second client.
Recommendation: Either promote `client_template_01` to an explicit onboarding template with documentation, or define the required directory structure in the execution_contract.md amendment for the second-client run.
Depends on: GAP-08

---

ID: GAP-17
Area: Documentation — GAUGE Scoring Formula
Severity: MINOR
Finding: The GAUGE scoring formula is not available as a standalone reference document. Scoring behavior is referenced across execution logs, `docs/psee/PSEE-GAUGE.0/`, and in planning documents (score range 0–100, derived from evidence), but no single authoritative formula document was found.
Evidence: `docs/programs/second-client-kill-plan-01/baseline_comparison_plan.md` section 5: references scoring behavior without formula; `docs/psee/PSEE-GAUGE.0/` — operational wiki and logs exist but formula reference NOT FOUND as standalone document
Impact: Without a documented scoring formula, the structural invariant "Score derivation formula unchanged" (validation matrix group 3) cannot be explicitly verified between BlueEdge and second-client runs.
Recommendation: Locate or create `docs/psee/PSEE-GAUGE.0/gauge_scoring_formula.md` before declaring the invariant confirmed. A one-page reference is sufficient.
Depends on: None

---

ID: GAP-18
Area: Documentation — Source Validation Contract
Severity: MINOR
Finding: `PRODUCTIZE.RAW.SOURCE.INTAKE.01` covers intake mechanics (directory walking, hashing, artifact writing). No standalone source validation contract document was found that defines what evidence a second client must provide before intake is considered valid.
Evidence: `docs/psee/PRODUCTIZE.RAW.SOURCE.INTAKE.01/intake_specification.md` — defines execution of intake, not source qualification criteria; "minimum evidence package" NOT FOUND as standalone document
Impact: The execution contract requires "Evidence volume and domain coverage to be determined at intake" (S0 section). Without a minimum evidence package definition, the intake operator has no acceptance criteria for a second-client evidence set.
Recommendation: After the second-client run, populate the minimum evidence package definition in the PRODUCT brain emission. As a pre-run decision, confirm with the engagement owner what evidence the second client is providing.
Depends on: Human decision (OQ-03)

---

### OBSERVATIONS

---

ID: GAP-19
Area: Pipeline Path — scripts/psee/run_end_to_end.py
Severity: OBSERVATION
Finding: `scripts/psee/run_end_to_end.py` accepts `--client <uuid>`, `--source <path>`, `--run-id`, and `--target gauge` as CLI arguments. It orchestrates a full INTAKE → LINEAGE → STRUCTURE → TRANSFORMATION → ENVELOPE → VALIDATION sequence. This script may represent the correct parameterized execution path that supersedes the hardcoded 40.x scripts for production runs.
Evidence: `scripts/psee/run_end_to_end.py` lines 1–31: full parameterized production runner with 6 pipeline stages and 7 exit codes
Impact: If this is the authoritative execution path, the 40.x hardcoded scripts may be BlueEdge-specific historical artifacts, and the BLOCKER severity of GAP-01/GAP-02 may apply only to the stream-specific scripts, not to production execution. Verification required.
Recommendation: Confirm with repo owner whether `scripts/psee/run_end_to_end.py` supersedes `scripts/pios/40.x` for production second-client execution. If yes, GAP-01 and GAP-02 severity may be downgraded to MAJOR (legacy) after confirmation.
Depends on: OQ-01

---

ID: GAP-20
Area: Pipeline Path — build_evidence_vault.py
Severity: OBSERVATION
Finding: `scripts/psee/build_evidence_vault.py` accepts `--client`, `--run`, `--output-dir`, and `--client-name` as CLI arguments. It reads from `clients/<client>/psee/runs/<run>/package/` and writes to a parameterized output directory. This is the correct parameterized path for vault generation.
Evidence: `scripts/psee/build_evidence_vault.py` lines 10–17: parameterized CLI usage
Impact: Vault generation for a second client appears executable via this script without code changes, provided the client/run package artifacts exist.
Recommendation: Confirm that required package artifacts (gauge_state.json, coverage_state.json, etc.) will be present after a successful psee end-to-end run. If yes, vault generation does not need code changes.
Depends on: GAP-03 (S3 must complete before package artifacts exist)

---

ID: GAP-21
Area: RBAC / Security
Severity: OBSERVATION
Finding: No RBAC implementation exists in code. The system uses a zone-based access model (ZONE-1/2/3) in `projection_runtime.py` and an `AccessGateModal` UI component in `app/gauge-product/`. These are not equivalent to enterprise RBAC. No authentication mechanism was found. Audit log hooks do not exist in code.
Evidence:
- `scripts/pios/projection_runtime.py` lines 52–58: ZONE constants defined, no authentication
- `app/gauge-product/components/lens/AccessGateModal.js`: UI-only gate, no backend auth
- `scripts/psee/`, `scripts/pios/`: No auth middleware, no audit log calls
Impact: Consistent with planning documents — RBAC and audit logs are architecture requirements to document, not implement, in this run. The validation matrix group 7 requires RBAC attachment points to be documented. Code hooks are not required for this run to PASS.
Recommendation: No code action required for this run. Document RBAC attachment points during execution in `brain_emission_plan.md` CODE BRAIN section (RBAC/Audit Attachment Points Discovered table).
Depends on: Execution

---

ID: GAP-22
Area: Multi-Repo Source Scaling
Severity: OBSERVATION
Finding: The intake specification (`PRODUCTIZE.RAW.SOURCE.INTAKE.01`) accepts any `--source-path` pointing to a local or git directory. It does not assume a single repo. The 40.2 build script hardcodes a single source, but the `pios intake create` command and `run_end_to_end.py` are not architecturally constrained to a single repo.
Evidence:
- `docs/psee/PRODUCTIZE.RAW.SOURCE.INTAKE.01/intake_specification.md`: source_type detection (LOCAL_DIRECTORY or GIT_DIRECTORY) based on any path
- `scripts/pios/pios.py` line 11: `pios intake create --source-path <path>`
Impact: Multi-repo source is not architecturally blocked. The 40.2 hardcoding is a script-level issue (GAP-01), not an architectural constraint.
Recommendation: No architectural change required. Parameterization of 40.2 (GAP-01) resolves this for the second client.
Depends on: GAP-01

---

## Summary Table

| ID | Area | Severity | Short Description |
|---|---|---|---|
| GAP-01 | S1 Evidence Ingestion | BLOCKER | 40.2 hardcodes BlueEdge source path |
| GAP-02 | S1 Validation Scripts | BLOCKER | ~15 validators hardcode BlueEdge run IDs |
| GAP-03 | S3 Activation (43.x/44.x) | BLOCKER | Activation scripts do not exist |
| GAP-04 | S4 LENS Report Generator | BLOCKER | lens_report_generator.py fully hardcoded to BlueEdge |
| GAP-05 | S4 LENS Fragment Source | BLOCKER | Fragment source hardcoded; API also BlueEdge-only |
| GAP-06 | S2 Semantic Layer | BLOCKER | 41.1 embeds 17 BlueEdge domains in code |
| GAP-07 | Tier-2 Query Layer | BLOCKER | tier2_data.py has zero parameterization |
| GAP-08 | Client Registry | BLOCKER | registry has only blueedge; no registration path |
| GAP-09 | S4 GAUGE Envelope | MAJOR | envelope_adapter.py defaults to BlueEdge |
| GAP-10 | S4 Projection Runtime | MAJOR | projection_runtime.py defaults to BlueEdge run |
| GAP-11 | S4 Graph State Export | MAJOR | export_graph_state.mjs hardcoded to BlueEdge |
| GAP-12 | Pipeline Routing | MAJOR | psee/ vs pios/ paths unresolved |
| GAP-13 | Brain Emission Format | MAJOR | No concrete emission format or script |
| GAP-14 | Tenant Architecture | MAJOR | --tenant referenced but tenants/ does not exist |
| GAP-15 | API Dependency | MINOR | API_BASE localhost not configurable |
| GAP-16 | Client Template | MINOR | client_template_01 is test data, not a scaffold |
| GAP-17 | GAUGE Scoring Formula | MINOR | No standalone formula document found |
| GAP-18 | Source Validation Contract | MINOR | Minimum evidence package not defined |
| GAP-19 | psee/run_end_to_end.py | OBSERVATION | May be correct parameterized execution path |
| GAP-20 | build_evidence_vault.py | OBSERVATION | Appears parameterized; may not need changes |
| GAP-21 | RBAC / Security | OBSERVATION | Not implemented; documentation-only for this run |
| GAP-22 | Multi-Repo Scaling | OBSERVATION | Not architecturally blocked; GAP-01 covers it |

---

## Counts

- BLOCKER: 8
- MAJOR: 6
- MINOR: 4
- OBSERVATION: 4

---

## Governance Confirmation

- No runtime execution performed
- No clients/blueedge/ modifications
- No runtime artifact generation
- All findings derived from static file inspection only
