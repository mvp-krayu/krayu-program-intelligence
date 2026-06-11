import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { ComplianceService } from './compliance.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('compliance') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('compliance')
export class ComplianceController {
  constructor(private svc: ComplianceService) {}
  @RequirePermissions(Permission.COMPLIANCE_READ)
  @HttpCacheTTL(300)
  @Get('hos') @ApiOperation({ summary: 'HOS compliance summary' }) getHOS() { return this.svc.getHOSSummary(); }
  @RequirePermissions(Permission.COMPLIANCE_READ)
  @HttpCacheTTL(300)
  @Get('inspections') @ApiOperation({ summary: 'Inspection records' }) getInspections(@Query() q: any) { return this.svc.getInspections(q); }
  @RequirePermissions(Permission.COMPLIANCE_READ)
  @HttpCacheTTL(300)
  @Get('documents') @ApiOperation({ summary: 'Compliance documents' }) getDocuments(@Query() q: any) { return this.svc.getDocuments(q); }
  @RequirePermissions(Permission.COMPLIANCE_READ)
  @HttpCacheTTL(300)
  @Get('audit-trail') @ApiOperation({ summary: 'Audit trail' }) getAudit(@Query() q: any) { return this.svc.getAuditTrail(q); }
  @RequirePermissions(Permission.COMPLIANCE_READ)
  @HttpCacheTTL(300)
  @Get('certifications') @ApiOperation({ summary: 'Certification tracker' }) getCerts(@Query() q: any) { return this.svc.getCertifications(q); }
  @RequirePermissions(Permission.COMPLIANCE_READ)
  @HttpCacheTTL(300)
  @Get('cross-border') @ApiOperation({ summary: 'Cross-border compliance' }) getCrossBorder() { return this.svc.getCrossBorderStatus(); }
  @RequirePermissions(Permission.COMPLIANCE_WRITE)
  @InvalidatesCache('compliance')
  @Post('inspections') @ApiOperation({ summary: 'Schedule inspection' }) createInspection(@Body() dto: any) { return this.svc.createInspection(dto); }
  @RequirePermissions(Permission.COMPLIANCE_WRITE)
  @InvalidatesCache('compliance')
  @Post('violations') @ApiOperation({ summary: 'Report violation' }) submitViolation(@Body() dto: any) { return this.svc.submitViolation(dto); }
}
