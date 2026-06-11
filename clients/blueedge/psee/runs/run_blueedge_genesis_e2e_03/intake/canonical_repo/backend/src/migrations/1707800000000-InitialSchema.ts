import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1707800000000 implements MigrationInterface {
  name = 'InitialSchema1707800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ──────────────── EXTENSIONS ────────────────
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // PostGIS optional — using jsonb for geometry instead

    // ──────────────── ENUM TYPES ────────────────
    await queryRunner.query(`CREATE TYPE "fleet_type_enum" AS ENUM ('tanker', 'bus', 'taxi')`);
    await queryRunner.query(`CREATE TYPE "vehicle_status_enum" AS ENUM ('active', 'inactive', 'maintenance', 'decommissioned')`);
    await queryRunner.query(`CREATE TYPE "driver_status_enum" AS ENUM ('active', 'inactive', 'suspended', 'on_leave')`);
    await queryRunner.query(`CREATE TYPE "trip_status_enum" AS ENUM ('planned', 'assigned', 'in_progress', 'completed', 'cancelled', 'delayed')`);
    await queryRunner.query(`CREATE TYPE "alert_severity_enum" AS ENUM ('critical', 'high', 'medium', 'low', 'info')`);
    await queryRunner.query(`CREATE TYPE "alert_status_enum" AS ENUM ('active', 'acknowledged', 'resolved', 'dismissed', 'escalated')`);
    await queryRunner.query(`CREATE TYPE "work_order_status_enum" AS ENUM ('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled')`);
    await queryRunner.query(`CREATE TYPE "work_order_priority_enum" AS ENUM ('emergency', 'high', 'medium', 'low')`);
    await queryRunner.query(`CREATE TYPE "device_status_enum" AS ENUM ('provisioned', 'active', 'inactive', 'maintenance', 'decommissioned')`);
    await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM ('admin', 'fleet_manager', 'dispatcher', 'driver', 'customer', 'viewer')`);
    await queryRunner.query(`CREATE TYPE "compliance_type_enum" AS ENUM ('hos', 'dvir', 'inspection', 'certification', 'permit', 'emission', 'hazmat', 'insurance', 'registration')`);
    await queryRunner.query(`CREATE TYPE "compliance_status_enum" AS ENUM ('compliant', 'non_compliant', 'pending', 'expired', 'waiver')`);
    await queryRunner.query(`CREATE TYPE "safety_event_type_enum" AS ENUM ('harsh_braking', 'harsh_acceleration', 'harsh_cornering', 'speeding', 'rollover_risk', 'collision_warning', 'collision_detected', 'lane_departure', 'fatigue_detected', 'distraction_detected', 'seatbelt_violation', 'tailgating', 'red_light', 'stop_sign', 'phone_use', 'smoking', 'cargo_shift', 'gas_leak', 'temperature_breach', 'overfill', 'panic_button')`);
    await queryRunner.query(`CREATE TYPE "safety_severity_enum" AS ENUM ('critical', 'high', 'medium', 'low')`);
    await queryRunner.query(`CREATE TYPE "safety_status_enum" AS ENUM ('open', 'acknowledged', 'reviewed', 'dismissed', 'escalated')`);
    await queryRunner.query(`CREATE TYPE "ev_charging_enum" AS ENUM ('not_charging', 'charging_ac', 'charging_dc', 'scheduled', 'error')`);
    await queryRunner.query(`CREATE TYPE "ota_type_enum" AS ENUM ('firmware', 'config', 'model', 'map', 'certificate', 'application')`);
    await queryRunner.query(`CREATE TYPE "ota_status_enum" AS ENUM ('pending', 'downloading', 'downloaded', 'installing', 'verifying', 'completed', 'failed', 'rolled_back', 'cancelled')`);
    await queryRunner.query(`CREATE TYPE "v2g_session_type_enum" AS ENUM ('v2g_discharge', 'g2v_charge', 'v2h_home', 'v2b_building', 'bidirectional')`);
    await queryRunner.query(`CREATE TYPE "v2g_status_enum" AS ENUM ('active', 'completed', 'paused', 'failed', 'scheduled', 'cancelled')`);
    await queryRunner.query(`CREATE TYPE "dtc_system_enum" AS ENUM ('powertrain', 'chassis', 'body', 'network', 'manufacturer')`);
    await queryRunner.query(`CREATE TYPE "dtc_severity_enum" AS ENUM ('critical', 'high', 'medium', 'low', 'info')`);
    await queryRunner.query(`CREATE TYPE "dtc_status_enum" AS ENUM ('active', 'pending', 'confirmed', 'cleared', 'resolved')`);
    await queryRunner.query(`CREATE TYPE "dtc_protocol_enum" AS ENUM ('j1939', 'obd2', 'uds', 'proprietary')`);
    await queryRunner.query(`CREATE TYPE "finance_category_enum" AS ENUM ('fuel', 'maintenance', 'toll', 'insurance', 'fine', 'lease', 'depreciation', 'tire', 'permit', 'salary', 'revenue', 'other')`);
    await queryRunner.query(`CREATE TYPE "finance_type_enum" AS ENUM ('expense', 'revenue', 'refund', 'adjustment')`);
    await queryRunner.query(`CREATE TYPE "finance_status_enum" AS ENUM ('pending', 'approved', 'paid', 'rejected', 'cancelled')`);
    await queryRunner.query(`CREATE TYPE "coldchain_status_enum" AS ENUM ('active', 'completed', 'breached', 'cancelled')`);
    await queryRunner.query(`CREATE TYPE "coldchain_temp_enum" AS ENUM ('normal', 'warning', 'breach', 'critical')`);
    await queryRunner.query(`CREATE TYPE "notification_type_enum" AS ENUM ('alert', 'info', 'warning', 'success', 'system')`);
    await queryRunner.query(`CREATE TYPE "fuel_type_enum" AS ENUM ('fill', 'drain', 'theft_suspected', 'adjustment')`);
    await queryRunner.query(`CREATE TYPE "geofence_type_enum" AS ENUM ('inclusion', 'exclusion', 'speed_zone', 'loading_zone', 'rest_area')`);

    // ──────────────── TABLES ────────────────

    // 1. Users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "email" varchar(200) NOT NULL,
        "passwordHash" varchar(255) NOT NULL,
        "firstName" varchar(100) NOT NULL,
        "lastName" varchar(100) NOT NULL,
        "role" "user_role_enum" DEFAULT 'viewer' NOT NULL,
        "orgId" uuid,
        "status" varchar(20) DEFAULT 'active' NOT NULL,
        "permissions" jsonb,
        "lastLoginAt" timestamptz,
        "refreshToken" varchar(500),
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // 2. Fleets
    await queryRunner.query(`
      CREATE TABLE "fleets" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "orgId" uuid NOT NULL,
        "name" varchar(100) NOT NULL,
        "fleetType" "fleet_type_enum" DEFAULT 'tanker' NOT NULL,
        "operationalRegion" varchar(100),
        "status" varchar(20) DEFAULT 'active' NOT NULL,
        "vehicleCount" int DEFAULT 0,
        "metadata" jsonb,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_fleets" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_fleets_orgId" ON "fleets" ("orgId")`);
    await queryRunner.query(`CREATE INDEX "IDX_fleets_fleetType" ON "fleets" ("fleetType")`);

    // 3. Vehicles
    await queryRunner.query(`
      CREATE TABLE "vehicles" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vin" varchar(17) NOT NULL,
        "licensePlate" varchar(15) NOT NULL,
        "fleetId" uuid NOT NULL,
        "fleetType" "fleet_type_enum" DEFAULT 'tanker' NOT NULL,
        "make" varchar(50) NOT NULL,
        "model" varchar(50) NOT NULL,
        "year" int NOT NULL,
        "color" varchar(30),
        "status" "vehicle_status_enum" DEFAULT 'active' NOT NULL,
        "specifications" jsonb,
        "tankUnit" jsonb,
        "certifications" jsonb,
        "lastKnownPosition" jsonb,
        "lastLatitude" float,
        "lastLongitude" float,
        "lastSpeed" float,
        "lastHeading" float,
        "lastPositionAt" timestamptz,
        "odometerKm" float,
        "engineHours" float,
        "fuelLevelPercent" float,
        "currentDriverId" uuid,
        "currentTripId" uuid,
        "deviceId" varchar(50),
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_vehicles" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_vehicles_vin" UNIQUE ("vin")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_vehicles_fleetId_status" ON "vehicles" ("fleetId", "status")`);
    await queryRunner.query(`CREATE INDEX "IDX_vehicles_fleetType" ON "vehicles" ("fleetType")`);

    // 4. Drivers
    await queryRunner.query(`
      CREATE TABLE "drivers" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "orgId" uuid NOT NULL,
        "employeeId" varchar(30) NOT NULL,
        "firstName" varchar(100) NOT NULL,
        "lastName" varchar(100) NOT NULL,
        "firstNameAr" varchar(100),
        "lastNameAr" varchar(100),
        "email" varchar(200),
        "phone" varchar(20),
        "status" "driver_status_enum" DEFAULT 'active' NOT NULL,
        "licenses" jsonb,
        "certifications" jsonb,
        "training" jsonb,
        "safetyScore" float DEFAULT 100,
        "efficiencyScore" float DEFAULT 100,
        "complianceScore" float DEFAULT 100,
        "currentVehicleId" uuid,
        "photoUrl" varchar(255),
        "dateOfBirth" date,
        "hireDate" date,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_drivers" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_drivers_employeeId" UNIQUE ("employeeId")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_drivers_orgId_status" ON "drivers" ("orgId", "status")`);

    // 5. Trips
    await queryRunner.query(`
      CREATE TABLE "trips" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid NOT NULL,
        "driverId" uuid,
        "fleetId" uuid NOT NULL,
        "tripNumber" varchar(30) NOT NULL,
        "status" "trip_status_enum" DEFAULT 'planned' NOT NULL,
        "startTime" timestamptz,
        "endTime" timestamptz,
        "startLocation" jsonb,
        "endLocation" jsonb,
        "distanceKm" float,
        "durationMinutes" int,
        "fuelConsumedL" float,
        "fuelEfficiency" float,
        "route" jsonb,
        "waypoints" jsonb,
        "cargoManifest" jsonb,
        "scores" jsonb,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_trips" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_trips_number" UNIQUE ("tripNumber")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_trips_vehicleId_startTime" ON "trips" ("vehicleId", "startTime")`);
    await queryRunner.query(`CREATE INDEX "IDX_trips_driverId_startTime" ON "trips" ("driverId", "startTime")`);
    await queryRunner.query(`CREATE INDEX "IDX_trips_status" ON "trips" ("status")`);

    // 6. Alerts
    await queryRunner.query(`
      CREATE TABLE "alerts" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid,
        "driverId" uuid,
        "tripId" uuid,
        "type" varchar(50) NOT NULL,
        "severity" "alert_severity_enum" DEFAULT 'medium' NOT NULL,
        "status" "alert_status_enum" DEFAULT 'active' NOT NULL,
        "title" varchar(200) NOT NULL,
        "message" text,
        "latitude" float,
        "longitude" float,
        "data" jsonb,
        "acknowledgedBy" uuid,
        "acknowledgedAt" timestamptz,
        "resolvedAt" timestamptz,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_alerts" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_alerts_vehicleId" ON "alerts" ("vehicleId")`);
    await queryRunner.query(`CREATE INDEX "IDX_alerts_severity_status" ON "alerts" ("severity", "status")`);
    await queryRunner.query(`CREATE INDEX "IDX_alerts_createdAt" ON "alerts" ("createdAt")`);

    // 7. Maintenance Work Orders
    await queryRunner.query(`
      CREATE TABLE "work_orders" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid NOT NULL,
        "orderNumber" varchar(30) NOT NULL,
        "title" varchar(200) NOT NULL,
        "description" text,
        "type" varchar(50) DEFAULT 'preventive',
        "status" "work_order_status_enum" DEFAULT 'draft' NOT NULL,
        "priority" "work_order_priority_enum" DEFAULT 'medium' NOT NULL,
        "assignedTo" uuid,
        "scheduledDate" date,
        "completedDate" date,
        "estimatedHours" float,
        "actualHours" float,
        "estimatedCost" decimal(10,2),
        "actualCost" decimal(10,2),
        "parts" jsonb,
        "laborItems" jsonb,
        "notes" text,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_work_orders" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_work_orders_number" UNIQUE ("orderNumber")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_work_orders_vehicleId" ON "work_orders" ("vehicleId")`);
    await queryRunner.query(`CREATE INDEX "IDX_work_orders_status_priority" ON "work_orders" ("status", "priority")`);

    // 8. Devices
    await queryRunner.query(`
      CREATE TABLE "devices" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "serialNumber" varchar(50) NOT NULL,
        "type" varchar(30) DEFAULT 'svg',
        "status" "device_status_enum" DEFAULT 'provisioned' NOT NULL,
        "vehicleId" uuid,
        "firmwareVersion" varchar(20),
        "hardwareVersion" varchar(20),
        "lastSeenAt" timestamptz,
        "metadata" jsonb,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_devices" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_devices_serial" UNIQUE ("serialNumber")
      )
    `);

    // 9. Fuel Transactions
    await queryRunner.query(`
      CREATE TABLE "fuel_transactions" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid NOT NULL,
        "driverId" uuid,
        "tripId" uuid,
        "type" "fuel_type_enum" DEFAULT 'fill' NOT NULL,
        "volumeL" float NOT NULL,
        "costPerL" decimal(8,4),
        "totalCost" decimal(10,2),
        "currency" varchar(3) DEFAULT 'AED',
        "fuelType" varchar(20),
        "odometerKm" float,
        "stationName" varchar(100),
        "latitude" float,
        "longitude" float,
        "transactionTime" timestamptz NOT NULL,
        "cardNumber" varchar(30),
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_fuel_transactions" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_fuel_vehicleId_time" ON "fuel_transactions" ("vehicleId", "transactionTime")`);

    // 10. Notifications
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "userId" uuid NOT NULL,
        "type" "notification_type_enum" DEFAULT 'info' NOT NULL,
        "title" varchar(200) NOT NULL,
        "message" text,
        "read" boolean DEFAULT false,
        "data" jsonb,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_notifications_userId_read" ON "notifications" ("userId", "read")`);

    // 11. Geofences
    await queryRunner.query(`
      CREATE TABLE "geofences" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "orgId" uuid NOT NULL,
        "name" varchar(100) NOT NULL,
        "type" "geofence_type_enum" DEFAULT 'inclusion' NOT NULL,
        "geometry" jsonb NOT NULL,
        "radius" float,
        "metadata" jsonb,
        "active" boolean DEFAULT true,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_geofences" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_geofences_orgId" ON "geofences" ("orgId")`);

    // 12. Bus Routes
    await queryRunner.query(`
      CREATE TABLE "bus_routes" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "routeNumber" varchar(20) NOT NULL,
        "name" varchar(100) NOT NULL,
        "fleetId" uuid NOT NULL,
        "stops" jsonb,
        "schedule" jsonb,
        "active" boolean DEFAULT true,
        "metadata" jsonb,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_bus_routes" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_bus_routes_number" UNIQUE ("routeNumber")
      )
    `);

    // 13. Taxi Trips
    await queryRunner.query(`
      CREATE TABLE "taxi_trips" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid NOT NULL,
        "driverId" uuid,
        "tripId" uuid,
        "bookingId" varchar(30),
        "status" varchar(30) DEFAULT 'requested',
        "pickupLocation" jsonb,
        "dropoffLocation" jsonb,
        "pickupTime" timestamptz,
        "dropoffTime" timestamptz,
        "distanceKm" float,
        "waitTimeMinutes" float,
        "fareAmount" decimal(10,2),
        "tipAmount" decimal(10,2),
        "paymentMethod" varchar(20),
        "currency" varchar(3) DEFAULT 'AED',
        "rating" float,
        "passengerCount" int DEFAULT 1,
        "metadata" jsonb,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_taxi_trips" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_taxi_trips_vehicleId" ON "taxi_trips" ("vehicleId")`);
    await queryRunner.query(`CREATE INDEX "IDX_taxi_trips_driverId" ON "taxi_trips" ("driverId")`);

    // 14. Cargo Manifests
    await queryRunner.query(`
      CREATE TABLE "cargo_manifests" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "tripId" uuid NOT NULL,
        "vehicleId" uuid NOT NULL,
        "manifestNumber" varchar(30),
        "compartments" jsonb,
        "totalVolumeL" float,
        "products" jsonb,
        "status" varchar(30) DEFAULT 'loaded',
        "bolNumber" varchar(50),
        "metadata" jsonb,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_cargo_manifests" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_cargo_manifests_tripId" ON "cargo_manifests" ("tripId")`);

    // 15. Custody Transfers
    await queryRunner.query(`
      CREATE TABLE "custody_transfers" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "tripId" uuid NOT NULL,
        "vehicleId" uuid NOT NULL,
        "facilityId" varchar(50),
        "transferType" varchar(20) DEFAULT 'loading',
        "compartmentDetails" jsonb,
        "timing" jsonb,
        "safetyChecklist" jsonb,
        "documentation" jsonb,
        "status" varchar(30) DEFAULT 'pending',
        "blockchainTxHash" varchar(66),
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_custody_transfers" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_custody_transfers_tripId" ON "custody_transfers" ("tripId")`);

    // 16. Compliance Records
    await queryRunner.query(`
      CREATE TABLE "compliance_records" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "orgId" uuid NOT NULL,
        "vehicleId" uuid,
        "driverId" uuid,
        "type" "compliance_type_enum" DEFAULT 'inspection' NOT NULL,
        "title" varchar(200) NOT NULL,
        "description" text,
        "status" "compliance_status_enum" DEFAULT 'pending' NOT NULL,
        "regulatoryBody" varchar(30) DEFAULT 'local',
        "effectiveDate" date,
        "dueDate" date,
        "completedDate" date,
        "details" jsonb,
        "violations" jsonb,
        "documents" jsonb,
        "inspectorId" uuid,
        "inspectorName" varchar(200),
        "score" float,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_compliance_records" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_compliance_vehicleId_type" ON "compliance_records" ("vehicleId", "type")`);
    await queryRunner.query(`CREATE INDEX "IDX_compliance_status_due" ON "compliance_records" ("status", "dueDate")`);

    // 17. Safety Events
    await queryRunner.query(`
      CREATE TABLE "safety_events" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid NOT NULL,
        "driverId" uuid,
        "tripId" uuid,
        "eventType" "safety_event_type_enum" NOT NULL,
        "severity" "safety_severity_enum" DEFAULT 'medium' NOT NULL,
        "eventTime" timestamptz NOT NULL,
        "durationMs" int,
        "latitude" float,
        "longitude" float,
        "speed" float,
        "heading" float,
        "sensorData" jsonb,
        "videoClips" jsonb,
        "status" "safety_status_enum" DEFAULT 'open' NOT NULL,
        "reviewedBy" uuid,
        "reviewNotes" text,
        "confidenceScore" float,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_safety_events" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_safety_vehicleId_time" ON "safety_events" ("vehicleId", "eventTime")`);
    await queryRunner.query(`CREATE INDEX "IDX_safety_driverId_time" ON "safety_events" ("driverId", "eventTime")`);
    await queryRunner.query(`CREATE INDEX "IDX_safety_severity_status" ON "safety_events" ("severity", "status")`);

    // 18. Cold Chain Shipments
    await queryRunner.query(`
      CREATE TABLE "coldchain_shipments" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid NOT NULL,
        "tripId" uuid,
        "driverId" uuid,
        "status" "coldchain_status_enum" DEFAULT 'active' NOT NULL,
        "temperatureRange" jsonb NOT NULL,
        "temperatureStatus" "coldchain_temp_enum" DEFAULT 'normal' NOT NULL,
        "currentTemperatureC" float,
        "zones" jsonb,
        "cargo" jsonb,
        "breachLog" jsonb,
        "loadedAt" timestamptz,
        "deliveredAt" timestamptz,
        "notes" text,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_coldchain_shipments" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_coldchain_vehicleId_status" ON "coldchain_shipments" ("vehicleId", "status")`);

    // 19. Electric Vehicles
    await queryRunner.query(`
      CREATE TABLE "ev_vehicles" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid NOT NULL,
        "batteryCapacityKwh" float NOT NULL,
        "stateOfChargePercent" float DEFAULT 0,
        "batteryHealthPercent" float DEFAULT 100,
        "estimatedRangeKm" float,
        "energyConsumptionKwhPer100km" float,
        "chargingStatus" "ev_charging_enum" DEFAULT 'not_charging' NOT NULL,
        "chargingPowerKw" float,
        "estimatedChargeTimeMin" int,
        "currentChargingStationId" uuid,
        "batteryThermal" jsonb,
        "chargingHistory" jsonb,
        "totalChargeCycles" int DEFAULT 0,
        "lifetimeEnergyKwh" float DEFAULT 0,
        "regenerativeBraking" jsonb,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_ev_vehicles" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_ev_vehicleId" UNIQUE ("vehicleId")
      )
    `);

    // 20. OTA Updates
    await queryRunner.query(`
      CREATE TABLE "ota_updates" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "deviceId" uuid NOT NULL,
        "vehicleId" uuid,
        "campaignId" uuid,
        "packageName" varchar(100) NOT NULL,
        "fromVersion" varchar(30) NOT NULL,
        "toVersion" varchar(30) NOT NULL,
        "updateType" "ota_type_enum" DEFAULT 'firmware' NOT NULL,
        "status" "ota_status_enum" DEFAULT 'pending' NOT NULL,
        "packageSizeBytes" bigint,
        "checksumSha256" varchar(64),
        "progressPercent" float DEFAULT 0,
        "scheduledAt" timestamptz,
        "startedAt" timestamptz,
        "completedAt" timestamptz,
        "retryCount" int DEFAULT 0,
        "errorMessage" text,
        "rollbackInfo" jsonb,
        "preConditions" jsonb,
        "approvedBy" uuid,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_ota_updates" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_ota_deviceId_status" ON "ota_updates" ("deviceId", "status")`);
    await queryRunner.query(`CREATE INDEX "IDX_ota_campaignId" ON "ota_updates" ("campaignId")`);

    // 21. V2G Sessions
    await queryRunner.query(`
      CREATE TABLE "v2g_sessions" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid NOT NULL,
        "stationId" uuid NOT NULL,
        "driverId" uuid,
        "sessionType" "v2g_session_type_enum" DEFAULT 'g2v_charge' NOT NULL,
        "status" "v2g_status_enum" DEFAULT 'active' NOT NULL,
        "startTime" timestamptz NOT NULL,
        "endTime" timestamptz,
        "energyKwh" float DEFAULT 0,
        "peakPowerKw" float,
        "averagePowerKw" float,
        "socStartPercent" float,
        "socEndPercent" float,
        "revenueEarned" decimal(10,2) DEFAULT 0,
        "costIncurred" decimal(10,2) DEFAULT 0,
        "gridPricePerKwh" float,
        "gridSignals" jsonb,
        "batteryImpact" jsonb,
        "notes" text,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_v2g_sessions" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_v2g_vehicleId_status" ON "v2g_sessions" ("vehicleId", "status")`);
    await queryRunner.query(`CREATE INDEX "IDX_v2g_stationId_status" ON "v2g_sessions" ("stationId", "status")`);

    // 22. Diagnostic Records
    await queryRunner.query(`
      CREATE TABLE "diagnostic_records" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "vehicleId" uuid NOT NULL,
        "deviceId" uuid,
        "dtcCode" varchar(10) NOT NULL,
        "description" varchar(200) NOT NULL,
        "system" "dtc_system_enum" DEFAULT 'powertrain' NOT NULL,
        "severity" "dtc_severity_enum" DEFAULT 'medium' NOT NULL,
        "status" "dtc_status_enum" DEFAULT 'active' NOT NULL,
        "protocol" "dtc_protocol_enum" DEFAULT 'j1939' NOT NULL,
        "spn" int,
        "fmi" int,
        "occurrenceCount" int DEFAULT 1,
        "recordedAt" timestamptz NOT NULL,
        "clearedAt" timestamptz,
        "freezeFrame" jsonb,
        "aiAnalysis" jsonb,
        "workOrderId" uuid,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_diagnostic_records" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_diag_vehicleId_time" ON "diagnostic_records" ("vehicleId", "recordedAt")`);
    await queryRunner.query(`CREATE INDEX "IDX_diag_dtcCode" ON "diagnostic_records" ("dtcCode")`);
    await queryRunner.query(`CREATE INDEX "IDX_diag_severity_status" ON "diagnostic_records" ("severity", "status")`);

    // 23. Finance Transactions
    await queryRunner.query(`
      CREATE TABLE "finance_transactions" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "orgId" uuid NOT NULL,
        "fleetId" uuid,
        "vehicleId" uuid,
        "driverId" uuid,
        "category" "finance_category_enum" DEFAULT 'other' NOT NULL,
        "transactionType" "finance_type_enum" DEFAULT 'expense' NOT NULL,
        "amount" decimal(12,2) NOT NULL,
        "currency" varchar(3) DEFAULT 'AED',
        "transactionDate" date NOT NULL,
        "description" varchar(300),
        "vendor" varchar(100),
        "invoiceNumber" varchar(50),
        "receiptNumber" varchar(50),
        "status" "finance_status_enum" DEFAULT 'pending' NOT NULL,
        "approvedBy" uuid,
        "lineItems" jsonb,
        "attachments" jsonb,
        "relatedWorkOrderId" uuid,
        "relatedTripId" uuid,
        "createdAt" timestamptz DEFAULT now() NOT NULL,
        "updatedAt" timestamptz DEFAULT now() NOT NULL,
        CONSTRAINT "PK_finance_transactions" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_finance_orgId_date" ON "finance_transactions" ("orgId", "transactionDate")`);
    await queryRunner.query(`CREATE INDEX "IDX_finance_vehicleId_cat" ON "finance_transactions" ("vehicleId", "category")`);
    await queryRunner.query(`CREATE INDEX "IDX_finance_category_date" ON "finance_transactions" ("category", "transactionDate")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse dependency order
    const tables = [
      'finance_transactions', 'diagnostic_records', 'v2g_sessions', 'ota_updates',
      'ev_vehicles', 'coldchain_shipments', 'safety_events', 'compliance_records',
      'custody_transfers', 'cargo_manifests', 'taxi_trips', 'bus_routes',
      'geofences', 'notifications', 'fuel_transactions', 'devices',
      'work_orders', 'alerts', 'trips', 'drivers', 'vehicles', 'fleets', 'users'
    ];
    for (const table of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    }

    // Drop enum types
    const enums = [
      'fleet_type_enum', 'vehicle_status_enum', 'driver_status_enum', 'trip_status_enum',
      'alert_severity_enum', 'alert_status_enum', 'work_order_status_enum', 'work_order_priority_enum',
      'device_status_enum', 'user_role_enum', 'compliance_type_enum', 'compliance_status_enum',
      'safety_event_type_enum', 'safety_severity_enum', 'safety_status_enum',
      'ev_charging_enum', 'ota_type_enum', 'ota_status_enum',
      'v2g_session_type_enum', 'v2g_status_enum',
      'dtc_system_enum', 'dtc_severity_enum', 'dtc_status_enum', 'dtc_protocol_enum',
      'finance_category_enum', 'finance_type_enum', 'finance_status_enum',
      'coldchain_status_enum', 'coldchain_temp_enum',
      'notification_type_enum', 'fuel_type_enum', 'geofence_type_enum'
    ];
    for (const e of enums) {
      await queryRunner.query(`DROP TYPE IF EXISTS "${e}"`);
    }

    // PostGIS removal skipped — was not installed
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
