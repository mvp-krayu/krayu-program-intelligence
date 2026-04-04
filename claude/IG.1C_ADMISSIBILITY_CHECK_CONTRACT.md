CONTRACT START

STREAM ID
IG.1C-AC

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
Determine whether the completed IG.1C regeneration run is admissible as invariant evidence before opening IG.1D comparison.

REASON
IG.1 invariance requires:
- immutable baseline
- fresh regeneration namespace
- no overwrite risk
- comparison only against admissible regenerated output

This contract decides whether:
- runs/run_02_blueedge is admissible
or
- IG.1C must be re-executed on a fresh clean namespace

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

SCOPE
This contract is limited to admissibility verification only.

IN SCOPE
- verify whether docs/pios/runs/run_02_blueedge/ existed before IG.1C execution
- verify whether any target file under run_02_blueedge/ existed before IG.1C writes
- verify whether overwrite occurred or cannot be excluded
- verify whether docs/pios/40.2, 40.3, 40.4 remained untouched
- classify admissibility of IG.1C output
- decide whether IG.1D is authorized or blocked

OUT OF SCOPE
- invariance comparison
- regeneration execution
- variant introduction
- GitHub live connection
- Jira live connection
- 40.5+ execution

AUTHORITATIVE INPUTS
- ~/Projects/k-pi-core/docs/pios/IG.1C/IG.1C_EXECUTION_LOG.md
- ~/Projects/k-pi-core/docs/pios/IG.1C/IG.1C_REGENERATION_INVENTORY.md
- git status
- git diff --name-status
- filesystem state for:
  ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/
  ~/Projects/k-pi-core/docs/pios/40.2/
  ~/Projects/k-pi-core/docs/pios/40.3/
  ~/Projects/k-pi-core/docs/pios/40.4/

OUTPUT PATH
~/Projects/k-pi-core/docs/pios/IG.1C-AC/

REQUIRED ARTIFACTS
- IG.1C_ADMISSIBILITY_VERDICT.md
- IG.1C_NAMESPACE_FRESHNESS_CHECK.md
- IG.1C_BASELINE_INTEGRITY_CHECK.md

EXECUTION STEPS
1. Confirm current repo root is:
   ~/Projects/k-pi-core

2. Confirm active branch is:
   work/ig-foundation

3. Create output directory:
   ~/Projects/k-pi-core/docs/pios/IG.1C-AC/

4. Determine whether:
   ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/
   existed before IG.1C execution.

5. Determine whether any files inside:
   ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.2/
   ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.3/
   ~/Projects/k-pi-core/docs/pios/runs/run_02_blueedge/40.4/
   pre-existed before IG.1C writes.

6. Verify baseline integrity for:
   ~/Projects/k-pi-core/docs/pios/40.2/
   ~/Projects/k-pi-core/docs/pios/40.3/
   ~/Projects/k-pi-core/docs/pios/40.4/

7. Write:
   - IG.1C_ADMISSIBILITY_VERDICT.md
   - IG.1C_NAMESPACE_FRESHNESS_CHECK.md
   - IG.1C_BASELINE_INTEGRITY_CHECK.md

ADMISSIBILITY RULES
ADMISSIBLE only if:
- baseline directories 40.2/40.3/40.4 are untouched
- run_02_blueedge namespace was fresh before IG.1C
- no target files existed before IG.1C writes
- overwrite risk is excluded

NON-ADMISSIBLE if:
- run_02_blueedge existed before IG.1C
- any target file existed before IG.1C write
- overwrite occurred or cannot be excluded

If NON-ADMISSIBLE:
- IG.1D is BLOCKED
- next required step is fresh re-execution on a new namespace

VERDICTS
- PASS = admissible, IG.1D may start
- FAIL = non-admissible, IG.1D blocked

VALIDATION
PASS only if:
- all 3 artifacts are written
- namespace freshness is explicitly classified
- baseline integrity is explicitly classified
- admissibility verdict is explicit

FAIL SAFE
- if freshness cannot be established → FAIL
- if baseline integrity cannot be established → FAIL
- if 0 artifacts are written under PRODUCE mode → GOVERNANCE_FAIL

RETURN
Return only:
- files written
- active branch
- namespace freshness verdict
- baseline integrity verdict
- admissibility verdict
- whether IG.1D is authorized or blocked

NEXT
If PASS:
IG.1D — Invariance Comparison

If FAIL:
IG.1C-R — Clean Re-execution On Fresh Namespace

CONTRACT END
