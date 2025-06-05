import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  <T = any>(
    data: keyof T | undefined,
    ctx: ExecutionContext,
  ): T | T[keyof T] => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
