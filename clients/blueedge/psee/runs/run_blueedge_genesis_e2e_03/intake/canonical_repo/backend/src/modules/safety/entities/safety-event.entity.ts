import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('safety_events')
@Index(['vehicleId', 'eventTime'])
@Index(['driverId', 'eventTime'])
@Index(['severity', 'status'])
@Index(['eventType'])
export class SafetyEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true })
  tripId: string;

  @Column({ type: 'enum', enum: [
    'harsh_braking', 'harsh_acceleration', 'harsh_cornering', 'speeding',
    'rollover_risk', 'collision_warning', 'collision_detected', 'lane_departure',
    'fatigue_detected', 'distraction_detected', 'seatbelt_violation',
    'tailgating', 'red_light', 'stop_sign', 'phone_use', 'smoking',
    'cargo_shift', 'gas_leak', 'temperature_breach', 'overfill', 'panic_button'
  ] })
  eventType: string;

  @Column({ type: 'enum', enum: ['critical', 'high', 'medium', 'low'], default: 'medium' })
  severity: string;

  @Column({ type: 'timestamp' })
  eventTime: Date;

  @Column({ type: 'int', nullable: true, comment: 'Duration in milliseconds' })
  durationMs: number;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'float', nullable: true })
  speed: number;

  @Column({ type: 'float', nullable: true })
  heading: number;

  @Column({ type: 'jsonb', nullable: true, comment: 'IMU readings, thresholds, values' })
  sensorData: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  videoClips: Array<{
    cameraId: string;
    url: string;
    startTime: string;
    endTime: string;
  }>;

  @Column({ type: 'enum', enum: ['open', 'acknowledged', 'reviewed', 'dismissed', 'escalated'], default: 'open' })
  status: string;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ type: 'text', nullable: true })
  reviewNotes: string;

  @Column({ type: 'float', nullable: true, comment: 'AI confidence 0-1' })
  confidenceScore: number;

  @CreateDateColumn()
  createdAt: Date;
}
