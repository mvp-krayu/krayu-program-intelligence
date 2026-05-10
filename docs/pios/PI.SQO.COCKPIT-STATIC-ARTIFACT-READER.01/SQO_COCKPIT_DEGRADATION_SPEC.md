# SQO Cockpit Degradation Handler Specification

PI.SQO.COCKPIT-STATIC-ARTIFACT-READER.01

---

## Module

`app/execlens-demo/lib/sqo-cockpit/SQOCockpitDegradationHandler.js`

## Purpose

Implements fail-visible degradation. Missing or corrupt data produces explicit absence notices — the cockpit never appears complete when data is missing.

## Degradation States (7)

| State | Severity | Description |
|-------|----------|-------------|
| FULLY_OPERATIONAL | — | All artifacts loaded |
| PARTIAL_DEGRADATION | WARNING | Some sections degraded |
| CRITICAL_DEGRADATION | CRITICAL | Critical artifacts missing |
| NO_SQO_DATA | CRITICAL | No artifacts could be loaded |
| CLIENT_NOT_REGISTERED | CRITICAL | Client/run not in manifest |
| LOAD_FAILURE | CRITICAL | Load returned null |
| REPLAY_FAILED | WARNING | Replay verification failed |

## Section Availability Assessment

Per-section availability computed from artifact presence:
- **available** — all required artifacts present
- **degraded** — some artifacts present
- **unavailable** — no artifacts present

## Replay Status Check

Three replay verifications checked:
- maturity_replay_verification
- qualification_state_replay_verification
- debt_replay_verification

Any FAIL verdict → `any_failed: true`

## Governance

- No silent fallback
- Missing data explicitly displayed
- No fabrication of absent data
