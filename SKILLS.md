# SKILLS.md — Krayu Execution Pattern Library

**Authority:** EX.0 — Execution Operating Model Hardening
**Date:** 2026-04-04

This file defines reusable execution patterns for Claude Code within the Krayu Program Intelligence operating model.

Purpose:
- reduce contract verbosity
- eliminate repeated structural narration
- keep contracts delta-only
- externalize fixed execution patterns
- reduce token burn and context drift across streams

Core law:
- contracts carry delta only
- family registry carries invariants
- validators carry vocabularies
- templates carry structure
- skills carry invocation

────────────────────────────────────
1. PRELOAD_GATE

Run the standard workspace preflight before any stream execution.

Actions:
- inspect current git branch
- inspect staged files
- inspect unstaged files
- inspect untracked files
- inspect recent relevant commits
- classify preload state

Output:
- PRELOAD PASS
- PRELOAD PARTIAL
- PRELOAD FAIL

Required report fields:
- branch
- staged
- unstaged
- untracked
- prior commits
- preload classification
- preload notes

Rule:
Do not re-explain preload logic in stream contracts. Invoke this pattern by name.

────────────────────────────────────
2. LOAD_CONTEXT <family>

Load the operating context for the declared stream family from:
- docs/governance/FAMILY_REGISTRY.md (registration status)
- docs/governance/families/<family>.md (family definition)
- docs/governance/families/<family>.json (validation profiles)

Resolve:
- family purpose
- family invariants
- standard artifact slots
- state vocabularies
- validation profiles
- handover expectations
- known exclusions

If family is not in FAMILY_REGISTRY.md → invoke RESOLVE_FAMILY first.

Rule:
Do not restate family invariants inside stream contracts unless the stream explicitly overrides them.

────────────────────────────────────
3. APPLY_CONTRACT_TEMPLATE <family>

Use docs/governance/CONTRACT_TEMPLATE.md as the canonical stream contract structure.

Required fields (per EX.0 hardening):
- FAMILY RESOLUTION
- VALIDATION COVERAGE
- FALLBACK MODE
- FAIL-SAFE RULE

Rule:
- fill placeholders only
- keep section order fixed
- declare stream-specific delta only
- do not restate family vocabularies
- do not restate template structure

────────────────────────────────────
4. APPLY_REPORT_TEMPLATE execution_report

Use docs/governance/EXECUTION_REPORT_TEMPLATE.md as the canonical execution report structure.

Rule:
- fill placeholders only
- do not rewrite standard section headers
- do not duplicate invariant sections across artifacts
- keep structural repetition out of free-form prose

────────────────────────────────────
5. APPLY_HANDOVER_TEMPLATE <family>

Use docs/governance/HANDOVER_TEMPLATE.md as the canonical handover structure.

Rule:
- include resulting state only
- include blockers only
- include next entry point only
- exclude re-narration of full stream history unless explicitly required

────────────────────────────────────
6. GOVERNANCE_PACK <family> <stream_id>

Generate the standard governance artifact pack for the stream family.

Default artifact slot model:
1. map or inventory
2. spec
3. definition
4. exposure surface or mechanism
5. boundary contract or constraint
6. validation report
7. execution report

Rule:
- preserve slot function
- allow stream-specific file names
- do not invent new slot classes unless required by stream delta

────────────────────────────────────
7. VALIDATE_STREAM <family> <profile>

Run:
python scripts/pios/validate_stream.py --family <family> --profile <profile> [--input <path>]

Purpose:
- centralize stream validation logic
- eliminate inline throwaway validators
- keep Q-grids and vocabularies in reusable form

Fail-safe behavior:
- unknown family → FAIL_SAFE_STOP (exit 2)
- unknown profile → FAIL_SAFE_STOP (exit 2)
- no payload → FAIL_SAFE_STOP (exit 2)

Rule:
If a required validation is covered by validate_stream.py, do not implement the same validation inline.

────────────────────────────────────
8. BRIDGE_IMPORT <depth>

Insert the standard bridge import pattern into adapter scripts when a stream needs to bind to an upstream runtime bridge.

Parameters:
- depth=1: resolve bridge from parents[1] / "EX.3"
- depth=2: resolve bridge from parents[2] / "pios" / "EX.3"

