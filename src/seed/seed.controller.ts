import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRole } from 'src/common/enums';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Auth(UserRole.User)
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
