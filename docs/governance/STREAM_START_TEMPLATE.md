STREAM START TEMPLATE
Authoritative generation template for all execution streams.

RULES
- Fill this template only
- No extra sections
- No prose before or after
- No invariant restatement
- No per-stream validator creation in normal execution streams
- Delta only
- PRE-FLIGHT and PRE-CLOSURE are mandatory

CONTRACT START

STREAM ID
{{STREAM_ID}}

PROGRAM
Krayu — Program Intelligence Discipline

LAYER
{{LAYER}}

ROLE
Claude Code — Execution Engine

MODE
STRICT EXECUTION
COMPRESSED CONTRACT
DELTA ONLY

FAMILY
{{FAMILY}}

FAMILY RESOLUTION
{{FAMILY_RESOLUTION}}

ARTIFACT MODE
{{ARTIFACT_MODE}}

VALIDATION COVERAGE
{{VALIDATION_COVERAGE}}

FALLBACK MODE
{{FALLBACK_MODE}}

PRE-FLIGHT (MANDATORY)
- scripts/governance/validate_stream_open.sh <this_contract>
- if FAIL → STOP

OBJECTIVE
{{OBJECTIVE}}

SCOPE
{{SCOPE}}

INPUTS
{{INPUTS}}

TARGET NAMESPACE
{{TARGET_NAMESPACE}}

OUTPUTS
{{OUTPUTS}}

DELTA
{{DELTA}}

INVOKE
{{INVOKE}}

STREAM-SPECIFIC INSTRUCTIONS
{{STREAM_SPECIFIC_INSTRUCTIONS}}

FAIL-SAFE RULE
{{FAIL_SAFE_RULE}}

PRE-CLOSURE (MANDATORY)
- scripts/governance/validate_execution.sh <repo_root> <stream_id> <target_namespace>
- if FAIL → STOP

CONTRACT END
