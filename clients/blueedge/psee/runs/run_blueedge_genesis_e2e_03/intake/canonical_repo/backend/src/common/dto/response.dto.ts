/**
 * Blue Edge Fleet Management — Response DTOs
 * OpenAPI response schemas for all 25 modules
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ── Generic Wrappers ──────────────────────────────────────────

export class PaginatedResponseDto<T = any> {
  @ApiProperty({ example: 42 }) total: number;
  @ApiProperty({ example: 1 })  page: number;
  @ApiProperty({ example: 25 }) limit: number;
  @ApiProperty({ isArray: true }) data: T[];
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' }) message: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 401 }) statusCode: number;
  @ApiProperty({ example: 'Unauthorized' }) message: string;
  @ApiPropertyOptional({ example: 'Unauthorized' }) error?: string;
}

// ── Auth ──────────────────────────────────────────────────────

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }) accessToken: string;
  @ApiProperty({ example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...' }) refreshToken: string;
  @ApiProperty({ example: 'admin' }) role: string;
  @ApiProperty({ example: 'Ahmed Al-Rashid' }) name: string;
}

export class ProfileResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }) id: string;
  @ApiProperty({ example: 'admin@blueedge.ae' }) email: string;
  @ApiProperty({ example: 'Ahmed Al-Rashid' }) name: string;
  @ApiProperty({ example: 'admin' }) role: string;
  @ApiProperty({ example: ['fleet:read', 'fleet:write', 'admin:all'], isArray: true }) permissions: string[];
}

// ── Vehicles ──────────────────────────────────────────────────

export class VehicleResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }) id: string;
  @ApiProperty({ example: 'دبي A 12345' }) plateNumber: string;
  @ApiProperty({ example: '1HGCM82633A004352' }) vin: string;
  @ApiProperty({ example: 'tanker' }) type: string;
  @ApiProperty({ example: 'active' }) status: string;
  @ApiProperty({ example: 'Toyota' }) make: string;
  @ApiProperty({ example: 'Land Cruiser' }) model: string;
  @ApiProperty({ example: 2024 }) year: number;
  @ApiPropertyOptional() fleetId?: string;
}

export class VehiclePositionDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }) vehicleId: string;
  @ApiProperty({ example: 25.2048 }) latitude: number;
  @ApiProperty({ example: 55.2708 }) longitude: number;
  @ApiProperty({ example: 85 }) speed: number;
  @ApiProperty({ example: 270 }) heading: number;
  @ApiProperty({ example: '2026-02-12T10:30:00Z' }) timestamp: string;
}

export class VehicleTelemetryDto {
  @ApiProperty({ example: 1250 }) rpm: number;
  @ApiProperty({ example: 92 }) coolantTemp: number;
  @ApiProperty({ example: 75 }) fuelLevel: number;
  @ApiProperty({ example: 45231 }) odometer: number;
  @ApiProperty({ example: 13.8 }) batteryVoltage: number;
}

export class VehicleStatsDto {
  @ApiProperty({ example: 342 }) totalVehicles: number;
  @ApiProperty({ example: 298 }) active: number;
  @ApiProperty({ example: 32 }) inMaintenance: number;
  @ApiProperty({ example: 12 }) inactive: number;
  @ApiProperty({ example: { tanker: 145, bus: 112, taxi: 85 } }) byType: Record<string, number>;
}

// ── Drivers ───────────────────────────────────────────────────

export class DriverResponseDto {
  @ApiProperty({ example: 'drv-001' }) id: string;
  @ApiProperty({ example: 'Khalid Al-Mazrouei' }) nameEn: string;
  @ApiProperty({ example: 'خالد المزروعي' }) nameAr: string;
  @ApiProperty({ example: 'DL-2024-AUH-00123' }) licenseNumber: string;
  @ApiProperty({ example: 'active' }) status: string;
  @ApiProperty({ example: 92 }) safetyScore: number;
}

// ── Fleets ────────────────────────────────────────────────────

export class FleetResponseDto {
  @ApiProperty({ example: 'fleet-001' }) id: string;
  @ApiProperty({ example: 'ADNOC Tanker Fleet - Dubai' }) name: string;
  @ApiProperty({ example: 'tanker' }) type: string;
  @ApiProperty({ example: 145 }) vehicleCount: number;
  @ApiProperty({ example: 'active' }) status: string;
}

// ── Trips ─────────────────────────────────────────────────────

export class TripResponseDto {
  @ApiProperty({ example: 'trip-001' }) id: string;
  @ApiProperty() vehicleId: string;
  @ApiProperty() driverId: string;
  @ApiProperty({ example: 'in_progress' }) status: string;
  @ApiProperty({ example: 'Jebel Ali Port' }) origin: string;
  @ApiProperty({ example: 'ADNOC Ruwais' }) destination: string;
  @ApiProperty({ example: 245.8 }) distanceKm: number;
}

export class TripStatsDto {
  @ApiProperty({ example: 1287 }) totalTrips: number;
  @ApiProperty({ example: 42 }) activeTrips: number;
  @ApiProperty({ example: 98.7 }) onTimePercentage: number;
  @ApiProperty({ example: 35420 }) totalDistanceKm: number;
}

// ── Alerts ────────────────────────────────────────────────────

export class AlertResponseDto {
  @ApiProperty({ example: 'alert-001' }) id: string;
  @ApiProperty({ example: 'overspeed' }) type: string;
  @ApiProperty({ example: 'high' }) severity: string;
  @ApiProperty({ example: 'active' }) status: string;
  @ApiProperty({ example: 'Vehicle exceeded 120 km/h on Sheikh Zayed Road' }) message: string;
  @ApiPropertyOptional() vehicleId?: string;
}

export class AlertStatsDto {
  @ApiProperty({ example: 156 }) total: number;
  @ApiProperty({ example: 23 }) active: number;
  @ApiProperty({ example: 12 }) critical: number;
  @ApiProperty({ example: { overspeed: 45, geofence: 32, maintenance: 28 } }) byType: Record<string, number>;
}

// ── Tanker ────────────────────────────────────────────────────

export class TankStatusDto {
  @ApiProperty({ example: 4 }) compartmentCount: number;
  @ApiProperty({ isArray: true, example: [
    { id: 1, product: 'Diesel', capacity: 12000, currentLevel: 10500, temperature: 38.2, pressure: 2.1, gasDetection: false },
  ] }) compartments: any[];
}

export class HazmatResponseDto {
  @ApiProperty({ example: 'Class 3 — Flammable Liquids' }) classification: string;
  @ApiProperty({ example: 'ADNOC HAZMAT Permit #2024-0897' }) permitNumber: string;
  @ApiProperty({ example: 'compliant' }) complianceStatus: string;
  @ApiProperty({ example: '2026-06-30' }) permitExpiry: string;
}

export class CargoManifestResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() vehicleId: string;
  @ApiProperty({ example: 'Diesel EN 590' }) product: string;
  @ApiProperty({ example: 35000 }) volumeLiters: number;
  @ApiProperty({ example: 'in_transit' }) status: string;
}

export class CustodyTransferResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'ADNOC Ruwais Terminal' }) fromEntity: string;
  @ApiProperty({ example: 'Blue Edge Transport' }) toEntity: string;
  @ApiProperty({ example: 35000 }) volumeLiters: number;
  @ApiProperty({ example: 'completed' }) status: string;
}

// ── Bus ───────────────────────────────────────────────────────

export class BusRouteResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'Route F55A — Dubai Marina Loop' }) name: string;
  @ApiProperty({ example: 'F55A' }) routeNumber: string;
  @ApiProperty({ example: 18 }) stopCount: number;
  @ApiProperty({ example: 'active' }) status: string;
}

// ── Taxi ──────────────────────────────────────────────────────

export class TaxiTripResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'Dubai Mall' }) pickupLocation: string;
  @ApiProperty({ example: 'Dubai International Airport T3' }) dropoffLocation: string;
  @ApiProperty({ example: 45.50 }) fareAed: number;
  @ApiProperty({ example: 4.8 }) rating: number;
  @ApiProperty({ example: 'completed' }) status: string;
}

// ── Maintenance ───────────────────────────────────────────────

export class WorkOrderResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'WO-2026-001234' }) workOrderNumber: string;
  @ApiProperty({ example: 'scheduled' }) type: string;
  @ApiProperty({ example: 'Oil change and filter replacement' }) description: string;
  @ApiProperty({ example: 'open' }) status: string;
  @ApiProperty({ example: 'high' }) priority: string;
  @ApiPropertyOptional() vehicleId?: string;
}

// ── Fuel ──────────────────────────────────────────────────────

export class FuelTransactionResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() vehicleId: string;
  @ApiProperty({ example: 120.5 }) liters: number;
  @ApiProperty({ example: 350.25 }) costAed: number;
  @ApiProperty({ example: 'ADNOC Jebel Ali Station' }) station: string;
  @ApiProperty({ example: 75 }) odometerKm: number;
}

// ── Finance ───────────────────────────────────────────────────

export class CostSummaryDto {
  @ApiProperty({ example: 2450000 }) totalCostAed: number;
  @ApiProperty({ example: { fuel: 980000, maintenance: 520000, insurance: 340000, labor: 610000 } }) byCategory: Record<string, number>;
  @ApiProperty({ example: -3.2 }) monthOverMonthChange: number;
}

export class TcoResponseDto {
  @ApiProperty({ example: 'a1b2c3d4' }) vehicleId: string;
  @ApiProperty({ example: 285000 }) totalCostAed: number;
  @ApiProperty({ example: 7125 }) costPerMonthAed: number;
  @ApiProperty({ example: 0.42 }) costPerKmAed: number;
}

// ── Safety ────────────────────────────────────────────────────

export class SafetyDashboardDto {
  @ApiProperty({ example: 87.5 }) overallScore: number;
  @ApiProperty({ example: 156 }) totalIncidents: number;
  @ApiProperty({ example: 3 }) criticalOpen: number;
  @ApiProperty({ example: -12 }) incidentTrendPercent: number;
}

export class SafetyIncidentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'harsh_braking' }) type: string;
  @ApiProperty({ example: 'medium' }) severity: string;
  @ApiProperty() vehicleId: string;
  @ApiPropertyOptional() driverId?: string;
  @ApiProperty({ example: '2026-02-12T10:30:00Z' }) timestamp: string;
}

// ── Compliance ────────────────────────────────────────────────

export class HosSummaryDto {
  @ApiProperty({ example: 342 }) totalDrivers: number;
  @ApiProperty({ example: 98.2 }) complianceRate: number;
  @ApiProperty({ example: 6 }) violations: number;
  @ApiProperty({ example: 3 }) warnings: number;
}

export class CrossBorderStatusDto {
  @ApiProperty({ example: { UAE: 'compliant', Oman: 'compliant', 'Saudi Arabia': 'pending_renewal' } }) status: Record<string, string>;
}

// ── Diagnostics ───────────────────────────────────────────────

export class VehicleHealthDto {
  @ApiProperty({ example: 'a1b2c3d4' }) vehicleId: string;
  @ApiProperty({ example: 92 }) overallHealthScore: number;
  @ApiProperty({ example: { engine: 95, transmission: 88, brakes: 91, electrical: 97, tires: 86 } }) components: Record<string, number>;
}

export class RulResponseDto {
  @ApiProperty({ example: 'engine_oil' }) component: string;
  @ApiProperty({ example: 4500 }) remainingKm: number;
  @ApiProperty({ example: 0.87 }) confidence: number;
  @ApiProperty({ example: '2026-03-15' }) estimatedDate: string;
}

// ── Devices ───────────────────────────────────────────────────

export class DeviceResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'IMEI-352625108765432' }) serialNumber: string;
  @ApiProperty({ example: 'teltonika_fmb920' }) deviceType: string;
  @ApiProperty({ example: 'online' }) status: string;
  @ApiProperty({ example: 95 }) signalStrength: number;
  @ApiPropertyOptional() vehicleId?: string;
}

// ── Cold Chain ────────────────────────────────────────────────

export class ColdChainShipmentDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'Pharmaceuticals — Dubai to Abu Dhabi' }) description: string;
  @ApiProperty({ example: { min: 2, max: 8, current: 5.2, unit: '°C' } }) temperature: any;
  @ApiProperty({ example: 'in_transit' }) status: string;
  @ApiProperty({ example: false }) breachDetected: boolean;
}

// ── OTA ───────────────────────────────────────────────────────

export class OtaFirmwareResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'fw-teltonika-v3.21' }) packageName: string;
  @ApiProperty({ example: '3.21.0' }) version: string;
  @ApiProperty({ example: 'available' }) status: string;
  @ApiProperty({ example: 342 }) targetDeviceCount: number;
}

// ── EV ────────────────────────────────────────────────────────

export class EvVehicleResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 82 }) batteryPercent: number;
  @ApiProperty({ example: 312 }) rangeKm: number;
  @ApiProperty({ example: 'idle' }) chargingStatus: string;
  @ApiProperty({ example: 95 }) batteryHealthPercent: number;
}

// ── V2G ───────────────────────────────────────────────────────

export class V2gContractResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'DEWA Grid Stabilization' }) contractName: string;
  @ApiProperty({ example: 'active' }) status: string;
  @ApiProperty({ example: 150 }) maxDischargeKw: number;
  @ApiProperty({ example: 12500 }) revenueAed: number;
}

// ── Analytics ─────────────────────────────────────────────────

export class FleetSummaryDto {
  @ApiProperty({ example: 342 }) totalVehicles: number;
  @ApiProperty({ example: 298 }) activeVehicles: number;
  @ApiProperty({ example: 245 }) totalDrivers: number;
  @ApiProperty({ example: 87.5 }) fleetUtilizationPercent: number;
  @ApiProperty({ example: 98.2 }) complianceRate: number;
  @ApiProperty({ example: 2450000 }) totalCostAed: number;
}

export class NlQueryResponseDto {
  @ApiProperty({ example: 'What is average fuel consumption for tanker fleet?' }) query: string;
  @ApiProperty({ example: 'The average fuel consumption for the tanker fleet is 32.5 L/100km...' }) answer: string;
  @ApiProperty({ example: ['fuel_analytics', 'tanker_fleet'] }) dataSources: string[];
}

// ── Reports ───────────────────────────────────────────────────

export class ReportTemplateDto {
  @ApiProperty({ example: 'fleet_utilization' }) id: string;
  @ApiProperty({ example: 'Fleet Utilization Report' }) name: string;
  @ApiProperty({ example: 'pdf' }) defaultFormat: string;
}

export class ReportJobDto {
  @ApiProperty({ example: 'rpt-job-001' }) jobId: string;
  @ApiProperty({ example: 'processing' }) status: string;
  @ApiPropertyOptional({ example: 45 }) progressPercent?: number;
  @ApiPropertyOptional({ example: 'https://storage.blueedge.ae/reports/...' }) downloadUrl?: string;
}

// ── Notifications ─────────────────────────────────────────────

export class NotificationResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'alert' }) type: string;
  @ApiProperty({ example: 'Vehicle exceeded speed limit' }) message: string;
  @ApiProperty({ example: false }) read: boolean;
  @ApiProperty({ example: '2026-02-12T10:30:00Z' }) createdAt: string;
}

// ── Operations ────────────────────────────────────────────────

export class GeofenceResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'ADNOC Jebel Ali Terminal' }) name: string;
  @ApiProperty({ example: 'polygon' }) type: string;
  @ApiProperty({ example: 'active' }) status: string;
  @ApiProperty({ example: 23 }) vehiclesInside: number;
}

// ── Users ─────────────────────────────────────────────────────

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'Ahmed Al-Rashid' }) name: string;
  @ApiProperty({ example: 'ahmed@blueedge.ae' }) email: string;
  @ApiProperty({ example: 'admin' }) role: string;
  @ApiProperty({ example: true }) isActive: boolean;
}

// ── Health ────────────────────────────────────────────────────

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' }) status: string;
  @ApiProperty({ example: 'Blue Edge Fleet API' }) service: string;
  @ApiProperty({ example: '2.12.0' }) version: string;
  @ApiProperty({ example: 86400 }) uptime: number;
}

export class ReadinessResponseDto {
  @ApiProperty({ example: 'ready' }) status: string;
  @ApiProperty({ example: { cache: 'up', events: 'up', logging: 'up' } }) checks: Record<string, string>;
}
