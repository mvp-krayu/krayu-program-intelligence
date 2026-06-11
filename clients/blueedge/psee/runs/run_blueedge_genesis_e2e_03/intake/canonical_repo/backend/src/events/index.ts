export { FleetEventsModule } from './events.module';
export { FleetEventEmitter } from './fleet-event-emitter.service';
export { FleetEvents } from './types/fleet-events';
export type {
  FleetEventName,
  BaseFleetEvent,
  VehicleEvent,
  VehiclePositionEvent,
  TelemetryEvent,
  DriverEvent,
  TripEvent,
  AlertEvent,
  SafetyEventPayload,
  MaintenanceEvent,
  FuelEvent,
  GeofenceEvent,
  ColdChainEvent,
  EvEvent,
  OtaEvent,
  ComplianceEvent,
  DiagnosticEvent,
  FinanceEvent,
  SystemEvent,
  FleetEventPayload,
} from './types/fleet-events';
