import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { UsersService } from './users.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('users') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}
  @RequirePermissions(Permission.USER_READ)
  @HttpCacheTTL(300)
  @Get() @ApiOperation({ summary: 'List users' })
  @ApiResponse({ status: 200, description: 'Paginated list', schema: { example: {"success":true,"data":{"items":[{"id":"uuid","email":"admin@blueedge.com","firstName":"Omar","lastName":"Al Maktoum","role":"admin","status":"active","lastLoginAt":"2024-01-15T08:00:00Z","region":"dubai"}],"total":25,"page":1,"limit":20}} } }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.USER_READ)
  @HttpCacheTTL(300)
  @Get(':id') @ApiOperation({ summary: 'Get user' }) findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.USER_WRITE)
  @InvalidatesCache('users')
  @Post() @ApiOperation({ summary: 'Create user' }) create(@Body() dto: Partial<User>) { return this.svc.create(dto); }
  @RequirePermissions(Permission.USER_WRITE)
  @InvalidatesCache('users')
  @Put(':id') @ApiOperation({ summary: 'Update user' }) update(@Param('id') id: string, @Body() dto: Partial<User>) { return this.svc.update(id, dto); }
  @RequirePermissions(Permission.USER_WRITE)
  @InvalidatesCache('users')
  @Delete(':id') @ApiOperation({ summary: 'Delete user' }) remove(@Param('id') id: string) { return this.svc.remove(id); }
}
