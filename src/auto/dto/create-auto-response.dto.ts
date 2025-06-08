import { ApiProperty } from '@nestjs/swagger';
import { AutoWithImages } from './auto-with-images.dto';

export class CreateAutoResponse {
  @ApiProperty({ example: '🚗 Auto created successfully' })
  message: string;

  @ApiProperty({ type: AutoWithImages })
  auto: AutoWithImages;
}
