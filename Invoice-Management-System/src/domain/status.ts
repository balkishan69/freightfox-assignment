import type { InvoiceStatus, User } from './types';
import { hasPermission } from './rbac.ts';

export const VALID_STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  DRAFT: ['PENDING', 'CANCELLED'],
  PENDING: ['PAID', 'PARTIALLY_PAID', 'CANCELLED'],
  PARTIALLY_PAID: ['PAID', 'CANCELLED'],
  OVERDUE: ['PAID', 'CANCELLED'],
  PAID: [], 
  CANCELLED: [], 
};

export function isValidTransition(currentStatus: InvoiceStatus, newStatus: InvoiceStatus): boolean {
  if (currentStatus === newStatus) return false;
  
  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
  return allowedTransitions.includes(newStatus);
}

export function getAvailableNextStatuses(
  currentStatus: InvoiceStatus, 
  user: User
): InvoiceStatus[] {
  
  if (!hasPermission(user, 'invoice:update')) {
    return [];
  }
  
  let available = VALID_STATUS_TRANSITIONS[currentStatus] || [];

  if (!hasPermission(user, 'invoice:cancel')) {
    available = available.filter(status => status !== 'CANCELLED');
  }

  return available;
}
