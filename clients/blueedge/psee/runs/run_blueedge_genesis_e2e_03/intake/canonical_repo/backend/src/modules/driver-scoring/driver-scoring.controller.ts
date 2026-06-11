import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { DriverScoringService } from './driver-scoring.service';

@ApiTags('driver-scoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('driver-scoring')
export class DriverScoringController {
  constructor(private readonly svc: DriverScoringService) {}

  @Get()
  @ApiOperation({ summary: 'List all driver-scoring' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver-scoring by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create driver-scoring' })
  @InvalidatesCache('driver-scoring')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get Leaderboard' })
  @HttpCacheTTL(300)
  getLeaderboard() { return this.svc.getLeaderboard(); }

  @Get('driver-profile')
  @ApiOperation({ summary: 'Get Driver Profile' })
  @HttpCacheTTL(300)
  getDriverProfile() { return this.svc.getDriverProfile(); }

  @Get('driver-events')
  @ApiOperation({ summary: 'Get Driver Events' })
  @HttpCacheTTL(300)
  getDriverEvents() { return this.svc.getDriverEvents(); }

  @Get('coaching-recommendations')
  @ApiOperation({ summary: 'Get Coaching Recommendations' })
  @HttpCacheTTL(300)
  getCoachingRecommendations() { return this.svc.getCoachingRecommendations(); }

  @Get('record-event')
  @ApiOperation({ summary: 'Record Event' })
  @HttpCacheTTL(300)
  recordEvent() { return this.svc.recordEvent(); }

  @Get('score-breakdown')
  @ApiOperation({ summary: 'Get Score Breakdown' })
  @HttpCacheTTL(300)
  getScoreBreakdown() { return this.svc.getScoreBreakdown(); }

  @Post('real-time-score')
  @ApiOperation({ summary: 'Calculate Real Time Score' })
  @InvalidatesCache('driver-scoring')
  calculateRealTimeScore(@Body() dto: any) { return this.svc.calculateRealTimeScore(dto); }

  @Get('fleet-comparison')
  @ApiOperation({ summary: 'Get Fleet Comparison' })
  @HttpCacheTTL(300)
  getFleetComparison() { return this.svc.getFleetComparison(); }

  @Get('incentive-optimization')
  @ApiOperation({ summary: 'Get Incentive Optimization' })
  @HttpCacheTTL(300)
  getIncentiveOptimization() { return this.svc.getIncentiveOptimization(); }

  @Get('risk-prediction')
  @ApiOperation({ summary: 'Get Risk Prediction' })
  @HttpCacheTTL(300)
  getRiskPrediction() { return this.svc.getRiskPrediction(); }

  @Get('algorithm-weights')
  @ApiOperation({ summary: 'Get Algorithm Weights' })
  @HttpCacheTTL(300)
  getAlgorithmWeights() { return this.svc.getAlgorithmWeights(); }

}
