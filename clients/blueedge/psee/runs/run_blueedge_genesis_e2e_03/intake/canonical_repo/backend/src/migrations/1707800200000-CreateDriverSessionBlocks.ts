import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: CreateDriverSessionBlocks
 *
 * Creates the driver_session_blocks table — the core of the patent-pending
 * Session-Block Architecture and DIAM (Driver Impact Attribution Model).
 *
 * Each row = one immutable, TPM 2.0 signed session block.
 * Variance columns computed via Welford's online algorithm on SVG 2.0 edge device.
 *
 * TimescaleDB hypertable on startTime for efficient time-range queries.
 */
export class CreateDriverSessionBlocks1707800200000 implements MigrationInterface {
  name = 'CreateDriverSessionBlocks1707800200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ──────── ENUM TYPES ────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "session_auth_method_enum" AS ENUM (
        'faceid_nfc', 'pin_rfid', 'biometric', 'manual'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "session_status_enum" AS ENUM (
        'active', 'closed', 'interrupted', 'invalid'
      )
    `);

    // ──────── MAIN TABLE ────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "driver_session_blocks" (
        -- Primary Key
        "id"                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "blockNumber"           BIGINT NOT NULL UNIQUE,

        -- Session Identity
        "vehicleId"             UUID NOT NULL,
        "driverId"              UUID NOT NULL,
        "driverName"            VARCHAR(100) NOT NULL,
        "authMethod"            session_auth_method_enum DEFAULT 'faceid_nfc',
        "svgDeviceId"           VARCHAR(50),

        -- Temporal Bounds
        "startTime"             TIMESTAMPTZ NOT NULL,
        "endTime"               TIMESTAMPTZ,
        "durationMinutes"       FLOAT DEFAULT 0,
        "status"                session_status_enum DEFAULT 'active',

        -- Odometer & Distance
        "odometerStart"         FLOAT NOT NULL,
        "odometerEnd"           FLOAT,
        "distanceKm"            FLOAT DEFAULT 0,

        -- Fuel
        "fuelLevelStart"        FLOAT NOT NULL,
        "fuelLevelEnd"          FLOAT,
        "fuelConsumedL"         FLOAT DEFAULT 0,
        "fuelCostAED"           FLOAT DEFAULT 0,
        "lPer100km"             FLOAT DEFAULT 0,
        "fuelEvents"            JSONB DEFAULT '[]',

        -- Driving Behavior
        "harshBrakes"           INTEGER DEFAULT 0,
        "harshAccelerations"    INTEGER DEFAULT 0,
        "harshCorners"          INTEGER DEFAULT 0,
        "maxSpeedKmh"           FLOAT DEFAULT 0,
        "avgSpeedKmh"           FLOAT DEFAULT 0,
        "idleMinutes"           FLOAT DEFAULT 0,
        "idlePct"               FLOAT DEFAULT 0,

        -- Route Context
        "routeHighwayPct"       FLOAT DEFAULT 0,
        "routeUrbanPct"         FLOAT DEFAULT 0,
        "elevationGainM"        FLOAT DEFAULT 0,
        "loadWeightKg"          FLOAT DEFAULT 0,
        "ambientTempC"          FLOAT DEFAULT 0,

        -- DTCs Generated
        "dtcsGenerated"         JSONB DEFAULT '[]',

        -- Welford Variance Columns (Patent-Pending Innovation)
        "rpmMean"               FLOAT DEFAULT 0,
        "rpmVariance"           FLOAT DEFAULT 0,
        "speedVariance"         FLOAT DEFAULT 0,
        "fuelRateVariance"      FLOAT DEFAULT 0,
        "accelVariance"         FLOAT DEFAULT 0,

        -- Computed Scores
        "wearIndex"             FLOAT DEFAULT 0,
        "healthDelta"           FLOAT DEFAULT 0,

        -- Cryptographic Integrity (TPM 2.0)
        "tpmSigned"             BOOLEAN DEFAULT FALSE,
        "blockHash"             VARCHAR(130),
        "tpmSignature"          VARCHAR(260),

        -- GPS Trace
        "gpsPolyline"           TEXT,

        -- Timestamps
        "createdAt"             TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt"             TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ──────── INDEXES ───────────────────────────────────────
    // Composite indexes for primary query patterns
    await queryRunner.query(`
      CREATE INDEX "IDX_session_vehicle_start"
        ON "driver_session_blocks" ("vehicleId", "startTime" DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_session_driver_start"
        ON "driver_session_blocks" ("driverId", "startTime" DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_session_vehicle_driver"
        ON "driver_session_blocks" ("vehicleId", "driverId")
    `);

    // Status index for finding active sessions
    await queryRunner.query(`
      CREATE INDEX "IDX_session_status"
        ON "driver_session_blocks" ("status")
        WHERE "status" = 'active'
    `);

    // SVG device lookup
    await queryRunner.query(`
      CREATE INDEX "IDX_session_svg_device"
        ON "driver_session_blocks" ("svgDeviceId")
        WHERE "svgDeviceId" IS NOT NULL
    `);

    // Time range queries (BRIN for large time-series data)
    await queryRunner.query(`
      CREATE INDEX "IDX_session_start_time_brin"
        ON "driver_session_blocks"
        USING BRIN ("startTime")
    `);

    // Variance-based queries (DWVS computation)
    await queryRunner.query(`
      CREATE INDEX "IDX_session_wear_index"
        ON "driver_session_blocks" ("wearIndex" DESC)
        WHERE "status" = 'closed'
    `);

    // Block hash verification index
    await queryRunner.query(`
      CREATE INDEX "IDX_session_block_hash"
        ON "driver_session_blocks" ("blockHash")
        WHERE "blockHash" IS NOT NULL
    `);

    // ──────── TIMESCALEDB HYPERTABLE ────────────────────────
    // Convert to hypertable for efficient time-series queries
    // Chunk interval: 7 days (optimal for fleet session data)
    await queryRunner.query(`
      SELECT create_hypertable(
        'driver_session_blocks',
        'startTime',
        chunk_time_interval => INTERVAL '7 days',
        if_not_exists => TRUE,
        migrate_data => TRUE
      )
    `);

    // ──────── COMPRESSION POLICY ────────────────────────────
    // Compress data older than 30 days (immutable after close)
    await queryRunner.query(`
      ALTER TABLE "driver_session_blocks"
        SET (timescaledb.compress,
             timescaledb.compress_segmentby = 'vehicleId,driverId',
             timescaledb.compress_orderby = 'startTime DESC')
    `);

    await queryRunner.query(`
      SELECT add_compression_policy(
        'driver_session_blocks',
        INTERVAL '30 days',
        if_not_exists => TRUE
      )
    `);

    // ──────── RETENTION POLICY ──────────────────────────────
    // Keep detailed session data for 3 years
    await queryRunner.query(`
      SELECT add_retention_policy(
        'driver_session_blocks',
        INTERVAL '3 years',
        if_not_exists => TRUE
      )
    `);

    // ──────── CONTINUOUS AGGREGATES ─────────────────────────
    // Daily vehicle session summary (materialized view)
    await queryRunner.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS "session_daily_vehicle_summary"
      WITH (timescaledb.continuous) AS
      SELECT
        time_bucket('1 day', "startTime") AS day,
        "vehicleId",
        COUNT(*) AS session_count,
        COUNT(DISTINCT "driverId") AS unique_drivers,
        SUM("distanceKm") AS total_distance_km,
        SUM("fuelConsumedL") AS total_fuel_l,
        SUM("fuelCostAED") AS total_fuel_cost_aed,
        AVG("lPer100km") AS avg_l_per_100km,
        SUM("harshBrakes") AS total_harsh_brakes,
        SUM("harshAccelerations") AS total_harsh_accels,
        SUM("harshCorners") AS total_harsh_corners,
        AVG("wearIndex") AS avg_wear_index,
        SUM("durationMinutes") AS total_minutes,
        AVG("rpmVariance") AS avg_rpm_variance,
        AVG("speedVariance") AS avg_speed_variance,
        AVG("fuelRateVariance") AS avg_fuel_rate_variance
      FROM "driver_session_blocks"
      WHERE "status" = 'closed'
      GROUP BY day, "vehicleId"
      WITH NO DATA
    `);

    // Refresh policy: every hour, lag 1 hour
    await queryRunner.query(`
      SELECT add_continuous_aggregate_policy(
        'session_daily_vehicle_summary',
        start_offset => INTERVAL '3 days',
        end_offset   => INTERVAL '1 hour',
        schedule_interval => INTERVAL '1 hour',
        if_not_exists => TRUE
      )
    `);

    // Daily driver session summary
    await queryRunner.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS "session_daily_driver_summary"
      WITH (timescaledb.continuous) AS
      SELECT
        time_bucket('1 day', "startTime") AS day,
        "driverId",
        "driverName",
        COUNT(*) AS session_count,
        COUNT(DISTINCT "vehicleId") AS vehicles_driven,
        SUM("distanceKm") AS total_distance_km,
        SUM("fuelConsumedL") AS total_fuel_l,
        AVG("lPer100km") AS avg_l_per_100km,
        SUM("harshBrakes" + "harshAccelerations" + "harshCorners") AS total_harsh_events,
        AVG("wearIndex") AS avg_wear_index,
        SUM("durationMinutes") AS total_minutes,
        AVG("rpmVariance") AS avg_rpm_variance,
        AVG("speedVariance") AS avg_speed_variance
      FROM "driver_session_blocks"
      WHERE "status" = 'closed'
      GROUP BY day, "driverId", "driverName"
      WITH NO DATA
    `);

    await queryRunner.query(`
      SELECT add_continuous_aggregate_policy(
        'session_daily_driver_summary',
        start_offset => INTERVAL '3 days',
        end_offset   => INTERVAL '1 hour',
        schedule_interval => INTERVAL '1 hour',
        if_not_exists => TRUE
      )
    `);

    // ──────── TRIGGER: auto-update updatedAt ────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_session_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      CREATE TRIGGER "trg_session_updated_at"
        BEFORE UPDATE ON "driver_session_blocks"
        FOR EACH ROW
        EXECUTE FUNCTION update_session_timestamp()
    `);

