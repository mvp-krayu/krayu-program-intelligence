# Capability: SVG Device Hardware Platform

**capability_id:** CAP-03
**parent_domain:** DOMAIN-01 — Edge Data Acquisition
**capability_type:** INFRASTRUCTURE
**grounding_status:** GROUNDED

## Description

The physical SVG 2.0 Smart Vehicle Gateway hardware that hosts all edge agents. NXP i.MX 95, 16GB LPDDR5, 2 TOPS NPU, native 5G, dual 4K cameras, TPM 2.0, Yocto Linux. Confirmed in architecture HTML section s2. Single-component capability justified because the hardware is a discrete physical asset with no peer components at this abstraction level.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-72 | [SVG 2.0 Smart Vehicle Gateway](../03_Components/CMP_72_svg_2_0_smart_vehicle_gateway.md) | INFRASTRUCTURE | DERIVED |

## Execution Contribution

- EP-01 (physical execution host — step 1 context)
- EP-02 (physical execution host — step 1 context)

## Relationships

- (hosts sensor_collector.py, hasi_bridge.py, HASI v1.0.0, SVG Main Telemetry Firmware — EVID-ARCH section s2)

## Traceability Reference

Source anchors: capability_map.md CAP-03

## Navigation

- ↑ Domain: [[D_01_Edge_Data_Acquisition]]
- ↓ Components: [[CMP_72_svg_2_0_smart_vehicle_gateway]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
