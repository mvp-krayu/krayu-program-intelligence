# Final Execution Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.EXECUTION-PLAN.01
Branch: feature/second-client-kill-plan-01
Date: 2026-04-24
Status: CONSOLIDATED — supersedes execution_readiness_plan.md for planning purposes
Inputs: gap_assessment_report.md, execution_readiness_plan.md

---

## 1. EXECUTION AUTHORITY

### Architectural Declaration

**PiOS** is the canonical methodology. It defines the layer model (L0–L4), stage sequence (S0–S4), evidence governance rules, and validation criteria. PiOS does not define runtime implementation. PiOS artifacts (docs/pios/40.x, docs/pios/41.x, scripts/pios/40.x validators) are methodology documentation and compliance validators — they are not the production execution path.

**PSEE** is the validated runtime implementation. It is the authoritative execution path for second-client production runs. The PSEE pipeline (`scripts/psee/run_end_to_end.py`) is parameterized for any client and any source path. PSEE is validated up to 40.5 (signal artifact derivation); the TRANSFORMATION and ENVELOPE stages cover S3 and S4 activation.

**Second-client run targets PSEE.** All execution commands in this plan invoke PSEE scripts. PiOS validators are invoked after PSEE execution to confirm stage compliance — they do not drive the execution.

### Stage → Runtime Mapping

| PiOS Stage | PiOS Definition | PSEE Implementation |
|---|---|---|
| S0 — Evidence Boundary | Ledger Selector + intake record | `pios ledger create` + `pios intake create` |
| S1 — Ingestion (L1) | 40.2 → 40.4 | PSEE INTAKE + LINEAGE stages |
| S2 — Core Derivation (L2–L4) | Navigation, derivation, semantic shaping | PSEE STRUCTURE + TRANSFORMATION stages |
| S3 — Activation (L5) | 43.x / 44.x binding + projection | PSEE TRANSFORMATION + ENVELOPE stages |
| S4 — Runtime / Report | GAUGE state + LENS projection | PSEE ENVELOPE + VALIDATION + `lens_report_generator.py` |

**Validation requirement:** After PSEE execution produces package artifacts, PiOS validators must be invoked with second-client run IDs (not BlueEdge IDs) to confirm structural compliance per the validation matrix.

### Resolution of Previously Open Questions

The PiOS/PSEE architectural clarification resolves the following items from the gap assessment:

- **GAP-12 resolved:** `scripts/psee/run_end_to_end.py` is the authoritative production execution path.
- **GAP-01 downgraded (methodology only):** `scripts/pios/40.2/build_evidence_inventory.py` is a PiOS methodology validator, not the PSEE intake mechanism. PSEE intake is parameterized.
- **GAP-03 resolved:** S3 activation is covered by PSEE TRANSFORMATION/ENVELOPE stages. No 43.x/44.x scripts are required before execution.

---

## 2. CONSOLIDATED BLOCKERS

Eight blockers from the gap assessment collapse into five root blockers after the PiOS/PSEE clarification.

---

### ROOT BLOCKER 1 — LENS Projection Layer Hardcoded to BlueEdge

LENS cannot produce a second-client report in its current state. Every script in the LENS output chain reads from BlueEdge-specific paths and embeds BlueEdge-specific content.

**Impacted layers:** S4 — LENS projection, GAUGE portability, Tier-2 diagnostic projection

**Linked GAP IDs:** GAP-04, GAP-05, GAP-07, GAP-11, GAP-15

**Evidence:**
- `scripts/pios/lens_report_generator.py` lines 44, 50–55: `LENS_CLAIMS`, `FRAGMENTS_DIR`, `REPORTS_DIR`, `CANONICAL_PKG_DIR` all point to `clients/blueedge/...`
- `scripts/pios/lens_report_generator.py` lines 731–755: 17 domains, 42 capabilities, 89 components embedded as constants
- `scripts/pios/tier2_data.py` lines 18–25: `CANONICAL_PKG_DIR`, `FOCUS_DOMAIN`, `RUN_ID` all hardcoded to BlueEdge
- `scripts/pios/export_graph_state.mjs` lines 28–35: BlueEdge vault path hardcoded as input and output
- `scripts/pios/lens_report_generator.py` line 46: `API_BASE = "http://localhost:3000"` not configurable

