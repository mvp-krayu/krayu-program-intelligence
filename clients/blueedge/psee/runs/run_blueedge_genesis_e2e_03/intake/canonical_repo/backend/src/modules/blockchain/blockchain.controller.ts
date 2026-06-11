import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { BlockchainService } from './blockchain.service';

@ApiTags('blockchain')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly svc: BlockchainService) {}

  @Get()
  @ApiOperation({ summary: 'List all blockchain' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get blockchain by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create blockchain' })
  @InvalidatesCache('blockchain')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('cargo-tokens')
  @ApiOperation({ summary: 'Get Cargo Tokens' })
  @HttpCacheTTL(300)
  getCargoTokens() { return this.svc.getCargoTokens(); }

  @Get('mint-cargo-token')
  @ApiOperation({ summary: 'Mint Cargo Token' })
  @HttpCacheTTL(300)
  mintCargoToken() { return this.svc.mintCargoToken(); }

  @Get('n-f-t-registry')
  @ApiOperation({ summary: 'Get N F T Registry' })
  @HttpCacheTTL(300)
  getNFTRegistry() { return this.svc.getNFTRegistry(); }

  @Get('transfer-n-f-t')
  @ApiOperation({ summary: 'Transfer N F T' })
  @HttpCacheTTL(300)
  transferNFT() { return this.svc.transferNFT(); }

  @Get('payment-settlement')
  @ApiOperation({ summary: 'Get Payment Settlement' })
  @HttpCacheTTL(300)
  getPaymentSettlement() { return this.svc.getPaymentSettlement(); }

  @Get('data-marketplace')
  @ApiOperation({ summary: 'Get Data Marketplace' })
  @HttpCacheTTL(300)
  getDataMarketplace() { return this.svc.getDataMarketplace(); }

  @Get('carbon-credits')
  @ApiOperation({ summary: 'Get Carbon Credits' })
  @HttpCacheTTL(300)
  getCarbonCredits() { return this.svc.getCarbonCredits(); }

  @Get('verify-custody')
  @ApiOperation({ summary: 'Verify Custody' })
  @HttpCacheTTL(300)
  verifyCustody() { return this.svc.verifyCustody(); }

  @Get('transaction-history')
  @ApiOperation({ summary: 'Get Transaction History' })
  @HttpCacheTTL(300)
  getTransactionHistory() { return this.svc.getTransactionHistory(); }

}
