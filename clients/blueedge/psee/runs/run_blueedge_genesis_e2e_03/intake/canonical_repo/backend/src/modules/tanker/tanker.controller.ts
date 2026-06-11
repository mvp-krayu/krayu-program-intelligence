import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { CargoService } from './tanker.service';
import { CustodyService } from './tanker.service';
import { TankMonitoringService } from './tanker.service';
import { TankerSafetyService } from './tanker.service';
import { HazmatService } from './tanker.service';
import { ProductService } from './tanker.service';
import { InventoryService } from './tanker.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('tanker') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('tanker')
export class TankerController {
  constructor(
    private cargoSvc: CargoService, private custodySvc: CustodyService,
    private monitorSvc: TankMonitoringService, private safetySvc: TankerSafetyService,
    private hazmatSvc: HazmatService, private productSvc: ProductService, private inventorySvc: InventoryService,
  ) {}

  @RequirePermissions(Permission.TANKER_READ)
  @HttpCacheTTL(300)
  @Get('manifests') @ApiOperation({ summary: 'List cargo manifests', description: 'Returns paginated list of oil & gas cargo manifests with product, volume, and delivery details.' })
  @ApiResponse({ status: 200, description: 'Cargo manifest list', schema: { example: { success: true, data: { items: [{ id: 'uuid', productName: 'Diesel EN590', volumeLiters: 32000, originName: 'ENOC Terminal 2', destinationName: 'Al Quoz Depot', status: 'in_transit', hazmatClass: '3' }], total: 40, page: 1, limit: 20 } } } })
  findAll(@Query() q: PaginationDto) { return this.cargoSvc.findAll(q); }

  @RequirePermissions(Permission.TANKER_READ)
  @HttpCacheTTL(300)
  @Get('manifests/active') @ApiOperation({ summary: 'Active cargo in transit' })
  @ApiResponse({ status: 200, description: 'Cargo manifests currently in transit' })
  getActive() { return this.cargoSvc.getActive(); }

  @RequirePermissions(Permission.TANKER_READ)
  @HttpCacheTTL(300)
  @Get('manifests/stats') @ApiOperation({ summary: 'Cargo statistics', description: 'Aggregated tanker fleet cargo metrics.' })
  @ApiResponse({ status: 200, description: 'Tanker cargo stats', schema: { example: { success: true, data: { totalManifests: 856, inTransit: 42, delivered: 780, avgDeliveryTimeHrs: 4.2, totalVolumeL: 2450000, discrepancyRate: 0.3 } } } })
  getStats() { return this.cargoSvc.getStats(); }
  @RequirePermissions(Permission.TANKER_READ)
  @HttpCacheTTL(300)
  @Get('manifests/:id') @ApiOperation({ summary: 'Get manifest' }) findOne(@Param('id') id: string) { return this.cargoSvc.findOne(id); }
  @RequirePermissions(Permission.TANKER_WRITE)
  @InvalidatesCache('tanker')
  @Post('manifests') @ApiOperation({ summary: 'Create manifest' }) create(@Body() dto: Partial<CargoManifest>) { return this.cargoSvc.create(dto); }
  @RequirePermissions(Permission.TANKER_WRITE)
  @InvalidatesCache('tanker')
  @Put('manifests/:id') @ApiOperation({ summary: 'Update manifest' }) update(@Param('id') id: string, @Body() dto: Partial<CargoManifest>) { return this.cargoSvc.update(id, dto); }
  @RequirePermissions(Permission.TANKER_WRITE)
  @InvalidatesCache('tanker')
  @Patch('manifests/:id/confirm') @ApiOperation({ summary: 'Confirm manifest' }) confirm(@Param('id') id: string) { return this.cargoSvc.update(id, { status: 'confirmed' } as any); }

  @RequirePermissions(Permission.TANKER_READ)
  @HttpCacheTTL(300)
  @Get('custody-transfers') @ApiOperation({ summary: 'List custody transfers' }) getCustody(@Query() q: PaginationDto) { return this.custodySvc.findAll(q); }
  @RequirePermissions(Permission.TANKER_READ)
  @HttpCacheTTL(300)
  @Get('custody-transfers/disputed') @ApiOperation({ summary: 'Disputed transfers' }) getDisputed() { return this.custodySvc.getDisputed(); }
  @RequirePermissions(Permission.TANKER_READ)
  @HttpCacheTTL(300)
  @Get('custody-transfers/:id') @ApiOperation({ summary: 'Get custody transfer' }) getCustodyOne(@Param('id') id: string) { return this.custodySvc.findOne(id); }
  @RequirePermissions(Permission.TANKER_WRITE)
  @InvalidatesCache('tanker')
  @Post('custody-transfers') @ApiOperation({ summary: 'Record custody transfer' }) createCustody(@Body() dto: Partial<CustodyTransfer>) { return this.custodySvc.create(dto); }
  @RequirePermissions(Permission.TANKER_WRITE)
  @InvalidatesCache('tanker')
  @Patch('custody-transfers/:id/complete') @ApiOperation({ summary: 'Complete transfer' }) completeCustody(@Param('id') id: string) { return this.custodySvc.update(id, { status: 'completed' } as any); }

