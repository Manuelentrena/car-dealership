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
import { AutoModule } from './auto/auto.module';
import typeormConfiguration from './common/config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration, typeormConfiguration],
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
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
      exclude: ['/api/{*test}'],
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
    CarsModule,
    BrandsModule,
    SeedModule,
    CommonModule,
    ModelModule,
    HealthModule,
    AutoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
