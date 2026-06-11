import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { AftersalesService } from './aftersales.service';

@ApiTags('aftersales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('aftersales')
export class AftersalesController {
  constructor(private readonly svc: AftersalesService) {}

  @Get()
  @ApiOperation({ summary: 'List all aftersales' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get aftersales by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create aftersales' })
  @InvalidatesCache('aftersales')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('repair-scheduling')
  @ApiOperation({ summary: 'Get Repair Scheduling' })
  @HttpCacheTTL(300)
  getRepairScheduling() { return this.svc.getRepairScheduling(); }

  @Get('parts-integration')
  @ApiOperation({ summary: 'Get Parts Integration' })
  @HttpCacheTTL(300)
  getPartsIntegration() { return this.svc.getPartsIntegration(); }

  @Get('workshop-management')
  @ApiOperation({ summary: 'Get Workshop Management' })
  @HttpCacheTTL(300)
  getWorkshopManagement() { return this.svc.getWorkshopManagement(); }

  @Get('cybersecurity-compliance')
  @ApiOperation({ summary: 'Get Cybersecurity Compliance' })
  @HttpCacheTTL(300)
  getCybersecurityCompliance() { return this.svc.getCybersecurityCompliance(); }

  @Get('o-e-m-field-intelligence')
  @ApiOperation({ summary: 'Get O E M Field Intelligence' })
  @HttpCacheTTL(300)
  getOEMFieldIntelligence() { return this.svc.getOEMFieldIntelligence(); }

  @Post('work-order')
  @ApiOperation({ summary: 'Create Work Order' })
  @InvalidatesCache('aftersales')
  createWorkOrder(@Body() dto: any) { return this.svc.createWorkOrder(dto); }

  @Post('work-order-status/:id')
  @ApiOperation({ summary: 'Update Work Order Status' })
  @InvalidatesCache('aftersales')
  updateWorkOrderStatus(@Param('id') id: string, @Body() dto: any) { return this.svc.updateWorkOrderStatus(id, dto); }

}
