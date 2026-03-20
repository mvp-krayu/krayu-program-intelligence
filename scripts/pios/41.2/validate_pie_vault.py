#!/usr/bin/env python3
"""
validate_pie_vault.py
PIOS-41.2-ADDENDUM-SCRIPT-RECOVERY-v1

Validates the generated PIE vault against structural acceptance criteria.

Checks:
  AC-01  Total file count == 158
  AC-02  All required directories present
  AC-03  All 17 domain files present
  AC-04  All 42 capability files present
  AC-05  All 89 component files present
  AC-06  No empty files
  AC-07  [[wiki-link]] presence in navigation sections
  AC-08  Correct artifact metadata in key files
  AC-09  Explorer map contains all 17 domain entries
  AC-10  Traceability index contains all 89 component entries

Usage:
  python3 validate_pie_vault.py --input /tmp/pios_41_2_output
  python3 validate_pie_vault.py --input /tmp/pios_41_2_output --verbose
"""

import argparse
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Expected structural constants
# ---------------------------------------------------------------------------

EXPECTED_FILE_COUNT = 158

EXPECTED_DIRS = [
    ".obsidian",
    "00_Map",
    "01_Domains",
    "02_Capabilities",
    "03_Components",
    "04_Traceability",
    "05_Insights",
    "99_Config",
]

EXPECTED_DOMAIN_FILES = [
    "D_01_Edge_Data_Acquisition.md",
    "D_02_Telemetry_Transport_and_Messaging.md",
    "D_03_Fleet_Core_Operations.md",
    "D_04_Fleet_Vertical_Extensions.md",
    "D_05_Analytics_and_Intelligence.md",
    "D_06_AI_ML_Intelligence_Layer.md",
    "D_07_Sensor_and_Security_Ingestion.md",
    "D_08_Real_Time_Streaming_and_Gateway.md",
    "D_09_Access_Control_and_Identity.md",
    "D_10_Platform_Infrastructure_and_Data.md",
    "D_11_Event_Driven_Architecture.md",
    "D_12_SaaS_Platform_Layer.md",
    "D_13_External_Integration.md",
    "D_14_Frontend_Application.md",
    "D_15_EV_and_Electrification.md",
    "D_16_Operational_Engineering.md",
    "D_17_Extended_Operations_and_Driver_Services.md",
]

EXPECTED_CAP_FILES = [
    "C_01_Vehicle_Sensor_Collection.md",
    "C_02_Network_Security_Intelligence_Collection.md",
    "C_03_SVG_Device_Hardware_Platform.md",
    "C_04_SVG_Device_Firmware_Management.md",
    "C_05_MQTT_Telemetry_Transport.md",
    "C_06_Stream_Processing_Infrastructure.md",
    "C_07_Core_Fleet_Asset_Management.md",
    "C_08_Driver_Management.md",
    "C_09_Alert_and_Notification_Management.md",
    "C_10_Maintenance_and_Fuel_Operations.md",
    "C_11_Operational_Control_and_Device_Management.md",
    "C_12_Fleet_Type_Verticals.md",
    "C_13_Specialty_Transport_Extensions.md",
    "C_14_Fleet_Analytics_and_Reporting.md",
    "C_15_Compliance_Safety_and_Finance_Intelligence.md",
    "C_16_Executive_Intelligence_and_Data_Monetization.md",
    "C_17_Predictive_and_Anomaly_Intelligence.md",
    "C_18_Driver_Intelligence.md",
    "C_19_Agentic_AI_and_Road_Intelligence.md",
    "C_20_Sensor_Telemetry_Ingestion.md",
    "C_21_HASI_Security_Intelligence_Ingestion.md",
    "C_22_WebSocket_Event_Broadcasting.md",
    "C_23_JWT_Authentication.md",
    "C_24_Frontend_Auth_State_Management.md",
    "C_25_API_Versioning.md",
    "C_26_Primary_Data_Persistence.md",
    "C_27_Caching_Layer.md",
    "C_28_Object_Storage.md",
    "C_29_Platform_Monorepo_Container.md",
    "C_30_Domain_Event_Bus.md",
    "C_31_Multi_Tenant_Provisioning.md",
    "C_32_Tenant_Onboarding_and_Branding.md",
    "C_33_Notification_Delivery_Channels.md",
    "C_34_Enterprise_System_Integration.md",
    "C_35_Operator_Web_Application.md",
    "C_36_EV_Telemetry_and_Energy_Management.md",
    "C_37_Fleet_Electrification_Planning.md",
    "C_38_Device_OTA_Management.md",
    "C_39_Platform_Observability.md",
    "C_40_Delivery_and_Quality_Infrastructure.md",
    "C_41_Commercial_Operations_and_Dispatch_Services.md",
    "C_42_Customer_and_Ecosystem_Services.md",
]

