import { IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  readonly name: string;
}
