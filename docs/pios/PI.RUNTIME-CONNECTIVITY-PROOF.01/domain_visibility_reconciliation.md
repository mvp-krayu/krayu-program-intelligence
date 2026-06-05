# Domain Visibility Reconciliation — BlueEdge

Stream: PI.RUNTIME-CONNECTIVITY-PROOF.01
Specimen: blueedge / run_blueedge_genesis_e2e_03
Date: 2026-06-05
Evidence source: Forensic grep-based investigation of canonical_repo intake

---

## Previous interpretation

13 of 17 declared domains were classified as "semantic-only" (dark) based on the static import graph (40.3s). Only 4 domains had structural backing through file-level import relationships.

## Revised reconciliation

| Domain | Name | STATIC_IMPORT | EVENT_FLOW | MQTT | WEBSOCKET | API_BOUNDARY | DI_INJECTION | Final Status |
|---|---|---|---|---|---|---|---|---|
| DOMAIN-01 | Edge Data Acquisition | YES | YES | YES (publisher) | — | YES | — | STATIC_VISIBLE |
| DOMAIN-02 | Telemetry Transport | — | YES (emitter) | YES (subscriber) | YES | — | — | EVENT_VISIBLE |
| DOMAIN-03 | Fleet Core Operations | — | YES (primary emitter) | — | YES | YES (15 controllers) | YES (global consumer) | EVENT_VISIBLE |
| DOMAIN-04 | Fleet Vertical Extensions | — | YES (emitter) | — | YES | YES (5 controllers) | — | EVENT_VISIBLE |
| DOMAIN-05 | Analytics and Intelligence | — | YES (emitter) | — | YES | YES (6 controllers) | — | API_VISIBLE |
| DOMAIN-06 | AI/ML Intelligence Layer | — | — | — | — | YES (4 controllers) | — | API_VISIBLE |
| DOMAIN-07 | Sensor and Security Ingestion | — | — | YES (publisher) | — | YES (1 controller) | — | EVENT_VISIBLE |
| DOMAIN-08 | Real-Time Streaming | — | YES (all handlers consume) | — | YES (gateway) | — | — | INFRASTRUCTURE_NODE |
| DOMAIN-09 | Access Control and Identity | — | — | — | — | YES (3 controllers) | YES (global guard) | DI_VISIBLE |
| DOMAIN-10 | Platform Infrastructure | YES | YES (cache handler) | YES (command publisher) | — | — | — | STATIC_VISIBLE |
| DOMAIN-11 | Event-Driven Architecture | — | YES (defines all 53 events) | — | — | — | YES (@Global emitter) | INFRASTRUCTURE_NODE |
| DOMAIN-12 | SaaS Platform Layer | — | YES (audit, notification handlers) | — | — | YES (7 controllers) | — | EVENT_VISIBLE |
| DOMAIN-13 | External Integration | — | — | — | — | YES (5 controllers) | — | API_VISIBLE |
| DOMAIN-14 | Frontend Application | YES | — | — | YES (all hooks consume) | — | — | STATIC_VISIBLE |
| DOMAIN-15 | EV and Electrification | — | YES (event types defined) | — | — | YES (5 controllers) | — | EVENT_VISIBLE |
| DOMAIN-16 | Operational Engineering | YES | — | — | — | — | — | STATIC_VISIBLE |
| DOMAIN-17 | Extended Ops / Driver Services | — | YES (emitter) | — | YES | YES (9 controllers) | — | EVENT_VISIBLE |

## Summary

| Final Status | Count | Domains |
|---|---|---|
| STATIC_VISIBLE | 4 | DOMAIN-01, DOMAIN-10, DOMAIN-14, DOMAIN-16 |
| EVENT_VISIBLE | 8 | DOMAIN-02, DOMAIN-03, DOMAIN-04, DOMAIN-07, DOMAIN-12, DOMAIN-15, DOMAIN-17, DOMAIN-05 |
| API_VISIBLE | 2 | DOMAIN-06, DOMAIN-13 |
| INFRASTRUCTURE_NODE | 2 | DOMAIN-08, DOMAIN-11 |
| DI_VISIBLE | 1 | DOMAIN-09 |
| UNRESOLVED | 0 | — |
| ABSENT | 0 | — |

**Previously dark: 13. Actually dark: 0.**

Every declared domain has code, controllers, event participation, or infrastructure ownership. The "darkness" was a property of the visibility layer, not the system.
