STREAM CONTRACT

STREAM ID
{{STREAM_ID}}

PROGRAM
Krayu — Program Intelligence Discipline

ROLE
Claude Code — Execution Engine

MODE
{{MODE}}

FAMILY
{{FAMILY}}

FAMILY RESOLUTION
{{FAMILY_RESOLUTION}}
Values: KNOWN | UNKNOWN | UNREGISTERED
If UNKNOWN or UNREGISTERED: switch to FAMILY_DISCOVERY mode. Do not proceed with compressed execution.

VALIDATION COVERAGE
{{VALIDATION_COVERAGE}}
Values: FULL | PARTIAL | NONE
If NONE: switch to VALIDATION_DISCOVERY mode. Do not proceed with compressed execution.
If PARTIAL: FALLBACK MODE and FAIL-SAFE RULE must be declared.

FALLBACK MODE
{{FALLBACK_MODE}}
Values: REASSESS | PROCEED | BLOCK
REASSESS = stop normal execution, return reassessment artifacts only
PROCEED = continue under partial coverage with explicit risk declaration
BLOCK = halt entirely until coverage is resolved

FAIL-SAFE RULE
{{FAIL_SAFE_RULE}}
State explicitly: what condition triggers fail-safe, and what the engine must return.

OBJECTIVE
{{OBJECTIVE}}

SCOPE
{{SCOPE_BULLETS}}

INPUTS
{{INPUT_BULLETS}}

OUTPUTS
{{OUTPUT_BULLETS}}

DELTA
{{DELTA_BULLETS}}

INVOKE
{{INVOKE_BULLETS}}

STREAM-SPECIFIC INSTRUCTIONS
{{INSTRUCTION_BULLETS}}

RETURN MODE
{{RETURN_MODE}}