**Derived issues (grouped under ROOT-01):**
- GAP-05: Fragment source path hardcoded
- GAP-07: Tier-2 data module not parameterized
- GAP-11: Graph state export not parameterized
- GAP-15: API base not configurable

---

### ROOT BLOCKER 2 — Second-Client Identity Not Established

No second client exists in the system. Without a registered client UUID, directory scaffold, and ledger entry, no PSEE run can start.

**Impacted layers:** S0 — Evidence Boundary (all downstream stages blocked)

**Linked GAP IDs:** GAP-08, GAP-14, GAP-16

**Evidence:**
- `clients/registry/client_index.json` lines 1–12: single entry for `blueedge`, `lifecycle_state: ACTIVE`
- `scripts/pios/pios.py` lines 11, 19, 23: `--tenant` parameter used in IG and structural commands; `tenants/` directory does not exist
- `clients/client_template_01/`: partial coverage (22/30 units), not documented as onboarding scaffold

---

### ROOT BLOCKER 3 — Runtime Components Default to BlueEdge

Two runtime components — the GAUGE envelope adapter and the projection runtime — have BlueEdge-specific defaults that will silently produce BlueEdge output if callers omit explicit parameters.

**Impacted layers:** S4 — GAUGE portability, LENS projection

**Linked GAP IDs:** GAP-09, GAP-10

**Evidence:**
- `app/execlens-demo/lib/gauge/envelope_adapter.py` lines 36–42: default `client_uuid = "1de0d815-0721-58e9-bc8d-ca83e70fa903"`, default `run_id = "run_335c0575a080"`
- `scripts/pios/projection_runtime.py` line 52: `run_id: str = "run_authoritative_recomputed_01"`

---

### ROOT BLOCKER 4 — PiOS Validation Layer Cannot Validate PSEE Second-Client Runs

PiOS validation scripts (40.2–40.8) hardcode BlueEdge run IDs as pass criteria. The validation matrix requires PiOS-layer validation to pass. Without parameterized validators, no second-client run can be confirmed compliant at the PiOS stage boundary.

**Impacted layers:** S1–S2 validation gates; validation matrix groups 1, 2, 3

**Linked GAP IDs:** GAP-02, GAP-06 (partial)

**Evidence:**
- `scripts/pios/40.2/validate_evidence_inventory.py`: checks for `"run_02_blueedge"`
- `scripts/pios/40.3/validate_reconstruction.py`: checks for `"run_02_blueedge"`
- `scripts/pios/40.4/validate_structure_immutability.py`: `EXPECTED_40_3_RUN_ID = "run_02_blueedge"`
- `scripts/pios/41.1/build_semantic_layer.py` line 34: `RUN_REFERENCE = "run_03_blueedge_derivation_validation"` (methodology artifact; must be updated to reference second-client run in post-run documentation)
- Approximately 15 validators across 40.2–40.8 affected

---

### ROOT BLOCKER 5 — Brain Emission Has No Concrete Fill Format

The brain emission plan defines structural categories but provides no fill template. Without a concrete format, brain emissions cannot be verified against validation matrix group 6 criteria. The run cannot reach COMPLETE status.

**Impacted layers:** Post-run — Validation matrix group 6 (Brain Emission Completeness)

**Linked GAP IDs:** GAP-13

**Evidence:**
- `docs/programs/second-client-kill-plan-01/brain_emission_plan.md`: all CODE, PRODUCT, PUBLISH sections marked "To be populated post-run" with no schema or required field structure
- No emission script exists in any `scripts/` directory
- No brain branch content was verified during assessment

---

## 3. REMEDIATION PLAN (STRICT ORDER)

The following is a linear execution sequence. No step may be skipped. No step may be reordered.

---

**STEP 1**
Action: Assign second-client identity and register client
Why: ROOT BLOCKER 2 — no second-client UUID exists; no run can begin without registry entry
Affected files:
- `clients/registry/client_index.json` — add new entry with UUID and business_client_id
- Create `clients/<new-client-id>/psee/config/runtime_profile.json` (initially empty)
- Create `clients/<new-client-id>/` directory scaffold matching `clients/client_template_01/` structure
Expected outcome: Second client is registered and addressable by all PSEE commands via `--client <uuid>`