# Component filenames for COMP-01 through COMP-89
EXPECTED_COMP_FILES = [
    "CMP_01_blueedge_platform.md",
    "CMP_02_AuthModule.md",
    "CMP_03_VehiclesModule.md",
    "CMP_04_DriversModule.md",
    "CMP_05_FleetsModule.md",
    "CMP_06_TripsModule.md",
    "CMP_07_AlertsModule.md",
    "CMP_08_MaintenanceModule.md",
    "CMP_09_FuelModule.md",
    "CMP_10_TankerModule.md",
    "CMP_11_BusModule.md",
    "CMP_12_TaxiModule.md",
    "CMP_13_OperationsModule.md",
    "CMP_14_DevicesModule.md",
    "CMP_15_NotificationsModule.md",
    "CMP_16_AnalyticsModule.md",
    "CMP_17_ReportsModule.md",
    "CMP_18_DiagnosticsModule.md",
    "CMP_19_ComplianceModule.md",
    "CMP_20_SafetyModule.md",
    "CMP_21_FinanceModule.md",
    "CMP_22_UsersModule.md",
    "CMP_23_ColdchainModule.md",
    "CMP_24_EvModule.md",
    "CMP_25_OtaModule.md",
    "CMP_26_V2gModule.md",
    "CMP_27_GatewaysModule.md",
    "CMP_28_SurgePricingModule.md",
    "CMP_29_DriverIncentivesModule.md",
    "CMP_30_ElectrificationModule.md",
    "CMP_31_DepotChargingModule.md",
    "CMP_32_ExecutiveModule.md",
    "CMP_33_AnomalyDetectionModule.md",
    "CMP_34_CrossBorderModule.md",
    "CMP_35_PermitsModule.md",
    "CMP_36_PartsMarketplaceModule.md",
    "CMP_37_FleetLifecycleModule.md",
    "CMP_38_DriverMobileModule.md",
    "CMP_39_FatigueRiskModule.md",
    "CMP_40_CustomerPortalModule.md",
    "CMP_41_BlockchainModule.md",
    "CMP_42_WhiteLabelModule.md",
    "CMP_43_ChargingStationsModule.md",
    "CMP_44_PredictiveMaintenanceModule.md",
    "CMP_45_DigitalTwinModule.md",
    "CMP_46_DriverScoringModule.md",
    "CMP_47_GeofenceAutomationModule.md",
    "CMP_48_MessagingModule.md",
    "CMP_49_MultiTenantModule.md",
    "CMP_50_BillingModule.md",
    "CMP_51_OnboardingModule.md",
    "CMP_52_NotificationProvidersModule.md",
    "CMP_53_ErpConnectorsModule.md",
    "CMP_54_ApiMarketplaceModule.md",
    "CMP_55_IntegrationHubModule.md",
    "CMP_56_AgenticAIModule.md",
    "CMP_57_AftersalesModule.md",
    "CMP_58_RoadIntelligenceModule.md",
    "CMP_59_DataMonetizationModule.md",
    "CMP_60_DriverSessionsModule.md",
    "CMP_61_VehicleLifecycleModule.md",
    "CMP_62_SensorsModule.md",
    "CMP_63_HasiModule.md",
    "CMP_64_RedisCacheModule.md",
    "CMP_65_FleetEventsModule.md",
    "CMP_66_HealthModule.md",
    "CMP_67_V2Module.md",
    "CMP_68_Frontend_Application.md",
    "CMP_69_FleetSocket_Client.md",
    "CMP_70_AuthContext_AuthProvider.md",
    "CMP_71_Frontend_Page_Modules.md",
    "CMP_72_svg_2_0_smart_vehicle_gateway.md",
    "CMP_73_sensor_collector_py.md",
    "CMP_74_hasi_bridge_py.md",
    "CMP_75_hasi_v1_0_0.md",
    "CMP_76_svg_main_telemetry_firmware.md",
    "CMP_77_svg_ota_agent.md",
    "CMP_78_svg_agent_configuration.md",
    "CMP_79_PostgreSQL_15.md",
    "CMP_80_TimescaleDB.md",
    "CMP_81_Redis_7.md",
    "CMP_82_S3_MinIO_Object_Storage.md",
    "CMP_83_mqtt_broker_emqx.md",
    "CMP_84_apache_kafka.md",
    "CMP_85_apache_flink.md",
    "CMP_86_Monitoring_Stack.md",
    "CMP_87_Load_Tests.md",
    "CMP_88_CICD_Workflows.md",
    "CMP_89_Docker_Compose_Orchestration.md",
]

