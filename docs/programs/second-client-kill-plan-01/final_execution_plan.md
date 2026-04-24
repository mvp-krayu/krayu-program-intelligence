# Final Execution Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.EXECUTION-PLAN.01
Branch: feature/second-client-kill-plan-01
Date: 2026-04-24
Status: AMENDED — 4-Brain governance enforcement + formal brain gating + intake selector abstraction + PRE-GATE viability check applied
Inputs: gap_assessment_report.md, execution_readiness_plan.md
Amendment 1: PI.PRODUCTIZATION.SECOND-CLIENT.EXECUTION-PLAN.01 — 4-Brain Amendment
Amendment 2: PI.PRODUCTIZATION.SECOND-CLIENT.EXECUTION-PLAN.01 — Brain Gating Amendment
Amendment 3: PI.PRODUCTIZATION.SECOND-CLIENT.EXECUTION-PLAN.01 — Intake Selector / A3S Source Abstraction
Amendment 4: PI.PRODUCTIZATION.SECOND-CLIENT.EXECUTION-PLAN.01 — PRE-GATE Intake Viability Check

---

> **GLOBAL RULE**
>
> All execution steps must be governed by the 4-Brain system.
> No action may occur outside CANONICAL, CODE, PRODUCT, or PUBLISH brain scope.
>
> Each step declares which brain governs the action, what structural truth the brain asserts,
> and what the brain does not permit. A step with no brain assignment is not a valid step.
>
> **BRAIN GATING ENFORCEMENT (Amendment 2)**
>
> A step may only execute if ALL ENTRY CONDITIONS across all 4 brains are satisfied.
>
> A step is only considered COMPLETE if ALL EXIT CONDITIONS across all 4 brains are satisfied.
>
> If any condition fails, execution must STOP and cannot proceed to the next step.

---

## 1. EXECUTION AUTHORITY

### Architectural Declaration

**PiOS** is the canonical methodology. It defines the layer model (L0–L4), stage sequence (S0–S4), evidence governance rules, and validation criteria. PiOS does not define runtime implementation. PiOS artifacts (docs/pios/40.x, docs/pios/41.x, scripts/pios/40.x validators) are methodology documentation and compliance validators — they are not the production execution path.

**PSEE** is the validated runtime implementation. It is the authoritative execution path for second-client production runs. The PSEE pipeline (`scripts/psee/run_end_to_end.py`) is parameterized for any client and any source path. PSEE is validated up to 40.5 (signal artifact derivation); the TRANSFORMATION and ENVELOPE stages cover S3 and S4 activation.

**Second-client run targets PSEE.** All execution commands in this plan invoke PSEE scripts. PiOS validators are invoked after PSEE execution to confirm stage compliance — they do not drive the execution.

**4-Brain governance applies to PSEE execution.** PSEE produces runtime artifacts; the 4-Brain system defines what those artifacts mean, what they authorize, and what they prohibit at each stage.

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

### Intake Selector Model

**INTAKE SELECTOR MODEL**

The intake selector is the architectural abstraction between client evidence and the pipeline. It governs how evidence is identified, bounded, and presented to PSEE — independently of where that evidence lives. The first second-client run may use a local directory, but the intake model must not be local-directory-specific. The selector record is not deferred.

**source_selector schema:**

```
source_selector:
  selector_id:        string — unique identifier for this selector instance (e.g. "sel_001_<client-id>")
  selector_type:      enum — one of the supported types below
  source_uri:         string — resolvable path or URI to the evidence source
  source_version:     string — version or snapshot identifier (e.g. git SHA, export date, archive checksum)
  adapter_required:   boolean — true if selector_type requires a non-trivial adapter to resolve to raw artifacts
  evidence_boundary:  object — scope declaration: {period_start, period_end, included_types[], exclusions[]}
  checksum_manifest:  string — path to the checksum file or inline SHA-256 of root evidence set
  allowed_runtime_mode: enum — "psee_local" | "psee_remote" | "future"
```

**Supported initial selector types:**

| selector_type | Description | adapter_required | Status |
|---|---|---|---|
| `local_directory` | Evidence is a local filesystem directory | false | Active — initial run |
| `git_repository` | Evidence is a git repo at a given ref | false (PSEE native) | Deferred — adapter not yet implemented |
| `jira_export` | Evidence is a Jira issue export (XML/JSON) | true | Deferred |
| `confluence_export` | Evidence is a Confluence space export | true | Deferred |
| `archive_bundle` | Evidence is a compressed archive (.zip/.tar.gz) | false (unpack step) | Deferred |
| `a3s_future` | Anything-as-a-Source — arbitrary structured or unstructured source | true | Deferred — A3S stream required |

**Note:** Additional selector types are deferred. Only `local_directory` is active for the initial second-client run. The selector model itself, including the selector record and the `local_directory` resolution path, is a required artifact — it is not deferred.

**Brain governance for the Intake Selector:**

- **CANONICAL BRAIN** — defines what counts as valid source evidence; owns the evidence boundary declaration and selector validity. A selector without a declared evidence boundary is not a valid selector. The selector record is a canonical act: it establishes what evidence the run is derived from.

- **CODE BRAIN** — implements selector resolution: maps `selector_type` to adapter or runtime input; resolves `source_uri` to the path PSEE receives as `--source`. For `local_directory`, resolution is direct. For deferred types, a resolver adapter must be registered before use.

- **PRODUCT BRAIN** — owns the onboarding question model. The operator must answer:
  - "What source are you providing?"
  - "What system does it represent?"
  - "What period does it cover?"
  - "What evidence types are included?"
  These answers populate the `evidence_boundary` and `source_version` fields of the selector record.

- **PUBLISH BRAIN** — governs what source type can be claimed externally. Prohibits claiming live system integration when the actual run used a local export or filesystem copy. The `selector_type` in the selector record is the authoritative basis for any external claim about data sourcing.

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
All steps are governed by the 4-Brain system. No action exists outside CANONICAL, CODE, PRODUCT, or PUBLISH brain scope.
All steps are subject to brain gating: ENTRY CONDITIONS must be satisfied before execution; EXIT CONDITIONS must be verified before proceeding.

---

## PRE-GATE — INTAKE VIABILITY CHECK

This is a classification gate, not a blocking gate. PRE-GATE runs before STEP 0 executes. It classifies the structural viability of the selected source evidence and constrains allowable downstream outputs. It does not prevent execution from proceeding.

---

ENTRY CONDITIONS

CANONICAL
- `intake_selector_record` is fully defined: all five required fields present (`selector_type`, `source_uri`, `source_version`, `evidence_boundary`, `checksum_manifest`)
- DECISION-03 is resolved; evidence boundary is declared

CODE
- `source_uri` is accessible: the path or reference resolves to a readable evidence set
- `checksum_manifest` file path is present and the manifest is readable

PRODUCT
- Engagement is active; evidence has been staged and accepted under engagement terms

PUBLISH
- No structural claims have been made externally about the second client's evidence set

---

### 1. Purpose

Classify the structural viability of the selected source BEFORE STEP 0 execution. Determine expected signal strength and allowable LENS tier outputs. Enforce Evidence First doctrine: no structural claims may be made without sufficient evidence to support them.

The classification result does not block pipeline execution. It constrains downstream interpretation and claim activation.

### 2. Input

- `intake_selector_record` (DECISION-03 output): fully defined selector record containing `selector_type`, `source_uri`, `source_version`, `evidence_boundary`, and `checksum_manifest`

### 3. Checks

The following checks are explicit and computable from the selector record and source path. Each check produces PASS or FAIL. The composite result determines the output classification.

**bounded_source**
- File count is non-zero: at least one evidence file is present at `source_uri`
- File count is within manageable range: not so excessive as to make structural derivation non-deterministic or unreviewed (no hard upper limit defined — operator judgment applies above ~10,000 evidence files)

**reproducibility**
- `source_version` is present and non-empty: a git SHA, archive checksum, or equivalent snapshot identifier is recorded
- `checksum_manifest` is present and accessible; manifest covers the files referenced by `source_uri`

**structural_density**
- Multiple modules, services, or components are present: more than one top-level structural unit is identifiable in the evidence set
- Relationships are present: at least one relationship type is observable — imports, dependency declarations, test files referencing production code, router or handler registrations, configuration references, inter-service clients, or equivalent

### 4. Output Classification

The PRE-GATE produces exactly one of three classifications. The classification is mandatory and must be recorded before STEP 0 begins.

**PASS:**
- All three check categories (bounded_source, reproducibility, structural_density) are fully satisfied
- Full structural pipeline is viable: STEP 0 → STEP 14 may execute without constraint
- Eligible for Tier 1, Tier 2, and Tier 3 LENS outputs

**PARTIAL:**
- bounded_source and reproducibility are satisfied; structural_density is partially satisfied (relationships are present but module count is low, or relationship types are limited to a single category)
- Pipeline may execute; structural inference is valid but signal confidence may be degraded
- CANONICAL brain must note degraded confidence in structural derivation claims
- Eligible for Tier 1 and partial Tier 2 outputs; Tier 3 output eligibility deferred to post-run observation

