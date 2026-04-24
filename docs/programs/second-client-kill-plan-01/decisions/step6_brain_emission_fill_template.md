# STEP 6 — Brain Emission Fill Template

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 6
**Date:** 2026-04-24
**Branch:** feature/second-client-kill-plan-01
**Baseline commit:** f42fad8

---

## Scope

File modified:

- `docs/programs/second-client-kill-plan-01/brain_emission_plan.md`

Not modified:
- No code files
- No script files
- `clients/blueedge/` — not modified
- `docs/baseline/pios_baseline_v1.0.md` — not modified

---

## Changes Applied

A `### Required Fill Format` block was added at the top of each of the four brain domain sections. Each block defines required fields, minimum content standard, PASS criteria, and INCOMPLETE criteria. Post-execution findings were NOT populated — the template defines review criteria only.

### CANONICAL BRAIN — Required Fill Format (inserted at line 18)

Required fields:
- Confirmed Invariants: at least 3 with evidence references
- Broken Invariants: explicitly resolved (empty list acceptable; placeholder is not)
- New Structural Definitions: at least one entry or explicit "none observed"
- Portable Client Definition: concrete minimum set finding
- Projection Boundary Definition: at least one boundary rule
- Unresolved Canonical Gaps: declared (can be "none")

PASS: all fields populated; ≥3 confirmed invariants with evidence citations; Broken Invariants resolved.
INCOMPLETE: <3 invariants; any placeholder remaining; no evidence references.

### CODE BRAIN — Required Fill Format (inserted at line 104)

Required fields:
- Commands Used: full S0–S4 sequence with exact parameter values (no angle-bracket placeholders)
- Scripts Touched: table complete per script invoked
- Environment Assumptions: confirmed or violated for each pre-defined assumption
- Failure Modes: each pre-defined item resolved
- RBAC Attachment Points: Notes column populated for reachable rows

PASS: command sequence complete with actual values; no placeholder rows; failure modes resolved.
INCOMPLETE: any angle-bracket parameter values remain; placeholder rows in scripts table; failure modes not assessed.

### PRODUCT BRAIN — Required Fill Format (inserted at line 145)

Required fields:
- Time-to-First-Output table: all five stage rows + Total row populated (Start, End, Duration, Notes)
- Minimum Evidence Volume Finding: concrete statement naming specific document types
- Client Package Requirements: confirmed from actual intake
- Sellable LENS Artifact Definition: output format and minimum sections as observed

PASS: all table rows populated; minimum evidence volume is a specific finding; artifact definition populated.
INCOMPLETE: any stage row empty; minimum evidence volume remains a question; artifact definition not populated post-run.

### PUBLISH BRAIN — Required Fill Format (inserted at line 252)

Required fields:
- Safe External Claims table: each of the four claims assigned ACTIVATED or DEFERRED with reason
- Prohibited Claims Confirmation: explicit per-item entry for each of the six prohibited claim categories
- Security-Maturity Claims: each item explicitly marked DEFERRED (none may be ACTIVATED without maturity conditions met)
- Case-Study Candidate Status: declared as CANDIDATE, NOT A CANDIDATE, or PENDING CLIENT CONSENT

PASS: all four claims have activation status; prohibited claims covered per-item; all security claims DEFERRED; case-study status declared.
INCOMPLETE: any claim has no activation status; general statement instead of per-item confirmation; case-study status not declared.

---

## Confirmation: All Four Brains Have Required Fill Format

| Brain | Section present | Location (post-edit) |
|-------|----------------|----------------------|
| CANONICAL | YES | Line 18 |
| CODE | YES | Line 104 |
| PRODUCT | YES | Line 145 |
| PUBLISH | YES | Line 252 |

`grep -c "### Required Fill Format" brain_emission_plan.md` → **4**

---

## Confirmation: Templates Are Criteria-Based

Each Required Fill Format block contains:
- Required fields list: explicit enumeration — no judgment required to identify what must be present
- Minimum content standard: quantified where possible (e.g. "at least 3 confirmed invariants")
- PASS criteria: deterministic — a reviewer either sees the required content or does not
- INCOMPLETE criteria: deterministic — each item names a specific observable deficiency

No Required Fill Format block contains qualitative or editorial standards.

---

## Confirmation: No Post-Execution Findings Populated

All four brain domain sections retain their original post-execution placeholder content:
- CANONICAL: "To be determined post-run" entries unchanged
- CODE: "To be populated post-execution" entries unchanged
- PRODUCT: time-to-output table rows remain empty
- PUBLISH: Safe External Claims activation status not yet populated

The Required Fill Format blocks define the review standard only. Population occurs at STEP 13.

---

## Validation Results

| Check | Result |
|-------|--------|
| `grep -c "### Required Fill Format"` → 4 | PASS |
| CANONICAL BRAIN at line 16, Required Fill Format inserted before first subsection | PASS |
| CODE BRAIN at line 102, Required Fill Format inserted before first subsection | PASS |
| PRODUCT BRAIN at line 204, Required Fill Format inserted before first subsection | PASS |
| PUBLISH BRAIN at line 306, Required Fill Format inserted before first subsection | PASS |
| `git status --short` → only `brain_emission_plan.md` modified | PASS |

---

## STEP 6 Status

**COMPLETE**
