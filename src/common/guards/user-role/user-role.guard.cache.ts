import { CanActivate, Type } from '@nestjs/common';

const guardCache = new Map<string, Type<CanActivate>>();

export function getCachedGuard(key: string): Type<CanActivate> | undefined {
  return guardCache.get(key);
}

export function setCachedGuard(key: string, guard: Type<CanActivate>) {
  guardCache.set(key, guard);
}
