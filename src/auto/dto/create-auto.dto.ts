import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Toyota', description: 'Brand of the car' })
  @IsString()
  @IsNotEmpty()
  readonly brand: string;

  @ApiProperty({ example: 'Corolla', description: 'Model of the car' })
  @IsString()
  @IsNotEmpty()
  readonly model: string;

  @ApiProperty({ example: 2023, description: 'Year of manufacture' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  readonly year: number;

  @Exclude() // no se documenta, excluido explícitamente
  slug?: string;

  @ApiProperty({
    type: [String],
    example: ['Air Conditioning', 'Bluetooth'],
    description: 'List of features',
  })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: 'Images of the car',
  })
  @IsArray()
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: [Boolean],
    description:
      'Visibility of each image (true for public, false for private). Must match image count.',
    example: [true, false],
  })
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
