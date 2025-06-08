import { ApiProperty } from '@nestjs/swagger';
import { Auto } from 'database/entities/auto.entity';

export class RegisterUserResponse {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'Jane Doe' })
  fullName: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: ['user', 'admin'] })
  roles: string[];

  @ApiProperty({
    type: () => [Auto],
    description: 'List of user cars (if any)',
    required: false,
  })
  autos: Auto[];

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-02T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: null })
  deletedAt: Date;
}
