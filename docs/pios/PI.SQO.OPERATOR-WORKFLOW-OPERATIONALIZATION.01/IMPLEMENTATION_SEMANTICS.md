# Implementation Semantics — PI.SQO.OPERATOR-WORKFLOW-OPERATIONALIZATION.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| PromotionStateLoader | server/PromotionStateLoader.server.js | Load/write promotion state artifacts from disk | REUSABLE — multi-client via client/runId params |
| SQOAuthorityValidator | server/SQOAuthorityValidator.server.js | Validate operator actions against authority model | REUSABLE — exports ROLE_ACTION_MAP, ACTION_AUTHORITY |
| PromotionEventWriter | server/PromotionEventWriter.server.js | Append-only JSONL event writer | REUSABLE — path-agnostic via client/runId |
| SQOActionEngine | server/SQOActionEngine.server.js | 12-action orchestrator with mutation safety | REUSABLE — single entry point executeAction() |
| OperatorWorkflowResolver | server/OperatorWorkflowResolver.server.js | SSR data resolver for authority page | REUSABLE — resolveAuthorityWorkspace(client, runId) |
| SQORuntimeResolver | server/SQORuntimeResolver.server.js | Canonical runtime substrate discovery — probes static and operational paths, resolves capabilities and section availability | REUSABLE — resolveRuntimeSubstrates(client, runId) |

## 2. Input Contracts

### SQO Promotion Artifacts (required for authority workflow)

| Artifact | Path Pattern | Required Fields |
|---|---|---|
| promotion_state.json | clients/{client}/psee/runs/{run}/sqo/ | s_level, authority_ceiling, promotion_eligible, lanes, promotion_lineage, audit_event_refs |
| qualification_blockers.json | clients/{client}/psee/runs/{run}/sqo/ | blockers[].blocker_id, .lane, .gap, .authority_domain, .required_level, .resolution |
| review_obligations.json | clients/{client}/psee/runs/{run}/sqo/ | obligations[].id, .status, .review_type, .authority_domain |
| promotion_event_log.jsonl | clients/{client}/psee/runs/{run}/sqo/ | JSONL — each line: event_id, timestamp, actor_id, action, authority_domain |

### Authority Action Request (POST body)

| Field | Type | Required | Description |
|---|---|---|---|
| action | string | YES | One of 12 action types |
| client | string | YES | Client identifier |
| runId | string | YES | Run identifier |
| actor_id | string | YES | {role}:{identity} format (declarative only) |
| target_item | string | conditional | Obligation ID for review actions |
| justification | string | conditional | Required for reject/contest/deny/insufficiency_acknowledge |
| insufficiency_permanent | boolean | conditional | For insufficiency_acknowledge |
| accepted_aspects | array | conditional | For review_partial_accept |
| contested_aspects | array | conditional | For review_partial_accept |
| resolution_outcome | string | conditional | For resolve_arbitration: "RESOLVED" or "UNRESOLVABLE" |

## 3. Output Contracts

### Authority Action Response

```json
{
  "success": true,
  "event": { "event_id": "EVT-NNN", "semantic_disposition": "...", ... },
  "updatedState": { ... },
  "replay_valid": true,
  "_disclaimer": "actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement."
}
```

### Semantic Disposition Taxonomy

| Disposition | Produced By |
|---|---|
| OPERATIONAL_ACCEPTANCE | review_accept |
| OPERATIONAL_REJECTION | review_reject |
| CONTESTED | review_contest |
| PARTIAL_ACCEPTANCE | review_partial_accept |
| ARBITRATION_ESCALATION | escalate_arbitration |
| INSUFFICIENCY_DETERMINATION | insufficiency_acknowledge |
| QUALIFICATION_ADVANCEMENT | promotion_approve |
| QUALIFICATION_DENIAL | promotion_deny |
| QUALIFICATION_REQUEST | promotion_request |
| STRUCTURAL_ACCEPTANCE | crosswalk_accept, reconciliation_accept |

### Event Log Entry (JSONL line)

| Field | Description |
|---|---|
| event_id | Sequential EVT-NNN (zero-padded to 3 digits) |
| timestamp | ISO 8601 |
| actor_id | {role}:{identity} |
| actor_role | Extracted role prefix |
| action | One of 12 action types |
| authority_domain | governance_authority, semantic_authority, structural_authority |
| authority_level | L4, L5 |
| semantic_disposition | From taxonomy above |
| prior_state | State before action |
| resulting_state | State after action |
| justification | Operator-provided reasoning |

## 4. Calibration Assumptions

| Parameter | Value | Status |
|---|---|---|
| Authority ceiling for review actions | L4 (semantic_authority) | GOVERNED — from promotion_state |
| Authority ceiling for promotion actions | L5 (governance_authority) | GOVERNED — from promotion_state |
| Terminal obligation states | RESOLVED, REJECTED, UNRESOLVABLE | GOVERNED — determines lane transition |
| Event ID format | EVT-NNN (3-digit zero-padded) | CONVENTION — extensible to 4+ digits |

## 5. Extension Points

| Extension | Current State | Future Direction |
|---|---|---|
| Client scope | pallets-flask only (hardcoded path resolution) | Multi-client generalization |
| RBAC enforcement | Declarative (role from actor_id prefix) | Runtime identity verification |
| Crosswalk/reconciliation actions | Defined in validator, no artifacts to exercise | Exercisable when crosswalk artifacts exist |
| Replay validation | Event ID uniqueness + audit ref check | Full state reconstruction replay |
| Real-time updates | Page refresh (server-authoritative) | WebSocket/SSE for live updates |

## 6. Module Responsibility Map

| Module | Owns | Does NOT Own |
|---|---|---|
| PromotionStateLoader | File I/O for promotion artifacts | Validation, mutation logic |
| SQOAuthorityValidator | Action/role/boundary validation | State mutation, event writing |
| PromotionEventWriter | Event construction and JSONL append | Validation, state mutation |
| SQOActionEngine | Orchestration: validate → snapshot → mutate → event → replay | Rendering, routing |
| OperatorWorkflowResolver | SSR data assembly for authority page | Mutation, API handling |
| SQORuntimeResolver | Runtime substrate discovery, capability resolution, section availability mapping | Mutation, rendering, routing |
| authority-action.js (API) | HTTP handling, field validation, response formatting | Business logic (delegates to engine) |

## 7. RBAC Model (Declarative)

| Role | Allowed Actions | Authority Domain |
|---|---|---|
| operator | All 12 actions | All domains |
| reviewer | review_accept, review_reject, review_contest, review_partial_accept | semantic_authority |
| domain_authority | review_accept, review_reject, crosswalk_accept, reconciliation_accept | semantic_authority, structural_authority |
| promotion_authority | promotion_request, promotion_approve, promotion_deny, insufficiency_acknowledge, resolve_arbitration | governance_authority |
| audit_authority | (read-only) | All domains (read) |

### Non-Automatable Boundaries (7)

No system: actor can:
1. Promote qualification state
2. Elevate authority level
3. Resolve review obligations
4. Accept crosswalk translations
5. Close reconciliation
6. Advance S-state
7. Override insufficiency determination

## DISCLAIMER

actor_id is DECLARATIVE ONLY in this stream. Authority validation is simulated/declarative. This is NOT production RBAC. This is NOT secure identity enforcement. Runtime identity verification is a future stream. Do not represent this as enterprise-secure.
