import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
  readonly year: number;
}
