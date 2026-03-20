# Component: Monitoring Stack

**component_id:** COMP-86
**tier:** INFRASTRUCTURE
**semantic_capability:** CAP-39 — Platform Observability
**semantic_domain:** DOMAIN-16 — Operational Engineering

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** monitoring/grafana/ and monitoring/prometheus/prometheus.yml confirmed

## Description

Grafana dashboard-based monitoring consuming Prometheus metrics from HealthModule. Confirmed via monitoring/grafana/ and monitoring/prometheus/prometheus.yml files.

## Relationships

R-036: HealthModule EMITS Monitoring Stack; R-037: Monitoring Stack CONSUMES HealthModule

## Traceability Reference

**semantic_traceability_entry:** COMP-86 in semantic_traceability_map.md

## Parent Capability

[[C_39_Platform_Observability]]

## Navigation

- ↑ Capability: [[C_39_Platform_Observability]]
- ↑ Domain: [[D_16_Operational_Engineering]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
