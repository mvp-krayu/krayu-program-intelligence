import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class DigitalTwinService extends BaseCrudService<DigitalTwin> {
  constructor(
    @InjectRepository(DigitalTwin) repo: Repository<DigitalTwin>,
    @InjectRepository(TwinSimulation) private simRepo: Repository<TwinSimulation>,
    @InjectRepository(TwinSnapshot) private snapRepo: Repository<TwinSnapshot>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      totalTwins: 65, activeTwins: 58, syncedTwins: 55, staleCount: 3,
      avgSyncFidelity: 97.2, avgLatencyMs: 145,
      byFleetType: { tanker: 24, bus: 22, taxi: 19 },
      simulationsRun: { today: 12, thisWeek: 47, thisMonth: 182 },
      alertsFromSimulation: 5,
      topInsights: [
        'V001 digital twin predicted 12% higher fuel burn under Friday traffic — confirmed by actual data',
        'Bus route 14 simulation shows 8-minute savings with alternate Al Khail Rd routing',
        'Tanker fleet HAZMAT load simulation identified optimal speed profile for Dubai-Abu Dhabi corridor',
      ],
    });
  }

  async getTwinState(vehicleId: string) {
    return success({
      vehicleId, plateNumber: 'DXB-7291', twinType: 'tanker', syncFidelity: 98.4, lastSyncAt: new Date(),
      liveState: {
        position: { lat: 25.2048, lng: 55.2708, heading: 245, speed: 72, altitude: 12 },
        engine: { rpm: 2200, temp: 91.5, oilPressure: 3.4, coolantTemp: 88.2, fuelRate: 15.2, throttle: 42, torque: 680 },
        transmission: { gear: 5, temp: 72.1, fluidLevel: 'normal', mode: 'drive' },
        brakes: { frontLeft: { temp: 145, padThickness: 4.2, pressure: 2.1 }, frontRight: { temp: 148, padThickness: 4.0, pressure: 2.1 }, rearLeft: { temp: 132, padThickness: 3.1, pressure: 1.8 }, rearRight: { temp: 135, padThickness: 2.9, pressure: 1.8 } },
        tires: { fl: { pressure: 8.2, temp: 55, tread: 5.1 }, fr: { pressure: 8.1, temp: 56, tread: 4.9 }, rl: { pressure: 8.4, temp: 52, tread: 4.5 }, rr: { pressure: 8.3, temp: 53, tread: 4.3 } },
        electrical: { batteryVoltage: 12.8, alternatorOutput: 14.2, totalCurrent: 45, faults: [] },
        cargo: { type: 'diesel_fuel', volume: 28500, temperature: 32.1, pressure: 1.01, density: 0.835, compartments: [{ id: 1, volume: 14000, fillLevel: 93 }, { id: 2, volume: 14500, fillLevel: 98 }] },
        hvac: { cabinTemp: 22, setPoint: 21, compressorState: 'on', airflow: 'medium' },
        safety: { seatbelt: true, doors: 'locked', hazmatPlacard: 'Class 3 - Flammable', emergencyBeacon: 'standby' },
      },
      meshConfig: {
        modelUrl: '/assets/models/tanker_fuel_v2.glb', scale: [1, 1, 1],
        sensorOverlays: ['engine_temp', 'brake_temp', 'tire_pressure', 'cargo_level'],
        animatedParts: ['wheels', 'steering', 'suspension_travel'],
        colorCoding: { engine: '#22c55e', brakes: '#f59e0b', cargo: '#3b82f6' },
      },
      timeline: [
        { time: new Date(Date.now() - 3600000), event: 'Departed Jebel Ali fuel depot', state: 'en_route' },
        { time: new Date(Date.now() - 2400000), event: 'Entered E11 Sheikh Zayed Rd', state: 'en_route' },
        { time: new Date(Date.now() - 1200000), event: 'Brake temp warning (rear-right)', state: 'warning' },
        { time: new Date(Date.now() - 600000), event: 'Speed reduced — brake temp normalized', state: 'en_route' },
      ],
    });
  }

  async runSimulation(twinId: string, body: any) {
    const scenarios = {
      failure: {
        scenarioType: 'failure', description: 'Simulating brake failure cascade',
        results: {
          failureChain: ['Rear-right brake overheating → Brake fade → ABS engagement → Emergency stop'],
          stoppingDistance: { normal: 45, degraded: 72, emergency: 92 },
          safetyRisk: 'high', timeToFailure: '~2.3 hours at current load/speed',
          recommendation: 'Reduce speed to 60km/h immediately. Schedule brake service within 48 hours.',
        },
      },
      load_test: {
        scenarioType: 'load_test', description: 'Testing maximum cargo load impact',
        results: {
          maxSafeLoad: 32000, currentLoad: 28500, safetyMargin: '10.9%',
          fuelImpact: '+8.2% consumption at max load', brakeImpact: '+15% wear rate',
          recommendation: 'Current load within safe parameters. Monitor brake temperatures on uphill sections.',
        },
      },
      route_optimization: {
        scenarioType: 'route_optimization', description: 'Comparing route alternatives',
        results: {
          routes: [
            { name: 'Current (E11)', distance: 42.3, eta: 48, fuelCost: 125, brakeStress: 'medium' },
            { name: 'Alt (E44 → E311)', distance: 38.1, eta: 52, fuelCost: 108, brakeStress: 'low' },
            { name: 'Alt (E66 coastal)', distance: 45.8, eta: 55, fuelCost: 132, brakeStress: 'low' },
          ],
          optimal: 'E44 → E311', reason: 'Lower brake stress critical for current pad condition — saves 4.2km despite 4min longer',
        },
      },
      weather_impact: {
        scenarioType: 'weather_impact', description: 'Heat stress simulation (Dubai summer)',
        results: {
          ambientTemp: 50, engineTempProjected: 108, hvacLoad: 'maximum',
          fuelPenalty: '+12.5%', tireRiskIncrease: '+18%', coolantStress: 'elevated',
          recommendation: 'Schedule midday break 11:00-14:00. Pre-cool cabin. Check coolant level.',
        },
      },
    };
    const scenario = scenarios[body.scenarioType] || scenarios.failure;
    return success({ twinId, simulationId: `sim-${Date.now()}`, status: 'completed', durationMs: 2340, ...scenario });
  }

  async getFleetTwins(fleetType?: string) {
    const twins = [
      { id: 'tw-001', vehicleId: 'V001', plateNumber: 'DXB-7291', twinType: 'tanker', healthScore: 74.5, syncFidelity: 98.4, status: 'active', activePredictions: 2 },
      { id: 'tw-002', vehicleId: 'V008', plateNumber: 'DXB-4490', twinType: 'tanker', healthScore: 81.2, syncFidelity: 97.1, status: 'active', activePredictions: 1 },
      { id: 'tw-003', vehicleId: 'V022', plateNumber: 'BUS-1103', twinType: 'bus', healthScore: 88.9, syncFidelity: 96.8, status: 'active', activePredictions: 1 },
      { id: 'tw-004', vehicleId: 'V045', plateNumber: 'TAXI-2201', twinType: 'taxi', healthScore: 92.1, syncFidelity: 99.1, status: 'active', activePredictions: 0 },
      { id: 'tw-005', vehicleId: 'V012', plateNumber: 'DXB-8834', twinType: 'tanker', healthScore: 79.3, syncFidelity: 95.2, status: 'active', activePredictions: 1 },
    ];
    const filtered = fleetType && fleetType !== 'all' ? twins.filter(t => t.twinType === fleetType) : twins;
    return success(filtered);
  }

  async captureSnapshot(twinId: string, body: any) {
    return success({ snapshotId: `snap-${Date.now()}`, twinId, label: body.label || 'Manual snapshot', capturedAt: new Date(), stateSize: '24.5 KB' });
  }

  async getSimulationHistory(twinId: string) {
    return success([
      { id: 'sim-001', twinId, scenarioType: 'failure', status: 'completed', durationMs: 2340, createdAt: new Date(Date.now() - 86400000) },
      { id: 'sim-002', twinId, scenarioType: 'route_optimization', status: 'completed', durationMs: 1890, createdAt: new Date(Date.now() - 172800000) },
      { id: 'sim-003', twinId, scenarioType: 'weather_impact', status: 'completed', durationMs: 3100, createdAt: new Date(Date.now() - 259200000) },
    ]);
  }

  async compareTwins(vehicleIds: string[]) {
    return success({
      vehicles: vehicleIds,
      comparison: {
        healthScore: { 'V001': 74.5, 'V008': 81.2 },
        fuelEfficiency: { 'V001': 14.2, 'V008': 12.8 },
        brakeHealth: { 'V001': 45, 'V008': 78 },
        engineHealth: { 'V001': 82, 'V008': 85 },
        overallWinner: 'V008',
        insights: ['V001 needs immediate brake attention', 'V008 has better overall condition despite higher mileage'],
      },
    });
  }
}

// ─── Controller ───────────────────────────────────────────────
