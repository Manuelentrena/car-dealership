import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

export function createUserRoleGuard(roles: string[]): CanActivate {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new ForbiddenException('Usuario no autenticado');
      }

      const userRoles = user.roles || [];

      const hasRole = roles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException('No tienes los roles necesarios');
      }

      return true;
    }
  }

  return new RoleGuardMixin();
}
