# SQO Cockpit Route Resolver Specification

PI.SQO.COCKPIT-STATIC-ARTIFACT-READER.01

---

## Module

`app/execlens-demo/lib/sqo-cockpit/SQOCockpitRouteResolver.js`

## Purpose

Validates route parameters, builds cockpit paths, and generates navigation items. All cockpit pages use this module for consistent routing.

## Route Structure

```
/sqo                                          — Client selector
/sqo/client/[client]                          — Run selector
/sqo/client/[client]/run/[run]                — Overview (default)
/sqo/client/[client]/run/[run]/debt           — Semantic Debt
/sqo/client/[client]/run/[run]/continuity     — Continuity Assessment
/sqo/client/[client]/run/[run]/maturity       — Maturity Profile
/sqo/client/[client]/run/[run]/progression    — Progression Readiness
/sqo/client/[client]/run/[run]/evidence       — Evidence & Replay
/sqo/client/[client]/run/[run]/handoff        — PATH B Handoff
```

## Sections (7)

overview, debt, continuity, maturity, progression, evidence, handoff

## Validation

- Client and run parameters required (string, non-empty)
- Client/run pair validated against manifest registry
- Unknown pairs rejected with CLIENT_RUN_NOT_REGISTERED
