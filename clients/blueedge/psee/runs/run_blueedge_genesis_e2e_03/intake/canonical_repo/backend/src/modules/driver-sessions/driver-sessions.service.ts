import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success, paginated, PaginationDto } from '../../common/dto';
import { DriverSessionBlock } from './entities/driver-session-block.entity';

/**
 * DriverSessionsService — Core Session-Block Engine
 *
 * Manages driver-authenticated session blocks with streaming variance.
 * When a driver authenticates on an SVG device, a new block opens.
 * When they log out or another driver authenticates, the block closes.
 * Each block captures exact measurements — no estimation.
 *
 * Variance is computed via Welford's online algorithm on edge.
 * The DWVS (Driver Wear Variance Score) is computed server-side
 * across all of a driver's session blocks on a given vehicle.
 */

// ─── DIAM Weight Configuration ────────────────────────────────
const DIAM_WEIGHTS = {
  rpmVariance: 0.25,       // Engine/transmission fatigue
  harshEventRate: 0.20,    // Brake/suspension/tire wear
  speedVariance: 0.15,     // Drivetrain stress cycles
  fuelRateVariance: 0.15,  // Injection/turbo cycling
  dtcGenerationRate: 0.15, // Rough operation indicator
  idleVariance: 0.10,      // Thermal cycling / DPF issues
};

// ─── TCO Cost Defaults (AED) ──────────────────────────────────
const TCO_DEFAULTS = {
  fuelPricePerL: 2.85,
  insuranceAnnual: 12800,
  tiresAnnual: 8400,
  registrationAnnual: 3200,
  salikTollsAnnual: 14600,
  downtimeCostPerHour: 85,
};

@Injectable()
export class DriverSessionsService extends BaseCrudService<DriverSessionBlock> {
  private readonly logger = new Logger(DriverSessionsService.name);

  constructor(
    @InjectRepository(DriverSessionBlock)
    repo: Repository<DriverSessionBlock>,
  ) {
    super(repo);
  }

  // ═══════════════════════════════════════════════════════════════
  // SESSION LIFECYCLE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Open a new session block when driver authenticates on vehicle.
   * Automatically closes any active session on the same vehicle.
   */
  async openSession(dto: {
    vehicleId: string; driverId: string; driverName: string;
    authMethod: string; svgDeviceId: string;
    odometerStart: number; fuelLevelStart: number;
  }) {
    // Close any active session on this vehicle first
    const active = await this.repo.findOne({ where: { vehicleId: dto.vehicleId, status: 'active' } });
    if (active) {
      await this.closeSession(active.id, {
        odometerEnd: dto.odometerStart, fuelLevelEnd: dto.fuelLevelStart,
        endTime: new Date(),
      });
      this.logger.log(`Auto-closed session ${active.blockNumber} for driver switch on ${dto.vehicleId}`);
    }

    // Generate next block number
    const lastBlock = await this.repo.findOne({ order: { blockNumber: 'DESC' } } as any);
    const nextBlockNumber = (lastBlock?.blockNumber || 0) + 1;

    const block = this.repo.create({
      ...dto,
      blockNumber: nextBlockNumber,
      startTime: new Date(),
      status: 'active',
    });
    const saved = await this.repo.save(block);
    this.logger.log(`Opened session block #${nextBlockNumber} — Driver ${dto.driverName} on ${dto.vehicleId}`);
    return success(saved, 'Session block opened');
  }

