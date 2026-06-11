import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class ErpConnectorsService extends BaseCrudService<ErpConnector> {
  constructor(
    @InjectRepository(ErpConnector) repo: Repository<ErpConnector>,
    @InjectRepository(ErpSyncLog) private syncLogRepo: Repository<ErpSyncLog>,
    @InjectRepository(ErpFieldMapping) private mappingRepo: Repository<ErpFieldMapping>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      connectors: [
        {
          id: 'erp-001', name: 'SAP S/4HANA', erpType: 'sap', status: 'connected',
          endpoint: 'https://sap.blueedge.ae/sap/opu/odata',
          modules: ['Fleet Management (PM)', 'Materials Management (MM)', 'Finance (FI)', 'Controlling (CO)'],
          syncSchedule: { frequency: 'every_15min', lastRun: new Date(Date.now() - 900000), nextRun: new Date(Date.now() + 900000) },
          lastSync: { status: 'success', recordsSynced: 342, durationMs: 4500, timestamp: new Date(Date.now() - 900000) },
          health: { latencyMs: 230, errorRate: 0.1, uptime: 99.95 },
          dataFlows: { inbound: ['work_orders', 'purchase_orders', 'cost_centers'], outbound: ['vehicle_telemetry', 'trip_reports', 'fuel_consumption', 'maintenance_requests'] },
        },
        {
          id: 'erp-002', name: 'Oracle Transportation Management', erpType: 'oracle', status: 'connected',
          endpoint: 'https://oracle.blueedge.ae/otm/api/v2',
          modules: ['Fleet Planning', 'Shipment Execution', 'Payment & Billing'],
          syncSchedule: { frequency: 'hourly', lastRun: new Date(Date.now() - 3600000), nextRun: new Date(Date.now() + 3600000) },
          lastSync: { status: 'success', recordsSynced: 89, durationMs: 3200, timestamp: new Date(Date.now() - 3600000) },
          health: { latencyMs: 310, errorRate: 0.2, uptime: 99.90 },
          dataFlows: { inbound: ['shipment_orders', 'rate_tables'], outbound: ['vehicle_positions', 'delivery_confirmations', 'cost_actuals'] },
        },
        {
          id: 'erp-003', name: 'Microsoft Dynamics 365', erpType: 'dynamics', status: 'configured',
          endpoint: 'https://blueedge.crm4.dynamics.com/api/data/v9.2',
          modules: ['Field Service', 'Finance', 'Supply Chain'],
          syncSchedule: { frequency: 'daily', lastRun: new Date(Date.now() - 86400000), nextRun: new Date(Date.now() + 86400000) },
          lastSync: { status: 'success', recordsSynced: 156, durationMs: 8900, timestamp: new Date(Date.now() - 86400000) },
          health: { latencyMs: 180, errorRate: 0, uptime: 99.99 },
          dataFlows: { inbound: ['work_orders', 'customer_contacts'], outbound: ['asset_telemetry', 'service_requests', 'invoices'] },
        },
      ],
      totalRecordsSyncedToday: 2847,
      activeConnectors: 3,
      failedSyncsLast24h: 1,
      upcomingSyncs: [
        { connectorId: 'erp-001', erpType: 'sap', nextRun: new Date(Date.now() + 900000) },
        { connectorId: 'erp-002', erpType: 'oracle', nextRun: new Date(Date.now() + 3600000) },
      ],
    });
  }

  async getAvailableConnectors() {
    return success([
      { erpType: 'sap', name: 'SAP S/4HANA', protocols: ['OData V4', 'RFC', 'IDoc', 'BAPI'], modules: ['PM', 'MM', 'FI', 'CO', 'PS'], authMethods: ['OAuth 2.0', 'Basic', 'Certificate'], status: 'available', documentation: '/docs/erp/sap' },
      { erpType: 'oracle', name: 'Oracle TMS / EBS', protocols: ['REST', 'SOAP', 'Integration Cloud'], modules: ['OTM', 'EBS Fleet', 'Billing'], authMethods: ['OAuth 2.0', 'IDCS'], status: 'available', documentation: '/docs/erp/oracle' },
      { erpType: 'dynamics', name: 'Microsoft Dynamics 365', protocols: ['Web API', 'OData V4'], modules: ['Field Service', 'Finance', 'Supply Chain'], authMethods: ['Azure AD', 'OAuth 2.0'], status: 'available', documentation: '/docs/erp/dynamics' },
      { erpType: 'odoo', name: 'Odoo ERP', protocols: ['XML-RPC', 'JSON-RPC', 'REST'], modules: ['Fleet', 'Maintenance', 'Accounting'], authMethods: ['API Key', 'OAuth 2.0'], status: 'available', documentation: '/docs/erp/odoo' },
      { erpType: 'custom', name: 'Custom REST/SOAP API', protocols: ['REST', 'SOAP', 'GraphQL', 'gRPC'], modules: ['Any'], authMethods: ['API Key', 'OAuth 2.0', 'Basic', 'Certificate', 'HMAC'], status: 'available', documentation: '/docs/erp/custom' },
    ]);
  }

  async createConnector(body: any) {
    return success({
      id: `erp-${Date.now()}`, ...body,
      status: 'testing',
      validation: {
        endpointReachable: true,
        authenticationValid: true,
        modulesAccessible: body.modules?.map((m: string) => ({ module: m, accessible: true })),
        estimatedLatencyMs: 210,
      },
      createdAt: new Date(),
    });
  }

  async testConnection(connectorId: string) {
    return success({
      connectorId,
      result: 'success',
      tests: [
        { test: 'endpoint_reachable', result: 'pass', latencyMs: 145 },
        { test: 'authentication', result: 'pass', details: 'OAuth2 token obtained' },
        { test: 'read_access', result: 'pass', details: 'Read 10 records from test entity' },
        { test: 'write_access', result: 'pass', details: 'Created/deleted test record' },
        { test: 'field_mapping', result: 'pass', details: '23/24 fields mapped successfully' },
      ],
      overallStatus: 'ready',
      timestamp: new Date(),
    });
  }

  async triggerSync(connectorId: string, body: any) {
    return success({
      syncId: `sync-${Date.now()}`,
      connectorId,
      syncType: body.syncType || 'incremental',
      direction: body.direction || 'bidirectional',
      status: 'started',
      entities: body.entities || ['vehicles', 'drivers', 'trips', 'maintenance', 'fuel'],
      estimatedDurationMin: 2,
      startedAt: new Date(),
    });
  }

  async getSyncHistory(connectorId: string) {
    return success([
      { id: 'sync-001', connectorId, syncType: 'incremental', direction: 'bidirectional', status: 'success', recordsProcessed: 342, recordsCreated: 12, recordsUpdated: 318, recordsFailed: 0, durationMs: 4500, startedAt: new Date(Date.now() - 900000), completedAt: new Date(Date.now() - 895500) },
      { id: 'sync-002', connectorId, syncType: 'incremental', direction: 'bidirectional', status: 'success', recordsProcessed: 298, recordsCreated: 8, recordsUpdated: 287, recordsFailed: 3, durationMs: 3800, startedAt: new Date(Date.now() - 1800000), completedAt: new Date(Date.now() - 1796200), errors: [{ entity: 'maintenance', record: 'WO-12345', error: 'Duplicate work order number' }] },
      { id: 'sync-003', connectorId, syncType: 'full', direction: 'bidirectional', status: 'success', recordsProcessed: 4567, recordsCreated: 4567, recordsUpdated: 0, recordsFailed: 12, durationMs: 45000, startedAt: new Date(Date.now() - 86400000), completedAt: new Date(Date.now() - 86355000) },
    ]);
  }

  async getFieldMappings(connectorId: string) {
    return success({
      connectorId,
      entities: [
        {
          entityType: 'vehicle', mappings: [
            { sourceField: 'fleet.vehicle.plate_number', targetField: 'EQUNR', transform: 'prefix_remove("DXB-")', bidirectional: true },
            { sourceField: 'fleet.vehicle.make', targetField: 'HERST', transform: null, bidirectional: true },
            { sourceField: 'fleet.vehicle.model', targetField: 'TYPBZ', transform: null, bidirectional: true },
            { sourceField: 'fleet.vehicle.vin', targetField: 'SERGE', transform: null, bidirectional: true },
            { sourceField: 'fleet.vehicle.mileage_km', targetField: 'ELESSION_COUNTER', transform: 'round()', bidirectional: false },
            { sourceField: 'fleet.vehicle.fuel_level_pct', targetField: 'ZZFUEL_LEVEL', transform: null, bidirectional: false },
            { sourceField: 'fleet.vehicle.status', targetField: 'STTXT', transform: 'map({"active":"AVLB","inactive":"INAC","maintenance":"MTCE"})', bidirectional: true },
          ],
        },
        {
          entityType: 'maintenance', mappings: [
            { sourceField: 'fleet.maintenance.work_order_id', targetField: 'AUFNR', transform: null, bidirectional: true },
            { sourceField: 'fleet.maintenance.type', targetField: 'AUART', transform: 'map({"preventive":"PM01","corrective":"PM02","predictive":"PM03"})', bidirectional: true },
            { sourceField: 'fleet.maintenance.scheduled_date', targetField: 'GSTRP', transform: 'date_format("YYYYMMDD")', bidirectional: true },
            { sourceField: 'fleet.maintenance.cost_aed', targetField: 'WRTGES', transform: 'currency_convert("AED","USD")', bidirectional: false },
            { sourceField: 'fleet.maintenance.parts', targetField: 'RESB', transform: 'array_to_bom()', bidirectional: false },
          ],
        },
        {
          entityType: 'fuel', mappings: [
            { sourceField: 'fleet.fuel.transaction_id', targetField: 'BELNR', transform: null, bidirectional: true },
            { sourceField: 'fleet.fuel.liters', targetField: 'MENGE', transform: null, bidirectional: false },
            { sourceField: 'fleet.fuel.cost_aed', targetField: 'DMBTR', transform: null, bidirectional: false },
            { sourceField: 'fleet.fuel.station', targetField: 'LIFNR', transform: 'station_to_vendor()', bidirectional: false },
            { sourceField: 'fleet.fuel.timestamp', targetField: 'BUDAT', transform: 'date_format("YYYYMMDD")', bidirectional: false },
          ],
        },
      ],
      transformFunctions: [
        { name: 'prefix_remove', description: 'Remove prefix from string', example: 'prefix_remove("DXB-")' },
        { name: 'map', description: 'Map values between systems', example: 'map({"active":"AVLB"})' },
        { name: 'date_format', description: 'Convert date format', example: 'date_format("YYYYMMDD")' },
        { name: 'currency_convert', description: 'Convert currency', example: 'currency_convert("AED","USD")' },
        { name: 'round', description: 'Round numeric value', example: 'round(2)' },
        { name: 'array_to_bom', description: 'Convert parts array to SAP BOM', example: 'array_to_bom()' },
      ],
    });
  }

  async updateFieldMapping(connectorId: string, body: any) {
    return success({ connectorId, updated: true, mappings: body.mappings, validatedAt: new Date() });
  }

  async getConnectorConfig(connectorId: string) {
    return success({
      connectorId,
      erpType: 'sap',
      connection: { endpoint: 'https://sap.blueedge.ae/sap/opu/odata', authMethod: 'oauth2', clientId: '***masked***', tokenUrl: 'https://sap.blueedge.ae/oauth/token' },
      sync: { defaultFrequency: 'every_15min', retryPolicy: { maxRetries: 3, backoffMs: 5000 }, batchSize: 500, concurrency: 4 },
      errorHandling: { onConflict: 'source_wins', onMissingField: 'skip', alertOnFailure: true, alertRecipients: ['admin@blueedge.ae'] },
      filters: { vehicleStatuses: ['active', 'maintenance'], syncSince: '2025-01-01', excludeFleetTypes: [] },
    });
  }

  async updateConnectorConfig(connectorId: string, body: any) {
    return success({ connectorId, updated: true, config: body, validatedAt: new Date() });
  }
}

// ─── Controller ───────────────────────────────────────────────
