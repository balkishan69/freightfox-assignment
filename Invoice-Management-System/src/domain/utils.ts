

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return dateFormatter.format(date);
  } catch {
    return '-';
  }
}

export function getStatusColorClass(status: string): string {
  switch (status) {
    case 'DRAFT': return 'status-draft';
    case 'PENDING': return 'status-pending';
    case 'PAID': return 'status-paid';
    case 'PARTIALLY_PAID': return 'status-partially-paid';
    case 'OVERDUE': return 'status-overdue';
    case 'CANCELLED': return 'status-cancelled';
    default: return 'status-draft';
  }
}

export function formatStatusLabel(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}
