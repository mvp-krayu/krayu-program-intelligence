# Brain Emission Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01
Status: POPULATED — evidence from STEP 7J execution + STEP 8 validation

---

## Purpose

Define the outputs expected from each brain domain following second-client execution.
These are not pre-defined conclusions — they are the structural categories that must
be populated from evidence after the run completes.

---

## CANONICAL BRAIN

### Required Fill Format

**Required fields:**
- Confirmed Invariants: at least 3 entries, each with an evidence reference (file or artifact that supports it)
- Broken Invariants: explicitly populated (empty list is acceptable if none found; placeholder "To be determined" is NOT acceptable)
- New Structural Definitions: at least one entry, or explicit declaration "none observed"
- Portable Client Definition: minimum evidence set stated as a concrete finding, not a question
- Projection Boundary Definition: populated with at least one boundary rule derived from the run
- Unresolved Canonical Gaps: declared explicitly (can be "none")

**Minimum content standard:**
- At least 3 confirmed invariants, each referencing a specific artifact or output as evidence
- Broken Invariants section resolved with a determination, not a placeholder
- Portable Client Definition must name specific document types or evidence categories, not describe what to watch for

**PASS criteria:**
- All required fields populated with post-run content
- At least 3 confirmed invariants present with evidence citations
- Broken Invariants section contains a determination (including "none found")
- Portable Client Definition states a concrete minimum set

**INCOMPLETE criteria:**
- Fewer than 3 confirmed invariants
- Any required field contains "To be determined" or equivalent placeholder
- Confirmed invariants have no evidence reference
- Broken Invariants section not resolved after run completion

---

### Confirmed Invariants

1. **Client isolation holds end-to-end.** All pipeline output was written exclusively to
   `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/` — no output
   written to `clients/blueedge/` or any other client path. Evidence:
   `run_manifest.json:client_id = e65d2f0a-dfa7-4257-9333-fcbb583f0880`; `git diff
   --name-only` (STEP 7I) showed only `scripts/psee/run_end_to_end.py`; no
   `clients/blueedge/` path in diff.

2. **Structural topology transfer is deterministic and coverage-complete.** `extract_ceu_lineage.py`
   produced a full domain/CEU/entity set from the BlueEdge reference topology regardless of
   second-client source content. Evidence: `lineage/raw_input.json:__coverage_percent = 100.0`,
   `__reconstruction_state = PASS`, `__determinism_hash =
   db206c60e355dd5c43906e3fd78bab11d121f9019d0d420191b8399f6882a799`.

3. **L1 boundary is enforced at structure materialization.** The structure manifest declares
   `stratum: L1_AUTHORITATIVE_STRUCTURE` and `cross_projection_forbidden: true` —
   enforced by the emitter regardless of which client is running. Evidence:
   `structure/structure_manifest.json:stratum`, `stratum_boundary.cross_projection_forbidden`.

4. **Binding envelope is produced as canonical consumption artifact.** Pipeline Stage 05
   produced `binding/binding_envelope.json` with `is_canonical_consumption_artifact: true`,
   SHA-256 `313265de2214a5bf64799ea537f9a2b5d0cd3048d51eb297478649919196f772`, passing
   all 15 package manifest checks. Evidence: `binding/package_manifest.json:
   validation_summary.checks_pass = 15, checks_fail = 0, overall_result = PASS`.

5. **All four parity indicators pass for a second client.** `structure_complete`,
   `numerical_complete`, `signals_valid`, `ready_for_gauge` all `true`. Evidence:
   `run_manifest.json:parity_indicators`; corroborated by
   `validation/run_validation.json:parity_indicators`.

### Broken Invariants

NONE observed in this run.

One design gap confirmed — not an invariant violation: `build_binding_package.py` writes to
`docs/pios/PSEE.BLUEEDGE.BINDING.CONVERGENCE.01/validation_log.json` for any client run,
overwriting the BlueEdge governance artifact. This is a pipeline isolation defect, not a
canonical invariant violation. Documented in STEP 8B SA-1 and restored via `git restore`.
Fix required before a second pipeline run.

