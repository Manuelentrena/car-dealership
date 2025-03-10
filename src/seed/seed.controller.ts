import { Controller, ForbiddenException, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  execute() {
    // if (process.env.NODE_ENV === 'development') {
    // console.log('This endpoint only runs in development');
    // this.seedService.runSeed();
    this.seedService.runSeedInPostgres();
    return 'Seed executed';
    // }
    // throw new ForbiddenException(
    //   'This endpoint is only available in development mode',
    // );
  }
}
