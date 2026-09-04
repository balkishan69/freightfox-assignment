export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';

export interface Customer {
  id: string;
  name: string;
  email: string;
  address?: string;
  taxId?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; 
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  customerId: string;
  customer: Customer; 
  issueDate: string; 
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  paidAmount: number;
  notes?: string;
}

export type Role = 'ADMIN' | 'FINANCE_MANAGER' | 'ACCOUNTANT' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type Permission = 
  | 'invoice:read'
  | 'invoice:create'
  | 'invoice:update'
  | 'invoice:cancel'
  | 'invoice:delete'
  | 'invoice:export'
  | 'invoice:bulk_update';

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export type SortField = 'invoiceNumber' | 'issueDate' | 'dueDate' | 'total' | 'status' | 'customerName';
export type SortDirection = 'asc' | 'desc';

export interface InvoiceFilters {
  search?: string;
  status?: InvoiceStatus | 'ALL';
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface InvoiceListResponse {
  data: Invoice[];
  pagination: PaginationMetadata;
  summary: {
    totalCount: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
  };
}