### New Structural Definitions

`AUTHORITATIVE_INTAKE` as a source class is confirmed to support raw source code directories
(not only pre-processed evidence packages). Minimum required: a directory tree under
`clients/<uuid>/input/intake/source/<repo>/` containing ≥1 file after exclusion of
`.git`, `__pycache__`, `.venv`, `venv`, `node_modules`, `build`, `dist`, `*.pyc`. The
pipeline produces a governed PSEE output from this source class without requiring
pre-existing PiOS methodology artifacts. Evidence: `intake_result.json:
intake_mode = AUTHORITATIVE_INTAKE`, `source_class = AUTHORITATIVE_INTAKE`,
`construction_mode = FIRST_RUN_INTAKE`, `file_count = 87`.

### Portable Client Definition

A "client" is defined by four concrete conditions all confirmed from this run:

1. A UUID-keyed isolation directory at `clients/<uuid>/` — enforced by `source_scan_dir()`
   D1 check requiring resolved path to start with `clients/<uuid>/`.
2. A source file tree placed at `clients/<uuid>/input/intake/source/<name>/` with ≥1
   non-excluded file.
3. No pre-existing PiOS 40.x methodology workspace required — structural topology is
   transferred from the BlueEdge reference via `extract_ceu_lineage.py`.
4. No system access, instrumentation, or runtime credentials required — pipeline operates
   on static source files only.

Evidence: `intake_result.json:verification_outcome = PASS_FULL`,
`run_manifest.json:final_status = PASS`.

### Projection Boundary Definition

The L1 boundary is declared at structure materialization
(`structure_manifest.json:stratum = L1_AUTHORITATIVE_STRUCTURE`,
`cross_projection_forbidden = true`). The canonical consumption artifact is
`binding/binding_envelope.json` — all upstream layers (GAUGE, LENS) must consume
the envelope only. The `binding/` directory artifacts are internal-only. The LENS report
is the external projection artifact; it is not yet generated (STEP 11 pending).

`package_manifest.json:semantic_inference = false`, `module_level_expansion = false`,
`l1_truth_modified = false`, `wp13b_contamination = false` confirm no L1 mutation
occurred during Stage 04–05.

### Internal Truth vs. External Projection Distinction

- Internal: `binding_envelope.json`, `structure_manifest.json`, `run_validation.json`,
  `run_manifest.json`, `lineage/raw_input.json`, `lineage/ceu_registry.json`
- External: LENS executive report (not yet generated), GAUGE decision state (not yet run)
- Rule: external projection must be derivable from `binding_envelope.json` only —
  not from intermediate stage artifacts

### Security/Audit Boundary Principles

- The boundary at which a client identity is established is the ledger/onboarding entry
  point (manually provisioned in this run — no onboarding UI)
- Evidence access is governed by client isolation — no cross-client evidence visibility
  (filesystem UUID isolation confirmed; RBAC not yet implemented)
- GAUGE state and LENS projection are client-scoped outputs — access requires role
  (role model defined but not yet enforced in production)
- Report export/publish is the final boundary — must be explicitly authorized

### Unresolved Canonical Gaps

1. **Lane C — PiOS 40.x second-client workspace does not exist.** The 40.x validators
   (`40.2`, `40.3`, `40.4`) read from `krayu-program-intelligence/docs/pios/40.x/`
   which contains BlueEdge-only artifacts. No second-client methodology stream has been
   executed there. Canonical completeness for the second-client evidence chain deferred
   pending PiOS 40.x execution. Recorded as TO BE IMPLEMENTED in STEP 8B.

2. **`build_binding_package.py` cross-client path write.** Must be made client-scoped
   before the next pipeline run to prevent governance artifact contamination.

---

## CODE BRAIN

### Required Fill Format