    // ──────── COMMENTS ──────────────────────────────────────
    await queryRunner.query(`COMMENT ON TABLE "driver_session_blocks" IS 'Patent-pending session-block architecture. Each row = one immutable driver session with Welford variance metrics computed on SVG 2.0 edge device.'`);
    await queryRunner.query(`COMMENT ON COLUMN "driver_session_blocks"."rpmVariance" IS 'RPM variance (σ²) computed via Welford online algorithm on SVG 2.0. DIAM weight: 25%'`);
    await queryRunner.query(`COMMENT ON COLUMN "driver_session_blocks"."speedVariance" IS 'Speed variance (σ²) via Welford. DIAM weight: 15%'`);
    await queryRunner.query(`COMMENT ON COLUMN "driver_session_blocks"."fuelRateVariance" IS 'Fuel rate variance (σ²) via Welford. DIAM weight: 15%'`);
    await queryRunner.query(`COMMENT ON COLUMN "driver_session_blocks"."wearIndex" IS 'Composite wear index 0-1 computed from DWVS formula'`);
    await queryRunner.query(`COMMENT ON COLUMN "driver_session_blocks"."blockHash" IS 'SHA-256 hash of block data, signed by TPM 2.0 on SVG device'`);
    await queryRunner.query(`COMMENT ON COLUMN "driver_session_blocks"."tpmSignature" IS 'TPM 2.0 ECDSA signature of blockHash — cryptographic proof of immutability'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop continuous aggregates first
    await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS "session_daily_driver_summary" CASCADE`);
    await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS "session_daily_vehicle_summary" CASCADE`);

    // Drop trigger
    await queryRunner.query(`DROP TRIGGER IF EXISTS "trg_session_updated_at" ON "driver_session_blocks"`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_session_timestamp()`);

    // Drop table (cascades hypertable)
    await queryRunner.query(`DROP TABLE IF EXISTS "driver_session_blocks" CASCADE`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS "session_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "session_auth_method_enum"`);
  }
}
