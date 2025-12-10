import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../constants/roles.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roleType) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso',
      );
    }

    const hasRole = requiredRoles.some((role) => user.roleType.code === role);

    if (!hasRole) {
      const roleNames = {
        ADMIN: 'Administrador',
        USER: 'Usuario',
        EMP: 'Empleado',
      };

      const requiredRoleNames = requiredRoles
        .map((role) => roleNames[role] || role)
        .join(' o ');

      throw new ForbiddenException(
        `No tienes permisos para acceder a este recurso. Se requiere rol: ${requiredRoleNames}`,
      );
    }

    return true;
  }
}
