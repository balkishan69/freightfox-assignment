import type { 
  Invoice, 
  InvoiceFilters, 
  InvoiceListResponse, 
  SortField, 
  SortDirection,
  InvoiceStatus,
  User
} from '../domain/types';
import { generateMockInvoices } from '../mocks/data';
import { isValidTransition } from '../domain/status';
import { hasPermission } from '../domain/rbac';

class InvoiceStore {
  private invoices: Invoice[] = [];
  
  constructor() {
    this.invoices = generateMockInvoices(100);
  }

  getAll(): Invoice[] {
    return [...this.invoices];
  }

  getById(id: string): Invoice | undefined {
    const inv = this.invoices.find(i => i.id === id);
    return inv ? { ...inv } : undefined;
  }

  update(id: string, updates: Partial<Invoice>): Invoice {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Invoice not found');
    
    this.invoices[index] = { ...this.invoices[index], ...updates };
    return { ...this.invoices[index] };
  }
}

const store = new InvoiceStore();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface GetInvoicesParams extends InvoiceFilters {
  page?: number;
  limit?: number;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export const invoiceService = {
  
    async getInvoices(signal: AbortSignal, params: GetInvoicesParams): Promise<InvoiceListResponse> {
    await delay(600); 
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    let result = store.getAll();

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customer.name.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== 'ALL') {
      result = result.filter(inv => inv.status === params.status);
    }

    if (params.dateRange?.start) {
      const start = new Date(params.dateRange.start).getTime();
      result = result.filter(inv => new Date(inv.issueDate).getTime() >= start);
    }
    if (params.dateRange?.end) {
      const end = new Date(params.dateRange.end).getTime();
      result = result.filter(inv => new Date(inv.issueDate).getTime() <= end);
    }

    const field = params.sortField || 'issueDate';
    const dir = params.sortDirection === 'asc' ? 1 : -1;
    
    result.sort((a, b) => {
      let valA: any = a[field as keyof Invoice];
      let valB: any = b[field as keyof Invoice];

      if (field === 'customerName') {
        valA = a.customer.name;
        valB = b.customer.name;
      }
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB) * dir;
      }
      return ((valA < valB) ? -1 : (valA > valB) ? 1 : 0) * dir;
    });

    const summary = result.reduce((acc, inv) => {
      acc.totalCount++;
      acc.totalAmount += inv.total;
      acc.paidAmount += inv.paidAmount;
      if (inv.status === 'PENDING' || inv.status === 'PARTIALLY_PAID') acc.pendingAmount += (inv.total - inv.paidAmount);
      if (inv.status === 'OVERDUE') acc.overdueAmount += (inv.total - inv.paidAmount);
      return acc;
    }, {
      totalCount: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0
    });

    const page = params.page || 1;
    const limit = params.limit || 10;
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / limit);
    
    const startIndex = (page - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      },
      summary
    };
  },

    async exportInvoices(signal: AbortSignal, params: Omit<GetInvoicesParams, 'page' | 'limit'>): Promise<Invoice[]> {
    await delay(800);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    let result = store.getAll();

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customer.name.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== 'ALL') {
      result = result.filter(inv => inv.status === params.status);
    }

    if (params.dateRange?.start) {
      const start = new Date(params.dateRange.start).getTime();
      result = result.filter(inv => new Date(inv.issueDate).getTime() >= start);
    }
    if (params.dateRange?.end) {
      const end = new Date(params.dateRange.end).getTime();
      result = result.filter(inv => new Date(inv.issueDate).getTime() <= end);
    }

    const field = params.sortField || 'issueDate';
    const dir = params.sortDirection === 'asc' ? 1 : -1;
    
    result.sort((a, b) => {
      let valA: any = a[field as keyof Invoice];
      let valB: any = b[field as keyof Invoice];
      
      if (field === 'customerName') {
        valA = a.customer.name;
        valB = b.customer.name;
      }
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB) * dir;
      }
      return ((valA < valB) ? -1 : (valA > valB) ? 1 : 0) * dir;
    });

    return result;
  },

    async getInvoiceById(signal: AbortSignal, id: string): Promise<Invoice> {
    await delay(400);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    
    const invoice = store.getById(id);
    if (!invoice) throw new Error('Invoice not found');
    return invoice;
  },

    async updateStatus(signal: AbortSignal, id: string, newStatus: InvoiceStatus, user: User): Promise<Invoice> {
    await delay(800);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    
    if (!hasPermission(user, 'invoice:update')) {
      throw new Error('Forbidden: Insufficient permissions to update invoice');
    }

    const invoice = store.getById(id);
    if (!invoice) throw new Error('Invoice not found');
    
    if (!isValidTransition(invoice.status, newStatus)) {
      throw new Error(`Invalid status transition from ${invoice.status} to ${newStatus}`);
    }

    const updates: Partial<Invoice> = { status: newStatus };
    if (newStatus === 'PAID') {
      updates.paidAmount = invoice.total;
    }

    return store.update(id, updates);
  },

    async bulkUpdateStatus(signal: AbortSignal, ids: string[], newStatus: InvoiceStatus, user: User): Promise<{ successful: number, failed: number }> {
    await delay(1200);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    
    if (!hasPermission(user, 'invoice:bulk_update')) {
      throw new Error('Forbidden: Insufficient permissions for bulk operations');
    }

    let successful = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        const invoice = store.getById(id);
        if (invoice && isValidTransition(invoice.status, newStatus)) {
           const updates: Partial<Invoice> = { status: newStatus };
           if (newStatus === 'PAID') {
             updates.paidAmount = invoice.total;
           }
           store.update(id, updates);
           successful++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    return { successful, failed };
  },

    async getDashboardMetrics(signal: AbortSignal) {
    await delay(500);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    
    const all = store.getAll();
    const metrics = {
      totalInvoices: all.length,
      paidAmount: 0,
      outstandingAmount: 0,
      overdueAmount: 0,
      recentInvoices: all.slice(0, 5) 
    };

    all.forEach(inv => {
      metrics.paidAmount += inv.paidAmount;
      if (inv.status === 'PENDING' || inv.status === 'PARTIALLY_PAID') {
        metrics.outstandingAmount += (inv.total - inv.paidAmount);
      }
      if (inv.status === 'OVERDUE') {
        metrics.overdueAmount += (inv.total - inv.paidAmount);
      }
    });

    return metrics;
  }
};
