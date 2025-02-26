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

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = `mongodb://${configService.get<string>('MONGO_ROOT_USERNAME')}:${configService.get<string>('MONGO_ROOT_PASSWORD')}@${configService.get<string>('MONGO_HOST')}:${configService.get<string>('MONGO_PORT', '27017')}/car_leadership?authSource=admin`;

        // Imprimir la URI en consola
        console.log('MongoDB URI:', uri);

        return { uri };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CarsModule,
    BrandsModule,
    SeedModule,
    CommonModule,
    ModelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