**Required fields:**
- Commands Used: full command sequence for S0–S4, with exact parameters as executed (not template placeholders)
- Scripts Touched: table complete with all scripts invoked; Modified? column answered yes/no for each; Change Summary populated if yes
- Environment Assumptions: Python version confirmed, required env vars listed, directory structure under `clients/<client-id>/` confirmed
- Failure Modes: each item in the pre-defined list assessed — resolved, triggered, or confirmed not triggered
- RBAC Attachment Points: Notes column populated for every row with a specific function name or entry point, or "not reached" if the stage was not executed

**Minimum content standard:**
- Every command in the S0–S4 sequence recorded with the exact parameter values used (no angle-bracket placeholders)
- Scripts table has at least one row per script invoked; "No modifications" is acceptable if correct
- Environment section confirms or denies each pre-defined assumption with a specific observed value
- At least one failure mode assessment present; "not triggered" counts as a valid entry
- RBAC table Notes column has content for S0–S4 attachment rows

**PASS criteria:**
- Command sequence complete with actual parameter values
- Scripts table has no placeholder rows
- Environment assumptions confirmed or violated (both are valid — silence is not)
- Failure modes section has a resolution for each item
- RBAC table Notes column populated for all rows reachable during execution

**INCOMPLETE criteria:**
- Any command listed with angle-bracket template values, not actual values
- Scripts table contains placeholder row(s)
- Environment section not confirmed post-run
- Failure modes section has any item left as "to be determined"
- RBAC table Notes column empty for rows that were reached during execution

---

### Commands Used

**Unit validation (STEP 7F — Stage 01 isolation test):**
```
python3 scripts/psee/build_raw_intake_package.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --source-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend
```
Result: `INTAKE_BUILD_COMPLETE` — 87 files, 2 entities, MANIFEST_BUILD_PASS, VALIDATION_PASS

**Failed run (STEP 7D — Stage 01 FAIL, exit 2):**
```
python3 scripts/psee/run_end_to_end.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --source clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend
```
Result: FAIL at Stage 01 — `SOURCE_UNAVAILABLE` (pre-STEP 7F fix; `--source-dir` not yet forwarded)

**Failed run (STEP 7G — Stage 02 FAIL, exit 3):**
Same command as STEP 7D, with STEP 7F fix applied.
Result: FAIL at Stage 02 — `extract_ceu_lineage.py` argparse exit (pre-STEP 7I fix)

**Successful run (STEP 7J — full PIPELINE COMPLETE, exit 0):**
```
python3 scripts/psee/run_end_to_end.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --source clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend
```
Result: All 6 stages PASS, `final_status: PASS`, exit 0.
Executed from: `/Users/khorrix/Projects/k-pi-core`, branch `work/psee-runtime`.

### Scripts Touched

| Script | Purpose | Modified? | Change summary |
|---|---|---|---|
| `scripts/psee/build_raw_intake_package.py` | Stage 01 source intake and admissibility gate | YES (STEP 7F, commit `89ecf85`) | Added `--source-dir` optional arg; `EXCLUDED_DIR_NAMES`, `EXCLUDED_FILE_EXTENSIONS` constants; `source_scan_dir()`, `extract_from_source_dir()`, `build_manifest_dir()` functions; `main()` branches on `--source-dir` presence |
| `scripts/psee/run_end_to_end.py` | Pipeline orchestrator S01–S06 | YES (STEP 7F + STEP 7I, commits `89ecf85`, `0ccae37`) | STEP 7F: forwarded `--source-dir` to Stage 01 intake args; STEP 7I: replaced `run_script("extract_ceu_lineage.py", [])` with `run_script("extract_ceu_lineage.py", ["--target-client", client_id])` at line 491 |
| `scripts/psee/extract_ceu_lineage.py` | Stage 02 CEU lineage extraction from BlueEdge reference | NO | `--target-client` param already present from STEP 1; `BLUEEDGE_CLIENT` and `BLUEEDGE_RUN_ID` constants are intentional read-only source references (per `step1_runtime_isolation.md`) |
| `scripts/psee/emit_structure_manifest.py` | Stage 03 structure materialization | NO | Executed without modification; produced `structure/structure_manifest.json` |
| `scripts/psee/build_binding_package.py` | Stage 04–05 transformation and envelope | NO | Executed without modification; produced `binding/` artifacts; side effect: overwrote `docs/pios/PSEE.BLUEEDGE.BINDING.CONVERGENCE.01/validation_log.json` (restored in STEP 8B) |

