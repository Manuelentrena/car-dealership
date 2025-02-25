import { Injectable } from '@nestjs/common';
import { BrandsService } from 'src/brands/brands.service';
import { CarsService } from 'src/cars/cars.service';
import { cars, brands } from './data';

@Injectable()
export class SeedService {
  constructor(
    private readonly carsService: CarsService,
    private readonly brandsService: BrandsService,
  ) {}

  runSeed() {
    this.brandsService.populatedBrands(brands);
    this.carsService.populatedCars(cars);
    return 'Seeding completed successfully! 🚀';
  }
}
