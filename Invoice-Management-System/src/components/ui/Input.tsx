import React from 'react';
import clsx from 'clsx';
import styles from './ui.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(styles.input, className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
