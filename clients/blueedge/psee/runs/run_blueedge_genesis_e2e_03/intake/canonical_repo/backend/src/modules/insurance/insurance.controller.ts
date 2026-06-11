import { Controller, Get, Post, Param, Query, Body, UseGuards, Logger, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { InsuranceService } from './insurance.service';
import { success, paginated } from '../../common/dto';

@ApiTags('Insurance')
@ApiBearerAuth()
@Controller('insurance')
export class InsuranceController {
  private readonly logger = new Logger(InsuranceController.name);

  constructor(private readonly service: InsuranceService) {}

  // ── Policies ───────────────────────────────────────────────

  @Get('policies')
  @ApiOperation({ summary: 'List insurance policies', description: 'Returns all insurance policies with optional filtering' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'pending', 'expired', 'cancelled'] })
  @ApiQuery({ name: 'vehicleId', required: false })
  @ApiQuery({ name: 'providerId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of insurance policies' })
  async findAll(
    @Query('status') status?: string,
    @Query('vehicleId') vehicleId?: string,
    @Query('providerId') providerId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.service.findAll({ status, vehicleId, providerId, page: page ?? 1, limit: limit ?? 20 });
    return paginated(result.data, result.total, result.page, result.limit);
  }

  @Get('policies/:id')
  @ApiOperation({ summary: 'Get insurance policy by ID' })
  @ApiParam({ name: 'id', description: 'Policy UUID' })
  @ApiResponse({ status: 200, description: 'Insurance policy details' })
  async findOne(@Param('id') id: string) {
    const policy = await this.service.findOne(id);
    return success(policy);
  }

  @Get('policies/vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get policies for a specific vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, description: 'List of policies for the vehicle' })
  async findByVehicle(@Param('vehicleId') vehicleId: string) {
    const policies = await this.service.findByVehicle(vehicleId);
    return success(policies);
  }

  // ── Premium Computation ────────────────────────────────────

  @Post('premium/compute')
  @HttpCode(200)
  @ApiOperation({ summary: 'Compute DWVS-adjusted insurance premium', description: 'Calculates premium based on DWVS, TPM coverage, fleet metrics, and claims history' })
  @ApiResponse({ status: 200, description: 'Premium computation with breakdown' })
  async computePremium(@Body() input: {
    vehicleId: string;
    avgDwvs: number;
    tpmSignedBlocks: number;
    totalBlocks: number;
    fleetAvgDwvs: number;
    harshEventRate: number;
    dtcRate: number;
    totalKm: number;
    sessionCount: number;
  }) {
    const result = this.service.computePremium(input);
    this.logger.log(`Premium computed for ${input.vehicleId}: AED ${result.finalPremiumAED} (${result.savingsPct}% discount)`);
    return success(result);
  }

  // ── TPM Block Submission ───────────────────────────────────

  @Post('submit-blocks')
  @HttpCode(200)
  @ApiOperation({ summary: 'Submit TPM-signed session blocks to insurance provider', description: 'Submits cryptographically verified driver session data for premium negotiation' })
  @ApiResponse({ status: 200, description: 'Submission acknowledgement with impact estimate' })
  async submitBlocks(@Body() submission: {
    policyId: string;
    vehicleId: string;
    sessionBlocks: any[];
    periodStart: string;
    periodEnd: string;
  }) {
    const result = await this.service.submitSessionBlocks(submission);
    this.logger.log(`Submitted ${result.blocksSubmitted} blocks for policy ${submission.policyId}`);
    return success(result);
  }

  // ── Analytics ──────────────────────────────────────────────

  @Get('analytics')
  @ApiOperation({ summary: 'Get insurance analytics', description: 'Fleet-wide insurance analytics including savings, coverage, and risk metrics' })
  @ApiResponse({ status: 200, description: 'Insurance analytics dashboard data' })
  async getAnalytics() {
    return success(this.service.getAnalytics());
  }

  // ── Risk Assessment ────────────────────────────────────────

  @Get('risk-assessment')
  @ApiOperation({ summary: 'Compute fleet risk assessment', description: 'Multi-factor risk analysis based on DWVS, claims, TPM coverage, and driver variance' })
  @ApiResponse({ status: 200, description: 'Fleet risk assessment with recommendations' })
  async getRiskAssessment() {
    const result = await this.service.computeFleetRisk();
    return success(result);
  }

  // ── Providers ──────────────────────────────────────────────

  @Get('providers')
  @ApiOperation({ summary: 'List insurance providers', description: 'Returns configured insurance providers with API capabilities' })
  @ApiResponse({ status: 200, description: 'List of insurance providers' })
  async getProviders() {
    return success(this.service.getProviders());
  }

  @Get('providers/:id')
  @ApiOperation({ summary: 'Get provider details' })
  @ApiParam({ name: 'id', description: 'Provider UUID' })
  @ApiResponse({ status: 200, description: 'Provider details with API config' })
  async getProvider(@Param('id') id: string) {
    return success(this.service.getProviderById(id));
  }
}
