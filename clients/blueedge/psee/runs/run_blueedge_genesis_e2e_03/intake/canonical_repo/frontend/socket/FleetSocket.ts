/**
 * FleetSocket — Singleton Socket.IO client for Blue Edge Fleet real-time layer
 *
 * Backend gateway: /fleet namespace on WS_URL (default ws://localhost:3001)
 * Broadcasts:
 *   fleet:positions   (2s interval, all vehicle positions)
 *   vehicle:position  (per-vehicle updates)
 *   vehicle:telemetry (5s interval, per-vehicle engine/tank/safety data)
 *   alert:new         (15-30s random, fleet-wide alerts)
 *   trip:started / trip:completed / trip:delayed
 *   safety:event      (critical safety detections)
 *   geofence:entered / geofence:exited
 *   coldchain:breach   (temperature violations)
 *   diagnostics:dtc / diagnostics:predictive
 *   vehicle:status     (online/offline/maintenance)
 *   device:connected / device:disconnected
 */
import { io, Socket } from 'socket.io-client';

// ── Types ──────────────────────────────────────────────────────
export interface VehiclePosition {
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

export interface TelemetryPayload {
  vehicleId: string;
  timestamp: string;
  engine: { rpm: number; coolantTempC: number; oilPressureKpa: number; fuelRateL: number };
  vehicle: { speedKmh: number; odometer: number; batteryVoltage: number };
  tank?: { compartments: { id: number; levelPercent: number; tempC: number; pressureMbar: number }[] };
  safety: { absActive: boolean; escActive: boolean; rollStabilityWarning: boolean };
}

export interface AlertPayload {
  id: string;
  vehicleId: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ConnectionAck {
  clientId: string;
  serverTime: string;
  vehicles: number;
}

export interface FleetSnapshot {
  positions: VehiclePosition[];
  timestamp: string;
  count: number;
}

export interface TripEvent {
  tripId: string;
  vehicleId: string;
  driverId?: string;
  data?: Record<string, any>;
  timestamp: string;
}

export interface SafetyEvent {
  safetyEventId: string;
  vehicleId: string;
  driverId?: string;
  eventType: string;
  severity: string;
  location?: { lat: number; lng: number };
  timestamp: string;
}

export interface GeofenceEvent {
  vehicleId: string;
  geofenceId: string;
  geofenceName: string;
  action: 'entered' | 'exited';
  position?: { lat: number; lng: number };
  timestamp: string;
}

export interface ActivityItem {
  id: string;
  type: 'position' | 'alert' | 'trip' | 'safety' | 'geofence' | 'telemetry' | 'status' | 'device' | 'coldchain' | 'diagnostics' | 'session';
  vehicleId: string;
  summary: string;
  severity?: string;
  timestamp: string;
  data?: any;
}

export interface DriverSessionStartedPayload {
  sessionId: string;
  blockNumber: number;
  vehicleId: string;
  driverId: string;
  driverName: string;
  authMethod: string;
  svgDeviceId?: string;
  startTime: string;
  timestamp: string;
}

export interface DriverSessionClosedPayload {
  sessionId: string;
  blockNumber: number;
  vehicleId: string;
  driverId: string;
  driverName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  distanceKm: number;
  fuelConsumedL: number;
  wearIndex: number;
  healthDelta: number;
  tpmSigned: boolean;
  blockHash: string;
  timestamp: string;
}

export interface DriverDwvsPayload {
  vehicleId: string;
  driverId: string;
  driverName: string;
  dwvs: number;
  timestamp: string;
}

// ── Event map for typed listeners ──────────────────────────────
export type FleetEventMap = {
  'connection:ack': ConnectionAck;
  'fleet:positions': { positions: VehiclePosition[]; timestamp: string };
  'fleet:snapshot': FleetSnapshot;
  'vehicle:position': VehiclePosition;
  'vehicle:telemetry': TelemetryPayload;
  'vehicle:status': { vehicleId: string; oldStatus: string; newStatus: string; timestamp: string };
  'alert:new': AlertPayload;
  'trip:started': TripEvent;
  'trip:completed': TripEvent;
  'trip:delayed': TripEvent;
  'safety:event': SafetyEvent;
  'geofence:entered': GeofenceEvent;
  'geofence:exited': GeofenceEvent;
  'coldchain:breach': { shipmentId: string; vehicleId: string; temperatureC: number; zone: string; timestamp: string };
  'diagnostics:dtc': { vehicleId: string; dtcCode: string; severity: string; description: string; timestamp: string };
  'diagnostics:predictive': { vehicleId: string; description: string; severity: string; timestamp: string };
  'device:connected': { deviceId: string; vehicleId: string; timestamp: string };
  'device:disconnected': { deviceId: string; vehicleId: string; timestamp: string };
  'driver:session:started': DriverSessionStartedPayload;
  'driver:session:closed': DriverSessionClosedPayload;
  'driver:session:interrupted': DriverSessionStartedPayload;
  'driver:dwvs:computed': DriverDwvsPayload;
};

type EventName = keyof FleetEventMap;
type EventCallback<E extends EventName> = (data: FleetEventMap[E]) => void;

// ── Singleton Manager ──────────────────────────────────────────
class FleetSocketManager {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Function>>();
  private rooms = new Set<string>();
  private _connected = false;
  private _clientId = '';
  private _reconnectCount = 0;
  private activityLog: ActivityItem[] = [];
  private activityListeners = new Set<(items: ActivityItem[]) => void>();
  private connectionListeners = new Set<(connected: boolean) => void>();
  private maxActivityItems = 200;

