import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCarDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  readonly model: string;
}
