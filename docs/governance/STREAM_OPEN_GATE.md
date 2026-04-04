# STREAM OPEN GATE

**Stream:** GOV.0
**Authority:** GOV family — canonical governance enforcement
**Script:** `scripts/governance/validate_stream_open.sh`
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. PURPOSE

The Stream Open Gate is a universal pre-execution validator. It must be run against any stream contract before execution is authorized. It enforces structural compliance, family registration, and governance invariants without hardwiring to any specific family.

---

## 2. USAGE

```bash
bash scripts/governance/validate_stream_open.sh <contract_file> [--repo-root <path>]
```

**Exit codes:**

| Code | Meaning | Effect |
|---|---|---|
| `0` | PASS | Execution authorized |
| `1` | FAIL | Execution BLOCKED — structural violations present |
| `2` | FAIL_SAFE_STOP | Execution HALTED — registry or file integrity violation |

---

## 3. GATE CHECKS

| Check | What it validates | Failure mode |
|---|---|---|
| **C1** | Required schema fields per STREAM_SCHEMA.md §2 | FAIL (exit 1) |
| **C2** | STREAM ID is declared and non-empty | FAIL (exit 1) |
| **C3** | FAMILY is in FAMILY_REGISTRY.md as REGISTERED | FAIL_SAFE_STOP (exit 2) if unregistered; FAIL if CANDIDATE |
| **C3a** | Family definition file exists on disk | FAIL_SAFE_STOP (exit 2) if file missing despite registry entry |
| **C3b** | FAMILY RESOLUTION = KNOWN for registered families | FAIL (exit 1) if inconsistent |
| **C4** | VALIDATION COVERAGE is FULL / PARTIAL / NONE — with correct follow-on rules | FAIL (exit 1) |
| **C4a** | FALLBACK MODE declared when PARTIAL | FAIL (exit 1) |
| **C4b** | FAIL-SAFE RULE has content when PARTIAL | FAIL (exit 1) |
| **C5** | ARTIFACT MODE declared and valid | FAIL (exit 1) |
| **C6** | No per-stream validator creation (non-GOV streams) | WARN (exit 0) — advisory |
| **C7** | Contract does not restate family-level invariants | FAIL (exit 1) |
| **C7a** | Contract length within delta-only target (≤80 lines) | WARN (exit 0) — advisory |
| **C8** | FAIL-SAFE RULE body is substantive (no placeholder) | FAIL (exit 1) |

---

## 4. FAIL_SAFE_STOP OUTPUT FORMAT

When exit code 2 is returned:

```
FAIL_SAFE_STOP
Reason:  <trigger description>
Family:  <detected family>
Stream:  <stream ID>
Resolve: <resolution path>

Registered families:
  EX   ...
  GOV  ...
  ...
```

This output is per `fallback_execution_rules.md §4`.

---

## 5. REQUIRED SCHEMA FIELDS

The gate enforces all fields required by `STREAM_SCHEMA.md §2`:

- `STREAM ID`
- `FAMILY`
- `FAMILY RESOLUTION`
- `VALIDATION COVERAGE`
- `OBJECTIVE`
- `DELTA`
- `FAIL-SAFE RULE` (or `FAIL SAFE`)

Contracts missing any of these are structurally non-compliant and execution is blocked.

---

## 6. FAMILY RESOLUTION RULES

| Registry status | FAMILY RESOLUTION field | Gate result |
|---|---|---|
| REGISTERED | KNOWN | PASS |
| REGISTERED | anything else | FAIL |
| CANDIDATE | any | FAIL — use FAMILY_DISCOVERY |
| Not in registry | any | FAIL_SAFE_STOP |
| In registry but `.md` file missing | KNOWN | FAIL_SAFE_STOP |

---

## 7. VALIDATOR REUSE POLICY (C6)

Non-GOV streams that create per-stream `validate_*.sh` scripts violate the SKILLS.md rule 7 (`VALIDATE_STREAM`) principle. The gate warns when this pattern is detected and shared scripts exist in `scripts/governance/`.

GOV and framework hardening streams are **exempt** from this check — they are the ones defining the shared scripts.

---

## 8. DELTA-ONLY ENFORCEMENT (C7)

The following section headers are forbidden in stream contracts — they belong in the family definition file, not the contract:

- `STANDARD INVARIANTS`
- `STATE VOCABULARIES`
- `STANDARD ARTIFACT SLOTS`
- `HANDOVER EXPECTATIONS`
- `KNOWN EXCLUSIONS`
- `COMPRESSION ELIGIBILITY`

If detected, the gate fails with a restatement violation.

---

## 9. INTEGRATION POINTS

| System | How gate connects |
|---|---|
| `FAMILY_REGISTRY.md` | Read dynamically — no family names hardcoded in script |
| `STREAM_SCHEMA.md` | Required field list sourced from §2 |
| `fallback_execution_rules.md` | FAIL_SAFE_STOP output format per §4 |
| `SKILLS.md` rule 7 | Validator reuse check per VALIDATE_STREAM policy |
| `docs/governance/families/<ID>.md` | Existence check only — content read by LOAD_CONTEXT |

---

## 10. WHAT THE GATE DOES NOT CHECK

| Out of scope | Authority |
|---|---|
| Artifact content correctness | Family validation profiles + `validate_stream.py` |
| Git hygiene | `GIT_HYGIENE` skill + family files |
| Execution completeness | `RETURN_CONTRACT` + CLOSURE.md |
| Profile coverage details | `VALIDATE_STREAM <family> <profile>` |

The gate is a structural pre-condition check only. It authorizes entry — it does not certify completion.
