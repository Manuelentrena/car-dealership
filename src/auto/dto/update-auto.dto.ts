import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAutoDto } from './create-auto.dto';

export class UpdateAutoDto extends PartialType(CreateAutoDto) {
  @ApiPropertyOptional({
    example: 'Ford',
    description: 'Updated brand of the car',
  })
  brand?: string;

  @ApiPropertyOptional({
    example: 'Focus',
    description: 'Updated model of the car',
  })
  model?: string;

  @ApiPropertyOptional({
    example: 2021,
    description: 'Updated manufacturing year',
  })
  year?: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['GPS', 'Sunroof'],
    description: 'Updated list of features',
  })
  features?: string[];
}
