import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { AuthService } from './auth.service';

@ApiResponse({ status: 401, description: 'Unauthorized — invalid credentials or token' })
@ApiTags('auth') @Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') @ApiOperation({ summary: 'Login', description: 'Authenticate with email and password. Returns JWT access token and refresh token.' })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { success: true, data: { accessToken: 'eyJhbGciOiJIUzI1NiIs...', refreshToken: 'eyJhbGciOiJIUzI1NiIs...', user: { id: 'u-001', email: 'admin@blueedge.com', name: 'Ahmed Al Rashid', role: 'admin' }, expiresIn: 900 } } } })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  login(@Body() body: { email: string; password: string }) { return this.authService.login(body.email, body.password); }

  @Post('refresh') @ApiOperation({ summary: 'Refresh token', description: 'Exchange a valid refresh token for a new access token.' })
  @ApiResponse({ status: 200, description: 'Token refreshed', schema: { example: { success: true, data: { accessToken: 'eyJhbGciOiJIUzI1NiIs...', expiresIn: 900 } } } })
  refresh(@Body() body: { refreshToken: string }) { return this.authService.refresh(body.refreshToken); }

  @Get('profile') @ApiOperation({ summary: 'Get current user profile', description: 'Returns the authenticated user profile with permissions.' }) @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'User profile', schema: { example: { success: true, data: { id: 'u-001', email: 'admin@blueedge.com', name: 'Ahmed Al Rashid', role: 'admin', orgId: 'org-001', permissions: ['fleet:read', 'fleet:write', 'admin:all'] } } } })
  getProfile(@Request() req: any) { return this.authService.getProfile(req.user); }

  @Post('logout') @ApiOperation({ summary: 'Logout', description: 'Invalidate the current session.' }) @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Logged out', schema: { example: { success: true, data: { message: 'Logged out successfully' } } } })
  logout() { return success({ message: 'Logged out successfully' }); }
}
