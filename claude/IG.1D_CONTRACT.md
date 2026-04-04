CONTRACT START

STREAM ID
IG.1D

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
Execute invariance comparison between the original baseline outputs and the fresh IG.1C regenerated outputs, using rule-based normalization and drift classification only.

PREREQUISITES
- IG.1A COMPLETE
- IG.1B COMPLETE
- IG.1C COMPLETE
- IG.1C-AC PASS

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

AUTHORITATIVE INPUTS
- ~/Projects/k-pi-core/docs/pios/40.2/
- ~/Projects/k-pi-core/docs/pios/40.3/
- ~/Projects/k-pi-core/docs/pios/40.4/
- ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.2/
- ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.3/
- ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.4/
- ~/Projects/k-pi-core/docs/pios/IG.1C-AC/IG.1C_NAMESPACE_FRESHNESS_CHECK.md
- ~/Projects/k-pi-core/docs/pios/IG.1C-AC/IG.1C_BASELINE_INTEGRITY_CHECK.md
- ~/Projects/k-pi-core/docs/pios/IG.1C-AC/IG.1C_ADMISSIBILITY_VERDICT.md

SCOPE
This contract is limited to invariance comparison only.

IN SCOPE
- compare baseline 40.2 vs regenerated 40.2
- compare baseline 40.3 vs regenerated 40.3
- compare baseline 40.4 vs regenerated 40.4
- normalize non-semantic noise before comparison
- classify equivalence and drift
- determine invariance verdict
- write governed comparison artifacts

OUT OF SCOPE
- regeneration
- variant introduction
- GitHub live connection
- Jira live connection
- demo interaction
- 40.5+ execution

OUTPUT PATH
~/Projects/k-pi-core/docs/pios/IG.1D/

REQUIRED ARTIFACTS
- IG.1D_COMPARISON_RULES.md
- IG.1D_LAYER_COMPARISON_REPORT.md
- IG.1D_DRIFT_CLASSIFICATION.md
- IG.1D_INVARIANCE_VERDICT.md

COMPARISON LEVELS

LEVEL 1
PRESENCE
- expected artifacts exist
- no missing artifacts
- no extra uncontrolled artifacts

LEVEL 2
STRUCTURAL SHAPE
- sections exist
- section hierarchy consistent
- entity/object class structure consistent

LEVEL 3
ENTITY SET EQUIVALENCE
- same entities
- same normalized identifiers
- no missing or additional entities

LEVEL 4
RELATIONSHIP / TOPOLOGY
- same dependencies
- same interfaces
- same graph connectivity

LEVEL 5
TELEMETRY COVERAGE
- same telemetry object classes
- same coverage across structure

LEVEL 6
TELEMETRY VALUES
- values grounded from same evidence class
- no fabricated values
- no missing mandatory fields

LEVEL 7
TRACEABILITY
- traceability links preserved
- no broken references

NORMALIZATION RULES
Before comparison:
- normalize ordering
- normalize identifier casing/path formatting where applicable
- ignore timestamps
- ignore run IDs
- ignore serialization-only differences
- ignore formatting-only differences

DRIFT CLASSIFICATION
- NONE
- STRUCTURALLY_EQUIVALENT
- DRIFT_MINOR
- DRIFT_MAJOR
- DRIFT_CRITICAL

VERDICT RULES
PASS
- NONE or STRUCTURALLY_EQUIVALENT only

PARTIAL
- DRIFT_MINOR only

FAIL
- DRIFT_MAJOR or DRIFT_CRITICAL

EXECUTION STEPS
1. Confirm current repo root is:
   ~/Projects/k-pi-core

2. Confirm active branch is:
   work/ig-foundation

3. Create output directory:
   ~/Projects/k-pi-core/docs/pios/IG.1D/

4. Compare:
   - docs/pios/40.2/ vs docs/pios/runs/run_02_blueedge/40.2/
   - docs/pios/40.3/ vs docs/pios/runs/run_02_blueedge/40.3/
   - docs/pios/40.4/ vs docs/pios/runs/run_02_blueedge/40.4/

5. Apply normalization rules before classification.

6. Evaluate comparison levels 1 through 7 for each layer.

7. Write:
   - IG.1D_COMPARISON_RULES.md
   - IG.1D_LAYER_COMPARISON_REPORT.md
   - IG.1D_DRIFT_CLASSIFICATION.md
   - IG.1D_INVARIANCE_VERDICT.md

ARTIFACT REQUIREMENTS

IG.1D_COMPARISON_RULES.md
Must record:
- normalization rules applied
- comparison levels used
- admissibility dependency on IG.1C-AC PASS

IG.1D_LAYER_COMPARISON_REPORT.md
Must record:
- 40.2 comparison result
- 40.3 comparison result
- 40.4 comparison result
- per-layer notes at levels 1–7

IG.1D_DRIFT_CLASSIFICATION.md
Must record:
- every detected difference
- normalized classification
- severity class:
  NONE | STRUCTURALLY_EQUIVALENT | DRIFT_MINOR | DRIFT_MAJOR | DRIFT_CRITICAL

IG.1D_INVARIANCE_VERDICT.md
Must record:
- final verdict: PASS | PARTIAL | FAIL
- whether IG.1E is authorized
- whether regeneration methodology is admissible as invariant
- blocking issues if any

VALIDATION
PASS only if:
- all 4 artifacts are written
- all three layers are compared
- normalization is explicit
- drift classification is explicit
- final invariance verdict is explicit

FAIL SAFE
- if comparison cannot be completed for any layer → PARTIAL or FAIL
- if admissibility precondition is not satisfied → FAIL
- if 0 artifacts are written under PRODUCE mode → GOVERNANCE_FAIL

RETURN
Return only:
- files written
- active branch
- 40.2 comparison status
- 40.3 comparison status
- 40.4 comparison status
- drift classification summary
- invariance verdict
- readiness for IG.1E

NEXT
If PASS:
IG.1E — Determinism Re-run

If PARTIAL or FAIL:
IG.1-R — Ingestion Methodology Correction

CONTRACT END
