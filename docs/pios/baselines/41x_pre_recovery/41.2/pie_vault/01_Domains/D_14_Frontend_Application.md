# Domain: Frontend Application

**domain_id:** DOMAIN-14
**domain_type:** FUNCTIONAL
**grounding_status:** GROUNDED

## Description

The operator-facing React SPA delivering fleet situational awareness, configuration, and management through 61 pages. Evidenced by frontend/package.json (EVID-FPKG: blueedge-fleet-frontend v3.15.0, React 18, Vite, Tailwind), confirmed directory structure with 7 domain page folders (fleet, assets, energy, intelligence, people, platform, safety) plus v3.23 additions (NetworkSecurityPage.tsx, SensorsPage.tsx). Intent inference IIM-08 confirms PWA + offline capability, RTL Arabic support, and real-time WebSocket integration as explicit design goals targeting the MENA market. Frontend Application (COMP-68) consumes all backend REST APIs (R-028) and receives real-time events via FleetSocket Client (COMP-69).

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-35 | [Operator Web Application](../02_Capabilities/C_35_Operator_Web_Application.md) | CORE | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-68 | [Frontend Application](../03_Components/CMP_68_Frontend_Application.md) | FRONTEND | CAP-35 |
| COMP-71 | [Frontend Page Modules (61 pages)](../03_Components/CMP_71_Frontend_Page_Modules.md) | FRONTEND | CAP-35 |

## Execution Path Participation

- EP-01 (Sensor Telemetry Ingest — steps 9–10 SensorsPage display)
- EP-02 (HASI Security Pipeline — step 9 NetworkSecurityPage display)
- EP-03 (User Authentication — steps 1, 5, 6 login form and redirect)
- EP-04 (Fleet Data REST — steps 1, 8 API call and render)
- EP-07 (OTA Firmware Update — step 1 OtaPage)
- EP-08 (Multi-Tenant Onboarding — step 1 OnboardingWizardPage)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-68, COMP-71
- relationship_anchors: R-026, R-027, R-028, R-029, R-030

## Navigation

- ↓ Capabilities: [[C_35_Operator_Web_Application]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