  get connected() { return this._connected; }
  get clientId() { return this._clientId; }
  get reconnectCount() { return this._reconnectCount; }
  get activity() { return this.activityLog; }

  // ── Connect ────────────────────────────────────────────────
  connect(url?: string): void {
    if (this.socket?.connected) return;

    const wsUrl = url || import.meta.env.VITE_WS_URL || 'http://localhost:3001';

    this.socket = io(`${wsUrl}/fleet`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
      autoConnect: true,
    });

    // Connection lifecycle
    this.socket.on('connect', () => {
      this._connected = true;
      this._reconnectCount = 0;
      this.notifyConnectionListeners();
      console.log('[FleetSocket] Connected');

      // Re-subscribe to rooms on reconnect
      for (const room of this.rooms) {
        this.joinRoom(room);
      }
    });

    this.socket.on('disconnect', (reason) => {
      this._connected = false;
      this.notifyConnectionListeners();
      console.log(`[FleetSocket] Disconnected: ${reason}`);
    });

    this.socket.on('connect_error', (err) => {
      this._reconnectCount++;
      this.notifyConnectionListeners();
      if (this._reconnectCount <= 3) {
        console.warn(`[FleetSocket] Connection error (attempt ${this._reconnectCount}):`, err.message);
      }
    });

    // Connection acknowledgement
    this.socket.on('connection:ack', (data: ConnectionAck) => {
      this._clientId = data.clientId;
      this.emit('connection:ack', data);
    });

    // Register all fleet event forwarding
    this.registerEventForwarding();
  }

  // ── Disconnect ─────────────────────────────────────────────
  disconnect(): void {
    if (!this.socket) return;
    this.rooms.clear();
    this.socket.disconnect();
    this.socket = null;
    this._connected = false;
    this._clientId = '';
    this.notifyConnectionListeners();
    console.log('[FleetSocket] Disconnected (manual)');
  }

  // ── Room Management ────────────────────────────────────────
  subscribeFleet(fleetType?: string): void {
    const room = fleetType ? `fleet:${fleetType}` : 'fleet:all';
    this.rooms.add(room);
    this.joinRoom(room);
  }

  subscribeVehicle(vehicleId: string): void {
    const room = `vehicle:${vehicleId}`;
    this.rooms.add(room);
    this.joinRoom(room);
  }

  subscribeAlerts(severity?: string): void {
    const room = severity ? `alerts:${severity}` : 'alerts:all';
    this.rooms.add(room);
    this.joinRoom(room);
  }

  subscribeSessions(vehicleId?: string): void {
    const room = vehicleId ? `sessions:vehicle:${vehicleId}` : 'sessions:all';
    this.rooms.add(room);
    this.joinRoom(room);
  }

  unsubscribe(room: string): void {
    this.rooms.delete(room);
    this.socket?.emit('unsubscribe', { room });
  }

  unsubscribeVehicle(vehicleId: string): void {
    this.unsubscribe(`vehicle:${vehicleId}`);
  }

