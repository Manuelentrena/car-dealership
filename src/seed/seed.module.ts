import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CarsModule } from 'src/cars/cars.module';
import { BrandsModule } from 'src/brands/brands.module';
import { ModelModule } from 'src/models/model.module';

@Module({
  imports: [CarsModule, BrandsModule, ModelModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
