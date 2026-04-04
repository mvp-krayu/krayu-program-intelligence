CONTRACT START

STREAM ID
IG.1R

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
Correct the single narrow ingestion drift identified by IG.1D in:
docs/pios/runs/run_02_blueedge/40.4/entity_telemetry.md
so that the regenerated 40.4 output becomes fully invariant with baseline for the CE-003 section.

PREREQUISITES
- IG.1A COMPLETE
- IG.1B COMPLETE
- IG.1C COMPLETE
- IG.1C-AC PASS
- IG.1D PARTIAL

AUTHORITATIVE DRIFT SOURCE
~/Projects/k-pi-core/docs/pios/IG.1D/IG.1D_DRIFT_CLASSIFICATION.md
~/Projects/k-pi-core/docs/pios/IG.1D/IG.1D_INVARIANCE_VERDICT.md
~/Projects/k-pi-core/docs/pios/IG.1D/IG.1D_LAYER_COMPARISON_REPORT.md

WORKING BRANCH RULE
Use:
work/ig-foundation

SCOPE
This contract is limited to the localized CE-003 correction only.

IN SCOPE
- inspect baseline entity_telemetry.md
- inspect regenerated entity_telemetry.md
- inspect governing 40.3 entity catalog references
- correct CE-003 section only
- remove fabricated references:
  - N-C03
  - M-08
- restore CE-003 description to baseline-equivalent content
- write governed correction artifacts

OUT OF SCOPE
- any other 40.4 file
- any 40.3 file
- any 40.2 file
- re-regeneration of full 40.4 set
- GitHub live connection
- Jira live connection
- demo interaction
- 40.5+ execution

TARGET FILE
~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.4/entity_telemetry.md

OUTPUT PATH
~/Projects/k-pi-core/docs/pios/IG.1R/

REQUIRED ARTIFACTS
- IG.1R_CORRECTION_LOG.md
- IG.1R_CE003_REFERENCE_FIX.md
- IG.1R_POSTFIX_VALIDATION.md

RULES
- correct CE-003 section only
- do not touch any unaffected section
- do not introduce new identifiers
- all entity references must exist in governing 40.3 entity catalog
- baseline remains read-only
- correction must be evidence-grounded
- no extra drift may be introduced

EXECUTION STEPS
1. Confirm current repo root is:
   ~/Projects/k-pi-core

2. Confirm active branch is:
   work/ig-foundation

3. Read:
   - docs/pios/40.4/entity_telemetry.md
   - docs/pios/runs/run_02_blueedge/40.4/entity_telemetry.md
   - governing 40.3 entity catalog
   - IG.1D drift artifacts

4. Correct CE-003 section in:
   docs/pios/runs/run_02_blueedge/40.4/entity_telemetry.md

5. Ensure:
   - N-C03 removed
   - M-08 removed
   - description restored to baseline-equivalent meaning
   - no unsupported identifiers remain

6. Write:
   - IG.1R_CORRECTION_LOG.md
   - IG.1R_CE003_REFERENCE_FIX.md
   - IG.1R_POSTFIX_VALIDATION.md

ARTIFACT REQUIREMENTS

IG.1R_CORRECTION_LOG.md
Must record:
- target file
- corrected section
- exact identifiers removed
- baseline references used
- correction status

IG.1R_CE003_REFERENCE_FIX.md
Must record:
- before state summary
- fabricated identifiers detected
- corrected identifier set
- restored CE-003 description basis

IG.1R_POSTFIX_VALIDATION.md
Must record:
- CE-003 validation result
- entity catalog consistency result
- whether any unsupported identifiers remain
- readiness for IG.1D-R

VALIDATION
PASS only if:
- only CE-003 section was changed
- N-C03 removed
- M-08 removed
- CE-003 description restored
- no unsupported identifiers remain
- all 3 artifacts are written

FAIL SAFE
- if target file cannot be corrected narrowly → FAIL
- if any additional section is modified without need → FAIL
- if 0 artifacts are written under PRODUCE mode → GOVERNANCE_FAIL

RETURN
Return only:
- files written
- active branch
- CE-003 correction status
- unsupported identifier status
- artifact check result
- readiness for IG.1D-R

NEXT
IG.1D-R — Invariance Re-check

CONTRACT END
