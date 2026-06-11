import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class OnboardingService extends BaseCrudService<OnboardingSession> {
  constructor(@InjectRepository(OnboardingSession) repo: Repository<OnboardingSession>) { super(repo); }

  // ── Get Wizard State ─────────────────────────────────────────
  async getWizardState(tenantId: string) {
    return success({
      tenantId,
      status: 'in_progress',
      currentStep: 2,
      totalSteps: 6,
      progressPercent: 33,
      steps: ONBOARDING_STEPS.map((s, i) => ({
        ...s,
        status: i < 2 ? 'completed' : i === 2 ? 'current' : 'pending',
        completedAt: i < 2 ? new Date(Date.now() - (6 - i) * 3600000).toISOString() : null,
      })),
      estimatedTimeRemaining: '28 minutes',
      startedAt: new Date(Date.now() - 7200000).toISOString(),
      lastActivityAt: new Date().toISOString(),
    });
  }

  // ── Step 0: Company Profile ──────────────────────────────────
  async getCompanyProfileStep() {
    return success({
      step: 0,
      key: 'company_profile',
      title: 'Company Profile',
      fields: [
        { name: 'companyName', label: 'Company Name', labelAr: 'اسم الشركة', type: 'text', required: true, placeholder: 'e.g., Blue Edge Network LLC' },
        { name: 'tradeLicenseNo', label: 'Trade License Number', labelAr: 'رقم الرخصة التجارية', type: 'text', required: true, placeholder: 'DED-2024-XXXXXX', helpText: 'Your DED or DMCC trade license number' },
        { name: 'taxRegistrationNo', label: 'Tax Registration Number (TRN)', labelAr: 'رقم التسجيل الضريبي', type: 'text', required: false, placeholder: 'TRN-100XXXXXXXXX' },
        { name: 'emirate', label: 'Emirate', labelAr: 'الإمارة', type: 'select', required: true, options: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'] },
        { name: 'address', label: 'Business Address', labelAr: 'عنوان العمل', type: 'textarea', required: true },
        { name: 'companyEmail', label: 'Company Email', labelAr: 'البريد الإلكتروني', type: 'email', required: true },
        { name: 'companyPhone', label: 'Phone', labelAr: 'الهاتف', type: 'tel', required: true, placeholder: '+971 XX XXX XXXX' },
        { name: 'logo', label: 'Company Logo', labelAr: 'شعار الشركة', type: 'file', required: false, accept: '.svg,.png,.jpg', maxSizeMb: 2 },
        { name: 'primaryColor', label: 'Brand Color', labelAr: 'لون العلامة التجارية', type: 'color', required: false, default: '#0891b2' },
        { name: 'defaultLanguage', label: 'Default Language', labelAr: 'اللغة الافتراضية', type: 'select', required: false, options: ['English', 'العربية'], default: 'English' },
        { name: 'timezone', label: 'Timezone', labelAr: 'المنطقة الزمنية', type: 'select', required: false, options: ['Asia/Dubai', 'Asia/Riyadh', 'Asia/Muscat', 'Europe/Zurich'], default: 'Asia/Dubai' },
      ],
    });
  }

  // ── Step 1: Fleet Setup ──────────────────────────────────────
  async getFleetSetupStep() {
    return success({
      step: 1,
      key: 'fleet_setup',
      title: 'Fleet Configuration',
      sections: [
        {
          title: 'Fleet Types',
          description: 'Select which fleet types you operate',
          fleetTypes: [
            { id: 'tanker', name: 'Oil & Gas Tankers', nameAr: 'ناقلات النفط والغاز', icon: '🛢️', description: 'HAZMAT cargo, custody transfers, cargo manifests', modules: ['tanker', 'coldchain', 'compliance'] },
            { id: 'bus', name: 'Bus Transit', nameAr: 'حافلات النقل', icon: '🚌', description: 'Route management, passenger counting, scheduling', modules: ['bus'] },
            { id: 'taxi', name: 'Taxi Fleet', nameAr: 'أسطول سيارات الأجرة', icon: '🚕', description: 'Surge pricing, ride matching, driver incentives', modules: ['taxi', 'surge-pricing'] },
            { id: 'logistics', name: 'Logistics & Delivery', nameAr: 'اللوجستيات والتوصيل', icon: '📦', description: 'Route optimization, proof of delivery, customer portal', modules: ['trips', 'customer-portal'] },
            { id: 'ev', name: 'Electric Vehicles', nameAr: 'المركبات الكهربائية', icon: '⚡', description: 'Battery management, charging schedules, V2G', modules: ['ev', 'v2g', 'depot-charging'] },
          ],
        },
        {
          title: 'Vehicle Import',
          description: 'Add vehicles individually or bulk import',
          importOptions: [
            { method: 'manual', name: 'Add Manually', description: 'Enter vehicles one by one' },
            { method: 'csv', name: 'CSV Upload', description: 'Upload a CSV file', templateUrl: '/api/onboarding/templates/vehicles.csv' },
            { method: 'excel', name: 'Excel Upload', description: 'Upload an Excel file', templateUrl: '/api/onboarding/templates/vehicles.xlsx' },
            { method: 'api', name: 'API Import', description: 'Connect via REST API' },
          ],
          requiredFields: ['plateNumber', 'make', 'model', 'year', 'vin', 'fleetType'],
          optionalFields: ['color', 'fuelType', 'tankCapacity', 'registrationExpiry', 'insuranceExpiry'],
          sampleData: [
            { plateNumber: 'D 12345', make: 'Volvo', model: 'FH16', year: 2024, vin: 'YV2RT40A5KB123456', fleetType: 'tanker' },
            { plateNumber: 'D 67890', make: 'MAN', model: 'Lion\'s City', year: 2023, vin: 'WMA06VZZ3NM654321', fleetType: 'bus' },
            { plateNumber: 'D 11111', make: 'Toyota', model: 'Camry', year: 2025, vin: 'JTDKN3DU5A0789012', fleetType: 'taxi' },
          ],
        },
      ],
    });
  }

  // ── Step 2: User Provisioning ────────────────────────────────
  async getUserProvisioningStep() {
    return success({
      step: 2,
      key: 'user_provisioning',
      title: 'Team Setup',
      roles: [
        { role: 'admin', name: 'Administrator', nameAr: 'مدير النظام', description: 'Full platform access, user management, billing', icon: '👑', recommended: '1-2 per organization' },
        { role: 'fleet_manager', name: 'Fleet Manager', nameAr: 'مدير الأسطول', description: 'Vehicle management, analytics, maintenance scheduling', icon: '📊', recommended: '1 per fleet type' },
        { role: 'dispatcher', name: 'Dispatcher', nameAr: 'المنسق', description: 'Trip assignment, real-time tracking, alert management', icon: '📡', recommended: '1 per shift' },
        { role: 'driver', name: 'Driver', nameAr: 'سائق', description: 'Mobile app access, trip logging, vehicle inspection', icon: '🚗', recommended: '1 per driver' },
        { role: 'viewer', name: 'Viewer', nameAr: 'مشاهد', description: 'Read-only dashboard access, reports', icon: '👁️', recommended: 'As needed' },
      ],
      inviteForm: {
        fields: [
          { name: 'email', label: 'Email Address', type: 'email', required: true },
          { name: 'firstName', label: 'First Name', labelAr: 'الاسم الأول', type: 'text', required: true },
          { name: 'lastName', label: 'Last Name', labelAr: 'اسم العائلة', type: 'text', required: true },
          { name: 'role', label: 'Role', type: 'select', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', required: false },
        ],
      },
      bulkInviteTemplate: '/api/onboarding/templates/users.csv',
      currentCount: { invited: 3, active: 2, pending: 1, limit: 100 },
    });
  }

  // ── Step 3: Driver Registration ──────────────────────────────
  async getDriverRegistrationStep() {
    return success({
      step: 3,
      key: 'driver_onboarding',
      title: 'Driver Registration',
      fields: [
        { name: 'firstName', label: 'First Name', labelAr: 'الاسم الأول', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', labelAr: 'اسم العائلة', type: 'text', required: true },
        { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+971 XX XXX XXXX' },
        { name: 'licenseNumber', label: 'License Number', labelAr: 'رقم الرخصة', type: 'text', required: true },
        { name: 'licenseType', label: 'License Type', type: 'select', required: true, options: ['Light Vehicle', 'Heavy Vehicle', 'Bus', 'HAZMAT', 'Motorcycle'] },
        { name: 'licenseExpiry', label: 'License Expiry', type: 'date', required: true },
        { name: 'emiratesIdNo', label: 'Emirates ID', labelAr: 'رقم الهوية الإماراتية', type: 'text', required: false, placeholder: '784-XXXX-XXXXXXX-X' },
        { name: 'nationality', label: 'Nationality', type: 'text', required: false },
        { name: 'assignedVehicle', label: 'Assigned Vehicle', type: 'select', required: false, helpText: 'Can be assigned later' },
      ],
      certifications: [
        { id: 'hazmat', name: 'HAZMAT Certification', nameAr: 'شهادة المواد الخطرة', required: false, validityMonths: 24 },
        { id: 'adr', name: 'ADR Certificate', required: false, validityMonths: 60 },
        { id: 'defensive_driving', name: 'Defensive Driving', nameAr: 'القيادة الدفاعية', required: false, validityMonths: 12 },
        { id: 'first_aid', name: 'First Aid', nameAr: 'الإسعافات الأولية', required: false, validityMonths: 24 },
        { id: 'fatigue_management', name: 'Fatigue Management', required: false, validityMonths: 12 },
      ],
      bulkImportTemplate: '/api/onboarding/templates/drivers.csv',
      currentCount: { registered: 12, limit: 1000 },
    });
  }

  // ── Step 4: Integrations ─────────────────────────────────────
  async getIntegrationsStep() {
    return success({
      step: 4,
      key: 'integrations',
      title: 'Integrations & Devices',
      categories: [
        {
          category: 'GPS & Telematics',
          integrations: [
            { id: 'teltonika', name: 'Teltonika FMB920/FMC130', status: 'available', setupTime: '5 min/device', protocol: 'TCP/UDP' },
            { id: 'queclink', name: 'Queclink GV300', status: 'available', setupTime: '5 min/device', protocol: 'TCP' },
            { id: 'ruptela', name: 'Ruptela FM-Eco4', status: 'available', setupTime: '5 min/device', protocol: 'TCP' },
            { id: 'custom_gps', name: 'Custom GPS Device', status: 'available', setupTime: '10-15 min', protocol: 'REST API' },
          ],
        },
        {
          category: 'Fuel Management',
          integrations: [
            { id: 'enoc_cards', name: 'ENOC Fuel Cards', status: 'available', setupTime: '1 hour', description: 'Automatic fuel transaction sync' },
            { id: 'adnoc', name: 'ADNOC Fuel Cards', status: 'coming_soon', setupTime: 'N/A' },
            { id: 'emarat', name: 'Emarat Fuel Cards', status: 'coming_soon', setupTime: 'N/A' },
          ],
        },
        {
          category: 'ERP & Business',
          integrations: [
            { id: 'sap', name: 'SAP S/4HANA', status: 'available', setupTime: '2-4 hours', description: 'Fleet cost center sync' },
            { id: 'oracle', name: 'Oracle NetSuite', status: 'available', setupTime: '2-4 hours' },
            { id: 'quickbooks', name: 'QuickBooks', status: 'available', setupTime: '30 min' },
          ],
        },
        {
          category: 'Communication',
          integrations: [
            { id: 'whatsapp', name: 'WhatsApp Business', status: 'available', setupTime: '15 min', description: 'Driver notifications via WhatsApp' },
            { id: 'sms', name: 'SMS Gateway (Twilio)', status: 'available', setupTime: '10 min' },
            { id: 'email', name: 'Email (SendGrid)', status: 'configured', setupTime: 'Pre-configured' },
          ],
        },
      ],
    });
  }

  // ── Step 5: Go Live Checklist ────────────────────────────────
  async getGoLiveStep(tenantId: string) {
    return success({
      step: 5,
      key: 'go_live',
      title: 'Go Live Checklist',
      checklist: [
        { id: 'company_profile', label: 'Company profile completed', labelAr: 'تم إكمال الملف التعريفي', status: 'completed', required: true },
        { id: 'vehicles_added', label: 'At least 1 vehicle added', status: 'completed', required: true, count: 15 },
        { id: 'users_invited', label: 'Team members invited', status: 'completed', required: true, count: 4 },
        { id: 'drivers_registered', label: 'Drivers registered', status: 'completed', required: true, count: 12 },
        { id: 'gps_connected', label: 'GPS devices connected', status: 'warning', required: false, count: 8, message: '8 of 15 vehicles connected — 7 pending' },
        { id: 'alerts_configured', label: 'Alert rules configured', status: 'pending', required: true },
        { id: 'geofences_set', label: 'Geofences defined', status: 'pending', required: false },
        { id: 'test_trip', label: 'Test trip completed', status: 'pending', required: true },
        { id: 'billing_setup', label: 'Billing information verified', status: 'completed', required: true },
        { id: 'support_contact', label: 'Support contact assigned', status: 'completed', required: false },
      ],
      readiness: {
        score: 72,
        requiredComplete: 6,
        requiredTotal: 8,
        optionalComplete: 2,
        optionalTotal: 4,
        canGoLive: false,
        blockers: ['Alert rules not configured', 'Test trip not completed'],
      },
      supportResources: [
        { type: 'video', title: 'Platform Overview Tour', url: '/guides/platform-tour', durationMin: 8 },
        { type: 'doc', title: 'Quick Start Guide', url: '/docs/quick-start', pages: 12 },
        { type: 'video', title: 'Setting Up Alerts & Geofences', url: '/guides/alerts-setup', durationMin: 5 },
        { type: 'contact', title: 'Schedule Onboarding Call', description: 'Book 30-min call with our fleet specialist', bookingUrl: '/support/book-call' },
      ],
    });
  }

  // ── Submit Step Data ─────────────────────────────────────────
  async submitStep(tenantId: string, step: number, data: any) {
    if (step < 0 || step > 5) throw new BadRequestException('Invalid step number (0-5)');

    const stepConfig = ONBOARDING_STEPS[step];
    const progressPercent = Math.round(((step + 1) / 6) * 100);

    return success({
      tenantId,
      step,
      stepKey: stepConfig.key,
      status: 'completed',
      nextStep: step < 5 ? step + 1 : null,
      progressPercent,
      message: step === 5
        ? '🎉 Onboarding complete! Your fleet management platform is now live.'
        : `Step "${stepConfig.title}" completed. Moving to: ${ONBOARDING_STEPS[step + 1]?.title}`,
      dataReceived: Object.keys(data).length,
      savedAt: new Date().toISOString(),
    });
  }

  // ── Complete Onboarding ──────────────────────────────────────
  async completeOnboarding(tenantId: string) {
    return success({
      tenantId,
      status: 'completed',
      completedAt: new Date().toISOString(),
      message: '🎉 مبروك! Congratulations! Your fleet management platform is now live.',
      nextSteps: [
        { action: 'Explore the dashboard', url: '/overview', priority: 'high' },
        { action: 'Set up your first geofence', url: '/operations', priority: 'medium' },
        { action: 'Configure alert rules', url: '/alerts', priority: 'high' },
        { action: 'Review analytics', url: '/analytics', priority: 'low' },
        { action: 'Invite remaining team members', url: '/users', priority: 'medium' },
      ],
      stats: {
        vehiclesAdded: 15,
        driversRegistered: 12,
        usersInvited: 4,
        setupTimeMinutes: 38,
      },
    });
  }

  // ── Import Templates ─────────────────────────────────────────
  async getImportTemplate(type: string) {
    const templates = {
      vehicles: {
        filename: 'vehicle_import_template.csv',
        columns: ['plateNumber', 'make', 'model', 'year', 'vin', 'fleetType', 'color', 'fuelType', 'tankCapacityLiters', 'registrationExpiry', 'insuranceExpiry'],
        sampleRows: [
          ['D 12345', 'Volvo', 'FH16', '2024', 'YV2RT40A5KB123456', 'tanker', 'White', 'Diesel', '400', '2027-06-15', '2026-12-31'],
          ['D 67890', 'MAN', "Lion's City", '2023', 'WMA06VZZ3NM654321', 'bus', 'Blue', 'Diesel', '300', '2027-03-20', '2026-09-30'],
        ],
      },
      drivers: {
        filename: 'driver_import_template.csv',
        columns: ['firstName', 'lastName', 'employeeId', 'phone', 'email', 'licenseNumber', 'licenseType', 'licenseExpiry', 'emiratesId', 'nationality'],
        sampleRows: [
          ['Mohammed', 'Al Mansoori', 'EMP-001', '+971501234567', 'mohammed@company.ae', 'DXB-DL-123456', 'Heavy Vehicle', '2027-08-15', '784-1990-1234567-1', 'UAE'],
          ['Rajan', 'Krishnamurthy', 'EMP-002', '+971509876543', 'rajan@company.ae', 'DXB-DL-789012', 'HAZMAT', '2026-12-01', '784-1985-7654321-2', 'India'],
        ],
      },
      users: {
        filename: 'user_invite_template.csv',
        columns: ['email', 'firstName', 'lastName', 'role', 'phone'],
        sampleRows: [
          ['fatima@company.ae', 'Fatima', 'Hassan', 'fleet_manager', '+971502345678'],
          ['omar@company.ae', 'Omar', 'Khalil', 'dispatcher', '+971503456789'],
        ],
      },
    };

    const tmpl = templates[type];
    if (!tmpl) throw new BadRequestException(`Unknown template type: ${type}. Available: vehicles, drivers, users`);
    return success(tmpl);
  }

  // ── Bulk Import ──────────────────────────────────────────────
  async processBulkImport(tenantId: string, type: string, data: any[]) {
    return success({
      tenantId,
      type,
      totalRows: data.length,
      imported: data.length - 1,
      skipped: 1,
      errors: [
        { row: 5, field: 'licenseExpiry', message: 'Invalid date format. Expected YYYY-MM-DD.' },
      ],
      importedAt: new Date().toISOString(),
    });
  }
}

// ─── Controller ──────────────────────────────────────────────────
