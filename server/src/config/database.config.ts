import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get('DB_USER'),
  password: config.get('DB_PASS'),
  database: config.get('DB_NAME'),
  autoLoadEntities: true,
  synchronize: config.get('NODE_ENV') !== 'production',
  logging: config.get('NODE_ENV') === 'development',
  ssl: config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
  extra: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
  },
});
