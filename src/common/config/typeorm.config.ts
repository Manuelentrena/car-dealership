import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: parseInt(configService.get<string>('DB_PORT'), 5432),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  synchronize: false,
  entities: [
    join(__dirname, '../../dist/database/entities/**/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '../../dist/database/migrations/*.js')],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
