# SQO Cockpit State Resolver Specification

PI.SQO.COCKPIT-STATIC-ARTIFACT-READER.01

---

## Module

`app/execlens-demo/lib/sqo-cockpit/SQOCockpitStateResolver.js`

## Purpose

Orchestrates artifact loading, degradation assessment, replay verification, and cockpit state resolution into a single deterministic result.

## Cockpit States (10)

| State | Visual Posture | Description |
|-------|---------------|-------------|
| NO_CLIENT_SELECTED | neutral | No client/run provided |
| CLIENT_REGISTERED_NO_SQO | warning | Client registered but no SQO data |
| S0_STRUCTURAL_ONLY | minimal | S0 structural-only qualification |
| S1_ONBOARDING_REQUIRED | active | S1 onboarding required |
| S2_QUALIFIED_WITH_DEBT | active | S2 qualified with remaining debt |
| S3_FULLY_GOVERNABLE | healthy | S3 fully governable |
| ARTIFACT_STALE | warning | Staleness detected |
| REPLAY_FAILED | error | Replay verification failed |
| HANDOFF_READY | ready | All handoff conditions met |
| HANDOFF_BLOCKED | blocked | Handoff blocked by conditions |

## State Resolution Logic

1. No client/run → NO_CLIENT_SELECTED
2. Client not registered → NO_CLIENT_SELECTED
3. No SQO data / critical degradation → CLIENT_REGISTERED_NO_SQO
4. Any replay failed → REPLAY_FAILED
5. S-state detection → S0/S1/S2/S3 + handoff readiness
6. S2/S3 + handoff ready → HANDOFF_READY
7. S2 + handoff blocked → S2_QUALIFIED_WITH_DEBT

## Handoff Readiness Assessment

Blocking conditions checked:
- S-state insufficient (S0/S1)
- Replay verification failed
- Certification not passed (maturity, qualification_state)
- Blocking debt items present
