import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { PredictiveMaintenanceService } from './predictive-maintenance.service';

@ApiTags('predictive-maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('predictive-maintenance')
export class PredictiveMaintenanceController {
  constructor(private readonly svc: PredictiveMaintenanceService) {}

  @Get()
  @ApiOperation({ summary: 'List all predictive-maintenance' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get predictive-maintenance by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create predictive-maintenance' })
  @InvalidatesCache('predictive-maintenance')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('active-predictions')
  @ApiOperation({ summary: 'Get Active Predictions' })
  @HttpCacheTTL(300)
  getActivePredictions() { return this.svc.getActivePredictions(); }

  @Get('vehicle-health')
  @ApiOperation({ summary: 'Get Vehicle Health' })
  @HttpCacheTTL(300)
  getVehicleHealth() { return this.svc.getVehicleHealth(); }

  @Post('prediction')
  @ApiOperation({ summary: 'Run Prediction' })
  @InvalidatesCache('predictive-maintenance')
  runPrediction(@Body() dto: any) { return this.svc.runPrediction(dto); }

  @Get('models')
  @ApiOperation({ summary: 'Get Models' })
  @HttpCacheTTL(300)
  getModels() { return this.svc.getModels(); }

  @Get('retrain-model')
  @ApiOperation({ summary: 'Retrain Model' })
  @HttpCacheTTL(300)
  retrainModel() { return this.svc.retrainModel(); }

  @Get('maintenance-schedule')
  @ApiOperation({ summary: 'Get Maintenance Schedule' })
  @HttpCacheTTL(300)
  getMaintenanceSchedule() { return this.svc.getMaintenanceSchedule(); }

  @Get('weibull-r-u-l')
  @ApiOperation({ summary: 'Get Weibull R U L' })
  @HttpCacheTTL(300)
  getWeibullRUL() { return this.svc.getWeibullRUL(); }

  @Get('fleet-health-trend')
  @ApiOperation({ summary: 'Get Fleet Health Trend' })
  @HttpCacheTTL(300)
  getFleetHealthTrend() { return this.svc.getFleetHealthTrend(); }

  @Get('survival-curve')
  @ApiOperation({ summary: 'Get Survival Curve' })
  @HttpCacheTTL(300)
  getSurvivalCurve() { return this.svc.getSurvivalCurve(); }

  @Get('cost-optimization')
  @ApiOperation({ summary: 'Get Cost Optimization' })
  @HttpCacheTTL(300)
  getCostOptimization() { return this.svc.getCostOptimization(); }

  @Get('batch-predict')
  @ApiOperation({ summary: 'Batch Predict' })
  @HttpCacheTTL(300)
  batchPredict() { return this.svc.batchPredict(); }

}