---

**STEP 2**
Action: Remove BlueEdge defaults from GAUGE envelope adapter and projection runtime
Why: ROOT BLOCKER 3 — silent contamination risk if defaults remain
Affected files:
- `app/execlens-demo/lib/gauge/envelope_adapter.py` lines 36–42: remove default client UUID and run ID; require explicit parameters
- `scripts/pios/projection_runtime.py` line 52: remove `= "run_authoritative_recomputed_01"` default; require caller to supply run_id explicitly
Expected outcome: No BlueEdge value is consumed if explicit parameters are provided; any call omitting parameters fails explicitly rather than silently using BlueEdge data

---

**STEP 3**
Action: Parameterize PiOS validation scripts to accept second-client run IDs
Why: ROOT BLOCKER 4 — validators will reject any non-BlueEdge run ID
Affected files: All affected validators in `scripts/pios/40.2/`, `40.3/`, `40.4/` — add `--expected-run-id <id>` CLI argument or read expected run ID from the run's `intake_record.json`. Do not change validator logic, only the run ID comparison target.
Expected outcome: PiOS validators can be invoked with second-client run ID and confirm structural compliance of PSEE outputs

---

**STEP 4**
Action: Parameterize `lens_report_generator.py` — client, run, paths, and topology
Why: ROOT BLOCKER 1 — LENS generator is the primary LENS output mechanism; must not contain BlueEdge content
Affected files:
- `scripts/pios/lens_report_generator.py`:
  - Add `--client <id>` and `--run-id <id>` CLI arguments
  - Derive `FRAGMENTS_DIR`, `REPORTS_DIR`, `CANONICAL_PKG_DIR` from `--client` and `--run-id` at runtime
  - Add `--api-base <url>` argument (default: attempt API, fall back to fragments)
  - Remove hardcoded `LENS_CLAIMS` list; derive from canonical package or accept `--claims` argument
  - Remove hardcoded domain counts (17/42/89) and cluster names; read from `canonical_topology.json` in CANONICAL_PKG_DIR at runtime
Expected outcome: `lens_report_generator.py` produces a report containing zero BlueEdge paths, labels, or domain names when invoked with second-client parameters

---

**STEP 5**
Action: Parameterize `tier2_data.py` and downstream Tier-2 query engine
Why: ROOT BLOCKER 1 — Tier-2 projection cannot serve second-client data
Affected files:
- `scripts/pios/tier2_data.py`: replace module-level constants with constructor parameters for `client_id`, `run_id`, `focus_domain`; derive `CANONICAL_PKG_DIR` from parameters
- `scripts/pios/tier2_query_engine.py`: update all callers to pass parameters; no logic change
Expected outcome: `tier2_data.py` can load topology, signals, and GAUGE state from any parameterized client/run package directory

---

**STEP 6**
Action: Parameterize `export_graph_state.mjs`
Why: ROOT BLOCKER 1 — graph state export is a required Tier-2 LENS artifact
Affected files:
- `scripts/pios/export_graph_state.mjs`: add `--client <id>`, `--run-id <id>`, `--output <path>` arguments; derive vault index path from parameters
Expected outcome: Graph state JSON is generated for second-client vault and written to second-client reports directory

---

**STEP 7**
Action: Define brain emission fill template
Why: ROOT BLOCKER 5 — validation matrix group 6 cannot be confirmed without explicit section structure
Affected files:
- `docs/programs/second-client-kill-plan-01/brain_emission_plan.md`: add a "Required Fill Format" section at the top of each brain domain defining exactly which fields must be populated, in what format, with what minimum content, for a PASS verdict
Expected outcome: Brain emission plan has explicit PASS criteria per brain domain; post-run fill-in can be verified against the criteria

---