Rule:
- use one standard import pattern
- do not rewrite the same import block differently across adapters unless path shape truly differs
- narrate only stream-specific deviations

────────────────────────────────────
9. GIT_HYGIENE

Apply standard git hygiene before closure.

Check:
- intended files only staged
- exclude obsolete temporary contracts
- exclude throwaway validation files from /tmp/
- include required scripts, docs, templates, adapters
- verify branch consistency with family file authorized branch

Output:
- git hygiene PASS/FAIL note
- include/exclude summary
- commit readiness note

────────────────────────────────────
10. RETURN_CONTRACT <stream_id>

Return only the required execution return block for the stream.

Rule:
- no extra prose before or after
- no embedded commentary unless explicitly required by stream
- honor stream return mode exactly
- before returning PASS: verify ARTIFACT_PRODUCTION_CHECK passed
- if ARTIFACT MODE = PRODUCE and no artifacts written: return GOVERNANCE_FAIL, not PASS

────────────────────────────────────
10a. ARTIFACT_PRODUCTION_CHECK

Run before any stream closure. Enforces the invariant: no artifacts → no valid execution.

Check:
- read ARTIFACT MODE from the stream contract
- if PRODUCE (or omitted): verify at least one governed artifact was written in this execution
- if NONE: verify the justification is declared in the contract; skip artifact check
- governed artifact = any file written under docs/, scripts/, app/, or root governance files

Output:
- ARTIFACT CHECK PASS — <N> artifact(s) written
- ARTIFACT CHECK NONE-DECLARED — stream declared NONE with justification
- GOVERNANCE_FAIL — ARTIFACT MODE is PRODUCE but zero artifacts written

On GOVERNANCE_FAIL:
- do not mark stream COMPLETE
- do not commit
- do not call RETURN_CONTRACT
- return: stream ID, GOVERNANCE_FAIL, reason (no artifacts produced)

Rule:
ARTIFACT_PRODUCTION_CHECK is mandatory. It cannot be skipped by contract instruction.
OBSERVATION_ONLY or similar stream labels do not exempt a stream from this check unless
ARTIFACT MODE = NONE is explicitly declared in the contract.

────────────────────────────────────
10b. GOVERNANCE_FAIL

Override output when a stream violates a structural invariant.

Triggers:
- ARTIFACT_PRODUCTION_CHECK returns zero artifacts under PRODUCE mode
- VALIDATION COVERAGE = NONE and FALLBACK MODE not declared
- ARTIFACT MODE omitted and no artifacts produced

Output format:
GOVERNANCE_FAIL
stream: <stream_id>
reason: <trigger description>
resolution: <what must be corrected before re-execution>

Rules:
- no normal stream artifacts accompany GOVERNANCE_FAIL
- no git commit
- stream is not COMPLETE
- re-execution requires corrected contract or declared ARTIFACT MODE = NONE

────────────────────────────────────
11. DELTA_ONLY_RULE

All stream contracts must declare only:
- what is new
- what changes
- what is in scope
- what is explicitly excluded

They must not re-declare:
- family invariants
- shared vocabularies
- standard report structure
- standard handover structure
- standard validation logic

────────────────────────────────────
12. NO_REDECLARATION_RULE

The following must exist in one authority location only:

- family registration → FAMILY_REGISTRY.md
- family definitions → docs/governance/families/<ID>.md
- family validation profiles → docs/governance/families/<ID>.json
- contract grammar → STREAM_SCHEMA.md
- contract structure → CONTRACT_TEMPLATE.md
- execution report structure → EXECUTION_REPORT_TEMPLATE.md
- handover structure → HANDOVER_TEMPLATE.md
- stream validation logic → validate_stream.py

If a contract repeats these without necessity, that is a structural error.

────────────────────────────────────
13. STREAM FAMILY ROUTING

Use this routing rule first:

- EX  → execution layer, binding, verification, bridge, trace, debug
- 40  → PiOS core deterministic runtime
- 42  → consumption, query, narrative, delivery demo
- 51  → runtime layer, UI, API, scenario execution
- GOV → canonical governance, registry, control, authority enforcement
- CAT → category authority, construct positioning, authority reinforcement
- WEB → publishing, crawlability, mirror, SEO, route surface

