import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { OnboardingService } from './onboarding.service';

@ApiTags('onboarding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly svc: OnboardingService) {}

  @Get()
  @ApiOperation({ summary: 'List all onboarding' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get onboarding by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create onboarding' })
  @InvalidatesCache('onboarding')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('wizard-state')
  @ApiOperation({ summary: 'Get Wizard State' })
  @HttpCacheTTL(300)
  getWizardState() { return this.svc.getWizardState(); }

  @Get('company-profile-step')
  @ApiOperation({ summary: 'Get Company Profile Step' })
  @HttpCacheTTL(300)
  getCompanyProfileStep() { return this.svc.getCompanyProfileStep(); }

  @Get('fleet-setup-step')
  @ApiOperation({ summary: 'Get Fleet Setup Step' })
  @HttpCacheTTL(300)
  getFleetSetupStep() { return this.svc.getFleetSetupStep(); }

  @Get('user-provisioning-step')
  @ApiOperation({ summary: 'Get User Provisioning Step' })
  @HttpCacheTTL(300)
  getUserProvisioningStep() { return this.svc.getUserProvisioningStep(); }

  @Get('driver-registration-step')
  @ApiOperation({ summary: 'Get Driver Registration Step' })
  @HttpCacheTTL(300)
  getDriverRegistrationStep() { return this.svc.getDriverRegistrationStep(); }

  @Get('integrations-step')
  @ApiOperation({ summary: 'Get Integrations Step' })
  @HttpCacheTTL(300)
  getIntegrationsStep() { return this.svc.getIntegrationsStep(); }

  @Get('go-live-step')
  @ApiOperation({ summary: 'Get Go Live Step' })
  @HttpCacheTTL(300)
  getGoLiveStep() { return this.svc.getGoLiveStep(); }

  @Get('submit-step')
  @ApiOperation({ summary: 'Submit Step' })
  @HttpCacheTTL(300)
  submitStep() { return this.svc.submitStep(); }

  @Get('complete-onboarding')
  @ApiOperation({ summary: 'Complete Onboarding' })
  @HttpCacheTTL(300)
  completeOnboarding() { return this.svc.completeOnboarding(); }

  @Get('import-template')
  @ApiOperation({ summary: 'Get Import Template' })
  @HttpCacheTTL(300)
  getImportTemplate() { return this.svc.getImportTemplate(); }

  @Get('process-bulk-import')
  @ApiOperation({ summary: 'Process Bulk Import' })
  @HttpCacheTTL(300)
  processBulkImport() { return this.svc.processBulkImport(); }

}
