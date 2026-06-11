import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL } from '../../common/cache';
import { VehicleLifecycleService } from './vehicle-lifecycle.service';

@ApiTags('vehicle-lifecycle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized — invalid or missing JWT' })
@ApiResponse({ status: 403, description: 'Forbidden — insufficient permissions' })
@Controller('vehicle-lifecycle')
export class VehicleLifecycleController {
  constructor(private svc: VehicleLifecycleService) {}

  // ═══════════════════════════════════════════════════════════════
  // 360° VIEW
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(10)
  @Get(':vehicleId')
  @ApiOperation({
    summary: 'Vehicle 360° Lifecycle Summary',
    description: 'Returns complete vehicle intelligence including active driver session, DWVS attribution, and cross-module aggregation. This is the primary endpoint for the Vehicle 360° frontend module.',
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Complete 360° vehicle view', schema: { example: { success: true, data: { vehicleId: 'uuid', generated: '2026-02-15T10:00:00Z', activeSession: null, driverAttribution: [] } } } })
  getVehicle360(@Param('vehicleId') vehicleId: string) {
    return this.svc.getVehicle360(vehicleId);
  }

  // ═══════════════════════════════════════════════════════════════
  // TCO
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.FINANCE_READ)
  @HttpCacheTTL(60)
  @Get(':vehicleId/tco')
  @ApiOperation({
    summary: 'Compute Total Cost of Ownership',
    description: 'Calculates comprehensive TCO including acquisition (amortized), fuel, maintenance (scheduled + unscheduled), insurance, tires, registration/tolls (Salik), downtime cost, and depreciation. Returns breakdown, per-km cost, 3-year and 5-year projections, and replacement recommendation.',
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiQuery({ name: 'fuelPricePerL', required: false, description: 'Override fuel price (AED/L)' })
  @ApiResponse({ status: 200, description: 'TCO breakdown and projections', schema: { example: { success: true, data: { tcoTotal: 842000, costPerKm: 2.45, tco3YearProjection: 842000, tco5YearProjection: 1185000, recommendation: 'KEEP' } } } })
  computeTCO(
    @Param('vehicleId') vehicleId: string,
    @Query('fuelPricePerL') fuelPricePerL?: string,
  ) {
    const config = fuelPricePerL ? { fuelPricePerL: parseFloat(fuelPricePerL) } : {};
    return this.svc.computeTCO(vehicleId, config);
  }

  // ═══════════════════════════════════════════════════════════════
  // DRIVER ATTRIBUTION
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(30)
  @Get(':vehicleId/driver-attribution')
  @ApiOperation({
    summary: 'Driver-Vehicle Attribution Matrix',
    description: 'Returns each driver\'s impact on this vehicle\'s TCO and residual value. Uses the patent-pending DIAM (Driver Impact Attribution Model) with variance-based DWVS scoring. Shows depreciation contribution per driver.',
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Driver attribution matrix with DWVS scores and depreciation impact' })
  getDriverAttribution(@Param('vehicleId') vehicleId: string) {
    return this.svc.getDriverAttribution(vehicleId);
  }

  // ═══════════════════════════════════════════════════════════════
  // FLEET RANKING
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(60)
  @Get(':vehicleId/fleet-ranking')
  @ApiOperation({
    summary: 'Fleet ranking and comparison',
    description: 'Ranks this vehicle against fleet on 6 KPIs: fuel efficiency, maintenance cost, uptime, safety, driver DWVS, and TCO/km. Also compares against same-model peers to isolate operational differences from model differences.',
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Multi-KPI ranking with percentiles and same-model comparison' })
  getFleetRanking(@Param('vehicleId') vehicleId: string) {
    return this.svc.computeFleetRanking(vehicleId);
  }

  // ═══════════════════════════════════════════════════════════════
  // AI RECOMMENDATIONS
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(30)
  @Get(':vehicleId/recommendations')
  @ApiOperation({
    summary: 'AI-generated recommendations',
    description: 'Generates prioritized, actionable recommendations with confidence scores and AED impact estimates. Categories: Driver (reassign/award), Maintenance (proactive service), Financial (resale timing), Fuel (anomaly investigation), Operational (route optimization), Insurance (premium negotiation).',
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Array of prioritized recommendations with impact estimates', schema: { example: { success: true, data: [{ id: 'rec-1', priority: 'critical', category: 'Driver', title: 'Reassign high-variance driver', impactAED: 22400, confidencePct: 94 }] } } })
  getRecommendations(@Param('vehicleId') vehicleId: string) {
    return this.svc.generateRecommendations(vehicleId);
  }

  // ═══════════════════════════════════════════════════════════════
  // MAINTENANCE QUALITY
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.MAINTENANCE_READ)
  @HttpCacheTTL(30)
  @Get(':vehicleId/maintenance-quality')
  @ApiOperation({
    summary: 'Maintenance quality analysis',
    description: 'Evaluates service quality based on on-time rate, first-time-fix rate, repeat DTC rate, and service type distribution. Identifies maintenance shops with highest quality scores.',
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Maintenance quality metrics' })
  getMaintenanceQuality(@Param('vehicleId') vehicleId: string) {
    return this.svc.getMaintenanceQuality(vehicleId);
  }

  // ═══════════════════════════════════════════════════════════════
  // FUEL INTELLIGENCE
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.FUEL_READ)
  @HttpCacheTTL(15)
  @Get(':vehicleId/fuel-intelligence')
  @ApiOperation({
    summary: 'Fuel intelligence with driver comparison',
    description: 'Provides fuel consumption analysis including per-driver efficiency comparison on the same vehicle (isolates driver behavior from vehicle differences), anomaly detection, and cost trends.',
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Fuel intelligence with driver comparison' })
  getFuelIntelligence(@Param('vehicleId') vehicleId: string) {
    return this.svc.getFuelIntelligence(vehicleId);
  }
}