If ambiguous, run RESOLVE_FAMILY before drafting the stream contract.

────────────────────────────────────
14. TARGET OUTCOME

This pattern library exists to guarantee:
- token burn reduction of at least 50 percent vs pre-EX.0 baseline
- no context loss across stream transitions
- deterministic contract compression
- reduced drift between ChatGPT and Claude Code

────────────────────────────────────
15. RESOLVE_FAMILY <candidate>

Check whether the stream family is already registered in docs/governance/FAMILY_REGISTRY.md.

Actions:
- read FAMILY_REGISTRY.md
- if REGISTERED: load docs/governance/families/<candidate>.md
- if CANDIDATE: warn — compressed execution blocked; proceed in FAMILY_DISCOVERY mode
- if not found: return UNREGISTERED; invoke FAMILY_DISCOVERY

Output:
- REGISTERED | CANDIDATE | UNREGISTERED
- family file path if REGISTERED
- recommended action if not REGISTERED

Rule:
Do not proceed with compressed execution if result is not REGISTERED.

────────────────────────────────────
16. FAMILY_DISCOVERY <candidate>

Produce a governed family assessment for a new or unclear stream family.

Output only:
- candidate purpose
- candidate invariants
- candidate artifact slots
- candidate validation needs
- boundary with existing families
- registration recommendation (REGISTER | REJECT | MERGE INTO <existing family>)

Rule:
Do not treat the candidate as fully governed until it appears in FAMILY_REGISTRY.md with status REGISTERED.
Do not run compressed contracts for a candidate family.

────────────────────────────────────
17. VALIDATION_DISCOVERY <family> <stream_type>

Assess whether current validation coverage is sufficient for the stream type.

Actions:
- run: python scripts/pios/validate_stream.py --discover <family> <stream_type>
- if profile exists: confirm coverage and proceed
- if profile missing: produce candidate profile definition

Output (when profile is missing):
- validation gap report
- candidate profile: Q-grid, required paths, enum checks
- payload shape required
- blocking risks if coverage remains absent

Rule:
Do not mark VALIDATION COVERAGE as FULL if a profile does not exist in docs/governance/families/<FAMILY>.json.

────────────────────────────────────
18. FAIL_SAFE_STOP

When family resolution or validation coverage is insufficient, stop compressed execution.

Triggers:
- FAMILY RESOLUTION is not KNOWN
- VALIDATION COVERAGE is NONE
- VALIDATION COVERAGE is PARTIAL with no FAIL-SAFE RULE
- validate_stream.py exits with code 2

Behavior:
- return reassessment output only (per docs/governance/fallback_execution_rules.md §3)
- no normal execution artifacts
- no git commits of normal stream artifacts
- emit: stream ID, trigger condition, recommended resolution path

Rule:
FAIL_SAFE_STOP is not optional. If the trigger condition is met, normal execution is blocked regardless of contract content.

────────────────────────────────────
19. PROFILE_EXTENSION <family> <profile>

Trigger condition (MANDATORY — do not invoke speculatively):
- validate_stream.py exits with FAIL and missing paths are detected, OR
- VALIDATION_DISCOVERY reports missing profile OR incomplete coverage

Actions:
- run: python scripts/pios/validate_stream.py --suggest-extension --family <family> --profile <profile> [--input <payload.json>]
- reads payload, compares against current profile
- generates PROFILE_EXTENSION REPORT (stdout)
- writes PROPOSED entry to docs/governance/families/<FAMILY>.json under proposed_extensions.<profile>

PROFILE_EXTENSION REPORT structure (standard):
- Family
- Profile
- Missing elements detected (failing checks)
- Proposed additions (paths / enums from payload)
- Payload evidence (available paths)
- Impact assessment (existing checks vs proposed new checks)
- Recommendation (CREATE | EXTEND | REVIEW | NO ACTION)
- Status: PROPOSED

Rules:
- PROPOSED entry is written to the family JSON but NOT applied to the live profile
- Proposed extension requires explicit acceptance in a follow-up governed stream
- No implicit profile mutation — proposed_extensions.<profile> is a staging area only
- No inline validator expansion outside this mechanism
- FAIL_SAFE_STOP message when profile is missing must state: "Validation coverage missing — profile extension required"

────────────────────────────────────

