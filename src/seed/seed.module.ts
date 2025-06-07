import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoImage } from 'database/entities/auto-image.entity';
import { Auto } from 'database/entities/auto.entity';
import { User } from 'database/entities/user.entity';
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
    TypeOrmModule.forFeature([Auto, User, AutoImage]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
