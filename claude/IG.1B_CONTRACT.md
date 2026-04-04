CONTRACT START

STREAM ID
IG.1B

PARENT STREAM
IG.1

PROGRAM
Krayu — Program Intelligence Discipline

LAYER
INGESTION

ROLE
Claude Code — Execution Engine

MODE
STRICT EXECUTION
NO DESIGN DRIFT
NO REINTERPRETATION

ARTIFACT MODE
PRODUCE

STATUS
ACTIVE

OBJECTIVE
Bind IG.1 baseline re-ingestion to the governed bootstrap contract defined in IG.1A, using the original baseline snapshot only, with no variant and no downstream PiOS execution.

PREREQUISITE
IG.1A COMPLETE

BASELINE ANCHORS
- pios-core-v0.4-final
- demo-execlens-v1-final
- governance-v1-final

ANCHOR RULE
These anchors are READ-ONLY reference points.
No writes are allowed on them.

WORKING BRANCH RULE
Use:
work/ig-foundation

If not already on this branch, switch to it.
No IG.1B work may occur on any anchor branch or tag.

SCOPE
This contract is limited to baseline re-ingestion binding only.

IN SCOPE
- bind execution to IG.1A bootstrap artifacts
- identify and validate baseline snapshot source
- define re-ingestion input boundary
- define regeneration target paths
- define comparison reference paths
- define no-variant execution state
- define downstream blocked state

OUT OF SCOPE
- 40.2 regeneration execution
- 40.3 regeneration execution
- 40.4 regeneration execution
- invariance comparison execution
- variant introduction
- GitHub live connection
- Jira live connection
- demo interaction
- 40.5+ execution

AUTHORITATIVE INPUTS
- ~/Projects/k-pi-core/docs/pios/IG.1A/IG.1A_BOOTSTRAP_INTERFACE_SPEC.md
- ~/Projects/k-pi-core/docs/pios/IG.1A/IG.1A_RUNTIME_VARIABLE_CONTRACT.md
- ~/Projects/k-pi-core/docs/pios/IG.1A/IG.1A_SOURCE_BINDING_MODEL.md
- ~/Projects/k-pi-core/docs/pios/IG.1A/IG.1A_RUN_MODE_MATRIX.md

OUTPUT PATH
~/Projects/k-pi-core/docs/pios/IG.1B/

REQUIRED ARTIFACTS
- IG.1B_BASELINE_BINDING.md
- IG.1B_INPUT_BOUNDARY.md
- IG.1B_REGENERATION_TARGETS.md
- IG.1B_EXECUTION_READINESS.md

MANDATORY BINDING CONDITIONS
- SOURCE_MODE = SNAPSHOT
- SNAPSHOT_VARIANT_ENABLED = NO
- RUN_MODE = BASELINE_REINGESTION
- baseline snapshot explicitly identified
- evidence root explicitly identified
- output root explicitly identified
- comparison reference paths explicitly identified
- downstream 40.5+ state explicitly marked BLOCKED

RULES
- no modification of baseline anchors
- no hidden assumptions
- no hardcoded secrets
- no live GitHub usage
- no live Jira usage
- no demo/runtime coupling
- no regeneration execution in this step
- no comparison execution in this step
- baseline only
- variant disabled

EXECUTION STEPS
1. Confirm current repo root is:
   ~/Projects/k-pi-core

2. Confirm active branch is:
   work/ig-foundation

3. Read IG.1A artifacts:
   - IG.1A_BOOTSTRAP_INTERFACE_SPEC.md
   - IG.1A_RUNTIME_VARIABLE_CONTRACT.md
   - IG.1A_SOURCE_BINDING_MODEL.md
   - IG.1A_RUN_MODE_MATRIX.md

4. Create output directory:
   ~/Projects/k-pi-core/docs/pios/IG.1B/

5. Write:
   - IG.1B_BASELINE_BINDING.md
   - IG.1B_INPUT_BOUNDARY.md
   - IG.1B_REGENERATION_TARGETS.md
   - IG.1B_EXECUTION_READINESS.md

ARTIFACT REQUIREMENTS

IG.1B_BASELINE_BINDING.md
Must define:
- active baseline anchor reference
- active working branch
- baseline snapshot identity
- baseline snapshot location
- run mode
- source mode
- variant state = disabled

IG.1B_INPUT_BOUNDARY.md
Must define:
- allowed baseline inputs
- forbidden inputs
- evidence-only boundary
- no reuse of generated 40.2/40.3/40.4 artifacts as inputs
- no live adapter sources

IG.1B_REGENERATION_TARGETS.md
Must define:
- fresh regeneration target locations for 40.2
- fresh regeneration target locations for 40.3
- fresh regeneration target locations for 40.4
- reference comparison locations for existing baseline artifacts
- read-only comparison rule

IG.1B_EXECUTION_READINESS.md
Must define:
- readiness checklist for IG.1C
- blocked items
- missing prerequisites if any
- final readiness verdict: PASS | PARTIAL | FAIL

VALIDATION
PASS only if:
- all 4 artifacts are written
- baseline binding is explicit
- input boundary is explicit
- regeneration targets are explicit
- variant is explicitly disabled
- downstream execution remains blocked
- no drift into regeneration/comparison/runtime occurs

FAIL SAFE
- if active branch is not work/ig-foundation → FAIL
- if baseline snapshot cannot be explicitly bound → FAIL
- if fewer than 4 artifacts are written → PARTIAL
- if 0 artifacts are written under PRODUCE mode → GOVERNANCE_FAIL

RETURN
Return only:
- files written
- active branch
- baseline binding status
- execution readiness status
- artifact check result
- readiness for IG.1C

NEXT
IG.1C — Baseline Re-ingestion Execution

CONTRACT END
