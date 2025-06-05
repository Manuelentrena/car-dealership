import { applyDecorators, CanActivate, Type, UseGuards } from '@nestjs/common';
import { UserRole } from '../enums';
import { JwtAuthGuard, UserRoleGuard } from '../guards';

export function Auth(...roles: UserRole[]) {
  const guards: Type<CanActivate>[] = [JwtAuthGuard];

  if (roles.length > 0) {
    guards.push(UserRoleGuard(roles));
  }

  return applyDecorators(UseGuards(...guards));
}
