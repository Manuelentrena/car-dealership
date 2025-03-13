import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auto } from 'database/entities/auto.entity';
import { BrandsModule } from 'src/brands/brands.module';
import { CarsModule } from 'src/cars/cars.module';
import { ModelModule } from 'src/models/model.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    CarsModule,
    BrandsModule,
    ModelModule,
    TypeOrmModule.forFeature([Auto]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
