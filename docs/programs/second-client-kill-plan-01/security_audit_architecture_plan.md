# Security & Audit Architecture Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01
Status: ARCHITECTURE REQUIREMENT — IMPLEMENTATION LATER

## Objective

Define the minimum RBAC and audit-log architecture required before LENS becomes a client-facing/onboarding product surface.

## Scope

This run does not implement RBAC or audit logs.

It must identify where they attach across:

- onboarding
- ledger
- client/runtime isolation
- evidence access
- GAUGE access
- LENS projection access
- report generation
- export/publish actions

## RBAC boundary

Required future roles:

- Platform Admin
- Krayu Operator
- Client Executive Viewer
- Client Technical Reviewer
- Auditor / Compliance Reviewer

## Audit events

Minimum future audit events:

- client created
- onboarding submitted
- source artifact uploaded
- source artifact validated
- pipeline run started
- pipeline run completed
- evidence artifact generated
- GAUGE state generated
- LENS projection generated
- report viewed
- report exported
- publish-safe artifact created
- user access granted
- user access revoked

## Design rule

RBAC and audit logs must attach at the ledger/onboarding/projection boundary, not only inside the UI.

## Verdict rule

Second-client execution may proceed without implementation, but the run cannot be considered productization-complete unless RBAC and audit-log attachment points are documented.