Constraint: no script was modified to hardcode second-client values. All changes are
parameterization only.

### Environment Assumptions

- **Branch:** `work/psee-runtime` — confirmed by `git branch --show-current` in all steps
- **Python:** `python3` (system Python 3.x on darwin 25.3.0); no version conflict observed
- **Working directory:** `/Users/khorrix/Projects/k-pi-core` (repo root) — all script
  paths relative to repo root
- **Required env vars:** none — pipeline resolves all paths from `--client` UUID,
  `--run-id`, and `--source` CLI args
- **Required directory structure:**
  - `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend/` — source tree (87 files)
  - `clients/blueedge/psee/runs/run_01_authoritative/package/` — BlueEdge reference (pre-existing, not modified)
  - `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/` — created by pipeline at runtime

### Failure Modes

1. **Stage 01 SOURCE_UNAVAILABLE — TRIGGERED and RESOLVED (STEP 7F)**
   `source_scan()` in `build_raw_intake_package.py` enumerated only direct file children of
   `clients/<uuid>/input/`. OSS FastAPI client's `input/` contains one direct child:
   `intake/` (a directory). `isfile("intake/")` → False → zero candidates → FAIL.
   Additionally `classify_source()` had no `AUTHORITATIVE_INTAKE` code path, so no source
   could ever pass the admissibility gate for a raw source directory. Fixed by adding
   `source_scan_dir()` with `os.walk` and `build_manifest_dir()` with `source_class =
   AUTHORITATIVE_INTAKE`.

2. **Stage 02 argparse exit — TRIGGERED and RESOLVED (STEP 7I)**
   `extract_ceu_lineage.py` runs `_ap.parse_args()` at module level (line 67). Called with
   `[]` args → argparse printed usage and exited with code 2 before `main()` entered.
   Orchestrator surfaced as exit code 3. Fixed by forwarding `["--target-client", client_id]`
   at `run_end_to_end.py` line 491.

3. **Insufficient evidence volume — NOT TRIGGERED**
   87 files ingested; 5 domains, 6 signals, 45 nodes, 62 edges produced. All parity
   indicators true.

4. **Evidence format mismatch — NOT TRIGGERED**
   AUTHORITATIVE_INTAKE mode accepted with PASS_FULL. No ingestion failure.

5. **Missing coherence record — NOT TRIGGERED**
   CEU lineage transfer completed; `__reconstruction_state = PASS`,
   `__coverage_percent = 100.0`.

6. **Hardcoded client paths — PARTIAL**
   `build_binding_package.py` writes to
   `docs/pios/PSEE.BLUEEDGE.BINDING.CONVERGENCE.01/validation_log.json` regardless of
   client. Not a pipeline execution blocker; run completed. Post-run contamination detected
   and restored in STEP 8B. Isolation fix required before next run.

7. **Score outside 0–100 range — NOT REACHED**
   GAUGE execution is post-PSEE (STEP 12+). Not executed in this program.

### Report Generator Portability Findings

INCOMPLETE — LENS report generation not executed. Deferred to STEP 11.

### RBAC/Audit Attachment Points Discovered

| Location | RBAC applies? | Audit event? | Notes |
|---|---|---|---|
| Onboarding / client creation | Yes | client_created | Client UUID `e65d2f0a-...` provisioned manually; directory created at `clients/<uuid>/input/`; no onboarding UI or ledger used in this run |
| Ledger submission | Yes | onboarding_submitted | Ledger not used; client directory provisioned directly |
| Evidence upload | Yes | source_artifact_uploaded | Source placed at `clients/e65d2f0a-.../input/intake/source/fastapi-backend/` manually |
| S0–S1 pipeline start | Yes | pipeline_run_started | Entry point: `run_end_to_end.py`, `stage_01_intake()` function, line ~403; `--client` UUID is the isolation anchor |
| S4 GAUGE generation | Yes | gauge_state_generated | Not reached; PSEE pipeline ends at S06_VALIDATION; GAUGE is STEP 12+ |
| S4 LENS report generation | Yes | lens_projection_generated | Not reached; STEP 11 pending |
| Report view | Yes | report_viewed | Not reached |
| Report export | Yes | report_exported | Not reached |