  /**
   * Close an active session block. Edge device sends final metrics.
   * Variance columns are pre-computed on SVG device via Welford's algorithm.
   */
  async closeSession(blockId: string, metrics: {
    odometerEnd: number; fuelLevelEnd: number; endTime: Date;
    fuelConsumedL?: number; fuelCostAED?: number;
    harshBrakes?: number; harshAccelerations?: number; harshCorners?: number;
    maxSpeedKmh?: number; avgSpeedKmh?: number; idleMinutes?: number;
    routeHighwayPct?: number; routeUrbanPct?: number; elevationGainM?: number;
    loadWeightKg?: number; ambientTempC?: number; dtcsGenerated?: string[];
    // Welford variance results from edge
    rpmMean?: number; rpmVariance?: number; speedVariance?: number;
    fuelRateVariance?: number; accelVariance?: number;
    // Cryptographic
    blockHash?: string; tpmSignature?: string; tpmSigned?: boolean;
    gpsPolyline?: string;
  }) {
    const block = await this.repo.findOne({ where: { id: blockId } });
    if (!block) throw new NotFoundException(`Session block ${blockId} not found`);
    if (block.status !== 'active') throw new BadRequestException(`Block ${blockId} is already ${block.status}`);

    // Compute derived fields
    const distanceKm = metrics.odometerEnd - block.odometerStart;
    const durationMinutes = (metrics.endTime.getTime() - block.startTime.getTime()) / 60000;
    const lPer100km = distanceKm > 0 ? ((metrics.fuelConsumedL || 0) / distanceKm * 100) : 0;
    const idlePct = durationMinutes > 0 ? ((metrics.idleMinutes || 0) / durationMinutes * 100) : 0;

    // Compute wear index from variance metrics
    const wearIndex = this.computeWearIndex({
      rpmVariance: metrics.rpmVariance || 0,
      speedVariance: metrics.speedVariance || 0,
      fuelRateVariance: metrics.fuelRateVariance || 0,
      harshEvents: (metrics.harshBrakes || 0) + (metrics.harshAccelerations || 0) + (metrics.harshCorners || 0),
      distanceKm,
      dtcsGenerated: metrics.dtcsGenerated || [],
      idlePct,
    });

    // Health delta — negative means degradation
    const healthDelta = -(wearIndex * 0.05 + (metrics.dtcsGenerated?.length || 0) * 0.02);

    await this.repo.update(blockId, {
      ...metrics,
      odometerEnd: metrics.odometerEnd,
      fuelLevelEnd: metrics.fuelLevelEnd,
      endTime: metrics.endTime,
      distanceKm,
      durationMinutes: Math.round(durationMinutes * 100) / 100,
      lPer100km: Math.round(lPer100km * 100) / 100,
      idlePct: Math.round(idlePct * 10) / 10,
      wearIndex: Math.round(wearIndex * 1000) / 1000,
      healthDelta: Math.round(healthDelta * 10000) / 10000,
      status: 'closed',
    });

    const closed = await this.repo.findOne({ where: { id: blockId } });
    this.logger.log(`Closed session block #${block.blockNumber} — ${distanceKm.toFixed(1)} km, wear: ${wearIndex.toFixed(3)}`);
    return success(closed, 'Session block closed');
  }

