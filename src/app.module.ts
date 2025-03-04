import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { BrandsModule } from './brands/brands.module';
import { SeedModule } from './seed/seed.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ModelModule } from './models/model.module';
import { EnvConfiguration } from './common/config/env.config';
import { envValidationSchema } from './common/config/env.validation';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
      validationSchema: envValidationSchema,
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
