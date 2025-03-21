import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateAutoDto } from './create-auto.dto';

export class UpdateAutoDto extends PartialType(CreateAutoDto) {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly model: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  readonly year: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];
}