**STEP 8**
Action: Stage second-client evidence and execute PSEE pipeline
Why: Prerequisite for all S1–S4 outputs
Affected files/commands:
```
python3 scripts/pios/pios.py intake create \
    --source-path <evidence-path> \
    --tenant <new-client-id> \
    --intake-id <intake-id>

python3 scripts/pios/pios.py ledger create \
    --run-id <new-run-id> \
    --client <new-client-id> \
    --source-version <intake-id>

python3 scripts/psee/run_end_to_end.py \
    --client <new-client-uuid> \
    --source <evidence-path> \
    --run-id <new-run-id> \
    --target gauge
```
Expected outcome: PSEE pipeline completes to VALIDATION stage with exit code 0; `clients/<new-client-id>/psee/runs/<new-run-id>/package/` exists and contains all required artifacts (gauge_state.json, coverage_state.json, reconstruction_state.json, canonical_topology.json, signal_registry.json)

---

**STEP 9**
Action: Run PiOS validators against PSEE outputs (with parameterized run IDs)
Why: ROOT BLOCKER 4 — PiOS compliance must be confirmed for validation matrix groups 1–3
Commands: Invoke validators from `scripts/pios/40.2/`, `40.3/`, `40.4/` with `--expected-run-id <new-run-id>` (enabled by STEP 3)
Expected outcome: All PiOS S1–S2 validators PASS; validation matrix groups 1, 2, 3 confirmed

---

**STEP 10**
Action: Build second-client evidence vault
Why: Prerequisite for fragment generation and LENS report
Affected files/commands:
```
python3 scripts/psee/build_evidence_vault.py \
    --client <new-client-id> \
    --run <new-run-id> \
    --output-dir clients/<new-client-id>/vaults/run_01_authoritative_generated \
    --client-name "<second-client-display-name>"
```
Expected outcome: Evidence vault produced; `clients/<new-client-id>/vaults/run_01_authoritative_generated/claims/fragments/` populated with ZONE-2-L1 fragment files

---

**STEP 11**
Action: Export projection fragments and graph state
Why: ROOT BLOCKER 1 — LENS generator requires pre-generated fragments; Tier-2 requires graph state
Commands:
```
python3 scripts/pios/projection_runtime.py \
    export_fragments \
    --run-id <new-run-id> \
    --vault-path clients/<new-client-id>/vaults/run_01_authoritative_generated \
    --output-dir clients/<new-client-id>/vaults/run_01_authoritative_generated/claims/fragments

node scripts/pios/export_graph_state.mjs \
    --client <new-client-id> \
    --run-id <new-run-id> \
    --output clients/<new-client-id>/reports/tier2/graph_state.json
```
Expected outcome: Fragment files present; graph state JSON generated from second-client vault topology

---

**STEP 12**
Action: Generate LENS report for second client
Why: ROOT BLOCKER 1 — LENS report is the terminal sellable artifact
Command (enabled by STEP 4):
```
python3 scripts/pios/lens_report_generator.py \
    --client <new-client-id> \
    --run-id <new-run-id> \
    --fragments-dir clients/<new-client-id>/vaults/run_01_authoritative_generated/claims/fragments \
    --output-dir clients/<new-client-id>/reports/
```
Expected outcome: LENS report HTML produced in second-client reports directory; zero BlueEdge references in output (confirmed by grep)

---

**STEP 13**
Action: Validate LENS projection portability
Why: Validation matrix group 7 requires zero BlueEdge content in LENS output
Commands:
```
grep -i "blueedge" clients/<new-client-id>/reports/*.html
grep -i "run_authoritative_recomputed_01" clients/<new-client-id>/reports/*.html
grep -i "domain-10\|Fleet Operations\|Edge Data Acquisition" clients/<new-client-id>/reports/*.html
```
Expected outcome: All three commands return zero matches

---

**STEP 14**
Action: Populate brain emissions from run artifacts
Why: ROOT BLOCKER 5 — validation matrix group 6 requires all four brain domains populated
Affected files: `docs/programs/second-client-kill-plan-01/brain_emission_plan.md`
Process: Fill all required sections (defined in STEP 7) from observed run evidence. Record RBAC/audit attachment points discovered during execution in CODE BRAIN table.
Expected outcome: All four brain domains (CANONICAL, CODE, PRODUCT, PUBLISH) populated; each section explicitly marked PASS or INCOMPLETE

---

**STEP 15**
Action: Run full validation matrix
Why: Final gate before declaring run authoritative
Process: Work through all 7 criteria groups in `docs/programs/second-client-kill-plan-01/validation_matrix.md` line by line; mark each check PASS or FAIL with evidence
Expected outcome: All 7 groups reach ALL PASS; run declared authoritative; BASELINE_LOCK written