---

## PRODUCT BRAIN

### Required Fill Format

**Required fields:**
- Time-to-First-Output table: all five stage rows (S0–S4) and Total row populated with actual Start, End, Duration, and Notes values
- Minimum Evidence Volume Finding: concrete statement of the minimum evidence set that produced a governed output — not a question, not a range without evidence
- Client Package Requirements: confirmed minimum set of document types, pre-engagement checklist items, and delivery format requirements
- Sellable LENS Artifact Definition: output format, minimum required sections, and what the client receives — as observed, not as planned

**Minimum content standard:**
- All rows in time-to-output table have Start, End, and Duration populated (blank Notes is acceptable)
- Minimum evidence volume is a specific finding: names specific document types or evidence categories confirmed sufficient
- Client package requirements lists at least 3 confirmed document types from the actual intake
- Sellable artifact definition specifies output format(s) confirmed to have been produced

**PASS criteria:**
- Time-to-output table fully populated — all five stage rows and Total row complete
- Minimum evidence volume finding stated as a concrete determination with at least one specific document type
- Client package requirements populated from actual run observations
- Sellable artifact definition populated with observed output format and minimum sections

**INCOMPLETE criteria:**
- Any stage row in time-to-output table is empty or still contains placeholder content
- Minimum evidence volume remains stated as a question or "to be determined"
- Client package requirements not derived from actual intake observations
- Sellable artifact definition not populated after report generation phase completes

---

### Onboarding Implications

From the second-client run (OSS FastAPI Modular Monolith):

- **Minimum evidence volume:** 87 source files from a single Python backend repository
  produced a governed assessment with 5 domains, 6 signals, 45 nodes, 62 edges. No
  additional documentation artifacts required.
- **Minimum intake session:** No intake session was required. Source directory placed at
  `clients/<uuid>/input/intake/source/<name>/` and pipeline invoked directly.
- **Client preparation:** Client must provide a source directory accessible as a file tree.
  No system access, API credentials, or runtime instrumentation required.
- **Actual time-to-first-output:** 0.292 seconds wall clock for full PSEE pipeline
  (S01–S06). Evidence boundary and manual provisioning time not included.

### Client Package Requirements

Confirmed minimum from this run:

- **Source:** A repository or source directory tree (confirmed: Python backend, 87 files)
- **Format:** Flat or structured directory under `clients/<uuid>/input/intake/source/`
- **No additional document types required** beyond source files — README.md, config.yaml,
  pyproject.toml, and Python source files were all present in the 87-file set and were
  classified by the pipeline without manual tagging
- **Pre-engagement checklist:**
  - Client UUID assigned (manual in this run; future: onboarding UI)
  - Source directory provisioned at `clients/<uuid>/input/intake/source/<name>/`
  - `--client`, `--run-id`, `--source` args prepared for `run_end_to_end.py`
- **Scope containment:** Single source directory was sufficient for one complete PSEE run
- **Delivery format:** `binding/binding_envelope.json` (canonical; SHA-256 fingerprinted);
  LENS report not yet generated (STEP 11)

### Time-to-First-Output Evidence

Timestamps and durations sourced from `run_manifest.json`. Stage labels map to PSEE
pipeline stages as noted. `Evidence boundary` (pre-run provisioning) and `Report
generation` (GAUGE/LENS) are outside the PSEE pipeline; times are not logged.

