# Component: HealthModule

**component_id:** COMP-66
**tier:** BACKEND
**semantic_capability:** CAP-39 — Platform Observability
**semantic_domain:** DOMAIN-16 — Operational Engineering

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** app.module.ts line 11; health/prometheus.service.ts confirmed

## Description

Health check endpoint and Prometheus metrics exposition. Confirmed at app.module.ts line 11 with health/prometheus.service.ts.

## Relationships

R-036: HealthModule EMITS Monitoring Stack; R-037: Monitoring Stack CONSUMES HealthModule

## Traceability Reference

**semantic_traceability_entry:** COMP-66 in semantic_traceability_map.md

## Parent Capability

[[C_39_Platform_Observability]]

## Navigation

- ↑ Capability: [[C_39_Platform_Observability]]
- ↑ Domain: [[D_16_Operational_Engineering]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
