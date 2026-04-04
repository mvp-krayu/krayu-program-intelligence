# STREAM_SCHEMA

Purpose:
Define the canonical grammar for Krayu stream contracts so contracts remain compact, deterministic, and delta-only.

────────────────────────────────────
1. CORE PRINCIPLE

A stream contract is not a narrative memo.
A stream contract is an execution declaration.

Therefore:
- structure must be fixed
- family invariants must not be restated
- vocabularies must not be redefined
- shared patterns must be invoked, not re-described

────────────────────────────────────
2. REQUIRED CONTRACT FIELDS

Every stream contract must use the following top-level fields in this order:

1. STREAM ID
2. PROGRAM
3. ROLE
4. MODE
5. FAMILY
6. FAMILY RESOLUTION
7. VALIDATION COVERAGE
8. FALLBACK MODE
9. FAIL-SAFE RULE
10. OBJECTIVE
11. SCOPE
12. INPUTS
13. OUTPUTS
14. DELTA
15. INVOKE
16. STREAM-SPECIFIC INSTRUCTIONS
17. RETURN MODE

────────────────────────────────────
3. FIELD DEFINITIONS

## STREAM ID
Canonical stream identifier.
Examples:
- EX.2
- 40.7
- WEB-05
- GOV-02

## PROGRAM
Program authority context.
Default:
Krayu — Program Intelligence Discipline

## ROLE
Execution role.
Typical:
Claude Code — Execution Engine

## MODE
Execution constraints.
Examples:
- STRICT EXECUTION
- NO DESIGN DRIFT
- NO REINTERPRETATION
- DELTA ONLY
- READ ONLY

## FAMILY
Must be a family registered in docs/governance/FAMILY_REGISTRY.md.
If the family is not registered, do not use a closed-list value.
Instead: invoke RESOLVE_FAMILY and switch to FAMILY_DISCOVERY mode.
Attempting to use an unregistered family name as if it were valid is a structural error.

## FAMILY RESOLUTION
Declare: KNOWN | UNKNOWN | UNREGISTERED
- KNOWN = family is registered in FAMILY_REGISTRY.md and definition file exists
- UNKNOWN = family exists in the codebase but is not formally registered
- UNREGISTERED = candidate family not yet in registry
If not KNOWN: FALLBACK MODE must be REASSESS or BLOCK. Compressed execution is blocked.

## VALIDATION COVERAGE
Declare: FULL | PARTIAL | NONE
- FULL = all stream outputs have a matching validation profile in the family JSON
- PARTIAL = some outputs are covered; uncovered paths must be declared in FAIL-SAFE RULE
- NONE = no validation profile exists for this stream type
If PARTIAL or NONE: FALLBACK MODE and FAIL-SAFE RULE are mandatory.

## FALLBACK MODE
Required when VALIDATION COVERAGE is PARTIAL or NONE, or when FAMILY RESOLUTION is not KNOWN.
- REASSESS = stop normal execution; return reassessment artifacts only
- PROCEED = continue under declared partial coverage (risk must be explicit in FAIL-SAFE RULE)
- BLOCK = halt until precondition is resolved; return block notice only

## FAIL-SAFE RULE
Explicit statement of: what triggers the fail-safe, and what the engine returns.
Not optional. Must be present in every contract.
Example: "If family resolution or validation coverage cannot be confirmed, stop and return FAIL_SAFE_STOP."

## OBJECTIVE
One short paragraph only.
Describe the purpose of this stream instance.

## SCOPE
Explicit inclusions and exclusions.
Use bullets.

## INPUTS
Only stream-specific inputs.
Do not repeat family-level standard inputs already defined in registry.

## OUTPUTS
Only stream-specific outputs.
Do not restate standard artifact pack if unchanged.

## DELTA
Declare only what is new, changed, corrected, or explicitly excluded.

## INVOKE
List named reusable patterns from SKILLS.md.

## STREAM-SPECIFIC INSTRUCTIONS
Concrete work instructions for this stream only.

## RETURN MODE
State exactly what the execution engine must return.

────────────────────────────────────
4. ALLOWED CONTRACT FLOW

HEADER
OBJECTIVE
SCOPE
INPUTS
OUTPUTS
DELTA
INVOKE BLOCK
STREAM-SPECIFIC INSTRUCTIONS
RETURN MODE

No other top-level sections unless the stream explicitly requires them.

────────────────────────────────────
5. INVOKE SYNTAX

Use one invoke per line.

Canonical form:
- PRELOAD_GATE
- LOAD_CONTEXT EX
- APPLY_CONTRACT_TEMPLATE EX
- APPLY_REPORT_TEMPLATE execution_report
- VALIDATE_STREAM EX debug_trace
- APPLY_HANDOVER_TEMPLATE EX
- RETURN_CONTRACT EX.2

Do not embed long descriptions in the invoke list.

────────────────────────────────────
6. DELTA-ONLY RULE

Contracts must contain only stream-specific delta.

Forbidden repetition:
- family state vocabularies
- standard preload steps
- standard 7-slot artifact explanations
- standard no-write declarations if family already defines them
- standard execution report section narration
- standard handover section narration
- inline regeneration of validator logic

────────────────────────────────────
7. REDECLARATION ERRORS

The following are structural errors unless explicitly justified:

- redefining CE vocabularies in multiple artifacts
- reprinting the same Q-grid in multiple sections
- recreating throwaway validators when standard validator exists
- narrating template structure inside the contract
- repeating no-write assertions in more than one required location

────────────────────────────────────
8. FAMILY PRECEDENCE RULE

Interpretation order:
1. STREAM_SCHEMA.md
2. CONTEXT_REGISTRY.md
3. family-specific contract delta
4. stream-specific instructions

If a contract conflicts with the registry, the conflict must be made explicit in DELTA.

────────────────────────────────────
9. RETURN DISCIPLINE

If RETURN MODE says:
- contract block only
then return contract block only.

If RETURN MODE says:
- execution event log only
then do not include artifact bodies.

If RETURN MODE says:
- handover only
then return handover only.

────────────────────────────────────
10. SUCCESS CONDITION

The stream schema is being followed correctly when:
- a new contract is significantly shorter than prior equivalents
- no family invariant is restated unnecessarily
- validation is invoked, not re-implemented
- templates are filled, not rewritten
- handover is compact and stateful