────────────────────────────────────

## SKILL: INCOMING_CONTRACT_VALIDATION

**Authority:** PI.PIOS.AMOPS-CONTRACT-TEMPLATE-SYSTEM-AND-RUNTIME-VALIDATION.01
**Date:** 2026-05-12

Purpose:
Validate any incoming contract (typically drafted by ChatGPT) for AMOps compliance before execution. Claude is the enforcement layer — ChatGPT drafts, Claude validates.

Trigger condition (MANDATORY):
- A stream contract is received for execution
- Contract was drafted externally (ChatGPT or operator)

──────────────────────────────────────────────────

### STEP 1 — CLASSIFICATION CHECK

Verify the contract declares a stream classification (G1/G2/G3).

If missing:
- Infer classification from contract content using STREAM_CLASSIFICATION criteria
- Report inferred classification to operator before proceeding

──────────────────────────────────────────────────

### STEP 2 — STRUCTURAL COMPLETENESS

Check contract contains minimum required elements:

| Element | Required |
|---|---|
| Stream ID | YES |
| Classification (G1/G2/G3) or inferable | YES |
| Mission / purpose | YES |
| Scope or deliverables | YES |
| Closure verdict defined | RECOMMENDED |

Missing elements are not blocking — Claude can execute with mission + scope.
Report any gaps to operator as informational.

──────────────────────────────────────────────────

### STEP 3 — TERMINOLOGY CHECK

Scan contract for architectural terms.
Compare against TERMINOLOGY_LOCK.md.

Flag:
- Terms used with wrong definitions
- New terms that may need locking (G1 indicator)
- Potential classification upgrade (contract says G2 but introduces new terms → likely G1)

──────────────────────────────────────────────────

### STEP 4 — SCOPE ASSESSMENT

Check whether contract scope matches declared classification:
- G1 contract that only consumes architecture → suggest G2
- G2 contract that introduces new concepts → flag as likely G1
- G3 contract that references architectural concepts → flag as likely G2

──────────────────────────────────────────────────

### STEP 5 — VALIDATION REPORT

Output to operator before execution:

```
INCOMING CONTRACT VALIDATION
Stream: [stream-id]
Declared classification: [G1/G2/G3 or MISSING]
Validated classification: [G1/G2/G3]
Classification match: YES / UPGRADED / DOWNGRADED

Structural completeness: COMPLETE / GAPS [list]
Terminology compliance: CLEAR / FLAGS [list]
Scope-classification alignment: ALIGNED / MISMATCHED [details]

RECOMMENDATION: EXECUTE / EXECUTE WITH NOTES / RETURN TO DRAFTER
```

If RETURN TO DRAFTER: explain what needs to change.
If EXECUTE WITH NOTES: list what Claude will handle automatically.
If EXECUTE: proceed with AMOps lifecycle.

──────────────────────────────────────────────────

Rules:
- This skill runs BEFORE AMOps preflight
- This skill does NOT block execution for missing AMOps boilerplate — Claude adds that
- This skill DOES flag classification errors that would cause wrong lifecycle
- Operator may override classification after seeing validation report

──────────────────────────────────────────────────

────────────────────────────────────

## SKILL: ARCHITECTURE_MEMORY_SYNC

**Authority:** PI.PIOS.AMOPS-RUNTIME-SELF-APPLICATION-AND-CLAUDE-OPERATING-MODEL-MIGRATION.01
**Date:** 2026-05-12

Purpose:
Synchronize architecture mutations from a G1 stream to the canonical vault.

──────────────────────────────────────────────────

### STEP 1 — MUTATION LOG REVIEW

Review the architecture mutation log maintained during execution.

Check:
- all architectural changes captured
- new concepts identified with status
- status changes recorded with old → new
- terminology additions/changes identified
- supersessions documented

Output:
- mutation log verified: YES/NO
- missing entries identified: [list or NONE]

──────────────────────────────────────────────────

### STEP 2 — MUTATION DELTA FORMALIZATION

Produce the Architecture Mutation Delta:

```
### New Concepts
- [concept] — [vault section] — [status]

### Status Changes
- [concept] — [old] → [new]

### Terminology
- [term] — [action] — [definition] — [collision check]

### Chronology
- [commit] — [date] — [event] — [stratum]

### Supersessions
- [old concept] → [new concept]

### Git Lineage
- [concept] — new commits: [hash list]
```

