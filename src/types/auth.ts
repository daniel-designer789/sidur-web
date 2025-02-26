export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete';
  resource: 'shifts' | 'employees' | 'departments' | 'reports';
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    { action: 'create', resource: 'shifts' },
    { action: 'read', resource: 'shifts' },
    { action: 'update', resource: 'shifts' },
    { action: 'delete', resource: 'shifts' },
    { action: 'create', resource: 'employees' },
    { action: 'read', resource: 'employees' },
    { action: 'update', resource: 'employees' },
    { action: 'delete', resource: 'employees' },
    { action: 'create', resource: 'departments' },
    { action: 'read', resource: 'departments' },
    { action: 'update', resource: 'departments' },
    { action: 'delete', resource: 'departments' },
    { action: 'read', resource: 'reports' },
  ],
  MANAGER: [
    { action: 'create', resource: 'shifts' },
    { action: 'read', resource: 'shifts' },
    { action: 'update', resource: 'shifts' },
    { action: 'read', resource: 'employees' },
    { action: 'read', resource: 'departments' },
    { action: 'read', resource: 'reports' },
  ],
  EMPLOYEE: [
    { action: 'read', resource: 'shifts' },
  ],
}; 