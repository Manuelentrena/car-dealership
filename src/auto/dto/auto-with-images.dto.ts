import { ApiProperty } from '@nestjs/swagger';
import { AutoImage } from 'database/entities/auto-image.entity';

export class AutoWithImages {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  slug: string;

  @ApiProperty({ type: [AutoImage] })
  images: AutoImage[];
}