  private joinRoom(room: string): void {
    if (!this.socket?.connected) return;
    if (room.startsWith('fleet:')) {
      const type = room === 'fleet:all' ? undefined : room.replace('fleet:', '');
      this.socket.emit('subscribe:fleet', { fleetType: type });
    } else if (room.startsWith('vehicle:')) {
      this.socket.emit('subscribe:vehicle', { vehicleId: room.replace('vehicle:', '') });
    } else if (room.startsWith('alerts:')) {
      const sev = room === 'alerts:all' ? undefined : room.replace('alerts:', '');
      this.socket.emit('subscribe:alerts', { severity: sev });
    } else if (room.startsWith('sessions:')) {
      const vehicleId = room === 'sessions:all' ? undefined : room.replace('sessions:vehicle:', '');
      this.socket.emit('subscribe:sessions', { vehicleId });
    }
  }

  // ── Commands ───────────────────────────────────────────────
  sendCommand(vehicleId: string, command: string, params?: any): void {
    this.socket?.emit('vehicle:command', { vehicleId, command, params });
  }

  requestSnapshot(): void {
    this.socket?.emit('request:snapshot');
  }

  // ── Typed Event Listeners ──────────────────────────────────
  on<E extends EventName>(event: E, callback: EventCallback<E>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  off<E extends EventName>(event: E, callback: EventCallback<E>): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit<E extends EventName>(event: E, data: FleetEventMap[E]): void {
    this.listeners.get(event)?.forEach(cb => {
      try { cb(data); } catch (err) { console.error(`[FleetSocket] Listener error on ${event}:`, err); }
    });
  }

  // ── Connection State Listeners ─────────────────────────────
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.add(callback);
    return () => { this.connectionListeners.delete(callback); };
  }

  private notifyConnectionListeners(): void {
    this.connectionListeners.forEach(cb => cb(this._connected));
  }

  // ── Activity Feed ──────────────────────────────────────────
  onActivity(callback: (items: ActivityItem[]) => void): () => void {
    this.activityListeners.add(callback);
    return () => { this.activityListeners.delete(callback); };
  }

  private pushActivity(item: ActivityItem): void {
    this.activityLog.unshift(item);
    if (this.activityLog.length > this.maxActivityItems) {
      this.activityLog = this.activityLog.slice(0, this.maxActivityItems);
    }
    this.activityListeners.forEach(cb => cb(this.activityLog));
  }