EXPECTED_OTHER_FILES = [
    "00_Map/Program_Intelligence_Explorer.md",
    "04_Traceability/semantic_traceability_index.md",
    "05_Insights/semantic_elevation_report.md",
    "05_Insights/executive_readability_map.md",
    "99_Config/graph_settings.md",
    ".obsidian/app.json",
    ".obsidian/appearance.json",
    ".obsidian/core-plugins.json",
    ".obsidian/graph.json",
    ".obsidian/workspace.json",
]

DOMAIN_IDS  = [f"DOMAIN-{str(i).zfill(2)}" for i in range(1, 18)]
CAP_IDS     = [f"CAP-{str(i).zfill(2)}" for i in range(1, 43)]
COMP_IDS    = [f"COMP-{str(i).zfill(2)}" for i in range(1, 90)]


# ---------------------------------------------------------------------------
# Validation helper
# ---------------------------------------------------------------------------

class ValidationResult:
    def __init__(self, criterion: str):
        self.criterion = criterion
        self.passed = True
        self.messages: list[str] = []

    def fail(self, msg: str):
        self.passed = False
        self.messages.append(f"  FAIL: {msg}")

    def info(self, msg: str):
        self.messages.append(f"  INFO: {msg}")

    def status(self) -> str:
        return "PASS" if self.passed else "FAIL"


# ---------------------------------------------------------------------------
# Acceptance criteria
# ---------------------------------------------------------------------------

def ac01_file_count(vault: Path) -> ValidationResult:
    r = ValidationResult(f"AC-01  Total file count == {EXPECTED_FILE_COUNT}")
    files = [f for f in vault.rglob("*") if f.is_file()]
    count = len(files)
    if count == EXPECTED_FILE_COUNT:
        r.info(f"File count = {count}")
    else:
        r.fail(f"Expected {EXPECTED_FILE_COUNT} files, found {count}")
    return r


def ac02_directories_present(vault: Path) -> ValidationResult:
    r = ValidationResult("AC-02  All required directories present")
    for d in EXPECTED_DIRS:
        p = vault / d
        if p.is_dir():
            r.info(f"FOUND dir: {d}/")
        else:
            r.fail(f"MISSING dir: {d}/")
    return r