**FAIL:**
- bounded_source fails (empty or unresolvable source), OR reproducibility fails (no version anchor or missing manifest), OR structural_density fails entirely (single file or no relationships observable)
- Pipeline execution is allowed but MUST NOT claim structural completeness
- All CANONICAL invariant claims are restricted: domain topology claims are provisional; signal count claims are provisional
- Restricted to Tier 1 outputs only; no Tier 2 or Tier 3 claim activation permitted

### 5. Governance Rule

- PRE-GATE result MUST NOT block execution: a PARTIAL or FAIL classification does not halt the pipeline
- PRE-GATE result MUST constrain downstream interpretation and claims: LENS tier eligibility and CANONICAL brain claim activation are gated by the classification
- PRE-GATE result MUST be recorded as an evidence artifact before STEP 0 begins: location `clients/<new-client-id>/psee/runs/<new-run-id>/pregate_viability_record.json` (implementation deferred — operator records result manually for first run)
- Any downstream step that produces a structural claim must cite the PRE-GATE classification; claims made under PARTIAL or FAIL classification require explicit confidence qualification

### 6. Brain Mapping

**CANONICAL BRAIN**
- Owns the viability classification model: defines what counts as bounded, reproducible, and structurally dense
- Constrains claim activation: a FAIL or PARTIAL classification limits what the CANONICAL brain may assert as authoritative after the run
- Invariant: no structural completeness claim may be made if PRE-GATE classification is FAIL
- Structural claims produced under PARTIAL classification are provisional, not authoritative; they must carry a confidence qualifier in the CANONICAL brain emission

**CODE BRAIN**
- Defines how each check is computed: bounded_source is a file count check; reproducibility is a metadata presence check; structural_density is a filesystem pattern check (module count, import or test file presence, dependency declaration count)
- Future automation allowed: a `pregate_viability_check.py` script may be implemented to automate all three check categories; for the first run, operator performs checks manually
- Records the classification result and per-check outcomes in `pregate_viability_record.json`

**PRODUCT BRAIN**
- Maps classification to LENS tier eligibility:

  | Classification | Tier 1 | Tier 2 | Tier 3 |
  |---|---|---|---|
  | PASS | Eligible | Eligible | Eligible |
  | PARTIAL | Eligible | Partial | Deferred |
  | FAIL | Eligible | Ineligible | Ineligible |

- Onboarding implication: a FAIL or PARTIAL classification is a product-level signal that the client's evidence package may need augmentation before a full-tier engagement can be delivered; this must be recorded in the PRODUCT brain emission

**PUBLISH BRAIN**
- Constrains external messaging and report claims:
  - PASS: all standard LENS claims may be activated per their individual conditions
  - PARTIAL: structural completeness claims must be qualified; "based on available evidence" or equivalent qualifier is required in any external output
  - FAIL: no structural completeness or topology claims may appear in external output; decision state may be included but must be qualified as provisional
- Prohibits: claiming full structural assessment when PRE-GATE classification is PARTIAL or FAIL

---

EXIT CONDITIONS

CANONICAL
- Viability classification assigned: exactly one of PASS / PARTIAL / FAIL is recorded
- Classification constraints are explicitly linked to downstream execution: tier eligibility and claim scope are documented and will govern STEP 13 brain emissions

CODE
- `pregate_viability_record.json` written (or manual record created): contains classification, per-check outcomes, and classification constraints
- All three check categories have a recorded result (PASS or FAIL per check); no check is omitted

PRODUCT
- LENS tier eligibility is known before STEP 0 begins: operator has confirmed which tiers are eligible for the current source
- Engagement scope can be confirmed or adjusted based on classification before pipeline execution commits resources

PUBLISH
- No external claim has been made about the second client's evidence structure; classification is an internal governance act
- Downstream claim constraints are recorded and will gate PUBLISH brain activation at STEP 13

---

### STEP 0 — BRAIN-GOVERNED ONBOARDING

Resolves: ROOT BLOCKER 2

---

ENTRY CONDITIONS

CANONICAL
- No entry for the second client exists in `clients/registry/client_index.json`; this step is the founding act — it must not be repeated for an already-registered client
- DECISION-01 is resolved: second-client business_client_id and UUID have been assigned by human authority
- `clients/blueedge/` and `docs/baseline/pios_baseline_v1.0.md` are confirmed unmodified
- Intake selector has been approved by CANONICAL brain: `selector_type` is a supported type; evidence boundary is declared against the selector scope; the evidence set referenced by the selector is real (no synthetic or placeholder data)

CODE
- DECISION-01 resolved: UUID and business_client_id values are in hand
- DECISION-02 resolved: tenant parameter mapping confirmed (whether `--tenant` = client UUID)
- DECISION-03 resolved: `selector_type` and `source_uri` are defined and recorded; `selector_type` maps to a supported resolution mode
- `clients/registry/client_index.json` is readable and writable
- `clients/client_template_01/` is available as structural reference for directory scaffold

PRODUCT
- Engagement has been accepted and is active
- Source selector has been selected: `selector_type` and `source_uri` are defined; operator has answered the four intake selector questions (source system, represented system, period covered, evidence types included)
- Second-client evidence is committed and staged at the location identified by the selector's `source_uri`
- Operator has confirmed evidence is real — no synthetic or placeholder data

PUBLISH
- No external communications about the second client have been made referencing the client's identity
- No internal documents reference the second client by name in any externally reachable artifact
- No claim about data sourcing method (live integration, export, local copy) has been made externally

---

EXECUTION

**CANONICAL BRAIN**
- Defines the client entity model: a client is an immutable identity unit composed of UUID (permanent), business_client_id (addressable name), and lifecycle_state (ACTIVE)
- Structural invariant: no pipeline execution may begin without a registered canonical client identity
- Client identity is the evidence isolation boundary — all downstream artifacts are scoped to this identity
- The registry entry in `clients/registry/client_index.json` is the canonical record of existence; without it, the client does not exist in the system

**CODE BRAIN**
- Registration mechanism: manually add entry to `clients/registry/client_index.json` with new UUID and business_client_id
- Directory scaffold: create `clients/<new-client-id>/psee/config/runtime_profile.json` (initially empty)
- Directory structure mirrors `clients/client_template_01/` — no symbolic links, no shared references to `clients/blueedge/`
- Tenant mapping: confirm whether `--tenant` maps to client UUID (DECISION-02); if yes, no additional tenants/ directory required

**PRODUCT BRAIN**
- Onboarding is the product boundary: everything upstream is business development; everything downstream is governed pipeline execution
- Operator checklist: (1) assign client codename, (2) generate UUID, (3) register in client_index.json, (4) create directory scaffold, (5) confirm evidence is staged
- Time-to-onboarding is a PRODUCT brain emission — record elapsed time from first contact to STEP 0 complete; this feeds the "time-bounded engagement" claim

**PUBLISH BRAIN**
- No external claim is activated by registration alone
- Client identity must remain confidential; the business_client_id used internally must not appear in any external artifact without explicit written consent
- Registration is an internal governance act — it is not publishable

Affected files:
- `clients/registry/client_index.json`
- `clients/<new-client-id>/` (new directory structure)

Expected outcome: Second client is registered and addressable by all PSEE commands via `--client <uuid>`

---

EXIT CONDITIONS

CANONICAL
- `clients/registry/client_index.json` contains a new entry: UUID, business_client_id, `lifecycle_state: ACTIVE`
- No modification to `clients/blueedge/` or any other existing client directory
- Evidence boundary is established and documented in the intake selector record; `selector_type` is recorded as the authoritative source classification for this run

CODE
- `clients/<new-client-id>/psee/config/runtime_profile.json` exists
- Directory structure matches scaffold; no symlinks to `clients/blueedge/`
- DECISION-02 resolution recorded (tenant mapping confirmed)
- `intake_selector_record` created: a structured record containing `selector_id`, `selector_type`, `source_uri`, `source_version`, `evidence_boundary`, `checksum_manifest`, and `allowed_runtime_mode`; linked to the client's `business_client_id`
- `selector_type` recorded in the intake selector record for future repeatability; the exact selector used for this run must be reproducible

PRODUCT
- Operator checklist complete (all 5 items confirmed)
- Time-to-onboarding value recorded for PRODUCT brain emission
- All four intake selector questions answered and recorded: source system, represented system, period covered, evidence types included

PUBLISH
- No external artifact has been created or modified referencing the second-client identity
- Client identity remains confidential
- Source type (`selector_type = local_directory`) recorded internally; no external claim about data sourcing made

---

### STEP 1 — Isolate Runtime Components from BlueEdge Defaults

Resolves: ROOT BLOCKER 3

---

ENTRY CONDITIONS

CANONICAL
- STEP 0 EXIT CONDITIONS all satisfied; client identity is established
- Client isolation requirement is declared in `docs/programs/second-client-kill-plan-01/execution_contract.md`
- No second-client pipeline run has occurred yet (defaults have not been exercised for second client)

CODE
- `app/execlens-demo/lib/gauge/envelope_adapter.py` lines 36–42 confirmed readable: BlueEdge default `client_uuid` and `run_id` present
- `scripts/pios/projection_runtime.py` line 52 confirmed readable: BlueEdge default `run_id` present
- No other scripts depend on these defaults being present (caller survey complete)

PRODUCT
- No runtime invocations of envelope_adapter or projection_runtime have occurred for the second client
- Client isolation is a documented product requirement

