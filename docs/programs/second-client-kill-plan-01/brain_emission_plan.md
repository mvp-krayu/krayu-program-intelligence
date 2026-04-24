# Brain Emission Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01  
Status: PLANNING — no execution performed

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

Structural facts that the second-client run must confirm hold across clients:

- Score derivation formula produces a valid 0–100 result from any conforming evidence boundary
- Domain classification logic is client-agnostic — no BlueEdge-specific assumptions
- GAUGE S0–S4 execution path is reproducible from raw evidence
- CEU computation is deterministic given the same evidence input
- 40.4 handoff validation logic is client-agnostic
- Evidence chain is traceable from output back to raw source for any client

### Broken Invariants

Any assumption previously held as universal that the second-client run reveals as BlueEdge-specific:

- To be determined post-run
- Categories to watch: hardcoded domain thresholds, hardcoded CEU ranges, path assumptions in scripts
- If found: record explicitly, do not patch silently — emit to CODE brain and escalate

### New Structural Definitions

Structural facts that emerge from the second-client run that were not derivable from a single client:

- Cross-client score distribution characteristics (if observable)
- Evidence volume thresholds at which domain count stabilizes
- Signal coverage variance patterns across different organizational types
- Any new canonical topology shape not present in BlueEdge

### Portable Client Definition

- Minimum evidence set required to produce a governed structural output for any client
- Definition of a "conforming evidence boundary" that does not assume BlueEdge evidence shape
- Any domain coverage floor required for GAUGE to produce a valid score

### Projection Boundary Definition

- What constitutes the boundary between internal canonical truth and external projection
- Which outputs are internal-only (evidence chain, derivation steps) vs. externally presentable
- How LENS report content maps to the canonical layer — not as interpretation but as structural derivation

### Internal Truth vs. External Projection Distinction

- Internal: canonical score, domain topology, CEU computation, evidence chain
- External: LENS executive report, GAUGE decision state, sellable projection artifact
- Rule: external projection must be derivable from internal truth — not editorially composed

### Security/Audit Boundary Principles

- The boundary at which a client identity is established is the ledger/onboarding entry point
- Evidence access is governed by client isolation — no cross-client evidence visibility
- GAUGE state and LENS projection are client-scoped outputs — access requires role
- Report export/publish is the final boundary — must be explicitly authorized

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

To be populated post-execution. Record:

- Full command sequence for S0–S4
- Parameters passed at each stage
- Any flags or overrides applied
- Environment setup commands

### Scripts Touched

To be populated post-execution. Record:

| Script | Purpose | Modified? | Change summary |
|---|---|---|---|
| (populate after run) | | | |

Constraint: no script may be modified to hardcode second-client values. Parameterization only.

### Environment Assumptions

To be validated before execution and recorded:

- Python version required
- Required environment variables
- Required directory structure under `clients/<client-id>/`
- Required input file formats for S0/S1

### Failure Modes

Known failure modes from BlueEdge execution to watch for:

- Insufficient evidence volume → domain count below derivable threshold
- Evidence format mismatch → ingestion failure at 40.2
- Missing coherence record → S2 gate failure
- Hardcoded client paths → isolation violation
- Score outside 0–100 range → canonical derivation failure

All failures must be recorded in the run's execution log, not silently handled.

### Report Generator Portability Findings

After LENS projection phase, record:

- Did `lens_report_generator.py` (or equivalent) require any BlueEdge-specific inputs to run?
- Were any hardcoded paths, labels, or BlueEdge client references found in the generator?
- Were any report template sections BlueEdge-specific (e.g. hardcoded domain names, fixed section counts)?
- What parameterization changes, if any, were required to produce a clean second-client output?

### RBAC/Audit Attachment Points Discovered

During execution, record the specific points in the code/runtime path where access control and audit events would attach:

| Location | RBAC applies? | Audit event? | Notes |
|---|---|---|---|
| Onboarding / client creation | Yes | client_created | |
| Ledger submission | Yes | onboarding_submitted | |
| Evidence upload | Yes | source_artifact_uploaded | |
| S0–S1 pipeline start | Yes | pipeline_run_started | |
| S4 GAUGE generation | Yes | gauge_state_generated | |
| S4 LENS report generation | Yes | lens_projection_generated | |
| Report view | Yes | report_viewed | |
| Report export | Yes | report_exported | |

