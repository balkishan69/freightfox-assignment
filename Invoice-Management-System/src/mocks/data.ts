import type { Invoice, InvoiceStatus, Customer, InvoiceItem } from '../domain/types';

const STATUSES: InvoiceStatus[] = ['DRAFT', 'PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED'];

const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Acme Corp', email: 'billing@acme.com', address: '123 Acme St, NY', taxId: 'TAX-1234' },
  { id: 'c2', name: 'Globex Inc', email: 'finance@globex.com', address: '456 Globex Ave, SF', taxId: 'TAX-5678' },
  { id: 'c3', name: 'Initech', email: 'accounts@initech.com', address: '789 Initech Pkwy, TX', taxId: 'TAX-9012' },
  { id: 'c4', name: 'Stark Industries', email: 'tony@stark.com', address: '10880 Malibu Point, CA' },
  { id: 'c5', name: 'Wayne Enterprises', email: 'bruce@wayne.com', address: '1007 Mountain Drive, Gotham' },
];

const ITEMS = [
  { desc: 'Logistics Software License (Annual)', price: 12000 },
  { desc: 'Consulting Services (Hours)', price: 150 },
  { desc: 'Server Maintenance', price: 450 },
  { desc: 'Custom Dashboard Development', price: 3500 },
  { desc: 'API Integration Setup', price: 2000 },
];

function generateRandomItems(): InvoiceItem[] {
  const count = Math.floor(Math.random() * 4) + 1;
  const items: InvoiceItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    items.push({
      id: `item-${Math.random().toString(36).substr(2, 9)}`,
      description: template.desc,
      quantity,
      unitPrice: template.price,
      taxRate: 0.1, 
    });
  }
  return items;
}

export function generateMockInvoices(count: number): Invoice[] {
  const invoices: Invoice[] = [];
  
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];

    const issueDate = new Date(today);
    issueDate.setDate(today.getDate() - Math.floor(Math.random() * 60)); 
    
    const dueDate = new Date(issueDate);
    dueDate.setDate(issueDate.getDate() + 30); 

    let finalStatus = status;
    if (dueDate < today && (finalStatus === 'PENDING' || finalStatus === 'PARTIALLY_PAID')) {
      finalStatus = 'OVERDUE';
    }
    
    const items = generateRandomItems();
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate), 0);
    const total = subtotal + taxTotal;
    
    let paidAmount = 0;
    if (finalStatus === 'PAID') {
      paidAmount = total;
    } else if (finalStatus === 'PARTIALLY_PAID') {
      paidAmount = Math.floor(total * (Math.random() * 0.8 + 0.1)); 
    }

    invoices.push({
      id: `inv-${1000 + i}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(1000 + i).padStart(4, '0')}`,
      status: finalStatus,
      customerId: customer.id,
      customer,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      items,
      subtotal,
      taxTotal,
      total,
      paidAmount,
      notes: Math.random() > 0.8 ? 'Please pay within 30 days.' : undefined
    });
  }

  return invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
}
