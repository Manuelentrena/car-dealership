import { ApiProperty } from '@nestjs/swagger';
import { Auto } from 'database/entities/auto.entity';

export class PaginationAuto {
  @ApiProperty({ type: [Auto] })
  data: Auto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  lastPage: number;
}
