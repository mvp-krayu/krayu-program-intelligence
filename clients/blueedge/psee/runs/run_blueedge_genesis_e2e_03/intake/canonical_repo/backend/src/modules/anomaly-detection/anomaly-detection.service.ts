import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { Anomaly } from './entities/anomaly.entity';

@Injectable()
export class AnomalyDetectionService extends BaseCrudService<Anomaly> {
  constructor(@InjectRepository(Anomaly) repo: Repository<Anomaly>) { super(repo); }
  async getDashboard() {
    return success({
      activeAnomalies: 7, resolvedToday: 12, avgDetectionTimeMin: 2.8, falsePositiveRate: 4.2,
      byType: { fuelAnomaly: 3, routeDeviation: 2, telemetrySpike: 1, behaviorChange: 1 },
      bySeverity: { critical: 1, high: 2, medium: 3, low: 1 },
      modelAccuracy: { fuelModel: 94.2, routeModel: 91.8, behaviorModel: 88.5, telemetryModel: 96.1 },
    });
  }
  async getActiveAnomalies() {
    return success([
      { id: 'a1', vehicleId: 'V001', type: 'fuel_anomaly', severity: 'critical', confidence: 96.5, description: 'DXB-7291: Fuel consumption 45% above route baseline — possible leak or theft', detectedAt: new Date(Date.now() - 300000), dataPoints: { expected: 12.5, actual: 18.2, unit: 'L/100km' }, status: 'investigating' },
      { id: 'a2', vehicleId: 'V003', type: 'route_deviation', severity: 'high', confidence: 92.1, description: 'DXB-8834: 3.2km deviation from approved HAZMAT route on Al Khail Rd', detectedAt: new Date(Date.now() - 600000), dataPoints: { deviationKm: 3.2, approvedRoute: 'DIC → DAFZA via E44' }, status: 'open' },
      { id: 'a3', vehicleId: 'V011', type: 'behavior_change', severity: 'medium', confidence: 87.3, description: 'DXB-7744: Unusual stop patterns — 4 unscheduled stops in 2 hours (baseline: 0-1)', detectedAt: new Date(Date.now() - 1200000), dataPoints: { stops: 4, baseline: 0.5, locationCluster: 'Al Barsha' }, status: 'open' },
      { id: 'a4', vehicleId: 'V017', type: 'telemetry_spike', severity: 'high', confidence: 94.8, description: 'DXB-4490: LNG tank pressure rising abnormally — 3.2bar → 3.8bar in 10min', detectedAt: new Date(Date.now() - 900000), dataPoints: { startPressure: 3.2, currentPressure: 3.8, threshold: 4.0, unit: 'bar' }, status: 'investigating' },
    ]);
  }
  async getPatterns() {
    return success([
      { pattern: 'Friday Evening Fuel Surge', type: 'recurring', frequency: 'weekly', affectedVehicles: 12, description: 'Tanker fleet shows 20% higher fuel use Friday evenings — correlates with weekend delivery rush' },
      { pattern: 'Morning Cold Start Anomaly', type: 'seasonal', frequency: 'daily', affectedVehicles: 8, description: 'Winter mornings show telemetry spikes in first 15 minutes — normal for ambient temp < 15°C' },
    ]);
  }

