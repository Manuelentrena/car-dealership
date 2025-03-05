import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { BrandsModule } from './brands/brands.module';
import { CarsModule } from './cars/cars.module';
import { CommonModule } from './common/common.module';
import { EnvConfiguration } from './common/config/env.config';
import { envValidationSchema } from './common/config/env.validation';
import { HealthModule } from './health/health.module';
import { ModelModule } from './models/model.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('postgres.host'),
        port: configService.get<number>('postgres.port'),
        username: configService.get<string>('postgres.username'),
        password: configService.get<string>('postgres.password'),
        database: configService.get<string>('postgres.database'),
        autoLoadEntities: configService.get<boolean>(
          'postgres.autoLoadEntities',
        ),
        entities: ['dist/**/*.entity{.ts,.js}'],
        migrations: [
          join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}'),
        ],
        migrationsTableName: '_migrations',
        migrationsRun: true,
        synchronize: configService.get<boolean>('postgres.synchronize'),
        logging: true,
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const mongoConfig = configService.get('mongo');
        const uri = mongoConfig.uri;

        // Imprimir la URI en consola
        if (process.env.NODE_ENV === 'development') {
          console.log('MongoDB URI:', uri);
          console.log('Enviroment:', process.env.NODE_ENV);
        }

        return { uri };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    CarsModule,
    BrandsModule,
    SeedModule,
    CommonModule,
    ModelModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
