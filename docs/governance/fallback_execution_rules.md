# Fallback Execution Rules

**Authority:** EX.0 — Execution Operating Model Hardening
**Date:** 2026-04-04
**Status:** ACTIVE — binding on all Krayu stream execution

---

## 1. PURPOSE

This document governs what the execution engine (Claude Code) must do when a stream contract declares incomplete or unresolved preconditions. These rules prevent silent assumption leakage, context drift, and ungoverned execution under ambiguous conditions.

---

## 2. TRIGGER CONDITIONS

The following conditions require fallback behavior evaluation before normal execution proceeds:

| Condition | Field | Trigger value |
|---|---|---|
| F-01 | FAMILY RESOLUTION | UNKNOWN or UNREGISTERED |
| F-02 | VALIDATION COVERAGE | NONE |
| F-03 | VALIDATION COVERAGE | PARTIAL with no FAIL-SAFE RULE declared |
| F-04 | FALLBACK MODE | not declared when F-02 or F-03 applies |
| F-05 | FAIL-SAFE RULE | missing or states "none" when PARTIAL or NONE coverage |
| F-06 | Family file | FAMILY RESOLUTION = KNOWN but family file missing from repo |
| F-07 | Profile file | Profile declared but not found by validate_stream.py |

---

## 3. FALLBACK BEHAVIOR BY MODE

### REASSESS

**Triggers:** F-01, F-02, F-03 (unless PROCEED is explicitly declared)

**Behavior:**
- Stop normal execution immediately
- Do not produce normal stream execution artifacts
- Return reassessment artifacts only:
  - framework_gap_assessment.md equivalent for the trigger condition
  - explicit statement of what is unresolved and why
  - recommended resolution path
- Do not mark the stream as complete
- Do not commit normal stream artifacts

**Allowed output while in REASSESS:**
- Gap assessment document
- FAMILY_DISCOVERY output (if F-01)
- VALIDATION_DISCOVERY output (if F-02 or F-07)
- Handover with STATUS: INCOMPLETE — reassessment required

---

### PROCEED

**Triggers:** F-03, F-07 — when PROCEED is explicitly declared in the contract

**Behavior:**
- Continue execution under declared partial coverage
- FAIL-SAFE RULE must explicitly name the uncovered paths and the accepted risk
- All uncovered validation paths must be flagged in the execution report §6 as UNVERIFIED
- Normal artifacts may be produced
- Stream may be marked COMPLETE only if FAIL-SAFE RULE was satisfied

**Forbidden under PROCEED:**
- Inventing validation for uncovered paths (inline ad-hoc validation is not a substitute for governed profiles)
- Claiming FULL validation coverage when PARTIAL was declared

---

### BLOCK

**Triggers:** F-01, F-02, F-04, F-05, F-06 — when BLOCK is explicitly declared, or when no fallback mode is declared at all

**Behavior:**
- Halt entirely
- Return only:
  - BLOCK NOTICE: stream ID, reason, missing precondition
- Take no file writes
- Take no git operations
- Do not produce any execution report

---

## 4. FAIL_SAFE_STOP BEHAVIOR

`FAIL_SAFE_STOP` is the lowest-level fail-safe, invoked by:
- `validate_stream.py` when family or profile is unknown
- The execution engine when a contract's FAIL-SAFE RULE condition is triggered

`FAIL_SAFE_STOP` output must include:
1. The string `FAIL_SAFE_STOP` on its own line
2. The trigger reason
3. The family and profile (if applicable)
4. What would resolve the stop (FAMILY_DISCOVERY or VALIDATION_DISCOVERY)
5. Available known families and profiles (for navigation)

`FAIL_SAFE_STOP` exits with code 2 (distinct from validation FAIL exit code 1 and success exit code 0).

---

## 5. COMPRESSION GUARDRAILS

Compressed execution (delta-only contracts, skill invocations, omitted family invariants) is permitted ONLY when:

| Condition | Required state |
|---|---|
| FAMILY RESOLUTION | KNOWN |
| Family file present | `docs/governance/families/<FAMILY>.md` exists |
| Profile file present | `docs/governance/families/<FAMILY>.json` exists |
| VALIDATION COVERAGE | FULL or PARTIAL with explicit FAIL-SAFE RULE |
| FALLBACK MODE declared | yes |
| FAIL-SAFE RULE declared | yes |

If any of these conditions is not met, the contract must switch to full narration mode or REASSESS mode. Silent compression under unresolved conditions is a structural error.

---

## 6. FAMILY DISCOVERY PROTOCOL

When FAMILY RESOLUTION = UNKNOWN or UNREGISTERED:

1. Invoke `FAMILY_DISCOVERY <candidate>`
2. Produce candidate assessment (purpose, invariants, artifact slots, validation needs, boundary)
3. Add to FAMILY_REGISTRY.md with status CANDIDATE
4. Create `docs/governance/families/<ID>.md`
5. Create `docs/governance/families/<ID>.json` (even if empty — signals registration intent)
6. Do not run compressed contracts for this family until status = REGISTERED

---

## 7. VALIDATION DISCOVERY PROTOCOL

When VALIDATION COVERAGE = NONE or a profile is missing:

1. Invoke `VALIDATION_DISCOVERY <family> <stream_type>` (or `validate_stream.py --discover`)
2. Identify what the stream produces (payload shape)
3. Draft a candidate profile (Q-grid, path checks, enum checks)
4. Add to `docs/governance/families/<FAMILY>.json`
5. Do not treat inline ad-hoc validation as a substitute
6. Once profile is defined, re-assess VALIDATION COVERAGE

---

## 8. WHAT THESE RULES DO NOT GOVERN

- Normal execution when all preconditions are met — these rules are silent
- Engine-level vocabulary enforcement (CE.4/CE.5/CE.2) — governed by family files
- Git operations and branch discipline — governed by CLAUDE.md §7 and family files