def ac03_domain_files(vault: Path) -> ValidationResult:
    r = ValidationResult(f"AC-03  All {len(EXPECTED_DOMAIN_FILES)} domain files present")
    for fname in EXPECTED_DOMAIN_FILES:
        p = vault / "01_Domains" / fname
        if p.exists():
            r.info(f"FOUND: 01_Domains/{fname}")
        else:
            r.fail(f"MISSING: 01_Domains/{fname}")
    return r


def ac04_capability_files(vault: Path) -> ValidationResult:
    r = ValidationResult(f"AC-04  All {len(EXPECTED_CAP_FILES)} capability files present")
    for fname in EXPECTED_CAP_FILES:
        p = vault / "02_Capabilities" / fname
        if p.exists():
            r.info(f"FOUND: 02_Capabilities/{fname}")
        else:
            r.fail(f"MISSING: 02_Capabilities/{fname}")
    return r


def ac05_component_files(vault: Path) -> ValidationResult:
    r = ValidationResult(f"AC-05  All {len(EXPECTED_COMP_FILES)} component files present")
    missing = []
    for fname in EXPECTED_COMP_FILES:
        p = vault / "03_Components" / fname
        if p.exists():
            r.info(f"FOUND: 03_Components/{fname}")
        else:
            missing.append(fname)
    if missing:
        for m in missing:
            r.fail(f"MISSING: 03_Components/{m}")
    return r


def ac06_no_empty_files(vault: Path) -> ValidationResult:
    r = ValidationResult("AC-06  No empty files")
    empty = []
    for f in sorted(vault.rglob("*")):
        if f.is_file() and f.stat().st_size == 0:
            empty.append(str(f.relative_to(vault)))
    if empty:
        for e in empty:
            r.fail(f"Empty file: {e}")
    else:
        all_files = sum(1 for f in vault.rglob("*") if f.is_file())
        r.info(f"All {all_files} files are non-empty")
    return r


def ac07_wiki_links(vault: Path) -> ValidationResult:
    r = ValidationResult("AC-07  [[wiki-link]] format present in navigation sections")
    # Check a sample of domain files for navigation [[links]]
    sample_checks = [
        ("01_Domains/D_01_Edge_Data_Acquisition.md", "[[C_01_Vehicle_Sensor_Collection]]"),
        ("01_Domains/D_11_Event_Driven_Architecture.md", "[[C_30_Domain_Event_Bus]]"),
        ("02_Capabilities/C_01_Vehicle_Sensor_Collection.md", "[[D_01_Edge_Data_Acquisition]]"),
        ("02_Capabilities/C_30_Domain_Event_Bus.md", "[[D_11_Event_Driven_Architecture]]"),
        ("03_Components/CMP_73_sensor_collector_py.md", "[[C_01_Vehicle_Sensor_Collection]]"),
        ("03_Components/CMP_65_FleetEventsModule.md", "[[C_30_Domain_Event_Bus]]"),
        ("03_Components/CMP_84_apache_kafka.md", "[[C_06_Stream_Processing_Infrastructure]]"),
        ("03_Components/CMP_01_blueedge_platform.md", "[[C_29_Platform_Monorepo_Container]]"),
    ]
    for rel_path, expected_link in sample_checks:
        p = vault / rel_path
        if not p.exists():
            r.fail(f"{rel_path}: file missing")
            continue
        text = p.read_text(encoding="utf-8")
        if expected_link in text:
            r.info(f"{rel_path}: link '{expected_link}' present")
        else:
            r.fail(f"{rel_path}: expected link '{expected_link}' not found")
    # Also check all domain files have at least one [[...]] link
    domain_dir = vault / "01_Domains"
    for dom_file in sorted(domain_dir.glob("*.md")):
        text = dom_file.read_text(encoding="utf-8")
        if "[[" in text and "]]" in text:
            r.info(f"01_Domains/{dom_file.name}: [[...]] links present")
        else:
            r.fail(f"01_Domains/{dom_file.name}: no [[...]] links found")
    return r


