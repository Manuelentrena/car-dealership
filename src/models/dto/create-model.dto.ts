import { IsString, MinLength } from 'class-validator';

export class CreateModelDto {
  @IsString()
  @MinLength(1)
  readonly name: string;
}
