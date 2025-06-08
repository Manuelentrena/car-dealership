import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'jane.doe@example.com',
    description: 'Valid email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character. Min 6, max 50 chars.',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have an uppercase letter, a lowercase letter, and a number or special character',
  })
  password: string;

  @ApiProperty({
    example: 'Jane Doe',
    description: 'Full name of the user',
  })
  @IsString()
  fullName: string;
}
