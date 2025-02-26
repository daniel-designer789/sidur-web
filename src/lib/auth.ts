import { User, Permission, rolePermissions } from '@/types/auth';

export function hasPermission(user: User, permission: Permission): boolean {
  const userPermissions = rolePermissions[user.role];
  return userPermissions.some(
    (p) => p.action === permission.action && p.resource === permission.resource
  );
}

export function canManageShifts(user: User): boolean {
  return hasPermission(user, { action: 'create', resource: 'shifts' }) &&
         hasPermission(user, { action: 'update', resource: 'shifts' });
}

export function canViewReports(user: User): boolean {
  return hasPermission(user, { action: 'read', resource: 'reports' });
}

export function canManageEmployees(user: User): boolean {
  return hasPermission(user, { action: 'create', resource: 'employees' }) &&
         hasPermission(user, { action: 'update', resource: 'employees' });
} 