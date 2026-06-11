import { MigrationInterface, QueryRunner } from 'typeorm';

export class SensorsAndHasiIntegration1709100000000 implements MigrationInterface {
  name = 'SensorsAndHasiIntegration1709100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ══════════════════════════════════════════════════════════════
    // 1. SENSOR DEVICES TABLE
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sensor_devices" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "svgDeviceId" UUID NOT NULL REFERENCES "devices"("id") ON DELETE CASCADE,
        "svgHardwareId" VARCHAR(50) NOT NULL,
        "serialNumber" VARCHAR(50) UNIQUE NOT NULL,
        "model" VARCHAR(100) NOT NULL,
        "manufacturer" VARCHAR(100) NOT NULL,
        "firmwareVersion" VARCHAR(30),
        "sensorType" VARCHAR(40) NOT NULL DEFAULT 'custom',
        "verticalCategory" VARCHAR(30) DEFAULT 'general',
        "protocol" VARCHAR(20) NOT NULL DEFAULT 'can_fd',
        "canId" VARCHAR(20),
        "modbusAddress" INTEGER,
        "modbusRegister" INTEGER,
        "gpioPin" INTEGER,
        "i2cAddress" INTEGER,
        "bleUuid" VARCHAR(50),
        "protocolConfig" JSONB DEFAULT '{}',
        "status" VARCHAR(20) NOT NULL DEFAULT 'unpaired',
        "lastReadingAt" TIMESTAMP,
        "lastReadingValue" DECIMAL(12,4),
        "totalReadings" INTEGER DEFAULT 0,
        "errorCount" INTEGER DEFAULT 0,
        "signalStrength" DECIMAL(5,2),
        "batteryLevel" DECIMAL(5,2),
        "unit" VARCHAR(20) NOT NULL,
        "minRange" DECIMAL(12,4),
        "maxRange" DECIMAL(12,4),
        "resolution" DECIMAL(8,4),
        "accuracy" DECIMAL(8,4),
        "samplingIntervalMs" INTEGER DEFAULT 1000,
        "lastCalibratedAt" TIMESTAMP,
        "nextCalibrationDue" TIMESTAMP,
        "calibrationOffset" DECIMAL(8,4),
        "calibrationFactor" DECIMAL(8,6),
        "calibrationCurve" JSONB,
        "alertThresholdLow" DECIMAL(12,4),
        "alertThresholdHigh" DECIMAL(12,4),
        "criticalThresholdLow" DECIMAL(12,4),
        "criticalThresholdHigh" DECIMAL(12,4),
        "alertsEnabled" BOOLEAN DEFAULT true,
        "alertCooldownSeconds" INTEGER DEFAULT 60,
        "installLocation" VARCHAR(200),
        "mountLatitude" DECIMAL(9,6),
        "mountLongitude" DECIMAL(9,6),
        "wiringNotes" VARCHAR(200),
        "hazmatCertified" BOOLEAN DEFAULT false,
        "atexCertified" BOOLEAN DEFAULT false,
        "silRated" BOOLEAN DEFAULT false,
        "silLevel" INTEGER,
        "certificationNumber" VARCHAR(100),
        "pairedAt" TIMESTAMP,
        "pairedBy" VARCHAR(100),
        "unpairedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "notes" VARCHAR(500)
      );
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sensors_svgDeviceId" ON "sensor_devices" ("svgDeviceId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sensors_status" ON "sensor_devices" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_sensors_sensorType" ON "sensor_devices" ("sensorType")`);
    await queryRunner.query(`CREATE INDEX "IDX_sensors_protocol" ON "sensor_devices" ("protocol")`);

    // ══════════════════════════════════════════════════════════════
    // 2. SENSOR READINGS TABLE (TimescaleDB hypertable)
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sensor_readings" (
        "id" UUID DEFAULT gen_random_uuid(),
        "sensorId" UUID NOT NULL,
        "svgDeviceId" UUID NOT NULL,
        "sensorType" VARCHAR(50) NOT NULL,
        "timestamp" TIMESTAMPTZ NOT NULL,
        "value" DECIMAL(16,6) NOT NULL,
        "rawValue" DECIMAL(16,6),
        "unit" VARCHAR(20) NOT NULL,
        "quality" VARCHAR(15) DEFAULT 'good',
        "signalStrength" DECIMAL(5,2),
        "sensorTemperature" DECIMAL(5,2),
        "alertTriggered" BOOLEAN DEFAULT false,
        "alertType" VARCHAR(20) DEFAULT 'none',
        "latitude" DECIMAL(9,6),
        "longitude" DECIMAL(9,6),
        "vehicleSpeed" DECIMAL(6,2),
        "vehicleState" VARCHAR(20),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY ("id", "timestamp")
      );
    `);
    // Convert to TimescaleDB hypertable if extension available
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'timescaledb') THEN
          PERFORM create_hypertable('sensor_readings', 'timestamp', if_not_exists => TRUE);
        END IF;
      END $$;
    `);
    await queryRunner.query(`CREATE INDEX "IDX_readings_sensor_ts" ON "sensor_readings" ("sensorId", "timestamp" DESC)`);
    await queryRunner.query(`CREATE INDEX "IDX_readings_device_ts" ON "sensor_readings" ("svgDeviceId", "timestamp" DESC)`);

    // ══════════════════════════════════════════════════════════════
    // 3. SENSOR ALERTS TABLE
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sensor_alerts" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "sensorId" UUID NOT NULL,
        "svgDeviceId" UUID NOT NULL,
        "sensorType" VARCHAR(50) NOT NULL,
        "readingId" UUID,
        "alertType" VARCHAR(30) NOT NULL DEFAULT 'threshold_high',
        "severity" VARCHAR(10) NOT NULL DEFAULT 'medium',
        "status" VARCHAR(15) NOT NULL DEFAULT 'active',
        "triggerValue" DECIMAL(16,6) NOT NULL,
        "thresholdValue" DECIMAL(16,6),
        "unit" VARCHAR(20) NOT NULL,
        "message" VARCHAR(500) NOT NULL,
        "latitude" DECIMAL(9,6),
        "longitude" DECIMAL(9,6),
        "locationDescription" VARCHAR(200),
        "escalated" BOOLEAN DEFAULT false,
        "escalationLevel" INTEGER DEFAULT 0,
        "escalatedAt" TIMESTAMP,
        "escalatedTo" VARCHAR(100),
        "emergencyServicesNotified" BOOLEAN DEFAULT false,
        "hazmatProtocolActivated" BOOLEAN DEFAULT false,
        "acknowledgedAt" TIMESTAMP,
        "acknowledgedBy" VARCHAR(100),
        "resolvedAt" TIMESTAMP,
        "resolvedBy" VARCHAR(100),
        "resolutionNotes" VARCHAR(500),
        "rootCause" VARCHAR(500),
        "timeToAcknowledgeMs" INTEGER,
        "timeToResolveMs" INTEGER,
        "notificationsSent" JSONB DEFAULT '[]',
        "incidentId" UUID,
        "workOrderId" UUID,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX "IDX_alerts_sensor_ts" ON "sensor_alerts" ("sensorId", "createdAt" DESC)`);
    await queryRunner.query(`CREATE INDEX "IDX_alerts_device_ts" ON "sensor_alerts" ("svgDeviceId", "createdAt" DESC)`);
    await queryRunner.query(`CREATE INDEX "IDX_alerts_severity" ON "sensor_alerts" ("severity")`);
    await queryRunner.query(`CREATE INDEX "IDX_alerts_status" ON "sensor_alerts" ("status")`);

    // ══════════════════════════════════════════════════════════════
    // 4. HASI CAPTURES TABLE
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hasi_captures" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "svgDeviceId" UUID NOT NULL REFERENCES "devices"("id") ON DELETE CASCADE,
        "svgHardwareId" VARCHAR(50) NOT NULL,
        "vehicleId" VARCHAR(100),
        "hasiCaptureId" VARCHAR(50),
        "filename" VARCHAR(255),
        "fileSizeBytes" INTEGER,
        "fileHashSha256" VARCHAR(64),
        "captureFormat" VARCHAR(20) DEFAULT 'pcapng',
        "status" VARCHAR(15) DEFAULT 'analyzed',
        "totalPackets" INTEGER DEFAULT 0,
        "captureDurationSec" DECIMAL(10,3),
        "captureStartTime" TIMESTAMP,
        "captureEndTime" TIMESTAMP,
        "uniqueSources" INTEGER DEFAULT 0,
        "uniqueDestinations" INTEGER DEFAULT 0,
        "totalFlows" INTEGER DEFAULT 0,
        "threatCount" INTEGER DEFAULT 0,
        "protocolSummary" JSONB DEFAULT '{}',
        "protocolClassification" JSONB DEFAULT '{}',
        "totalBytesIn" BIGINT,
        "totalBytesOut" BIGINT,
        "topSources" JSONB DEFAULT '[]',
        "topDestinations" JSONB DEFAULT '[]',
        "topPorts" JSONB DEFAULT '[]',
        "aiAnalyzed" BOOLEAN DEFAULT false,
        "aiSummary" TEXT,
        "aiRecommendations" JSONB,
        "captureMode" VARCHAR(20) DEFAULT 'continuous',
        "captureScope" VARCHAR(20) DEFAULT 'all',
        "latitude" DECIMAL(9,6),
        "longitude" DECIMAL(9,6),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "analyzedAt" TIMESTAMP
      );
    `);
    await queryRunner.query(`CREATE INDEX "IDX_hcap_device_ts" ON "hasi_captures" ("svgDeviceId", "createdAt" DESC)`);
    await queryRunner.query(`CREATE INDEX "IDX_hcap_status" ON "hasi_captures" ("status")`);

    // ══════════════════════════════════════════════════════════════
    // 5. HASI THREATS TABLE
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hasi_threats" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "captureId" UUID NOT NULL REFERENCES "hasi_captures"("id") ON DELETE CASCADE,
        "svgDeviceId" UUID NOT NULL,
        "svgHardwareId" VARCHAR(50) NOT NULL,
        "hasiThreatId" UUID,
        "threatCategory" VARCHAR(30) NOT NULL DEFAULT 'custom',
        "severity" VARCHAR(10) NOT NULL DEFAULT 'medium',
        "status" VARCHAR(20) NOT NULL DEFAULT 'active',
        "confidenceScore" DECIMAL(5,2),
        "description" VARCHAR(500) NOT NULL,
        "detailedAnalysis" TEXT,
        "indicatorType" VARCHAR(100),
        "indicatorValue" VARCHAR(200),
        "sourceIp" VARCHAR(45),
        "sourcePort" INTEGER,
        "destinationIp" VARCHAR(45),
        "destinationPort" INTEGER,
        "protocol" VARCHAR(20),
        "packetCount" INTEGER,
        "byteCount" BIGINT,
        "sourceCountry" VARCHAR(100),
        "sourceAsn" VARCHAR(100),
        "sourceOrg" VARCHAR(200),
        "destCountry" VARCHAR(100),
        "destAsn" VARCHAR(100),
        "destOrg" VARCHAR(200),
        "networkZone" VARCHAR(20) DEFAULT 'vehicle_network',
        "latitude" DECIMAL(9,6),
        "longitude" DECIMAL(9,6),
        "recommendedActions" JSONB DEFAULT '[]',
        "autoMitigated" BOOLEAN DEFAULT false,
        "mitigationAction" TEXT,
        "mitigatedAt" TIMESTAMP,
        "mitigatedBy" VARCHAR(100),
        "resolutionNotes" VARCHAR(500),
        "mitreTacticId" VARCHAR(20),
        "mitreTacticName" VARCHAR(100),
        "mitreTechniqueId" VARCHAR(20),
        "mitreTechniqueName" VARCHAR(100),
        "detectedAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX "IDX_hthreat_device_ts" ON "hasi_threats" ("svgDeviceId", "detectedAt" DESC)`);
    await queryRunner.query(`CREATE INDEX "IDX_hthreat_capture" ON "hasi_threats" ("captureId")`);
    await queryRunner.query(`CREATE INDEX "IDX_hthreat_severity" ON "hasi_threats" ("severity")`);
    await queryRunner.query(`CREATE INDEX "IDX_hthreat_status" ON "hasi_threats" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_hthreat_category" ON "hasi_threats" ("threatCategory")`);

    // ══════════════════════════════════════════════════════════════
    // 6. HASI FIREWALL RULES TABLE
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hasi_firewall_rules" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "captureId" UUID,
        "threatId" UUID,
        "svgDeviceId" UUID,
        "action" VARCHAR(15) NOT NULL DEFAULT 'deny',
        "direction" VARCHAR(10) NOT NULL DEFAULT 'inbound',
        "protocol" VARCHAR(20),
        "sourceIp" VARCHAR(45),
        "sourceMask" VARCHAR(5),
        "sourcePort" VARCHAR(20),
        "destinationIp" VARCHAR(45),
        "destinationMask" VARCHAR(5),
        "destinationPort" VARCHAR(20),
        "description" VARCHAR(300) NOT NULL,
        "severity" VARCHAR(10) DEFAULT 'medium',
        "iptablesRule" TEXT,
        "ciscoAcl" TEXT,
        "paloAltoRule" TEXT,
        "fortinetRule" TEXT,
        "vendorNeutralRule" TEXT,
        "status" VARCHAR(15) DEFAULT 'proposed',
        "fleetWide" BOOLEAN DEFAULT false,
        "deployedToDevices" JSONB DEFAULT '[]',
        "deployedCount" INTEGER DEFAULT 0,
        "approvedBy" VARCHAR(100),
        "approvedAt" TIMESTAMP,
        "deployedAt" TIMESTAMP,
        "expiresAt" TIMESTAMP,
        "hitCount" INTEGER DEFAULT 0,
        "lastHitAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX "IDX_hfw_device" ON "hasi_firewall_rules" ("svgDeviceId")`);
    await queryRunner.query(`CREATE INDEX "IDX_hfw_status" ON "hasi_firewall_rules" ("status")`);

    // ── Add sensor count to devices table ──────────────────────
    await queryRunner.query(`ALTER TABLE "devices" ADD COLUMN IF NOT EXISTS "sensorCount" INTEGER DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "devices" ADD COLUMN IF NOT EXISTS "hasiEnabled" BOOLEAN DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "devices" ADD COLUMN IF NOT EXISTS "hasiLastCaptureAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "devices" ADD COLUMN IF NOT EXISTS "hasiRiskScore" INTEGER DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "hasi_firewall_rules" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "hasi_threats" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "hasi_captures" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sensor_alerts" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sensor_readings" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sensor_devices" CASCADE`);
  }
}
