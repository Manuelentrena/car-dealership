import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRole } from 'src/common/enums';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@ApiBearerAuth()
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Auth(UserRole.User)
  @Get()
  @ApiOperation({ summary: 'Run database seed and migrations in PostgreSQL' })
  @ApiResponse({
    status: 200,
    description: 'Seed executed successfully.',
    type: String,
  })
  execute() {
    this.seedService.runSeedInPostgres();
    return 'Seed executed';
  }
}
