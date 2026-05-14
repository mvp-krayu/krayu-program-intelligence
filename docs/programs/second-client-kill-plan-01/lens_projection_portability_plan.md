# LENS Projection Portability Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01
Status: REQUIRED BEFORE EXECUTION

## Objective

Validate that the second-client run produces not only PiOS structural artifacts, but a sellable LENS projection that is not hard-bound to BlueEdge.

## Scope

The second-client run must validate:

- PiOS artifact chain
- GAUGE state generation
- LENS executive report generation
- commercial projection artifacts
- onboarding/ledger implications
- absence of BlueEdge-bound wording, paths, labels, and assumptions

## Required checks

1. No BlueEdge references in generated LENS outputs
2. No BlueEdge-specific report structure required for generation
3. No hardcoded BlueEdge paths in report generator
4. No BlueEdge semantic labels exposed in client-facing projection
5. LENS output remains executive-readable
6. Projection can support future onboarding UI
7. Projection can support future RBAC/audit trail requirements

## Verdict rule

The run is not successful unless LENS projection portability is proven.

