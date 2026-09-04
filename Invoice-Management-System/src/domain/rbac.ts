import type { Role, Permission, User } from './types';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'invoice:read',
    'invoice:create',
    'invoice:update',
    'invoice:cancel',
    'invoice:delete',
    'invoice:export',
    'invoice:bulk_update'
  ],
  FINANCE_MANAGER: [
    'invoice:read',
    'invoice:create',
    'invoice:update',
    'invoice:cancel',
    'invoice:export',
    'invoice:bulk_update'
  ],
  ACCOUNTANT: [
    'invoice:read',
    'invoice:update',
    'invoice:export'
  ],
  VIEWER: [
    'invoice:read'
  ]
};

export function hasPermission(user: User, permission: Permission): boolean {
  if (!user || !user.role) return false;
  
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
}

export const MOCK_USERS: Record<Role, User> = {
  ADMIN: { id: 'u1', name: 'Admin User', email: 'admin@freightfox.com', role: 'ADMIN' },
  FINANCE_MANAGER: { id: 'u2', name: 'Finance Mgr', email: 'finance@freightfox.com', role: 'FINANCE_MANAGER' },
  ACCOUNTANT: { id: 'u3', name: 'Accountant', email: 'accountant@freightfox.com', role: 'ACCOUNTANT' },
  VIEWER: { id: 'u4', name: 'Viewer', email: 'viewer@freightfox.com', role: 'VIEWER' }
};
