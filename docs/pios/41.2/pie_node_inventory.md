# PIE Node Inventory — BlueEdge Platform v3.23.0

**artifact_id:** PIOS-41.2-NODE-INVENTORY
**contract_id:** PIOS-41.2-RUN01-CONTRACT-v1
**mode:** PIE-RENDER-STRICT
**date:** 2026-03-20

Total nodes: 148 (17 DOMAIN + 42 CAPABILITY + 89 COMPONENT)

---

## Full Node Inventory

| Node ID | Node Type | Node Name | Parent Node | Grounding Status | Vault File Path |
|---|---|---|---|---|---|
| N-DOM-01 | DOMAIN | Edge Data Acquisition | — | GROUNDED | pie_vault/01_Domains/D_01_Edge_Data_Acquisition.md |
| N-DOM-02 | DOMAIN | Telemetry Transport and Messaging | — | WEAKLY GROUNDED | pie_vault/01_Domains/D_02_Telemetry_Transport_and_Messaging.md |
| N-DOM-03 | DOMAIN | Fleet Core Operations | — | GROUNDED | pie_vault/01_Domains/D_03_Fleet_Core_Operations.md |
| N-DOM-04 | DOMAIN | Fleet Vertical Extensions | — | GROUNDED | pie_vault/01_Domains/D_04_Fleet_Vertical_Extensions.md |
| N-DOM-05 | DOMAIN | Analytics and Intelligence | — | GROUNDED | pie_vault/01_Domains/D_05_Analytics_and_Intelligence.md |
| N-DOM-06 | DOMAIN | AI/ML Intelligence Layer | — | GROUNDED | pie_vault/01_Domains/D_06_AI_ML_Intelligence_Layer.md |
| N-DOM-07 | DOMAIN | Sensor and Security Ingestion | — | GROUNDED | pie_vault/01_Domains/D_07_Sensor_and_Security_Ingestion.md |
| N-DOM-08 | DOMAIN | Real-Time Streaming and Gateway | — | GROUNDED | pie_vault/01_Domains/D_08_Real_Time_Streaming_and_Gateway.md |
| N-DOM-09 | DOMAIN | Access Control and Identity | — | GROUNDED | pie_vault/01_Domains/D_09_Access_Control_and_Identity.md |
| N-DOM-10 | DOMAIN | Platform Infrastructure and Data | — | WEAKLY GROUNDED | pie_vault/01_Domains/D_10_Platform_Infrastructure_and_Data.md |
| N-DOM-11 | DOMAIN | Event-Driven Architecture | — | GROUNDED | pie_vault/01_Domains/D_11_Event_Driven_Architecture.md |
| N-DOM-12 | DOMAIN | SaaS Platform Layer | — | GROUNDED | pie_vault/01_Domains/D_12_SaaS_Platform_Layer.md |
| N-DOM-13 | DOMAIN | External Integration | — | GROUNDED | pie_vault/01_Domains/D_13_External_Integration.md |
| N-DOM-14 | DOMAIN | Frontend Application | — | GROUNDED | pie_vault/01_Domains/D_14_Frontend_Application.md |
| N-DOM-15 | DOMAIN | EV and Electrification | — | GROUNDED | pie_vault/01_Domains/D_15_EV_and_Electrification.md |
| N-DOM-16 | DOMAIN | Operational Engineering | — | GROUNDED | pie_vault/01_Domains/D_16_Operational_Engineering.md |
| N-DOM-17 | DOMAIN | Extended Operations and Driver Services | — | GROUNDED | pie_vault/01_Domains/D_17_Extended_Operations_and_Driver_Services.md |
| N-CAP-01 | CAPABILITY | Vehicle Sensor Collection | N-DOM-01 | GROUNDED | pie_vault/02_Capabilities/C_01_Vehicle_Sensor_Collection.md |
| N-CAP-02 | CAPABILITY | Network Security Intelligence Collection | N-DOM-01 | GROUNDED | pie_vault/02_Capabilities/C_02_Network_Security_Intelligence_Collection.md |
| N-CAP-03 | CAPABILITY | SVG Device Hardware Platform | N-DOM-01 | GROUNDED | pie_vault/02_Capabilities/C_03_SVG_Device_Hardware_Platform.md |
| N-CAP-04 | CAPABILITY | SVG Device Firmware Management [*] | N-DOM-01 | WEAKLY GROUNDED | pie_vault/02_Capabilities/C_04_SVG_Device_Firmware_Management.md |
| N-CAP-05 | CAPABILITY | MQTT Telemetry Transport | N-DOM-02 | GROUNDED | pie_vault/02_Capabilities/C_05_MQTT_Telemetry_Transport.md |
| N-CAP-06 | CAPABILITY | Stream Processing Infrastructure [*] | N-DOM-02 | WEAKLY GROUNDED | pie_vault/02_Capabilities/C_06_Stream_Processing_Infrastructure.md |
| N-CAP-07 | CAPABILITY | Core Fleet Asset Management | N-DOM-03 | GROUNDED | pie_vault/02_Capabilities/C_07_Core_Fleet_Asset_Management.md |
| N-CAP-08 | CAPABILITY | Driver Management | N-DOM-03 | GROUNDED | pie_vault/02_Capabilities/C_08_Driver_Management.md |
| N-CAP-09 | CAPABILITY | Alert and Notification Management | N-DOM-03 | GROUNDED | pie_vault/02_Capabilities/C_09_Alert_and_Notification_Management.md |
| N-CAP-10 | CAPABILITY | Maintenance and Fuel Operations | N-DOM-03 | GROUNDED | pie_vault/02_Capabilities/C_10_Maintenance_and_Fuel_Operations.md |
| N-CAP-11 | CAPABILITY | Operational Control and Device Management | N-DOM-03 | GROUNDED | pie_vault/02_Capabilities/C_11_Operational_Control_and_Device_Management.md |
| N-CAP-12 | CAPABILITY | Fleet Type Verticals | N-DOM-04 | GROUNDED | pie_vault/02_Capabilities/C_12_Fleet_Type_Verticals.md |
| N-CAP-13 | CAPABILITY | Specialty Transport Extensions | N-DOM-04 | GROUNDED | pie_vault/02_Capabilities/C_13_Specialty_Transport_Extensions.md |
| N-CAP-14 | CAPABILITY | Fleet Analytics and Reporting | N-DOM-05 | GROUNDED | pie_vault/02_Capabilities/C_14_Fleet_Analytics_and_Reporting.md |
| N-CAP-15 | CAPABILITY | Compliance, Safety, and Finance Intelligence | N-DOM-05 | GROUNDED | pie_vault/02_Capabilities/C_15_Compliance_Safety_and_Finance_Intelligence.md |
| N-CAP-16 | CAPABILITY | Executive Intelligence and Data Monetization | N-DOM-05 | GROUNDED | pie_vault/02_Capabilities/C_16_Executive_Intelligence_and_Data_Monetization.md |
| N-CAP-17 | CAPABILITY | Predictive and Anomaly Intelligence | N-DOM-06 | GROUNDED | pie_vault/02_Capabilities/C_17_Predictive_and_Anomaly_Intelligence.md |
| N-CAP-18 | CAPABILITY | Driver Intelligence | N-DOM-06 | GROUNDED | pie_vault/02_Capabilities/C_18_Driver_Intelligence.md |
| N-CAP-19 | CAPABILITY | Agentic AI and Road Intelligence | N-DOM-06 | GROUNDED | pie_vault/02_Capabilities/C_19_Agentic_AI_and_Road_Intelligence.md |
| N-CAP-20 | CAPABILITY | Sensor Telemetry Ingestion | N-DOM-07 | GROUNDED | pie_vault/02_Capabilities/C_20_Sensor_Telemetry_Ingestion.md |
| N-CAP-21 | CAPABILITY | HASI Security Intelligence Ingestion | N-DOM-07 | GROUNDED | pie_vault/02_Capabilities/C_21_HASI_Security_Intelligence_Ingestion.md |
| N-CAP-22 | CAPABILITY | WebSocket Event Broadcasting | N-DOM-08 | GROUNDED | pie_vault/02_Capabilities/C_22_WebSocket_Event_Broadcasting.md |
| N-CAP-23 | CAPABILITY | JWT Authentication | N-DOM-09 | GROUNDED | pie_vault/02_Capabilities/C_23_JWT_Authentication.md |
| N-CAP-24 | CAPABILITY | Frontend Auth State Management | N-DOM-09 | GROUNDED | pie_vault/02_Capabilities/C_24_Frontend_Auth_State_Management.md |
| N-CAP-25 | CAPABILITY | API Versioning | N-DOM-09 | GROUNDED | pie_vault/02_Capabilities/C_25_API_Versioning.md |
| N-CAP-26 | CAPABILITY | Primary Data Persistence | N-DOM-10 | GROUNDED | pie_vault/02_Capabilities/C_26_Primary_Data_Persistence.md |
| N-CAP-27 | CAPABILITY | Caching Layer | N-DOM-10 | GROUNDED | pie_vault/02_Capabilities/C_27_Caching_Layer.md |
| N-CAP-28 | CAPABILITY | Object Storage [*] | N-DOM-10 | WEAKLY GROUNDED | pie_vault/02_Capabilities/C_28_Object_Storage.md |
| N-CAP-29 | CAPABILITY | Platform Monorepo Container | N-DOM-10 | GROUNDED | pie_vault/02_Capabilities/C_29_Platform_Monorepo_Container.md |
| N-CAP-30 | CAPABILITY | Domain Event Bus | N-DOM-11 | GROUNDED | pie_vault/02_Capabilities/C_30_Domain_Event_Bus.md |
| N-CAP-31 | CAPABILITY | Multi-Tenant Provisioning | N-DOM-12 | GROUNDED | pie_vault/02_Capabilities/C_31_Multi_Tenant_Provisioning.md |
| N-CAP-32 | CAPABILITY | Tenant Onboarding and Branding | N-DOM-12 | GROUNDED | pie_vault/02_Capabilities/C_32_Tenant_Onboarding_and_Branding.md |
| N-CAP-33 | CAPABILITY | Notification Delivery Channels | N-DOM-13 | GROUNDED | pie_vault/02_Capabilities/C_33_Notification_Delivery_Channels.md |
| N-CAP-34 | CAPABILITY | Enterprise System Integration | N-DOM-13 | GROUNDED | pie_vault/02_Capabilities/C_34_Enterprise_System_Integration.md |
| N-CAP-35 | CAPABILITY | Operator Web Application | N-DOM-14 | GROUNDED | pie_vault/02_Capabilities/C_35_Operator_Web_Application.md |
| N-CAP-36 | CAPABILITY | EV Telemetry and Energy Management | N-DOM-15 | GROUNDED | pie_vault/02_Capabilities/C_36_EV_Telemetry_and_Energy_Management.md |
| N-CAP-37 | CAPABILITY | Fleet Electrification Planning | N-DOM-15 | GROUNDED | pie_vault/02_Capabilities/C_37_Fleet_Electrification_Planning.md |
| N-CAP-38 | CAPABILITY | Device OTA Management | N-DOM-15 | GROUNDED | pie_vault/02_Capabilities/C_38_Device_OTA_Management.md |
| N-CAP-39 | CAPABILITY | Platform Observability | N-DOM-16 | GROUNDED | pie_vault/02_Capabilities/C_39_Platform_Observability.md |
| N-CAP-40 | CAPABILITY | Delivery and Quality Infrastructure | N-DOM-16 | GROUNDED | pie_vault/02_Capabilities/C_40_Delivery_and_Quality_Infrastructure.md |
| N-CAP-41 | CAPABILITY | Commercial Operations and Dispatch Services | N-DOM-17 | GROUNDED | pie_vault/02_Capabilities/C_41_Commercial_Operations_and_Dispatch_Services.md |
| N-CAP-42 | CAPABILITY | Customer and Ecosystem Services | N-DOM-17 | GROUNDED | pie_vault/02_Capabilities/C_42_Customer_and_Ecosystem_Services.md |
| N-COMP-01 | COMPONENT | blueedge-platform (Monorepo) | N-CAP-29 | GROUNDED | pie_vault/03_Components/CMP_01_blueedge_platform.md |
| N-COMP-02 | COMPONENT | AuthModule | N-CAP-23 | GROUNDED | pie_vault/03_Components/CMP_02_AuthModule.md |
| N-COMP-03 | COMPONENT | VehiclesModule | N-CAP-07 | GROUNDED | pie_vault/03_Components/CMP_03_VehiclesModule.md |
| N-COMP-04 | COMPONENT | DriversModule | N-CAP-08 | GROUNDED | pie_vault/03_Components/CMP_04_DriversModule.md |
| N-COMP-05 | COMPONENT | FleetsModule | N-CAP-07 | GROUNDED | pie_vault/03_Components/CMP_05_FleetsModule.md |
| N-COMP-06 | COMPONENT | TripsModule | N-CAP-07 | GROUNDED | pie_vault/03_Components/CMP_06_TripsModule.md |
| N-COMP-07 | COMPONENT | AlertsModule | N-CAP-09 | GROUNDED | pie_vault/03_Components/CMP_07_AlertsModule.md |
| N-COMP-08 | COMPONENT | MaintenanceModule | N-CAP-10 | GROUNDED | pie_vault/03_Components/CMP_08_MaintenanceModule.md |
| N-COMP-09 | COMPONENT | FuelModule | N-CAP-10 | GROUNDED | pie_vault/03_Components/CMP_09_FuelModule.md |
| N-COMP-10 | COMPONENT | TankerModule | N-CAP-12 | GROUNDED | pie_vault/03_Components/CMP_10_TankerModule.md |
| N-COMP-11 | COMPONENT | BusModule | N-CAP-12 | GROUNDED | pie_vault/03_Components/CMP_11_BusModule.md |
| N-COMP-12 | COMPONENT | TaxiModule | N-CAP-12 | GROUNDED | pie_vault/03_Components/CMP_12_TaxiModule.md |
| N-COMP-13 | COMPONENT | OperationsModule | N-CAP-11 | GROUNDED | pie_vault/03_Components/CMP_13_OperationsModule.md |
| N-COMP-14 | COMPONENT | DevicesModule | N-CAP-11 | GROUNDED | pie_vault/03_Components/CMP_14_DevicesModule.md |
| N-COMP-15 | COMPONENT | NotificationsModule | N-CAP-09 | GROUNDED | pie_vault/03_Components/CMP_15_NotificationsModule.md |
| N-COMP-16 | COMPONENT | AnalyticsModule | N-CAP-14 | GROUNDED | pie_vault/03_Components/CMP_16_AnalyticsModule.md |
| N-COMP-17 | COMPONENT | ReportsModule | N-CAP-14 | GROUNDED | pie_vault/03_Components/CMP_17_ReportsModule.md |
| N-COMP-18 | COMPONENT | DiagnosticsModule | N-CAP-14 | GROUNDED | pie_vault/03_Components/CMP_18_DiagnosticsModule.md |
| N-COMP-19 | COMPONENT | ComplianceModule | N-CAP-15 | GROUNDED | pie_vault/03_Components/CMP_19_ComplianceModule.md |
| N-COMP-20 | COMPONENT | SafetyModule | N-CAP-15 | GROUNDED | pie_vault/03_Components/CMP_20_SafetyModule.md |
| N-COMP-21 | COMPONENT | FinanceModule | N-CAP-15 | GROUNDED | pie_vault/03_Components/CMP_21_FinanceModule.md |
| N-COMP-22 | COMPONENT | UsersModule | N-CAP-08 | GROUNDED | pie_vault/03_Components/CMP_22_UsersModule.md |
| N-COMP-23 | COMPONENT | ColdchainModule | N-CAP-13 | GROUNDED | pie_vault/03_Components/CMP_23_ColdchainModule.md |
| N-COMP-24 | COMPONENT | EvModule | N-CAP-36 | GROUNDED | pie_vault/03_Components/CMP_24_EvModule.md |
| N-COMP-25 | COMPONENT | OtaModule [cross-domain: DOM-01] | N-CAP-38 | GROUNDED | pie_vault/03_Components/CMP_25_OtaModule.md |
| N-COMP-26 | COMPONENT | V2gModule | N-CAP-36 | GROUNDED | pie_vault/03_Components/CMP_26_V2gModule.md |
| N-COMP-27 | COMPONENT | GatewaysModule | N-CAP-22 | GROUNDED | pie_vault/03_Components/CMP_27_GatewaysModule.md |
| N-COMP-28 | COMPONENT | SurgePricingModule | N-CAP-41 | GROUNDED | pie_vault/03_Components/CMP_28_SurgePricingModule.md |
| N-COMP-29 | COMPONENT | DriverIncentivesModule | N-CAP-41 | GROUNDED | pie_vault/03_Components/CMP_29_DriverIncentivesModule.md |
| N-COMP-30 | COMPONENT | ElectrificationModule | N-CAP-37 | GROUNDED | pie_vault/03_Components/CMP_30_ElectrificationModule.md |
| N-COMP-31 | COMPONENT | DepotChargingModule | N-CAP-37 | GROUNDED | pie_vault/03_Components/CMP_31_DepotChargingModule.md |
| N-COMP-32 | COMPONENT | ExecutiveModule | N-CAP-16 | GROUNDED | pie_vault/03_Components/CMP_32_ExecutiveModule.md |
| N-COMP-33 | COMPONENT | AnomalyDetectionModule | N-CAP-17 | GROUNDED | pie_vault/03_Components/CMP_33_AnomalyDetectionModule.md |
| N-COMP-34 | COMPONENT | CrossBorderModule | N-CAP-42 | GROUNDED | pie_vault/03_Components/CMP_34_CrossBorderModule.md |
| N-COMP-35 | COMPONENT | PermitsModule | N-CAP-42 | GROUNDED | pie_vault/03_Components/CMP_35_PermitsModule.md |
| N-COMP-36 | COMPONENT | PartsMarketplaceModule | N-CAP-42 | GROUNDED | pie_vault/03_Components/CMP_36_PartsMarketplaceModule.md |
| N-COMP-37 | COMPONENT | FleetLifecycleModule | N-CAP-42 | GROUNDED | pie_vault/03_Components/CMP_37_FleetLifecycleModule.md |
| N-COMP-38 | COMPONENT | DriverMobileModule | N-CAP-41 | GROUNDED | pie_vault/03_Components/CMP_38_DriverMobileModule.md |
| N-COMP-39 | COMPONENT | FatigueRiskModule | N-CAP-18 | GROUNDED | pie_vault/03_Components/CMP_39_FatigueRiskModule.md |
| N-COMP-40 | COMPONENT | CustomerPortalModule | N-CAP-42 | GROUNDED | pie_vault/03_Components/CMP_40_CustomerPortalModule.md |
| N-COMP-41 | COMPONENT | BlockchainModule | N-CAP-16 | GROUNDED | pie_vault/03_Components/CMP_41_BlockchainModule.md |
| N-COMP-42 | COMPONENT | WhiteLabelModule | N-CAP-32 | GROUNDED | pie_vault/03_Components/CMP_42_WhiteLabelModule.md |
| N-COMP-43 | COMPONENT | ChargingStationsModule | N-CAP-36 | GROUNDED | pie_vault/03_Components/CMP_43_ChargingStationsModule.md |
| N-COMP-44 | COMPONENT | PredictiveMaintenanceModule | N-CAP-17 | GROUNDED | pie_vault/03_Components/CMP_44_PredictiveMaintenanceModule.md |
| N-COMP-45 | COMPONENT | DigitalTwinModule | N-CAP-17 | GROUNDED | pie_vault/03_Components/CMP_45_DigitalTwinModule.md |
| N-COMP-46 | COMPONENT | DriverScoringModule | N-CAP-18 | GROUNDED | pie_vault/03_Components/CMP_46_DriverScoringModule.md |
| N-COMP-47 | COMPONENT | GeofenceAutomationModule | N-CAP-41 | GROUNDED | pie_vault/03_Components/CMP_47_GeofenceAutomationModule.md |
| N-COMP-48 | COMPONENT | MessagingModule | N-CAP-41 | GROUNDED | pie_vault/03_Components/CMP_48_MessagingModule.md |
| N-COMP-49 | COMPONENT | MultiTenantModule | N-CAP-31 | GROUNDED | pie_vault/03_Components/CMP_49_MultiTenantModule.md |
| N-COMP-50 | COMPONENT | BillingModule | N-CAP-31 | GROUNDED | pie_vault/03_Components/CMP_50_BillingModule.md |
| N-COMP-51 | COMPONENT | OnboardingModule | N-CAP-32 | GROUNDED | pie_vault/03_Components/CMP_51_OnboardingModule.md |
| N-COMP-52 | COMPONENT | NotificationProvidersModule | N-CAP-33 | GROUNDED | pie_vault/03_Components/CMP_52_NotificationProvidersModule.md |
| N-COMP-53 | COMPONENT | ErpConnectorsModule | N-CAP-34 | GROUNDED | pie_vault/03_Components/CMP_53_ErpConnectorsModule.md |
| N-COMP-54 | COMPONENT | ApiMarketplaceModule | N-CAP-34 | GROUNDED | pie_vault/03_Components/CMP_54_ApiMarketplaceModule.md |
| N-COMP-55 | COMPONENT | IntegrationHubModule | N-CAP-34 | GROUNDED | pie_vault/03_Components/CMP_55_IntegrationHubModule.md |
| N-COMP-56 | COMPONENT | AgenticAIModule | N-CAP-19 | GROUNDED | pie_vault/03_Components/CMP_56_AgenticAIModule.md |
| N-COMP-57 | COMPONENT | AftersalesModule | N-CAP-42 | GROUNDED | pie_vault/03_Components/CMP_57_AftersalesModule.md |
| N-COMP-58 | COMPONENT | RoadIntelligenceModule | N-CAP-19 | GROUNDED | pie_vault/03_Components/CMP_58_RoadIntelligenceModule.md |
| N-COMP-59 | COMPONENT | DataMonetizationModule | N-CAP-16 | GROUNDED | pie_vault/03_Components/CMP_59_DataMonetizationModule.md |
| N-COMP-60 | COMPONENT | DriverSessionsModule | N-CAP-13 | GROUNDED | pie_vault/03_Components/CMP_60_DriverSessionsModule.md |
| N-COMP-61 | COMPONENT | VehicleLifecycleModule | N-CAP-13 | GROUNDED | pie_vault/03_Components/CMP_61_VehicleLifecycleModule.md |
| N-COMP-62 | COMPONENT | SensorsModule | N-CAP-20 | GROUNDED | pie_vault/03_Components/CMP_62_SensorsModule.md |
| N-COMP-63 | COMPONENT | HasiModule | N-CAP-21 | GROUNDED | pie_vault/03_Components/CMP_63_HasiModule.md |
| N-COMP-64 | COMPONENT | RedisCacheModule | N-CAP-27 | GROUNDED | pie_vault/03_Components/CMP_64_RedisCacheModule.md |
| N-COMP-65 | COMPONENT | FleetEventsModule | N-CAP-30 | GROUNDED | pie_vault/03_Components/CMP_65_FleetEventsModule.md |
| N-COMP-66 | COMPONENT | HealthModule | N-CAP-39 | GROUNDED | pie_vault/03_Components/CMP_66_HealthModule.md |
| N-COMP-67 | COMPONENT | V2Module | N-CAP-25 | GROUNDED | pie_vault/03_Components/CMP_67_V2Module.md |
| N-COMP-68 | COMPONENT | Frontend Application | N-CAP-35 | GROUNDED | pie_vault/03_Components/CMP_68_Frontend_Application.md |
| N-COMP-69 | COMPONENT | FleetSocket Client | N-CAP-22 | GROUNDED | pie_vault/03_Components/CMP_69_FleetSocket_Client.md |
| N-COMP-70 | COMPONENT | AuthContext / AuthProvider | N-CAP-24 | GROUNDED | pie_vault/03_Components/CMP_70_AuthContext_AuthProvider.md |
| N-COMP-71 | COMPONENT | Frontend Page Modules (61 pages) | N-CAP-35 | GROUNDED | pie_vault/03_Components/CMP_71_Frontend_Page_Modules.md |
| N-COMP-72 | COMPONENT | SVG 2.0 Smart Vehicle Gateway | N-CAP-03 | GROUNDED | pie_vault/03_Components/CMP_72_svg_2_0_smart_vehicle_gateway.md |
| N-COMP-73 | COMPONENT | sensor_collector.py | N-CAP-01 | GROUNDED | pie_vault/03_Components/CMP_73_sensor_collector_py.md |
| N-COMP-74 | COMPONENT | hasi_bridge.py | N-CAP-02 | GROUNDED | pie_vault/03_Components/CMP_74_hasi_bridge_py.md |
| N-COMP-75 | COMPONENT | HASI v1.0.0 | N-CAP-02 | GROUNDED | pie_vault/03_Components/CMP_75_hasi_v1_0_0.md |
| N-COMP-76 | COMPONENT | SVG Main Telemetry Firmware | N-CAP-01 | GROUNDED | pie_vault/03_Components/CMP_76_svg_main_telemetry_firmware.md |
| N-COMP-77 | COMPONENT | SVG OTA Agent [*] | N-CAP-04 | WEAKLY GROUNDED | pie_vault/03_Components/CMP_77_svg_ota_agent.md |
| N-COMP-78 | COMPONENT | SVG Agent Configuration | N-CAP-01 | GROUNDED | pie_vault/03_Components/CMP_78_svg_agent_configuration.md |
| N-COMP-79 | COMPONENT | PostgreSQL 15 | N-CAP-26 | GROUNDED | pie_vault/03_Components/CMP_79_PostgreSQL_15.md |
| N-COMP-80 | COMPONENT | TimescaleDB | N-CAP-26 | GROUNDED | pie_vault/03_Components/CMP_80_TimescaleDB.md |
| N-COMP-81 | COMPONENT | Redis 7 | N-CAP-27 | GROUNDED | pie_vault/03_Components/CMP_81_Redis_7.md |
| N-COMP-82 | COMPONENT | S3 / MinIO Object Storage [*] | N-CAP-28 | WEAKLY GROUNDED | pie_vault/03_Components/CMP_82_S3_MinIO_Object_Storage.md |
| N-COMP-83 | COMPONENT | MQTT Broker (EMQX) | N-CAP-05 | GROUNDED | pie_vault/03_Components/CMP_83_mqtt_broker_emqx.md |
| N-COMP-84 | COMPONENT | Apache Kafka [*] | N-CAP-06 | WEAKLY GROUNDED | pie_vault/03_Components/CMP_84_apache_kafka.md |
| N-COMP-85 | COMPONENT | Apache Flink [*] | N-CAP-06 | WEAKLY GROUNDED | pie_vault/03_Components/CMP_85_apache_flink.md |
| N-COMP-86 | COMPONENT | Monitoring Stack | N-CAP-39 | GROUNDED | pie_vault/03_Components/CMP_86_Monitoring_Stack.md |
| N-COMP-87 | COMPONENT | Load Tests | N-CAP-40 | GROUNDED | pie_vault/03_Components/CMP_87_Load_Tests.md |
| N-COMP-88 | COMPONENT | CI/CD Workflows | N-CAP-40 | GROUNDED | pie_vault/03_Components/CMP_88_CICD_Workflows.md |
| N-COMP-89 | COMPONENT | Docker Compose Orchestration | N-CAP-40 | GROUNDED | pie_vault/03_Components/CMP_89_Docker_Compose_Orchestration.md |

---

## Inventory Summary

| Node Type | Count |
|---|---|
| DOMAIN | 17 |
| CAPABILITY | 42 |
| COMPONENT | 89 |
| **TOTAL** | **148** |

| Grounding Status | Count |
|---|---|
| GROUNDED | 141 |
| WEAKLY GROUNDED | 7 (N-CAP-04, N-CAP-06, N-CAP-28, N-COMP-77, N-COMP-82, N-COMP-84, N-COMP-85) |

---

## Navigation

- [← Explorer Map](pie_vault/00_Map/Program_Intelligence_Explorer.md)
- [PIE Index](pie_index.md)
