import React from 'react';
import clsx from 'clsx';
import styles from './ui.module.css';
import { getStatusColorClass, formatStatusLabel } from '../../domain/utils';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  const colorClass = getStatusColorClass(status);
  return (
    <span className={clsx(styles.badge, styles[colorClass], className)}>
      {formatStatusLabel(status)}
    </span>
  );
};