──────────────────────────────────────────────────

### STEP 3 — TERMINOLOGY COLLISION CHECK

For each new or changed term:
- check against TERMINOLOGY_LOCK.md
- check against SEMANTIC_COLLISIONS.md
- classify: CLEAR / COLLISION

If COLLISION → STOP → resolve before propagation.

──────────────────────────────────────────────────

### STEP 4 — VAULT PROPAGATION

Update vault files in order:
1. TERMINOLOGY_LOCK.md
2. SEMANTIC_COLLISIONS.md (if needed)
3. Lineage sections (vault/01-05)
4. PIOS_CURRENT_CANONICAL_STATE.md
5. Chronology tables
6. Git lineage sections (vault/09)
7. Runtime state sections (vault/10)
8. Archive sections (vault/12)

──────────────────────────────────────────────────

### STEP 5 — PROPAGATION VERIFICATION

Verify:
- all delta entries mapped to vault files
- no orphan vault updates
- cross-references intact
- terminology consistent
- canonical state updated

Output:
- SYNC PASS — all mutations propagated
- SYNC PARTIAL — [list unpropagated items]
- SYNC FAIL — [reason]

──────────────────────────────────────────────────

### STEP 6 — CLOSURE SECTION 10

Produce CLOSURE.md Section 10 content with:
- stream classification
- full mutation delta
- vault files updated
- propagation verification
- propagation status

──────────────────────────────────────────────────

FAIL CONDITIONS:
- mutation log not reviewed
- collision check skipped
- propagation order violated
- verification not performed
- CLOSURE Section 10 omitted for G1 stream

──────────────────────────────────────────────────

────────────────────────────────────

## SKILL: VAULT_DRIFT_AUDIT

**Authority:** PI.PIOS.AMOPS-RUNTIME-SELF-APPLICATION-AND-CLAUDE-OPERATING-MODEL-MIGRATION.01
**Date:** 2026-05-12

Purpose:
Detect drift between vault state and architectural reality.

──────────────────────────────────────────────────

### STEP 1 — LOAD CANONICAL STATE

Read PIOS_CURRENT_CANONICAL_STATE.md.
Record all concepts listed as CANONICAL or PROVISIONAL.

──────────────────────────────────────────────────

### STEP 2 — CONTENT DRIFT CHECK

For each tracked concept:
- verify concept exists in codebase
- verify status matches actual usage
- verify terminology matches TERMINOLOGY_LOCK.md definitions
- verify git lineage is current

──────────────────────────────────────────────────

### STEP 3 — STRUCTURAL DRIFT CHECK

- scan vault for concepts NOT in PIOS_CURRENT_CANONICAL_STATE.md
- scan codebase for architectural patterns NOT in vault
- verify all wiki-links resolve

──────────────────────────────────────────────────

### STEP 4 — TEMPORAL DRIFT CHECK

- compare canonical state dates against recent G1 stream closures
- compare stream closures against chronology entries
- identify terms in use not in TERMINOLOGY_LOCK.md

──────────────────────────────────────────────────

### STEP 5 — DRIFT REPORT

Produce:

```
## Vault Drift Report
### Date: [date]

### Content Drift
| Concept | Vault State | Actual State | Severity |

### Structural Drift
| Issue | Location | Severity |

### Temporal Drift
| Indicator | Last Updated | Gap | Severity |

### Summary
- Total: [count], HIGH: [count]
- Action: SYNC / GOVERNANCE_REVIEW / ACCEPTABLE
```

──────────────────────────────────────────────────

FAIL CONDITIONS:
- canonical state not loaded before audit
- concepts not verified against codebase
- drift report not produced

──────────────────────────────────────────────────

────────────────────────────────────

## SKILL: STREAM_CLASSIFICATION

**Authority:** PI.PIOS.AMOPS-RUNTIME-SELF-APPLICATION-AND-CLAUDE-OPERATING-MODEL-MIGRATION.01
**Date:** 2026-05-12

Purpose:
Classify a stream as G1, G2, or G3 before execution begins.

──────────────────────────────────────────────────

### STEP 1 — READ CONTRACT

