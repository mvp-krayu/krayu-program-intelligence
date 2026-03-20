# Capability: SVG Device Firmware Management [*]

**capability_id:** CAP-04
**parent_domain:** DOMAIN-01 — Edge Data Acquisition
**capability_type:** SUPPORTING
**grounding_status:** WEAKLY GROUNDED

## Description

Over-the-air firmware and configuration update delivery and application on SVG 2.0 devices. SVG OTA Agent is architecture-declared (EVID-ARCH section s2) but not confirmed in extracted source files. Marked WEAKLY GROUNDED accordingly.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-77 | [SVG OTA Agent](../03_Components/CMP_77_svg_ota_agent.md) [*] | INFRASTRUCTURE | INFERRED |

## Execution Contribution

- EP-07 (OTA Firmware Update Deployment — step 6)

## Relationships

- R-039: OtaModule CALLS SVG OTA Agent

## Traceability Reference

Source anchors: capability_map.md CAP-04

## Navigation

- ↑ Domain: [[D_01_Edge_Data_Acquisition]]
- ↓ Components: [[CMP_77_svg_ota_agent]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
