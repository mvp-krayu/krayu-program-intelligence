import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { MessagingService } from './messaging.service';

@ApiTags('messaging')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('messaging')
export class MessagingController {
  constructor(private readonly svc: MessagingService) {}

  @Get()
  @ApiOperation({ summary: 'List all messaging' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get messaging by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create messaging' })
  @InvalidatesCache('messaging')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('templates')
  @ApiOperation({ summary: 'Get Templates' })
  @HttpCacheTTL(300)
  getTemplates() { return this.svc.getTemplates(); }

  @Post('message')
  @ApiOperation({ summary: 'Send Message' })
  @InvalidatesCache('messaging')
  sendMessage(@Body() dto: any) { return this.svc.sendMessage(dto); }

  @Post('bulk')
  @ApiOperation({ summary: 'Send Bulk' })
  @InvalidatesCache('messaging')
  sendBulk(@Body() dto: any) { return this.svc.sendBulk(dto); }

  @Get('campaigns')
  @ApiOperation({ summary: 'Get Campaigns' })
  @HttpCacheTTL(300)
  getCampaigns() { return this.svc.getCampaigns(); }

  @Get('message-history')
  @ApiOperation({ summary: 'Get Message History' })
  @HttpCacheTTL(300)
  getMessageHistory() { return this.svc.getMessageHistory(); }

  @Get('whats-app-status/:id')
  @ApiOperation({ summary: 'Get Whats App Status' })
  @HttpCacheTTL(300)
  getWhatsAppStatus(@Param('id') id: string) { return this.svc.getWhatsAppStatus(id); }

}