Read the stream contract. Identify:
- what the stream produces
- what concepts it touches
- whether it introduces, modifies, or deprecates architectural state

──────────────────────────────────────────────────

### STEP 2 — APPLY CLASSIFICATION CRITERIA

**G1 indicators (any = G1):**
- introduces a new named concept
- changes an existing concept's status
- deprecates or supersedes an existing concept
- modifies terminology definitions
- changes layer ownership or boundaries
- creates new branch patterns or runtime surfaces
- modifies vault, AMOps, CLAUDE.md, or SKILLS.md

**G2 indicators (all of these, none of G1):**
- implements within existing architectural boundaries
- adds features to existing surfaces
- fixes bugs within existing components
- extends existing patterns without renaming

**G3 indicators:**
- CSS/UI with no architectural implication
- documentation rewording without semantic change
- test additions for existing behavior

──────────────────────────────────────────────────

### STEP 3 — DECLARE CLASSIFICATION

Output:
```
STREAM CLASSIFICATION
Stream: [stream-id]
Classification: G1 / G2 / G3
Evidence: [why this classification]
Vault obligation: MANDATORY / LOAD-ONLY / NONE
```

Record in execution_report.md preflight section.

──────────────────────────────────────────────────

### STEP 4 — RECLASSIFICATION WATCH

If during execution a G2 stream begins mutating architecture:
- STOP
- reclassify as G1
- run full preflight compatibility check
- log reclassification in execution_report.md

──────────────────────────────────────────────────

FAIL CONDITIONS:
- classification not performed before execution
- G1 stream classified as G2 to avoid vault obligations
- reclassification not logged

──────────────────────────────────────────────────

────────────────────────────────────

## SKILL: 4_BRAIN_ALIGNMENT

**Authority:** PRODUCTIZE.LENS.COMMERCIAL.PACKAGE.05
**Amendment date:** 2026-04-22

Purpose:
Ensure every concept or artifact is valid across Canonical, Product, Publish, and Code.

──────────────────────────────────────────────────

### STEP 1 — CLAIM EXTRACTION

Extract all material claims:
- what exists
- what is exposed
- what is stated
- what is actionable

──────────────────────────────────────────────────

### STEP 2 — CANONICAL VALIDATION

For each claim:
- Is it evidence-backed?
- Is it structurally valid?
- Is it defined in Canonical?

Classify:
- EVIDENCE-DERIVABLE
- STRUCTURAL-INFERENCE
- INTERPRETIVE

FAIL if:
- claim has no evidence basis
- concept is undefined

──────────────────────────────────────────────────

### STEP 3 — PRODUCT VALIDATION

Check:
- Is this a defined Product surface?
- Are outputs bounded and repeatable?

Define:
- allowed outputs
- forbidden outputs
- output schema (if applicable)

FAIL if:
- open-ended behavior
- advisory interpretation without contract

──────────────────────────────────────────────────

### STEP 4 — PUBLISH VALIDATION

Check:
- is language safe for external use?
- does it imply:
  - consulting authority?
  - diagnosis certainty?
  - interpretation beyond Product?

Classify:
- SAFE
- DRIFT RISK
- VIOLATION

──────────────────────────────────────────────────

### STEP 5 — CODE VALIDATION

Verify:
- does this capability exist in implementation?

Classify:
- IMPLEMENTED
- PARTIALLY IMPLEMENTED
- NOT IMPLEMENTED

RULE:
- Product MUST NOT exceed Code reality
- If not implemented → mark PRODUCT-NOT-IMPLEMENTED

──────────────────────────────────────────────────

### STEP 6 — ALIGNMENT RESULT

Return:
- classification (PRODUCT / NOT PRODUCT)
- violations
- boundary definition
- required brain updates

──────────────────────────────────────────────────

### STEP 7 — BRAIN UPDATE (IF REQUIRED)

Create or extend nodes in:

- docs/brain/canonical/
- docs/brain/product/
- docs/brain/publish/
- docs/brain/code/

RULES:
- CREATE_ONLY
- no mutation
- must link upstream authority

──────────────────────────────────────────────────

FAIL CONDITIONS:

- any brain skipped
- implicit assumptions
- missing Code validation
- advisory drift not flagged

──────────────────────────────────────────────────
