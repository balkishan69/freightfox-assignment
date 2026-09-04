import React from 'react';
import clsx from 'clsx';
import styles from './ui.module.css';
import { Spinner } from './Spinner.tsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'md' | 'sm' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          styles.button,
          styles[`btn-${variant}`],
          size !== 'md' && styles[`btn-${size}`],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner size={14} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
