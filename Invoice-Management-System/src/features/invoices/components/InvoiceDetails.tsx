import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Printer } from 'lucide-react';
import { invoiceService } from '../../../services/invoiceService';
import { useAsync } from '../../../hooks/useAsync';
import { useAuth } from '../../../hooks/useAuth';
import { getAvailableNextStatuses } from '../../../domain/status';
import { hasPermission } from '../../../domain/rbac';
import { formatCurrency, formatDate } from '../../../domain/utils';
import { Card, Badge, Button, Spinner } from '../../../components/ui';
import styles from './invoiceDetails.module.css';
import type { InvoiceStatus } from '../../../domain/types';

export const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { execute: fetchInvoice, data: invoice, status, error } = useAsync(invoiceService.getInvoiceById);
  const { execute: updateStatus, status: updateReqStatus } = useAsync(invoiceService.updateStatus);

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id, fetchInvoice]);

  if (status === 'pending') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (status === 'error' || !invoice) {
    return (
      <div className={styles.container}>
        <Link to="/invoices" className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Invoices
        </Link>
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <h2>Invoice Not Found</h2>
          <p>{error?.message || "The invoice you are looking for does not exist or you don't have permission to view it."}</p>
          <Button onClick={() => navigate('/invoices')} style={{ marginTop: 'var(--space-4)' }}>
            Return to List
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus: InvoiceStatus) => {
    if (!id) return;
    try {
      await updateStatus(id, newStatus, user);
      fetchInvoice(id); 
    } catch (err) {
      
      console.error(err);
    }
  };

  const availableTransitions = getAvailableNextStatuses(invoice.status, user);
  const canUpdate = hasPermission(user, 'invoice:update');

  return (
    <div className={styles.container}>
      <div>
        <Link to="/invoices" className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Invoices
        </Link>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>{invoice.invoiceNumber}</h1>
            <Badge status={invoice.status} />
          </div>
          
          <div className={styles.actions}>
            {canUpdate && availableTransitions.includes('PAID') && (
              <Button 
                onClick={() => handleStatusUpdate('PAID')} 
                isLoading={updateReqStatus === 'pending'}
                variant="primary"
              >
                <CheckCircle size={16} /> Mark as Paid
              </Button>
            )}
            {canUpdate && availableTransitions.includes('CANCELLED') && (
              <Button 
                onClick={() => handleStatusUpdate('CANCELLED')} 
                isLoading={updateReqStatus === 'pending'}
                variant="danger"
              >
                <XCircle size={16} /> Cancel Invoice
              </Button>
            )}
            <Button variant="outline" onClick={() => window.print()}>
              <Printer size={16} /> Print
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <Card className={styles.section}>
          <h3 className={styles.sectionTitle}>Customer Details</h3>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Name</span>
            <span className={styles.infoValue}>{invoice.customer.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{invoice.customer.email}</span>
          </div>
          {invoice.customer.address && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Address</span>
              <span className={styles.infoValue}>{invoice.customer.address}</span>
            </div>
          )}
          {invoice.customer.taxId && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tax ID</span>
              <span className={styles.infoValue}>{invoice.customer.taxId}</span>
            </div>
          )}
        </Card>

        <Card className={styles.section}>
          <h3 className={styles.sectionTitle}>Invoice Details</h3>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Issue Date</span>
            <span className={styles.infoValue}>{formatDate(invoice.issueDate)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Due Date</span>
            <span className={styles.infoValue}>{formatDate(invoice.dueDate)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Amount Due</span>
            <span className={styles.infoValue}>{formatCurrency(invoice.total - invoice.paidAmount)}</span>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className={styles.sectionTitle} style={{ marginBottom: 'var(--space-4)' }}>Line Items</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Description</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Qty</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Unit Price</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Tax</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id}>
                  <td className={styles.td}>{item.description}</td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>{item.quantity}</td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>{Math.round(item.taxRate * 100)}%</td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    {formatCurrency(item.quantity * item.unitPrice * (1 + item.taxRate))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span className={styles.infoLabel}>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.infoLabel}>Tax</span>
            <span>{formatCurrency(invoice.taxTotal)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.infoLabel}>Amount Paid</span>
            <span style={{ color: 'var(--color-success-700)' }}>-{formatCurrency(invoice.paidAmount)}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grand}`}>
            <span>Balance Due</span>
            <span>{formatCurrency(invoice.total - invoice.paidAmount)}</span>
          </div>
        </div>
      </Card>
      
      {invoice.notes && (
        <Card className={styles.section}>
          <h3 className={styles.sectionTitle}>Notes</h3>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>{invoice.notes}</p>
        </Card>
      )}
    </div>
  );
};