  @RequirePermissions(Permission.TANKER_READ)
  @HttpCacheTTL(300)
  @Get('tank-status/:vehicleId') @ApiOperation({ summary: 'Real-time tank compartment status' })
  getTankStatus(@Param('vehicleId') id: string) {
    return success({ vehicleId: id, timestamp: new Date(), compartments: [
      { number: 1, productName: 'Diesel EN590', volumeL: 8500, capacityL: 10000, tempC: 22.5, pressureMbar: 25, status: 'NORMAL' },
      { number: 2, productName: 'Gasoline 95', volumeL: 7200, capacityL: 8000, tempC: 23.1, pressureMbar: 28, status: 'NORMAL' },
      { number: 3, productName: 'Diesel EN590', volumeL: 9800, capacityL: 10000, tempC: 21.8, pressureMbar: 24, status: 'NORMAL' },
      { number: 4, productName: 'Jet A-1', volumeL: 6500, capacityL: 7000, tempC: 20.5, pressureMbar: 22, status: 'NORMAL' },
    ], gasDetection: { lelPercent: 1.2, alarmActive: false }, sloshRisk: 'LOW' });
  }

  @RequirePermissions(Permission.TANKER_READ)
  @HttpCacheTTL(300)
  @Get('hazmat/compliance') @ApiOperation({ summary: 'HAZMAT compliance status' })
  getHazmat() { return success({ compliantVehicles: 38, nonCompliant: 2, expiringPermits: 5, recentInspections: 12 }); }

  // ═══ Tank Monitoring (NEW) ═══
  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(10)
  @Get('monitoring/fleet') @ApiOperation({ summary: 'Fleet-wide tank status — all vehicles with compartments' })
  getFleetTankStatus() { return this.monitorSvc.getFleetStatus(); }

  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(5)
  @Get('monitoring/:vehicleId/compartments') @ApiOperation({ summary: 'Vehicle compartment details (levels, temp, pressure, density)' })
  getCompartments(@Param('vehicleId') vid: string) { return this.monitorSvc.getVehicleCompartments(vid); }

  @RequirePermissions(Permission.TANKER_READ)
  @Get('monitoring/:vehicleId/compartments/:compId/history') @ApiOperation({ summary: 'Compartment telemetry history (24h)' })
  getCompHistory(@Param('vehicleId') vid: string, @Param('compId') cid: string) { return this.monitorSvc.getCompartmentHistory(vid, cid); }

  // ═══ Transfer Operations — Active (NEW) ═══
  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(15)
  @Get('transfers/active') @ApiOperation({ summary: 'Active loading/unloading transfers in progress' })
  getActiveTransfers() { return this.custodySvc.getActive(); }

  @RequirePermissions(Permission.TANKER_WRITE) @InvalidatesCache('tanker')
  @Post('transfers/:id/advance') @ApiOperation({ summary: 'Advance transfer workflow step' })
  advanceStep(@Param('id') id: string, @Body() dto: any) { return this.custodySvc.advanceStep(id, dto.step); }

  // ═══ Safety Systems (NEW) ═══
  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(10)
  @Get('safety/dashboard') @ApiOperation({ summary: 'Tanker safety systems dashboard (roll, leak, gas, emergency)' })
  getSafetyDashboard() { return this.safetySvc.getDashboard(); }

  @RequirePermissions(Permission.TANKER_READ)
  @Get('safety/events') @ApiOperation({ summary: 'Tanker safety events with severity' })
  getSafetyEvents() { return this.safetySvc.getEvents(); }

  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(5)
  @Get('safety/:vehicleId/imu') @ApiOperation({ summary: 'Live IMU data (lateral G, roll, pitch, yaw)' })
  getIMUData(@Param('vehicleId') vid: string) { return this.safetySvc.getIMUData(vid); }

  @RequirePermissions(Permission.TANKER_WRITE)
  @Post('safety/:vehicleId/e-stop') @ApiOperation({ summary: 'Trigger emergency stop' })
  triggerEStop(@Param('vehicleId') vid: string) { return this.safetySvc.triggerEStop(vid); }

  // ═══ HAZMAT Compliance — Full (NEW) ═══
  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(300)
  @Get('hazmat/dashboard') @ApiOperation({ summary: 'HAZMAT compliance dashboard' })
  getHazmatDashboard() { return this.hazmatSvc.getDashboard(); }

  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(300)
  @Get('hazmat/permits') @ApiOperation({ summary: 'List HAZMAT permits (NCEMA, RTA, Abu Dhabi DOT)' })
  getPermits() { return this.hazmatSvc.getPermits(); }

  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(300)
  @Get('hazmat/routes') @ApiOperation({ summary: 'Approved HAZMAT routes with restrictions' })
  getHazmatRoutes() { return this.hazmatSvc.getRoutes(); }

  // ═══ Product Registry (NEW) ═══
  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(600)
  @Get('products') @ApiOperation({ summary: 'Product registry (UN numbers, HAZMAT class, density, flash point)' })
  getProducts() { return this.productSvc.getProducts(); }

  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(600)
  @Get('products/compatibility') @ApiOperation({ summary: 'Product compatibility matrix' })
  getCompatibility() { return this.productSvc.getCompatibility(); }

  // ═══ Inventory (NEW) ═══
  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(30)
  @Get('inventory') @ApiOperation({ summary: 'Fleet-wide product inventory by vehicle' })
  getInventory() { return this.inventorySvc.getFleetInventory(); }

  @RequirePermissions(Permission.TANKER_READ) @HttpCacheTTL(300)
  @Get('inventory/loss-tracking') @ApiOperation({ summary: 'Product loss tracking and trends' })
  getLossTracking() { return this.inventorySvc.getLossTracking(); }
}
