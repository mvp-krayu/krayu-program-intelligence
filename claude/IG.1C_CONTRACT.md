CONTRACT START

STREAM ID
IG.1C

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
Execute baseline re-ingestion from the bound BlueEdge baseline snapshot, reproducing fresh 40.2, 40.3, and 40.4 outputs into the governed regeneration target paths, without variant introduction and without downstream 40.5+ execution.

PREREQUISITES
- IG.1A COMPLETE
- IG.1B COMPLETE
- ~/Projects/blueedge-program-intelligence/source-v3.23/ accessible

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
No IG.1C work may occur on any anchor branch or tag.

AUTHORITATIVE INPUTS
- ~/Projects/k-pi-core/docs/pios/IG.1A/IG.1A_BOOTSTRAP_INTERFACE_SPEC.md
- ~/Projects/k-pi-core/docs/pios/IG.1A/IG.1A_RUNTIME_VARIABLE_CONTRACT.md
- ~/Projects/k-pi-core/docs/pios/IG.1A/IG.1A_SOURCE_BINDING_MODEL.md
- ~/Projects/k-pi-core/docs/pios/IG.1A/IG.1A_RUN_MODE_MATRIX.md
- ~/Projects/k-pi-core/docs/pios/IG.1B/IG.1B_BASELINE_BINDING.md
- ~/Projects/k-pi-core/docs/pios/IG.1B/IG.1B_INPUT_BOUNDARY.md
- ~/Projects/k-pi-core/docs/pios/IG.1B/IG.1B_REGENERATION_TARGETS.md
- ~/Projects/k-pi-core/docs/pios/IG.1B/IG.1B_EXECUTION_READINESS.md

SOURCE MODE
SNAPSHOT

RUN MODE
BASELINE_REINGESTION

VARIANT STATE
DISABLED

SCOPE
This contract is limited to baseline regeneration execution only.

IN SCOPE
- validate baseline snapshot accessibility
- execute fresh 40.2 regeneration
- execute fresh 40.3 regeneration
- execute fresh 40.4 regeneration
- write regenerated artifacts only to the IG.1B-defined target paths
- validate regeneration completeness
- write governed execution artifacts for IG.1C

OUT OF SCOPE
- invariance comparison
- baseline vs regenerated analysis
- no-op repeat
- variant introduction
- GitHub live connection
- Jira live connection
- demo interaction
- 40.5+ execution

BASELINE SNAPSHOT
~/Projects/blueedge-program-intelligence/source-v3.23/

REGENERATION TARGET ROOT
~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/

REQUIRED EXECUTION RULES
- use baseline snapshot only
- do not use prior generated 40.2/40.3/40.4 artifacts as inputs
- do not modify existing baseline artifacts
- do not compare in this step
- do not interpret results in this step
- do not continue into 40.5+
- evidence-only derivation
- write only under the governed regeneration targets and IG.1C artifact path

OUTPUT PATH
~/Projects/k-pi-core/docs/pios/IG.1C/

REQUIRED IG.1C ARTIFACTS
- IG.1C_EXECUTION_LOG.md
- IG.1C_REGENERATION_INVENTORY.md
- IG.1C_BOUNDARY_VALIDATION.md
- IG.1C_EXECUTION_READINESS_RETURN.md

REGENERATION REQUIREMENTS

40.2
Regenerate the bound 40.2 artifact set into the IG.1B-defined fresh target location.

40.3
Regenerate the bound 40.3 artifact set into the IG.1B-defined fresh target location.

40.4
Regenerate the bound 40.4 artifact set into the IG.1B-defined fresh target location.

No other layers may be executed.

EXECUTION STEPS
1. Confirm current repo root is:
   ~/Projects/k-pi-core

2. Confirm active branch is:
   work/ig-foundation

3. Confirm baseline snapshot path is accessible:
   ~/Projects/blueedge-program-intelligence/source-v3.23/

4. Read authoritative inputs from IG.1A and IG.1B.

5. Confirm regeneration target root exists or create it:
   ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/

6. Execute fresh 40.2 regeneration using baseline snapshot only.

7. Execute fresh 40.3 regeneration using 40.2-regenerated outputs per governed methodology.

8. Execute fresh 40.4 regeneration using 40.3-regenerated outputs per governed methodology.

9. Write:
   - IG.1C_EXECUTION_LOG.md
   - IG.1C_REGENERATION_INVENTORY.md
   - IG.1C_BOUNDARY_VALIDATION.md
   - IG.1C_EXECUTION_READINESS_RETURN.md

ARTIFACT REQUIREMENTS

IG.1C_EXECUTION_LOG.md
Must record:
- repo root
- active branch
- snapshot path used
- run mode
- source mode
- execution sequence
- layers executed
- target paths written
- execution status per layer

IG.1C_REGENERATION_INVENTORY.md
Must record:
- regenerated 40.2 artifact count
- regenerated 40.3 artifact count
- regenerated 40.4 artifact count
- written paths
- missing artifacts if any

IG.1C_BOUNDARY_VALIDATION.md
Must record:
- baseline snapshot accessibility verdict
- evidence-only boundary verdict
- variant disabled verdict
- 40.5+ blocked verdict
- no-anchor-write verdict

IG.1C_EXECUTION_READINESS_RETURN.md
Must record:
- final execution status: PASS | PARTIAL | FAIL
- blocking issues if any
- whether IG.1D may start
- note that invariance comparison has not yet been executed

VALIDATION
PASS only if:
- baseline snapshot path is accessible
- 40.2 regeneration executed
- 40.3 regeneration executed
- 40.4 regeneration executed
- required outputs are written to the governed target root
- all 4 IG.1C artifacts are written
- no drift into comparison or downstream execution occurs

FAIL SAFE
- if active branch is not work/ig-foundation → FAIL
- if baseline snapshot path is inaccessible → FAIL
- if 40.2/40.3/40.4 regeneration does not complete → PARTIAL or FAIL
- if fewer than 4 IG.1C artifacts are written → PARTIAL
- if 0 artifacts are written under PRODUCE mode → GOVERNANCE_FAIL

RETURN
Return only:
- files written
- active branch
- snapshot accessibility status
- 40.2 status
- 40.3 status
- 40.4 status
- artifact check result
- readiness for IG.1D

NEXT
IG.1D — Invariance Comparison

CONTRACT END
