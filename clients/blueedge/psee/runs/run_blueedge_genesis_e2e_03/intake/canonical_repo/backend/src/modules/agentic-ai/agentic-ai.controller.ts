import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { AgenticAIService } from './agentic-ai.service';

@ApiTags('agentic-ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('agentic-ai')
export class AgenticAiController {
  constructor(private readonly svc: AgenticAIService) {}

  @Get()
  @ApiOperation({ summary: 'List all agentic-ai' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get agentic-ai by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create agentic-ai' })
  @InvalidatesCache('agentic-ai')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('orchestrator-dashboard')
  @ApiOperation({ summary: 'Get Orchestrator Dashboard' })
  @HttpCacheTTL(300)
  getOrchestratorDashboard() { return this.svc.getOrchestratorDashboard(); }

  @Get('predictive-engine')
  @ApiOperation({ summary: 'Get Predictive Engine' })
  @HttpCacheTTL(300)
  getPredictiveEngine() { return this.svc.getPredictiveEngine(); }

  @Get('a-i-mesh')
  @ApiOperation({ summary: 'Get A I Mesh' })
  @HttpCacheTTL(300)
  getAIMesh() { return this.svc.getAIMesh(); }

  @Get('journey-companion')
  @ApiOperation({ summary: 'Get Journey Companion' })
  @HttpCacheTTL(300)
  getJourneyCompanion() { return this.svc.getJourneyCompanion(); }

  @Get('submit-task')
  @ApiOperation({ summary: 'Submit Task' })
  @HttpCacheTTL(300)
  submitTask() { return this.svc.submitTask(); }

  @Get('agent-metrics')
  @ApiOperation({ summary: 'Get Agent Metrics' })
  @HttpCacheTTL(300)
  getAgentMetrics() { return this.svc.getAgentMetrics(); }

}
