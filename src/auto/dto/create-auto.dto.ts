import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAutoDto {
  @IsString()
  @IsNotEmpty()
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  readonly model: string;

  @IsNumber()
  @IsNotEmpty()
  readonly year: number;

  @Exclude()
  slug?: string;
}
