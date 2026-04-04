CONTRACT START

STREAM ID
EX.D1 — DEMO Surface Verification (Post-Compressed Baseline)

PROGRAM
Krayu — Program Intelligence Discipline

ROLE
Claude Code — Execution Engine

MODE
STRICT EXECUTION
NO DESIGN DRIFT
NO REINTERPRETATION
OBSERVATION ONLY
NO FEATURE WORK
NO UI CHANGES
NO DATA MUTATION

FAMILY
EX

FAMILY RESOLUTION
KNOWN

VALIDATION COVERAGE
AVAILABLE

FALLBACK MODE
NORMAL

FAIL-SAFE RULE
If any step requires modifying UI, adapters, profiles, or execution logic, STOP immediately.
This stream is inspection-only.

OBJECTIVE
Verify that the DEMO surface remains stable and coherent after transition to compressed execution baseline (EX.1).

Confirm that:
- live signal computation does not introduce visible drift
- entry screens remain consistent with prior DEMO expectations
- no unintended exposure of raw/internal structures appears
- UX semantics remain intact

SCOPE
- DEMO application runtime inspection only
- no modification of code, adapters, or data
- no rebuild of UI or components

INPUTS
- current EX baseline (post EX.1F freeze)
- existing DEMO app (42.x layer)
- current adapter outputs (live execution, not static 41.x assumptions)

OUTPUTS
- DEMO surface verification report
- drift classification (NONE / MINOR / MAJOR)
- list of observed inconsistencies (if any)

DELTA
- zero code changes
- zero adapter changes
- zero governance changes
- observation artifacts only

INVOKE
- PRELOAD_GATE
- LOAD_CONTEXT EX
- LOAD_CONTEXT DEMO
- RUN_DEMO_RUNTIME
- APPLY_REPORT_TEMPLATE execution_report
- RETURN_CONTRACT EX.D1

STREAM-SPECIFIC INSTRUCTIONS

1. Launch DEMO application locally.
2. Execute standard flow:
   - landing / entry screen
   - query selection + execution
   - executive panel rendering
   - signal gauges
   - evidence panel
   - topology panel (if present)
   - debug route (if exposed)

3. For each surface, verify:

   A. ENTRY / LANDING
   - no broken layout
   - no missing data
   - no raw/internal structures exposed

   B. EXECUTIVE PANEL
   - narrative still coherent
   - no leakage of signal internals
   - no null/empty placeholders

   C. SIGNAL GAUGES
   - values render correctly
   - no unexpected zeros/nulls
   - no synthetic/static fallback remnants

   D. EVIDENCE PANEL
   - traceability intact
   - no "unknown" artifacts unless expected
   - chain remains readable

   E. TOPOLOGY / NAVIGATION
   - no broken links
   - no invalid paths
   - no missing nodes

   F. DEBUG (SEPARATE)
   - debug data allowed here only
   - must not leak into main UX

4. Compare implicitly with prior DEMO behavior:
   - identify any visible drift introduced by live computation

5. Classify drift:
   - NONE → identical behavior
   - MINOR → acceptable variation (e.g. values differ but UX stable)
   - MAJOR → UX degradation or semantic break

6. Do NOT fix anything.
7. Do NOT modify anything.

SUCCESS CRITERIA
- DEMO runs without errors
- no MAJOR drift detected
- UX remains coherent for first-time user
- live execution does not break presentation layer

RETURN MODE
Return only:
1. execution result summary
2. drift classification (NONE / MINOR / MAJOR)
3. list of issues (if any)
4. readiness verdict for EX.4 (READY / NOT READY)

CONTRACT END
