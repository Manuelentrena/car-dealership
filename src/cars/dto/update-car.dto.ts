import { IsOptional, IsMongoId } from 'class-validator';

export class UpdateCarDto {
  @IsOptional()
  @IsMongoId()
  readonly brand: string;

  @IsOptional()
  @IsMongoId()
  readonly model: string;
}
