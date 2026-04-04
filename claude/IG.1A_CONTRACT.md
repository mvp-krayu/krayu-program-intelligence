CONTRACT START

STREAM ID
IG.1A

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
Define the bootstrap contract required to start IG.1 ingestion execution reproducibly, without hidden assumptions and without polluting the protected baseline anchors.

BASELINE ANCHORS
- pios-core-v0.4-final
- demo-execlens-v1-final
- governance-v1-final

ANCHOR RULE
These anchors are READ-ONLY reference points.
No writes are allowed on them.

WORKING BRANCH RULE
Create or switch to:
work/ig-foundation

All IG.1A work must be performed on that branch only.

SCOPE
This contract is limited to bootstrap definition only.

IN SCOPE
- bootstrap interface definition
- runtime variable contract
- source binding model
- run mode matrix

OUT OF SCOPE
- ingestion execution
- 40.2 regeneration
- 40.3 regeneration
- 40.4 regeneration
- invariance comparison
- variant introduction
- GitHub live connection
- Jira live connection
- demo interaction

OUTPUT PATH
~/Projects/k-pi-core/docs/pios/IG.1A/

REQUIRED ARTIFACTS
- IG.1A_BOOTSTRAP_INTERFACE_SPEC.md
- IG.1A_RUNTIME_VARIABLE_CONTRACT.md
- IG.1A_SOURCE_BINDING_MODEL.md
- IG.1A_RUN_MODE_MATRIX.md

MANDATORY BOOTSTRAP FIELDS
- WORKSPACE_ROOT
- REPO_ROOT
- BASELINE_ANCHOR
- SOURCE_MODE
- SNAPSHOT_BASELINE_PATH
- SNAPSHOT_VARIANT_ENABLED
- RUN_MODE
- EVIDENCE_ROOT
- OUTPUT_ROOT

RULES
- no modification of baseline anchors
- no hidden assumptions
- no hardcoded secrets
- no live GitHub usage
- no live Jira usage
- no demo/runtime coupling
- bootstrap definition only

EXECUTION STEPS
1. Confirm current repo root is:
   ~/Projects/k-pi-core

2. Confirm protected anchors exist as reference only:
   - pios-core-v0.4-final
   - demo-execlens-v1-final
   - governance-v1-final

3. Create or switch to working branch:
   work/ig-foundation

4. Create output directory:
   ~/Projects/k-pi-core/docs/pios/IG.1A/

5. Write:
   - IG.1A_BOOTSTRAP_INTERFACE_SPEC.md
   - IG.1A_RUNTIME_VARIABLE_CONTRACT.md
   - IG.1A_SOURCE_BINDING_MODEL.md
   - IG.1A_RUN_MODE_MATRIX.md

VALIDATION
PASS only if:
- working branch is isolated from anchors
- all 4 artifacts are written
- bootstrap fields are explicit
- no hidden variables remain
- no execution drift into ingestion/runtime occurs

FAIL SAFE
- if branch isolation is not established → FAIL
- if fewer than 4 artifacts are written → PARTIAL
- if 0 artifacts are written under PRODUCE mode → GOVERNANCE_FAIL

RETURN
Return only:
- files written
- active branch
- bootstrap contract status
- artifact check result
- readiness for IG.1B

NEXT
IG.1B — Baseline Re-ingestion Binding

CONTRACT END
