import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm hover:shadow',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90 shadow-sm hover:shadow',
    outline: 'border-2 border-primary text-primary hover:bg-primary-light',
    ghost: 'text-primary hover:bg-primary-light',
    success: 'bg-success text-success-foreground hover:opacity-90 shadow-sm',
    danger: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-[8px]',
    md: 'px-6 py-3 text-base rounded-[12px]',
    lg: 'px-8 py-4 text-lg rounded-[12px]'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