def ac08_artifact_metadata(vault: Path) -> ValidationResult:
    r = ValidationResult("AC-08  Key artifact metadata present in explorer and config files")
    checks = {
        "00_Map/Program_Intelligence_Explorer.md": [
            "PIOS-41.2-PIE-EXPLORER",
            "PIOS-41.2-RUN01-CONTRACT-v1",
            "PIE-MANIFEST-BLUEEDGE-v3.23-RUN03-R01",
            "89",
            "17",
            "42",
            "148",
        ],
        "04_Traceability/semantic_traceability_index.md": [
            "PIOS-41.2-TRACEABILITY-INDEX",
            "89",
            "84.3%",
        ],
        "99_Config/graph_settings.md": [
            "PIOS-41.2-GRAPH-SETTINGS",
            "manifest_compliance: VERIFIED",
        ],
    }
    for rel_path, tokens in checks.items():
        p = vault / rel_path
        if not p.exists():
            r.fail(f"{rel_path}: file missing")
            continue
        text = p.read_text(encoding="utf-8")
        for token in tokens:
            if token in text:
                r.info(f"{rel_path}: token '{token}' present")
            else:
                r.fail(f"{rel_path}: token '{token}' missing")
    return r


def ac09_explorer_domain_entries(vault: Path) -> ValidationResult:
    r = ValidationResult("AC-09  Explorer map contains all 17 domain entries")
    p = vault / "00_Map/Program_Intelligence_Explorer.md"
    if not p.exists():
        r.fail("Program_Intelligence_Explorer.md missing")
        return r
    text = p.read_text(encoding="utf-8")
    for dom_id in DOMAIN_IDS:
        if dom_id in text:
            r.info(f"Explorer: {dom_id} present")
        else:
            r.fail(f"Explorer: {dom_id} missing")
    return r


def ac10_traceability_comp_entries(vault: Path) -> ValidationResult:
    r = ValidationResult("AC-10  Traceability index contains all 89 component IDs")
    p = vault / "04_Traceability/semantic_traceability_index.md"
    if not p.exists():
        r.fail("semantic_traceability_index.md missing")
        return r
    text = p.read_text(encoding="utf-8")
    missing = [cid for cid in COMP_IDS if cid not in text]
    if missing:
        for m in missing:
            r.fail(f"Traceability index: {m} missing")
    else:
        r.info(f"All {len(COMP_IDS)} component IDs present in traceability index")
    return r


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate PIOS 41.2 PIE vault against structural acceptance criteria."
    )
    parser.add_argument(
        "--input",
        default="/tmp/pios_41_2_output",
        help="Path to generated vault directory (default: /tmp/pios_41_2_output)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show INFO messages in addition to PASS/FAIL.",
    )
    args = parser.parse_args()

    vault = Path(args.input)
    if not vault.exists():
        print(f"ERROR: Input directory not found: {vault}")
        print("       Run build_pie_vault.py first.")
        sys.exit(1)

    print(f"Validating: {vault}")
    print()

    checks = [
        ac01_file_count,
        ac02_directories_present,
        ac03_domain_files,
        ac04_capability_files,
        ac05_component_files,
        ac06_no_empty_files,
        ac07_wiki_links,
        ac08_artifact_metadata,
        ac09_explorer_domain_entries,
        ac10_traceability_comp_entries,
    ]

    results = [fn(vault) for fn in checks]

    all_pass = True
    for res in results:
        print(f"[{res.status()}] {res.criterion}")
        if args.verbose or not res.passed:
            for msg in res.messages:
                print(msg)
        if not res.passed:
            all_pass = False

    print()
    if all_pass:
        print(f"VALIDATION RESULT: PASS")
        print(f"All {len(results)} acceptance criteria passed.")
        sys.exit(0)
    else:
        failed = sum(1 for res in results if not res.passed)
        print(f"VALIDATION RESULT: FAIL")
        print(f"{failed} of {len(results)} criteria failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()
