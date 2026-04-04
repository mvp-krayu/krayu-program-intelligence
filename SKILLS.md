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