PUBLISH
- No external claims about client isolation have been made

---

EXECUTION

**CANONICAL BRAIN**
- Invariant: no canonical output may carry a prior client's identity or run identifier
- Identity isolation is a structural rule, not a code preference — runtime defaults that reference a specific client violate client isolation at the canonical layer
- After this step, the system structurally cannot produce BlueEdge output unless BlueEdge parameters are explicitly passed

**CODE BRAIN**
- `app/execlens-demo/lib/gauge/envelope_adapter.py` lines 36–42: remove default `client_uuid` and default `run_id`; make both required parameters; no logic change
- `scripts/pios/projection_runtime.py` line 52: remove `= "run_authoritative_recomputed_01"` default; caller must supply run_id explicitly
- Change type: parameter requirement enforcement — removal of silent defaults only

**PRODUCT BRAIN**
- Protects client isolation in the product: an operator who omits client parameters receives an explicit error, not silent BlueEdge output
- This step makes the product's isolation guarantee mechanically enforceable, not merely documented
- It is a prerequisite for any product claim that client data is isolated

**PUBLISH BRAIN**
- After this step, "client data is isolated at the runtime parameter boundary" has its code prerequisite met
- Claim remains deferred until RBAC is implemented and verified in production (see deferred items)

Affected files:
- `app/execlens-demo/lib/gauge/envelope_adapter.py` lines 36–42
- `scripts/pios/projection_runtime.py` line 52

Expected outcome: Any call omitting client/run parameters fails explicitly; no BlueEdge value consumed silently

---

EXIT CONDITIONS

CANONICAL
- Runtime isolation invariant holds: no component produces BlueEdge-scoped output when invoked without explicit parameters
- Client identity cannot be silently inherited from a prior run

CODE
- `envelope_adapter.py`: no default `client_uuid` or `run_id` — both are required parameters
- `projection_runtime.py`: no default `run_id` — caller must supply explicitly
- BlueEdge execution (with explicit BlueEdge parameters) confirmed still functional

PRODUCT
- An operator invoking these components without explicit parameters receives an explicit error
- Isolation is mechanically enforced, not reliant on operator discipline

PUBLISH
- Code prerequisite for "client data isolated at runtime boundary" is met; claim not yet activated

---

### STEP 2 — Make PiOS Validators Client-Agnostic

Resolves: ROOT BLOCKER 4

---

ENTRY CONDITIONS

CANONICAL
- STEP 1 EXIT CONDITIONS all satisfied; runtime isolation confirmed
- PiOS validators are identified as identity-coupled (hardcoded BlueEdge run IDs confirmed in code)
- No second-client validation run has been attempted yet

CODE
- All affected validators identified: `scripts/pios/40.2/validate_evidence_inventory.py`, `40.3/validate_reconstruction.py`, `40.4/validate_structure_immutability.py`, and all others in 40.x stream
- `intake_record.json` schema understood: expected run ID can be read from this artifact as an alternative to CLI argument
- BlueEdge validation baseline confirmed: all validators currently PASS against BlueEdge run with hardcoded IDs

PRODUCT
- No quality assurance runs have been executed for the second client; this is the pre-execution preparation step
- Validation portability is a documented product quality requirement

PUBLISH
- No compliance or validation claims have been made for the second client

---

EXECUTION

**CANONICAL BRAIN**
- PiOS validators enforce canonical methodology compliance at stage boundaries
- Invariant: validators must check structural properties of any run — they must not be identity-coupled to a specific client
- A validator that only passes for `run_01_blueedge` is not a structural validator; it is a BlueEdge-specific regression test
- This step restores validators to their canonical purpose: checking structure, not matching identity

**CODE BRAIN**
- All affected validators in `scripts/pios/40.2/`, `40.3/`, `40.4/`: add `--expected-run-id <id>` CLI argument
- Read expected run ID from `intake_record.json` or CLI argument; replace hardcoded string comparisons with parameterized targets
- Validator logic (what it checks, how it checks) must remain unchanged — only the comparison target is made configurable
- Regression test: run each modified validator against BlueEdge run with `--expected-run-id run_02_blueedge` — must still PASS

**PRODUCT BRAIN**
- Parameterized validators are the product's quality assurance layer for any client
- After this step, a validated run for the second client is a credible quality signal, not a BlueEdge-tainted check
- Validation results feed the PRODUCT brain emission: "time-to-first-validated-output"

**PUBLISH BRAIN**
- Validated execution for the second client is a prerequisite for the claim "repeatable across environments"
- Claim not activated here — activated only after validation matrix group 3 ALL PASS

Affected files:
- `scripts/pios/40.2/validate_evidence_inventory.py`
- `scripts/pios/40.3/validate_reconstruction.py`
- `scripts/pios/40.4/validate_structure_immutability.py`
- All other affected validators in 40.x stream

Expected outcome: PiOS validators accept second-client run ID and confirm structural compliance of PSEE outputs

---

EXIT CONDITIONS

CANONICAL
- PiOS validators check structural properties, not client-specific identifiers; client-agnostic validation invariant holds
- Validators are portable: same logic, parameterized comparison target

CODE
- All affected validators accept `--expected-run-id` argument
- Regression confirmed: all validators PASS against BlueEdge run with `--expected-run-id run_02_blueedge`
- No validator logic has changed — only the comparison target is parameterized

PRODUCT
- Quality assurance layer is portable; validation results for second client are credible and not BlueEdge-tainted

PUBLISH
- Prerequisite established for "governed, repeatable execution" claim; not yet activated

---

### STEP 3 — Parameterize LENS Report Generator

Resolves: ROOT BLOCKER 1 (primary)

---

ENTRY CONDITIONS

CANONICAL
- STEP 2 EXIT CONDITIONS all satisfied; PiOS validation layer is client-agnostic
- Projection boundary definition is established: external output must derive from canonical truth of the active client only
- `lens_report_generator.py` hardcoded state confirmed: lines 44, 50–55, 731–755 contain BlueEdge-specific constants

CODE
- `scripts/pios/lens_report_generator.py` is readable; hardcoded constants at confirmed line numbers
- `canonical_topology.json` structure is understood: domain counts and cluster names are readable from this artifact at runtime
- No LENS report has been generated for the second client yet

PRODUCT
- LENS report portability is a documented product requirement
- No client-facing output has been produced or promised

PUBLISH
- No LENS output has been shown externally; no report content has been communicated to the second client or any third party

---

EXECUTION

**CANONICAL BRAIN**
- LENS report content must be derived from canonical evidence — not from embedded constants
- Canonical truth rule: domain counts, claim identifiers, and topology structure must flow from the canonical package at runtime; they must not be pre-declared in the generator
- This is the projection boundary enforcement: the external output must be derivable from the internal canonical truth of the active client, and only that client

**CODE BRAIN**
- `scripts/pios/lens_report_generator.py`:
  - Add `--client <id>` and `--run-id <id>` CLI arguments
  - Derive `FRAGMENTS_DIR`, `REPORTS_DIR`, `CANONICAL_PKG_DIR` from `--client` and `--run-id` at runtime
  - Add `--api-base <url>` argument (default: attempt API, fall back to fragments)
  - Remove hardcoded `LENS_CLAIMS = ["CLM-25", ...]`; derive from canonical package or accept `--claims` argument
  - Remove hardcoded domain counts (17, 42, 89) and cluster names; read from `canonical_topology.json` in `CANONICAL_PKG_DIR` at runtime

**PRODUCT BRAIN**
- The LENS report is the primary sellable product artifact
- After this step, the product can generate an executive report for any client from their canonical package
- This is the portability gate for the product — if the generator cannot run without BlueEdge inputs, the product is not portable

**PUBLISH BRAIN**
- After this step, the "system is client-agnostic" claim has its code-layer prerequisite met
- Claim activation requires a verified second-client run with zero BlueEdge content in output (confirmed at STEP 12)

Affected files:
- `scripts/pios/lens_report_generator.py` lines 44, 46, 50–55, 731–755

Expected outcome: `lens_report_generator.py` produces a report with zero BlueEdge paths, labels, or domain names when invoked with second-client parameters

---

EXIT CONDITIONS

CANONICAL
- LENS generator derives all topology from `canonical_topology.json` at runtime; no BlueEdge constants remain in code
- Projection boundary is enforced in code: all content traces to canonical package of the active client

CODE
- `--client`, `--run-id`, `--fragments-dir`, `--output-dir`, `--api-base` arguments functional
- Hardcoded `LENS_CLAIMS`, domain counts (17/42/89), and cluster names removed from source
- BlueEdge report generation confirmed still functional when invoked with explicit BlueEdge parameters

PRODUCT
- LENS generator is portable; can produce a report for any client with a valid canonical package

PUBLISH
- Code-layer prerequisite for "system is client-agnostic" met; claim activation deferred to STEP 12 output verification

---

### STEP 4 — Parameterize Tier-2 Data Layer

Resolves: ROOT BLOCKER 1 (Tier-2 component)

---

ENTRY CONDITIONS

CANONICAL
- STEP 3 EXIT CONDITIONS all satisfied; LENS report generator is portable
- Tier-2 query traceability requirement is established: results must trace to the active client's evidence
- `tier2_data.py` hardcoded state confirmed: lines 18–25 contain BlueEdge-specific constants

