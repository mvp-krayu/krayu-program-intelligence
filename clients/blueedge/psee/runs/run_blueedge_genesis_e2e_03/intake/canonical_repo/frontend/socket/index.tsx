import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  fleetSocket,
  type VehiclePosition,
  type TelemetryPayload,
  type AlertPayload,
  type ActivityItem,
  type FleetEventMap,
  type DriverSessionStartedPayload,
  type DriverSessionClosedPayload,
  type DriverDwvsPayload,
} from './FleetSocket';

// ── Context ─────────────────────────────────────────────────────
interface SocketContextValue {
  connected: boolean;
  reconnecting: boolean;
  clientId: string;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextValue>({
  connected: false,
  reconnecting: false,
  clientId: '',
  connect: () => {},
  disconnect: () => {},
});

export function useSocketContext() {
  return useContext(SocketContext);
}

// ── Provider ────────────────────────────────────────────────────
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    const unsub = fleetSocket.onConnectionChange((c) => {
      setConnected(c);
      setReconnecting(!c && fleetSocket.reconnectCount > 0);
    });

    const unsubAck = fleetSocket.on('connection:ack', (data) => {
      setClientId(data.clientId);
    });

    // Auto-connect
    fleetSocket.connect();

    return () => {
      unsub();
      unsubAck();
    };
  }, []);

  const connect = useCallback(() => fleetSocket.connect(), []);
  const disconnect = useCallback(() => fleetSocket.disconnect(), []);

  return (
    <SocketContext.Provider value={{ connected, reconnecting, clientId, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
}

// ── Hook: useFleetPositions ─────────────────────────────────────
/** Subscribe to all fleet positions (2s interval). Optionally filter by fleet type. */
export function useFleetPositions(fleetType?: 'tanker' | 'bus' | 'taxi') {
  const [positions, setPositions] = useState<VehiclePosition[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fleetSocket.subscribeFleet(fleetType);

    const unsub = fleetSocket.on('fleet:positions', (data) => {
      setPositions(data.positions);
      setLastUpdate(data.timestamp);
    });

    // Also request an initial snapshot
    fleetSocket.requestSnapshot();
    const unsubSnap = fleetSocket.on('fleet:snapshot', (data) => {
      const filtered = fleetType
        ? data.positions.filter(p => p.fleetType === fleetType)
        : data.positions;
      setPositions(filtered);
      setLastUpdate(data.timestamp);
    });

    return () => {
      unsub();
      unsubSnap();
      const room = fleetType ? `fleet:${fleetType}` : 'fleet:all';
      fleetSocket.unsubscribe(room);
    };
  }, [fleetType]);

  return { positions, lastUpdate, count: positions.length };
}

// ── Hook: useVehicleTelemetry ───────────────────────────────────
/** Subscribe to a specific vehicle's position + telemetry stream. */
export function useVehicleTelemetry(vehicleId: string | null) {
  const [position, setPosition] = useState<VehiclePosition | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryPayload | null>(null);

  useEffect(() => {
    if (!vehicleId) return;

    fleetSocket.subscribeVehicle(vehicleId);

    const unsubPos = fleetSocket.on('vehicle:position', (data) => {
      if (data.vehicleId === vehicleId) setPosition(data);
    });

    const unsubTel = fleetSocket.on('vehicle:telemetry', (data) => {
      if (data.vehicleId === vehicleId) setTelemetry(data);
    });

    return () => {
      unsubPos();
      unsubTel();
      fleetSocket.unsubscribeVehicle(vehicleId);
    };
  }, [vehicleId]);

  return { position, telemetry };
}

// ── Hook: useAlertStream ────────────────────────────────────────
/** Subscribe to real-time alert stream. Keeps a rolling buffer. */
export function useAlertStream(options?: { severity?: string; maxItems?: number }) {
  const max = options?.maxItems ?? 50;
  const [alerts, setAlerts] = useState<AlertPayload[]>([]);
  const [latestAlert, setLatestAlert] = useState<AlertPayload | null>(null);

  useEffect(() => {
    fleetSocket.subscribeAlerts(options?.severity);

    const unsub = fleetSocket.on('alert:new', (alert) => {
      setLatestAlert(alert);
      setAlerts(prev => {
        const next = [alert, ...prev];
        return next.length > max ? next.slice(0, max) : next;
      });
    });

    return () => {
      unsub();
      const room = options?.severity ? `alerts:${options.severity}` : 'alerts:all';
      fleetSocket.unsubscribe(room);
    };
  }, [options?.severity, max]);

  const clear = useCallback(() => { setAlerts([]); setLatestAlert(null); }, []);

  return { alerts, latestAlert, count: alerts.length, clear };
}

// ── Hook: useActivityFeed ───────────────────────────────────────
/** Subscribe to the unified activity feed (alerts, trips, geofence, safety, etc.). */
export function useActivityFeed(maxItems = 100) {
  const [items, setItems] = useState<ActivityItem[]>(fleetSocket.activity.slice(0, maxItems));

  useEffect(() => {
    const unsub = fleetSocket.onActivity((all) => {
      setItems(all.slice(0, maxItems));
    });
    return unsub;
  }, [maxItems]);

  return items;
}

// ── Hook: useSocketEvent ────────────────────────────────────────
/** Generic hook — subscribe to any fleet event. */
export function useSocketEvent<E extends keyof FleetEventMap>(
  event: E,
  callback: (data: FleetEventMap[E]) => void,
  deps: any[] = []
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    const unsub = fleetSocket.on(event, (data) => cbRef.current(data));
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps]);
}

