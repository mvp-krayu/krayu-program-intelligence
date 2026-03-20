# Component: Frontend Application

**component_id:** COMP-68
**tier:** FRONTEND
**semantic_capability:** CAP-35 — Operator Web Application
**semantic_domain:** DOMAIN-14 — Frontend Application

## Source Anchor

**evidence_type:** DIRECT_EVIDENCE
**source_ref:** frontend/package.json v3.15.0 read directly; frontend/ directory confirmed

## Description

Progressive Web App SPA delivering fleet situational awareness through 61 pages with PWA + offline capability RTL Arabic support and real-time WebSocket integration.

## Relationships

R-026: FleetSocket Client DEPENDS_ON Frontend Application; R-027: Frontend Application CALLS AuthModule; R-028: Frontend Application CALLS domain modules; R-029: Frontend Application AUTHENTICATES_VIA AuthModule; R-030: Frontend Application SERVED_BY nginx

## Traceability Reference

**semantic_traceability_entry:** COMP-68 in semantic_traceability_map.md

## Parent Capability

[[C_35_Operator_Web_Application]]

## Navigation

- ↑ Capability: [[C_35_Operator_Web_Application]]
- ↑ Domain: [[D_14_Frontend_Application]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
