import React from 'react';
import { useAsync } from '../../hooks/useAsync';
import { invoiceService } from '../../services/invoiceService';
import { Card, Spinner, Badge } from '../../components/ui';
import { formatCurrency } from '../../domain/utils';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import styles from './dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { data: metrics, status, error } = useAsync(invoiceService.getDashboardMetrics, true);

  if (status === 'pending') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ color: 'var(--color-danger-700)', padding: 'var(--space-4)' }}>
        Error loading dashboard: {error?.message}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      
      <div className={styles.metricsGrid}>
        <Card className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.primary}`}>
            <FileText size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Invoices</span>
            <span className={styles.metricValue}>{metrics.totalInvoices}</span>
          </div>
        </Card>

        <Card className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.success}`}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Paid Amount</span>
            <span className={styles.metricValue}>{formatCurrency(metrics.paidAmount)}</span>
          </div>
        </Card>

        <Card className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.warning}`}>
            <Clock size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Pending Amount</span>
            <span className={styles.metricValue}>{formatCurrency(metrics.outstandingAmount)}</span>
          </div>
        </Card>

        <Card className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.danger}`}>
            <AlertCircle size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Overdue Amount</span>
            <span className={styles.metricValue}>{formatCurrency(metrics.overdueAmount)}</span>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h2>Recent Invoices</h2>
        <div className={styles.recentList}>
          {metrics.recentInvoices.map(invoice => (
            <div key={invoice.id} className={styles.recentItem}>
              <div className={styles.recentLeft}>
                <span className={styles.recentInvNumber}>{invoice.invoiceNumber}</span>
                <span className={styles.recentCustomer}>{invoice.customer.name}</span>
              </div>
              <div className={styles.recentRight}>
                <span className={styles.recentAmount}>{formatCurrency(invoice.total)}</span>
                <Badge status={invoice.status} />
              </div>
            </div>
          ))}
          {metrics.recentInvoices.length === 0 && (
            <div style={{ color: 'var(--text-muted)' }}>No recent invoices.</div>
          )}
        </div>
      </div>
    </div>
  );
};
