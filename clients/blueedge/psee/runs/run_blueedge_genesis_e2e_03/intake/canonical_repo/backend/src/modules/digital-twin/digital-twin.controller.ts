import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { DigitalTwinService } from './digital-twin.service';

@ApiTags('digital-twin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('digital-twin')
export class DigitalTwinController {
  constructor(private readonly svc: DigitalTwinService) {}

  @Get()
  @ApiOperation({ summary: 'List all digital-twin' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get digital-twin by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create digital-twin' })
  @InvalidatesCache('digital-twin')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('twin-state')
  @ApiOperation({ summary: 'Get Twin State' })
  @HttpCacheTTL(300)
  getTwinState() { return this.svc.getTwinState(); }

  @Post('simulation')
  @ApiOperation({ summary: 'Run Simulation' })
  @InvalidatesCache('digital-twin')
  runSimulation(@Body() dto: any) { return this.svc.runSimulation(dto); }

  @Get('fleet-twins')
  @ApiOperation({ summary: 'Get Fleet Twins' })
  @HttpCacheTTL(300)
  getFleetTwins() { return this.svc.getFleetTwins(); }

  @Get('capture-snapshot')
  @ApiOperation({ summary: 'Capture Snapshot' })
  @HttpCacheTTL(300)
  captureSnapshot() { return this.svc.captureSnapshot(); }

  @Get('simulation-history')
  @ApiOperation({ summary: 'Get Simulation History' })
  @HttpCacheTTL(300)
  getSimulationHistory() { return this.svc.getSimulationHistory(); }

  @Get('compare-twins')
  @ApiOperation({ summary: 'Compare Twins' })
  @HttpCacheTTL(300)
  compareTwins() { return this.svc.compareTwins(); }

}