  async getFleetCorrelations() {
    return success({
      correlations: [
        { id: 'corr-001', type: 'spatial_cluster', confidence: 91.2, description: 'Fuel anomalies clustered near ENOC Jebel Ali depot — 4 vehicles affected in 48h window', vehicles: ['DXB-7291', 'DXB-4490', 'DXB-8834', 'DXB-5512'], location: { lat: 25.0194, lng: 55.1068, name: 'ENOC Jebel Ali' }, hypothesis: 'Possible fuel quality issue at this station or calibration error on dispenser #3', recommendedAction: 'Cross-reference with ENOC fuel delivery logs; inspect fuel samples' },
        { id: 'corr-002', type: 'temporal_pattern', confidence: 87.5, description: 'Route deviation spikes every Thursday afternoon on E44 corridor', vehicles: ['DXB-7291', 'DXB-5512', 'DXB-9923'], timeWindow: 'Thursday 14:00-17:00', hypothesis: 'Recurring road closure or construction zone forcing diversions', recommendedAction: 'Update route optimization with Thursday constraint; verify with RTA road closure data' },
        { id: 'corr-003', type: 'component_cascade', confidence: 94.7, description: 'Brake + tire anomalies correlating across 6 tankers — shared route SZR segment', vehicles: ['DXB-7291', 'DXB-4490', 'DXB-8834', 'DXB-5512', 'DXB-9923', 'DXB-6617'], hypothesis: 'Road surface deterioration causing accelerated wear on shared route segment', recommendedAction: 'Report road condition to RTA; adjust predictive maintenance thresholds for affected vehicles' },
      ],
      totalCorrelationsDetected: 3,
      analysisWindow: '7 days',
      modelVersion: 'fleet_correlation_v1.4',
    });
  }

  async getRootCauseAnalysis(anomalyId: string) {
    return success({
      anomalyId,
      rootCauseTree: [
        { rank: 1, cause: 'Fuel injector malfunction (#3 cylinder)', probability: 67.3, evidence: ['Elevated exhaust temp pattern', 'Fuel rail pressure oscillation', 'OBD-II code P0087 intermittent'], suggestedAction: 'Inspect injector #3 — replace if spray pattern abnormal', estimatedCostAed: 1800 },
        { rank: 2, cause: 'Fuel quality degradation', probability: 21.5, evidence: ['Correlated with last refuel at ENOC Station #47', '3 other vehicles from same station show anomalies'], suggestedAction: 'Send fuel sample for lab analysis; switch to alternate station', estimatedCostAed: 200 },
        { rank: 3, cause: 'Sensor calibration drift (fuel flow meter)', probability: 8.1, evidence: ['Last calibration: 142 days ago (target: 90 days)'], suggestedAction: 'Recalibrate fuel flow sensor', estimatedCostAed: 350 },
      ],
      confidenceScore: 89.4,
      modelUsed: 'causal_bayesian_network_v2.1',
      dataPointsAnalyzed: 14200,
      analysisTimeMs: 2340,
    });
  }

  async getDetectionConfig() {
    return success({
      models: {
        fuel_anomaly: { algorithm: 'Isolation Forest + LSTM', sensitivity: 0.85, windowMinutes: 30, features: ['fuel_rate', 'speed', 'load', 'grade', 'ambient_temp'], thresholds: { zScore: 3.0, percentileRank: 99 }, retrainFrequency: 'weekly' },
        route_deviation: { algorithm: 'DBSCAN on GPS trajectories', sensitivity: 0.90, windowMinutes: 5, features: ['latitude', 'longitude', 'heading', 'speed'], thresholds: { maxDeviationKm: 0.5, minConfidence: 80 }, retrainFrequency: 'daily' },
        telemetry_spike: { algorithm: 'Rolling Z-Score + Prophet', sensitivity: 0.92, windowMinutes: 10, features: ['engine_temp', 'oil_pressure', 'coolant_level', 'vibration', 'tank_pressure'], thresholds: { zScore: 2.5, rateOfChange: '2x baseline' }, retrainFrequency: 'daily' },
        behavior_change: { algorithm: 'Autoencoder (reconstruction error)', sensitivity: 0.80, windowMinutes: 60, features: ['stop_frequency', 'speed_variance', 'acceleration_profile', 'route_adherence'], thresholds: { reconstructionError: 0.15 }, retrainFrequency: 'weekly' },
      },
      globalSettings: { cooldownMinutes: 5, maxAlertsPerVehiclePerDay: 10, falsePositiveThreshold: 5, autoResolveAfterHours: 48 },
    });
  }
}