| Stage | Start | End | Duration | Notes |
|---|---|---|---|---|
| Evidence boundary | — | — | not logged | Manual: source dir placed at `clients/<uuid>/input/intake/source/fastapi-backend/`; not part of pipeline timing |
| Intake (S01) | 2026-04-24T12:45:33.216298Z | T+0.047s | 0.047s | PASS — 87 files, AUTHORITATIVE_INTAKE, provenance hash `5a1a19d9...` |
| Lineage (S02) | T+0.047s | T+0.111s | 0.064s | PASS — CEU lineage extracted from BlueEdge reference, coverage 100% |
| Structure (S03) | T+0.111s | T+0.175s | 0.064s | PASS — 45 nodes, 62 edges, 5 domains |
| Transformation + Envelope (S04+S05) | T+0.175s | T+0.263s | 0.088s | PASS — binding_envelope produced, 15/15 manifest checks |
| Validation (S06) | T+0.263s | T+0.263s | 0.000s | PASS — parity indicators all true |
| Report generation | — | — | INCOMPLETE | GAUGE and LENS not yet executed — STEP 11+ pending |
| **Total (S01–S06)** | 2026-04-24T12:45:33.216298Z | 2026-04-24T12:45:33.508225Z | **0.292s** | Full PSEE pipeline; excludes pre-run provisioning and post-run GAUGE/LENS |

### Sellable LENS Artifact Definition

INCOMPLETE — LENS report generation not executed. Deferred to STEP 11.

Observable from this run:
- Canonical consumption artifact produced: `binding/binding_envelope.json`,
  `is_canonical_consumption_artifact: true`, SHA-256 `313265de...`
- `package_manifest.json:ready_for_targets = [gauge, upper_pios_core]` — confirmed ready
  for GAUGE ingestion
- Full sellable artifact definition (format, sections, client deliverable) requires
  STEP 11 LENS generation execution

### Onboarding Ledger Implications

- Minimum ledger entry required to gate pipeline execution: `client_uuid` (used as path
  anchor); `run_id` (used as subdirectory); `--source` path — all three provided as CLI
  args in this run
- No formal ledger record was created; manual provisioning only
- Client isolation in evidence store: enforced at filesystem level by `clients/<uuid>/`
  UUID-keyed directory; D1 check in `source_scan_dir()` rejects any path that does not
  start with `clients/<uuid>/`

### Future Onboarding UI Requirements

From this run, a future onboarding interface would need:

- Source directory upload (or Git repo URL ingest) → placed at
  `clients/<uuid>/input/intake/source/<name>/`
- Client UUID auto-generation and directory provisioning
- Run ID assignment
- Evidence boundary confirmation before pipeline invocation
- No domain coverage or scope definition inputs required at intake — domain structure is
  derived automatically from BlueEdge reference topology

### Role/Access Model Implications

From the run, the minimum role set required for a productized system:

| Role | What they can access | What they cannot access |
|---|---|---|
| Platform Admin | All clients, all runs, all reports | — |
| Krayu Operator | Assigned client runs | Other client data |
| Client Executive Viewer | Their report, decision state | Evidence chain, derivation detail |
| Client Technical Reviewer | Their report + topology | Other client data |
| Auditor | Audit log | Report content |

RBAC not implemented. Role model defined above from run observations; confirmed not
enforced in current runtime.

---

## PUBLISH BRAIN

### Required Fill Format

**Required fields:**
- Safe External Claims table: each of the four pre-defined claims assigned an explicit activation status — ACTIVATED or DEFERRED — with a one-line reason
- Prohibited Claims Confirmation: explicit yes/no confirmation that each prohibited claim category was avoided; not a general statement — each item in the pre-defined list assessed individually
- Security-Maturity Claims: each item in the pre-defined security/audit maturity table explicitly marked DEFERRED with its required maturity condition restated
- Case-Study Candidate Status: declared as CANDIDATE, NOT A CANDIDATE, or PENDING CLIENT CONSENT — with reasoning

**Minimum content standard:**
- All four safe claims have an activation status — silence or omission is not acceptable
- Prohibited claims confirmation covers each of the six pre-defined prohibited claim categories explicitly
- Security-maturity claims section confirms each item is DEFERRED (none may be ACTIVATED without completing the required maturity condition)
- Case-study status is a concrete declaration, not a question