---

## 4. MINIMUM VIABLE EXECUTION PATH

This is the narrowest path that can produce a PASS on all 7 validation matrix groups.

### Prerequisites

1. Steps 1–7 complete (client registered; BlueEdge defaults removed; validators parameterized; LENS generator parameterized; tier2_data parameterized; graph export parameterized; brain emission template defined)
2. Second-client evidence staged at a local path (real evidence — no synthetic data)
3. Code tag for PSEE runtime recorded (for deterministic rerun readiness)
4. Python environment confirmed (version, dependencies)

### Execution Path (PSEE-based)

```
[S0]  pios intake create + pios ledger create
[S1]  psee/run_end_to_end.py (INTAKE + LINEAGE stages)
[S2]  psee/run_end_to_end.py (STRUCTURE stage)
[S3]  psee/run_end_to_end.py (TRANSFORMATION + ENVELOPE stages)
[S4a] psee/run_end_to_end.py --target gauge (VALIDATION stage → gauge_state.json)
[S4b] psee/build_evidence_vault.py (vault generation)
[S4c] projection_runtime.py export_fragments (fragment generation)
[S4d] lens_report_generator.py --client --run-id (LENS report)
[V]   PiOS validators + validation_matrix.md manual pass/fail
[B]   brain_emission_plan.md population
```

### Validation Checkpoints

| Checkpoint | Condition | Validator |
|---|---|---|
| CP-1: S0 complete | `intake_record.json` present; no BlueEdge source references | Manual + grep |
| CP-2: S1 complete | PSEE LINEAGE exit code 0; coverage_state.json present | PSEE exit code |
| CP-3: S2 complete | canonical_topology.json present; domain count > 0 | Manual |
| CP-4: S3 complete | signal_registry.json present; binding outputs present | Manual |
| CP-5: S4 GAUGE | gauge_state.json present; score in 0–100 range; decision state present | Manual |
| CP-6: S4 LENS | Report HTML present; zero BlueEdge references | grep commands (STEP 13) |
| CP-7: Validation matrix | All 7 groups ALL PASS | validation_matrix.md |
| CP-8: Brain emissions | All 4 brain domains populated per template | brain_emission_plan.md |

### Explicit PASS Criteria

A run is authoritative when ALL of the following are true:

1. PSEE pipeline exits at code 0
2. All required package artifacts present in `clients/<new-client-id>/psee/runs/<new-run-id>/package/`
3. PiOS validators for 40.2–40.4 PASS with second-client run ID
4. LENS report HTML contains zero occurrences of "blueedge", BlueEdge run IDs, or BlueEdge domain names
5. GAUGE score is in 0–100 range; decision state is PROCEED / INVESTIGATE / ESCALATE
6. All 7 validation matrix criteria groups reach ALL PASS
7. All four brain domains populated with at least minimum required fields
8. BASELINE_LOCK written to `clients/<new-client-id>/psee/runs/<new-run-id>/BASELINE_LOCK`

---

## 5. DEFERRED ITEMS

The following are NOT required before the first second-client run and are safe to defer.

| Item | Basis for deferral |
|---|---|
| RBAC implementation | Validation matrix group 7 requires documentation of attachment points only, not implementation. Architecture documentation is the deliverable for this run. |
| Audit log implementation | Same basis as RBAC. |
| Onboarding UI | No UI is required for the run. The engagement is operator-executed. Future onboarding UI is a PRODUCT brain emission output, not a run prerequisite. |
| GAUGE scoring formula standalone document (GAP-17) | Scoring behavior is observable from run output. The formula not being in a single document does not prevent execution or validation. |
| Tier-2 graph panel in commercial briefs (docs/commercial/) | Commercial brief HTML is a sales artifact. It is not part of the validation matrix. BlueEdge graph state in commercial briefs is a cosmetic issue, not a validation blocker. |
| Multi-repo source scaling (GAP-22) | The second-client run uses a single source. Multi-source intake is architecturally supported; no structural change needed. |
| Brain emission automation script (GAP-13 partial) | Manual fill is sufficient for the first run. Automation is a productization improvement, not a gate. |
| 41.1 semantic layer rebuild for second client (GAP-06) | The PSEE runtime derives canonical topology from evidence at runtime. The docs/pios/41.1/ artifacts are PiOS methodology documentation for BlueEdge. They do not need to be regenerated before the second-client run. Post-run, the CODE brain emission documents what changed. |
| client_template_01 promotion to scaffold (GAP-16) | Directory scaffold is created manually in STEP 1. Formal template promotion is a process improvement, not a gate. |

