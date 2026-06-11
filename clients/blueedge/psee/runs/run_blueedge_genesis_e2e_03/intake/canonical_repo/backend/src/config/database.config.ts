import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'blueedge',
  password: process.env.DB_PASSWORD || 'blueedge_dev_2026',
  database: process.env.DB_DATABASE || 'fleet_management',
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  synchronize: process.env.NODE_ENV === 'development' && process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  extra: { max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000 },
});