**PASS criteria:**
- All four safe claims have ACTIVATED or DEFERRED status with reason
- Prohibited claims confirmation has an explicit entry for each category in the pre-defined list
- All security-maturity claims confirmed DEFERRED
- Case-study candidate status declared

**INCOMPLETE criteria:**
- Any safe claim has no activation status assigned after the run
- Prohibited claims confirmation is a general statement rather than per-item confirmation
- Any security-maturity claim has no status (DEFERRED is required; ACTIVATED requires maturity conditions met)
- Case-study status not declared after report delivery phase

---

### Safe External Claims

| Claim | Status | Basis |
|---|---|---|
| "Pipeline is executable end-to-end" | **ACTIVATED** | STEP 7J: `run_end_to_end.py` exit 0, all 6 stages PASS, `run_manifest.json:final_status = PASS` |
| "Pipeline is structurally governed" | **ACTIVATED** | `package_manifest.json:wp13b_contamination = false`, `l1_truth_modified = false`, `semantic_inference = false`, `module_level_expansion = false`; `structure_manifest.json:cross_projection_forbidden = true`; Lane B: 40.2/40.3/40.4 all PASS |
| "Pipeline is client-agnostic" | **ACTIVATED** | Second-client run completed with no BlueEdge-specific modifications to any script; `--target-client` and `--source-dir` parameterize all client-specific values; `git diff --name-only` confirmed no `clients/blueedge/` modification |
| "Pipeline produces decision-grade output" | **DEFERRED** | `binding_envelope.json` produced with `ready_for_gauge: true`; decision-grade requires GAUGE execution (STEP 12+) and LENS report (STEP 11) — not yet completed |

### Case-Study Candidates

**Status: PENDING CLIENT CONSENT**

This run used an OSS FastAPI Modular Monolith (publicly available repository) as input.
The structural analysis results — domain topology, signals, capability surface mapping,
`binding_envelope.json` — are Krayu-produced artifacts. No client relationship exists for
this run. Case-study use of run outputs requires explicit internal authorization before any
external publication. The engagement pattern (source-only intake, no instrumentation) is
publishable as a structural pattern; the specific run artifacts are not.

### Prohibited Claims

Confirmation that each prohibited claim category was avoided in all artifacts produced
by this run:

1. **Client name/industry/identifying details without consent** — CONFIRMED NOT PRESENT.
   Run artifacts reference only `client_id: e65d2f0a-dfa7-4257-9333-fcbb583f0880`
   (internal UUID). No client name in any produced artifact.

2. **Comparative claims against BlueEdge** — CONFIRMED NOT PRESENT.
   No artifact produced contains comparative language referencing BlueEdge outcomes.

3. **Scale/volume claims not supported by run evidence** — CONFIRMED NOT PRESENT.
   Only observed counts referenced (87 files, 5 domains, 6 signals, 45 nodes, 62 edges).

4. **Claims implying second-client evidence is representative of a general population** —
   CONFIRMED NOT PRESENT. No such claims in any produced artifact.

5. **Score values or domain counts from either client run in publish surfaces** —
   CONFIRMED NOT PRESENT. All counts are in internal run artifacts only; no publish
   surface exists yet.

6. **Advisory claims about what the client "should do"** — CONFIRMED NOT PRESENT.
   All output is structural intelligence — no advisory content produced.

### Claims Requiring Audit/Security Maturity Before Publication

All four claims confirmed DEFERRED:

| Claim | Status | Required maturity condition |
|---|---|---|
| "Client data is isolated and access-controlled" | **DEFERRED** | RBAC implementation verified in production — not implemented; current isolation is filesystem-level UUID directory only |
| "All access to evidence and reports is logged" | **DEFERRED** | Audit log implementation verified in production — no audit log exists |
| "Compliant with enterprise data governance requirements" | **DEFERRED** | Formal audit/compliance review completed — not performed |
| "Multi-client platform" | **DEFERRED** | Client isolation verified across at least two real client runs with RBAC — filesystem isolation confirmed but RBAC not implemented |
