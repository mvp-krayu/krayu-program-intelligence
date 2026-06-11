import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { TenantTheme } from './entities/tenant-theme.entity';

@Injectable()
export class WhiteLabelService extends BaseCrudService<TenantTheme> {
  constructor(@InjectRepository(TenantTheme) repo: Repository<TenantTheme>) { super(repo); }
  async getTenantTheme(tenantId: string) {
    const themes = {
      'blue-edge': { tenantName: 'Blue Edge Network', logoUrl: '/assets/blue-edge-logo.svg', primaryColor: '#0891b2', secondaryColor: '#06b6d4', backgroundColor: '#0f172a', accentColor: '#14b8a6', fontFamily: 'DM Sans', brandGradient: 'linear-gradient(135deg, #0891b2, #06b6d4)', darkMode: true },
      'enoc': { tenantName: 'ENOC Fleet Services', logoUrl: '/assets/enoc-logo.svg', primaryColor: '#16a34a', secondaryColor: '#22c55e', backgroundColor: '#0f172a', accentColor: '#4ade80', fontFamily: 'Inter', brandGradient: 'linear-gradient(135deg, #16a34a, #22c55e)', darkMode: true },
      'rta': { tenantName: 'RTA Dubai Transport', logoUrl: '/assets/rta-logo.svg', primaryColor: '#dc2626', secondaryColor: '#ef4444', backgroundColor: '#0f172a', accentColor: '#f87171', fontFamily: 'Noto Sans Arabic', brandGradient: 'linear-gradient(135deg, #dc2626, #ef4444)', darkMode: true },
    };
    return success(themes[tenantId] || themes['blue-edge']);
  }
  async listTenants() {
    return success([
      { id: 'blue-edge', name: 'Blue Edge Network LLC', region: 'Dubai/Switzerland/Global', vehicles: 156, status: 'active' },
      { id: 'enoc', name: 'ENOC Fleet Services', region: 'UAE', vehicles: 85, status: 'active' },
      { id: 'rta', name: 'RTA Dubai Transport', region: 'Dubai', vehicles: 320, status: 'active' },
    ]);
  }
  async getCustomizationOptions() {
    return success({ colors: ['primaryColor', 'secondaryColor', 'backgroundColor', 'accentColor'], fonts: ['DM Sans', 'Inter', 'Noto Sans Arabic', 'Poppins', 'Roboto'], features: ['darkMode', 'rtlSupport', 'arabicLocale', 'customDashboard', 'brandedReports', 'customEmailTemplates'], logoFormats: ['SVG', 'PNG'], maxLogoSizeMb: 2 });
  }
}