// ── Hook: useVehicleCommand ─────────────────────────────────────
/** Send commands to vehicles via WebSocket. */
export function useVehicleCommand() {
  const send = useCallback((vehicleId: string, command: string, params?: any) => {
    fleetSocket.sendCommand(vehicleId, command, params);
  }, []);
  return { sendCommand: send };
}

// ── Hook: useDriverSessions ─────────────────────────────────────
/** Subscribe to real-time driver session events. */
export function useDriverSessions(vehicleId?: string) {
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [latestEvent, setLatestEvent] = useState<any>(null);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    fleetSocket.subscribeSessions(vehicleId);

    const unsubStart = fleetSocket.on('driver:session:started', (data) => {
      if (vehicleId && data.vehicleId !== vehicleId) return;
      setLatestEvent({ type: 'started', ...data });
      setActiveSessions(prev => [...prev, data]);
      setSessionCount(c => c + 1);
    });

    const unsubClose = fleetSocket.on('driver:session:closed', (data) => {
      if (vehicleId && data.vehicleId !== vehicleId) return;
      setLatestEvent({ type: 'closed', ...data });
      setActiveSessions(prev => prev.filter(s => s.sessionId !== data.sessionId));
    });

    const unsubInterrupt = fleetSocket.on('driver:session:interrupted', (data) => {
      if (vehicleId && data.vehicleId !== vehicleId) return;
      setLatestEvent({ type: 'interrupted', ...data });
      setActiveSessions(prev => prev.filter(s => s.sessionId !== data.sessionId));
    });

    return () => {
      unsubStart();
      unsubClose();
      unsubInterrupt();
      const room = vehicleId ? `sessions:vehicle:${vehicleId}` : 'sessions:all';
      fleetSocket.unsubscribe(room);
    };
  }, [vehicleId]);

  return { activeSessions, latestEvent, sessionCount };
}

// ── Hook: useDwvsStream ─────────────────────────────────────────
/** Subscribe to real-time DWVS computation events. */
export function useDwvsStream() {
  const [dwvsUpdates, setDwvsUpdates] = useState<Map<string, { driverId: string; driverName: string; dwvs: number; timestamp: string }>>(new Map());

  useEffect(() => {
    fleetSocket.subscribeSessions();

    const unsub = fleetSocket.on('driver:dwvs:computed', (data) => {
      setDwvsUpdates(prev => {
        const next = new Map(prev);
        next.set(`${data.vehicleId}:${data.driverId}`, { driverId: data.driverId, driverName: data.driverName, dwvs: data.dwvs, timestamp: data.timestamp });
        return next;
      });
    });

    return () => {
      unsub();
      fleetSocket.unsubscribe('sessions:all');
    };
  }, []);

  return { dwvsUpdates: Array.from(dwvsUpdates.values()) };
}

// ── Re-export types ─────────────────────────────────────────────
export type {
  VehiclePosition, TelemetryPayload, AlertPayload, ActivityItem,
  DriverSessionStartedPayload, DriverSessionClosedPayload, DriverDwvsPayload,
};
export { fleetSocket };
