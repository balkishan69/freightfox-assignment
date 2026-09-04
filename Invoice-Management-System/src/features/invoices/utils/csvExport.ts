import type { Invoice } from '../../../domain/types';
import { formatDate, formatStatusLabel } from '../../../domain/utils';

function escapeCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    // Escape quotes by doubling them, and wrap in quotes
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function convertInvoicesToCsv(invoices: Invoice[]): string {
  const headers = [
    'Invoice Number',
    'Status',
    'Customer Name',
    'Customer Email',
    'Issue Date',
    'Due Date',
    'Subtotal',
    'Tax',
    'Total',
    'Paid Amount'
  ];

  const rows = invoices.map(inv => [
    inv.invoiceNumber,
    formatStatusLabel(inv.status),
    inv.customer.name,
    inv.customer.email,
    formatDate(inv.issueDate),
    formatDate(inv.dueDate),
    inv.subtotal.toString(),
    inv.taxTotal.toString(),
    inv.total.toString(),
    inv.paidAmount.toString()
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.map(escapeCsvValue).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