---

## 6. RISK REGISTER

**RISK-01: PSEE pipeline fails on second-client evidence structure**
Trigger: Second-client evidence has a format or volume that the PSEE intake/lineage stages do not handle (missing file types, unexpected directory structure, insufficient domain signal coverage)
Mitigation: Before staging evidence, confirm that the evidence set passes the intake validation check from PRODUCTIZE.RAW.SOURCE.INTAKE.01 (source type detection, file hash manifest generation). Run PSEE with `--fail-on-warning true` to surface all anomalies before reaching the GAUGE stage.

**RISK-02: LENS report contains BlueEdge content after parameterization**
Trigger: A template string, embedded constant, or default value in `lens_report_generator.py` was not parameterized in STEP 4; post-STEP-12 grep finds a match
Mitigation: After STEP 4, run the grep validation (STEP 13) against the BlueEdge report first — use it as a baseline of what BlueEdge references look like. Then run against the second-client report to confirm zero overlap. Any match is a hard stop — the run is not authoritative until clean.

**RISK-03: GAUGE produces score outside 0–100 or no decision state**
Trigger: Second-client canonical derivation is insufficient (too few domains, too few signals, evidence volume below threshold) to produce a valid GAUGE score
Mitigation: After S2, inspect `canonical_topology.json` domain count before proceeding to GAUGE. If domain count is below the coverage floor, stop and escalate — do not proceed to S4 with insufficient evidence. Record this as a PRODUCT brain emission finding (minimum evidence volume).

**RISK-04: PiOS validator parameterization introduces logic divergence**
Trigger: In STEP 3, modifying validator scripts to accept `--expected-run-id` inadvertently changes validation logic rather than only the comparison target
Mitigation: The change to validators in STEP 3 must be scoped strictly to: accept a new CLI argument for the expected run ID. All other validator logic (what it checks, how it checks) must remain unchanged. Validate by running the modified validator against the BlueEdge run with `--expected-run-id run_02_blueedge` — it must still PASS.

**RISK-05: Brain emissions are incomplete or contain inference**
Trigger: Post-run fill-in of brain_emission_plan.md introduces claims not directly traceable to observed run artifacts (inference, forward projection, advisory language)
Mitigation: CANONICAL brain — state only observed invariants; mark any uncertain invariant as "unconfirmed." CODE brain — record only commands actually executed and files actually modified. PRODUCT brain — record only observed timings and evidence volumes. PUBLISH brain — mark all claims with their activation condition; leave unactivated claims blank.

---

## 7. OPEN DECISIONS

The PiOS/PSEE architectural clarification resolved GAP-12, GAP-01 (as methodology-only), and GAP-03. The following decisions remain unresolved because they require information external to the repository:

**DECISION-01: Second-client business_client_id and UUID**
Required for: STEP 1 (client registration), all downstream commands
What is needed: A codename or anonymized identifier for the client and a newly generated UUID

**DECISION-02: Tenant parameter mapping**
Required for: STEP 8 (`pios ig materialize --tenant`)
What is needed: Confirm whether `--tenant` is synonymous with `--client` UUID in the current PSEE runtime, or whether a separate tenant directory is required. If synonymous, use the client UUID for both parameters.

**DECISION-03: Second-client evidence package**
Required for: STEP 8 (source path)
What is needed: Path to staged second-client evidence; confirmation of source type (local directory / git repository); minimum file count and domain signal coverage estimate

If DECISION-01, DECISION-02, and DECISION-03 are resolved, there are no remaining architectural or technical decisions blocking execution. All other open questions from execution_readiness_plan.md (OQ-01, OQ-04) are resolved by the PiOS/PSEE clarification or by this plan.