CODE
- `scripts/pios/tier2_data.py` and `scripts/pios/tier2_query_engine.py` are readable
- All callers of `tier2_data.py` functions identified in `tier2_query_engine.py`
- No Tier-2 queries have been executed for the second client

PRODUCT
- Tier-2 query portability is a documented product requirement for LENS Tier-2 tier

PUBLISH
- No Tier-2 diagnostic content has been shown externally for the second client

---

EXECUTION

**CANONICAL BRAIN**
- Tier-2 queries must resolve against the canonical package of the active client
- Focus domain must be evidence-derived from the client's canonical topology — it must not be pre-declared
- Invariant: all tier-2 query results are traceable to the queried client's evidence, not to a prior client's state

**CODE BRAIN**
- `scripts/pios/tier2_data.py`: replace `CANONICAL_PKG_DIR`, `FOCUS_DOMAIN`, `RUN_ID` module-level constants with constructor parameters (`client_id`, `run_id`, `focus_domain`); derive `CANONICAL_PKG_DIR` from parameters
- `scripts/pios/tier2_query_engine.py`: update all callers to pass parameters; no logic change

**PRODUCT BRAIN**
- Tier-2 diagnostic query access is a product capability (LENS Tier-2 tier)
- After this step, the Tier-2 product is genuinely portable: any client's canonical package can be queried
- Tier-2 portability is a prerequisite for presenting Tier-2 LENS to the second client

**PUBLISH BRAIN**
- No external claim is activated directly by this step
- Required before: any claim about "structural diagnostic capability" applies beyond BlueEdge

Affected files:
- `scripts/pios/tier2_data.py` lines 18–25
- `scripts/pios/tier2_query_engine.py` (callers)

Expected outcome: `tier2_data.py` loads topology, signals, and GAUGE state from any parameterized client/run package directory

---

EXIT CONDITIONS

CANONICAL
- Tier-2 query traceability invariant holds: all query results traceable to the active client's canonical package
- Focus domain is evidence-derived, not pre-declared

CODE
- `tier2_data.py` accepts `client_id`, `run_id`, `focus_domain` as constructor parameters; `CANONICAL_PKG_DIR` derived at runtime
- `tier2_query_engine.py` callers updated; no logic change confirmed

PRODUCT
- Tier-2 product tier is portable; any client with a canonical package can be queried

PUBLISH
- Prerequisite established for Tier-2 "diagnostic query capability" claim; not yet activated

---

### STEP 5 — Parameterize Graph State Export

Resolves: ROOT BLOCKER 1 (Tier-2 visual component)

---

ENTRY CONDITIONS

CANONICAL
- STEP 4 EXIT CONDITIONS all satisfied; Tier-2 data layer is portable
- Topology portability invariant established: graph generation logic must produce output representative of the active client's evidence
- `export_graph_state.mjs` hardcoded state confirmed: lines 28–35 contain BlueEdge-specific paths

CODE
- `scripts/pios/export_graph_state.mjs` is readable; hardcoded BlueEdge input and output paths confirmed at lines 28–35
- Second-client vault structure is known (created in STEP 9, after pipeline runs — this step prepares the script before execution)
- No graph state has been generated for the second client

PRODUCT
- Tier-2 graph snapshot portability is a documented product requirement

PUBLISH
- No topology visualization has been shown externally for the second client

---

EXECUTION

**CANONICAL BRAIN**
- Graph state is a topology artifact derived from the active client's canonical vault structure
- It must reflect the active client's evidence topology — not a pre-computed topology from a prior client
- Topology portability is a structural invariant: the same graph generation logic, applied to different evidence, must produce a graph representative of that evidence

**CODE BRAIN**
- `scripts/pios/export_graph_state.mjs`: add `--client <id>`, `--run-id <id>`, `--output <path>` arguments
- Derive vault index path from `--client` and `--run-id` parameters; remove BlueEdge-specific input path

**PRODUCT BRAIN**
- The Tier-2 graph snapshot panel is a product experience element in the LENS Tier-2 commercial brief
- After parameterization, the graph reflects the second client's actual structural topology — not BlueEdge's
- A visually contaminated panel (BlueEdge topology shown for second client) would fail the executive presentation

**PUBLISH BRAIN**
- Graph state is an internal artifact; not directly publishable
- Its portability enables the Tier-2 LENS product to be presented to the second client without visual contamination
- Required before: LENS Tier-2 report for second client can be considered presentation-ready

Affected files:
- `scripts/pios/export_graph_state.mjs` lines 28–35

Expected outcome: Graph state JSON generated from second-client vault and written to second-client reports directory

---

EXIT CONDITIONS

CANONICAL
- Topology portability invariant holds: graph generation derives input from active client vault path, not BlueEdge path

CODE
- `--client`, `--run-id`, `--output` arguments functional; BlueEdge-specific input path removed
- BlueEdge graph export confirmed still functional when invoked with explicit BlueEdge parameters

PRODUCT
- Tier-2 graph snapshot is portable; second-client topology can be rendered without visual BlueEdge contamination

PUBLISH
- Prerequisite established for Tier-2 LENS presentation to second client; not yet activated

---

### STEP 6 — Define Brain Emission Fill Template

Resolves: ROOT BLOCKER 5

---

ENTRY CONDITIONS

CANONICAL
- STEPs 0–5 EXIT CONDITIONS all satisfied; all code parameterization is complete
- `brain_emission_plan.md` exists in its current form; sections are present but marked "To be populated post-run" with no explicit required fields
- No PSEE pipeline execution has occurred; brain emissions are empty

CODE
- `docs/programs/second-client-kill-plan-01/brain_emission_plan.md` is readable and writable
- Current "To be populated post-run" sections identified for all four brain domains

PRODUCT
- PRODUCT brain section has structural categories but no minimum content standard; this must be defined before execution so post-run population is verifiable

PUBLISH
- No claims have been activated; PUBLISH brain section is empty; explicit required fields are not yet defined

---

EXECUTION

**CANONICAL BRAIN**
- Brain emissions are canonical acts: they propagate runtime truth to the authority record
- Without a concrete fill format, brain completeness cannot be verified — an incomplete brain emission is structurally equivalent to no emission
- This step establishes the minimum structural requirement for each brain domain's post-run emission
- Rule: every field defined in the fill template is required; an emission that omits a required field is INCOMPLETE

**CODE BRAIN**
- `docs/programs/second-client-kill-plan-01/brain_emission_plan.md`: add "Required Fill Format" section at the top of each brain domain
- Each section must define: required fields, minimum content standard (e.g. "at least 3 confirmed invariants"), and PASS/INCOMPLETE verdict criteria
- No script; this is a documentation governance action governed by CODE brain because it defines the execution record format

**PRODUCT BRAIN**
- PRODUCT brain emissions define what the product learned: minimum evidence volume, time-to-output, client package requirements
- Without a fill template, PRODUCT brain emissions are unverifiable, and no product claim about onboarding time or evidence minimum can be activated
- The fill template forces the product to confront what was observed, not just describe what was expected

**PUBLISH BRAIN**
- PUBLISH brain emissions determine which external claims can be activated after the run
- Without a concrete fill template, the PUBLISH brain cannot be closed, and no claim activation is valid
- This step is a prerequisite for any post-run claim activation

Affected files:
- `docs/programs/second-client-kill-plan-01/brain_emission_plan.md`

Expected outcome: Brain emission plan has explicit PASS criteria per brain domain with required fields and minimum content standards

---

EXIT CONDITIONS

CANONICAL
- Each brain domain has explicit required fields, minimum content standards, and PASS/INCOMPLETE verdict criteria
- The fill template is unambiguous: a reviewer can confirm PASS or INCOMPLETE without judgment calls

CODE
- `brain_emission_plan.md` contains "Required Fill Format" sections for all four brain domains
- CODE brain section: required fields include command sequence, scripts modified, environment, failure modes, RBAC attachment points

PRODUCT
- PRODUCT brain section: required fields include time-to-output table (all rows), minimum evidence volume finding, client package requirements
- All fields defined with minimum acceptable content

PUBLISH
- PUBLISH brain section: required fields include claim activation status for each safe claim, prohibited claims confirmation, case-study candidate status
- Claims requiring security maturity explicitly marked DEFERRED with conditions

---

### STEP 7 — Execute PSEE Pipeline (S0–S4)

Resolves: all upstream prerequisites satisfied; this step produces the core run artifacts

---

ENTRY CONDITIONS

CANONICAL
- STEPs 0–6 EXIT CONDITIONS all satisfied
- DECISION-03 resolved: intake selector record is present; `selector_type`, `source_uri`, `source_version`, and `evidence_boundary` are defined; evidence boundary is declared
- No second-client PSEE run has been executed; no package artifacts exist yet

CODE
- Intake selector record present (created at STEP 0 EXIT CONDITIONS); `selector_id` is known
- `selector_type = local_directory` for this run; `source_uri` resolves to a local directory containing real evidence
- PSEE runtime environment confirmed: Python version and dependencies match requirements
- Code tag for PSEE runtime recorded (required for deterministic rerun readiness)
- DECISION-02 resolved: tenant parameter confirmed
- All five required PSEE commands are known and ready to execute in sequence

