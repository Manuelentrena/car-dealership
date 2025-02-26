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

  async runSeed() {
    const { brands: createdBrands } =
      await this.brandsService.populateBrands(brands);

    // Paso 1: Crear un mapa de los nombres de marca a sus ObjectId correspondientes
    const brandMap = createdBrands.reduce((acc, brand) => {
      acc[brand.name] = brand._id;
      return acc;
    }, {});

    // Paso 2: Modificar los coches para asignar los ObjectId de las marcas
    const updatedCars = cars.map((car) => ({
      ...car,
      brand: brandMap[car.brand], // Asignar el ObjectId correspondiente
    }));

    // Paso 3: Poblar los coches con las referencias a las marcas
    await this.carsService.populateCars(updatedCars);
    return 'Seeding completed successfully! 🚀';
  }
}
