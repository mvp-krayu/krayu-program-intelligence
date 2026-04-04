# IG.1A — Run Mode Matrix

**Stream:** IG.1A  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** ACTIVE  
**Date:** 2026-04-04  

---

## 1. PURPOSE

This document defines the complete run mode matrix for IG.1 ingestion execution. It specifies what each run mode produces, what it skips, and what validation it performs.

---

## 2. RUN MODE DEFINITIONS

### 2.1 DRY_RUN

**Purpose:** Verify that all bootstrap fields are resolvable and all inputs are accessible. Produce no output artifacts.

| Behavior | Value |
|---|---|
| Resolves bootstrap fields | YES |
| Validates input files exist | YES |
| Runs validators | NO |
| Writes output artifacts | NO |
| Writes `bootstrap_state.json` | YES (to a temporary path only) |
| Writes `validation_log.json` | NO |
| Writes `execution_report.md` | NO |
| Writes `file_changes.json` | NO |
| Writes `CLOSURE.md` | NO |
| Modifies source files | NO |
| Modifies anchor tags | NO |

**Use when:** First-time setup, CI pre-check, environment verification.

**Exit condition:** PASS if all mandatory fields resolve and all input paths exist. FAIL otherwise.

---

### 2.2 VALIDATE_ONLY

**Purpose:** Run all validators against the resolved bootstrap state and available inputs. Produce a validation log only.

| Behavior | Value |
|---|---|
| Resolves bootstrap fields | YES |
| Validates input files exist | YES |
| Runs validators | YES |
| Writes output artifacts | NO (except validation log) |
| Writes `bootstrap_state.json` | YES |
| Writes `validation_log.json` | YES |
| Writes `execution_report.md` | NO |
| Writes `file_changes.json` | NO |
| Writes `CLOSURE.md` | NO |
| Modifies source files | NO |
| Modifies anchor tags | NO |

**Use when:** Checking readiness before committing to a full execution run.

**Exit condition:** PASS if all validators pass. PARTIAL if any validator fails but execution was not attempted. FAIL if bootstrap cannot be resolved.

---

### 2.3 FULL_EXECUTE

**Purpose:** Execute the full ingestion pipeline, producing all governed artifacts.

| Behavior | Value |
|---|---|
| Resolves bootstrap fields | YES |
| Validates input files exist | YES |
| Runs validators | YES |
| Writes output artifacts | YES — all governed artifacts |
| Writes `bootstrap_state.json` | YES |
| Writes `validation_log.json` | YES |
| Writes `execution_report.md` | YES |
| Writes `file_changes.json` | YES |
| Writes `CLOSURE.md` | YES |
| Modifies source files | NO |
| Modifies anchor tags | NO |

**Use when:** Authorized full ingestion execution on `work/ig-foundation`.

**Exit condition:** COMPLETE if all validators pass and all artifacts written. INCOMPLETE if partial artifacts written. FAIL if any validator fails.

---

## 3. MODE COMPARISON MATRIX

| Capability | DRY_RUN | VALIDATE_ONLY | FULL_EXECUTE |
|---|:---:|:---:|:---:|
| Resolve bootstrap | YES | YES | YES |
| Verify input paths | YES | YES | YES |
| Run validators | NO | YES | YES |
| Write `bootstrap_state.json` | temp | YES | YES |
| Write `validation_log.json` | NO | YES | YES |
| Write `execution_report.md` | NO | NO | YES |
| Write `file_changes.json` | NO | NO | YES |
| Write `CLOSURE.md` | NO | NO | YES |
| Write ingestion artifacts | NO | NO | YES |
| Mutation of sources | NO | NO | NO |
| Mutation of anchors | NEVER | NEVER | NEVER |

---

## 4. MODE SELECTION RULES

1. Default mode is `DRY_RUN` if `RUN_MODE` is not set
2. `FULL_EXECUTE` requires prior `VALIDATE_ONLY` PASS in the same execution context, or explicit override declaration in the contract
3. No mode may be elevated mid-run (e.g., DRY_RUN cannot become FULL_EXECUTE without restarting)
4. Mode selection is locked at bootstrap time

---

## 5. FORBIDDEN MODE BEHAVIORS (ALL MODES)

- No live API calls (GitHub, Jira, or other external systems)
- No writes to baseline anchor tags or their commits
- No writes outside `EVIDENCE_ROOT` or `OUTPUT_ROOT`
- No reads from paths not declared in bootstrap state

---

## 6. OUT-OF-SCOPE MODES

The following are explicitly out of scope for IG.1A and must not be implemented or activated:

- `LIVE_INGEST` — live source ingestion
- `VARIANT_COMPARE` — invariance comparison execution
- `DEMO_MODE` — any demo/UI runtime interaction
- `REPAIR` — repair stream execution

Each requires a separate authorized stream contract.

---

## 7. GOVERNANCE

- This matrix is owned by IG.1A
- New run modes require a new stream contract
- No mode may be added without explicit authorization and validator coverage