Populate the Notes column with specific function names or entry points found during the run.

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

Questions the second-client run must answer for the product:

- What is the minimum evidence volume required to produce a governed assessment?
- What is the minimum intake session length to reach a valid 40.4 handoff?
- What client preparation is required vs. what can be derived from existing documents?
- What is the actual time-to-first-output on a clean environment?

### Client Package Requirements

From the second-client run, define what a repeatable client package requires:

- Intake document types (confirmed minimum set)
- Pre-engagement checklist (what client must provide vs. what we derive)
- Scope containment rules (what triggers a scope increase)
- Delivery format requirements (report, review session, export)

### Time-to-First-Output Evidence

Record actual elapsed time for each stage:

| Stage | Start | End | Duration | Notes |
|---|---|---|---|---|
| S0 — Evidence boundary | | | | |
| S1 — Ingestion | | | | |
| S2 — Core derivation | | | | |
| S3 — Activation | | | | |
| S4 — Report generation | | | | |
| **Total** | | | | |

This populates the product claim: "time-bounded engagement." Evidence required before any
timing claim appears in product materials.

### Sellable LENS Artifact Definition

After second-client run, define precisely what constitutes the sellable artifact:

- Output format (HTML, PDF, both)
- Minimum required sections for an artifact to be considered executive-ready
- What the client receives: report only, or report + review session + export
- Whether the second-client artifact was presented to the client — and the outcome

### Onboarding Ledger Implications

- What information must be recorded at onboarding for the ledger to be valid?
- What is the minimum ledger entry that gates pipeline execution?
- How does the onboarding record relate to client isolation in the evidence store?

### Future Onboarding UI Requirements

From the second-client run, identify what a future onboarding interface would need to capture:

- Evidence upload fields and validation rules
- Scope definition inputs (domain coverage, engagement type)
- Client identity and contact information
- Confirmation of evidence boundary before pipeline start

### Role/Access Model Implications

From the run, define the minimum role set required for a productized system:

| Role | What they can access | What they cannot access |
|---|---|---|
| Platform Admin | All clients, all runs, all reports | — |
| Krayu Operator | Assigned client runs | Other client data |
| Client Executive Viewer | Their report, decision state | Evidence chain, derivation detail |
| Client Technical Reviewer | Their report + topology | Other client data |
| Auditor | Audit log | Report content |

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

Claims that become supportable after second-client run completes successfully:

| Claim | Condition for activation |
|---|---|
| "The system is client-agnostic" | Zero BlueEdge dependencies confirmed in second-client run |
| "Repeatable across environments" | Second-client run produces governed output from clean evidence |
| "No instrumentation required" | Second-client run completes without system access beyond documents |
| "Time-bounded engagement" | Actual timing evidence recorded for all stages |

No claim may appear in publish surfaces before its condition is met.

### Case-Study Candidates

After second-client run:

- If client grants reference rights: document engagement pattern, trigger condition, decision state produced
- If client is anonymous: publish structural engagement pattern without identifiers
- Case study must be derived from governed output only — no narrative embellishment

### Prohibited Claims

The following must never appear in publish surfaces regardless of second-client outcome:

- Client name, industry, or identifying details without explicit written consent
- Comparative claims against BlueEdge ("our second client also showed...")
- Claims about scale or volume that aren't supported by the specific run evidence
- Any claim implying the second-client evidence is representative of a general population
- Score values or domain counts from either client run
- Any advisory claim about what the client "should do" — output is structural intelligence only

### Claims Requiring Audit/Security Maturity Before Publication

The following claims may only be made once RBAC and audit-log implementation is complete
and verified — not based on planning documents alone:

| Claim | Required maturity condition |
|---|---|
| "Client data is isolated and access-controlled" | RBAC implementation verified in production |
| "All access to evidence and reports is logged" | Audit log implementation verified in production |
| "Compliant with enterprise data governance requirements" | Formal audit/compliance review completed |
| "Multi-client platform" | Client isolation verified across at least two real client runs |

No such claim may appear in publish surfaces until the required maturity condition is met.
