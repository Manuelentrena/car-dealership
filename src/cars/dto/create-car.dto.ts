import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateCarDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly brand: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly model: string;
}
