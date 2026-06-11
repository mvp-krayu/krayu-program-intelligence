import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, Injectable, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

// ─── Types ────────────────────────────────────────────────────
interface VehiclePosition {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  altitude: number;
  timestamp: string;
  status: 'moving' | 'idle' | 'stopped' | 'offline';
  fleetType: 'tanker' | 'bus' | 'taxi';
}

interface TelemetryPayload {
  vehicleId: string;
  timestamp: string;
  engine: { rpm: number; coolantTempC: number; oilPressureKpa: number; fuelRateL: number };
  vehicle: { speedKmh: number; odometer: number; batteryVoltage: number };
  tank?: { compartments: { id: number; levelPercent: number; tempC: number; pressureMbar: number }[] };
  safety: { absActive: boolean; escActive: boolean; rollStabilityWarning: boolean };
}

interface AlertPayload {
  id: string;
  vehicleId: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ─── Mock Data Generator ──────────────────────────────────────
const VEHICLES = [
  { vehicleId: 'TK-0847', fleetType: 'tanker' as const, baseLat: 25.0657, baseLng: 55.1713 },
  { vehicleId: 'TK-0923', fleetType: 'tanker' as const, baseLat: 25.2048, baseLng: 55.2708 },
  { vehicleId: 'TK-1105', fleetType: 'tanker' as const, baseLat: 25.1185, baseLng: 55.2005 },
  { vehicleId: 'BUS-201', fleetType: 'bus' as const, baseLat: 25.2532, baseLng: 55.3325 },
  { vehicleId: 'BUS-305', fleetType: 'bus' as const, baseLat: 25.1972, baseLng: 55.2744 },
  { vehicleId: 'BUS-412', fleetType: 'bus' as const, baseLat: 25.2285, baseLng: 55.2867 },
  { vehicleId: 'TX-5501', fleetType: 'taxi' as const, baseLat: 25.2040, baseLng: 55.2700 },
  { vehicleId: 'TX-5622', fleetType: 'taxi' as const, baseLat: 25.0760, baseLng: 55.1414 },
  { vehicleId: 'TX-5789', fleetType: 'taxi' as const, baseLat: 25.2100, baseLng: 55.3200 },
  { vehicleId: 'TK-1250', fleetType: 'tanker' as const, baseLat: 24.9900, baseLng: 55.1000 },
];

function jitter(base: number, range: number): number {
  return base + (Math.random() - 0.5) * range;
}

function generatePosition(v: typeof VEHICLES[0]): VehiclePosition {
  return {
    vehicleId: v.vehicleId,
    lat: jitter(v.baseLat, 0.02),
    lng: jitter(v.baseLng, 0.02),
    speed: Math.round(Math.random() * 95 + 5),
    heading: Math.round(Math.random() * 360),
    altitude: Math.round(jitter(15, 10)),
    timestamp: new Date().toISOString(),
    status: Math.random() > 0.15 ? 'moving' : 'idle',
    fleetType: v.fleetType,
  };
}

function generateTelemetry(v: typeof VEHICLES[0]): TelemetryPayload {
  const payload: TelemetryPayload = {
    vehicleId: v.vehicleId,
    timestamp: new Date().toISOString(),
    engine: {
      rpm: Math.round(jitter(1800, 1200)),
      coolantTempC: jitter(88, 12),
      oilPressureKpa: jitter(380, 80),
      fuelRateL: jitter(12, 8),
    },
    vehicle: {
      speedKmh: Math.round(Math.random() * 95 + 5),
      odometer: Math.round(jitter(125000, 50000)),
      batteryVoltage: jitter(26.5, 2),
    },
    safety: {
      absActive: Math.random() > 0.95,
      escActive: Math.random() > 0.97,
      rollStabilityWarning: Math.random() > 0.99,
    },
  };
  if (v.fleetType === 'tanker') {
    payload.tank = {
      compartments: [1, 2, 3, 4].map(id => ({
        id,
        levelPercent: jitter(72, 40),
        tempC: jitter(28, 8),
        pressureMbar: jitter(25, 10),
      })),
    };
  }
  return payload;
}

// ─── Gateway ──────────────────────────────────────────────────
@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/fleet',
  transports: ['websocket', 'polling'],
})
@Injectable()
export class FleetGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('FleetGateway');
  private connectedClients = new Map<string, { socket: Socket; rooms: Set<string>; subscribedVehicles: Set<string> }>();
  private positionInterval: NodeJS.Timeout;
  private telemetryInterval: NodeJS.Timeout;
  private alertInterval: NodeJS.Timeout;

  // ── Lifecycle ─────────────────────────────────────────────
  afterInit() {
    this.logger.log('Fleet WebSocket Gateway initialized');
    this.startBroadcasts();
  }

  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, { socket: client, rooms: new Set(), subscribedVehicles: new Set() });
    this.logger.log(`Client connected: ${client.id} (total: ${this.connectedClients.size})`);
    client.emit('connection:ack', { clientId: client.id, serverTime: new Date().toISOString(), vehicles: VEHICLES.length });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id} (total: ${this.connectedClients.size})`);
  }

  // ── Subscriptions ─────────────────────────────────────────
  @SubscribeMessage('subscribe:fleet')
  handleSubscribeFleet(@ConnectedSocket() client: Socket, @MessageBody() data: { fleetType?: string }) {
    const room = data?.fleetType ? `fleet:${data.fleetType}` : 'fleet:all';
    client.join(room);
    const entry = this.connectedClients.get(client.id);
    if (entry) entry.rooms.add(room);
    this.logger.log(`${client.id} joined ${room}`);
    return { event: 'subscribed', data: { room, vehicles: VEHICLES.filter(v => !data?.fleetType || v.fleetType === data.fleetType).length } };
  }

  @SubscribeMessage('subscribe:vehicle')
  handleSubscribeVehicle(@ConnectedSocket() client: Socket, @MessageBody() data: { vehicleId: string }) {
    const room = `vehicle:${data.vehicleId}`;
    client.join(room);
    const entry = this.connectedClients.get(client.id);
    if (entry) { entry.rooms.add(room); entry.subscribedVehicles.add(data.vehicleId); }
    this.logger.log(`${client.id} subscribed to vehicle ${data.vehicleId}`);
    return { event: 'subscribed', data: { room, vehicleId: data.vehicleId } };
  }

  @SubscribeMessage('subscribe:alerts')
  handleSubscribeAlerts(@ConnectedSocket() client: Socket, @MessageBody() data: { severity?: string }) {
    const room = data?.severity ? `alerts:${data.severity}` : 'alerts:all';
    client.join(room);
    this.logger.log(`${client.id} joined ${room}`);
    return { event: 'subscribed', data: { room } };
  }

  @SubscribeMessage('subscribe:sessions')
  handleSubscribeSessions(@ConnectedSocket() client: Socket, @MessageBody() data?: { vehicleId?: string }) {
    const room = data?.vehicleId ? `sessions:vehicle:${data.vehicleId}` : 'sessions:all';
    client.join(room);
    const entry = this.connectedClients.get(client.id);
    if (entry) entry.rooms.add(room);
    this.logger.log(`${client.id} joined ${room}`);
    return { event: 'subscribed', data: { room } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
    client.leave(data.room);
    const entry = this.connectedClients.get(client.id);
    if (entry) entry.rooms.delete(data.room);
    return { event: 'unsubscribed', data: { room: data.room } };
  }

  // ── Commands ──────────────────────────────────────────────
  @SubscribeMessage('vehicle:command')
  handleVehicleCommand(@ConnectedSocket() client: Socket, @MessageBody() data: { vehicleId: string; command: string; params?: any }) {
    this.logger.log(`Command from ${client.id}: ${data.command} → ${data.vehicleId}`);
    // In production: validate auth, publish to MQTT topic for SVG device
    return { event: 'command:ack', data: { vehicleId: data.vehicleId, command: data.command, status: 'queued', queuedAt: new Date().toISOString() } };
  }

  @SubscribeMessage('request:snapshot')
  handleSnapshot(@ConnectedSocket() client: Socket) {
    const positions = VEHICLES.map(v => generatePosition(v));
    return { event: 'fleet:snapshot', data: { positions, timestamp: new Date().toISOString(), count: positions.length } };
  }

  // ── Broadcast Loops ───────────────────────────────────────
  private startBroadcasts() {
    // Fleet positions: every 2 seconds
    this.positionInterval = setInterval(() => {
      if (this.connectedClients.size === 0) return;
      const positions = VEHICLES.map(v => generatePosition(v));

      // Broadcast all positions to fleet:all
      this.server.to('fleet:all').emit('fleet:positions', { positions, timestamp: new Date().toISOString() });

      // Broadcast filtered by fleet type
      for (const type of ['tanker', 'bus', 'taxi']) {
        const filtered = positions.filter(p => p.fleetType === type);
        if (filtered.length) {
          this.server.to(`fleet:${type}`).emit('fleet:positions', { positions: filtered, timestamp: new Date().toISOString() });
        }
      }

      // Broadcast individual vehicle positions
      for (const pos of positions) {
        this.server.to(`vehicle:${pos.vehicleId}`).emit('vehicle:position', pos);
      }
    }, 2000);

    // Telemetry: every 5 seconds for subscribed vehicles
    this.telemetryInterval = setInterval(() => {
      if (this.connectedClients.size === 0) return;
      for (const v of VEHICLES) {
        const telemetry = generateTelemetry(v);
        this.server.to(`vehicle:${v.vehicleId}`).emit('vehicle:telemetry', telemetry);
      }
    }, 5000);

    // Random alerts: every 15-30 seconds
    this.alertInterval = setInterval(() => {
      if (this.connectedClients.size === 0) return;
      const v = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
      const alertTypes = [
        { type: 'harsh_braking', severity: 'medium' as const, msg: 'Harsh braking event detected (-0.45g)' },
        { type: 'speeding', severity: 'high' as const, msg: 'Speed violation: 112 km/h in 80 km/h zone' },
        { type: 'geofence_exit', severity: 'medium' as const, msg: 'Vehicle exited geofence: Jebel Ali Zone' },
        { type: 'tank_temp_warning', severity: 'high' as const, msg: 'Compartment 2 temperature 42°C exceeds threshold' },
        { type: 'engine_dtc', severity: 'low' as const, msg: 'DTC P0217: Engine coolant over-temperature' },
        { type: 'fatigue_warning', severity: 'critical' as const, msg: 'Driver fatigue detected – PERCLOS 18%' },
        { type: 'rollover_risk', severity: 'critical' as const, msg: 'Roll stability warning – lateral acceleration 0.35g' },
      ];
      const at = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const alert: AlertPayload = {
        id: `alert-${Date.now()}`,
        vehicleId: v.vehicleId,
        type: at.type,
        severity: at.severity,
        message: `${v.vehicleId}: ${at.msg}`,
        timestamp: new Date().toISOString(),
        metadata: { fleetType: v.fleetType, lat: v.baseLat, lng: v.baseLng },
      };

      this.server.to('alerts:all').emit('alert:new', alert);
      this.server.to(`alerts:${alert.severity}`).emit('alert:new', alert);
      this.server.to(`vehicle:${v.vehicleId}`).emit('alert:new', alert);
    }, Math.random() * 15000 + 15000);

    this.logger.log('Broadcast loops started — positions@2s, telemetry@5s, alerts@15-30s');
  }

  // ── Programmatic emit (called by other services) ──────────
  emitAlert(alert: AlertPayload) {
    this.server.to('alerts:all').emit('alert:new', alert);
    this.server.to(`alerts:${alert.severity}`).emit('alert:new', alert);
    this.server.to(`vehicle:${alert.vehicleId}`).emit('alert:new', alert);
  }

  emitVehicleUpdate(vehicleId: string, event: string, data: any) {
    this.server.to(`vehicle:${vehicleId}`).emit(event, data);
  }

  emitSessionEvent(event: string, data: { vehicleId: string; [key: string]: any }) {
    // Emit to vehicle subscribers
    this.server.to(`vehicle:${data.vehicleId}`).emit(event, data);
    // Emit to session-specific room
    this.server.to(`sessions:vehicle:${data.vehicleId}`).emit(event, data);
    // Emit to all session subscribers
    this.server.to('sessions:all').emit(event, data);
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}