  // ── Event Forwarding & Activity Generation ─────────────────
  private registerEventForwarding(): void {
    if (!this.socket) return;

    // Fleet positions (high frequency — no activity log)
    this.socket.on('fleet:positions', (data: any) => {
      this.emit('fleet:positions', data);
    });

    this.socket.on('fleet:snapshot', (data: any) => {
      this.emit('fleet:snapshot', data);
    });

    // Per-vehicle position
    this.socket.on('vehicle:position', (data: VehiclePosition) => {
      this.emit('vehicle:position', data);
    });

    // Telemetry (per-vehicle, high frequency — no activity log)
    this.socket.on('vehicle:telemetry', (data: TelemetryPayload) => {
      this.emit('vehicle:telemetry', data);
    });

    // Vehicle status
    this.socket.on('vehicle:status', (data: any) => {
      this.emit('vehicle:status', data);
      this.pushActivity({
        id: `status-${Date.now()}`, type: 'status', vehicleId: data.vehicleId,
        summary: `${data.vehicleId} status: ${data.oldStatus} → ${data.newStatus}`,
        timestamp: data.timestamp, data,
      });
    });

    // Alerts (medium frequency — always log)
    this.socket.on('alert:new', (data: AlertPayload) => {
      this.emit('alert:new', data);
      this.pushActivity({
        id: data.id, type: 'alert', vehicleId: data.vehicleId,
        summary: data.message, severity: data.severity,
        timestamp: data.timestamp, data,
      });
    });

    // Trip events
    for (const ev of ['trip:started', 'trip:completed', 'trip:delayed'] as const) {
      this.socket.on(ev, (data: TripEvent) => {
        this.emit(ev, data);
        const action = ev.split(':')[1];
        this.pushActivity({
          id: `trip-${data.tripId}-${action}`, type: 'trip', vehicleId: data.vehicleId,
          summary: `Trip ${data.tripId} ${action} (${data.vehicleId})`,
          timestamp: data.timestamp, data,
        });
      });
    }

    // Safety events
    this.socket.on('safety:event', (data: SafetyEvent) => {
      this.emit('safety:event' as any, data);
      this.pushActivity({
        id: data.safetyEventId, type: 'safety', vehicleId: data.vehicleId,
        summary: `Safety: ${data.eventType} on ${data.vehicleId}`, severity: data.severity,
        timestamp: data.timestamp, data,
      });
    });

    // Geofence events
    for (const ev of ['geofence:entered', 'geofence:exited'] as const) {
      this.socket.on(ev, (data: GeofenceEvent) => {
        this.emit(ev, data);
        this.pushActivity({
          id: `geo-${data.vehicleId}-${Date.now()}`, type: 'geofence', vehicleId: data.vehicleId,
          summary: `${data.vehicleId} ${data.action} ${data.geofenceName}`,
          timestamp: data.timestamp, data,
        });
      });
    }

    // Cold chain breach
    this.socket.on('coldchain:breach', (data: any) => {
      this.emit('coldchain:breach', data);
      this.pushActivity({
        id: `cc-${Date.now()}`, type: 'coldchain', vehicleId: data.vehicleId,
        summary: `Cold chain breach: ${data.temperatureC}°C in zone ${data.zone}`, severity: 'critical',
        timestamp: data.timestamp, data,
      });
    });

    // Diagnostics
    this.socket.on('diagnostics:dtc', (data: any) => {
      this.emit('diagnostics:dtc', data);
      this.pushActivity({
        id: `dtc-${Date.now()}`, type: 'diagnostics', vehicleId: data.vehicleId,
        summary: `DTC ${data.dtcCode}: ${data.description}`, severity: data.severity,
        timestamp: data.timestamp, data,
      });
    });

    this.socket.on('diagnostics:predictive', (data: any) => {
      this.emit('diagnostics:predictive', data);
      this.pushActivity({
        id: `pred-${Date.now()}`, type: 'diagnostics', vehicleId: data.vehicleId,
        summary: `Predictive: ${data.description}`, severity: data.severity,
        timestamp: data.timestamp, data,
      });
    });

    // Driver session events (Session-Block Architecture)
    this.socket.on('driver:session:started', (data: any) => {
      this.emit('driver:session:started', data);
      this.pushActivity({
        id: `session-start-${data.sessionId}`, type: 'session', vehicleId: data.vehicleId,
        summary: `${data.driverName} started session on ${data.vehicleId} (${data.authMethod})`,
        timestamp: data.timestamp, data,
      });
    });

    this.socket.on('driver:session:closed', (data: any) => {
      this.emit('driver:session:closed', data);
      const wearPct = ((data.wearIndex || 0) * 100).toFixed(0);
      this.pushActivity({
        id: `session-close-${data.sessionId}`, type: 'session', vehicleId: data.vehicleId,
        summary: `${data.driverName} ended session: ${data.distanceKm?.toFixed(0)}km, wear ${wearPct}%`,
        severity: data.wearIndex > 0.7 ? 'high' : data.wearIndex > 0.5 ? 'medium' : 'low',
        timestamp: data.timestamp, data,
      });
    });

    this.socket.on('driver:session:interrupted', (data: any) => {
      this.emit('driver:session:interrupted', data);
      this.pushActivity({
        id: `session-int-${data.sessionId}`, type: 'session', vehicleId: data.vehicleId,
        summary: `Session interrupted: ${data.driverName} on ${data.vehicleId}`,
        severity: 'medium',
        timestamp: data.timestamp, data,
      });
    });

    this.socket.on('driver:dwvs:computed', (data: any) => {
      this.emit('driver:dwvs:computed', data);
    });

    // Device events
    for (const ev of ['device:connected', 'device:disconnected'] as const) {
      this.socket.on(ev, (data: any) => {
        this.emit(ev, data);
        this.pushActivity({
          id: `dev-${Date.now()}`, type: 'device', vehicleId: data.vehicleId || '',
          summary: `Device ${data.deviceId} ${ev.split(':')[1]}`,
          timestamp: data.timestamp, data,
        });
      });
    }
  }
}

// ── Export Singleton ────────────────────────────────────────────
export const fleetSocket = new FleetSocketManager();
