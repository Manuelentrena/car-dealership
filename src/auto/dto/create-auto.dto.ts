import { Exclude, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => v === 'true');
    }
    return [value === 'true'];
  })
  @IsBoolean({ each: true })
  isPublicImages?: boolean[];
}
