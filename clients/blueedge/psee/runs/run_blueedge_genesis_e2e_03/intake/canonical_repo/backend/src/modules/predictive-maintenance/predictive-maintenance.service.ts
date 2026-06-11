import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class PredictiveMaintenanceService extends BaseCrudService<MaintenancePrediction> {
  constructor(
    @InjectRepository(MaintenancePrediction) repo: Repository<MaintenancePrediction>,
    @InjectRepository(MlModel) private modelRepo: Repository<MlModel>,
    @InjectRepository(TelemetryFeature) private featureRepo: Repository<TelemetryFeature>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      activePredictions: 23,
      criticalAlerts: 3,
      scheduledMaintenanceFromAI: 8,
      costSavingsThisMonthAed: 47250,
      costSavingsYtdAed: 412800,
      preventedBreakdowns: 14,
      averageLeadTimeDays: 12.4,
      predictionAccuracy: 94.7,
      modelPerformance: {
        engineModel: { accuracy: 96.2, predictions: 48, alerts: 5 },
        brakeModel: { accuracy: 93.8, predictions: 62, alerts: 8 },
        transmissionModel: { accuracy: 91.5, predictions: 35, alerts: 2 },
        tireModel: { accuracy: 97.1, predictions: 89, alerts: 7 },
        batteryModel: { accuracy: 94.3, predictions: 41, alerts: 3 },
        hvacModel: { accuracy: 89.7, predictions: 27, alerts: 1 },
      },
      fleetHealthIndex: 87.3, // 0-100 composite score
      riskDistribution: { critical: 3, high: 7, medium: 13, low: 42 },
      topFailureModes: [
        { component: 'Brake pads', count: 12, avgLeadDays: 8.2 },
        { component: 'Tire tread', count: 9, avgLeadDays: 14.5 },
        { component: 'Engine oil degradation', count: 7, avgLeadDays: 6.1 },
        { component: 'Battery cell imbalance', count: 5, avgLeadDays: 18.3 },
        { component: 'Coolant leak', count: 4, avgLeadDays: 4.7 },
      ],
      monthlyTrend: [
        { month: 'Sep', predictions: 18, prevented: 3, missed: 0 },
        { month: 'Oct', predictions: 21, prevented: 4, missed: 1 },
        { month: 'Nov', predictions: 25, prevented: 5, missed: 0 },
        { month: 'Dec', predictions: 19, prevented: 2, missed: 0 },
        { month: 'Jan', predictions: 27, prevented: 6, missed: 0 },
        { month: 'Feb', predictions: 23, prevented: 3, missed: 0 },
      ],
    });
  }

  async getActivePredictions(fleetType?: string) {
    const predictions = [
      {
        id: 'pred-001', vehicleId: 'V001', plateNumber: 'DXB-7291', fleetType: 'tanker',
        componentType: 'brakes', failureProbability: 87.3, riskLevel: 'critical',
        predictedFailureDate: new Date(Date.now() + 5 * 86400000),
        remainingUsefulLifeKm: 1200, remainingUsefulLifeHours: 48,
        recommendation: 'Schedule immediate brake pad replacement — rear axle showing accelerated wear pattern consistent with heavy HAZMAT loads on Sheikh Zayed Rd corridor',
        estimatedRepairCostAed: 2800, confidenceScore: 94.1,
        contributingFactors: ['High load frequency (12 loads/week)', 'Stop-and-go pattern on E11', 'Ambient temp >45°C accelerating wear'],
        modelVersion: 'brake_xgboost_v3.2', status: 'active',
      },
      {
        id: 'pred-002', vehicleId: 'V008', plateNumber: 'DXB-4490', fleetType: 'tanker',
        componentType: 'engine', failureProbability: 72.1, riskLevel: 'high',
        predictedFailureDate: new Date(Date.now() + 12 * 86400000),
        remainingUsefulLifeKm: 3500, remainingUsefulLifeHours: 180,
        recommendation: 'Engine oil analysis shows elevated iron particles — schedule oil change and inspect camshaft bearings within 10 days',
        estimatedRepairCostAed: 5400, confidenceScore: 91.8,
        contributingFactors: ['Oil degradation rate 2.3x normal', 'Iron particle count: 45ppm (threshold: 30ppm)', 'Engine hours: 8,200 since last overhaul'],
        modelVersion: 'engine_lstm_v2.7', status: 'active',
      },
      {
        id: 'pred-003', vehicleId: 'V022', plateNumber: 'BUS-1103', fleetType: 'bus',
        componentType: 'hvac', failureProbability: 65.8, riskLevel: 'medium',
        predictedFailureDate: new Date(Date.now() + 21 * 86400000),
        remainingUsefulLifeKm: 8200, remainingUsefulLifeHours: 350,
        recommendation: 'HVAC compressor showing intermittent high-current draw — schedule inspection before summer peak demand. Passenger comfort at risk during 45°C+ days',
        estimatedRepairCostAed: 3200, confidenceScore: 88.5,
        contributingFactors: ['Compressor current draw: 15A peak (normal: 12A)', 'Refrigerant pressure trending low', 'Dubai summer approaching'],
        modelVersion: 'hvac_rf_v1.4', status: 'acknowledged',
      },
      {
        id: 'pred-004', vehicleId: 'V045', plateNumber: 'TAXI-2201', fleetType: 'taxi',
        componentType: 'tires', failureProbability: 58.4, riskLevel: 'medium',
        predictedFailureDate: new Date(Date.now() + 18 * 86400000),
        remainingUsefulLifeKm: 5600, remainingUsefulLifeHours: 220,
        recommendation: 'Front-left tire tread depth approaching minimum — schedule rotation and replacement within 2 weeks. High daily mileage accelerating wear.',
        estimatedRepairCostAed: 1600, confidenceScore: 97.2,
        contributingFactors: ['Tread depth: 2.8mm (min: 1.6mm)', 'Daily mileage: 320km', 'Urban driving pattern'],
        modelVersion: 'tire_gradient_v4.1', status: 'active',
      },
      {
        id: 'pred-005', vehicleId: 'V012', plateNumber: 'DXB-8834', fleetType: 'tanker',
        componentType: 'battery', failureProbability: 45.2, riskLevel: 'low',
        predictedFailureDate: new Date(Date.now() + 35 * 86400000),
        remainingUsefulLifeKm: 12000, remainingUsefulLifeHours: 600,
        recommendation: 'Battery state-of-health declining — monitor voltage differential between cells. Schedule replacement during next planned maintenance window.',
        estimatedRepairCostAed: 8500, confidenceScore: 92.6,
        contributingFactors: ['SOH: 72% (replace at 65%)', 'Cell voltage imbalance: 0.15V', 'Age: 3.2 years'],
        modelVersion: 'battery_nn_v2.0', status: 'active',
      },
    ];
    const filtered = fleetType && fleetType !== 'all' ? predictions.filter(p => p.fleetType === fleetType) : predictions;
    return success(filtered);
  }

  async getVehicleHealth(vehicleId: string) {
    return success({
      vehicleId, plateNumber: 'DXB-7291', fleetType: 'tanker',
      overallHealthScore: 74.5, // 0-100
      lastUpdated: new Date(),
      componentHealth: {
        engine: { score: 82, trend: 'declining', nextService: new Date(Date.now() + 12 * 86400000), activePredictions: 1 },
        brakes: { score: 45, trend: 'declining', nextService: new Date(Date.now() + 5 * 86400000), activePredictions: 1 },
        transmission: { score: 91, trend: 'stable', nextService: new Date(Date.now() + 60 * 86400000), activePredictions: 0 },
        tires: { score: 78, trend: 'declining', nextService: new Date(Date.now() + 25 * 86400000), activePredictions: 0 },
        battery: { score: 72, trend: 'declining', nextService: new Date(Date.now() + 35 * 86400000), activePredictions: 1 },
        hvac: { score: 88, trend: 'stable', nextService: new Date(Date.now() + 45 * 86400000), activePredictions: 0 },
        suspension: { score: 95, trend: 'stable', nextService: new Date(Date.now() + 90 * 86400000), activePredictions: 0 },
        electrical: { score: 85, trend: 'stable', nextService: null, activePredictions: 0 },
      },
      telemetrySnapshot: {
        engineTemp: 92.3, oilPressure: 3.2, coolantTemp: 88.1, batteryVoltage: 12.8,
        fuelEfficiency: 14.2, odometer: 142500, engineHours: 8200, vibrationLevel: 0.42,
      },
      maintenanceHistory: [
        { date: new Date(Date.now() - 30 * 86400000), type: 'Oil Change', cost: 450, wasAIPredicted: true },
        { date: new Date(Date.now() - 60 * 86400000), type: 'Tire Rotation', cost: 200, wasAIPredicted: false },
        { date: new Date(Date.now() - 90 * 86400000), type: 'Brake Inspection', cost: 300, wasAIPredicted: true },
      ],
      degradationCurve: [
        { daysAgo: 90, healthScore: 89.2 }, { daysAgo: 60, healthScore: 84.7 },
        { daysAgo: 30, healthScore: 79.1 }, { daysAgo: 0, healthScore: 74.5 },
      ],
    });
  }

  async runPrediction(vehicleId: string, body: any) {
    return success({
      vehicleId, requestedAt: new Date(), completedAt: new Date(),
      results: [
        { component: 'engine', failureProbability: 12.4, riskLevel: 'low', rul: 4500, confidence: 93.2 },
        { component: 'brakes', failureProbability: 87.3, riskLevel: 'critical', rul: 1200, confidence: 94.1 },
        { component: 'transmission', failureProbability: 5.1, riskLevel: 'low', rul: 15000, confidence: 91.5 },
        { component: 'tires', failureProbability: 32.7, riskLevel: 'medium', rul: 5600, confidence: 97.2 },
        { component: 'battery', failureProbability: 45.2, riskLevel: 'medium', rul: 12000, confidence: 92.6 },
      ],
      overallHealthScore: 74.5,
      recommendedActions: [
        { priority: 1, action: 'Schedule brake replacement', dueIn: '5 days', cost: 2800 },
        { priority: 2, action: 'Monitor battery SOH', dueIn: '35 days', cost: 8500 },
      ],
    });
  }

  async getModels() {
    return success([
      { id: 'ml-001', name: 'Engine Failure Predictor', version: 'v2.7', type: 'LSTM Neural Network', componentType: 'engine', accuracy: 96.2, precision: 94.8, recall: 92.1, f1Score: 93.4, trainingSamples: 145000, features: 24, lastTrained: new Date(Date.now() - 7 * 86400000), status: 'production' },
      { id: 'ml-002', name: 'Brake Wear Estimator', version: 'v3.2', type: 'XGBoost', componentType: 'brakes', accuracy: 93.8, precision: 91.2, recall: 95.4, f1Score: 93.3, trainingSamples: 89000, features: 18, lastTrained: new Date(Date.now() - 3 * 86400000), status: 'production' },
      { id: 'ml-003', name: 'Tire Degradation Model', version: 'v4.1', type: 'Gradient Boosting', componentType: 'tires', accuracy: 97.1, precision: 96.5, recall: 94.8, f1Score: 95.6, trainingSamples: 210000, features: 14, lastTrained: new Date(Date.now() - 1 * 86400000), status: 'production' },
      { id: 'ml-004', name: 'Battery SOH Estimator', version: 'v2.0', type: 'Neural Network', componentType: 'battery', accuracy: 94.3, precision: 93.7, recall: 91.2, f1Score: 92.4, trainingSamples: 67000, features: 20, lastTrained: new Date(Date.now() - 14 * 86400000), status: 'production' },
      { id: 'ml-005', name: 'HVAC Failure Detector', version: 'v1.4', type: 'Random Forest', componentType: 'hvac', accuracy: 89.7, precision: 87.3, recall: 88.9, f1Score: 88.1, trainingSamples: 34000, features: 12, lastTrained: new Date(Date.now() - 21 * 86400000), status: 'production' },
      { id: 'ml-006', name: 'Transmission Anomaly', version: 'v1.8', type: 'Isolation Forest', componentType: 'transmission', accuracy: 91.5, precision: 90.1, recall: 89.4, f1Score: 89.7, trainingSamples: 52000, features: 16, lastTrained: new Date(Date.now() - 10 * 86400000), status: 'production' },
    ]);
  }

  async retrainModel(modelId: string) {
    return success({
      modelId, status: 'training_started', estimatedCompletionMin: 45,
      trainingConfig: { epochs: 100, batchSize: 256, learningRate: 0.001, validationSplit: 0.2 },
      message: 'Model retraining initiated — will auto-deploy if accuracy exceeds current version',
    });
  }

  async getMaintenanceSchedule() {
    return success({
      upcoming: [
        { vehicleId: 'V001', plateNumber: 'DXB-7291', component: 'Brakes', dueDate: new Date(Date.now() + 5 * 86400000), priority: 'critical', source: 'AI Prediction', estimatedDuration: '2h', costAed: 2800 },
        { vehicleId: 'V008', plateNumber: 'DXB-4490', component: 'Engine Oil', dueDate: new Date(Date.now() + 10 * 86400000), priority: 'high', source: 'AI Prediction', estimatedDuration: '1h', costAed: 450 },
        { vehicleId: 'V022', plateNumber: 'BUS-1103', component: 'HVAC', dueDate: new Date(Date.now() + 21 * 86400000), priority: 'medium', source: 'AI Prediction', estimatedDuration: '3h', costAed: 3200 },
        { vehicleId: 'V045', plateNumber: 'TAXI-2201', component: 'Tires', dueDate: new Date(Date.now() + 18 * 86400000), priority: 'medium', source: 'AI Prediction', estimatedDuration: '1.5h', costAed: 1600 },
        { vehicleId: 'V003', plateNumber: 'DXB-8856', component: 'Filters', dueDate: new Date(Date.now() + 30 * 86400000), priority: 'low', source: 'Scheduled', estimatedDuration: '45min', costAed: 350 },
      ],
      optimizationSuggestions: [
        'Batch brake work for V001, V006, V009 on same day — save 15% workshop time',
        'Defer V022 HVAC to align with scheduled service — save AED 400 labor',
        'V045 tire rotation can combine with V048 — shared workshop slot available Thursday',
      ],
      workshopCapacity: { today: { available: 3, booked: 5, total: 8 }, thisWeek: { available: 12, booked: 28, total: 40 } },
    });
  }

  // ── Weibull RUL Distribution ─────────────────────────────────
  async getWeibullRUL(vehicleId: string, component: string) {
    // Simulates Weibull distribution parameters from historical failure data
    const beta = 2.4; // shape parameter (wear-out failure mode)
    const eta = 720;  // scale parameter (characteristic life in hours)
    const currentAge = 480; // current operating hours
    const distribution: { hours: number; probability: number; cumulative: number }[] = [];
    for (let h = currentAge; h <= currentAge + 500; h += 20) {
      const t = h / eta;
      const reliability = Math.exp(-Math.pow(t, beta));
      const failureProb = 1 - reliability;
      const pdf = (beta / eta) * Math.pow(t, beta - 1) * reliability;
      distribution.push({ hours: h, probability: Math.round(pdf * 10000) / 100, cumulative: Math.round(failureProb * 10000) / 100 });
    }
    const medianRUL = eta * Math.pow(Math.log(2), 1 / beta) - currentAge;
    const p10RUL = eta * Math.pow(Math.log(1 / 0.9), 1 / beta) - currentAge;
    const p90RUL = eta * Math.pow(Math.log(1 / 0.1), 1 / beta) - currentAge;
    return success({
      vehicleId, component, modelType: 'weibull', beta, eta,
      currentAgeHours: currentAge,
      medianRemainingLifeHours: Math.round(medianRUL),
      confidenceInterval: { lower10pct: Math.round(p10RUL), upper90pct: Math.round(p90RUL) },
      failureProbability: {
        next24h: Math.round((1 - Math.exp(-Math.pow((currentAge + 24) / eta, beta))) * 10000) / 100,
        next7d: Math.round((1 - Math.exp(-Math.pow((currentAge + 168) / eta, beta))) * 10000) / 100,
        next30d: Math.round((1 - Math.exp(-Math.pow((currentAge + 720) / eta, beta))) * 10000) / 100,
      },
      distribution,
      recommendation: medianRUL < 168
        ? 'URGENT: Schedule replacement within 7 days — failure probability exceeds safe threshold'
        : medianRUL < 720
          ? 'Plan replacement at next scheduled maintenance window'
          : 'Component healthy — continue standard monitoring',
    });
  }

  // ── Fleet Health Trend (90 days) ─────────────────────────────
  async getFleetHealthTrend() {
    const trend: { date: string; healthIndex: number; predictions: number; resolved: number; breakdowns: number }[] = [];
    let health = 84.2;
    for (let d = 90; d >= 0; d--) {
      const date = new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
      health += (Math.random() - 0.45) * 0.8;
      health = Math.max(75, Math.min(95, health));
      trend.push({
        date,
        healthIndex: Math.round(health * 10) / 10,
        predictions: Math.floor(Math.random() * 4) + 1,
        resolved: Math.floor(Math.random() * 3),
        breakdowns: Math.random() > 0.92 ? 1 : 0,
      });
    }
    return success({
      trend,
      currentIndex: trend[trend.length - 1].healthIndex,
      monthOverMonthChange: +2.3,
      fleetSize: 62,
      vehiclesAtRisk: 7,
      nextScheduledPredictionRun: new Date(Date.now() + 3600000).toISOString(),
    });
  }

  // ── Kaplan-Meier Survival Curve ──────────────────────────────
  async getSurvivalCurve(component: string) {
    const curves: Record<string, { hours: number; survival: number }[]> = {};
    ['tanker', 'bus', 'taxi'].forEach(fleetType => {
      const data: { hours: number; survival: number }[] = [];
      let s = 1.0;
      const failRate = fleetType === 'tanker' ? 0.0015 : fleetType === 'bus' ? 0.0012 : 0.001;
      for (let h = 0; h <= 10000; h += 200) {
        s *= (1 - failRate * (1 + h / 8000)); // increasing hazard
        data.push({ hours: h, survival: Math.round(Math.max(0, s) * 10000) / 100 });
      }
      curves[fleetType] = data;
    });
    return success({
      component,
      curves,
      medianLifeByFleet: {
        tanker: 4200, bus: 5100, taxi: 5800,
      },
      insights: [
        `Tanker ${component} fails 28% sooner than taxi fleet — higher thermal/vibration stress`,
        `Fleet-wide median life: ${component === 'brakes' ? '4,800h' : component === 'engine' ? '8,200h' : '6,100h'}`,
        'Summer months (Jun-Sep) reduce component life by ~15% due to heat stress',
      ],
    });
  }

  // ── Cost Optimization: Predictive vs Reactive vs Scheduled ───
  async getCostOptimization() {
    return success({
      strategies: [
        {
          name: 'Reactive (Break-Fix)',
          annualCostAed: 892000,
          downtimeHours: 1420,
          breakdowns: 47,
          customerImpact: 'High — 23% late deliveries',
          risks: ['Catastrophic failures', 'Tow costs', 'Cargo loss risk'],
        },
        {
          name: 'Scheduled (Time-Based)',
          annualCostAed: 648000,
          downtimeHours: 980,
          breakdowns: 18,
          customerImpact: 'Medium — 8% late deliveries',
          risks: ['Over-maintenance waste', 'Unnecessary part replacement', 'Still misses some failures'],
        },
        {
          name: 'Predictive (AI-Driven)',
          annualCostAed: 412000,
          downtimeHours: 312,
          breakdowns: 4,
          customerImpact: 'Low — 2% late deliveries',
          risks: ['Model accuracy dependency', 'Sensor data quality', 'Initial setup investment'],
        },
      ],
      savingsVsReactive: { annualAed: 480000, pctReduction: 53.8, downtimeReduction: '78%', breakdownReduction: '91%' },
      savingsVsScheduled: { annualAed: 236000, pctReduction: 36.4, downtimeReduction: '68%', breakdownReduction: '78%' },
      roiTimeline: [
        { month: 1, investment: 85000, savings: 12000, cumulative: -73000 },
        { month: 3, investment: 95000, savings: 48000, cumulative: -47000 },
        { month: 6, investment: 105000, savings: 112000, cumulative: 7000 },
        { month: 12, investment: 120000, savings: 245000, cumulative: 125000 },
        { month: 24, investment: 145000, savings: 520000, cumulative: 375000 },
      ],
      breakEvenMonth: 5.2,
    });
  }

  // ── Batch Predict ────────────────────────────────────────────
  async batchPredict(body: any) {
    const vehicleCount = body?.vehicleIds?.length || 62;
    return success({
      jobId: `batch-${Date.now()}`,
      status: 'queued',
      vehicleCount,
      estimatedDurationSeconds: vehicleCount * 2.4,
      componentsPerVehicle: 7,
      totalInferences: vehicleCount * 7,
      message: `Batch prediction queued for ${vehicleCount} vehicles (${vehicleCount * 7} component inferences)`,
    });
  }
}

// ─── Controller ───────────────────────────────────────────────
