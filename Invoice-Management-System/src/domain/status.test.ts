import { describe, it, expect } from 'vitest';
import { isValidTransition, getAvailableNextStatuses } from './status';
import type { User } from './types';

describe('status transition logic', () => {
  it('allows valid transitions', () => {
    expect(isValidTransition('DRAFT', 'PENDING')).toBe(true);
    expect(isValidTransition('PENDING', 'PAID')).toBe(true);
    expect(isValidTransition('OVERDUE', 'PAID')).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(isValidTransition('DRAFT', 'PAID')).toBe(false);
    expect(isValidTransition('PAID', 'PENDING')).toBe(false);
    expect(isValidTransition('CANCELLED', 'PAID')).toBe(false);
  });

  it('rejects same-status transitions', () => {
    expect(isValidTransition('PENDING', 'PENDING')).toBe(false);
  });
});

describe('getAvailableNextStatuses with RBAC', () => {
  const adminUser: User = { id: '1', name: 'Admin', email: '', role: 'ADMIN' };
  const viewerUser: User = { id: '2', name: 'Viewer', email: '', role: 'VIEWER' };

  it('returns available statuses for users with update permission', () => {
    const statuses = getAvailableNextStatuses('PENDING', adminUser);
    expect(statuses).toEqual(['PAID', 'PARTIALLY_PAID', 'CANCELLED']);
  });

  it('returns empty array for users without update permission', () => {
    const statuses = getAvailableNextStatuses('PENDING', viewerUser);
    expect(statuses).toEqual([]);
  });

  it('filters out CANCELLED for users without cancel permission', () => {
    const accountantUser: User = { id: '3', name: 'Acct', email: '', role: 'ACCOUNTANT' };
    const statuses = getAvailableNextStatuses('PENDING', accountantUser);
    
    expect(statuses).toEqual(['PAID', 'PARTIALLY_PAID']);
  });
});
