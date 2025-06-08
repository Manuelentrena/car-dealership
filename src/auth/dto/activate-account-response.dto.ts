import { ApiProperty } from '@nestjs/swagger';

export class ActivateAccountResponse {
  @ApiProperty({ example: 'Cuenta activada correctamente' })
  message: string;
}
