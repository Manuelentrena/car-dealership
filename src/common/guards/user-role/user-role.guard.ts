import { CanActivate, mixin, Type } from '@nestjs/common';
import { getCachedGuard, setCachedGuard } from './user-role.guard.cache';
import { createUserRoleGuard } from './user-role.guard.factory';

export function UserRoleGuard(roles: string[]): Type<CanActivate> {
  const key = [...roles].sort().join('|');

  const cachedGuard = getCachedGuard(key);
  if (cachedGuard) return cachedGuard;

  const RoleGuardClass = createUserRoleGuard(roles);
  const Guard = mixin(RoleGuardClass.constructor as Type<CanActivate>);

  setCachedGuard(key, Guard);
  return Guard;
}
