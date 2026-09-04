import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, 
  Download, CheckCircle 
} from 'lucide-react';
import { invoiceService } from '../../../services/invoiceService';
import type { GetInvoicesParams } from '../../../services/invoiceService';
import { useAsync } from '../../../hooks/useAsync';
import { useUrlParams } from '../../../hooks/useUrlParams';
import { useDebounce } from '../../../hooks/useDebounce';
import { useAuth } from '../../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../../domain/utils';
import type { InvoiceStatus, SortField, SortDirection, Invoice } from '../../../domain/types';
import { hasPermission } from '../../../domain/rbac';
import { convertInvoicesToCsv, downloadCsv } from '../utils/csvExport';
import { Button, Input, Badge, Spinner } from '../../../components/ui';
import clsx from 'clsx';
import styles from './invoiceList.module.css';

export const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getParam, setParam, setMultipleParams } = useUrlParams();

  const page = parseInt(getParam('page') || '1', 10);
  const sortField = (getParam('sortField') as SortField) || 'issueDate';
  const sortDirection = (getParam('sortDirection') as SortDirection) || 'desc';
  const statusFilter = (getParam('status') as InvoiceStatus | 'ALL') || 'ALL';
  const rawSearch = getParam('search') || '';

  // Local State for Search Input (debounced)
  const [searchInput, setSearchInput] = useState(rawSearch);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sync back from URL if it changes externally (e.g. back button)
  useEffect(() => {
    setSearchInput(rawSearch);
  }, [rawSearch]);

  // Sync debounced search to URL
  useEffect(() => {
    const currentSearchParam = getParam('search') || '';
    if (debouncedSearch !== currentSearchParam) {
      setMultipleParams({ search: debouncedSearch, page: '1' }); 
      setSelectedIds(new Set()); 
    }
  }, [debouncedSearch, getParam, setMultipleParams]);

  const { execute: fetchInvoices, data: response, status: fetchStatus } = useAsync(invoiceService.getInvoices);
  const [isExporting, setIsExporting] = useState(false);
  const { execute: executeBulkAction, status: bulkActionStatus } = useAsync(invoiceService.bulkUpdateStatus);

  const fetchParams = useMemo<GetInvoicesParams>(() => ({
    page,
    limit: 10,
    sortField,
    sortDirection,
    status: statusFilter,
    search: debouncedSearch
  }), [page, sortField, sortDirection, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchInvoices(fetchParams);
  }, [fetchParams, fetchInvoices]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setParam('sortDirection', sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setMultipleParams({ sortField: field, sortDirection: 'asc', page: '1' });
      setSelectedIds(new Set()); 
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMultipleParams({ status: e.target.value, page: '1' });
    setSelectedIds(new Set()); 
  };

  const handlePageChange = (newPage: number) => {
    setParam('page', newPage.toString());
  };

  const toggleSelectAll = () => {
    if (!response?.data) return;
    if (selectedIds.size === response.data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(response.data.map(inv => inv.id)));
    }
  };

  const toggleSelectRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      
      let invoicesToExport: Invoice[] = [];
      
      if (selectedIds.size > 0 && response?.data) {
        invoicesToExport = response.data.filter((inv: Invoice) => selectedIds.has(inv.id));
      } else {
        const exportResponse = await invoiceService.exportInvoices(new AbortController().signal, fetchParams);
        invoicesToExport = exportResponse;
      }

      if (invoicesToExport.length > 0) {
        const csv = convertInvoicesToCsv(invoicesToExport);
        downloadCsv(`invoices-${new Date().toISOString().split('T')[0]}.csv`, csv);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkMarkPaid = async () => {
    if (selectedIds.size === 0) return;
    await executeBulkAction(Array.from(selectedIds), 'PAID', user);
    fetchInvoices(fetchParams); 
    setSelectedIds(new Set());
  };

  const canBulkUpdate = hasPermission(user, 'invoice:bulk_update');
  const canExport = hasPermission(user, 'invoice:export');

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={14} className={styles.sortIcon} /> : <ChevronDown size={14} className={styles.sortIcon} />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Invoices</h1>
        <div className={styles.actions}>
          {selectedIds.size > 0 && canBulkUpdate && (
            <Button variant="outline" size="sm" onClick={handleBulkMarkPaid} isLoading={bulkActionStatus === 'pending'}>
              <CheckCircle size={16} /> Mark Paid
            </Button>
          )}
          {canExport && (
            <Button variant="secondary" onClick={handleExport} isLoading={isExporting}>
              <Download size={16} /> Export CSV
            </Button>
          )}
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <Input 
            type="text" 
            placeholder="Search invoices or customers..." 
            className={styles.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        
        <select 
          className={styles.filterSelect} 
          value={statusFilter} 
          onChange={handleStatusChange}
          aria-label="Filter by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ width: 40 }}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={!!response?.data?.length && selectedIds.size === response.data.length}
                  ref={input => {
                    if (input) {
                      input.indeterminate = selectedIds.size > 0 && !!response?.data?.length && selectedIds.size < response.data.length;
                    }
                  }}
                  onChange={toggleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
              <th className={clsx(styles.th, styles.thSortable)} onClick={() => handleSort('invoiceNumber')}>
                Invoice Number {renderSortIcon('invoiceNumber')}
              </th>
              <th className={clsx(styles.th, styles.thSortable)} onClick={() => handleSort('customerName')}>
                Customer {renderSortIcon('customerName')}
              </th>
              <th className={clsx(styles.th, styles.thSortable)} onClick={() => handleSort('issueDate')}>
                Issue Date {renderSortIcon('issueDate')}
              </th>
              <th className={clsx(styles.th, styles.thSortable)} onClick={() => handleSort('total')}>
                Amount {renderSortIcon('total')}
              </th>
              <th className={clsx(styles.th, styles.thSortable)} onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {fetchStatus === 'pending' ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                  <Spinner size={32} />
                </td>
              </tr>
            ) : fetchStatus === 'error' ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-danger-700)' }}>
                  Failed to load invoices.
                </td>
              </tr>
            ) : response?.data?.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className={styles.emptyState}>
                    <Filter size={48} style={{ opacity: 0.2, marginBottom: 'var(--space-4)' }} />
                    <p>No invoices found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              response?.data?.map(invoice => (
                <tr 
                  key={invoice.id} 
                  className={clsx(styles.tr, styles.trClickable, selectedIds.has(invoice.id) && styles.trSelected)}
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                >
                  <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={selectedIds.has(invoice.id)}
                      onChange={(e) => toggleSelectRow(e as any, invoice.id)}
                      aria-label={`Select invoice ${invoice.invoiceNumber}`}
                    />
                  </td>
                  <td className={styles.td}>{invoice.invoiceNumber}</td>
                  <td className={styles.td}>
                    <div>{invoice.customer.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{invoice.customer.email}</div>
                  </td>
                  <td className={styles.td}>
                    <div>{formatDate(invoice.issueDate)}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Due: {formatDate(invoice.dueDate)}</div>
                  </td>
                  <td className={styles.td}>{formatCurrency(invoice.total)}</td>
                  <td className={styles.td}>
                    <Badge status={invoice.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {response?.pagination && response.pagination.totalPages > 0 && (
          <div className={styles.pagination}>
            <div className={styles.pageInfo}>
              Showing {(page - 1) * response.pagination.limit + 1} to {Math.min(page * response.pagination.limit, response.pagination.totalItems)} of {response.pagination.totalItems} entries
              {selectedIds.size > 0 && ` (${selectedIds.size} selected)`}
            </div>
            <div className={styles.pageControls}>
              <Button 
                variant="outline" 
                size="icon" 
                disabled={page === 1} 
                onClick={() => handlePageChange(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </Button>
              <span style={{ fontSize: 'var(--font-size-sm)', padding: '0 var(--space-2)' }}>
                Page {page} of {response.pagination.totalPages}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                disabled={page === response.pagination.totalPages} 
                onClick={() => handlePageChange(page + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
