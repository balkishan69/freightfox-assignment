import { describe, it, expect } from 'vitest';
import { convertInvoicesToCsv } from './csvExport.ts';
import type { Invoice } from '../../../domain/types.ts';

describe('CSV Export', () => {
  it('correctly escapes commas and quotes in customer names', () => {
    const mockInvoice: Invoice = {
      id: '1',
      invoiceNumber: 'INV-001',
      status: 'PAID',
      customerId: 'c1',
      customer: {
        id: 'c1',
        name: 'Acme, Inc "Global"',
        email: 'test@acme.com',
        address: '123 St'
      },
      issueDate: '2023-01-01T10:00:00Z',
      dueDate: '2023-01-31T10:00:00Z',
      items: [],
      subtotal: 100,
      taxTotal: 10,
      total: 110,
      paidAmount: 110
    };

    const csv = convertInvoicesToCsv([mockInvoice]);
    
    expect(csv).toContain('"Acme, Inc ""Global"""');
  });
});
