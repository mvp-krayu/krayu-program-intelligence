import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1707800100000 implements MigrationInterface {
  name = 'SeedInitialData1707800100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Admin user (password: Admin@BlueEdge2026 — bcrypt hash)
    await queryRunner.query(`
      INSERT INTO "users" ("id", "email", "passwordHash", "firstName", "lastName", "role", "status")
      VALUES (
        uuid_generate_v4(),
        'admin@blueedge.ae',
        '$2b$12$LJ3m4ks9Rqd0NQ0e0s0XXeKZlJvE0HfXbGqJxlq3K5VVzq0bW8jG6',
        'System', 'Admin', 'admin', 'active'
      )
    `);

    // Demo fleets
    await queryRunner.query(`
      INSERT INTO "fleets" ("id", "orgId", "name", "fleetType", "operationalRegion", "status", "vehicleCount") VALUES
      ('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Dubai Tanker Fleet', 'tanker', 'Dubai / UAE', 'active', 45),
      ('a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'Abu Dhabi Bus Transit', 'bus', 'Abu Dhabi / UAE', 'active', 80),
      ('a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'Sharjah Taxi Operations', 'taxi', 'Sharjah / UAE', 'active', 120),
      ('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 'Sharjah Tanker Division', 'tanker', 'Sharjah / UAE', 'active', 25),
      ('a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001', 'Geneva Transit Fleet', 'bus', 'Geneva / Switzerland', 'active', 30)
    `);

    // Sample geofences
    await queryRunner.query(`
      INSERT INTO "geofences" ("orgId", "name", "type", "geometry", "radius", "active") VALUES
      ('b0000001-0000-0000-0000-000000000001', 'Jebel Ali Free Zone', 'inclusion', '{"type":"circle","center":{"lat":25.0048,"lng":55.0655}}', 5000, true),
      ('b0000001-0000-0000-0000-000000000001', 'ADNOC Ruwais Terminal', 'loading_zone', '{"type":"circle","center":{"lat":24.0889,"lng":52.7306}}', 2000, true),
      ('b0000001-0000-0000-0000-000000000001', 'Dubai Creek Speed Zone', 'speed_zone', '{"type":"circle","center":{"lat":25.2582,"lng":55.2975}}', 1500, true),
      ('b0000001-0000-0000-0000-000000000001', 'Sharjah Airport Exclusion', 'exclusion', '{"type":"circle","center":{"lat":25.3285,"lng":55.5171}}', 3000, true),
      ('b0000001-0000-0000-0000-000000000001', 'Mombasa Port Terminal', 'loading_zone', '{"type":"circle","center":{"lat":-4.0435,"lng":39.6682}}', 3000, true)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "geofences"`);
    await queryRunner.query(`DELETE FROM "fleets"`);
    await queryRunner.query(`DELETE FROM "users" WHERE "email" = 'admin@blueedge.ae'`);
  }
}