PRODUCT
- Evidence is real — no synthetic or placeholder data; operator has confirmed
- Intake selector questions answered at STEP 0; source is confirmed as a local directory for this run
- Engagement is active; client has provided evidence under engagement terms

PUBLISH
- No external communication about pipeline execution status
- No premature status update to client; pipeline completion is an internal event

---

EXECUTION

**CANONICAL BRAIN**
- Evidence First: no canonical output may precede a valid evidence boundary
- S0 is the canonical gate: the intake record and ledger entry establish the evidence boundary and run identity
- Every downstream artifact is conditional on a valid S0 — the entire canonical chain traces back to this entry
- The pipeline must produce all five required package artifacts; a run that exits at any intermediate stage has not established canonical truth

**CODE BRAIN**
- For the initial second-client run: `selector_type = local_directory`; source directory is passed directly as `--source-path` (pios intake create) and `--source` (run_end_to_end.py). The `--source-selector` argument referenced in earlier plan drafts does not exist in the current scripts; callers pass the resolved path directly.
- Locked execution IDs (STEP 7B reconciliation — 2026-04-24): `intake_id = intake_01_oss_fastapi`; `run_id = run_01_oss_fastapi`
- Commands in sequence:
  ```
  python3 scripts/pios/pios.py intake create \
      --source-path clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend \
      --tenant e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
      --intake-id intake_01_oss_fastapi

  python3 scripts/pios/pios.py ledger create \
      --run-id run_01_oss_fastapi \
      --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
      --source-version intake_01_oss_fastapi

  python3 scripts/psee/run_end_to_end.py \
      --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
      --source clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend \
      --run-id run_01_oss_fastapi \
      --target gauge \
      --demo-client blueedge \
      --demo-run-id run_01_authoritative
  ```
- BRANCH BLOCKER (unresolved — recorded 2026-04-24): `run_end_to_end.py` enforces `REQUIRED_BRANCH = "work/psee-runtime"` at pre-flight. Current execution branch is `feature/second-client-kill-plan-01`. Pre-flight will fail unless this is resolved. `feature/second-client-kill-plan-01` is a pure descendant of `work/psee-runtime` (20 commits ahead, no divergence, merge-base `51aab3f3`). Resolution options: (A) fast-forward `work/psee-runtime` to current HEAD then execute from that branch; (B) amend branch guard in a dedicated code chunk to permit the feature branch; (C) block STEP 7 until branch policy is changed. Resolution must be performed in a follow-up contract before pipeline execution begins.
- PSEE exit code 0 = pipeline complete; any non-zero exit = stop and escalate; do not proceed; exit codes 1–7 map to specific stage failures (pre-flight, intake, lineage, structure, transformation, envelope, validation)

**PRODUCT BRAIN**
- This step is the product's core execution event: client evidence is converted into governed structural intelligence
- Time-to-first-output measurement begins at intake create and ends at PSEE exit 0
- Record elapsed time for each stage (S0–S4) in the brain_emission_plan.md time-to-first-output table
- Evidence volume, domain count, and coverage profile observed here feed PRODUCT brain minimum evidence definition

**PUBLISH BRAIN**
- No external claim is activated by pipeline execution alone
- Execution produces internal artifacts; external claims require validation matrix PASS
- Do not communicate pipeline completion to the client before validation

Affected files/commands: `scripts/pios/pios.py`, `scripts/psee/run_end_to_end.py`

Expected outcome: PSEE exits at code 0; `clients/<new-client-id>/psee/runs/<new-run-id>/package/` contains all five required artifacts (gauge_state.json, coverage_state.json, reconstruction_state.json, canonical_topology.json, signal_registry.json)

---

EXIT CONDITIONS

CANONICAL
- Evidence boundary established: `intake_record.json` present with no BlueEdge source references
- Run identity established: ledger entry present
- All five canonical package artifacts present in `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/package/`
- PSEE exit code is 0; any non-zero exit means this step is NOT complete