  /**
   * Compute session-level wear index from variance metrics.
   * This is a per-block score; DWVS aggregates across all blocks.
   */
  private computeWearIndex(data: {
    rpmVariance: number; speedVariance: number; fuelRateVariance: number;
    harshEvents: number; distanceKm: number; dtcsGenerated: string[];
    idlePct: number;
  }): number {
    // Normalize each metric to 0-1 scale using fleet-wide typical ranges
    const rpmNorm = Math.min(data.rpmVariance / 80000, 1);    // 80K = very high RPM variance
    const speedNorm = Math.min(data.speedVariance / 1200, 1);  // 1200 = very high speed variance
    const fuelNorm = Math.min(data.fuelRateVariance / 8, 1);   // 8 = very high fuel rate var
    const harshNorm = data.distanceKm > 0
      ? Math.min((data.harshEvents / data.distanceKm * 1000) / 15, 1)
      : 0;
    const dtcNorm = Math.min(data.dtcsGenerated.length / 3, 1);
    const idleNorm = Math.min(data.idlePct / 30, 1);

    return (
      DIAM_WEIGHTS.rpmVariance * rpmNorm +
      DIAM_WEIGHTS.harshEventRate * harshNorm +
      DIAM_WEIGHTS.speedVariance * speedNorm +
      DIAM_WEIGHTS.fuelRateVariance * fuelNorm +
      DIAM_WEIGHTS.dtcGenerationRate * dtcNorm +
      DIAM_WEIGHTS.idleVariance * idleNorm
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // QUERY METHODS
  // ═══════════════════════════════════════════════════════════════

  /** Get all sessions for a vehicle, paginated */
  async findByVehicle(vehicleId: string, query: PaginationDto) {
    const { page = 1, limit = 20 } = query;
    const [data, total] = await this.repo.findAndCount({
      where: { vehicleId },
      skip: (page - 1) * limit, take: limit,
      order: { startTime: 'DESC' },
    });
    return paginated(data, total, page, limit);
  }

  /** Get all sessions for a driver, optionally filtered by vehicle */
  async findByDriver(driverId: string, vehicleId?: string, query?: PaginationDto) {
    const { page = 1, limit = 20 } = query || {};
    const where: any = { driverId };
    if (vehicleId) where.vehicleId = vehicleId;
    const [data, total] = await this.repo.findAndCount({
      where, skip: (page - 1) * limit, take: limit,
      order: { startTime: 'DESC' },
    });
    return paginated(data, total, page, limit);
  }

  /** Get sessions within a time range */
  async findByTimeRange(vehicleId: string, startDate: Date, endDate: Date) {
    const data = await this.repo.find({
      where: { vehicleId, startTime: Between(startDate, endDate) },
      order: { startTime: 'ASC' },
    });
    return success(data);
  }

  /** Get active session for a vehicle (if any) */
  async getActiveSession(vehicleId: string) {
    const active = await this.repo.findOne({ where: { vehicleId, status: 'active' } });
    return success(active);
  }

  // ═══════════════════════════════════════════════════════════════
  // DWVS COMPUTATION ENGINE
  // Driver Wear Variance Score — the patent-pending innovation
  // ═══════════════════════════════════════════════════════════════

  /**
   * Compute DWVS for a specific driver on a specific vehicle.
   *
   * DWVS = Σ(wᵢ × CVᵢ²)
   * where CV = Coefficient of Variation (σ / μ) per metric.
   *
   * Low DWVS = consistent, gentle driver → slow depreciation
   * High DWVS = erratic, aggressive driver → accelerated depreciation
   */
  async computeDWVS(driverId: string, vehicleId: string) {
    const blocks = await this.repo.find({
      where: { driverId, vehicleId, status: 'closed' },
      order: { startTime: 'ASC' },
    });

    if (blocks.length < 5) {
      return success({
        driverId, vehicleId, dwvs: null, confidence: 'insufficient_data',
        message: `Need at least 5 closed sessions (have ${blocks.length})`,
        blockCount: blocks.length,
      });
    }

    const totalKm = blocks.reduce((s, b) => s + b.distanceKm, 0);
    const totalHours = blocks.reduce((s, b) => s + b.durationMinutes, 0) / 60;
    const totalFuelL = blocks.reduce((s, b) => s + b.fuelConsumedL, 0);
    const totalHarsh = blocks.reduce((s, b) => s + b.harshBrakes + b.harshAccelerations + b.harshCorners, 0);
    const totalDtcs = blocks.reduce((s, b) => s + b.dtcsGenerated.length, 0);

    // Compute variance OF per-block metrics (meta-variance)
    const rpmVarValues = blocks.map(b => b.rpmVariance);
    const speedVarValues = blocks.map(b => b.speedVariance);
    const fuelRateVarValues = blocks.map(b => b.fuelRateVariance);
    const harshRateValues = blocks.map(b => b.distanceKm > 0 ? (b.harshBrakes + b.harshAccelerations + b.harshCorners) / b.distanceKm * 1000 : 0);
    const idleValues = blocks.map(b => b.idlePct);
    const dtcRateValues = blocks.map(b => b.distanceKm > 0 ? b.dtcsGenerated.length / b.distanceKm * 1000 : 0);

    // Compute CV² for each metric
    const cvSq = (values: number[]): number => {
      const n = values.length;
      const mean = values.reduce((s, v) => s + v, 0) / n;
      if (mean === 0) return 0;
      const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
      const cv = Math.sqrt(variance) / Math.abs(mean);
      return cv * cv;
    };

    // DWVS = Σ(wᵢ × CVᵢ²)
    const dwvs =
      DIAM_WEIGHTS.rpmVariance * cvSq(rpmVarValues) +
      DIAM_WEIGHTS.harshEventRate * cvSq(harshRateValues) +
      DIAM_WEIGHTS.speedVariance * cvSq(speedVarValues) +
      DIAM_WEIGHTS.fuelRateVariance * cvSq(fuelRateVarValues) +
      DIAM_WEIGHTS.dtcGenerationRate * cvSq(dtcRateValues) +
      DIAM_WEIGHTS.idleVariance * cvSq(idleValues);

    const consistencyRating = dwvs < 0.3 ? 'excellent' : dwvs < 0.5 ? 'good' : dwvs < 0.7 ? 'fair' : 'poor';
    const avgLPer100km = totalKm > 0 ? totalFuelL / totalKm * 100 : 0;

    return success({
      driverId, vehicleId, dwvs: Math.round(dwvs * 1000) / 1000,
      consistencyRating,
      confidence: blocks.length >= 50 ? 'high' : blocks.length >= 20 ? 'medium' : 'low',
      blockCount: blocks.length,
      totalKm: Math.round(totalKm),
      totalHours: Math.round(totalHours),
      totalFuelL: Math.round(totalFuelL),
      avgLPer100km: Math.round(avgLPer100km * 10) / 10,
      totalFuelCostAED: Math.round(totalFuelL * TCO_DEFAULTS.fuelPricePerL),
      harshRate: totalKm > 0 ? Math.round(totalHarsh / totalKm * 10000) / 10 : 0,
      dtcRate: totalKm > 0 ? Math.round(totalDtcs / totalKm * 10000) / 10 : 0,
      avgRpmVariance: Math.round(rpmVarValues.reduce((s, v) => s + v, 0) / rpmVarValues.length),
      avgSpeedVariance: Math.round(speedVarValues.reduce((s, v) => s + v, 0) / speedVarValues.length),
      avgFuelRateVariance: Math.round(fuelRateVarValues.reduce((s, v) => s + v, 0) / fuelRateVarValues.length * 10) / 10,
      avgWearIndex: Math.round(blocks.reduce((s, b) => s + b.wearIndex, 0) / blocks.length * 1000) / 1000,
    });
  }

  /**
   * Compute DWVS for ALL drivers on a given vehicle.
   * Returns sorted array (best → worst).
   */
  async computeVehicleDWVS(vehicleId: string) {
    // Get distinct drivers for this vehicle
    const driverIds = await this.repo
      .createQueryBuilder('b')
      .select('DISTINCT b.driverId', 'driverId')
      .where('b.vehicleId = :vehicleId', { vehicleId })
      .andWhere('b.status = :status', { status: 'closed' })
      .getRawMany();

    const results = [];
    for (const { driverId } of driverIds) {
      const result = await this.computeDWVS(driverId, vehicleId);
      if (result.data?.dwvs !== null) results.push(result.data);
    }
    results.sort((a, b) => (a.dwvs || 99) - (b.dwvs || 99));
    return success(results);
  }

  /**
   * Welford's online algorithm — utility for any streaming variance computation.
   * Used by edge device in real-time; exposed here for server-side recalculation.
   */
  static welfordUpdate(state: { count: number; mean: number; m2: number }, value: number) {
    state.count += 1;
    const delta = value - state.mean;
    state.mean += delta / state.count;
    const delta2 = value - state.mean;
    state.m2 += delta * delta2;
    return state;
  }

  static welfordFinalize(state: { count: number; mean: number; m2: number }): { mean: number; variance: number } {
    if (state.count < 2) return { mean: state.mean, variance: 0 };
    return { mean: state.mean, variance: state.m2 / state.count };
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  async getStats() {
    const total = await this.repo.count();
    const active = await this.repo.count({ where: { status: 'active' } });
    const closed = await this.repo.count({ where: { status: 'closed' } });
    const totalKm = await this.repo
      .createQueryBuilder('b')
      .select('SUM(b.distanceKm)', 'total')
      .where('b.status = :status', { status: 'closed' })
      .getRawOne();
    return success({
      totalBlocks: total, activeBlocks: active, closedBlocks: closed,
      totalKmTracked: Math.round(totalKm?.total || 0),
      uniqueVehicles: await this.repo.createQueryBuilder('b').select('COUNT(DISTINCT b.vehicleId)').getRawOne(),
      uniqueDrivers: await this.repo.createQueryBuilder('b').select('COUNT(DISTINCT b.driverId)').getRawOne(),
    });
  }
}
