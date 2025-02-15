import { IsOptional, IsString } from 'class-validator';

export class UpdateCarDto {
  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  model: string;
}
