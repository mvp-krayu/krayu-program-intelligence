import { MigrationInterface, QueryRunner } from 'typeorm';

export class SVGDeviceProvisioningExpansion1709000000000 implements MigrationInterface {
  name = 'SVGDeviceProvisioningExpansion1709000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ══════════════════════════════════════════════════════════════
    // 1. EXPAND devices TABLE (add missing columns)
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE "devices"
        ADD COLUMN IF NOT EXISTS "hardwareId" VARCHAR(50) UNIQUE,
        ADD COLUMN IF NOT EXISTS "partNumber" VARCHAR(50),
        ADD COLUMN IF NOT EXISTS "macAddress" VARCHAR(20),
        ADD COLUMN IF NOT EXISTS "lifecycle" VARCHAR(20) DEFAULT 'manufactured',
        ADD COLUMN IF NOT EXISTS "fleetType" VARCHAR(15) DEFAULT 'tanker',
        ADD COLUMN IF NOT EXISTS "ownerId" UUID,
        ADD COLUMN IF NOT EXISTS "ownerName" VARCHAR(150),
        ADD COLUMN IF NOT EXISTS "location" VARCHAR(100),
        ADD COLUMN IF NOT EXISTS "softwareVersion" VARCHAR(30),
        ADD COLUMN IF NOT EXISTS "configVersion" VARCHAR(30),
        ADD COLUMN IF NOT EXISTS "manufacturingDate" DATE,
        ADD COLUMN IF NOT EXISTS "factoryLocation" VARCHAR(100),
        ADD COLUMN IF NOT EXISTS "batchNumber" VARCHAR(50),
        ADD COLUMN IF NOT EXISTS "tpmAttested" BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS "tpmEndorsementKey" TEXT,
        ADD COLUMN IF NOT EXISTS "qcPassed" BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS "blockchainAddress" VARCHAR(66),
        ADD COLUMN IF NOT EXISTS "blockchainNftTokenId" VARCHAR(66),
        ADD COLUMN IF NOT EXISTS "networkType" VARCHAR(20) DEFAULT '4G LTE',
        ADD COLUMN IF NOT EXISTS "gpsAccuracy" DECIMAL(4,1),
        ADD COLUMN IF NOT EXISTS "uptimeHours" INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "cpuUsage" DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS "memoryUsage" DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS "temperature" DECIMAL(5,2),
        ADD COLUMN IF NOT EXISTS "lastTelemetryAt" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "protocolConfig" JSONB DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS "provisionedAt" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "deployedAt" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "decommissionedAt" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "provisionedBy" VARCHAR(100),
        ADD COLUMN IF NOT EXISTS "notes" VARCHAR(500);
    `);

    // Add new indexes
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_devices_hardwareId" ON "devices" ("hardwareId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_devices_lifecycle" ON "devices" ("lifecycle")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_devices_fleetType" ON "devices" ("fleetType")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_devices_ownerId" ON "devices" ("ownerId")`);

    // ══════════════════════════════════════════════════════════════
    // 2. CREATE device_certificates TABLE
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "device_certificates" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "deviceId" UUID NOT NULL REFERENCES "devices"("id") ON DELETE CASCADE,
        "purpose" VARCHAR(25) NOT NULL DEFAULT 'device_auth',
        "commonName" VARCHAR(200) NOT NULL,
        "issuer" VARCHAR(200) NOT NULL,
        "fingerprint" VARCHAR(64) NOT NULL UNIQUE,
        "issuedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "validUntil" TIMESTAMP NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'active',
        "keyAlgorithm" VARCHAR(20) NOT NULL DEFAULT 'ECDSA-P256',
        "publicKey" TEXT,
        "certificatePem" TEXT,
        "parentCertId" UUID,
        "chainLevel" VARCHAR(15) DEFAULT 'leaf',
        "revokedAt" TIMESTAMP,
        "revocationReason" VARCHAR(200),
        "revokedBy" VARCHAR(100),
        "renewedFromId" UUID,
        "renewalCount" INTEGER DEFAULT 0,
        "autoRenew" BOOLEAN DEFAULT true,
        "renewalWarningDays" INTEGER DEFAULT 30,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "createdBy" VARCHAR(100),
        "auditLog" JSONB DEFAULT '[]'
      );
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_certs_deviceId" ON "device_certificates" ("deviceId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_certs_status" ON "device_certificates" ("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_certs_validUntil" ON "device_certificates" ("validUntil")`);

    // ══════════════════════════════════════════════════════════════
    // 3. CREATE device_transfers TABLE
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "device_transfers" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "deviceId" UUID NOT NULL REFERENCES "devices"("id") ON DELETE CASCADE,
        "fromOwnerId" VARCHAR(150) NOT NULL,
        "fromOwnerName" VARCHAR(150) NOT NULL,
        "toOwnerId" VARCHAR(150) NOT NULL,
        "toOwnerName" VARCHAR(150) NOT NULL,
        "toOwnerEmail" VARCHAR(200),
        "toOwnerBlockchainAddress" VARCHAR(66),
        "transferType" VARCHAR(25) NOT NULL DEFAULT 'sale',
        "status" VARCHAR(25) NOT NULL DEFAULT 'pending_approval',
        "priceAmount" DECIMAL(12,2),
        "priceCurrency" VARCHAR(3) DEFAULT 'USD',
        "useEscrow" BOOLEAN DEFAULT false,
        "escrowContractAddress" VARCHAR(66),
        "escrowStatus" VARCHAR(15) DEFAULT 'not_required',
        "recordOnBlockchain" BOOLEAN DEFAULT true,
        "blockchainTxHash" VARCHAR(66),
        "blockNumber" INTEGER,
        "blockchainConfirmedAt" TIMESTAMP,
        "nftTransferTxHash" VARCHAR(66),
        "requiresApproval" BOOLEAN DEFAULT true,
        "approvedBy" VARCHAR(100),
        "approvedAt" TIMESTAMP,
        "approvalNotes" VARCHAR(500),
        "conditions" JSONB DEFAULT '[]',
        "warrantyTransferred" BOOLEAN DEFAULT false,
        "configResetRequired" BOOLEAN DEFAULT false,
        "configResetCompleted" BOOLEAN DEFAULT false,
        "certificatesReissued" BOOLEAN DEFAULT false,
        "initiatedAt" TIMESTAMP,
        "completedAt" TIMESTAMP,
        "initiatedBy" VARCHAR(100),
        "notes" VARCHAR(500),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_transfers_deviceId" ON "device_transfers" ("deviceId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_transfers_status" ON "device_transfers" ("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_transfers_txHash" ON "device_transfers" ("blockchainTxHash")`);

    // ══════════════════════════════════════════════════════════════
    // 4. CREATE provisioning_workflows TABLE
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "provisioning_workflows" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "deviceId" UUID NOT NULL REFERENCES "devices"("id") ON DELETE CASCADE,
        "batchId" VARCHAR(100),
        "status" VARCHAR(20) NOT NULL DEFAULT 'queued',
        "currentStep" INTEGER DEFAULT 0,
        "totalSteps" INTEGER DEFAULT 8,
        "progressPercent" DECIMAL(5,2) DEFAULT 0,
        "steps" JSONB NOT NULL DEFAULT '[]',
        "triggerType" VARCHAR(20) DEFAULT 'manual',
        "initiatedBy" VARCHAR(100),
        "startedAt" TIMESTAMP,
        "completedAt" TIMESTAMP,
        "totalDurationMs" INTEGER,
        "retryCount" INTEGER DEFAULT 0,
        "maxRetries" INTEGER DEFAULT 3,
        "autoRetryOnFailure" BOOLEAN DEFAULT true,
        "rollbackOnCriticalFailure" BOOLEAN DEFAULT true,
        "rollbackLog" JSONB DEFAULT '[]',
        "deviceConfigSnapshot" JSONB,
        "networkConfigSnapshot" JSONB,
        "protocolConfigSnapshot" JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "notes" VARCHAR(500)
      );
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_workflows_deviceId" ON "provisioning_workflows" ("deviceId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_workflows_status" ON "provisioning_workflows" ("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_workflows_batchId" ON "provisioning_workflows" ("batchId")`);

    // ══════════════════════════════════════════════════════════════
    // 5. CREATE config_deployments TABLE
    // ══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "config_deployments" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "deviceId" UUID NOT NULL REFERENCES "devices"("id") ON DELETE CASCADE,
        "campaignId" UUID,
        "configType" VARCHAR(25) NOT NULL DEFAULT 'device_config',
        "fromVersion" VARCHAR(30),
        "toVersion" VARCHAR(30) NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'pending_approval',
        "configPayload" JSONB,
        "configDiff" JSONB,
        "payloadSizeBytes" INTEGER,
        "requiresApproval" BOOLEAN DEFAULT true,
        "requestedBy" VARCHAR(100),
        "approvedBy" VARCHAR(100),
        "approvedAt" TIMESTAMP,
        "approvalNotes" VARCHAR(500),
        "rejectedBy" VARCHAR(100),
        "rejectionReason" VARCHAR(500),
        "scheduledAt" TIMESTAMP,
        "deploymentWindow" VARCHAR(25) DEFAULT 'immediate',
        "rolloutStrategy" VARCHAR(15) DEFAULT 'single',
        "rolloutPercentage" INTEGER,
        "batchSize" INTEGER,
        "deployedAt" TIMESTAMP,
        "verifiedAt" TIMESTAMP,
        "deployDurationMs" INTEGER,
        "deviceAcknowledged" BOOLEAN DEFAULT false,
        "deviceAckedAt" TIMESTAMP,
        "autoRollbackOnFailure" BOOLEAN DEFAULT true,
        "rolledBackAt" TIMESTAMP,
        "rollbackReason" VARCHAR(500),
        "previousConfig" JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "auditLog" JSONB DEFAULT '[]'
      );
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_configs_deviceId" ON "config_deployments" ("deviceId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_configs_status" ON "config_deployments" ("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_configs_campaignId" ON "config_deployments" ("campaignId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "config_deployments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "provisioning_workflows" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "device_transfers" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "device_certificates" CASCADE`);
    // Don't drop expanded device columns — too destructive for rollback
  }
}
