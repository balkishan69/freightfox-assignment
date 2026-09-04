import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import styles from './ui.module.css';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 24, className }) => {
  return (
    <Loader2 
      size={size} 
      className={clsx(styles.spinner, className)} 
    />
  );
};