CODE
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/package/` directory exists
- gauge_state.json, coverage_state.json, reconstruction_state.json, canonical_topology.json, signal_registry.json all present
- Execution log started; commands and parameters recorded

PRODUCT
- Elapsed time per stage captured for PRODUCT brain emission time-to-output table
- Evidence volume and observed domain count recorded

PUBLISH
- No external communication made; no claim activated

---

### STEP 8 — Confirm PiOS Stage Compliance (Validation)

Resolves: ROOT BLOCKER 4 (execution phase)

---

ENTRY CONDITIONS

CANONICAL
- STEP 7 EXIT CONDITIONS all satisfied; all five canonical package artifacts present; PSEE exit code 0 confirmed
- PiOS validators have been parameterized (STEP 2 EXIT CONDITIONS satisfied)
- Canonical methodology compliance has not yet been confirmed for this run

CODE
- All modified PiOS validators available with `--expected-run-id` argument
- New-run-id value known
- BlueEdge regression test completed (validators still PASS for BlueEdge run with `--expected-run-id run_02_blueedge`)

PRODUCT
- No quality assurance check results exist yet for this second-client run

PUBLISH
- No compliance claims have been made for the second client

---

EXECUTION

**CANONICAL BRAIN**
- PiOS validators confirm that PSEE execution complies with canonical methodology
- Compliance is a canonical property: execution that passes all stage validators is canonically governed; execution that fails any validator is not governed, regardless of what artifacts it produced
- This step separates "ran to completion" from "ran correctly"

**CODE BRAIN**
- Invoke validators from `scripts/pios/40.2/`, `40.3/`, `40.4/` with `--expected-run-id <new-run-id>` (enabled by STEP 2)
- Record pass/fail result for each validator; any FAIL = stop
- Log all validator invocations to execution log for CODE brain emission

**PRODUCT BRAIN**
- A validated run is a product-quality run; an unvalidated run is not a product artifact
- Validation results feed the CODE brain emission: "all validators PASS" or "validator FAIL at stage X"
- Validation pass time feeds the time-to-first-validated-output metric

**PUBLISH BRAIN**
- Validated execution is a prerequisite for the claim "governed, repeatable pipeline execution" for the second client
- After this step, internal validation claim is earned — external claim is not activated until validation matrix group 3 ALL PASS

Commands: Invoke all affected PiOS validators per STEP 2 parameterization

Expected outcome: All PiOS S1–S2 validators PASS; validation matrix groups 1, 2, 3 confirmed

---

EXIT CONDITIONS

CANONICAL
- All PiOS S1–S2 validators PASS with second-client run ID; canonical methodology compliance confirmed
- Any FAIL means this step is NOT complete; do not proceed

CODE
- Validator invocation log records PASS result for every validator
- All results logged to execution record for CODE brain emission

PRODUCT
- Quality gate passed; run is confirmed product-quality

PUBLISH
- Internal validation claim earned; prerequisite for "governed execution" external claim met; not yet activated

---

### STEP 9 — Build Evidence Vault

Resolves: prerequisite for LENS fragment generation

---

ENTRY CONDITIONS

CANONICAL
- STEP 8 EXIT CONDITIONS all satisfied; PiOS compliance confirmed
- All five canonical package artifacts confirmed present and validated
- Evidence vault does not yet exist for this second-client run

CODE
- `scripts/psee/build_evidence_vault.py` available
- All five required package artifacts confirmed in `clients/<new-client-id>/psee/runs/<new-run-id>/package/`
- Second-client display name determined (for `--client-name` argument)

PRODUCT
- Client identity is confirmed and stable; no changes to registration since STEP 0

PUBLISH
- No vault content has been shared externally; vault is an internal artifact

---

EXECUTION

**CANONICAL BRAIN**
- The evidence vault is the canonical representation of the client's evidence-to-intelligence derivation
- It is the authoritative, deterministic record of what was derived and from what evidence
- The vault must be reproducible: same input artifacts → identical vault structure and content

**CODE BRAIN**
- Command:
  ```
  python3 scripts/psee/build_evidence_vault.py \
      --client <new-client-id> \
      --run <new-run-id> \
      --output-dir clients/<new-client-id>/vaults/run_01_authoritative_generated \
      --client-name "<second-client-display-name>"
  ```
- Input: package artifacts from STEP 7
- Output: Obsidian-structured vault at parameterized output directory

**PRODUCT BRAIN**
- The evidence vault is the internal product artifact that backs the external LENS projection
- Its existence confirms that the LENS report has an auditable evidence chain behind it
- Without a vault, the LENS report has no traceable internal basis — it cannot be confirmed as evidence-derived

**PUBLISH BRAIN**
- The evidence vault is internal — it is not delivered to the client
- Its existence enables the claim: "all report content is traceable to source evidence"
- This claim is activatable after validation matrix group 4 (Evidence Chain Completeness) ALL PASS

Commands: `scripts/psee/build_evidence_vault.py`

Expected outcome: Evidence vault produced; `clients/<new-client-id>/vaults/run_01_authoritative_generated/claims/fragments/` present

---

EXIT CONDITIONS

CANONICAL
- Evidence vault present at `clients/<new-client-id>/vaults/run_01_authoritative_generated/`
- Vault content is deterministically derived from canonical package; no BlueEdge content in vault

CODE
- Required vault files present (per PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01 specification)
- `claims/fragments/` directory exists within the vault

PRODUCT
- Internal evidence chain is auditable; LENS report can claim traceable evidence basis

PUBLISH
- Vault exists; "all report content is traceable to source evidence" claim prerequisite met; not yet activated

---

### STEP 10 — Export Projection Fragments and Graph State

Resolves: ROOT BLOCKER 1 (data supply for LENS generator)

---

ENTRY CONDITIONS

CANONICAL
- STEP 9 EXIT CONDITIONS all satisfied; evidence vault present
- ZONE-2 filter boundary is defined: internal canonical truth vs. external projection surface separation is established
- No fragment export has occurred for the second client yet

CODE
- `projection_runtime.py` has no BlueEdge default (STEP 1 EXIT CONDITIONS confirmed)
- Vault path confirmed: `clients/<new-client-id>/vaults/run_01_authoritative_generated`
- `export_graph_state.mjs` parameterized (STEP 5 EXIT CONDITIONS confirmed)
- Fragment output directory path determined

PRODUCT
- Evidence vault is complete; fragment export is the serving-layer preparation step

PUBLISH
- No fragment content has been shown externally; ZONE-2 boundary has not yet been confirmed for second client's projection surface

---

EXECUTION

**CANONICAL BRAIN**
- Fragments are ZONE-2-governed projections of canonical vault content
- They define the exact boundary between internal canonical truth and external projection surface
- No content outside ZONE-2 may propagate to the LENS report — fragments enforce this boundary mechanically
- ZONE-2 is the canonical filter: internal identifiers (SIG-, COND-, DIAG-) are stripped; only executive-safe content passes

**CODE BRAIN**
- Commands:
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
- `projection_runtime.py` must be invoked with explicit run_id (no default, per STEP 1)

**PRODUCT BRAIN**
- Fragment export is the moment canonical truth becomes projection-ready for the LENS product
- The graph state is the visual topology artifact for the Tier-2 product tier
- Both are prerequisites for generating the client-presentable LENS artifact

**PUBLISH BRAIN**
- Fragments define the boundary of safe external expression
- Fragment content is the only content authorized for the LENS report
- Any content in the LENS report not derivable from a ZONE-2 fragment is a PUBLISH brain violation

Commands: `scripts/pios/projection_runtime.py`, `scripts/pios/export_graph_state.mjs`

Expected outcome: ZONE-2-L1 fragment files present; second-client graph state JSON generated

---

EXIT CONDITIONS

CANONICAL
- ZONE-2-L1 fragment files present for all required claims; ZONE-2 filter confirmed applied (no SIG-, COND-, DIAG-, INTEL- identifiers present in fragment content)
- Fragment content derives exclusively from second-client canonical vault

CODE
- Fragment files present in `claims/fragments/`
- Graph state JSON present at `clients/<new-client-id>/reports/tier2/graph_state.json`

PRODUCT
- LENS report has a serving layer; Tier-2 visual has a second-client data source

PUBLISH
- Fragment content defines the approved external expression surface; approved for use in LENS report generation

---

### STEP 11 — Generate LENS Report

Resolves: ROOT BLOCKER 1 (terminal output)

---

ENTRY CONDITIONS

CANONICAL
- STEP 10 EXIT CONDITIONS all satisfied; fragment files present; ZONE-2 filter confirmed applied
- LENS report generator parameterized (STEP 3 EXIT CONDITIONS confirmed)
- No LENS report exists yet for the second client

CODE
- Fragment files confirmed present at known path
- `canonical_topology.json` readable in second-client package directory (for domain count derivation)
- `--client` and `--run-id` values known and confirmed

PRODUCT
- No LENS report has been generated; no candidate deliverable exists yet
- Client has not been shown any output; no external output has been produced

PUBLISH
- No external output has been produced for the second client yet; LENS portability unverified

---

EXECUTION

**CANONICAL BRAIN**
- The LENS report must derive all content from canonical truth via ZONE-2 projection
- No report section may introduce content not present in the canonical package
- Canonical isolation invariant: no second-client report may contain first-client (BlueEdge) content

**CODE BRAIN**
- Command (enabled by STEP 3):
  ```
  python3 scripts/pios/lens_report_generator.py \
      --client <new-client-id> \
      --run-id <new-run-id> \
      --fragments-dir clients/<new-client-id>/vaults/run_01_authoritative_generated/claims/fragments \
      --output-dir clients/<new-client-id>/reports/
  ```
- `lens_report_generator.py` must read domain structure from `canonical_topology.json` at runtime (per STEP 3); no BlueEdge constants remain

**PRODUCT BRAIN**
- The LENS report is the deliverable sellable artifact for the second client
- It is the product's terminal output — the artifact the client receives
- Before presentation: confirm report is executive-readable; confirm no internal identifiers exposed; confirm decision state present

**PUBLISH BRAIN**
- The LENS report is an external-facing artifact — PUBLISH brain governs its content
- Before presentation, verify against the prohibited claims list in brain_emission_plan.md
- Decision state (PROCEED / INVESTIGATE / ESCALATE) is the canonical vocabulary — do not editorialize or rephrase

Commands: `scripts/pios/lens_report_generator.py`

Expected outcome: LENS report HTML present in `clients/<new-client-id>/reports/`; content derived from second-client canonical package only

---

EXIT CONDITIONS

CANONICAL
- LENS report HTML present in second-client reports directory
- All content derives from canonical package via ZONE-2 projection; no embedded constants from prior client

CODE
- Report file present and non-empty
- Decision state present in report body; no empty required sections

PRODUCT
- A candidate deliverable artifact exists; subject to portability verification in STEP 12 before any client presentation

PUBLISH
- Report pending portability verification; no external distribution permitted until STEP 12 passes

---

### STEP 12 — Verify LENS Projection Portability

Resolves: validation matrix group 7 requirement

---

ENTRY CONDITIONS

CANONICAL
- STEP 11 EXIT CONDITIONS all satisfied; LENS report HTML present
- Canonical isolation invariant has not yet been verified at the output layer
- BlueEdge contamination patterns are known: client name "blueedge", run ID "run_authoritative_recomputed_01", domain labels "DOMAIN-10", "Fleet Operations", "Edge Data Acquisition"

CODE
- LENS report HTML file path is known and accessible
- grep is available in execution environment

PRODUCT
- LENS report exists as a candidate deliverable; client presentation has not occurred
- No external distribution of the report has occurred

PUBLISH
- Report has not been shown to the second client or any external party; portability is unverified

---

EXECUTION

**CANONICAL BRAIN**
- Canonical isolation must hold at the output layer
- Any BlueEdge content in the second-client LENS report is a canonical isolation failure — the run is not authoritative until zero matches are found
- This is not a quality check; it is a canonical pass/fail gate

**CODE BRAIN**
- Verification commands:
  ```
  grep -i "blueedge" clients/<new-client-id>/reports/*.html
  grep -i "run_authoritative_recomputed_01" clients/<new-client-id>/reports/*.html
  grep -i "domain-10\|Fleet Operations\|Edge Data Acquisition" clients/<new-client-id>/reports/*.html
  ```
- All three commands must return zero matches
- Any match = STOP; the run is not authoritative; return to STEP 3 for re-parameterization

**PRODUCT BRAIN**
- A clean portability check means the product can be presented to the second client safely
- Zero matches confirms that the LENS product tier is client-agnostic at the output layer

**PUBLISH BRAIN**
- Zero BlueEdge references in LENS output = PUBLISH brain isolation condition met
- After this step, the "system is client-agnostic" claim has its output-layer evidence
- Claim activation still conditional on validation matrix group 7 ALL PASS

Expected outcome: All three grep commands return zero matches

---

EXIT CONDITIONS

CANONICAL
- Canonical isolation invariant confirmed at output layer: zero BlueEdge references in LENS report
- Any match means this step is NOT complete; do not proceed; return to STEP 3

CODE
- All three grep commands returned zero matches; results logged

PRODUCT
- LENS report is safe for client presentation

PUBLISH
- "System is client-agnostic" claim has output-layer evidence; claim activation conditional on validation matrix group 7 ALL PASS

---

### STEP 13 — Populate Brain Emissions from Run Artifacts

Resolves: ROOT BLOCKER 5 (execution phase)

---

ENTRY CONDITIONS

CANONICAL
- STEP 12 EXIT CONDITIONS all satisfied; LENS portability verified; all run artifacts present
- Brain emission fill template defined (STEP 6 EXIT CONDITIONS confirmed); required fields are known

CODE
- `brain_emission_plan.md` fill template is in place; required fields identified for all four brain domains
- All run artifacts accessible for observation (package directory, execution log, vault, reports)
- Execution log is complete: all commands and parameters recorded

PRODUCT
- All pipeline stages complete; time-to-output measurements captured; evidence volume and domain count observed

PUBLISH
- LENS report is verified clean; no claims have been activated yet; all four brain domains are empty

---

EXECUTION

**CANONICAL BRAIN**
- Populate CANONICAL brain sections from observed run evidence:
  - Confirmed invariants: list only what was directly observed to hold (minimum 3 required by validation matrix)
  - Broken invariants: explicitly list any BlueEdge-specific assumption discovered during the run, or state "none found"
  - New structural definitions: cross-client patterns observable from the second-client evidence
  - Internal/external distinction: confirm what is internal (canonical package, evidence chain) vs. external (LENS report, decision state)
- Do not infer; do not project; record only what was observed

**CODE BRAIN**
- Populate CODE brain sections from execution record:
  - Full command sequence for S0–S4 (exact commands, parameters, order)
  - All scripts modified during STEPs 1–6 (file path, change summary)
  - Environment: Python version, dependencies used
  - Failure modes encountered (if any) and how they were handled
  - RBAC/audit attachment points discovered during execution (populate the table in brain_emission_plan.md CODE BRAIN section)

**PRODUCT BRAIN**
- Populate PRODUCT brain sections from observed metrics:
  - Time-to-first-output table: record actual elapsed time per stage
  - Minimum evidence volume: record what the second client provided and whether it was sufficient
  - Client package requirements: what the client had to provide vs. what was derived
  - Onboarding ledger implications: what information was required to gate pipeline execution

**PUBLISH BRAIN**
- Populate PUBLISH brain sections from confirmed outputs:
  - Mark each safe external claim as ACTIVATED or NOT YET (per activation conditions in brain_emission_plan.md)
  - Confirm prohibited claims list — no prohibited language appeared in LENS output
  - Case-study candidate: record whether client grants reference rights (yes/no/anonymous)
  - Claims requiring security maturity: mark as DEFERRED with explicit condition remaining

Affected files:
- `docs/programs/second-client-kill-plan-01/brain_emission_plan.md` (fill all required fields per STEP 6 template)

Expected outcome: All four brain domains populated; each section marked PASS or INCOMPLETE; no section omitted

---

EXIT CONDITIONS

CANONICAL
- CANONICAL brain domain: confirmed invariants filled (≥3), broken invariants explicitly addressed, new structural definitions addressed, internal/external distinction documented
- No section contains inference or forward projection; all entries reference specific observed artifacts

CODE
- CODE brain domain: full command sequence recorded, all modified scripts listed, environment documented, failure modes addressed, RBAC attachment points table filled
- All entries reference specific files, line numbers, or commands actually executed

PRODUCT
- PRODUCT brain domain: time-to-output table complete (all rows filled), minimum evidence finding recorded, client package requirements documented, onboarding implications recorded

PUBLISH
- PUBLISH brain domain: each safe claim marked ACTIVATED or NOT YET with explicit basis, prohibited claims confirmation recorded, case-study candidate status recorded, security-gated claims marked DEFERRED

---

### STEP 14 — Run Full Validation Matrix

Resolves: final gate before declaring run authoritative

---

ENTRY CONDITIONS

CANONICAL
- STEP 13 EXIT CONDITIONS all satisfied; all four brain domains populated; all required fields filled
- All run artifacts present: intake_record.json, coherence_record.json, canonical package artifacts, LENS report, evidence vault
- All previous steps' EXIT CONDITIONS confirmed: no outstanding failures from any step

CODE
- `docs/programs/second-client-kill-plan-01/validation_matrix.md` accessible
- All artifacts referenced by the 7 criteria groups are present and accessible
- No outstanding validator failures or unresolved issues from STEPs 1–13

PRODUCT
- All run stages complete; all product artifacts produced (GAUGE state, LENS report, evidence vault, brain emissions)

PUBLISH
- Brain emissions complete; PUBLISH brain populated; prohibited claims confirmed absent from LENS output

---

EXECUTION

**CANONICAL BRAIN**
- The validation matrix is the canonical completeness check for the entire run
- A run that passes all 7 groups is canonically authoritative
- A run that fails any group is not authoritative, regardless of how many other groups pass
- After validation matrix ALL PASS: write BASELINE_LOCK to `clients/<new-client-id>/psee/runs/<new-run-id>/BASELINE_LOCK`

**CODE BRAIN**
- Process: work through all 7 criteria groups in `docs/programs/second-client-kill-plan-01/validation_matrix.md` line by line
- For each check: record PASS or FAIL with specific evidence
- Any FAIL: stop; do not proceed; escalate; do not declare run authoritative

**PRODUCT BRAIN**
- All 7 groups passing means the product is ready for client presentation
- The validation matrix PASS is the product's delivery gate — the moment the engagement becomes billable and the LENS artifact becomes deliverable

**PUBLISH BRAIN**
- Validation matrix ALL PASS is the gate for PUBLISH brain claim activation
- After this step, claims marked ACTIVATED in STEP 13 may be used in external communications
- Claims that require additional maturity (RBAC implementation, multi-client verification) remain DEFERRED

Expected outcome: All 7 validation matrix criteria groups reach ALL PASS; BASELINE_LOCK written; run declared authoritative

---

EXIT CONDITIONS

CANONICAL
- All 7 validation matrix criteria groups reach ALL PASS; documented with evidence for each check
- BASELINE_LOCK written to `clients/<new-client-id>/psee/runs/<new-run-id>/BASELINE_LOCK`
- Run is canonically authoritative; any FAIL means this step is NOT complete

CODE
- Validation matrix filled: every check marked PASS or FAIL with specific evidence citation
- BASELINE_LOCK file present; run_id and code tag recorded in lock

PRODUCT
- Delivery gate cleared; LENS report is the confirmed deliverable artifact
- Engagement is complete; product is ready for client presentation

PUBLISH
- PUBLISH brain claims marked ACTIVATED may now be used in external communications
- All deferred claims remain deferred; no claim escalation without additional maturity conditions met

---

## 4. MINIMUM VIABLE EXECUTION PATH

This is the narrowest path that can produce a PASS on all 7 validation matrix groups.

### Prerequisites

1. Steps 0–6 complete (client registered; BlueEdge defaults removed; validators parameterized; LENS generator parameterized; tier2_data parameterized; graph export parameterized; brain emission template defined)
2. Second-client evidence staged at a local path (real evidence — no synthetic data)
3. Code tag for PSEE runtime recorded (for deterministic rerun readiness)
4. Python environment confirmed (version, dependencies)

### Execution Path (PSEE-based with Brain-Governed Onboarding)

```
[ONBOARDING]  STEP 0 — Brain-Governed Onboarding
                → Client identity registered (CANONICAL)
                → Directory scaffold created (CODE)
                → Operator checklist confirmed (PRODUCT)
                → No external claim activated (PUBLISH)

[S0]  pios intake create + pios ledger create
[S1]  psee/run_end_to_end.py (INTAKE + LINEAGE stages)
[S2]  psee/run_end_to_end.py (STRUCTURE stage)
[S3]  psee/run_end_to_end.py (TRANSFORMATION + ENVELOPE stages)
[S4a] psee/run_end_to_end.py --target gauge (VALIDATION stage → gauge_state.json)
[S4b] psee/build_evidence_vault.py (vault generation)
[S4c] projection_runtime.py export_fragments + export_graph_state.mjs
[S4d] lens_report_generator.py --client --run-id (LENS report)
[V]   PiOS validators + validation_matrix.md manual pass/fail
[B]   brain_emission_plan.md population (all 4 brains)
```

### Validation Checkpoints

| Checkpoint | Condition | Brain Authority | Validator |
|---|---|---|---|
| CP-0: Onboarding | Client registered; scaffold present; no BlueEdge references | CANONICAL | Manual + registry check |
| CP-1: S0 complete | `intake_record.json` present; no BlueEdge source references | CANONICAL | Manual + grep |
| CP-2: S1 complete | PSEE LINEAGE exit code 0; coverage_state.json present | CODE | PSEE exit code |
| CP-3: S2 complete | canonical_topology.json present; domain count > 0 | CANONICAL | Manual |
| CP-4: S3 complete | signal_registry.json present; binding outputs present | CANONICAL | Manual |
| CP-5: S4 GAUGE | gauge_state.json present; score in 0–100; decision state present | CANONICAL | Manual |
| CP-6: S4 LENS | Report HTML present; zero BlueEdge references | PUBLISH | grep commands (STEP 12) |
| CP-7: Validation matrix | All 7 groups ALL PASS | CANONICAL | validation_matrix.md |
| CP-8: Brain emissions | All 4 brain domains populated per template | All 4 Brains | brain_emission_plan.md |

### Explicit PASS Criteria

A run is authoritative when ALL of the following are true:

1. PSEE pipeline exits at code 0
2. All required package artifacts present in `clients/<new-client-id>/psee/runs/<new-run-id>/package/`
3. PiOS validators for 40.2–40.4 PASS with second-client run ID
4. LENS report HTML contains zero occurrences of "blueedge", BlueEdge run IDs, or BlueEdge domain names
5. GAUGE score is in 0–100 range; decision state is PROCEED / INVESTIGATE / ESCALATE
6. All 7 validation matrix criteria groups reach ALL PASS
7. All four brain domains populated with at least minimum required fields per STEP 6 template
8. BASELINE_LOCK written to `clients/<new-client-id>/psee/runs/<new-run-id>/BASELINE_LOCK`

### Brain Governance Validation

Before declaring the run authoritative, confirm:

- Every step in the remediation sequence was executed under brain governance: each step's CANONICAL, CODE, PRODUCT, and PUBLISH brain constraints were observed
- No manual action occurred outside brain scope: every file modified, every command executed, every decision made has a brain owner
- Brain emissions match execution behavior: CODE brain emission records what actually ran; CANONICAL brain emission records what was actually observed; no section contains inference or projection from expected behavior

### Brain Gating Compliance

The following must be confirmed before declaring the run authoritative:

- Every executed step has all ENTRY CONDITIONS satisfied at the time of execution — no step was executed with an unsatisfied entry condition
- Every completed step has all EXIT CONDITIONS verified — no step was declared complete with an unmet exit condition
- No step was executed outside the gating sequence: steps were executed in order 0 → 14 with no skips
- Any step that failed a gate condition was stopped and not resumed until the failure was resolved
- The gate compliance record is part of the CODE brain emission: document any gate that was challenged and how it was resolved

---

## 5. DEFERRED ITEMS

The following are NOT required before the first second-client run and are safe to defer.

| Item | Deferral basis | Brain authority at deferral point |
|---|---|---|
| RBAC implementation | Validation matrix group 7 requires documentation of attachment points only, not implementation | CANONICAL — attachment points must be documented; CODE — implementation deferred |
| Audit log implementation | Same basis as RBAC | Same as above |
| Onboarding UI | Engagement is operator-executed; future UI is a PRODUCT brain emission output, not a run prerequisite | PRODUCT brain deferred to post-run |
| GAUGE scoring formula standalone document (GAP-17) | Scoring behavior observable from run output; formula location does not gate execution or validation | CANONICAL — document after run |
| Tier-2 graph panel in commercial briefs (docs/commercial/) | Commercial brief is a PUBLISH brain artifact (sales surface); not part of validation matrix | PUBLISH brain — update after second-client run confirms portability |
| Multi-repo source scaling (GAP-22) | Architecturally supported; single-source intake sufficient for this run | CODE brain deferred |
| Brain emission automation script (GAP-13 partial) | Manual fill sufficient for first run | CODE brain deferred |
| 41.1 semantic layer rebuild (GAP-06) | PSEE derives topology at runtime; docs/pios/41.1/ is PiOS methodology documentation for BlueEdge | CANONICAL — post-run CODE brain emission documents the delta |
| client_template_01 formal promotion (GAP-16) | STEP 0 scaffold is created manually; template promotion is a process improvement | PRODUCT brain deferred |
| Git live source adapter (`git_repository` selector type) | Intake selector model declares this type; adapter implementation not required for local_directory run | CODE brain deferred |
| Jira live source adapter (`jira_export` selector type) | Intake selector model declares this type; adapter implementation not required for initial run | CODE brain deferred |
| Confluence live source adapter (`confluence_export` selector type) | Intake selector model declares this type; adapter implementation not required for initial run | CODE brain deferred |
| A3S selector framework implementation (`a3s_future` selector type) | Intake selector model declares this type as a future capability; full A3S framework requires a dedicated stream | CODE brain deferred to A3S stream |

**Note on intake selector deferral boundary:** The selector model itself is NOT deferred. The `intake_selector_record`, the `source_selector` schema, and the `local_directory` resolution path are required artifacts before STEP 0 executes. Only additional adapters beyond `local_directory` are deferred.

---

## 6. RISK REGISTER

**RISK-01: PSEE pipeline fails on second-client evidence structure**
Trigger: Evidence format or volume not handled by PSEE intake/lineage stages
Mitigation: CANONICAL BRAIN — confirm evidence passes PRODUCTIZE.RAW.SOURCE.INTAKE.01 intake validation before staging. CODE BRAIN — run PSEE with `--fail-on-warning true`. If pipeline fails, record failure mode in CODE brain emission; do not proceed to S4 with a partial run.

**RISK-02: LENS report contains BlueEdge content after parameterization**
Trigger: An unparameterized constant in `lens_report_generator.py` survives STEP 3; grep finds a match
Mitigation: CODE BRAIN — after STEP 3, run STEP 12 grep against the BlueEdge report as a reference baseline. Then run against the second-client report. Any match is a hard stop — return to STEP 3. CANONICAL BRAIN — a contaminated report is a canonical isolation failure; the run is not authoritative until clean.

**RISK-03: GAUGE score invalid or no decision state**
Trigger: Insufficient canonical derivation (too few domains or signals) to produce a valid GAUGE score
Mitigation: CANONICAL BRAIN — after S2, inspect `canonical_topology.json` domain count before proceeding. If below coverage floor, stop and escalate; do not proceed to S4. CODE BRAIN — record stop condition in execution log. PRODUCT BRAIN — record as minimum evidence volume finding in PRODUCT brain emission.

**RISK-04: Validator parameterization introduces logic change**
Trigger: STEP 2 modification inadvertently changes validator logic, not just comparison target
Mitigation: CODE BRAIN — change is scoped strictly to: accept `--expected-run-id` parameter; replace one hardcoded string. CANONICAL BRAIN — run modified validator against BlueEdge run with `--expected-run-id run_02_blueedge` before using against second client; must still PASS.

**RISK-05: Brain emissions contain inference or omit required sections**
Trigger: Post-run fill introduces claims not traceable to run artifacts, or a brain domain section is left blank
Mitigation: CANONICAL BRAIN — state only observed invariants; mark uncertain items "unconfirmed." CODE BRAIN — record only commands actually run and files actually modified. PRODUCT BRAIN — record only measured timings and observed volumes. PUBLISH BRAIN — leave unactivatable claims blank; mark each activated claim's evidence explicitly.

---

## 7. OPEN DECISIONS

The PiOS/PSEE architectural clarification resolved GAP-12, GAP-01 (as methodology-only), and GAP-03. Three decisions remain unresolved because they require information external to the repository:

**DECISION-01: Second-client business_client_id and UUID**
Required for: STEP 0 (client registration), all downstream commands
Brain authority: CANONICAL BRAIN (client identity is a canonical act)
What is needed: A codename or anonymized identifier and a newly generated UUID

**DECISION-02: Tenant parameter mapping**
Required for: STEP 7 (`pios ig materialize --tenant`)
Brain authority: CODE BRAIN (parameter resolution is an implementation question)
What is needed: Confirm whether `--tenant` maps to client UUID or requires a separate tenant directory

**DECISION-03: Intake Selector**
Required for: STEP 0 (intake_selector_record creation) and STEP 7 (pipeline execution)
Brain authority: CANONICAL BRAIN (evidence boundary is a canonical gate); CODE BRAIN (selector_type to source resolution)
What is needed:
- `selector_type` — required; from supported types; `local_directory` for initial run
- `source_uri` — required; resolvable path or URI to the evidence source
- `source_version` — required; version or snapshot identifier for evidence reproducibility (e.g. directory snapshot date, archive checksum)
- `evidence_boundary` — required; scope declaration including period, included evidence types, and any exclusions
- `checksum_manifest` — required; for deterministic rerun verification; SHA-256 of root evidence set or path to manifest file

If DECISION-01, DECISION-02, and DECISION-03 are resolved, there are no remaining architectural or technical decisions blocking execution.

---

## 8. BRAIN GOVERNANCE COVERAGE

This section maps each pipeline stage to the brain that governs it, the brain that implements it, the brain that observes product implications, and the brain that governs external expression.

| Stage | CANONICAL BRAIN governs | CODE BRAIN implements | PRODUCT BRAIN observes | PUBLISH BRAIN gates |
|---|---|---|---|---|
| Onboarding (STEP 0) | Client entity model; registry entry as canonical existence | Registration mechanism; directory scaffold | Onboarding flow; operator checklist; time-to-onboarding | No claim activated; client identity is confidential |
| S0 — Evidence Boundary | Evidence boundary definition; intake record as canonical gate; no output before valid S0 | `pios intake create` + `pios ledger create` | Intake session duration; evidence volume estimate | No claim; internal governance act |
| S1 — Ingestion | Evidence chain traceability from raw source; L1 layer ownership | PSEE INTAKE + LINEAGE stages | Time-to-S1-complete; coverage profile | No claim; S1 outputs are internal |
| S2 — Core Derivation | Canonical topology derivation; domain count from evidence (not preset); signal evidence grounding | PSEE STRUCTURE + TRANSFORMATION stages | Domain count; capability surface coverage; evidence density | No claim; derivation is internal canonical truth |
| S3 — Activation | Signal-to-structure binding rules; projection boundary definition; ZONE-2 as external surface filter | PSEE TRANSFORMATION + ENVELOPE stages | Activation output characteristics | No claim; activation outputs are internal until ZONE-2 filters them |
| S4 — GAUGE + LENS | GAUGE score derivation from canonical evidence; decision state vocabulary (PROCEED / INVESTIGATE / ESCALATE) | GAUGE package artifact production; vault build; fragment export; lens_report_generator.py | LENS report as sellable artifact; format, sections, executive readability | LENS report is the external surface; content, claims, prohibited language governed by PUBLISH brain |
| Validation | Canonical methodology compliance (all 7 validation matrix groups must ALL PASS before authoritative) | PiOS validators + validation_matrix.md execution | Validation PASS = delivery gate | Validated run enables specific PUBLISH brain claim activation |
| Brain Emission | Confirmed invariants; broken invariants; new structural definitions; internal/external distinction | Commands executed; scripts modified; failure modes; RBAC attachment points | Time-to-output evidence; minimum evidence requirements; client package definition | Safe claims with activation conditions; prohibited claims list |
