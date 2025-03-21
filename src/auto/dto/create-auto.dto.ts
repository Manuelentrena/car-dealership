import { Exclude, Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAutoDto {
  @IsString()
  @IsNotEmpty()
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  readonly model: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  readonly year: number;

  @Exclude()
  slug?: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsArray()
  @IsOptional()
  images?: Express.Multer.File[];
}
