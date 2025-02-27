import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(1, { message: 'Page must be greater than 0' })
  @Type(() => Number)
  readonly page: number;

  @IsInt()
  @Min(1, { message: 'Limit must be greater than 0' })
  @Type(() => Number)
  readonly limit: number;
}
