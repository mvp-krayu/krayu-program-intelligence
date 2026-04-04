CONTRACT START

STREAM ID
IG.1E

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
Execute determinism re-run for IG.1 by repeating baseline re-ingestion from the same baseline snapshot into a fresh run namespace and verifying that the resulting outputs are invariant against the already admissible regenerated run.

PREREQUISITES
- IG.1A COMPLETE
- IG.1B COMPLETE
- IG.1C COMPLETE
- IG.1C-AC PASS
- IG.1D-R PASS

WORKING BRANCH RULE
Use:
work/ig-foundation

BASELINE ANCHORS
- pios-core-v0.4-final
- demo-execlens-v1-final
- governance-v1-final

ANCHOR RULE
These anchors are READ-ONLY reference points.
No writes are allowed on them.

SOURCE MODE
SNAPSHOT

RUN MODE
NOOP_REPEAT

BASELINE SNAPSHOT
~/Projects/blueedge-program-intelligence/source-v3.23/

REFERENCE REGENERATED RUN
~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/

FRESH TARGET RULE
Determinism re-run must use a fresh namespace.

Required target:
~/Projects/k-pi-core/docs/pios/runs/run_03_blueedge_repeat/

If target already exists:
FAIL

WRITE RULE
CREATE-ONLY

If any target file already exists:
FAIL

SCOPE
This contract is limited to determinism re-run and comparison against the admissible regenerated run.

IN SCOPE
- validate fresh run namespace
- execute fresh 40.2 regeneration
- execute fresh 40.3 regeneration
- execute fresh 40.4 regeneration
- compare run_03_blueedge_repeat against run_02_blueedge
- normalize non-semantic differences
- classify determinism result
- write governed artifacts

OUT OF SCOPE
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
- ~/Projects/k-pi-core/docs/pios/IG.1B/IG.1B_BASELINE_BINDING.md
- ~/Projects/k-pi-core/docs/pios/IG.1B/IG.1B_INPUT_BOUNDARY.md
- ~/Projects/k-pi-core/docs/pios/IG.1B/IG.1B_REGENERATION_TARGETS.md
- ~/Projects/k-pi-core/docs/pios/IG.1B/IG.1B_EXECUTION_READINESS.md
- ~/Projects/k-pi-core/docs/pios/IG.1D-R/IG.1D-R_FINAL_INVARIANCE_VERDICT.md
- ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.2/
- ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.3/
- ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.4/

OUTPUT PATH
~/Projects/k-pi-core/docs/pios/IG.1E/

REQUIRED ARTIFACTS
- IG.1E_EXECUTION_LOG.md
- IG.1E_REPEAT_RUN_INVENTORY.md
- IG.1E_DETERMINISM_COMPARISON.md
- IG.1E_DETERMINISM_VERDICT.md

EXECUTION STEPS
1. Confirm current repo root is:
   ~/Projects/k-pi-core

2. Confirm active branch is:
   work/ig-foundation

3. Confirm baseline snapshot path is accessible:
   ~/Projects/blueedge-program-intelligence/source-v3.23/

4. Confirm fresh target root does not exist:
   ~/Projects/k-pi-core/docs/pios/runs/run_03_blueedge_repeat/

5. Create target root:
   ~/Projects/k-pi-core/docs/pios/runs/run_03_blueedge_repeat/

6. Execute fresh 40.2 regeneration using baseline snapshot only.

7. Execute fresh 40.3 regeneration using 40.2-regenerated outputs per governed methodology.

8. Execute fresh 40.4 regeneration using 40.3-regenerated outputs per governed methodology.

9. Compare:
   - run_02_blueedge/40.2 vs run_03_blueedge_repeat/40.2
   - run_02_blueedge/40.3 vs run_03_blueedge_repeat/40.3
   - run_02_blueedge/40.4 vs run_03_blueedge_repeat/40.4

10. Apply normalization rules:
   - ignore timestamps
   - ignore run IDs
   - ignore provenance-only header differences
   - ignore formatting-only differences
   - normalize ordering and identifiers where applicable

11. Write:
   - IG.1E_EXECUTION_LOG.md
   - IG.1E_REPEAT_RUN_INVENTORY.md
   - IG.1E_DETERMINISM_COMPARISON.md
   - IG.1E_DETERMINISM_VERDICT.md

ARTIFACT REQUIREMENTS

IG.1E_EXECUTION_LOG.md
Must record:
- repo root
- active branch
- snapshot path used
- run mode
- target root
- layers executed
- execution status per layer

IG.1E_REPEAT_RUN_INVENTORY.md
Must record:
- regenerated 40.2 artifact count
- regenerated 40.3 artifact count
- regenerated 40.4 artifact count
- written paths
- missing artifacts if any

IG.1E_DETERMINISM_COMPARISON.md
Must record:
- 40.2 comparison result
- 40.3 comparison result
- 40.4 comparison result
- normalized differences if any
- whether repeat run matches admissible run

IG.1E_DETERMINISM_VERDICT.md
Must record:
- final verdict: PASS | PARTIAL | FAIL
- whether IG.2 may start
- blocking issues if any

VALIDATION
PASS only if:
- run_03_blueedge_repeat was fresh
- all target writes were create-only
- 40.2 regeneration executed
- 40.3 regeneration executed
- 40.4 regeneration executed
- all 4 artifacts are written
- repeat run matches admissible run at NONE or STRUCTURALLY_EQUIVALENT only

FAIL SAFE
- if target namespace already exists -> FAIL
- if any target file already exists -> FAIL
- if baseline snapshot path is inaccessible -> FAIL
- if regeneration does not complete -> PARTIAL or FAIL
- if determinism comparison yields DRIFT_MINOR or worse -> FAIL
- if 0 artifacts are written under PRODUCE mode -> GOVERNANCE_FAIL

RETURN
Return only:
- files written
- active branch
- target freshness status
- 40.2 status
- 40.3 status
- 40.4 status
- determinism comparison summary
- determinism verdict
- readiness for IG.2

NEXT
If PASS:
IG.2 — Adapter Simulation (GitHub + Jira Capsule)

If FAIL:
IG.1-R2 — Determinism Correction

CONTRACT END
