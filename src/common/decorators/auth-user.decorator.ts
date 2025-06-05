import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const AuthUser = createParamDecorator(
  <T = any>(
    data: keyof T | undefined,
    ctx: ExecutionContext,
  ): T | T[keyof T] => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException(
        'No authenticated user found in request',
      );
    }

    return data ? user?.[data] : user;
  },
);
